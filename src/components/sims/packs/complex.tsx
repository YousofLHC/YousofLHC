"use client";

/** Complex-systems pack — Ising · Kepler · Perceptron · K-means. */
import { useRef, useState } from "react";
import { Readout, Slider, usePalette, useSimCanvas } from "../kit";

/* ============================== Ising 2-D ================================ */

export function Ising2D() {
  const [size, setSize] = useState(48);
  const [temp, setTemp] = useState(2.26); // ~Tc for square lattice
  const latticeRef = useRef<Int8Array>(new Int8Array(0));
  const dimRef = useRef(0);
  const magTraceRef = useRef<number[]>([]);
  const palRef = useRef(usePalette());
  const palette = palRef.current;
  const [, force] = useState(0);

  const ensureLattice = () => {
    if (dimRef.current !== size) {
      const l = new Int8Array(size * size);
      for (let i = 0; i < l.length; i++) l[i] = Math.random() < 0.5 ? -1 : 1;
      latticeRef.current = l;
      dimRef.current = size;
      magTraceRef.current = [];
    }
  };
  ensureLattice();

  const magnetization = () => {
    let m = 0;
    const l = latticeRef.current;
    for (let i = 0; i < l.length; i++) m += l[i];
    return m / l.length;
  };

  const ref = useSimCanvas(300, (ctx, w, h, _t, dt) => {
    ensureLattice();
    const l = latticeRef.current;
    const n = size;

    // Metropolis sweeps proportional to dt
    if (dt > 0) {
      const sweeps = Math.max(1, Math.round(dt * 30));
      for (let s = 0; s < sweeps; s++) {
        for (let k = 0; k < l.length; k++) {
          const i = (Math.random() * n) | 0;
          const j = (Math.random() * n) | 0;
          const idx = i * n + j;
          const up = l[((i - 1 + n) % n) * n + j];
          const dn = l[((i + 1) % n) * n + j];
          const lf = l[i * n + ((j - 1 + n) % n)];
          const rt = l[i * n + ((j + 1) % n)];
          const dE = 2 * l[idx] * (up + dn + lf + rt);
          if (dE <= 0 || Math.random() < Math.exp(-dE / temp)) l[idx] *= -1;
        }
        if (s === 0) {
          magTraceRef.current.push(magnetization());
          if (magTraceRef.current.length > 160) magTraceRef.current.shift();
        }
      }
    }

    // draw spins
    const cell = Math.floor(Math.min(w, h) / n);
    const ox = (w - cell * n) / 2;
    const oy = (h - cell * n) / 2;
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        const v = l[i * n + j];
        ctx.fillStyle = v > 0 ? palette.cyan : palette.violet;
        ctx.fillRect(ox + j * cell, oy + i * cell, cell - (cell > 3 ? 1 : 0), cell - (cell > 3 ? 1 : 0));
      }
  });

  const reseed = () => { dimRef.current = 0; ensureLattice(); force((x) => x + 1); };

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <Slider label="lattice N" value={size} min={16} max={96} step={8} onChange={(v) => { setSize(v); }} />
        <Slider label="temperature T" value={temp} min={0.5} max={5} step={0.02} onChange={setTemp} fmt={(v)=>v.toFixed(2)} />
        <div className="flex items-end"><button onClick={reseed} className="chip !py-1.5 !text-[10px]">reseed</button></div>
      </div>
      <div className="overflow-hidden rounded-xl border border-line"><canvas ref={ref} /></div>
      <Readout
        items={[
          ["Tc ≈ 2.27", temp < 2.27 ? "ordered phase" : "disordered phase"],
          ["|m|", Math.abs(magnetization()).toFixed(2)],
        ]}
      />
      {magTraceRef.current.length > 2 && (
        <svg viewBox={`0 0 320 60`} className="w-full">
          <polyline
            fill="none"
            stroke={palette.accent}
            strokeWidth="1.2"
            points={magTraceRef.current
              .map((v, i) => `${(i / 159) * 320},${30 - v * 28}`)
              .join(" ")}
          />
          <line x1="0" x2="320" y1="30" y2="30" stroke={palette.faint} strokeDasharray="2 3" />
        </svg>
      )}
    </div>
  );
}

/* ============================ Kepler orbit =============================== */

export function KeplerOrbit() {
  const [ecc, setEcc] = useState(0.6);
  const [aPx, setAPx] = useState(120);
  const palRef = useRef(usePalette());
  const palette = palRef.current;
  const posRef = useRef<{ r: number; th: number } | null>(null);

  const ref = useSimCanvas(300, (ctx, w, h, _t, dt) => {
    const a = aPx;
    const b = a * Math.sqrt(1 - ecc * ecc);
    const cFoci = ecc * a;
    const cx = w / 2 - cFoci;
    const cy = h / 2;

    // orbit path (ellipse with focus at star)
    ctx.strokeStyle = palette.faint;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.ellipse(cx + cFoci, cy, a, b, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // star at focus
    ctx.fillStyle = palette.accent;
    ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2); ctx.fill();

    // integrate angle via equal-area (Kepler II)
    if (!posRef.current) posRef.current = { r: a * (1 - ecc), th: 0 };
    const st = posRef.current;
    const rNow = a * (1 - ecc * ecc) / (1 + ecc * Math.cos(st.th));
    const omega = (Math.sqrt(a ** 3) * 40) / (rNow * rNow); // scaled
    st.th += omega * dt;
    st.r = a * (1 - ecc * ecc) / (1 + ecc * Math.cos(st.th));

    const px = cx + st.r * Math.cos(st.th);
    const py = cy + st.r * Math.sin(st.th);

    // radius vector
    ctx.strokeStyle = palette.cyan;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();

    // swept area wedge (last chunk)
    ctx.fillStyle = "rgba(255,90,69,.18)";
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + st.r * Math.cos(st.th - 0.25), cy + st.r * Math.sin(st.th - 0.25));
    ctx.ellipse(cx + cFoci, cy, a, b, 0, st.th - 0.25, st.th, true);
    ctx.closePath();
    ctx.fill();

    // planet
    ctx.fillStyle = palette.violet;
    ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();
  });

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Slider label="eccentricity e" value={ecc} min={0} max={0.9} step={0.01} onChange={setEcc} fmt={(v)=>v.toFixed(2)} />
        <Slider label="semi-major axis a" value={aPx} min={80} max={170} step={2} onChange={setAPx} />
      </div>
      <div className="overflow-hidden rounded-xl border border-line"><canvas ref={ref} /></div>
      <p className="font-mono text-[11px] text-faint">Equal areas in equal times — the wedge stays constant while speed varies (Kepler II).</p>
    </div>
  );
}

/* ============================= Perceptron ================================ */

interface BlobSpec { cx: number; cy: number; spread: number; label: number }

export function Perceptron() {
  const [lr, setLr] = useState(0.5);
  const [noise, setNoise] = useState(0.35);
  const dataRef = useRef<Array<[number, number, number]>>([]);
  const wRef = useRef([0.3, -0.2]);
  const bRef = useRef(0);
  const epochRef = useRef(0);
  const errorsRef = useRef<number[]>([]);
  const palRef = useRef(usePalette());
  const palette = palRef.current;

  const blobs: BlobSpec[] = [
    { cx: -0.55, cy: -0.45, spread: noise, label: 1 },
    { cx: 0.55, cy: 0.5, spread: noise, label: -1 },
  ];

  if (dataRef.current.length === 0) {
    for (const b of blobs)
      for (let i = 0; i < 40; i++) {
        // Box–Muller
        const u = Math.random() || 1e-9, v = Math.random() || 1e-9;
        const gx = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
        const gy = Math.sqrt(-2 * Math.log(u)) * Math.sin(2 * Math.PI * v);
        dataRef.current.push([b.cx + gx * b.spread, b.cy + gy * b.spread, b.label]);
      }
  }
  const regenerate = () => { dataRef.current = []; wRef.current = [0.3, -0.2]; bRef.current = 0; epochRef.current = 0; errorsRef.current = []; };

  const ref = useSimCanvas(280, (ctx, w, h, _t, dt) => {
    const toPx = (X: number) => ((X + 1.4) / 2.8) * w;
    const toPy = (Y: number) => h - ((Y + 1.4) / 2.8) * h;

    // one training pass every ~0.15s
    if (dt > 0 && epochRef.current < 200 && Math.random() < 0.35) {
      let errs = 0;
      for (const [x, y, label] of dataRef.current) {
        const pred = wRef.current[0] * x + wRef.current[1] * y + bRef.current >= 0 ? 1 : -1;
        if (pred !== label) {
          errs++;
          wRef.current[0] += lr * label * x;
          wRef.current[1] += lr * label * y;
          bRef.current += lr * label;
        }
      }
      epochRef.current++;
      errorsRef.current.push(errs);
      if (errorsRef.current.length > 200) errorsRef.current.shift();
    }

    // points
    for (const [x, y, label] of dataRef.current) {
      ctx.fillStyle = label === 1 ? palette.cyan : palette.violet;
      ctx.beginPath(); ctx.arc(toPx(x), toPy(y), 3, 0, Math.PI * 2); ctx.fill();
    }
    // boundary
    const [w0, w1] = wRef.current;
    if (Math.abs(w1) > 1e-6) {
      const yAt = (X: number) => -(w0 * X + bRef.current) / w1;
      ctx.strokeStyle = palette.accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(toPx(-1.4), toPy(yAt(-1.4)));
      ctx.lineTo(toPx(1.4), toPy(yAt(1.4)));
      ctx.stroke();
    }
    void h; void toPy;
  });

  const restart = () => regenerate();

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Slider label="learning rate" value={lr} min={0.05} max={1} step={0.05} onChange={setLr} fmt={(v)=>v.toFixed(2)} />
        <Slider label="class overlap (noise)" value={noise} min={0.08} max={0.8} step={0.02} onChange={(v) => { setNoise(v); }} />
      </div>
      <div className="relative overflow-hidden rounded-xl border border-line">
        <canvas ref={ref} />
        <button onClick={restart} className="absolute right-3 top-3 chip !py-1 !text-[10px]">new data</button>
      </div>
      <Readout items={[["epoch", epochRef.current], ["misclassified", errorsRef.current.at(-1) ?? "—"]]} />
    </div>
  );
}

/* =============================== K-means ================================= */

export function KMeans() {
  const [k, setK] = useState(3);
  const ptsRef = useRef<Array<[number, number]>>([]);
  const centRef = useRef<Array<[number, number]>>([]);
  const assignRef = useRef<number[]>([]);
  const stepRef = useRef(0);
  const palRef = useRef(usePalette());
  const palette = palRef.current;

  if (ptsRef.current.length === 0) {
    const seeds: Array<[number, number]> = [[-0.7, 0.5], [0.8, 0.6], [0.0, -0.7], [-0.6, -0.5]];
    for (const [sx, sy] of seeds.slice(0, 4))
      for (let i = 0; i < 34; i++) {
        const u = Math.random() || 1e-9, v = Math.random() || 1e-9;
        ptsRef.current.push([
          sx + Math.sqrt(-2 * Math.log(u)) * Math.cos(6.283 * v) * 0.22,
          sy + Math.sqrt(-2 * Math.log(u)) * Math.sin(6.283 * v) * 0.22,
        ]);
      }
  }

  const initCentroids = () => {
    centRef.current = Array.from({ length: k }, () => {
      const p = ptsRef.current[(Math.random() * ptsRef.current.length) | 0];
      return [p[0], p[1]] as [number, number];
    });
    assignRef.current = new Array(ptsRef.current.length).fill(-1);
    stepRef.current = 0;
  };

  const doStep = () => {
    const pts = ptsRef.current, cents = centRef.current;
    // assign
    assignRef.current = pts.map(([x, y]) => {
      let best = 0, bd = Infinity;
      cents.forEach(([cx, cy], ci) => {
        const d = (cx - x) ** 2 + (cy - y) ** 2;
        if (d < bd) { bd = d; best = ci; }
      });
      return best;
    });
    // update
    for (let ci = 0; ci < cents.length; ci++) {
      const mem = pts.filter((_, i) => assignRef.current[i] === ci);
      if (!mem.length) continue;
      cents[ci] = [
        mem.reduce((s, p) => s + p[0], 0) / mem.length,
        mem.reduce((s, p) => s + p[1], 0) / mem.length,
      ];
    }
    stepRef.current++;
  };

  if (centRef.current.length !== k) initCentroids();

  const colors = [palette.cyan, palette.violet, palette.accent, palette.emerald];

  const ref = useSimCanvas(280, (ctx, w, h) => {
    const toPx = (X: number) => ((X + 1.4) / 2.8) * w;
    const toPy = (Y: number) => h - ((Y + 1.4) / 2.8) * h;
    ptsRef.current.forEach(([x, y], i) => {
      const ci = assignRef.current[i] ?? 0;
      ctx.fillStyle = colors[ci % colors.length];
      ctx.beginPath(); ctx.arc(toPx(x), toPy(y), 3, 0, Math.PI * 2); ctx.fill();
    });
    centRef.current.forEach(([cx, cy], ci) => {
      ctx.strokeStyle = colors[ci % colors.length];
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(toPx(cx), toPy(cy), 7, 0, Math.PI * 2); ctx.stroke();
    });
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-44"><Slider label="clusters k" value={k} min={2} max={4} step={1} onChange={setK} /></div>
        <button onClick={initCentroids} className="chip !py-1.5 !text-[10px]">re-init</button>
        <button onClick={doStep} className="btn btn-primary !px-3 !py-1.5 !text-[11px]">step</button>
        <span className="font-mono text-[11px] text-faint">iteration {stepRef.current}</span>
      </div>
      <div className="overflow-hidden rounded-xl border border-line"><canvas ref={ref} /></div>
    </div>
  );
}
