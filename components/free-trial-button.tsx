"use client";
import { useMemo, useState } from "react";
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
      {open && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/75 p-5 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="trial-title"
            className="w-full max-w-[450px] rounded-2xl border border-white/[.12] bg-[#151d24] p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between">
              <div className="grid h-11 w-11 place-items-center rounded-xl border border-amber-300/20 bg-amber-400/10">
                <Sparkles className="h-5 w-5 text-amber-300" />
              </div>
              <button
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white/[.06]"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>
            {success ? (
              <div className="py-5 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-400/10">
                  <Check className="h-5 w-5 text-emerald-300" />
                </div>
                <h2
                  id="trial-title"
                  className="mt-5 text-xl font-semibold text-white"
                >
                  Your free trial is active
                </h2>
                <p className="mt-3 text-[10px] leading-5 text-slate-400">
                  You now have access to every feature until{" "}
                  {confirmedExpiry || expires}.
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="mt-6 h-10 rounded-lg bg-emerald-400 px-5 text-[9px] font-bold text-[#07130e]"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <p className="mt-6 text-[9px] font-bold uppercase tracking-[.18em] text-amber-400">
                  Confirm free trial
                </p>
                <h2
                  id="trial-title"
                  className="mt-3 text-xl font-semibold text-white"
                >
                  Start your two-day trial?
                </h2>
                <p className="mt-3 text-[10px] leading-5 text-slate-400">
                  You will receive full access to every Auto Resource Updater
                  feature until:
                </p>
                <div className="mt-4 rounded-xl border border-white/[.08] bg-[#0b1014] p-4 text-[10px] font-semibold text-slate-200">
                  {expires}
                </div>
                <p className="mt-3 text-[9px] text-slate-500">
                  No card is required and you will not be charged automatically.
                </p>
                {error && (
                  <p className="mt-4 rounded-lg bg-red-400/[.07] p-3 text-[9px] text-red-300">
                    {error}
                  </p>
                )}
                <div className="mt-6 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setOpen(false)}
                    className="h-10 rounded-lg border border-white/[.1] text-[9px] text-slate-300"
                  >
                    Not now
                  </button>
                  <button
                    onClick={() => void confirm()}
                    disabled={loading}
                    className="flex h-10 items-center justify-center gap-2 rounded-lg bg-amber-300 text-[9px] font-bold text-[#17120a] disabled:opacity-50"
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
        </div>
      )}
    </>
  );
}
