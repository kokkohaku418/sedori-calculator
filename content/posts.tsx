import type { ReactNode } from "react";
import Link from "next/link";

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  keywords: string[];
  body: ReactNode;
};

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[22px] sm:text-[26px] font-semibold text-ink-900 mt-12 mb-4 tracking-tight">
      {children}
    </h2>
  );
}

function P({ children }: { children: ReactNode }) {
  return <p className="text-[15px] text-ink-700 leading-[1.9] my-4">{children}</p>;
}

function UL({ children }: { children: ReactNode }) {
  return <ul className="list-disc pl-6 space-y-2 my-4 text-[15px] text-ink-700 leading-[1.8]">{children}</ul>;
}

function CTA() {
  return (
    <div className="my-10 rounded-xl2 bg-ink-900 text-white p-6 sm:p-8 shadow-card">
      <div className="text-[12px] font-semibold uppercase tracking-wider opacity-70 mb-2">
        ツールを使う
      </div>
      <div className="text-[20px] sm:text-[24px] font-semibold leading-tight mb-3">
        実際の数字を入れて、仕入れ判定してみる
      </div>
      <p className="text-[13px] opacity-80 leading-relaxed mb-5">
        メルカリ・ラクマ・Yahoo!フリマ・Amazon FBA 対応。OK / 微妙 / NG を即座に判定します。
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 h-11 rounded-2xl bg-white text-ink-900 text-[13px] font-semibold hover:bg-ink-100 transition"
      >
        計算ツールを開く →
      </Link>
    </div>
  );
}

function FeeTable() {
  const rows = [
    { price: 1000, mercari: 100, rakuma: 60, yahoo: 50 },
    { price: 2000, mercari: 200, rakuma: 120, yahoo: 100 },
    { price: 3000, mercari: 300, rakuma: 180, yahoo: 150 },
    { price: 5000, mercari: 500, rakuma: 300, yahoo: 250 },
    { price: 10000, mercari: 1000, rakuma: 600, yahoo: 500 },
  ];
  return (
    <div className="my-6 rounded-xl2 bg-white border border-ink-100 overflow-hidden">
      <table className="w-full text-[14px] tabular">
        <thead className="bg-ink-50 text-ink-500 text-[12px] font-semibold">
          <tr>
            <th className="py-3 px-4 text-left">販売価格</th>
            <th className="py-3 px-4 text-right">メルカリ (10%)</th>
            <th className="py-3 px-4 text-right">ラクマ (6%)</th>
            <th className="py-3 px-4 text-right">Yahoo! (5%)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.price} className="border-t border-ink-100">
              <td className="py-3 px-4 font-semibold">¥{r.price.toLocaleString()}</td>
              <td className="py-3 px-4 text-right text-red-500">−¥{r.mercari}</td>
              <td className="py-3 px-4 text-right text-red-500">−¥{r.rakuma}</td>
              <td className="py-3 px-4 text-right text-red-500">−¥{r.yahoo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const POSTS: Post[] = [
  {
    slug: "mercari-fee-guide",
    title: "メルカリの手数料はいくら？販売価格別の早見表",
    description:
      "メルカリの販売手数料 10% の計算方法と、販売価格別の早見表。送料・振込手数料も含めた実際の手取り額まで解説。",
    date: "2026-04-10",
    keywords: ["メルカリ 手数料", "メルカリ 手数料 早見表"],
    body: (
      <>
        <P>
          メルカリで商品を販売したとき、手元に残る金額は意外と少なく感じることがあります。
          原因はシンプルで、<strong>販売価格の 10% が手数料</strong>として引かれ、
          さらに送料を出品者負担にすると追加で差し引かれるからです。
        </P>
        <P>
          この記事では、メルカリの販売手数料の計算方法と、価格別の早見表、
          そして実際の手取り額をシミュレーションする方法をまとめます。
        </P>

        <H2>メルカリの販売手数料は一律 10%</H2>
        <P>
          メルカリの販売手数料は、カテゴリに関係なく一律
          <strong>販売価格の 10%</strong>です。1,000 円の商品なら 100 円、
          5,000 円なら 500 円が手数料になります。
        </P>

        <H2>販売価格別の手数料 早見表</H2>
        <FeeTable />
        <P>
          「思ったより引かれる」と感じる方も多いはずです。
          特に低単価の商品では、利益率を維持するのが難しくなります。
        </P>

        <H2>振込手数料 200 円も忘れずに</H2>
        <P>
          売上金を銀行口座に振り込む際、<strong>1 回あたり 200 円の振込手数料</strong>
          がかかります。少額をこまめに振り込むと損なので、ある程度まとめて振り込むのが基本です。
        </P>

        <H2>本当の手取りを計算する方法</H2>
        <P>
          実際の利益は次の式で計算できます：
        </P>
        <UL>
          <li>利益 = 販売価格 − 手数料(10%) − 送料 − 振込手数料(200円) − 仕入価格</li>
        </UL>
        <P>
          毎回手計算するのは大変なので、当サイトの計算ツールを使えば一瞬で算出できます。
          振込手数料のオン/オフや送料込み/別売りの切替にも対応しています。
        </P>

        <CTA />

        <H2>まとめ</H2>
        <UL>
          <li>メルカリの販売手数料は一律 10%</li>
          <li>振込手数料 200 円も含めて計算しないと利益を見誤る</li>
          <li>低単価商品は特に利益率が薄くなりやすい</li>
          <li>計算ツールで毎回の試算を効率化するのがおすすめ</li>
        </UL>
      </>
    ),
  },
  {
    slug: "platform-fee-comparison",
    title: "メルカリ・ラクマ・Yahoo!フリマ 手数料を完全比較",
    description:
      "3 大フリマアプリの販売手数料・振込手数料・売れやすさを徹底比較。あなたに合うのはどれ？",
    date: "2026-04-10",
    keywords: ["フリマアプリ 比較", "ラクマ 手数料", "Yahoo フリマ 手数料"],
    body: (
      <>
        <P>
          せどりで使う主要フリマアプリは <strong>メルカリ</strong>・
          <strong>ラクマ</strong>・<strong>Yahoo!フリマ</strong>の 3 つ。
          手数料だけ見るとラクマや Yahoo!フリマが安いですが、実は単純比較できません。
          この記事では手数料・振込・売れやすさの 3 軸で整理します。
        </P>

        <H2>販売手数料の違い</H2>
        <UL>
          <li>メルカリ：10%</li>
          <li>ラクマ：6%</li>
          <li>Yahoo!フリマ：5%</li>
        </UL>
        <P>
          数字だけ見れば Yahoo!フリマが最安。しかし、
          <strong>「売れる速さ」と「ユーザー数」</strong>を含めて考えると話は変わります。
        </P>

        <H2>振込手数料の違い</H2>
        <UL>
          <li>メルカリ：1 回 200 円（10,000 円以上は無料の条件あり）</li>
          <li>ラクマ：楽天キャッシュへのチャージは無料、銀行振込は 210 円</li>
          <li>Yahoo!フリマ：PayPay 残高チャージは無料</li>
        </UL>

        <H2>売れやすさ（ユーザー数の体感）</H2>
        <P>
          利用者数はメルカリが圧倒的。同じ商品を出品しても、メルカリの方が早く売れる傾向があります。
          手数料の差は確かに重要ですが、<strong>「早く現金化できる」価値</strong>も無視できません。
        </P>

        <H2>結局どれを使えばいい？</H2>
        <UL>
          <li>初心者・回転率重視 → メルカリ</li>
          <li>利益率重視・単価高め → ラクマ・Yahoo!フリマ</li>
          <li>売れ残りを捌きたい → 全プラットフォームに同時出品</li>
        </UL>

        <CTA />

        <H2>まとめ</H2>
        <P>
          手数料の安さだけで選ぶと、売れ残って機会損失する場合があります。
          複数プラットフォームで実際にシミュレーションして、
          自分のジャンルに合った組み合わせを見つけましょう。
        </P>
      </>
    ),
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
