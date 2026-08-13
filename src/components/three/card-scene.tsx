"use client";

import { useEffect, useRef } from "react";
import {
  createScene,
  buildMolecule,
  buildProtein,
  buildNetwork,
  buildCrystal,
  type SceneBuilder,
} from "@/components/three/scene";

const SCENES: Record<string, SceneBuilder> = {
  molecule: buildMolecule(),
  protein: buildProtein(),
  network: buildNetwork(),
  crystal: buildCrystal(),
};

export function CardScene({ type }: { type: "molecule" | "protein" | "network" | "crystal" }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = createScene(mount, [SCENES[type]], {
      cameraZ: 4.6,
      autorotate: 0.055,
      fog: null,
      lights: true,
      tilt: false,
    });
    return () => scene.dispose();
  }, [type]);

  return <div ref={mountRef} aria-hidden className="absolute inset-0 h-full w-full" />;
}
