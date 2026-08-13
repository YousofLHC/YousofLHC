"use client";

import { useRef } from "react";

export function HeroGlow({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mx", `${e.nativeEvent.offsetX}px`);
    el.style.setProperty("--my", `${e.nativeEvent.offsetY}px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      aria-hidden
      className={`hero-glow ${className ?? ""}`}
    />
  );
}
