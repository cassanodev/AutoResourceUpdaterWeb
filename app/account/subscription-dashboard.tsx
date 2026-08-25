import Link from "next/link";
import { ArrowRight, CalendarDays, Check, Clock3, CreditCard, ShieldCheck } from "lucide-react";
import { FreeTrialButton } from "@/components/free-trial-button";
import { CancelRenewalButton } from "@/components/cancel-renewal-button";
import type { AccountData } from "@/lib/external-api";

export function AccountDashboard({ user, account }: { user: { name: string; image?: string }; account: AccountData }) {
  const subscription = account.subscription;
  const paidActive = subscription?.status === "active";
  const trialActive = account.trial?.status === "active" && new Date(account.trial.expiresAt) > new Date();
  const trialAvailable = !paidActive && !account.trial;
  const labels: Record<string,string> = { weekly: "7 Day plan", monthly: "1 Month plan", six_months: "6 Month plan", yearly: "1 Year plan", lifetime: "Legacy plan" };
  const planName = paidActive ? labels[subscription.plan] || "Paid plan" : trialActive ? "Free trial" : "No active access";
  const statusText = paidActive ? "Active" : trialActive ? "Trial active" : subscription ? subscription.status.replaceAll("_", " ") : "Inactive";
  const accessEnd = paidActive
    ? subscription.plan === "lifetime" ? "Legacy access" : subscription.renewsAt ? formatDate(subscription.renewsAt) : "Renewal pending"
    : trialActive ? formatDate(account.trial!.expiresAt) : "No access period";

  return (
    <section className="relative mx-auto max-w-[1040px] px-5 pb-24 pt-12 lg:px-8">
      <header className="page-enter flex items-center gap-4">
        {user.image ? <img src={user.image} alt="Discord avatar" className="h-12 w-12 rounded-[14px] object-cover outline outline-1 -outline-offset-1 outline-white/10 shadow-[0_12px_32px_rgba(0,0,0,.28)]" /> : <div className="h-12 w-12 rounded-[14px] bg-[#5865f2] shadow-[0_0_0_1px_rgba(255,255,255,.1)]" />}
        <div className="min-w-0"><p className="ocean-kicker text-[8px]">My account</p><h1 className="display mt-1.5 truncate text-3xl font-semibold tracking-[-.04em] text-white">{user.name}</h1></div>
        <span className="ml-auto hidden items-center gap-2 rounded-xl bg-blue-200/[.035] px-3 py-2 text-[9px] text-slate-400 shadow-[0_0_0_1px_rgba(168,192,255,.09)] sm:flex"><ShieldCheck strokeWidth={1.5} className="h-3.5 w-3.5 text-blue-200" />Discord verified</span>
      </header>

      <div className="page-enter page-enter-delay-1 premium-panel relative mt-8 overflow-hidden rounded-[26px]">
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent" />
        <div className="grid lg:grid-cols-[.72fr_1.28fr]">
          <div className="flex min-h-[300px] flex-col justify-between border-b border-white/[.07] p-7 lg:border-b-0 lg:border-r">
            <div>
              <span className={`grid h-11 w-11 place-items-center rounded-xl ${paidActive ? "bg-teal-300/[.07] text-teal-300 shadow-[0_0_0_1px_rgba(115,215,205,.15)]" : trialActive ? "bg-blue-200/[.07] text-blue-200 shadow-[0_0_0_1px_rgba(168,192,255,.15)]" : "bg-white/[.025] text-slate-500 shadow-[0_0_0_1px_rgba(255,255,255,.07)]"}`}>
                {paidActive ? <Check strokeWidth={2} className="h-5 w-5" /> : <Clock3 strokeWidth={1.5} className="h-5 w-5" />}
              </span>
              <p className="mt-7 text-[8px] font-semibold uppercase tracking-[.16em] text-slate-600">Current access</p>
              <h2 className="display mt-2 text-[32px] font-semibold tracking-[-.045em] text-white">{planName}</h2>
              <span className={`mt-4 inline-flex rounded-full px-2.5 py-1.5 text-[8px] font-semibold uppercase tracking-[.12em] ${paidActive ? "bg-teal-300/[.07] text-teal-300" : trialActive ? "bg-blue-200/[.07] text-blue-200" : "bg-white/[.035] text-slate-500"}`}>{statusText}</span>
            </div>
            <p className="mt-8 max-w-xs text-[10px] leading-5 text-slate-500">{paidActive ? "Your complete Auto Resource Updater workspace is available." : trialActive ? "Every feature is unlocked during your trial." : "Choose a plan or use your available trial to unlock the desktop app."}</p>
          </div>

          <div className="flex flex-col">
            <div className="grid sm:grid-cols-3">
              <Metric icon={CalendarDays} label={paidActive && subscription?.plan !== "lifetime" ? "Next renewal" : trialActive ? "Trial ends" : "Access period"} value={accessEnd} />
              <Metric icon={CreditCard} label="Plan cost" value={paidActive ? `$${Number(subscription.amount).toFixed(2)} ${subscription.currency}` : trialActive ? "$0.00" : "—"} />
              <Metric icon={ShieldCheck} label="Provider" value={paidActive ? capitalize(subscription.provider) : trialActive ? "Free trial" : "None"} />
            </div>

            {paidActive && subscription.plan !== "lifetime" && (
              <div className="mt-auto border-t border-white/[.07] p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex-1">
                    <p className={`text-[12px] font-semibold ${subscription.cancelAtPeriodEnd ? "text-blue-200" : "text-white"}`}>{subscription.cancelAtPeriodEnd ? "Renewal cancelled" : "Automatic renewal"}</p>
                    <p className="mt-1.5 max-w-lg text-[10px] leading-5 text-slate-500">{subscription.cancelAtPeriodEnd ? `Your access remains active until ${subscription.renewsAt ? formatDate(subscription.renewsAt) : "the end of the paid period"}. You will not be charged again.` : "PayPal renews this plan automatically when the current access period ends."}</p>
                  </div>
                  {!subscription.cancelAtPeriodEnd && <CancelRenewalButton accessUntil={subscription.renewsAt} />}
                </div>
              </div>
            )}

            {!paidActive && (
              <div className="mt-auto border-t border-white/[.07] p-6">
                {trialAvailable ? (
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center"><div className="flex-1"><p className="text-[12px] font-semibold text-white">Your two-day trial is ready</p><p className="mt-1.5 text-[10px] leading-5 text-slate-500">Full product access. No card and no automatic charge.</p></div><FreeTrialButton authenticated className="ocean-primary inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-[10px] font-bold" /></div>
                ) : trialActive ? (
                  <p className="text-[10px] leading-5 text-slate-400">Upgrade whenever you are ready. Paid access is registered independently of the trial.</p>
                ) : (
                  <p className="text-[10px] leading-5 text-slate-500">Your free trial has already been used. Choose a plan to continue.</p>
                )}
                <Link href="/#pricing" className="ocean-secondary mt-4 inline-flex h-10 items-center gap-2 rounded-xl px-4 text-[10px] font-semibold text-slate-200">Compare paid plans <ArrowRight strokeWidth={1.5} className="h-3.5 w-3.5" /></Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof CalendarDays; label: string; value: string }) {
  return <div className="border-b border-white/[.06] p-6 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"><div className="flex items-center gap-2 text-[8px] uppercase tracking-[.13em] text-slate-600"><Icon strokeWidth={1.5} className="h-3.5 w-3.5 text-blue-200/60" />{label}</div><p className="mt-3 text-[11px] font-medium text-slate-200">{value}</p></div>;
}

function formatDate(value: string) { return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }
function capitalize(value: string) { return value.charAt(0).toUpperCase() + value.slice(1); }
