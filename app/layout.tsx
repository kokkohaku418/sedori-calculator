import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "せどり利益計算ツール | Sedori Profit Calculator",
  description:
    "メルカリ・ラクマ・Yahoo!フリマ対応。仕入価格・販売価格・手数料・送料から利益と損益分岐点を即座に計算。",
  openGraph: {
    title: "せどり利益計算ツール",
    description: "プラットフォーム別の利益・利益率・損益分岐点を一瞬で計算。",
    type: "website",
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fafafa",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="font-sans">{children}</body>
    </html>
  );
}
