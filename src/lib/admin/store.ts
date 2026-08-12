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

export async function runContentGenerate(): Promise<{ ok: boolean; message: string }> {
  const { execFile } = await import("node:child_process");
  const cmd = process.env.ComSpec || "cmd.exe";
  return await new Promise((resolve) => {
    execFile(/*turbopackIgnore: true*/ cmd, ["/c", "npm run generate"], { cwd: process.cwd() }, (err, _stdout, stderr) => {
      if (err) resolve({ ok: false, message: stderr || err.message });
      else resolve({ ok: true, message: "Content regenerated." });
    });
  });
}