"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, CheckCircle2, Plus, Trash2, Rocket } from "lucide-react";
import { Field, TextInput, TextArea } from "@/components/admin/field";
import { saveSiteConfig, publish } from "@/app/admin/actions";

const SOCIALS = ["github", "linkedin", "scholar", "orcid", "x"] as const;

export function SiteSettingsForm({
  config,
}: {
  config: Record<string, unknown>;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState(() => ({ ...config }));
  const [navLinks, setNavLinks] = useState<{ href: string; label: string }[]>(
    Array.isArray(config.navLinks) ? (config.navLinks as { href: string; label: string }[]) : []
  );
  const [socials, setSocials] = useState<Record<string, string>>(() => ({
    github: "",
    linkedin: "",
    scholar: "",
    orcid: "",
    x: "",
    ...(typeof config.socials === "object" && config.socials ? (config.socials as Record<string, string>) : {}),
  }));
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: string, value: unknown) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setSaved(false);
  };

  async function handleSave() {
    setSaving(true);
    setError(null);
    const res = await saveSiteConfig({ ...draft, socials, navLinks });
    setSaving(false);
    if (!res.ok) {
      setError(res.error ?? "Save failed");
      return;
    }
    setSaved(true);
    router.refresh();
  }

  async function handlePublish() {
    setPublishing(true);
    setError(null);
    await handleSave();
    const res = await publish();
    setPublishing(false);
    if (!res.ok) setError(res.error ?? "Publish failed");
    else setSaved(true);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-wider text-faint">
          content/data/site.json
        </p>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald">
              <CheckCircle2 size={13} /> saved
            </span>
          )}
          {error && <span className="font-mono text-xs text-magenta">{error}</span>}
          <button onClick={handleSave} disabled={saving} className="btn btn-primary disabled:opacity-60">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Save
          </button>
          <button onClick={handlePublish} disabled={publishing} className="btn btn-ghost disabled:opacity-60">
            {publishing ? <Loader2 size={15} className="animate-spin" /> : <Rocket size={15} />}
            Save & regenerate
          </button>
        </div>
      </div>

      <section className="rounded-xl border border-line bg-void/40 p-6">
        <h2 className="heading text-xl">Identity</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <TextInput value={String(draft.name ?? "")} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <Field label="Short name">
            <TextInput value={String(draft.shortName ?? "")} onChange={(e) => set("shortName", e.target.value)} />
          </Field>
          <Field label="Tagline">
            <TextInput value={String(draft.tagline ?? "")} onChange={(e) => set("tagline", e.target.value)} />
          </Field>
          <Field label="Browser title">
            <TextInput value={String(draft.title ?? "")} onChange={(e) => set("title", e.target.value)} />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="SEO description">
            <TextArea rows={3} value={String(draft.description ?? "")} onChange={(e) => set("description", e.target.value)} />
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-line bg-void/40 p-6">
        <h2 className="heading text-xl">Contact & availability</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Website URL">
            <TextInput value={String(draft.url ?? "")} onChange={(e) => set("url", e.target.value)} />
          </Field>
          <Field label="Location">
            <TextInput value={String(draft.location ?? "")} onChange={(e) => set("location", e.target.value)} />
          </Field>
          <Field label="Email">
            <TextInput value={String(draft.email ?? "")} onChange={(e) => set("email", e.target.value)} />
          </Field>
          <Field label="Availability">
            <TextInput value={String(draft.availability ?? "")} onChange={(e) => set("availability", e.target.value)} />
          </Field>
          <Field label="Calendly URL">
            <TextInput value={String(draft.calendly ?? "")} onChange={(e) => set("calendly", e.target.value)} />
          </Field>
          <Field label="Formspree endpoint" hint="leave empty to use mailto">
            <TextInput value={String(draft.formspree ?? "")} onChange={(e) => set("formspree", e.target.value)} />
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-line bg-void/40 p-6">
        <h2 className="heading text-xl">Socials</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {SOCIALS.map((s) => (
            <Field key={s} label={s}>
              <TextInput value={socials[s] ?? ""} onChange={(e) => setSocials((x) => ({ ...x, [s]: e.target.value }))} placeholder={`https://…/${s}`} />
            </Field>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-line bg-void/40 p-6">
        <h2 className="heading text-xl">Navigation</h2>
        <div className="mt-5 space-y-2.5">
          {navLinks.map((l, i) => (
            <div key={i} className="flex gap-2.5">
              <input
                value={l.label}
                onChange={(e) =>
                  setNavLinks((links) => links.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))
                }
                className="w-56 rounded-lg border border-line bg-void/60 px-3 py-2 text-sm text-ink focus:border-cyan/60 focus:outline-none"
                placeholder="Label"
              />
              <input
                value={l.href}
                onChange={(e) =>
                  setNavLinks((links) => links.map((x, j) => (j === i ? { ...x, href: e.target.value } : x)))
                }
                className="flex-1 rounded-lg border border-line bg-void/60 px-3 py-2 font-mono text-sm text-ink focus:border-cyan/60 focus:outline-none"
                placeholder="/path"
              />
              <button
                onClick={() => setNavLinks((links) => links.filter((_, j) => j !== i))}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line text-dim transition-colors hover:border-magenta/50 hover:text-magenta"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={() => setNavLinks((links) => [...links, { href: "/", label: "New link" }])}
            className="btn btn-ghost mt-2"
          >
            <Plus size={14} /> Add link
          </button>
        </div>
      </section>
    </div>
  );
}