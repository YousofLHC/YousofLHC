"use client";

/**
 * Physics / Math pack — six zero-dependency simulations.
 * Every widget: sliders → model → canvas/SVG, reduced-motion safe.
 */
import { useRef, useState } from "react";;
import { Plot, Readout, Slider, usePalette, useSimCanvas } from "../kit";

/* ============================ 1 · Logistic map ============================ */

export function LogisticMap() {
  const [rMax, setRMax] = useState(4);
  const [drops, setDrops] = useState(60);

  const ref = useSimCanvas(260, (ctx, w, h, _t, _dt) => {
    const pal = {
      bg: "transparent",
      dot: document.documentElement.dataset.theme === "light" ? "#0b72a0" : "#4fc8e8",
      axis: document.documentElement.dataset.theme === "light" ? "#46506a" : "#9aa3be",
    };
    ctx.fillStyle = pal.dot;
    const rMin = 2.9;
    const cols = 240;
    for (let ci = 0; ci < cols; ci++) {
      const r = rMin + ((rMax - rMin) * ci) / (cols - 1);
      let x = 0.5;
      for (let i = 0; i < 300; i++) x = r * x * (1 - x);
      for (let d = 0; d < drops; d++) {
        x = r * x * (1 - x);
        const px = (ci / (cols - 1)) * w;
        const py = h - x * h;
        ctx.fillRect(px, py, 1, 1);
      }
    }
    ctx.strokeStyle = pal.axis;
    ctx.beginPath();
    ctx.moveTo(0, h - 0.5);
    ctx.lineTo(w, h - 0.5);
    ctx.stroke();
    // r labels
    ctx.fillStyle = pal.axis;
    ctx.font = "10px monospace";
    ctx.fillText("r=2.9", 4, h - 6);
    ctx.textAlign = "right";
    ctx.fillText(`r=${rMax.toFixed(2)}`, w - 4, h - 6);
    ctx.textAlign = "left";
  });

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Slider label="r max" value={rMax} min={3.0} max={4} step={0.005} onChange={setRMax} />
        <Slider label="plotted drops / r" value={drops} min={20} max={140} step={5} onChange={setDrops} />
      </div>
      <div className="overflow-hidden rounded-xl border border-line"><canvas ref={ref} /></div>
      <Readout items={[["map", "xₙ₊₁ = r·xₙ(1−xₙ)"], ["regime", rMax > 3.57 ? "chaotic band" : rMax > 3.0 ? "period doubling" : "stable"]] as const} />
    </div>
  );
}

/* ========================= 2 · Double pendulum =========================== */

interface PendState { a1: number; a2: number; v1: number; v2: number }

export function DoublePendulum() {
  const [g, setG] = useState(9.81);
  const [damping, setDamping] = useState(0.0);
  const [speed, setSpeed] = useState(1);
  const stateRef = useRef<PendState>({ a1: Math.PI / 2, a2: Math.PI / 2 + 0.4, v1: 0, v2: 0 });
  const trailRef = useRef<Array<[number, number]>>([]);
  const palRef = useRef(usePalette());
  const palette = palRef.current;

  const ref = useSimCanvas(320, (ctx, w, h, _t, _dt) => {
    const s = stateRef.current;
    const L1 = Math.min(h, w) * 0.22;
    const L2 = L1;
    const m1 = 1, m2 = 1;

    // RK4-ish semi-implicit at fixed substeps for stability
    const steps = 8;
    const sdt = Math.min(0.032, 0.016 * speed) / steps;
    for (let k = 0; k < steps; k++) {
      const { a1, a2, v1, v2 } = s;
      const d = a1 - a2;
      const den = 2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2);
      const A1 =
        (-g * (2 * m1 + m2) * Math.sin(a1) -
          m2 * g * Math.sin(a1 - 2 * a2) -
          2 * Math.sin(d) * m2 *
            (v2 * v2 * L2 + v1 * v1 * L1 * Math.cos(d))) /
        (L1 * den);
      const A2 =
        (2 * Math.sin(d) *
          (v1 * v1 * L1 * (m1 + m2) +
            g * (m1 + m2) * Math.cos(a1) +
            v2 * v2 * L2 * m2 * Math.cos(d))) /
        (L2 * den);
      s.v1 += A1 * sdt;
      s.v2 += A2 * sdt;
      s.v1 *= 1 - damping * sdt;
      s.v2 *= 1 - damping * sdt;
      s.a1 += s.v1 * sdt;
      s.a2 += s.v2 * sdt;
    }

    const cx = w / 2;
    const cy = h * 0.32;
    const x1 = cx + L1 * Math.sin(s.a1);
    const y1 = cy + L1 * Math.cos(s.a1);
    const x2 = x1 + L2 * Math.sin(s.a2);
    const y2 = y1 + L2 * Math.cos(s.a2);

    trailRef.current.push([x2, y2]);
    if (trailRef.current.length > 220) trailRef.current.shift();

    // trail
    ctx.lineWidth = 1;
    for (let i = 1; i < trailRef.current.length; i++) {
      const [tx0, ty0] = trailRef.current[i - 1];
      const [tx1, ty1] = trailRef.current[i];
      ctx.strokeStyle = `rgba(79,200,232,${(i / trailRef.current.length) * 0.5})`;
      ctx.beginPath();
      ctx.moveTo(tx0, ty0);
      ctx.lineTo(tx1, ty1);
      ctx.stroke();
    }
    // arms
    ctx.strokeStyle = palette.dim;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.fillStyle = palette.cyan;
    [[cx, cy], [x1, y1]].forEach(([bx, by]) => {
      ctx.beginPath(); ctx.arc(bx, by, 4, 0, Math.PI * 2); ctx.fill();
    });
    ctx.fillStyle = palette.accent;
    ctx.beginPath(); ctx.arc(x2, y2, 7, 0, Math.PI * 2); ctx.fill();

    const energy =
      0.5 * m1 * (s.v1 * L1) ** 2 +
      0.5 * m2 * ((s.v1 * L1) ** 2 + (s.v2 * L2) ** 2 + 2 * s.v1 * s.v2 * L1 * L2 * Math.cos(s.a1 - s.a2)) -
      (m1 + m2) * g * L1 * Math.cos(s.a1) - m2 * g * L2 * Math.cos(s.a2);
    ctx.fillStyle = palette.faint;
    ctx.font = "11px monospace";
    ctx.fillText(`E ≈ ${energy.toFixed(1)} J   θ₁=${(((s.a1 * 180) / Math.PI) % 360).toFixed(0)}°`, 8, 16);
  });

  const reset = () => {
    stateRef.current = { a1: Math.PI / 2, a2: Math.PI / 2 + 0.35, v1: 0, v2: 0 };
    trailRef.current = [];
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <Slider label="gravity g" value={g} min={1.6} max={25} step={0.01} onChange={setG} fmt={(v)=>v.toFixed(2)} />
        <Slider label="damping" value={damping} min={0} max={1.5} step={0.02} onChange={setDamping} fmt={(v)=>v.toFixed(2)} />
        <Slider label="speed ×" value={speed} min={0.1} max={3} step={0.05} onChange={setSpeed} fmt={(v)=>v.toFixed(2)} />
      </div>
      <div className="relative overflow-hidden rounded-xl border border-line">
        <canvas ref={ref} />
        <button onClick={reset} className="absolute right-3 top-3 chip !py-1 !text-[10px]">reset</button>
      </div>
    </div>
  );
}

/* ============================ 3 · Wave 1-D =============================== */

export function Wave1D() {
  const [c, setC] = useState(0.9);
  const [damp, setDamp] = useState(0.0005);
  const N = 160;
  const u = useRef<Float64Array>(new Float64Array(N));
  const up = useRef<Float64Array>(new Float64Array(N));
  const palRef = useRef(usePalette());
  const palette = palRef.current;

  function pluck() {
    const arr = u.current, prev = up.current;
    arr.fill(0); prev.fill(0);
    for (let i = 55; i < 80; i++) arr[i] = Math.sin((Math.PI * (i - 55)) / 25);
  }

  const ref = useSimCanvas(220, (ctx, w, h, _t, dt) => {
    const arr = u.current, prev = up.current;
    const sub = 3;
    const cN = Math.min(0.9, c * dt * 12);
    for (let k = 0; k < sub; k++) {
      const next = new Float64Array(N);
      for (let i = 1; i < N - 1; i++) {
        next[i] = 2 * arr[i] - prev[i] + cN * cN * (arr[i - 1] - 2 * arr[i] + arr[i + 1]);
        next[i] *= 1 - damp;
      }
      up.current = arr;
      u.current = next;
    }
    const cur = u.current;
    ctx.strokeStyle = palette.cyan;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const px = (i / (N - 1)) * w;
      const py = h / 2 - cur[i] * h * 0.42;
      if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
    }
    ctx.stroke();
    ctx.fillStyle = palette.faint;
    ctx.font = "10px monospace";
    ctx.fillText("fixed ends · Δt-substeps=3", 8, 14);
  });

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Slider label="wave speed ∝ √tension" value={c} min={0.1} max={1.4} step={0.02} onChange={setC} fmt={(v)=>v.toFixed(2)} />
        <Slider label="damping" value={damp} min={0} max={0.004} step={0.0001} onChange={setDamp} fmt={(v)=>v.toFixed(4)} />
      </div>
      <div className="relative overflow-hidden rounded-xl border border-line">
        <canvas ref={ref} />
        <button onClick={pluck} className="absolute right-3 top-3 chip !py-1 !text-[10px]">pluck</button>
      </div>
    </div>
  );
}

/* ============================ 4 · Monte-Carlo π ========================== */

export function McPi() {
  const [target, setTarget] = useState(4000);
  const ptsRef = useRef<Array<[number, number, boolean]>>([]);
  const countRef = useRef(0);
  const insideRef = useRef(0);
  const [n, setN] = useState(0);
  const [est, setEst] = useState<number | null>(null);

  const ref = useSimCanvas(280, (ctx, w, h, _t, dt) => {
    if (countRef.current < target && dt > 0) {
      const batch = Math.max(4, Math.floor(target / 120));
      for (let i = 0; i < batch && countRef.current < target; i++) {
        const x = Math.random(), y = Math.random();
        const inside = x * x + y * y <= 1;
        ptsRef.current.push([x, y, inside]);
        countRef.current++;
        if (inside) insideRef.current++;
      }
      setN(countRef.current);
      setEst((4 * insideRef.current) / Math.max(1, countRef.current));
    }
    const R = Math.min(w, h) - 16;
    const ox = (w - R) / 2, oy = (h - R) / 2;
    const light = document.documentElement.dataset.theme === "light";
    ctx.strokeStyle = light ? "rgba(15,23,42,.25)" : "rgba(255,255,255,.18)";
    ctx.strokeRect(ox, oy, R, R);
    ctx.beginPath(); ctx.arc(ox + R / 2, oy + R / 2, R / 2, 0, Math.PI * 2); ctx.stroke();
    for (const [x, y, inside] of ptsRef.current) {
      ctx.fillStyle = inside
        ? light ? "#0b72a0" : "#4fc8e8"
        : light ? "#e63700" : "#ff5a45";
      ctx.fillRect(ox + x * R - 0.5, oy + y * R - 0.5, 1.6, 1.6);
    }
  });

  const restart = () => { ptsRef.current = []; countRef.current = 0; insideRef.current = 0; setN(0); setEst(null); };

  return (
    <div className="space-y-3">
      <Slider label="target samples N" value={target} min={500} max={20000} step={500} onChange={(v) => { setTarget(v); restart(); }} />
      <div className="overflow-hidden rounded-xl border border-line"><canvas ref={ref} /></div>
      <Readout items={[["N", n], ["inside", insideRef.current], ["π̂", est ? est.toFixed(5) : "—"], ["|π−π̂|", est ? Math.abs(Math.PI - est).toFixed(5) : "—"]]} />
    </div>
  );
}

/* ========================= 5 · Gradient descent ========================== */

function fVal(x: number, y: number) {
  return x * x + y * y + 0.9 * Math.sin(2.2 * x) * Math.cos(2.2 * y);
}
function fGrad(x: number, y: number): [number, number] {
  const e = 1e-4;
  return [
    (fVal(x + e, y) - fVal(x - e, y)) / (2 * e),
    (fVal(x, y + e) - fVal(x, y - e)) / (2 * e),
  ];
}
const DOM = 2.4;

export function GradientDescent() {
  const [lr, setLr] = useState(0.08);
  const [momentum, setMomentum] = useState(0.0);
  const [startX, setStartX] = useState(-2.0);
  const [startY, setStartY] = useState(1.8);
  const pathRef = useRef<Array<[number, number]>>([[startX, startY]]);
  const velRef = useRef<[number, number]>([0, 0]);
  const palRef = useRef(usePalette());
  const palette = palRef.current;


  const sigRef = useRef("");
  const ref = useSimCanvas(300, (ctx, w, h, _t, dt) => {
    const key = `${lr}|${momentum}|${startX}|${startY}`;
    if (sigRef.current !== key) { sigRef.current = key; pathRef.current = [[startX, startY]]; velRef.current = [0, 0]; }

    // heatmap (coarse cells)
    const cell = 9;
    let vmin = Infinity, vmax = -Infinity;
    const vals: number[] = [];
    for (let py = 0; py < h; py += cell)
      for (let px = 0; px < w; px += cell) {
        const X = (((px / w) * 2 - 1)) * DOM;
        const Y = (((py / h) * 2 - 1)) * DOM;
        const v = fVal(X, Y);
        vals.push(v); if (v < vmin) vmin = v; if (v > vmax) vmax = v;
      }
    let idx = 0;
    const light = document.documentElement.dataset.theme === "light";
    for (let py = 0; py < h; py += cell)
      for (let px = 0; px < w; px += cell) {
        const t = (vals[idx++] - vmin) / (vmax - vmin);
        const shade = light ? 235 - t * 90 : 24 + t * 70;
        ctx.fillStyle = `rgb(${shade},${shade + (light ? 4 : 6)},${shade + (light ? 10 : 14)})`;
        ctx.fillRect(px, py, cell, cell);
      }
    void light;

    // descend
    if (dt > 0) {
      const lastPt = pathRef.current[pathRef.current.length - 1];
      const [gx, gy] = fGrad(lastPt[0], lastPt[1]);
      velRef.current[0] = momentum * velRef.current[0] - lr * gx;
      velRef.current[1] = momentum * velRef.current[1] - lr * gy;
      const np: [number, number] = [
        Math.max(-DOM, Math.min(DOM, lastPt[0] + velRef.current[0])),
        Math.max(-DOM, Math.min(DOM, lastPt[1] + velRef.current[1])),
      ];
      pathRef.current.push(np);
      if (pathRef.current.length > 600) pathRef.current.shift();
    }

    // path overlay
    const toPx = (X: number) => ((X / DOM) + 1) * 0.5 * w;
    const toPy = (Y: number) => ((Y / DOM) + 1) * 0.5 * h;
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    pathRef.current.forEach(([X, Y], i) => {
      const px = toPx(X), py = toPy(Y);
      if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
    });
    ctx.stroke();
    const head = pathRef.current[pathRef.current.length - 1];
    ctx.fillStyle = palette.cyan;
    ctx.beginPath(); ctx.arc(toPx(head[0]), toPy(head[1]), 5, 0, Math.PI * 2); ctx.fill();
  });

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Slider label="learning rate" value={lr} min={0.005} max={0.3} step={0.005} onChange={setLr} fmt={(v)=>v.toFixed(3)} />
        <Slider label="momentum β" value={momentum} min={0} max={0.95} step={0.05} onChange={setMomentum} fmt={(v)=>v.toFixed(2)} />
        <Slider label="start x₀" value={startX} min={-2.2} max={2.2} step={0.1} onChange={setStartX} fmt={(v)=>v.toFixed(1)} />
        <Slider label="start y₀" value={startY} min={-2.2} max={2.2} step={0.1} onChange={setStartY} fmt={(v)=>v.toFixed(1)} />
      </div>
      <div className="overflow-hidden rounded-xl border border-line"><canvas ref={ref} /></div>
      <p className="font-mono text-[11px] text-faint">
        f(x,y)=x²+y²+0.9·sin(2.2x)·cos(2.2y) — ripples create local minima; momentum helps escape.
      </p>
    </div>
  );
}

/* ============================ 6 · Random walk ============================ */

export function RandomWalk() {
  const [walkers, setWalkers] = useState(60);
  const [stepSize, setStepSize] = useState(2);
  const posRef = useRef<Array<{ x: number; y: number }>>([]);
  const msdRef = useRef<Array<[number, number]>>([]);
  const tRef = useRef(0);
  const palRef = useRef(usePalette());
  const palette = palRef.current;

  const ensure = () => {
    while (posRef.current.length < walkers)
      posRef.current.push({ x: 0, y: 0 });
    posRef.current.length = walkers;
  };
  ensure();

  const ref = useSimCanvas(280, (ctx, w, h, _t, dt) => {
    ensure();
    if (dt > 0) {
      ctx.fillStyle = document.documentElement.dataset.theme === "light"
        ? "rgba(246,247,250,0.08)"
        : "rgba(5,8,15,0.10)";
      ctx.fillRect(0, 0, w, h);
      tRef.current += dt;
      for (const p of posRef.current) {
        p.x += (Math.random() - 0.5) * 2 * stepSize;
        p.y += (Math.random() - 0.5) * 2 * stepSize;
        if (p.x < 0 || p.x > w) p.x = w / 2;
        if (p.y < 0 || p.y > h) p.y = h / 2;
        ctx.fillStyle = palette.cyan;
        ctx.globalAlpha = 0.85;
        ctx.fillRect(p.x, p.y, 1.8, 1.8);
        ctx.globalAlpha = 1;
      }
      // MSD sample every ~0.4s
      if (Math.round(tRef.current * 2.5) !== Math.round((tRef.current - dt) * 2.5)) {
        let msd = 0;
        for (const p of posRef.current) msd += (p.x - w / 2) ** 2 + (p.y - h / 2) ** 2;
        msdRef.current.push([tRef.current, msd / posRef.current.length]);
        if (msdRef.current.length > 260) msdRef.current.shift();
      }
    } else {
      ctx.clearRect(0, 0, w, h);
    }
    ctx.fillStyle = palette.faint;
    ctx.font = "11px monospace";
    ctx.fillText(`⟨r²⟩ grows ∝ 2·D·t   (t=${tRef.current.toFixed(1)}s)`, 8, 16);
  }, true);

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Slider label="walkers" value={walkers} min={5} max={300} step={5} onChange={(v) => { setWalkers(v); }} />
        <Slider label="step size" value={stepSize} min={0.5} max={5} step={0.1} onChange={setStepSize} fmt={(v)=>v.toFixed(1)} />
      </div>
      <div className="overflow-hidden rounded-xl border border-line"><canvas ref={ref} /></div>
      <Plot
        xDomain={[0, Math.max(5, tRef.current)]}
        yDomain={[0, Math.max(1000, ...msdRef.current.map(p => p[1]))]}
        height={150}
        series={[{ points: msdRef.current, color: palette.violet, width: 1.4 }]}
        xLabel="t (s)" yLabel="MSD"
      />
    </div>
  );
}
