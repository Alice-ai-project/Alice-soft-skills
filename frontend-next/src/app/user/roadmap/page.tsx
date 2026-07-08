"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { loadDiagnosticResult, saveDiagnosticResult } from "@/utils/roadmap";
import type { SavedDiagnosticResult } from "@/utils/roadmap";
import { COURSE_NAMES } from "@/data/courses-data";
import { recommendRoadmap } from "@/services/roadmapService";
import { dimensionsToRoadmapInput } from "@/types/roadmap";
import type { RoadmapCourse } from "@/types/roadmap";
import { useAuth } from "@/contexts/AuthContext";

// RIWI-palette level styles
const LEVEL_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  Alta:      { color: "#5ACCA4", bg: "rgba(90,204,164,0.12)",  border: "rgba(90,204,164,0.3)"  },
  Media:     { color: "#7c3aed", bg: "rgba(124,58,237,0.12)", border: "rgba(124,58,237,0.3)"  },
  Baja:      { color: "#E6CA52", bg: "rgba(230,202,82,0.12)", border: "rgba(230,202,82,0.3)"  },
  "Muy Baja":{ color: "#FE654F", bg: "rgba(254,101,79,0.12)", border: "rgba(254,101,79,0.3)"  },
};

const STEP_COLORS = ["#7c3aed","#5ACCA4","#c084fc","#FE654F","#E6CA52","#7c3aed"];

const card: React.CSSProperties = {
  background:   "rgba(255,255,255,0.08)",
  border:       "1px solid rgba(124,58,237,0.25)",
  borderRadius: 16,
};

export default function RoadmapPage() {
  const { session } = useAuth();
  const [result,  setResult]  = useState<SavedDiagnosticResult | null>(loadDiagnosticResult);
  const mounted = useMemo(() => true, []);
  const [regenerating, setRegenerating] = useState(false);

  async function handleRegenerate() {
    if (!result || !session?.access_token) return;
    setRegenerating(true);
    try {
      const response = await recommendRoadmap(
        dimensionsToRoadmapInput(
          result.dimensions,
          result.overallLevel,
          result.totalScore,
          result.maxScore,
        ),
        session.access_token,
      );
      if (response.success && response.roadmap.length > 0) {
        const newRecs = response.roadmap.map((r: RoadmapCourse) => ({
          course: r.course,
          reason: r.reason,
        }));
        const updated = { ...result, recommendedCourses: newRecs };
        saveDiagnosticResult(updated);
        setResult(updated);
      }
    } catch {
      // Keep existing recommendations
    } finally {
      setRegenerating(false);
    }
  }

  if (!mounted) return null;

  // ── No diagnostic yet ──────────────────────────────────────────────────────
  if (!result) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#F9FAFC" }}>Mi Roadmap</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(249,250,252,0.45)" }}>
            Tu ruta de aprendizaje personalizada.
          </p>
        </div>

        <div
          className="p-12 flex flex-col items-center justify-center text-center rounded-2xl"
          style={card}
        >
          <div className="text-6xl mb-5">🗺️</div>
          <h2 className="text-lg font-bold" style={{ color: "#F9FAFC" }}>
            Tu roadmap aparecerá aquí
          </h2>
          <p className="text-sm mt-2 max-w-sm leading-relaxed" style={{ color: "rgba(249,250,252,0.45)" }}>
            Completa el diagnóstico de habilidades socioemocionales para recibir una ruta de
            aprendizaje personalizada basada en tus resultados.
          </p>
          <Link
            href="/user/diagnostic"
            className="mt-6 px-5 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: "#7c3aed", color: "#F9FAFC" }}
          >
            Realizar diagnóstico →
          </Link>
        </div>
      </div>
    );
  }

  const completedDate = new Date(result.completedAt).toLocaleDateString("es-CO", {
    year: "numeric", month: "long", day: "numeric",
  });

  const lvl = LEVEL_STYLE[result.overallLevel] ?? LEVEL_STYLE["Media"];
  const barPct = (result.totalScore / result.maxScore) * 100;

  return (
    <div className="space-y-6 max-w-2xl">

      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#F9FAFC" }}>Mi Roadmap</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(249,250,252,0.45)" }}>
          Ruta personalizada basada en tu diagnóstico del {completedDate}.
        </p>
      </div>

      {/* ── Score summary ───────────────────────────────────────────────────── */}
      <div className="p-5 rounded-2xl flex items-center gap-5" style={card}>
        <div className="flex-1">
          <p
            className="text-xs font-semibold uppercase tracking-wide mb-1"
            style={{ color: "rgba(249,250,252,0.38)" }}
          >
            Puntuación diagnóstico
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold" style={{ color: "#F9FAFC" }}>
              {result.totalScore}
            </span>
            <span className="text-sm" style={{ color: "rgba(249,250,252,0.4)" }}>
              / {result.maxScore}
            </span>
          </div>
          <div
            className="mt-2 rounded-full h-2"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <div
              className="h-2 rounded-full transition-all"
              style={{ width: `${barPct}%`, background: lvl.color }}
            />
          </div>
        </div>
        <span
          className="px-3 py-1.5 rounded-full text-sm font-bold flex-shrink-0"
          style={{ background: lvl.bg, color: lvl.color, border: `1px solid ${lvl.border}` }}
        >
          {result.overallLevel}
        </span>
      </div>

      {/* ── Timeline ────────────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-bold mb-4" style={{ color: "#F9FAFC" }}>
          Cursos recomendados
        </h2>
        <div className="relative pl-7 space-y-4">
          {/* Vertical connector */}
          <div
            className="absolute left-3 top-3 bottom-3 w-px"
            style={{ background: "rgba(124,58,237,0.25)" }}
          />

          {result.recommendedCourses.map((rec, i) => {
            const courseIdx = COURSE_NAMES.indexOf(rec.course as (typeof COURSE_NAMES)[number]);
            const dotColor  = STEP_COLORS[i % STEP_COLORS.length];
            return (
              <div key={i} className="relative flex items-start gap-4">
                {/* Step dot */}
                <div
                  className="absolute -left-7 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: dotColor, boxShadow: `0 0 10px ${dotColor}55` }}
                >
                  {i + 1}
                </div>

                {/* Card */}
                <div className="flex-1 p-4 rounded-xl" style={card}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold" style={{ color: "#F9FAFC" }}>
                        {rec.course}
                      </h3>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(249,250,252,0.45)" }}>
                        {rec.reason}
                      </p>
                    </div>
                    {courseIdx !== -1 && (
                      <Link
                        href={`/user/courses/${courseIdx}`}
                        className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={{
                          background: "rgba(124,58,237,0.25)",
              color:      "#d8b4fe",
              border:     "1px solid rgba(124,58,237,0.3)",
                        }}
                      >
                        Ver curso →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Summary banner ──────────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-6 p-4 rounded-2xl"
        style={{
          background: "rgba(124,58,237,0.1)",
          border:     "1px solid rgba(124,58,237,0.25)",
          borderRadius: 16,
        }}
      >
        <div className="text-center">
          <p className="text-2xl font-bold" style={{ color: "#7c3aed" }}>
            {result.recommendedCourses.length}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(249,250,252,0.45)" }}>cursos</p>
        </div>
        <div className="w-px h-10" style={{ background: "rgba(124,58,237,0.3)" }} />
        <div className="text-center">
          <p className="text-2xl font-bold" style={{ color: "#7c3aed" }}>
            {result.recommendedCourses.length * 2}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(249,250,252,0.45)" }}>
            semanas estimadas
          </p>
        </div>
        <div className="w-px h-10" style={{ background: "rgba(124,58,237,0.3)" }} />
        <p className="text-xs leading-relaxed flex-1" style={{ color: "rgba(249,250,252,0.5)" }}>
          Completa estos cursos a tu propio ritmo para fortalecer tus habilidades socioemocionales.
        </p>
      </div>

      {/* ── Actions ─────────────────────────────────────────────────────────── */}
      <div className="flex gap-3">
        <Link
          href="/user/courses"
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          style={{ background: "#7c3aed", color: "#F9FAFC" }}
        >
          Explorar todos los cursos
        </Link>
        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            background: regenerating ? "rgba(124,58,237,0.05)" : "rgba(124,58,237,0.1)",
            border:     "1px solid rgba(124,58,237,0.25)",
            color:      regenerating ? "rgba(249,250,252,0.3)" : "rgba(249,250,252,0.75)",
            cursor:     regenerating ? "not-allowed" : "pointer",
          }}
        >
          {regenerating ? "Regenerando..." : "Regenerar roadmap"}
        </button>
        <Link
          href="/user/diagnostic"
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            background: "rgba(124,58,237,0.1)",
            border:     "1px solid rgba(124,58,237,0.25)",
            color:      "rgba(249,250,252,0.75)",
          }}
        >
          Repetir diagnóstico
        </Link>
      </div>

    </div>
  );
}
