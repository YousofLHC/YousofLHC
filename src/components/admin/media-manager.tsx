"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Trash2, FileImage, Loader2, Copy, Check } from "lucide-react";
import { uploadMediaFile, removeMediaFile } from "@/app/admin/actions";

export function MediaManager({ initial }: { initial: { name: string; size: number; href: string }[] }) {
  const router = useRouter();
  const [files, setFiles] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    if (!selected.length) return;
    setBusy(true);
    setError(null);
    for (const f of selected) {
      const res = await uploadMediaFile(f.name, await f.arrayBuffer());
      if (!res.ok) {
        setError(`${f.name}: ${res.error ?? "upload failed"}`);
        continue;
      }
      if (res.data) setFiles((prev) => [...prev.filter((x) => x.name !== res.data!.name), res.data!]);
    }
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }

  async function handleDelete(name: string) {
    setBusy(true);
    const res = await removeMediaFile(name);
    setBusy(false);
    if (res.ok) setFiles((prev) => prev.filter((f) => f.name !== name));
    else setError(res.error ?? "Delete failed");
    router.refresh();
  }

  async function copyPath(href: string) {
    try {
      await navigator.clipboard.writeText(href);
      setCopied(href);
      setTimeout(() => setCopied(null), 1200);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-wider text-faint">
          public/media/ — {files.length} files
        </p>
        {error && <span className="font-mono text-xs text-magenta">{error}</span>}
        <button onClick={() => inputRef.current?.click()} disabled={busy} className="btn btn-primary disabled:opacity-60">
          {busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
          Upload files
        </button>
        <input ref={inputRef} type="file" multiple hidden onChange={handleUpload} />
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-void/40">
        {files.length === 0 && <p className="p-6 font-mono text-sm text-faint">No files yet. Upload covers, PDFs, images…</p>}
        {files.map((f, i) => (
          <div
            key={f.name}
            className={`flex items-center justify-between gap-4 px-5 py-3 ${i > 0 ? "border-t border-line" : ""}`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <FileImage size={16} className="shrink-0 text-cyan" />
              <span className="truncate font-mono text-sm text-ink">{f.name}</span>
              <span className="shrink-0 font-mono text-[11px] text-faint">{(f.size / 1024).toFixed(1)} KB</span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => copyPath(f.href)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 font-mono text-[11px] text-dim transition-colors hover:border-cyan/50 hover:text-cyan"
              >
                {copied === f.href ? <Check size={12} /> : <Copy size={12} />}
                {copied === f.href ? "copied" : "copy path"}
              </button>
              <button
                onClick={() => handleDelete(f.name)}
                disabled={busy}
                className="grid h-8 w-8 place-items-center rounded-lg border border-line text-dim transition-colors hover:border-magenta/50 hover:text-magenta"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="font-mono text-xs text-faint">
        Copied paths reference <span className="text-dim">public/media/</span> directly, e.g. <span className="text-dim">/media/diagram.png</span>. Use them in cover / pdf fields or Markdown images.
      </p>
    </div>
  );
}