import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { DiscordLogin } from "@/components/discord-login";
import { SiteHeader } from "@/components/site-header";
export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in with Discord to manage your subscription and affiliate account.",
};
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  const destination = callbackUrl?.startsWith("/") ? callbackUrl : "/account";
  return (
    <main className="grid-bg min-h-screen bg-[#080b0e]">
      <SiteHeader compact />
      <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-[1240px] place-items-center px-5 pb-20">
        <div className="w-full max-w-[440px] rounded-2xl border border-white/[.08] bg-[#0d1217]/95 p-8 text-center shadow-2xl">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-amber-300/20 bg-amber-400/10">
            <ShieldCheck className="h-5 w-5 text-amber-300" />
          </div>
          <p className="mt-6 text-[9px] font-bold uppercase tracking-[.2em] text-amber-400">
            Secure account access
          </p>
          <h1 className="display mt-3 text-3xl font-bold tracking-[-.04em] text-white">
            Continue with Discord
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-[11px] leading-6 text-slate-500">
            Use the Discord account connected to your server community. We only
            request your basic identity.
          </p>
          <DiscordLogin callbackUrl={destination} className="mt-7 w-full" />
          <p className="mt-5 text-[9px] text-slate-700">
            By continuing, you agree to the service terms and privacy policy.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block text-[9px] text-slate-500 hover:text-white"
          >
            Back to homepage
          </Link>
        </div>
      </section>
    </main>
  );
}
