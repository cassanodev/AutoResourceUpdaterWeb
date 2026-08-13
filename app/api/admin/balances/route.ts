import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { adjustAdminBalance } from "@/lib/external-api";
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    return NextResponse.json(
      await adjustAdminBalance({
        ...(await request.json()),
        adminDiscordId: session.user.id,
      }),
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to adjust balance",
      },
      { status: 400 },
    );
  }
}
