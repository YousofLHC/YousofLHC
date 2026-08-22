"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarClock, Pause, Play } from "lucide-react";
import { TypedText } from "@/components/landing/typed-text";
import { profile, stats } from "@/lib/data";
import { site } from "@/lib/site";

const SLIDES = [
  {
    src: "/assets/scenes/hero-wide.jpg",
    tag: "MACHINE LEARNING",
    title: "Learning from Data",
    kb: { s0: 1.06, s1: 1.17, x: -1.8, y: -1.2 },
  },
  {
    src: "/assets/scenes/protein-folding.jpg",
    tag: "OPTIMIZATION",
    title: "Evolutionary Search",
    kb: { s0: 1.16, s1: 1.06, x: 1.6, y: 1.1 },
  },
  {
    src: "/assets/scenes/dna-helix.jpg",
    tag: "STATISTICS",
    title: "Patterns in Data",
    kb: { s0: 1.06, s1: 1.18, x: 2.0, y: -1.4 },
  },
  {
    src: "/assets/scenes/gnn-network.jpg",
    tag: "MESSAGE PASSING",
    title: "Distributed Computation",
    kb: { s0: 1.16, s1: 1.06, x: -1.6, y: 1.2 },
  },
  {
    src: "/assets/scenes/crystal-lattice.jpg",
    tag: "MATHEMATICS",
    title: "Structures & Symmetry",
    kb: { s0: 1.06, s1: 1.17, x: -2.0, y: 1.0 },
  },
  {
    src: "/assets/scenes/drug-capsule.jpg",
    tag: "BIG DATA",
    title: "Processing at Scale",
    kb: { s0: 1.15, s1: 1.05, x: 1.8, y: -1.2 },
  },
];

const DUR = 7000;

const typedRoles = [
  "M.Sc. in Computer Engineering",
  "Artificial Intelligence & Robotics",
  "Machine learning practitioner",
  "Optimization & algorithm designer",
  "Message-passing explorer",
  "Compression-based anomaly detection",
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

export function CinematicHero() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const reducedMotion = useSyncExternalStore(subscribeReduced, readReduced, () => false);

  const sectionRef = useRef<HTMLElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const goToRef = useRef<(i: number) => void>(() => {});
  const playingRef = useRef(true);
  const reducedRef = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    reducedRef.current = reduced;
    playingRef.current = !reduced;

    const slideEls = slideRefs.current;
    let idxNow = 0;
    let acc = 0;
    let heroVisible = true;
    let last = performance.now();
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const goTo = (i: number) => {
      idxNow = (i + SLIDES.length) % SLIDES.length;
      acc = 0;
      setIdx(idxNow);
    };
    goToRef.current = goTo;

    const onMouseMove = (e: MouseEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    };

    let alive = true;
    const loop = (now: number) => {
      if (!alive) return;
      raf = requestAnimationFrame(loop);
      const dt = Math.min(50, now - last);
      last = now;
      if (playingRef.current && heroVisible && !document.hidden) {
        acc += dt;
        if (acc >= DUR) goTo(idxNow + 1);
      }
      const p = Math.min(1, acc / DUR);
      if (fillRef.current) fillRef.current.style.width = `${p * 100}%`;

      if (!reducedRef.current) {
        const k = SLIDES[idxNow].kb;
        const s = k.s0 + (k.s1 - k.s0) * p;
        const im = slideEls[idxNow]?.querySelector("img");
        if (im) {
          im.style.transform = `translate3d(${k.x * p}%,${k.y * p}%,0) scale(${s})`;
        }
        cx += (tx - cx) * 0.06;
        cy += (ty - cy) * 0.06;
        if (reelRef.current) {
          reelRef.current.style.transform = `translate3d(${cx * 18}px,${cy * 12}px,0)`;
        }
        if (contentRef.current) {
          contentRef.current.style.transform = `translate3d(${cx * -10}px,${cy * -7}px,0)`;
        }
      }
    };

    const io = new IntersectionObserver(
      ([e]) => {
        heroVisible = e.isIntersecting;
      },
      { threshold: 0 }
    );
    if (sectionRef.current) io.observe(sectionRef.current);

    if (!reducedRef.current) window.addEventListener("mousemove", onMouseMove, { passive: true });
    let raf = 0;
    const start = () => {
      raf = requestAnimationFrame(loop);
    };
    start();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  /* ambient 2D particles over the footage */
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    let w: number;
    let h: number;
    let raf = 0;
    let visible = true;
    let alive = true;
    let pts: Array<{ x: number; y: number; vx: number; vy: number; r: number; amber: boolean }> = [];

    const resize = () => {
      w = cv.width = cv.offsetWidth;
      h = cv.height = cv.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    pts = Array.from({ length: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 55 }, () => ({
      x: Math.random() * (w || window.innerWidth),
      y: Math.random() * (h || window.innerHeight),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.8 + 0.6,
      amber: Math.random() > 0.85,
    }));

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!alive || !visible || document.hidden) return;
      ctx.clearRect(0, 0, w, h);
      for (const pt of pts) {
        pt.x += pt.vx;
        pt.y += pt.vy;
        if (pt.x < 0 || pt.x > w) pt.vx *= -1;
        if (pt.y < 0 || pt.y > h) pt.vy *= -1;
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = pt.amber ? "#E8934A" : "#4FC8E8";
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i];
          const b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 115) {
            ctx.strokeStyle = `rgba(79,200,232,${(1 - d / 115) * 0.15})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
    };

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(cv);
    draw();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="hero-cine relative flex min-h-screen items-center overflow-hidden border-b border-line"
    >
      <div ref={reelRef} className="reel" aria-hidden="true">
        {SLIDES.map((s, i) => (
          <div
            key={s.src}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className={`slide ${i === idx ? "active" : ""}`}
          >
            <Image src={s.src} alt="" fill sizes="100vw" priority={i === 0} />
          </div>
        ))}
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-vignette" aria-hidden="true" />
      <div className="leak" aria-hidden="true" />
      <canvas ref={canvasRef} className="hero-particles" aria-hidden="true" />
      <div className="hero-grain" aria-hidden="true" />

      <div ref={contentRef} className="hero-cine-content">
        <div className="mx-auto max-w-6xl px-5">
          <div className="max-w-2xl">
            <p className="eyebrow">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-soft rounded-full bg-emerald opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald" />
              </span>
              {site.availability}
            </p>

            <h1 className="mt-6 font-display text-[42px] font-semibold leading-[1.03] tracking-tight sm:text-6xl lg:text-[72px]">
              Mathematics, data, and
              <br />
              intelligence for <span className="accent">impact.</span>
            </h1>

            <p className="cine-mono mt-6 font-mono text-base sm:text-lg">
              Building as <b>{profile.name}</b> — <span className="text-cyan">&gt; </span>
              <TypedText phrases={typedRoles} className="text-cyan" />
            </p>

            <p className="cine-lead mt-5 max-w-xl text-lg leading-8">
              I hold an M.Sc. in Computer Engineering (Artificial Intelligence &
              Robotics) from Ferdowsi University of Mashhad — combining machine
              learning, optimization, and message passing with a strong foundation in
              mathematics.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/resume" className="btn btn-cine-primary">
                Download CV <ArrowUpRight />
              </Link>
              <Link href="/connect" className="btn btn-cine-secondary">
                <CalendarClock /> Book a call
              </Link>
            </div>

            <div className="hero-cine-stats mt-12 grid max-w-2xl grid-cols-4 gap-6 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <b>{s.value}</b>
                  <span className="mt-1 block">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hero-dock">
        <button
          className="dock-play"
          aria-label={playing && !reducedMotion ? "Pause background reel" : "Play background reel"}
          onClick={() => setPlaying((v) => !v)}
        >
          {playing && !reducedMotion ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <div className="dock-index">
          <b>{String(idx + 1).padStart(2, "0")}</b> / {String(SLIDES.length).padStart(2, "0")}
        </div>
        <div className="dock-bar">
          <span ref={fillRef} />
        </div>
        <div className="dock-ticks" role="tablist" aria-label="Hero scenes">
          {SLIDES.map((s, i) => (
            <button
              key={s.src}
              className={`tick ${i === idx ? "active" : ""}`}
              aria-label={`Scene ${i + 1}: ${s.title}`}
              onClick={() => goToRef.current(i)}
            />
          ))}
        </div>
        <div className="dock-cap cap-in" key={idx}>
          <span className="tag">{SLIDES[idx].tag}</span>
          <span className="title">{SLIDES[idx].title}</span>
        </div>
      </div>
    </section>
  );
}
