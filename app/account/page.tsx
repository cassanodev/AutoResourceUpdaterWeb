import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AccountDashboard } from "./subscription-dashboard";
import { SiteHeader } from "@/components/site-header";
export const metadata: Metadata = {
  title: "Subscription",
  robots: { index: false, follow: false },
};
export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account");
  return (
    <main className="grid-bg min-h-screen bg-[#080b0e]">
      <SiteHeader compact />
      <AccountDashboard
        user={{
          name: session.user.name ?? "Discord user",
          image: session.user.image ?? undefined,
        }}
      />
    </main>
  );
}
