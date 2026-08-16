import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  const configured = process.env.INSTALLER_DOWNLOAD_URL?.trim();
  if (!configured) {
    return NextResponse.json(
      { error: "The Windows installer is being prepared. Please try again shortly." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  const installer = new URL(configured);
  if (installer.protocol !== "https:") {
    return NextResponse.json(
      { error: "The installer download is not configured securely." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  // A versioned GitHub asset URL is normalized to the latest published release,
  // so Vercel does not need an environment-variable change for every version.
  if (installer.hostname === "github.com") {
    const match = installer.pathname.match(
      /^\/([^/]+)\/([^/]+)\/releases\/download\/[^/]+\/([^/]+)$/,
    );
    if (match) {
      const [, owner, repository, asset] = match;
      installer.pathname = `/${owner}/${repository}/releases/latest/download/${asset}`;
    }
  }

  return NextResponse.redirect(installer, 307);
}
