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
    <div className="premium-panel rounded-[26px] p-2">
      <div className="overflow-hidden rounded-[18px] bg-[#040b19]/80 shadow-[0_0_0_1px_rgba(255,255,255,.065)]">
        <div className="flex items-center justify-between border-b border-white/[.07] px-4 py-3">
          <span className="text-[11px] font-semibold text-slate-300">
            10-file update
          </span>
          <span
            className={`text-[10px] font-semibold ${complete ? "text-teal-300" : "text-blue-200"}`}
          >
            {complete
              ? "Ready to review"
              : `Processing ${Math.min(index + 1, files.length)} of ${files.length}`}
          </span>
        </div>
        <div className="grid gap-px bg-white/[.045] sm:grid-cols-2">
          {files.map((file, fileIndex) => (
            <div
              key={file}
              className={`flex items-center gap-2 bg-[#071020] px-3 py-2.5 text-[10px] transition-[color,background-color] duration-150 ease-out ${fileIndex < index ? "text-slate-300" : "text-slate-600"}`}
            >
              <span
                className={`grid h-5 w-5 place-items-center rounded-md ${fileIndex < index ? "bg-teal-300/[.08]" : "bg-white/[.025]"}`}
              >
                {fileIndex < index ? (
                  <Check strokeWidth={2} className="h-3 w-3 text-teal-300" />
                ) : (
                  <FileCode2 strokeWidth={1.5} className="h-3 w-3" />
                )}
              </span>
              <span className="truncate">{file}</span>
            </div>
          ))}
        </div>
        <div className="h-0.5 bg-white/[.04]">
          <div
            className="h-full origin-left bg-gradient-to-r from-blue-300 to-teal-300 transition-[width] duration-500 ease-out"
            style={{ width: `${Math.min((index / files.length) * 100, 100)}%` }}
          />
        </div>
      </div>
      <div className="grid gap-px overflow-hidden rounded-b-[18px] bg-white/[.055] sm:grid-cols-2">
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
      className={`bg-[#071020] p-4 ${highlight ? "text-teal-300" : "text-slate-400"}`}
    >
      <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400">
        <Icon
          strokeWidth={1.5}
          className={`h-4 w-4 ${highlight ? "text-teal-300" : "text-slate-500"}`}
        />
        {label}
      </div>
      <p
        className={`display mt-3 text-3xl font-semibold tracking-[-.04em] ${highlight ? "text-teal-300" : "text-white"}`}
      >
        {value}
      </p>
    </div>
  );
}
