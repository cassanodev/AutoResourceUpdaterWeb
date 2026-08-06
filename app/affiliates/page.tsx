import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AffiliateDashboard } from "./affiliate-dashboard";
import { SiteHeader } from "@/components/site-header";
export const metadata: Metadata = {
  title: "Affiliate Dashboard",
  description: "Track referrals, commissions, and withdrawals.",
  robots: { index: false, follow: false },
};
export default async function AffiliatesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/affiliates");
  return (
    <main className="min-h-screen bg-[#080b0e]">
      <div className="grid-bg pointer-events-none fixed inset-0 opacity-70" />
      <SiteHeader compact />
      <AffiliateDashboard />
    </main>
  );
}
