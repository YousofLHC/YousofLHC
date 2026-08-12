import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Download, FolderTree } from "lucide-react";
import { getMdxComponents } from "@/components/mdx/mdx-components";
import { ArticleToc } from "@/components/blog/article-toc";
import { RelatedGrid } from "@/components/blog/related";
import { listArticles, renderArticle } from "@/lib/mdx";
import { listNotebooks } from "@/lib/notebooks";
import { projects } from "@/lib/data";
import { autoTag, relatedItems, type Taggable } from "@/lib/tags";

export async function generateStaticParams() {
  return (await listArticles("notes")).map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const notes = await listArticles("notes");
  const note = notes.find((n) => n.slug === slug);
  return { title: note?.title ?? "Study note", description: note?.description };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const rendered = await renderArticle("notes", slug, getMdxComponents());
  if (!rendered) notFound();
  const { content, meta } = rendered;

  const notes = await listArticles("notes");
  const posts = await listArticles("posts");
  const notebooks = listNotebooks();

  const all: Taggable[] = [
    ...posts.map((p) => ({ ...p, kind: "post" as const })),
    ...notes
      .filter((n) => n.slug !== slug)
      .map((n) => ({ ...n, kind: "note" as const })),
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
    kind: "note",
  };
  const related = relatedItems(all, current, 3);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-28">
      <div className="grid gap-10 lg:grid-cols-[1fr_230px]">
        <article className="max-w-3xl">
          <Link
            href="/notes"
            className="inline-flex items-center gap-1.5 font-mono text-sm text-dim transition-colors hover:text-cyan"
          >
            <ArrowLeft size={14} /> all notes
          </Link>

          <header className="mt-6">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-faint">
              {meta.subject && (
                <span className="flex items-center gap-1.5">
                  <FolderTree size={11} /> {meta.subject}
                </span>
              )}
              <span className="text-cyan">·</span>
              <span>{meta.date}</span>
              <span className="text-cyan">·</span>
              <span className="flex items-center gap-1">
                <Clock size={11} /> {meta.readTime} min
              </span>
            </div>
            <h1 className="heading mt-4 text-3xl sm:text-4xl">{meta.title}</h1>
            <p className="mt-4 text-lg leading-8 text-dim">{meta.description}</p>
            {meta.pdf && (
              <a href={meta.pdf} download className="btn btn-primary mt-5">
                <Download size={15} /> Download PDF handout
              </a>
            )}
          </header>

          <div className="rich mt-10">{content}</div>

          <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-line pt-6 font-mono text-[10px] uppercase tracking-wider text-faint">
            <span>tags:</span>
            {meta.tags.map((t) => (
              <span key={t} className="chip !py-0.5 text-[10px] normal-case">
                {t}
              </span>
            ))}
          </div>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <ArticleToc />
          </div>
        </aside>
      </div>

      <RelatedGrid title="Continue the thread" items={related} />
    </div>
  );
}
