import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import "./globals.css";

const SITE_URL = "https://sedori-calculator.vercel.app";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "せどり利益計算ツール｜仕入れOK/NG を即判定",
    template: "%s｜せどり利益計算ツール",
  },
  description:
    "メルカリ・ラクマ・Yahoo!フリマ・Amazon FBA 対応の無料せどり利益計算ツール。利益・利益率・損益分岐点を即座に算出し、仕入れOK/微妙/NG を自動判定。",
  keywords: [
    "せどり",
    "利益計算",
    "メルカリ 手数料",
    "ラクマ 手数料",
    "Amazon FBA",
    "損益分岐点",
    "せどり 計算",
  ],
  openGraph: {
    title: "せどり利益計算ツール｜仕入れOK/NG を即判定",
    description:
      "メルカリ・ラクマ・Yahoo!フリマ・Amazon FBA 対応。利益と仕入れ判定を一瞬で。",
    type: "website",
    url: SITE_URL,
    images: [{ url: "/api/og", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "せどり利益計算ツール",
    description: "仕入れ判定まで一瞬で。メルカリ/ラクマ/Yahoo!/Amazon FBA 対応。",
    images: ["/api/og"],
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f1f2f5",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="font-sans">
        {children}

        {GA_ID && (
          <>
            <Script
              id="ga-loader"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script
              id="ga-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
window.dataLayer = window.dataLayer || [];
window.gtag = function gtag(){window.dataLayer.push(arguments);};
window.gtag('js', new Date());
window.gtag('config', '${GA_ID}');
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
