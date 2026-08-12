"use server";

import type { ReactNode } from "react";
import { evaluate } from "next-mdx-remote-client/rsc";
import { requireAdmin } from "@/lib/admin/store";
import { mdxOptions } from "@/lib/mdx";
import { getMdxComponents } from "@/components/mdx/mdx-components";

export interface PreviewResult {
  ok: boolean;
  error?: string;
  node?: ReactNode;
}

/**
 * Renders a Markdown/MDX body with the SAME pipeline as the public site
 * (remarkMath + remarkGfm + rehypeKatex/mhchem + MDX component map incl.
 * Callout, Diagram, NotebookCard, Figure, mermaid, prism CodeBlock).
 * Used by the admin live preview so what you see is exactly production.
 */
export async function renderArticlePreview(body: string): Promise<PreviewResult> {
  await requireAdmin();
  if (!body.trim()) return { ok: true, node: undefined };
  try {
    const { content } = await evaluate({
      source: body,
      components: getMdxComponents(),
      options: { mdxOptions },
    });
    return { ok: true, node: content as ReactNode };
  } catch (e) {
    const message = e instanceof Error ? e.message : "MDX compilation failed";
    // round-trips through the client as plain text; strip long stack traces
    return { ok: false, error: message.split("\n").slice(0, 6).join("\n") };
  }
}