import type { Metadata, Viewport } from "next";
import { Cinzel, Noto_Serif_SC } from "next/font/google";
import { PostHogProvider } from "@/components/PostHogProvider";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const notoSerif = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-body-zh",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Poker Soul AI — 扑克牌风报告",
  description:
    "牌风类型、牌桌镜像、本场状态、运势信号。测完就想发给牌友。",
  openGraph: {
    title: "Poker Soul AI",
    description: "你的牌风类型，今天怎么打。",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a0a0f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${cinzel.variable} ${notoSerif.variable}`}>
      <body className="font-body">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
