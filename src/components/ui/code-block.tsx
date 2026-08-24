"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Check, Copy } from "lucide-react";

/* --- theme subscription (SSR-safe via useSyncExternalStore) --- */

function subscribe(onChange: () => void) {
  const el = document.documentElement;
  const obs = new MutationObserver(onChange);
  obs.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
  return () => obs.disconnect();
}

const getSnapshot = () =>
  document.documentElement.dataset.theme !== "light";

const getServerSnapshot = () => true; // SSG always renders dark first

function useIsDark(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const darkTheme = {
  ...themes.nightOwl,
  plain: {
    ...themes.nightOwl.plain,
    backgroundColor: "transparent",
    color: "#dce6ff",
  },
};

/* light: GitHub-style — dark ink on a very light panel */
const lightTheme = {
  ...themes.github,
  plain: {
    ...themes.github.plain,
    backgroundColor: "#f6f8fb",
    color: "#111624",
  },
};

export function CodeBlock({
  code,
  language = "python",
  filename,
  showLineNumbers = false,
  fontSize = 13,
}: {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  fontSize?: number;
}) {
  const [copied, setCopied] = useState(false);
  const isDark = useIsDark();
  const theme = isDark ? darkTheme : lightTheme;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  const lang = language === "md" || language === "markdown" ? "markdown" : language;

  return (
    <div className="group my-6 overflow-hidden rounded-xl border border-line bg-[var(--t-code-bg)] shadow-[0_4px_16px_-6px_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between border-b border-line bg-panel/60 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-magenta/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald/60" />
          </span>
          {filename && (
            <span className="ml-2 font-mono text-[11px] text-dim">{filename}</span>
          )}
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-md border border-line px-2 py-1 font-mono text-[11px] text-dim transition-colors hover:border-cyan/50 hover:text-cyan"
        >
          {copied ? <Check size={12} className="text-emerald" /> : <Copy size={12} />}
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <div className="overflow-x-auto p-4" style={{ fontSize }}>
        <Highlight code={code.trimEnd()} language={lang} theme={theme}>
          {({ tokens, getLineProps, getTokenProps }) => (
            <pre className="font-mono leading-relaxed">
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })} className="table-row">
                  {showLineNumbers && (
                    <span className="table-cell select-none pr-4 text-right font-mono text-[0.85em] text-faint">
                      {i + 1}
                    </span>
                  )}
                  <span className="table-cell whitespace-pre">
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}
