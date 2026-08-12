import Link from "next/link";
import { FileCode2, FileText, FolderGit2, NotebookText } from "lucide-react";
import type { Taggable } from "@/lib/tags";

const kindMeta = {
  post: { icon: FileText, color: "text-violet", href: (s: string) => `/blog/${s}` },
  note: { icon: NotebookText, color: "text-emerald", href: (s: string) => `/notes/${s}` },
  notebook: { icon: FileCode2, color: "text-cyan", href: (s: string) => `/notebooks/${s}` },
  project: { icon: FolderGit2, color: "text-magenta", href: (s: string) => `/projects/${s}` },
} as const;

export function RelatedGrid({
  title,
  items,
}: {
  title: string;
  items: Taggable[];
}) {
  if (items.length === 0) return null;
  return (
    <div className="mt-14">
      <h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-cyan">
        <span className="h-px w-6 bg-cyan/50" />
        {title}
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => {
          const meta = kindMeta[it.kind] ?? kindMeta.post;
          return (
            <Link
              key={`${it.kind}-${it.slug}`}
              href={meta.href(it.slug)}
              className="card group flex flex-col p-5"
            >
              <div className="flex items-center gap-2">
                <span className={`grid h-8 w-8 place-items-center rounded-lg bg-panel-2 ${meta.color}`}>
                  <meta.icon size={14} />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
                  {it.kind}
                </span>
              </div>
              <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-snug text-ink transition-colors group-hover:text-cyan">
                {it.title}
              </h3>
              {it.description && (
                <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-dim">
                  {it.description}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {it.tags.slice(0, 3).map((t) => (
                  <span key={t} className="chip !py-0.5 text-[10px]">
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
