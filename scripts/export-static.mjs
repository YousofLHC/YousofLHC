/**
 * Static GitHub Pages build (main site untouched, works while dev runs).
 *
 * Strategy: copy the project (minus node_modules/.next/out and the dynamic-only
 * pieces: src/app/admin, src/components/admin, src/proxy.ts) into a disposable
 * folder `.pages-project`, run the export build there, then copy `out/` back.
 * The live source tree is never renamed or deleted, so it keeps working even
 * while `next dev` is watching it.
 *
 * Also strips the Turbopack export aux files (`__next.*`, `index.txt` page
 * twins) and adds an empty `.nojekyll` so GitHub Pages does not run Jekyll
 * (Jekyll silently drops the `_next/` folder → site without CSS/JS).
 *
 * Usage: `npm run build:pages`
 * Optional: `PAGES_BASE_PATH=/repo-name` when hosted at `user.github.io/repo-name`.
 */
import { readdirSync, statSync, mkdirSync, rmSync, cpSync, existsSync, renameSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.dirname(import.meta.dirname);
const project = path.join(root, ".pages-project");

const EXCLUDED = new Set([
  "node_modules",
  ".next",
  "out",
  ".git",
  ".env",
  ".env.local",
  ".env.*",
  ".pages-project",
  "src/app/admin",
  "src/components/admin",
  "src/proxy.ts",
]);

function isAux(name) {
  return name.includes("__next.") || name === "index.txt";
}

function copyTree(from, to, rel = "") {
  for (const entry of readdirSync(from)) {
    const childRel = rel ? `${rel}/${entry}` : entry;
    if (EXCLUDED.has(entry) || EXCLUDED.has(childRel)) continue;
    const src = path.join(from, entry);
    const dst = path.join(to, entry);
    if (statSync(src).isDirectory()) {
      mkdirSync(dst, { recursive: true });
      copyTree(src, dst, childRel);
    } else cpSync(src, dst);
  }
}

function runNode(args, cwd, env) {
  const r = spawnSync(process.execPath, args, { cwd, stdio: "inherit", shell: false, env });
  if (r.error) throw r.error;
  return r.status === 0;
}

const start = Date.now();
let failed = false;

try {
  console.log("[build:pages] preparing disposable project copy…");
  if (existsSync(project)) rmSync(project, { recursive: true, force: true });
  copyTree(root, project);

  const env = { ...process.env, EXPORT_MODE: "1" };
  const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
  const generators = [
    "scripts/generate-content.mjs",
    "scripts/generate-covers.mjs",
    "scripts/generate-notebook.mjs",
    "scripts/generate-pdfs.mjs",
  ];

  console.log("[build:pages] running generate + export build…");
  let ok = true;
  for (const g of generators) {
    if (!runNode([g], project, env)) {
      ok = false;
      break;
    }
  }
  if (ok) ok = runNode([nextBin, "build"], project, env);
  if (!ok || !existsSync(path.join(project, "out", "index.html"))) {
    console.error("[build:pages] FAILED: export build did not produce out/index.html");
    failed = true;
  }
} catch (e) {
  failed = true;
  console.error("[build:pages] error:", e instanceof Error ? e.message : e);
} finally {
  if (!failed && existsSync(path.join(project, "out"))) {
    const outDir = path.join(root, "out");
    if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
    renameSync(path.join(project, "out"), outDir);
    stripAux(outDir);
    injectThemeInit(outDir);
    writeFileSync(path.join(outDir, ".nojekyll"), "", { flag: "a" });
    // Stamp the service worker with a unique cache version per deploy.
    const swPath = path.join(outDir, "sw.js");
    if (existsSync(swPath)) {
      const stamped = readFileSync(swPath, "utf8").replace(
        /__BUILD_VER__/g,
        `v${Math.floor(Date.now() / 1000).toString(36)}`
      );
      writeFileSync(swPath, stamped);
    }
    if (process.env.PAGES_BASE_PATH) prefixAssets(outDir, process.env.PAGES_BASE_PATH);
  }
  console.log("[build:pages] cleaning up disposable copy…");
  if (existsSync(project)) rmSync(project, { recursive: true, force: true });
}

function stripAux(dir) {
  for (const entry of readdirSync(dir)) {
    if (isAux(entry)) {
      const p = path.join(dir, entry);
      rmSync(p, { recursive: true, force: true });
      continue;
    }
    const p = path.join(dir, entry);
    if (statSync(p).isDirectory()) stripAux(p);
  }
}

/**
 * Injects the theme-init snippet into the <head> of every exported HTML page
 * as a plain inline <script> (executes synchronously during HTML parse, before
 * first paint — no theme flash). It must NOT be rendered by React: React 19
 * does not execute component-rendered <script> tags and logs a console error
 * for them. Source: scripts/theme-init.js.
 */
function injectThemeInit(dir) {
  const init = createRequire(import.meta.url)("./theme-init.js");
  const swUrl = `${process.env.PAGES_BASE_PATH ?? ""}/sw.js`;
  const patchedInit = init.replace(/__SW_URL__/g, swUrl);
  const injection = `<script>${patchedInit}</script>`;
  let files = 0;
  const walk = (d) => {
    for (const entry of readdirSync(d)) {
      const p = path.join(d, entry);
      if (statSync(p).isDirectory()) {
        walk(p);
        continue;
      }
      if (!entry.endsWith(".html")) continue;
      const html = readFileSync(p, "utf8");
      if (html.includes(injection)) continue;
      const patched = html.replace("</head>", `${injection}</head>`);
      if (patched !== html) {
        writeFileSync(p, patched);
        files++;
      }
    }
  };
  walk(dir);
  if (files > 0) console.log(`[build:pages] theme-init injected into head — ${files} html files`);
}

/**
 * Next 16 static export does not apply basePath to `<img>` srcs when
 * `images.unoptimized` is set (only `_next/static` chunks and Link anchors
 * get prefixed). Prefix every unprefixed asset reference in both the rendered
 * HTML attributes and the embedded RSC payload (keeping server HTML and the
 * hydration payload identical so there is no hydration mismatch). Only used
 * when PAGES_BASE_PATH is set (GitHub Pages project sites).
 */
function prefixAssets(dir, base) {
  const key = base.replace(/^\/+/, "").replace(/\/+$/, "");
  const reAttr = new RegExp(`(src|href)="\\/(?!${key}\\/|_next\\/)`, "g");
  const reJson = new RegExp(`("src":")\\/?(?!${key}\\/|_next\\/)`, "g");
  let files = 0;
  let count = 0;
  const walk = (d) => {
    for (const entry of readdirSync(d)) {
      const p = path.join(d, entry);
      if (statSync(p).isDirectory()) {
        walk(p);
        continue;
      }
      if (!entry.endsWith(".html")) continue;
      const html = readFileSync(p, "utf8");
      const patched = html
        .replace(reAttr, `$1="/${key}/`)
        .replace(reJson, `$1"/${key}/`);
      if (patched !== html) {
        writeFileSync(p, patched);
        files++;
        count += (html.match(reAttr)?.length ?? 0) + (html.match(reJson)?.length ?? 0);
      }
    }
  };
  walk(dir);
  console.log(`[build:pages] basePath prefix applied — ${files} html files, ${count} refs`);
}

if (failed) process.exit(1);

const count = (dir) =>
  readdirSync(dir).reduce((n, f) => {
    const p = path.join(dir, f);
    return n + (statSync(p).isDirectory() ? count(p) : 1);
  }, 0);
console.log(
  `[build:pages] OK — ${count(path.join(root, "out"))} files in out/ (${((Date.now() - start) / 1000).toFixed(1)}s)`
);