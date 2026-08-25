"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CalendarX2, LoaderCircle, X } from "lucide-react";

export function CancelRenewalButton({
  accessUntil,
}: {
  accessUntil?: string | null;
}) {
  const [open, setOpen] = useState(false),
    [loading, setLoading] = useState(false),
    [error, setError] = useState("");
  const router = useRouter();
  const formatted = accessUntil
    ? new Date(accessUntil).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "the end of your current billing period";
  const cancel = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/subscription/cancel-renewal", {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Unable to cancel renewal");
      setOpen(false);
      router.refresh();
    } catch (value) {
      setError(
        value instanceof Error ? value.message : "Unable to cancel renewal",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
      className="tap-control inline-flex h-10 items-center gap-2 rounded-xl bg-red-400/[.045] px-4 text-xs font-semibold text-red-200/80 shadow-[0_0_0_1px_rgba(248,113,113,.13)] transition-[color,background-color,box-shadow,scale] duration-150 ease-out hover:bg-red-400/[.075] hover:text-red-200 hover:shadow-[0_0_0_1px_rgba(248,113,113,.22)]"
      >
        <CalendarX2 className="h-4 w-4" />
        Cancel renewal
      </button>
      {open && (
        <div
        className="fixed inset-0 z-[100] grid place-items-center bg-[#01040c]/85 p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-renewal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !loading)
              setOpen(false);
          }}
        >
        <div className="premium-panel page-enter w-full max-w-md rounded-[24px] p-6">
            <div className="flex items-start justify-between gap-4">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-red-400/[.055] text-red-300 shadow-[0_0_0_1px_rgba(248,113,113,.14)]">
              <AlertTriangle strokeWidth={1.5} className="h-5 w-5" />
              </div>
              <button
                type="button"
                aria-label="Close"
                disabled={loading}
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-white/[.05] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <h2
              id="cancel-renewal-title"
              className="mt-5 text-xl font-semibold text-white"
            >
              Cancel automatic renewal?
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              PayPal will stop future charges. You will keep full access until{" "}
              <strong className="text-white">{formatted}</strong>.
            </p>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              This does not refund the current period and cannot be undone from
              this screen.
            </p>
            {error && (
              <p className="mt-4 rounded-lg bg-red-400/[.08] p-3 text-sm text-red-300">
                {error}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={() => setOpen(false)}
                className="h-10 rounded-lg border border-white/[.1] px-4 text-sm font-semibold text-slate-200 hover:bg-white/[.05]"
              >
                Keep renewal
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => void cancel()}
                className="flex h-10 min-w-36 items-center justify-center gap-2 rounded-lg bg-red-400 px-4 text-sm font-bold text-[#1a0909] hover:bg-red-300 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Cancelling…
                  </>
                ) : (
                  "Confirm cancellation"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
