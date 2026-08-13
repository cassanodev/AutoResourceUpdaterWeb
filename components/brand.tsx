export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <img
      src="/branding/app-logo-64.png"
      className={className}
      alt=""
      aria-hidden="true"
      draggable={false}
    />
  );
}
export function DiscordIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M20.3 4.4a19.8 19.8 0 0 0-4.9-1.5c-.2.4-.4.9-.6 1.2a18.4 18.4 0 0 0-5.5 0c-.2-.4-.4-.9-.6-1.2a19.7 19.7 0 0 0-4.9 1.5C.5 9-.3 13.6.1 18.1c2.1 1.5 4 2.4 6 3 .5-.6.9-1.3 1.2-2-.7-.2-1.3-.5-1.9-.9l.4-.3c3.9 1.8 8.2 1.8 12.1 0l.4.3c-.6.4-1.2.7-1.9.9.4.7.8 1.4 1.2 2 2-.6 4-1.5 6-3 .5-4.8-.7-9.2-4.3-13.7ZM8 15.3c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Zm8 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Z" />
    </svg>
  );
}
