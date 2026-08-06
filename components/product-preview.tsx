import {
  Check,
  ChevronDown,
  FileCode2,
  Folder,
  History,
  LockKeyhole,
  Package,
  RefreshCw,
} from "lucide-react";
export function ProductPreview() {
  return (
    <div className="mx-auto w-full max-w-[610px] overflow-hidden rounded-2xl border border-white/[.09] bg-[#0b0f13] shadow-[0_40px_120px_rgba(0,0,0,.55)]">
      <div className="flex h-10 items-center border-b border-white/[.07] px-4">
        <div className="flex gap-1.5">
          <i className="h-2 w-2 rounded-full bg-white/10" />
          <i className="h-2 w-2 rounded-full bg-white/10" />
          <i className="h-2 w-2 rounded-full bg-amber-400/60" />
        </div>
        <span className="mx-auto font-mono text-[8px] text-slate-600">
          RESOURCE WORKSPACE
        </span>
        <RefreshCw className="h-3 w-3 text-slate-600" />
      </div>
      <div className="grid min-h-[360px] grid-cols-[190px_1fr] sm:grid-cols-[205px_1fr]">
        <aside className="border-r border-white/[.06] bg-[#0e1318] p-3">
          <p className="mb-3 text-[7px] font-bold uppercase tracking-[.2em] text-slate-700">
            Resource explorer
          </p>
          <Row icon={Folder} name="[standalone]" folder />
          <div className="pl-3">
            <Row icon={Package} name="fm-garage" update />
            <Row icon={Package} name="ox_lib" good />
            <Row icon={Package} name="screenshot-basic" good />
          </div>
          <Row icon={Folder} name="[jobs]" folder />
          <div className="pl-3">
            <Row icon={Package} name="police" />
            <Row icon={Package} name="ambulance" />
          </div>
        </aside>
        <main className="p-4 sm:p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[7px] font-bold uppercase tracking-[.2em] text-amber-400">
                Resource details
              </p>
              <p className="mt-2 text-lg font-semibold text-white">fm-garage</p>
              <p className="mt-1 text-[9px] text-amber-300">
                Update available · v1.0.2
              </p>
            </div>
            <button className="rounded-md border border-white/10 bg-white/[.04] px-3 py-2 text-[8px] text-slate-300">
              Review update
            </button>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <Card label="CURRENT" value="v2.8.1" />
            <Card label="AVAILABLE" value="v2.8.3" green />
          </div>
          <div className="mt-3 rounded-lg border border-white/[.07] bg-white/[.02] p-3">
            <div className="flex items-center gap-2 text-[9px] text-slate-300">
              <FileCode2 className="h-3.5 w-3.5 text-amber-400" />
              Configuration-aware update
            </div>
            <div className="mt-3 space-y-1.5 font-mono text-[8px]">
              <p className="rounded bg-white/[.025] px-2 py-1.5 text-slate-600">
                Config.Debug = false
              </p>
              <p className="rounded bg-emerald-400/[.08] px-2 py-1.5 text-emerald-300">
                Config.ApiKey = &quot;preserved&quot;
              </p>
              <p className="rounded bg-emerald-400/[.08] px-2 py-1.5 text-emerald-300">
                + Config.NewOption = true
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-400/10 bg-emerald-400/[.035] p-3">
            <History className="h-3.5 w-3.5 text-emerald-400" />
            <p className="text-[8px] leading-4 text-slate-500">
              A Restore Point is created before files change.
            </p>
            <LockKeyhole className="ml-auto h-3 w-3 text-slate-600" />
          </div>
        </main>
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
    <div className="flex h-7 items-center gap-1.5 rounded px-1.5 text-[8px] text-slate-500">
      <span className="w-3">
        {folder && <ChevronDown className="h-3 w-3" />}
      </span>
      <Icon
        className={`h-3 w-3 ${folder || update ? "text-amber-400" : good ? "text-emerald-400" : "text-slate-600"}`}
      />
      <span>{name}</span>
      {good && <Check className="ml-auto h-2.5 w-2.5 text-emerald-400" />}
      {update && (
        <span className="ml-auto font-mono text-[7px] text-amber-300">
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
      className={`rounded-lg border p-3 ${green ? "border-emerald-400/10 bg-emerald-400/[.035]" : "border-white/[.06] bg-white/[.02]"}`}
    >
      <p className="text-[6px] font-bold tracking-[.16em] text-slate-700">
        {label}
      </p>
      <p
        className={`mt-1.5 font-mono text-[10px] ${green ? "text-emerald-300" : "text-slate-300"}`}
      >
        {value}
      </p>
    </div>
  );
}
