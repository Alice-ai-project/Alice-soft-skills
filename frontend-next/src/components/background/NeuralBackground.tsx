"use client";

import { Component, useRef, useMemo, useEffect, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ─── Performance config ────────────────────────────────────────────────────

function resolveConfig() {
  if (typeof window === "undefined") return { nodes: 200, threshold: 2.6, dpr: 1 };
  const w = window.innerWidth;
  const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
  if (w < 640)  return { nodes: 80,  threshold: 2.2, dpr: Math.min(dpr, 1.5) };
  if (w < 1024) return { nodes: 140, threshold: 2.5, dpr };
  return           { nodes: 220, threshold: 2.6, dpr };
}

// ─── RIWI palette ──────────────────────────────────────────────────────────

const PALETTE = [
  { c: new THREE.Color("#7c3aed"), weight: 0.60 }, // primary  — 60 %
  { c: new THREE.Color("#c084fc"), weight: 0.88 }, // secondary — 28 %
  { c: new THREE.Color("#5ACCA4"), weight: 0.98 }, // accent   — 10 %
  { c: new THREE.Color("#E6CA52"), weight: 1.00 }, // rare     —  2 %
];

function pickColor(): THREE.Color {
  const r = Math.random();
  for (const slot of PALETTE) if (r < slot.weight) return slot.c.clone();
  return PALETTE[0].c.clone();
}

// ─── Box-Muller Gaussian sampler ──────────────────────────────────────────

function gauss(sigma: number): number {
  let u = 0, v = 0;
  while (!u) u = Math.random();
  while (!v) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) * sigma;
}

// ─── Glow dot texture (circular radial gradient) ──────────────────────────

function buildDotTexture(): THREE.CanvasTexture {
  const S = 64;
  const cvs = document.createElement("canvas");
  cvs.width = cvs.height = S;
  const ctx = cvs.getContext("2d")!;
  const grad = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  grad.addColorStop(0.00, "rgba(255,255,255,1.00)");
  grad.addColorStop(0.30, "rgba(255,255,255,0.75)");
  grad.addColorStop(0.65, "rgba(255,255,255,0.18)");
  grad.addColorStop(1.00, "rgba(255,255,255,0.00)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2);
  ctx.fill();
  return new THREE.CanvasTexture(cvs);
}

// ─── Scene geometry builder ────────────────────────────────────────────────

interface SceneGeo {
  dotTex:  THREE.CanvasTexture;
  nodeGeo: THREE.BufferGeometry;
  glowGeo: THREE.BufferGeometry;
  connGeo: THREE.BufferGeometry;
}

function buildSceneGeo(nodeCount: number, threshold: number): SceneGeo {
  const dotTex = buildDotTexture();

  /* ── 1. Node positions ──────────────────────────────────────────────── */
  const pts: THREE.Vector3[] = [];

  for (let i = 0; i < nodeCount; i++) {
    if (Math.random() < 0.55) {
      // Dense core cluster
      pts.push(new THREE.Vector3(gauss(1.7), gauss(1.7), gauss(0.85)));
    } else {
      // Outer network: polar + jitter
      const angle  = Math.random() * Math.PI * 2;
      const radius = 2.8 + Math.random() * 3.5;
      pts.push(new THREE.Vector3(
        Math.cos(angle) * radius + gauss(0.65),
        Math.sin(angle) * radius + gauss(0.65),
        gauss(1.1),
      ));
    }
  }

  /* ── 2. Node geometry ───────────────────────────────────────────────── */
  const posArr = new Float32Array(nodeCount * 3);
  const colArr = new Float32Array(nodeCount * 3);

  for (let i = 0; i < nodeCount; i++) {
    posArr[i * 3]     = pts[i].x;
    posArr[i * 3 + 1] = pts[i].y;
    posArr[i * 3 + 2] = pts[i].z;
    pickColor().toArray(colArr, i * 3);
  }

  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute("position", new THREE.BufferAttribute(posArr, 3));
  nodeGeo.setAttribute("color",    new THREE.BufferAttribute(colArr, 3));

  // Glow shares positions/colors (separate buffer to allow independent material)
  const glowGeo = new THREE.BufferGeometry();
  glowGeo.setAttribute("position", new THREE.BufferAttribute(posArr.slice(), 3));
  glowGeo.setAttribute("color",    new THREE.BufferAttribute(colArr.slice(), 3));

  /* ── 3. Connection geometry ─────────────────────────────────────────── */
  const cPos: number[] = [];
  const cCol: number[] = [];
  const MAX_CONN = 5;

  for (let i = 0; i < nodeCount; i++) {
    // Collect candidate neighbours (j > i avoids duplicates)
    const nearby: [number, number][] = [];
    for (let j = i + 1; j < nodeCount; j++) {
      const d = pts[i].distanceTo(pts[j]);
      if (d < threshold) nearby.push([j, d]);
    }
    // Sort by distance and take closest MAX_CONN
    nearby.sort((a, b) => a[1] - b[1]);

    for (const [j, d] of nearby.slice(0, MAX_CONN)) {
      // Alpha falls off with distance
      const alpha = (1 - d / threshold) * 0.5;

      // Blend the two endpoint colors, then dim by alpha
      const ci = new THREE.Color().fromArray(colArr, i * 3);
      const cj = new THREE.Color().fromArray(colArr, j * 3);
      const blended = ci.lerp(cj, 0.5).multiplyScalar(alpha);

      cPos.push(
        pts[i].x, pts[i].y, pts[i].z,
        pts[j].x, pts[j].y, pts[j].z,
      );
      cCol.push(
        blended.r, blended.g, blended.b,
        blended.r, blended.g, blended.b,
      );
    }
  }

  const connGeo = new THREE.BufferGeometry();
  connGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(cPos), 3));
  connGeo.setAttribute("color",    new THREE.BufferAttribute(new Float32Array(cCol), 3));

  return { dotTex, nodeGeo, glowGeo, connGeo };
}

// ─── Animated neural system ────────────────────────────────────────────────

interface NeuralSystemProps {
  nodeCount: number;
  threshold: number;
}

function NeuralSystem({ nodeCount, threshold }: NeuralSystemProps) {
  const groupRef   = useRef<THREE.Group>(null);
  const connMtlRef = useRef<THREE.LineBasicMaterial>(null);

  const geo = useMemo(
    () => buildSceneGeo(nodeCount, threshold),
    [nodeCount, threshold],
  );

  // Dispose geometries + texture on unmount / change
  useEffect(() => {
    return () => {
      geo.nodeGeo.dispose();
      geo.glowGeo.dispose();
      geo.connGeo.dispose();
      geo.dotTex.dispose();
    };
  }, [geo]);

  // Per-frame animation
  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      // Primary: slow Y rotation (full revolution ≈ 157 s)
      groupRef.current.rotation.y = t * 0.04;
      // Secondary: subtle X tilt (organic breathing)
      groupRef.current.rotation.x = Math.sin(t * 0.06) * 0.07;
    }

    // Connection opacity breathes gently (0.35 – 0.58, boosted to stay visible through scrim)
    if (connMtlRef.current) {
      connMtlRef.current.opacity = 0.46 + 0.12 * Math.sin(t * 0.22);
    }
  });

  return (
    <group ref={groupRef}>

      {/* ── Connection lines ──────────────────────────────────────────── */}
      <lineSegments geometry={geo.connGeo}>
        <lineBasicMaterial
          ref={connMtlRef}
          vertexColors
          transparent
          opacity={0.46}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* ── Soft glow halos — boosted to remain visible through scrim ─── */}
      <points geometry={geo.glowGeo}>
        <pointsMaterial
          map={geo.dotTex}
          size={0.72}
          vertexColors
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
          alphaTest={0.001}
        />
      </points>

      {/* ── Bright node cores ─────────────────────────────────────────── */}
      <points geometry={geo.nodeGeo}>
        <pointsMaterial
          map={geo.dotTex}
          size={0.16}
          vertexColors
          transparent
          opacity={0.96}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
          alphaTest={0.001}
        />
      </points>

    </group>
  );
}

// ─── WebGL error boundary ──────────────────────────────────────────────────

class WebGLBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  componentDidCatch() {
    this.setState({ failed: true });
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

// ─── Public component ──────────────────────────────────────────────────────

export default function NeuralBackground() {
  const { nodes, threshold, dpr } = useMemo(() => resolveConfig(), []);

  return (
    <WebGLBoundary fallback={null}>
      <div
        aria-hidden="true"
        style={{
          position:      "fixed",
          inset:         0,
          zIndex:        0,
          pointerEvents: "none",
        }}
      >
        <Canvas
          gl={{
            antialias:       false,
            alpha:           true,
            powerPreference: "default",
          }}
          dpr={[1, dpr]}
          camera={{ fov: 55, near: 0.1, far: 100, position: [0, 0, 9] }}
          style={{ width: "100%", height: "100%" }}
          frameloop="always"
          onCreated={({ gl }) => {
            // Allow the browser to restore the WebGL context if it gets lost
            // (happens during dev Fast Refresh or under GPU memory pressure)
            gl.domElement.addEventListener(
              "webglcontextlost",
              (e: Event) => { e.preventDefault(); },
              false,
            );
          }}
        >
          <NeuralSystem nodeCount={nodes} threshold={threshold} />
        </Canvas>
      </div>
    </WebGLBoundary>
  );
}
