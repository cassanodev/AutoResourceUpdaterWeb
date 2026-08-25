"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import {
  Check,
  ChevronDown,
  FileCode2,
  Folder,
  History,
  LoaderCircle,
  LockKeyhole,
  Package,
  MousePointer2,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export function ProductPreview() {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panels = "[data-panel]";
      const preview = root.current?.querySelector<HTMLElement>(
        "[data-preview-window]",
      );
      const pointTo = (selector: string) => {
        const target = root.current?.querySelector<HTMLElement>(selector);
        if (!preview || !target) return { x: 0, y: 0 };
        const frame = preview.getBoundingClientRect();
        const bounds = target.getBoundingClientRect();
        return {
          x: bounds.left - frame.left + bounds.width / 2 - 1,
          y: bounds.top - frame.top + bounds.height / 2 - 1,
        };
      };
      gsap.set(panels, { autoAlpha: 0, y: 8 });
      gsap.set('[data-panel="details"]', { autoAlpha: 1, y: 0 });
      gsap.set("[data-pointer]", {
        ...pointTo("[data-resource]"),
        autoAlpha: 0,
      });
      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 0.4,
        repeatRefresh: true,
        defaults: { ease: "power2.out" },
      });
      tl.to(
        "[data-resource]",
        {
          backgroundColor: "rgba(125, 163, 255, 0.10)",
          color: "#f8fafc",
          duration: 0.35,
        },
        0.4,
      )
        .to("[data-pointer]", { autoAlpha: 1, duration: 0.35 }, 0.25)
        .to(
          "[data-pointer]",
          {
            x: () => pointTo("[data-update-button]").x,
            y: () => pointTo("[data-update-button]").y,
            duration: 0.7,
            ease: "power3.inOut",
          },
          1.3,
        )
        .to(
          "[data-update-button]",
          {
            scale: 0.94,
            backgroundColor: "rgba(125,163,255,.16)",
            duration: 0.15,
          },
          1.95,
        )
        .to("[data-update-button]", { scale: 1, duration: 0.18 }, 2.1)
        .to(
          '[data-panel="details"]',
          { autoAlpha: 0, y: -8, duration: 0.25 },
          2.25,
        )
        .to(
          '[data-panel="loading"]',
          { autoAlpha: 1, y: 0, duration: 0.25 },
          2.38,
        )
        .fromTo(
          "[data-progress]",
          { scaleX: 0 },
          { scaleX: 1, duration: 1.5, ease: "power1.inOut" },
          2.45,
        )
        .to(
          '[data-panel="loading"]',
          { autoAlpha: 0, y: -8, duration: 0.22 },
          4.05,
        )
        .to(
          '[data-panel="compare"]',
          { autoAlpha: 1, y: 0, duration: 0.3 },
          4.15,
        )
        .fromTo(
          "[data-diff-line]",
          { x: 8, autoAlpha: 1 },
          {
            x: 0,
            autoAlpha: 1,
            stagger: 0.06,
            duration: 0.2,
            clearProps: "transform",
          },
          4.35,
        )
        .to(
          "[data-apply]",
          {
            backgroundColor: "#46d39a",
            color: "#07130e",
            scale: 1.03,
            duration: 0.3,
          },
          5.8,
        )
        .to("[data-apply]", { scale: 1, duration: 0.15 }, 6.1)
        .to(
          '[data-panel="compare"]',
          { autoAlpha: 0, y: -8, duration: 0.25 },
          6.4,
        )
        .to('[data-panel="done"]', { autoAlpha: 1, y: 0, duration: 0.3 }, 6.55)
        .from(
          "[data-restore]",
          { scale: 0.94, autoAlpha: 0, duration: 0.45, ease: "back.out(1.5)" },
          6.7,
        )
        .to('[data-panel="done"]', { autoAlpha: 0, y: -8, duration: 0.25 }, 9)
        .set('[data-panel="details"]', { autoAlpha: 1, y: 0 })
        .set("[data-resource]", { clearProps: "backgroundColor,color" })
        .set("[data-pointer]", { autoAlpha: 0 })
        .call(
          () => gsap.set("[data-pointer]", pointTo("[data-resource]")),
          [],
          9.3,
        )
        .set("[data-progress]", { scaleX: 0 })
        .set("[data-apply]", { clearProps: "backgroundColor,color,scale" });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={root} className="mx-auto w-full max-w-[610px]">
      <div
        data-preview-window
        className="relative overflow-hidden rounded-[18px] bg-[#050b17] shadow-[inset_0_0_0_1px_rgba(255,255,255,.075),0_28px_80px_rgba(0,0,0,.35)]"
      >
        <div className="flex h-10 items-center border-b border-white/[.08] px-4">
          <div className="flex gap-1.5">
            <i className="h-2 w-2 rounded-full bg-white/15" />
            <i className="h-2 w-2 rounded-full bg-white/15" />
            <i className="h-2 w-2 rounded-full bg-blue-300/70" />
          </div>
          <span className="mx-auto font-mono text-[8px] text-slate-500">
            LIVE UPDATE WORKFLOW
          </span>
          <RefreshCw className="h-3 w-3 text-slate-500" />
        </div>
        <div className="grid min-h-[370px] grid-cols-[180px_1fr] sm:grid-cols-[205px_1fr]">
          <aside className="border-r border-white/[.07] bg-[#10161c] p-3">
            <p className="mb-3 text-[7px] font-bold uppercase tracking-[.2em] text-slate-500">
              Resource explorer
            </p>
            <Row icon={Folder} name="[standalone]" folder />
            <div className="pl-3">
              <div data-resource>
                <Row icon={Package} name="fm-garage" update />
              </div>
              <Row icon={Package} name="ox_lib" good />
              <Row icon={Package} name="screenshot-basic" good />
            </div>
            <Row icon={Folder} name="[jobs]" folder />
            <div className="pl-3">
              <Row icon={Package} name="police" />
              <Row icon={Package} name="ambulance" />
            </div>
          </aside>
          <main className="relative min-w-0 p-4 sm:p-5">
            <Panel name="details">
              <div className="flex items-start justify-between">
                <div>
                  <Label>1 · Select resource</Label>
                  <p className="mt-2 text-lg font-semibold text-white">
                    fm-garage
                  </p>
                  <p className="mt-1 text-[9px] text-blue-200">
                    Update available · v1.0.2
                  </p>
                </div>
                <button
                  data-update-button
                  className="rounded-lg bg-blue-300/[.08] px-3 py-2 text-[8px] text-blue-200 shadow-[0_0_0_1px_rgba(168,192,255,.16)]"
                >
                  Update resource
                </button>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Card label="CURRENT" value="v1.0.0" />
                <Card label="AVAILABLE" value="v1.0.2" green />
              </div>
              <Note icon={Sparkles} title="Ready to update">
                Configuration changes will be preserved.
              </Note>
            </Panel>
            <Panel name="loading">
              <div className="flex h-[310px] flex-col items-center justify-center text-center">
                <LoaderCircle className="h-7 w-7 animate-spin text-blue-200" />
                <Label>3 · Preparing update</Label>
                <p className="mt-3 text-base font-semibold text-white">
                  Analyzing resource files
                </p>
                <p className="mt-2 max-w-[250px] text-[9px] leading-5 text-slate-500">
                  Reading configuration and detecting protected assets…
                </p>
                <div className="mt-6 h-1 w-full max-w-[250px] overflow-hidden rounded-full bg-white/[.06]">
                  <div
                    data-progress
                    className="h-full origin-left rounded-full bg-gradient-to-r from-blue-300 to-teal-300"
                  />
                </div>
              </div>
            </Panel>
            <Panel name="compare">
              <div className="flex items-start justify-between">
                <div>
                  <Label>4 · Review changes</Label>
                  <p className="mt-2 text-base font-semibold text-white">
                    config.lua
                  </p>
                </div>
                <button
                  data-apply
                  className="rounded-md border border-emerald-400/20 bg-emerald-400/[.07] px-3 py-2 text-[8px] text-emerald-300"
                >
                  Apply update
                </button>
              </div>
              <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-lg border border-white/[.08] bg-[#090d11] font-mono text-[7px]">
                <CodeColumn
                  title="INSTALLED"
                  lines={[
                    "Config.Debug = false",
                    'Config.ApiKey = "live_key"',
                    "- Config.Locale = 'en'",
                  ]}
                />
                <CodeColumn
                  title="UPDATED"
                  green
                  lines={[
                    "Config.Debug = false",
                    'Config.ApiKey = "live_key"',
                    "+ Config.AutoSave = true",
                  ]}
                />
              </div>
              <p className="mt-3 flex items-center gap-2 text-[8px] text-slate-500">
                <FileCode2 className="h-3.5 w-3.5 text-emerald-400" />
                Your configured API key is preserved.
              </p>
            </Panel>
            <Panel name="done">
              <div className="flex h-[310px] flex-col items-center justify-center text-center">
                <div className="grid h-12 w-12 place-items-center rounded-full border border-emerald-400/20 bg-emerald-400/[.08]">
                  <Check className="h-5 w-5 text-emerald-300" />
                </div>
                <Label>5 · Update complete</Label>
                <p className="mt-3 text-lg font-semibold text-white">
                  fm-garage is up to date
                </p>
                <p className="mt-1 font-mono text-[9px] text-emerald-300">
                  v1.0.2
                </p>
                <div
                  data-restore
                  className="mt-6 flex w-full max-w-[280px] items-center gap-3 rounded-lg border border-emerald-400/15 bg-emerald-400/[.045] p-3 text-left"
                >
                  <History className="h-4 w-4 text-emerald-400" />
                  <div>
                    <p className="text-[9px] font-semibold text-slate-200">
                      Restore Point created
                    </p>
                    <p className="mt-1 text-[7px] text-slate-500">
                      Version v1.0.0 · just now
                    </p>
                  </div>
                  <LockKeyhole className="ml-auto h-3 w-3 text-slate-500" />
                </div>
              </div>
            </Panel>
          </main>
        </div>
        <div
          data-pointer
          className="pointer-events-none absolute left-0 top-0 z-20 opacity-0 drop-shadow-[0_3px_6px_rgba(0,0,0,.8)]"
        >
          <MousePointer2 className="h-5 w-5 fill-white text-[#151b22]" strokeWidth={1.4} />
        </div>
      </div>
    </div>
  );
}
function Panel({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <section
      data-panel={name}
      className={`absolute inset-4 sm:inset-5 ${name === "details" ? "visible opacity-100" : "invisible opacity-0"}`}
    >
      {children}
    </section>
  );
}
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 text-[7px] font-bold uppercase tracking-[.2em] text-blue-300 first:mt-0">
      {children}
    </p>
  );
}
function Note({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Sparkles;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4 rounded-lg border border-white/[.08] bg-white/[.025] p-3">
      <div className="flex items-center gap-2 text-[9px] text-slate-200">
        <Icon className="h-3.5 w-3.5 text-blue-300" />
        {title}
      </div>
      <p className="mt-2 text-[8px] text-slate-500">{children}</p>
    </div>
  );
}
function CodeColumn({
  title,
  lines,
  green = false,
}: {
  title: string;
  lines: string[];
  green?: boolean;
}) {
  return (
    <div className="min-w-0 border-r border-white/[.06] last:border-r-0">
      <p className="border-b border-white/[.06] px-2 py-2 text-[6px] font-bold tracking-[.15em] text-slate-500">
        {title}
      </p>
      <div className="space-y-1 p-2">
        {lines.map((line, i) => (
          <p
            data-diff-line
            key={line}
            className={`truncate rounded px-1.5 py-1.5 ${green && i === 2 ? "bg-emerald-400/[.12] text-emerald-300" : !green && i === 2 ? "bg-red-400/[.1] text-red-300" : "text-slate-300"}`}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
function Row({
  icon: Icon,
  name,
  folder,
  update,
  good,
}: {
  icon: typeof Folder;
  name: string;
  folder?: boolean;
  update?: boolean;
  good?: boolean;
}) {
  return (
    <div className="flex h-7 items-center gap-1.5 rounded px-1.5 text-[8px] text-slate-400">
      <span className="w-3">
        {folder && <ChevronDown className="h-3 w-3" />}
      </span>
      <Icon
        className={`h-3 w-3 ${folder || update ? "text-blue-300" : good ? "text-teal-300" : "text-slate-500"}`}
      />
      <span>{name}</span>
      {good && <Check className="ml-auto h-2.5 w-2.5 text-emerald-400" />}
      {update && (
        <span className="ml-auto font-mono text-[7px] text-blue-200">
          v1.0.2
        </span>
      )}
    </div>
  );
}
function Card({
  label,
  value,
  green,
}: {
  label: string;
  value: string;
  green?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-3 ${green ? "border-emerald-400/15 bg-emerald-400/[.05]" : "border-white/[.08] bg-white/[.025]"}`}
    >
      <p className="text-[6px] font-bold tracking-[.16em] text-slate-500">
        {label}
      </p>
      <p
        className={`mt-1.5 font-mono text-[10px] ${green ? "text-emerald-300" : "text-slate-200"}`}
      >
        {value}
      </p>
    </div>
  );
}
