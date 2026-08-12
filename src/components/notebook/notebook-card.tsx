import Link from "next/link";
import type { ComponentType } from "react";
import { Download, FileCode2, FileText, Grip } from "lucide-react";
import type { Notebook } from "@/lib/notebooks";

export function NotebookCard({ notebook }: { notebook: Notebook }) {
  return (
    <Link
      href={`/notebooks/${notebook.slug}`}
      className="card group flex flex-col overflow-hidden"
    >
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-panel-2 via-panel to-abyss">
        {notebook.thumbnail ? (
          notebook.thumbnail.startsWith("data:") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={notebook.thumbnail}
              alt=""
              className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className="h-full w-full bg-white p-3"
              dangerouslySetInnerHTML={{ __html: notebook.thumbnail }}
            />
          )
        ) : (
          <div className="grid h-full w-full place-items-center text-cyan/40">
            <FileCode2 size={42} />
          </div>
        )}
        <div className="absolute right-3 top-3 flex gap-1.5">
          <span className="rounded-md glass px-2 py-1 font-mono text-[10px] text-cyan">
            {notebook.language}
          </span>
          <span className="rounded-md glass px-2 py-1 font-mono text-[10px] text-dim">
            {notebook.nbformat} ·{notebook.cellCounts.code} cells
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
          {notebook.date}
        </p>
        <h3 className="mt-1.5 font-semibold leading-snug text-ink transition-colors group-hover:text-cyan">
          {notebook.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-dim">
          {notebook.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {notebook.tags.slice(0, 3).map((t) => (
            <span key={t} className="chip !py-0.5 text-[10px]">
              {t}
            </span>
          ))}
          <span className="ml-auto flex items-center gap-1 font-mono text-[11px] text-faint transition-colors group-hover:text-cyan">
            <Grip size={12} /> open
          </span>
        </div>
      </div>
    </Link>
  );
}

export function NotebookMini({
  notebook,
  icon: Icon = FileText,
}: {
  notebook: Notebook;
  icon?: ComponentType<{ size?: number | string; className?: string }>;
}) {
  return (
    <Link
      href={`/notebooks/${notebook.slug}`}
      className="card group flex items-center gap-3 p-4"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-cyan/20 to-violet/20 text-cyan">
        <Icon size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink group-hover:text-cyan">
          {notebook.title}
        </p>
        <p className="truncate font-mono text-[11px] text-faint">
          {notebook.cellCounts.code} code · {notebook.cellCounts.markdown} markdown cells
        </p>
      </div>
      <Download size={14} className="shrink-0 text-faint transition-colors group-hover:text-cyan" />
    </Link>
  );
}
