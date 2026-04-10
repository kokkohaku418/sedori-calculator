"use client";
import { type Verdict, VERDICT_META } from "@/lib/calc";

const TONE: Record<Verdict, { bg: string; text: string; dot: string }> = {
  ok:   { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  warn: { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500" },
  ng:   { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-500" },
  idle: { bg: "bg-ink-50",     text: "text-ink-500",     dot: "bg-ink-300" },
};

export default function VerdictBadge({ verdict, size = "md" }: { verdict: Verdict; size?: "sm" | "md" | "lg" }) {
  const meta = VERDICT_META[verdict];
  const tone = TONE[verdict];

  const sizing =
    size === "lg"
      ? "px-3 py-1.5 text-[13px]"
      : size === "sm"
      ? "px-2 py-0.5 text-[10px]"
      : "px-2.5 py-1 text-[11px]";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold transition-colors duration-300 ${sizing} ${tone.bg} ${tone.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} />
      {meta.label}
    </span>
  );
}
