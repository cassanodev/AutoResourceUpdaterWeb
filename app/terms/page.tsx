import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, TriangleAlert } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms for Auto Resource Updater subscriptions, resource processing, security and Restore Points.",
  alternates: { canonical: "/terms" },
};
const sections = [
  [
    "1. The service",
    "Auto Resource Updater helps compare, prepare and apply third-party resource updates. It may preserve detected configuration values, identify protected files and create local Restore Points. Automated results can be incomplete or incorrect. You are responsible for reviewing the code and final prepared files before applying any update, testing changes in a safe environment and operating your server.",
  ],
  [
    "2. Accounts and account security",
    "A Discord account is required for trials, subscriptions and account management. You must keep access to that account secure and notify us of suspected unauthorized use. Accounts, subscriptions and access credentials may not be sold, sublicensed or shared publicly.",
  ],
  [
    "3. File processing and privacy",
    "Readable files submitted for an update are transmitted to our server only to perform the requested processing. They are not added to a permanent resource library and are deleted immediately after processing. Encrypted, binary and CFX Escrow-protected files are not decrypted or inspected and may be replaced with files supplied by the selected update.",
  ],
  [
    "4. Third-party code and malicious updates",
    "Resources and updates come from third parties that we do not control. In rare cases, an update may contain malicious, insecure, infringing or otherwise harmful code. Auto Resource Updater does not currently guarantee malware or vulnerability detection. You must review code, verify the source and test updates before production use. We intend to develop additional detection and security features, but future functionality, release dates and detection accuracy are not guaranteed.",
  ],
  [
    "5. Restore Points and independent backups",
    "Restore Points are stored locally in your server resources folder. They are not cloud backups and we cannot recover them if the device, drive or folder is lost, deleted, corrupted or damaged. You must maintain independent backups. Cancelling a subscription does not intentionally delete Restore Points, although active access may be required to manage them through the app.",
  ],
  [
    "6. Free trial",
    "The two-day free trial does not require a payment card and does not automatically become a paid plan. It is limited to one trial per eligible user. We may refuse or revoke trials associated with abuse, duplicate accounts, fraud or attempts to bypass eligibility rules.",
  ],
  [
    "7. Paid plans, renewals and cancellation",
    "Paid plans provide access for 7 days at $4.99, 1 month at $9.99, 6 months at $44.99 or 1 year at $79.99, before discounts or applicable taxes. Each plan renews automatically through PayPal at the same interval until cancelled. You authorize recurring charges when approving the PayPal subscription. Cancellation stops future renewals and access normally continues through the paid period. Prices, renewal frequency and discounts are displayed again before payment.",
  ],
  [
    "8. Refunds, reversals and taxes",
    "Except where applicable law requires otherwise or a separate written refund policy states otherwise, completed subscription charges are non-refundable once the paid access period begins. You are responsible for applicable taxes. Fraudulent payments, chargebacks, reversals or unresolved payment disputes may result in immediate suspension while the payment is investigated.",
  ],
  [
    "9. Acceptable use",
    "You may process only files and resources you are authorized to use. You may not infringe intellectual property, bypass encryption or escrow protections, distribute malware, attack or overload the service, automate abusive traffic, evade access restrictions, reverse engineer protected portions of the application, or interfere with another user's access.",
  ],
  [
    "10. Third-party services and compatibility",
    "FiveM, CFX.re, Rockstar Games, Discord, PayPal, GitHub and resource publishers are independent third parties. We do not control or endorse their services or code. Formats and APIs can change, and we do not guarantee compatibility with every resource, custom format, platform version or update. Update notifications cover selected resources only.",
  ],
  [
    "11. Intellectual property",
    "The application, website, branding, interfaces and original service code are owned by or licensed to the service operator. These terms grant a limited, revocable, non-exclusive and non-transferable right to use the service during authorized access. They do not transfer ownership of our software or of third-party resources.",
  ],
  [
    "12. Suspension and termination",
    "We may suspend or terminate access when reasonably necessary to address fraud, payment failure, security threats, unlawful use, material breach of these terms or harm to the service or other users. Where practical, we will provide notice and an opportunity to resolve the issue.",
  ],
  [
    "13. Disclaimer of warranties",
    "To the maximum extent permitted by law, the service is provided “as is” and “as available,” without warranties of uninterrupted availability, error-free processing, fitness for a particular purpose, merchantability, non-infringement or guaranteed detection of malicious code. Mandatory consumer rights remain unaffected.",
  ],
  [
    "14. Limitation of liability",
    "To the maximum extent permitted by law, the operator and its team will not be liable for indirect, incidental, special, consequential or punitive damages; lost revenue; server downtime; corrupted resources; security incidents; or loss of data arising from third-party code, an update, local hardware, user action or failure to maintain backups. Our aggregate liability for a claim will not exceed the amount you paid for the service during the six months before the event giving rise to the claim, unless applicable law requires a different amount.",
  ],
  [
    "15. Indemnity",
    "To the extent permitted by law, you agree to defend and indemnify the operator and its team against third-party claims, losses and reasonable costs arising from resources you submit, your server operation, infringement caused by your content, unlawful use or material violation of these terms. This obligation does not apply to losses caused solely by our intentional misconduct where it cannot legally be excluded.",
  ],
  [
    "16. Changes, severability and contact",
    "We may update these terms when the product, pricing or legal requirements change. Material changes will be communicated through the website, app or Discord. If one provision is unenforceable, the remaining provisions continue in effect. These terms do not waive rights that cannot be waived under applicable law. Contact the team through the official Discord community for billing, privacy or legal questions.",
  ],
] as const;
export default function TermsPage() {
  return (
    <main className="ocean-home marketing-surface min-h-screen">
      <SiteHeader />
      <div className="mx-auto max-w-[920px] px-5 pb-24 pt-12 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors duration-150 hover:text-white"
        >
          <ArrowLeft strokeWidth={1.5} className="h-4 w-4" />
          Back to home
        </Link>
        <header className="page-enter mt-10 border-b border-white/[.08] pb-10">
          <div className="premium-icon h-11 w-11 rounded-xl">
            <ShieldCheck strokeWidth={1.5} className="h-5 w-5" />
          </div>
          <h1 className="display mt-6 text-5xl font-semibold tracking-[-.055em] text-white">
            Terms &amp; Conditions
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Plain-language terms for using Auto Resource Updater. Last updated
            August 11, 2026.
          </p>
        </header>
        <div className="premium-card page-enter page-enter-delay-1 mt-8 flex gap-3 rounded-2xl p-5">
          <TriangleAlert strokeWidth={1.5} className="mt-0.5 h-5 w-5 shrink-0 text-blue-200" />
          <p className="text-sm leading-6 text-slate-300">
            <strong className="text-white">
              Always review and test code before applying an update.
            </strong>{" "}
            Automation reduces repetitive work, but it cannot guarantee that
            third-party files are safe or correct.
          </p>
        </div>
        <div className="mt-12 space-y-3">
          {sections.map(([title, body]) => (
            <section key={title} className="rounded-2xl px-5 py-5 transition-[background-color] duration-150 ease-out hover:bg-white/[.018]">
              <h2 className="text-[14px] font-semibold text-white">{title}</h2>
              <p className="mt-3 text-[13px] leading-7 text-slate-400">{body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
