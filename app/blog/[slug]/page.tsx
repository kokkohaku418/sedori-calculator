import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { POSTS, getPost } from "@/content/posts";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    openGraph: { title: post.title, description: post.description, type: "article" },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <main className="min-h-dvh">
      <div className="mx-auto max-w-3xl px-5 sm:px-8 py-10 sm:py-16">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-ink-500 hover:text-ink-900 transition mb-6"
        >
          ← ブログ一覧
        </Link>

        <article>
          <header className="mb-8">
            <div className="text-[11px] text-ink-300 font-semibold tabular mb-3">
              {post.date}
            </div>
            <h1 className="text-[30px] sm:text-[40px] font-semibold tracking-tight text-ink-900 leading-[1.15]">
              {post.title}
            </h1>
            <p className="mt-4 text-[15px] text-ink-500 leading-relaxed">
              {post.description}
            </p>
          </header>

          <div className="prose-custom">{post.body}</div>
        </article>

        <footer className="mt-16 pt-8 border-t border-ink-100 flex items-center justify-between text-[12px] text-ink-500">
          <Link href="/blog" className="hover:text-ink-900 transition">
            ← ブログ一覧
          </Link>
          <Link href="/" className="hover:text-ink-900 transition">
            計算ツールへ →
          </Link>
        </footer>
      </div>
    </main>
  );
}
