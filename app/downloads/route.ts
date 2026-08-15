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

  return NextResponse.redirect(installer, 307);
}
