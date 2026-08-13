import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  Code2,
  Download,
  FolderSync,
  Gamepad2,
  History,
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

const installer =
  process.env.NEXT_PUBLIC_INSTALLER_URL || "#download-not-configured";
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
      <main className="marketing-surface min-h-screen overflow-hidden bg-[#080b0e]">
        <section className="relative min-h-[780px] border-b border-white/[.06]">
          <div
            className="hero-backdrop pointer-events-none absolute inset-0"
            aria-hidden="true"
          >
            <span className="hero-orbit hero-orbit-one" />
            <span className="hero-orbit hero-orbit-two" />
          </div>
          <HeroCursorTrail />
          <div className="noise pointer-events-none absolute inset-0 opacity-[.025]" />
          <SiteHeader />
          <div className="relative z-10 mx-auto grid max-w-[1240px] items-center gap-14 px-5 pb-24 pt-14 lg:grid-cols-[.9fr_1.1fr] lg:px-8 lg:pt-24">
            <div className="rise">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[.055] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[.13em] text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
                Built for FiveM servers
              </div>
              <h1 className="display text-balance text-[48px] font-bold leading-[.98] tracking-[-.055em] text-white sm:text-[62px] lg:text-[68px]">
                Update resources.
                <br />
                <span className="text-slate-500">Keep your config.</span>
              </h1>
              <p className="mt-6 max-w-[520px] text-[14px] leading-7 text-slate-500">
                A safer Windows workspace for managing FiveM resources. Review
                every change, preserve configuration, and roll back with
                confidence.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href={installer}
                  className="group flex h-12 items-center gap-3 rounded-lg bg-amber-300 px-5 text-[11px] font-bold text-[#17120a] shadow-[0_15px_45px_rgba(246,184,74,.15)] transition hover:-translate-y-0.5 hover:bg-amber-200"
                >
                  <Download className="h-4 w-4" />
                  Download for Windows
                  <ArrowDownToLine className="ml-2 h-3.5 w-3.5 opacity-50" />
                </a>
                <Link
                  href="#features"
                  className="flex h-12 items-center gap-2 rounded-lg border border-white/10 bg-white/[.035] px-5 text-[11px] font-semibold text-slate-300 transition hover:bg-white/[.07]"
                >
                  See how it works
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[9px] text-slate-600">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  Restore Points before every update
                </span>
                <span className="flex items-center gap-1.5">
                  <Gamepad2 className="h-3.5 w-3.5 text-amber-400" />
                  Ready for the next generation
                </span>
              </div>
            </div>
            <div className="rise [animation-delay:120ms]">
              <ProductPreview />
            </div>
          </div>
        </section>
        <section
          id="features"
          className="relative mx-auto max-w-[1240px] px-5 py-28 lg:px-8"
        >
          <div className="mb-14 max-w-2xl">
            <p className="text-[9px] font-bold uppercase tracking-[.22em] text-amber-400">
              A controlled update workflow
            </p>
            <h2 className="display mt-4 text-balance text-4xl font-bold tracking-[-.045em] text-white">
              Know what changes before it reaches your server.
            </h2>
            <p className="mt-4 text-[13px] leading-6 text-slate-500">
              Built around the realities of modified GTA servers: custom values,
              protected assets, changing manifests, and updates you may need to
              undo.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Feature
              icon={Code2}
              title="Config-aware merge"
              text="Preserves your configured values while bringing in new options from the update."
            />
            <Feature
              icon={FolderSync}
              title="Visual review"
              text="Browse changed folders and compare the installed file with the final result."
            />
            <Feature
              icon={History}
              title="Restore Points"
              text="Every applied update keeps a local copy of the state it replaces."
            />
            <Feature
              icon={ShieldCheck}
              title="Protected assets"
              text="Binary and encrypted files are recognized and handled without unsafe parsing."
            />
          </div>
        </section>
        <section
          id="why"
          className="relative border-y border-white/[.06] bg-[#0a0e12]"
        >
          <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-5 py-20 lg:grid-cols-[.75fr_1.25fr] lg:px-8">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[.22em] text-amber-400">
                Why use it?
              </p>
              <h2 className="display mt-4 text-balance text-4xl font-bold tracking-[-.045em] text-white">
                Update resources without the busywork.
              </h2>
              <p className="mt-5 max-w-lg text-[13px] leading-7 text-slate-500">
                Compare every changed file, preserve your configuration and
                review the result in seconds.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {[
                  "See every change",
                  "Keep your config",
                  "Restore anytime",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/[.08] bg-white/[.025] px-3 py-2 text-[11px] font-medium text-slate-400"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <EfficiencyComparison />
          </div>
        </section>
        <PricingSection
          authenticated={Boolean(session?.user)}
          hasActivePlan={hasActivePlan}
          trialAvailable={!session?.user || trialAvailable}
        />
        <section
          id="referrals"
          className="relative border-y border-white/[.06] bg-[#0b0f13]"
        >
          <div className="relative mx-auto grid max-w-[1240px] gap-12 px-5 py-24 lg:grid-cols-[1fr_.9fr] lg:px-8">
            <div>
              <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl border border-amber-300/20 bg-amber-400/10">
                <Users className="h-5 w-5 text-amber-300" />
              </div>
              <p className="text-[9px] font-bold uppercase tracking-[.22em] text-amber-400">
                Affiliate program
              </p>
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
                  className="flex h-11 items-center gap-2 rounded-lg border border-white/10 px-4 text-[10px] font-semibold text-slate-300 hover:bg-white/[.04]"
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
              <div className="sm:col-span-2 flex gap-3 rounded-xl border border-white/[.07] bg-white/[.025] p-4">
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
          <span>© 2026 Fragment. Auto Resource Updater.</span>
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
function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Code2;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-xl border border-white/[.07] bg-[#0d1217] p-5 transition hover:-translate-y-1 hover:border-white/[.12]">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/[.035]">
        <Icon className="h-4 w-4 text-amber-400" />
      </div>
      <h3 className="mt-5 text-[12px] font-semibold text-white">{title}</h3>
      <p className="mt-2 text-[10px] leading-5 text-slate-600">{text}</p>
    </article>
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
