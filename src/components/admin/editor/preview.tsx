"use client";

import "katex/contrib/mhchem";
import { useEffect, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import { Mermaid } from "@/components/ui/mermaid";
import { CodeBlock } from "@/components/ui/code-block";
import { renderArticlePreview } from "@/app/admin/preview-action";

/**
 * Live preview pane with true production parity.
 *
 * Body is compiled server-side with the exact MDX pipeline used by the public
 * site (Callout / Diagram / NotebookCard / Figure / mermaid / prism CodeBlock /
 * KaTeX+mhchem). While the server render is pending or on compile errors, a
 * lightweight react-markdown fallback keeps the pane usable.
 */
export function MarkdownPreview({ body }: { body: string }) {
  const [html, setHtml] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const empty = !body.trim();

  useEffect(() => {
    if (empty) return;
    let active = true;
    const t = setTimeout(async () => {
      setPending(true);
      const res = await renderArticlePreview(body);
      if (!active) return;
      setPending(false);
      if (res.ok) {
        setHtml(res.html ?? "");
        setErr(null);
      } else {
        setErr(res.error ?? "MDX compilation failed");
      }
    }, 350);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [body, empty]);

  if (empty) {
    return (
      <div className="rich px-6 py-8">
        <p className="font-mono text-sm text-faint">Preview appears here as you type…</p>
      </div>
    );
  }

  if (pending && html === null) {
    return (
      <div className="flex items-center justify-center gap-2 px-6 py-16 font-mono text-xs text-faint">
        <Loader2 size={14} className="animate-spin" /> compiling preview…
      </div>
    );
  }

  if (err && html === null) {
    return (
      <div className="space-y-4 px-6 py-6">
        <div className="flex items-start gap-2 rounded-lg border border-magenta/40 bg-magenta/5 p-3 text-sm text-dim">
          <AlertTriangle size={15} className="mt-0.5 shrink-0 text-magenta" />
          <div className="min-w-0">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-magenta">MDX error</p>
            <pre className="mt-1.5 whitespace-pre-wrap font-mono text-xs leading-5 text-dim">{err}</pre>
          </div>
        </div>
        <FallbackPreview body={body} />
      </div>
    );
  }

  return (
    <div className="rich px-6 py-8">
      <div dangerouslySetInnerHTML={{ __html: html ?? "" }} />
      {pending && html !== null && (
        <p className="mt-4 font-mono text-[10px] text-faint">recompiling…</p>
      )}
    </div>
  );
}

/** Basic markdown rendering when MDX compilation fails (keeps the pane useful). */
function FallbackPreview({ body }: { body: string }) {
  return (
    <div className="rich rounded-xl border border-line bg-void/40 p-5">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[[rehypeKatex, { strict: false, throwOnError: false, trust: false }]]}
        components={{
          code: ({ className, children }) => {
            const lang = className?.replace(/language-/, "");
            if (lang === "mermaid") return <Mermaid chart={String(children ?? "")} />;
            return <CodeBlock code={String(children ?? "")} language={lang ?? "text"} fontSize={12} />;
          },
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}