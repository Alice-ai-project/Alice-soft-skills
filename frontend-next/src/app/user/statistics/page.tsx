"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { loadDiagnosticResult } from "@/utils/roadmap";
import { get } from "@/services/apiClient";

interface StatCard {
  icon: string;
  label: string;
  value: string;
  sub: string;
  color: string;
  bg: string;
  border: string;
}

const DEFAULT_STAT_CARDS: StatCard[] = [
  { icon: "📋", label: "Diagnósticos completados", value: "1",  sub: "Último: 15/06/2026",                          color: "#7c3aed", bg: "rgba(124,58,237,0.12)", border: "rgba(124,58,237,0.3)" },
  { icon: "📚", label: "Cursos iniciados",         value: "3",  sub: "2 en progreso, 1 completado",                 color: "#5ACCA4", bg: "rgba(90,204,164,0.12)", border: "rgba(90,204,164,0.3)" },
  { icon: "✅", label: "Cursos completados",       value: "1",  sub: "Gestión Emocional",                           color: "#c084fc", bg: "rgba(192,132,252,0.12)", border: "rgba(192,132,252,0.3)" },
  { icon: "📈", label: "Promedio de puntuación",   value: "72", sub: "Global: Alta",                                color: "#E6CA52", bg: "rgba(230,202,82,0.12)", border: "rgba(230,202,82,0.3)" },
];

interface DimScore {
  name: string;
  score: number;
  maxScore: number;
}

interface ApiDiagnostic {
  dimension_scores: Array<{ name: string; value: number }>;
  created_at: string;
}

function cardsFromLocal(diag: ReturnType<typeof loadDiagnosticResult>): StatCard[] {
  if (!diag) return DEFAULT_STAT_CARDS;
  const avg = Math.round(diag.totalScore / diag.dimensions.length);
  return [
    { icon: "📋", label: "Diagnósticos completados", value: "1",  sub: `Completado el ${new Date(diag.completedAt).toLocaleDateString("es-ES")}`, color: "#7c3aed", bg: "rgba(124,58,237,0.12)", border: "rgba(124,58,237,0.3)" },
    { icon: "📚", label: "Cursos iniciados",         value: "0",  sub: "Explora los cursos disponibles",            color: "#5ACCA4", bg: "rgba(90,204,164,0.12)", border: "rgba(90,204,164,0.3)" },
    { icon: "✅", label: "Cursos completados",       value: "0",  sub: "Completa un curso para registrar progreso", color: "#c084fc", bg: "rgba(192,132,252,0.12)", border: "rgba(192,132,252,0.3)" },
    { icon: "📈", label: "Promedio de puntuación",   value: String(avg), sub: `Global: ${diag.overallLevel}`,        color: "#E6CA52", bg: "rgba(230,202,82,0.12)", border: "rgba(230,202,82,0.3)" },
  ];
}

function dimsFromLocal(diag: ReturnType<typeof loadDiagnosticResult>): DimScore[] {
  if (!diag) return [];
  return diag.dimensions.map((d) => ({ name: d.name, score: d.score, maxScore: d.maxScore }));
}

function cardsFromApi(diag: ApiDiagnostic): StatCard[] {
  const total = diag.dimension_scores.reduce((s, d) => s + d.value, 0);
  const avg = Math.round(total / diag.dimension_scores.length);
  const levels: Array<[number, string]> = [[75, "Alta"], [50, "Media"], [25, "Baja"], [0, "Muy Baja"]];
  let level = "Muy Baja";
  for (const [threshold, name] of levels) {
    if (avg >= threshold) { level = name; break; }
  }
  return [
    { icon: "📋", label: "Diagnósticos completados", value: "1",  sub: `Completado el ${new Date(diag.created_at).toLocaleDateString("es-ES")}`, color: "#7c3aed", bg: "rgba(124,58,237,0.12)", border: "rgba(124,58,237,0.3)" },
    { icon: "📚", label: "Cursos iniciados",         value: "0",  sub: "Explora los cursos disponibles",            color: "#5ACCA4", bg: "rgba(90,204,164,0.12)", border: "rgba(90,204,164,0.3)" },
    { icon: "✅", label: "Cursos completados",       value: "0",  sub: "Completa un curso para registrar progreso", color: "#c084fc", bg: "rgba(192,132,252,0.12)", border: "rgba(192,132,252,0.3)" },
    { icon: "📈", label: "Promedio de puntuación",   value: String(avg), sub: `Global: ${level}`,                 color: "#E6CA52", bg: "rgba(230,202,82,0.12)", border: "rgba(230,202,82,0.3)" },
  ];
}

function dimsFromApi(diag: ApiDiagnostic): DimScore[] {
  return diag.dimension_scores.map((d) => ({ name: d.name, score: d.value, maxScore: 100 }));
}

function initStatCards(): StatCard[] {
  return cardsFromLocal(loadDiagnosticResult());
}

function initDimScores(): DimScore[] {
  return dimsFromLocal(loadDiagnosticResult());
}

const card: React.CSSProperties = {
  background:   "rgba(255,255,255,0.08)",
  border:       "1px solid rgba(124,58,237,0.25)",
  borderRadius: 16,
};

const DIM_COLORS = ["#7c3aed","#5ACCA4","#c084fc","#FE654F","#E6CA52","#7c3aed"];

export default function StatisticsPage() {
  const { user, session } = useAuth();
  const [statCards, setStatCards] = useState<StatCard[]>(initStatCards);
  const [dimScores, setDimScores] = useState<DimScore[]>(initDimScores);

  useEffect(() => {
    if (loadDiagnosticResult() || !session?.access_token || !user?.user_id) return;
    get<ApiDiagnostic>(`/api/v1/diagnostics/${user.user_id}`, session.access_token)
      .then((data) => {
        setStatCards(cardsFromApi(data));
        setDimScores(dimsFromApi(data));
      })
      .catch(() => { /* no diagnostic yet */ });
  }, [session?.access_token, user?.user_id]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#F9FAFC" }}>
          Mis Estadísticas
        </h1>
        <p className="text-sm mt-1" style={{ color: "rgba(249,250,252,0.45)" }}>
          Resumen de tu actividad y progreso en la plataforma.
        </p>
      </div>

      {/* ── Summary cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="flex flex-col gap-3 p-5 rounded-2xl"
            style={{
              background:   "rgba(255,255,255,0.08)",
              border:       `1px solid ${s.border}`,
              borderRadius: 16,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: s.bg }}
            >
              {s.icon}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: s.color }}>
                {s.label}
              </p>
              <p className="text-3xl font-bold mt-1" style={{ color: "#F9FAFC" }}>
                {s.value}
              </p>
              <p className="text-xs mt-1" style={{ color: "rgba(249,250,252,0.38)" }}>
                {s.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Dimensions ─────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-bold mb-4" style={{ color: "#F9FAFC" }}>
          Resultados por dimensión
        </h2>
        <div className="p-6 rounded-2xl space-y-4" style={card}>
          {dimScores.length > 0 ? (
            dimScores.map((dim, i) => {
              const c = DIM_COLORS[i % DIM_COLORS.length];
              const pct = Math.round((dim.score / dim.maxScore) * 100);
              return (
                <div key={dim.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium" style={{ color: "rgba(249,250,252,0.75)" }}>
                      {dim.name}
                    </span>
                    <span className="text-xs" style={{ color: "rgba(249,250,252,0.55)" }}>
                      {dim.score}/{dim.maxScore} ({pct}%)
                    </span>
                  </div>
                  <div className="rounded-full h-2" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ background: c, width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <>
              {([
                { name: "Autoconocimiento",    score: 78, maxScore: 100 },
                { name: "Autorregulación",     score: 65, maxScore: 100 },
                { name: "Motivación",          score: 82, maxScore: 100 },
                { name: "Empatía",             score: 70, maxScore: 100 },
                { name: "Habilidades Sociales", score: 75, maxScore: 100 },
                { name: "Conexión Emocional",  score: 68, maxScore: 100 },
              ]).map((dim, i) => {
                const c = DIM_COLORS[i % DIM_COLORS.length];
                const pct = Math.round((dim.score / dim.maxScore) * 100);
                return (
                  <div key={dim.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium" style={{ color: "rgba(249,250,252,0.75)" }}>
                        {dim.name}
                      </span>
                      <span className="text-xs" style={{ color: "rgba(249,250,252,0.55)" }}>
                        {dim.score}/{dim.maxScore} ({pct}%)
                      </span>
                    </div>
                    <div className="rounded-full h-2" style={{ background: "rgba(255,255,255,0.07)" }}>
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ background: c, width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </>
          )}
          {dimScores.length === 0 && (
            <p
              className="text-xs pt-3"
              style={{
                color:       "rgba(249,250,252,0.35)",
                borderTop:   "1px solid rgba(124,58,237,0.12)",
              }}
            >
              Estos son datos de ejemplo. Completa el diagnóstico para ver tus resultados reales.
            </p>
          )}
        </div>
      </section>

      {/* ── Activity log ───────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-bold mb-4" style={{ color: "#F9FAFC" }}>
          Actividad reciente
        </h2>
        <div
          className="p-10 flex flex-col items-center justify-center text-center rounded-2xl"
          style={card}
        >
          <div className="text-4xl mb-3">📊</div>
          <p className="text-sm" style={{ color: "rgba(249,250,252,0.4)" }}>
            No hay actividad registrada todavía.
          </p>
        </div>
      </section>
    </div>
  );
}
