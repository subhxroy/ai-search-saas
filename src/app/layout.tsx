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
  title: "Nexus AI — Search for developers",
  description:
    "AI-powered search engine with real-time citations. Ask anything, get verified answers from across the web.",
  keywords: ["AI search", "perplexity", "research", "citations", "web search"],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
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
