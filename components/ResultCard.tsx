"use client";
import {
  type CalcResult,
  type Verdict,
  VERDICT_META,
  formatPercent,
  formatYen,
} from "@/lib/calc";
import { useAnimatedNumber } from "@/lib/useAnimatedNumber";
import VerdictBadge from "./VerdictBadge";

const ACCENT: Record<Verdict, string> = {
  ok: "from-emerald-300 via-emerald-500 to-emerald-300",
  warn: "from-amber-300 via-amber-500 to-amber-300",
  ng: "from-red-300 via-red-500 to-red-300",
  idle: "from-ink-100 via-ink-100 to-ink-100",
};

const PROFIT_COLOR: Record<Verdict, string> = {
  ok: "text-emerald-600",
  warn: "text-amber-600",
  ng: "text-red-500",
  idle: "text-ink-300",
};

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl bg-ink-50 p-4">
      <div className="text-[11px] font-semibold text-ink-500 mb-1.5 uppercase tracking-wider">
        {label}
      </div>
      <div
        className={`tabular text-[20px] sm:text-[22px] font-semibold leading-none transition-colors duration-300 ${
          accent ?? "text-ink-900"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

export default function ResultCard({
  result,
  verdict,
}: {
  result: CalcResult;
  verdict: Verdict;
}) {
  const profit = useAnimatedNumber(result.profit);
  const margin = useAnimatedNumber(result.marginRate);
  const breakEven = useAnimatedNumber(result.breakEvenPrice);
  const fee = useAnimatedNumber(result.feeAmount);

  const meta = VERDICT_META[verdict];
  const profitColor = PROFIT_COLOR[verdict];

  return (
    <div className="relative rounded-xl2 bg-white shadow-card overflow-hidden">
      <div
        className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${ACCENT[verdict]} transition-[background] duration-500`}
      />

      <div className="p-7 sm:p-9">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-semibold text-ink-500 uppercase tracking-[0.08em]">
            判定 / 利益
          </span>
          <VerdictBadge verdict={verdict} size="md" />
        </div>

        <div
          className={`tabular text-[44px] sm:text-[56px] font-semibold tracking-tight leading-none transition-colors duration-300 ${profitColor}`}
        >
          {formatYen(profit)}
        </div>

        {verdict !== "idle" && (
          <p className="mt-2 text-[12px] text-ink-500 leading-relaxed">{meta.advice}</p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Stat
            label="利益率"
            value={formatPercent(margin)}
            accent={profitColor}
          />
          <Stat label="損益分岐" value={formatYen(breakEven)} />
        </div>

        <div className="mt-6 pt-5 border-t border-ink-100 space-y-2">
          <Row label="プラットフォーム手数料" value={formatYen(fee)} />
          <Row label="受取額（手数料控除後）" value={formatYen(result.netReceive)} />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <span className="text-ink-500">{label}</span>
      <span className="tabular font-semibold text-ink-700">{value}</span>
    </div>
  );
}
