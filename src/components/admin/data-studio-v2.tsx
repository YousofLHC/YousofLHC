"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Download, RotateCcw, Save, Upload, FileJson, Zap } from "lucide-react";
import { SectionEditor } from "@/components/admin/schema-form";
import { SECTIONS, SECTION_META, type SectionDef } from "@/lib/admin/content-schema";
import {
  saveDataFile, regeneratePdfs,
  type ActionResult,
} from "@/app/admin/actions";

type Json = Record<string, unknown>;
type Files = { "content.json": Json; "site.json": Json };

function fileOf(s: SectionDef) { return s.file; }

export function DataStudio({
  initial,
  group = "all",
  showPdfButton = false,
  onChangeData,
  onChangeSection,
}: {
  initial: Files;
  group?: "all" | "resume" | "site";
  showPdfButton?: boolean;
  /** fires on every local mutation (edit / undo / import) */
  onChangeData?: (files: Files) => void;
  /** fires when the user switches the active section */
  onChangeSection?: (key: string) => void;
}) {
  const [data, setData] = useState<Files>(initial);
  const [activeKey, setActiveKey] = useState<string>(
    (SECTIONS.find(s => group === "resume" ? s.group === "resume" : true))?.key ?? SECTIONS[0].key
  );
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const historyRef = useRef<Files[]>([]);

  const sections = useMemo(
    () =>
      SECTIONS.filter((s) =>
        group === "resume"
          ? s.group === "resume"
          : group === "site"
            ? s.file === "site.json"
            : true
      ),
    [group]
  );
  const active = sections.find(s => s.key === activeKey) ?? sections[0];
  const meta = SECTION_META[active.key];

  const pushHistory = useCallback(() => {
    historyRef.current.push(structuredClone(data));
    if (historyRef.current.length > 40) historyRef.current.shift();
  }, [data]);

  const setValue = (section: SectionDef, v: unknown) => {
    pushHistory();
    const file = fileOf(section);
    const next: Files = { ...data, [file]: { ...data[file], [section.key]: v } };
    setData(next);
    onChangeData?.(next);
    setDirty(prev => new Set(prev).add(file));
  };

  const undo = () => {
    const prev = historyRef.current.pop();
    if (!prev) return;
    setData(prev);
    onChangeData?.(prev);
    setDirty(new Set(["content.json", "site.json"]));
  };

  const saveFile = async (file: keyof Files) => {
    setBusy(true);
    setToast(null);
    try {
      const res: ActionResult<{ regenerated: boolean; generateError?: string }> =
        await saveDataFile(file, data[file]);
      if (!res.ok) throw new Error(res.error);
      setDirty(prev => { const n = new Set(prev); n.delete(file); return n; });
      setToast({
        ok: true,
        msg: res.data?.regenerated
          ? `${file} saved & content regenerated`
          : `${file} saved — generation warning: ${res.data?.generateError ?? "?"}`,
      });
    } catch (e) {
      setToast({ ok: false, msg: e instanceof Error ? e.message : "Save failed" });
    } finally {
      setBusy(false);
    }
  };

  const exportFile = (file: keyof Files) => {
    const blob = new Blob([JSON.stringify(data[file], null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = file;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const importTargetRef = useRef<keyof Files>("content.json");

  const openImport = (file: keyof Files) => {
    importTargetRef.current = file;
    fileInputRef.current?.click();
  };

  const handleImportFile = (input: HTMLInputElement) => {
    const f = input.files?.[0];
    if (!f) return;
    const file = importTargetRef.current;
    void f.text().then(txt => {
      try {
        const parsed = JSON.parse(txt) as Json;
        pushHistory();
        const next: Files = { ...data, [file]: parsed };
        setData(next);
        onChangeData?.(next);
        setDirty(prev => new Set(prev).add(file));
        setToast({ ok: true, msg: `${file} imported — review then Save` });
      } catch {
        setToast({ ok: false, msg: "Invalid JSON" });
      }
      input.value = "";
    });
  };

  const pdfBtn = async () => {
    setBusy(true);
    try {
      const res = await regeneratePdfs();
      setToast(res.ok ? { ok: true, msg: "PDFs regenerated (public/files)" }
                      : { ok: false, msg: res.error ?? "PDF failed" });
    } finally { setBusy(false); }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      {/* nav */}
      <aside className="space-y-1 lg:sticky lg:top-24 lg:self-start">
        {sections.map(s => (
          <button
            key={s.key}
            onClick={() => { setActiveKey(s.key); onChangeSection?.(s.key); }}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              s.key === activeKey
                ? "bg-cyan/10 text-cyan"
                : "text-dim hover:bg-panel-2 hover:text-ink"
            }`}
          >
            <span>{s.label}</span>
            {dirty.has(s.file) && <span className="h-1.5 w-1.5 rounded-full bg-accent" title="unsaved changes in file" />}
          </button>
        ))}

        <div className="!mt-6 space-y-2 border-t border-line pt-4">
          <button onClick={undo} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-dim hover:bg-panel-2 hover:text-ink">
            <RotateCcw size={13} /> Undo
          </button>
          {showPdfButton && (
            <button onClick={pdfBtn} disabled={busy} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-dim hover:bg-panel-2 hover:text-ink disabled:opacity-40">
              <FileJson size={13} /> Regenerate cv.pdf
            </button>
          )}
        </div>
      </aside>

      {/* editor */}
      <div className="min-w-0">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <h2 className="mr-auto font-display text-xl font-semibold text-ink">{active.label}</h2>
          <button onClick={() => openImport(active.file)} className="chip !py-1.5 !text-[11px]">
            <Upload size={12} className="mr-1 inline" /> Import
          </button>
          <input type="file" accept=".json" hidden ref={fileInputRef} onChange={(e) => handleImportFile(e.target)} />
          <button onClick={() => exportFile(active.file)} className="chip !py-1.5 !text-[11px]">
            <Download size={12} className="mr-1 inline" /> Export
          </button>
          <button
            onClick={() => saveFile(active.file)}
            disabled={busy}
            className={`btn btn-primary !px-4 !py-2 !text-[13px] ${dirty.has(active.file) ? "" : "opacity-60"}`}
          >
            <Save size={14} /> Save {active.file.replace(".json", "")}
          </button>
        </div>

        {active.description && (
          <p className="mb-4 text-sm text-dim">{active.description}</p>
        )}

        {meta && (
          <div className="mb-5 space-y-2">
            <p className="flex items-start gap-1.5 text-[12.5px] italic leading-5 text-accent/90">
              <Zap size={12} className="mt-0.5 shrink-0" /> {meta.liveImpact}
            </p>
            <details className="rounded-lg border border-line bg-panel/40 px-3 py-2">
              <summary className="cursor-pointer font-mono text-[10.5px] uppercase tracking-wider text-faint hover:text-cyan">
                how to edit this section
              </summary>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-[12px] leading-5 text-dim">
                {meta.guide.map((g, i) => <li key={i}>{g}</li>)}
              </ul>
            </details>
          </div>
        )}

        <SectionEditor
          key={active.key}
          def={active}
          value={data[active.file][active.key]}
          onChange={(v) => setValue(active, v)}
        />

        {toast && (
          <div
            className={`fixed bottom-6 right-6 z-50 rounded-xl border px-4 py-3 text-sm shadow-xl ${
              toast.ok
                ? "border-emerald/50 bg-emerald/10 text-emerald"
                : "border-magenta/50 bg-magenta/10 text-magenta"
            }`}
          >
            {toast.msg}
          </div>
        )}
      </div>
    </div>
  );
}
