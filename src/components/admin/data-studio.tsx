"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Rocket,
  Loader2,
  CheckCircle2,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
  FileJson,
  UserRound,
  History,
  ScrollText,
  Wrench,
  FolderKanban,
  Layers,
  Sparkles,
  X,
} from "lucide-react";
import { saveContentConfig, publish } from "@/app/admin/actions";

interface ProfileShape {
  name: string;
  firstName: string;
  role: string;
  degree: string;
  tagline: string;
  bio: string[];
  focus: string;
}
interface TimelineItem {
  period: string;
  title: string;
  org: string;
  detail: string;
  tags: string[];
  highlight?: boolean;
}
interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: string;
  status: string;
  tags: string[];
}
interface Award {
  year: string;
  title: string;
  org: string;
}
interface SkillGroup {
  name: string;
  skills: { name: string; level: number }[];
}
interface Language {
  name: string;
  level: string;
  percentage: number;
}
interface Project {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  year: string;
  status: string;
  domain: string;
  domainColor: string;
  tags: string[];
  tech: string[];
  cover: string;
  github?: string;
  demo?: string;
  featured?: boolean;
}
interface Service {
  icon: string;
  title: string;
  blurb: string;
}
interface Domain {
  id: string;
  label: string;
  short: string;
  blurb: string;
  level: number;
  heat: number;
  color: string;
  icon: string;
  keywords: string[];
}

interface ContentConfig {
  profile: ProfileShape;
  stats: { value: string; label: string }[];
  education: TimelineItem[];
  experience: TimelineItem[];
  publications: Publication[];
  awards: Award[];
  certifications: Award[];
  skills: SkillGroup[];
  languages: Language[];
  projects: Project[];
  services: Service[];
  domains: Domain[];
}

type TabId =
  | "profile"
  | "timeline"
  | "publications"
  | "skills"
  | "projects"
  | "services"
  | "domains"
  | "json";

const DOMAIN_COLORS = ["cyan", "violet", "magenta", "emerald", "amber"];
const PUB_STATUS = ["published", "in-press", "under-review", "preprint"];
const PROJECT_STATUS = ["active", "complete", "draft"];

const TABS: { id: TabId; label: string; icon: typeof UserRound }[] = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "timeline", label: "Timeline", icon: History },
  { id: "publications", label: "Publications", icon: ScrollText },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "services", label: "Services", icon: Sparkles },
  { id: "domains", label: "Domains", icon: Layers },
  { id: "json", label: "Raw JSON", icon: FileJson },
];

/* ---------- primitives ---------- */

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-faint">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className="w-full rounded-lg border border-line bg-void/40 px-3 py-2 text-sm text-ink placeholder:text-faint focus:border-cyan/60 focus:outline-none focus:ring-1 focus:ring-cyan/40"
      />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-faint">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        spellCheck={false}
        className="w-full resize-y rounded-lg border border-line bg-void/40 px-3 py-2 text-sm leading-6 text-ink placeholder:text-faint focus:border-cyan/60 focus:outline-none focus:ring-1 focus:ring-cyan/40"
      />
    </label>
  );
}

function TagsList({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const t = draft.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setDraft("");
  };
  return (
    <div className="flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-lg border border-line bg-void/40 px-3 py-2 focus-within:border-cyan/60">
      {value.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-1 rounded-full border border-cyan/40 bg-cyan/10 px-2.5 py-0.5 font-mono text-[11px] text-cyan"
        >
          {t}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onChange(value.filter((x) => x !== t));
            }}
            className="text-cyan/60 hover:text-cyan"
          >
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
          } else if (e.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={add}
        placeholder="add tag…"
        spellCheck={false}
        className="min-w-24 flex-1 bg-transparent font-mono text-[11px] text-ink placeholder:text-faint focus:outline-none"
      />
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        value ? "bg-cyan/80" : "bg-panel-2 border border-line"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
          value ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-faint">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-line bg-void/40 px-3 py-2 text-sm text-ink focus:border-cyan/60 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function RangeField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex justify-between font-mono text-[10px] uppercase tracking-wider text-faint">
        {label} <span className="text-cyan">{value}</span>
      </span>
      <input
        type="range"
        min={0}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-cyan"
      />
    </label>
  );
}

function updateAt<T>(list: T[], i: number, patch: Partial<T>): T[] {
  return list.map((item, idx) => (idx === i ? { ...item, ...patch } : item));
}
function removeAt<T>(list: T[], i: number): T[] {
  return list.filter((_, idx) => idx !== i);
}
function swapAt<T>(list: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir;
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

function CardShell({
  title,
  subtitle,
  onRemove,
  onMove,
  children,
  first,
  last,
}: {
  title: string;
  subtitle?: string;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
  first: boolean;
  last: boolean;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-line bg-panel/50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{title}</p>
          {subtitle && <p className="truncate font-mono text-[11px] text-faint">{subtitle}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={first}
            className="rounded-md p-1.5 text-faint transition-colors enabled:hover:bg-panel-2 enabled:hover:text-cyan disabled:opacity-30"
          >
            <ChevronUp size={14} />
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={last}
            className="rounded-md p-1.5 text-faint transition-colors enabled:hover:bg-panel-2 enabled:hover:text-cyan disabled:opacity-30"
          >
            <ChevronDown size={14} />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded-md p-1.5 text-faint transition-colors hover:bg-magenta/10 hover:text-magenta"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="heading mt-8 flex items-center gap-2 text-sm first:mt-0">
      <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
      {children}
    </h2>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn btn-ghost mt-3 w-full border-dashed py-2 text-xs"
    >
      <Plus size={13} className="text-cyan" /> {label}
    </button>
  );
}

/* ---------- section editors ---------- */

function ProfileEditor({
  profile,
  onChange,
}: {
  profile: ProfileShape;
  onChange: (p: ProfileShape) => void;
}) {
  const set = (patch: Partial<ProfileShape>) => onChange({ ...profile, ...patch });
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" value={profile.name} onChange={(v) => set({ name: v })} />
        <Field label="First name" value={profile.firstName} onChange={(v) => set({ firstName: v })} />
        <Field label="Role" value={profile.role} onChange={(v) => set({ role: v })} />
        <Field label="Degree" value={profile.degree} onChange={(v) => set({ degree: v })} />
      </div>
      <div className="mt-4">
        <Field label="Tagline" value={profile.tagline} onChange={(v) => set({ tagline: v })} />
      </div>
      <div className="mt-4">
        <Area label="Focus (one-liner)" value={profile.focus} onChange={(v) => set({ focus: v })} rows={2} />
      </div>
      <SectionHeading>Bio paragraphs</SectionHeading>
      {profile.bio.map((p, i) => (
        <div key={i} className="mt-3 flex gap-2">
          <div className="flex-1">
            <Area
              label={`Paragraph ${i + 1}`}
              value={p}
              rows={3}
              onChange={(v) =>
                onChange({ ...profile, bio: profile.bio.map((p, idx) => (idx === i ? v : p)) })
              }
            />
          </div>
          <button
            type="button"
            onClick={() => onChange({ ...profile, bio: removeAt(profile.bio, i) })}
            className="mt-5 self-start rounded-md p-2 text-faint transition-colors hover:bg-magenta/10 hover:text-magenta"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => onChange({ ...profile, bio: [...profile.bio, ""] })}
          className="btn btn-ghost border-dashed text-xs"
        >
          <Plus size={13} className="text-cyan" /> Add paragraph
        </button>
      </div>
    </>
  );
}

function StatsEditor({
  stats,
  onChange,
}: {
  stats: { value: string; label: string }[];
  onChange: (s: { value: string; label: string }[]) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {stats.map((s, i) => (
        <div key={i} className="flex items-end gap-2 rounded-xl border border-line bg-panel/50 p-3">
          <Field label="Value" value={s.value} onChange={(v) => onChange(updateAt(stats, i, { value: v }))} />
          <div className="w-40">
            <Field label="Label" value={s.label} onChange={(v) => onChange(updateAt(stats, i, { label: v }))} />
          </div>
          <button
            type="button"
            onClick={() => onChange(removeAt(stats, i))}
            className="mb-1 rounded-md p-1.5 text-faint transition-colors hover:text-magenta"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <AddButton
        label="Add stat"
        onClick={() => onChange([...stats, { value: "", label: "" }])}
      />
    </div>
  );
}

function TimelineEditor({
  items,
  onChange,
}: {
  items: TimelineItem[];
  onChange: (i: TimelineItem[]) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <CardShell
          key={i}
          title={item.title || "Untitled entry"}
          subtitle={item.period}
          first={i === 0}
          last={i === items.length - 1}
          onRemove={() => onChange(removeAt(items, i))}
          onMove={(dir) => onChange(swapAt(items, i, dir))}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Period" value={item.period} onChange={(v) => onChange(updateAt(items, i, { period: v }))} />
            <Field label="Title" value={item.title} onChange={(v) => onChange(updateAt(items, i, { title: v }))} />
          </div>
          <div className="mt-3">
            <Field label="Organization" value={item.org} onChange={(v) => onChange(updateAt(items, i, { org: v }))} />
          </div>
          <div className="mt-3">
            <Area label="Detail" value={item.detail} rows={3} onChange={(v) => onChange(updateAt(items, i, { detail: v }))} />
          </div>
          <div className="mt-3 flex items-end justify-between gap-4">
            <div className="flex-1">
              <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-faint">Tags</span>
              <TagsList value={item.tags} onChange={(v) => onChange(updateAt(items, i, { tags: v }))} />
            </div>
            <div className="flex items-center gap-2 pb-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-faint">highlight</span>
              <Toggle
                value={Boolean(item.highlight)}
                onChange={(v) => onChange(updateAt(items, i, { highlight: v }))}
              />
            </div>
          </div>
        </CardShell>
      ))}
      <AddButton
        label="Add entry"
        onClick={() =>
          onChange([...items, { period: "", title: "", org: "", detail: "", tags: [] }])
        }
      />
    </div>
  );
}

function PublicationEditor({
  pubs,
  onChange,
}: {
  pubs: Publication[];
  onChange: (p: Publication[]) => void;
}) {
  return (
    <div className="space-y-3">
      {pubs.map((p, i) => (
        <CardShell
          key={i}
          title={p.title || "Untitled publication"}
          subtitle={`${p.venue} · ${p.year}`}
          first={i === 0}
          last={i === pubs.length - 1}
          onRemove={() => onChange(removeAt(pubs, i))}
          onMove={(dir) => onChange(swapAt(pubs, i, dir))}
        >
          <Field label="Title" value={p.title} onChange={(v) => onChange(updateAt(pubs, i, { title: v }))} />
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Authors" value={p.authors} onChange={(v) => onChange(updateAt(pubs, i, { authors: v }))} />
            <Field label="Venue" value={p.venue} onChange={(v) => onChange(updateAt(pubs, i, { venue: v }))} />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Year" value={p.year} onChange={(v) => onChange(updateAt(pubs, i, { year: v }))} />
            <Select
              label="Status"
              value={p.status}
              options={PUB_STATUS}
              onChange={(v) => onChange(updateAt(pubs, i, { status: v }))}
            />
          </div>
          <div className="mt-3">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-faint">Tags</span>
            <TagsList value={p.tags} onChange={(v) => onChange(updateAt(pubs, i, { tags: v }))} />
          </div>
        </CardShell>
      ))}
      <AddButton
        label="Add publication"
        onClick={() =>
          onChange([...pubs, { title: "", authors: "", venue: "", year: String(new Date().getFullYear()), status: "published", tags: [] }])
        }
      />
    </div>
  );
}

function AwardsEditor({
  items,
  onChange,
}: {
  items: Award[];
  onChange: (i: Award[]) => void;
}) {
  return (
    <>
      {items.map((a, i) => (
        <div key={i} className="mt-3 flex items-end gap-2 rounded-xl border border-line bg-panel/50 p-3">
          <div className="w-24">
            <Field label="Year" value={a.year} onChange={(v) => onChange(updateAt(items, i, { year: v }))} />
          </div>
          <div className="flex-1">
            <Field label="Title" value={a.title} onChange={(v) => onChange(updateAt(items, i, { title: v }))} />
          </div>
          <div className="w-56">
            <Field label="Organization" value={a.org} onChange={(v) => onChange(updateAt(items, i, { org: v }))} />
          </div>
          <button
            type="button"
            onClick={() => onChange(removeAt(items, i))}
            className="mb-1 rounded-md p-1.5 text-faint transition-colors hover:text-magenta"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <AddButton label="Add entry" onClick={() => onChange([...items, { year: "", title: "", org: "" }])} />
    </>
  );
}

function SkillsEditor({
  groups,
  onChange,
}: {
  groups: SkillGroup[];
  onChange: (g: SkillGroup[]) => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {groups.map((g, gi) => (
        <div key={gi} className="rounded-xl border border-line bg-panel/50 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex-1">
              <Field label="Group name" value={g.name} onChange={(v) => onChange(updateAt(groups, gi, { name: v }))} />
            </div>
            <button
              type="button"
              onClick={() => onChange(removeAt(groups, gi))}
              className="mt-4 rounded-md p-1.5 text-faint transition-colors hover:text-magenta"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <div className="space-y-2">
            {g.skills.map((s, si) => (
              <div key={si} className="flex items-center gap-3 rounded-lg bg-panel-2/50 px-3 py-2">
                <input
                  value={s.name}
                  onChange={(e) =>
                    onChange(
                      updateAt(groups, gi, { skills: updateAt(g.skills, si, { name: e.target.value }) })
                    )
                  }
                  spellCheck={false}
                  className="flex-1 bg-transparent text-sm text-ink placeholder:text-faint focus:outline-none"
                  placeholder="skill"
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={s.level}
                  onChange={(e) =>
                    onChange(
                      updateAt(groups, gi, { skills: updateAt(g.skills, si, { level: Number(e.target.value) }) })
                    )
                  }
                  className="w-24 accent-cyan"
                />
                <span className="w-8 text-right font-mono text-[11px] text-cyan">{s.level}</span>
                <button
                  type="button"
                  onClick={() => onChange(updateAt(groups, gi, { skills: removeAt(g.skills, si) }))}
                  className="rounded p-1 text-faint hover:text-magenta"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onChange(updateAt(groups, gi, { skills: [...g.skills, { name: "", level: 70 }] }))}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-line px-3 py-1.5 font-mono text-[11px] text-dim transition-colors hover:border-cyan/50 hover:text-cyan"
          >
            <Plus size={12} /> skill
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...groups, { name: "", skills: [{ name: "", level: 70 }] }])}
        className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-line font-mono text-xs text-dim transition-colors hover:border-cyan/50 hover:text-cyan"
      >
        <Plus size={14} className="mr-1.5" /> Add skill group
      </button>
    </div>
  );
}

function LanguagesEditor({
  langs,
  onChange,
}: {
  langs: Language[];
  onChange: (l: Language[]) => void;
}) {
  return (
    <div className="space-y-3">
      {langs.map((l, i) => (
        <div key={i} className="flex items-end gap-3 rounded-xl border border-line bg-panel/50 p-3">
          <div className="w-64">
            <Field label="Language" value={l.name} onChange={(v) => onChange(updateAt(langs, i, { name: v }))} />
          </div>
          <div className="flex-1">
            <Field label="Level" value={l.level} onChange={(v) => onChange(updateAt(langs, i, { level: v }))} />
          </div>
          <div className="flex flex-col gap-1 pb-1.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-faint">
              {l.percentage}%
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={l.percentage}
              onChange={(e) => onChange(updateAt(langs, i, { percentage: Number(e.target.value) }))}
              className="w-24 accent-cyan"
            />
          </div>
          <button
            type="button"
            onClick={() => onChange(removeAt(langs, i))}
            className="mb-1 rounded-md p-1.5 text-faint transition-colors hover:text-magenta"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <AddButton
        label="Add language"
        onClick={() => onChange([...langs, { name: "", level: "", percentage: 50 }])}
      />
    </div>
  );
}

function ProjectsEditor({
  projects,
  onChange,
}: {
  projects: Project[];
  onChange: (p: Project[]) => void;
}) {
  return (
    <div className="space-y-3">
      {projects.map((pr, i) => (
        <CardShell
          key={i}
          title={pr.title || "Untitled project"}
          subtitle={`${pr.subtitle} · ${pr.year}`}
          first={i === 0}
          last={i === projects.length - 1}
          onRemove={() => onChange(removeAt(projects, i))}
          onMove={(dir) => onChange(swapAt(projects, i, dir))}
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Slug" value={pr.slug} onChange={(v) => onChange(updateAt(projects, i, { slug: v }))} />
            <Field label="Title" value={pr.title} onChange={(v) => onChange(updateAt(projects, i, { title: v }))} />
            <Field label="Year" value={pr.year} onChange={(v) => onChange(updateAt(projects, i, { year: v }))} />
          </div>
          <div className="mt-3">
            <Field label="Subtitle" value={pr.subtitle} onChange={(v) => onChange(updateAt(projects, i, { subtitle: v }))} />
          </div>
          <div className="mt-3">
            <Area label="Summary" value={pr.summary} rows={3} onChange={(v) => onChange(updateAt(projects, i, { summary: v }))} />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <Field label="Domain" value={pr.domain} onChange={(v) => onChange(updateAt(projects, i, { domain: v }))} />
            <Select
              label="Domain color"
              value={pr.domainColor}
              options={DOMAIN_COLORS}
              onChange={(v) => onChange(updateAt(projects, i, { domainColor: v }))}
            />
            <Select
              label="Status"
              value={pr.status}
              options={PROJECT_STATUS}
              onChange={(v) => onChange(updateAt(projects, i, { status: v }))}
            />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-faint">Tags</span>
              <TagsList value={pr.tags} onChange={(v) => onChange(updateAt(projects, i, { tags: v }))} />
            </div>
            <div>
              <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-faint">Tech</span>
              <TagsList value={pr.tech} onChange={(v) => onChange(updateAt(projects, i, { tech: v }))} />
            </div>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <Field label="Cover path" value={pr.cover} onChange={(v) => onChange(updateAt(projects, i, { cover: v }))} />
            <Field label="GitHub" value={pr.github ?? ""} onChange={(v) => onChange(updateAt(projects, i, { github: v }))} />
            <Field label="Demo" value={pr.demo ?? ""} onChange={(v) => onChange(updateAt(projects, i, { demo: v }))} />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-faint">featured</span>
            <Toggle value={Boolean(pr.featured)} onChange={(v) => onChange(updateAt(projects, i, { featured: v }))} />
          </div>
        </CardShell>
      ))}
      <AddButton
        label="Add project"
        onClick={() =>
          onChange([
            ...projects,
            {
              slug: "",
              title: "",
              subtitle: "",
              summary: "",
              year: String(new Date().getFullYear()),
              status: "draft",
              domain: "",
              domainColor: "cyan",
              tags: [],
              tech: [],
              cover: "/covers/",
              featured: false,
            },
          ])
        }
      />
    </div>
  );
}

function ServicesEditor({
  services,
  onChange,
}: {
  services: Service[];
  onChange: (s: Service[]) => void;
}) {
  return (
    <div className="space-y-3">
      {services.map((s, i) => (
        <CardShell
          key={i}
          title={s.title || "Untitled service"}
          subtitle={`icon: ${s.icon}`}
          first={i === 0}
          last={i === services.length - 1}
          onRemove={() => onChange(removeAt(services, i))}
          onMove={(dir) => onChange(swapAt(services, i, dir))}
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Icon (lucide name)" value={s.icon} onChange={(v) => onChange(updateAt(services, i, { icon: v }))} />
            <div className="sm:col-span-2">
              <Field label="Title" value={s.title} onChange={(v) => onChange(updateAt(services, i, { title: v }))} />
            </div>
          </div>
          <div className="mt-3">
            <Area label="Blurb" value={s.blurb} rows={2} onChange={(v) => onChange(updateAt(services, i, { blurb: v }))} />
          </div>
        </CardShell>
      ))}
      <AddButton label="Add service" onClick={() => onChange([...services, { icon: "Sparkles", title: "", blurb: "" }])} />
    </div>
  );
}

function DomainsEditor({
  domains,
  onChange,
}: {
  domains: Domain[];
  onChange: (d: Domain[]) => void;
}) {
  return (
    <div className="space-y-3">
      {domains.map((d, i) => (
        <CardShell
          key={i}
          title={d.label || "Untitled domain"}
          subtitle={d.id}
          first={i === 0}
          last={i === domains.length - 1}
          onRemove={() => onChange(removeAt(domains, i))}
          onMove={(dir) => onChange(swapAt(domains, i, dir))}
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Id" value={d.id} onChange={(v) => onChange(updateAt(domains, i, { id: v }))} />
            <Field label="Label" value={d.label} onChange={(v) => onChange(updateAt(domains, i, { label: v }))} />
            <Field label="Short" value={d.short} onChange={(v) => onChange(updateAt(domains, i, { short: v }))} />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Icon (lucide name)" value={d.icon} onChange={(v) => onChange(updateAt(domains, i, { icon: v }))} />
            <Select label="Color" value={d.color} options={DOMAIN_COLORS} onChange={(v) => onChange(updateAt(domains, i, { color: v }))} />
          </div>
          <div className="mt-3">
            <Area label="Blurb" value={d.blurb} rows={2} onChange={(v) => onChange(updateAt(domains, i, { blurb: v }))} />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <RangeField label="Mastery level" value={d.level} onChange={(v) => onChange(updateAt(domains, i, { level: v }))} />
            <RangeField label="Interest heat" value={d.heat} onChange={(v) => onChange(updateAt(domains, i, { heat: v }))} />
          </div>
          <div className="mt-3">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-faint">Keywords</span>
            <TagsList value={d.keywords} onChange={(v) => onChange(updateAt(domains, i, { keywords: v }))} />
          </div>
        </CardShell>
      ))}
      <AddButton
        label="Add domain"
        onClick={() =>
          onChange([
            ...domains,
            { id: "", label: "", short: "", blurb: "", level: 3, heat: 3, color: "cyan", icon: "Sparkles", keywords: [] },
          ])
        }
      />
    </div>
  );
}

/* ---------- studio shell ---------- */

export function DataStudio({ initial }: { initial: ContentConfig }) {
  const router = useRouter();
  const [config, setConfig] = useState<ContentConfig>(initial);
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<TabId>("profile");
  const [jsonText, setJsonText] = useState<string | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const touch = (k: keyof ContentConfig) => {
    setSaved(false);
    setError(null);
    setDirty((prev) => new Set(prev).add(k as string));
  };

  const update = <K extends keyof ContentConfig>(k: K, v: ContentConfig[K]) => {
    setConfig((c) => ({ ...c, [k]: v }));
    touch(k);
  };

  const dirtyCount = dirty.size;

  function commitJson(): boolean {
    if (jsonText === null) return true;
    try {
      const parsed = JSON.parse(jsonText) as ContentConfig;
      setConfig((c) => ({ ...c, ...parsed }));
      setJsonText(null);
      setJsonError(null);
      setSaved(false);
      setError(null);
      setDirty((prev) => {
        const next = new Set(prev);
        (Object.keys(parsed) as (keyof ContentConfig)[]).forEach((k) => next.add(k as string));
        return next;
      });
      return true;
    } catch {
      setJsonError("Invalid JSON — fix the syntax first.");
      setTab("json");
      return false;
    }
  }

  const selectTab = (t: TabId) => {
    if (t === "json") {
      setJsonText((prev) => prev ?? JSON.stringify(config, null, 2));
      setJsonError(null);
      setTab("json");
      return;
    }
    if (tab === "json" && jsonText !== null) {
      if (!commitJson()) return;
    }
    setTab(t);
  };

  async function handleSave(regenerate: boolean) {
    if (!commitJson()) return;
    setError(null);
    setSaving(!regenerate);
    setPublishing(regenerate);
    const res = await saveContentConfig(config as unknown as Record<string, unknown>);
    if (!res.ok) {
      setError(res.error ?? "Save failed");
    } else if (regenerate) {
      const pub = await publish();
      if (!pub.ok) setError(pub.error ?? "Regenerate failed");
      else setSaved(true);
    } else {
      setSaved(true);
    }
    setSaving(false);
    setPublishing(false);
    setDirty(new Set());
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-kicker">profile & data</p>
          <h1 className="heading mt-2 text-3xl">Data Studio</h1>
          <p className="mt-2 text-sm text-dim">
            Visual editor for <code className="rounded bg-panel-2 px-1.5 py-0.5 font-mono text-xs text-cyan">content/data/content.json</code> —{" "}
            <span className="font-mono text-xs text-faint">generates site data, covers, notebooks & PDFs</span>
          </p>
        </div>
      </div>

      {/* tabs */}
      <div className="sticky top-16 z-20 -mx-1 mt-6 overflow-x-auto px-1 pb-2">
        <div className="flex w-max gap-1 rounded-xl border border-line bg-panel/80 p-1 backdrop-blur-md">
          {TABS.map((t) => {
            const active = tab === t.id;
            const isDirty = dirty.size > 0 && t.id !== "json";
            return (
              <button
                key={t.id}
                onClick={() => selectTab(t.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider transition-all ${
                  active
                    ? "bg-cyan/15 text-cyan"
                    : "text-dim hover:bg-panel-2 hover:text-ink"
                }`}
              >
                <t.icon size={13} />
                {t.label}
                {isDirty && <span className="h-1.5 w-1.5 rounded-full bg-amber" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* active panel */}
      {tab === "profile" && (
        <div className="card p-6">
          <ProfileEditor profile={config.profile} onChange={(v) => update("profile", v)} />
          <SectionHeading>Header stats</SectionHeading>
          <div className="mt-3">
            <StatsEditor stats={config.stats} onChange={(v) => update("stats", v)} />
          </div>
        </div>
      )}

      {tab === "timeline" && (
        <div className="card p-6">
          <SectionHeading>Education</SectionHeading>
          <div className="mt-3">
            <TimelineEditor items={config.education} onChange={(v) => update("education", v)} />
          </div>
          <SectionHeading>Experience</SectionHeading>
          <div className="mt-3">
            <TimelineEditor items={config.experience} onChange={(v) => update("experience", v)} />
          </div>
        </div>
      )}

      {tab === "publications" && (
        <div className="card p-6">
          <PublicationEditor pubs={config.publications} onChange={(v) => update("publications", v)} />
          <SectionHeading>Awards</SectionHeading>
          <div className="mt-3">
            <AwardsEditor items={config.awards} onChange={(v) => update("awards", v)} />
          </div>
          <SectionHeading>Certifications</SectionHeading>
          <div className="mt-3">
            <AwardsEditor items={config.certifications} onChange={(v) => update("certifications", v)} />
          </div>
        </div>
      )}

      {tab === "skills" && (
        <div className="card p-6">
          <SectionHeading>Skill groups</SectionHeading>
          <div className="mt-3">
            <SkillsEditor groups={config.skills} onChange={(v) => update("skills", v)} />
          </div>
          <SectionHeading>Languages</SectionHeading>
          <div className="mt-3">
            <LanguagesEditor langs={config.languages} onChange={(v) => update("languages", v)} />
          </div>
        </div>
      )}

      {tab === "projects" && (
        <div className="card p-6">
          <ProjectsEditor projects={config.projects} onChange={(v) => update("projects", v)} />
        </div>
      )}

      {tab === "services" && (
        <div className="card p-6">
          <ServicesEditor services={config.services} onChange={(v) => update("services", v)} />
        </div>
      )}

      {tab === "domains" && (
        <div className="card p-6">
          <DomainsEditor domains={config.domains} onChange={(v) => update("domains", v)} />
        </div>
      )}

      {tab === "json" && (
        <div className="card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-[11px] uppercase tracking-wider text-faint">
              raw content.json — full control
            </p>
            {jsonError && (
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-magenta">
                <AlertTriangle size={12} /> {jsonError}
              </span>
            )}
          </div>
          <textarea
            value={jsonText ?? ""}
            onChange={(e) => {
              setJsonText(e.target.value);
              setJsonError(null);
              setSaved(false);
            }}
            spellCheck={false}
            className="mt-4 h-[60vh] w-full resize-y rounded-xl border border-line bg-void/60 p-5 font-mono text-[12.5px] leading-6 text-ink placeholder:text-faint focus:border-cyan/60 focus:outline-none focus:ring-1 focus:ring-cyan/40"
          />
        </div>
      )}

      {/* sticky action bar */}
      <div className="sticky bottom-4 z-20 mt-6">
        <div className="glass-strong flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3">
          <div className="min-w-0">
            {error && (
              <span className="flex items-center gap-1.5 font-mono text-xs text-magenta">
                <AlertTriangle size={12} /> {error}
              </span>
            )}
            {saved && !error && (
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald">
                <CheckCircle2 size={13} /> content saved & published
              </span>
            )}
            {dirtyCount > 0 && !saved && !error && (
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-amber">
                <span className="h-1.5 w-1.5 rounded-full bg-amber" />{" "}
                {dirtyCount} change{dirtyCount > 1 ? "s" : ""} unsaved
              </span>
            )}
            {dirtyCount === 0 && !saved && !error && (
              <span className="font-mono text-xs text-faint">no pending changes</span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleSave(false)}
              disabled={saving || publishing || dirtyCount === 0}
              className="btn btn-primary disabled:pointer-events-none disabled:opacity-50"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              Save
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving || publishing}
              className="btn btn-ghost disabled:opacity-50"
            >
              {publishing ? <Loader2 size={15} className="animate-spin" /> : <Rocket size={15} />}
              Save & regenerate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}