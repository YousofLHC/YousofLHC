import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, ExternalLink, GitBranch, Hash, Terminal, Type } from "lucide-react";
import { NotebookViewer } from "@/components/notebook/notebook-viewer";
import { RelatedGrid } from "@/components/blog/related";
import { colabUrl, getNotebook, listNotebooks, notebookSourceUrl } from "@/lib/notebooks";
import { listArticles } from "@/lib/mdx";
import { projects } from "@/lib/data";
import { autoTag, relatedItems, type Taggable } from "@/lib/tags";

export function generateStaticParams() {
  return listNotebooks().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const nb = getNotebook(slug);
  return { title: nb?.title ?? "Notebook", description: nb?.description };
}

export default async function NotebookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const notebook = getNotebook(slug);
  if (!notebook) notFound();

  const [posts, notes] = await Promise.all([listArticles("posts"), listArticles("notes")]);
  const notebooks = listNotebooks();

  const all: Taggable[] = [
    ...posts.map((p) => ({ ...p, kind: "post" as const })),
    ...notes.map((n) => ({ ...n, kind: "note" as const })),
    ...notebooks
      .filter((n) => n.slug !== slug)
      .map((n) => ({
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
    title: notebook.title,
    description: notebook.description,
    tags: autoTag(notebook.description, notebook.tags),
    kind: "notebook",
  };
  const related = relatedItems(all, current, 3);

  return (
    <article className="mx-auto max-w-4xl px-5 pb-24 pt-28">
      <Link
        href="/notes#notebooks"
        className="inline-flex items-center gap-1.5 font-mono text-sm text-dim transition-colors hover:text-cyan"
      >
        <ArrowLeft size={14} /> all notebooks
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-faint">
          <span className="flex items-center gap-1.5 rounded-md border border-line px-2 py-0.5">
            <Terminal size={11} className="text-cyan" /> {notebook.language}
          </span>
          {notebook.kernel && (
            <span className="flex items-center gap-1.5 rounded-md border border-line px-2 py-0.5">
              <Type size={11} className="text-violet" /> {notebook.kernel}
            </span>
          )}
          <span>nbformat {notebook.nbformat}</span>
          <span>· {notebook.date}</span>
        </div>

        <h1 className="heading mt-4 text-3xl sm:text-4xl md:text-[2.6rem] md:leading-[1.15]">
          {notebook.title}
        </h1>
        {notebook.description && (
          <p className="mt-4 text-lg leading-8 text-dim">{notebook.description}</p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <a href={`/notebooks/${notebook.slug}.ipynb`} download className="btn btn-primary">
            <Download size={15} /> Download .ipynb
          </a>
          <a href={colabUrl(notebook.slug)} target="_blank" rel="noreferrer" className="btn btn-ghost">
            <ExternalLink size={15} /> Open in Colab
          </a>
          <a href={notebookSourceUrl(notebook.slug)} target="_blank" rel="noreferrer" className="btn btn-ghost">
            <GitBranch size={14} /> Source
          </a>
          <span className="ml-auto flex items-center gap-2 font-mono text-[11px] text-faint">
            <Hash size={12} />
            {notebook.cellCounts.code} code · {notebook.cellCounts.markdown} markdown ·{" "}
            {notebook.totalLines} lines
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {notebook.tags.map((t) => (
            <span key={t} className="chip !py-0.5 text-[10px]">
              {t}
            </span>
          ))}
        </div>
      </header>

      <div className="mt-10 border-t border-line pt-10">
        <NotebookViewer notebook={notebook} />
      </div>

      <RelatedGrid title="Connected knowledge" items={related} />
    </article>
  );
}
