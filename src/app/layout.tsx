import type { Metadata } from "next";
import { Inter, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Newsreader as Domaine Display substitute — editorial serif with similar character
const serifFont = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500"],
  style: ["normal"],
});

export const metadata: Metadata = {
  title: "Nexus AI — Premium AI Search Engine & Deep Research Platform",
  description:
    "Nexus AI is a next-generation AI-powered search engine and research assistant. Get real-time answers with verified citations, browse academic sources, and execute deep analysis tailored for professionals.",
  keywords: ["AI search", "Nexus AI", "perplexity clone", "academic research", "citations", "web search India", "deep research"],
  authors: [{ name: "Nexus Labs" }],
  icons: {
    icon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMzYjgyZjYiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iOGI1Y2Y2IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iOCIgZmlsbD0idXJsKCNnKSIgLz4KICA8Y2lyY2xlIGN4PSIxNCIgY3k9IjE0IiByPSI1IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMi41IiAvPgogIDxsaW5lIHgxPSIxOCIgeTE9IjE4IiB4Mj0iMjUiIHkyPSIyNSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiAvPgo8L3N2Zz4="
  },
  openGraph: {
    title: "Nexus AI — Premium AI Search Engine",
    description: "AI-powered search engine with real-time citations. Ask anything, get verified answers from across the web.",
    type: "website",
    locale: "en_US",
    siteName: "Nexus AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexus AI — Premium AI Search Engine",
    description: "Get verified answers with real-time citations instantly.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="dark"
    >
      <body
        className={`${inter.variable} ${geistMono.variable} ${serifFont.variable} antialiased`}
        style={{ backgroundColor: "#000000", color: "#fcfdff" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
