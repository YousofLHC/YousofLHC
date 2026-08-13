"use client";

import { useEffect, useRef } from "react";
import { createScene, buildHelix, buildCapsule, buildAtomCloud } from "@/components/three/scene";

export function HeroScene({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = createScene(
      mount,
      [buildHelix(), buildCapsule(), buildAtomCloud()],
      {
        cameraZ: 10.5,
        autorotate: 0.045,
        fog: 0x08090c,
        tilt: true,
      }
    );
    return () => scene.dispose();
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className={className ?? ""}
    />
  );
}
