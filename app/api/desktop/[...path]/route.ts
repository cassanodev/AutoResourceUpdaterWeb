import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Rule = {
  method: "GET" | "POST";
  authentication: "none" | "bearer";
};

const routes = new Map<string, Rule>([
  ["health", { method: "GET", authentication: "none" }],
  ["api/auth/discord/login", { method: "GET", authentication: "none" }],
  ["api/auth/callback/discord", { method: "GET", authentication: "none" }],
  ["api/auth/me", { method: "GET", authentication: "bearer" }],
  ["api/access/status", { method: "GET", authentication: "bearer" }],
  ["api/resources/getDefaultRepositories", { method: "POST", authentication: "bearer" }],
  ["api/resources/getResourcesLastVersion", { method: "POST", authentication: "bearer" }],
  ["api/resources/prepareUpdate", { method: "POST", authentication: "bearer" }],
]);

function backendOrigin() {
  const configured = (
    process.env.DESKTOP_BACKEND_API_URL ?? process.env.BACKEND_API_URL
  )
    ?.trim()
    .replace(/\/$/, "");
  if (!configured) return null;

  let url: URL;
  try {
    url = new URL(configured);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && process.env.NODE_ENV === "production") {
    return null;
  }
  return url.origin;
}

function error(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const route = path.join("/");
  const rule = routes.get(route);

  if (!rule || request.method !== rule.method) {
    return error("Desktop API route not found", 404);
  }

  const authorization = request.headers.get("authorization");
  if (rule.authentication === "bearer" && !authorization?.startsWith("Bearer ")) {
    return error("Authentication required", 401);
  }

  if (route === "api/auth/discord/login") {
    const flowId = request.nextUrl.searchParams.get("flow_id") ?? "";
    if (!/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(flowId)) {
      return error("Invalid authentication flow", 400);
    }
  }

  const origin = backendOrigin();
  if (!origin) {
    console.error("[desktop-gateway] backend URL is missing or invalid");
    return error("The desktop service is not configured", 503);
  }

  const target = new URL(`/${route}`, origin);
  target.search = request.nextUrl.search;
  const headers = new Headers({ Accept: request.headers.get("accept") || "application/json" });
  if (authorization) headers.set("Authorization", authorization);
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  try {
    const upstream = await fetch(target, {
      method: rule.method,
      headers,
      body: rule.method === "POST" ? request.body : undefined,
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(
        route === "api/resources/prepareUpdate" ? 125_000 : 15_000,
      ),
      // Required by Node when forwarding a ReadableStream request body.
      duplex: rule.method === "POST" ? "half" : undefined,
    } as RequestInit & { duplex?: "half" });

    const responseHeaders = new Headers();
    const upstreamType = upstream.headers.get("content-type");
    if (upstreamType) responseHeaders.set("Content-Type", upstreamType);
    responseHeaders.set("Cache-Control", "no-store");

    const location = upstream.headers.get("location");
    if (location && upstream.status >= 300 && upstream.status < 400) {
      return NextResponse.redirect(new URL(location, target), upstream.status);
    }

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch (cause) {
    console.error("[desktop-gateway] upstream request failed", {
      route,
      message: cause instanceof Error ? cause.message : "Unknown error",
    });
    return error("The application service is temporarily unavailable", 502);
  }
}

export const GET = proxy;
export const POST = proxy;
