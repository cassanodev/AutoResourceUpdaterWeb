"use client";
import { useState } from "react";
import {
  CalendarClock,
  Check,
  CreditCard,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
export function AccountDashboard({
  user,
}: {
  user: { name: string; image?: string };
}) {
  const [trial, setTrial] = useState(false);
  return (
    <section className="mx-auto max-w-[1040px] px-5 pb-24 pt-12 lg:px-8">
      <div className="flex items-center gap-4">
        {user.image ? (
          <img
            src={user.image}
            alt="Discord avatar"
            className="h-12 w-12 rounded-xl"
          />
        ) : (
          <div className="h-12 w-12 rounded-xl bg-[#5865f2]" />
        )}
        <div>
          <p className="text-[9px] uppercase tracking-[.18em] text-slate-600">
            Signed in with Discord
          </p>
          <h1 className="display mt-1 text-3xl font-bold text-white">
            Welcome, {user.name}
          </h1>
        </div>
      </div>
      <div className="mt-10 grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
        <article className="rounded-2xl border border-white/[.08] bg-[#0d1217] p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[.18em] text-amber-400">
                Subscription
              </p>
              <h2 className="mt-3 text-xl font-semibold text-white">
                {trial ? "Free trial active" : "No active plan"}
              </h2>
              <p className="mt-2 text-[10px] text-slate-500">
                {trial
                  ? "Your full two-day trial is active. No card was required."
                  : "Start free or choose Monthly or Lifetime access."}
              </p>
            </div>
            <Sparkles className="h-5 w-5 text-amber-300" />
          </div>
          {trial ? (
            <div className="mt-6 rounded-xl border border-emerald-400/10 bg-emerald-400/[.04] p-4">
              <div className="flex items-center gap-2 text-[10px] font-semibold text-emerald-300">
                <Check className="h-4 w-4" />
                Full access enabled
              </div>
              <p className="mt-2 text-[9px] text-slate-500">
                Expires in 2 days. Access ends automatically unless you purchase
                a plan.
              </p>
            </div>
          ) : (
            <button
              onClick={() => setTrial(true)}
              className="mt-7 h-11 rounded-lg bg-amber-300 px-5 text-[10px] font-bold text-[#17120a] hover:bg-amber-200"
            >
              Start 2-day free trial
            </button>
          )}
          <div className="mt-7 border-t border-white/[.06] pt-5">
            <p className="text-[9px] text-slate-600">Payment methods</p>
            <p className="mt-2 text-[10px] text-slate-300">
              PayPal · USDT · Bitcoin
            </p>
          </div>
        </article>
        <div className="grid gap-4">
          <Info
            icon={CalendarClock}
            title="Renewal"
            text="No upcoming charge"
          />
          <Info
            icon={CreditCard}
            title="Billing details"
            text="No payment method connected"
          />
          <Info
            icon={ShieldCheck}
            title="Control"
            text="Monthly plans can be cancelled before renewal"
          />
        </div>
      </div>
      <p className="mt-5 text-[9px] leading-5 text-slate-700">
        Checkout and persistent trial activation are ready to connect to your
        subscription backend. This preview does not create a charge.
      </p>
    </section>
  );
}
function Info({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof CreditCard;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-xl border border-white/[.07] bg-[#0d1217] p-5">
      <Icon className="h-4 w-4 text-emerald-300" />
      <p className="mt-4 text-[10px] font-semibold text-white">{title}</p>
      <p className="mt-1 text-[9px] text-slate-600">{text}</p>
      {title === "Billing details" && (
        <button
          disabled
          className="mt-4 cursor-not-allowed rounded-md border border-white/[.06] px-3 py-2 text-[8px] text-slate-700"
        >
          Available with a paid plan
        </button>
      )}
      {title === "Control" && (
        <button
          disabled
          className="mt-4 cursor-not-allowed rounded-md border border-white/[.06] px-3 py-2 text-[8px] text-slate-700"
        >
          No renewal scheduled
        </button>
      )}
    </article>
  );
}
