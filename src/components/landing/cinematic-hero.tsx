"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarClock, ChevronDown, Pause, Play } from "lucide-react";
import { TypedText } from "@/components/landing/typed-text";
import { profile, stats } from "@/lib/data";
import { site } from "@/lib/site";

const FALLBACK_TITLES = [
  "Molecules & Medicine",
  "Decoding the Helix",
  "Silicon & Signal",
  "Discovery at Scale",
  "Patterns of Life",
  "Structure & Form",
];

const TAG_KEYWORDS: Array<[RegExp, string]> = [
  [/dna|genom|helix|bio|cell|molecul|protein/i, "BIOINFORMATICS"],
  [/ai|chip|circuit|silicon|neural|robot|agent/i, "ARTIFICIAL INTELLIGENCE"],
  [/data|cloud|network|graph|compute|deepmind/i, "DATA & SYSTEMS"],
  [/discover|research|lab|science/i, "RESEARCH"],
  [/pharma|drug|medicine|pill/i, "PHARMACOLOGY"],
  [/math|structure|lattice|crystal|geometry|shuper/i, "MATHEMATICS"],
  [/flyd|liquid|ink|fluid/i, "FLUID DYNAMICS"],
];

function humanize(file: string): string {
  const name = file.replace(/\.[^.]+$/, "").replace(/-unsplash$/i, "");
  const parts = name
    .split(/[-_]/)
    .filter((p) => p && !/^[a-z0-9]{6,}$/i.test(p))
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());
  return parts.join(" ");
}

function guessTag(file: string): string {
  for (const [re, tag] of TAG_KEYWORDS) if (re.test(file)) return tag;
  return "RESEARCH";
}

export type HeroSlide = {
  src: string;
  tag: string;
  title: string;
};

export function buildHeroSlides(images: string[]): HeroSlide[] {
  return images.map((src, i) => {
    const file = src.split("/").pop() ?? src;
    const human = humanize(file);
    return {
      src,
      tag: guessTag(file),
      title: human || FALLBACK_TITLES[i % FALLBACK_TITLES.length],
    };
  });
}

const DUR = 7000;

const typedRoles = [
  "Machine learning & deep learning",
  "LLM & agentic AI systems",
  "Bioinformatics & molecular simulation",
  "Information theory",
  "Distributed & federated learning",
  "Optimization & message passing",
  "Mathematics educator",
  "Python · R · C++ developer",
];

function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function readReduced() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function CinematicHero({ images }: { images: string[] }) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const reducedMotion = useSyncExternalStore(subscribeReduced, readReduced, () => false);

  const slides = buildHeroSlides(images);
  const safeIdx = Math.min(idx, Math.max(0, slides.length - 1));
  const current = slides[safeIdx];

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const meshRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const segFillRefs = useRef<Array<HTMLElement | null>>([]);
  const goToRef = useRef<(i: number) => void>(() => {});
  const playingRef = useRef(true);
  const reducedRef = useRef(false);
  const slidesLenRef = useRef(slides.length);
  useEffect(() => {
    slidesLenRef.current = slides.length;
  }, [slides.length]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reducedRef.current = reduced;
    playingRef.current = !reduced;

    let idxNow = 0;
    let acc = 0;
    let heroVisible = true;
    let last = performance.now();
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let gx = window.innerWidth / 2;
    let gy = window.innerHeight / 3;

    const paintSegments = () => {
      const n = slidesLenRef.current;
      for (let k = 0; k < n; k++) {
        const el = segFillRefs.current[k];
        if (!el) continue;
        el.style.width = k < idxNow ? "100%" : k > idxNow ? "0%" : `${Math.min(1, acc / DUR) * 100}%`;
      }
    };

    const goTo = (i: number) => {
      const n = slidesLenRef.current;
      if (!n) return;
      idxNow = ((i % n) + n) % n;
      acc = 0;
      setIdx(idxNow);
      paintSegments();
    };
    goToRef.current = goTo;

    const onMouseMove = (e: MouseEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    };

    let alive = true;
    let raf = 0;
    const loop = (now: number) => {
      if (!alive) return;
      raf = requestAnimationFrame(loop);
      const dt = Math.min(50, now - last);
      last = now;

      if (playingRef.current && heroVisible && !document.hidden && !reducedRef.current) {
        acc += dt;
        if (acc >= DUR) goTo(idxNow + 1);
      }
      paintSegments();

      if (!reducedRef.current) {
        cx += (tx - cx) * 0.06;
        cy += (ty - cy) * 0.06;
        if (stageRef.current) {
          stageRef.current.style.transform = `rotateY(${cx * 1.6}deg) rotateX(${-cy * 1.6}deg)`;
        }
        if (meshRef.current) {
          meshRef.current.style.transform = `translate3d(${cx * -14}px,${cy * -10}px,0)`;
        }
        gx += (tx * window.innerWidth + window.innerWidth / 2 - gx) * 0.12;
        gy += (ty * window.innerHeight + window.innerHeight / 3 - gy) * 0.12;
        if (cursorRef.current) {
          cursorRef.current.style.left = `${gx}px`;
          cursorRef.current.style.top = `${gy}px`;
        }
      } else {
        acc = DUR * (slidesLenRef.current ? 1 : 0); // static full segment
      }
    };

    const io = new IntersectionObserver(
      ([e]) => {
        heroVisible = e.isIntersecting;
      },
      { threshold: 0 }
    );
    if (sectionRef.current) io.observe(sectionRef.current);

    if (!reduced) window.addEventListener("mousemove", onMouseMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  useEffect(() => {
    playingRef.current = playing && !reducedMotion;
  }, [playing, reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="hero-x relative flex min-h-[100svh] items-center overflow-hidden border-b border-line"
    >
      {/* ambient layers */}
      <div ref={meshRef} className="hx-mesh" aria-hidden="true" />
      <div className="hx-grid" aria-hidden="true" />
      <div className="hx-vignette" aria-hidden="true" />
      {!reducedMotion && <div className="hx-scan" aria-hidden="true" />}
      <div className="hx-bracket hx-bracket--tl" aria-hidden="true">
        <svg viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M1 12V1h11" />
        </svg>
      </div>
      <div className="hx-bracket hx-bracket--br" aria-hidden="true">
        <svg viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M1 12V1h11" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-20 px-5 pb-32 pt-32 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pb-24 lg:pt-36">
        {/* ---------------- left ---------------- */}
        <div>
          <p className="hero-eyebrow">
            <span className="he-dot" aria-hidden="true" />
            {site.availability}
          </p>

          <h1 className="hero-title mt-8">
            <span className="ht-line">
              <span className="ht-inner">
                <em className="accent-em">Mathematics</em> and intelligence
              </span>
            </span>
            <span className="ht-line">
              <span className="ht-inner">
                for{" "}
                <span className="ht-teal">complex systems</span> —
              </span>
            </span>
            <span className="ht-line">
              <span className="ht-inner">
                from <em className="violet-em">molecules</em> to machines.
              </span>
            </span>
          </h1>

          <p className="hx-mono mt-7 font-mono text-sm sm:text-base">
            Building as <b>{profile.name}</b> — <span className="text-cyan">&gt; </span>
            <TypedText phrases={typedRoles} className="text-cyan" />
          </p>

          <p className="hx-lede mt-5 max-w-xl text-[17px] leading-[1.72]">
            I hold an M.Sc. in Computer Engineering (AI &amp; Robotics) from Ferdowsi
            University of Mashhad — building{" "}
            <span className="hl">mathematically-grounded ML systems</span> spanning{" "}
            <span className="hl">molecular &amp; biological modeling</span>, materials,
            and <span className="hl">distributed intelligence</span>.
          </p>

          <div className="mt-9 flex flex-wrap gap-3.5">
            <Link href="/resume" className="btn-hx-solid">
              Download CV <ArrowUpRight size={16} />
            </Link>
            <Link href="/connect" className="btn-hx-ghost">
              <CalendarClock size={15} /> Book a call
            </Link>
            <a href="#research" className="btn-hx-ghost">
              View Research <ChevronDown size={15} />
            </a>
          </div>

          <div className="hx-stats mt-12">
            {stats.map((s) => (
              <div key={s.label} className="hx-stat">
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- right : Editorial Frame ---------------- */}
        <div ref={stageRef} className="hx-stage">
          <div className="hx-orb hx-orb--1" aria-hidden="true" />
          <div className="hx-orb hx-orb--2" aria-hidden="true" />
          <div className="hx-orb hx-orb--3" aria-hidden="true" />

          <div className="frame-wrap">
            <div className="frame">
              <div className="frame-window">
                {slides.map((s, i) => (
                  <div
                    key={s.src}
                    className={`frame-img ${i === safeIdx ? "is-active" : ""}`}
                    aria-hidden={i !== safeIdx}
                  >
                    <div className="frame-zoom">
                      <Image
                        src={s.src}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 86vw, 34vw"
                        priority={i === 0}
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {current && (
                <div className="frame-meta">
                  <span className="frame-index">
                    <b>{String(safeIdx + 1).padStart(2, "0")}</b>/
                    {String(slides.length).padStart(2, "0")}
                  </span>
                  <b>
                    {current.tag} — {current.title}
                  </b>
                  <div
                    className="frame-progress"
                    role="tablist"
                    aria-label="Hero scenes"
                  >
                    {slides.map((s, i) => (
                      <button
                        key={s.src}
                        type="button"
                        role="tab"
                        aria-selected={i === safeIdx}
                        aria-label={`Scene ${i + 1}: ${s.title}`}
                        className={`frame-seg ${i === safeIdx ? "on" : ""}`}
                        onClick={() => goToRef.current(i)}
                      >
                        <i
                          ref={(el) => {
                            segFillRefs.current[i] = el;
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {slides.length > 1 && !reducedMotion && (
                <button
                  type="button"
                  className="frame-toggle"
                  aria-label={playing ? "Pause slideshow" : "Play slideshow"}
                  onClick={() => setPlaying((v) => !v)}
                >
                  {playing ? <Pause size={13} /> : <Play size={13} />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="hx-scrollhint" aria-hidden="true">
        <span>SCROLL</span>
        <div className="hx-scrollline" />
      </div>
      {!reducedMotion && <div ref={cursorRef} className="hx-cursor-glow" aria-hidden="true" />}
    </section>
  );
}
