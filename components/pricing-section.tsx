import Link from "next/link";
import { Check, ShieldCheck } from "lucide-react";
import { FreeTrialButton } from "./free-trial-button";
import { plans, type PlanId } from "@/lib/billing";

const presentation: Record<PlanId, { label?: string; note: string }> = {
  weekly: { note: "Short-term access" },
  monthly: { note: "Flexible monthly access" },
  six_months: { label: "Recommended", note: "Save $14.95" },
  yearly: { label: "Best value", note: "Save $39.89" },
};

export function PricingSection({
  authenticated = false,
  hasActivePlan = false,
  trialAvailable = true,
}: {
  authenticated?: boolean;
  hasActivePlan?: boolean;
  trialAvailable?: boolean;
}) {
  return (
    <section id="pricing" className="px-5 py-28 lg:px-8">
      <div className="ocean-glass mx-auto max-w-[1240px] rounded-[30px] p-6 sm:p-10 lg:p-14">
        <div className="mx-auto max-w-3xl text-center">
          <div>
            <p className="ocean-kicker">Pricing</p>
            <h2 className="display mt-5 text-4xl font-bold tracking-[-.045em] text-white sm:text-5xl">
              Full control, for as long as you need it.
            </h2>
            <p className="mt-4 text-sm text-slate-400">
              Every plan unlocks the complete application. No feature tiers.
            </p>
          </div>
          {trialAvailable && !hasActivePlan && (
            <div className="mx-auto mt-7 flex max-w-md items-center justify-between gap-4 rounded-2xl border border-cyan-200/15 bg-cyan-200/[.045] px-4 py-3 text-left backdrop-blur-xl">
              <div>
                <strong className="block text-sm text-white">
                  Try it free for 2 days
                </strong>
                <span className="text-xs text-slate-500">No card required</span>
              </div>
              <FreeTrialButton
                authenticated={authenticated}
                callbackUrl="/account"
                className="ocean-primary inline-flex h-9 items-center gap-2 rounded-lg px-4 text-xs font-bold"
              />
            </div>
          )}
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4 z-1">
          {(Object.keys(plans) as PlanId[]).map((id) => (
            <PlanCard key={id} id={id} disabled={hasActivePlan} />
          ))}
        </div>

        <div className="mt-7 flex flex-col justify-between gap-3 text-xs text-slate-500 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {[
              "Config preservation",
              "Visual comparison",
              "Restore Points",
              "Unlimited updates",
            ].map((benefit) => (
              <span key={benefit} className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-teal-300" />
                {benefit}
              </span>
            ))}
          </div>
          <span className="flex shrink-0 items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" /> PayPal · Cancel anytime
          </span>
        </div>

        {hasActivePlan && (
          <p className="mt-5 text-center text-sm text-slate-400">
            Your account already has active access.
          </p>
        )}
      </div>
    </section>
  );
}

function PlanCard({ id, disabled }: { id: PlanId; disabled: boolean }) {
  const plan = plans[id];
  const style = presentation[id];
  const featured = id === "six_months";
  return (
    <article
      className={`relative flex min-h-64 flex-col rounded-2xl border p-5 backdrop-blur-xl transition duration-500 hover:-translate-y-1 ${featured ? "border-cyan-200/20 bg-cyan-200/[.06] shadow-[0_20px_60px_rgba(22,125,160,.1)]" : "border-white/[.08] bg-white/[.025] hover:border-cyan-100/15"}`}
    >
      <div className="flex min-h-6 items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-white">{plan.name}</h3>
        {style.label && (
          <span className="rounded-full border border-cyan-200/20 bg-cyan-200/[.07] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-cyan-100">
            {style.label}
          </span>
        )}
      </div>
      <div className="mt-7">
        <span className="display text-4xl font-bold tracking-[-.05em] text-white">
          ${plan.price}
        </span>
        <span className="ml-2 text-xs text-slate-600">{plan.suffix}</span>
      </div>
      <p
        className={`mt-3 text-xs ${style.label ? "text-cyan-100/70" : "text-slate-500"}`}
      >
        {style.note}
      </p>
      {disabled ? (
        <span className="mt-auto flex h-10 items-center justify-center rounded-lg border border-white/[.08] text-xs font-semibold text-slate-600">
          Active plan
        </span>
      ) : (
        <Link
          href={`/checkout?plan=${id}`}
          className={`mt-auto flex h-10 items-center justify-center rounded-xl text-xs font-bold transition ${featured ? "ocean-primary" : "ocean-secondary text-slate-200"}`}
        >
          Choose plan
        </Link>
      )}
    </article>
  );
}
