import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, GitBranch, Globe, CalendarDays } from "lucide-react";
import { getMdxComponents } from "@/components/mdx/mdx-components";
import { RelatedGrid } from "@/components/blog/related";
import { Reveal } from "@/components/ui/reveal";
import { renderArticle, listArticles } from "@/lib/mdx";
import { projects, domainColors } from "@/lib/data";
import { listNotebooks } from "@/lib/notebooks";
import { autoTag, relatedItems, type Taggable } from "@/lib/tags";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return {
    title: p?.title ?? "Project",
    description: p?.summary,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const components = getMdxComponents();
  const rendered = await renderArticle("projects", slug, components);

  const notebooks = listNotebooks();
  const [posts, notes] = await Promise.all([
    listArticles("posts"),
    listArticles("notes"),
  ]);

  const all: Taggable[] = [
    ...posts.map((p) => ({ ...p, kind: "post" as const })),
    ...notes.map((n) => ({ ...n, kind: "note" as const })),
    ...notebooks.map((n) => ({
      slug: n.slug,
      title: n.title,
      description: n.description,
      tags: n.tags,
      kind: "notebook" as const,
    })),
    ...projects
      .filter((p) => p.slug !== slug)
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        description: p.summary,
        tags: [...p.tags, ...p.tech],
        kind: "project" as const,
      })),
  ];

  const current: Taggable = {
    slug,
    title: project.title,
    description: project.summary,
    tags: autoTag(project.summary + project.tags.join(" "), [...project.tags, ...project.tech]),
    kind: "project",
  };

  const related = relatedItems(all, current, 3);

  return (
    <article className="mx-auto max-w-3xl px-5 pb-24 pt-28">
      <Reveal>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 font-mono text-sm text-dim transition-colors hover:text-cyan"
        >
          <ArrowLeft size={14} /> all projects
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span
            className="rounded-md px-2.5 py-1 font-mono text-[11px]"
            style={{
              color: domainColors[project.domainColor],
              backgroundColor: `${domainColors[project.domainColor]}1f`,
              border: `1px solid ${domainColors[project.domainColor]}40`,
            }}
          >
            {project.domain}
          </span>
          {project.tags.map((t) => (
            <span key={t} className="chip !py-1 text-[11px]">
              {t}
            </span>
          ))}
        </div>

        <h1 className="heading mt-4 text-4xl sm:text-5xl">{project.title}</h1>
        <p className="mt-3 text-xl text-dim">{project.subtitle}</p>

        <div className="mt-6 flex flex-wrap items-center gap-4 font-mono text-xs text-faint">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={13} /> {project.year}
          </span>
          <span className="uppercase tracking-wider">{project.status}</span>
          <span className="flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <span key={t} className="rounded bg-panel px-1.5 py-0.5">
                {t}
              </span>
            ))}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-2.5">
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer" className="btn btn-ghost">
              <GitBranch size={15} /> GitHub
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noreferrer" className="btn btn-ghost">
              <Globe size={15} /> Live demo
            </a>
          )}
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        {rendered ? (
          <div className="rich mt-10">{rendered.content}</div>
        ) : (
          <div className="mt-10 space-y-5">
            <p className="leading-8 text-ink/80">{project.summary}</p>
            <p className="text-dim">
              The full deep-dive write-up for this project is being prepared. In the
              meantime, explore the related content below or check the linked repository.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[...project.tags, ...project.tech].map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </Reveal>

      <RelatedGrid title="Connected knowledge" items={related} />
    </article>
  );
}
