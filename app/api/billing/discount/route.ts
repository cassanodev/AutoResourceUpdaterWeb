import { NextResponse } from "next/server";
import { getPlan, validateDiscount } from "@/lib/billing";
import { auth } from "@/auth";
export async function POST(request: Request) {
  const session=await auth();
  if(!session?.user?.id)return NextResponse.json({error:"Sign in with Discord before applying a code"},{status:401});
  try {
    const body = await request.json();
    const plan = getPlan(body.plan);
    if (!plan || typeof body.code !== "string")
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    return NextResponse.json(await validateDiscount(body.code, plan.id,session.user.id));
  } catch {
    return NextResponse.json(
      { error: "Discount service is unavailable" },
      { status: 503 },
    );
  }
}
