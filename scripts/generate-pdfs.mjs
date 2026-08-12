// Generates public/files/cv.pdf and note handouts using pdf-lib.
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const filesDir = path.join(process.cwd(), "public", "files");
mkdirSync(path.join(filesDir, "notes"), { recursive: true });

const NAVY = rgb(0.06, 0.14, 0.26);
const TEAL = rgb(0.05, 0.55, 0.68);
const GRAY = rgb(0.35, 0.38, 0.44);

async function makeCv() {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]); // A4 portrait
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const mono = await doc.embedFont(StandardFonts.Courier);

  let y = 800;
  const H1 = 22, H2 = 15, BODY = 10.5;
  const wrap = (text, width) => {
    const words = text.split(" ");
    const lines = [];
    let line = "";
    for (const w of words) {
      if (font.widthOfTextAtSize(line + w, BODY) > width) {
        lines.push(line.trim());
        line = w + " ";
      } else line += w + " ";
    }
    if (line.trim()) lines.push(line.trim());
    return lines;
  };

  const section = (title) => {
    y -= 22;
    page.drawLine({ start: { x: 50, y: y + 6 }, end: { x: 545, y: y + 6 }, thickness: 0.7, color: TEAL });
    page.drawText(title, { x: 50, y: y + 9, size: H2, font: bold, color: NAVY });
    y -= 14;
  };

  page.drawText("YOUSOF RAHIMI", { x: 50, y, size: H1, font: bold, color: NAVY });
  y -= 16;
  page.drawText("M.Sc. in Artificial Intelligence — AI Research Engineer", {
    x: 50, y, size: 12, font: mono, color: TEAL,
  });
  y -= 14;
  page.drawText("contact@yousof.example.com  |  Tehran, Iran  |  github.com/yousofrahimi  |  scholar: your_id", {
    x: 50, y, size: 8.5, font: font, color: GRAY,
  });
  y -= 26;

  section("RESEARCH INTERESTS");
  page.drawText("Approximate Message Passing, Graph Neural Networks, Kalman filtering, AI-driven drug design,", { x: 50, y, size: BODY, font });
  y -= 13;
  page.drawText("metabolic engineering, material informatics, AI agentic systems.", { x: 50, y, size: BODY, font });
  y -= 20;

  section("EDUCATION");
  page.drawText("M.Sc. Artificial Intelligence — Amirkabir Univ. of Technology (Tehran Polytechnic), 2024–2026 (GPA 4.0/4.0)", { x: 50, y, size: BODY, font: bold });
  y -= 12;
  for (const l of wrap("Thesis: Message Passing and Graph Neural Networks for High-Dimensional Inference.", 495)) {
    page.drawText(l, { x: 60, y, size: BODY, font, color: GRAY });
    y -= 12;
  }
  y -= 4;
  page.drawText("B.Sc. Computer Engineering — University of Tehran, 2019–2023 (Top 3%)", { x: 50, y, size: BODY, font: bold });
  y -= 20;

  section("PUBLICATIONS (SELECTED)");
  const pubs = [
    "GAMP-GNN: Message Passing Meets GNNs for Model-Based Compressed Sensing — ICML 2026 (under review)",
    "DiffMolecule: Guided Diffusion over Graphs for De Novo Drug Design — JCIM (in press)",
    "Data-Driven Flux Prediction in Genome-Scale Metabolic Models — Metabolic Engineering (2025)",
    "CrystalFormer: Bond-Aware Transformer for Inorganic Property Prediction — npj Comput. Mater. (2025)",
    "Invariant EKF with Learned Noise Models for Multi-Sensor Fusion — IEEE TAES short (2024)",
  ];
  for (const p of pubs) {
    for (const l of wrap("• " + p, 495)) {
      page.drawText(l, { x: 50, y, size: BODY, font });
      y -= 12;
    }
    y -= 2;
  }
  y -= 8;

  section("RESEARCH & WORK EXPERIENCE");
  const exp = [
    ["Research Assistant — Sparse Inference Lab, 2024–Present",
     "AMP-based iterative algorithms and GNN message-passing layers for compressed sensing; PyTorch prototypes."],
    ["ML Engineer (part-time) — Computational Chemistry Startup, 2025–Present",
     "Owned ADMET property prediction; 2x virtual screening throughput; retrosynthesis prototype."],
    ["Teaching Assistant — Machine Learning, 2024–2025",
     "Designed Bayesian-methods labs and 10+ Jupyter notebooks for 90+ students; TA excellence award."],
  ];
  for (const [t, d] of exp) {
    page.drawText(t, { x: 50, y, size: BODY, font: bold });
    y -= 12;
    for (const l of wrap(d, 495)) {
      page.drawText(l, { x: 60, y, size: BODY, font, color: GRAY });
      y -= 12;
    }
    y -= 4;
  }
  y -= 8;

  section("TECHNICAL SKILLS");
  page.drawText("Languages:  Python, Julia, C++, SQL", { x: 50, y, size: BODY, font: bold }); y -= 12;
  page.drawText("ML / DL:    PyTorch, PyG, JAX, TensorFlow, Scikit-learn", { x: 50, y, size: BODY }); y -= 12;
  page.drawText("Sci. tools: RDKit, OpenMM, GROMACS, COBRApy, ASE/Pymatgen", { x: 50, y, size: BODY }); y -= 12;
  page.drawText("Theory:     Probability, Optimization & Duality, Filtering & Control, Graph/Spectral theory", { x: 50, y, size: BODY }); y -= 20;

  const bytes = await doc.save();
  writeFileSync(path.join(filesDir, "cv.pdf"), bytes);
  console.log("wrote files/cv.pdf");
}

async function makeNotePdf() {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const mono = await doc.embedFont(StandardFonts.Courier);

  let y = 780;
  page.drawText("STUDY NOTE · MATHEMATICS OF ML", { x: 50, y, size: 11, font: mono, color: TEAL });
  y -= 24;
  page.drawText("The Kalman Filter from First Principles", { x: 50, y, size: 20, font: bold, color: NAVY });
  y -= 16;

  const lines = [
    ["1 · The model", true],
    ["Linear Gaussian state-space: x_t = A x_(t-1) + w_t,   z_t = H x_t + v_t,", false],
    ["with w ~ N(0, Q), v ~ N(0, R). The filter maintains p(x_t | z_(1:t)) = N(x_hat_t, P_t).", false],
    ["", false],
    ["2 · Prediction step", true],
    ["x_hat_(t|t-1) = A x_hat_(t-1),   P_(t|t-1) = A P_(t-1) A^T + Q", false],
    ["", false],
    ["3 · Update (correction) step", true],
    ["Innovation:      y_t = z_t - H x_hat_(t|t-1)", false],
    ["Kalman gain:     K_t = P_(t|t-1) H^T (H P_(t|t-1) H^T + R)^(-1)", false],
    ["Posterior:       x_hat_t = x_hat_(t|t-1) + K_t y_t", false],
    ["                 P_t = (I - K_t H) P_(t|t-1)", false],
    ["", false],
    ["4 · Why it works", true],
    ["The Kalman gain is the MAP/MMSE estimator: it weighs model vs. measurement", false],
    ["by their covariance - a theme shared with Approximate Message Passing, where", false],
    ["beliefs play the role of (x_hat, P) pairs. Hover over the interactive derivations", false],
    ["on the web version for step-by-step algebra.", false],
  ];

  for (const [text, isHead] of lines) {
    if (text === "") { y -= 8; continue; }
    page.drawText(text, { x: isHead ? 50 : 66, y, size: isHead ? 12.5 : 11, font: isHead ? bold : font, color: NAVY });
    y -= isHead ? 20 : 15;
  }

  page.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 0.5, color: TEAL });
  y -= 18;
  page.drawText("Full interactive version with LaTeX, diagrams and a runnable notebook:", { x: 50, y, size: 9.5, font, color: GRAY });
  y -= 14;
  page.drawText("yousof.example.com/notes/kalman-filter-notes", { x: 50, y, size: 9.5, font: mono, color: TEAL });

  const bytes = await doc.save();
  writeFileSync(path.join(filesDir, "notes", "kalman-filter-notes.pdf"), bytes);
  console.log("wrote files/notes/kalman-filter-notes.pdf");
}

await makeCv();
await makeNotePdf();

