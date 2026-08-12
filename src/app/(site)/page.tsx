import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, ChevronDown, CalendarClock, Sparkles, Atom, Brain, Layers, Network, Waves, Hexagon, FlaskConical } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { TypedText } from "@/components/landing/typed-text";
import { ScienceVisual } from "@/components/landing/science-visual";
import { PostCard } from "@/components/blog/post-card";
import { NotebookMini } from "@/components/notebook/notebook-card";
import { domainColors, domains, profile, projects, services, stats } from "@/lib/data";
import { listArticles } from "@/lib/mdx";
import { listNotebooks } from "@/lib/notebooks";
import { site } from "@/lib/site";

const MolecularGraph = dynamic(() =>
  import("@/components/three/molecular-graph").then((m) => m.MolecularGraph),
  { loading: () => null }
);

const typedRoles = [
  "Approximate Message Passing researcher",
  "Graph Neural Network engineer",
  "AI drug designer",
  "Molecular dynamics modeler",
  "Material informatician",
  "Deep learning & ML practitioner",
  "Agentic systems builder",
  "PhD applicant · Spring 2027",
];

const focusChips = [
  { label: "Drug discovery", icon: FlaskConical, color: "magenta" },
  { label: "Molecular dynamics", icon: Atom, color: "violet" },
  { label: "Machine learning", icon: Brain, color: "cyan" },
  { label: "Deep learning", icon: Layers, color: "violet" },
  { label: "Graph neural networks", icon: Network, color: "cyan" },
  { label: "Approximate message passing", icon: Waves, color: "emerald" },
  { label: "Material science", icon: Hexagon, color: "amber" },
] as const;

export default async function Home() {
  const posts = await listArticles("posts");
  const notes = await listArticles("notes");
  const notebooks = listNotebooks();
  const featuredProjects = projects.filter((p) => p.featured);
  const latestPost = posts.slice(0, 3);
  const latestNotebook = notebooks.slice(0, 2);
  const latestNote = notes.slice(0, 2);

  return (
    <>
      <MolecularGraph />

      {/* ================= HERO ================= */}
      <section className="relative z-10 flex min-h-screen flex-col justify-center px-5 pt-24">
        <div className="pointer-events-none absolute inset-0 grid-overlay opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_75%)]" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-14 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <div>
            <Reveal>
              <p className="flex items-center gap-2 font-mono text-sm text-cyan">
                <span className="inline-block h-2 w-2 animate-pulse-soft rounded-full bg-emerald shadow-[0_0_10px_#34d399]" />
                {site.availability}
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-5 max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
                <span className="text-ink">{profile.firstName} </span>
                <span className="text-grad">{profile.name.split(" ").slice(1).join(" ")}</span>
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-6 font-mono text-base text-dim sm:text-lg">
                <TypedText phrases={typedRoles} className="text-cyan" />
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <p className="mt-5 max-w-xl text-lg leading-8 text-ink/80">
                {profile.tagline} I design inference engines, molecular models, and agentic
                systems at the frontier of <span className="text-ink">AI</span> ×{" "}
                <span className="text-ink">science</span>.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-5 flex flex-wrap gap-2">
                {focusChips.map((c) => (
                  <span
                    key={c.label}
                    className="chip !py-1.5 text-[11px]"
                    style={{ color: domainColors[c.color] }}
                  >
                    <c.icon size={12} />
                    {c.label}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.38}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/resume" className="btn btn-primary">
                  View portfolio <ArrowRight size={15} />
                </Link>
                <Link href="/connect" className="btn btn-ghost">
                  <CalendarClock size={15} /> Let&apos;s connect
                </Link>
                <Link href="/blog" className="btn btn-ghost">
                  <Sparkles size={15} /> Explore knowledge hub
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.48}>
              <div className="mt-14 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
                {stats.map((s) => (
                  <div key={s.label} className="border-l border-line pl-4">
                    <p className="font-mono text-2xl font-bold text-grad-cyan sm:text-3xl">
                      {s.value}
                    </p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-faint">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2} className="hidden lg:block">
            <ScienceVisual />
          </Reveal>
        </div>

        <div className="relative z-10 mt-16 flex justify-center pb-6">
          <ChevronDown size={22} className="animate-float text-faint" />
        </div>
      </section>

      {/* ================= DOMAIN MARQUEE ================= */}
      <section className="relative z-10 border-y border-line bg-abyss/40 py-5">
        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="flex w-max animate-marquee gap-3">
            {[...domains, ...domains].map((d, i) => (
              <span
                key={`${d.id}-${i}`}
                className="chip whitespace-nowrap"
                style={{ color: domainColors[d.color] }}
              >
                <d.icon size={12} />
                {d.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-24">
        <Reveal>
          <p className="section-kicker">01 · about</p>
          <h2 className="heading mt-3 text-3xl sm:text-4xl">
            A mind that treats <span className="text-grad-cyan">science</span> and{" "}
            <span className="text-grad-cyan">signal</span> as one language.
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <Reveal delay={0.1}>
            <div className="space-y-5">
              {profile.bio.map((p, i) => (
                <p key={i} className="leading-8 text-ink/80">
                  {p}
                </p>
              ))}
              <p className="rounded-xl border border-cyan/25 bg-cyan/5 px-4 py-3 font-mono text-sm leading-6 text-cyan/90">
                → {profile.focus}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="glass rounded-2xl p-6">
              <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-cyan">
                Core threads
              </h3>
              <ul className="mt-4 space-y-3">
                {domains.slice(0, 6).map((d) => (
                  <li key={d.id} className="flex items-center gap-3">
                    <span
                      className="grid h-8 w-8 place-items-center rounded-lg"
                      style={{ backgroundColor: `${domainColors[d.color]}1a`, color: domainColors[d.color] }}
                    >
                      <d.icon size={15} />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-ink">{d.label}</p>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-panel-2">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${d.level * 20}%`,
                            backgroundColor: domainColors[d.color],
                            boxShadow: `0 0 8px ${domainColors[d.color]}`,
                          }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= FEATURED PROJECTS ================= */}
      <section className="relative z-10 border-t border-line bg-abyss/30">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="section-kicker">02 · flagships</p>
                <h2 className="heading mt-3 text-3xl sm:text-4xl">
                  Selected <span className="text-grad-cyan">research & engineering</span>
                </h2>
              </div>
              <Link href="/projects" className="group inline-flex items-center gap-1.5 font-mono text-sm text-cyan">
                all projects <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featuredProjects.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.08}>
                <Link href={`/projects/${p.slug}`} className="card group flex h-full flex-col overflow-hidden">
                  <div className="relative h-44 overflow-hidden bg-gradient-to-br from-panel-2 via-panel to-abyss">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.cover}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span
                      className="absolute left-3 top-3 rounded-md px-2 py-1 font-mono text-[10px]"
                      style={{
                        color: domainColors[p.domainColor],
                        backgroundColor: `${domainColors[p.domainColor]}1f`,
                        border: `1px solid ${domainColors[p.domainColor]}40`,
                      }}
                    >
                      {p.domain}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-semibold text-ink transition-colors group-hover:text-cyan">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-sm text-dim">{p.subtitle}</p>
                    <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-dim/80">
                      {p.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.tech.slice(0, 3).map((t) => (
                        <span key={t} className="chip !py-0.5 text-[10px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= KNOWLEDGE HUB ================= */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-kicker">03 · knowledge hub</p>
              <h2 className="heading mt-3 text-3xl sm:text-4xl">
                Learn with me — <span className="text-grad-cyan">notes, articles, notebooks</span>
              </h2>
            </div>
            <div className="flex gap-3">
              <Link href="/blog" className="chip !px-4 !py-2">Blog</Link>
              <Link href="/notes" className="chip !px-4 !py-2">Study notes</Link>
              <Link href="/notes#notebooks" className="chip !px-4 !py-2">Notebooks</Link>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {latestPost.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <PostCard post={p} />
            </Reveal>
          ))}
        </div>

        {(latestNotebook.length > 0 || latestNote.length > 0) && (
          <Reveal delay={0.15}>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {latestNotebook.map((nb) => (
                <NotebookMini key={nb.slug} notebook={nb} />
              ))}
              {latestNote.map((n) => (
                <PostCard key={n.slug} post={n} kind="note" />
              ))}
            </div>
          </Reveal>
        )}
      </section>

      {/* ================= SERVICES ================= */}
      <section className="relative z-10 border-t border-line bg-abyss/30">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <Reveal>
            <p className="section-kicker">04 · work with me</p>
            <h2 className="heading mt-3 text-3xl sm:text-4xl">
              How I can help your <span className="text-grad-cyan">team</span>
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06}>
                <div className="card group h-full p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-cyan/20 to-violet/20 text-cyan transition-transform group-hover:scale-110">
                    <s.icon size={20} />
                  </span>
                  <h3 className="mt-4 font-semibold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-dim">{s.blurb}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-line glass-strong p-10 text-center sm:p-16">
            <div className="pointer-events-none absolute inset-0 grid-overlay opacity-30" />
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-cyan/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-violet/15 blur-3xl" />
            <div className="relative">
              <p className="section-kicker">open to new horizons</p>
              <h2 className="heading mx-auto mt-4 max-w-2xl text-3xl sm:text-4xl">
                Looking for a researcher who can <span className="text-grad-cyan">think in graphs</span> and{" "}
                <span className="text-grad-cyan">ship in PyTorch</span>?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-dim">
                I&apos;m actively seeking PhD positions and research collaborations across
                ML/DL, AMP, GNNs, drug design, metabolic engineering, material informatics,
                and agentic AI.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/connect" className="btn btn-primary !px-7 !py-3">
                  <CalendarClock size={16} /> Book a 1:1 call
                </Link>
                <a
                  href={`mailto:${site.email}`}
                  className="btn btn-ghost !px-7 !py-3"
                >
                  {site.email}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
