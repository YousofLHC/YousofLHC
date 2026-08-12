"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Expand, Minus, Plus, RotateCcw, X } from "lucide-react";

export function Lightbox({
  src,
  alt,
  caption,
  className,
  aspect = "auto",
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  aspect?: string;
}) {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef({ px: 0, py: 0 });

  const openLightbox = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setOpen(true);
  };

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(6, z * 1.25));
      if (e.key === "-") setZoom((z) => Math.max(0.2, z / 1.25));
      if (e.key === "0") {
        setZoom(1);
        setPan({ x: 0, y: 0 });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.min(6, Math.max(0.2, z * (e.deltaY < 0 ? 1.15 : 0.87))));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragRef.current = { px: e.clientX, py: e.clientY };
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - dragRef.current.px;
    const dy = e.clientY - dragRef.current.py;
    dragRef.current = { px: e.clientX, py: e.clientY };
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
  };
  const onPointerUp = () => {
    setDragging(false);
  };

  return (
    <figure className={`my-6 ${className ?? ""}`}>
      <button
        type="button"
        onClick={openLightbox}
        className="group relative block w-full cursor-zoom-in overflow-hidden rounded-xl border border-line bg-panel/40"
        style={{ aspectRatio: aspect === "auto" ? undefined : aspect }}
        aria-label={`Open ${alt} in lightbox`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg glass opacity-0 transition-opacity group-hover:opacity-100">
          <Expand size={14} />
        </span>
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-void/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </button>
      {caption && (
        <figcaption className="mt-2 text-center font-mono text-xs text-faint">
          {caption}
        </figcaption>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-void/90 backdrop-blur-xl"
          onClick={close}
        >
          <div
            className="flex items-center justify-between gap-2 px-5 py-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 font-mono text-xs text-dim">
              <span>{alt}</span>
              <span className="text-faint">
                {Math.round(zoom * 100)}% · wheel to zoom · drag to pan
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-panel text-dim transition-colors hover:border-cyan/50 hover:text-cyan" onClick={() => setZoom((z) => Math.max(0.2, z / 1.25))}>
                <Minus size={13} />
              </button>
              <button className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-panel text-dim transition-colors hover:border-cyan/50 hover:text-cyan" onClick={() => setZoom((z) => Math.min(6, z * 1.25))}>
                <Plus size={13} />
              </button>
              <button
                className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-panel text-dim transition-colors hover:border-cyan/50 hover:text-cyan"
                onClick={() => {
                  setZoom(1);
                  setPan({ x: 0, y: 0 });
                }}
              >
                <RotateCcw size={13} />
              </button>
              <button
                className="ml-1 grid h-8 w-8 place-items-center rounded-lg bg-cyan/15 text-cyan hover:bg-cyan/25"
                onClick={close}
              >
                <X size={15} />
              </button>
            </div>
          </div>

          <div
            className="relative flex-1 cursor-grab overflow-hidden active:cursor-grabbing"
            onWheel={onWheel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="absolute left-1/2 top-1/2 max-h-full max-w-full select-none object-contain"
              style={{
                transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${zoom})`,
                transition: dragging ? "none" : "transform 0.18s ease-out",
              }}
            />
          </div>
          {caption && (
            <div className="px-6 py-3 text-center font-mono text-xs text-dim" onClick={(e) => e.stopPropagation()}>
              {caption}
            </div>
          )}
        </div>
      )}
    </figure>
  );
}
