import type { Metadata, Viewport } from "next";
import "./globals.css";
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
  authors: [{ name: "Fragment" }],
  creator: "Fragment",
  applicationName: "Auto Resource Updater",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Auto Resource Updater",
    title: "Auto Resource Updater for FiveM",
    description:
      "Update resources, preserve configuration and roll back safely.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Auto Resource Updater for FiveM",
    description:
      "A safer way to update FiveM resources without losing configuration.",
  },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = {
  themeColor: "#080b0e",
  colorScheme: "dark",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
