"use client";
import { useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft, LoaderCircle, LockKeyhole } from "lucide-react";
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

  return (
    <section className="relative isolate min-h-[calc(100svh-76px)] overflow-hidden px-5 py-14 lg:px-8">
      <CheckoutBackdrop />

      {success ? (
        <div className="relative z-10 mx-auto grid min-h-[60vh] max-w-[520px] place-items-center">
          <div className="premium-panel page-enter w-full rounded-[26px] p-8 text-center sm:p-10">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-[14px] bg-teal-300/[.08] text-teal-300 shadow-[0_0_0_1px_rgba(115,215,205,.16)]">
              <Check strokeWidth={2} className="h-5 w-5" />
            </div>
            <h1 className="display mt-6 text-[28px] font-semibold tracking-[-.04em] text-white">
              Subscription approved
            </h1>
            <p className="mx-auto mt-3 max-w-[320px] text-[12.5px] leading-6 text-slate-400">
              PayPal is confirming your subscription. Your account will update
              automatically.
            </p>
            <Link
              href="/account"
              prefetch={false}
              className="ocean-primary mt-8 inline-flex h-11 items-center justify-center rounded-xl px-7 text-[11px] font-bold"
            >
              Open my account
            </Link>
          </div>
        </div>
      ) : (
        <div className="page-enter relative z-10 mx-auto max-w-[520px]">
          <Link
            href="/#pricing"
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 transition-colors duration-150 hover:text-slate-300"
          >
            <ChevronLeft strokeWidth={1.5} className="h-3.5 w-3.5" />
            Back to pricing
          </Link>

          <div className="mt-6 text-center">
            <p className="ocean-kicker">Checkout</p>
            <h1 className="display mt-4 text-[32px] font-semibold leading-[1.05] tracking-[-.05em] text-white sm:text-[40px]">
              Complete your membership
            </h1>
          </div>

          <div className="premium-panel mt-8 rounded-[26px] p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="ocean-label">Selected plan</p>
                <h2 className="display mt-1.5 text-xl font-bold text-white">
                  {plan.name}
                </h2>
              </div>
              <div className="text-right">
                <p className="font-mono text-2xl font-semibold leading-none text-white">
                  ${plan.price.toFixed(2)}
                </p>
                <p className="mt-1 text-[10px] text-slate-500">{plan.suffix}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <input
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  if (applied && e.target.value.toUpperCase() !== applied.code)
                    setApplied(null);
                }}
                maxLength={32}
                placeholder="Discount code"
                className="premium-input h-11 min-w-0 flex-1 rounded-xl px-3.5 text-[13px] tracking-[.03em] text-white placeholder:text-slate-600"
              />
              <button
                onClick={() => void apply()}
                disabled={checking || !code.trim()}
                className="ocean-secondary h-11 min-w-[76px] rounded-xl text-[11px] font-semibold text-slate-200 disabled:opacity-40"
              >
                {checking ? (
                  <LoaderCircle className="mx-auto h-3.5 w-3.5 animate-spin" />
                ) : (
                  "Apply"
                )}
              </button>
            </div>
            {message && (
              <p
                className={`mt-2.5 text-[11.5px] ${
                  applied ? "text-teal-300" : "text-red-300/90"
                }`}
              >
                {message}
              </p>
            )}

            <div className="mt-7 space-y-2.5 border-t border-white/[.07] pt-6 text-[13px]">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono">${plan.price.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-teal-300">
                  <span>Discount ({discount}%)</span>
                  <span className="font-mono">
                    -${(plan.price - total).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex items-baseline justify-between border-t border-white/[.07] pt-3.5">
                <span className="text-[12.5px] font-semibold text-white">
                  Total due today
                </span>
                <span className="font-mono text-[26px] font-semibold text-white">
                  ${total.toFixed(2)}
                </span>
              </div>
              <p className="!mt-1 text-right text-[10.5px] text-slate-600">
                then {plan.renewal.toLowerCase()}
              </p>
            </div>

            <label className="premium-card mt-6 flex cursor-pointer items-start gap-2.5 rounded-2xl p-3.5">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(event) => setTermsAccepted(event.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 accent-[#81a7ff]"
              />
              <span className="text-[11.5px] leading-5 text-slate-400">
                I agree to the{" "}
                <Link
                  href="/terms"
                  target="_blank"
                  className="font-medium text-cyan-200 underline decoration-cyan-300/30 underline-offset-2 hover:text-cyan-100"
                >
                  Terms &amp; Conditions
                </Link>
                , including automatic renewal.
              </span>
            </label>

            <div className="mt-6">
              {!authenticated ? (
                <div className="rounded-2xl bg-[#5865f2]/[.08] p-4 text-center shadow-[0_0_0_1px_rgba(127,140,255,.2)]">
                  <p className="text-[12px] leading-5 text-slate-300">
                    Sign in with Discord to continue.
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
            </div>

            <p className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-slate-600">
              <LockKeyhole className="h-3 w-3" />
              Secure PayPal checkout
            </p>
          </div>
        </div>
      )}
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
      <p className="rounded-lg border border-red-400/20 bg-red-400/[.08] p-3 text-[12px] text-red-300">
        PayPal is not configured.
      </p>
    );
  return (
    <div>
      {busy && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-[#2790c3]/20 bg-[#2790c3]/[.08] px-3 py-2 text-[11.5px] text-[#8fd5f5]">
          <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
          Preparing your subscription…
        </div>
      )}
      <div className="overflow-hidden rounded-xl">
        <PayPalScriptProvider
          options={{
            clientId,
            currency: "USD",
            vault: true,
            intent: "subscription",
            components: "buttons",
            "enable-funding": "card,venmo",
          }}
        >
          <PayPalButtons
            disabled={disabled}
            style={{
              layout: "vertical",
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
      </div>
      {error && <p className="mt-2 text-[12px] text-red-300/90">{error}</p>}
    </div>
  );
}

function CheckoutBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10"
      aria-hidden="true"
    >
      <div className="absolute left-1/2 top-10 h-px w-[min(900px,90vw)] -translate-x-1/2 bg-gradient-to-r from-transparent via-blue-200/20 to-transparent" />
      <div className="absolute bottom-12 left-1/2 h-px w-[min(620px,70vw)] -translate-x-1/2 bg-gradient-to-r from-transparent via-teal-200/10 to-transparent" />
    </div>
  );
}
