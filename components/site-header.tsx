import Link from "next/link";
import { auth } from "@/auth";
import { BrandMark } from "./brand";
export async function SiteHeader({ compact = false }: { compact?: boolean }) {
  const session = await auth();
  return (
    <header className="relative z-30 mx-auto flex h-20 w-full max-w-[1240px] items-center px-5 lg:px-8">
      <Link href="/" className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl border border-amber-300/20 bg-amber-400/10 text-amber-300">
          <BrandMark className="h-4 w-4" />
        </span>
        <span>
          <span className="block text-[13px] font-semibold text-white">
            Auto Resource Updater
          </span>
          <span className="block text-[8px] font-semibold uppercase tracking-[.22em] text-slate-600">
            by Fragment
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
          href={session ? "/account" : "/login"}
          className="ml-2 rounded-md border border-white/10 bg-white/[.035] px-3.5 py-2 text-[10px] font-semibold text-slate-300 hover:bg-white/[.07]"
        >
          {session ? "My account" : "Sign in"}
        </Link>
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
