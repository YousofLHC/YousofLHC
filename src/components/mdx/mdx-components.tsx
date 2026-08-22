import React from "react";
import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { ArrowUpRight, Download, Lightbulb, Info, TriangleAlert } from "lucide-react";
import { CodeBlock } from "@/components/ui/code-block";
import { Mermaid } from "@/components/ui/mermaid";
import { Lightbox } from "@/components/ui/lightbox";
import {
  LJPlot,
  LJForcePlot,
  BondPlot,
  DihedralPlot,
  CoulombPlot,
  TailPlot,
  VerletPlot,
} from "@/components/ui/math-plot";
import { getNotebook } from "@/lib/notebooks";

function Pre({ children }: { children?: React.ReactNode }) {
  const raw = Array.isArray(children) ? children[0] : children;
  if (React.isValidElement(raw)) {
    const props = raw.props as { className?: string; children?: React.ReactNode };
    const cls = props.className || "";
    const m = cls.match(/language-(\S+)/);
    const lang = m?.[1] ?? "text";
    const text = String(props.children ?? "");
    if (lang === "mermaid") return <Mermaid chart={text} />;
    return <CodeBlock code={text} language={lang} />;
  }
  return <pre>{children}</pre>;
}

function Figure({
  src,
  alt,
  caption,
  aspect,
}: {
  src: string;
  alt: string;
  caption?: string;
  aspect?: string;
}) {
  return <Lightbox src={src} alt={alt} caption={caption} aspect={aspect} />;
}

function Diagram({ chart, caption }: { chart: string; caption?: string }) {
  return <Mermaid chart={chart} caption={caption} />;
}

const calloutStyles = {
  note: { border: "border-cyan/40", bg: "bg-cyan/5", icon: Info, color: "text-cyan" },
  tip: { border: "border-emerald/40", bg: "bg-emerald/5", icon: Lightbulb, color: "text-emerald" },
  warning: { border: "border-amber/40", bg: "bg-amber/5", icon: TriangleAlert, color: "text-amber" },
  danger: { border: "border-magenta/40", bg: "bg-magenta/5", icon: TriangleAlert, color: "text-magenta" },
} as const;

function Callout({
  type = "note",
  title,
  children,
}: {
  type?: keyof typeof calloutStyles;
  title?: string;
  children?: React.ReactNode;
}) {
  const s = calloutStyles[type];
  return (
    <aside className={`my-6 rounded-xl border ${s.border} ${s.bg} px-5 py-4`}>
      <p className={`mb-1.5 flex items-center gap-2 font-mono text-xs uppercase tracking-wider ${s.color}`}>
        <s.icon size={14} />
        {title ?? type}
      </p>
      <div className="text-sm leading-7 text-ink/85">{children}</div>
    </aside>
  );
}

function NotebookCard({
  slug,
  title,
  description,
}: {
  slug: string;
  title?: string;
  description?: string;
}) {
  const nb = getNotebook(slug);
  return (
    <Link
      href={`/notebooks/${slug}`}
      className="group my-6 flex items-center gap-4 rounded-2xl border border-line bg-gradient-to-r from-panel to-panel/40 p-5 transition-all hover:border-cyan/40 hover:shadow-[0_0_30px_-10px_rgba(59,225,255,0.35)]"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan/25 to-violet/25 text-cyan transition-transform group-hover:scale-110">
        <Download size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-xs uppercase tracking-wider text-faint">Interact with notebook</p>
        <p className="truncate font-semibold text-ink group-hover:text-cyan">
          {title ?? nb?.title ?? slug}
        </p>
        <p className="truncate text-sm text-dim">{description ?? nb?.description}</p>
      </div>
      <ArrowUpRight size={16} className="shrink-0 text-faint transition-colors group-hover:text-cyan" />
    </Link>
  );
}

export function getMdxComponents(): MDXComponents {
  return {
    pre: ((props: React.HTMLAttributes<HTMLPreElement>) => <Pre>{props.children}</Pre>) as MDXComponents["pre"],
    img: ((props: React.ImgHTMLAttributes<HTMLImageElement>) => {
      const p = props as React.ImgHTMLAttributes<HTMLImageElement> & { "data-caption"?: string };
      return (
        <Figure
          src={p.src ? String(p.src) : ""}
          alt={p.alt ?? ""}
          caption={p["data-caption"] ?? p.title}
        />
      );
    }) as MDXComponents["img"],
    a: ({ href, children, ...rest }) => {
      const external = href?.startsWith("http");
      if (external) {
        return (
          <a href={href} target="_blank" rel="noreferrer" {...rest}>
            {children}
            <ArrowUpRight size={12} className="ml-0.5 inline" />
          </a>
        );
      }
      return (
        <Link href={href ?? "#"} {...rest}>
          {children}
        </Link>
      );
    },
    Figure,
    Diagram,
    Callout,
    NotebookCard,
    LJPlot,
    LJForcePlot,
    BondPlot,
    DihedralPlot,
    CoulombPlot,
    TailPlot,
    VerletPlot,
  };
}
