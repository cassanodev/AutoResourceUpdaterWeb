import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowRight,
  Check,
  Clock3,
  Download,
  Gamepad2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Analytics } from "@vercel/analytics/next";
import { auth } from "@/auth";
import { DiscordIcon } from "@/components/brand";
import { EfficiencyComparison } from "@/components/efficiency-comparison";
import { FaqSection } from "@/components/faq-section";
import { HeroCursorTrail } from "@/components/hero-cursor-trail";
import { PricingSection } from "@/components/pricing-section";
import { ProductPreview } from "@/components/product-preview";
import { SiteHeader } from "@/components/site-header";
import { WorkflowSteps } from "@/components/workflow-steps";
import { getAccountData } from "@/lib/external-api";

const installer = "/downloads";
const discord = process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/your-server";

export default async function Home() {
  const session = await auth();
  const account = session?.user
    ? await getAccountData(session.user.id, {
        username: session.user.name,
        avatarUrl: session.user.image,
      }).catch(() => null)
    : null;
  const hasActivePlan = account?.subscription?.status === "active";
  const trialAvailable = Boolean(session?.user && !hasActivePlan && !account?.trial);

  return (
    <>
      <main className="ocean-home marketing-surface min-h-screen overflow-hidden">
        <section className="ocean-hero relative min-h-[100svh]">
          <div className="ocean-hero-light pointer-events-none absolute inset-0" aria-hidden="true" />
          <HeroCursorTrail />
          <SiteHeader />

          <div className="relative z-10 mx-auto grid max-w-[1280px] items-center gap-14 px-5 pb-20 pt-12 lg:min-h-[calc(100svh-76px)] lg:grid-cols-[.82fr_1.18fr] lg:px-8 lg:py-12">
            <div>
              <div className="page-enter inline-flex items-center gap-2.5 rounded-full bg-blue-100/[.035] px-3 py-2 text-[9px] font-semibold uppercase tracking-[.17em] text-blue-100/75 shadow-[0_0_0_1px_rgba(190,210,255,.11),inset_0_1px_rgba(255,255,255,.045)]">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-300 shadow-[0_0_12px_rgba(94,234,212,.8)]" />
                FiveM updates, without the guesswork
              </div>

              <div className="page-enter page-enter-delay-1">
                <h1 className="display mt-7 text-balance text-[50px] font-semibold leading-[.96] tracking-[-.06em] text-white sm:text-[64px] lg:text-[72px]">
                  Change the resource.
                  <br />
                  <span className="ocean-title-shine">Keep what matters.</span>
                </h1>
                <p className="mt-6 max-w-[535px] text-[14px] leading-7 text-slate-400">
                  A focused update workspace that finds the differences, preserves your configuration and gives you a clear way back before anything touches your server.
                </p>
              </div>

              <div className="page-enter page-enter-delay-2">
                <div className="mt-8 flex flex-wrap gap-3">
                  <a href={installer} className="ocean-primary group flex h-12 items-center gap-2.5 rounded-xl ps-5 pe-[18px] text-[11px] font-bold">
                    <Download strokeWidth={2} className="h-4 w-4" />
                    Download for Windows
                    <ArrowDownToLine strokeWidth={2} className="ml-1 h-3.5 w-3.5 opacity-50 transition-transform duration-150 ease-out group-hover:translate-y-0.5" />
                  </a>
                  <Link href="#features" className="ocean-secondary flex h-12 items-center gap-2 rounded-xl px-5 text-[11px] font-semibold text-slate-200">
                    Explore the workflow
                    <ArrowRight strokeWidth={1.5} className="h-4 w-4" />
                  </Link>
                </div>
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1.5"><ShieldCheck strokeWidth={1.5} className="h-4 w-4 text-teal-300" />Automatic Restore Points</span>
                  <span className="flex items-center gap-1.5"><Gamepad2 strokeWidth={1.5} className="h-4 w-4 text-blue-200" />Built for modern FiveM stacks</span>
                </div>
              </div>
            </div>

            <div className="page-enter page-enter-delay-2 relative mx-auto w-full max-w-[720px]">
              <div className="mb-3 flex items-center justify-between px-1 text-[8px] font-semibold uppercase tracking-[.16em] text-slate-600">
                <span>Live workflow preview</span>
                <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-teal-300" />Local review mode</span>
              </div>
              <div className="ocean-preview premium-panel relative rounded-[26px] p-2.5">
                <ProductPreview />
              </div>
              <div className="mx-auto mt-4 grid max-w-[560px] grid-cols-3 gap-px overflow-hidden rounded-xl bg-white/[.065] text-center shadow-[0_0_0_1px_rgba(255,255,255,.045)]">
                {[["01","Inspect"],["02","Decide"],["03","Restore"]].map(([number,label])=><div key={number} className="bg-[#061022]/90 px-3 py-2.5"><span className="font-mono text-[8px] text-blue-200/55">{number}</span><span className="ml-2 text-[9px] font-medium text-slate-400">{label}</span></div>)}
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider mx-auto max-w-[1180px]" />

        <section id="features" className="relative px-5 py-28 lg:px-8 lg:py-36">
          <div className="relative mx-auto max-w-[1180px]">
            <div className="grid gap-8 lg:grid-cols-[.55fr_1fr] lg:items-end">
              <div><p className="ocean-kicker">Workflow</p><h2 className="display mt-5 text-balance text-4xl font-semibold tracking-[-.05em] text-white sm:text-5xl">Five deliberate steps. No black box.</h2></div>
              <p className="max-w-xl text-[14px] leading-7 text-slate-400 lg:justify-self-end">You provide the source. The app prepares a reviewable result. You decide what gets applied—and every applied update leaves a Restore Point behind.</p>
            </div>
            <WorkflowSteps />
          </div>
        </section>

        <section id="why" className="relative px-5 py-24 lg:px-8 lg:py-32">
          <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-center lg:gap-16">
            <div>
              <p className="ocean-kicker">Time, returned</p>
              <h2 className="display mt-5 text-balance text-4xl font-semibold tracking-[-.05em] text-white sm:text-5xl">Ten files should not cost half an hour.</h2>
              <p className="mt-5 max-w-md text-[14px] leading-7 text-slate-400">Move from repetitive inspection to one prepared review. Your configuration remains visible, changed code stands out, and the final result stays yours to approve.</p>
              <div className="mt-7 space-y-3">
                {["See only meaningful changes","Keep custom values in context","Recover locally if something feels wrong"].map(item=><div key={item} className="flex items-center gap-3 text-[11px] font-medium text-slate-300"><span className="grid h-6 w-6 place-items-center rounded-lg bg-teal-300/[.07] shadow-[0_0_0_1px_rgba(115,215,205,.14)]"><Check strokeWidth={2} className="h-3.5 w-3.5 text-teal-300" /></span>{item}</div>)}
              </div>
            </div>
            <EfficiencyComparison />
          </div>
        </section>

        <PricingSection authenticated={Boolean(session?.user)} hasActivePlan={hasActivePlan} trialAvailable={!session?.user || trialAvailable} />

        <section id="referrals" className="relative px-5 py-24 lg:px-8 lg:py-32">
          <div className="premium-panel relative mx-auto grid max-w-[1180px] gap-12 overflow-hidden rounded-[28px] p-7 sm:p-10 lg:grid-cols-[1fr_.88fr] lg:p-12">
            <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-blue-200/45 to-transparent" />
            <div>
              <div className="premium-icon mb-6 h-11 w-11 rounded-xl"><Users strokeWidth={1.5} className="h-5 w-5" /></div>
              <p className="ocean-kicker">Affiliate program</p>
              <h2 className="display mt-4 max-w-xl text-4xl font-semibold tracking-[-.05em] text-white">Share a tool that saves real work. <span className="text-slate-500">Earn when it converts.</span></h2>
              <p className="mt-5 max-w-lg text-[13px] leading-7 text-slate-400">Apply through Discord, receive a custom eight-character code and follow every qualified referral from your private workspace.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={discord} target="_blank" rel="noreferrer" className="tap-control flex h-11 items-center gap-2 rounded-xl bg-[#5865f2] px-4 text-[10px] font-semibold text-white hover:bg-[#6672f5]"><DiscordIcon className="h-4 w-4" />Apply through Discord</a>
                <Link href="/affiliates" className="ocean-secondary flex h-11 items-center gap-2 rounded-xl px-4 text-[10px] font-semibold text-slate-200">Open affiliate area<ArrowRight strokeWidth={1.5} className="h-3.5 w-3.5" /></Link>
              </div>
            </div>
            <div className="grid content-center gap-3 sm:grid-cols-2">
              <Reward amount="10%" label="First purchase" note="Paid after the refund window" />
              <Reward amount="4 plans" label="Every duration" note="Weekly through annual access" />
              <div className="premium-card flex gap-3 rounded-2xl p-4 sm:col-span-2"><Clock3 strokeWidth={1.5} className="mt-0.5 h-4 w-4 shrink-0 text-blue-200" /><p className="text-[10px] leading-5 text-slate-500">Commissions remain pending through the refund window, then become available automatically. Trials and renewals do not generate a second commission.</p></div>
            </div>
          </div>
        </section>

        <FaqSection />
        <footer className="mx-auto flex max-w-[1180px] flex-col gap-4 px-5 py-9 text-[9px] text-slate-600 sm:flex-row sm:items-center lg:px-8">
          <span>© 2026 Auto Resource Updater.</span>
          <div className="flex flex-wrap gap-4 sm:ml-auto"><Link href="/#faq" className="transition-colors duration-150 hover:text-slate-300">FAQ</Link><Link href="/terms" className="transition-colors duration-150 hover:text-slate-300">Terms &amp; Conditions</Link><span>Not affiliated with Rockstar Games.</span></div>
        </footer>
      </main>
      <Analytics />
    </>
  );
}

function Reward({ amount, label, note }: { amount: string; label: string; note: string }) {
  return (
    <div className="premium-card rounded-2xl p-5">
      <p className="display text-3xl font-semibold tracking-[-.05em] text-teal-300">{amount}</p>
      <p className="mt-3 text-[11px] font-semibold text-white">{label}</p>
      <p className="mt-1 text-[9px] leading-4 text-slate-600">{note}</p>
      <div className="mt-5 flex items-center gap-1.5 text-[8px] text-teal-300"><Check strokeWidth={2} className="h-3 w-3" />Qualified automatically</div>
    </div>
  );
}
