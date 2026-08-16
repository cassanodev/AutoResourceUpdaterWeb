import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { setAdminUserSubscription } from "@/lib/external-api";
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try { return NextResponse.json(await setAdminUserSubscription({ ...(await request.json()), adminDiscordId: session.user.id })); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update subscription" }, { status: 400 }); }
}
