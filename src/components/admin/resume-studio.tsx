"use client";

import { useCallback, useEffect, useState } from "react";
import { FileJson } from "lucide-react";
import { DataStudio } from "@/components/admin/data-studio-v2";
import { regeneratePdfs } from "@/app/admin/actions";
import { renderSectionPreview } from "@/app/admin/preview-action";
import { getSection } from "@/lib/admin/content-schema";

type Json = Record<string, unknown>;
type Files = { "content.json": Json; "site.json": Json };

/** Bullet-proof text coercion — never lets an object reach React children. */
function asText(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (typeof v === "object") {
    const o = v as Record<string, unknown>;
    if ("p" in o) return asText(o.p);
    const idx = Object.keys(o)
      .filter((k) => /^\d+$/.test(k))
      .sort((a, b) => Number(a) - Number(b));
    if (idx.length) return idx.map((k) => asText(o[k])).join("");
  }
  return "";
}

/* ------------------------------------------------------------------ */
/* Section-scoped preview renderers                                    */
/* ------------------------------------------------------------------ */

const arr = (c: Json, k: string) => (Array.isArray(c[k]) ? (c[k] as Json[]) : []);
const str = (v: unknown) => String(v ?? "");

function ProfilePrev({ c }: { c: Json }) {
  const p = (c.profile ?? {}) as Json;
  const bio = Array.isArray(p.bio) ? (p.bio as string[]) : [];
  return (
    <div className="space-y-3">
      <h2 className="font-serif text-2xl font-semibold">{str(p.name)}</h2>
      <p className="text-sm text-cyan">{str(p.role)}</p>
      <p className="font-mono text-[11px] text-faint">{str(p.degree)}</p>
      <p className="text-[13px] italic text-dim">{str(p.tagline)}</p>
      {bio.map((para, i) => (
        <p key={i} className="text-[13px] leading-6 text-dim">{asText(para)}</p>
      ))}
      {Boolean(p.focus) && (
        <p className="rounded-lg border border-cyan/25 bg-cyan/5 px-3 py-2 text-[12.5px] text-cyan">
          → {str(p.focus)}
        </p>
      )}
    </div>
  );
}

function PeriodEntry({ e }: { e: Json }) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <b className="text-[13.5px]">{str(e.title)}</b>
        <span className="font-mono text-[11px] text-faint">{str(e.period)}</span>
      </div>
      <p className="text-[12.5px] text-dim">{str(e.org)}</p>
      {Boolean(e.detail) && (
        <p className="mt-0.5 text-[12.5px] leading-5 opacity-80">{str(e.detail)}</p>
      )}
      {Array.isArray(e.tags) && (e.tags as string[]).length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1">
          {(e.tags as string[]).map((t) => (
            <span key={t} className="rounded-full border border-line px-1.5 py-0.5 font-mono text-[10px] text-faint">{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function ListSection({ title, items, render }: {
  title: string;
  items: Json[];
  render: (x: Json, i: number) => React.ReactNode;
}) {
  if (!items.length)
    return <p className="font-mono text-xs text-faint">No entries yet — use “Add entry”.</p>;
  return (
    <>
      <h3 className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-faint">{title}</h3>
      <div className="space-y-3">{items.map((x, i) => <div key={i}>{render(x, i)}</div>)}</div>
    </>
  );
}

function PublicationsPrev({ c }: { c: Json }) {
  return (
    <ListSection
      title="Publications"
      items={arr(c, "publications")}
      render={(p) => (
        <div className="text-[12.5px] leading-5">
          {str(p.authors)} ({str(p.year)}).{" "}
          <b className="text-ink">{str(p.title)}</b>.{" "}
          <i className="opacity-80">{str(p.venue)}</i>{" "}
          <span className="font-mono text-[10px] text-faint">[{str(p.status)}]</span>
          {Array.isArray(p.tags) && (p.tags as string[]).length > 0 && (
            <span className="block pt-0.5 text-[11px] text-faint">#{(p.tags as string[]).join(" · #")}</span>
          )}
        </div>
      )}
    />
  );
}

function SkillsPrev({ c }: { c: Json }) {
  return (
    <ListSection
      title="Skills"
      items={arr(c, "skills")}
      render={(g) => (
        <div>
          <p className="font-mono text-[11px] text-dim">{str(g.name)}</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {((g.skills as Json[]) ?? []).map((s, j) => (
              <span key={j} className="rounded-full border border-line px-2 py-0.5 text-[11px]">
                {str(s.name)} <span className="text-faint">{Number(s.level ?? 0)}%</span>
              </span>
            ))}
          </div>
        </div>
      )}
    />
  );
}

function SimpleTriplesPrev({ title, c, key_ }: { title: string; c: Json; key_: string }) {
  return (
    <ListSection
      title={title}
      items={arr(c, key_)}
      render={(x) => (
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-[12.5px]">
          <b>{str(x.title)}</b>
          <span className="font-mono text-[11px] text-faint">{str(x.year)}</span>
          <p className="w-full text-dim">{str(x.org)}</p>
        </div>
      )}
    />
  );
}

function LanguagesPrev({ c }: { c: Json }) {
  return (
    <ListSection
      title="Languages"
      items={arr(c, "languages")}
      render={(l) => (
        <div className="text-[12.5px]">
          <b>{str(l.name)}</b>{" "}
          <span className="text-faint">{Number(l.percentage ?? 0)}%</span>
          <p className="text-dim">{str(l.level)}</p>
        </div>
      )}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Studio                                                              */
/* ------------------------------------------------------------------ */

export function ResumeStudio({ initial }: { initial: Files }) {
  const [snapshot, setSnapshot] = useState<Files>(initial);
  const [activeKey, setActiveKey] = useState("profile");
  const [wholeCv, setWholeCv] = useState(false);
  const [pdfMsg, setPdfMsg] = useState<string | null>(null);
  const [sectionHtml, setSectionHtml] = useState<string | null>(null);
  const [sectionErr, setSectionErr] = useState<string | null>(null);

  const onChange = useCallback((f: Files) => setSnapshot(f), []);
  const onSection = useCallback((k: string) => { setActiveKey(k); }, []);

  const regenPdf = async () => {
    const res = await regeneratePdfs();
    setPdfMsg(res.ok ? "cv.pdf regenerated ✓" : res.error ?? "failed");
    setTimeout(() => setPdfMsg(null), 4000);
  };

  const c = snapshot["content.json"];
  const sectionLabel = getSection(activeKey)?.label ?? activeKey;

  /* Live HTML comes from the production MDX pipeline via
     renderSectionPreview() — full KaTeX / mhchem / GFM parity. */
  const [pendingPreview, setPendingPreview] = useState(false);

  useEffect(() => {
    if (wholeCv) return;
    let active = true;
    const t = setTimeout(async () => {
      setPendingPreview(true);
      try {
        const res = await renderSectionPreview(activeKey, snapshot);
        if (!active) return;
        setPendingPreview(false);
        if (res.ok) {
          setSectionHtml(res.html ?? "");
          setSectionErr(null);
        } else {
          setSectionErr(res.error ?? "render failed");
        }
      } catch {
        if (!active) return;
        setPendingPreview(false);
        setSectionErr("Session expired — reload and sign in again.");
      }
    }, 300);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [activeKey, snapshot, wholeCv]);

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_520px]">
      <div className="min-w-0">
        <DataStudio
          initial={initial}
          group="resume"
          showPdfButton
          onChangeData={onChange}
          onChangeSection={onSection}
        />
      </div>

      <aside className="xl:sticky xl:top-24 xl:max-h-[calc(100vh-7rem)] xl:self-start xl:overflow-y-auto">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() => setWholeCv(false)}
            className={`font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${
              wholeCv ? "text-faint hover:text-cyan" : "text-cyan"
            }`}
          >
            ● {sectionLabel}
          </button>
          <button
            onClick={() => setWholeCv(true)}
            className={`chip !py-1 !text-[10px] ${wholeCv ? "!border-cyan !text-cyan" : ""}`}
          >
            whole CV
          </button>
          <button onClick={regenPdf} className="chip !py-1 !text-[10px]">
            <FileJson size={11} className="mr-1 inline" /> cv.pdf
          </button>
        </div>
        {pdfMsg && (
          <p className="mb-2 rounded-lg border border-emerald/40 bg-emerald/10 px-3 py-1.5 font-mono text-[11px] text-emerald">
            {pdfMsg}
          </p>
        )}

        {wholeCv ? (
          <WholeCv data={snapshot} />
        ) : (
          <div
            className="rich space-y-6 rounded-2xl border border-line bg-panel p-8 shadow-sm"
          >
            {sectionErr && (
              <p className="rounded-lg border border-magenta/40 bg-magenta/10 px-3 py-2 font-mono text-[11px] text-magenta">
                {sectionErr}
              </p>
            )}
            <div dangerouslySetInnerHTML={{ __html: sectionHtml ?? "" }} />
            {pendingPreview && (
              <p className="font-mono text-[10px] text-faint">updating…</p>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}

/* ------------------------- full CV (toggle) ------------------------- */

function WholeCv({ data }: { data: Files }) {
  const c = data["content.json"];
  return (
    <div className="space-y-6 rounded-2xl border border-line bg-panel p-8 shadow-sm">
      <ProfilePrev c={c} />
      <ListSection title="Education" items={arr(c, "education")} render={(e) => <PeriodEntry e={e} />} />
      <ListSection title="Experience" items={arr(c, "experience")} render={(e) => <PeriodEntry e={e} />} />
      <PublicationsPrev c={c} />
      <SkillsPrev c={c} />
      <SimpleTriplesPrev title="Awards" c={c} key_="awards" />
      <SimpleTriplesPrev title="Certifications" c={c} key_="certifications" />
      <LanguagesPrev c={c} />
    </div>
  );
}
