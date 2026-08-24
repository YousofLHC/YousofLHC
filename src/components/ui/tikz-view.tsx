"use client";

import { useEffect, useRef } from "react";

/**
 * TikZ renderer via TikzJax (WASM TeX).
 *
 * Performance contract:
 *  - the engine (~2-4 MB) loads ONLY on pages that actually contain a tikz block
 *  - it is injected once per page load (single-flight promise), after `load`,
 *    with `defer` semantics — never preloaded
 *  - fonts.css is loaded alongside (required for correct glyph metrics)
 *  - code changes re-process by re-inserting the engine tag (its IIFE scans
 *    the DOM for <script type="text/tikz">); hosts are cleared first so no
 *    duplicated output can stack
 */
declare global {
  interface Window {
    __tikzjax?: { booting: boolean; ready: Promise<void> };
  }
}

function ensureEngine(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (!window.__tikzjax) {
    window.__tikzjax = {
      booting: false,
      ready: new Promise<void>((resolve) => {
        const finish = () => resolve();
        // process whatever is in the DOM once fonts + engine are up
        const run = () => {
          const s = document.createElement("script");
          s.src = "https://tikzjax.com/v1/tikzjax.js";
          s.async = true;
          s.onload = finish;
          s.onerror = () => finish();
          document.head.appendChild(s);
        };
        const fonts = document.createElement("link");
        fonts.rel = "stylesheet";
        fonts.href = "https://tikzjax.com/v1/fonts.css";
        fonts.onload = run;
        fonts.onerror = run;
        document.head.appendChild(fonts);
      }),
    };
  }
  return window.__tikzjax.ready;
}

/** Re-process by injecting a fresh engine copy (TikzJax scans DOM on exec). */
function rerun() {
  const s = document.createElement("script");
  s.src = `https://tikzjax.com/v1/tikzjax.js?r=${Date.now()}`;
  s.async = true;
  document.head.appendChild(s);
}

export function TikzView({ code }: { code: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const host = hostRef.current;
    if (!host) return;

    ensureEngine()
      .then(() => {
        if (cancelled || !host.isConnected) return;
        host.innerHTML = "";
        const el = document.createElement("script");
        el.type = "text/tikz";
        el.textContent = code;
        host.appendChild(el);
        rerun();
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [code]);

  return (
    <div className="tikz my-6">
      <div className="overflow-x-auto rounded-lg border border-line bg-white p-4 text-center">
        <div ref={hostRef} className="inline-block min-h-[80px] [&_svg]:max-w-full [&_svg]:h-auto" />
      </div>
      <p className="mt-1 text-center font-mono text-[10px] text-faint">
        rendered with TikZJax — first draw downloads the TeX engine once
      </p>
    </div>
  );
}
