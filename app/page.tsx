import Calculator from "@/components/Calculator";

export default function Page() {
  return (
    <main className="min-h-dvh">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 py-10 sm:py-16">
        <header className="mb-9 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-card text-[11px] font-semibold text-ink-700 mb-5 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            無料・登録不要
          </div>
          <h1 className="text-[34px] sm:text-[46px] font-semibold tracking-tight text-ink-900 leading-[1.08]">
            せどり利益、
            <br className="sm:hidden" />
            一瞬で計算。
          </h1>
          <p className="mt-4 text-[15px] sm:text-[17px] text-ink-500 max-w-xl leading-relaxed">
            メルカリ・ラクマ・Yahoo!フリマに対応。仕入から販売までの利益・利益率・損益分岐点を即座に算出します。
          </p>
        </header>

        <Calculator />

        <footer className="mt-16 pt-8 border-t border-ink-100 text-[11px] text-ink-500 flex flex-wrap items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Sedori Calculator</span>
          <span>Made for resellers, by resellers.</span>
        </footer>
      </div>
    </main>
  );
}
