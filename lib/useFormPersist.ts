import type { PlatformId } from "./platforms";

const KEY = "sedori:form:v1";

export type FormState = {
  platform: PlatformId;
  cost: string;
  price: string;
  shipping: string;
  feeOverride: string | null;
  packing: string;
  transport: string;
  mercariTransfer: boolean;
  amazonCategory: string;
  fba: boolean;
  weight: string;
  longest: string;
};

/**
 * 初回アクセス時のサンプル値。
 * メルカリで仕入1200/販売2980/送料210/振込200円 → 利益 約1,072 / 利益率 36% (OK判定)
 * → 初回ユーザーが何も入力せずに AffiliateBlock(OK) を見られる。
 */
export const SAMPLE_FORM: FormState = {
  platform: "mercari",
  cost: "1200",
  price: "2980",
  shipping: "210",
  feeOverride: null,
  packing: "",
  transport: "",
  mercariTransfer: true,
  amazonCategory: "home",
  fba: false,
  weight: "",
  longest: "",
};

export function loadPersistedForm(): FormState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<FormState>;
    // 欠けたキーを SAMPLE で補完して堅牢化
    return { ...SAMPLE_FORM, ...parsed };
  } catch {
    return null;
  }
}

export function savePersistedForm(state: FormState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}
