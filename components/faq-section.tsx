import { ChevronDown, HelpCircle } from "lucide-react";

const questions = [
  [
    "How does it work?",
    "The app compares your installed resource with the new version, sends the readable files to our server for processing, and returns the prepared files for your review before anything is applied.",
  ],
  [
    "Are my files stored on your servers?",
    "No. Files are used only to process the requested update and are deleted immediately after processing. We do not keep a library of your resource files.",
  ],
  [
    "Will CFX Escrow encrypted resources work?",
    "Yes. Encrypted and protected files are never compared or decrypted. The app recognizes them and replaces them with the files supplied by the new resource version.",
  ],
  [
    "Will I lose my Restore Points if I cancel?",
    "No. Restore Points remain on your own machine. An active subscription is required to manage and restore them through the app.",
  ],
  [
    "Where are backups stored?",
    "Restore Points are stored locally inside your server's resources folder, keeping them under your control and close to the resource they belong to.",
  ],
  [
    "How many updates can I perform?",
    "There is no update limit while your plan or free trial is active.",
  ],
  [
    "How many servers can I connect?",
    "As many as you need. Auto Resource Updater does not impose a server limit.",
  ],
  [
    "Which resources support update notifications?",
    "Notifications are available for selected free and paid resources. Our team works every day to expand the number of resources that can be checked automatically.",
  ],
  [
    "Does the free trial require a credit card?",
    "No. The two-day free trial only requires signing in with your Discord account.",
  ],
] as const;

export function FaqSection() {
  return (
    <section id="faq" className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[.62fr_1.38fr] lg:gap-16">
        <div>
          <div className="premium-icon h-11 w-11 rounded-xl">
            <HelpCircle strokeWidth={1.5} className="h-5 w-5" />
          </div>
          <p className="ocean-kicker mt-6">Frequently asked questions</p>
          <h2 className="display mt-4 text-4xl font-semibold tracking-[-.05em] text-white">
            Clear answers before you update.
          </h2>
          <p className="mt-4 max-w-sm text-[13px] leading-7 text-slate-400">
            Your files, backups and server configuration matter. Here is exactly
            how the workflow handles them.
          </p>
        </div>
        <div className="space-y-2.5">
          {questions.map(([question, answer], index) => (
            <details
              key={question}
              className="group rounded-2xl bg-white/[.018] px-5 shadow-[0_0_0_1px_rgba(255,255,255,.065)] transition-[background-color,box-shadow] duration-150 ease-out open:bg-blue-200/[.028] open:shadow-[0_0_0_1px_rgba(168,192,255,.13)]"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-4.5 text-[11px] font-semibold text-slate-200 [&::-webkit-details-marker]:hidden">
                {question}
                <ChevronDown strokeWidth={1.5} className="h-4 w-4 shrink-0 text-blue-200/55 transition-transform duration-150 ease-out group-open:rotate-180" />
              </summary>
              <p className="max-w-2xl pb-5 pr-10 text-[11px] leading-6 text-slate-500">
                {answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
