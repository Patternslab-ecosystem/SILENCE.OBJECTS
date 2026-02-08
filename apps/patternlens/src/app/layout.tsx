import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "PatternLens — Structural Pattern Analysis",
  description: "Analyze behavioral patterns as structural systems. 12 archetypes, dual-lens analysis, free core detection. Built on SILENCE.OBJECTS framework.",
  manifest: "/manifest.json",
  openGraph: {
    title: "PatternLens — Structural Pattern Analysis",
    description: "Analyze behavioral patterns as structural systems. Free core, 12 archetypes.",
    url: "https://patternlens.app",
    siteName: "PatternLens",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PatternLens",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#08080a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased bg-[var(--bg-base)] text-[var(--text-primary)]">
        {children}
      </body>
    </html>
  );
}
