"use client";

/* eslint-disable react-hooks/purity */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { loadDiagnosticResult } from "@/utils/roadmap";
import { get } from "@/services/apiClient";

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
    color: "#7c3aed",
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
    color: "#c084fc",
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

interface StatItem {
  label: string;
  value: string;
  sub: string;
}

const DEFAULT_STATS: StatItem[] = [
  { label: "Diagnósticos",     value: "1",  sub: "Completado el 15/06/2026." },
  { label: "Cursos iniciados", value: "3",  sub: "2 en progreso, 1 completado." },
  { label: "Nivel general",    value: "Alta", sub: "Puntuación: 320/480." },
];

interface ApiDiagnostic {
  dimension_scores: Array<{ name: string; value: number }>;
  created_at: string;
}

function initStats(): StatItem[] {
  const local = loadDiagnosticResult();
  if (!local) return DEFAULT_STATS;
  return [
    { label: "Diagnósticos", value: "1", sub: `Completado el ${new Date(local.completedAt).toLocaleDateString("es-ES")}.` },
    { label: "Cursos iniciados", value: "0", sub: "Explora los cursos disponibles." },
    { label: "Nivel general", value: local.overallLevel, sub: `Puntuación: ${local.totalScore}/${local.maxScore}.` },
  ];
}

function statsFromApi(diag: ApiDiagnostic): StatItem[] {
  const total = diag.dimension_scores.reduce((s, d) => s + d.value, 0);
  const max = diag.dimension_scores.length * 100;
  const avg = Math.round(total / diag.dimension_scores.length);
  const levels: Record<string, string> = { 0: "Muy Baja", 25: "Baja", 50: "Media", 75: "Alta" };
  let level = "Muy Baja";
  for (const threshold of [75, 50, 25]) {
    if (avg >= threshold) { level = levels[threshold]; break; }
  }
  return [
    { label: "Diagnósticos", value: "1", sub: `Completado el ${new Date(diag.created_at).toLocaleDateString("es-ES")}.` },
    { label: "Cursos iniciados", value: "0", sub: "Explora los cursos disponibles." },
    { label: "Nivel general", value: level, sub: `Puntuación: ${total}/${max}.` },
  ];
}

// ─── Shared card style ────────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.08)",
  border:     "1px solid rgba(124,58,237,0.25)",
  borderRadius: 16,
};

export default function UserPage() {
  const { user, session } = useAuth();
  const [stats, setStats] = useState<StatItem[]>(initStats);

  useEffect(() => {
    if (loadDiagnosticResult() || !session?.access_token || !user?.user_id) return;
    get<ApiDiagnostic>(`/api/v1/diagnostics/${user.user_id}`, session.access_token)
      .then((data) => setStats(statsFromApi(data)))
      .catch(() => { /* no diagnostic yet */ });
  }, [session?.access_token, user?.user_id]);

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

      {/* ── Quote of the day ───────────────────────────────────────────────── */}
      <section
        className="p-5 rounded-2xl"
        style={{
          background: "rgba(124,58,237,0.1)",
  border:     "1px solid rgba(124,58,237,0.25)",
          borderRadius: 16,
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: "#7c3aed" }}
        >
          Frase del día
        </p>
        <p className="text-sm leading-relaxed italic" style={{ color: "rgba(249,250,252,0.75)" }}>
          &ldquo;{quote}&rdquo;
        </p>
      </section>

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
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.45)";
                (e.currentTarget as HTMLElement).style.boxShadow   = `0 0 24px rgba(124,58,237,0.1)`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.25)";
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
                style={{ color: "rgba(124,58,237,0.4)" }}
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
          {stats.map((s) => (
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
