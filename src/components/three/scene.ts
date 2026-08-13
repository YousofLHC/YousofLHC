"use client";

import * as THREE from "three";

export const PALETTE = {
  orange: 0xff5a1f,
  orangeSoft: 0xff8a50,
  blue: 0x4d8dff,
  purple: 0x8b5cf6,
  cyan: 0x5fd0ff,
  white: 0xf4f1ea,
} as const;

export type SceneBuilder = (scene: THREE.Scene) => THREE.Group;

/* ---------- builders ---------- */

export function buildHelix(): SceneBuilder {
  return () => {
    const group = new THREE.Group();
    const turns = 3.2;
    const height = 7.2;
    const radius = 1.45;
    const steps = 200;

    const strandA: THREE.Vector3[] = [];
    const strandB: THREE.Vector3[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2 * turns;
      const y = (i / steps) * height - height / 2;
      strandA.push(
        new THREE.Vector3(Math.cos(t) * radius, y, Math.sin(t) * radius)
      );
      strandB.push(
        new THREE.Vector3(
          Math.cos(t + Math.PI) * radius,
          y,
          Math.sin(t + Math.PI) * radius
        )
      );
    }

    const curveA = new THREE.CatmullRomCurve3(strandA);
    const curveB = new THREE.CatmullRomCurve3(strandB);

    const tubeA = new THREE.Mesh(
      new THREE.TubeGeometry(curveA, 180, 0.055, 10, false),
      new THREE.MeshPhysicalMaterial({
        color: PALETTE.orangeSoft,
        emissive: PALETTE.orange,
        emissiveIntensity: 0.35,
        roughness: 0.35,
        metalness: 0.1,
      })
    );
    const tubeB = new THREE.Mesh(
      new THREE.TubeGeometry(curveB, 180, 0.055, 10, false),
      new THREE.MeshPhysicalMaterial({
        color: PALETTE.blue,
        emissive: PALETTE.blue,
        emissiveIntensity: 0.25,
        roughness: 0.35,
        metalness: 0.1,
      })
    );
    group.add(tubeA, tubeB);

    for (let i = 0; i < 60; i++) {
      const t = (i / 60) * Math.PI * 2 * turns;
      const y = (i / 60) * height - height / 2;
      const wobble = new THREE.Mesh(
        new THREE.SphereGeometry(0.17, 16, 16),
        new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? PALETTE.white : PALETTE.purple,
          transparent: true,
          opacity: 0.85,
        })
      );
      wobble.position.set(
        Math.cos(t) * radius,
        y,
        Math.sin(t) * radius
      );
      group.add(wobble);

      const step = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, radius * 1.9, 10),
        new THREE.MeshBasicMaterial({
          color: PALETTE.purple,
          transparent: true,
          opacity: 0.28,
          depthWrite: false,
        })
      );
      step.position.set(0, y, 0);
      step.rotation.z = (t / turns) * 0.5 + Math.PI / 6;
      group.add(step);
    }

    return group;
  };
}

export function buildCapsule(): SceneBuilder {
  return () => {
    const group = new THREE.Group();

    const capsule = new THREE.Mesh(
      new THREE.CapsuleGeometry(1.05, 2.1, 14, 28),
      new THREE.MeshPhysicalMaterial({
        color: PALETTE.blue,
        transparent: true,
        opacity: 0.16,
        roughness: 0.12,
        metalness: 0.2,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
    );
    group.add(capsule);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.62, 1),
      new THREE.MeshPhysicalMaterial({
        color: PALETTE.cyan,
        emissive: PALETTE.cyan,
        emissiveIntensity: 0.6,
        roughness: 0.25,
        metalness: 0.3,
        flatShading: true,
      })
    );
    group.add(core);

    for (let i = 0; i < 14; i++) {
      const orbit = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 12, 12),
        new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? PALETTE.orange : PALETTE.white,
          transparent: true,
          opacity: 0.9,
        })
      );
      const a = (i / 14) * Math.PI * 2;
      orbit.position.set(
        Math.cos(a) * 1.9,
        Math.sin(a * 2.3) * 0.7,
        Math.sin(a) * 1.9
      );
      orbit.userData.orbit = { angle: a, speed: 0.8 + (i % 4) * 0.18, axis: i % 2 };
      group.add(orbit);
    }

    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.15, 0.012, 8, 120),
        new THREE.MeshBasicMaterial({
          color: i === 0 ? PALETTE.blue : i === 1 ? PALETTE.purple : PALETTE.orange,
          transparent: true,
          opacity: 0.18,
        })
      );
      ring.rotation.x = (Math.PI / 2) * (i + 0.4);
      ring.rotation.y = i * 1.1;
      group.add(ring);
    }

    return group;
  };
}

export function buildAtomCloud(): SceneBuilder {
  return () => {
    const group = new THREE.Group();

    const count = 460;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [PALETTE.orange, PALETTE.blue, PALETTE.purple, PALETTE.cyan];
    for (let i = 0; i < count; i++) {
      const r = 2.4 + Math.random() * 3.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      const c = new THREE.Color(palette[i % palette.length]);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const points = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        size: 0.075,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    group.add(points);

    const nucleus = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.9, 1),
      new THREE.MeshPhysicalMaterial({
        color: PALETTE.orange,
        emissive: PALETTE.orange,
        emissiveIntensity: 0.7,
        roughness: 0.3,
        flatShading: true,
      })
    );
    group.add(nucleus);

    for (let i = 0; i < 3; i++) {
      const shell = new THREE.Mesh(
        new THREE.TorusGeometry(2 + i * 1.5, 0.014, 8, 130),
        new THREE.MeshBasicMaterial({
          color: i === 0 ? PALETTE.blue : i === 1 ? PALETTE.purple : PALETTE.orange,
          transparent: true,
          opacity: 0.22,
        })
      );
      shell.rotation.x = i * 1.05;
      shell.rotation.y = i * 0.7;
      group.add(shell);
    }

    return group;
  };
}

export function buildMolecule(): SceneBuilder {
  return () => {
    const group = new THREE.Group();

    const atoms: { pos: THREE.Vector3; r: number; color: number }[] = [
      { pos: new THREE.Vector3(0, 0, 0), r: 0.52, color: PALETTE.white },
      { pos: new THREE.Vector3(1.4, 0.5, 0), r: 0.34, color: PALETTE.blue },
      { pos: new THREE.Vector3(-1.3, 0.6, 0.3), r: 0.34, color: PALETTE.blue },
      { pos: new THREE.Vector3(0.4, 1.35, 0.4), r: 0.26, color: PALETTE.cyan },
      { pos: new THREE.Vector3(-0.2, -1.4, -0.2), r: 0.3, color: PALETTE.purple },
      { pos: new THREE.Vector3(0.3, 0.2, 1.35), r: 0.26, color: PALETTE.orangeSoft },
      { pos: new THREE.Vector3(-0.35, -0.35, -1.3), r: 0.26, color: PALETTE.orangeSoft },
    ];
    const bonds: [number, number][] = [
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
      [1, 3], [2, 4], [5, 6],
    ];

    for (const [a, b] of bonds) {
      const from = atoms[a].pos;
      const to = atoms[b].pos;
      const dir = to.clone().sub(from);
      const len = dir.length();
      const bond = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.055, len, 8),
        new THREE.MeshBasicMaterial({
          color: PALETTE.blue,
          transparent: true,
          opacity: 0.55,
        })
      );
      bond.position.copy(from).add(to).multiplyScalar(0.5);
      bond.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dir.clone().normalize()
      );
      group.add(bond);
    }

    for (const atom of atoms) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(atom.r, 20, 20),
        new THREE.MeshPhysicalMaterial({
          color: atom.color,
          emissive: atom.color,
          emissiveIntensity: 0.15,
          roughness: 0.4,
          metalness: 0.15,
        })
      );
      mesh.position.copy(atom.pos);
      group.add(mesh);
    }

    return group;
  };
}

export function buildProtein(): SceneBuilder {
  return () => {
    const group = new THREE.Group();

    const curvePoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 90; i++) {
      const t = i / 90;
      curvePoints.push(
        new THREE.Vector3(
          Math.sin(t * Math.PI * 2.4) * 1.5,
          (t - 0.5) * 4.6,
          Math.cos(t * Math.PI * 1.8 + 1.2) * 0.9
        )
      );
    }
    const ribbon = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(curvePoints), 140, 0.16, 10, false),
      new THREE.MeshPhysicalMaterial({
        color: PALETTE.purple,
        emissive: PALETTE.purple,
        emissiveIntensity: 0.3,
        roughness: 0.5,
        flatShading: true,
      })
    );
    group.add(ribbon);

    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const bead = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 10, 10),
        new THREE.MeshBasicMaterial({
          color: t % 0.25 < 0.125 ? PALETTE.cyan : PALETTE.white,
        })
      );
      bead.position.set(
        -Math.sin(t * Math.PI * 2.4) * 1.5,
        (t - 0.5) * 4.6,
        -Math.cos(t * Math.PI * 1.8 + 1.2) * 0.9
      );
      group.add(bead);
    }

    const strand2 = curvePoints.slice(5, -5).map((p) => {
      const v = p.clone();
      v.x = -v.x;
      v.z = -v.z;
      v.y += 0.6;
      return v;
    });
    const ribbon2 = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(strand2), 140, 0.13, 10, false),
      new THREE.MeshPhysicalMaterial({
        color: PALETTE.orange,
        emissive: PALETTE.orange,
        emissiveIntensity: 0.25,
        roughness: 0.5,
        flatShading: true,
      })
    );
    group.add(ribbon2);

    return group;
  };
}

export function buildNetwork(): SceneBuilder {
  return () => {
    const group = new THREE.Group();
    const count = 26;
    const nodes: THREE.Vector3[] = [];

    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const r = 1.1 + Math.random() * 1.9;
      nodes.push(
        new THREE.Vector3(Math.cos(a) * r, Math.sin(a * 2.7) * 1.3, Math.sin(a) * r * 0.9)
      );
    }

    const positions: number[] = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        if (Math.hypot(
          nodes[i].x - nodes[j].x,
          nodes[i].y - nodes[j].y,
          nodes[i].z - nodes[j].z
        ) < 2.35) {
          positions.push(
            nodes[i].x, nodes[i].y, nodes[i].z,
            nodes[j].x, nodes[j].y, nodes[j].z
          );
        }
      }
    }
    const eGeo = new THREE.BufferGeometry();
    eGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    const edges = new THREE.LineSegments(
      eGeo,
      new THREE.LineBasicMaterial({ color: PALETTE.blue, transparent: true, opacity: 0.3 })
    );
    group.add(edges);

    nodes.forEach((n, i) => {
      const color = [PALETTE.blue, PALETTE.purple, PALETTE.cyan][i % 3];
      const node = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 14, 14),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.9,
        })
      );
      node.position.copy(n);
      group.add(node);
    });

    return group;
  };
}

export function buildCrystal(): SceneBuilder {
  return () => {
    const group = new THREE.Group();

    const box = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(2.6, 2.6, 2.6)),
      new THREE.LineBasicMaterial({ color: PALETTE.cyan, transparent: true, opacity: 0.5 })
    );
    group.add(box);

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const isCorner = (Math.abs(x) + Math.abs(y) + Math.abs(z)) % 2 === 0;
          const atom = new THREE.Mesh(
            new THREE.SphereGeometry(isCorner ? 0.34 : 0.17, 16, 16),
            new THREE.MeshPhysicalMaterial({
              color: isCorner ? PALETTE.cyan : PALETTE.white,
              emissive: isCorner ? PALETTE.cyan : 0x000000,
              emissiveIntensity: isCorner ? 0.45 : 0,
              roughness: 0.3,
              metalness: 0.2,
            })
          );
          atom.position.set(x * 1.3, y * 1.3, z * 1.3);
          group.add(atom);
        }
      }
    }

    return group;
  };
}

/* ---------- factory ---------- */

export type SceneOpts = {
  cameraZ?: number;
  autorotate?: number;
  fog?: number | null;
  lights?: boolean;
  tilt?: boolean;
  speed?: number;
};

export function createScene(
  mount: HTMLElement,
  builders: SceneBuilder[],
  opts: SceneOpts = {}
) {
  const {
    cameraZ = 10,
    autorotate = 0.06,
    fog = null,
    lights = true,
    tilt = false,
    speed = 1,
  } = opts;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let visible = true;
  let running = false;

  const scene = new THREE.Scene();
  if (fog) scene.fog = new THREE.FogExp2(fog, 0.05);

  const camera = new THREE.PerspectiveCamera(
    50,
    mount.clientWidth / mount.clientHeight,
    0.1,
    100
  );
  camera.position.z = cameraZ;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  renderer.setClearColor(0x000000, 0);
  mount.appendChild(renderer.domElement);

  const group = new THREE.Group();
  scene.add(group);
  builders.forEach((b) => group.add(b(scene)));

  if (lights) {
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(3, 5, 4);
    scene.add(key);
    const orange = new THREE.PointLight(PALETTE.orange, 30, 18);
    orange.position.set(-4, -2, 3);
    scene.add(orange);
    const blue = new THREE.PointLight(PALETTE.blue, 26, 18);
    blue.position.set(4, 3, -2);
    scene.add(blue);
  }

  let rotY = 0;
  let curRX = 0;
  let curRY = 0;
  let targetRX = 0;
  let targetRY = 0;

  const onMove = (e: PointerEvent) => {
    if (!tilt || reduced) return;
    const rect = mount.getBoundingClientRect();
    targetRX = ((e.clientY - rect.top) / rect.height - 0.5) * -0.3;
    targetRY = ((e.clientX - rect.left) / rect.width - 0.5) * 0.4;
  };
  mount.addEventListener("pointermove", onMove);

  const onResize = () => {
    camera.aspect = mount.clientWidth / mount.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(mount.clientWidth, mount.clientHeight);
  };
  const ro = new ResizeObserver(onResize);
  ro.observe(mount);

  let raf = 0;
  const tick = () => {
    if (!running) return;
    raf = requestAnimationFrame(tick);

    rotY += autorotate * speed * (reduced ? 0.2 : 1);
    curRX += (targetRX - curRX) * 0.05;
    curRY += (targetRY - curRY) * 0.05;
    group.rotation.y = rotY + curRY;
    group.rotation.x = curRX;

    group.children.forEach((child) => {
      if (child.userData.orbit) {
        const o = child.userData.orbit;
        o.angle += o.speed * speed * 0.008 * (reduced ? 0.2 : 1);
        child.position.set(
          Math.cos(o.angle) * 1.9,
          Math.sin(o.angle * 2.3) * 0.7,
          Math.sin(o.angle) * 1.9
        );
      }
    });

    renderer.render(scene, camera);
  };

  const start = () => {
    if (!running) {
      running = true;
      tick();
    }
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  const onVisibility = () => {
    if (document.hidden || !visible) stop();
    else start();
  };
  document.addEventListener("visibilitychange", onVisibility);

  const io = new IntersectionObserver(
    (entries) => {
      visible = entries[0]?.isIntersecting ?? false;
      onVisibility();
    },
    { rootMargin: "240px" }
  );
  io.observe(mount);

  onVisibility();

  return {
    dispose() {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
      ro.disconnect();
      mount.removeEventListener("pointermove", onMove);
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
    },
  };
}