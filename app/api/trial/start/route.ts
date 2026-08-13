import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { startTrial } from "@/lib/external-api";
export async function POST() {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  try {
    return NextResponse.json(await startTrial(session.user.id));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to start free trial";
    return NextResponse.json(
      {
        error:
          message === "API_NOT_CONFIGURED"
            ? "Trial service is not configured"
            : message,
      },
      { status: message === "API_NOT_CONFIGURED" ? 503 : 400 },
    );
  }
}
