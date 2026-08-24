"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, saveArticle, deleteArticle, readArticleSource, readJsonFile, writeJsonFile, listMedia, uploadMedia, deleteMedia, runContentGenerate, runScript, runGenerateData, listCovers, ensureCover, saveCoverUpload, deleteCover, saveNotebook, deleteNotebook, type ArticleKind } from "@/lib/admin/store";

export type { ArticleKind } from "@/lib/admin/store";

export interface ActionResult<T = void> {
  ok: boolean;
  error?: string;
  data?: T;
}

async function guard<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    await requireAdmin();
    return { ok: true, data: await fn() };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e && String((e as { digest?: string }).digest).startsWith("NEXT_REDIRECT")) {
      throw e;
    }
    return { ok: false, error: e instanceof Error ? e.message : "Unexpected error" };
  }
}

export async function getArticle(
  kind: ArticleKind,
  slug: string
): Promise<ActionResult<{ frontmatter: Record<string, unknown>; body: string; slug: string } | null>> {
  return guard(async () => readArticleSource(kind, slug));
}

export async function createOrUpdateArticle(
  kind: ArticleKind,
  slug: string,
  frontmatter: Record<string, unknown>,
  body: string
): Promise<ActionResult<{ slug: string }>> {
  return guard(async () => {
    const newSlug = await saveArticle(kind, slug, frontmatter, body);
    revalidatePath("/");
    revalidatePath(`/${kind === "posts" ? "blog" : kind}`);
    revalidatePath(`/${kind === "posts" ? "blog" : kind}/${newSlug}`);
    return { slug: newSlug };
  });
}

export async function removeArticle(
  kind: ArticleKind,
  slug: string
): Promise<ActionResult> {
  return guard(async () => {
    await deleteArticle(kind, slug);
    revalidatePath("/");
    revalidatePath(`/${kind === "posts" ? "blog" : kind}`);
  });
}

export async function getSiteConfig(): Promise<ActionResult<Record<string, unknown>>> {
  return guard(async () => readJsonFile("site.json"));
}

export async function saveSiteConfig(data: Record<string, unknown>): Promise<ActionResult<{ regenerated: boolean }>> {
  return guard(async () => {
    await writeJsonFile("site.json", data);
    const gen = await runGenerateData();
    revalidatePath("/", "layout");
    return { regenerated: gen.ok };
  });
}

export async function getContentConfig(): Promise<ActionResult<Record<string, unknown>>> {
  return guard(async () => readJsonFile("content.json"));
}

export async function saveContentConfig(data: Record<string, unknown>): Promise<ActionResult<{ regenerated: boolean }>> {
  return guard(async () => {
    await writeJsonFile("content.json", data);
    await runGenerateData();
    revalidatePath("/", "layout");
    return { regenerated: true };
  });
}

export async function getMedia(): Promise<ActionResult<{ name: string; size: number; href: string }[]>> {
  return guard(async () => listMedia());
}

export async function uploadMediaFile(filename: string, bytes: ArrayBuffer): Promise<ActionResult<{ name: string; size: number; href: string }>> {
  return guard(async () => {
    const file = await uploadMedia(filename, Buffer.from(bytes));
    if (!file) return Promise.reject(new Error("Invalid filename"));
    revalidatePath("/admin/media");
    return file;
  });
}

export async function removeMediaFile(filename: string): Promise<ActionResult> {
  return guard(async () => {
    await deleteMedia(filename);
    revalidatePath("/admin/media");
  });
}

export async function publish(): Promise<ActionResult<{ message: string }>> {
  return guard(async () => {
    const result = await runContentGenerate();
    if (!result.ok) return Promise.reject(new Error(result.message));
    return { message: result.message };
  });
}

/* ---------- data-studio v2 ---------- */

export async function saveDataFile(
  file: "content.json" | "site.json",
  data: Record<string, unknown>
): Promise<ActionResult<{ regenerated: boolean; generateError?: string }>> {
  return guard(async () => {
    await writeJsonFile(file, data);
    const gen = await runGenerateData();
    return { regenerated: gen.ok, generateError: gen.ok ? undefined : gen.message };
  });
}

export async function regeneratePdfs(): Promise<ActionResult<{ message: string }>> {
  return guard(async () => {
    const r = await runScript("generate-pdfs");
    if (!r.ok) throw new Error(r.message);
    return { message: r.message };
  });
}

/* ---------- notebooks ---------- */

export async function uploadNotebook(
  filename: string,
  data: Uint8Array
): Promise<ActionResult<{ slug: string }>> {
  return guard(async () => {
    const saved = await saveNotebook(filename, Buffer.from(data));
    if (!saved) throw new Error("Invalid .ipynb file");
    await runContentGenerate();
    return { slug: saved.slug };
  });
}

export async function removeNotebook(name: string): Promise<ActionResult> {
  return guard(async () => {
    await deleteNotebook(name);
    await runContentGenerate();
  });
}
/* ---------- covers ---------- */

export async function listCoversAction(): Promise<
  ActionResult<{ name: string; href: string }[]>
> {
  return guard(async () => listCovers());
}

export async function ensureCoverAction(
  slug: string,
  title: string,
  style = "",
  variant = 0
): Promise<ActionResult<{ path: string }>> {
  return guard(async () => {
    const p = await ensureCover(slug, title, style, variant);
    if (!p) throw new Error("Cover generation failed");
    return { path: p };
  });
}
export async function uploadCoverFile(
  slug: string,
  filename: string,
  bytes: ArrayBuffer
): Promise<ActionResult<{ path: string; bytes: number }>> {
  return guard(async () => {
    const saved = await saveCoverUpload(slug, filename, Buffer.from(bytes));
    if (!saved) throw new Error("Unsupported format or file > 8 MB");
    return { path: saved.path, bytes: saved.bytes };
  });
}
export async function removeCoverAction(
  href: string
): Promise<ActionResult<{ href: string }>> {
  return guard(async () => {
    const ok = await deleteCover(href);
    if (!ok) throw new Error("Cover not found or cannot be deleted");
    return { href };
  });
}