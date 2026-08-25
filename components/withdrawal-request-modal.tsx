"use client";

import { useState } from "react";
import {
  Check,
  ChevronRight,
  Link2,
  LoaderCircle,
  Mail,
  WalletCards,
  X,
} from "lucide-react";

type ReferenceType = "email" | "paypal_me";

export function WithdrawalRequestModal({
  onClose,
  available,
}: {
  onClose: () => void;
  available: number;
}) {
  const [amount, setAmount] = useState(
    Math.max(30, Math.floor(available * 100) / 100).toFixed(2),
  );
  const [referenceType, setReferenceType] = useState<ReferenceType>("email");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState<number | null>(null);
  const [error, setError] = useState("");

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/affiliates/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          method: "paypal",
          referenceType,
          reference,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to request withdrawal");
      }
      setRequested(Number(data.amount));
    } catch (value) {
      setError(
        value instanceof Error ? value.message : "Unable to request withdrawal",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-[#01040c]/85 p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="withdrawal-title"
    >
      <div className="premium-panel page-enter w-full max-w-[440px] overflow-hidden rounded-[24px]">
        <header className="flex items-center justify-between border-b border-white/[.07] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="premium-icon h-9 w-9 rounded-[11px]">
              <WalletCards strokeWidth={1.5} className="h-[18px] w-[18px]" />
            </div>
            <div>
              <h2
                id="withdrawal-title"
                className="text-sm font-semibold text-white"
              >
                PayPal withdrawal
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Administrative review required
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
            className="tap-control grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition-[color,background-color,scale] duration-150 ease-out hover:bg-white/[.05] hover:text-slate-200 disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {requested !== null ? (
          <div className="px-6 py-8 text-center">
            <div className="mx-auto grid h-11 w-11 place-items-center rounded-[13px] bg-teal-300/[.07] text-teal-300 shadow-[0_0_0_1px_rgba(115,215,205,.16)]">
              <Check strokeWidth={2} className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">
              Request submitted
            </h3>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-400">
              Your ${requested.toFixed(2)} withdrawal is waiting for review. We
              will update its status once processed.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="ocean-secondary mt-6 h-10 rounded-xl px-5 text-sm font-medium text-slate-200"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="p-5">
            <div className="premium-card mb-5 flex items-end justify-between rounded-2xl px-4 py-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[.12em] text-slate-500">
                  Available
                </p>
                <p className="mt-1 text-xl font-semibold tracking-tight text-white">
                  ${available.toFixed(2)}
                </p>
              </div>
              <p className="pb-0.5 text-xs text-slate-500">Minimum $30.00</p>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-xs font-medium text-slate-300">
                  Amount
                </span>
                <div className="premium-input mt-2 flex h-11 items-center rounded-xl px-3">
                  <span className="mr-2 text-sm text-slate-500">$</span>
                  <input
                    type="number"
                    min="30"
                    max={available}
                    step="0.01"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    className="[appearance:textfield] h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <span className="text-xs text-slate-600">USD</span>
                </div>
              </label>

              <div>
                <span className="text-xs font-medium text-slate-300">
                  Payment method
                </span>
                <div className="premium-input mt-2 flex h-11 items-center justify-between rounded-xl px-3">
                  <span className="text-sm font-medium text-slate-200">
                    PayPal
                  </span>
                  <span className="rounded border border-white/[.08] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Only option
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-medium text-slate-300">
                  Send funds to
                </span>
                <div
                  className="mt-2 grid grid-cols-2 gap-2"
                  role="group"
                  aria-label="PayPal reference type"
                >
                  {(
                    [
                      ["email", Mail, "PayPal email"],
                      ["paypal_me", Link2, "PayPal.Me"],
                    ] as const
                  ).map(([value, Icon, label]) => {
                    const active = referenceType === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={active}
                        onClick={() => {
                          setReferenceType(value);
                          setReference("");
                        }}
                        className={`tap-control flex h-10 items-center justify-center gap-2 rounded-xl text-xs font-medium transition-[color,background-color,box-shadow,scale] duration-150 ease-out ${
                          active
                            ? "bg-blue-200/[.08] text-blue-100 shadow-[0_0_0_1px_rgba(168,192,255,.2)]"
                            : "bg-[#060d1b] text-slate-400 shadow-[0_0_0_1px_rgba(255,255,255,.08)] hover:bg-white/[.035] hover:text-slate-200"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="block">
                <span className="text-xs font-medium text-slate-300">
                  {referenceType === "email" ? "PayPal email" : "PayPal.Me URL"}
                </span>
                <input
                  type={referenceType === "email" ? "email" : "url"}
                  value={reference}
                  onChange={(event) => setReference(event.target.value)}
                  placeholder={
                    referenceType === "email"
                      ? "name@example.com"
                      : "https://paypal.me/username"
                  }
                  className="premium-input mt-2 h-11 w-full rounded-xl px-3 text-sm text-white placeholder:text-slate-700"
                />
              </label>
            </div>

            {error && (
              <p
                role="alert"
                className="mt-4 rounded-lg border border-red-400/15 bg-red-400/[.05] px-3 py-2.5 text-xs leading-5 text-red-300"
              >
                {error}
              </p>
            )}

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[.07] pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="tap-control h-10 rounded-lg px-3 text-sm font-medium text-slate-500 transition-[color,background-color,scale] duration-150 ease-out hover:bg-white/[.025] hover:text-slate-200 disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void submit()}
                disabled={
                  loading ||
                  Number(amount) < 30 ||
                  Number(amount) > available ||
                  !reference.trim()
                }
                className="ocean-primary flex h-10 min-w-40 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-35"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    Request withdrawal
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
