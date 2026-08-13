import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { requestAffiliateWithdrawal } from "@/lib/external-api";
export async function POST(request:Request) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  try {
    const body=await request.json();
    return NextResponse.json(await requestAffiliateWithdrawal(session.user.id,{amount:Number(body.amount),method:body.method,referenceType:body.referenceType,reference:body.reference}));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to request withdrawal";
    return NextResponse.json(
      {
        error:
          message === "API_NOT_CONFIGURED"
            ? "Withdrawal service is not configured"
            : message,
      },
      { status: message === "API_NOT_CONFIGURED" ? 503 : 400 },
    );
  }
}
