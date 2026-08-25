import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Manrope } from "next/font/google";
import "./globals.css";

const bodyFont = Geist({ subsets: ["latin"], variable: "--font-body" });
const displayFont = Manrope({ subsets: ["latin"], variable: "--font-display" });
const monoFont = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://autoresourceupdater.com";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Auto Resource Updater for FiveM | Preserve Configs",
    template: "%s · Auto Resource Updater",
  },
  description:
    "Update FiveM resources safely without losing configuration. Review file changes, preserve custom values and restore previous versions.",
  keywords: [
    "FiveM resource updater",
    "FiveM scripts",
    "FiveM server tools",
    "GTA 5 server",
    "resource update manager",
    "FiveM config merge",
    "GTA 6 server tools",
  ],
  authors: [{ name: "Auto Resource Updater" }],
  creator: "Auto Resource Updater",
  applicationName: "Auto Resource Updater",
  icons: {
    icon: "/icon.png",
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = {
  themeColor: "#040816",
  colorScheme: "dark",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable}`}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
