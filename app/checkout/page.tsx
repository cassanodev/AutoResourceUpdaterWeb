import type { Metadata } from "next";
import { auth } from "@/auth";
import { getPlan } from "@/lib/billing";
import { SiteHeader } from "@/components/site-header";
import { Checkout } from "./checkout";
import { getAccountData } from "@/lib/external-api";
export const metadata: Metadata = {
  title: "Review order",
  robots: { index: false, follow: false },
};
export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const query = await searchParams;
  const plan = getPlan(query.plan);
  const session = await auth();
  const account = session?.user ? await getAccountData(session.user.id).catch(() => null) : null;
  const hasActivePlan = account?.subscription?.status === "active";
  return (
    <main className="checkout-surface min-h-screen bg-[#0a0e12]">
      <SiteHeader />
      {plan && !hasActivePlan ? (
        <Checkout
          plan={plan}
          authenticated={Boolean(session?.user)}
          paypalClientId={process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ""}
        />
      ) : (
        <div className="mx-auto max-w-xl px-5 py-24 text-center">
          <h1 className="text-2xl font-semibold text-white">
            {hasActivePlan ? "Your plan is already active" : "Choose a valid plan"}
          </h1>
          <a
            href={hasActivePlan ? "/account" : "/#pricing"}
            className="mt-6 inline-block text-sm text-blue-200"
          >
            {hasActivePlan ? "Open my account" : "Return to pricing"}
          </a>
        </div>
      )}
    </main>
  );
}
