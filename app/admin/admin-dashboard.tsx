"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminOverview, AdminUserResult } from "@/lib/external-api";
import {
  BadgeDollarSign,
  CreditCard,
  LoaderCircle,
  Search,
  ShieldCheck,
  UserCog,
  Users,
  X,
} from "lucide-react";
type Modal =
  | { kind: "affiliate" }
  | { kind: "balance"; id: string; name: string }
  | { kind: "admin" }
  | { kind: "withdraw"; id: number; action: "approve" | "reject" | "paid" }
  | null;
export function AdminDashboard({
  initialData,
}: {
  initialData: AdminOverview;
}) {
  const router = useRouter(),
    [data, setData] = useState(initialData),
    [tab, setTab] = useState<"users" | "affiliates" | "withdrawals" | "admins">(
      "users",
    ),
    [modal, setModal] = useState<Modal>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const refresh = async () => {
    const response = await fetch("/api/admin/overview", { cache: "no-store" });
    if (!response.ok) {
      if (response.status === 403) return router.replace("/");
      throw new Error("Unable to refresh administration");
    }
    setData(await response.json());
    router.refresh();
  };
  const mutate = async (path: string, body: unknown) => {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(path, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        }),
        result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Unable to complete action");
      await refresh();
      setModal(null);
    } catch (value) {
      setError(
        value instanceof Error ? value.message : "Unable to complete action",
      );
    } finally {
      setBusy(false);
    }
  };
  const navigation: Array<{
    id: "users" | "affiliates" | "withdrawals" | "admins";
    label: string;
    Icon: typeof Users;
  }> = [
    { id: "users", label: "Users", Icon: CreditCard },
    { id: "affiliates", label: "Affiliates", Icon: Users },
    { id: "withdrawals", label: "Withdrawals", Icon: BadgeDollarSign },
  ];
  if (data.identity.isOwner)
    navigation.push({ id: "admins", label: "Administrators", Icon: UserCog });
  return (
    <div className="mx-auto max-w-[1240px] px-5 pb-24 pt-8 lg:px-8">
      <header className="flex items-center justify-between border-b border-white/[.08] pb-7">
        <div className="flex items-center gap-4">
          <span className="grid h-11 w-11 place-items-center rounded-xl border border-amber-300/20 bg-amber-300/[.07]">
            <ShieldCheck className="h-5 w-5 text-amber-300" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-amber-400">
              Restricted workspace
            </p>
            <h1 className="mt-1 text-3xl font-bold text-white">
              Administration
            </h1>
          </div>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-xs capitalize text-slate-400">
          {data.identity.role}
        </span>
      </header>
      {error && (
        <p className="mt-5 rounded-lg border border-red-400/20 bg-red-400/[.06] p-3 text-sm text-red-300">
          {error}
        </p>
      )}
      <nav className="mt-7 flex gap-1 border-b border-white/[.08]">
        {navigation.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold ${tab === id ? "border-amber-300 text-white" : "border-transparent text-slate-500"}`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>
      {tab === "users" && <UserSubscriptions />}
      {tab === "affiliates" && (
        <section className="mt-6">
          <Section
            title="Affiliate accounts"
            text="Manage access, referral codes and balances."
            action="Assign affiliate"
            onAction={() => setModal({ kind: "affiliate" })}
          />
          <Table
            headers={["User", "Code", "Status", "Available", "Pending", ""]}
            rows={data.affiliates.map((item) => [
              <User key="u" name={item.discordUsername} id={item.discordId} />,
              <code key="c" className="text-amber-200">
                {item.referralCode}
              </code>,
              <Status key="s" value={item.status} />,
              Money(item.availableBalance),
              Money(item.pendingBalance),
              <div key="a" className="flex justify-end gap-2">
                <Small
                  onClick={() =>
                    setModal({
                      kind: "balance",
                      id: item.discordId,
                      name: item.discordUsername,
                    })
                  }
                >
                  Balance
                </Small>
                <Small
                  danger={item.status === "approved"}
                  onClick={() =>
                    void mutate("/api/admin/affiliates/status", {
                      targetDiscordId: item.discordId,
                      status:
                        item.status === "approved" ? "suspended" : "approved",
                      reason: "Changed in administration",
                    })
                  }
                >
                  {item.status === "approved" ? "Suspend" : "Approve"}
                </Small>
              </div>,
            ])}
          />
        </section>
      )}
      {tab === "withdrawals" && (
        <section className="mt-6">
          <Section
            title="Withdrawal requests"
            text="Review and record PayPal payouts."
          />
          <div className="space-y-3">
            {data.withdrawals.length ? (
              data.withdrawals.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col gap-4 rounded-xl border border-white/[.08] bg-[#0e1419] p-5 md:flex-row md:items-center"
                >
                  <div className="flex-1">
                    <User name={item.discordUsername} id={item.discordId} />
                    <p className="mt-2 text-xs text-slate-500">
                      {destination(item.destination)}
                    </p>
                  </div>
                  <strong className="font-mono text-xl text-white">
                    {Money(item.amount)}
                  </strong>
                  <Status value={item.status} />
                  <div className="flex gap-2">
                    {item.status === "pending" && (
                      <>
                        <Small
                          onClick={() =>
                            setModal({
                              kind: "withdraw",
                              id: item.id,
                              action: "approve",
                            })
                          }
                        >
                          Approve
                        </Small>
                        <Small
                          danger
                          onClick={() =>
                            setModal({
                              kind: "withdraw",
                              id: item.id,
                              action: "reject",
                            })
                          }
                        >
                          Reject
                        </Small>
                      </>
                    )}
                    {item.status === "processing" && (
                      <Small
                        onClick={() =>
                          setModal({
                            kind: "withdraw",
                            id: item.id,
                            action: "paid",
                          })
                        }
                      >
                        Mark paid
                      </Small>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <Empty />
            )}
          </div>
        </section>
      )}
      {tab === "admins" && data.identity.isOwner && (
        <section className="mt-6">
          <Section
            title="Administrators"
            text="Only environment owners can change this list."
            action="Add administrator"
            onAction={() => setModal({ kind: "admin" })}
          />
          <Table
            headers={["User", "Discord ID", "Added by", "Status", ""]}
            rows={data.admins.map((item) => [
              item.discordUsername,
              <code key="id">{item.discordId}</code>,
              <code key="by">{item.addedBy}</code>,
              <Status key="s" value={item.active ? "active" : "removed"} />,
              <div key="a" className="text-right">
                <Small
                  danger={item.active}
                  onClick={() =>
                    void mutate("/api/admin/admins", {
                      targetDiscordId: item.discordId,
                      active: !item.active,
                    })
                  }
                >
                  {item.active ? "Remove" : "Restore"}
                </Small>
              </div>,
            ])}
          />
        </section>
      )}
      {modal && (
        <AdminModal
          modal={modal}
          busy={busy}
          close={() => setModal(null)}
          submit={mutate}
        />
      )}
    </div>
  );
}
function UserSubscriptions() {
  const [discordId, setDiscordId] = useState(""), [user, setUser] = useState<AdminUserResult | null>(null), [plan, setPlan] = useState<"weekly" | "monthly" | "six_months" | "yearly">("monthly"), [busy, setBusy] = useState(false), [error, setError] = useState("");
  const request = async (path: string, body: unknown) => {
    const response = await fetch(path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Unable to complete action");
    return result;
  };
  const find = async () => { setBusy(true); setError(""); try { const result = await request("/api/admin/users/find", { targetDiscordId: discordId.trim() }); setUser(result.user); } catch (value) { setUser(null); setError(value instanceof Error ? value.message : "Unable to find user"); } finally { setBusy(false); } };
  const update = async (action: "assign" | "revoke") => { if (!user) return; setBusy(true); setError(""); try { await request("/api/admin/users/subscription", { targetDiscordId: user.discordId, action, plan: action === "assign" ? plan : undefined, reason: "Changed in web administration" }); const result = await request("/api/admin/users/find", { targetDiscordId: user.discordId }); setUser(result.user); } catch (value) { setError(value instanceof Error ? value.message : "Unable to update subscription"); } finally { setBusy(false); } };
  const plans = [{ id: "weekly", label: "7 days", price: "$4.99" }, { id: "monthly", label: "1 month", price: "$9.99" }, { id: "six_months", label: "6 months", price: "$44.99" }, { id: "yearly", label: "1 year", price: "$79.99" }] as const;
  return <section className="mt-6"><Section title="User subscriptions" text="Find an account by its exact Discord ID and manage its access." /><div className="rounded-2xl border border-cyan-200/[.1] bg-[#071426]/75 p-5 shadow-[inset_0_1px_rgba(255,255,255,.035)]"><div className="flex gap-3"><label className="relative flex-1"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input value={discordId} onChange={event => setDiscordId(event.target.value.replace(/\D/g, ""))} onKeyDown={event => { if (event.key === "Enter") void find(); }} placeholder="Discord ID" className="h-11 w-full rounded-xl border border-white/10 bg-[#040b18] pl-10 pr-4 text-sm text-white outline-none focus:border-cyan-200/30" /></label><button disabled={busy || discordId.length < 5} onClick={() => void find()} className="rounded-xl bg-cyan-100 px-5 text-xs font-bold text-[#03111b] disabled:opacity-40">{busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Find account"}</button></div>{error && <p className="mt-4 rounded-lg border border-red-400/20 bg-red-400/[.06] p-3 text-sm text-red-300">{error}</p>}{user && <div className="mt-6 border-t border-white/[.07] pt-6"><div className="flex flex-wrap items-start justify-between gap-4"><User name={user.discordUsername} id={user.discordId} /><div className="text-right"><p className="text-[10px] uppercase tracking-wider text-slate-500">Current access</p><p className="mt-1 text-sm font-semibold capitalize text-cyan-100">{user.subscription ? `${user.subscription.plan.replaceAll("_", " ")} · ${user.subscription.status}` : user.trial?.status === "active" ? "Free trial" : "No active plan"}</p>{user.subscription?.endsAt && <p className="mt-1 text-xs text-slate-500">Until {new Date(user.subscription.endsAt).toLocaleDateString()}</p>}</div></div><div className="mt-6 grid grid-cols-4 gap-3">{plans.map(item => <button key={item.id} onClick={() => setPlan(item.id)} className={`rounded-xl border p-4 text-left transition ${plan === item.id ? "border-cyan-200/30 bg-cyan-200/[.07]" : "border-white/[.08] bg-white/[.02] hover:border-white/[.14]"}`}><span className="block text-sm font-semibold text-white">{item.label}</span><span className="mt-1 block text-xs text-slate-500">{item.price}</span></button>)}</div><div className="mt-5 flex justify-end gap-3"><button disabled={busy || !user.subscription} onClick={() => void update("revoke")} className="rounded-lg border border-red-400/20 px-4 py-2.5 text-xs font-semibold text-red-300 disabled:opacity-35">Revoke access</button><button disabled={busy} onClick={() => void update("assign")} className="flex min-w-40 items-center justify-center gap-2 rounded-lg bg-cyan-100 px-4 py-2.5 text-xs font-bold text-[#03111b]">{busy && <LoaderCircle className="h-4 w-4 animate-spin" />}Assign plan</button></div></div>}</div></section>;
}
function AdminModal({
  modal,
  busy,
  close,
  submit,
}: {
  modal: NonNullable<Modal>;
  busy: boolean;
  close: () => void;
  submit: (path: string, body: unknown) => Promise<void>;
}) {
  const [operation, setOperation] = useState<"add" | "remove" | "set">("add");
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));
    if (modal.kind === "affiliate")
      return void submit("/api/admin/affiliates/status", {
        targetDiscordId: form.discordId,
        targetUsername: form.username,
        referralCode: form.referralCode || undefined,
        status: "approved",
        reason: "Approved in administration",
      });
    if (modal.kind === "admin")
      return void submit("/api/admin/admins", {
        targetDiscordId: form.discordId,
        targetUsername: form.username,
        active: true,
      });
    if (modal.kind === "balance")
      return void submit("/api/admin/balances", {
        targetDiscordId: modal.id,
        operation,
        amount: Number(form.amount),
        reason: form.reason,
      });
    return void submit("/api/admin/withdrawals/review", {
      withdrawalId: modal.id,
      action: modal.action,
      reason: modal.action === "reject" ? form.detail : undefined,
      providerReference: modal.action === "paid" ? form.detail : undefined,
    });
  };
  const title =
    modal.kind === "affiliate"
      ? "Assign affiliate"
      : modal.kind === "admin"
        ? "Add administrator"
        : modal.kind === "balance"
          ? `Manage ${modal.name} balance`
          : modal.action === "reject"
            ? "Reject withdrawal"
            : modal.action === "paid"
              ? "Mark as paid"
              : "Approve withdrawal";
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/75 p-5 backdrop-blur-sm">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-xl border border-white/[.1] bg-[#11171d] p-6"
      >
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button type="button" onClick={close}>
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>
        {modal.kind === "balance" && (
          <div className="mt-5 grid grid-cols-3 gap-2">
            {(["add", "remove", "set"] as const).map((value) => (
              <button
                type="button"
                key={value}
                onClick={() => setOperation(value)}
                className={`h-10 rounded-lg border text-xs capitalize ${operation === value ? "border-amber-300/30 bg-amber-300/[.07] text-amber-200" : "border-white/10 text-slate-500"}`}
              >
                {value}
              </button>
            ))}
          </div>
        )}
        {(modal.kind === "affiliate" || modal.kind === "admin") && (
          <>
            <Input name="discordId" label="Discord ID" required />
            <Input name="username" label="Discord username (optional)" />
            {modal.kind === "affiliate" && (
              <Input
                name="referralCode"
                label="Custom referral code (optional)"
              />
            )}
          </>
        )}
        {modal.kind === "balance" && (
          <>
            <Input name="amount" label="Amount (USD)" type="number" required />
            <Input name="reason" label="Reason" required />
          </>
        )}
        {modal.kind === "withdraw" && modal.action !== "approve" && (
          <Input
            name="detail"
            label={
              modal.action === "reject"
                ? "Rejection reason"
                : "PayPal transaction ID"
            }
            required
          />
        )}
        <button
          disabled={busy}
          className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-amber-300 text-sm font-bold text-[#17120a] disabled:opacity-40"
        >
          {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Confirm"}
        </button>
      </form>
    </div>
  );
}
function Input({
  name,
  label,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="mt-4 block text-xs text-slate-300">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        min={type === "number" ? 0 : undefined}
        step={type === "number" ? ".01" : undefined}
        className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-[#090d11] px-3 text-sm text-white outline-none [appearance:textfield] focus:border-amber-300/30 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
    </label>
  );
}
function Section({
  title,
  text,
  action,
  onAction,
}: {
  title: string;
  text: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        <h2 className="font-semibold text-white">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{text}</p>
      </div>
      {action && (
        <button
          onClick={onAction}
          className="rounded-lg bg-amber-300 px-4 py-2.5 text-xs font-bold text-[#17120a]"
        >
          {action}
        </button>
      )}
    </div>
  );
}
function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="overflow-auto rounded-xl border border-white/[.08] bg-[#0e1419]">
      <table className="w-full min-w-[850px] text-left text-sm">
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="border-b border-white/[.07] p-4 text-[10px] uppercase tracking-wider text-slate-600"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/[.05] last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="p-4 text-slate-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function User({ name, id }: { name: string; id: string }) {
  return (
    <div>
      <strong className="text-white">{name}</strong>
      <span className="mt-1 block font-mono text-xs text-slate-600">{id}</span>
    </div>
  );
}
function Status({ value }: { value: string }) {
  return (
    <span className="rounded-full border border-white/10 px-2 py-1 text-xs capitalize text-slate-400">
      {value}
    </span>
  );
}
function Small({
  children,
  onClick,
  danger = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md border px-3 py-2 text-xs font-semibold ${danger ? "border-red-400/20 text-red-300" : "border-white/10 text-slate-300"}`}
    >
      {children}
    </button>
  );
}
const Money = (value: number) => `$${Number(value || 0).toFixed(2)}`;
function destination(
  value: AdminOverview["withdrawals"][number]["destination"],
) {
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    return parsed?.reference || "Destination not provided";
  } catch {
    return "Destination not provided";
  }
}
function Empty() {
  return (
    <div className="rounded-xl border border-dashed border-white/10 p-10 text-center text-sm text-slate-600">
      Nothing to review.
    </div>
  );
}
