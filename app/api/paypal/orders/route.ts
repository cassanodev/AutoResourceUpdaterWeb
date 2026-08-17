import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json(
    { error: "This payment option is no longer available" },
    { status: 410 },
  );
}
