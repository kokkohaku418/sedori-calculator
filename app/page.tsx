import Calculator from "@/components/Calculator";
import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-dvh">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 py-10 sm:py-16">
        <header className="mb-9 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-card text-[11px] font-semibold text-ink-700 mb-5 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            ⚡ 1秒で判定 / 完全無料 / 登録不要
          </div>
          <h1 className="text-[34px] sm:text-[48px] font-semibold tracking-tight text-ink-900 leading-[1.05]">
            その仕入れ、
            <br className="sm:hidden" />
            利益出ますか？
          </h1>
          <p className="mt-4 text-[15px] sm:text-[17px] text-ink-500 max-w-xl leading-relaxed">
            メルカリ・ラクマ・Yahoo!フリマ・Amazon FBA 対応。
            利益額・利益率・損益分岐点を即座に判定し、
            <strong className="text-ink-900 font-semibold">「仕入れOK / 微妙 / NG」</strong>
            まで一発で表示します。
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Pill icon="✓" tone="emerald" text="仕入れOK" />
            <Pill icon="!" tone="amber" text="微妙" />
            <Pill icon="×" tone="red" text="見送り" />
          </div>
        </header>

        <Calculator />

        <section className="mt-16 grid sm:grid-cols-3 gap-4">
          <Feature
            title="判定エンジン搭載"
            desc="利益率と利益額から「OK / 微妙 / NG」を瞬時に判定。仕入れの迷いを減らす。"
          />
          <Feature
            title="4プラットフォーム対応"
            desc="メルカリ・ラクマ・Yahoo!フリマに加え、Amazon カテゴリ別 + FBA 手数料も自動計算。"
          />
          <Feature
            title="履歴・シェア機能"
            desc="計算結果を最大 50 件保存。X へのワンクリックシェアで仲間と共有。"
          />
        </section>

        <footer className="mt-16 pt-8 border-t border-ink-100 text-[11px] text-ink-500 flex flex-wrap items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Sedori Calculator</span>
          <nav className="flex items-center gap-4">
            <Link href="/blog" className="hover:text-ink-900 transition">
              ブログ
            </Link>
            <span>Made for resellers, by resellers.</span>
          </nav>
        </footer>
      </div>
    </main>
  );
}

function Pill({ icon, tone, text }: { icon: string; tone: "emerald" | "amber" | "red"; text: string }) {
  const cls =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "amber"
      ? "bg-amber-50 text-amber-700"
      : "bg-red-50 text-red-600";
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold ${cls}`}>
      <span className="w-4 h-4 rounded-full bg-white/60 flex items-center justify-center text-[10px]">
        {icon}
      </span>
      {text}
    </span>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl2 bg-white shadow-card p-6">
      <div className="text-[14px] font-semibold text-ink-900 mb-1.5">{title}</div>
      <div className="text-[12px] text-ink-500 leading-relaxed">{desc}</div>
    </div>
  );
}
