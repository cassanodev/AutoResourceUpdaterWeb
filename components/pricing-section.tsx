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
    <section id="pricing" className="border-t border-white/[.06] bg-[#090d10]">
      <div className="mx-auto max-w-[1240px] px-5 py-20 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[.2em] text-amber-400">
              Pricing
            </p>
            <h2 className="display mt-3 text-4xl font-bold tracking-[-.045em] text-white">
              Choose how long you need it.
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Every plan includes the complete application.
            </p>
          </div>
          {trialAvailable && !hasActivePlan && (
            <div className="flex items-center gap-4 rounded-xl border border-white/[.08] bg-white/[.025] px-4 py-3">
              <div>
                <strong className="block text-sm text-white">
                  Try it free for 2 days
                </strong>
                <span className="text-xs text-slate-500">No card required</span>
              </div>
              <FreeTrialButton
                authenticated={authenticated}
                callbackUrl="/account"
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-amber-300 px-4 text-xs font-bold text-[#17120a] hover:bg-amber-200"
              />
            </div>
          )}
        </div>

        <div className="mt-9 grid overflow-hidden rounded-xl border border-white/[.09] bg-[#0d1217] sm:grid-cols-2 xl:grid-cols-4">
          {(Object.keys(plans) as PlanId[]).map((id) => (
            <PlanCard key={id} id={id} disabled={hasActivePlan} />
          ))}
        </div>

        <div className="mt-5 flex flex-col justify-between gap-3 text-xs text-slate-500 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {[
              "Config preservation",
              "Visual comparison",
              "Restore Points",
              "Unlimited updates",
            ].map((benefit) => (
              <span key={benefit} className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-amber-300" />
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
      className={`relative flex min-h-64 flex-col border-white/[.08] p-5 sm:[&:nth-child(odd)]:border-r xl:border-r xl:last:border-r-0 ${featured ? "bg-amber-300/[.045]" : ""}`}
    >
      <div className="flex min-h-6 items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-white">{plan.name}</h3>
        {style.label && (
          <span className="rounded-full border border-amber-300/20 bg-amber-300/[.07] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-200">
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
        className={`mt-3 text-xs ${style.label ? "text-amber-200/70" : "text-slate-500"}`}
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
          className={`mt-auto flex h-10 items-center justify-center rounded-lg text-xs font-bold transition ${featured ? "bg-amber-300 text-[#17120a] hover:bg-amber-200" : "border border-white/10 bg-white/[.035] text-slate-200 hover:bg-white/[.07]"}`}
        >
          Choose plan
        </Link>
      )}
    </article>
  );
}
