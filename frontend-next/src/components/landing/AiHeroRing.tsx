"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

// ── Brand palette ─────────────────────────────────────────────────────────────
const C_PRIMARY = "#6B5CFF";   // Slate Blue
const C_MINT    = "#5ACCA4";   // Mint
const C_MAUVE   = "#EAA2FC";   // Mauve

// ── Rotating rings ────────────────────────────────────────────────────────────

interface RingsProps { speed: number }

function Rings({ speed }: RingsProps) {
  const outerRef  = useRef<THREE.Mesh>(null);
  const middleRef = useRef<THREE.Mesh>(null);
  const innerRef  = useRef<THREE.Mesh>(null);

  useFrame((_, dt) => {
    if (outerRef.current) {
      outerRef.current.rotation.y += dt * speed * 0.35;
      outerRef.current.rotation.x += dt * speed * 0.12;
    }
    if (middleRef.current) {
      middleRef.current.rotation.y -= dt * speed * 0.28;
      middleRef.current.rotation.z += dt * speed * 0.18;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x -= dt * speed * 0.22;
      innerRef.current.rotation.z += dt * speed * 0.16;
    }
  });

  return (
    <group>
      {/* Outer ring — Slate Blue */}
      <mesh ref={outerRef} rotation={[Math.PI / 5, 0, 0]}>
        <torusGeometry args={[1.82, 0.042, 32, 200]} />
        <meshStandardMaterial
          color={C_PRIMARY}
          emissive={C_PRIMARY}
          emissiveIntensity={4}
          toneMapped={false}
        />
      </mesh>

      {/* Middle ring — Mint */}
      <mesh ref={middleRef} rotation={[Math.PI / 3, Math.PI / 5, 0]}>
        <torusGeometry args={[1.35, 0.032, 32, 200]} />
        <meshStandardMaterial
          color={C_MINT}
          emissive={C_MINT}
          emissiveIntensity={4}
          toneMapped={false}
        />
      </mesh>

      {/* Inner ring — Mauve */}
      <mesh ref={innerRef} rotation={[Math.PI / 2, Math.PI / 6, Math.PI / 8]}>
        <torusGeometry args={[0.82, 0.026, 32, 200]} />
        <meshStandardMaterial
          color={C_MAUVE}
          emissive={C_MAUVE}
          emissiveIntensity={4}
          toneMapped={false}
        />
      </mesh>

      {/* Core orb */}
      <mesh>
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshStandardMaterial
          color={C_MAUVE}
          emissive={C_MAUVE}
          emissiveIntensity={6}
          toneMapped={false}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

// ── Floating sparkle particles ─────────────────────────────────────────────────

interface SparklesProps { speed: number }

function Sparkles({ speed }: SparklesProps) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo<Float32Array>(() => {
    const count = 280;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r     = 2.3 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * speed * 0.055;
      ref.current.rotation.x += dt * speed * 0.025;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={C_PRIMARY}
        size={0.022}
        sizeAttenuation
        transparent
        opacity={0.65}
        depthWrite={false}
      />
    </points>
  );
}

// ── Full scene ─────────────────────────────────────────────────────────────────

function Scene({ speed }: { speed: number }) {
  return (
    <>
      <ambientLight intensity={0.08} />
      <pointLight position={[4, 4, 4]}   intensity={2.0} color={C_PRIMARY} />
      <pointLight position={[-4, -4, -2]} intensity={1.2} color={C_MINT} />
      <pointLight position={[0, 0, 6]}   intensity={0.6} color={C_MAUVE} />
      <Rings speed={speed} />
      <Sparkles speed={speed} />
      <EffectComposer>
        <Bloom
          intensity={1.6}
          luminanceThreshold={0.12}
          luminanceSmoothing={0.88}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

// ── Public component ───────────────────────────────────────────────────────────

interface AiHeroRingProps {
  className?: string;
}

export default function AiHeroRing({ className = "" }: AiHeroRingProps) {
  const prefersReduced = useReducedMotion();
  const speed = prefersReduced ? 0.15 : 1.0;

  return (
    <div className={className} aria-hidden="true" role="presentation">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 44 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene speed={speed} />
      </Canvas>
    </div>
  );
}
