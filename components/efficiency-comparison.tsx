"use client";
import { useEffect, useState } from "react";
import { Check, Clock3, FileCode2, Sparkles } from "lucide-react";

const files = [
  "config/config.lua",
  "server/apiKeys.lua",
  "client/main.lua",
  "shared/settings.lua",
  "server/database.lua",
  "client/notifications.lua",
  "modules/inventory.lua",
  "locales/en.lua",
  "web/settings.json",
  "fxmanifest.lua",
];
export function EfficiencyComparison() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(
      () => setIndex((value) => (value >= files.length ? 0 : value + 1)),
      500,
    );
    return () => clearInterval(timer);
  }, []);
  const complete = index >= files.length;
  return (
    <div className="rounded-2xl border border-white/[.09] bg-[#0d1217] p-5 shadow-[0_28px_80px_rgba(0,0,0,.2)] sm:p-6">
      <div className="overflow-hidden rounded-xl border border-white/[.08] bg-[#090d11]">
        <div className="flex items-center justify-between border-b border-white/[.07] px-4 py-3">
          <span className="text-xs font-semibold text-slate-300">
            10-file update
          </span>
          <span
            className={`text-xs font-semibold ${complete ? "text-emerald-300" : "text-amber-200"}`}
          >
            {complete
              ? "Ready to review"
              : `Processing ${Math.min(index + 1, files.length)} of ${files.length}`}
          </span>
        </div>
        <div className="grid gap-px bg-white/[.05] sm:grid-cols-2">
          {files.map((file, fileIndex) => (
            <div
              key={file}
              className={`flex items-center gap-2 bg-[#0c1115] px-3 py-2.5 text-xs transition duration-300 ${fileIndex < index ? "text-slate-300" : "text-slate-600"}`}
            >
              <span
                className={`grid h-5 w-5 place-items-center rounded ${fileIndex < index ? "bg-emerald-400/10" : "bg-white/[.03]"}`}
              >
                {fileIndex < index ? (
                  <Check className="h-3 w-3 text-emerald-400" />
                ) : (
                  <FileCode2 className="h-3 w-3" />
                )}
              </span>
              <span className="truncate">{file}</span>
            </div>
          ))}
        </div>
        <div className="h-1 bg-white/[.04]">
          <div
            className="h-full bg-amber-300 transition-[width] duration-500"
            style={{ width: `${Math.min((index / files.length) * 100, 100)}%` }}
          />
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Time icon={Clock3} label="Manual comparison" value="30+ min" />
        <Time
          icon={Sparkles}
          label="Auto Resource Updater"
          value="~15 sec"
          highlight
        />
      </div>
    </div>
  );
}
function Time({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: typeof Clock3;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${highlight ? "border-emerald-400/20 bg-emerald-400/[.05]" : "border-white/[.07] bg-[#090d11]"}`}
    >
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Icon
          className={`h-4 w-4 ${highlight ? "text-emerald-400" : "text-slate-500"}`}
        />
        {label}
      </div>
      <p
        className={`display mt-3 text-3xl font-bold ${highlight ? "text-emerald-300" : "text-white"}`}
      >
        {value}
      </p>
    </div>
  );
}
