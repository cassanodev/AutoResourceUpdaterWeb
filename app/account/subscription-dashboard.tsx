import Link from "next/link";
import { CalendarDays, Check, Clock3, CreditCard, ShieldCheck } from "lucide-react";
import { FreeTrialButton } from "@/components/free-trial-button";
import type { AccountData } from "@/lib/external-api";
import { CancelRenewalButton } from "@/components/cancel-renewal-button";

export function AccountDashboard({ user, account }: { user: { name: string; image?: string }; account: AccountData }) {
  const subscription = account.subscription;
  const paidActive = subscription?.status === "active";
  const trialActive = account.trial?.status === "active" && new Date(account.trial.expiresAt) > new Date();
  const trialAvailable = !paidActive && !account.trial;
  const planLabels: Record<string,string> = { weekly: "7 Day plan", monthly: "1 Month plan", six_months: "6 Month plan", yearly: "1 Year plan", lifetime: "Legacy plan" };
  const planName = paidActive
    ? planLabels[subscription.plan] || "Paid plan"
    : trialActive ? "Free trial" : "No active access";
  const statusText = paidActive ? "Active" : trialActive ? "Trial active" : subscription ? subscription.status.replaceAll("_", " ") : "Inactive";
  const accessEnd = paidActive
    ? subscription.plan === "lifetime" ? "Legacy access" : subscription.renewsAt ? formatDate(subscription.renewsAt) : "Renewal pending"
    : trialActive ? formatDate(account.trial!.expiresAt) : "No access period";

  return (
    <section className="relative mx-auto max-w-[980px] px-5 pb-24 pt-10 lg:px-8">
      <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-3/4 -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(103,211,235,.075),transparent_68%)]" />
      <header className="relative flex items-center gap-4 border-b border-cyan-100/[.09] pb-7">
        {user.image ? <img src={user.image} alt="Discord avatar" className="h-12 w-12 rounded-xl border border-cyan-100/15 shadow-[0_10px_30px_rgba(0,0,0,.25)]" /> : <div className="h-12 w-12 rounded-xl border border-cyan-100/15 bg-[#5865f2]" />}
        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[.2em] text-cyan-200/65">My account</p>
          <h1 className="mt-1 truncate text-2xl font-semibold tracking-[-.02em] text-white">{user.name}</h1>
        </div>
        <span className="ml-auto hidden items-center gap-2 rounded-lg border border-cyan-100/10 bg-cyan-200/[.035] px-3 py-2 text-[9px] text-slate-400 sm:flex"><ShieldCheck className="h-3.5 w-3.5 text-cyan-200/70" />Connected with Discord</span>
      </header>

      <div className="relative mt-7 overflow-hidden rounded-2xl border border-cyan-100/[.1] bg-[#071426]/80 shadow-[inset_0_1px_rgba(255,255,255,.035),0_30px_90px_rgba(0,4,16,.28)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/50 to-transparent" />
        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center">
          <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border ${paidActive ? "border-emerald-400/20 bg-emerald-400/[.06]" : trialActive ? "border-amber-300/20 bg-amber-400/[.06]" : "border-white/[.08] bg-white/[.025]"}`}>
            {paidActive ? <Check className="h-4 w-4 text-emerald-300" /> : trialActive ? <Clock3 className="h-4 w-4 text-amber-300" /> : <Clock3 className="h-4 w-4 text-slate-500" />}
          </div>
          <div>
            <p className="text-[8px] uppercase tracking-[.16em] text-slate-600">Current access</p>
            <h2 className="mt-1 text-base font-semibold text-white">{planName}</h2>
          </div>
          <span className={`sm:ml-auto rounded-md px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[.1em] ${paidActive ? "bg-emerald-400/[.07] text-emerald-300" : trialActive ? "bg-amber-400/[.07] text-amber-200" : "bg-white/[.035] text-slate-500"}`}>{statusText}</span>
        </div>

        <div className="grid border-t border-white/[.07] sm:grid-cols-3">
          <Metric icon={CalendarDays} label={paidActive && subscription?.plan !== "lifetime" ? "Next renewal" : trialActive ? "Trial ends" : "Access period"} value={accessEnd} />
          <Metric icon={CreditCard} label="Plan cost" value={paidActive ? `$${Number(subscription.amount).toFixed(2)} ${subscription.currency}` : trialActive ? "$0.00" : "—"} />
          <Metric icon={ShieldCheck} label="Provider" value={paidActive ? capitalize(subscription.provider) : trialActive ? "Free trial" : "None"} />
        </div>
        {paidActive && subscription.plan !== "lifetime" && <div className="flex flex-col gap-4 border-t border-white/[.07] px-5 py-5 sm:flex-row sm:items-center"><div className="flex-1">{subscription.cancelAtPeriodEnd?<><p className="text-sm font-semibold text-amber-200">Automatic renewal is cancelled</p><p className="mt-1 text-xs leading-5 text-slate-400">Your access remains active until {subscription.renewsAt?formatDate(subscription.renewsAt):"the end of the paid period"}. You will not be charged again.</p></>:<><p className="text-sm font-semibold text-white">Automatic renewal</p><p className="mt-1 text-xs leading-5 text-slate-400">Your plan renews through PayPal at the end of the current period.</p></>}</div>{!subscription.cancelAtPeriodEnd&&<CancelRenewalButton accessUntil={subscription.renewsAt}/>}</div>}

        {!paidActive && (
          <div className="border-t border-white/[.07] px-5 py-5">
            {trialAvailable ? (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-[10px] font-semibold text-white">Your two-day trial is available</p>
                  <p className="mt-1 text-[9px] text-slate-500">Try every feature without a card or automatic charge.</p>
                </div>
                <FreeTrialButton authenticated className="sm:ml-auto inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-cyan-100 px-4 text-[9px] font-bold text-[#03111b] transition hover:bg-white" />
              </div>
            ) : trialActive ? (
              <p className="text-[9px] text-slate-400">You can upgrade at any time. Your paid access will be registered independently of the trial.</p>
            ) : (
              <p className="text-[9px] text-slate-500">Your free trial has already been used. Choose a plan to continue using the application.</p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/#pricing" className="flex h-10 items-center rounded-lg border border-cyan-200/15 bg-cyan-200/[.045] px-4 text-xs font-semibold text-cyan-100 transition hover:border-cyan-100/25 hover:bg-cyan-200/[.08]">Compare all paid plans</Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) {
  return <div className="border-b border-white/[.06] px-5 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"><div className="flex items-center gap-2 text-[8px] uppercase tracking-[.13em] text-slate-600"><Icon className="h-3 w-3" />{label}</div><p className="mt-2 text-[10px] font-medium text-slate-300">{value}</p></div>;
}
function formatDate(value: string) { return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
function capitalize(value: string) { return value.charAt(0).toUpperCase() + value.slice(1); }
