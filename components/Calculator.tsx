"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import InputField from "./InputField";
import PlatformTabs from "./PlatformTabs";
import ResultCard from "./ResultCard";
import HistoryPanel from "./HistoryPanel";
import ShareButtons from "./ShareButtons";
import ReverseHint from "./ReverseHint";
import AffiliateBlock from "./AffiliateBlock";
import AmazonOptions from "./AmazonOptions";
import { PLATFORMS, getPlatform, type PlatformId } from "@/lib/platforms";
import { calculate, judge, safeNumber, formatYen } from "@/lib/calc";
import { calcAmazonFee, calcFBAFee, effectiveAmazonFeeRate } from "@/lib/amazon";
import { useHistory, type HistoryEntry } from "@/lib/useHistory";
import { decodeShare, type ShareState } from "@/lib/share";

type Tab = "calc" | "history";

function CalculatorInner() {
  const params = useSearchParams();
  const initial = useMemo(() => decodeShare(new URLSearchParams(params.toString())), [params]);

  const [platform, setPlatform] = useState<PlatformId>(initial.p ?? "mercari");
  const [cost, setCost] = useState(initial.c ? String(initial.c) : "");
  const [price, setPrice] = useState(initial.s ? String(initial.s) : "");
  const [shipping, setShipping] = useState(initial.sh ? String(initial.sh) : "");
  const [feeOverride, setFeeOverride] = useState<string | null>(
    initial.f != null ? String(initial.f) : null
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [packing, setPacking] = useState("");
  const [transport, setTransport] = useState("");
  const [mercariTransfer, setMercariTransfer] = useState(true);

  // Amazon
  const [amazonCategory, setAmazonCategory] = useState(initial.cat ?? "home");
  const [fba, setFba] = useState(false);
  const [weight, setWeight] = useState("");
  const [longest, setLongest] = useState("");

  const [tab, setTab] = useState<Tab>("calc");
  const history = useHistory();

  const isAmazon = platform === "amazon";

  const feeRate = useMemo(() => {
    if (isAmazon) {
      return effectiveAmazonFeeRate(safeNumber(price), amazonCategory);
    }
    if (feeOverride !== null && feeOverride !== "") return safeNumber(feeOverride);
    return getPlatform(platform).feeRate;
  }, [isAmazon, price, amazonCategory, feeOverride, platform]);

  const fixedCost = safeNumber(packing) + safeNumber(transport);

  const amazonFbaShipping = useMemo(() => {
    if (!isAmazon || !fba) return 0;
    return calcFBAFee(safeNumber(weight), safeNumber(longest));
  }, [isAmazon, fba, weight, longest]);

  const effectiveShipping = isAmazon && fba ? amazonFbaShipping : safeNumber(shipping);

  const extraFee = platform === "mercari" && mercariTransfer ? 200 : 0;

  const result = useMemo(
    () =>
      calculate({
        cost: safeNumber(cost),
        price: safeNumber(price),
        feeRate,
        shipping: effectiveShipping,
        fixedCost,
        extraFee,
      }),
    [cost, price, feeRate, effectiveShipping, fixedCost, extraFee]
  );
  const verdict = judge(result);

  // 販売価格欄の hint
  const priceHint = useMemo(() => {
    const p = safeNumber(price);
    if (p <= 0) return null;
    const fee = (p * feeRate) / 100 + extraFee;
    const net = p - fee;
    return (
      <span>
        手数料 <span className="text-red-500">−{formatYen(fee)}</span> ／ 受取{" "}
        <span className="text-ink-700 font-semibold">{formatYen(net)}</span>
      </span>
    );
  }, [price, feeRate, extraFee]);

  const handlePlatform = (id: PlatformId) => {
    setPlatform(id);
    setFeeOverride(null);
  };

  const reset = () => {
    setCost("");
    setPrice("");
    setShipping("");
    setFeeOverride(null);
    setPacking("");
    setTransport("");
    setPlatform("mercari");
    setShowAdvanced(false);
    setFba(false);
    setWeight("");
    setLongest("");
  };

  const handleSave = () => {
    if (!result.valid) return;
    history.save({
      name: "",
      platform,
      cost: safeNumber(cost),
      price: safeNumber(price),
      feeRate,
      shipping: effectiveShipping,
      fixedCost,
      profit: result.profit,
      marginRate: result.marginRate,
      verdict,
    });
  };

  const loadFromHistory = (e: HistoryEntry) => {
    setPlatform(e.platform);
    setCost(String(e.cost));
    setPrice(String(e.price));
    setShipping(String(e.shipping));
    setFeeOverride(null);
    setPacking("");
    setTransport(String(e.fixedCost || ""));
    setTab("calc");
  };

  const shareState: ShareState = {
    p: platform,
    c: safeNumber(cost) || undefined,
    s: safeNumber(price) || undefined,
    sh: safeNumber(shipping) || undefined,
    f: feeOverride !== null ? safeNumber(feeOverride) : undefined,
    fx: fixedCost || undefined,
    cat: isAmazon ? amazonCategory : undefined,
  };

  return (
    <div className="grid lg:grid-cols-[1.05fr_1fr] gap-5 lg:gap-6 items-start">
      <section className="rounded-xl2 bg-white shadow-card p-6 sm:p-8">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-ink-100 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setTab("calc")}
            className={`flex-1 h-10 rounded-xl text-[13px] font-semibold transition ${
              tab === "calc" ? "bg-white text-ink-900 shadow-card" : "text-ink-500"
            }`}
          >
            計算
          </button>
          <button
            type="button"
            onClick={() => setTab("history")}
            className={`flex-1 h-10 rounded-xl text-[13px] font-semibold transition ${
              tab === "history" ? "bg-white text-ink-900 shadow-card" : "text-ink-500"
            }`}
          >
            履歴 {history.stats.total > 0 && `(${history.stats.total})`}
          </button>
        </div>

        {tab === "calc" ? (
          <>
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
                hint={priceHint}
              />

              {isAmazon ? (
                <AmazonOptions
                  category={amazonCategory}
                  onCategory={setAmazonCategory}
                  fba={fba}
                  onFba={setFba}
                  weight={weight}
                  onWeight={setWeight}
                  longest={longest}
                  onLongest={setLongest}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="手数料率"
                    value={feeOverride ?? String(getPlatform(platform).feeRate)}
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
              )}

              {platform === "mercari" && (
                <label className="flex items-center justify-between gap-3 px-1 cursor-pointer select-none">
                  <span className="text-[12px] font-semibold text-ink-700">
                    振込手数料 (¥200) を含める
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={mercariTransfer}
                    onClick={() => setMercariTransfer(!mercariTransfer)}
                    className={`relative w-10 h-5.5 w-11 h-6 rounded-full transition-colors ${
                      mercariTransfer ? "bg-ink-900" : "bg-ink-300"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        mercariTransfer ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </label>
              )}

              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full text-left text-[12px] font-semibold text-ink-500 hover:text-ink-700 transition flex items-center gap-1"
              >
                <span className={`transition-transform ${showAdvanced ? "rotate-90" : ""}`}>
                  ▶
                </span>
                詳細設定（梱包費・交通費）
              </button>
              {showAdvanced && (
                <div className="grid grid-cols-2 gap-4 animate-rise">
                  <InputField
                    label="梱包資材費"
                    value={packing}
                    onChange={setPacking}
                    placeholder="例: 50"
                  />
                  <InputField
                    label="交通費"
                    value={transport}
                    onChange={setTransport}
                    placeholder="例: 0"
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={reset}
              className="mt-6 w-full h-11 rounded-2xl bg-ink-50 hover:bg-ink-100 active:scale-[0.985] text-[13px] font-semibold text-ink-700 transition-all duration-150"
            >
              リセット
            </button>
          </>
        ) : (
          <HistoryPanel
            items={history.items}
            stats={history.stats}
            onLoad={loadFromHistory}
            onRemove={history.remove}
            onClear={history.clear}
          />
        )}
      </section>

      <section className="lg:sticky lg:top-8 space-y-4">
        <ResultCard result={result} verdict={verdict} />

        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-2">
          <button
            type="button"
            disabled={!result.valid}
            onClick={handleSave}
            className="h-11 px-4 rounded-2xl bg-ink-900 hover:bg-ink-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[13px] font-semibold transition active:scale-[0.985]"
          >
            💾 履歴に保存
          </button>
          <ShareButtons
            result={result}
            verdict={verdict}
            platform={platform}
            shareState={shareState}
          />
        </div>

        <ReverseHint
          cost={safeNumber(cost)}
          shipping={effectiveShipping}
          feeRate={feeRate}
          fixedCost={fixedCost}
          extraFee={extraFee}
        />

        <AffiliateBlock platform={platform} />

        <p className="text-[11px] text-ink-500 leading-relaxed px-2">
          ※ 計算結果は目安です。実際の手数料・送料・振込手数料等は各プラットフォームの最新規約をご確認ください。
        </p>
      </section>
    </div>
  );
}

export default function Calculator() {
  return (
    <Suspense fallback={<div className="rounded-xl2 bg-white shadow-card p-8 text-center text-ink-500">読み込み中…</div>}>
      <CalculatorInner />
    </Suspense>
  );
}
