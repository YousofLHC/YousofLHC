import { promises as fs } from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import matter from "gray-matter";
import { ADMIN_COOKIE, verifySessionToken } from "./auth";

/** Verify the admin session; redirect to login when missing/expired. */
export async function requireAdmin(): Promise<void> {
  const store = await cookies();
  if (!verifySessionToken(store.get(ADMIN_COOKIE)?.value)) {
    redirect("/admin/login");
  }
}

const contentRoot = path.join(process.cwd(), "content");
const dataRoot = path.join(contentRoot, "data");
const mediaRoot = path.join(process.cwd(), "public", "media");

export const ARTICLE_DIRS = {
  posts: "posts",
  notes: "notes",
  projects: "projects",
} as const;

export type ArticleKind = keyof typeof ARTICLE_DIRS;

/** Make a filesystem-safe name from a slug; fall back to a timestamp. */
export function sanitizeSlug(input: string): string {
  const cleaned = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || `item-${Date.now()}`;
}

export interface ArticlePayload {
  frontmatter: Record<string, unknown>;
  body: string;
  slug: string;
}

export async function readArticleSource(
  kind: ArticleKind,
  slug: string
): Promise<ArticlePayload | null> {
  const file = path.join(contentRoot, ARTICLE_DIRS[kind], sanitizeSlug(slug) + ".mdx");
  try {
    const source = await fs.readFile(file, "utf8");
    const { data, content } = matter(source);
    return { frontmatter: data, body: content, slug: sanitizeSlug(slug) };
  } catch {
    return null;
  }
}

export async function saveArticle(
  kind: ArticleKind,
  slug: string,
  frontmatter: Record<string, unknown>,
  body: string
): Promise<string> {
  const safeSlug = sanitizeSlug(slug);
  const dir = path.join(contentRoot, ARTICLE_DIRS[kind]);
  await fs.mkdir(dir, { recursive: true });
  const source = matter.stringify(body, frontmatter);
  await fs.writeFile(path.join(dir, `${safeSlug}.mdx`), source, "utf8");
  return safeSlug;
}

export async function deleteArticle(kind: ArticleKind, slug: string): Promise<void> {
  const file = path.join(contentRoot, ARTICLE_DIRS[kind], sanitizeSlug(slug) + ".mdx");
  await fs.rm(file, { force: true });
}

export async function readJsonFile(name: string): Promise<Record<string, unknown>> {
  const safe = path.basename(name);
  return JSON.parse(
    await fs.readFile(path.join(dataRoot, safe.endsWith(".json") ? safe : `${safe}.json`), "utf8")
  );
}

export async function writeJsonFile(
  name: string,
  data: unknown
): Promise<void> {
  const safe = path.basename(name);
  await fs.mkdir(dataRoot, { recursive: true });
  await fs.writeFile(
    path.join(dataRoot, safe.endsWith(".json") ? safe : `${safe}.json`),
    JSON.stringify(data, null, 2),
    "utf8"
  );
}

export interface MediaFile {
  name: string;
  size: number;
  href: string;
}

export async function listMedia(): Promise<MediaFile[]> {
  await fs.mkdir(mediaRoot, { recursive: true });
  const entries = await fs.readdir(mediaRoot, { withFileTypes: true });
  return await Promise.all(
    entries
      .filter((e) => e.isFile())
      .map(async (e) => {
        const stat = await fs.stat(path.join(mediaRoot, e.name));
        return { name: e.name, size: stat.size, href: `/media/${e.name}` };
      })
  );
}

/** @returns the saved file path or null when the filename is invalid */
export async function uploadMedia(filename: string, data: Buffer): Promise<MediaFile | null> {
  const safeName = path.basename(filename).replace(/[^\w.-]/g, "").trim();
  if (!safeName) return null;
  await fs.mkdir(mediaRoot, { recursive: true });
  const dest = path.join(mediaRoot, safeName);
  await fs.writeFile(dest, data);
  const stat = await fs.stat(dest);
  return { name: safeName, size: stat.size, href: `/media/${safeName}` };
}

export async function deleteMedia(filename: string): Promise<void> {
  const safeName = path.basename(filename).replace(/[^\w.-]/g, "").trim();
  if (!safeName) return;
  await fs.rm(path.join(mediaRoot, safeName), { force: true });
}

/** Fast path used by every admin Save: regenerates ONLY typed content
 *  modules (~100ms) — no covers / notebooks / PDFs. */
export async function runGenerateData(): Promise<{ ok: boolean; message: string }> {
  return runScript("gen:data");
}

export async function runContentGenerate(): Promise<{ ok: boolean; message: string }> {
  return runScript("generate");
}

/** Run a package.json generator script directly (e.g. "generate-pdfs"). */
export async function runScript(
  script: string,
  args: string[] = []
): Promise<{ ok: boolean; message: string }> {
  const { execFile } = await import("node:child_process");
  const cmd = process.env.ComSpec || "cmd.exe";
  return await new Promise((resolve) => {
    execFile(/*turbopackIgnore: true*/ cmd, ["/c", `npm run ${script}`, ...args], { cwd: process.cwd() }, (err, _stdout, stderr) => {
      if (err) resolve({ ok: false, message: stderr || err.message });
      else resolve({ ok: true, message: `${script} finished.` });
    });
  });
}
/* ------------------------------ notebooks ------------------------------ */

const notebooksSrcDir = path.join(contentRoot, "notebooks");

export interface NotebookSaved {
  slug: string;
  name: string;
}

/** Validate (.ipynb + JSON body) and store under content/notebooks/. */
export async function saveNotebook(
  filename: string,
  data: Buffer
): Promise<NotebookSaved | null> {
  const base = path.basename(filename);
  if (!base.toLowerCase().endsWith(".ipynb")) return null;
  let json: unknown;
  try {
    json = JSON.parse(data.toString("utf8"));
  } catch {
    return null;
  }
  if (typeof json !== "object" || json === null || !Array.isArray((json as { cells?: unknown }).cells)) {
    return null;
  }
  await fs.mkdir(notebooksSrcDir, { recursive: true });
  await fs.writeFile(path.join(notebooksSrcDir, base), data);
  return { slug: sanitizeSlug(path.basename(base, ".ipynb")), name: base };
}

export async function deleteNotebook(filename: string): Promise<void> {
  const base = path.basename(filename);
  if (!base.toLowerCase().endsWith(".ipynb")) return;
  await fs.rm(path.join(notebooksSrcDir, base), { force: true });
}

export interface NotebookSource {
  name: string;
  sizeKb: number;
}

export async function listNotebookSources(): Promise<NotebookSource[]> {
  await fs.mkdir(notebooksSrcDir, { recursive: true });
  const entries = await fs.readdir(notebooksSrcDir);
  const out: NotebookSource[] = [];
  for (const name of entries.filter((f) => f.endsWith(".ipynb")).sort()) {
    const st = await fs.stat(path.join(notebooksSrcDir, name));
    out.push({ name, sizeKb: Math.round(st.size / 102.4) / 10 });
  }
  return out;
}
/* ------------------------------ covers ------------------------------ */

const coversDir = path.join(process.cwd(), "public", "covers");

export interface CoverFile {
  name: string;
  href: string;
}

export async function listCovers(): Promise<CoverFile[]> {
  await fs.mkdir(uploadsDir, { recursive: true });
  const generated = await fs.readdir(coversDir);
  let uploaded: string[] = [];
  try { uploaded = await fs.readdir(uploadsDir); } catch {}
  return [
    ...generated.filter((f) => f.endsWith(".svg")).sort()
      .map((name) => ({ name, href: `/covers/${name}` })),
    ...uploaded.filter((f) => COVER_EXT.test(f)).sort()
      .map((name) => ({ name, href: `/covers/uploads/${name}` })),
  ];
}

/** Run generate-covers for a single slug/title; returns the cover path. */
export async function ensureCover(
  slug: string,
  title: string,
  style = "",
  variant = 0
): Promise<string | null> {
  const safeSlug = sanitizeSlug(slug);
  if (!safeSlug || !title?.trim()) return null;
  const { execFile } = await import("node:child_process");
  const node = process.execPath;
  const script = path.join(process.cwd(), "scripts", "generate-covers.mjs");
  const extra: string[] = [];
  if (style) extra.push("--style", style);
  extra.push("--variant", String(variant));
  await new Promise<void>((resolve) => {
    execFile(
      node,
      [script, "--slug", safeSlug, "--title", title.trim(), ...extra],
      { cwd: process.cwd() },
      () => resolve()
    );
  });
  const target = path.join(coversDir, `${safeSlug}.svg`);
  try {
    await fs.access(target);
    return `/covers/${safeSlug}.svg`;
  } catch {
    return null;
  }
}
/* -------------------------- cover uploads -------------------------- */

const uploadsDir = path.join(coversDir, "uploads");
const COVER_EXT = /\.(webp|avif|jpe?g|png|gif|svg|mp4|webm|m4v)$/i;

export interface UploadedCover {
  path: string;
  bytes: number;
}

/** Store an uploaded cover of ANY supported format under covers/uploads/. */
export async function saveCoverUpload(
  slug: string,
  filename: string,
  data: Buffer
): Promise<UploadedCover | null> {
  const ext = path.extname(filename).toLowerCase();
  if (!COVER_EXT.test(ext)) return null;
  const base = sanitizeSlug(slug) || `cover-${Date.now()}`;
  const safeName = `${base}-${Date.now().toString(36)}${ext}`;
  if (data.byteLength > 8 * 1024 * 1024) return null; // 8 MB cap
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(path.join(uploadsDir, safeName), data);
  return {
    path: `/covers/uploads/${safeName}`,
    bytes: data.byteLength,
  };
}
/**
 * Delete a cover by href ("/covers/<name>" or "/covers/uploads/<name>").
 * Path-traversal safe: only the basename is used and deletion is confined
 * to the covers directories. Returns true when a file was removed.
 */
export async function deleteCover(href: string): Promise<boolean> {
  const name = path.basename(href);
  if (!/\.(svg|webp|avif|jpe?g|png|gif|mp4|webm|m4v)$/i.test(name)) return false;
  const isUpload = href.includes("/uploads/");
  const target = path.join(isUpload ? uploadsDir : coversDir, path.basename(name));
  // final containment check
  if (!target.startsWith(coversDir)) return false;
  try {
    await fs.rm(target, { force: false });
    return true;
  } catch {
    return false;
  }
}