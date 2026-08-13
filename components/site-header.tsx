import Link from "next/link";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { auth, signOut } from "@/auth";
import { BrandMark } from "./brand";
export async function SiteHeader({ compact = false }: { compact?: boolean }) {
  const session = await auth();
  return (
    <header className="relative z-30 mx-auto flex h-20 w-full max-w-[1240px] items-center px-5 lg:px-8">
      <Link href="/" className="flex items-center gap-3">
        <span className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/[.1] bg-white/[.035] shadow-[inset_0_1px_rgba(255,255,255,.06)]">
          <BrandMark className="h-7 w-7 object-contain" />
          <span className="absolute -bottom-px left-2 right-2 h-px bg-amber-300/70" />
        </span>
        <span>
          <span className="block text-[12px] font-semibold uppercase tracking-[.08em] text-white">
            Auto Resource <span className="text-amber-300">Updater</span>
          </span>
          <span className="mt-0.5 block text-[7px] font-semibold uppercase tracking-[.24em] text-slate-600">
            FiveM resource control
          </span>
        </span>
      </Link>
      <nav className="ml-auto flex items-center gap-1">
        <Link
          href="/#features"
          className="hidden rounded-md px-3 py-2 text-[11px] text-slate-500 hover:text-white md:block"
        >
          Features
        </Link>
        <Link
          href="/#pricing"
          className="hidden rounded-md px-3 py-2 text-[11px] text-slate-500 hover:text-white md:block"
        >
          Pricing
        </Link>
        <Link
          href="/#referrals"
          className="hidden rounded-md px-3 py-2 text-[11px] text-slate-500 hover:text-white lg:block"
        >
          Affiliates
        </Link>
        <Link
          href="/#faq"
          className="hidden rounded-md px-3 py-2 text-[11px] text-slate-500 hover:text-white lg:block"
        >
          FAQ
        </Link>
        {session ? (
          <details className="group relative ml-2">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md border border-white/10 bg-white/[.045] px-3.5 py-2 text-[10px] font-semibold text-slate-200 transition hover:bg-white/[.08] [&::-webkit-details-marker]:hidden">
              My account
              <ChevronDown className="h-3 w-3 text-slate-500 transition group-open:rotate-180" />
            </summary>
            <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-52 overflow-hidden rounded-xl border border-white/[.11] bg-[#151c23] p-1.5 shadow-[0_24px_70px_rgba(0,0,0,.55)]">
              <div className="border-b border-white/[.07] px-3 py-2.5">
                <p className="truncate text-[9px] font-semibold text-white">
                  {session.user?.name ?? "Discord user"}
                </p>
                <p className="mt-1 text-[7px] uppercase tracking-[.12em] text-[#7c89f8]">
                  Connected with Discord
                </p>
              </div>
              <Link
                href="/account"
                className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2.5 text-[9px] text-slate-300 hover:bg-white/[.06] hover:text-white"
              >
                <UserRound className="h-3.5 w-3.5 text-slate-500" />
                Subscription & billing
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
                className="mt-1 border-t border-white/[.07] pt-1"
              >
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[9px] text-red-300/80 hover:bg-red-400/[.07] hover:text-red-300"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out of Discord
                </button>
              </form>
            </div>
          </details>
        ) : (
          <Link
            href="/login"
            className="ml-2 rounded-md border border-white/10 bg-white/[.035] px-3.5 py-2 text-[10px] font-semibold text-slate-300 hover:bg-white/[.07]"
          >
            Sign in
          </Link>
        )}
        <Link
          href="/affiliates"
          className={`ml-1 hidden rounded-md border px-3.5 py-2 text-[10px] font-semibold sm:block ${compact ? "border-amber-300/20 bg-amber-400/[.07] text-amber-200" : "border-white/10 text-slate-400"}`}
        >
          Affiliate dashboard
        </Link>
      </nav>
    </header>
  );
}
