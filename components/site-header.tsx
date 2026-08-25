import Link from "next/link";
import { ArrowUpRight, ChevronDown, LogOut, UserRound } from "lucide-react";
import { auth, signOut } from "@/auth";
import { BrandMark } from "./brand";

export async function SiteHeader() {
  const session = await auth();
  return (
    <header className="site-header relative z-50 mx-auto flex h-[76px] w-full max-w-[1280px] items-center px-5 lg:px-8">
      <Link href="/" className="brand-lockup group flex items-center gap-3.5" aria-label="Auto Resource Updater home">
        <span className="brand-mark relative grid h-10 w-10 place-items-center rounded-[13px] bg-white/[.035]">
          <BrandMark className="h-7 w-7 object-contain outline outline-1 -outline-offset-1 outline-white/10" />
          <span className="absolute inset-x-2 bottom-0 h-px origin-center scale-x-50 bg-gradient-to-r from-transparent via-blue-200/80 to-transparent opacity-0 transition-[scale,opacity] duration-150 ease-out group-hover:scale-x-100 group-hover:opacity-100" />
        </span>
        <span className="leading-none">
          <span className="block text-[12px] font-semibold tracking-[-.015em] text-white">
            Auto Resource <span className="text-blue-200">Updater</span>
          </span>
          <span className="mt-1.5 block text-[8px] font-medium uppercase tracking-[.18em] text-slate-600">
            Resource change control
          </span>
        </span>
      </Link>

      <nav className="ml-auto flex items-center gap-1" aria-label="Primary navigation">
        {[['Workflow','/#features'],['Pricing','/#pricing'],['Affiliates','/#referrals'],['FAQ','/#faq']].map(([label,href], index)=><Link key={href} href={href} className={`nav-link hidden rounded-lg px-3 py-2 text-[11px] font-medium text-slate-500 transition-[color,background-color] duration-150 ease-out hover:bg-white/[.035] hover:text-white ${index>1?'lg:block':'md:block'}`}>{label}</Link>)}
        {session ? (
          <details className="account-menu group relative ml-2">
            <summary className="surface-button flex h-9 cursor-pointer list-none items-center gap-2 rounded-[11px] px-3.5 text-[10px] font-semibold text-slate-200 transition-[background-color,box-shadow,scale] duration-150 ease-out active:scale-[0.96] [&::-webkit-details-marker]:hidden">
              My account
              <span className="relative grid h-3.5 w-3.5 place-items-center">
                <ChevronDown strokeWidth={2} className="h-3.5 w-3.5 text-slate-500 transition-transform duration-150 ease-out group-open:rotate-180" />
              </span>
            </summary>
            <div className="account-popover absolute right-0 top-[calc(100%+10px)] z-50 w-60 origin-top-right overflow-hidden rounded-2xl p-2">
              <div className="border-b border-white/[.07] px-3 py-2.5">
                <p className="truncate text-[11px] font-semibold text-white">
                  {session.user?.name ?? "Discord user"}
                </p>
                <p className="mt-1.5 flex items-center gap-1.5 text-[8px] uppercase tracking-[.14em] text-[#9ca7ff]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#7f8cff] shadow-[0_0_10px_rgba(127,140,255,.7)]" /> Discord connected
                </p>
              </div>
              <Link
                href="/account"
                className="mt-1.5 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[10px] text-slate-300 transition-[color,background-color] duration-150 hover:bg-white/[.055] hover:text-white"
              >
                <UserRound strokeWidth={1.5} className="h-4 w-4 text-slate-500" />
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
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[10px] text-red-300/75 transition-[color,background-color,scale] duration-150 ease-out hover:bg-red-400/[.07] hover:text-red-200 active:scale-[0.96]"
                >
                  <LogOut strokeWidth={1.5} className="h-4 w-4" />
                  Sign out of Discord
                </button>
              </form>
            </div>
          </details>
        ) : (
          <Link
            href="/login"
            className="surface-button ml-2 flex h-9 items-center rounded-[11px] px-3.5 text-[10px] font-semibold text-slate-200 transition-[background-color,box-shadow,scale] duration-150 ease-out hover:bg-white/[.07] active:scale-[0.96]"
          >
            Sign in
          </Link>
        )}
        <Link
          href="/affiliates"
          className="header-cta ml-1 hidden h-9 items-center gap-1.5 rounded-[11px] px-3.5 text-[10px] font-semibold text-[#071225] transition-[filter,scale] duration-150 ease-out hover:brightness-105 active:scale-[0.96] sm:flex"
        >
          Affiliate area <ArrowUpRight strokeWidth={2} className="h-3.5 w-3.5" />
        </Link>
      </nav>
    </header>
  );
}
