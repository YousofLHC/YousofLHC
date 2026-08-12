"use client";

import { useEffect, useState } from "react";

export function ArticleToc() {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll("article h2[id], article h3[id]")
    ) as HTMLElement[];

    const raf = requestAnimationFrame(() => {
      setHeadings(
        els.map((el) => ({
          id: el.id,
          text: el.textContent ?? "",
          level: el.tagName === "H2" ? 2 : 3,
        }))
      );
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-100px 0px -70% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden lg:block">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-faint">On this page</p>
      <ul className="mt-3 space-y-1 border-l border-line">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`block border-l-2 py-1 pr-3 text-[13px] leading-5 transition-colors ${
                active === h.id
                  ? "border-cyan text-cyan"
                  : "border-transparent text-dim hover:text-ink"
              } ${h.level === 3 ? "pl-4" : ""}`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
