import { ChevronDown, HelpCircle } from "lucide-react";

const questions = [
  ["How does it work?", "The app compares your installed resource with the new version, sends the readable files to our server for processing, and returns the prepared files for your review before anything is applied."],
  ["Are my files stored on your servers?", "No. Files are used only to process the requested update and are deleted immediately after processing. We do not keep a library of your resource files."],
  ["Will CFX Escrow encrypted resources work?", "Yes. Encrypted and protected files are never compared or decrypted. The app recognizes them and replaces them with the files supplied by the new resource version."],
  ["Will I lose my Restore Points if I cancel?", "No. Restore Points remain on your own machine. An active subscription is required to manage and restore them through the app."],
  ["Where are backups stored?", "Restore Points are stored locally inside your server's resources folder, keeping them under your control and close to the resource they belong to."],
  ["How many updates can I perform?", "There is no update limit while your plan or free trial is active."],
  ["How many servers can I connect?", "As many as you need. Auto Resource Updater does not impose a server limit."],
  ["Which resources support update notifications?", "Notifications are available for selected free and paid resources. Our team works every day to expand the number of resources that can be checked automatically."],
  ["Does the free trial require a credit card?", "No. The two-day free trial only requires signing in with your Discord account."],
] as const;

export function FaqSection() {
  return <section id="faq" className="border-t border-white/[.06]">
    <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-24 lg:grid-cols-[.65fr_1.35fr] lg:px-8">
      <div>
        <div className="grid h-11 w-11 place-items-center rounded-xl border border-amber-300/20 bg-amber-400/[.08]"><HelpCircle className="h-5 w-5 text-amber-300" /></div>
        <p className="mt-6 text-[9px] font-bold uppercase tracking-[.22em] text-amber-400">Frequently asked questions</p>
        <h2 className="display mt-4 text-4xl font-bold tracking-[-.045em] text-white">Clear answers before you update.</h2>
        <p className="mt-4 max-w-sm text-[12px] leading-6 text-slate-500">Your files, backups and server configuration matter. Here is exactly how the workflow handles them.</p>
      </div>
      <div className="divide-y divide-white/[.07] border-y border-white/[.07]">
        {questions.map(([question, answer], index) => <details key={question} className="group py-1" open={index === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-[11px] font-semibold text-slate-200 [&::-webkit-details-marker]:hidden">{question}<ChevronDown className="h-4 w-4 shrink-0 text-slate-600 transition group-open:rotate-180" /></summary>
          <p className="max-w-2xl pb-5 pr-10 text-[10px] leading-6 text-slate-500">{answer}</p>
        </details>)}
      </div>
    </div>
  </section>;
}
