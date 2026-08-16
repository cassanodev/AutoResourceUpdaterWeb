import {
  ArrowRight,
  Check,
  FileCode2,
  Folder,
  FolderOpen,
  GitBranch,
  History,
  Package,
  PencilLine,
  ShieldCheck,
  SkipForward,
  UploadCloud,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Select your server path",
    text: "Choose the resources folder once. The app remembers your workspace for the next session.",
    visual: PathVisual,
  },
  {
    number: "02",
    title: "Choose a resource",
    text: "Move through your real folder hierarchy and select exactly what you want to update.",
    visual: ResourceVisual,
  },
  {
    number: "03",
    title: "Provide the update",
    text: "Connect a GitHub repository for recurring updates or drop a new resource folder whenever you need it.",
    visual: SourceVisual,
  },
  {
    number: "04",
    title: "Shape the final result",
    text: "See your installation, the incoming update and the prepared result together. Exclude or edit anything before applying.",
    visual: CompareVisual,
  },
  {
    number: "05",
    title: "Update with a way back",
    text: "When you apply, the previous state becomes a local Restore Point automatically. Nothing is lost by surprise.",
    visual: RestoreVisual,
  },
] as const;

export function WorkflowSteps() {
  return (
    <div className="workflow-ledger ocean-glass relative mt-16 overflow-hidden rounded-[28px]">
      <div className="hidden grid-cols-[74px_.72fr_1.28fr] gap-8 border-b border-white/[.07] px-8 py-4 text-[7px] font-bold uppercase tracking-[.18em] text-slate-600 lg:grid">
        <span>Step</span>
        <span>What you do</span>
        <span>What you see</span>
      </div>
      <div>
        {steps.map((step, index) => {
          const Visual = step.visual;
          return (
            <article
              key={step.number}
              className="workflow-row relative grid gap-7 border-b border-white/[.065] p-5 last:border-b-0 sm:p-7 lg:grid-cols-[74px_.72fr_1.28fr] lg:items-center lg:gap-8 lg:px-8 lg:py-9"
            >
              <div className="relative hidden self-stretch lg:block">
                <span className="relative z-10 grid h-9 w-9 place-items-center rounded-full border border-blue-200/15 bg-[#0a1731] font-mono text-[8px] tracking-[.12em] text-blue-200/75">
                  {step.number}
                </span>
                {index < steps.length - 1 && (
                  <span className="absolute bottom-[-36px] left-[17px] top-9 w-px bg-gradient-to-b from-blue-200/20 to-blue-200/[.04]" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-3 lg:hidden">
                  <span className="font-mono text-[9px] tracking-[.18em] text-blue-200/70">
                    {step.number}
                  </span>
                  <span className="h-px w-10 bg-gradient-to-r from-blue-200/50 to-transparent" />
                </div>
                <h3 className="display mt-4 max-w-sm text-2xl font-bold tracking-[-.035em] text-white lg:mt-0 lg:text-[28px]">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-sm text-[11px] leading-6 text-slate-400">
                  {step.text}
                </p>
              </div>
              <div className="workflow-evidence relative min-w-0 overflow-hidden rounded-2xl border border-blue-100/[.08] bg-[#050e22]/55 p-4 sm:p-5">
                <div className="pointer-events-none absolute inset-y-8 left-0 w-px bg-gradient-to-b from-transparent via-blue-200/35 to-transparent" />
                <Visual />
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function PathVisual() {
  return (
    <div className="flex min-h-40 flex-col justify-center">
      <p className="ocean-label">Server workspace</p>
      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-cyan-200/15 bg-cyan-200/[.045] p-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan-200/[.08]">
          <FolderOpen className="h-4 w-4 text-cyan-200" />
        </span>
        <div className="min-w-0">
          <p className="text-[8px] text-slate-500">Selected folder</p>
          <p className="mt-1 truncate font-mono text-[9px] text-slate-200">
            D:\FiveM\server-data\resources
          </p>
        </div>
        <Check className="ml-auto h-4 w-4 shrink-0 text-teal-300" />
      </div>
      <div className="mt-3 flex items-center gap-2 text-[8px] text-slate-500">
        <span className="h-1.5 w-1.5 rounded-full bg-teal-300 shadow-[0_0_10px_rgba(94,234,212,.8)]" />
        105 resources ready
      </div>
    </div>
  );
}

function ResourceVisual() {
  return (
    <div className="min-h-40">
      <p className="ocean-label">Resource explorer</p>
      <div className="mt-3 space-y-1 rounded-2xl border border-white/[.06] bg-[#06131c]/55 p-2">
        <TreeRow name="[standalone]" folder />
        <TreeRow name="ox_lib" good inset />
        <TreeRow name="lb-phone" update inset />
        <TreeRow name="screenshot-basic" good inset />
      </div>
    </div>
  );
}

function TreeRow({
  name,
  folder,
  good,
  update,
  inset,
}: {
  name: string;
  folder?: boolean;
  good?: boolean;
  update?: boolean;
  inset?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl px-3 py-2.5 ${inset ? "ml-4" : ""} ${update ? "border border-cyan-200/15 bg-cyan-200/[.06]" : "border border-transparent"}`}
    >
      {folder ? (
        <Folder className="h-3.5 w-3.5 text-cyan-200" />
      ) : (
        <Package
          className={`h-3.5 w-3.5 ${update ? "text-cyan-200" : "text-teal-300"}`}
        />
      )}
      <span className="text-[9px] text-slate-300">{name}</span>
      {good && <Check className="ml-auto h-3 w-3 text-teal-300" />}
      {update && (
        <span className="ml-auto font-mono text-[7px] text-cyan-200">
          v2.8.3 available
        </span>
      )}
    </div>
  );
}

function SourceVisual() {
  return (
    <div className="grid min-h-40 gap-3 sm:grid-cols-2">
      <div className="flex flex-col rounded-2xl border border-cyan-200/15 bg-cyan-200/[.04] p-4">
        <GitBranch className="h-5 w-5 text-cyan-200" />
        <p className="mt-5 text-[10px] font-semibold text-white">
          GitHub repository
        </p>
        <p className="mt-2 truncate font-mono text-[7px] text-slate-500">
          github.com/owner/resource
        </p>
        <p className="mt-auto flex items-center gap-1.5 pt-5 text-[7px] text-teal-300">
          <Check className="h-3 w-3" /> Connected
        </p>
      </div>
      <div className="grid place-items-center rounded-2xl border border-dashed border-white/[.13] bg-white/[.018] p-4 text-center">
        <div>
          <UploadCloud className="mx-auto h-6 w-6 text-slate-400" />
          <p className="mt-4 text-[10px] font-semibold text-white">
            Drop a folder
          </p>
          <p className="mt-2 text-[7px] text-slate-500">One-time update</p>
        </div>
      </div>
    </div>
  );
}

function CompareVisual() {
  const columns = [
    {
      title: "YOUR INSTALLATION",
      note: "Your values",
      lines: ["Debug = false", "Locale = 'en'", "Webhook = '••••'"],
    },
    {
      title: "INCOMING UPDATE",
      note: "New code",
      lines: ["Debug = true", "+ AutoSave = true", "Webhook = ''"],
    },
    {
      title: "FINAL RESULT",
      note: "Ready to apply",
      lines: ["Debug = false", "+ AutoSave = true", "Webhook = '••••'"],
      final: true,
    },
  ];
  return (
    <div className="min-h-40">
      <div className="grid gap-2 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch">
        {columns.map((column, index) => (
          <div key={column.title} className="contents">
            <div
              className={`min-w-0 rounded-xl border p-3 ${column.final ? "border-teal-300/20 bg-teal-300/[.055]" : "border-white/[.07] bg-[#06131c]/60"}`}
            >
              <p className="text-[6px] font-bold tracking-[.14em] text-slate-500">
                {column.title}
              </p>
              <p className="mt-1 text-[7px] text-slate-600">{column.note}</p>
              <div className="mt-3 space-y-1 font-mono text-[6px]">
                {column.lines.map((line, lineIndex) => (
                  <p
                    key={line}
                    className={`truncate rounded px-1.5 py-1.5 ${column.final && lineIndex === 1 ? "bg-teal-300/[.1] text-teal-200" : "text-slate-400"}`}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
            {index < columns.length - 1 && (
              <ArrowRight className="mx-auto h-3.5 w-3.5 self-center text-cyan-200/40 max-md:rotate-90" />
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="ocean-chip">
          <SkipForward className="h-3 w-3" /> Exclude a file
        </span>
        <span className="ocean-chip">
          <PencilLine className="h-3 w-3" /> Edit the result
        </span>
        <span className="ocean-chip text-teal-200">
          <FileCode2 className="h-3 w-3" /> Configuration preserved
        </span>
      </div>
    </div>
  );
}

function RestoreVisual() {
  return (
    <div className="flex min-h-40 flex-col justify-center">
      <div className="relative rounded-2xl border border-teal-300/15 bg-teal-300/[.04] p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-300/[.08]">
            <ShieldCheck className="h-4 w-4 text-teal-200" />
          </span>
          <div>
            <p className="text-[10px] font-semibold text-white">
              Update applied safely
            </p>
            <p className="mt-1 text-[7px] text-slate-500">v2.8.1 → v2.8.3</p>
          </div>
          <Check className="ml-auto h-4 w-4 text-teal-300" />
        </div>
        <div className="mt-4 flex items-center gap-3 border-t border-white/[.06] pt-4">
          <History className="h-4 w-4 text-cyan-200" />
          <div>
            <p className="text-[8px] font-medium text-slate-300">
              Restore Point created
            </p>
            <p className="mt-1 text-[7px] text-slate-600">
              Previous version · stored locally
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
