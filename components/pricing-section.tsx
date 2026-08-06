import Link from "next/link";
import {
  Check,
  Infinity as InfinityIcon,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
const benefits = [
  "Configuration-aware updates",
  "Visual file comparison",
  "Automatic Restore Points",
  "Protected asset handling",
];
export function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative border-t border-white/[.06] bg-[#090d10]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(52,211,153,.055),transparent_35%)]" />
      <div className="relative mx-auto max-w-[1120px] px-5 py-28 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[9px] font-bold uppercase tracking-[.22em] text-emerald-400">
            Simple pricing
          </p>
          <h2 className="display mt-4 text-4xl font-bold tracking-[-.045em] text-white">
            Protect every update for less than one lost config.
          </h2>
          <p className="mt-4 text-[12px] leading-6 text-slate-500">
            Try every feature free for two days. No card, no automatic charge.
          </p>
        </div>
        <div className="mx-auto mt-14 grid max-w-[860px] gap-4 md:grid-cols-2">
          <Plan
            name="Monthly"
            price="$10"
            suffix="/ month"
            description="Flexible access for active servers."
          />
          <Plan
            featured
            name="Lifetime"
            price="$30"
            suffix="one time"
            description="Permanent access. Pay once, keep it forever."
          />
        </div>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href="/login?callbackUrl=/account"
            className="flex h-12 items-center gap-2 rounded-lg bg-amber-300 px-6 text-[11px] font-bold text-[#17120a] shadow-[0_15px_45px_rgba(246,184,74,.12)] hover:bg-amber-200"
          >
            <Sparkles className="h-4 w-4" />
            Start 2-day free trial
          </Link>
          <p className="flex items-center gap-2 text-[9px] text-slate-600">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            No credit card required · PayPal, USDT and Bitcoin accepted
          </p>
        </div>
      </div>
    </section>
  );
}
function Plan({
  name,
  price,
  suffix,
  description,
  featured = false,
}: {
  name: string;
  price: string;
  suffix: string;
  description: string;
  featured?: boolean;
}) {
  return (
    <article
      className={`relative rounded-2xl border p-7 ${featured ? "border-amber-300/25 bg-amber-400/[.035] shadow-[0_25px_80px_rgba(246,184,74,.06)]" : "border-white/[.08] bg-[#0d1217]"}`}
    >
      {featured && (
        <span className="absolute right-5 top-5 rounded-full bg-amber-300 px-2.5 py-1 text-[7px] font-bold uppercase tracking-[.12em] text-[#17120a]">
          Best value
        </span>
      )}
      <div className="flex items-center gap-2">
        {featured ? (
          <InfinityIcon className="h-4 w-4 text-amber-300" />
        ) : (
          <Sparkles className="h-4 w-4 text-emerald-300" />
        )}
        <h3 className="text-[12px] font-semibold text-white">{name}</h3>
      </div>
      <div className="mt-6 flex items-end gap-2">
        <span className="display text-5xl font-bold tracking-[-.06em] text-white">
          {price}
        </span>
        <span className="pb-1.5 text-[9px] text-slate-600">{suffix}</span>
      </div>
      <p className="mt-3 text-[10px] text-slate-500">{description}</p>
      <ul className="mt-7 space-y-3">
        {benefits.map((x) => (
          <li
            key={x}
            className="flex items-center gap-2 text-[9px] text-slate-400"
          >
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            {x}
          </li>
        ))}
      </ul>
      <Link
        href="/login?callbackUrl=/account"
        className={`mt-7 flex h-10 items-center justify-center rounded-lg text-[10px] font-bold transition ${featured ? "bg-amber-300 text-[#17120a] hover:bg-amber-200" : "border border-white/10 bg-white/[.035] text-white hover:bg-white/[.07]"}`}
      >
        Choose {name}
      </Link>
    </article>
  );
}
