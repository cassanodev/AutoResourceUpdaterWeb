import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  Download,
  Gamepad2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { DiscordIcon } from "@/components/brand";
import { ProductPreview } from "@/components/product-preview";
import { SiteHeader } from "@/components/site-header";
import { PricingSection } from "@/components/pricing-section";
import { auth } from "@/auth";
import { getAccountData } from "@/lib/external-api";
import { EfficiencyComparison } from "@/components/efficiency-comparison";
import { FaqSection } from "@/components/faq-section";
import { HeroCursorTrail } from "@/components/hero-cursor-trail";
import { Analytics } from "@vercel/analytics/next";
import { WorkflowSteps } from "@/components/workflow-steps";

const installer = "/downloads";
const discord =
  process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/your-server";

export default async function Home() {
  const session = await auth();
  const account = session?.user
    ? await getAccountData(session.user.id, {
        username: session.user.name,
        avatarUrl: session.user.image,
      }).catch(() => null)
    : null;
  const hasActivePlan = account?.subscription?.status === "active";
  const trialAvailable = Boolean(
    session?.user && !hasActivePlan && !account?.trial,
  );
  return (
    <>
      <main className="ocean-home marketing-surface min-h-screen overflow-hidden">
        <section className="ocean-hero relative min-h-screen">
          <div
            className="ocean-hero-light pointer-events-none absolute inset-0"
            aria-hidden="true"
          />
          <HeroCursorTrail />
          <div className="noise pointer-events-none absolute inset-0 opacity-[.018]" />
          <SiteHeader />
          <div className="relative z-10 mx-auto grid max-w-[1240px] items-center gap-12 px-5 pb-20 pt-10 lg:min-h-[calc(100svh-80px)] lg:grid-cols-[.88fr_1.12fr] lg:px-8 lg:py-10">
            <div className="rise">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/15 bg-blue-100/[.035] px-3 py-2 text-[8px] font-semibold uppercase tracking-[.18em] text-blue-100/75 shadow-[inset_0_1px_rgba(255,255,255,.05)] backdrop-blur-xl">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-300 shadow-[0_0_12px_rgba(94,234,212,.9)]" />
                FiveM updates, under control
              </div>
              <h1 className="display mt-7 text-balance text-[48px] font-bold leading-[.98] tracking-[-.055em] text-white sm:text-[62px] lg:text-[68px]">
                Update safely.
                <br />
                <span className="ocean-title-shine">Stay in control.</span>
              </h1>
              <p className="mt-6 max-w-[520px] text-[12px] leading-7 text-slate-400">
                Review what changed, preserve your configuration and decide what
                reaches your server—with a Restore Point ready if you need it.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={installer}
                  className="ocean-primary group flex h-12 items-center gap-3 rounded-xl px-5 text-[11px] font-bold transition hover:-translate-y-0.5"
                >
                  <Download className="h-4 w-4" />
                  Download for Windows
                  <ArrowDownToLine className="ml-2 h-3.5 w-3.5 opacity-50" />
                </a>
                <Link
                  href="#features"
                  className="ocean-secondary flex h-12 items-center gap-2 rounded-xl px-5 text-[11px] font-semibold text-slate-200 transition hover:-translate-y-0.5"
                >
                  See how it works
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[9px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-teal-300" />
                  Restore Points before every update
                </span>
                <span className="flex items-center gap-1.5">
                  <Gamepad2 className="h-3.5 w-3.5 text-cyan-200" />
                  Ready for the next generation
                </span>
              </div>
            </div>
            <div className="rise relative mx-auto w-full max-w-[680px] [animation-delay:120ms]">
              <div className="ocean-preview relative rounded-[22px] border border-blue-100/10 bg-[#071329]/75 p-2 shadow-[0_35px_90px_rgba(0,4,15,.48)] backdrop-blur-xl">
                <ProductPreview />
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="relative px-5 py-28 lg:px-8">
          <div className="relative mx-auto max-w-[1240px]">
            <div className="mx-auto max-w-3xl text-center">
              <div>
                <p className="ocean-kicker">Workflow</p>
                <h2 className="display mt-5 text-balance text-4xl font-bold tracking-[-.045em] text-white sm:text-5xl">
                  One clear path from folder to finished update.
                </h2>
              </div>
              <p className="mx-auto mt-5 max-w-2xl text-[12px] leading-7 text-slate-400">
                A consistent, visible process. Each step shows what you provide,
                what the app prepares and where you remain in control.
              </p>
            </div>
            <WorkflowSteps />
          </div>
        </section>
        <section id="why" className="relative px-5 py-28 lg:px-8">
          <div className="ocean-glass mx-auto max-w-[1240px] rounded-[30px] p-6 sm:p-10 lg:p-14">
            <div className="mx-auto max-w-3xl text-center">
              <p className="ocean-kicker">Why use it?</p>
              <h2 className="display mt-5 text-balance text-4xl font-bold tracking-[-.045em] text-white sm:text-5xl">
                Spend your attention on the server, not repetitive file checks.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-[12px] leading-7 text-slate-400">
                Ten files can turn into thirty minutes of careful manual work.
                Let the system prepare them together, then spend your time on
                the decisions that actually matter.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-2">
                {[
                  "See every change",
                  "Keep your config",
                  "Restore anytime",
                ].map((item) => (
                  <span key={item} className="ocean-chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="mx-auto mt-10 max-w-4xl">
              <EfficiencyComparison />
            </div>
          </div>
        </section>
        <PricingSection
          authenticated={Boolean(session?.user)}
          hasActivePlan={hasActivePlan}
          trialAvailable={!session?.user || trialAvailable}
        />
        <section id="referrals" className="relative px-5 py-28 lg:px-8">
          <div className="ocean-glass relative mx-auto grid max-w-[1240px] gap-12 overflow-hidden rounded-[30px] p-7 sm:p-10 lg:grid-cols-[1fr_.9fr] lg:p-14">
            <div>
              <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl border border-cyan-200/15 bg-cyan-200/[.06]">
                <Users className="h-5 w-5 text-cyan-200" />
              </div>
              <p className="ocean-kicker">Affiliate program</p>
              <h2 className="display mt-4 max-w-xl text-4xl font-bold tracking-[-.045em] text-white">
                Recommend a tool you trust.
                <br />
                <span className="text-slate-500">
                  Get paid when people join.
                </span>
              </h2>
              <p className="mt-5 max-w-lg text-[13px] leading-6 text-slate-500">
                Share your custom eight-character code with other server owners
                and developers. Track every referral from your own dashboard.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={discord}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 items-center gap-2 rounded-lg bg-[#5865f2] px-4 text-[10px] font-semibold text-white hover:bg-[#6772f5]"
                >
                  <DiscordIcon className="h-4 w-4" />
                  Apply through Discord
                </a>
                <Link
                  href="/affiliates"
                  className="ocean-secondary flex h-11 items-center gap-2 rounded-xl px-4 text-[10px] font-semibold text-slate-200"
                >
                  View affiliate dashboard
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
            <div className="grid content-center gap-3 sm:grid-cols-2">
              <Reward
                amount="10%"
                label="Paid subscriptions"
                note="For every qualified first purchase"
              />
              <Reward
                amount="10%"
                label="Every plan length"
                note="Weekly, monthly, six-month and annual"
              />
              <div className="sm:col-span-2 flex gap-3 rounded-2xl border border-white/[.07] bg-white/[.025] p-4 backdrop-blur-xl">
                <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <p className="text-[10px] leading-5 text-slate-500">
                  Commissions remain pending through the refund window, then
                  move automatically into your available balance. The commission
                  is only paid for the first purchase of each referred account,
                  and does not apply to free trials or renewals.
                </p>
              </div>
            </div>
          </div>
        </section>
        <FaqSection />
        <footer className="mx-auto flex max-w-[1240px] flex-col gap-4 px-5 py-9 text-[9px] text-slate-700 sm:flex-row sm:items-center lg:px-8">
          <span>© 2026 Auto Resource Updater.</span>
          <div className="flex flex-wrap gap-4 sm:ml-auto">
            <Link href="/#faq" className="hover:text-slate-400">
              FAQ
            </Link>
            <Link href="/terms" className="hover:text-slate-400">
              Terms &amp; Conditions
            </Link>
            <span>Not affiliated with Rockstar Games.</span>
          </div>
        </footer>
      </main>
      <Analytics />
    </>
  );
}
function Reward({
  amount,
  label,
  note,
}: {
  amount: string;
  label: string;
  note: string;
}) {
  return (
    <div className="rounded-xl border border-white/[.08] bg-[#10151a] p-6">
      <p className="display text-4xl font-bold tracking-[-.05em] text-emerald-300">
        {amount}
      </p>
      <p className="mt-3 text-[11px] font-semibold text-white">{label}</p>
      <p className="mt-1 text-[9px] leading-4 text-slate-600">{note}</p>
      <div className="mt-5 flex items-center gap-1.5 text-[8px] text-emerald-400">
        <Check className="h-3 w-3" />
        Paid after qualification
      </div>
    </div>
  );
}
