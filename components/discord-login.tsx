"use client";
import { signIn } from "next-auth/react";
import { DiscordIcon } from "./brand";
export function DiscordLogin({
  callbackUrl = "/account",
  label = "Continue with Discord",
  className = "",
}: {
  callbackUrl?: string;
  label?: string;
  className?: string;
}) {
  return (
    <button
      onClick={() => void signIn("discord", { redirectTo: callbackUrl })}
      className={`tap-control inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#5865f2] px-5 text-[10px] font-semibold text-white transition-[background-color,scale] duration-150 ease-out hover:bg-[#6772f5] active:scale-[0.96] ${className}`}
    >
      <DiscordIcon className="h-4 w-4" />
      {label}
    </button>
  );
}
