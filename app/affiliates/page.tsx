import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AffiliateDashboard } from "./affiliate-dashboard";
import { SiteHeader } from "@/components/site-header";
import { getAffiliateData } from "@/lib/external-api";
import { AffiliateAccessDenied } from "./access-denied";
export const metadata: Metadata = {
  title: "Affiliate Dashboard",
  description: "Track referrals, commissions, and withdrawals.",
  robots: { index: false, follow: false },
};
export default async function AffiliatesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/affiliates");
  let result;
  try {
    result = await getAffiliateData(session.user.id);
  } catch (error) {
    result =
      error instanceof Error && error.message === "API_NOT_CONFIGURED"
        ? null
        : undefined;
  }
  return (
    <main className="affiliate-surface ocean-home min-h-screen bg-[#040b18]">
      <SiteHeader />
      {!result || !result.allowed ? (
        <AffiliateAccessDenied configured={result?.allowed === false} />
      ) : (
        <AffiliateDashboard data={result.data} />
      )}
    </main>
  );
}
