"use server";

import { evaluate } from "next-mdx-remote-client/rsc";
import { requireAdmin } from "@/lib/admin/store";
import { mdxOptions } from "@/lib/mdx";
import { getMdxComponents } from "@/components/mdx/mdx-components";

export interface PreviewResult {
  ok: boolean;
  error?: string;
  /** Static HTML — serialized safely across the action boundary. */
  html?: string;
}

/**
 * Renders a Markdown/MDX body with the SAME pipeline as the public site
 * (remarkMath + remarkGfm + rehypeKatex/mhchem + full MDX component map),
 * then converts it to an HTML STRING via renderToStaticMarkup so nothing
 * React-internal crosses the server→client boundary (no enqueueModel-style
 * flight errors, even under HMR).
 */
export async function renderArticlePreview(body: string): Promise<PreviewResult> {
  await requireAdmin();
  if (!body.trim()) return { ok: true };
  try {
    const { content } = await evaluate({
      source: body,
      components: getMdxComponents(),
      options: { mdxOptions },
    });
    const { renderToStaticMarkup } = await import("react-dom/server");
    const html = renderToStaticMarkup(content);
    return { ok: true, html };
  } catch (e) {
    const message = e instanceof Error ? e.message : "MDX compilation failed";
    // round-trips through the client as plain text; strip long stack traces
    return { ok: false, error: message.split("\n").slice(0, 6).join("\n") };
  }
}

/* ------------------------------------------------------------------ */
/* Section-scoped preview: composes a Markdown doc from the CURRENT    */
/* editor state and renders it through the production pipeline.        */
/* ------------------------------------------------------------------ */

type Json = Record<string, unknown>;
const arr = (j: Json, k: string) => (Array.isArray(j[k]) ? (j[k] as Json[]) : []);
const str = (v: unknown) => String(v ?? "");

function composeSection(key: string, content: Json, site: Json): string {
  switch (key) {
    case "profile": {
      const p = (content.profile ?? {}) as Json;
      const bio = Array.isArray(p.bio) ? p.bio : [];
      return [
        `## ${str(p.name)}`,
        str(p.role),
        "",
        ...bio.map((b) => `${str(b)}\n`),
        str(p.focus) && `> → ${str(p.focus)}`,
      ].filter(Boolean).join("\n");
    }
    case "education":
    case "experience":
      return arr(content, key)
        .map((e, i) =>
          [
            `### ${i + 1}. ${str(e.title)}`,
            `\`${str(e.period)}\` — **${str(e.org)}**`,
            str(e.detail),
            Array.isArray(e.tags) && e.tags.length
              ? (e.tags as string[]).map((t) => `\`${t}\``).join(" · ")
              : "",
          ]
            .filter(Boolean)
            .join("\n")
        )
        .join("\n\n");

    case "publications":
      return arr(content, "publications")
        .map(
          (p, i) =>
            `${i + 1}. **${str(p.title)}**  \n` +
            `   ${str(p.authors)} · *${str(p.venue)}* (${str(p.year)}) \`${str(p.status)}\``
        )
        .join("\n");

    case "skills":
      return arr(content, "skills")
        .map(
          (g) =>
            `### ${str(g.name)}\n` +
            ((g.skills as Json[]) ?? [])
              .map((s) => `- ${str(s.name)} — **${Number(s.level ?? 0)}%**`)
              .join("\n")
        )
        .join("\n\n");

    case "awards":
    case "certifications":
      return arr(content, key)
        .map((x) => `- \`${str(x.year)}\` **${str(x.title)}** — ${str(x.org)}`)
        .join("\n");

    case "languages":
      return arr(content, "languages")
        .map((l) => `- **${str(l.name)}** — ${str(l.level)} (${Number(l.percentage ?? 0)}%)`)
        .join("\n");

    case "site-meta":
    case "socialLinks":
    case "navLinks": {
      const lines = [`### ${key}`];
      for (const [k, v] of Object.entries(key === "site-meta" ? site : {}))
        if (typeof v === "string" || typeof v === "number") lines.push(`- **${k}**: ${String(v)}`);
      if (key === "socialLinks")
        for (const l of arr(site, "socialLinks"))
          lines.push(`- ${str(l.label)} → <${str(l.url) || "(email auto)"}>`);
      if (key === "navLinks")
        for (const n of arr(site, "navLinks")) lines.push(`- [${str(n.label)}](${str(n.href)})`);
      return lines.join("\n");
    }

    default:
      return `### ${key}`;
  }
}

export async function renderSectionPreview(
  sectionKey: string,
  data: { "content.json": Record<string, unknown>; "site.json": Record<string, unknown> }
): Promise<PreviewResult> {
  await requireAdmin();
  if (!sectionKey) return { ok: true };
  try {
    const md = composeSection(sectionKey, data["content.json"] ?? {}, data["site.json"] ?? {});
    if (!md.trim()) return { ok: true, html: "" };
    const { content } = await evaluate({
      source: md,
      components: getMdxComponents(),
      options: { mdxOptions },
    });
    const { renderToStaticMarkup } = await import("react-dom/server");
    return { ok: true, html: renderToStaticMarkup(content) };
  } catch (e) {
    return {
      ok: false,
      error: (e instanceof Error ? e.message : "render failed").split("\n").slice(0, 4).join("\n"),
    };
  }
}