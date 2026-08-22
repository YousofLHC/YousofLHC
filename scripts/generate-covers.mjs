// Generates abstract gradient cover SVGs into public/covers/
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const outDir = path.join(process.cwd(), "public", "covers");
mkdirSync(outDir, { recursive: true });

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
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="520" viewBox="0 0 900 520">
  <defs>
    <linearGradient id="bg${i}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#050918"/>
      <stop offset="1" stop-color="#0b1128"/>
    </linearGradient>
    <linearGradient id="g${i}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${a}"/>
      <stop offset="1" stop-color="${b}"/>
    </linearGradient>
    <radialGradient id="glow${i}" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${a}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="${a}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="900" height="520" fill="url(#bg${i})"/>
  <rect width="900" height="520" fill="none" stroke="${a}22" stroke-width="1"/>
  <g stroke="${b}1a" stroke-width="1">
    ${Array.from({ length: 14 }, (_, k) => `<line x1="${(k * 66 + seed) % 900}" y1="0" x2="${(k * 66 + seed) % 900}" y2="520"/>`).join("\n")}
    ${Array.from({ length: 9 }, (_, k) => `<line x1="0" y1="${(k * 60 + seed) % 520}" x2="900" y2="${(k * 60 + seed) % 520}"/>`).join("\n")}
  </g>
  <circle cx="${450 + Math.sin(seed) * 120}" cy="${240 + Math.cos(seed) * 80}" r="190" fill="url(#glow${i})"/>
  <g transform="translate(450 250)">
    ${Array.from({ length: 12 }, (_, k) => {
      const ang = (k / 12) * Math.PI * 2;
      const r = 130 + (k % 3) * 26;
      const x = Math.cos(ang) * r;
      const y = Math.sin(ang) * r;
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="${k % 2 ? a : b}" fill-opacity="0.75">
        <animate attributeName="r" values="5;9;5" dur="${(2 + (k % 3) * 0.4).toFixed(1)}s" repeatCount="indefinite"/>
      </circle>`;
    }).join("\n")}
  </g>
  <text x="44" y="430" font-family="JetBrains Mono, monospace, sans-serif" font-size="34" font-weight="700" fill="url(#g${i})">${title}</text>
  <text x="44" y="464" font-family="JetBrains Mono, monospace, sans-serif" font-size="15" letter-spacing="4" fill="#8b93b0">AI × SCIENCE — ${String(seed).padStart(3, "0")}</text>
</svg>`;
}

covers.forEach((c, i) => {
  writeFileSync(path.join(outDir, c.file), svgFor(c, i));
  console.log("wrote", c.file);
});
