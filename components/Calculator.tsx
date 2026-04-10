"use client";
import { useMemo, useState } from "react";
import InputField from "./InputField";
import PlatformTabs from "./PlatformTabs";
import ResultCard from "./ResultCard";
import { PLATFORMS, type PlatformId } from "@/lib/platforms";
import { calculate, safeNumber } from "@/lib/calc";

export default function Calculator() {
  const [platform, setPlatform] = useState<PlatformId>("mercari");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const [shipping, setShipping] = useState("");
  const [feeOverride, setFeeOverride] = useState<string | null>(null);

  const feeRate = useMemo(() => {
    if (feeOverride !== null) return safeNumber(feeOverride);
    return PLATFORMS.find((p) => p.id === platform)?.feeRate ?? 10;
  }, [platform, feeOverride]);

  const result = useMemo(
    () =>
      calculate({
        cost: safeNumber(cost),
        price: safeNumber(price),
        feeRate,
        shipping: safeNumber(shipping),
      }),
    [cost, price, feeRate, shipping]
  );

  const handlePlatform = (id: PlatformId) => {
    setPlatform(id);
    setFeeOverride(null);
  };

  const reset = () => {
    setCost("");
    setPrice("");
    setShipping("");
    setFeeOverride(null);
    setPlatform("mercari");
  };

  return (
    <div className="grid lg:grid-cols-[1.05fr_1fr] gap-5 lg:gap-6 items-start">
      <section className="rounded-xl2 bg-white shadow-card p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-[11px] font-semibold text-ink-500 uppercase tracking-[0.08em] mb-3">
            プラットフォーム
          </h2>
          <PlatformTabs selected={platform} onSelect={handlePlatform} />
        </div>

        <div className="space-y-4">
          <InputField
            label="仕入価格"
            value={cost}
            onChange={setCost}
            placeholder="例: 1,200"
          />
          <InputField
            label="販売価格"
            value={price}
            onChange={setPrice}
            placeholder="例: 2,980"
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="手数料率"
              value={feeOverride ?? String(feeRate)}
              onChange={(v) => setFeeOverride(v)}
              suffix="%"
              inputMode="decimal"
            />
            <InputField
              label="送料"
              value={shipping}
              onChange={setShipping}
              placeholder="例: 210"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={reset}
          className="mt-6 w-full h-11 rounded-2xl bg-ink-50 hover:bg-ink-100 active:scale-[0.985] text-[13px] font-semibold text-ink-700 transition-all duration-150"
        >
          リセット
        </button>
      </section>

      <section className="lg:sticky lg:top-8">
        <ResultCard result={result} />
        <p className="mt-4 text-[11px] text-ink-500 leading-relaxed px-2">
          ※ 計算結果は目安です。実際の手数料・送料・振込手数料等は各プラットフォームの最新規約をご確認ください。
        </p>
      </section>
    </div>
  );
}
