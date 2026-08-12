# phd-website — Visual, UX & Architecture Guide (for AI agents)

**Purpose:** give any AI agent (or new maintainer) a fast, precise mental model of this
Next.js site: what it does, which files own the look/feel/animation, how theming and
content work, and what was recently built — so you never break the visual system and can
extend it idiomatically.

**Stack (exact versions):** Next.js `16.3.0` (Turbopack default, App Router, React 19.2.8),
TypeScript, Tailwind CSS v4 (`@tailwindcss/postcss`), `motion` 13 (framer-motion successor),
Three.js 0.185, `prism-react-renderer` 2 (nightOwl), KaTeX 0.18 + mhchem, Mermaid 11,
`next-mdx-remote-client`, `lucide-react` 1.31, gray-matter, pdf-lib, tsup-free scripts.

> ⚠️ **This is NOT the Next.js you know from training data.** Next 16.3 has breaking
> changes. Before writing code that touches Next APIs, read
> `node_modules/next/dist/docs/` (the bundled, version-matched docs). Notable in this repo:
> static export is used for GitHub Pages (`output: "export"` only when `EXPORT_MODE=1`),
> `src/proxy.ts` replaces `middleware.ts`, Turbopack's export leaks `__next.*`/`index.txt`
> aux files that must be stripped (see §9).

---

## 1. Quick start & commands

```bash
npm run dev          # generate content data first, then next dev (port 3000)
npm run build        # generate + full production build (dynamic app)
npm run build:pages  # static GitHub Pages export -> out/ (see §9)
npm run generate     # compile content/data JSON -> src/lib/generated/*.ts + covers + notebooks + PDFs
npm run lint         # eslint (must end with zero problems)
npx tsc --noEmit     # typecheck
```

- Dynamic admin app: `npm run build` / `npm run start`. Static mirror: `npm run build:pages`.
- `out/` is the static export (also used by the GitHub Studio deploy flow). It must contain
  `.nojekyll` (auto-written) and must NOT contain Turbopack aux files (auto-stripped).

---

## 2. Recent work (session log) — what exists now

Everything below was built/verified in the most recent work sessions. Read this first to
know what's already there before re-inventing:

1. **GitHub Pages publishing from the admin UI (GitHub Studio)** — `/admin/github`:
   connect any GitHub account with a PAT, create repos, run the static export build
   server-side, deploy `out/` to a `gh-pages` branch **via the git-data API** (blobs →
   one tree → one commit → ref update, atomic, no per-file races), prune stale files,
   enable Pages, watch live build status + HTTP reachability. Detail in §8.5.
2. **`scripts/export-static.mjs` rewrite — disposable copy strategy.** Builds the export
   in a `.pages-project/` folder (project minus `node_modules`, `.next`, `out`, `.git`,
   `.env*`, `.pages-project`, `src/app/admin`, `src/components/admin`, `src/proxy.ts`),
   runs the 4 generators + `next build` (via `process.execPath`, since `npx.cmd` EINVALs
   on Windows), renames `out/` into the repo root, deletes the copy. The live tree is
   NEVER renamed — dev server can run concurrently. Also **strips `__next.*` and
   `index.txt`** aux files and writes empty `out/.nojekyll`.
3. **`.ipynb` notebook support** — any nbformat-4 notebook placed in `content/notebooks/`
   is synced to `public/notebooks/` by `generate-notebook.mjs` and rendered as a fully
   themed page at `/notebooks/<slug>` (markdown cells → site MDX styling with KaTeX/GFM,
   code cells → site CodeBlock, outputs: stream/rich/error/SVG/PNG/HTML). Colab/Source
   links are driven by `GITHUB_PAGES_OWNER/REPO/BRANCH` env vars (defaults
   `YousofLHC/phd-website/main`).
4. **Theming system (dark/light)** — token-driven, FOUC-free bootstrap (§4). `ThemeToggle`
   syncs across mounts via MutationObserver on `data-theme`.
5. **Admin suite** — dashboard, MDX editor with live preview + toolbar snippets, JSON
   data studio, media manager, site settings, and GitHub Studio. (§8)
6. **Auxiliary visual components** — Three.js molecular-graph background, ScienceVisual
   hero panel, TypedText, Reveal (motion), heatmap, mermaid diagrams (§6, §7).

---

## 3. Route map

### Public site (`src/app/(site)/`)
| Route | File | Content |
|---|---|---|
| `/` | `page.tsx` | Hero (typed roles, focus chips, stats, ScienceVisual) + domain marquee + about/skill bars + featured projects + knowledge hub + services + CTA |
| `/blog` | `blog/page.tsx` | All articles grid |
| `/blog/[slug]` | `blog/[slug]/page.tsx` | MDX article page (Figure/Diagram/Callout/NotebookCard/mermaid/KaTeX + TOC + related) |
| `/notes` | `notes/page.tsx` | Notes & notebooks hub (`KnowledgeHub` tabs) |
| `/notes/[slug]` | `notes/[slug]/page.tsx` | Note article page (reuses post component style) |
| `/notebooks/[slug]` | `notebooks/[slug]/page.tsx` | Themed notebook viewer + download/Colab/Source buttons |
| `/projects` + `/projects/[slug]` | `projects/*` | Project cards + detail |
| `/resume` | `resume/page.tsx` | CV-style page (timeline, heatmap, publications, print styles) |
| `/connect` | `connect/page.tsx` | Contact CTA, calendly, form |

### Admin (`src/app/admin/`)
`(auth)/login` (password), `logout`, `(shell)/` dashboard, `(shell)/posts|notes|projects|notebooks|settings|data|media`, `(shell)/[kind]/new`, `(shell)/[kind]/[slug]` (editor), `github/` (GitHub Studio). Protected by `src/proxy.ts` + `requireAdmin()`.

---

## 4. Theming — THE core of the visual system

**Owners:** `src/app/globals.css` (all tokens, base, component classes, print) ·
`src/app/layout.tsx` (fonts + FOUC script) · `src/components/ui/theme-toggle.tsx`.

### 4.1 Token architecture (Tailwind v4 `@theme inline`)
`@theme inline` maps CSS vars to Tailwind utilities — you can use `bg-void`, `text-ink`,
`border-line`, `text-cyan`, etc. **Never hardcode hex colors in components; always use
tokens** (except deliberate gradients that use `--t-*` vars).

| Token | Dark | Light | Used for |
|---|---|---|---|
| `--t-void` | `#02040f` | `#f3f5fb` | body background |
| `--t-abyss` | `#050918` | `#e9edf7` | alt section bands |
| `--t-panel` | `#0b1128` | `#ffffff` | cards/panels |
| `--t-panel-2` | `#101a3a` | `#e2e8f6` | inner fills, code inline |
| `--t-line` / `--t-line-strong` | white@14%/28% | navy@12%/24% | borders |
| `--t-ink` / `--t-dim` / `--t-faint` | `#e8edff` / `#9aa4c7` / `#5d688f` | `#0f1730` / `#47506f` / `#7d87a9` | text hierarchy |
| `--t-cyan` / `--t-violet` / `--t-magenta` / `--t-emerald` / `--t-amber` | `#3be1ff` / `#a78bfa` / `#f472b6` / `#34d399` / `#fbbf24` | darker variants | accents (`DomainColor` palette) |
| `--t-grad-panel(-strong)` | navy→abyss gradients | white gradients | `.card`, `.glass-strong`, `.btn-ghost` |
| `--t-grad-text` | white→cyan→violet→magenta | navy→teal→purple→pink | `.text-grad` headings |
| `--t-grad-text-cyan` | cyan→indigo | teal→purple | `.text-grad-cyan` |
| `--t-code-bg` | `#060a1c` | same (stays dark both themes) | code blocks |
| `--t-hero-bg` | radial glows (blue/violet/cyan) | lighter glows | fixed body backdrop (`body::before`) |
| `--t-glass-bg` | navy@45% | white@65% | `.glass` |
| `--t-choice` | white | navy | text sitting on gradient buttons |

`[data-theme="light"]` overrides the whole block; `:root, [data-theme="dark"]` is the
default. `color-scheme` is set for native scrollbars/pickers.

### 4.2 Theme bootstrap (no FOUC)
`layout.tsx` injects an **inline script into `<head>`** that reads `localStorage.theme`
(or `prefers-color-scheme`) and sets `document.documentElement.dataset.theme` **before
first paint**. `<html suppressHydrationWarning>` is required. `viewport.themeColor` is
media-based. `ThemeToggle` persists to localStorage and syncs every mounted toggle via a
`MutationObserver` on the `data-theme` attribute.

### 4.3 Theme-aware third-party renderers
- **Mermaid** (`src/components/ui/mermaid.tsx`): observes `data-theme`, re-renders the
  diagram with a matching palette (dark: navy panels/cyan borders; light: white/navy text),
  `theme: "dark"` base, JetBrains Mono font, strict security.
- **CodeBlock**: uses `prism-react-renderer` nightOwl with transparent background on top of
  `--t-code-bg` (dark in both themes); inline code uses `--t-panel-2` + cyan text.
- **body::before** renders `--t-hero-bg` as a fixed full-screen backdrop (so the ambient
  glow is behind every page, not just hero).

---

## 5. Design system — every reusable class

All defined in `globals.css` `@layer components` (usable anywhere; they're plain CSS
classes, not Tailwind utilities — combine with utilities freely).

| Class | What it does |
|---|---|
| `.glass` / `.glass-strong` | frosted panel: `backdrop-filter: blur(14/18px)` + `--t-grad-panel(-strong)` + line border |
| `.card` | rounded-xl gradient panel, border, hover: cyan border + glow shadow + `translateY(-3px)` |
| `.chip` | pill tag: rounded-full, panel bg, line border, dim text; hover cyan border |
| `.chip-active` | cyan border/bg/text + soft glow (used for active filter tabs) |
| `.btn` + `.btn-primary` / `.btn-ghost` | button base (flex, rounded-lg, focus ring) · primary: `bg-gradient-to-r from-cyan to-violet text-void` + cyan glow, hover lifts + intensifies glow · ghost: panel gradient + blur + line border, hover cyan border |
| `.section-kicker` | mono, `text-[10px]`-ish, uppercase `tracking-[0.35em]`, cyan — section numbering (`01 · about`) |
| `.heading` | semibold tracking-tight ink (used with `text-grad*` spans) |
| `.text-grad` / `.text-grad-cyan` | gradient text via background-clip |
| `.shimmer` | moving white streak sweep (2.75s loop) |
| `.grid-overlay` | blueprint grid lines (46px cells) using `--t-line`, used with `[mask-image:radial-gradient(...)]` |
| `.divider`, `.kbd` | borders, keyboard key |
| `.rich` | **the article/MDX typography system** — see §7.3 |
| `.no-print`, `.print-card`, `@media print` | print styles: white bg, ink text, hide nav |
| scrollbars | thin, gradient cyan→violet thumb with `--color-void` border |
| `::selection` | cyan-tinted selection |

**Typography:** Inter (sans) + JetBrains Mono via `next/font/google` with CSS variables
`--font-inter`/`--font-jetbrains`; exposed as Tailwind `font-sans`/`font-mono`. Mono is the
UI language of the site (nav, labels, kickers, chips, stats); sans carries body/headings.

---

## 6. Animation inventory (where the "alive" feel comes from)

### 6.1 CSS keyframes — defined inside `@theme inline` (globals.css:23-29)
| Utility | Keyframe | Speed | Used by |
|---|---|---|---|
| `animate-float` | `float` (y -12px loop) | 9s | hero chevron, floating chips |
| `animate-aurora` | `aurora` (background-position sweep) | 20s | (available; gradient panels) |
| `animate-marquee` | `marquee` (translateX -50%) | 46s | domain marquee strip (duplicated array) |
| `animate-shimmer` | `shimmer` (bg-position sweep) | 2.75s | `.shimmer` accents |
| `animate-pulse-soft` | `pulseSoft` (opacity .45→1 + scale 1.06) | 4s | status dots, TypedText caret, molecular graph ring |
| `animate-spin-slow` | `spin` | 26s | ScienceVisual ring |
| `animate-dash` | `dash` (stroke-dashoffset -600) | 6s | animated SVG chart lines |

### 6.2 Motion (scroll/view transitions) — `src/components/ui/reveal.tsx`
`<Reveal delay={x} y={24}>` — fade+rise on scroll (`whileInView`, once, margin -80px,
ease `[0.22,1,0.36,1]`, 0.6s). Honors `prefers-reduced-motion` (`useReducedMotion`).
**Convention: every major block on the home page is wrapped in Reveal with a small
staggered delay** (`0.08 * index` for grids).

### 6.3 Three.js hero — `src/components/three/molecular-graph.tsx`
Full-screen fixed, `z-0`, pointer-events-none, behind content (`z-10` sections):
- 850 star particles (320 mobile) + 26-node icosahedron sphere of glowing "domain"
  sprites (colors from `domainColors`), connecting-edge lines, faint torus + icosphere wire.
- **Cursor trail**: pointermove pushes colored glow sprites that rise and fade (disabled
  when reduced-motion).
- **Performance discipline**: IntersectionObserver pauses when off-screen (rootMargin 300px),
  pauses on `document.hidden`, disposes all geometries/materials on unmount,
  `pixelRatio ≤ 2`. Lazy-loaded via `next/dynamic` with `loading: () => null` in home page.
- The `MolecularGraph` `domains` data comes from generated content — the graph literally
  renders the research domains from `content/data/content.json`.

### 6.4 Landing decorations
- `src/components/landing/science-visual.tsx` — SVG "molecular graph" card: pulsing atom
  ring, message-passing molecule with Fe center (C/N/O atoms), animated dashed ring
  (`animate-spin-slow`), equation + SMILES chips, property prediction bars; fully themed
  via CSS vars. Pure server component (no JS).
- `src/components/landing/typed-text.tsx` — typewriter cycling through `typedRoles`
  (70ms type / 30ms delete / 1900ms hold), cyan caret `animate-pulse-soft`.

### 6.5 Micro-interactions (CSS transitions, no JS)
- `.card:hover` lift + cyan glow; `.btn:hover` glow bloom + translateY(-1px); nav underline
  gradient bar under active link; logo tile `group-hover:rotate-6`; project cover
  `group-hover:scale-105` (500ms); footer social icon glow hover; arrow icons that slide
  on hover (`group-hover:translate-x-1`); `transition-colors` everywhere for theme swaps.

---

## 7. Shared components & article rendering

### 7.1 UI kit (`src/components/ui/`)
- `code-block.tsx` — prism nightOwl + custom theme, traffic-light header, optional
  filename + line numbers, copy button (Check/Copy feedback).
- `lightbox.tsx` — click-to-zoom image modal (used by notebook outputs, figures).
- `mermaid.tsx` — lazy-loaded diagram renderer, theme-aware (§4.3), error fallback,
  caption support.
- `heatmap.tsx` — grid heat visual (resume skills/dates).
- `reveal.tsx`, `theme-toggle.tsx` — see above.

### 7.2 MDX pipeline — `src/lib/mdx.ts`
`mdxOptions` = `remarkMath + remarkGfm` / `rehypeKatex(strict:false, throwOnError:false)` +
`rehypeSlug`. `renderArticle(folder, slug, components)` via `next-mdx-remote-client/rsc`,
`readTime()`, `listArticles()` (skips `draft: true`, sorts by date desc).
**Custom MDX components** (`src/components/mdx/mdx-components.tsx`):
`Pre` (prism CodeBlock from ``` fences, with language + filename), `Figure` (zoomable
image + caption), `Diagram` (mermaid), `Callout` (note/tip/warning/danger — colored by
`calloutStyles`), `NotebookCard` (links a notebook page). **These are the ONLY custom
components content authors may use** — the admin toolbar snippets insert exactly these.

### 7.3 `.rich` typography (globals.css:314-406) — article prose
Base 15px/7 leading; `h2::before` = cyan `▍` marker; heading sizes/weights/tracking;
links cyan underline; lists with cyan markers; blockquote violet-bordered italic quote;
fully styled tables (mono uppercase cyan headers, zebra rows); inline code panel-2 +
cyan; KaTeX sized 1.08em with overflow-safe display math; `pre` spacing; mermaid figure
container centered with panel bg. Used by MDX pages AND notebook markdown cells.

### 7.4 Blog/notes components
`post-card.tsx` (cover, meta chips, read-time; `kind="note"` variant), `blog-grid.tsx`,
`article-toc.tsx` (headings from rehypeSlug, scrollspy client), `related.tsx`
(`RelatedGrid`). Notebook side: `notebook-card.tsx` mirrors, `notebook-viewer.tsx` (§2.3).

---

## 8. Admin suite (the CMS)

### 8.1 Access control
- `src/proxy.ts` — Next proxy (15+ style middleware) guarding `/admin/:path*`;
  validates the `yg_admin` HTTP-only unsigned-in-practice cookie; redirects to
  `/admin/login?next=...`. Exempts login/logout.
- `src/lib/admin/auth.ts` — HMAC-SHA256 signed session tokens (7-day TTL); key derived
  from `ADMIN_PASSWORD` (or explicit `ADMIN_SECRET`); `timingSafeEqual` password check.
- Env: `ADMIN_PASSWORD` (required for login), `ADMIN_SECRET` (optional). **Admin routes are
  server-rendered and call `requireAdmin()` as a second gate.**

### 8.2 Layout & nav
`src/app/admin/(shell)/layout.tsx` = fixed left sidebar (`admin-nav.tsx`: Dashboard,
Blog posts, Study notes, Projects, Notebooks, Site settings, Profile & data, Media,
GitHub Pages) + theme toggle + "view site"/logout; mobile top bar. Same design tokens as
the public site; darker `bg-abyss` base.

### 8.3 Editor (`src/components/admin/`)
- `article-editor.tsx` — MDX authoring (title/frontmatter fields + body textarea) ·
  `editor/toolbar.tsx` (snippet insertions for custom components, KL formatting) ·
  `editor/preview.tsx` — **live preview**: calls server action `renderArticlePreview`
  (`src/app/admin/preview-action.ts`) which renders the pending MDX through the exact
  public pipeline with mid-write debouncing (350ms).
- `article-manager.tsx` — list/create/delete per kind. `field.tsx` reusable inputs.
- `data-studio.tsx` — tabbed visual editors for `content/data/content.json` (profile,
  projects, services, domains, etc.) + raw JSON tab; sticky action bar; "Regenerate"
  button runs `npm run generate` server-side.
- `site-settings-form.tsx` + `json-config-editor.tsx` — site.json settings / generic JSON.
- `media-manager.tsx` — upload/list/delete into `public/media` (returns `/media/...` hrefs).
- `github-studio.tsx` — §8.5.

### 8.4 Content store (`src/lib/admin/store.ts`)
Server actions: `requireAdmin`, `sanitizeSlug`, `readArticleSource`, `saveArticle`
(gray-matter TOML frontmatter), `deleteArticle`, `readJsonFile/writeJsonFile`
(`content/data/*.json`), media CRUD, `runContentGenerate`.

### 8.5 GitHub Studio (`/admin/github`) — deploy to GitHub Pages from the browser
- `src/app/admin/github/actions.ts` — server actions (all via GitHub REST API, **no git
  binary**): `validateGhToken`, `listRepos`, `createRepo`, `buildStaticExport{basePath}`
  (runs `npm run build:pages` server-side; needs a full Node host — VPS/Railway/Render,
  not Vercel serverless), `deployToPages` (**git-data API**: local blob SHAs → skip
  unchanged files → `POST git/blobs` (concurrency 6) → `POST git/trees` (full listing =
  atomic prune) → `POST git/commits` → `PATCH git/refs (force)`; one commit per deploy;
  then POST pages + optional CNAME), `pagesStatus` (+ latest builds), `checkSite`
  (real HTTP fetch of the published URL), `deployProgress` (in-memory progress beacon),
  `deleteBranchOnGh`.
- `github-studio.tsx` — tabs: Connect (PAT stored in **localStorage** `yg_gh_token`,
  passed per-request, never logged) / Repositories / Deploy (owner·repo·branch·cname,
  rebuild toggle — auto-computes `basePath` as `/${repo}` unless repo ends `.github.io`,
  progress bar while polling `deployProgress` 600ms) / Live (pages status + recent builds
  polled 8s + "site reachability" check polled 15s).
- **Token requirements:** fine-grained PAT with `Contents: Read/Write` + `Pages: Read/Write`;
  API repo creation additionally needs `Administration: Read/Write` (otherwise 403 — create
  the repo manually; a pushed `gh-pages` branch auto-enables Pages anyway). Classic PAT
  with `repo` scope also works.
- **Gotchas solved (do not regress):** fine-grained tokens cannot create repos (403);
  contents-API parallel PUTs race (409) — must use git-data single-commit flow;
  missing `.nojekyll` → Jekyll strips `_next/` → unstyled site; missing basePath on
  project repos → assets 404 (fixed by `/repo` basePath during build).

---

## 9. Static export / GitHub Pages pipeline

`npm run build:pages` → `scripts/export-static.mjs`:
1. rm + copy project → `.pages-project/` (excludes in file; `.pages-project` excluded so
   the copy never recurses into itself), `EXPORT_MODE=1`.
2. Run `generate-content/generate-covers/generate-notebook/generate-pdfs` + `next build`
   in the copy (`output: "export"`, `trailingSlash: true`, images unoptimized).
3. Move `out/` → repo root; strip aux files (`__next.*`, `index.txt` twins — leaked by
   this Next/Turbopack version); write empty `.nojekyll`; delete the copy.
4. `PAGES_BASE_PATH=/repo` env → `next.config.ts` `basePath` (for `user.github.io/<repo>`);
   not set for user/org root sites.
- `.github/workflows/pages.yml` CI: on push to `main` runs the same script (with
  `PAGES_BASE_PATH` repo variable) + official upload/deploy-pages actions; enable Pages
  Source: **GitHub Actions** in repo settings once.
- Admin + proxy are excluded from the export (public mirror only). Dynamic features (form,
  login, editor, studio) live only in the full app.

---

## 10. Data & content authoring

| Path | Role |
|---|---|
| `content/data/site.json` | editable site identity: name, tagline, url, email, availability, calendly, formspree, socials, navLinks |
| `content/data/content.json` | profile, stats, education, experience, publications, awards, certifications, skills, languages, projects, services, domains |
| `content/posts|notes|projects/*.mdx` | articles (frontmatter: slug/date/tags/cover/draft/pdf/subject/order) |
| `content/notebooks/*.ipynb` | **user notebooks** — synced to `public/notebooks/` by generate-notebook (`metadata.title/description/tags/date` drive UI) |
| `src/lib/generated/{site,content}.ts` | compiled by `generate-content.mjs`; imported via `@/lib/site`, `@/lib/data` |
| `src/lib/content-types.ts` | typing: `DomainColor`, `domainColors`, `lucideIconRegistry`, `ResearchDomain`, `Project`, … |
| `scripts/generate-covers.mjs` | SVG cover art for content by slug (public/covers) |
| `scripts/generate-pdfs.mjs` | printable PDFs via pdf-lib (public/files, resume) |
| `src/lib/notebooks.ts` | notebook parse (outputs: stream/error/display_data/execute_result, image data-URIs), `colabUrl`, `notebookSourceUrl`, env `GITHUB_PAGES_*` |

**Convention:** never edit `src/lib/generated/*` by hand — edit JSON and `npm run generate`.

---

## 11. Environment variables

| Var | Purpose |
|---|---|
| `ADMIN_PASSWORD` | admin login (required in prod) |
| `ADMIN_SECRET` | optional explicit HMAC key |
| `EXPORT_MODE=1` | static export mode for build:pages (set by export-static.mjs) |
| `PAGES_BASE_PATH` | basePath for GH Pages project sites (`/repo`) |
| `GITHUB_PAGES_OWNER/REPO/BRANCH` | notebook Colab/Source links (defaults `YousofLHC/phd-website/main`) |
| `.env.local` | dev values (`ADMIN_PASSWORD=admin-dev-pass-2026` — change before real deployment) |

---

## 12. Verification checklist (always run after changes)

```bash
npm run lint           # zero problems
npx tsc --noEmit       # clean
npm run build          # dynamic app builds
npm run build:pages    # out/ produced; contains .nojekyll; no __next.*/index.txt
```

Smoke URLs (dev): `/` (hero + Three.js + marquee), `/blog`, `/blog/<slug>` (KaTeX,
mermaid, callouts), `/notes`, `/notebooks/{demo,any-user-notebook}`, `/resume`,
`/admin` (login → dashboard), `/admin/github` (token → deploy → live tab).
Theme switch must be instant (no FOUC) and persist across navigation.

---

## 13. Anti-patterns / rules of thumb

1. **Never hardcode hex colors in components** — use token utilities (`text-cyan`,
   `bg-panel`, `border-line`, `bg-[var(--t-code-bg)]` for the one exception).
2. **Never bypass the `data-theme` system** — new themed surfaces must define vars for
   BOTH themes in `globals.css`; client components that snapshot colors must observe
   `data-theme` (see Mermaid/Toggle pattern).
3. **Don't re-add commit-per-file uploads in the deploy flow** — git-data single commit;
   keep the aux-file filters and `.nojekyll` in the export script.
4. **`Reveal`/`motion` = scroll animations; CSS keyframes = ambient decoration** — don't
   animate layout-critical elements with motion.
5. **Respect reduced motion** (`useReducedMotion`, `prefers-reduced-motion`) and pause
   Three.js off-screen — the site intentionally has heavy visuals.
6. **lucide-react 1.31 has no brand `Github` icon** — use `Globe`, `GitBranch`, `Code2`.
7. **Server actions files must export only async functions** (`next` constraint).
8. Content contract: custom MDX components are exactly `Figure, Diagram, Callout,
   NotebookCard, Pre(code), mermaid` — extend `mdx-components.tsx` + `editor/toolbar.tsx`
   together if you add more.