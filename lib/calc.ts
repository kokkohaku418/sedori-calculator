export type CalcInput = {
  cost: number;
  price: number;
  feeRate: number;
  shipping: number;
  fixedCost?: number;
  extraFee?: number; // メルカリ振込手数料など固定額
};

export type CalcResult = {
  profit: number;
  marginRate: number;
  breakEvenPrice: number;
  feeAmount: number;
  netReceive: number; // 販売価格 − 手数料 − 固定額手数料
  valid: boolean;
};

export type Verdict = "ok" | "warn" | "ng" | "idle";

export function safeNumber(v: string | number | null | undefined): number {
  if (v == null || v === "") return 0;
  const s = typeof v === "number" ? String(v) : v;
  const n = Number(s.replace(/,/g, ""));
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

export function calculate(input: CalcInput): CalcResult {
  const c = Math.max(0, input.cost || 0);
  const p = Math.max(0, input.price || 0);
  const f = Math.min(100, Math.max(0, input.feeRate || 0));
  const s = Math.max(0, input.shipping || 0);
  const fx = Math.max(0, input.fixedCost || 0);
  const ex = Math.max(0, input.extraFee || 0);

  const feeAmount = (p * f) / 100 + ex;
  const netReceive = p - feeAmount;
  const profit = netReceive - s - c - fx;
  const marginRate = p > 0 ? (profit / p) * 100 : 0;

  const denom = 1 - f / 100;
  const breakEvenPrice = denom > 0 ? (c + s + fx + ex) / denom : 0;

  return {
    profit,
    marginRate,
    breakEvenPrice,
    feeAmount,
    netReceive,
    valid: p > 0,
  };
}

export function judge(r: CalcResult): Verdict {
  if (!r.valid) return "idle";
  if (r.profit < 200 || r.marginRate < 10) return "ng";
  if (r.profit < 500 || r.marginRate < 20) return "warn";
  return "ok";
}

export function reversePrice(opts: {
  cost: number;
  shipping: number;
  feeRate: number;
  fixedCost?: number;
  extraFee?: number;
  targetMarginPct: number;
}): number {
  const { cost, shipping, feeRate, fixedCost = 0, extraFee = 0, targetMarginPct } = opts;
  const denom = 1 - feeRate / 100 - targetMarginPct / 100;
  if (denom <= 0) return Infinity;
  return Math.ceil((cost + shipping + fixedCost + extraFee) / denom);
}

export function formatYen(n: number): string {
  if (!Number.isFinite(n)) return "¥0";
  const sign = n < 0 ? "-" : "";
  return `${sign}¥${Math.round(Math.abs(n)).toLocaleString("ja-JP")}`;
}

export function formatPercent(n: number): string {
  if (!Number.isFinite(n)) return "0.0%";
  return `${n.toFixed(1)}%`;
}

export const VERDICT_META: Record<Verdict, { label: string; advice: string; tone: string }> = {
  ok: {
    label: "仕入れOK",
    advice: "利益率・利益額ともに十分です。仕入れ推奨。",
    tone: "emerald",
  },
  warn: {
    label: "微妙",
    advice: "利益は出ますが薄利。回転率や保証で判断を。",
    tone: "amber",
  },
  ng: {
    label: "見送り",
    advice: "利益が薄い／赤字です。仕入れは見送り推奨。",
    tone: "red",
  },
  idle: {
    label: "未入力",
    advice: "販売価格を入力すると判定されます。",
    tone: "ink",
  },
};
