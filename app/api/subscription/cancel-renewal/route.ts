import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { cancelSubscriptionRenewal } from "@/lib/external-api";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  try { return NextResponse.json(await cancelSubscriptionRenewal(session.user.id)); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to cancel renewal" }, { status: 400 }); }
}
