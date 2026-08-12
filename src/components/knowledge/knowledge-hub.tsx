"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { BookOpen, Download, FileCode2 } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import type { ArticleMeta } from "@/lib/mdx";

type NoteLike = ArticleMeta & { slug: string };

export interface NotebookMeta {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  language: string;
  cellCounts: { code: number; markdown: number };
  thumbnail?: string;
}

interface HubItem {
  kind: "note" | "notebook";
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  href: string;
  subject?: string;
  order?: number;
  pdf?: boolean;
  readTime?: number;
  language?: string;
  codeCells?: number;
  thumbnail?: string;
}

type Tab = "all" | "notes" | "notebooks";

const tabs: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "notes", label: "Study notes" },
  { id: "notebooks", label: "Notebooks" },
];

function buildItems(notes: NoteLike[], notebooks: NotebookMeta[]): HubItem[] {
  const notesItems: HubItem[] = notes.map((n) => ({
    kind: "note",
    slug: n.slug,
    title: n.title,
    description: n.description,
    date: n.date,
    tags: n.tags,
    href: `/notes/${n.slug}`,
    subject: n.subject || "General",
    order: n.order,
    pdf: Boolean(n.pdf),
    readTime: n.readTime,
  }));
  const nbItems: HubItem[] = notebooks.map((nb) => ({
    kind: "notebook",
    slug: nb.slug,
    title: nb.title,
    description: nb.description,
    date: nb.date,
    tags: nb.tags,
    href: `/notebooks/${nb.slug}`,
    language: nb.language,
    codeCells: nb.cellCounts.code,
    thumbnail: nb.thumbnail,
  }));
  return [...notesItems, ...nbItems];
}

function KindBadge({ item }: { item: HubItem }) {
  if (item.kind === "notebook") {
    return (
      <span className="flex items-center gap-1 rounded-md border border-line bg-panel/70 px-2 py-0.5 font-mono text-[10px] text-cyan">
        <FileCode2 size={10} /> {item.language} · {item.codeCells ?? 0} cells
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 rounded-md border border-line bg-panel/70 px-2 py-0.5 font-mono text-[10px] text-violet">
      <BookOpen size={10} /> note {String(item.order ?? "00").padStart(2, "0")}
    </span>
  );
}

function HubCard({ item }: { item: HubItem }) {
  return (
    <Link
      href={item.href}
      className="card group flex h-full flex-col p-5"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
          {item.date}
        </span>
        {item.kind === "note" && item.pdf && (
          <span className="flex items-center gap-1 font-mono text-[10px] text-faint transition-colors group-hover:text-cyan">
            <Download size={11} /> pdf
          </span>
        )}
      </div>
      <h3 className="mt-2.5 font-semibold leading-snug text-ink transition-colors group-hover:text-cyan">
        {item.title}
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-dim">
        {item.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {item.tags.slice(0, 3).map((t) => (
          <span key={t} className="chip !py-0.5 text-[10px]">
            {t}
          </span>
        ))}
        <span className="ml-auto">
          <KindBadge item={item} />
        </span>
      </div>
    </Link>
  );
}

export function KnowledgeHub({
  notes,
  notebooks,
}: {
  notes: NoteLike[];
  notebooks: NotebookMeta[];
}) {
  const items = buildItems(notes, notebooks);
  const [tab, setTab] = useState<Tab>(() => {
    if (typeof window === "undefined") return "all";
    const h = window.location.hash;
    if (h === "#notebooks") return "notebooks";
    if (h === "#notes") return "notes";
    return "all";
  });

  const select = (id: Tab) => {
    setTab(id);
    const url = new URL(window.location.href);
    url.hash = id === "all" ? "" : id;
    window.history.replaceState(null, "", url);
  };

  const counts = {
    all: items.length,
    notes: notes.length,
    notebooks: notebooks.length,
  };

  const bySubject = useCallback(
    (s: string) =>
      items
        .filter((i) => i.kind === "note" && (i.subject || "General") === s)
        .sort((a, b) => (a.order ?? 99) - (b.order ?? 99)),
    [items]
  );

  const subjects = Array.from(
    new Set(notes.map((n) => n.subject || "General"))
  ).sort();

  const visible = tab === "all" ? items : tab === "notes" ? items.filter((i) => i.kind === "note") : items.filter((i) => i.kind === "notebook");

  return (
    <>
      <div className="mt-7 flex flex-wrap items-center gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => select(t.id)}
            className={`rounded-full border px-4 py-1.5 font-mono text-xs transition-colors ${
              tab === t.id
                ? "border-cyan/50 bg-cyan/10 text-cyan shadow-[0_0_14px_rgba(59,225,255,0.2)]"
                : "border-line bg-panel/50 text-dim hover:border-cyan/40 hover:text-ink"
            }`}
          >
            {t.label}
            <span className="ml-1.5 opacity-60">{counts[t.id]}</span>
          </button>
        ))}
      </div>

      {tab === "notes" ? (
        <div className="mt-10 space-y-14">
          {subjects.map((s, si) =>
            bySubject(s).length > 0 ? (
              <section key={s}>
                <Reveal delay={si * 0.04}>
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-cyan/20 to-violet/20 text-cyan">
                      <BookOpen size={16} />
                    </span>
                    <h2 className="heading text-2xl">{s}</h2>
                    <span className="h-px flex-1 bg-gradient-to-r from-line-strong to-transparent" />
                  </div>
                </Reveal>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {bySubject(s).map((n, i) => (
                    <Reveal key={n.slug} delay={i * 0.05}>
                      <HubCard item={n} />
                    </Reveal>
                  ))}
                </div>
              </section>
            ) : null
          )}
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item, i) => (
            <Reveal key={`${item.kind}-${item.slug}`} delay={i * 0.05}>
              <HubCard item={item} />
            </Reveal>
          ))}
        </div>
      )}
    </>
  );
}