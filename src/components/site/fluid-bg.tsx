"use client";

import { useEffect, useRef } from "react";

/**
 * FluidBg — gentle "ink in water" cursor field.
 *
 * A low-res dye buffer drifts through a slow curl-noise flow; the pointer
 * releases soft wisps of dye that swirl lazily and fade like mist.
 * Calm by design: slow time, large soft brushes, low energy.
 * Dark theme blends with `screen` (glow); light theme uses `multiply`
 * with a deeper ink palette so the effect stays visible but airy.
 */

const CELL = 26;
const DECAY = 0.972;
const STEP_MS = 48; // ~21fps — unhurried — unhurried

const PALETTES: Record<"dark" | "light", Array<[number, number, number]>> = {
  dark: [
    [79, 200, 232], // cyan glow
    [156, 140, 224], // violet glow
    [255, 96, 44], // soft heyoz ember
  ],
  light: [
    [12, 96, 128], // deep teal ink
    [74, 62, 158], // indigo ink
    [168, 48, 6], // burnt orange ink
  ],
};

function currentTheme(): "dark" | "light" {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

export function FluidBg() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touchOnly =
      window.matchMedia("(pointer: coarse)").matches &&
      !window.matchMedia("(hover: hover)").matches;
    if (reduced || touchOnly) return;

    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let dye = new Float32Array(0);
    let next = new Float32Array(0);
    let img: ImageData | null = null;
    const off = document.createElement("canvas");
    const offCtx = off.getContext("2d");

    let raf = 0;
    let last = performance.now();
    let accMs = 0;
    let t = 0;
    let alive = true;

    let pmx = -9999;
    let pmy = -9999;
    let mx = -9999;
    let my = -9999;
    let colorIdx = 0;
    let sinceSwap = 0;

    let palette = PALETTES[currentTheme()];
    const themeObserver = new MutationObserver(() => {
      palette = PALETTES[currentTheme()];
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const resize = () => {
      w = cv.width = window.innerWidth;
      h = cv.height = window.innerHeight;
      cols = Math.ceil(w / CELL);
      rows = Math.ceil(h / CELL);
      dye = new Float32Array(cols * rows * 3);
      next = new Float32Array(cols * rows * 3);
      off.width = cols;
      off.height = rows;
      img = offCtx ? offCtx.createImageData(cols, rows) : null;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    /** slow swirling flow */
    const flowAngle = (x: number, y: number) =>
      (Math.sin(x * 0.09 + t * 0.16) +
        Math.cos(y * 0.11 - t * 0.12) +
        Math.sin((x + y) * 0.05 + t * 0.07)) *
      1.2;

    const inject = (cxCell: number, cyCell: number, radius: number, amt: number) => {
      const [r, g, b] = palette[colorIdx % palette.length];
      const x0 = Math.max(0, Math.floor(cxCell - radius));
      const x1 = Math.min(cols - 1, Math.ceil(cxCell + radius));
      const y0 = Math.max(0, Math.floor(cyCell - radius));
      const y1 = Math.min(rows - 1, Math.ceil(cyCell + radius));
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const d = Math.hypot(x - cxCell, y - cyCell);
          if (d > radius) continue;
          // soft gaussian-ish falloff for feathered edges
          const f = Math.pow(1 - d / radius, 1.6) * amt;
          const i = (y * cols + x) * 3;
          dye[i] = Math.min(1.2, dye[i] + f * (r / 255));
          dye[i + 1] = Math.min(1.2, dye[i + 1] + f * (g / 255));
          dye[i + 2] = Math.min(1.2, dye[i + 2] + f * (b / 255));
        }
      }
    };

    const step = () => {
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 3;
          const a = flowAngle(x, y);
          const sx = Math.round(x - Math.cos(a) * 0.8);
          const sy = Math.round(y - Math.sin(a) * 0.8);
          let j = i;
          if (sx >= 0 && sx < cols && sy >= 0 && sy < rows) {
            j = (sy * cols + sx) * 3;
          }
          next[i] = dye[j] * DECAY;
          next[i + 1] = dye[j + 1] * DECAY;
          next[i + 2] = dye[j + 2] * DECAY;
        }
      }
      const tmp = dye;
      dye = next;
      next = tmp;

      // pointer wisps ∝ speed (capped low)
      const speed = Math.hypot(mx - pmx, my - pmy);
      if (speed > 0.5 && mx >= 0) {
        const amt = Math.min(0.38, 0.05 + speed * 0.007);
        inject(mx / CELL, my / CELL, 3 + Math.min(1.8, speed * 0.018), amt);
        pmx = mx;
        pmy = my;
        sinceSwap++;
        if (sinceSwap > 170) {
          sinceSwap = 0;
          colorIdx++;
        }
      } else {
        pmx = mx;
        pmy = my;
      }

      // faint breathing emitter so the mist never dies
      const ex = w * (0.5 + 0.34 * Math.sin(t * 0.09));
      const ey = h * (0.42 + 0.28 * Math.cos(t * 0.067));
      inject(ex / CELL, ey / CELL, 3.2, 0.03);

      t += STEP_MS / 1000;
    };

    const render = () => {
      if (!img || !offCtx) return;
      const d = img.data;
      for (let i = 0, p = 0; p < dye.length; i += 4, p += 3) {
        d[i] = Math.min(255, dye[p] * 255);
        d[i + 1] = Math.min(255, dye[p + 1] * 255);
        d[i + 2] = Math.min(255, dye[p + 2] * 255);
        d[i + 3] = 255;
      }
      offCtx.putImageData(img, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(off, 0, 0, w, h);
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!alive || document.hidden) return;
      accMs += now - last;
      last = now;
      if (accMs < STEP_MS) return;
      accMs = 0;
      step();
      render();
    };
    /** stay fully idle until the visitor actually moves a pointer —
     *  zero main-thread cost on first paint and for touch-only users */
    let started = false;
    const arm = () => {
      if (started || !alive) return;
      started = true;
      last = performance.now();
      accMs = STEP_MS; // paint one frame immediately
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", arm, { once: true, passive: true });

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("pointermove", arm);
    };
  }, []);

  return <canvas ref={ref} className="fluid-bg" aria-hidden="true" />;
}
