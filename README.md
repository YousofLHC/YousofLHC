# AI Researcher Platform — Resume · Networking · Knowledge Hub

A cutting-edge, dark-mode-first personal website for an M.Sc. in Artificial
Intelligence graduate who is actively applying for PhD positions, research
collaborations, and industry work across **ML/DL, Approximate Message Passing,
Graph Neural Networks, Kalman filtering, AI-driven drug design, metabolic
engineering, material informatics, and AI agentic systems**.

Built as a **triple-threat platform**:

| Pillar | Route | What it does |
| --- | --- | --- |
| Resume & Portfolio | `/` `/resume` `/projects` | Interactive timeline, web-native CV (printable PDF), project deep-dives with sub-domain filtering |
| Networking & Client portal | `/connect` | Multi-purpose contact form, Calendly scheduling, research-interests heatmap |
| Educational Knowledge Hub | `/notes` `/blog` `/notebooks` | Structured study notes + PDF handouts, MDX articles, and fully rendered Jupyter notebooks |

---

## Tech stack

- **Next.js 16** (App Router, static generation) · React 19 · TypeScript
- **Tailwind CSS v4** custom dark design system (glassmorphism, deep-space gradients)
- **Three.js** — interactive molecular/knowledge-graph background with cursor trail
- **Motion (Framer Motion)** — scroll reveals & layout animations
- **KaTeX + mhchem** — LaTeX math *and* chemical formulas (`\ce{...}`, `\pu{...}`)
- **Mermaid.js** — live-rendered flowcharts & diagrams
- **Prism** (prism-react-renderer) — syntax-highlighted code with copy buttons
- **Custom lightbox** — zoom, pan, full-screen for high-res figures
- **next-mdx-remote-client** — MDX pipeline (remark-math, remark-gfm, rehype-katex, rehype-slug)
- **pdf-lib** (dev) — generates the downloadable CV / handout PDFs
- Auto cross-linking & auto-tagging across posts, notes, notebooks, and projects

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all 21+ routes prerendered as static)
npm start          # serve the production build
```

---

## Project structure

```
├── src/
│   ├── app/                  # App Router pages
│   │   ├── page.tsx          # Landing (Three.js molecular graph hero)
│   │   ├── resume/           # Web-native CV, timeline, skills, publications
│   │   ├── projects/         # Filterable project grid + [slug] deep-dives
│   │   ├── notes/            # Educational hub — subject-organized notes
│   │   ├── blog/             # MDX articles with math/chemistry/diagrams
│   │   ├── notebooks/        # Rendered Jupyter notebooks + [slug]
│   │   └── connect/          # Contact form, Calendly, interests heatmap
│   ├── components/
│   │   ├── three/            # molecular-graph.tsx (WebGL background)
│   │   ├── ui/               # lightbox, mermaid, code-block, heatmap, reveal
│   │   ├── mdx/              # mdx-components.tsx (MDX component registry)
│   │   └── notebook/         # notebook-viewer / notebook-card
│   └── lib/
│       ├── site.ts           # ⭐ YOUR identity, email, links, Calendly, Formspree
│       ├── data.ts           # ⭐ persona content (bio, resume, projects, interests)
│       ├── mdx.ts            # MDX pipeline + content loaders
│       ├── notebooks.ts      # .ipynb parser (cells, outputs, plots, tables)
│       └── tags.ts           # auto-tagging + related-content scoring
├── content/
│   ├── posts/                # *.mdx blog articles
│   ├── notes/                # *.mdx study notes (subject in frontmatter)
│   └── projects/             # *.mdx project deep-dives
├── public/
│   ├── notebooks/            # *.ipynb source files (downloadable, parsed at build)
│   ├── covers/               # generated gradient cover SVGs
│   ├── figures/              # high-res SVG figures (lightbox-ready)
│   └── files/                # cv.pdf + note handouts
└── scripts/                  # generate-covers / generate-notebook / generate-pdfs
```

---

## ⭐ Making it yours

Everything about *you* lives in two files:

1. **`src/lib/site.ts`** — name, tagline, email, location, GitHub/LinkedIn/Scholar
   URLs, Calendly link, and your Formspree endpoint ID.
2. **`src/lib/data.ts`** — bio paragraphs, stats, education, experience,
   publications, skills, awards, projects, services, and the ten research domains
   (these also drive the Three.js graph and the heatmap).

Edit those two files, tweak the covers/persona text, and you're live.

---

## Writing content

### Blog posts & notes (`content/posts/*.mdx`, `content/notes/*.mdx`)

```mdx
---
title: "My article title"
description: "One or two sentence summary"
date: "2026-02-01"
tags: ["Graph Neural Networks", "PyTorch"]
readTime: 12
cover: "/covers/some-cover.svg"
subject: "Mathematics"        # notes only — drives the subject hierarchy
pdf: "/files/notes/some.pdf"  # notes only — downloadable handout
---

# Content… everything below supports:
```

Supported inside any article/note/project:

| You want… | Write… |
| --- | --- |
| LaTeX math | `$x = A^{-1}b$` or `$$\int_0^\infty$$` (KaTeX, auto-rendered) |
| Chemical formulas | `$$\ce{C6H6 + H2SO4 -> C6H5SO3H + H2O}$$` (mhchem) |
| Units | `$\pu{0.5 mol L^{-1}}$` (mhchem `\pu`) |
| Flowchart/diagram | ```` ```mermaid flowchart LR … ``` ```` |
| High-res figure + lightbox | `<Figure src="/figures/x.svg" alt="…" caption="…"/>` |
| Highlighted code | ```` ```python … ``` ```` (copy button included) |
| Callouts | `<Callout type="note|tip|warning" title="…">…</Callout>` |
| Notebook embed | `<NotebookCard slug="gnn-molecular-property-prediction"/>` |
| Mermaid w/ caption | `<Diagram chart="graph LR; A-->B" caption="…"/>` |

### Projects

Add a `Project` entry to `projects` in `src/lib/data.ts` (powers the grid +
filters), then optionally drop `content/projects/<slug>.mdx` for a deep-dive page.

### Notebooks

Drop any `.ipynb` into `public/notebooks/`. Add site-relevant metadata in the
notebook's `metadata` object:

```json
"metadata": {
  "title": "…", "description": "…", "date": "2026-01-01",
  "tags": ["Graph Neural Networks"], "cover": "/covers/x.svg"
}
```

Cells are parsed at build time: markdown + LaTeX render natively, code cells get
syntax highlighting + copy, and outputs (plots, HTML tables, streams, errors) are
restored. The `.ipynb` is downloadable and a "Open in Colab" link is generated.

---

## Regenerating generated assets

Cover SVGs, the demo notebook, and the PDFs are generated by scripts:

```bash
npm run generate
```

- `scripts/generate-covers.mjs` → `public/covers/*.svg`
- `scripts/generate-notebook.mjs` → `public/notebooks/gnn-molecular-property-prediction.ipynb`
- `scripts/generate-pdfs.mjs` → `public/files/cv.pdf` + note handouts

Edit the scripts (or `src/lib/site.ts` / `src/lib/data.ts`) and re-run to refresh.

---

## Features map (vs. the brief)

- ✅ Interactive 3D **molecular-AI knowledge graph** (Three.js) with domain nodes,
  chemical-bond-like edges, cursor trail, and `prefers-reduced-motion` support
- ✅ Dark-mode-first **glassmorphism** design system, Inter + JetBrains Mono
- ✅ **Framer Motion** scroll reveals & filtered-grid animations
- ✅ **LaTeX + mhchem** chemistry rendering in every article/note/notebook
- ✅ **SVG/raster lightbox** with zoom, pan, full-screen, keyboard shortcuts
- ✅ **Mermaid** diagrams
- ✅ **Jupyter notebook** integration: styled cells, plots, tables, download `.ipynb`,
  copy-code per cell, Colab link
- ✅ **Cross-linking & auto-tagging** (`src/lib/tags.ts`) → "Connected knowledge" rails
- ✅ Embedded-PDF CV + web-native printable resume (`Ctrl/Cmd+P`)
- ✅ Multi-purpose contact form + Calendly embed + research-interests heatmap

## Deployment

- **Vercel** (recommended): import the repo → `npm run build` → auto-CI/CD.
- **Netlify**: build command `npm run build`, publish dir `.next`.

Notes:
- This branch uses `next build` (Turbopack). If you ever hit "native bindings not
  available" on a given machine, reinstall the platform SWC package:
  `npm install --force` (this repo has fixed that already).
- The previous static bilingual (fa/en) site is backed up at
  `%LOCALAPPDATA%\Temp\opencode\phd-website-backup` if you need any of its content.
