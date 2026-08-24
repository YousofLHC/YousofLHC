"use client";

/** Chemistry pack — kinetics · titration · Boltzmann · Beer–Lambert. */
import { useState } from "react";
import { Plot, Readout, Slider, usePalette } from "../kit";

/* ======================= Michaelis–Menten ================================ */

export function MichaelisMenten() {
  const [vmax, setVmax] = useState(100);
  const [km, setKm] = useState(2.5);
  const pal = usePalette();

  const pts: Array<[number, number]> = [];
  const lb: Array<[number, number]> = [];
  for (let i = 0; i <= 60; i++) {
    const s = (i / 60) * 10;
    pts.push([s, (vmax * s) / (km + s)]);
    if (s > 0) {
      const invS = 1 / s;
      if (invS <= 2.5) lb.push([invS, 1 / ((vmax * s) / (km + s))]);
    }
  }
  const halfV = vmax / 2;

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Slider label="Vmax (µmol/min)" value={vmax} min={20} max={200} step={5} onChange={setVmax} />
        <Slider label="Km (mM)" value={km} min={0.3} max={8} step={0.1} onChange={setKm} fmt={(v)=>v.toFixed(1)} />
      </div>
      <Plot
        xDomain={[0, 10]}
        yDomain={[0, vmax * 1.15]}
        series={[{ points: pts, color: pal.cyan, fill: true }]}
        markers={[{ x: km, y: halfV, color: pal.accent }]}
        xLabel="[S] mM" yLabel="v"
        height={230}
      />
      <Readout items={[["v at Km", halfV.toFixed(1)], ["Km", `${km} mM`], ["specificity v/Km", (vmax / km).toFixed(1)]]} />
      <details className="rounded-lg border border-line bg-panel/40 px-4 py-2 text-[12px] text-dim">
        <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-wider">Lineweaver–Burk view</summary>
        <div className="mt-2">
          <Plot xDomain={[0, 2.5]} yDomain={[0, Math.max(0.6, 1 / (vmax * 0.25))]} series={[{ points: lb, color: pal.violet, width: 1.4 }]} xLabel="1/[S]" yLabel="1/v" height={160} />
          <p>x-intercept = −1/Km · y-intercept = 1/Vmax</p>
        </div>
      </details>
    </div>
  );
}

/* ============================ Titration ================================== */

export function Titration() {
  const pal = usePalette();
  const [pka, setPka] = useState(4.76); // acetic acid
  const [conc, setConc] = useState(0.1);

  const pts: Array<[number, number]> = [];
  const bufferZone: Array<[number, number]> = [];
  for (let eq = 0; eq <= 200; eq++) {
    const x = eq / 50; // equivalents 0..4
    let ph: number;
    if (x === 0) ph = 0.5 * (pka - Math.log10(conc));
    else if (x < 1) ph = pka + Math.log10(x / (1 - x));
    else {
      // post-equivalence dominated by excess strong base (idealized)
      const oh = conc * (x - 1);
      ph = oh > 0 ? 14 + Math.log10(Math.max(oh, 1e-10)) : pka + 2;
    }
    ph = Math.max(0, Math.min(14, ph));
    pts.push([x, ph]);
    if (x >= 0.1 && x <= 0.9) bufferZone.push([x, ph]);
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Slider label="pKa" value={pka} min={2} max={11} step={0.02} onChange={setPka} fmt={(v)=>v.toFixed(2)} />
        <Slider label="acid conc (M)" value={conc} min={0.01} max={0.5} step={0.01} onChange={setConc} fmt={(v)=>v.toFixed(2)} />
      </div>
      <Plot
        xDomain={[0, 4]} yDomain={[0, 14]} height={250}
        bands={[{ x0: 0.1, x1: 0.9, color: pal.emerald, opacity: 0.14 }]}
        series={[
          { points: pts, color: pal.cyan },
          { points: bufferZone.length ? [[bufferZone[0][0], bufferZone[0][1]], [bufferZone.at(-1)![0], bufferZone.at(-1)![1]]] : [], color: "transparent", width: 0 },
        ]}
        markers={[{ x: 1, y: pka, r: 5 }]}
        xLabel="equivalents OH⁻ added" yLabel="pH"
      />
      <Readout items={[["buffer region", `pH ≈ pKa (${pka.toFixed(2)}) ± 1`], ["equivalence pH", pts[50] ? pts[50][1].toFixed(2) : ""]]} />
    </div>
  );
}

/* ============================ Boltzmann ================================== */

export function Boltzmann() {
  const pal = usePalette();
  const [temp, setTemp] = useState(300);
  const kT = 8.617e-5 * temp; // eV
  const Emax = 0.5;
  const pts: Array<[number, number]> = [];
  for (let i = 0; i <= 80; i++) {
    const E = (i / 80) * Emax;
    pts.push([E, Math.exp(-E / kT)]);
  }

  return (
    <div className="space-y-3">
      <Slider label="temperature T (K)" value={temp} min={50} max={1500} step={10} onChange={setTemp} />
      <Plot
        xDomain={[0, Emax]} yDomain={[0, 1.05]} height={240}
        series={[
          { points: pts, color: pal.accent, fill: true },
          { points: [[kT, 0], [kT, Math.exp(-1)]], color: pal.cyan, dash: "4 4", width: 1.2 },
        ]}
        markers={[{ x: kT, y: Math.exp(-1), color: pal.cyan }]}
        xLabel="energy E (eV)" yLabel="P(E)"
      />
      <Readout items={[["kT", `${kT.toFixed(3)} eV`], ["E where P=1/e", `${kT.toFixed(3)} eV`], ["population E=0.3eV", (Math.exp(-0.3 / kT) * 100).toFixed(1) + "%"]]} />
    </div>
  );
}

/* =========================== Beer–Lambert ================================ */

export function BeerLambert() {
  const pal = usePalette();
  const [eps, setEps] = useState(8700);
  const [path, setPath] = useState(1);
  const [conc, setConc] = useState(2e-5);
  const A = eps * path * conc;
  const T = Math.pow(10, -A);
  const pct = T * 100;
  const rgb = `rgb(${Math.round(255 - A * 60)}, ${Math.round(120 + A * 20)}, ${Math.round(180 - A * 30)})`;

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <Slider label="ε (M⁻¹cm⁻¹)" value={eps} min={500} max={20000} step={100} onChange={setEps} />
        <Slider label="path l (cm)" value={path} min={0.1} max={5} step={0.1} onChange={setPath} fmt={(v)=>v.toFixed(1)} />
        <Slider label="c (×10⁻⁵ M)" value={conc * 1e5} min={0.1} max={10} step={0.1} onChange={(v)=>setConc(v*1e-5)} fmt={(v)=>v.toFixed(1)} />
      </div>
      <div className="flex items-center gap-4">
        <div
          className="h-24 w-16 shrink-0 rounded-md border border-line transition-colors"
          style={{ background: rgb }}
          title="sample tube"
        />
        <Plot
          xDomain={[0, 3]} yDomain={[0, 3]} height={190}
          series={[
            { points: [[0, 0], [3, 3]], color: pal.faint, dash: "3 4", width: 1 },
            { points: [[0, 0], [Math.min(3, A), Math.min(3, A)]], color: pal.cyan, width: 2 },
          ]}
          markers={A <= 3 ? [{ x: A, y: A }] : []}
          xLabel="concentration c" yLabel="absorbance A"
        />
      </div>
      <Readout items={[["A = εlc", A.toFixed(3)], ["transmittance", `${pct.toFixed(1)} %`], ["% absorbed", (100 - pct).toFixed(1)]]} />
    </div>
  );
}
