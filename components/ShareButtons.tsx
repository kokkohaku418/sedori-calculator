"use client";
import { useState } from "react";
import type { CalcResult, Verdict } from "@/lib/calc";
import { formatYen, formatPercent } from "@/lib/calc";
import { type ShareState, buildShareUrl } from "@/lib/share";
import { getPlatform, type PlatformId } from "@/lib/platforms";

type Props = {
  result: CalcResult;
  verdict: Verdict;
  platform: PlatformId;
  shareState: ShareState;
};

function verdictEmoji(v: Verdict): string {
  if (v === "ok") return "✅仕入れOK";
  if (v === "warn") return "⚠微妙";
  if (v === "ng") return "❌見送り";
  return "";
}

export default function ShareButtons({ result, verdict, platform, shareState }: Props) {
  const [copied, setCopied] = useState(false);

  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://sedori-calculator.vercel.app";
  const url = buildShareUrl(origin, shareState);
  const platformName = getPlatform(platform).name;
  const text = `【${platformName}】仕入${formatYen(shareState.c ?? 0)} → 販売${formatYen(
    shareState.s ?? 0
  )}\n利益 ${formatYen(result.profit)} (${formatPercent(result.marginRate)}) ${verdictEmoji(
    verdict
  )}`;

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    text
  )}&url=${encodeURIComponent(url)}&hashtags=${encodeURIComponent("せどり,メルカリ")}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  };

  const disabled = !result.valid;

  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        disabled={disabled}
        onClick={handleCopy}
        className="h-11 rounded-2xl bg-ink-50 hover:bg-ink-100 disabled:opacity-40 disabled:cursor-not-allowed text-[13px] font-semibold text-ink-700 transition active:scale-[0.985]"
      >
        {copied ? "✓ コピー済み" : "📋 結果をコピー"}
      </button>
      <a
        href={disabled ? undefined : xUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={disabled}
        className={`h-11 rounded-2xl bg-ink-900 text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 transition active:scale-[0.985] ${
          disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : "hover:bg-ink-700"
        }`}
      >
        𝕏 でシェア
      </a>
    </div>
  );
}
