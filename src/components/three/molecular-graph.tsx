"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { domains, domainColors } from "@/lib/data";

export function MolecularGraph({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let visible = true;
    const isMobile = window.innerWidth < 768;
    let running = false;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02040f, 0.028);

    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.z = 13.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const particleCount = isMobile ? 320 : 850;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 44;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 44;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 44;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x8fb4ff,
      size: 0.045,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    function makeGlowTexture(color: string) {
      const c = document.createElement("canvas");
      c.width = c.height = 128;
      const ctx = c.getContext("2d")!;
      const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(0.22, color);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(c);
    }

    const nodeData = domains.map((d, i) => {
      const theta = (i / domains.length) * Math.PI * 2 + 0.5;
      const phi = Math.acos(2 * (i / domains.length) - 1);
      const r = 4.6;
      return {
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.cos(phi),
        z: r * Math.sin(phi) * Math.sin(theta),
        color: domainColors[d.color],
        phase: i * 0.72,
      };
    });

    const sprites = nodeData.map((n) => {
      const mat = new THREE.SpriteMaterial({
        map: makeGlowTexture(n.color),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        opacity: 0.85,
      });
      const spr = new THREE.Sprite(mat);
      spr.position.set(n.x, n.y, n.z);
      spr.scale.setScalar(1.1);
      group.add(spr);
      return { spr, n };
    });

    const edgePositions: number[] = [];
    for (let i = 0; i < nodeData.length; i++) {
      for (let j = i + 1; j < nodeData.length; j++) {
        const a = nodeData[i];
        const b = nodeData[j];
        if (Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z) < 6.6) {
          edgePositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
        }
      }
    }
    const eGeo = new THREE.BufferGeometry();
    eGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(edgePositions, 3)
    );
    const eMat = new THREE.LineBasicMaterial({
      color: 0x5b6cff,
      transparent: true,
      opacity: 0.2,
    });
    const edges = new THREE.LineSegments(eGeo, eMat);
    group.add(edges);

    const ico = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(5.3, 1)),
      new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.06 })
    );
    group.add(ico);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(6.5, 0.018, 8, 140),
      new THREE.MeshBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.1 })
    );
    ring.rotation.x = Math.PI / 2.15;
    group.add(ring);

    // cursor trail pool
    const trail: { x: number; y: number; life: number }[] = [];
    const trailPool: THREE.Sprite[] = [];
    const trailColors: string[] = ["#3be1ff", "#a78bfa", "#f472b6"];
    for (let i = 0; i < 26; i++) {
      const m = new THREE.SpriteMaterial({
        map: makeGlowTexture(trailColors[i % trailColors.length]),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        visible: false,
      });
      const s = new THREE.Sprite(m);
      s.scale.setScalar(0.4);
      scene.add(s);
      trailPool.push(s);
    }

    let pointer = { x: 0, y: 0 };
    let hasPointer = false;

    const onMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer = {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
      };
      hasPointer = true;
      if (!reduced && trail.length < trailPool.length) {
        trail.push({ x: pointer.x * 8, y: pointer.y * 6, life: 1 });
      }
    };
    mount.addEventListener("pointermove", onMove);

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    const onVisibility = () => {
      const active = !document.hidden && visible;
      if (active && !running) {
        running = true;
        tick();
      } else if (!active) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
        onVisibility();
      },
      { rootMargin: "300px" }
    );
    io.observe(mount);

    let rotY = 0;
    let curRX = 0;
    let curRY = 0;
    let raf = 0;

    const tick = () => {
      if (!running) return;
      raf = requestAnimationFrame(tick);
      const t = performance.now() / 1000;

      rotY += reduced ? 0.0002 : 0.0006;
      const targetRX = hasPointer ? pointer.y * 0.16 : 0;
      const targetRY = rotY + (hasPointer ? pointer.x * 0.22 : 0);
      curRX += (targetRX - curRX) * 0.03;
      curRY += (targetRY - curRY) * 0.03;
      group.rotation.x = curRX;
      group.rotation.y = curRY;

      sprites.forEach(({ spr, n }) => {
        const pulse = Math.sin(t * 0.9 + n.phase);
        spr.scale.setScalar(1.05 + 0.4 * (0.5 + 0.5 * pulse));
        (spr.material as THREE.SpriteMaterial).opacity =
          0.55 + 0.35 * (0.5 + 0.5 * pulse);
      });

      eMat.opacity = 0.13 + 0.09 * Math.sin(t * 0.5);

      particles.rotation.y = t * 0.01;
      ico.rotation.y = t * 0.03;
      ico.rotation.x = Math.sin(t * 0.2) * 0.1;
      ring.rotation.z = t * 0.02;

      if (!reduced) {
        for (let i = trail.length - 1; i >= 0; i--) {
          const p = trail[i];
          const spr = trailPool[i];
          p.life -= 0.045;
          p.y += 0.006;
          if (p.life <= 0) {
            trail.splice(i, 1);
            spr.visible = false;
            continue;
          }
          spr.visible = true;
          spr.position.set(p.x, p.y, -4);
          spr.scale.setScalar(0.18 + p.life * 0.28);
          (spr.material as THREE.SpriteMaterial).opacity = p.life * 0.8;
        }
      }

      renderer.render(scene, camera);
    };
    onVisibility();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
      mount.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      scene.traverse((obj) => {
        const m = obj as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else if (mat) mat.dispose();
      });
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-0 ${className ?? ""}`}
    />
  );
}
