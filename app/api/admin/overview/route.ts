import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAdminOverview, isBackendAdmin } from "@/lib/external-api";
export async function GET() {
  const session = await auth();
  if (!session?.user?.id || !(await isBackendAdmin(session.user.id)))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    return NextResponse.json(await getAdminOverview(session.user.id));
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load administration",
      },
      { status: 400 },
    );
  }
}
