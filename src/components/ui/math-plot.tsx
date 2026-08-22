"use client";

/**
 * Interactive math plots for MDX articles.
 *
 * Each plot renders an <svg> from a pure function, exposes sliders for the
 * free parameters, and shows a hover crosshair with live value readouts.
 * Pure SVG + React state — no chart library. Theme-aware via CSS variables.
 */
import { useEffect, useId, useMemo, useRef, useState } from "react";

type Theme = "dark" | "light";

function readTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function useTheme(): Theme {
  const [theme, setTheme] = useState<Theme>(readTheme);
  useEffect(() => {
    const el = document.documentElement;
    const sync = () => setTheme(readTheme());
    const obs = new MutationObserver(sync);
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);
  return theme;
}

export type PlotParam = {
  key: string;
  label: string;
  unit?: string;
  min: number;
  max: number;
  step: number;
  def: number;
};

export type PlotSeries = {
  label: string;
  /** function of the independent variable + current params */
  fn: (x: number, p: Record<string, number>) => number;
  color: string;
  fill?: boolean;
  dashed?: boolean;
};

type PlotProps = {
  title: string;
  params: PlotParam[];
  series: PlotSeries[];
  xMin: number;
  xMax: number;
  xLabel: string;
  yLabel: string;
  /** extra vertical lines (e.g. r_min, r0) as (x, label) */
  markers?: { x: number; label: string; color?: string }[];
  /** horizontal line (y, label) */
  hline?: { y: number; label: string; color?: string };
  yPad?: number;
  note?: string;
};

const W = 760;
const H = 300;
const ML = 58;
const MR = 16;
const MT = 18;
const MB = 34;

function fmt(v: number): string {
  if (!Number.isFinite(v)) return "∞";
  const a = Math.abs(v);
  if (a !== 0 && (a >= 1e4 || a < 1e-3)) return v.toExponential(1);
  if (a >= 100) return v.toFixed(0);
  if (a >= 10) return v.toFixed(1);
  if (a >= 1) return v.toFixed(2);
  return v.toFixed(3);
}

function niceTicks(min: number, max: number, n: number) {
  const span = max - min;
  if (span <= 0 || !Number.isFinite(span)) return [0];
  const raw = span / n;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = norm < 1.5 ? mag : norm < 3.5 ? 2 * mag : norm < 7.5 ? 5 * mag : 10 * mag;
  const out: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max + step * 1e-6; v += step) out.push(v);
  return out;
}

function buildPath(
  pts: (number | null)[],
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number
) {
  const X = (x: number) => ML + ((x - xMin) / (xMax - xMin)) * (W - ML - MR);
  const Y = (y: number) => MT + (1 - (y - yMin) / (yMax - yMin)) * (H - MT - MB);
  let d = "";
  let pen = false;
  pts.forEach((y, i) => {
    const x = X(xMin + (i / (pts.length - 1)) * (xMax - xMin));
    if (y === null) {
      pen = false;
      return;
    }
    d += pen ? ` L ${x.toFixed(1)} ${Y(y).toFixed(1)}` : ` M ${x.toFixed(1)} ${Y(y).toFixed(1)}`;
    pen = true;
  });
  return d;
}

export function MathPlot({
  title,
  params,
  series,
  xMin,
  xMax,
  xLabel,
  yLabel,
  markers,
  hline,
  yPad = 0.12,
  note,
}: PlotProps) {
  const theme = useTheme();
  const uid = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const [vals, setVals] = useState<Record<string, number>>(() =>
    Object.fromEntries(params.map((p) => [p.key, p.def]))
  );

  const dark = theme === "dark";
  const grid = dark ? "rgba(147,160,180,0.14)" : "rgba(30,36,48,0.12)";
  const dim = dark ? "#9aa3be" : "#5a6480";
  const ink = dark ? "#edeff5" : "#0f1730";
  const zero = dark ? "rgba(255,255,255,0.35)" : "rgba(15,23,48,0.35)";

  const N = 260;
  const ys = useMemo(
    () =>
      series.map((s) =>
        Array.from({ length: N }, (_, i) => {
          const x = xMin + (i / (N - 1)) * (xMax - xMin);
          const y = s.fn(x, vals);
          return Number.isFinite(y) ? y : null;
        })
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [series, vals, xMin, xMax]
  );

  const yMin0 = Math.min(
    0,
    ...ys.flat().filter((v): v is number => v !== null && Number.isFinite(v))
  );
  const yMax0 = Math.max(
    0,
    ...ys.flat().filter((v): v is number => v !== null && Number.isFinite(v))
  );
  const pad = (yMax0 - yMin0) * yPad || 1;
  const yMin = yMin0 - pad;
  const yMax = yMax0 + pad;

  const X = (x: number) => ML + ((x - xMin) / (xMax - xMin)) * (W - ML - MR);
  const Y = (y: number) => MT + (1 - (y - yMin) / (yMax - yMin)) * (H - MT - MB);

  const xTicks = niceTicks(xMin, xMax, 6);
  const yTicks = niceTicks(yMin, yMax, 5);

  function onMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const fx = (e.clientX - rect.left) / rect.width;
    setHover(Math.min(xMax, Math.max(xMin, xMin + fx * (xMax - xMin))));
  }

  function set(key: string, v: number) {
    setVals((p) => ({ ...p, [key]: v }));
  }

  return (
    <figure className="my-8 rounded-2xl border border-line bg-panel/50 p-5">
      <figcaption className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-cyan">
          {title}
        </span>
        <span className="font-mono text-[10px] text-faint">interactive — drag &amp; hover</span>
      </figcaption>

      <div className="overflow-x-auto rounded-xl border border-line bg-panel/70 p-2 sm:p-3">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full min-w-[560px] touch-none select-none"
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
          role="img"
          aria-label={title}
        >
          {/* grid */}
          {xTicks.map((t) => (
            <g key={`x${t}`}>
              <line x1={X(t)} y1={MT} x2={X(t)} y2={H - MB} stroke={grid} strokeWidth={1} />
              <text
                x={X(t)}
                y={H - MB + 16}
                textAnchor="middle"
                fontSize={10.5}
                fill={dim}
                fontFamily="JetBrains Mono, monospace"
              >
                {fmt(t)}
              </text>
            </g>
          ))}
          {yTicks.map((t) => (
            <g key={`y${t}`}>
              <line x1={ML} y1={Y(t)} x2={W - MR} y2={Y(t)} stroke={grid} strokeWidth={1} />
              <text
                x={ML - 8}
                y={Y(t) + 3.5}
                textAnchor="end"
                fontSize={10.5}
                fill={dim}
                fontFamily="JetBrains Mono, monospace"
              >
                {fmt(t)}
              </text>
            </g>
          ))}

          {/* zero axis */}
          {yMin < 0 && yMax > 0 && (
            <line x1={ML} y1={Y(0)} x2={W - MR} y2={Y(0)} stroke={zero} strokeWidth={1.2} />
          )}

          {/* horizontal marker */}
          {hline &&
            hline.y >= yMin &&
            hline.y <= yMax && (
              <g>
                <line
                  x1={ML}
                  y1={Y(hline.y)}
                  x2={W - MR}
                  y2={Y(hline.y)}
                  stroke={hline.color ?? dim}
                  strokeWidth={1.2}
                  strokeDasharray="5 4"
                />
                <text
                  x={W - MR - 6}
                  y={Y(hline.y) - 6}
                  textAnchor="end"
                  fontSize={10.5}
                  fill={hline.color ?? dim}
                  fontFamily="JetBrains Mono, monospace"
                >
                  {hline.label}
                </text>
              </g>
            )}

          {/* series */}
          {series.map((s, si) => {
            const d = buildPath(ys[si], xMin, xMax, yMin, yMax);
            return (
              <g key={s.label}>
                {s.fill && (
                  <path
                    d={`${d} L ${X(xMax).toFixed(1)} ${Y(0).toFixed(1)} L ${X(xMin).toFixed(1)} ${Y(
                      0
                    ).toFixed(1)} Z`}
                    fill={s.color}
                    opacity={0.09}
                    stroke="none"
                  />
                )}
                <path
                  d={d}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={2.2}
                  strokeLinejoin="round"
                  strokeDasharray={s.dashed ? "6 5" : undefined}
                />
              </g>
            );
          })}

          {/* vertical markers */}
          {markers?.map((m, i) => (
            <g key={`m${i}`}>
              <line
                x1={X(m.x)}
                y1={MT}
                x2={X(m.x)}
                y2={H - MB}
                stroke={m.color ?? dim}
                strokeWidth={1.2}
                strokeDasharray="3 4"
              />
              <text
                x={X(m.x)}
                y={MT - 4}
                textAnchor="middle"
                fontSize={10.5}
                fill={m.color ?? dim}
                fontFamily="JetBrains Mono, monospace"
              >
                {m.label}
              </text>
            </g>
          ))}

          {/* hover crosshair */}
          {hover !== null && (
            <g>
              <line
                x1={X(hover)}
                y1={MT}
                x2={X(hover)}
                y2={H - MB}
                stroke={ink}
                strokeWidth={0.8}
                strokeDasharray="2 3"
                opacity={0.5}
              />
              {series.map((s, si) => {
                const y = s.fn(hover, vals);
                if (!Number.isFinite(y) || y < yMin || y > yMax) return null;
                return (
                  <circle
                    key={s.label}
                    cx={X(hover)}
                    cy={Y(y)}
                    r={4}
                    fill={s.color}
                    stroke={dark ? "#0b1128" : "#ffffff"}
                    strokeWidth={1.5}
                  />
                );
              })}
            </g>
          )}

          {/* axis labels */}
          <text
            x={W - MR}
            y={H - 4}
            textAnchor="end"
            fontSize={11}
            fill={dim}
            fontFamily="JetBrains Mono, monospace"
          >
            {xLabel} →
          </text>
          <text
            x={ML - 8}
            y={MT + 2}
            textAnchor="end"
            fontSize={11}
            fill={dim}
            fontFamily="JetBrains Mono, monospace"
          >
            {yLabel}
          </text>
        </svg>
      </div>

      {/* hover readout */}
      <div className="mt-2 flex min-h-[20px] flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[11px]">
        {hover !== null ? (
          <>
            <span className="text-faint">
              {xLabel} = <span className="text-ink">{fmt(hover)}</span>
            </span>
            {series.map((s) => {
              const y = s.fn(hover, vals);
              if (!Number.isFinite(y)) return null;
              return (
                <span key={s.label} style={{ color: s.color }}>
                  {s.label} = {fmt(y)}
                </span>
              );
            })}
          </>
        ) : (
          <span className="text-faint">hover the curve to read coordinates</span>
        )}
      </div>

      {/* sliders */}
      <div className="mt-4 grid gap-x-8 gap-y-3 border-t border-line pt-4 sm:grid-cols-2">
        {params.map((p) => (
          <label key={p.key} className="flex items-center gap-3 text-[11px]">
            <span className="w-28 shrink-0 font-mono text-dim">
              {p.label}
              {p.unit ? ` (${p.unit})` : ""}
            </span>
            <input
              type="range"
              min={p.min}
              max={p.max}
              step={p.step}
              value={vals[p.key]}
              onChange={(e) => set(p.key, Number(e.target.value))}
              className="min-w-0 flex-1 accent-cyan"
              aria-label={`${p.label}${p.unit ? ` (${p.unit})` : ""}`}
            />
            <span className="w-14 shrink-0 text-right font-mono text-cyan">
              {fmt(vals[p.key])}
            </span>
          </label>
        ))}
      </div>

      {note && <p className="mt-4 border-t border-line pt-3 text-xs leading-6 text-dim">{note}</p>}
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Pre-configured plots                                                */
/* ------------------------------------------------------------------ */

const CYAN = "#4fc8e8";
const AMBER = "#e8934a";
const VIOLET = "#9c8ce0";
const MAGENTA = "#f472b6";
const EMERALD = "#4fbe96";

/** Lennard-Jones 12-6 potential */
export function LJPlot() {
  return (
    <MathPlot
      title="Lennard-Jones 12-6 pair potential"
      params={[
        { key: "eps", label: "ε well depth", unit: "kJ·mol⁻¹", min: 0.2, max: 2.5, step: 0.1, def: 0.8 },
        { key: "sig", label: "σ radius", unit: "Å", min: 2.2, max: 4.5, step: 0.1, def: 3.4 },
      ]}
      series={[
        {
          label: "U(r)",
          color: CYAN,
          fill: true,
          fn: (r, p) => 4 * p.eps * (Math.pow(p.sig / r, 12) - Math.pow(p.sig / r, 6)),
        },
      ]}
      xMin={1.5}
      xMax={12}
      xLabel="r"
      yLabel="U"
      markers={[
        { x: 3.4, label: "σ", color: AMBER },
        { x: 3.8149, label: "r_min = 2¹ᐟ⁶σ", color: AMBER },
      ]}
      note="Curve crosses zero at r = σ, reaches its minimum −ε at r_min = 2¹ᐟ⁶ σ ≈ 1.122 σ, then decays as r⁻⁶. Below σ the r⁻¹² wall rises almost vertically — this is incompressibility."
    />
  );
}

/** LJ force — shows U → F conversion */
export function LJForcePlot() {
  return (
    <MathPlot
      title="The force from −∇U (Lennard-Jones)"
      params={[
        { key: "eps", label: "ε well depth", unit: "kJ·mol⁻¹", min: 0.2, max: 2.5, step: 0.1, def: 0.8 },
        { key: "sig", label: "σ radius", unit: "Å", min: 2.2, max: 4.5, step: 0.1, def: 3.4 },
      ]}
      series={[
        {
          label: "f(r)",
          color: AMBER,
          fn: (r, p) =>
            (48 * p.eps / (p.sig * p.sig)) *
            (Math.pow(p.sig / r, 14) - 0.5 * Math.pow(p.sig / r, 8)),
        },
      ]}
      xMin={1.5}
      xMax={12}
      xLabel="r"
      yLabel="f"
      markers={[{ x: 3.8149, label: "force zero at r_min", color: EMERALD }]}
      hline={{ y: 0, label: "f = 0", color: EMERALD }}
      note="f = −dU/dr = (48ε/σ²)[(σ/r)¹⁴ − ½(σ/r)⁸]. Positive → repulsion (r < r_min), negative → attraction (r > r_min). The most negative point is the maximum attractive force — beyond it, squeezing atoms together costs energy again."
    />
  );
}

/** Harmonic bond + Morse — shows the unbreakable-bond limitation */
export function BondPlot() {
  return (
    <MathPlot
      title="Bond stretching: harmonic vs Morse"
      params={[
        { key: "k", label: "k_b stiffness", unit: "kJ·mol⁻¹·Å⁻²", min: 100, max: 2000, step: 50, def: 700 },
        { key: "r0", label: "r₀ length", unit: "Å", min: 0.9, max: 1.6, step: 0.01, def: 1.09 },
      ]}
      series={[
        {
          label: "½k_b(r−r₀)²",
          color: CYAN,
          fn: (r, p) => 0.5 * p.k * Math.pow(r - p.r0, 2),
        },
        {
          label: "Morse",
          color: MAGENTA,
          dashed: true,
          fn: (r, p) => {
            const De = 400;
            const a = Math.sqrt(p.k / (2 * De));
            return De * Math.pow(1 - Math.exp(-a * (r - p.r0)), 2);
          },
        },
      ]}
      xMin={0.5}
      xMax={3.2}
      xLabel="R(C–H)"
      yLabel="U"
      markers={[{ x: 1.09, label: "r₀", color: AMBER }]}
      hline={{ y: 400, label: "dissociation limit (Morse)", color: MAGENTA }}
      note="A harmonic parabola never flattens: beyond ≈10% displacement it stops matching reality and can never describe bond breaking. The Morse potential (dashed) flattens to a dissociation limit — but it is rarely used in production force fields because it costs more to evaluate and needs a new parameter per bond."
    />
  );
}

/** Dihedral cosine potential — conformational flexibility */
export function DihedralPlot() {
  return (
    <MathPlot
      title="Dihedral torsion: U = ½ Vₙ [1 + cos(nφ − γ)]"
      params={[
        { key: "Vn", label: "Vₙ barrier", unit: "kJ·mol⁻¹", min: 1, max: 24, step: 1, def: 12 },
        { key: "n", label: "n periodicity", unit: "", min: 1, max: 6, step: 1, def: 3 },
        { key: "gamma", label: "γ phase", unit: "°", min: 0, max: 180, step: 15, def: 0 },
      ]}
      series={[
        {
          label: "U(φ)",
          color: VIOLET,
          fill: true,
          fn: (phi, p) =>
            (p.Vn / 2) * (1 + Math.cos((p.n * phi - p.gamma) * (Math.PI / 180))),
        },
      ]}
      xMin={0}
      xMax={360}
      xLabel="φ (torsion angle)"
      yLabel="U"
      note={`n controls the number of symmetry-equivalent minima in one full turn (here ${"3"}–fold), Vₙ the barrier height between them, γ shifts the whole curve. Dihedrals are ~100× softer than bond stretches — this is the term that generates conformational diversity.`}
    />
  );
}

/** Coulomb electrostatics */
export function CoulombPlot() {
  return (
    <MathPlot
      title="Coulomb electrostatics: U = q₁q₂ / r"
      params={[
        { key: "q1", label: "q₁ charge", unit: "e", min: -1, max: 1, step: 0.1, def: 1 },
        { key: "q2", label: "q₂ charge", unit: "e", min: -1, max: 1, step: 0.1, def: -1 },
      ]}
      series={[
        {
          label: "U(r)",
          color: EMERALD,
          fill: true,
          fn: (r, p) => (p.q1 * p.q2) / r,
        },
      ]}
      xMin={1}
      xMax={12}
      xLabel="r"
      yLabel="U"
      yPad={0.25}
      note="Opposite charges (q₁q₂ < 0) → attractive well, like charges → repulsive hill. The 1/r decay is far too slow to be handled by a naive cutoff — this is why long-range electrostatics need Ewald-style methods (PME)."
    />
  );
}

/** Tail correction vs cutoff */
export function TailPlot() {
  return (
    <MathPlot
      title="LJ tail correction vs cutoff radius"
      params={[
        { key: "Rc", label: "R_c cutoff", unit: "Å", min: 1.5, max: 18, step: 0.5, def: 9 },
        { key: "sig", label: "σ radius", unit: "Å", min: 2.2, max: 4.5, step: 0.1, def: 3.4 },
      ]}
      series={[
        {
          label: "U_tail (ρ* = 1)",
          color: MAGENTA,
          fill: true,
          fn: (Rc, p) => {
            const s = p.sig / Rc;
            return ((8 * Math.PI) / 3) * ((1 / 3) * Math.pow(s, 9) - Math.pow(s, 3));
          },
        },
      ]}
      xMin={1.5}
      xMax={18}
      xLabel="R_c"
      yLabel="U_tail / ε"
      yPad={0.15}
      markers={[{ x: 9, label: "R_c = 9 Å", color: AMBER }]}
      note="The energy beyond the cutoff is not zero — it must be estimated analytically. With a typical cut-off of 9 Å and σ = 3.4 Å this tail is ≈10% of the total potential energy, so silently dropping it biases density and pressure. Formula (in reduced units, ρσ³ = 1): U_tail/ε = (8π/3)[⅓(σ/R_c)⁹ − (σ/R_c)³]."
    />
  );
}

/** Verlet integration stability — spring test system */
export function VerletPlot() {
  const theme = useTheme();
  const dark = theme === "dark";
  const grid = dark ? "rgba(147,160,180,0.14)" : "rgba(30,36,48,0.12)";
  const dim = dark ? "#9aa3be" : "#5a6480";
  const param = { key: "dt", label: "Δt step", unit: "fs", min: 0.5, max: 20, step: 0.5, def: 5 };
  const [vals, setVals] = useState<Record<string, number>>(() => ({ [param.key]: param.def }));

  // A C–H stretching-like oscillator in reduced units: ω₀ = 2π / T, T = 10 fs.
  // Simulate with velocity-Verlet over 40 classical periods, sample 500 points.
  const omega0 = (2 * Math.PI) / 10; // rad/fs
  const SAMPLE = 500;
  const PERIODS = 40;

  const { curve, energy } = useMemo(() => {
    const dt = vals[param.key];
    const x: number[] = [];
    const E: number[] = [];
    let pos = 1;
    let vel = 0;
    const stepsPerSample = Math.max(1, Math.round(PERIODS * (10 / Math.max(dt, 1e-6)) / SAMPLE));
    for (let n = 0; n < SAMPLE * stepsPerSample; n++) {
      const a = -omega0 * omega0 * pos;
      pos += vel * dt + 0.5 * a * dt * dt;
      const a2 = -omega0 * omega0 * pos;
      vel += 0.5 * (a + a2) * dt;
      if (n % stepsPerSample === 0) {
        x.push(pos);
        E.push(0.5 * vel * vel + 0.5 * omega0 * omega0 * pos * pos);
      }
    }
    x.push(pos);
    E.push(0.5 * vel * vel + 0.5 * omega0 * omega0 * pos * pos);
    return { curve: x, energy: E };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vals]);

  void curve;
  void energy;

  const H2 = 240;
  const n = curve.length;
  const pts = curve.map((y, i) => {
    const x = ML + (i / (n - 1)) * (W - ML - MR);
    const yy = MT + 20 + (1 - (y + 1) / 2) * (H2 - MT - MB - 20);
    return `${x.toFixed(1)},${yy.toFixed(1)}`;
  });

  return (
    <figure className="my-8 rounded-2xl border border-line bg-panel/50 p-5">
      <figcaption className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-cyan">
          Velocity-Verlet on a harmonic spring
        </span>
        <span className="font-mono text-[10px] text-faint">try a big Δt — watch energy blow up</span>
      </figcaption>
      <div className="overflow-x-auto rounded-xl border border-line bg-panel/70 p-2 sm:p-3">
        <svg viewBox={`0 0 ${W} ${H2}`} className="h-auto w-full min-w-[560px] select-none" role="img" aria-label="Verlet integration demo">
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <line x1={ML} y1={MT + 20 + i * 70} x2={W - MR} y2={MT + 20 + i * 70} stroke={grid} />
            </g>
          ))}
          <polyline
            points={pts.join(" ")}
            fill="none"
            stroke={CYAN}
            strokeWidth={2}
            strokeLinejoin="round"
          />
          <text x={ML} y={MT + 12} fontSize={10.5} fill={dim} fontFamily="JetBrains Mono, monospace">
            x(t) — position of a C–H-like bond (k=700 kJ·mol⁻¹·Å⁻², reduced units)
          </text>
          <text x={W - MR} y={H2 - 8} textAnchor="end" fontSize={11} fill={dim} fontFamily="JetBrains Mono, monospace">
            t →
          </text>
        </svg>
      </div>
      <div className="mt-4 grid gap-x-8 gap-y-3 border-t border-line pt-4 sm:grid-cols-2">
        <label className="flex items-center gap-3 text-[11px]">
          <span className="w-28 shrink-0 font-mono text-dim">Δt step (fs)</span>
          <input
            type="range"
            min={param.min}
            max={param.max}
            step={param.step}
            value={vals[param.key]}
            onChange={(e) => setVals({ [param.key]: Number(e.target.value) })}
            className="min-w-0 flex-1 accent-cyan"
            aria-label="Δt step (fs)"
          />
          <span className="w-14 shrink-0 text-right font-mono text-cyan">{fmt(vals[param.key])}</span>
        </label>
        <span className="flex items-center gap-3 text-[11px] font-mono text-dim">
          ω₀ = 2π/10 fs⁻¹ · <span style={{ color: CYAN }}>velocity-Verlet</span>
        </span>
      </div>
      <p className="mt-4 border-t border-line pt-3 text-xs leading-6 text-dim">
        The same velocity-Verlet integrator, run on a stiff spring. At small Δt the oscillation is
        stable; past the stability limit the amplitude (visible as the envelope of the curve)
        keeps growing — total energy is no longer conserved. This is exactly why C–H bonds force Δt
        ≲ 1 fs unless they are constrained (SHAKE).
      </p>
    </figure>
  );
}