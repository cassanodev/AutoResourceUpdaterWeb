import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AccountDashboard } from "./subscription-dashboard";
import { SiteHeader } from "@/components/site-header";
import { getAccountData } from "@/lib/external-api";
export const metadata: Metadata = {
  title: "Subscription",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account");
  const account = await getAccountData(session.user.id, { username: session.user.name, avatarUrl: session.user.image });
  return (
    <main className="account-surface min-h-screen bg-[#0a0e12]">
      <SiteHeader compact />
      <AccountDashboard
        user={{
          name: session.user.name ?? "Discord user",
          image: session.user.image ?? undefined,
        }}
        account={account}
      />
    </main>
  );
}
