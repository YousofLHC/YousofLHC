"use client";

/**
 * Biochem · Biophysics · Drug-design pack.
 * LJ mini-MD · HP folding · docking scan · binding isotherm ·
 * Ramachandran · DNA melting · PK one-compartment.
 */
import { useRef, useState } from "react";
import { Plot, Readout, Slider, usePalette, useSimCanvas } from "../kit";

/* ========================= Lennard-Jones mini-MD ========================= */

interface P { x: number; y: number; vx: number; vy: number; fx: number; fy: number }

export function LjMd() {
  const [n, setN] = useState(24);
  const [temp, setTemp] = useState(0.4);
  const partsRef = useRef<P[]>([]);
  const boxRef = useRef({ w: 100, h: 60 });
  const tempAcc = useRef(0);
  const palRef = useRef(usePalette());
  const palette = palRef.current;

  const ensure = () => {
    if (partsRef.current.length !== n) {
      const arr: P[] = [];
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        arr.push({
          x: 50 + Math.cos(a) * 20 + Math.random() * 2,
          y: 30 + Math.sin(a) * 12 + Math.random() * 2,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          fx: 0, fy: 0,
        });
      }
      partsRef.current = arr;
    }
  };
  ensure();


  function dtSafe() { return 0.004; }

  const ref = useSimCanvas(280, (ctx, w, h) => {
    ensure();
    const ps = partsRef.current;
    // scale box to canvas units
    boxRef.current.w = w;
    boxRef.current.h = h;

    /* forces */
    for (const p of ps) { p.fx = 0; p.fy = 0; }
    for (let i = 0; i < ps.length; i++)
      for (let j = i + 1; j < ps.length; j++) {
        let dx = ps[j].x - ps[i].x;
        let dy = ps[j].y - ps[i].y;
        const r2 = dx * dx + dy * dy;
        if (r2 > 900 || r2 < 1e-6) continue;
        const inv2 = 1 / r2;
        const inv6 = inv2 * inv2 * inv2;
        const f = 24 * inv6 * (2 * inv6 - 1) * inv2; // |F|/r
        dx *= f; dy *= f;
        ps[i].fx += dx; ps[i].fy += dy;
        ps[j].fx -= dx; ps[j].fy -= dy;
      }

    /* integrate + thermostat (Berendsen-ish rescale toward T*) */
    let ke = 0;
    for (const p of ps) {
      p.vx += p.fx * dtSafe(); p.vy += p.fy * dtSafe();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 2) { p.x = 2; p.vx = Math.abs(p.vx); }
      if (p.x > w - 2) { p.x = w - 2; p.vx = -Math.abs(p.vx); }
      if (p.y < 2) { p.y = 2; p.vy = Math.abs(p.vy); }
      if (p.y > h - 2) { p.y = h - 2; p.vy = -Math.abs(p.vy); }
      ke += 0.5 * (p.vx ** 2 + p.vy ** 2);
    }
    const tInst = (2 * ke) / (3 * Math.max(1, ps.length));
    const lambda = Math.sqrt(1 + ((temp / Math.max(tInst, 0.02)) - 1) * 0.05);
    for (const p of ps) { p.vx *= lambda; p.vy *= lambda; }
    tempAcc.current = tInst;

    /* draw bonds when close + particles */
    ctx.strokeStyle = palette.dim;
    ctx.globalAlpha = 0.35;
    for (let i = 0; i < ps.length; i++)
      for (let j = i + 1; j < ps.length; j++) {
        const d = Math.hypot(ps[j].x - ps[i].x, ps[j].y - ps[i].y);
        if (d < 26) {
          ctx.beginPath(); ctx.moveTo(ps[i].x, ps[i].y); ctx.lineTo(ps[j].x, ps[j].y); ctx.stroke();
        }
      }
    ctx.globalAlpha = 1;
    for (const p of ps) {
      ctx.fillStyle = palette.cyan;
      ctx.beginPath(); ctx.arc(p.x, p.y, 5.5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = palette.accent; ctx.lineWidth = 1;
      ctx.stroke();
    }
  });


  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Slider label="particles N" value={n} min={8} max={48} step={2} onChange={setN} />
        <Slider label="target T* (reduced)" value={temp} min={0.02} max={1.5} step={0.02} onChange={setTemp} fmt={(v)=>v.toFixed(2)} />
      </div>
      <div className="overflow-hidden rounded-xl border border-line"><canvas ref={ref} /></div>
      <Readout items={[
        ["potential", "V(r)=4ε[(σ/r)¹²−(σ/r)⁶]"],
        ["instant T*", tempAcc.current.toFixed(2)],
        ["ensemble", "NVE + weak thermostat"],
      ]} />
      <p className="text-[11.5px] leading-5 text-faint">
        Watch condensation below T*≈0.4 — clusters nucleate like a toy fluid,
        the same physics that packs protein cores and drives ligand binding.
      </p>
    </div>
  );
}

/* ========================== HP lattice folding =========================== */

type Dir = 0 | 1 | 2 | 3; // R D L U

export function HpFolding() {
  const [seqType, setSeqType] = useState("PHPPHPPHPHHPPHHPPPH");
  const [tempMc, setTempMc] = useState(0.35);
  const seq = seqType.replace(/[^HP]/gi, "").toUpperCase().split("");
  const movesRef = useRef<Dir[]>([]);
  const energyRef = useRef<number[]>([]);
  const bestRef = useRef(0);
  const palRef = useRef(usePalette());
  const palette = palRef.current;
  const [, force] = useState(0);

  if (movesRef.current.length !== seq.length) {
    // initial straight chain with two turns to avoid overlap
    const half = Math.ceil(seq.length / 2);
    movesRef.current = seq.map((_, i) => (i < half ? 0 : i === half ? 1 : 0));
    energyRef.current = [];
    bestRef.current = 0;
  }

  function coords(mvs: Dir[]): Array<[number, number]> {
    const out: Array<[number, number]> = [[0, 0]];
    const dirs: Array<[number, number]> = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    for (const m of mvs) {
      const [px, py] = out[out.length - 1];
      out.push([px + dirs[m][0], py + dirs[m][1]]);
    }
    return out;
  }

  function energyOf(mvs: Dir[]): number {
    const pos = coords(mvs);
    let e = 0;
    const key = new Set(pos.map(p => `${p[0]},${p[1]}`));
    if (key.size !== pos.length) return 999; // overlap → invalid
    for (let i = 0; i < pos.length; i++) {
      if (seq[i] !== "H") continue;
      const [x, y] = pos[i];
      for (const [nx, ny] of [[x+1,y],[x-1,y],[x,y+1],[x,y-1]]) {
        const j = pos.findIndex(p => p[0]===nx && p[1]===ny);
        if (j > i && seq[j] === "H") e -= 1;
      }
    }
    return e;
  }

  const energy = energyOf(movesRef.current);

  const mcStep = () => {
    const mvs = [...movesRef.current];
    const i = 1 + ((Math.random() * (mvs.length - 1)) | 0);
    mvs[i] = ((mvs[i] + (Math.random() < 0.5 ? 1 : 3)) % 4) as Dir;
    const newE = energyOf(mvs);
    const dE = newE - energy;
    if (dE <= 0 || Math.random() < Math.exp(-dE / Math.max(tempMc, 0.01))) {
      movesRef.current = mvs;
      energyRef.current.push(newE);
      if (newE < bestRef.current) bestRef.current = newE;
    } else {
      energyRef.current.push(energy);
    }
    if (energyRef.current.length > 200) energyRef.current.shift();
    force((x) => x + 1);
  };

  const pos = coords(movesRef.current);
  const cell = Math.min(22, 300 / Math.max(4, pos.length / 2));
  const xs = pos.map(p => p[0]), ys = pos.map(p => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);

  const contactPairs: Array<[number, number]> = [];
  for (let i = 0; i < pos.length; i++)
    for (let j = i + 2; j < pos.length; j++) {
      if (seq[i] === "H" && seq[j] === "H" && Math.abs(pos[i][0]-pos[j][0]) + Math.abs(pos[i][1]-pos[j][1]) === 1)
        contactPairs.push([i, j]);
    }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block font-mono text-[10.5px] uppercase tracking-wider text-faint">sequence (H/P)</label>
          <input className="w-full rounded-lg border border-line bg-panel px-3 py-2 font-mono text-sm text-ink" value={seqType} onChange={(e) => { setSeqType(e.target.value); movesRef.current = []; }} />
        </div>
        <Slider label="MC temperature" value={tempMc} min={0.02} max={2} step={0.02} onChange={setTempMc} fmt={(v)=>v.toFixed(2)} />
      </div>

      <svg viewBox={`0 0 ${Math.max(240, (maxX-minX+3)*cell)} ${Math.max(160,(maxY-minY+3)*cell)}`} className="w-full rounded-xl border border-line bg-panel/30">
        {/* H-H contacts */}
        {contactPairs.map(([i, j], k) => (
          <line key={k} x1={(pos[i][0]-minX+1.5)*cell} y1={(pos[i][1]-minY+1.5)*cell}
            x2={(pos[j][0]-minX+1.5)*cell} y2={(pos[j][1]-minY+1.5)*cell}
            stroke={palette.accent} strokeWidth={1.4} opacity={0.7} strokeDasharray="3 2" />
        ))}
        {/* backbone */}
        <polyline fill="none" stroke={palette.dim} strokeWidth={1.6}
          points={pos.map(([x,y]) => `${(x-minX+1.5)*cell},${(y-minY+1.5)*cell}`).join(" ")} />
        {/* residues */}
        {pos.map(([x, y], i) => {
          const isH = seq[i] === "H";
          return (
            <circle key={i} cx={(x-minX+1.5)*cell} cy={(y-minY+1.5)*cell}
              r={isH ? cell*0.34 : cell*0.28}
              fill={isH ? palette.cyan : "transparent"}
              stroke={!isH ? palette.emerald : "none"} strokeWidth={1.6} />
          );
        })}
      </svg>

      <Readout items={[["energy E", energy], ["best", bestRef.current], ["H-H contacts", contactPairs.length]]} />
      <button onClick={() => { for (let i = 0; i < 25; i++) mcStep(); }} className="btn btn-primary !px-4 !py-1.5 !text-[11px]">
        MC ×25 steps
      </button>
    </div>
  );
}

/* ======================= Docking landscape scanner ======================= */

export function DockingScan() {
  const [poseX, setPoseX] = useState(0.55);
  const [poseY, setPoseY] = useState(0.45);
  const pal = usePalette();

  /** pseudo-energy grid: two favorable pockets + steric wall */
  function gridEnergy(u: number, v: number): number {
    const pocketA = -3.2 * Math.exp(-(((u - 0.32) ** 2) + ((v - 0.38) ** 2)) / 0.018);
    const pocketB = -1.9 * Math.exp(-(((u - 0.72) ** 2) + ((v - 0.62) ** 2)) / 0.03);
    const wall = 4.5 * Math.exp(-((v - 0.08) ** 2) / 0.004);
    const rough = 0.35 * Math.sin(u * 40) * Math.cos(v * 36);
    return pocketA + pocketB + wall + rough;
  }

  const W = 90, Hh = 70;
  const heat = (() => {
    const rows: string[][] = [];
    let min = Infinity, max = -Infinity;
    const vals: number[][] = [];
    for (let j = 0; j < Hh; j++) {
      vals.push([]);
      for (let i = 0; i < W; i++) {
        const e = gridEnergy(i / W, j / Hh);
        vals[j].push(e);
        if (e < min) min = e;
        if (e > max) max = e;
      }
    }
    for (let j = 0; j < Hh; j++) {
      const row: string[] = [];
      for (let i = 0; i < W; i++) {
        const t = (vals[j][i] - min) / (max - min);
        const r = Math.round(255 * t);
        const g = Math.round(80 + 120 * (1 - t));
        const b = Math.round(60 + 140 * (1 - t));
        row.push(`rgb(${r},${g},${b})`);
      }
      rows.push(row);
    }
    return { rows, cellW: 100 / W, cellH: 100 / Hh };
  })();

  const score = gridEnergy(poseX, poseY);

  return (
    <div className="space-y-3">
      <svg viewBox="-6 -14 112 122" className="w-full rounded-xl border border-line">
        {heat.rows.map((row, j) =>
          row.map((fill, i) => (
            <rect key={`${i}-${j}`} x={i * heat.cellW} y={j * heat.cellH}
              width={heat.cellW + 0.15} height={heat.cellH + 0.15} fill={fill} />
          ))
        )}
        {/* pose crosshair */}
        <g transform={`translate(${poseX * 100},${poseY * 100})`}>
          <circle r="3.4" fill="none" stroke="#fff" strokeWidth="1.4" />
          <line x1="-6" x2="6" stroke="#fff" strokeWidth="1" />
          <line y1="-6" y2="6" stroke="#fff" strokeWidth="1" />
        </g>
        <text x="50" y="-4" textAnchor="middle" fontSize="6" fill={pal.dim}>receptor grid — darker = better score</text>
      </svg>
      <div className="grid gap-3 sm:grid-cols-2">
        <Slider label="pose u" value={poseX} min={0.05} max={0.95} step={0.005} onChange={setPoseX} fmt={(v)=>v.toFixed(3)} />
        <Slider label="pose v" value={poseY} min={0.15} max={0.95} step={0.005} onChange={setPoseY} fmt={(v)=>v.toFixed(3)} />
      </div>
      <Readout items={[["ΔG score", `${score.toFixed(2)} kcal/mol`], ["verdict", score < -2.6 ? "strong binder pose" : score < -1.4 ? "weak pose" : "steric clash / poor"]]} />
    </div>
  );
}

/* ====================== Binding isotherm ± inhibitor ===================== */

export function BindingIsotherm() {
  const [kd, setKd] = useState(0.5);
  const [kiFactor, setKiFactor] = useState(5); // competitor Kd multiplier shown at fixed [I]=Ki
  const pal = usePalette();

  const theta = (L: number, K: number) => L / (K + L);
  const main: Array<[number, number]> = [];
  const compet: Array<[number, number]> = [];
  for (let i = 0; i <= 80; i++) {
    const L = Math.pow(10, -3 + (i / 80) * 5); // 1e-3 .. 1e2 µM
    main.push([Math.log10(L), theta(L, kd)]);
    // competitive inhibitor at [I]=Ki shifts apparent Kd by factor (1+[I]/Ki)=2×kiFactor? use alpha=kiFactor
    compet.push([Math.log10(L), theta(L, kd * kiFactor)]);
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Slider label="Kd (µM)" value={kd} min={0.05} max={5} step={0.05} onChange={setKd} fmt={(v)=>v.toFixed(2)} />
        <Slider label="[I]/Ki (competitor)" value={kiFactor} min={0} max={20} step={1} onChange={setKiFactor} />
      </div>
      <Plot
        xDomain={[-3, 2]} yDomain={[0, 1.05]} height={250}
        bands={[{ x0: Math.log10(kd) - 0.04, x1: Math.log10(kd) + 0.04, color: pal.accent, opacity: 0.25 }]}
        series={[
          { points: main, color: pal.cyan, width: 2 },
          ...(kiFactor > 0 ? [{ points: compet, color: pal.violet, dash: "5 4" }] : []),
        ]}
        markers={[{ x: Math.log10(kd), y: 0.5 }]}
        xLabel="log₁₀ [L] (µM)" yLabel="θ fractional occupancy"
      />
      <Readout items={[["θ=0.5 at [L]=Kd", `${kd} µM`], ["apparent Kd +inhibitor", `${(kd * kiFactor).toFixed(2)} µM`]]} />
    </div>
  );
}

/* ======================== Ramachandran explorer ========================= */

export function Ramachandran() {
  const [phi, setPhi] = useState(-57);
  const [psi, setPsi] = useState(-47);
  const pal = usePalette();
  const W = 320;

  const regions = [
    // alpha helix
    { cx: -63, cy: -43, rx: 28, ry: 22, label: "α" },
    // beta sheet
    { cx: -120, cy: 130, rx: 45, ry: 40, label: "β" },
    // left-handed
    { cx: 57, cy: 41, rx: 18, ry: 14, label: "L" },
  ];

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Slider label="φ (phi)" value={phi} min={-180} max={180} step={1} onChange={setPhi} fmt={(v)=>`${v}°`} />
        <Slider label="ψ (psi)" value={psi} min={-180} max={180} step={1} onChange={setPsi} fmt={(v)=>`${v}°`} />
      </div>
      <svg viewBox={`0 0 ${W} ${W}`} className="w-full rounded-xl border border-line">
        <rect width={W} height={W} fill="var(--t-panel)" />
        {regions.map((r) => (
          <ellipse key={r.label}
            cx={((r.cx + 180) / 360) * W} cy={((180 - r.cy) / 360) * W}
            rx={(r.rx / 180) * W * 0.9} ry={(r.ry / 180) * W * 0.9}
            fill={pal.cyan} opacity={0.16} stroke={pal.cyan} strokeOpacity={0.4} />
        ))}
        {[...regions].map((r) => (
          <text key={r.label}
            x={((r.cx + 180) / 360) * W} y={((180 - r.cy) / 360) * W + 4}
            textAnchor="middle" fontSize="13" fontFamily="monospace" fill={pal.faint}>{r.label}</text>
        ))}
        <line x1="0" x2={W} y1={W / 2} y2={W / 2} stroke={pal.grid} />
        <line y1="0" y2={W} x1={W / 2} x2={W / 2} stroke={pal.grid} />
        {(() => {
          const px = ((phi + 180) / 360) * W;
          const py = ((180 - psi) / 360) * W;
          const inside = regions.some(r =>
            (((px - ((r.cx + 180) / 360) * W) / ((r.rx / 180) * W * 0.9)) ** 2 +
             (((py - ((180 - r.cy) / 360) * W)) / ((r.ry / 180) * W * 0.9)) ** 2) <= 1);
          return <>
            <line x1={px} x2={px} y1="0" y2={W} stroke={pal.accent} opacity={0.5} />
            <line x1="0" x2={W} y1={py} y2={py} stroke={pal.accent} opacity={0.5} />
            <circle cx={px} cy={py} r="6" fill={inside ? pal.emerald : pal.accent} stroke="var(--t-ink)" />
            <text x={px + 9} y={py - 8} fontSize="10" fontFamily="monospace" fill={pal.dim}>
              {inside ? "allowed" : "disallowed"}
            </text>
          </>;
        })()}
        <text x={W - 6} y={W - 8} textAnchor="end" fontSize="9" fill={pal.faint}>ψ ↑</text>
        <text x={W - 6} y={14} textAnchor="end" fontSize="9" fill={pal.faint}>φ →</text>
      </svg>
      <Readout items={[["secondary structure guess",
        phi > -100 && phi < -30 && psi > -70 && psi < -5 ? "α-helix"
        : phi < -60 && psi > 90 ? "β-strand"
        : "other/coil"]]} />
    </div>
  );
}

/* ========================= DNA melting curve ============================= */

export function DnaMelting() {
  const pal = usePalette();
  const [gc, setGc] = useState(50);
  const [na, setNa] = useState(100); // mM Na+
  // Wallace-ish + salt correction (simplified)
  const tm = 81.5 + 0.41 * gc - 500 / (seqLen()) + 16.6 * Math.log10(Math.max(na, 1) / 1000) + 6.75;
  function seqLen() { return 20; }

  const pts: Array<[number, number]> = [];
  const widthK = 6;
  for (let t = tm - widthK; t <= tm + widthK; t += 0.25)
    pts.push([t, 1 / (1 + Math.exp((tm - t) / (widthK / 8)))]);

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Slider label="GC content %" value={gc} min={20} max={80} step={1} onChange={setGc} />
        <Slider label="[Na⁺] mM" value={na} min={10} max={500} step={10} onChange={setNa} />
      </div>
      <Plot
        xDomain={[tm - widthK, tm + widthK]}
        yDomain={[0, 1.08]}
        height={230}
        bands={[{ x0: tm - 0.6, x1: tm + 0.6, color: pal.accent, opacity: 0.2 }]}
        series={[
          { points: pts, color: pal.cyan },
          { points: [[tm - widthK, 1], [tm, 0.5]], dash: "3 4", color: pal.faint, width: 1 },
        ]}
        markers={[{ x: tm, y: 0.5 }]}
        xLabel="temperature °C" yLabel="absorbance (norm.)"
      />
      <Readout items={[["Tm", `${tm.toFixed(1)} °C`], ["check", "f=0.5 at Tm ✓"], ["GC", `${gc}%`]]} />
    </div>
  );
}

/* =================== Pharmacokinetics one-compartment ==================== */

export function PkOneComp() {
  const pal = usePalette();
  const [dose, setDose] = useState(500);
  const [ka, setKa] = useState(0.9);
  const [ke, setKe] = useState(0.15);
  const V = 50; // L fixed for display

  const pts: Array<[number, number]> = [];
  const tMax = 24;
  let cMax = 0, tPeak = 0;
  for (let i = 0; i <= 240; i++) {
    const t = (i / 240) * tMax;
    const F = 1; // bioavailability
    const c = (F * dose * ka) / (V * (ka - ke)) * (Math.exp(-ka * t) - Math.exp(-ke * t));
    pts.push([t, c]);
    if (c > cMax) { cMax = c; tPeak = t; }
  }
  const halfLife = Math.log(2) / ke;
  const auc = (dose * 1) / (V * ke);

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <Slider label="dose (mg)" value={dose} min={50} max={1000} step={50} onChange={setDose} />
        <Slider label="ka (h⁻¹) absorption" value={ka} min={0.2} max={3} step={0.05} onChange={setKa} fmt={(v)=>v.toFixed(2)} />
        <Slider label="ke (h⁻¹) elimination" value={ke} min={0.03} max={0.8} step={0.01} onChange={setKe} fmt={(v)=>v.toFixed(2)} />
      </div>
      <Plot
        xDomain={[0, tMax]} yDomain={[0, cMax * 1.2 || 1]} height={250}
        series={[{ points: pts, color: pal.cyan, fill: true }]}
        markers={[{ x: tPeak, y: cMax }]}
        xLabel="time (h)" yLabel="plasma conc (mg/L)"
      />
      <Readout items={[
        ["Cmax", `${cMax.toFixed(2)} mg/L`],
        ["t peak", `${tPeak.toFixed(1)} h`],
        ["t½ elimination", `${halfLife.toFixed(1)} h`],
        ["AUC₀–∞", `${auc.toFixed(0)} mg·h/L`],
      ]} />
    </div>
  );
}
