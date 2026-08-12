import type { Metadata } from "next";
import Link from "next/link";
import {
  Award,
  BadgeCheck,
  Download,
  FileText,
  GraduationCap,
  Languages,
  MapPin,
  Quote,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { PrintButton } from "@/components/resume/actions";
import {
  awards,
  certifications,
  education,
  experience,
  languages,
  profile,
  publications,
  skills,
} from "@/lib/data";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resume & CV",
  description: `${profile.name} — academic CV, research experience, publications and skills.`,
};

const statusColor: Record<string, string> = {
  published: "text-emerald border-emerald/40 bg-emerald/10",
  "in-press": "text-cyan border-cyan/40 bg-cyan/10",
  preprint: "text-violet border-violet/40 bg-violet/10",
  "under-review": "text-amber border-amber/40 bg-amber/10",
};

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-28">
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="section-kicker">resume / cv</p>
            <h1 className="heading mt-3 text-4xl sm:text-5xl">{profile.name}</h1>
            <p className="mt-2 font-mono text-sm text-cyan">
              {profile.role} · {profile.degree}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-dim">
              <MapPin size={13} /> {site.location} ·{" "}
              <a className="text-cyan hover:underline" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </p>
          </div>
          <div className="flex gap-2.5 no-print">
            <PrintButton />
            <a href="/files/cv.pdf" download className="btn btn-primary">
              <Download size={15} /> CV.pdf
            </a>
          </div>
        </div>
      </Reveal>

      {/* ===== summary ===== */}
      <Reveal delay={0.08}>
        <blockquote className="print-card glass mt-10 rounded-2xl p-6">
          <div className="flex gap-3">
            <Quote size={18} className="shrink-0 text-cyan" />
            <p className="text-sm leading-7 text-dim">{profile.focus}</p>
          </div>
        </blockquote>
      </Reveal>

      {/* ===== education ===== */}
      <Section index="01" title="Education">
        <div className="space-y-6">
          {education.map((e) => (
            <TimelineRow key={e.title} item={e} />
          ))}
        </div>
      </Section>

      {/* ===== experience ===== */}
      <Section index="02" title="Research & Work Experience">
        <div className="space-y-6">
          {experience.map((e) => (
            <TimelineRow key={e.title} item={e} />
          ))}
        </div>
      </Section>

      {/* ===== publications ===== */}
      <Section index="03" title="Publications">
        <div className="space-y-4">
          {publications.map((p) => (
            <Reveal key={p.title}>
              <article className="print-card card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="max-w-2xl">
                    <h3 className="font-medium leading-snug text-ink">
                      <span className="text-cyan">[{p.year}]</span> {p.title}
                    </h3>
                    <p className="mt-1.5 font-mono text-xs text-faint">{p.authors}</p>
                    <p className="mt-1 text-sm text-dim">{p.venue}</p>
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${statusColor[p.status]}`}
                  >
                    {p.status}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span key={t} className="chip !py-0.5 text-[10px]">
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ===== skills ===== */}
      <Section index="04" title="Technical Skills">
        <div className="grid gap-6 sm:grid-cols-2">
          {skills.map((g) => (
            <div key={g.name} className="print-card card p-6">
              <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-cyan">
                {g.name}
              </h3>
              <div className="mt-4 space-y-4">
                {g.skills.map((s) => (
                  <div key={s.name}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-sm text-ink">{s.name}</span>
                      <span className="font-mono text-[11px] text-faint">{s.level}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-panel-2">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan to-violet shadow-[0_0_8px_rgba(59,225,255,0.5)]"
                        style={{ width: `${s.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== awards / certs / languages ===== */}
      <Section index="05" title="Awards, Certifications & Languages">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="print-card card p-6">
            <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-cyan">
              <Award size={13} /> Awards
            </h3>
            <ul className="mt-4 space-y-3">
              {awards.map((a) => (
                <li key={a.title} className="text-sm">
                  <p className="font-medium text-ink">{a.title}</p>
                  <p className="text-xs text-faint">
                    {a.year} · {a.org}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="print-card card p-6">
            <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-cyan">
              <BadgeCheck size={13} /> Certifications
            </h3>
            <ul className="mt-4 space-y-3">
              {certifications.map((c) => (
                <li key={c.title} className="text-sm">
                  <p className="font-medium text-ink">{c.title}</p>
                  <p className="text-xs text-faint">
                    {c.year} · {c.org}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="print-card card p-6">
            <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-cyan">
              <Languages size={13} /> Languages
            </h3>
            <ul className="mt-4 space-y-3">
              {languages.map((l) => (
                <li key={l.name}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-ink">{l.name}</span>
                    <span className="text-xs text-faint">{l.level}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-panel-2">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet to-magenta"
                      style={{ width: `${l.percentage}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Reveal>
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-panel/50 p-6">
          <div className="flex items-center gap-3">
            <FileText size={18} className="text-cyan" />
            <p className="text-sm text-dim">
              Full publication record and transcripts available on request.
            </p>
          </div>
          <div className="flex gap-2.5 no-print">
            <Link href="/projects" className="btn btn-ghost !py-2">
              View projects
            </Link>
            <Link href="/connect" className="btn btn-primary !py-2">
              Contact me
            </Link>
          </div>
        </div>
      </Reveal>

      <div className="no-print mt-10 flex items-center gap-3 font-mono text-[11px] text-faint">
        <GraduationCap size={13} />
        Tip: use “Save as PDF” for a print-perfect version of this page.
      </div>
    </div>
  );
}

function Section({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-16">
      <Reveal>
        <div className="mb-8 flex items-center gap-4">
          <span className="font-mono text-xs text-faint">{index}</span>
          <h2 className="heading text-2xl sm:text-3xl">{title}</h2>
          <span className="h-px flex-1 bg-gradient-to-r from-line-strong to-transparent" />
        </div>
      </Reveal>
      {children}
    </section>
  );
}

function TimelineRow({ item }: { item: (typeof education)[number] }) {
  return (
    <Reveal>
      <div className="relative flex gap-5 pl-2">
        <div className="flex flex-col items-center">
          <span
            className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${
              item.highlight
                ? "bg-cyan shadow-[0_0_12px_rgba(59,225,255,0.9)]"
                : "border-2 border-violet/70"
            }`}
          />
          <span className="mt-1 w-px flex-1 bg-gradient-to-b from-line-strong to-transparent" />
        </div>
        <div className="print-card card mb-6 flex-1 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-xs uppercase tracking-wider text-cyan">
              {item.period}
            </p>
            {item.highlight && (
              <span className="rounded-full bg-cyan/10 px-2 py-0.5 font-mono text-[10px] text-cyan">
                focus
              </span>
            )}
          </div>
          <h3 className="mt-2 text-lg font-semibold text-ink">{item.title}</h3>
          <p className="mt-0.5 text-sm text-dim">{item.org}</p>
          <p className="mt-3 text-sm leading-7 text-ink/75">{item.detail}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.tags.map((t) => (
              <span key={t} className="chip !py-0.5 text-[10px]">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}
