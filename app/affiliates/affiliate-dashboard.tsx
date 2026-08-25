"use client";
import { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  Check,
  Clock3,
  Copy,
  Info,
  Search,
  Users,
} from "lucide-react";
import type {
  AffiliateData,
  ReferralStatus as Status,
} from "@/lib/external-api";
import { WithdrawalRequestModal } from "@/components/withdrawal-request-modal";
const labels: Record<Status, string> = {
  qualified: "Qualified",
  pending: "Pending",
  inactive: "Inactive",
  "not-applicable": "Not applicable",
};
export function AffiliateDashboard({ data }: { data: AffiliateData }) {
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [search, setSearch] = useState("");
  const [withdraw, setWithdraw] = useState(false);
  const [copied, setCopied] = useState(false);
  const referrals = data.referrals.map((referral) => ({
    id: referral.discordId,
    user: referral.discordUsername,
    joined: new Date(referral.registeredAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    plan: referral.plan,
    commission: referral.commission,
    status: referral.status,
    qualifies: referral.qualifiesAt
      ? new Date(referral.qualifiesAt).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
      : undefined,
  }));
  const referralCode = data.referralCode;
  const visible = useMemo(
    () =>
      referrals.filter(
        (r) =>
          (filter === "all" || r.status === filter) &&
          `${r.user} ${r.id}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [filter, search],
  );
  return (
    <div className="relative mx-auto max-w-[1180px] px-5 pb-24 pt-12 lg:px-8">
      <div className="page-enter mb-9 flex flex-col gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="ocean-kicker text-[8px]">Affiliate workspace</p>
          <h1 className="display mt-3 text-4xl font-semibold tracking-[-.05em] text-white">
            Your referrals
          </h1>
          <p className="mt-2 text-[11px] text-slate-600">
            Track qualification windows, commissions, and payouts.
          </p>
        </div>
        <button
          onClick={() => setWithdraw(true)}
          disabled={data.availableBalance < 30}
          className="tap-control sm:ml-auto flex h-10 items-center justify-center gap-2 rounded-xl bg-teal-300/[.08] px-4 text-[10px] font-semibold text-teal-300 shadow-[0_0_0_1px_rgba(115,215,205,.16)] transition-[background-color,box-shadow,scale] duration-150 ease-out hover:bg-teal-300/[.12] hover:shadow-[0_0_0_1px_rgba(115,215,205,.24)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowDownToLine strokeWidth={2} className="h-3.5 w-3.5" />
          {data.availableBalance < 30
            ? "Minimum $30 to withdraw"
            : "Withdraw funds"}
        </button>
      </div>
      <div className="page-enter page-enter-delay-1 premium-panel grid gap-px overflow-hidden rounded-2xl bg-white/[.055] md:grid-cols-3">
        <Stat
          label="Available balance"
          value={`$${data.availableBalance.toFixed(2)}`}
          sub="Ready to withdraw"
          accent="green"
        />
        <Stat
          label="Pending balance"
          value={`$${data.pendingBalance.toFixed(2)}`}
          sub={`${referrals.filter((item) => item.status === "pending").length} referrals in refund window`}
          accent="amber"
        />
        <Stat
          label="Lifetime earned"
          value={`$${data.lifetimeEarned.toFixed(2)}`}
          sub={`Across ${data.qualifiedCount} qualified referrals`}
          accent="slate"
        />
      </div>
      <div className="premium-card mt-5 flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <p className="text-[8px] font-bold uppercase tracking-[.16em] text-slate-700">
            Your custom referral code
          </p>
          <p className="mt-1 truncate font-mono text-[10px] text-slate-400">
            {referralCode}
          </p>
        </div>
        <button
          onClick={() => {
            void navigator.clipboard?.writeText(referralCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="tap-control flex h-9 items-center justify-center gap-2 rounded-xl px-3 text-[9px] text-slate-400 shadow-[0_0_0_1px_rgba(255,255,255,.08)] transition-[color,background-color,box-shadow,scale] duration-150 ease-out hover:bg-white/[.04] hover:text-white hover:shadow-[0_0_0_1px_rgba(255,255,255,.13)]"
        >
          <span className="relative grid h-3.5 w-3.5 place-items-center">
            <Check
              strokeWidth={2}
              className={`absolute h-3.5 w-3.5 text-teal-300 transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${copied ? "scale-100 opacity-100 blur-0" : "scale-[.25] opacity-0 blur-[4px]"}`}
            />
            <Copy
              strokeWidth={1.5}
              className={`absolute h-3.5 w-3.5 transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${copied ? "scale-[.25] opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-0"}`}
            />
          </span>
          {copied ? "Copied" : "Copy code"}
        </button>
      </div>
      <section className="premium-panel mt-5 overflow-hidden rounded-2xl">
        <div className="flex flex-col gap-3 border-b border-white/[.06] p-4 lg:flex-row lg:items-center">
          <div className="flex gap-1 overflow-x-auto">
            {(
              [
                "all",
                "qualified",
                "pending",
                "inactive",
                "not-applicable",
              ] as const
            ).map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`tap-control whitespace-nowrap rounded-lg px-3 py-2 text-[9px] font-medium transition-[color,background-color,scale] duration-150 ease-out ${filter === item ? "bg-blue-200/[.08] text-blue-100 shadow-[inset_0_0_0_1px_rgba(168,192,255,.08)]" : "text-slate-600 hover:bg-white/[.025] hover:text-slate-300"}`}
              >
                {item === "all" ? "All referrals" : labels[item]}
              </button>
            ))}
          </div>
          <div className="relative lg:ml-auto lg:w-64">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-700" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search username or Discord ID"
              className="premium-input h-9 w-full rounded-xl pl-8 pr-3 text-[9px] text-white placeholder:text-slate-700"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left">
            <thead>
              <tr className="border-b border-white/[.05] text-[7px] font-bold uppercase tracking-[.16em] text-slate-700">
                <th className="px-5 py-3">Discord user</th>
                <th className="px-4 py-3">Discord ID</th>
                <th className="px-4 py-3">Registered</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-5 py-3 text-right">Commission</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-white/[.045] text-[9px] transition-[background-color] duration-100 ease-out last:border-0 hover:bg-blue-100/[.018]"
                >
                  <td className="px-5 py-4 font-semibold text-slate-300">
                    {row.user}
                  </td>
                  <td className="px-4 py-4 font-mono text-slate-600">
                    {row.id}
                  </td>
                  <td className="px-4 py-4 text-slate-500">{row.joined}</td>
                  <td className="px-4 py-4 text-slate-500">{row.plan}</td>
                  <td className="px-4 py-4">
                    <StatusBadge
                      status={row.status}
                      qualifies={row.qualifies}
                    />
                  </td>
                  <td
                    className={`px-5 py-4 text-right font-mono ${row.commission ? "text-emerald-300" : "text-slate-700"}`}
                  >
                    {row.commission ? `$${row.commission.toFixed(2)}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visible.length && (
            <div className="grid h-40 place-items-center text-[10px] text-slate-700">
              No referrals match this view.
            </div>
          )}
        </div>
      </section>
      <div className="mt-4 flex gap-2 text-[9px] leading-4 text-slate-600">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Pending referrals qualify after the refund window closes. Hover a
        pending status to see the exact qualification date.
      </div>
      {withdraw && (
        <WithdrawalRequestModal
          available={data.availableBalance}
          onClose={() => setWithdraw(false)}
        />
      )}
    </div>
  );
}
function Stat({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent: "green" | "amber" | "slate";
}) {
  return (
    <div
      className={`bg-[#071020] p-5 ${accent === "green" ? "text-teal-300" : accent === "amber" ? "text-blue-200" : "text-white"}`}
    >
      <p className="text-[8px] font-bold uppercase tracking-[.16em] text-slate-700">
        {label}
      </p>
      <p
        className={`display mt-3 text-3xl font-semibold tracking-[-.05em] ${accent === "green" ? "text-teal-300" : accent === "amber" ? "text-blue-200" : "text-white"}`}
      >
        {value}
      </p>
      <p className="mt-2 text-[9px] text-slate-600">{sub}</p>
    </div>
  );
}
function StatusBadge({
  status,
  qualifies,
}: {
  status: Status;
  qualifies?: string;
}) {
  const style =
    status === "qualified"
      ? "bg-emerald-400/[.08] text-emerald-300"
      : status === "pending"
        ? "bg-amber-400/[.08] text-amber-300"
        : status === "inactive"
          ? "bg-slate-400/[.07] text-slate-500"
          : "bg-red-400/[.07] text-red-400";
  return (
    <span className="group relative inline-flex">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[8px] font-semibold ${style}`}
      >
        {status === "pending" && <Clock3 className="h-2.5 w-2.5" />}
        {labels[status]}
      </span>
      {status === "pending" && (
        <span className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-20 hidden w-56 -translate-x-1/2 rounded-lg border border-white/10 bg-[#151b21] p-3 text-[8px] leading-4 text-slate-400 shadow-2xl group-hover:block">
          <strong className="block text-[9px] text-white">
            Qualification date
          </strong>
          {qualifies}
          <br />
          <span className="text-slate-600">If no refund is requested.</span>
        </span>
      )}
    </span>
  );
}
