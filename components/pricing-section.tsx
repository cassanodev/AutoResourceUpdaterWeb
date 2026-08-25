import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, Sparkles } from "lucide-react";
import { FreeTrialButton } from "./free-trial-button";
import { plans, type PlanId } from "@/lib/billing";

const presentation: Record<PlanId, { label?: string; note: string; saving?: string }> = {
  weekly: { note: "A focused seven-day pass" },
  monthly: { note: "Flexible month-to-month access" },
  six_months: { label: "Recommended", note: "Six months of uninterrupted access", saving: "Save $14.95" },
  yearly: { label: "Best value", note: "One year, one simple renewal", saving: "Save $39.89" },
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
    <section id="pricing" className="relative px-5 py-24 lg:px-8 lg:py-32">
      <div className="premium-panel mx-auto max-w-[1180px] overflow-hidden rounded-[28px]">
        <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_.82fr] lg:items-end lg:p-12">
          <div>
            <p className="ocean-kicker">Simple access</p>
            <h2 className="display mt-5 max-w-2xl text-balance text-4xl font-semibold tracking-[-.05em] text-white sm:text-5xl">The whole product. Choose the time horizon.</h2>
            <p className="mt-4 max-w-xl text-[13px] leading-7 text-slate-400">Every paid plan includes comparisons, configuration preservation, Restore Points and unlimited updates. No feature gates.</p>
          </div>
          {trialAvailable && !hasActivePlan && (
            <div className="rounded-2xl bg-blue-200/[.035] p-1 shadow-[0_0_0_1px_rgba(168,192,255,.11)]">
              <div className="flex items-center gap-4 rounded-[12px] bg-[#071126]/70 p-4">
                <span className="premium-icon h-10 w-10 shrink-0 rounded-xl"><Sparkles strokeWidth={1.5} className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1"><strong className="block text-[12px] text-white">Two days, free</strong><span className="mt-1 block text-[9px] text-slate-500">No card and no automatic charge</span></div>
                <FreeTrialButton authenticated={authenticated} callbackUrl="/account" className="ocean-primary inline-flex h-9 shrink-0 items-center gap-2 rounded-lg px-4 text-[10px] font-bold" />
              </div>
            </div>
          )}
        </div>

        <div className="grid border-t border-white/[.07] md:grid-cols-2 xl:grid-cols-4">
          {(Object.keys(plans) as PlanId[]).map((id, index) => (
            <PlanChoice key={id} id={id} disabled={hasActivePlan} index={index} />
          ))}
        </div>

        <div className="flex flex-col justify-between gap-4 border-t border-white/[.07] px-7 py-5 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:px-10 lg:px-12">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {["Config preservation", "Visual comparison", "Restore Points", "Unlimited updates"].map((benefit) => (
              <span key={benefit} className="flex items-center gap-1.5"><Check strokeWidth={2} className="h-3.5 w-3.5 text-teal-300" />{benefit}</span>
            ))}
          </div>
          <span className="flex shrink-0 items-center gap-1.5"><ShieldCheck strokeWidth={1.5} className="h-3.5 w-3.5" />PayPal · Cancel anytime</span>
        </div>

        {hasActivePlan && <p className="border-t border-white/[.07] px-7 py-4 text-center text-[11px] text-slate-400">Your account already has active access. Manage it from My account.</p>}
      </div>
    </section>
  );
}

function PlanChoice({ id, disabled, index }: { id: PlanId; disabled: boolean; index: number }) {
  const plan = plans[id];
  const detail = presentation[id];
  const featured = id === "six_months";
  return (
    <article className={`group relative flex min-h-[270px] flex-col p-6 transition-[background-color] duration-150 ease-out hover:bg-blue-100/[.025] ${index % 2 === 0 ? "md:border-r md:border-white/[.07]" : ""} ${index < 2 ? "border-b border-white/[.07] xl:border-b-0" : ""} ${index < 3 ? "xl:border-r xl:border-white/[.07]" : ""}`}>
      {featured && <span className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-blue-200/70 to-transparent" />}
      <div className="flex min-h-7 items-center justify-between gap-2">
        <h3 className="text-[12px] font-semibold text-white">{plan.name}</h3>
        {detail.label && <span className="rounded-full bg-blue-200/[.07] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[.12em] text-blue-100 shadow-[0_0_0_1px_rgba(168,192,255,.15)]">{detail.label}</span>}
      </div>
      <div className="mt-8 flex items-end gap-2">
        <span className="display text-[42px] font-semibold leading-none tracking-[-.06em] text-white">{"$"}{plan.price}</span>
        <span className="pb-1 text-[10px] text-slate-600">{plan.suffix}</span>
      </div>
      <p className="mt-4 text-[10px] leading-5 text-slate-500">{detail.note}</p>
      {detail.saving && <p className="mt-2 text-[9px] font-semibold text-teal-300">{detail.saving}</p>}
      {disabled ? (
        <span className="mt-auto flex h-10 items-center justify-center rounded-xl bg-white/[.025] text-[10px] font-semibold text-slate-600 shadow-[0_0_0_1px_rgba(255,255,255,.06)]">Current access active</span>
      ) : (
        <Link href={`/checkout?plan=${id}`} className={`mt-auto flex h-10 items-center justify-center gap-2 rounded-xl text-[10px] font-bold ${featured ? "ocean-primary" : "ocean-secondary text-slate-200"}`}>
          Choose {plan.name.toLowerCase()} <ArrowRight strokeWidth={2} className="h-3.5 w-3.5 transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
        </Link>
      )}
    </article>
  );
}
