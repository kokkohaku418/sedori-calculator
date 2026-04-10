export type AmazonCategory = {
  id: string;
  name: string;
  rate: number; // %
  minFee: number; // 最低販売手数料(円)
};

export const AMAZON_CATEGORIES: AmazonCategory[] = [
  { id: "home",        name: "ホーム",       rate: 15, minFee: 30 },
  { id: "kitchen",     name: "キッチン",     rate: 15, minFee: 30 },
  { id: "beauty",      name: "ビューティ",   rate: 10, minFee: 30 },
  { id: "health",      name: "ドラッグストア", rate: 10, minFee: 30 },
  { id: "books",       name: "本",           rate: 15, minFee: 0 },
  { id: "music",       name: "ミュージック", rate: 15, minFee: 0 },
  { id: "dvd",         name: "DVD",          rate: 15, minFee: 0 },
  { id: "electronics", name: "家電",         rate: 8,  minFee: 30 },
  { id: "pc",          name: "パソコン",     rate: 8,  minFee: 30 },
  { id: "camera",      name: "カメラ",       rate: 8,  minFee: 30 },
  { id: "toys",        name: "おもちゃ",     rate: 10, minFee: 30 },
  { id: "hobby",       name: "ホビー",       rate: 10, minFee: 30 },
  { id: "fashion",     name: "服・バッグ",   rate: 12, minFee: 30 },
  { id: "shoes",       name: "シューズ",     rate: 12, minFee: 30 },
  { id: "sports",      name: "スポーツ",     rate: 10, minFee: 30 },
  { id: "outdoor",     name: "アウトドア",   rate: 10, minFee: 30 },
  { id: "car",         name: "車・バイク",   rate: 10, minFee: 30 },
  { id: "food",        name: "食品・飲料",   rate: 8,  minFee: 30 },
  { id: "baby",        name: "ベビー",       rate: 10, minFee: 30 },
  { id: "office",      name: "文房具・オフィス", rate: 15, minFee: 30 },
];

export function getAmazonCategory(id: string): AmazonCategory {
  return AMAZON_CATEGORIES.find((c) => c.id === id) ?? AMAZON_CATEGORIES[0]!;
}

export function calcAmazonFee(price: number, categoryId: string): number {
  const cat = getAmazonCategory(categoryId);
  const raw = (price * cat.rate) / 100;
  return Math.max(raw, cat.minFee);
}

// 標準サイズFBA手数料（簡易版・2024年改定相当）
export function calcFBAFee(weightG: number, longestCm: number): number {
  const w = Math.max(0, weightG);
  const l = Math.max(0, longestCm);
  // 小型/標準サイズの簡易階段式
  if (l <= 25 && w <= 250) return 290;
  if (l <= 35 && w <= 500) return 318;
  if (l <= 60 && w <= 1000) return 397;
  if (l <= 80 && w <= 2000) return 434;
  if (l <= 100 && w <= 5000) return 514;
  if (l <= 120 && w <= 9000) return 603;
  // それ以上は大型
  return 800;
}

export function effectiveAmazonFeeRate(price: number, categoryId: string): number {
  if (price <= 0) return 0;
  return (calcAmazonFee(price, categoryId) / price) * 100;
}
