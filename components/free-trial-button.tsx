"use client";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Check, LoaderCircle, Sparkles, X } from "lucide-react";
import { signIn } from "next-auth/react";
export function FreeTrialButton({
  authenticated,
  className = "",
  callbackUrl = "/account",
}: {
  authenticated: boolean;
  className?: string;
  callbackUrl?: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [confirmedExpiry, setConfirmedExpiry] = useState("");
  const expires = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date.toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }, [open]);
  const confirm = async () => {
    if (!authenticated) {
      void signIn("discord", { redirectTo: callbackUrl });
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/trial/start", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to start trial");
      if (data.expiresAt)
        setConfirmedExpiry(
          new Date(data.expiresAt).toLocaleString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }),
        );
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to start trial");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          setError("");
          setSuccess(false);
        }}
        className={className}
      >
        <Sparkles className="h-4 w-4" />
        Start 2-day free trial
      </button>
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[100] grid place-items-center bg-[#01040c]/85 p-5">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="trial-title"
              className="premium-panel page-enter w-full max-w-[440px] rounded-[24px] p-7"
            >
              <div className="flex items-start justify-between">
                <div className="premium-icon h-11 w-11 rounded-xl">
                  <Sparkles className="h-5 w-5 text-cyan-200" />
                </div>
                <button
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-white/[.06] hover:text-slate-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {success ? (
                <div className="py-4 text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-[14px] bg-teal-300/[.08] shadow-[0_0_0_1px_rgba(115,215,205,.16)]">
                    <Check className="h-5 w-5 text-teal-300" />
                  </div>
                  <h2
                    id="trial-title"
                    className="display mt-6 text-2xl font-bold tracking-[-.03em] text-white"
                  >
                    Your free trial is active
                  </h2>
                  <p className="mx-auto mt-3 max-w-[300px] text-[12.5px] leading-6 text-slate-400">
                    You now have access to every feature until{" "}
                    <span className="text-slate-300">
                      {confirmedExpiry || expires}
                    </span>
                    .
                  </p>
                  <button
                    onClick={() => setOpen(false)}
                    className="ocean-primary mt-7 inline-flex h-11 w-full items-center justify-center rounded-xl text-[11px] font-bold"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <p className="ocean-kicker mt-6">Confirm free trial</p>
                  <h2
                    id="trial-title"
                    className="display mt-3 text-2xl font-bold tracking-[-.03em] text-white"
                  >
                    Start your two-day trial?
                  </h2>
                  <p className="mt-3 text-[12.5px] leading-6 text-slate-400">
                    You will receive full access to every Auto Resource
                    Updater feature until:
                  </p>
                  <div className="premium-card mt-4 rounded-2xl p-4 text-[12.5px] font-semibold text-slate-200">
                    {expires}
                  </div>
                  <p className="mt-3 text-[11px] text-slate-500">
                    No card is required and you will not be charged
                    automatically.
                  </p>
                  {error && (
                    <p className="mt-4 rounded-lg border border-red-400/20 bg-red-400/[.08] p-3 text-[11.5px] text-red-300">
                      {error}
                    </p>
                  )}
                  <div className="mt-6 grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => setOpen(false)}
                      className="ocean-secondary h-11 rounded-xl text-[11px] font-semibold text-slate-200"
                    >
                      Not now
                    </button>
                    <button
                      onClick={() => void confirm()}
                      disabled={loading}
                      className="ocean-primary flex h-11 items-center justify-center gap-2 rounded-xl text-[11px] font-bold disabled:opacity-50"
                    >
                      {loading ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : authenticated ? (
                        "Start free trial"
                      ) : (
                        "Continue with Discord"
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
