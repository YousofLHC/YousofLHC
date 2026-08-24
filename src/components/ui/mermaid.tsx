"use client";

import { useEffect, useId, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

type Theme = "dark" | "light";

/* serialized render queue — init→render pairs never interleave */
let renderQueue: Promise<unknown> = Promise.resolve();
function enqueueRender<T>(fn: () => Promise<T>): Promise<T> {
  const next = renderQueue.then(fn, fn);
  renderQueue = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

function readTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function palette(theme: Theme) {
  return theme === "light"
    ? {
        background: "#ffffff",
        primaryColor: "#eef4ff",
        primaryTextColor: "#0f1730",
        primaryBorderColor: "#0891b2",
        lineColor: "#7c3aed",
        secondaryColor: "#f3ecff",
        tertiaryColor: "#e7f8fc",
        nodeTextColor: "#0f1730",
        clusterBkg: "#ffffff",
      }
    : {
        background: "#0b1128",
        primaryColor: "#0f1a3d",
        primaryTextColor: "#dce6ff",
        primaryBorderColor: "#3be1ff",
        lineColor: "#5b6cff",
        secondaryColor: "#1a1438",
        tertiaryColor: "#0c1630",
        nodeTextColor: "#dce6ff",
        clusterBkg: "#0b1128",
      };
}

export function Mermaid({ chart, caption }: { chart: string; caption?: string }) {
  const id = useId().replace(/[:]/g, "");
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    const el = document.documentElement;
    const sync = () => setTheme(readTheme());
    const obs = new MutationObserver(sync);
    obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    let active = true;
    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;
        /* Global config is last-wins, so renders from all instances are
           serialized through a shared queue — each init→render pair runs
           atomically with its OWN theme (base honors themeVariables fully),
           eliminating light/dark cross-contamination between diagrams. */
        const { svg } = await enqueueRender(() => {
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: "strict",
            fontFamily: "JetBrains Mono, monospace",
            theme: "base",
            themeVariables: palette(theme),
          });
          return mermaid.render(`mmd-${id}`, chart);
        });
        if (active) setHtml(svg);
      } catch {
        if (active) setError(true);
      }
    }
    render();
    return () => {
      active = false;
    };
  }, [chart, id, theme]);

  if (error) {
    return (
      <div className="my-6 flex items-center gap-2 rounded-lg border border-magenta/40 bg-magenta/5 p-3 text-sm text-dim">
        <AlertTriangle size={15} className="text-magenta" />
        Could not render diagram.
      </div>
    );
  }

  return (
    <figure className="my-6">
      <div className="mermaid overflow-x-auto rounded-xl border border-line bg-panel p-4">
        {html ? (
          <div
            aria-hidden="false"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <div className="flex items-center gap-2 font-mono text-xs text-faint">
            <Loader2 size={14} className="animate-spin" /> rendering diagram…
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center font-mono text-xs text-faint">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}