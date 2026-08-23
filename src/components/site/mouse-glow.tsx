"use client";

import { useEffect } from "react";

/**
 * Delegated mouse-tracker: sets --mx/--my CSS custom properties on any
 * ancestor element carrying [data-glow], powering radial hover glows
 * from server-rendered markup.
 */
export function MouseGlow() {
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const el = target?.closest?.("[data-glow]") as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    document.addEventListener("mousemove", onMove, { passive: true });
    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  return null;
}
