"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, saveArticle, deleteArticle, readArticleSource, readJsonFile, writeJsonFile, listMedia, uploadMedia, deleteMedia, runContentGenerate, type ArticleKind } from "@/lib/admin/store";

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

export async function saveSiteConfig(data: Record<string, unknown>): Promise<ActionResult> {
  return guard(async () => {
    await writeJsonFile("site.json", data);
    revalidatePath("/", "layout");
  });
}

export async function getContentConfig(): Promise<ActionResult<Record<string, unknown>>> {
  return guard(async () => readJsonFile("content.json"));
}

export async function saveContentConfig(data: Record<string, unknown>): Promise<ActionResult> {
  return guard(async () => {
    await writeJsonFile("content.json", data);
    revalidatePath("/", "layout");
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
