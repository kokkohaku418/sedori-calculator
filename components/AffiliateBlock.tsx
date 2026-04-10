"use client";
import type { PlatformId } from "@/lib/platforms";
import type { Verdict } from "@/lib/calc";

/* -----------------------------------------------------------
 * AffiliateBlock
 * - 判定 (verdict) ごとに COPY / LINK / TRACK を切り替える
 * - URL は LINKS で一元管理（将来アフィリンクへの差し替えが容易）
 * - クリック計測は trackEvent() に集約（GA/PostHog 等への置換可能）
 * ----------------------------------------------------------- */

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
};

type LinkResolver = (ctx: LinkContext) => string;

/* ---------- COPY: 判定別の感情コピー（絵文字なし） ---------- */
const COPY: Record<ActiveVerdict, Copy> = {
  ok: {
    label: "GO",
    headline: "判定はGO。今日の利益を確定させよう。",
    desc: "在庫が消える前に、商品ページからそのまま仕入れを完了させましょう。",
    cta: "Amazonで仕入れる",
    tone: "emerald",
  },
  warn: {
    label: "CHECK",
    headline: "判断はあと一歩。価格推移を見て確信を持とう。",
    desc: "Keepaで過去90日の価格と販売ランクを確認すれば、仕入れの良否は30秒で見極められます。",
    cta: "Keepaで価格推移を見る",
    tone: "amber",
  },
  ng: {
    label: "NEXT",
    headline: "この商品はパス。次の利益商品に時間を使おう。",
    desc: "Amazonの売れ筋ランキングから、いま勢いのある商品を比較して次の候補を見つけましょう。",
    cta: "Amazonで別商品を探す",
    tone: "ink",
  },
};

/* ---------- LINKS: URLは1箇所に集約。差し替えはここだけ ---------- */
const LINKS: Record<ActiveVerdict, LinkResolver> = {
  // TODO: ASINが分かるようになったら商品ページ + アソシエイトタグへ
  // 例: `https://www.amazon.co.jp/dp/${asin}?tag=kokkohaku418-22`
  ok: () => "https://www.amazon.co.jp/?tag=kokkohaku418-22",

  // TODO: Keepa の紹介リンクへ
  warn: () => "https://keepa.com/",

  // TODO: カテゴリ別ベストセラー or 検索URLへ差し替え可能
  ng: () => "https://www.amazon.co.jp/gp/bestsellers?tag=kokkohaku418-22",
};

/* ---------- TRACK: 計測の抽象化（GA/PostHog等への置換ポイント） ---------- */
type TrackPayload = {
  event: "affiliate_click";
  verdict: ActiveVerdict;
  platform: PlatformId;
  href: string;
};

function trackEvent(payload: TrackPayload): void {
  if (typeof window === "undefined") return;
  // GA4 例:
  // window.gtag?.("event", payload.event, {
  //   verdict: payload.verdict,
  //   platform: payload.platform,
  //   link_url: payload.href,
  // });
  //
  // PostHog 例:
  // window.posthog?.capture(payload.event, payload);
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
}: {
  verdict: Verdict;
  platform: PlatformId;
}) {
  if (verdict === "idle") return null;

  const copy = COPY[verdict];
  const tone = TONE[copy.tone];
  const href = LINKS[verdict]({ platform });

  const handleClick = () => {
    trackEvent({ event: "affiliate_click", verdict, platform, href });
  };

  return (
    <div
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
        href={href}
        target="_blank"
        rel="sponsored noopener noreferrer"
        onClick={handleClick}
        className={`flex items-center justify-center gap-2 w-full min-h-[56px] sm:min-h-[52px] px-5 rounded-2xl text-[15px] sm:text-[14px] font-bold transition-all duration-150 active:scale-[0.98] outline-none focus-visible:ring-4 ${tone.button} ${tone.ring}`}
      >
        <span>{copy.cta}</span>
        <ArrowIcon />
      </a>
    </div>
  );
}
