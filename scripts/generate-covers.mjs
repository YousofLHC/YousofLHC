// Generates cover SVGs into public/covers/
//
// Modes:
//   node scripts/generate-covers.mjs                          → legacy batch (curated set)
//   node scripts/generate-covers.mjs --slug S --title T       → auto motif by topic
//   node scripts/generate-covers.mjs --slug S --title T --style dna --variant 2
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const outDir = path.join(process.cwd(), "public", "covers");
mkdirSync(outDir, { recursive: true });

const W = 900;
const H = 520;

/* ------------------------- curated legacy batch ------------------------- */
const covers = [
  { file: "single-class-anomaly-detection.svg", title: "Anomaly Detection", a: "#f472b6", b: "#3be1ff" },
  { file: "solar-cells-genetic-optimization.svg", title: "Solar Cells · GA", a: "#fbbf24", b: "#34d399" },
  { file: "amp-factor-graphs.svg", title: "Factor Graphs", a: "#3be1ff", b: "#818cf8" },
  { file: "message-passing-primer.svg", title: "Message Passing", a: "#a78bfa", b: "#f472b6" },
  { file: "gnn-molecular-property-prediction.svg", title: "GNN Notebook", a: "#34d399", b: "#3be1ff" },
  { file: "kalman-filter-notes.svg", title: "Kalman Notes", a: "#34d399", b: "#fbbf24" },
  { file: "mhchem-notes.svg", title: "mhchem Notes", a: "#f472b6", b: "#34d399" },
  { file: "force-fields-molecular-dynamics.svg", title: "Force Fields & MD", a: "#e8934a", b: "#4fc8e8" },
];

function svgFor({ title, a, b }, i) {
  const seed = i * 37;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg${i}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#050918"/><stop offset="1" stop-color="#0b1128"/>
    </linearGradient>
    <linearGradient id="g${i}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/>
    </linearGradient>
    <radialGradient id="glow${i}" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${a}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="${a}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg${i})"/>
  <circle cx="${450 + Math.sin(seed) * 120}" cy="${240 + Math.cos(seed) * 80}" r="190" fill="url(#glow${i})"/>
  <g transform="translate(450 250)">
    ${Array.from({ length: 12 }, (_, k) => {
      const ang = (k / 12) * Math.PI * 2;
      const r = 130 + (k % 3) * 26;
      return `<circle cx="${(Math.cos(ang) * r).toFixed(1)}" cy="${(Math.sin(ang) * r).toFixed(1)}" r="7" fill="${k % 2 ? a : b}" fill-opacity="0.75"/>`;
    }).join("\n")}
  </g>
  <text x="44" y="430" font-family="JetBrains Mono, monospace, sans-serif" font-size="34" font-weight="700" fill="url(#g${i})">${title}</text>
</svg>`;
}

/* ===================== dynamic scene engine ===================== */

export const COVER_STYLES = [
  "dna", "molecule", "particles", "neural", "deep",
  "stats", "descent", "patterns", "agent",
  "hexgrid", "circuit", "waves", "topo", "blobs", "rings", "starfield",
  "flask", "capsule", "chart", "graduation", "lattice3d",
];

const PALETTES = [
  ["#4fc8e8", "#9c8ce0"], // cyan / violet
  ["#34d399", "#fbbf24"], // emerald / gold
  ["#f472b6", "#3be1ff"], // pink / cyan
  ["#ff5a45", "#ffc561"], // orange / gold
  ["#a78bfa", "#34d399"], // violet / emerald
];

/* topic → preferred motifs (first match wins; variant cycles within) */
const TOPICS = [
  { re: /agentic|agent/i, styles: ["agent", "particles"] },
  { re: /deep\s*learn|dl\b/i, styles: ["deep", "neural"] },
  { re: /machine\s*learn|\bml\b|neural/i, styles: ["neural", "particles"] },
  { re: /statisti|bayes|inference/i, styles: ["stats", "topo"] },
  { re: /pattern|vision|classif/i, styles: ["patterns", "stats"] },
  { re: /optimi[sz]|gradient|loss|minimi/i, styles: ["descent", "topo"] },
  { re: /drug|pharma|dock|pill|medicine/i, styles: ["capsule", "molecule"] },
  { re: /bio|chem|molecul|metabol|protein/i, styles: ["molecule", "flask", "dna"] },
  { re: /genetic-eng|crispr|genome/i, styles: ["dna", "lattice3d"] },
  { re: /material|crystal|lattice|solid/i, styles: ["lattice3d", "hexgrid"] },
  { re: /phys|simulat|dynamic|wave|field|energy/i, styles: ["waves", "rings", "blobs"] },
  { re: /math|kalman|message|factor|graph|probab/i, styles: ["topo", "particles", "stats"] },
  { re: /teach|educat|tutor|graduation/i, styles: ["graduation", "chart"] },
  { re: /data|analytic|dashboard/i, styles: ["chart", "stats"] },
  { re: /anomal|outlier/i, styles: ["starfield", "patterns"] },
  { re: /\bai\b|artificial/i, styles: ["agent", "neural", "blobs"] },
];

function pickStyle(slug, title, variant) {
  const hay = `${slug} ${title}`;
  for (const t of TOPICS)
    if (t.re.test(hay)) return t.styles[Math.abs(variant) % t.styles.length];
  return COVER_STYLES[Math.abs(variant) % COVER_STYLES.length];
}

function mulberry32(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function hashStr(s) {
  let h = 2166136261;
  for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

/* ------------------------------ motif scenes ------------------------------ */
/* each returns inner SVG art; wrapper adds bg + title typography */

function sceneDna(rnd, pal) {
  let out = "";
  const turns = 4, ampX = W * 0.16, midY = H * 0.42;
  for (let s = -1; s <= 1; s += 2) {
    const pts = [];
    for (let x = -30; x <= W + 30; x += 8)
      pts.push(`${x},${(midY + Math.sin((x / W) * turns * 6.28 + (s < 0 ? Math.PI : 0)) * ampX).toFixed(1)}`);
    out += `<polyline points="${pts.join(" ")}" fill="none" stroke="${s < 0 ? pal[0] : pal[1]}" stroke-width="5" opacity="0.9"/>`;
  }
  for (let x = 20; x < W; x += 30) {
    const ph = (x / W) * turns * 6.28;
    const y1 = midY + Math.sin(ph) * ampX;
    const y2 = midY + Math.sin(ph + Math.PI) * ampX;
    out += `<line x1="${x}" y1="${y1.toFixed(0)}" x2="${x}" y2="${y2.toFixed(0)}" stroke="#ffffff" opacity="0.35"/>
            <circle cx="${x}" cy="${y1.toFixed(0)}" r="5" fill="${pal[0]}"/><circle cx="${x}" cy="${y2.toFixed(0)}" r="5" fill="${pal[1]}"/>`;
  }
  return out;
}

function sceneMolecule(rnd, pal) {
  const nodes = Array.from({ length: 15 }, () => ({
    x: 90 + rnd() * (W - 180), y: 70 + rnd() * (H - 150), r: 11 + rnd() * 11,
  }));
  let out = "";
  nodes.forEach((n, i) => {
    nodes.map((m, j) => ({ j, d: Math.hypot(m.x - n.x, m.y - n.y), idx: j }))
      .filter(({ j, d }) => j !== i && d < 230)
      .slice(0, 3)
      .forEach(({ j }) => {
        out += `<line x1="${n.x.toFixed(0)}" y1="${n.y.toFixed(0)}" x2="${nodes[j].x.toFixed(0)}" y2="${nodes[j].y.toFixed(0)}" stroke="${pal[0]}" opacity="0.55" stroke-width="3"/>`;
      });
  });
  nodes.forEach((n, i) => {
    out += `<circle cx="${n.x.toFixed(0)}" cy="${n.y.toFixed(0)}" r="${n.r.toFixed(0)}" fill="${i % 2 ? pal[0] : pal[1]}"/>
            <circle cx="${(n.x - n.r * 0.3).toFixed(0)}" cy="${(n.y - n.r * 0.3).toFixed(0)}" r="${(n.r * 0.32).toFixed(0)}" fill="#ffffff" opacity="0.45"/>`;
  });
  return out;
}

function sceneNeural(rnd, pal, deep) {
  const layers = deep ? [4, 7, 9, 7, 5, 3] : [4, 6, 6, 3];
  void rnd;
  const colW = W / (layers.length + 1);
  let out = "";
  const centers = layers.map((count, li) =>
    Array.from({ length: count }, (_, i) => ({
      x: colW * (li + 1),
      y: H / 2 + (i - (count - 1) / 2) * (H * 0.72 / Math.max(count, 1)),
    }))
  );
  for (let li = 0; li < centers.length - 1; li++)
    for (const a of centers[li])
      for (const b of centers[li + 1])
        out += `<line x1="${a.x.toFixed(0)}" y1="${a.y.toFixed(0)}" x2="${b.x.toFixed(0)}" y2="${b.y.toFixed(0)}" stroke="${pal[0]}" opacity="0.18"/>`;
  centers.forEach((col, li) =>
    col.forEach((p) => {
      const grad = li / (centers.length - 1);
      out += `<circle cx="${p.x.toFixed(0)}" cy="${p.y.toFixed(0)}" r="${deep ? 10 : 13}"
        fill="${li === 0 ? pal[0] : li === centers.length - 1 ? pal[1] : mix(pal[0], pal[1], grad)}"
        stroke="#ffffff55"/>`;
    })
  );
  return out;
}

function mix(c1, c2, t) {
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [r1, g1, b1] = p(c1), [r2, g2, b2] = p(c2);
  const m = (x, y) => Math.round(x + (y - x) * t).toString(16).padStart(2, "0");
  return `#${m(r1, r2)}${m(g1, g2)}${m(b1, b2)}`;
}

function sceneDeep(rnd, pal) { return sceneNeural(rnd, pal, true); }

function sceneStats(rnd, pal) {
  void rnd;
  let out = "";
  const mu = W * 0.42, sig = W * 0.09;
  for (let x = 60; x < W - 40; x += 6) {
    const y = H * 0.72 - Math.exp(-((x - mu) ** 2) / (2 * sig ** 2)) * H * 0.52;
    out += `<circle cx="${x}" cy="${y.toFixed(0)}" r="2.6" fill="${pal[0]}"/>`;
  }
  const scatter = Array.from({ length: 26 }, () => {
    const x = 60 + rnd() * (W - 120);
    const noise = (rnd() - 0.5) * H * 0.22;
    const base = H * 0.72 - Math.exp(-((x - mu) ** 2) / (2 * sig ** 2)) * H * 0.52;
    return [x, base + noise];
  });
  out += scatter.map(p => `<circle cx="${p[0].toFixed(0)}" cy="${p[1].toFixed(0)}" r="2" fill="${pal[1]}" opacity="0.75"/>`).join("");
  out += `<line x1="${mu}" y1="${H * 0.14}" x2="${mu}" y2="${H * 0.76}" stroke="${pal[1]}" dash-array="4 4" stroke-dasharray="4 4" opacity="0.6"/>
          <text x="${mu + 6}" y="${H * 0.16}" font-family="monospace" font-size="13" fill="${pal[1]}">μ</text>`;
  return out;
}

function sceneDescent(rnd, pal) {
  void rnd;
  let out = "";
  const cx = W * 0.62, cy = H * 0.46;
  for (let ring = 1; ring <= 9; ring++) {
    const R = ring * 42;
    const pts = [];
    for (let k = 0; k <= 36; k++) {
      const th = (k / 36) * 6.283;
      const wob = Math.sin(th * 3 + ring) * 12;
      pts.push(`${(cx + Math.cos(th) * (R + wob)).toFixed(0)},${(cy + Math.sin(th) * (R + wob) * 0.6).toFixed(0)}`);
    }
    out += `<polyline points="${pts.join(" ")}" fill="none" stroke="${pal[0]}" opacity="${0.18 + ring * 0.05}"/>`;
  }
  // descent path from top-left to minimum
  let px = W * 0.16, py = H * 0.16;
  out += `<polyline points="`;
  for (let s = 0; s <= 14; s++) {
    px += (cx - px) * 0.28; py += (cy - py) * 0.28;
    out += `${px.toFixed(0)},${py.toFixed(0)} `;
  }
  out += `" fill="none" stroke="${pal[1]}" stroke-width="2.4"/>`;
  for (let s = 1; s <= 14; s++) {
    const t = s / 15;
    const zx = W * 0.16 + (cx - W * 0.16) * (1 - Math.pow(1 - t, 3));
    const zy = H * 0.16 + (cy - H * 0.16) * (1 - Math.pow(1 - t, 3));
    out += `<circle cx="${zx.toFixed(0)}" cy="${zy.toFixed(0)}" r="3" fill="${pal[1]}"/>`;
  }
  out += `<text x="${(cx + 14).toFixed(0)}" y="${(cy - 12).toFixed(0)}" font-family="monospace" font-size="16" fill="${pal[0]}">★ minimum</text>`;
  return out;
}

function scenePatterns(rnd, pal) {
  let out = "";
  const glyphs = ["▲", "●", "■", "◆"];
  for (let i = 0; i < 22; i++) {
    const x = 50 + rnd() * (W - 130);
    const y = 40 + rnd() * (H - 140);
    const g = glyphs[(rnd() * glyphs.length) | 0];
    out += `<text x="${x.toFixed(0)}" y="${y.toFixed(0)}" font-size="${(14 + rnd() * 12).toFixed(0)}" fill="${pal[rnd() > 0.5 ? 0 : 1]}" opacity="0.55">${g}</text>`;
  }
  // one highlighted template match
  const hx = W * 0.58, hy = H * 0.38;
  out += `<rect x="${hx - 44}" y="${hy - 36}" width="96" height="82" fill="none" stroke="${pal[1]}" stroke-width="2.5" rx="10" stroke-dasharray="8 5"/>
          <text x="${hx}" y="${hy + 10}" text-anchor="middle" font-size="30" fill="${pal[1]}">▲</text>
          <text x="${hx + 58}" y="${hy - 40}" font-family="monospace" font-size="12" fill="${pal[1]}">match ✓</text>`;
  return out;
}

function sceneAgent(rnd, pal) {
  void rnd;
  const cx = W / 2, cy = H * 0.44;
  const tools = [
    ["LLM", -210, -110], ["Memory", 205, -105], ["Tools", 215, 95], ["Sensors", -215, 90],
  ];
  let out = "";
  tools.forEach(([label, dx, dy]) => {
    out += `<line x1="${cx}" y1="${cy}" x2="${cx + dx}" y2="${cy + dy}" stroke="${pal[0]}" opacity="0.55" stroke-width="2"/>
            <line x1="${cx}" y1="${cy}" x2="${cx + dx}" y2="${cy + dy}" stroke="${pal[1]}" opacity="0.35" stroke-dasharray="5 5"/>
            <circle cx="${cx + dx}" cy="${cy + dy}" r="34" fill="var(--bg,#0a0e18)" stroke="${pal[1]}" stroke-width="2"/>
            <text x="${cx + dx}" y="${cy + dy + 5}" text-anchor="middle" font-family="monospace" font-size="14" fill="${pal[1]}">${label}</text>
            <circle cx="${(cx + dx) / 2}" cy="${(cy + dy) / 2}" r="4" fill="${pal[0]}"/>`;
  });
  out += `<circle cx="${cx}" cy="${cy}" r="64" fill="rgba(255,255,255,0.04)" stroke="${pal[0]}" stroke-width="2.5"/>
          <text x="${cx}" y="${cy + 7}" text-anchor="middle" font-family="monospace" font-weight="700" font-size="20" fill="${pal[0]}">AGENT</text>
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2.4s" repeatCount="indefinite"/>`;
  return out;
}

function sceneHexgrid(rnd, pal) {
  const size = 28 + ((hashStr(String(Math.floor(rnd() * 100)))) % 12);
  const hStep = size * 1.5, vStep = size * Math.sqrt(3);
  let out = "";
  for (let row = 0; row * vStep < H + size; row++)
    for (let col = 0; col * hStep < W + size; col++) {
      const cx = col * hStep + (row % 2 ? hStep / 2 : 0);
      const cy = row * vStep;
      const pts = Array.from({ length: 6 }, (_, k) => {
        const ang = (Math.PI / 3) * k - Math.PI / 6;
        return `${(cx + Math.cos(ang) * size * 0.55).toFixed(1)},${(cy + Math.sin(ang) * size * 0.55).toFixed(1)}`;
      }).join(" ");
      if (rnd() > 0.74)
        out += `<polygon points="${pts}" fill="${rnd() > 0.5 ? pal[0] : pal[1]}" opacity="${(0.08 + rnd() * 0.16).toFixed(2)}"/>`;
      else
        out += `<polygon points="${pts}" fill="none" stroke="${pal[0]}" opacity="0.17"/>`;
    }
  return out;
}

function sceneCircuit(rnd, pal) {
  let out = "";
  // central chip
  const chipW = 190, chipH = 190;
  const chipX = W / 2 - chipW / 2, chipY = H / 2 - chipH / 2;
  for (let i = 0; i < 9; i++) {
    let x = rnd() * W, y = rnd() * H;
    let d = `M ${x.toFixed(0)} ${y.toFixed(0)}`;
    let horizontal = rnd() > 0.5;
    for (let sgi = 0; sgi < 4; sgi++) {
      const len = 40 + rnd() * 110 * (rnd() > 0.5 ? 1 : -1);
      if (horizontal) x += len; else y += len;
      d += ` L ${x.toFixed(0)} ${y.toFixed(0)}`;
      horizontal = !horizontal;
    }
    out += `<path d="${d}" fill="none" stroke="${pal[0]}" opacity="0.5" stroke-width="1.7"/>
            <circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="4.2" fill="${pal[1]}"/>`;
  }
  out += `<rect x="${chipX}" y="${chipY}" width="${chipW}" height="${chipH}" rx="14"
            fill="rgba(255,255,255,0.03)" stroke="${pal[1]}" stroke-width="2"/>
          <rect x="${chipX + 55}" y="${chipY + 55}" width="${chipW - 110}" height="${chipH - 110}" rx="8"
            fill="none" stroke="${pal[0]}" stroke-width="1.4" opacity="0.7"/>
          <text x="${W / 2}" y="${H / 2 + 6}" text-anchor="middle" font-family="monospace" font-size="17" fill="${pal[0]}">AI</text>`;
  for (let k = 0; k < 8; k++) {
    const padX = chipX + 20 + (k % 4) * ((chipW - 40) / 3);
    out += `<line x1="${padX}" y1="${chipY}" x2="${padX}" y2="${chipY - 18}" stroke="${pal[1]}" stroke-width="2"/>
            <line x1="${padX}" y1="${chipY + chipH}" x2="${padX}" y2="${chipY + chipH + 18}" stroke="${pal[1]}" stroke-width="2"/>`;
  }
  return out;
}

function sceneWaves(rnd, pal) {
  let out = "";
  for (let l = 0; l < 7; l++) {
    const amp = 26 + rnd() * 66;
    const freq = 1.4 + rnd() * 2.4;
    const phase = rnd() * 6.28;
    const yBase = 84 + l * 56;
    const pts = Array.from({ length: 46 }, (_, k) => {
      const x = (k / 45) * W;
      const y = yBase + Math.sin(x / W * freq * 6.28 + phase) * amp;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
    out += `<polyline points="${pts}" fill="none" stroke="${l % 2 ? pal[1] : pal[0]}" stroke-width="${(1.2 + rnd()).toFixed(1)}" opacity="${(0.32 + l * 0.09).toFixed(2)}"/>`;
  }
  return out;
}

function sceneTopo(rnd, pal) {
  let out = "";
  const cx = W / 2 + (rnd() - 0.5) * 120, cy = H / 2 + (rnd() - 0.5) * 70;
  for (let ring = 1; ring <= 11; ring++) {
    const R = ring * 43;
    const pts = [];
    for (let k = 0; k <= 40; k++) {
      const th = (k / 40) * 6.283;
      const wob = Math.sin(th * (2 + (ring % 3)) + ring) * 15 + Math.cos(th * 3 - ring) * 9;
      pts.push(`${(cx + Math.cos(th) * (R + wob)).toFixed(0)},${(cy + Math.sin(th) * (R + wob) * 0.6).toFixed(0)}`);
    }
    out += `<polyline points="${pts.join(" ")}" fill="none" stroke="${ring % 2 ? pal[0] : pal[1]}" opacity="${0.25 + (ring % 4) * 0.09}" stroke-width="1.4"/>`;
  }
  return out;
}

function sceneBlobs(rnd, pal) {
  let out = '<defs><filter id="cb"><feGaussianBlur stdDeviation="40"/></filter></defs>';
  for (let i = 0; i < 7; i++) {
    out += `<circle cx="${(rnd() * W).toFixed(0)}" cy="${(rnd() * H).toFixed(0)}" r="${(95 + rnd() * 125).toFixed(0)}"
      fill="${i % 2 ? pal[0] : pal[1]}" opacity="${(0.11 + rnd() * 0.13).toFixed(2)}" filter="url(#cb)"/>`;
  }
  return out;
}

function sceneRings(rnd, pal) {
  void rnd;
  let out = "";
  for (let i = 1; i <= 13; i++)
    out += `<circle cx="${W / 2}" cy="${H / 2}" r="${i * 35}" fill="none"
      stroke="${i % 2 ? pal[0] : pal[1]}" opacity="${Math.max(0.08, 0.42 - i * 0.025)}"
      stroke-dasharray="${i % 3 === 0 ? "6 10" : "0"}" stroke-width="1.3"/>`;
  out += `<circle cx="${W / 2 + 170}" cy="${H / 2}" r="7" fill="${pal[0]}"/>
          <circle cx="${W / 2 - 108}" cy="${H / 2 - 104}" r="5.5" fill="${pal[1]}"/>
          <text x="${W / 2}" y="${H / 2 - 14}" text-anchor="middle" font-family="monospace" font-size="13" fill="${pal[0]}">★</text>`;
  return out;
}

function sceneStarfield(rnd, pal) {
  let out = "";
  for (let i = 0; i < 135; i++) {
    out += `<circle cx="${(rnd() * W).toFixed(0)}" cy="${(rnd() * H).toFixed(0)}"
      r="${(rnd() * 1.9 + 0.4).toFixed(1)}" fill="${rnd() > 0.82 ? pal[1] : "#ffffff"}"
      opacity="${(0.35 + rnd() * 0.6).toFixed(2)}"/>`;
  }
  const c = Array.from({ length: 7 }, () => [rnd() * W, rnd() * H]);
  out += `<polyline points="${c.map(p => `${p[0].toFixed(0)},${p[1].toFixed(0)}`).join(" ")}" fill="none" stroke="${pal[0]}" opacity="0.5"/>`;
  c.forEach(p => { out += `<circle cx="${p[0].toFixed(0)}" cy="${p[1].toFixed(0)}" r="3.2" fill="${pal[0]}"/>`; });
  return out;
}

function sceneFlask(rnd, pal) {
  void rnd;
  const cx = W / 2, cy = H * 0.46;
  return `
  <defs><clipPath id="flaskClip">
    <path d="M${cx - 26} ${cy - 120} L${cx - 26} ${cy - 40} L${cx - 92} ${cy + 88} A16 16 0 0 0 ${cx - 78} ${cy + 112} L${cx + 78} ${cy + 112} A16 16 0 0 0 ${cx + 92} ${cy + 88} L${cx + 26} ${cy - 40} L${cx + 26} ${cy - 120} Z"/>
  </clipPath></defs>
  <g clip-path="url(#flaskClip)">
    <rect x="${cx - 100}" y="${cy + 30}" width="200" height="100" fill="${pal[0]}" opacity="0.65">
      <animate attributeName="y" values="${cy + 34};${cy + 26};${cy + 34}" dur="4s" repeatCount="indefinite"/>
    </rect>
    <circle cx="${cx - 30}" cy="${cy + 70}" r="7" fill="${pal[1]}"><animate attributeName="cy" values="${cy + 80};${cy + 20};${cy + 80}" dur="3s" repeatCount="indefinite"/></circle>
    <circle cx="${cx + 20}" cy="${cy + 90}" r="5" fill="${pal[1]}"><animate attributeName="cy" values="${cy + 95};${cy + 30};${cy + 95}" dur="2.4s" repeatCount="indefinite"/></circle>
  </g>
  <path d="M${cx - 26} ${cy - 120} L${cx - 26} ${cy - 40} L${cx - 92} ${cy + 88} A16 16 0 0 0 ${cx - 78} ${cy + 112} L${cx + 78} ${cy + 112} A16 16 0 0 0 ${cx + 92} ${cy + 88} L${cx + 26} ${cy - 40} L${cx + 26} ${cy - 120} Z"
    fill="none" stroke="${pal[0]}" stroke-width="3"/>
  <rect x="${cx - 34}" y="${cy - 132}" width="68" height="14" rx="4" fill="${pal[1]}"/>
  <circle cx="${cx + 40}" cy="${cy - 90}" r="5" fill="${pal[1]}" opacity="0.85"><animate attributeName="opacity" values="0.2;0.9;0.2" dur="2s" repeatCount="indefinite"/></circle>
  <circle cx="${cx - 48}" cy="${cy - 60}" r="4" fill="${pal[0]}" opacity="0.8"><animate attributeName="opacity" values="0.9;0.2;0.9" dur="2.6s" repeatCount="indefinite"/></circle>`;
}

function sceneCapsule(rnd, pal) {
  void rnd;
  const cx = W / 2, cy = H / 2 - 20, r = 62, len = 240;
  const ang = -0.5;
  const dx = Math.cos(ang) * len / 2, dy = Math.sin(ang) * len / 2;
  return `
  <g transform="rotate(${(ang * 57.3).toFixed(1)} ${cx} ${cy})">
    <rect x="${cx - len / 2}" y="${cy - r}" width="${len}" height="${r * 2}" rx="${r}" fill="${pal[0]}"/>
    <path d="M${cx} ${cy - r} A${r} ${r} 0 0 0 ${cx} ${cy + r} L${cx + len / 2} ${cy + r} A${r} ${r} 0 0 0 ${cx + len / 2} ${cy - r} Z" fill="${pal[1]}"/>
    <rect x="${cx - len / 2 + 14}" y="${cy - r + 12}" width="${len / 2 - 24}" height="10" rx="5" fill="#ffffff" opacity="0.35"/>
    <line x1="${cx}" y1="${cy - r}" x2="${cx}" y2="${cy + r}" stroke="#ffffff" stroke-width="2" opacity="0.55"/>
  </g>
  ${Array.from({ length: 6 }, (_, i) => `<circle cx="${cx - 160 + i * 64}" cy="${cy + 150}" r="${3 + (i % 3)}" fill="${i % 2 ? pal[0] : pal[1]}" opacity="${0.4 + (i % 3) * 0.15}"/>`).join("")}
  <text x="${cx}" y="${cy + r + 90}" text-anchor="middle" font-family="monospace" font-size="15" letter-spacing="4" fill="${pal[1]}">RX · DRUG DESIGN</text>`;
}

function sceneChart(rnd, pal) {
  let out = "";
  const bx = W * 0.14, bw = W * 0.72, by = H * 0.72;
  const vals = [0.35, 0.55, 0.42, 0.78, 0.62, 0.92];
  const bwid = bw / vals.length - 14;
  vals.forEach((v, i) => {
    const bh = v * H * 0.5;
    out += `<rect x="${bx + i * (bwid + 14)}" y="${by - bh}" width="${bwid}" height="${bh}" rx="8"
      fill="${i === vals.length - 1 ? pal[1] : pal[0]}" opacity="${0.5 + i * 0.08}">
      <animate attributeName="height" values="0;${bh.toFixed(0)}" dur="0.8s" begin="${i * 0.12}s" fill="freeze"/>
      <animate attributeName="y" values="${by};${(by - bh).toFixed(0)}" dur="0.8s" begin="${i * 0.12}s" fill="freeze"/>
    </rect>`;
  });
  out += `<line x1="${bx - 14}" y1="${by}" x2="${bx + bw + 14}" y2="${by}" stroke="${pal[0]}" stroke-width="2"/>
          <polyline points="${vals.map((v, i) => `${bx + i * (bwid + 14) + bwid / 2},${by - v * H * 0.5 - 14}`).join(" ")}"
            fill="none" stroke="${pal[1]}" stroke-width="2.4" stroke-dasharray="6 4"/>`;
  return out;
}

function sceneGraduation(rnd, pal) {
  void rnd;
  const cx = W / 2, cy = H * 0.42;
  return `
  <g transform="translate(${cx} ${cy})">
    <path d="M-150 -30 L0 -95 L150 -30 L0 35 Z" fill="${pal[0]}"/>
    <path d="M-88 -4 L-88 52 Q0 92 88 52 L88 -4 L0 34 Z" fill="${pal[1]}" opacity="0.85"/>
    <line x1="150" y1="-30" x2="150" y2="60" stroke="${pal[1]}" stroke-width="5"/>
    <circle cx="150" cy="68" r="10" fill="${pal[1]}"/>
    <animateTransform attributeName="transform" type="translate" values="0 0; 0 -10; 0 0" dur="4s" repeatCount="indefinite" additive="sum"/>
  </g>
  ${Array.from({ length: 8 }, (_, i) => `<circle cx="${cx - 200 + i * 58}" cy="${cy + 150}" r="${2.5 + (i % 3)}" fill="${i % 2 ? pal[0] : pal[1]}" opacity="0.6"><animate attributeName="cy" values="${cy + 155};${cy + 130};${cy + 155}" dur="${3 + i * 0.3}s" repeatCount="indefinite"/></circle>`).join("")}`;
}

function sceneLattice3d(rnd, pal) {
  const pts = [];
  for (let x = 0; x < 3; x++)
    for (let y = 0; y < 3; y++)
      for (let z = 0; z < 3; z++) {
        const sx = x - 1, sy = y - 1, sz = z - 1;
        const px = W / 2 + (sx - sz * 0.5) * 95;
        const py = H * 0.46 + (sy + sz * 0.35) * 95 - sx * 18;
        pts.push({ px, py, x, y, z });
      }
  let out = "";
  pts.forEach((p, i) =>
    pts.slice(i + 1).forEach((q) => {
      const dist = Math.abs(p.x - q.x) + Math.abs(p.y - q.y) + Math.abs(p.z - q.z);
      if (dist === 1)
        out += `<line x1="${p.px.toFixed(0)}" y1="${p.py.toFixed(0)}" x2="${q.px.toFixed(0)}" y2="${q.py.toFixed(0)}" stroke="${pal[0]}" opacity="0.5" stroke-width="2"/>`;
    })
  );
  pts.sort((a, b) => a.py - b.py).forEach((p) => {
    out += `<circle cx="${p.px.toFixed(0)}" cy="${p.py.toFixed(0)}" r="${13 - (p.z * 2)}"
      fill="${p.z === 2 ? pal[1] : p.z === 0 ? pal[0] : mix(pal[0], pal[1], 0.5)}"
      stroke="#ffffff44" stroke-width="1.4"/>`;
  });
  return out;
}

const STYLE_FNS = {
  dna: sceneDna, molecule: sceneMolecule, particles: (r, p) => sceneNeural(r, p, false),
  neural: (r, p) => sceneNeural(r, p, false), deep: sceneDeep,
  stats: sceneStats, descent: sceneDescent, patterns: scenePatterns, agent: sceneAgent,
  hexgrid: sceneHexgrid, circuit: sceneCircuit, waves: sceneWaves, topo: sceneTopo,
  blobs: sceneBlobs, rings: sceneRings, starfield: sceneStarfield,
  flask: sceneFlask, capsule: sceneCapsule, chart: sceneChart,
  graduation: sceneGraduation, lattice3d: sceneLattice3d,
};

function dynamicCover({ slug, title, style, variant }) {
  const seed = hashStr(`${slug}|${title}|${style}|${variant}`);
  const rnd = mulberry32(seed);
  const palSet = PALETTES[seed % PALETTES.length];
  const pal = variant % 2 === 0 ? palSet : [...palSet].reverse();
  const chosenStyle =
    style && STYLE_FNS[style]
      ? style
      : pickStyle(slug, title, Number(variant || 0));
  const art = STYLE_FNS[chosenStyle](rnd, pal);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="dbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#050918"/><stop offset="1" stop-color="#0b1128"/>
    </linearGradient>
    <linearGradient id="dg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${pal[0]}"/><stop offset="1" stop-color="${pal[1]}"/>
    </linearGradient>
    <radialGradient id="dglow" cx="0.5" cy="0.42" r="0.6">
      <stop offset="0" stop-color="${pal[0]}" stop-opacity="0.30"/>
      <stop offset="1" stop-color="${pal[0]}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#dbg)"/>
  <rect width="${W}" height="${H}" fill="url(#dglow)"/>
  ${art}
  <rect width="${W}" height="${H}" fill="none" stroke="${pal[0]}33"/>
  <text x="44" y="${H - 56}" font-family="JetBrains Mono, monospace, sans-serif" font-size="34"
    font-weight="700" fill="url(#dg)">${title}</text>
  <text x="44" y="${H - 24}" font-family="JetBrains Mono, monospace, sans-serif" font-size="13"
    letter-spacing="4" fill="#8b93b0">${chosenStyle.toUpperCase()} — VARIANT ${variant}</text>
</svg>`;
}

/* ------------------------------- CLI dispatch ------------------------------- */

const argv = process.argv.slice(2);
const argOf = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : null; };
const cliSlug = argOf("--slug");
const cliTitle = argOf("--title");

if (cliSlug && cliTitle) {
  const file = `${cliSlug}.svg`;
  writeFileSync(
    path.join(outDir, file),
    dynamicCover({
      slug: cliSlug,
      title: cliTitle,
      style: argOf("--style") ?? "",
      variant: Number(argOf("--variant") ?? 0),
    })
  );
  console.log("wrote", file, `(motif=${argOf("--style") ?? "auto"}, v=${argOf("--variant") ?? 0})`);
  process.exit(0);
}

covers.forEach((c, i) => {
  writeFileSync(path.join(outDir, c.file), svgFor(c, i));
  console.log("wrote", c.file);
});
