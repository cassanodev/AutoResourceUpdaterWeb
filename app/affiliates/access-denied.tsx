import Link from "next/link";
import { ShieldX } from "lucide-react";
import { DiscordIcon } from "@/components/brand";
export function AffiliateAccessDenied({
  configured = true,
}: {
  configured?: boolean;
}) {
  const discord =
    process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/your-server";
  return (
    <section className="mx-auto grid min-h-[calc(100vh-80px)] max-w-[720px] place-items-center px-5 pb-20">
      <div className="premium-panel page-enter w-full rounded-[26px] p-9 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-[14px] bg-red-400/[.055] text-red-300 shadow-[0_0_0_1px_rgba(248,113,113,.14)]">
          <ShieldX strokeWidth={1.5} className="h-5 w-5" />
        </div>
        <p className="ocean-kicker mt-6 text-[8px]">
          Affiliate access
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-white">
          {configured
            ? "You do not have access yet"
            : "Affiliate service is not configured"}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[11px] leading-6 text-slate-400">
          {configured
            ? "Affiliate dashboards are available only to approved partners. Apply through our Discord server and our team will review your account."
            : "Set AFFILIATE_API_URL before affiliate accounts can be verified."}
        </p>
        {configured && (
          <a
            href={discord}
            target="_blank"
            rel="noreferrer"
            className="tap-control mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-[#5865f2] px-5 text-[10px] font-semibold text-white transition-[background-color,scale] duration-150 ease-out hover:bg-[#6772f5]"
          >
            <DiscordIcon className="h-4 w-4" />
            Apply in Discord
          </a>
        )}
        <div>
          <Link
            href="/"
            className="mt-6 inline-block text-[9px] text-slate-500 hover:text-white"
          >
            Return home
          </Link>
        </div>
      </div>
    </section>
  );
}
