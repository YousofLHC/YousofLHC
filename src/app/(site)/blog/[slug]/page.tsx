import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Hash } from "lucide-react";
import { getMdxComponents } from "@/components/mdx/mdx-components";
import { ArticleToc } from "@/components/blog/article-toc";
import { RelatedGrid } from "@/components/blog/related";
import { listArticles, renderArticle } from "@/lib/mdx";
import { listNotebooks } from "@/lib/notebooks";
import { projects } from "@/lib/data";
import { autoTag, relatedItems, type Taggable } from "@/lib/tags";

export async function generateStaticParams() {
  return (await listArticles("posts")).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const posts = await listArticles("posts");
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: "Not found" };
  return { title: post.title, description: post.description };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const components = getMdxComponents();
  const rendered = await renderArticle("posts", slug, components);
  if (!rendered) notFound();

  const { content, meta } = rendered;

  const posts = await listArticles("posts");
  const notes = await listArticles("notes");
  const notebooks = listNotebooks();

  const all: Taggable[] = [
    ...posts
      .filter((p) => p.slug !== slug)
      .map((p) => ({ ...p, kind: "post" as const })),
    ...notes.map((n) => ({ ...n, kind: "note" as const })),
    ...notebooks.map((n) => ({
      slug: n.slug,
      title: n.title,
      description: n.description,
      tags: n.tags,
      kind: "notebook" as const,
    })),
    ...projects.map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.summary,
      tags: [...p.tags, ...p.tech],
      kind: "project" as const,
    })),
  ];

  const current: Taggable = {
    slug,
    title: meta.title,
    description: meta.description,
    tags: autoTag(meta.description, meta.tags),
    kind: "post",
  };

  const related = relatedItems(all, current, 3);

  const idx = posts.findIndex((p) => p.slug === slug);
  const prev = posts[idx + 1];
  const next = posts[idx - 1];

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-28">
      <div className="grid gap-10 lg:grid-cols-[1fr_230px]">
        <article className="max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 font-mono text-sm text-dim transition-colors hover:text-cyan"
          >
            <ArrowLeft size={14} /> all articles
          </Link>

          <header className="mt-6">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-faint">
              <span>{meta.date}</span>
              <span className="text-cyan">·</span>
              <span className="flex items-center gap-1">
                <Clock size={11} /> {meta.readTime} min
              </span>
              <span className="text-cyan">·</span>
              <span>{meta.subject ?? "AI / Science"}</span>
            </div>
            <h1 className="heading mt-4 text-3xl sm:text-4xl md:text-[2.75rem] md:leading-[1.15]">
              {meta.title}
            </h1>
            <p className="mt-4 text-lg leading-8 text-dim">{meta.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-1.5">
              <Hash size={13} className="text-faint" />
              {meta.tags.map((t) => (
                <span key={t} className="chip !py-0.5 text-[10px]">
                  {t}
                </span>
              ))}
            </div>
          </header>

          {meta.cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={meta.cover}
              alt=""
              className="mt-8 w-full rounded-2xl border border-line object-cover"
            />
          )}

          <div className="rich mt-10">{content}</div>

          <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
            {prev ? (
              <Link href={`/blog/${prev.slug}`} className="group card p-4 sm:max-w-[45%]">
                <p className="font-mono text-[10px] uppercase tracking-wider text-faint">← previous</p>
                <p className="mt-1 text-sm font-medium text-ink transition-colors group-hover:text-cyan">
                  {prev.title}
                </p>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/blog/${next.slug}`} className="group card p-4 text-right sm:max-w-[45%]">
                <p className="font-mono text-[10px] uppercase tracking-wider text-faint">next →</p>
                <p className="mt-1 text-sm font-medium text-ink transition-colors group-hover:text-cyan">
                  {next.title}
                </p>
              </Link>
            ) : (
              <span />
            )}
          </div>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <ArticleToc />
          </div>
        </aside>
      </div>

      <RelatedGrid title="Connected knowledge" items={related} />
    </div>
  );
}
