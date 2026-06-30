"use client";

/* eslint-disable react-hooks/purity */

import { useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const QUOTES = [
  "El éxito no es el final, el fracaso no es fatal: es el coraje para continuar lo que cuenta.",
  "Cree en ti mismo y en todo lo que eres. Hay algo dentro de ti que es más grande que cualquier obstáculo.",
  "La única forma de hacer un gran trabajo es amar lo que haces.",
  "Tu tiempo es limitado, así que no lo pierdas viviendo la vida de alguien más.",
  "La mejor manera de predecir el futuro es creándolo.",
];

const QUICK_ACTIONS = [
  {
    href:  "/user/diagnostic",
    icon:  "📋",
    color: "#6B5CFF",
    title: "Realizar Diagnóstico",
    desc:  "Evalúa tus habilidades socioemocionales con 24 preguntas basadas en el modelo de Goleman.",
  },
  {
    href:  "/user/courses",
    icon:  "📚",
    color: "#5ACCA4",
    title: "Explorar Cursos",
    desc:  "Accede a 8 cursos de habilidades blandas diseñados para tu desarrollo profesional.",
  },
  {
    href:  "/user/chat",
    icon:  "💬",
    color: "#EAA2FC",
    title: "Practica con Alice (IA)",
    desc:  "Obtén orientación personalizada y responde tus dudas con la asistente inteligente.",
  },
  {
    href:  "/user/roadmap",
    icon:  "🗺️",
    color: "#E6CA52",
    title: "Mi Roadmap",
    desc:  "Consulta tu ruta de aprendizaje personalizada basada en los resultados del diagnóstico.",
  },
];

const STATS = [
  { label: "Diagnósticos",   value: "—", sub: "Completa el diagnóstico para ver resultados." },
  { label: "Cursos iniciados", value: "0", sub: "Explora los cursos disponibles." },
  { label: "Nivel general",  value: "—", sub: "Disponible tras el diagnóstico." },
];

// ─── Shared card style ────────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.08)",
  border:     "1px solid rgba(107,92,255,0.25)",
  borderRadius: 16,
};

export default function UserPage() {
  const { user } = useAuth();

  const displayName = user?.first_name
    ? `${user.first_name} ${user.last_name ?? ""}`.trim()
    : null;

  const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);

  return (
    <div className="space-y-8 max-w-4xl">

      {/* ── Welcome ────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#F9FAFC" }}>
          ¡Bienvenido, {displayName ?? user?.email}!
        </h1>
        <p className="text-sm mt-1" style={{ color: "rgba(249,250,252,0.45)" }}>
          Tu dashboard personal en la plataforma Alice Soft Skills.
        </p>
      </div>

      {/* ── Quick actions ──────────────────────────────────────────────────── */}
      <section>
        <h2
          className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: "rgba(249,250,252,0.38)" }}
        >
          Acciones rápidas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {QUICK_ACTIONS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="group flex items-start gap-4 p-5 rounded-2xl transition-all duration-200"
              style={{
                ...card,
                boxShadow: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(107,92,255,0.45)";
                (e.currentTarget as HTMLElement).style.boxShadow   = `0 0 24px rgba(107,92,255,0.1)`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(107,92,255,0.25)";
                (e.currentTarget as HTMLElement).style.boxShadow   = "none";
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `${a.color}22` }}
              >
                {a.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm" style={{ color: "#F9FAFC" }}>
                  {a.title}
                </h3>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: "rgba(249,250,252,0.45)" }}>
                  {a.desc}
                </p>
              </div>
              <svg
                className="w-4 h-4 flex-shrink-0 mt-0.5 transition-colors"
                style={{ color: "rgba(107,92,255,0.4)" }}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Progress stats ─────────────────────────────────────────────────── */}
      <section>
        <h2
          className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: "rgba(249,250,252,0.38)" }}
        >
          Tu progreso
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="p-5 rounded-2xl" style={card}>
              <p
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: "rgba(249,250,252,0.38)" }}
              >
                {s.label}
              </p>
              <p className="text-3xl font-bold mt-2" style={{ color: "#F9FAFC" }}>
                {s.value}
              </p>
              <p className="text-xs mt-1" style={{ color: "rgba(249,250,252,0.38)" }}>
                {s.sub}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quote of the day ───────────────────────────────────────────────── */}
      <section
        className="p-5 rounded-2xl"
        style={{
          background: "rgba(107,92,255,0.1)",
          border:     "1px solid rgba(107,92,255,0.25)",
          borderRadius: 16,
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: "#6B5CFF" }}
        >
          Frase del día
        </p>
        <p className="text-sm leading-relaxed italic" style={{ color: "rgba(249,250,252,0.75)" }}>
          &ldquo;{quote}&rdquo;
        </p>
      </section>

      {/* ── About Alice ────────────────────────────────────────────────────── */}
      <section className="p-5 rounded-2xl" style={card}>
        <h2 className="font-semibold text-sm" style={{ color: "#F9FAFC" }}>
          Sobre Alice
        </h2>
        <p className="text-sm mt-2 leading-relaxed" style={{ color: "rgba(249,250,252,0.5)" }}>
          Alice es una plataforma de desarrollo de habilidades blandas que usa el modelo de
          Inteligencia Emocional de Daniel Goleman. Completa el diagnóstico, toma cursos
          especializados y recibe un roadmap de aprendizaje personalizado.
        </p>
      </section>

    </div>
  );
}
