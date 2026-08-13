import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { discountedTotal, getPlan, validateDiscount } from "@/lib/billing";
import { createSubscription, getSubscriptionPlan } from "@/lib/paypal";
import { getAccountData, getPayPalPlan, registerPayPalCheckout } from "@/lib/external-api";

export async function POST(request: Request) {
  const session=await auth(); if(!session?.user)return NextResponse.json({error:"Authentication required"},{status:401});
  try { const account=await getAccountData(session.user.id,{username:session.user.name,email:session.user.email,avatarUrl:session.user.image}); if(account.subscription?.status==="active")return NextResponse.json({error:"Your account already has active access"},{status:409});
    const body=await request.json() as {plan?:unknown;discountCode?:unknown;termsAccepted?:unknown}; if(body.termsAccepted!==true)return NextResponse.json({error:"You must accept the Terms & Conditions"},{status:400}); const plan=getPlan(body.plan); if(!plan)return NextResponse.json({error:"Invalid plan"},{status:400}); let percentage=0,code="";
    if(typeof body.discountCode==="string"&&body.discountCode.trim()){const discount=await validateDiscount(body.discountCode,plan.id,session.user.id);if(!discount.valid)return NextResponse.json({error:discount.error||"Discount or referral code is no longer valid"},{status:400});percentage=discount.discountPercentage;code=discount.code;}
    const amount=discountedTotal(plan.price,percentage);if(amount<=0)return NextResponse.json({error:"This discount cannot be used for a PayPal subscription"},{status:400});
    const catalog=await getPayPalPlan(plan.id);const paypalPlan=await getSubscriptionPlan(catalog.id);const subscription=await createSubscription({planId:paypalPlan.id,amount,regularCycleSequence:paypalPlan.regularCycleSequence,baseAmount:paypalPlan.baseAmount,userId:session.user.id,discountCode:code||undefined});
    await registerPayPalCheckout({discordId:session.user.id,discordUsername:session.user.name,discordEmail:session.user.email,externalId:subscription.id,kind:"subscription",plan:plan.id,amount,termsAccepted:true,termsVersion:"2026-08-11",discountCode:code||undefined,discountPercentage:percentage});
    return NextResponse.json({id:subscription.id,amount:amount.toFixed(2),discountCode:code||null,discountPercentage:percentage});
  } catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Unable to create subscription"},{status:502});}
}
