# ARCHITECTURE.md

> Complete technical reference for **Yousof Ghalenoei's personal portfolio site**.
> Read this file to understand every system, file, and workflow before making changes.

---

## 1 · Overview

| | |
|---|---|
| **Framework** | Next.js 16.3.0 (Turbopack) + React 19 |
| **Styling** | Tailwind CSS v4 (`@theme inline` tokens) + custom CSS in `src/app/globals.css` |
| **Deployment** | GitHub Pages — static export (`output: "export"`) at `/YousofLHC/` basePath |
| **Live URL** | `https://yousoflhc.github.io/YousofLHC/` |
| **Repo** | `https://github.com/YousofLHC/YousofLHC.git` (branch: `master`, deploy: `gh-pages`) |
| **Admin panel** | `http://localhost:3000/admin` (local-only, excluded from export) |
| **Admin password** | `@Yousof1378` (in `.env.local` as `ADMIN_PASSWORD`) |
| **Design system** | Dark: cinematic void · Light: Warm Editorial Paper (Kimi-inspired) |

### Core philosophy
- **Content as data**: all editable content lives in `content/data/*.json` — never hardcode text in components.
- **Schema-driven admin**: adding a field to `content-schema.ts` automatically appears in the admin panel.
- **No-JS-safe rendering**: every page renders meaningful content without JavaScript.
- **Performance-first**: images are WebP, JS is code-split, CSS is minimal, simulations are lazy-loaded.

---

## 2 · Project Structure

```
phd-website/
├── content/                          # ← SOURCE OF TRUTH (editable via admin)
│   ├── data/
│   │   ├── site.json                 # Site identity, socials, nav links
│   │   └── content.json              # Profile, résumé, publications, skills, projects, services, domains
│   ├── posts/                        # Blog articles (.mdx)
│   ├── notes/                        # Study notes (.mdx)
│   ├── projects/                     # Project pages (.mdx)
│   └── notebooks/                    # Jupyter notebooks (.ipynb)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout (fonts, FluidBg, ScrollProgress, NoiseOverlay)
│   │   ├── globals.css               # ALL styles: tokens, themes, components, animations
│   │   └── (site)/
│   │       ├── page.tsx              # Homepage (hero, about, research, timeline, work, hub, contact)
│   │       ├── layout.tsx            # Site layout (navbar + footer)
│   │       ├── resume/page.tsx       # CV page
│   │       ├── blog/                 # Blog list + [slug] pages
│   │       ├── notes/                # Notes list + [slug] pages
│   │       ├── projects/             # Projects list + [slug] pages
│   │       ├── notebooks/            # Notebook list + [slug] pages
│   │       ├── publications/page.tsx # Publications list
│   │       └── connect/page.tsx      # Contact page
│   │
│   ├── app/admin/                    # ← ADMIN PANEL (excluded from export)
│   │   ├── (auth)/login/             # Login page + rate-limited action
│   │   ├── (shell)/                  # Authenticated pages (sidebar layout)
│   │   │   ├── page.tsx              # Dashboard
│   │   │   ├── data/page.tsx         # Data Studio (all content.json + site.json sections)
│   │   │   ├── resume/page.tsx       # Résumé Studio (section-scoped live preview)
│   │   │   ├── posts/page.tsx        # Blog posts manager
│   │   │   ├── notes/page.tsx        # Study notes manager
│   │   │   ├── projects/page.tsx     # Projects manager
│   │   │   ├── notebooks/page.tsx    # Notebook upload/manager
│   │   │   ├── media/page.tsx        # Media manager
│   │   │   ├── settings/page.tsx     # Site settings (site.json sections)
│   │   │   └── github/page.tsx       # GitHub Pages deploy dashboard
│   │   ├── github/actions.ts         # Server actions for GH API (token from httpOnly cookie)
│   │   ├── actions.ts                # Server actions for content CRUD, media, notebooks, covers
│   │   └── preview-action.ts         # Server-side MDX → HTML renderer for live preview
│   │
│   ├── components/
│   │   ├── landing/cinematic-hero.tsx   # Hero: Editorial Frame slideshow + meta bar
│   │   ├── site/
│   │   │   ├── navbar.tsx               # Fixed navbar with theme toggle
│   │   │   ├── footer.tsx               # Footer with social links
│   │   │   ├── fluid-bg.tsx             # Fluid ink cursor background
│   │   │   ├── mouse-glow.tsx           # Delegated mouse-tracker for CSS glow
│   │   │   └── cover-media.tsx          # img/video renderer for any cover format
│   │   ├── admin/
│   │   │   ├── data-studio-v2.tsx       # Schema-driven Data Studio (all sections)
│   │   │   ├── schema-form.tsx          # Generic form engine from content-schema.ts
│   │   │   ├── resume-studio.tsx        # Résumé Studio with live preview
│   │   │   ├── article-editor.tsx       # MDX article editor (toolbar, preview, frontmatter)
│   │   │   ├── article-manager.tsx      # Article list with draft badge
│   │   │   ├── cover-picker.tsx         # Cover CRUD (thumbnails, generate, upload, delete)
│   │   │   ├── tag-input.tsx            # Chip-style tag editor (commas allowed inside)
│   │   │   ├── notebook-manager.tsx     # .ipynb drag-drop upload
│   │   │   ├── github-studio.tsx        # GitHub Pages deploy dashboard
│   │   │   ├── mouse-glow.tsx           # Mouse-tracker for [data-glow] elements
│   │   │   └── editor/
│   │   │       ├── toolbar.tsx          # Snippet inserter (Greek, LaTeX, TikZ, mhchem, sims…)
│   │   │       └── preview.tsx          # Live preview (server-rendered HTML)
│   │   ├── sims/                        # Interactive simulations
│   │   │   ├── catalog.ts               # Sim metadata (id, title, group, desc)
│   │   │   ├── kit.tsx                  # Shared toolkit (palette, slider, plot, canvas)
│   │   │   ├── sim.tsx                  # <Sim id="…" /> lazy wrapper
│   │   │   └── packs/                   # Simulation implementations
│   │   │       ├── physics.tsx          # Logistic map, pendulum, wave, MC-π, descent, walk
│   │   │       ├── complex.tsx          # Ising, Kepler, perceptron, k-means
│   │   │       ├── chem.tsx             # Michaelis-Menten, titration, Boltzmann, Beer-Lambert
│   │   │       └── bio.tsx              # LJ-MD, HP folding, docking, binding, Ramachandran, DNA melt, PK
│   │   ├── ui/
│   │   │   ├── code-block.tsx           # Prism syntax highlighter (dual theme)
│   │   │   ├── mermaid.tsx              # Mermaid diagram renderer (isolated instance)
│   │   │   ├── tikz-view.tsx            # TikZ renderer via TikzJax (lazy WASM)
│   │   │   ├── math-plot.tsx            # 7 force-field interactive plots
│   │   │   ├── theme-toggle.tsx         # Sun/Moon theme switcher
│   │   │   └── reveal.tsx               # CSS-first reveal animation (no JS needed)
│   │   ├── blog/post-card.tsx           # Blog/note card with CoverMedia
│   │   ├── projects/project-grid.tsx    # Filterable project grid
│   │   └── mdx/mdx-components.tsx       # MDX component map (CodeBlock, Mermaid, Sim, Callout…)
│   │
│   ├── lib/
│   │   ├── site.ts                      # Barrel: re-exports generated/site.ts
│   │   ├── data.ts                      # Barrel: re-exports generated/content.ts
│   │   ├── mdx.ts                       # MDX pipeline (evaluate, renderArticle, listArticles)
│   │   ├── notebooks.ts                 # .ipynb parser + lister
│   │   ├── tags.ts                      # Tag utilities
│   │   ├── social-presets.ts            # Social network presets (icon map)
│   │   ├── admin/
│   │   │   ├── auth.ts                  # Session token + brute-force rate limiter
│   │   │   ├── store.ts                 # CRUD operations (articles, JSON, media, notebooks, covers)
│   │   │   ├── content-schema.ts        # Schema registry (drives admin forms + validation)
│   │   │   └── gh-token.ts              # AES-256-GCM encrypted httpOnly cookie for GH token
│   │   └── generated/                   # ← AUTO-GENERATED (do not edit)
│   │       ├── site.ts                  # From content/data/site.json
│   │       └── content.ts               # From content/data/content.json
│   │
│   └── proxy.ts                         # Middleware: guards /admin/* GET navigations
│
├── scripts/
│   ├── generate-content.mjs             # content/data/*.json → src/lib/generated/*.ts
│   ├── generate-covers.mjs              # Cover SVG generator (21 motifs, CLI + batch)
│   ├── generate-notebook.mjs            # .ipynb → public/notebooks/ + registry
│   ├── generate-pdfs.mjs                # cv.pdf + notes PDFs
│   ├── export-static.mjs                # Static export build (copies to .pages-project, runs next build)
│   ├── optimize-images.mjs              # sharp WebP converter (one-shot or on-demand)
│   ├── admin-smoke.mjs                  # Automated smoke test (CRUD + HTTP probes)
│   ├── theme-init.js                    # Pre-paint theme + JS class + SW registration
│   ├── ts-register.mjs                  # Node loader for extensionless .ts imports
│   └── ts-extension-hook.mjs            # Resolve hook for the above
│
├── public/
│   ├── assets/scenes/UseThisHeros/      # ← Hero slideshow images (drop files here)
│   ├── covers/                          # Generated SVG covers
│   │   └── uploads/                     # User-uploaded covers (any format)
│   ├── media/                           # Admin-uploaded media
│   ├── notebooks/                       # Synced .ipynb files
│   ├── figures/                         # Article figures (SVG)
│   └── sw.js                            # Service worker (cache-first assets, network-first nav)
│
├── out/                                 # Static export output (gitignored)
├── .pages-project/                      # Disposable copy for export build (gitignored)
└── .env.local                           # Secrets (gitignored): ADMIN_PASSWORD, GITHUB_TOKEN
```

---

## 3 · Content Pipeline

### 3.1 Source of Truth

All editable content lives in two JSON files:

| File | Contents |
|---|---|
| `content/data/site.json` | name, shortName, tagline, title, description, url, location, email, availability, calendly, formspree, logo, socialLinks[], navLinks[] |
| `content/data/content.json` | profile, stats[], education[], experience[], publications[], awards[], certifications[], skills[], languages[], projects[], services[], domains[] |

### 3.2 Generation

```
content/data/*.json
        │
        ▼  node scripts/generate-content.mjs
src/lib/generated/site.ts       (typed exports for site config)
src/lib/generated/content.ts    (typed exports for all content arrays)
        │
        ▼  imported via @/lib/site and @/lib/data
All pages and components
```

**To add a new field:** add it to the JSON file AND to `content-schema.ts` (for admin UI). The generator automatically includes all keys from the JSON.

### 3.3 Articles (MDX)

Blog posts, notes, and projects are `.mdx` files in `content/{posts,notes,projects}/`.
Frontmatter fields: `title`, `description`, `date`, `tags[]`, `cover`, `draft`, `readTime` (auto), plus `subject`/`order`/`pdf` for notes.

Rendered via `renderArticle()` in `lib/mdx.ts` using `next-mdx-remote-client/rsc` with:
- `remark-math` + `remark-gfm` (tables, footnotes, strikethrough)
- `rehype-katex` + `katex/contrib/mhchem` (math + chemistry)
- Full MDX component map (Callout, Diagram, Figure, NotebookCard, Sim, CodeBlock, Mermaid…)

### 3.4 Notebooks (.ipynb)

Uploaded via admin → stored in `content/notebooks/` → synced to `public/notebooks/` by `generate-notebook.mjs` → rendered by `notebook-viewer.tsx` with KaTeX, mhchem, Prism, and output cells (stream, HTML, images).

---

## 4 · Admin Panel

### 4.1 Authentication

| Setting | Value |
|---|---|
| Password | Set in `.env.local` as `ADMIN_PASSWORD` |
| Session | HMAC-signed httpOnly cookie (`yg_admin`), 7-day TTL |
| Rate limit | 5 failed attempts / 10 min per IP |
| Proxy | `src/proxy.ts` guards `/admin/*` GET navigations only (POSTs pass to actions which call `requireAdmin()` themselves) |

### 4.2 Pages

| Route | Purpose |
|---|---|
| `/admin` | Dashboard |
| `/admin/data` | **Data Studio** — schema-driven editor for ALL content.json + site.json sections. Import/export JSON, undo, per-file Save→auto-regenerate |
| `/admin/resume` | **Résumé Studio** — résumé-only sections with live HTML preview (rendered through production MDX/KaTeX/mhchem pipeline) + cv.pdf regeneration |
| `/admin/settings` | Site identity, social links (12 presets + custom), navbar order |
| `/admin/posts` | Blog posts manager (create, edit, delete, draft badge) |
| `/admin/notes` | Study notes manager |
| `/admin/projects` | Projects manager |
| `/admin/notebooks` | Drag-drop .ipynb upload/delete |
| `/admin/media` | Media file manager |
| `/admin/github` | GitHub Pages deploy dashboard |

### 4.3 Schema System

`src/lib/admin/content-schema.ts` defines every editable field:
- `SECTIONS[]` — each with `key`, `label`, `file`, `kind` (object/objectArray), `fields[]`, `addDefault`
- `SECTION_META` — per-section `liveImpact` (what changes on the site) and `guide[]` (how-to bullets)
- Field types: `text`, `textarea`, `markdown`, `number`, `boolean`, `select`, `tags`, `icon`, `color`, `sublist`
- `scalarArray: true` on a sublist field means items are raw values (e.g., bio paragraphs are `string[]`)

`schema-form.tsx` renders forms from these definitions. Adding a field to the schema = it appears in admin automatically.

### 4.4 Save Pipeline

```
Admin Save → writeJsonFile(file, data) → runGenerateData() → generate-content.mjs → src/lib/generated/*.ts updated → revalidatePath
```

- **Fast path** (~100ms): `runGenerateData()` → only content generation
- **Full chain**: `runContentGenerate()` → content + covers + notebooks + PDFs (used by Publish button)
- **PDF regeneration**: `regeneratePdfs()` → only `generate-pdfs.mjs`

---

## 5 · Theme System

### 5.1 Resolution Order

```
1. localStorage("theme")     ← user's saved choice (always wins)
2. prefers-color-scheme      ← browser setting (first visit only)
3. "light"                   ← fallback
```

Set by `scripts/theme-init.js` (injected into `<head>` before first paint — no flash).
`document.documentElement.dataset.theme` is set to `"light"` or `"dark"`.
`document.documentElement.classList.add("js")` enables JS-gated CSS (stagger animations).

### 5.2 Token Architecture

All colors flow through CSS custom properties defined in `globals.css`:

```css
:root, [data-theme="dark"] { --t-void: #07090f; --t-ink: #edeff5; ... }
[data-theme="light"]       { --t-void: #F4F0E8; --t-ink: #242422; ... }
```

Mapped to Tailwind via `@theme inline { --color-void: var(--t-void); ... }`.

### 5.3 Light Mode Design — "Warm Editorial Paper"

Inspired by the Kimi/Moonshot AI interactive research explainer:

| Token | Value | Feel |
|---|---|---|
| void | `#F4F0E8` | Warm cream/parchment |
| panel | `#FFFDF8` | Warm white cards |
| ink | `#242422` | Warm near-black |
| line | `rgba(36,36,34,.09)` | Warm hairlines |
| cyan | `#3F6F9F` | Scholarly blue |
| violet | `#9367B5` | Soft violet |
| accent | `#e63700` | Heyoz orange (unchanged) |

All shadows use warm `rgba(36,36,34,…)` tones. Grid pattern uses warm neutral lines.
Vignette at 0.06, scan at 0.18, fluid at 0.24 (multiply blend) — all nearly invisible.

### 5.4 Dark Mode Design — "Cinematic Void"

Unchanged from original design: `#07090f` void, `#4fc8e8` cyan, `#9c8ce0` violet,
`#ff3d00` heyoz orange accent, screen-blend fluid at 0.38, vignette 0.5.

---

## 6 · Hero & Cover System

### 6.1 Hero — "Editorial Frame"

`src/components/landing/cinematic-hero.tsx`

Two-column layout: left = text content, right = **Editorial Frame**.

**Editorial Frame** (right column):
- Portrait 4:5 glass mat (`--t-glass-bg`, backdrop-blur) with rounded image window
- Crossfade slideshow of images from `public/assets/scenes/UseThisHeros/`
- Slow 22s ken-burns zoom per slide
- Bottom glass meta bar: `01/06` index · `TAG — Title` · clickable progress segments
- Play/pause toggle (top-right)
- Gentle 11s float animation, ±1.6° mouse tilt

**Slideshow source**: images are **auto-discovered** from the folder.
Drop a `.webp`/`.jpg`/`.png` file into `public/assets/scenes/UseThisHeros/` → it becomes a slide.
Tag/title are derived from the filename (e.g., `dna-helix.jpg` → `BIOINFORMATICS — Dna Helix`).

**Background layers** (behind the frame):
- `hx-mesh` — drifting radial gradients
- `hx-grid` — radial-masked grid lines
- `hx-vignette` — edge darkening
- `hx-scan` — one-time cyan sweep on load
- `hx-bracket` — HUD corner brackets (orange)
- `hx-orb` ×3 — blurred color orbs
- `hx-cursor-glow` — lerped cursor follower (dark mode only)
- `hx-scrollhint` — SCROLL indicator with animated line

### 6.2 Cover System

**Generation**: `scripts/generate-covers.mjs`
```bash
# Auto motif by topic matching (slug/title keywords)
node scripts/generate-covers.mjs --slug my-post --title "My Post Title"

# Explicit style + variant
node scripts/generate-covers.mjs --slug my-post --title "My Post" --style dna --variant 2
```

**21 motifs**: dna, molecule, particles, neural, deep, stats, descent, patterns, agent,
hexgrid, circuit, waves, topo, blobs, rings, starfield, flask, capsule, chart, graduation, lattice3d

**Topic matching**: slug/title is regex-scanned against `TOPICS[]` — e.g., "drug design" → `capsule`/`molecule`, "agentic AI" → `agent`, "statistical" → `stats`.

**Uploads**: `saveCoverUpload()` stores any `webp/avif/jpg/png/gif/svg/mp4/webm/m4v` file
(≤8 MB) in `public/covers/uploads/`. Rendered via `<CoverMedia>` (img for images, video for videos).

**Admin CRUD**: CoverPicker component in the article editor provides:
- Thumbnail grid of all covers (generated + uploaded)
- Generate (auto or explicit style)
- Variant ⟳ (cycle layout)
- Upload (any format)
- Delete (per-thumbnail ✕ + "Delete selected" button)

### 6.3 Rendering

The hero uses `next/image` with `fill` + `sizes` for optimized delivery.
`--t-code-bg` is theme-aware: dark `#0a0e18` / light `#f6f8fb` — code blocks always readable.

---

## 7 · Rendering Pipeline

### 7.1 MDX

All articles use MDX rendered server-side via `evaluate()` from `next-mdx-remote-client/rsc`.

Pipeline: `remark-math` → `remark-gfm` → `rehype-katex` (with mhchem) → `rehype-slug`

**mhchem**: registered via `import "katex/contrib/mhchem"` in `lib/mdx.ts` (top-level side-effect).
The `npm overrides` in `package.json` (`"katex": "$katex"`) ensures a single katex instance
across all consumers (rehype-katex, contrib, direct imports) — without it, nested copies
cause `\ce{}` to render as raw text.

### 7.2 Supported Math & Chemistry

| Feature | Syntax | Rendered by |
|---|---|---|
| Inline math | `$E = mc^2$` | KaTeX |
| Display math | `$$…$$` | KaTeX |
| Chemistry | `\ce{H2O}`, `\ce{CO2 + H2O <=> H2CO3}` | KaTeX mhchem |
| Physical units | `\pu{0.5 mol L-1}` | KaTeX mhchem |
| Environments | `align`, `gather`, `multline`, `split`, `cases`, `pmatrix`, `bmatrix`, `vmatrix`, `array` | KaTeX |
| TikZ diagrams | ````tikz … ```` fenced block | TikzJax (lazy WASM) |
| Mermaid diagrams | ````mermaid … ```` fenced block | Mermaid v11 (isolated instance) |
| Code blocks | ````python/r/cpp/bash/latex… ```` | Prism (dual theme) |

### 7.3 MDX Components

Available in any `.mdx` file:
- `<Callout type="note|tip|warning|danger" title="…">` — styled callout boxes
- `<Diagram chart={`
mermaid…`} caption="…" />` — Mermaid with caption
- `<Figure src="…" alt="…" caption="…" />` — Lightbox image
- `<NotebookCard slug="…" />` — Links a notebook page
- `<Sim id="…" />` — Interactive simulation
- `<LJPlot />`, `<BondPlot />`, etc. — Force-field visualizations

### 7.4 Simulations

21 interactive simulations in `src/components/sims/packs/` — pure SVG/canvas, zero chart libraries.
Lazy-loaded via `<Sim id="…" />` (next/dynamic, ssr:false). Pages without sims pay zero bytes.

Topics covered: logistic map, double pendulum, 1-D wave, Monte-Carlo π, gradient descent,
random walk, Ising 2-D, Kepler orbits, perceptron, k-means, Michaelis–Menten, titration,
Boltzmann, Beer–Lambert, LJ mini-MD, HP protein folding, docking scan, binding isotherm,
Ramachandran, DNA melting, pharmacokinetics.

---

## 8 · Performance

### 8.1 Images
- All photos converted to **WebP** via `scripts/optimize-images.mjs` (sharp)
- Total image weight: ~1.6 MB (down from 45.5 MB)
- LCP hero slide preloaded via `ReactDOM.preload()`
- `next/image` with `fill` + `sizes` for responsive delivery
- `images.unoptimized: true` in export mode (no server-side optimization on GH Pages)

### 8.2 JavaScript
- No framer-motion (removed entirely)
- Simulations lazy-loaded via `next/dynamic` with `ssr: false`
- `MarkdownPreview` in article editor lazy-loaded
- `serverExternalPackages: ["katex", "rehype-katex", "next-mdx-remote-client"]` prevents dual-instance bugs

### 8.3 CSS
- `content-visibility: auto` + `contain-intrinsic-size` on below-fold sections
- `.reveal` animations are CSS-only (no JS gating)
- Stagger animations gated behind `html.js` class (no-JS visitors see content immediately)

### 8.4 Fluid Background
- `src/components/site/fluid-bg.tsx` — low-res dye field advected by curl-noise
- Pointer-gated (idle until first mousemove), ~21 fps cap, DPR=1
- Dark: `mix-blend-mode: screen` @ 0.38 opacity
- Light: `mix-blend-mode: multiply` @ 0.24 opacity, deep ink palette
- Disabled on mobile (≤768 px) and `prefers-reduced-motion`

### 8.5 Service Worker (`public/sw.js`)
- `/YousofLHC/admin/*` → **network-only** (never cached)
- `/_next/static/*` + images/fonts → **cache-first** (immutable)
- Navigations → **network-first** (offline → cached page or homepage shell)
- Other same-origin GETs → **stale-while-revalidate** (LRU cap 150 entries)
- Cache versioned per deploy via `__BUILD_VER__` stamping in `export-static.mjs`
- Registered from pre-paint head script (production HTTPS hosts only)

---

## 9 · Deployment

### 9.1 CLI Method

```bash
# 1. Build static export
$env:PAGES_BASE_PATH = "/YousofLHC"
npm run build:pages

# 2. Deploy gh-pages (worktree method)
git worktree add .ghpages-tmp origin/gh-pages
Get-ChildItem .ghpages-tmp -Force -Exclude ".git" | Remove-Item -Recurse -Force
Copy-Item "out\*" ".ghpages-tmp\" -Recurse -Force
git -C .ghpages-tmp add -A
git -C .ghpages-tmp commit -m "Deploy <version> (<sha>)"
git -C .ghpages-tmp push origin HEAD:gh-pages
git worktree remove .ghpages-tmp --force

# 3. Push source
git push origin master
```

### 9.2 Dashboard Method

1. `npm run dev` → `http://localhost:3000/admin`
2. Login with admin password
3. Go to **GitHub Pages** page
4. **Connect** tab: paste your fine-grained PAT (Contents: RW + Pages: RW)
   - Or set `GITHUB_TOKEN` in `.env.local` for automatic connection
5. **Deploy** tab: tick *rebuild static export* → press **Build & Deploy to Pages**
6. Watch the progress bar (branch → tree → upload → prune → pages → done)

### 9.3 Security

| Layer | Implementation |
|---|---|
| Admin auth | HMAC-signed httpOnly cookie, 7-day TTL, brute-force rate limit (5/10min) |
| GH token | AES-256-GCM encrypted httpOnly cookie, 12h TTL, env default fallback |
| Token storage | Server-side only — never in localStorage, never in client bundle |
| Proxy | GET-only guard on /admin/* — POSTs pass to actions which self-enforce auth |
| SW | /admin/* bypassed (network-only) — stale admin pages never served |
| Export | Admin pages excluded from static export (`.pages-project` excludes src/app/admin) |
| Secrets | `.env.local` is gitignored (`.env*` pattern) |

---

## 10 · Commands

| Command | What it does |
|---|---|
| `npm run dev` | Generate content + start dev server (Turbopack, on-demand compile) |
| `npm run build` | Generate content + production build (type-checks, no export) |
| `npm run build:pages` | Static export for GitHub Pages (set `PAGES_BASE_PATH=/YousofLHC`) |
| `npm run start` | Serve production build (after `npm run build`) |
| `npm run lint` | ESLint |
| `npm run smoke` | Admin smoke test (store CRUD + HTTP probes) |
| `npm run gen:data` | Regenerate typed content modules only (~100ms) |
| `npm run generate` | Full generate: content + covers + notebooks + PDFs |
| `npm run covers` | Generate cover SVGs (legacy batch) |

---

## 11 · Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| CSS not loading on GH Pages | `prefixAssets` regex missing paths | Check `out/index.html` CSS hrefs have `/YousofLHC/` prefix |
| Code invisible in light mode | `--t-code-bg` not theme-aware | Verify light `#f6f8fb` / dark `#0a0e18` in globals.css |
| `\ce{}` renders as raw text | katex dual-instance (nested node_modules) | Verify `overrides.katex` in package.json, re-run `npm install` |
| Content changes not appearing | Dev server not restarted after generate | Restart `npm run dev` |
| Admin pages 404 | Stale session cookie after password rotation | Log out, log back in |
| Images not updating | Browser cache or SW serving stale assets | Hard refresh (`Ctrl+Shift+R`) or DevTools → Application → Service Workers → Unregister |
| Turbopack lockfile warning | Two package-lock.json files (root + .pages-project) | Harmless during export; `turbopack.root` pins the correct root |
| Hero slideshow not updating | Images must be in `UseThisHeros/` folder | Check file extension is supported (.webp/.jpg/.png) |

---

## 12 · Key Design Decisions

| Decision | Rationale |
|---|---|
| Static export (not SSR) | GitHub Pages hosting — zero cost, zero server |
| Content as JSON (not CMS database) | Git-versioned, admin-writable, no external service |
| Dark code blocks on light pages | Standard pattern (Stripe, GitHub embeds) — `--t-code-bg` always dark |
| CSS-only reveal animations | Content visible without JS — critical for slow connections |
| `useSyncExternalStore` for theme | Proper SSR hydration — no flash of wrong theme |
| Fluid canvas pointer-gated | Zero main-thread cost until user interacts |
| Warm paper light mode | Inspired by Kimi/Moonshot AI research explainer — scholarly, editorial |
| Heyoz orange `#FF3D00` | Single accent color across all primary buttons, logo, highlights |

---

*Last updated: Version7.2 deploy · This file is the single source of documentation for the site architecture. Keep it in sync with major changes.*
