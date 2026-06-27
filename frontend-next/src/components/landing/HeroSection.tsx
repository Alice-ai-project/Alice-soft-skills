"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@heroui/react";
import AliceLogoMark from "@/components/ui/AliceLogoMark";

// Client-only: WebGL Canvas must never SSR
const AiParticleWormholeBackground = dynamic(
  () => import("@/components/backgrounds/AiParticleWormholeBackground"),
  { ssr: false, loading: () => null },
);

// ── Static data ────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: "🎯",
    title: "Diagnóstico Personalizado",
    description:
      "Evalúa tu inteligencia emocional en seis dimensiones con cuestionarios basados en la ciencia.",
  },
  {
    icon: "📚",
    title: "Cursos Guiados",
    description:
      "Accede a cursos de soft skills — liderazgo, comunicación, resiliencia y más.",
  },
  {
    icon: "🤖",
    title: "Asistente IA",
    description:
      "Chatea con Alice, tu entrenador personal de IA, para orientación personalizada y pasos concretos.",
  },
];

// ── Component ──────────────────────────────────────────────────────────────────

export default function HeroSection() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen overflow-hidden flex flex-col"
        aria-label="Hero"
      >
        {/* z-0 — full-screen animated canvas (fixed, self-contained) */}
        <AiParticleWormholeBackground />

        {/* z-10 — dark vignette overlay so text stays readable */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 110% 80% at 50% 50%, rgba(3,1,8,0.05) 0%, rgba(3,1,8,0.55) 65%, rgba(3,1,8,0.85) 100%)",
          }}
        />

        {/* z-20 — all interactive page content */}
        <div className="relative z-20 flex flex-col min-h-screen">
          {/* ── Navbar ────────────────────────────────────────────────────── */}
          <header className="max-w-6xl mx-auto w-full px-5 sm:px-8 py-5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#6B5CFF,#9c85ff)" }}
              >
                <AliceLogoMark />
              </div>
              <span className="text-white font-semibold text-lg tracking-tight">Alice</span>
            </div>

            <nav className="flex items-center gap-2" aria-label="Main navigation">
              <Link href="/login">
                <Button
                  size="sm"
                  className="font-semibold text-white shadow-lg"
                  style={{
                    background: "linear-gradient(135deg,#6B5CFF 0%,#8b7bff 100%)",
                    boxShadow: "0 0 24px rgba(107,92,255,0.35)",
                  }}
                  aria-label="Iniciar sesión en tu cuenta"
                >
                  Iniciar Sesión
                </Button>
              </Link>
            </nav>
          </header>

          {/* ── Hero copy ───────────────────────────────────────────────── */}
          <main
            className="flex-1 flex flex-col items-center justify-center text-center px-5 sm:px-8 pb-24 pt-8"
            id="hero-content"
          >
            {/* Eyebrow badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase mb-8 select-none"
              style={{
                background: "rgba(107,92,255,0.14)",
                border: "1px solid rgba(107,92,255,0.38)",
                color: "#a99cff",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#5ACCA4", boxShadow: "0 0 6px #5ACCA4" }}
                aria-hidden="true"
              />
              Plataforma de soft skills impulsada por IA
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6"
              style={{ color: "#F9FAFC", maxWidth: 720 }}
            >
              Entrena tus soft skills con{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg,#6B5CFF 0%,#EAA2FC 50%,#5ACCA4 100%)",
                }}
              >
                guía inteligente
              </span>
            </h1>

            {/* Description */}
            <p
              className="text-base sm:text-lg leading-relaxed mb-10"
              style={{ color: "#ffffff", maxWidth: 540, fontWeight: 700 }}
            >
              Descubre tus fortalezas, recibe recomendaciones personalizadas
              y mejora tus habilidades de comunicación, liderazgo y toma de
              decisiones con una experiencia de aprendizaje asistida por IA.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link href="/login">
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-8 font-semibold text-white shadow-lg"
                  style={{
                    background: "linear-gradient(135deg,#6B5CFF 0%,#8b7bff 100%)",
                    boxShadow: "0 0 24px rgba(107,92,255,0.35)",
                  }}
                  aria-label="Sign in to your account"
                >
                  Comenzar ahora
                </Button>
              </Link>
            </div>
          </main>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section
        className="relative z-10 py-24 px-5 sm:px-8"
        style={{ background: "#0a0614" }}
        aria-labelledby="features-heading"
      >
        <div className="max-w-5xl mx-auto">
          <h2
            id="features-heading"
            className="text-center text-2xl sm:text-3xl font-bold mb-12"
            style={{ color: "#F9FAFC" }}
          >
            Todo lo que necesitas para crecer
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <article
                key={f.title}
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(107,92,255,0.15)",
                }}
              >
                <div
                  className="text-3xl mb-4 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(107,92,255,0.12)" }}
                  aria-hidden="true"
                >
                  {f.icon}
                </div>
                <h3
                  className="font-semibold text-base mb-2"
                  style={{ color: "#F9FAFC" }}
                >
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(249,250,252,0.5)" }}>
                  {f.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer
        className="relative z-10 py-6 text-center text-xs"
        style={{
          background: "#030108",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          color: "rgba(249,250,252,0.3)",
        }}
      >
        © {new Date().getFullYear()} Alice Soft Skills · Todos los derechos reservados
      </footer>
    </>
  );
}
