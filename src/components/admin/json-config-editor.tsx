"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Rocket, Loader2, CheckCircle2 } from "lucide-react";
import { saveContentConfig, publish } from "@/app/admin/actions";

export function JsonConfigEditor({
  file,
  label,
  initial,
}: {
  file: string;
  label: string;
  initial: unknown;
}) {
  const router = useRouter();
  const [text, setText] = useState(() => JSON.stringify(initial, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  function validate(): unknown {
    try {
      return JSON.parse(text);
    } catch {
      setError("Invalid JSON — fix the syntax before saving.");
      return undefined;
    }
  }

  async function handleSave(regenerate: boolean) {
    const data = validate();
    if (data === undefined) return;
    setError(null);
    setSaving(regenerate ? false : true);
    setPublishing(regenerate);
    if (regenerate) {
      const saveRes = await saveContentConfig(data as Record<string, unknown>);
      if (!saveRes.ok) {
        setError(saveRes.error ?? "Save failed");
      } else {
        const pubRes = await publish();
        if (!pubRes.ok) setError(pubRes.error ?? "Regenerate failed");
        else setSaved(true);
      }
    } else {
      const res = await saveContentConfig(data as Record<string, unknown>);
      if (!res.ok) setError(res.error ?? "Save failed");
      else setSaved(true);
    }
    setSaving(false);
    setPublishing(false);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-wider text-faint">
          content/data/{file} — {label}
        </p>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald">
              <CheckCircle2 size={13} /> saved
            </span>
          )}
          {error && <span className="font-mono text-xs text-magenta">{error}</span>}
          <button onClick={() => handleSave(false)} disabled={saving || publishing} className="btn btn-primary disabled:opacity-60">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Save
          </button>
          <button onClick={() => handleSave(true)} disabled={saving || publishing} className="btn btn-ghost disabled:opacity-60">
            {publishing ? <Loader2 size={15} className="animate-spin" /> : <Rocket size={15} />}
            Save & regenerate
          </button>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setSaved(false);
          setError(null);
        }}
        spellCheck={false}
        className="mt-5 h-[calc(100vh-220px)] w-full resize-none rounded-xl border border-line bg-void/60 p-5 font-mono text-[13px] leading-6 text-ink placeholder:text-faint focus:border-cyan/60 focus:outline-none focus:ring-1 focus:ring-cyan/40"
      />
    </div>
  );
}