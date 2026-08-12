# AI_ONBOARDING.md — Complete System Guide

> This document is written specifically for **other AI agents** (and future maintainers) so they can
> instantly understand the entire project: what it is, how it works end-to-end, what every section
> does, and the conventions/gotchas that must not be broken.

---

## 1. TL;DR

A production-style **personal academic website + CMS** for **Yousof Ghalenoei** — AI Research
Engineer, M.Sc. in Artificial Intelligence, Ferdowsi University of Mashhad (advisor:
Prof. Hadi Sadoghi Yazdi). Research fields: **Approximate Message Passing (AMP), Graph Neural
Networks (GNNs), Kalman filtering, drug discovery / molecular design, molecular dynamics (NAMD/VMD),
material informatics, metabolic engineering, AI agents**.

Two worlds live in one Next.js app:

- **Public site** (`src/app/(site)/`) — portfolio/resume/blog/notes/projects/notebooks/connect,
  heavily focused on scientific content rendering (KaTeX + mhchem, Mermaid diagrams, prism code
  highlighting, interactive Jupyter notebooks).
- **Admin panel** (`src/app/admin/`) — a password-protected CMS: file-based article CRUD with a
  **scientific Markdown/MDX editor** (toolbar, code/latex/diagram snippets, import/export, live
  preview that matches production rendering), plus editors for site config, profile data, media
  library, and notebooks.

**Content is stored as plain files** (`content/*.mdx`, `content/data/*.json`,
`content/notebooks/*.ipynb`) — no database. JSON configs are compiled to TypeScript by a codegen
step at build time; MDX is compiled at request time (SSG/dynamic).

---

## 2. Quickstart

```bash
npm install                      # install (Node 20+; developed on Node 24 / npm 10)
npm run dev                      # = npm run generate && next dev   → http://localhost:3000
npm run build                    # = npm run generate && next build (required before start)
npm run start                    # production server
npm run lint                     # eslint (must be clean)
npm run generate                 # codegen: json -> src/lib/generated/*.ts + covers/notebooks/pdf
```

**Login to admin:** open `/admin` → redirected to `/admin/login`. Password comes from the
`ADMIN_PASSWORD` env var (dev value in `.env.local`, which is gitignored — never commit it).

> **Windows/PowerShell gotcha:** in smoke tests always use `curl.exe` — PowerShell's
> `Invoke-WebRequest` **silently drops the `Cookie:` header**.

---

## 3. Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js **16.3.0** (App Router, **Turbopack** builds) |
| React | 19.2.8 |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"` in `globals.css`) + **design tokens as CSS variables** (`--t-*`) with **dark AND light palettes** (`data-theme` attr, no-FOUC inline script, `ThemeToggle`). Surface classes: `card`, `glass`, `glass-strong`, `btn`/`btn-primary`/`btn-ghost`, `chip`, `.rich` prose, `.section-kicker` |
| MDX | `next-mdx-remote-client/rsc` `evaluate()` with remark-math, remark-gfm, rehype-katex (+`katex/contrib/mhchem`), rehype-slug |
| Diagrams | `mermaid` (client component, **theme-aware** — live-swaps light/dark `themeVariables` via `data-theme` observer) |
| Code highlight | `prism-react-renderer` (nightOwl theme) — site and admin preview |
| Icons | `lucide-react` |
| 3D hero | `three` / `@react-three/fiber`-style custom canvas (molecular graph) |
| Motion | `motion` (formerly framer-motion) |
| Notebooks | raw `.ipynb` JSON parsed server-side, rendered by custom `notebook-viewer.tsx` |
| Storage | filesystem only (`content/`, `public/media/`, `public/notebooks/`, `public/covers/`, `public/files/`) |
| Auth | HMAC-SHA256 signed session cookie (no DB, no OAuth) |

---

## 4. Architecture at a glance

```
content/                          ← SINGLE SOURCE OF TRUTH (hand-editable + admin-editable)
├── posts/*.mdx                   blog articles (frontmatter = metadata)
├── notes/*.mdx                   study notes (extra: subject, order, pdf)
├── projects/*.mdx                project deep-dives (extra: status, repo, links)
├── notebooks/*.ipynb             interactive notebooks (copied to public/ at generate)
└── data/
    ├── site.json                 site identity/nav/socials/SEO (admin editable)
    └── content.json              profile, stats, education, experience, publications,
                                  awards, certifications, skills, languages, projects,
                                  services, domains (admin editable via **Data Studio**: visual tabs + raw JSON)

scripts/                          codegen (run by `npm run generate`)
├── generate-content.mjs          site.json+content.json → src/lib/generated/{site,content}.ts (validates!)
├── generate-covers.mjs           writes public/covers/*.svg from MDX frontmatter
├── generate-notebook.mjs         copies content/notebooks → public/notebooks
└── generate-pdfs.mjs             copies content/pdf → public/files

src/
├── proxy.ts                      ← Next 16 renamed middleware (guards /admin/*)
├── lib/
│   ├── site.ts / data.ts         BARRELS → `export *` (importers keep working)
│   ├── content-types.ts          data interfaces + lucide icon registry
│   ├── generated/{site,content}.ts  AUTO-GENERATED (never edit)
│   ├── mdx.ts                    listArticles / renderArticle / readTime
│   ├── notebooks.ts              .ipynb parser + colab link builder
│   └── admin/{auth,store}.ts     auth + file-based storage layer
├── app/
│   ├── (site)/                   public pages + shared Navbar/Footer layout
│   └── admin/                    CMS (see §6)
└── components/
    ├── admin/…                   CMS UI (editor, toolbar, managers, forms…)
    ├── landing/…                 hero + science-visual (molecular graph SVG)
    ├── knowledge/…               notes+notebooks hub
    ├── notebook/…                notebook card/viewer
    ├── mdx/mdx-components.tsx    the MDX component map (Callout, Diagram, NotebookCard…)
    └── ui/…                      Mermaid, CodeBlock, Lightbox, Reveal…

public/                           build output targets (covers, notebooks, files, media)
```

### Data flow

```
content/data/*.json ──generate-content.mjs──▶ src/lib/generated/*.ts ──▶ pages/SEO/resume…
content/*.mdx ────────mdx.ts (evaluate)────▶ React elements (SSG/SSR at build/request)
content/notebooks ────generate-notebook.mjs──▶ public/notebooks/*.ipynb ──▶ notebook pages
```

- `npm run build` **always** runs `generate` first, so JSON edits take effect after a rebuild.
- In production, the **admin panel** can trigger regeneration at runtime via
  `runContentGenerate()` (`npm run generate` through `execFile`), then pages are revalidated.
- Public pages revalidate immediately for **article** changes (`revalidatePath` after save);
  **JSON** changes need the "Save & regenerate" button (or rebuild).

---

## 5. Public site — routes & purpose

| Route | Purpose | Rendering |
| --- | --- | --- |
| `/` | Landing: hero (typed roles), focus chips (7 domains), animated molecular-graph visual, about, marquee, stats, publications, services, contact CTA | Static |
| `/resume` | CV-style page: education, experience, skills, publications, awards, certifications, languages | Static |
| `/projects` | Project grid (from `projects` in content.json) + link to deep-dives | Static |
| `/projects/[slug]` | Project article (MDX from `content/projects/`) | SSG |
| `/notes` | **Knowledge hub**: tabs All / Study notes / Notebooks; reads URL hash (`#notebooks`) to preselect tab | Static |
| `/notes/[slug]` | Note article (MDX from `content/notes/`) | SSG |
| `/notebooks` | → redirects to `/notes#notebooks` (kept for old links) | — |
| `/notebooks/[slug]` | Interactive notebook viewer (cells, outputs, colab/download links) | SSG |
| `/blog` | Blog index (articles from `content/posts/`) | Static |
| `/blog/[slug]` | Blog article | SSG |
| `/connect` | Contact form (Formspree or mailto fallback) + heatmap + socials | Static |
| `/admin/*` | CMS (see next section) | Dynamic |

### The merge decision (history, do not revert)

Notes and Notebooks were merged into **one hub at `/notes`** with tabs. Detail pages remain at
`/notes/[slug]` and `/notebooks/[slug]`. `/notebooks` redirects to `/notes#notebooks` so old links
keep working. `KnowledgeHub` is a client component that reads the URL hash on mount (via a **lazy
`useState` initializer** — do not move it back into `useEffect`, eslint enforces this).

---

## 6. Admin panel (`/admin`) — deep dive

### 6.1 Auth flow (no DB)

- `ADMIN_PASSWORD` env var (required). `ADMIN_SECRET` optional override.
- `src/lib/admin/auth.ts`: `createSessionToken()` = base64url(`{exp}`) + `.` + HMAC-SHA256 signature.
  Cookie: `yg_admin`, **7-day** expiry, validated with `timingSafeEqual`.
- `src/proxy.ts` (Next 16: **`proxy` file, not `middleware`** — Node runtime) redirects
  unauthenticated `/admin/*` → `/admin/login?next=<path>`. Login/logout always allowed.
- `src/app/admin/(auth)/layout.tsx` redirects already-authed users away from the login page.
- `/admin/logout` route clears the cookie.
- All server actions in `src/app/admin/actions.ts` re-verify the session via `guard()` (which
  rethrows `NEXT_REDIRECT` — never swallow it).

### 6.2 Storage layer (`src/lib/admin/store.ts`)

- `requireAdmin()` — throws redirect if not authed (used by all admin pages/actions).
- `sanitizeSlug()` — lowercases, strips non `[a-z0-9]`, collapses dashes; falls back to
  `item-<timestamp>`. **Path traversal is impossible** (verified by E2E test). **Do not weaken.**
- `saveArticle(kind, slug, frontmatter, body)` — new slug ⇒ writes a new file; unchanged slug ⇒
  rewrites in place (gray-matter `stringify`). Returns the effective slug.
- `readArticleSource`, `deleteArticle` (scoped to the kind folder), `listMedia/uploadMedia/deleteMedia`
  (sanitized names under `public/media/`), `readJsonFile/writeJsonFile` (`content/data/*.json`),
  `runContentGenerate()` (runs `npm run generate` via `execFile` with a
  `/*turbopackIgnore: true*/` marker — keep that comment, it stops Turbopack from tracing the
  whole project into the server bundle).

### 6.3 Server actions (`src/app/admin/actions.ts`)

`getArticle`, `createOrUpdateArticle` (auto-sets `readTime`, revalidates `/`, list, and detail
paths), `removeArticle`, `getSiteConfig`/`saveSiteConfig`, `getContentConfig`/`saveContentConfig`,
`getMedia`/`uploadMediaFile`/`removeMediaFile`, `publish()` (regenerates content). All wrapped in
`guard()` → `ActionResult<T>` = `{ ok, error?, data? }`.

### 6.4 Sections

| Section | Route | What it does |
| --- | --- | --- |
| Dashboard | `/admin` | **Analytics-style dashboard** (server-computed): hero north-star metric + month trend, KPI cards with mini sparklines, publishing-activity bars (8 months), content-mix donut, next-action shortcuts, recent-changes feed, system/disk panel |
| Blog posts / Study notes / Projects | `/admin/{posts,notes,projects}` | Table + delete + "New" (uses `ArticleManager`) |
| **Editor** | `/admin/{kind}/[slug]` & `/admin/{kind}/new` | The scientific MDX editor (below) |
| Notebooks | `/admin/notebooks` | Read-only list of notebooks (sizes, view links) |
| Site settings | `/admin/settings` | Structured form for `site.json` (identity, contact, socials, nav links list) + Save & regenerate |
| Profile & data | `/admin/data` | **Data Studio** (`data-studio.tsx`): tabbed visual editors (Profile, Timeline, Publications, Skills, Projects, Services, Domains) + Raw JSON tab; sticky save bar with dirty tracking, Save / Save & regenerate |
| Media | `/admin/media` | Upload/delete files to `public/media/`, copy usage paths |
| GitHub Pages | `/admin/github` | **GitHub Studio** — connect any GitHub account (PAT), list/create repos, run the static export build server-side, upload `out/` to a branch via the Contents API (no git binary), enable Pages, live build status (8 s polling) |
| Login/Logout | `/admin/login`, `/admin/logout` | Auth entry/exit |

### 6.5 The scientific editor (this is the heart)

`src/components/admin/article-editor.tsx` + `src/components/admin/editor/`:

- **Frontmatter form** per kind: title, date, description, slug, tags, cover; notes additionally
  subject/order/pdf; plus a `draft` toggle. `readTime` is recomputed on save.
- **Toolbar** (`editor/toolbar.tsx`): bold/italic/inline-code, inline/display math, image, link,
  table, horizontal rule; **code-block dropdown** (python, r, cpp, bash, javascript, typescript,
  latex, matlab, sql, json, yaml, text); **callout dropdown** (note/tip/warning/danger);
  mermaid insert; and a **Snippets menu** with ready-made scientific templates:
  - Python: RDKit descriptors, PyTorch training loop, from-scratch GNN message-passing layer, numpy
  - R/ggplot2: publication plot, dplyr pipeline
  - C++/Eigen: linear algebra, basic main
  - Bash: **NAMD** MD-simulation script, **VMD** visualization+render script, SLURM submission
  - LaTeX: `align` derivation, `cases`, `pmatrix`, **`tikzpicture` neural-network diagram**, `\ce` mhchem reactions
  - Mermaid: flowchart with subgraphs, neural-network diagram, **roadmap (timeline)**, gantt plan, sequence, state diagrams
  - MDX components: `<Callout>`, `<Diagram>`, `<NotebookCard>`, `<Figure>`/lightbox images
- **Live preview** (`editor/preview.tsx`) with **true production parity**: body is sent (350 ms
  debounced) to the `renderArticlePreview` server action (`src/app/admin/preview-action.ts`), which
  compiles it through the **exact same `mdxOptions` + `getMdxComponents()` pipeline as the public
  site** — Callout, Diagram, NotebookCard, Figure/Lightbox, mermaid, prism CodeBlock, KaTeX with
  mhchem. On compile error, a lightweight react-markdown fallback keeps the pane usable and the
  error is shown in a banner. Client-side only: debounced server round-trip per keystroke pause.
- **Import/Export**: export current article as a `.mdx` file (YAML frontmatter via `js-yaml` dump);
  import an existing `.mdx` (parsed with `gray-matter` client-side) and load it into the editor.
- **Statistics bar**: words / chars / lines / read-time / code-block count, plus a clickable
  **heading outline** that jumps the cursor to any heading.
- **Syntax help** panel (`?` button) documenting every supported construct.
- Insertions respect the cursor selection (restored via `requestAnimationFrame`).

> ⚠️ The editor's textarea is **controlled** (`value={state.body}`). Never mutate the DOM node
> directly; all inserts go through the `insert()` state updater. Selection is tracked in
> `selRef` via onSelect/onClick/onKeyUp.

### 6.6 What the site renders that the preview understands

MDX component map lives in `src/components/mdx/mdx-components.tsx`: `pre` → mermaid or `CodeBlock`;
`img` → `Lightbox` (caption from title attr); `a` → internal `Link` or external link with arrow;
plus custom components `Figure`, `Diagram`, `Callout` (note/tip/warning/danger), `NotebookCard`.
These are the only custom components supported in content MDX — use them in the toolbar snippets.

### 6.8 GitHub Studio (deploy to GitHub Pages from the admin)

`src/app/admin/github/actions.ts` (server actions, guarded) — all GitHub API only, no git
binary required:

- `validateGhToken` → `GET /user`; `listRepos` → `GET /user/repos`; `createRepo` → `POST /user/repos`
  (auto-init README). Token is stored in **localStorage** (`yg_gh_token`) client-side and passed
  per-request — never logged.
- `buildStaticExport` → runs `npm run build:pages` on the server (needs a full Node install,
  i.e. VPS/Railway/Render — not Vercel serverless). The export step also strips the Turbopack
  aux files (`__next.*`, per-page `index.txt` twins) that this Next version leaks into `out/`,
  and writes an empty `out/.nojekyll` (without it GitHub Pages runs Jekyll and silently drops
  the `_next/` folder → site without CSS/JS). The deploy manifest additionally skips such paths.
- `deployToPages` → local manifest from `out/`; blob SHAs computed locally (sha1 of
  `blob <size>\0<bytes>`) to skip unchanged files; ensures the target branch via `git/refs`;
  then uses the **git-data API** — `POST git/blobs` (concurrency 6) → `POST git/trees`
  (full listing, so pruning is atomic) → `POST git/commits` → `PATCH git/refs/heads/{branch}`
  (force) — i.e. every deploy is **one single commit**, no per-file contents-API races;
  finally `POST /repos/{o}/{r}/pages` (creates; falls back to GET) and optional CNAME.
- `pagesStatus` → `GET pages` + `pages/builds/latest` (status/error/duration) for the Live tab.
- Token scopes needed: fine-grained `Contents: Read/Write` + `Pages: Read/Write`; **repo
  creation via the API needs the `Administration: Read/Write` permission — a fine-grained
  token without it gets 403, so either grant it or create the repo by hand** (a pushed
  `gh-pages` branch auto-enables Pages without any API call). The main dynamic site is never
  modified — deploy only touches the target GitHub repo.

### 6.8.1 Adding `.ipynb` notebooks

- **Drop any nbformat-4 `.ipynb` into `content/notebooks/`** — `scripts/generate-notebook.mjs`
  syncs them to `public/notebooks/` (removing stale ones) on every build, regenerate, and
  static export. They get a styled page at `/notebooks/<slug>`: markdown cells rendered with
  the site's MDX styling (KaTeX math, GFM), code cells with the site's code block, and
  outputs (stream/rich text/error, SVG/PNG images, HTML tables) all themed. The list index
  and home/notes cards pick them up automatically. `metadata.title/description/tags/date`
  drive the page header and cards.
- `src/lib/notebooks.ts` parses notebooks and builds Colab/Source links from
  `GITHUB_PAGES_OWNER` / `GITHUB_PAGES_REPO` / `GITHUB_PAGES_BRANCH` env vars
  (defaults `YousofLHC` / `phd-website` / `main`) — the notebook page's "Open in Colab"
  and "Source" buttons use them, so set them to the real repo before publishing.

### 6.7 Theming (dark/light)

- Tokens live in `src/app/globals.css`: `:root, [data-theme="dark"]` block + `[data-theme="light"]`
  block. `@theme inline` exposes them as Tailwind colors (`bg-void`, `text-ink`, `text-cyan`…).
- Per-palette surface vars: `--t-grad-panel`, `--t-grad-panel-strong`, `--t-grad-input`,
  `--t-grad-text` / `--t-grad-text-cyan` (for `.text-grad`), `--t-hero-bg` (body backdrop),
  `--t-glass-bg`, `--t-code-bg` (code blocks stay dark in light mode), `--t-choice` (ink that
  must contrast on gradient buttons: `text-void`).
- Theme bootstrapping: inline script in `src/app/layout.tsx` reads localStorage (or system
  preference) and sets `document.documentElement.dataset.theme` before paint — no FOUC.
  `<html suppressHydrationWarning>` required. `viewport.themeColor` is media-based.
- `ThemeToggle` (`src/components/ui/theme-toggle.tsx`) persists to localStorage and syncs all
  mounted toggles via a MutationObserver on the `data-theme` attribute.

---

## 7. Authoring content — reference

### 7.1 MDX frontmatter

Common keys (all kinds): `title`, `description`, `date` (YYYY-MM-DD), `tags` (list), `cover`
(`/covers/<slug>.svg` or any path), `draft` (bool — hidden from lists and admin managers, but the
detail page still renders if reached directly... actually `listArticles` skips drafts; editors can
still open them via `/admin`), `readTime` (auto-set by editor; if absent the UI falls back).

Notes only: `subject` (grouping), `order` (sorting within subject), `pdf` (path to a PDF in
`public/files/notes/…`).

Projects: `status`, `repo`, `links` etc. are allowed — unknown keys are preserved and passed
through (see `ArticleMeta` `[key: string]: unknown`).

### 7.2 Supported Markdown / MDX in articles

- **Math**: `$…$`, `$$…$$` (KaTeX). **Chemistry**: `\ce{...}` (mhchem — works in `$$`).
- **Code**: fenced blocks with any language; `prism-react-renderer` highlights python/r/cpp/bash/
  latex/markdown/json/yaml… (unknown languages fall back to plain text — safe).
- **Mermaid**: ` ```mermaid ` fences → rendered diagrams (flowchart, sequenceDiagram, timeline,
  gantt, stateDiagram-v2, classDiagram, ER, mindmap…).
- **GFM**: tables, task lists, strikethrough, footnotes, autolinks.
- **Custom MDX components**: `<Callout type="tip|note|warning|danger" title="…">`,
  `<Diagram chart={...} caption="…"/>`, `<NotebookCard slug="…"/>`, `![alt](src "caption")` (lightbox).
- Headings: `#` renders as h2 in `.rich` styling (h1 is reserved), `##` → h3, etc.

### 7.3 File conventions

- Slugs are kebab-case; filenames must match slugs (`content/posts/amp-factor-graphs.mdx`).
- Notebooks: one `.ipynb` per file in `content/notebooks/`; metadata (title/description/tags/date)
  lives in the notebook's `metadata` — the site parses it.
- Covers: `scripts/generate-covers.mjs` auto-writes SVG covers from frontmatter fields
  (title/description/tags) into `public/covers/<slug>.svg`; upload custom covers to
  `/admin/media` instead.
- PDFs: place in `content/pdf/` and they are copied to `public/files/` by `generate-pdfs.mjs`
  (existing: `files/cv.pdf`, `files/notes/kalman-filter-notes.pdf`).

---

## 8. JSON data — reference

### 8.1 `content/data/site.json`

`name`, `shortName`, `tagline`, `title`, `description`, `url`, `location`, `email`, `availability`,
`calendly`, `formspree` (empty ⇒ mailto contact form), `socials` (`github|linkedin|scholar|orcid|x`),
`navLinks` (`[{href,label}]`). **All keys are required** — `generate-content.mjs` fails the build
with a clear error if any is missing.

### 8.2 `content/data/content.json`

Required top-level keys (build fails if missing): `profile`, `stats`, `education`, `experience`,
`publications`, `awards`, `certifications`, `skills`, `languages`, `projects`, `services`, `domains`.

- `profile`: name, firstName, role, degree, tagline, bio (list of paragraphs), focus.
- `stats`: `[{value, label}]` (hero numbers).
- `education`/`experience`: `[{period, title, org, detail, tags, highlight?}]`.
- `publications`: `[{title, authors, venue, year, status (published|in-press|under-review), tags}]`.
- `skills`: `[{group, items:[{name, level}]}]`; `languages`: `[{name, level}]`.
- `projects`: `[{slug, title, short, description, tags, links…}]` (grid + deep-dive MDX by slug).
- `services`: `[{icon, title, blurb}]`; `domains`: `[{id, label, short, blurb, level, heat, color,
  icon, keywords}]` (heatmap + chips).
- **Icon allowlist**: only `Brain, Cpu, FlaskConical, Hexagon, Magnet, Network, ScanLine, Sigma,
  Sparkles, Workflow` (lucide) — anything else fails generation with the available list printed.
- Colors are arbitrary Tailwind-safe strings (e.g. `"#3be1ff"`); the heatmap uses `heat` values.

---

## 9. Conventions & gotchas (READ BEFORE EDITING)

1. **Next.js 16 removed `middleware`** — the file is `src/proxy.ts` exporting `proxy` (Node
   runtime). Renaming it back to `middleware.ts` will break admin auth.
2. **Never edit `src/lib/generated/*.ts`** — they are overwritten by `npm run generate` on every
   build. Edit `content/data/*.json` (or the admin panel) instead.
3. **`npm run build` = `npm run generate && next build`** — do not run bare `next build`; JSON
   changes would silently not propagate.
4. **`src/lib/site.ts` and `src/lib/data.ts` are barrels** (`export *`). They exist so every
   existing importer (`navLinks`, `profile`, `projects`, …) keeps working after the JSON migration.
   Keep that indirection.
5. **`readTime`**: editor auto-computes `words/220` on save; list pages use frontmatter value.
6. **`sanitizeSlug`** must stay strict — it is the only path-traversal defense for admin writes.
7. **`execFile` in `store.ts` carries `/*turbopackIgnore: true*/`** — removing it re-enables a
   build warning that traces the whole project into the server bundle.
8. **Server actions**: all admin actions must pass through `guard()`; it rethrows
   `NEXT_REDIRECT` (digest starts with `NEXT_REDIRECT`) — catching it in `guard` would 500 the
   session-expiry redirect.
9. **`useActionState`** powers the login form (server-action state pattern).
10. **PowerShell testing**: use `curl.exe`, not `Invoke-WebRequest -Headers Cookie` (header gets
    dropped silently). Mint a session token with the HMAC scheme from `auth.ts` for authed curls.
11. **ESLint is strict** about `setState` inside effects (`react-hooks/set-state-in-effect`) —
    read URL hash via lazy `useState` initializer (see `knowledge-hub.tsx`).
12. **Turbopack quirk**: `@next/swc-win32-x64-msvc@16.3.0` had to be force-installed for Windows
    builds — keep it in `dependencies` or Windows `next build` breaks.
13. `.env.local` is gitignored; `.env.example` documents `ADMIN_PASSWORD`. Never commit real
    secrets. `ADMIN_PASSWORD` is dev-only — change before any real deployment.
14. **Theming is dual-palette** (dark default + light): never hardcode HEX in components — add a
    token (`--t-*`) in `globals.css` for both palettes. `@theme inline` maps `--color-*` → tokens.
    Persistence: inline script in `layout.tsx` (no FOUC), `ThemeToggle` for switching. Mermaid and
    ScienceVisual are token-driven so they adapt automatically.
15. Language of the site UI is English (user content may mix Persian in articles — fine, MDX
    handles UTF-8).

---

## 10. Verification checklist (what to run after changes)

**GitHub Pages (static mirror — new):** the repo has a CI workflow
(`.github/workflows/pages.yml`). On every push to `main` it runs
`npm run build:pages` (`scripts/export-static.mjs`), which copies the project
(minus `node_modules`, dynamic-only pieces `src/app/admin`,
`src/components/admin`, `src/proxy.ts`) into a disposable `.pages-project/`
folder, runs the export build there, moves `out/` back and deletes the copy —
the live tree is never renamed (works even while `next dev` is running). The
export step strips Turbopack aux files and writes `.nojekyll` (otherwise
Jekyll drops `_next/`). The static site (public pages only — no admin) is
published to GitHub Pages via the official upload/deploy-pages actions.
Enable once in repo Settings → Pages → Source:
**GitHub Actions**. If the site lives at `user.github.io/<repo>` (not a custom
domain), set a repository variable `PAGES_BASE_PATH=/<repo>` (or pass
`PAGES_BASE_PATH` locally); for a project site, GitHub auto-serves the first
Pages deployment at a subpath — configure accordingly. The full dynamic app +
admin still builds with plain `npm run build`.

```bash
npm run lint     # must end with zero problems
npm run build    # must compile + typecheck + prerender all 27 routes
npm run start    # then:
# public smoke (any language-neutral assertions):
curl.exe -s -o NUL -w "%{http_code}\n" http://localhost:3000/
curl.exe -s -o NUL -w "%{http_code}\n" http://localhost:3000/notes
curl.exe -s -o NUL -w "%{http_code}\n" http://localhost:3000/notebooks   # 200 (redirect target serves)
# admin guard:
curl.exe -s -o NUL -w "%{http_code}\n" http://localhost:3000/admin      # 307 → /admin/login
# authed (mint token like in §10 of this doc or via login):
curl.exe -s -o NUL -w "%{http_code}\n" -H "Cookie: yg_admin=<token>" http://localhost:3000/admin/posts
```

Known-good totals (baseline): **27 routes** — 17 Static, 4 SSG, 3+2 dynamic admin groups,
1 ƒ Proxy line, 1 `/_not-found`.

---

## 11. File map (exhaustive, admin-relevant first)

```
src/lib/admin/auth.ts        HMAC session signing/verification, cookie const
src/lib/admin/store.ts       fs layer: articles, JSON, media, regenerate
src/app/admin/actions.ts     all "use server" actions (guarded)
src/proxy.ts                 auth gate for /admin/*
src/app/admin/(auth)/        login page + layout (redirect authed away)
src/app/admin/logout/        route.ts clears cookie
src/app/admin/(shell)/       guarded layout (sidebar) + pages:
    page.tsx                     dashboard
    [kind]/[slug]/page.tsx       editor (edit)   [kind]∈{posts,notes,projects}
    [kind]/new/page.tsx          editor (create)
    {posts,notes,projects}/page.tsx  article managers
    notebooks/page.tsx       notebooks list
    settings/page.tsx        site.json form
    data/page.tsx            content.json JSON editor
    media/page.tsx           media library
src/components/admin/        admin-nav, login-form, field (inputs), article-manager,
                             site-settings-form, **data-studio** (visual content.json editor),
                             media-manager, editor/{toolbar,preview}.tsx
src/app/admin/preview-action.ts  "use server" MDX render for the editor live preview
src/components/ui/theme-toggle.tsx  dark/light switcher (sidebar, navbar, login)
src/components/ui/mermaid.tsx   theme-aware diagram renderer (observes data-theme)
src/components/mdx/mdx-components.tsx  MDX component map (Callout/Diagram/…)
src/lib/mdx.ts               article pipeline (list/render/readTime)
src/lib/notebooks.ts         ipynb parsing, colab link
src/components/ui/           mermaid, code-block, lightbox, reveal…
src/components/knowledge/    knowledge-hub.tsx (tabs + hash handling)
src/components/landing/      hero + science-visual
scripts/                     the four generators (see §4)
content/                     the content source of truth (see §7/§8)
```

---

## 12. How to extend (patterns)

- **Add a nav link**: `content/data/site.json → navLinks` (admin: Settings). Page must exist.
- **New admin section**: create page under `src/app/admin/(shell)/`, add link in
  `admin-nav.tsx` links array, reuse `guard()` actions.
- **New snippet in the editor**: add to the arrays in `editor/toolbar.tsx` (`pythonSnippets`,
  `rSnippets`, `cppSnippets`, `bashSnippets`, `latexSnippets`, `mermaidBlocks`, `mdxComponents`).
- **New custom MDX component**: register it in `mdx-components.tsx`; optionally mirror it in
  `editor/preview.tsx` so the live preview renders it.
- **New content type**: mirror the `posts` pattern — folder in `content/`, `ArticleKind` in
  `ARTICLE_DIRS`, list page, editor params validation, route map.

---

## 13. Deployment notes

- Set `ADMIN_PASSWORD` (and optionally `ADMIN_SECRET`) in the hosting env — `.env.local` is for
  local dev only.
- `next start` requires `npm run build` first (which runs codegen). On Vercel/Node servers the
  admin panel works the same (filesystem must be writable; if using a read-only serverless FS,
  the regenerate step and media uploads need an ephemeral/object store — not yet implemented).
- The notebook "colab" links point at `github.com/yousofghalenoei/phd-website` — update if the
  repo moves.

---

## 14. Visual & UX deep dive (for appearance/animation work)

Before touching anything that affects the look/feel/animations, read
**`AI_VISUAL_UX_GUIDE.md`** (same directory): complete inventory of design tokens
(dark + light), the FOUC-free theming bootstrap, the animation system (CSS keyframes,
motion/Reveal, Three.js molecular-graph background, TypedText), the `.rich` prose system,
and the GitHub Pages static-export pipeline. Use it together with §3, §4 and §5.

---

## 15. Roadmap / known TODOs (as of this writing)

- Notebook editor (edit `.ipynb` cells in admin) — currently list-only.
- Media picker inside the editor (insert image paths from `/admin/media`).
- Draft rendering: `draft: true` hides articles from lists but a direct URL still renders — decide
  whether to 404 drafts (currently intentional for previewing).
- Git integration (auto-commit after admin saves) and/or object storage for serverless deploys.
- Automated tests (only manual smoke + one throwaway E2E of `store.ts` exists).

---

*Last updated: 2026-08-12. Keep this file in sync whenever the architecture changes — other AIs
will rely on it to bootstrap instantly.*
