import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
import { DiscordLogin } from "@/components/discord-login";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in with Discord to manage your subscription and affiliate account.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const { callbackUrl } = await searchParams;
  const destination = callbackUrl?.startsWith("/") ? callbackUrl : "/account";
  return (
    <main className="login-surface min-h-screen">
      <SiteHeader />
      <section className="mx-auto grid min-h-[calc(100svh-76px)] max-w-[1080px] items-center gap-12 px-5 pb-20 pt-10 lg:grid-cols-[1fr_440px] lg:px-8">
        <div className="page-enter hidden lg:block">
          <p className="ocean-kicker">One identity, every workspace</p>
          <h1 className="display mt-5 max-w-xl text-5xl font-semibold leading-[1.02] tracking-[-.055em] text-white">Your subscription and referrals stay tied to Discord.</h1>
          <p className="mt-5 max-w-lg text-[13px] leading-7 text-slate-400">Continue with the account you use for your server community. We request only the identity required to recognize your access.</p>
          <div className="mt-8 space-y-3">
            {["No separate password to remember", "Subscription status follows your account", "Affiliate access stays private"].map(item=><p key={item} className="flex items-center gap-3 text-[10px] text-slate-400"><span className="grid h-6 w-6 place-items-center rounded-lg bg-teal-300/[.07] shadow-[0_0_0_1px_rgba(115,215,205,.13)]"><Check strokeWidth={2} className="h-3.5 w-3.5 text-teal-300" /></span>{item}</p>)}
          </div>
        </div>

        <div className="page-enter page-enter-delay-1 premium-panel w-full rounded-[26px] p-2">
          <div className="rounded-[18px] bg-[#061022]/80 p-7 text-center sm:p-8">
            <div className="premium-icon mx-auto h-12 w-12 rounded-[14px]"><ShieldCheck strokeWidth={1.5} className="h-5 w-5" /></div>
            <p className="ocean-kicker mt-6 text-[8px]">Secure account access</p>
            <h2 className="display mt-3 text-3xl font-semibold tracking-[-.045em] text-white">Continue with Discord</h2>
            <p className="mx-auto mt-3 max-w-sm text-[11px] leading-6 text-slate-500">PayPal details and server files are never shared with Discord.</p>
            <DiscordLogin callbackUrl={destination} className="mt-7 w-full" />
            <p className="mt-5 text-[9px] leading-5 text-slate-600">By continuing, you agree to the <Link href="/terms" className="text-slate-400 underline decoration-white/15 underline-offset-4 transition-colors duration-150 hover:text-white">Terms &amp; Conditions</Link>.</p>
            <Link href="/" className="mt-7 inline-flex items-center gap-2 text-[9px] font-medium text-slate-500 transition-colors duration-150 hover:text-white"><ArrowLeft strokeWidth={1.5} className="h-3.5 w-3.5" />Back to homepage</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
