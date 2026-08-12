"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { dump } from "js-yaml";
import matter from "gray-matter";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Eye,
  Download,
  Upload,
  ListTree,
} from "lucide-react";
import { Field, TextInput, TextArea, Toggle } from "@/components/admin/field";
import { EditorToolbar } from "@/components/admin/editor/toolbar";
import { MarkdownPreview } from "@/components/admin/editor/preview";
import { createOrUpdateArticle, type ArticleKind } from "@/app/admin/actions";

interface EditorState {
  frontmatter: Record<string, unknown>;
  body: string;
  slug: string;
}

function tagsToText(tags: unknown): string {
  return Array.isArray(tags) ? tags.join(", ") : "";
}

function textToTags(text: string): string[] {
  return text
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function computeReadTime(body: string): number {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function defaultFrontmatter(kind: ArticleKind, today: string): Record<string, unknown> {
  const base: Record<string, unknown> = {
    title: "",
    description: "",
    date: today,
    tags: [],
    cover: "",
    draft: false,
  };
  if (kind === "notes") {
    base.subject = "Mathematics";
    base.order = 1;
    base.pdf = "";
  }
  return base;
}

interface Heading {
  level: number;
  text: string;
  offset: number;
}

function extractHeadings(body: string): Heading[] {
  const out: Heading[] = [];
  const re = /^(#{1,4})\s+(.+)$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    out.push({ level: m[1].length, text: m[2].trim(), offset: m.index });
  }
  return out;
}

export function ArticleEditor({
  kind,
  slug,
  initial,
}: {
  kind: ArticleKind;
  slug?: string;
  initial: { frontmatter: Record<string, unknown>; body: string } | null;
}) {
  const router = useRouter();
  const [state, setState] = useState<EditorState>(() => ({
    frontmatter: initial?.frontmatter ?? defaultFrontmatter(kind, new Date().toISOString().slice(0, 10)),
    body: initial?.body ?? "",
    slug: slug ?? "",
  }));
  const [busy, setBusy] = useState(false);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showOutline, setShowOutline] = useState(false);

  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const selRef = useRef({ s: 0, e: 0 });
  const fileRef = useRef<HTMLInputElement>(null);

  const fm = state.frontmatter;
  const title = String(fm.title ?? "");
  const tagsText = tagsToText(fm.tags);

  const set = (key: string, value: unknown) =>
    setState((s) => ({ ...s, frontmatter: { ...s.frontmatter, [key]: value } }));

  const outline = useMemo(() => extractHeadings(state.body), [state.body]);

  const stats = useMemo(() => {
    const words = state.body.split(/\s+/).filter(Boolean).length;
    return {
      words,
      chars: state.body.length,
      lines: state.body.split("\n").length,
      readTime: computeReadTime(state.body),
      codeBlocks: (state.body.match(/```/g) ?? []).length / 2,
    };
  }, [state.body]);

  function syncSelection() {
    const ta = bodyRef.current;
    if (ta) selRef.current = { s: ta.selectionStart, e: ta.selectionEnd };
  }

  function insert(prefix: string, middle: string, suffix = "") {
    const { s, e } = selRef.current;
    const selected = state.body.slice(s, e) || middle;
    const next = state.body.slice(0, s) + prefix + selected + suffix + state.body.slice(e);
    const caret = s + prefix.length + selected.length;
    setState((prev) => ({ ...prev, body: next }));
    requestAnimationFrame(() => {
      const ta = bodyRef.current;
      if (!ta) return;
      ta.focus();
      ta.setSelectionRange(caret, caret);
      selRef.current = { s: caret, e: caret };
    });
  }

  function jumpToHeading(h: Heading) {
    setState((prev) => ({ ...prev, body: prev.body }));
    requestAnimationFrame(() => {
      const ta = bodyRef.current;
      if (!ta) return;
      ta.focus();
      ta.setSelectionRange(h.offset, h.offset);
      selRef.current = { s: h.offset, e: h.offset };
      const top = ta.scrollTop + h.offset / ta.scrollHeight * ta.clientHeight - 80;
      ta.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    });
  }

  function handleExport() {
    const yaml = dump(fm, { flowLevel: -1 });
    const text = `---\n${yaml}---\n\n${state.body}`;
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${state.slug || "article"}.mdx`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    try {
      const parsed = matter(text);
      setState((s) => ({
        frontmatter: { ...s.frontmatter, ...parsed.data },
        body: parsed.content,
        slug: s.slug || f.name.replace(/\.mdx?$/, ""),
      }));
      setError(null);
    } catch {
      setError("Could not parse the .mdx file (frontmatter must be valid YAML between --- markers).");
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSave() {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await createOrUpdateArticle(
      kind,
      state.slug,
      { ...fm, readTime: computeReadTime(state.body) },
      state.body
    );
    setBusy(false);
    if (!res.ok) {
      setError(res.error ?? "Save failed");
      return;
    }
    const newSlug = res.data?.slug ?? state.slug;
    setSavedSlug(newSlug);
    if (newSlug !== state.slug) setState((s) => ({ ...s, slug: newSlug }));
    router.refresh();
  }

  const editorH = "h-[calc(100vh-220px)]";

  return (
    <div className="mx-auto max-w-7xl">
      {/* top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/admin/${kind}`}
          className="inline-flex items-center gap-1.5 font-mono text-sm text-dim transition-colors hover:text-cyan"
        >
          <ArrowLeft size={14} /> back to {kind}
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          {savedSlug && (
            <Link
              href={`/admin/${kind}/${savedSlug}`}
              className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald"
            >
              <CheckCircle2 size={13} /> saved
            </Link>
          )}
          {savedSlug && (
            <Link
              href={`/${kind === "posts" ? "blog" : kind}/${savedSlug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-cyan hover:underline"
            >
              <ExternalLink size={13} /> view
            </Link>
          )}
          {error && <span className="font-mono text-xs text-magenta">{error}</span>}
          <button onClick={handleExport} className="btn btn-ghost" title="Download this article as .mdx">
            <Download size={15} /> Export
          </button>
          <button onClick={() => fileRef.current?.click()} className="btn btn-ghost" title="Import an existing .mdx file">
            <Upload size={15} /> Import
          </button>
          <input ref={fileRef} type="file" accept=".mdx,.md" hidden onChange={handleImport} />
          <button onClick={handleSave} disabled={busy} className="btn btn-primary disabled:opacity-60">
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {/* editor grid */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {/* LEFT: form + source */}
        <div className={`flex flex-col gap-4 overflow-y-auto rounded-xl border border-line bg-void/40 p-5 ${editorH}`}>
          <div className="flex flex-wrap gap-4">
            <div className="min-w-48 flex-1">
              <Field label="Title">
                <TextInput value={title} onChange={(e) => set("title", e.target.value)} placeholder="A great title" />
              </Field>
            </div>
            <div className="w-44">
              <Field label="Date">
                <TextInput type="date" value={String(fm.date ?? "")} onChange={(e) => set("date", e.target.value)} />
              </Field>
            </div>
          </div>

          <div className="mt-1">
            <Field label="Description">
              <TextArea
                rows={2}
                value={String(fm.description ?? "")}
                onChange={(e) => set("description", e.target.value)}
                placeholder="One or two sentences for cards and SEO."
              />
            </Field>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="min-w-48 flex-1">
              <Field label="Slug (filename)">
                <TextInput
                  value={state.slug}
                  onChange={(e) => setState((s) => ({ ...s, slug: e.target.value }))}
                  placeholder="auto-from-title"
                />
              </Field>
            </div>
            <div className="min-w-48 flex-1">
              <Field label="Tags" hint="comma-separated">
                <TextInput value={tagsText} onChange={(e) => set("tags", textToTags(e.target.value))} />
              </Field>
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-5">
            <div className="min-w-48 flex-1">
              <Field label="Cover">
                <TextInput value={String(fm.cover ?? "")} onChange={(e) => set("cover", e.target.value)} placeholder="/covers/…" />
              </Field>
            </div>
            <div className="flex items-center gap-5 pb-1">
              {kind === "notes" && (
                <>
                  <Field label="Subject">
                    <TextInput value={String(fm.subject ?? "")} onChange={(e) => set("subject", e.target.value)} className="!w-40" />
                  </Field>
                  <Field label="Order">
                    <TextInput type="number" value={String(fm.order ?? "")} onChange={(e) => set("order", Number(e.target.value))} className="!w-24" />
                  </Field>
                  <Field label="PDF path">
                    <TextInput value={String(fm.pdf ?? "")} onChange={(e) => set("pdf", e.target.value)} className="!w-40" placeholder="/files/…" />
                  </Field>
                </>
              )}
              <Toggle checked={Boolean(fm.draft)} onChange={(v) => set("draft", v)} label="draft" />
            </div>
          </div>

          {/* toolbar + source */}
          <div className="mt-1 border-t border-line pt-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="font-mono text-[11px] uppercase tracking-wider text-dim">Markdown source</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2.5 font-mono text-[10px] text-faint">
                  <span>{stats.words} w</span>
                  <span>{stats.chars} ch</span>
                  <span>{stats.lines} ln</span>
                  <span>{stats.readTime} min</span>
                  <span>{stats.codeBlocks} blocks</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <ListTree size={12} className={showOutline ? "text-cyan" : "text-faint"} />
                  <button
                    onClick={() => setShowOutline((v) => !v)}
                    className="font-mono text-[10px] text-faint transition-colors hover:text-cyan"
                  >
                    outline ({outline.length})
                  </button>
                </span>
              </div>
            </div>

            {showOutline && (
              <div className="mb-3 rounded-lg border border-line bg-void/60 p-2.5">
                {outline.length === 0 && <p className="px-1 font-mono text-[11px] text-faint">No headings yet.</p>}
                {outline.map((h, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => jumpToHeading(h)}
                    className="block w-full truncate rounded px-2 py-1 text-left font-mono text-[11px] text-dim transition-colors hover:bg-panel hover:text-cyan"
                    style={{ paddingLeft: 8 + (h.level - 1) * 14 }}
                  >
                    {h.text}
                  </button>
                ))}
              </div>
            )}

            <EditorToolbar insert={insert} />

            <textarea
              ref={bodyRef}
              value={state.body}
              onChange={(e) => {
                setState((s) => ({ ...s, body: e.target.value }));
                syncSelection();
              }}
              onSelect={syncSelection}
              onClick={syncSelection}
              onKeyUp={syncSelection}
              spellCheck={false}
              className="mt-2 h-[29rem] w-full resize-none rounded-lg border border-line bg-void/60 p-3.5 font-mono text-[13px] leading-6 text-ink placeholder:text-faint focus:border-cyan/60 focus:outline-none focus:ring-1 focus:ring-cyan/40"
              placeholder={"# Write with Markdown\n\nSupports $\\LaTeX$, \\ce{chemistry}, GFM tables, callouts, ```mermaid diagrams, and ```python/```r/```cpp code blocks."}
            />
          </div>
        </div>

        {/* RIGHT: preview */}
        <div className={`overflow-y-auto rounded-xl border border-line bg-void/40 ${editorH}`}>
          <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-line bg-void/90 px-5 py-3 backdrop-blur">
            <Eye size={14} className="text-cyan" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-dim">Live preview · renders like production</span>
          </div>
          <MarkdownPreview body={state.body} />
        </div>
      </div>
    </div>
  );
}