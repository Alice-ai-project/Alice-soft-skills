"use client";

/* eslint-disable react-hooks/purity, react-hooks/immutability */

/**
 * AiParticleWormholeBackground
 *
 * Full-screen animated particle field inspired by an Einstein–Rosen bridge /
 * particle wormhole. Three nested lemniscate (figure-8 / ∞) paths, each with
 * three depth layers (core · halo · outer glow), plus a white spark stream,
 * yellow micro-sparks, and an ambient star field.
 *
 * The canvas is fixed to the viewport (z-0, pointer-events-none) and sits
 * below a dark CSS vignette and all page content.
 *
 * ─── QUICK TUNING REFERENCE ───────────────────────────────────────────────
 *   Particle count  → DESKTOP_TOTAL / MOBILE_TOTAL
 *   Flow speed      → FLOW_SPEED          (0 = frozen · 2 = fast)
 *   Glow brightness → BLOOM_INTENSITY     (0 = none  · 2 = very strong)
 *   Bloom coverage  → BLOOM_THRESHOLD     (lower → more elements glow)
 *   Colors          → COLORS object
 *   Shape scale     → width / height / depth in buildLemniscate() calls inside Scene
 * ──────────────────────────────────────────────────────────────────────────
 */

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

// ─── Tunable constants ────────────────────────────────────────────────────────

const COLORS = {
  blue:   "#7c3aed",  // Vibrant purple — main energy stream
  mint:   "#5ACCA4",  // Mint           — secondary stream
  mauve:  "#c084fc",  // Light purple   — inner filaments
  white:  "#FFFFFF",  // White          — bright tip sparks
  yellow: "#E6CA52",  // Arylide Yellow — micro warm sparks (very subtle)
};

const DESKTOP_TOTAL  = 4000;  // total particles on desktop
const MOBILE_TOTAL   = 1000;  // total particles on mobile (< 768 px wide)
const FLOW_SPEED     = 0.6;   // global flow speed multiplier
const BLOOM_INTENSITY  = 1.1; // glow strength
const BLOOM_THRESHOLD  = 0.18;// luminance threshold for bloom
const BLOOM_SMOOTHING  = 0.82;// bloom edge smoothness

// ─── Lemniscate path builder ──────────────────────────────────────────────────
// Returns an array of pre-sampled Vector3 points forming a figure-8 / ∞ shape
// with organic noise applied so it reads as flowing energy, not a math symbol.
//
// width   — half the X span  (camera sees ±~5 units at z=0 with FOV 65, z=6)
// height  — Y amplitude
// depth   — Z depth oscillation
// noise   — distortion magnitude (0 = perfect lemniscate, 0.4 = very organic)
// seed    — noise seed for variety between paths

function buildLemniscate(
  width:   number,
  height:  number,
  depth:   number,
  noise:   number,
  seed:    number,
  samples: number = 2000,
): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < samples; i++) {
    const t = (i / samples) * Math.PI * 2;

    // Lissajous figure-8: x = W·sin(t),  y = H·sin(2t)
    const bx = width  * Math.sin(t);
    const by = height * Math.sin(2 * t);
    const bz = depth  * Math.cos(t * 1.5 + seed) * 0.45;

    // Multi-frequency noise — breaks the clean geometric outline
    const nx =
      noise * (Math.sin(t * 3.1 + seed * 1.7) * 0.65 + Math.sin(t * 7.3 + seed * 0.9) * 0.28);
    const ny =
      noise * (Math.sin(t * 4.7 + seed * 2.3) * 0.50 + Math.sin(t * 2.9 + seed * 1.1) * 0.38);
    const nz = noise * Math.sin(t * 5.5 + seed * 3.1) * 0.85;

    pts.push(new THREE.Vector3(bx + nx, by + ny, bz + nz));
  }
  return pts;
}

// ─── Per-particle data (mutable, lives outside React state) ──────────────────

interface PMeta {
  idx:   number;  // float path position [0, path.length)
  spd:   number;  // individual speed multiplier
  sx:    number;  // static X spread offset
  sy:    number;  // static Y spread offset
  sz:    number;  // static Z spread offset (depth)
  freq:  number;  // oscillation frequency
  phase: number;  // oscillation phase
}

// ─── Particle cloud component ─────────────────────────────────────────────────
// Each instance renders one layer of the wormhole (core, halo, or outer glow).

interface PCProps {
  path:        THREE.Vector3[];
  color:       string;
  count:       number;
  spread:      number;     // transverse spread from path centre (scene units)
  size:        number;     // point render size
  opacity:     number;     // material opacity (additive — so lower = dimmer)
  speedMult?:  number;
  globalSpeed: number;
}

function ParticleCloud({
  path, color, count, spread, size, opacity,
  speedMult = 1, globalSpeed,
}: PCProps) {
  const N = path.length;

  // One-time per-particle metadata — mutable objects, never trigger re-render
  const meta = useMemo<PMeta[]>(() => {
    return Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const r     = spread * Math.sqrt(Math.random()); // uniform-disk distribution
      return {
        idx:   Math.random() * N,
        spd:   0.55 + Math.random() * 0.90,
        sx:    Math.cos(angle) * r,
        sy:    Math.sin(angle) * r * 0.52,  // flatten vertically
        sz:    (Math.random() - 0.5) * spread * 1.85,
        freq:  0.14 + Math.random() * 0.58,
        phase: Math.random() * Math.PI * 2,
      };
    });
  }, [count, spread, N]);

  // Geometry created once; position buffer mutated in place every frame
  const geo = useMemo(() => {
    const g   = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const m  = meta[i];
      const pt = path[Math.floor(m.idx) % N];
      pos[i * 3]     = pt.x + m.sx;
      pos[i * 3 + 1] = pt.y + m.sy;
      pos[i * 3 + 2] = pt.z + m.sz;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [meta, path, count, N]);

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color:           new THREE.Color(color),
        size,
        sizeAttenuation: true,
        transparent:     true,
        opacity,
        depthWrite:      false,
        blending:        THREE.AdditiveBlending,
      }),
    [color, size, opacity],
  );

  const tRef = useRef(0);

  useFrame((_, dt) => {
    tRef.current += dt;
    const t   = tRef.current;
    const spd = globalSpeed * FLOW_SPEED * speedMult;

    const attr = geo.getAttribute("position") as THREE.BufferAttribute;
    const arr  = attr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const m = meta[i];

      // Advance particle along path (wrap around)
      m.idx = (m.idx + dt * m.spd * spd * 28) % N;
      const idx = (Math.floor(m.idx) + N) % N;
      const pt  = path[idx];

      // Gentle organic wave around the static spread offset
      const wv  = Math.sin(t * m.freq + m.phase);
      const wh  = Math.cos(t * m.freq * 0.68 + m.phase);
      const osc = Math.min(spread * 0.30, 0.28);

      arr[i * 3]     = pt.x + m.sx + wv * osc;
      arr[i * 3 + 1] = pt.y + m.sy + wh * Math.min(spread * 0.22, 0.20);
      arr[i * 3 + 2] = pt.z + m.sz + wv * 0.14;
    }

    attr.needsUpdate = true;
  });

  return <points geometry={geo} material={mat} />;
}

// ─── Ambient star field ───────────────────────────────────────────────────────
// Hundreds of faint, slow-rotating dots scattered across the whole background.

function StarField({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);

  const geo = useMemo(() => {
    const g   = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 28;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = -4 - Math.random() * 9;  // pushed to the background
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color:           new THREE.Color(COLORS.blue),
        size:            0.016,
        sizeAttenuation: true,
        transparent:     true,
        opacity:         0.26,
        depthWrite:      false,
      }),
    [],
  );

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.0022;
  });

  return <points ref={ref} geometry={geo} material={mat} />;
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function Scene({ speed, total }: { speed: number; total: number }) {
  const gRef = useRef<THREE.Group>(null);

  // Path A — wide (bleeds off screen edges), main stream
  // path width 5.5 → spans ±5.5 units; at z=6 fov=65 camera sees ±~5.1 → intentionally wider
  const pathA = useMemo(() => buildLemniscate(5.5, 1.95, 1.5, 0.28, 0.30), []);
  // Path B — medium, different tilt via noise seed
  const pathB = useMemo(() => buildLemniscate(4.0, 1.55, 1.05, 0.32, 1.73), []);
  // Path C — inner convergence, dense near the centre crossing
  const pathC = useMemo(() => buildLemniscate(2.7, 1.05, 0.70, 0.22, 3.51), []);

  // Particle budget: 58 / 25 / 17 across the three paths
  const nA = Math.round(total * 0.58);
  const nB = Math.round(total * 0.25);
  const nC = total - nA - nB;
  const gs  = speed;

  // Very slow cinematic rotation of the whole field
  useFrame((_, dt) => {
    if (gRef.current) {
      gRef.current.rotation.y += dt * 0.0055 * speed;
      gRef.current.rotation.x += dt * 0.0018 * speed;
    }
  });

  return (
    <group ref={gRef}>
      {/* ── Ambient star field ── */}
      <StarField count={Math.round(total * 0.14)} />

      {/* ━━ BLUE path — 3 depth layers ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* Core: tight, bright, fast — the luminous spine */}
      <ParticleCloud path={pathA} color={COLORS.blue}
        count={Math.round(nA * 0.27)} spread={0.09}  size={0.052} opacity={0.96}
        speedMult={1.12} globalSpeed={gs} />
      {/* Halo: medium spread — glowing volume around the core */}
      <ParticleCloud path={pathA} color={COLORS.blue}
        count={Math.round(nA * 0.45)} spread={0.55}  size={0.028} opacity={0.46}
        speedMult={0.88} globalSpeed={gs} />
      {/* Outer glow: wide spread, very dim — the soft luminous nebula */}
      <ParticleCloud path={pathA} color={COLORS.blue}
        count={Math.round(nA * 0.28)} spread={1.40}  size={0.014} opacity={0.15}
        speedMult={0.68} globalSpeed={gs} />

      {/* White sparks — bright, fast, tight on the main path */}
      <ParticleCloud path={pathA} color={COLORS.white}
        count={Math.round(total * 0.048)} spread={0.045} size={0.036} opacity={0.90}
        speedMult={1.75} globalSpeed={gs} />

      {/* ━━ MINT path — 2 layers ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <ParticleCloud path={pathB} color={COLORS.mint}
        count={Math.round(nB * 0.40)} spread={0.10}  size={0.044} opacity={0.88}
        speedMult={0.93} globalSpeed={gs} />
      <ParticleCloud path={pathB} color={COLORS.mint}
        count={Math.round(nB * 0.60)} spread={0.68}  size={0.022} opacity={0.36}
        speedMult={0.72} globalSpeed={gs} />

      {/* ━━ MAUVE inner path — 2 layers ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <ParticleCloud path={pathC} color={COLORS.mauve}
        count={Math.round(nC * 0.50)} spread={0.08}  size={0.038} opacity={0.82}
        speedMult={0.84} globalSpeed={gs} />
      <ParticleCloud path={pathC} color={COLORS.mauve}
        count={Math.round(nC * 0.50)} spread={0.46}  size={0.018} opacity={0.30}
        speedMult={0.62} globalSpeed={gs} />

      {/* Yellow micro-sparks — rare warm accents on the main stream */}
      <ParticleCloud path={pathA} color={COLORS.yellow}
        count={Math.round(total * 0.018)} spread={0.03} size={0.026} opacity={0.48}
        speedMult={2.30} globalSpeed={gs} />

      {/* ── Bloom post-processing ── */}
      <EffectComposer>
        <Bloom
          intensity={BLOOM_INTENSITY}
          luminanceThreshold={BLOOM_THRESHOLD}
          luminanceSmoothing={BLOOM_SMOOTHING}
          mipmapBlur
        />
      </EffectComposer>
    </group>
  );
}

// ─── Exported component ───────────────────────────────────────────────────────

export default function AiParticleWormholeBackground() {
  const prefersReduced = useReducedMotion();
  const speed = prefersReduced ? 0.07 : 1.0;

  // Particle count scales with screen width
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const total    = isMobile ? MOBILE_TOTAL : DESKTOP_TOTAL;

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
      role="presentation"
      style={{
        // CSS gradient base — visible through the transparent canvas
        background: [
          "radial-gradient(ellipse 75% 55% at 50% 47%, rgba(124,58,237,0.22), transparent 65%)",
          "radial-gradient(ellipse 48% 42% at 26% 56%, rgba(90,204,164,0.11), transparent 60%)",
          "radial-gradient(ellipse 48% 42% at 74% 56%, rgba(192,132,252,0.11), transparent 60%)",
          "#060311",
        ].join(", "),
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 65 }}
        dpr={[1, 1.5]}
        gl={{
          antialias:       true,
          alpha:           true,  // transparent — CSS gradient shows through
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Scene speed={speed} total={total} />
      </Canvas>
    </div>
  );
}
