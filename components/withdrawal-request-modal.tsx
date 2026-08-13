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
      className="fixed inset-0 z-[100] grid place-items-center bg-[#05070a]/80 p-5 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="withdrawal-title"
    >
      <div className="w-full max-w-[440px] overflow-hidden rounded-xl border border-white/[.09] bg-[#10151b] shadow-[0_24px_80px_rgba(0,0,0,.55)]">
        <header className="flex items-center justify-between border-b border-white/[.07] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg border border-white/[.08] bg-white/[.035] text-slate-300">
              <WalletCards className="h-[18px] w-[18px]" />
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
            className="grid h-8 w-8 place-items-center rounded-md text-slate-500 transition hover:bg-white/[.05] hover:text-slate-200 disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {requested !== null ? (
          <div className="px-6 py-8 text-center">
            <div className="mx-auto grid h-11 w-11 place-items-center rounded-full border border-amber-300/20 bg-amber-300/[.07] text-amber-200">
              <Check className="h-5 w-5" />
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
              className="mt-6 h-10 rounded-lg border border-white/[.1] bg-white/[.04] px-5 text-sm font-medium text-slate-200 transition hover:bg-white/[.07]"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="p-5">
            <div className="mb-5 flex items-end justify-between rounded-lg border border-white/[.07] bg-[#0b0f14] px-4 py-3">
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
                <div className="mt-2 flex h-11 items-center rounded-lg border border-white/[.1] bg-[#090d11] px-3 focus-within:border-amber-300/35">
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
                <div className="mt-2 flex h-11 items-center justify-between rounded-lg border border-white/[.1] bg-[#090d11] px-3">
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
                        className={`flex h-10 items-center justify-center gap-2 rounded-lg border text-xs font-medium transition ${
                          active
                            ? "border-amber-300/30 bg-amber-300/[.07] text-amber-100"
                            : "border-white/[.08] bg-[#090d11] text-slate-400 hover:border-white/[.14] hover:text-slate-200"
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
                  className="mt-2 h-11 w-full rounded-lg border border-white/[.1] bg-[#090d11] px-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-amber-300/35"
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
                className="h-10 px-2 text-sm font-medium text-slate-500 transition hover:text-slate-200 disabled:opacity-40"
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
                className="flex h-10 min-w-40 items-center justify-center gap-2 rounded-lg bg-amber-300 px-4 text-sm font-semibold text-[#171306] transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-35"
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
