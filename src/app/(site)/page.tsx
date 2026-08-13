import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  AtSign,
  BookOpen,
  CalendarClock,
  Check,
  FlaskConical,
  GitBranch,
  GraduationCap,
  Hexagon,
  Mail,
  Magnet,
  Network,
  ScanLine,
  Sparkles,
  Workflow,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Stagger } from "@/components/ui/stagger";
import { Tilt } from "@/components/three/tilt";
import { CinematicHero } from "@/components/landing/cinematic-hero";
import { TimelineFill } from "@/components/ui/timeline-fill";
import { PostCard } from "@/components/blog/post-card";
import { NotebookMini } from "@/components/notebook/notebook-card";
import { domains, education, experience, profile, projects, skills } from "@/lib/data";
import { listArticles } from "@/lib/mdx";
import { listNotebooks } from "@/lib/notebooks";
import { site } from "@/lib/site";

const focusItems = [
  {
    title: "Drug Discovery",
    desc: "AI for target identification, molecular docking, and de novo drug design.",
    color: "cyan",
    icon: FlaskConical,
  },
  {
    title: "Protein Folding",
    desc: "Structure prediction and representation learning for proteins.",
    color: "violet",
    icon: Sparkles,
  },
  {
    title: "Metabolic Modeling",
    desc: "Genome-scale modeling, flux analysis, and pathway optimization.",
    color: "emerald",
    icon: Workflow,
  },
  {
    title: "Molecular Dynamics",
    desc: "Simulation and enhanced sampling for molecular and material systems.",
    color: "cyan",
    icon: Magnet,
  },
  {
    title: "Materials Science",
    desc: "AI-guided discovery of novel materials and functional molecules.",
    color: "emerald",
    icon: Hexagon,
  },
  {
    title: "Graph Neural Networks",
    desc: "GNNs for molecules, proteins, and complex relational data.",
    color: "amber",
    icon: Network,
  },
  {
    title: "Kalman Filtering",
    desc: "State estimation for noisy, high-dimensional dynamical systems.",
    color: "violet",
    icon: ScanLine,
  },
  {
    title: "AI Agents",
    desc: "Agentic systems for biology, materials, and metabolic engineering.",
    color: "amber",
    icon: AtSign,
  },
];

const featurePoints = [
  "Self-driving pipelines for docking, screening, and validation.",
  "Tool-using LLM agents grounded in molecular simulation.",
  "Uncertainty-aware decision making with dynamical-system priors.",
];

const workSceneImages = [
  "/assets/scenes/drug-capsule.jpg",
  "/assets/scenes/protein-folding.jpg",
  "/assets/scenes/gnn-network.jpg",
  "/assets/scenes/crystal-lattice.jpg",
];

const exploringChips = ["Biophysics", "Biochemistry", "High-dimensional statistics", "Control theory"];

const timeline = [...experience.slice(0, 3), education[0]];

const galleryItems = [
  { src: "/gallery/chromatogram.png", label: "Chromatogram", featured: true },
  { src: "/gallery/dna-helix.png", label: "DNA Helix", featured: false },
  { src: "/gallery/neuralnet.png", label: "Neural Network", featured: false },
  { src: "/gallery/glycolysis.png", label: "Glycolysis & Krebs Cycle", featured: false },
  { src: "/gallery/capsule.png", label: "Capsule", featured: false },
  { src: "/gallery/ai-agent.png", label: "AI Agent", featured: false },
];

const contactCards = [
  {
    label: "GitHub",
    name: "yousofLHC",
    desc: "Check out my code and projects.",
    href: site.socials.github,
    icon: GitBranch,
  },
  {
    label: "Google Scholar",
    name: "Yousof Ghalenoei",
    desc: "Explore my publications and citations.",
    href: site.socials.scholar,
    icon: GraduationCap,
  },
  {
    label: "LinkedIn",
    name: "yousof-ghalenoei",
    desc: "Let's connect professionally.",
    href: site.socials.linkedin,
    icon: AtSign,
  },
  {
    label: "Book a call",
    name: "Calendly · 30 minutes",
    desc: "Reserve a 1:1 slot to discuss research or collaboration.",
    href: site.calendly,
    icon: CalendarClock,
  },
];

const contactRows = [
  { label: "Email", value: site.email, href: `mailto:${site.email}`, icon: Mail },
  { label: "X (Twitter)", value: "@yousofghalenoei", href: site.socials.x, icon: AtSign },
  { label: "ORCID", value: "Research profile", href: site.socials.orcid, icon: BookOpen },
];

export default async function Home() {
  const posts = await listArticles("posts");
  const notebooks = listNotebooks();
  const latestPost = posts.slice(0, 3);
  const latestNotebook = notebooks.slice(0, 2);
  const workProjects = projects.slice(0, 4);

  return (
    <>
      {/* ================= HERO (cinematic reel) ================= */}
      <CinematicHero />

      {/* ================= DOMAIN MARQUEE ================= */}
      <div className="marquee" aria-hidden="true">
        <div className="mq-track animate-marquee" style={{ animationDuration: "38s" }}>
          {[0, 1].map((g) => (
            <div key={g} className="mq-group">
              {domains.map((d) => {
                const Icon = d.icon as typeof FlaskConical;
                return (
                  <span key={g + d.id} className="mq-chip">
                    <Icon size={15} />
                    {d.label}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ================= RESEARCH FOCUS ================= */}
      <section id="research" className="relative z-10 mx-auto max-w-6xl px-5 py-24">
        <div className="focus-layout">
          <div>
            <Reveal>
              <p className="eyebrow">research focus</p>
              <h2 className="heading mt-4 text-3xl sm:text-4xl">
                Where AI Meets the <span className="text-grad">Molecular</span> World.
              </h2>
              <p className="mt-4 max-w-md text-dim">
                I develop data-driven and physics-informed AI methods to model, predict, and design
                complex molecular systems.
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

            <Reveal delay={0.24}>
              <div className="dna-frame relative mt-10 max-w-[340px]">
                <div className="pointer-events-none absolute -inset-[30px] z-0 rounded-3xl bg-[radial-gradient(circle_at_40%_40%,rgba(79,200,232,0.16),transparent_65%)] blur-2xl" />
                <Image
                  src="/assets/scenes/dna-helix.jpg"
                  alt="3D DNA double helix render"
                  width={340}
                  height={190}
                  className="animate-drift relative z-[1] w-full rounded-2xl border border-line"
                />
              </div>
            </Reveal>
          </div>

          <Stagger className="stagger-children focus-grid">
            {focusItems.map((f) => (
              <div key={f.title} className="focus-item" data-c={f.color}>
                <div className="focus-icon">
                  <f.icon size={20} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ================= FEATURE BAND (AI agents) ================= */}
      <section className="relative z-10 border-t border-line bg-abyss/30">
        <div className="orb orb-violet absolute -left-40 top-10 h-[400px] w-[400px]" />
        <div className="mx-auto max-w-6xl px-5 py-24">
          <div className="feature">
            <Reveal>
              <p className="eyebrow">featured direction</p>
              <h2 className="heading mt-4 text-3xl sm:text-4xl">
                Autonomous AI Agents for <span className="text-grad">Biological</span> Discovery.
              </h2>
              <p className="mt-4 max-w-md leading-7 text-dim">
                I design agentic systems that plan, reason, and act across simulation and data
                pipelines — closing the loop between hypothesis generation and experimental
                validation in the life sciences.
              </p>
              <ul className="mt-6">
                {featurePoints.map((pt) => (
                  <li key={pt}>
                    <Check size={16} />
                    {pt}
                  </li>
                ))}
              </ul>
              <Link href="/projects" className="link-arrow">
                Explore agent-driven projects <ArrowRight size={16} />
              </Link>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="feature-visual">
                <div className="glow" />
                <div className="frame">
                  <Image
                    src="/assets/scenes/ai-agent.jpg"
                    alt="3D render of an AI agent surrounded by DNA helices and molecular structures"
                    width={600}
                    height={338}
                    className="w-full"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= SELECTED WORK ================= */}
      <section id="work" className="relative z-10 mx-auto max-w-6xl px-5 py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">publications &amp; projects</p>
              <h2 className="heading mt-4 text-3xl sm:text-4xl">
                Selected <span className="text-grad">Work.</span>
              </h2>
            </div>
            <Link href="/projects" className="link-arrow">
              View all on GitHub <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {workProjects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <Tilt max={6} className="h-full">
                <Link href={`/projects/${p.slug}`} className="work-card group block h-full">
                  <div className="work-thumb">
                    <Image
                      src={workSceneImages[i % workSceneImages.length]}
                      alt={p.title}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="work-body">
                    <h3>{p.title}</h3>
                    <p>{p.subtitle}</p>
                    <div className="tag-row">
                      <span className="work-tag hot">{p.domain.split(" ")[0]}</span>
                      {p.tags.slice(1, 3).map((t) => (
                        <span key={t} className="work-tag">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="work-foot">
                      <span className="work-year">{p.year}</span>
                      <span className="link-arrow">
                        <ArrowUpRight size={15} />
                      </span>
                    </div>
                  </div>
                </Link>
              </Tilt>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-12 text-center">
            <Link href="/projects" className="btn btn-ghost">
              Explore More Projects
            </Link>
          </div>
        </Reveal>
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
                A glimpse into the molecular world — from protein structures to neural network
                topologies and chromatographic data.
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

      {/* ================= JOURNEY + ABOUT ================= */}
      <section id="timeline" className="relative z-10 overflow-hidden">
        <div className="orb orb-amber absolute right-[-120px] top-[20%] h-[360px] w-[360px]" />
        <div className="mx-auto max-w-6xl px-5 py-24">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="tl-left">
              <Reveal>
                <p className="eyebrow">academic journey</p>
                <h2 className="heading mt-4 text-3xl sm:text-4xl">
                  Education &amp; <span className="text-grad">Experience.</span>
                </h2>
                <p className="mt-4 max-w-sm leading-7 text-dim">
                  My academic path is driven by curiosity and a passion for solving meaningful
                  scientific challenges.
                </p>
              </Reveal>

              <Reveal delay={0.12}>
                <div className="mt-8 space-y-5">
                  {profile.bio.slice(0, 2).map((p, i) => (
                    <p key={i} className="leading-7 text-ink/80">
                      {p}
                    </p>
                  ))}
                  <p className="rounded-xl border border-cyan/25 bg-cyan/5 px-4 py-3 font-mono text-sm leading-6 text-cyan/90">
                    → {profile.focus}
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <TimelineFill>
                {timeline.map((t) => (
                  <div key={`${t.period}-${t.title}`} className="tl-item">
                    <div className="tl-node" />
                    <span className="tl-date">{t.period}</span>
                    <h3>{t.title}</h3>
                    <p className="tl-org">{t.org}</p>
                    <p className="tl-detail">{t.detail}</p>
                  </div>
                ))}
              </TimelineFill>
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
                <p className="eyebrow">knowledge hub</p>
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

      {/* ================= TECH STACK ================= */}
      <section id="stack" className="relative z-10 mx-auto max-w-6xl px-5 py-24">
        <div className="focus-layout">
          <Reveal>
            <p className="eyebrow">tech stack</p>
            <h2 className="heading mt-4 text-3xl sm:text-4xl">
              Tools of the <span className="text-grad">Trade.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="stack-rows">
              {skills.map((g) => (
                <div key={g.name}>
                  <div className="stack-cat">{g.name}</div>
                  <div className="stack-row">
                    {g.skills.map((s) => (
                      <span key={s.name} className="chip">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="relative z-10 overflow-hidden border-t border-line bg-abyss/30">
        <div className="orb orb-cyan absolute -left-40 bottom-[-160px] h-[460px] w-[460px]" />
        <div className="mx-auto max-w-6xl px-5 py-24">
          <Reveal>
            <div className="contact-head">
              <p className="eyebrow">let&apos;s connect</p>
              <h2 className="heading mt-4 max-w-xl text-3xl sm:text-5xl">
                Open to <span className="text-grad">collaboration</span> and new ideas.
              </h2>
              <p className="mt-5 max-w-lg leading-7 text-dim">
                I&apos;m always excited to discuss research ideas, collaborate on projects, and
                explore ways AI can accelerate scientific breakthroughs.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-10">
              <div className="contact-grid">
                {contactCards.map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    className="contact-card group"
                  >
                    <div className="c-icon">
                      <c.icon size={20} />
                    </div>
                    <div className="label">{c.label}</div>
                    <div className="name">{c.name}</div>
                    <div className="desc">{c.desc}</div>
                    <span className="link-arrow">
                      View Profile <ArrowUpRight size={15} />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="email-row">
              <div className="l">
                <Mail size={18} />
                {site.email}
              </div>
              <a href={`mailto:${site.email}`} className="link-arrow">
                Write me <ArrowRight size={15} />
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {contactRows.map((r) => (
                <a
                  key={r.label}
                  href={r.href}
                  target={r.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-[12px] text-dim transition-colors hover:text-cyan"
                >
                  <r.icon size={13} />
                  {r.label} · {r.value}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
