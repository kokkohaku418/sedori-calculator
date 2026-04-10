"use client";
import { useEffect, useRef, useState } from "react";
import type { PlatformId } from "@/lib/platforms";
import type { Verdict } from "@/lib/calc";

/* -----------------------------------------------------------
 * AffiliateBlock
 * - 判定 (verdict) ごとに COPY / LINK / TRACK を切り替える
 * - URL は LINKS で一元管理（asin/query を渡せる構造）
 * - クリック計測は trackEvent() に集約（GA4/PostHog 等への置換可能）
 * - モバイルではスクロール時に下部スティッキー CTA で常に露出
 * ----------------------------------------------------------- */

const ASSOC_TAG = "kokkohaku418-22";

type ActiveVerdict = Exclude<Verdict, "idle">;
type Tone = "emerald" | "amber" | "ink";

type Copy = {
  label: string;
  headline: string;
  desc: string;
  cta: string;
  tone: Tone;
};

type LinkContext = {
  platform: PlatformId;
  asin?: string;
  query?: string;
};

type LinkResolver = (ctx: LinkContext) => string;

/* ---------- COPY: 判定別の感情コピー（絵文字なし） ---------- */
const COPY: Record<ActiveVerdict, Copy> = {
  ok: {
    label: "GO",
    headline: "判定はGO。これは仕入れていい商品です。",
    desc: "Amazonで価格と在庫を最終確認のうえ、そのまま仕入れに進みましょう。タイミングは早いほうが有利です。",
    cta: "Amazonで商品を確認する",
    tone: "emerald",
  },
  warn: {
    label: "CHECK",
    headline: "迷ったら、過去90日の価格を1分で確認しましょう。",
    desc: "Keepaなら価格推移と販売数の波が一目で分かります。回転する商品かどうかを30秒で見極められます。",
    cta: "Keepaで価格推移を見る",
    tone: "amber",
  },
  ng: {
    label: "NEXT",
    headline: "今回は見送り。次の利益商品を1分で探しましょう。",
    desc: "Amazonの売れ筋ランキングを見れば、いま動いている商品が一覧で確認できます。同じ時間で次の候補を見つけにいきましょう。",
    cta: "Amazonで売れ筋を見る",
    tone: "ink",
  },
};

/* ---------- LINKS: URL は1箇所に集約 ----------
 * - asin が渡されれば商品ページ直リンクへ
 * - query があれば検索結果へ
 * - いずれも無ければ汎用ランディングへフォールバック
 */
const LINKS: Record<ActiveVerdict, LinkResolver> = {
  ok: ({ asin }) =>
    asin
      ? `https://www.amazon.co.jp/dp/${asin}?tag=${ASSOC_TAG}`
      : `https://www.amazon.co.jp/?tag=${ASSOC_TAG}`,

  warn: ({ asin }) =>
    asin
      ? `https://keepa.com/#!product/5-${asin}`
      : "https://keepa.com/",

  ng: ({ query }) =>
    query
      ? `https://www.amazon.co.jp/s?k=${encodeURIComponent(query)}&tag=${ASSOC_TAG}`
      : `https://www.amazon.co.jp/gp/bestsellers?tag=${ASSOC_TAG}`,
};

/* ---------- TRACK: 計測の抽象化 ---------- */
type TrackPayload = {
  event: "affiliate_click";
  verdict: ActiveVerdict;
  platform: PlatformId;
  href: string;
  surface: "card" | "sticky";
};

function trackEvent(payload: TrackPayload): void {
  if (typeof window === "undefined") return;

  const enriched = { ...payload, ts: new Date().toISOString() };

  // 開発用ログ（本番ビルドでは出さない）
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log("[sedori-track]", enriched);
  }

  // GA4 へ送信（gtag 未ロード時は何もしない）
  window.gtag?.("event", payload.event, {
    verdict: payload.verdict,
    platform: payload.platform,
    surface: payload.surface,
    link_url: payload.href,
  });
}

/* ---------- TONE: トーン別の Tailwind クラス ---------- */
const TONE: Record<
  Tone,
  { card: string; badge: string; button: string; ring: string }
> = {
  emerald: {
    card: "bg-gradient-to-br from-emerald-50 to-white border-emerald-200",
    badge: "bg-emerald-500 text-white",
    button:
      "bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-600 text-white shadow-[0_8px_24px_-8px_rgba(16,185,129,0.55)]",
    ring: "focus-visible:ring-emerald-300",
  },
  amber: {
    card: "bg-gradient-to-br from-amber-50 to-white border-amber-200",
    badge: "bg-amber-500 text-white",
    button:
      "bg-amber-500 hover:bg-amber-600 active:bg-amber-600 text-white shadow-[0_8px_24px_-8px_rgba(245,158,11,0.55)]",
    ring: "focus-visible:ring-amber-300",
  },
  ink: {
    card: "bg-gradient-to-br from-ink-50 to-white border-ink-100",
    badge: "bg-ink-900 text-white",
    button:
      "bg-ink-900 hover:bg-ink-700 active:bg-ink-700 text-white shadow-[0_8px_24px_-8px_rgba(10,10,10,0.45)]",
    ring: "focus-visible:ring-ink-300",
  },
};

/* ---------- Arrow (絵文字を使わずSVG) ---------- */
function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

/* ---------- Component ---------- */
export default function AffiliateBlock({
  verdict,
  platform,
  asin,
  query,
}: {
  verdict: Verdict;
  platform: PlatformId;
  asin?: string;
  query?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [outOfView, setOutOfView] = useState(false);

  // モバイル専用: カードが画面外に出たら fixed CTA を出す
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (verdict === "idle") return;
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setOutOfView(!entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [verdict]);

  if (verdict === "idle") return null;

  const copy = COPY[verdict];
  const tone = TONE[copy.tone];
  const href = LINKS[verdict]({ platform, asin, query });

  const handleClick = (surface: "card" | "sticky") => () => {
    trackEvent({ event: "affiliate_click", verdict, platform, href, surface });
  };

  return (
    <>
      <div
        ref={cardRef}
        className={`relative rounded-xl2 border ${tone.card} p-5 sm:p-6 shadow-card animate-rise overflow-hidden`}
      >
        <span className="absolute top-3 right-3 text-[9px] font-semibold text-ink-300 tracking-widest">
          PR
        </span>

        <div className="mb-4">
          <span
            className={`inline-flex items-center h-7 px-2.5 rounded-full text-[11px] font-bold tracking-[0.08em] ${tone.badge}`}
          >
            {copy.label}
          </span>
        </div>

        <div className="text-[15px] sm:text-[17px] font-bold text-ink-900 leading-snug mb-2">
          {copy.headline}
        </div>
        <p className="text-[12px] sm:text-[13px] text-ink-500 leading-relaxed mb-5">
          {copy.desc}
        </p>

        <a
          key={verdict}
          href={href}
          target="_blank"
          rel="sponsored noopener noreferrer"
          onClick={handleClick("card")}
          className={`flex items-center justify-center gap-2 w-full min-h-[56px] sm:min-h-[52px] px-5 rounded-2xl text-[15px] sm:text-[14px] font-bold transition-all duration-150 active:scale-[0.98] outline-none focus-visible:ring-4 animate-cta-attract ${tone.button} ${tone.ring}`}
        >
          <span>{copy.cta}</span>
          <ArrowIcon />
        </a>
      </div>

      {/* モバイル専用 スティッキー CTA（iPhone ホームバー回避のため safe-area を加算） */}
      {outOfView && (
        <div
          className="lg:hidden fixed inset-x-3 z-50 animate-rise"
          style={{ bottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
        >
          <a
            href={href}
            target="_blank"
            rel="sponsored noopener noreferrer"
            onClick={handleClick("sticky")}
            className={`flex items-center justify-center gap-2 w-full h-14 rounded-2xl text-[15px] font-bold transition-all duration-150 active:scale-[0.98] outline-none focus-visible:ring-4 ring-1 ring-black/5 ${tone.button} ${tone.ring}`}
          >
            <span className="opacity-80 text-[11px] font-semibold mr-1">{copy.label}</span>
            <span>{copy.cta}</span>
            <ArrowIcon />
          </a>
        </div>
      )}
    </>
  );
}
