import Link from "next/link";
import Image from "next/image";
import ReactDOM from "react-dom";
import {
  ArrowRight,
  ArrowUpRight,
  AtSign,
  BookOpen,
  Check,
  GraduationCap,
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
import { GithubLive } from "@/components/ui/github-live";
import { PostCard } from "@/components/blog/post-card";
import { NotebookMini } from "@/components/notebook/notebook-card";
import { education, experience, profile, projects } from "@/lib/data";
import { listArticles } from "@/lib/mdx";
import { listNotebooks } from "@/lib/notebooks";
import { site } from "@/lib/site";
import { MouseGlow } from "@/components/site/mouse-glow";
import fs from "node:fs";
import path from "node:path";

const HERO_DIR = path.join(process.cwd(), "public/assets/scenes/UseThisHeros");
function getHeroImages(): string[] {
  try {
    return fs
      .readdirSync(HERO_DIR)
      .filter((f) => /\.(jpe?g|png|webp|avif|gif)$/i.test(f))
      .sort()
      .map((f) => `/assets/scenes/UseThisHeros/${f}`);
  } catch {
    return [];
  }
}

const focusItems = [
  {
    title: "Machine Learning",
    desc: "Neural networks, statistical learning, and predictive modeling with Python and R.",
    color: "cyan",
    icon: Sparkles,
  },
  {
    title: "Optimization",
    desc: "Genetic algorithms, proximal methods, and convex and nonconvex optimization.",
    color: "emerald",
    icon: Magnet,
  },
  {
    title: "Message Passing",
    desc: "Belief propagation and probabilistic inference on graphical models.",
    color: "violet",
    icon: Network,
  },
  {
    title: "Anomaly Detection",
    desc: "Compression-based and statistical methods for detecting unusual patterns.",
    color: "amber",
    icon: ScanLine,
  },
  {
    title: "Big Data & Distributed Systems",
    desc: "Large-scale data processing and distributed computing.",
    color: "cyan",
    icon: Workflow,
  },
  {
    title: "Mathematics & Statistics",
    desc: "Linear algebra, probability, and statistics as foundations.",
    color: "violet",
    icon: GraduationCap,
  },
  {
    title: "Reinforcement Learning",
    desc: "Learning through interaction, from bandits to deep RL.",
    color: "emerald",
    icon: AtSign,
  },
  {
    title: "Teaching & Education",
    desc: "Mathematics teaching, tutoring, and educational content.",
    color: "amber",
    icon: BookOpen,
  },
];

const featurePoints = [
  "Python and R pipelines for machine learning, statistics, and data analysis.",
  "Genetic algorithms and proximal methods for hard optimization problems.",
  "Message-passing and compression-based methods for inference and anomaly detection.",
];

const workSceneImages = [
  "/assets/scenes/dna-helix.jpg",
  "/assets/scenes/ai-agent.jpg",
  "/assets/scenes/pexels-googledeepmind-17483874.webp",
  "/assets/scenes/crystal-lattice.jpg",
];

const exploringChips = [
  "Reinforcement learning",
  "Big data processing",
  "Distributed systems",
  "Paper writing",
  "LaTeX typesetting",
];

const timeline = [...experience.slice(0, 3), education[0]];

const contactCards = [
  {
    label: "GitHub",
    name: "Yousof_LHC",
    desc: "Explore my code and experiments.",
    href: site.socials.github,
    icon: AtSign,
  },
  {
    label: "Email",
    name: site.email,
    desc: "Write to me directly — I usually reply within a few days.",
    href: `mailto:${site.email}`,
    icon: Mail,
  },
  {
    label: "Notes & Notebooks",
    name: "Knowledge hub",
    desc: "My study notes on machine learning, mathematics, and programming.",
    href: "/notes",
    icon: BookOpen,
  },
];

const contactRows = [
  { label: "Email", value: site.email, href: `mailto:${site.email}`, icon: Mail },
  { label: "GitHub", value: "Yousof_LHC", href: site.socials.github, icon: AtSign },
];

export default async function Home() {
  const posts = await listArticles("posts");
  const notebooks = listNotebooks();
  const latestPost = posts.slice(0, 3);
  const latestNotebook = notebooks.slice(0, 2);
  const workProjects = projects.slice(0, 4);
  const heroImages = getHeroImages();
  // Preload the first hero slide — it is the LCP element.
  if (heroImages[0]) ReactDOM.preload(heroImages[0], { as: "image" });

  return (
    <>
      <MouseGlow />

      {/* ================= HERO ================= */}
      <CinematicHero images={heroImages} />

      {/* ================= FAST LOOK (profile strip) ================= */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 pt-24">
        <div className="focus-layout">
          <Reveal>
            <p className="eyebrow">about me</p>
            <h2 className="heading mt-4 text-3xl sm:text-4xl">
              M.Sc. Computer Engineering · <span className="text-grad">AI &amp; Robotics</span>
            </h2>
            <p className="mt-4 max-w-md leading-7 text-dim">{profile.bio[1]}</p>
            <p className="mt-5 max-w-md rounded-xl border border-cyan/25 bg-cyan/5 px-4 py-3 font-mono text-sm leading-6 text-cyan/90">
              → {profile.focus}
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="space-y-4">
              {education.map((e) => (
                <div key={e.period} className="glass rounded-xl border border-line p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="heading text-lg">{e.title}</h3>
                    <span className="tl-date">{e.period}</span>
                  </div>
                  <p className="tl-org">{e.org}</p>
                </div>
              ))}
              <a href={`mailto:${site.email}`} className="contact-card group">
                <div className="c-icon">
                  <Mail size={20} />
                </div>
                <div className="label">Email</div>
                <div className="name">{site.email}</div>
                <div className="desc">{site.availability}</div>
                <span className="link-arrow">
                  Write me <ArrowUpRight size={15} />
                </span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= RESEARCH FOCUS ================= */}
      <section id="research" className="cv-section relative z-10 mx-auto max-w-6xl px-5 py-24">
        <div className="focus-layout">
          <div>
            <Reveal>
              <p className="eyebrow">research focus</p>
              <h2 className="heading mt-4 text-3xl sm:text-4xl">
                Where AI meets the <em className="accent-em">mathematical</em> world.
              </h2>
              <p className="mt-4 max-w-md text-dim">
                I develop rigorous, data-driven machine-learning methods grounded in
                mathematics, statistics, and optimization.
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
              <div key={f.title} className="focus-item" data-c={f.color} data-glow="">
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

      {/* ================= TIMELINE (experience + education) ================= */}
      <section id="timeline" className="cv-section relative z-10 overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 pt-24">
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

      {/* ================= FEATURE BAND (AI agents) ================= */}
      <section className="cv-section relative z-10 border-t border-line bg-abyss/30">
        <div className="orb orb-violet absolute -left-40 top-10 h-[400px] w-[400px]" />
        <div className="mx-auto max-w-6xl px-5 py-24">
          <div className="feature">
            <Reveal>
              <p className="eyebrow">featured direction</p>
              <h2 className="heading mt-4 text-3xl sm:text-4xl">
                From Mathematics to <span className="text-grad">Intelligent</span> Systems.
              </h2>
              <p className="mt-4 max-w-md leading-7 text-dim">
                I build on a strong foundation in mathematics, statistics, and optimization
                to design machine-learning systems that are rigorous, explainable, and
                practical — from evolutionary search to message-passing inference.
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
                Explore my projects <ArrowRight size={16} />
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
      <section id="work" className="cv-section relative z-10 mx-auto max-w-6xl px-5 py-24">
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

      {/* ================= KNOWLEDGE HUB ================= */}
      <section className="cv-section relative z-10 border-t border-line bg-abyss/30">
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

      {/* ================= CONTACT ================= */}
      <section id="contact" className="cv-section relative z-10 overflow-hidden border-t border-line bg-abyss/30">
        <div className="orb orb-cyan absolute -left-40 bottom-[-160px] h-[460px] w-[460px]" />
        <div className="mx-auto max-w-6xl px-5 py-24">
          <Reveal>
            <div className="contact-head">
              <p className="eyebrow">let&apos;s connect</p>
              <h2 className="heading mt-4 max-w-xl text-3xl sm:text-5xl">
                Open to <span className="text-grad">collaboration</span> and new ideas.
              </h2>
              <p className="mt-5 max-w-lg leading-7 text-dim">
                I&apos;m always happy to discuss research ideas, collaborate on data and
                optimization projects, and explore ways machine learning can solve real
                problems.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-10">
              <div className="contact-grid">
                <GithubLive />
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
