import "katex/contrib/mhchem";
import path from "path";
import { readFileSync, readdirSync, existsSync } from "fs";
import { evaluate } from "next-mdx-remote-client/rsc";
import matter from "gray-matter";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import type { MDXComponents } from "mdx/types";
import type { ReactElement } from "react";
import type { PluggableList } from "unified";

export const mdxOptions: {
  remarkPlugins: PluggableList;
  rehypePlugins: PluggableList;
} = {
  remarkPlugins: [remarkMath, remarkGfm],
  rehypePlugins: [
    [rehypeKatex, { strict: false, throwOnError: false, trust: false, output: "html" }],
    rehypeSlug,
  ],
};

export const contentRoot = path.join(process.cwd(), "content");

export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readTime: number;
  cover?: string;
  subject?: string;
  pdf?: string;
  order?: number;
  draft?: boolean;
  [key: string]: unknown;
}

function readDir(dir: string): string[] {
  try {
    return readdirSync(dir);
  } catch {
    return [];
  }
}

/** list the frontmatter of every .mdx in a content subfolder, newest first */
export async function listArticles<T extends ArticleMeta = ArticleMeta>(
  folder: string
): Promise<T[]> {
  const dir = path.join(contentRoot, folder);
  const files = readDir(dir)
    .filter((f) => f.endsWith(".mdx"))
    .sort((a, b) => b.localeCompare(a));

  const items: T[] = [];
  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const source = readFileSync(path.join(dir, file), "utf8");
    const { data } = matter(source);
    if (data.draft) continue;
    items.push({ ...(data as T), slug } as T);
  }
  return items.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

export interface RenderedArticle<T extends ArticleMeta = ArticleMeta> {
  content: ReactElement;
  meta: T;
  source: string;
}

/**
 * Compile a single MDX article with the shared remark/rehype pipeline
 * (KaTeX + mhchem, GFM, heading slugs) and the site-wide MDX components.
 */
export async function renderArticle<T extends ArticleMeta = ArticleMeta>(
  folder: string,
  slug: string,
  components: MDXComponents
): Promise<RenderedArticle<T> | null> {
  const file = path.join(contentRoot, folder, `${slug}.mdx`);
  if (!existsSync(file)) return null;
  const source = readFileSync(file, "utf8");
  const { data, content } = matter(source);

  const { content: rendered, frontmatter } = await evaluate({
    source: content,
    components,
    options: {
      mdxOptions,
      parseFrontmatter: true,
    },
  });

  const meta = { ...(data as T), ...(frontmatter as Partial<T>), slug } as T;
  return { content: rendered as ReactElement, meta, source };
}

export function readTime(text: string, wpm = 220): number {
  return Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / wpm));
}

