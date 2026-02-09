import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SILENCE.OBJECTS — Framework Control Tower",
  description: "24-widget command center for SILENCE.OBJECTS behavioral pattern analysis framework. 15 modules, 12 archetypes, Agent Army v3.0.",
  openGraph: {
    title: "SILENCE.OBJECTS — Control Tower",
    description: "Modular framework for structural behavioral pattern analysis. Open Core, API-first.",
    url: "https://patternslab.app",
    siteName: "SILENCE.OBJECTS",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#21808d" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen antialiased font-['Outfit',system-ui,sans-serif] bg-[#08080a] text-[#e8e8ec]">
        {children}
      </body>
    </html>
  );
}
