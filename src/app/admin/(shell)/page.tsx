import Link from "next/link";
import { readFileSync, readdirSync, statSync } from "fs";
import path from "path";
import matter from "gray-matter";
import {
  FileText,
  BookOpen,
  FlaskConical,
  FolderKanban,
  Plus,
  ArrowUpRight,
  ArrowUp,
  ArrowDown,
  Rocket,
  Settings,
  Images,
  UserRound,
  Activity,
  HardDrive,
  ShieldCheck,
  Layers,
  Clock3,
  Globe,
} from "lucide-react";
import { listNotebooks } from "@/lib/notebooks";

const contentRoot = path.join(process.cwd(), "content");

interface Scanned {
  slug: string;
  title: string;
  date: string;
  draft: boolean;
  mtime: number;
}

function scanDir(folder: string): Scanned[] {
  try {
    return readdirSync(path.join(contentRoot, folder))
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => {
        const source = readFileSync(path.join(contentRoot, folder, f), "utf8");
        const { data } = matter(source);
        const stats = statSync(path.join(contentRoot, folder, f));
        return {
          slug: f.replace(/\.mdx$/, ""),
          title: String(data.title ?? f),
          date: String(data.date ?? ""),
          draft: Boolean(data.draft),
          mtime: stats.mtimeMs,
        };
      });
  } catch {
    return [];
  }
}

function dirSize(p: string): number {
  try {
    return readdirSync(p).reduce((sum, f) => {
      const fp = path.join(p, f);
      try {
        return sum + statSync(fp).size;
      } catch {
        return sum;
      }
    }, 0);
  } catch {
    return 0;
  }
}

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function monthKey(date: string): string {
  return date.slice(0, 7);
}

function lastMonths(n: number): { key: string; label: string }[] {
  const out: { key: string; label: string }[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleDateString("en-US", { month: "short" }),
    });
  }
  return out;
}

function monthCounts(items: Scanned[]) {
  const months = lastMonths(8);
  return months.map((m) => ({
    ...m,
    count: items.filter((i) => !i.draft && monthKey(i.date) === m.key).length,
  }));
}

const fmtRel = (ms: number) => {
  const mins = Math.round((Date.now() - ms) / 60000);
  if (mins < 60) return mins <= 1 ? "just now" : `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
};

export default async function AdminDashboardPage() {
  const posts = scanDir("posts");
  const notes = scanDir("notes");
  const projectItems = scanDir("projects");
  const notebooks = listNotebooks();

  const published = posts.filter((p) => !p.draft).length;
  const drafts = posts.filter((p) => p.draft).length;
  const notesPublished = notes.filter((n) => !n.draft).length;
  const projPublished = projectItems.filter((p) => !p.draft).length;

  const now = new Date();
  const thisMonth = monthKey(now.toISOString());
  const prevMonth = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString());
  const delta = (list: Scanned[]) => {
    const cur = list.filter((i) => !i.draft && monthKey(i.date) === thisMonth).length;
    const prev = list.filter((i) => !i.draft && monthKey(i.date) === prevMonth).length;
    return { cur, prev, delta: cur - prev };
  };

  const postsDelta = delta(posts);
  const notesDelta = delta(notes);

  const postsByMonth = monthCounts(posts);
  const notesByMonth = monthCounts(notes);
  const activityMax = Math.max(
    1,
    ...postsByMonth.map((m, i) => m.count + notesByMonth[i].count)
  );

  const cellCount = notebooks.reduce((s, n) => s + n.cellCounts.code, 0);
  const mix = [
    { label: "Blog posts", value: published, color: "var(--color-cyan)" },
    { label: "Study notes", value: notesPublished, color: "var(--color-violet)" },
    { label: "Notebooks", value: notebooks.length, color: "var(--color-emerald)" },
    { label: "Projects", value: projPublished, color: "var(--color-amber)" },
  ];
  const mixTotal = Math.max(1, mix.reduce((s, m) => s + m.value, 0));
  const donut = mix
    .map((m) => `${(m.value / mixTotal) * 100}% ${m.color}`)
    .join(", ");

  const recent = [...posts, ...notes, ...projectItems]
    .sort((a, b) => b.mtime - a.mtime)
    .slice(0, 6);

  const kinds: Record<string, { label: string; href: (s: string) => string; accent: string }> = {
    posts: { label: "post", href: (s) => `/blog/${s}`, accent: "text-cyan" },
    notes: { label: "note", href: (s) => `/notes/${s}`, accent: "text-violet" },
    projects: { label: "project", href: (s) => `/projects/${s}`, accent: "text-amber" },
  };

  const mediaSize = dirSize(path.join(process.cwd(), "public", "media"));
  const nbSize = dirSize(path.join(process.cwd(), "public", "notebooks"));
  const filesSize = dirSize(path.join(process.cwd(), "public", "files"));
  const coversCount = (() => {
    try {
      return readdirSync(path.join(process.cwd(), "public", "covers")).length;
    } catch {
      return 0;
    }
  })();

  const kpis = [
    {
      label: "Blog posts",
      value: published,
      icon: FileText,
      accent: "text-cyan",
      sub: drafts > 0 ? `${drafts} draft${drafts > 1 ? "s" : ""} pending` : "no drafts",
      trend: postsDelta.delta,
      months: postsByMonth,
    },
    {
      label: "Study notes",
      value: notesPublished,
      icon: BookOpen,
      accent: "text-violet",
      sub: `${notes.length - notesPublished} drafts`,
      trend: notesDelta.delta,
      months: notesByMonth,
    },
    {
      label: "Notebooks",
      value: notebooks.length,
      icon: FlaskConical,
      accent: "text-emerald",
      sub: `${cellCount} code cells · ${notebooks.reduce((s, n) => s + n.cellCounts.markdown, 0)} notes`,
      months: [],
    },
    {
      label: "Projects",
      value: projPublished,
      icon: FolderKanban,
      accent: "text-amber",
      sub: `${projectItems.length - projPublished} in draft`,
      months: [],
    },
  ];

  const actions = [
    { label: "New post", href: "/admin/posts/new", icon: Plus, accent: "text-cyan" },
    { label: "New note", href: "/admin/notes/new", icon: Plus, accent: "text-violet" },
    { label: "New project", href: "/admin/projects/new", icon: Plus, accent: "text-amber" },
    { label: "Upload media", href: "/admin/media", icon: Images, accent: "text-emerald" },
    { label: "Site settings", href: "/admin/settings", icon: Settings, accent: "text-cyan" },
    { label: "Profile & data", href: "/admin/data", icon: UserRound, accent: "text-violet" },
    { label: "GitHub Pages", href: "/admin/github", icon: Globe, accent: "text-emerald" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-kicker">admin studio</p>
          <h1 className="heading mt-2 text-3xl">Dashboard</h1>
          <p className="mt-2 text-sm text-dim">
            Your content at a glance — publish, edit, and ship from here.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link href="/admin/posts/new" className="btn btn-primary">
            <Plus size={15} /> New post
          </Link>
          <Link href="/admin/notes/new" className="btn btn-ghost">
            <Plus size={15} /> New note
          </Link>
        </div>
      </header>

      {/* hero metric band */}
      <section className="glass-strong relative overflow-hidden rounded-2xl p-6 md:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-violet/10 blur-3xl" />
        <div className="relative flex flex-wrap items-center gap-8">
          <div className="min-w-44">
            <p className="font-mono text-[11px] uppercase tracking-widest text-faint">
              content published
            </p>
            <p className="heading mt-2 font-mono text-6xl leading-none text-ink">
              {published}
              <span className="ml-3 align-middle font-sans text-lg font-normal text-dim">
                posts
              </span>
            </p>
            <span
              className={`mt-3 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-[11px] ${
                postsDelta.delta >= 0
                  ? "border-emerald/40 bg-emerald/10 text-emerald"
                  : "border-magenta/40 bg-magenta/10 text-magenta"
              }`}
            >
              {postsDelta.delta >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
              {Math.abs(postsDelta.delta)} this month
            </span>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-faint">drafts</p>
              <p className="mt-1 font-mono text-2xl text-ink">{drafts + (notes.length - notesPublished)}</p>
              <p className="text-xs text-dim">pending review</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-faint">notebooks</p>
              <p className="mt-1 font-mono text-2xl text-ink">{notebooks.length}</p>
              <p className="text-xs text-dim">{cellCount} code cells</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-faint">notes</p>
              <p className="mt-1 font-mono text-2xl text-ink">{notesPublished}</p>
              <p className="text-xs text-dim">{notesDelta.delta >= 0 ? "+" : ""}{notesDelta.delta} this month</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-faint">projects</p>
              <p className="mt-1 font-mono text-2xl text-ink">{projPublished}</p>
              <p className="text-xs text-dim">{projectItems.length - projPublished} drafted</p>
            </div>
          </div>

          <Link
            href="/admin/data"
            className="btn btn-ghost shrink-0"
            title="Regenerate covers, notebooks, PDFs and compiled content from content/data"
          >
            <Rocket size={15} className="text-cyan" /> Regenerate all
          </Link>
        </div>
      </section>

      {/* KPI cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="card group p-5">
            <div className="flex items-center justify-between">
              <span className={`grid h-10 w-10 place-items-center rounded-xl bg-panel-2 ${k.accent}`}>
                <k.icon size={17} />
              </span>
              {k.months.length > 0 ? (
                <div className="flex h-10 items-end gap-[3px]">
                  {k.months.map((m, i) => (
                    <div
                      key={i}
                      title={`${m.count} in ${m.label}`}
                      className="w-[5px] rounded-sm bg-cyan/60 transition-colors group-hover:bg-cyan"
                      style={{ height: `${Math.max(12, Math.min(100, (m.count / activityMax) * 100))}%` }}
                    />
                  ))}
                </div>
              ) : (
                <span className="font-mono text-[10px] uppercase tracking-wider text-faint">total</span>
              )}
            </div>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-faint">{k.label}</p>
            <div className="mt-1 flex items-baseline gap-2">
              <p className="text-3xl font-semibold text-ink">{k.value}</p>
              {typeof k.trend === "number" && k.trend !== 0 && (
                <span
                  className={`inline-flex items-center gap-0.5 font-mono text-[11px] ${
                    k.trend > 0 ? "text-emerald" : "text-magenta"
                  }`}
                >
                  {k.trend > 0 ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
                  {Math.abs(k.trend)}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-dim">{k.sub}</p>
          </div>
        ))}
      </section>

      {/* charts row */}
      <section className="grid gap-4 lg:grid-cols-5">
        <div className="card p-5 lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="heading flex items-center gap-2 text-lg">
              <Activity size={16} className="text-cyan" /> Publishing activity
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-wider text-faint">last 8 months</span>
          </div>
          <div className="mt-6 flex h-40 items-end gap-3">
            {postsByMonth.map((m, i) => {
              const n = notesByMonth[i].count;
              const total = m.count + n;
              return (
                <div key={m.key} className="group flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                  <div className="flex w-full flex-1 items-end justify-center gap-[3px]">
                    <div
                      className="w-2.5 rounded-t-md bg-cyan/70 transition-all group-hover:bg-cyan"
                      style={{ height: `${(m.count / activityMax) * 100}%` }}
                      title={`${m.count} posts`}
                    />
                    <div
                      className="w-2.5 rounded-t-md bg-violet/70 transition-all group-hover:bg-violet"
                      style={{ height: `${(n / activityMax) * 100}%` }}
                      title={`${n} notes`}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-faint">{m.label}</span>
                  <span className="font-mono text-[10px] text-dim">{total}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 flex items-center gap-4 font-mono text-[10px] uppercase tracking-wider text-faint">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-cyan/70" /> posts</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-violet/70" /> notes</span>
          </p>
        </div>

        <div className="card p-5 lg:col-span-2">
          <h2 className="heading flex items-center gap-2 text-lg">
            <Layers size={16} className="text-violet" /> Content mix
          </h2>
          <div className="mt-6 flex items-center gap-6">
            <div
              className="relative h-32 w-32 shrink-0 rounded-full"
              style={{ background: `conic-gradient(${donut})` }}
            >
              <div className="absolute inset-4 grid place-items-center rounded-full bg-panel">
                <span className="font-mono text-2xl font-semibold text-ink">{mixTotal}</span>
              </div>
            </div>
            <ul className="min-w-0 flex-1 space-y-2.5">
              {mix.map((m) => (
                <li key={m.label} className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 truncate text-sm text-dim">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: m.color }} />
                    {m.label}
                  </span>
                  <span className="font-mono text-sm text-ink">{m.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* actions + activity */}
      <section className="grid gap-4 lg:grid-cols-5">
        <div className="card p-5 lg:col-span-2">
          <h2 className="heading flex items-center gap-2 text-lg">
            <Plus size={16} className="text-emerald" /> Next actions
          </h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {actions.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="group flex items-center gap-3 rounded-xl border border-line bg-panel/50 px-4 py-3 transition-all hover:border-cyan/40 hover:bg-panel"
              >
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-panel-2 ${a.accent}`}>
                  <a.icon size={14} />
                </span>
                <span className="flex-1 text-sm font-medium text-ink">{a.label}</span>
                <ArrowUpRight
                  size={13}
                  className="text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-cyan"
                />
              </Link>
            ))}
          </div>
        </div>

        <div className="card p-5 lg:col-span-3">
          <h2 className="heading flex items-center gap-2 text-lg">
            <Clock3 size={16} className="text-amber" /> Recent changes
          </h2>
          <div className="mt-4 divide-y divide-line">
            {recent.map((r) => {
              const k = posts.includes(r)
                ? kinds.posts
                : notes.includes(r)
                  ? kinds.notes
                  : kinds.projects;
              return (
                <Link
                  key={`${k.label}-${r.slug}`}
                  href={k.href(r.slug)}
                  className="flex items-center justify-between gap-4 py-3 transition-colors hover:bg-panel/60"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={`shrink-0 font-mono text-[10px] uppercase tracking-wider ${k.accent}`}>
                      {k.label}
                    </span>
                    <span className="truncate text-sm text-ink">{r.title}</span>
                    {r.draft && (
                      <span className="shrink-0 rounded-full border border-amber/40 bg-amber/10 px-2 py-0.5 font-mono text-[10px] text-amber">
                        draft
                      </span>
                    )}
                  </div>
                  <span className="shrink-0 font-mono text-[11px] text-faint">{fmtRel(r.mtime)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* system status */}
      <section className="card p-5">
        <h2 className="heading flex items-center gap-2 text-lg">
          <HardDrive size={16} className="text-cyan" /> System
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-faint">media library</p>
            <p className="mt-1 font-mono text-lg text-ink">{fmtSize(mediaSize)}</p>
            <p className="text-xs text-dim">public/media</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-faint">notebooks</p>
            <p className="mt-1 font-mono text-lg text-ink">{fmtSize(nbSize)}</p>
            <p className="text-xs text-dim">public/notebooks</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-faint">generated files</p>
            <p className="mt-1 font-mono text-lg text-ink">{fmtSize(filesSize)}</p>
            <p className="text-xs text-dim">PDFs · public/files</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-faint">covers</p>
            <p className="mt-1 font-mono text-lg text-ink">{coversCount}</p>
            <p className="text-xs text-dim">auto-generated svg</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-faint">converted md</p>
            <p className="mt-1 font-mono text-lg text-ink">{published + notesPublished + projPublished}</p>
            <p className="text-xs text-dim">live pages</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-faint">auth</p>
            <p className="mt-1 flex items-center gap-1.5 font-mono text-lg text-emerald">
              <ShieldCheck size={15} /> active
            </p>
            <p className="text-xs text-dim">HMAC session · 7d</p>
          </div>
        </div>
      </section>
    </div>
  );
}