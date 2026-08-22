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

  page.drawText("YOUSOF GHALENOEI", { x: 50, y, size: H1, font: bold, color: NAVY });
  y -= 16;
  page.drawText("M.Sc. in Computer Engineering — Artificial Intelligence & Robotics", {
    x: 50, y, size: 12, font: mono, color: TEAL,
  });
  y -= 14;
  page.drawText("y.ghalenoei@mail.um.ac.ir  |  Bojnurd, North Khorasan, Iran  |  (+98) 939 977 6021  |  github.com/YousofLHC", {
    x: 50, y, size: 8.5, font: font, color: GRAY,
  });
  y -= 26;

  section("ABOUT");
  for (const l of wrap("M.Sc. in Computer Engineering (Artificial Intelligence & Robotics) from Ferdowsi University of Mashhad, with a thesis on single-class anomaly detection based on an implicit convex hull and ensemble learning (grade: Excellent, 19.5/20). Holds a B.Sc. in Mathematics Education from Shahid Beheshti University of Mashhad and studied Computer Engineering at the University of Bojnurd. Completed courses in paper writing, machine learning, statistics, and optimization from credible educational sources. Interested in neural networks, machine learning, reinforcement learning, big data processing, and distributed systems.", 495)) {
    page.drawText(l, { x: 50, y, size: BODY, font });
    y -= 12;
  }
  y -= 8;

  section("EDUCATION");
  const edu = [
    ["M.Sc. Computer Engineering (AI & Robotics) — Ferdowsi University of Mashhad, 2022–2025 (Excellent, 19.5/20)",
     "Thesis: Single-class anomaly detection based on implicit convex hull and ensemble learning, under Prof. Hadi Sadoghi Yazdi."],
    ["B.Sc. Mathematics Education — Shahid Beheshti University of Mashhad, 2018–2022 (GPA 17.56/20)",
     "Graduated with a GPA of 17.56/20. Served as secretary of the mathematics scientific association."],
    ["B.Sc. Computer Engineering (studied) — University of Bojnurd, 2017–2019 (GPA 17/20)",
     "Government-funded computer engineering studies in North Khorasan."],
  ];
  for (const [t, d] of edu) {
    page.drawText(t, { x: 50, y, size: BODY, font: bold });
    y -= 12;
    for (const l of wrap(d, 495)) {
      page.drawText(l, { x: 60, y, size: BODY, font, color: GRAY });
      y -= 12;
    }
    y -= 4;
  }
  y -= 8;

  section("WORK EXPERIENCE");
  const exp = [
    ["Mathematics Teacher — Ministry of Education, Bojnurd, Feb 2022 – Present",
     "Teaching mathematics at the secondary level in Bojnurd, North Khorasan."],
    ["Secretary, Mathematics Scientific Association — Shahid Beheshti University of Mashhad, 2019–2021",
     "Organized seminars, workshops, and academic events for the mathematics scientific association."],
    ["Freelance Programmer — 2017–2020",
     "Developed software and data solutions in Python, R, C++, and PHP."],
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

  section("PROJECTS");
  page.drawText("Optimization of Solar Cells Using Genetic Algorithm — commissioned by Dr. Memar", { x: 50, y, size: BODY, font: bold });
  y -= 12;
  for (const l of wrap("Applied the genetic algorithm to tune solar-cell parameters, implemented in Python and R.", 495)) {
    page.drawText(l, { x: 60, y, size: BODY, font, color: GRAY });
    y -= 12;
  }
  y -= 8;

  section("TECHNICAL SKILLS");
  page.drawText("Languages:  Python, R, C++, PHP, Git, LaTeX", { x: 50, y, size: BODY, font: bold }); y -= 12;
  page.drawText("Math / ML:  Linear Algebra, Statistics, Machine Learning, Optimization", { x: 50, y, size: BODY }); y -= 12;
  page.drawText("Research:   Message Passing, Compression-Based Anomaly Detection, Proximal", { x: 50, y, size: BODY }); y -= 12;
  page.drawText("           Methods for Nonconvex Systems, Genetic Algorithms", { x: 50, y, size: BODY }); y -= 12;
  page.drawText("Languages:  Persian (Farsi) — Native;  English — Reading, Writing, Speaking, Listening", { x: 50, y, size: BODY }); y -= 20;

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
  page.drawText("yousofghalenoei.example.com/notes/kalman-filter-notes", { x: 50, y, size: 9.5, font: mono, color: TEAL });

  const bytes = await doc.save();
  writeFileSync(path.join(filesDir, "notes", "kalman-filter-notes.pdf"), bytes);
  console.log("wrote files/notes/kalman-filter-notes.pdf");
}

await makeCv();
await makeNotePdf();

