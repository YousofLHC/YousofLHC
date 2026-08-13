"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function TimelineFill({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const fill = fillRef.current;
    if (!root || !fill) return;

    const update = () => {
      const r = root.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.75 - r.top) / r.height));
      fill.style.height = `${p * 100}%`;
      root.querySelectorAll<HTMLElement>(".tl-node").forEach((node) => {
        const nr = node.getBoundingClientRect();
        node.classList.toggle("filled", nr.top - r.top <= p * r.height);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={rootRef} className="tl">
      <div className="tl-track">
        <div ref={fillRef} className="tl-fill" />
      </div>
      {children}
    </div>
  );
}