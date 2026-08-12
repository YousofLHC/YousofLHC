"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, ExternalLink, FileText, Loader2 } from "lucide-react";
import type { ArticleMeta } from "@/lib/mdx";
import { removeArticle, type ArticleKind } from "@/app/admin/actions";

const kindPath: Record<ArticleKind, string> = {
  posts: "blog",
  notes: "notes",
  projects: "projects",
};

export function ArticleManager({
  kind,
  items,
  title,
}: {
  kind: ArticleKind;
  items: ArticleMeta[];
  title: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(slug: string) {
    if (!confirm(`Delete "${slug}"? This cannot be undone.`)) return;
    setBusy(slug);
    setError(null);
    const res = await removeArticle(kind, slug);
    if (res.ok) {
      router.refresh();
    } else {
      setError(res.error ?? "Delete failed");
    }
    setBusy(null);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-kicker">content</p>
          <h1 className="heading mt-2 text-3xl">{title}</h1>
          <p className="mt-2 text-sm text-dim">
            {items.length} published · managed as Markdown files in <code>content/{kind}</code>.
          </p>
        </div>
        <Link href={`/admin/${kind}/new`} className="btn btn-primary">
          <Plus size={15} /> New {kind === "posts" ? "post" : kind.slice(0, -1)}
        </Link>
      </header>

      {error && (
        <p className="mt-6 rounded-lg border border-magenta/30 bg-magenta/10 px-4 py-2.5 text-sm text-magenta">
          {error}
        </p>
      )}

      <div className="mt-8 overflow-hidden rounded-xl border border-line">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-void/40 font-mono text-[11px] uppercase tracking-wider text-faint">
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Date</th>
              <th className="hidden px-5 py-3 sm:table-cell">Tags</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a, i) => (
              <tr
                key={a.slug}
                className={`transition-colors hover:bg-panel/50 ${i > 0 ? "border-t border-line" : ""}`}
              >
                <td className="max-w-[22rem] px-5 py-3.5">
                  <p className="truncate font-medium text-ink">{a.title}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-faint">{a.slug}</p>
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs text-dim">{a.date}</td>
                <td className="hidden max-w-[16rem] px-5 py-3.5 sm:table-cell">
                  <p className="truncate text-[11px] text-dim">{a.tags.join(", ")}</p>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end gap-1.5">
                    <Link
                      href={`/${kindPath[kind]}/${a.slug}`}
                      target="_blank"
                      title="View on site"
                      className="grid h-8 w-8 place-items-center rounded-lg border border-line text-dim transition-colors hover:border-cyan/40 hover:text-cyan"
                    >
                      <ExternalLink size={14} />
                    </Link>
                    <Link
                      href={`/admin/${kind}/${a.slug}`}
                      title="Edit"
                      className="grid h-8 w-8 place-items-center rounded-lg border border-line text-dim transition-colors hover:border-cyan/40 hover:text-cyan"
                    >
                      <Pencil size={14} />
                    </Link>
                    <button
                      onClick={() => handleDelete(a.slug)}
                      disabled={busy === a.slug}
                      title="Delete"
                      className="grid h-8 w-8 place-items-center rounded-lg border border-line text-dim transition-colors hover:border-magenta/50 hover:text-magenta disabled:opacity-50"
                    >
                      {busy === a.slug ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <FileText size={28} className="text-faint" />
            <p className="text-sm text-dim">No {kind} yet. Create the first one.</p>
            <Link href={`/admin/${kind}/new`} className="btn btn-ghost mt-1">
              <Plus size={15} /> New {kind === "posts" ? "post" : kind.slice(0, -1)}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}