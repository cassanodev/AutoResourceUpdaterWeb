"use client";
import { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  Check,
  Clock3,
  Copy,
  DollarSign,
  Info,
  Search,
  Users,
  X,
} from "lucide-react";
type Status = "qualified" | "pending" | "inactive" | "not-applicable";
const referrals = [
  {
    id: "1182947503019952148",
    user: "milo.dev",
    joined: "Jul 29, 2026",
    plan: "Lifetime",
    commission: 5,
    status: "qualified" as Status,
  },
  {
    id: "821406773908522004",
    user: "nora_scripts",
    joined: "Jul 31, 2026",
    plan: "Monthly",
    commission: 2,
    status: "pending" as Status,
    qualifies: "Aug 14, 2026 at 2:40 PM",
  },
  {
    id: "1062251480745336882",
    user: "westside.rp",
    joined: "Aug 1, 2026",
    plan: "Lifetime",
    commission: 5,
    status: "pending" as Status,
    qualifies: "Aug 15, 2026 at 11:18 AM",
  },
  {
    id: "490821773610729492",
    user: "franklinmods",
    joined: "Jul 22, 2026",
    plan: "Monthly",
    commission: 0,
    status: "inactive" as Status,
  },
  {
    id: "732915064129306634",
    user: "garage.lab",
    joined: "Jul 18, 2026",
    plan: "Refunded",
    commission: 0,
    status: "not-applicable" as Status,
  },
  {
    id: "1160038327594281061",
    user: "citycore",
    joined: "Jul 11, 2026",
    plan: "Lifetime",
    commission: 5,
    status: "qualified" as Status,
  },
];
const labels: Record<Status, string> = {
  qualified: "Qualified",
  pending: "Pending",
  inactive: "Inactive",
  "not-applicable": "Not applicable",
};
export function AffiliateDashboard() {
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [search, setSearch] = useState("");
  const [withdraw, setWithdraw] = useState(false);
  const [copied, setCopied] = useState(false);
  const referralCode = "WELCOME1";
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
    <div className="relative mx-auto max-w-[1240px] px-5 pb-20 pt-10 lg:px-8">
      <div className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[.2em] text-amber-400">
            Affiliate workspace
          </p>
          <h1 className="display mt-3 text-4xl font-bold tracking-[-.045em] text-white">
            Your referrals
          </h1>
          <p className="mt-2 text-[11px] text-slate-600">
            Track qualification windows, commissions, and payouts.
          </p>
        </div>
        <button
          onClick={() => setWithdraw(true)}
          className="sm:ml-auto flex h-10 items-center justify-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/[.08] px-4 text-[10px] font-semibold text-emerald-300 hover:bg-emerald-400/[.13]"
        >
          <ArrowDownToLine className="h-3.5 w-3.5" />
          Withdraw funds
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <Stat
          label="Available balance"
          value="$10.00"
          sub="Ready to withdraw"
          accent="green"
        />
        <Stat
          label="Pending balance"
          value="$7.00"
          sub="2 referrals in refund window"
          accent="amber"
        />
        <Stat
          label="Lifetime earned"
          value="$27.00"
          sub="Across 8 qualified referrals"
          accent="slate"
        />
      </div>
      <div className="mt-5 flex flex-col gap-3 rounded-xl border border-white/[.07] bg-[#0d1217] p-4 sm:flex-row sm:items-center">
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
          className="flex h-8 items-center justify-center gap-2 rounded-md border border-white/[.08] px-3 text-[9px] text-slate-400 hover:bg-white/[.04]"
        >
          {copied ? (
            <Check className="h-3 w-3 text-emerald-400" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          {copied ? "Copied" : "Copy code"}
        </button>
      </div>
      <section className="mt-5 overflow-hidden rounded-xl border border-white/[.07] bg-[#0d1217]">
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
                className={`whitespace-nowrap rounded-md px-3 py-2 text-[9px] font-medium ${filter === item ? "bg-white/[.08] text-white" : "text-slate-600 hover:text-slate-300"}`}
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
              className="h-9 w-full rounded-md border border-white/[.07] bg-[#080b0e] pl-8 pr-3 text-[9px] outline-none placeholder:text-slate-700 focus:border-amber-300/25"
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
                  className="border-b border-white/[.045] text-[9px] transition last:border-0 hover:bg-white/[.018]"
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
      {withdraw && <WithdrawModal onClose={() => setWithdraw(false)} />}
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
      className={`rounded-xl border p-5 ${accent === "green" ? "border-emerald-400/10 bg-emerald-400/[.035]" : accent === "amber" ? "border-amber-400/10 bg-amber-400/[.025]" : "border-white/[.07] bg-[#0d1217]"}`}
    >
      <p className="text-[8px] font-bold uppercase tracking-[.16em] text-slate-700">
        {label}
      </p>
      <p
        className={`display mt-3 text-3xl font-bold tracking-[-.04em] ${accent === "green" ? "text-emerald-300" : accent === "amber" ? "text-amber-300" : "text-white"}`}
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
function WithdrawModal({ onClose }: { onClose: () => void }) {
  const [requested, setRequested] = useState(false);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-5 backdrop-blur-sm">
      <div className="w-full max-w-[430px] rounded-2xl border border-white/[.09] bg-[#11171c] p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-400/[.08]">
            <DollarSign className="h-5 w-5 text-emerald-300" />
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-md hover:bg-white/[.05]"
          >
            <X className="h-4 w-4 text-slate-600" />
          </button>
        </div>
        {requested ? (
          <div className="py-6 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-400/[.08]">
              <Check className="h-5 w-5 text-emerald-300" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-white">
              Withdrawal requested
            </h2>
            <p className="mt-2 text-[10px] leading-5 text-slate-500">
              Your $10.00 payout request is now being reviewed.
            </p>
            <button
              onClick={onClose}
              className="mt-6 h-9 rounded-md border border-white/10 px-4 text-[9px] text-slate-300"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <h2 className="mt-5 text-lg font-semibold text-white">
              Withdraw available funds
            </h2>
            <p className="mt-2 text-[10px] leading-5 text-slate-500">
              Payouts are processed through the payment method connected to your
              affiliate account.
            </p>
            <div className="mt-5 rounded-lg border border-white/[.07] bg-[#0a0e12] p-4">
              <p className="text-[8px] uppercase tracking-[.15em] text-slate-700">
                Available
              </p>
              <p className="mt-2 font-mono text-xl text-emerald-300">$10.00</p>
            </div>
            <button
              onClick={() => setRequested(true)}
              className="mt-5 h-10 w-full rounded-md bg-emerald-400 text-[10px] font-bold text-[#07130e] hover:bg-emerald-300"
            >
              Request withdrawal
            </button>
          </>
        )}
      </div>
    </div>
  );
}
