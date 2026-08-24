"use client";

/**
 * Shared zero-dependency toolkit for simulation widgets.
 * Pure SVG/canvas + React state — no chart libraries, theme-aware,
 * and cheap enough to run several instances per page.
 */
import { useEffect, useRef, useState } from "react";;

/* ------------------------------ theming ------------------------------ */

export function useTheme(): "dark" | "light" {
  const [t, setT] = useState<"dark" | "light">(() =>
    typeof document === "undefined" || document.documentElement.dataset.theme !== "light"
      ? "dark"
      : "light"
  );
  useEffect(() => {
    const el = document.documentElement;
    const obs = new MutationObserver(() =>
      setT(el.dataset.theme === "light" ? "light" : "dark")
    );
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return t;
}

export interface Palette {
  ink: string;
  dim: string;
  faint: string;
  grid: string;
  cyan: string;
  violet: string;
  accent: string;
  emerald: string;
}

export function usePalette(): Palette {
  const t = useTheme();
  return t === "dark"
    ? { ink: "#edeff5", dim: "#9aa3be", faint: "#5c6480", grid: "rgba(255,255,255,.07)",
        cyan: "#4fc8e8", violet: "#9c8ce0", accent: "#ff5a45", emerald: "#4fbe96" }
    : { ink: "#111624", dim: "#46506a", faint: "#8a91a8", grid: "rgba(15,23,42,.08)",
        cyan: "#0b72a0", violet: "#5646c2", accent: "#e63700", emerald: "#0d7f60" };
}

/* ------------------------------ controls ------------------------------ */

export function Slider({
  label, value, min, max, step = 1, onChange, fmt,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  fmt?: (v: number) => string;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline justify-between font-mono text-[10.5px] uppercase tracking-wider text-faint">
        {label}
        <b className="text-[11px] normal-case text-dim">{fmt ? fmt(value) : value}</b>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-cyan"
      />
    </label>
  );
}

export function Readout({ items }: { items: Array<[string, string | number]> }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px]">
      {items.map(([k, v]) => (
        <span key={k}>
          <span className="text-faint">{k}: </span>
          <span className="text-dim">{v}</span>
        </span>
      ))}
    </div>
  );
}

/* ------------------------------ rAF loop ------------------------------ */

/** Stable requestAnimationFrame loop with pause + reduced-motion respect. */
export function useAnim(draw: (t: number, dt: number) => void, running = true) {
  const ref = useRef(draw);
  ref.current = draw;
  useEffect(() => {
    if (!running) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let last = performance.now();
    let t = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(50, now - last);
      last = now;
      t += dt;
      ref.current(t / 1000, dt / 1000);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);
}

/* ------------------------------ sim canvas ------------------------------ */

/**
 * Fixed-height canvas wired to an animation loop.
 * `draw(ctx, w, h, tSec, dtSec)` is called every frame while running.
 * Respects prefers-reduced-motion by drawing a single static frame.
 */
export function useSimCanvas(
  height: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, dt: number) => void,
  running = true
): React.RefObject<HTMLCanvasElement | null> {
  const ref = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const parent = cv.parentElement!;
    let w = 0;
    const h = height;

    const fit = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = parent.clientWidth;
      cv.width = Math.max(1, Math.floor(w * dpr));
      cv.height = Math.max(1, Math.floor(h * dpr));
      cv.style.width = `${w}px`;
      cv.style.height = `${h}px`;
    };
    fit();
    window.addEventListener("resize", fit);

    const ctx = cv.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    let t = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(50, now - last) / 1000;
      last = now;
      if (!reduced && running && !document.hidden) t += dt;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      drawRef.current(ctx, w, h, t, running && !reduced ? dt : 0);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
    };
  }, [height, running]);

  return ref;
}

/* ------------------------------ SVG plot ------------------------------ */

export interface Series {
  points: Array<[number, number]>;
  color?: string;
  width?: number;
  dash?: string;
  dots?: boolean;
  fill?: boolean;
}

export function Plot({
  xDomain, yDomain, series, height = 240, xLabel, yLabel, markers, bands,
}: {
  xDomain: [number, number];
  yDomain: [number, number];
  series: Series[];
  height?: number;
  xLabel?: string;
  yLabel?: string;
  markers?: Array<{ x: number; y: number; color?: string; r?: number }>;
  bands?: Array<{ x0: number; x1: number; color: string; opacity?: number }>;
}) {
  const pal = usePalette();
  const W = 520;
  const H = height;
  const pad = { l: 44, r: 12, t: 10, b: 30 };
  const [x0, x1] = xDomain;
  const [y0, y1] = yDomain;
  const sx = (x: number) => pad.l + ((x - x0) / (x1 - x0)) * (W - pad.l - pad.r);
  const sy = (y: number) => H - pad.b - ((y - y0) / (y1 - y0)) * (H - pad.t - pad.b);

  const ticksX = niceTicks(x0, x1, 5);
  const ticksY = niceTicks(y0, y1, 4);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img">
      {/* bands */}
      {(bands ?? []).map((b, i) => (
        <rect key={i} x={sx(b.x0)} y={pad.t} width={Math.max(0, sx(b.x1) - sx(b.x0))}
          height={H - pad.t - pad.b} fill={b.color} opacity={b.opacity ?? 0.12} />
      ))}
      {/* grid */}
      {ticksY.map((v) => (
        <g key={`gy${v}`}>
          <line x1={pad.l} x2={W - pad.r} y1={sy(v)} y2={sy(v)} stroke={pal.grid} />
          <text x={pad.l - 6} y={sy(v) + 3} textAnchor="end" fontSize="9" fill={pal.faint}>{fmtTick(v)}</text>
        </g>
      ))}
      {ticksX.map((v) => (
        <g key={`gx${v}`}>
          <line x1={sx(v)} x2={sx(v)} y1={pad.t} y2={H - pad.b} stroke={pal.grid} />
          <text x={sx(v)} y={H - pad.b + 13} textAnchor="middle" fontSize="9" fill={pal.faint}>{fmtTick(v)}</text>
        </g>
      ))}
      <line x1={pad.l} x2={W - pad.r} y1={H - pad.b} y2={H - pad.b} stroke={pal.dim} />
      <line x1={pad.l} x2={pad.l} y1={pad.t} y2={H - pad.b} stroke={pal.dim} />
      {xLabel && <text x={(W + pad.l) / 2} y={H - 2} textAnchor="middle" fontSize="10" fill={pal.dim}>{xLabel}</text>}
      {yLabel && <text x={10} y={pad.t + 8} fontSize="10" fill={pal.dim}>{yLabel}</text>}

      {series.map((s, i) => (
        <g key={i}>
          {s.fill && s.points.length > 1 && (
            <path d={
              `M ${sx(s.points[0][0])},${sy(0)} ` +
              s.points.map(p => `L ${sx(p[0])},${sy(clampY(p[1], y0, y1))}`).join(" ") +
              ` L ${sx(s.points[s.points.length - 1][0])},${sy(0)} Z`
            } fill={s.color ?? pal.cyan} opacity={0.15} stroke="none" />
          )}
          <path d={s.points.map((p, j) => `${j ? "L" : "M"} ${sx(p[0])},${sy(clampY(p[1], y0, y1))}`).join(" ")}
            fill="none" stroke={s.color ?? pal.cyan} strokeWidth={s.width ?? 1.6}
            strokeDasharray={s.dash} strokeLinecap="round" />
          {s.dots && s.points.map((p, j) => (
            <circle key={j} cx={sx(p[0])} cy={sy(clampY(p[1], y0, y1))} r={2} fill={s.color ?? pal.cyan} />
          ))}
        </g>
      ))}

      {(markers ?? []).map((m, i) => (
        <circle key={i} cx={sx(m.x)} cy={sy(m.y)} r={m.r ?? 4} fill={m.color ?? pal.accent} stroke={pal.ink} strokeWidth={1} />
      ))}
    </svg>
  );
}

function clampY(y: number, y0: number, y1: number) {
  return Math.max(y0 - (y1 - y0) * 0.02, Math.min(y1 + (y1 - y0) * 0.02, y));
}

function niceTicks(a: number, b: number, n: number): number[] {
  const span = b - a || 1;
  const raw = span / n;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = (norm >= 7.5 ? 10 : norm >= 3.5 ? 5 : norm >= 1.5 ? 2 : 1) * mag;
  const out: number[] = [];
  for (let v = Math.ceil(a / step) * step; v <= b + 1e-9; v += step) out.push(Number(v.toFixed(10)));
  return out.length ? out : [a, b];
}

function fmtTick(v: number): string {
  if (Math.abs(v) >= 1000 || (Math.abs(v) < 0.01 && v !== 0)) return v.toExponential(0);
  return String(Number(v.toFixed(3)));
}
