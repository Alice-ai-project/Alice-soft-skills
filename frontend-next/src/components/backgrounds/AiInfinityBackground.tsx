"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

// ─── TUNABLE CONSTANTS ────────────────────────────────────────────────────────
// Change these to restyle the background without touching the scene code.

const COLORS = {
  primary:    "#6B5CFF",   // Slate Blue  — main large path
  secondary:  "#5ACCA4",   // Mint        — medium path
  tertiary:   "#EAA2FC",   // Mauve       — small inner path
  highlight:  "#FFFFFF",   // White       — bright tip sparks on the main path
  background: "#030108",   // Near-black  — canvas fill color
} as const;

const PARTICLE_COUNT  = 120;   // particles on the main path; others scale from this
const FLOW_SPEED      = 1.0;   // global speed multiplier (higher = faster streams)
const BLOOM_INTENSITY = 1.8;   // glow strength  — 0 none | 1 soft | 3 intense
const TUBE_OPACITY    = 0.22;  // opacity of the static glowing path line  (0–1)

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Build a Lissajous figure-8 (∞ shape) sampled into a CatmullRomCurve3.
 * Parametric: x=W·sin(t), y=H·sin(2t), z=D·sin(t)·cos(2t)
 * t ∈ [0, 2π] traces out one full infinity loop.
 */
function buildInfinityPath(
  width: number,
  height: number,
  depth: number,
  samples = 240,
): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < samples; i++) {
    const t = (i / samples) * Math.PI * 2;
    pts.push(
      new THREE.Vector3(
        width  * Math.sin(t),
        height * Math.sin(2 * t),
        depth  * Math.sin(t) * Math.cos(2 * t),
      ),
    );
  }
  return new THREE.CatmullRomCurve3(pts, true, "catmullrom", 0.5);
}

// ─── Glowing path tube (static geometry) ─────────────────────────────────────

interface GlowTubeProps {
  curve: THREE.CatmullRomCurve3;
  color: string;
  opacity?: number;
  radius?: number;
}

function GlowTube({ curve, color, opacity = TUBE_OPACITY, radius = 0.01 }: GlowTubeProps) {
  const geometry = useMemo(
    () => new THREE.TubeGeometry(curve, 400, radius, 6, true),
    [curve, radius],
  );

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ─── Animated particle stream (particles flow along a curve) ──────────────────

interface ParticleStreamProps {
  curve: THREE.CatmullRomCurve3;
  color: string;
  count: number;
  speed: number;
  size?: number;
  startOffset?: number; // 0–1, staggers the start position on the curve
}

function ParticleStream({
  curve,
  color,
  count,
  speed,
  size = 0.06,
  startOffset = 0,
}: ParticleStreamProps) {
  // Pre-sample the curve at high resolution for O(1) position lookup per frame
  const SAMPLES = 2000;
  const curvePoints = useMemo(() => curve.getSpacedPoints(SAMPLES), [curve]);

  // Build the geometry once; we'll mutate the array in-place every frame
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const idx = Math.floor((i / count) * SAMPLES);
      const pt  = curvePoints[idx];
      pos[i * 3]     = pt.x;
      pos[i * 3 + 1] = pt.y;
      pos[i * 3 + 2] = pt.z;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, [count, curvePoints]);

  const timeRef = useRef(startOffset);

  useFrame((_, dt) => {
    timeRef.current += dt * speed * 0.05; // 0.05 → one full loop in ~20 s at speed 1

    const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr  = attr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const t   = ((i / count) + timeRef.current) % 1;
      const idx = Math.floor(t * SAMPLES) % SAMPLES;
      const pt  = curvePoints[idx];
      arr[i * 3]     = pt.x;
      arr[i * 3 + 1] = pt.y;
      arr[i * 3 + 2] = pt.z;
    }
    attr.needsUpdate = true;
  });

  return (
    <points geometry={geometry}>
      <pointsMaterial
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={0.88}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Ambient floating dust (slow-rotating field of background specks) ─────────

interface AmbientDustProps { count: number }

function AmbientDust({ count }: AmbientDustProps) {
  const ref = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 11;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 9;
    }
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geo;
  }, [count]);

  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.007;
    ref.current.rotation.x += dt * 0.003;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        color={COLORS.primary}
        size={0.018}
        sizeAttenuation
        transparent
        opacity={0.3}
        depthWrite={false}
      />
    </points>
  );
}

// ─── Full scene composition ───────────────────────────────────────────────────

function Scene({ speed, particleCount }: { speed: number; particleCount: number }) {
  // Three nested infinity paths at different scales and tilts
  const pathA = useMemo(() => buildInfinityPath(3.8, 1.7, 0.7), []); // large  — slate blue
  const pathB = useMemo(() => buildInfinityPath(2.6, 1.1, 0.9), []); // medium — mint
  const pathC = useMemo(() => buildInfinityPath(1.6, 0.75, 0.5), []); // small — mauve

  const n  = particleCount;
  const n2 = Math.round(n * 0.65);
  const n3 = Math.round(n * 0.45);
  const nW = Math.round(n * 0.12); // white highlight sparks

  return (
    <>
      <fog attach="fog" args={[COLORS.background, 14, 32]} />

      {/* ── Large path: Slate Blue ── */}
      <group rotation={[0.06, 0, 0.03]}>
        <GlowTube curve={pathA} color={COLORS.primary} />
        <ParticleStream
          curve={pathA} color={COLORS.primary}
          count={n} speed={speed} size={0.07} startOffset={0}
        />
        {/* Bright white sparks riding slightly faster than the main stream */}
        <ParticleStream
          curve={pathA} color={COLORS.highlight}
          count={nW} speed={speed * 1.45} size={0.035} startOffset={0.35}
        />
      </group>

      {/* ── Medium path: Mint, tilted ~20° ── */}
      <group rotation={[0.28, 0.12, 0.38]}>
        <GlowTube curve={pathB} color={COLORS.secondary} opacity={TUBE_OPACITY * 0.85} radius={0.008} />
        <ParticleStream
          curve={pathB} color={COLORS.secondary}
          count={n2} speed={speed * 0.82} size={0.055} startOffset={0.5}
        />
      </group>

      {/* ── Small inner path: Mauve, counter-tilted ── */}
      <group rotation={[-0.22, -0.14, -0.34]}>
        <GlowTube curve={pathC} color={COLORS.tertiary} opacity={TUBE_OPACITY * 0.75} radius={0.007} />
        <ParticleStream
          curve={pathC} color={COLORS.tertiary}
          count={n3} speed={speed * 0.62} size={0.045} startOffset={0.15}
        />
      </group>

      {/* ── Ambient dust cloud ── */}
      <AmbientDust count={Math.round(n * 0.55)} />

      {/* ── Bloom glow ── */}
      <EffectComposer>
        <Bloom
          intensity={BLOOM_INTENSITY}
          luminanceThreshold={0.08}
          luminanceSmoothing={0.92}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

// ─── Exported component ───────────────────────────────────────────────────────

interface AiInfinityBackgroundProps {
  className?: string;
}

export default function AiInfinityBackground({ className = "" }: AiInfinityBackgroundProps) {
  const prefersReduced = useReducedMotion();
  const speed = (prefersReduced ? 0.12 : 1.0) * FLOW_SPEED;

  // Detect mobile at mount time; component is always client-side (ssr:false)
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;
  const particleCount = isMobile ? 70 : PARTICLE_COUNT;

  return (
    <div
      className={`w-full h-full ${className}`}
      aria-hidden="true"
      role="presentation"
    >
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        style={{ background: COLORS.background }}
      >
        <Scene speed={speed} particleCount={particleCount} />
      </Canvas>
    </div>
  );
}
