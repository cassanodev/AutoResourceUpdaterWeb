"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronLeft,
  LoaderCircle,
  LockKeyhole,
  Tag,
} from "lucide-react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { DiscordLogin } from "@/components/discord-login";
import { discountedTotal, type Plan } from "@/lib/billing";

export function Checkout({
  plan,
  authenticated,
  paypalClientId,
}: {
  plan: Plan;
  authenticated: boolean;
  paypalClientId: string;
}) {
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<{
    code: string;
    percentage: number;
    type?: "discount" | "referral";
    affiliate?: { discordUsername?: string };
  } | null>(null);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const discount = applied?.percentage || 0,
    total = discountedTotal(plan.price, discount);
  const apply = async () => {
    setChecking(true);
    setMessage("");
    try {
      const response = await fetch("/api/billing/discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, plan: plan.id }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Unable to validate code");
      if (!data.valid) {
        setApplied(null);
        setMessage(
          data.error || "This discount or referral code is not valid.",
        );
      } else {
        setApplied({
          code: data.code,
          percentage: data.discountPercentage,
          type: data.type,
          affiliate: data.affiliate,
        });
        setCode(data.code);
        setMessage(
          data.type === "referral"
            ? `${data.discountPercentage}% referral discount from ${data.affiliate?.discordUsername || "an affiliate partner"}.`
            : `${data.discountPercentage}% discount applied.`,
        );
      }
    } catch (error) {
      setApplied(null);
      setMessage(
        error instanceof Error ? error.message : "Unable to validate code",
      );
    } finally {
      setChecking(false);
    }
  };
  if (success)
    return (
      <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-[720px] place-items-center px-5 pb-20">
        <div className="w-full rounded-2xl border border-emerald-400/20 bg-[#121a20] p-10 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-400/10">
            <Check className="h-6 w-6 text-emerald-300" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold text-white">
            Subscription approved
          </h1>
          <p className="mt-3 text-base text-slate-300">
            PayPal is confirming your subscription. Your account will update
            automatically.
          </p>
          <Link
            href="/account"
            prefetch={false}
            className="mt-7 inline-flex h-11 items-center rounded-lg bg-emerald-400 px-5 text-sm font-bold text-[#07130e]"
          >
            Open my account
          </Link>
        </div>
      </section>
    );
  return (
    <section className="mx-auto max-w-[980px] px-5 pb-24 pt-10 lg:px-8">
      <Link
        href="/#pricing"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to pricing
      </Link>
      <div className="mt-7 grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-amber-400">
            Review your order
          </p>
          <h1 className="display mt-3 text-4xl font-bold text-white">
            Complete your membership
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-300">
            Review the renewal period, apply a discount and confirm the terms
            before opening PayPal.
          </p>
          <article className="mt-8 rounded-2xl border border-white/[.1] bg-[#131a21] p-6">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs uppercase tracking-[.14em] text-slate-500">
                  Selected plan
                </p>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  {plan.name}
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                  Full access to updates and Restore Points.
                </p>
                <p className="mt-2 text-sm font-medium text-amber-200">
                  {plan.renewal} until cancelled.
                </p>
              </div>
              <p className="font-mono text-2xl font-semibold text-white">
                ${plan.price.toFixed(2)}
              </p>
            </div>
            <div className="mt-6 border-t border-white/[.08] pt-5">
              <label className="text-sm font-semibold text-slate-200">
                Discount or referral code
              </label>
              <div className="mt-2 flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.toUpperCase());
                      if (
                        applied &&
                        e.target.value.toUpperCase() !== applied.code
                      )
                        setApplied(null);
                    }}
                    maxLength={32}
                    placeholder="WELCOME"
                    className="h-11 w-full rounded-lg border border-white/[.1] bg-[#0a0f13] pl-10 pr-3 text-sm uppercase tracking-[.1em] text-white outline-none focus:border-amber-300/40"
                  />
                </div>
                <button
                  onClick={() => void apply()}
                  disabled={checking || !code.trim()}
                  className="h-11 min-w-20 rounded-lg border border-white/[.12] px-4 text-sm font-semibold text-slate-100 hover:bg-white/[.06] disabled:opacity-40"
                >
                  {checking ? (
                    <LoaderCircle className="mx-auto h-4 w-4 animate-spin" />
                  ) : (
                    "Apply"
                  )}
                </button>
              </div>
              {message && (
                <p
                  className={`mt-2 text-sm ${applied ? "text-emerald-300" : "text-red-300"}`}
                >
                  {message}
                </p>
              )}
            </div>
          </article>
        </div>
        <aside className="rounded-2xl border border-white/[.1] bg-[#151d24] p-6 shadow-2xl">
          <h2 className="text-base font-semibold text-white">Order summary</h2>
          <div className="mt-5 space-y-3 border-b border-white/[.08] pb-5 text-sm">
            <div className="flex justify-between text-slate-300">
              <span>{plan.name} subscription</span>
              <span>${plan.price.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-300">
                <span>Discount ({discount}%)</span>
                <span>-${(plan.price - total).toFixed(2)}</span>
              </div>
            )}
          </div>
          <div className="flex items-end justify-between py-5">
            <div>
              <span className="text-sm font-semibold text-slate-200">
                Due today
              </span>
              <p className="mt-1 text-xs text-slate-500">
                Then {plan.renewal.toLowerCase()}
              </p>
            </div>
            <span className="font-mono text-3xl font-semibold text-white">
              ${total.toFixed(2)}
            </span>
          </div>
          <label className="mb-5 flex cursor-pointer items-start gap-3 rounded-xl border border-white/[.09] bg-white/[.025] p-4">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(event) => setTermsAccepted(event.target.checked)}
              className="mt-0.5 h-4 w-4 accent-amber-300"
            />
            <span className="text-sm leading-6 text-slate-300">
              I have read and agree to the{" "}
              <Link
                href="/terms"
                target="_blank"
                className="font-semibold text-amber-200 underline decoration-amber-300/30 underline-offset-2"
              >
                Terms &amp; Conditions
              </Link>
              , including automatic renewal and cancellation terms.
            </span>
          </label>
          {!authenticated ? (
            <div className="rounded-xl border border-[#5865f2]/25 bg-[#5865f2]/[.07] p-4 text-center">
              <p className="text-sm leading-6 text-slate-200">
                Sign in with Discord before continuing to payment.
              </p>
              <DiscordLogin
                callbackUrl={`/checkout?plan=${plan.id}`}
                className="mt-4 w-full"
              />
            </div>
          ) : (
            <PaymentOptions
              plan={plan}
              code={applied?.code || ""}
              clientId={paypalClientId}
              disabled={!termsAccepted}
              onSuccess={() => setSuccess(true)}
            />
          )}
          {!termsAccepted && authenticated && (
            <p className="mt-3 text-center text-xs text-slate-400">
              Accept the terms above to enable PayPal.
            </p>
          )}
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
            <LockKeyhole className="h-3.5 w-3.5" />
            Secure PayPal checkout
          </p>
        </aside>
      </div>
    </section>
  );
}

function PaymentOptions({
  plan,
  code,
  clientId,
  disabled,
  onSuccess,
}: {
  plan: Plan;
  code: string;
  clientId: string;
  disabled: boolean;
  onSuccess: () => void;
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (!clientId)
    return (
      <p className="rounded-lg bg-red-400/[.08] p-3 text-sm text-red-300">
        PayPal is not configured.
      </p>
    );
  return (
    <div>
      {busy && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-[#2790c3]/20 bg-[#2790c3]/[.08] px-3 py-2 text-sm text-[#8fd5f5]">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Preparing your secure subscription…
        </div>
      )}
      <PayPalScriptProvider
        options={{
          clientId,
          currency: "USD",
          vault: true,
          intent: "subscription",
        }}
      >
        <PayPalButtons
          disabled={disabled}
          fundingSource="paypal"
          style={{
            layout: "horizontal",
            color: "blue",
            shape: "pill",
            height: 44,
            label: "subscribe",
          }}
          forceReRender={[plan.id, code, disabled]}
          onClick={() => {
            setError("");
            setBusy(true);
          }}
          createSubscription={async () => {
            const response = await fetch("/api/paypal/subscriptions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                plan: plan.id,
                discountCode: code,
                termsAccepted: true,
              }),
            });
            const data = await response.json();
            if (!response.ok)
              throw new Error(data.error || "Unable to create subscription");
            return data.id;
          }}
          onApprove={async () => {
            setBusy(false);
            onSuccess();
          }}
          onCancel={() => setBusy(false)}
          onError={(value) => {
            setBusy(false);
            setError(value instanceof Error ? value.message : String(value));
          }}
        />
      </PayPalScriptProvider>
      {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
    </div>
  );
}
