"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FileUp, Loader2, Trash2 } from "lucide-react";
import { uploadNotebook, removeNotebook } from "@/app/admin/actions";

export function NotebookManager({ sources }: { sources: Array<{ name: string; sizeKb: number }> }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const doUpload = async (file: File) => {
    if (!file.name.endsWith(".ipynb")) {
      setMsg({ ok: false, text: "Only .ipynb files are accepted" });
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const buf = new Uint8Array(await file.arrayBuffer());
      const res = await uploadNotebook(file.name, buf);
      if (!res.ok) throw new Error(res.error);
      setMsg({ ok: true, text: `Synced → /notebooks/${res.data?.slug}/` });
      router.refresh();
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Upload failed" });
    } finally {
      setBusy(false);
    }
  };

  const doDelete = async (name: string) => {
    setBusy(true);
    try {
      await removeNotebook(name);
      setMsg({ ok: true, text: `${name} removed` });
      router.refresh();
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Delete failed" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const f = e.dataTransfer.files?.[0];
          if (f) void doUpload(f);
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          drag ? "border-cyan bg-cyan/5" : "border-line hover:border-cyan/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".ipynb,application/json"
          hidden
          onChange={(e) => { const f = e.target.files?.[0]; if (f) void doUpload(f); e.target.value = ""; }}
        />
        {busy ? (
          <p className="flex items-center justify-center gap-2 font-mono text-sm text-dim">
            <Loader2 size={15} className="animate-spin" /> syncing notebook…
          </p>
        ) : (
          <>
            <FileUp size={22} className="mx-auto mb-2 text-faint" />
            <p className="text-sm text-dim">
              Drop a <b>.ipynb</b> here or click to browse — Python · C++ · R kernels all render.
            </p>
            <p className="mt-1 font-mono text-[11px] text-faint">
              stored in content/notebooks/ · synced to public + page registry on upload
            </p>
          </>
        )}
      </div>

      {sources.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-line">
          {sources.map((s, i) => (
            <div key={s.name} className={`flex items-center justify-between gap-3 px-4 py-3 ${i > 0 ? "border-t border-line" : ""}`}>
              <span className="truncate font-mono text-sm text-ink">{s.name}</span>
              <div className="flex shrink-0 items-center gap-3">
                <span className="font-mono text-xs text-faint">{s.sizeKb} KB</span>
                <button
                  onClick={() => void doDelete(s.name)}
                  disabled={busy}
                  className="rounded-lg border border-line p-1.5 text-faint transition-colors hover:border-magenta/60 hover:text-magenta"
                  aria-label={`Remove ${s.name}`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {msg && (
        <p className={`rounded-lg border px-3 py-2 font-mono text-xs ${
          msg.ok ? "border-emerald/40 bg-emerald/10 text-emerald"
                 : "border-magenta/40 bg-magenta/10 text-magenta"
        }`}>
          {msg.text}
        </p>
      )}
    </div>
  );
}
