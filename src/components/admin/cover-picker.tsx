"use client";

import { useEffect, useRef, useState } from "react";
import { Wand2, Loader2, Upload, RefreshCw, Trash2, X } from "lucide-react";
import {
  listCoversAction as listCovers,
  ensureCoverAction as ensureCover,
  uploadCoverFile,
  removeCoverAction,
} from "@/app/admin/actions";

const STYLE_OPTIONS = [
  { id: "", label: "Auto (match topic)" },
  { id: "dna", label: "DNA helix" },
  { id: "molecule", label: "Molecule" },
  { id: "flask", label: "Chemistry flask" },
  { id: "capsule", label: "Drug capsule" },
  { id: "neural", label: "Neural net (ML)" },
  { id: "deep", label: "Deep network" },
  { id: "agent", label: "Agentic AI" },
  { id: "stats", label: "Statistics" },
  { id: "descent", label: "Optimization" },
  { id: "patterns", label: "Pattern recognition" },
  { id: "chart", label: "Analytics chart" },
  { id: "graduation", label: "Education" },
  { id: "lattice3d", label: "Crystal lattice" },
  { id: "hexgrid", label: "Hex grid" },
  { id: "circuit", label: "Circuit traces" },
  { id: "waves", label: "Waves" },
  { id: "topo", label: "Topo contours" },
  { id: "blobs", label: "Soft blobs" },
  { id: "rings", label: "Orbit rings" },
  { id: "starfield", label: "Starfield" },
];

export function CoverPicker({
  value,
  onChange,
  slug,
  title,
}: {
  value: string;
  onChange: (v: string) => void;
  slug?: string;
  title?: string;
}) {
  const [covers, setCovers] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [style, setStyle] = useState("");
  const [variant, setVariant] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = async () => {
    const r = await listCovers();
    if (r.ok && r.data) setCovers(r.data.map((c) => c.href));
  };

  useEffect(() => {
    // initial fetch of external cover list; setState happens in the async
    // callback after the network resolves, not synchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, []);

  const baseSlug =
    slug?.trim() ||
    (title ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") ||
    "cover";

  const generate = async () => {
    setBusy(true);
    try {
      const res = await ensureCover(baseSlug, title?.trim() || baseSlug);
      if (!res.ok) throw new Error(res.error);
      onChange(`/covers/${baseSlug}.svg`);
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const onUpload = async (file: File) => {
    setBusy(true);
    try {
      const buf = await file.arrayBuffer();
      const res = await uploadCoverFile(baseSlug, file.name, buf);
      if (!res.ok) throw new Error(res.error);
      onChange(res.data!.path);
      await refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const deleteCover = async (href: string) => {
    if (!confirm(`Delete this cover?\n${href}`)) return;
    setBusy(true);
    try {
      const res = await removeCoverAction(href);
      if (!res.ok) throw new Error(res.error);
      if (value === href) onChange(""); // selection removed → no cover
      await refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* preview + selected-cover actions */}
      <div className="flex items-center gap-3">
        <div className="h-16 w-28 shrink-0 overflow-hidden rounded-lg border border-line bg-panel">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Cover preview" className="h-full w-full object-cover" />
          ) : (
            <span className="grid h-full place-items-center font-mono text-[10px] text-faint">
              no cover
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={generate}
            disabled={busy}
            className="chip !py-1.5 !text-[11px]"
          >
            {busy ? (
              <Loader2 size={12} className="mr-1 inline animate-spin" />
            ) : (
              <Wand2 size={12} className="mr-1 inline" />
            )}
            Generate
          </button>
          {value && (
            <button
              type="button"
              onClick={() => void deleteCover(value)}
              disabled={busy}
              className="chip !py-1.5 !text-[11px] !border-magenta/40 hover:!border-magenta hover:!text-magenta"
            >
              <Trash2 size={12} className="mr-1 inline" /> Delete selected
            </button>
          )}
        </div>
      </div>

      {/* style / variant / upload row */}
      <div className="flex flex-wrap items-end gap-2">
        <label className="block">
          <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-faint">Style</span>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="rounded-lg border border-line bg-panel px-2 py-1.5 font-mono text-[11px] text-ink"
          >
            {STYLE_OPTIONS.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={() => setVariant((v) => v + 1)}
          className="chip !py-1.5 !text-[11px]"
          title="Next layout variation"
        >
          <RefreshCw size={12} className="mr-1 inline" /> variant {variant}
        </button>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="chip !py-1.5 !text-[11px]"
        >
          <Upload size={12} className="mr-1 inline" /> Upload
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".webp,.avif,.jpg,.jpeg,.png,.gif,.svg,.mp4,.webm,.m4v"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onUpload(f);
            e.target.value = "";
          }}
        />
      </div>

      {/* thumbnails */}
      {covers.length > 0 && (
        <div className="grid max-h-44 grid-cols-4 gap-2 overflow-y-auto rounded-lg border border-line bg-panel/40 p-2 sm:grid-cols-6">
          {covers.map((href) => (
            <div key={href} className="group relative">
              <button
                type="button"
                onClick={() => onChange(href)}
                title={href}
                className={`block w-full overflow-hidden rounded-md border-2 transition-transform hover:scale-[1.03] ${
                  value === href ? "border-cyan" : "border-transparent"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={href} alt="" className="h-10 w-full object-cover" />
              </button>
              <button
                type="button"
                aria-label={`Delete ${href}`}
                title="Delete cover"
                onClick={(e) => {
                  e.stopPropagation();
                  void deleteCover(href);
                }}
                disabled={busy}
                className="absolute -right-1 -top-1 grid h-4.5 w-4.5 place-items-center rounded-full border border-line bg-void text-faint opacity-0 transition-opacity hover:border-magenta hover:text-magenta group-hover:opacity-100 disabled:opacity-30"
                style={{ width: 18, height: 18 }}
              >
                <X size={10} />
              </button>
              {value === href && (
                <span className="absolute bottom-0.5 left-0.5 rounded bg-cyan/80 px-1 font-mono text-[8px] leading-tight text-void">
                  SEL
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="font-mono text-[10.5px] text-faint">{value || "no cover selected"}</p>
    </div>
  );
}
