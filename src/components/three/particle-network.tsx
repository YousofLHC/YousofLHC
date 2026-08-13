"use client";

import { useEffect, useRef } from "react";

const CYAN = { r: 79, g: 200, b: 232 };
const AMBER = { r: 232, g: 147, b: 74 };

export function ParticleNetwork({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;
    const COUNT = reduced || isMobile ? 0 : 90;
    const REPULSE_RADIUS = 140;
    const REPULSE_FORCE = 0.6;
    const LINK_DISTANCE = 115;

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;
    const mouse = { x: -9999, y: -9999 };

    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: 0.6 + Math.random() * 1.8,
      cyan: Math.random() < 0.82,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    const tick = () => {
      if (!running) return;
      raf = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = 0.65;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        const dxm = p.x - mouse.x;
        const dym = p.y - mouse.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < REPULSE_RADIUS && dm > 0.001) {
          const f = (1 - dm / REPULSE_RADIUS) * REPULSE_FORCE;
          p.x += (dxm / dm) * f;
          p.y += (dym / dm) * f;
        }

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        p.x = Math.max(0, Math.min(w, p.x));
        p.y = Math.max(0, Math.min(h, p.y));

        const c = p.cyan ? CYAN : AMBER;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},0.82)`;
        ctx.fill();
      }

      for (let i = 0; i < COUNT; i++) {
        const a = particles[i];
        for (let j = i + 1; j < COUNT; j++) {
          const b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK_DISTANCE) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(79,200,232,${(1 - d / LINK_DISTANCE) * 0.18})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    };
    if (!reduced && COUNT > 0) tick();

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running && COUNT > 0) {
        running = true;
        tick();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-0 opacity-55 ${className ?? ""}`}
    />
  );
}
