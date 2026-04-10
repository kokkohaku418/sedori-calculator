export type CalcInput = {
  cost: number;
  price: number;
  feeRate: number;
  shipping: number;
};

export type CalcResult = {
  profit: number;
  marginRate: number;
  breakEvenPrice: number;
  feeAmount: number;
  valid: boolean;
};

export function safeNumber(v: string): number {
  if (v === "" || v == null) return 0;
  const n = Number(v.replace(/,/g, ""));
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

export function calculate({ cost, price, feeRate, shipping }: CalcInput): CalcResult {
  const c = Math.max(0, cost || 0);
  const p = Math.max(0, price || 0);
  const f = Math.min(100, Math.max(0, feeRate || 0));
  const s = Math.max(0, shipping || 0);

  const feeAmount = (p * f) / 100;
  const profit = p - feeAmount - s - c;
  const marginRate = p > 0 ? (profit / p) * 100 : 0;

  const denom = 1 - f / 100;
  const breakEvenPrice = denom > 0 ? (c + s) / denom : 0;

  return {
    profit,
    marginRate,
    breakEvenPrice,
    feeAmount,
    valid: p > 0,
  };
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
