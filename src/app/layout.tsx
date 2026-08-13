import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { NoiseOverlay } from "@/components/site/noise-overlay";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Machine Learning",
    "Deep Learning",
    "Approximate Message Passing",
    "Graph Neural Networks",
    "Kalman Filtering",
    "AI Drug Design",
    "Metabolic Engineering",
    "Material Informatics",
    "AI Agents",
    site.name,
  ],
  authors: [{ name: site.name }],
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    type: "website",
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07090f" },
    { media: "(prefers-color-scheme: light)", color: "#f4f6fa" },
  ],
  width: "device-width",
  initialScale: 1,
};

/**
 * The theme-init script must run before first paint to prevent a theme flash,
 * but React 19 refuses to execute <script> tags rendered by components (and
 * warns about them). It is therefore injected into <head> as plain HTML by
 * `scripts/export-static.mjs` after the static export build; the source lives
 * in `scripts/theme-init.js`.
 */

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans antialiased">
        <ScrollProgress />
        <NoiseOverlay />
        {children}
      </body>
    </html>
  );
}
