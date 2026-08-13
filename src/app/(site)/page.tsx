import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  AtSign,
  BookOpen,
  CalendarClock,
  Globe,
  GraduationCap,
  Mail,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Stagger } from "@/components/ui/stagger";
import { TypedText } from "@/components/landing/typed-text";
import { HeroScene } from "@/components/three/hero-scene";
import { HeroGlow } from "@/components/three/hero-glow";
import { CardScene } from "@/components/three/card-scene";
import { ParticleNetwork } from "@/components/three/particle-network";
import { Tilt } from "@/components/three/tilt";
import { PostCard } from "@/components/blog/post-card";
import { NotebookMini } from "@/components/notebook/notebook-card";
import {
  education,
  experience,
  profile,
  projects,
  skills,
  stats,
} from "@/lib/data";
import { listArticles } from "@/lib/mdx";
import { listNotebooks } from "@/lib/notebooks";
import { site } from "@/lib/site";

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

const exploringChips = [
  "Biophysics",
  "Biochemistry",
  "High-dimensional statistics",
  "Control theory",
];

const workSceneTypes = ["molecule", "protein", "network", "crystal"] as const;

const timeline = [...experience.slice(0, 3), education[0]];

const galleryItems = [
  { src: "/gallery/chromatogram.png", label: "Chromatogram", featured: true },
  { src: "/gallery/dna-helix.png", label: "DNA Helix", featured: false },
  { src: "/gallery/neuralnet.png", label: "Neural Network", featured: false },
  { src: "/gallery/glycolysis.png", label: "Glycolysis & Krebs Cycle", featured: false },
  { src: "/gallery/capsule.png", label: "Capsule", featured: false },
  { src: "/gallery/ai-agent.png", label: "AI Agent", featured: false },
];

const contactRows = [
  { label: "Email", value: site.email, href: `mailto:${site.email}`, icon: Mail },
  { label: "Book a 1:1 call", value: "Calendly — 30 minutes", href: site.calendly, icon: CalendarClock },
  { label: "GitHub", value: "github.com/yousofghalenoei", href: site.socials.github, icon: Globe },
  { label: "LinkedIn", value: "in/yousofghalenoei", href: site.socials.linkedin, icon: Globe },
  { label: "Google Scholar", value: "Citations profile", href: site.socials.scholar, icon: BookOpen },
  { label: "X (Twitter)", value: "@yousofghalenoei", href: site.socials.x, icon: AtSign },
];

export default async function Home() {
  const posts = await listArticles("posts");
  const notebooks = listNotebooks();
  const latestPost = posts.slice(0, 3);
  const latestNotebook = notebooks.slice(0, 2);
  const workProjects = projects.slice(0, 4);

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative z-10 flex min-h-screen flex-col justify-center overflow-hidden px-5 pt-28 lg:pt-24">
        <ParticleNetwork />
        <div className="orb orb-cyan -left-10 -top-10 h-[500px] w-[500px]" />
        <div className="orb orb-amber bottom-0 right-0 h-[400px] w-[400px]" />
        <div className="pointer-events-none absolute inset-0 grid-overlay opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]" />
        <div className="relative z-[1] mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <Reveal>
              <p className="eyebrow">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-pulse-soft rounded-full bg-emerald opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
                </span>
                {site.availability}
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-6 font-display text-[42px] font-semibold leading-[1.06] tracking-tight sm:text-6xl lg:text-[64px]">
                AI for science.
                <br />
                Knowledge for <span className="text-grad">impact.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-6 font-mono text-base text-dim sm:text-lg">
                Building as <span className="text-ink">{profile.name}</span> —{" "}
                <span className="text-cyan">&gt; </span>
                <TypedText phrases={typedRoles} className="text-cyan" />
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <p className="mt-5 max-w-xl text-lg leading-8 text-ink/80">
                I build intelligent models and agentic systems to accelerate
                discovery in biology, chemistry, and materials — bridging{" "}
                <span className="text-ink">AI</span>, physics, and computation to
                solve real problems.
              </p>
            </Reveal>

            <Reveal delay={0.32}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/resume" className="btn btn-primary">
                  View portfolio <ArrowUpRight />
                </Link>
                <Link href="/connect" className="btn btn-ghost">
                  <CalendarClock /> Book a call
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.42}>
              <div className="mt-14 grid max-w-2xl grid-cols-4 divide-x divide-line">
                {stats.map((s) => (
                  <div key={s.label} className="px-4 first:pl-0">
                    <p className="font-mono text-2xl font-bold text-ink sm:text-3xl">
                      {s.value}
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-faint">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.18} className="hidden lg:block">
            <div className="relative">
              <HeroGlow />
              <div className="orb orb-cyan absolute -right-16 -top-16 h-[340px] w-[340px]" style={{ filter: "blur(10px)" }} />
              <div className="orb orb-amber absolute -bottom-10 -left-10 h-[220px] w-[220px]" style={{ filter: "blur(10px)" }} />
              <Tilt max={10}>
                <div className="relative">
                  <div className="hero-ring" />
                  <div className="hero-panel relative h-[560px]">
                    <div className="absolute inset-0 animate-img-float">
                      <HeroScene />
                    </div>
                    <p className="hero-caption">
                      <b>3D molecular scene</b> — live · three.js
                    </p>
                  </div>
                </div>
              </Tilt>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= RESEARCH FOCUS ================= */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-24">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <Reveal>
              <p className="eyebrow">01 · research focus</p>
              <h2 className="heading mt-4 text-3xl sm:text-4xl">
                Where AI Meets the <span className="text-grad">Molecular</span> World.
              </h2>
              <p className="mt-4 max-w-md text-dim">
                I develop data-driven and physics-informed AI methods to model,
                predict, and design complex molecular systems.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-6 flex max-w-md flex-wrap items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-widest text-faint">
                  Also exploring
                </span>
                {exploringChips.map((c) => (
                  <span key={c} className="chip">
                    {c}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12} className="hidden sm:block">
            <div className="relative ml-auto max-w-[340px]">
              <div className="pointer-events-none absolute -inset-[30px] z-0 rounded-3xl bg-[radial-gradient(circle_at_40%_40%,rgba(79,200,232,0.16),transparent_65%)] blur-2xl" />
              <Image
                src="/gallery/dna-helix.png"
                alt="3D DNA double helix with rainbow base pairs"
                width={340}
                height={300}
                className="animate-drift relative z-[1] w-full rounded-2xl border border-line mix-blend-screen saturate-120 contrast-105"
              />
            </div>
</Reveal>
      </div>
      </section>

      {/* ================= SELECTED WORK ================= */}
      <section className="relative z-10 border-t border-line bg-abyss/30">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-xl">
                <p className="eyebrow">02 · publications</p>
                <h2 className="heading mt-4 text-3xl sm:text-4xl">
                  Selected <span className="text-grad">Work.</span>
                </h2>
              </div>
              <Link
                href="/projects"
                className="group inline-flex items-center gap-1.5 font-mono text-sm text-cyan"
              >
                View all on GitHub{" "}
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {workProjects.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.08}>
                <Tilt max={6} className="h-full">
                  <Link
                    href={`/projects/${p.slug}`}
                    className="work-card group block h-full"
                  >
                    <div className={`work-thumb tint-${["blue", "orange", "purple", "cyan"][i % 4]}`}>
                      <CardScene type={workSceneTypes[i % workSceneTypes.length]} />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <span className="work-kicker">{p.domain}</span>
                        <span className="work-kicker">{p.year}</span>
                      </div>
                      <h3 className="mt-2 font-display text-[17px] font-semibold text-ink">
                        {p.title}
                      </h3>
                      <p className="mt-1 text-[13px] leading-5 text-faint">{p.subtitle}</p>
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {p.tags.slice(0, 3).map((t) => (
                          <span key={t} className="work-tag">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SCIENTIFIC VISUALIZATIONS ================= */}
      <section className="relative z-10 overflow-hidden border-t border-line bg-abyss/30">
        <div className="orb orb-violet absolute -right-40 top-10 h-[500px] w-[500px]" />
        <div className="mx-auto max-w-6xl px-5 py-24">
          <Reveal>
            <div className="mx-auto max-w-xl text-center">
              <p className="eyebrow justify-center">scientific visualizations</p>
              <h2 className="heading mt-4 text-3xl sm:text-4xl">
                Visual <span className="text-grad">Explorer.</span>
              </h2>
              <p className="mt-4 text-dim">
                A glimpse into the molecular world — from protein structures to
                neural network topologies and chromatographic data.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-4 md:auto-rows-[200px] md:grid-cols-3">
            {galleryItems.map((item, i) => (
              <Reveal
                key={item.src}
                delay={i * 0.06}
                className={item.featured ? "md:col-span-2 md:row-span-2" : ""}
              >
                <div className="group relative h-full min-h-[200px] cursor-pointer overflow-hidden rounded-xl border border-line bg-panel">
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover saturate-110 brightness-90 transition-all duration-700 group-hover:scale-110 group-hover:saturate-150 group-hover:brightness-100"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <p className="absolute bottom-4 left-4 translate-y-4 font-mono text-xs tracking-wide text-cyan opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {item.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ABOUT + JOURNEY ================= */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-24">
        <div className="grid gap-14 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <Reveal>
              <p className="eyebrow">04 · about</p>
              <h2 className="heading mt-4 text-3xl sm:text-4xl">
                A mind that treats <span className="text-grad">science</span> and{" "}
                <span className="text-grad">signal</span> as one language.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-6 space-y-5">
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
              <div className="mt-12">
                <p className="eyebrow">tech stack</p>
                <div className="mt-6 space-y-6">
                  {skills.map((g) => (
                    <div key={g.name} className="flex flex-wrap items-center gap-x-5 gap-y-2">
                      <span className="w-44 shrink-0 font-mono text-xs uppercase tracking-wider text-faint">
                        {g.name}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {g.skills.map((s) => (
                          <span key={s.name} className="chip !py-1">
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal delay={0.15}>
              <div className="rounded-[20px] border border-line bg-abyss/40 p-7">
                <div className="mb-8 flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-lg border border-line text-accent">
                    <GraduationCap size={16} />
                  </span>
                  <h3 className="font-display text-lg font-semibold">Academic Journey</h3>
                </div>
                <p className="-mt-4 mb-8 text-[13.5px] leading-6 text-dim">
                  My academic path is driven by curiosity and a passion for solving
                  meaningful scientific challenges.
                </p>
                <div className="timeline-list">
                  {timeline.map((t) => (
                    <div key={`${t.period}-${t.title}`} className="tl-item">
                      <span className="tl-dot" />
                      <p className="tl-date">{t.period}</p>
                      <h4 className="tl-role">{t.title}</h4>
                      <p className="text-[12.5px] text-dim">{t.org}</p>
                      <p className="tl-detail">{t.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= KNOWLEDGE HUB ================= */}
      <section className="relative z-10 border-t border-line bg-abyss/30">
        <div className="mx-auto max-w-6xl px-5 py-24">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">06 · knowledge hub</p>
                <h2 className="heading mt-4 text-3xl sm:text-4xl">
                  Learn with me — <span className="text-grad">notes, articles, notebooks</span>
                </h2>
              </div>
              <div className="flex gap-3">
                <Link href="/blog" className="chip !px-4 !py-2">
                  Blog
                </Link>
                <Link href="/notes" className="chip !px-4 !py-2">
                  Study notes
                </Link>
                <Link href="/notes#notebooks" className="chip !px-4 !py-2">
                  Notebooks
                </Link>
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

          {latestNotebook.length > 0 && (
            <Reveal delay={0.15}>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {latestNotebook.map((nb) => (
                  <NotebookMini key={nb.slug} notebook={nb} />
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-24">
        <Reveal>
          <div className="contact-panel">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan/10 blur-3xl" />
            <div className="relative grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-start">
              <div>
                <p className="eyebrow">07 · let&apos;s connect</p>
                <h2 className="heading mt-4 text-3xl sm:text-4xl">
                  Open to <span className="text-grad">collaboration</span> and new ideas.
                </h2>
                <p className="mt-5 max-w-md leading-7 text-dim">
                  I&apos;m always excited to do driven research, collaborate on
                  projects, and explore ways AI can accelerate scientific
                  breakthroughs.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href={site.calendly} target="_blank" rel="noreferrer" className="btn btn-primary">
                    <CalendarClock /> Book a 1:1 call
                  </Link>
                  <a href={`mailto:${site.email}`} className="btn btn-ghost">
                    {site.email}
                  </a>
                </div>
              </div>
              <Stagger className="stagger-children rounded-[20px] border border-line bg-void/40 px-6 py-4">
                {contactRows.map((r) => (
                  <a key={r.label} href={r.href} target={r.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="contact-row group">
                    <div className="flex items-center gap-4">
                      <span className="contact-icon">
                        <r.icon size={16} />
                      </span>
                      <div>
                        <p className="contact-label">{r.label}</p>
                        <p className="contact-value">{r.value}</p>
                      </div>
                    </div>
                    <ArrowUpRight size={17} className="text-faint transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                  </a>
                ))}
                </Stagger>
              </div>
            </div>
        </Reveal>
      </section>
    </>
  );
}