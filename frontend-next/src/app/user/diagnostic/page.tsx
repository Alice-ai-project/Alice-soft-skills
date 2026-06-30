"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import Link from "next/link";
import { DIAGNOSTICO_DATA } from "@/data/diagnostico-data";
import { COURSE_NAMES } from "@/data/courses-data";
import { saveDiagnosticResult, loadDiagnosticResult } from "@/utils/roadmap";
import type { RecommendedCourse } from "@/utils/roadmap";
import { recommendRoadmap } from "@/services/roadmapService";
import { dimensionsToRoadmapInput } from "@/types/roadmap";
import type { RoadmapCourse } from "@/types/roadmap";
import { useAuth } from "@/contexts/AuthContext";
import type { DiagnosticResult, DimensionResult, ScoreLevel } from "@/types/diagnostics";

const PERSIST_STEP    = "alice_diag_step";
const PERSIST_ANSWERS = "alice_diag_answers";

type Answers = Record<string, number>;

// ─── Business logic (unchanged) ───────────────────────────────────────────────

function getLevel(score: number, min: number, max: number): ScoreLevel {
  const pct = (score - min) / (max - min);
  if (pct <= 0.25) return "Muy Baja";
  if (pct <= 0.5)  return "Baja";
  if (pct <= 0.75) return "Media";
  return "Alta";
}

function calculateResults(answers: Answers): DiagnosticResult {
  const { sections } = DIAGNOSTICO_DATA;
  const qCount = 4;
  const minD = qCount;
  const maxD = qCount * 4;

  const dimensions: DimensionResult[] = sections.map((sec, si) => {
    const score = sec.questions.reduce(
      (acc, _, qi) => acc + ((answers[`${si}-${qi}`] ?? 0) + 1),
      0,
    );
    return { name: sec.name, score, maxScore: maxD, level: getLevel(score, minD, maxD) };
  });

  const totalScore = dimensions.reduce((a, d) => a + d.score, 0);
  const minTotal   = sections.length * minD;
  const maxTotal   = sections.length * maxD;

  return {
    totalScore,
    maxScore:     maxTotal,
    overallLevel: getLevel(totalScore, minTotal, maxTotal),
    dimensions,
  };
}

// ─── RIWI palette level styles ────────────────────────────────────────────────

const LEVEL_STYLE: Record<ScoreLevel, { color: string; bg: string; border: string; bar: string }> = {
  Alta:      { color: "#5ACCA4", bg: "rgba(90,204,164,0.12)",  border: "rgba(90,204,164,0.3)",  bar: "#5ACCA4" },
  Media:     { color: "#6B5CFF", bg: "rgba(107,92,255,0.12)", border: "rgba(107,92,255,0.3)",  bar: "#6B5CFF" },
  Baja:      { color: "#E6CA52", bg: "rgba(230,202,82,0.12)", border: "rgba(230,202,82,0.3)",  bar: "#E6CA52" },
  "Muy Baja":{ color: "#FE654F", bg: "rgba(254,101,79,0.12)", border: "rgba(254,101,79,0.3)",  bar: "#FE654F" },
};

// ─── Shared surface ───────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background:   "rgba(255,255,255,0.08)",
  border:       "1px solid rgba(107,92,255,0.25)",
  borderRadius: 14,
};

// ─── Component ────────────────────────────────────────────────────────────────

const sections   = DIAGNOSTICO_DATA.sections;
const totalSteps = sections.length;

export default function DiagnosticPage() {
  const { session } = useAuth();
  const [ready,           setReady]           = useState(false);
  const [step,            setStep]            = useState(0);
  const [answers,         setAnswers]         = useState<Answers>({});
  const [error,           setError]           = useState<string | null>(null);
  const [result,          setResult]          = useState<DiagnosticResult | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendedCourse[]>([]);

  const currentSection = sections[step];

  // ── Restore persisted state on mount, then enable writes ─────────────────
  useEffect(() => {
    try {
      const rawStep    = localStorage.getItem(PERSIST_STEP);
      const rawAnswers = localStorage.getItem(PERSIST_ANSWERS);

      if (rawAnswers) {
        setAnswers(JSON.parse(rawAnswers) as Answers);
      }

      if (rawStep !== null) {
        const n = Math.min(Math.max(0, Number(rawStep)), totalSteps);
        if (!Number.isNaN(n)) {
          setStep(n);

          if (n >= totalSteps) {
            const saved = loadDiagnosticResult();
            if (saved) {
              setResult({
                totalScore:   saved.totalScore,
                maxScore:     saved.maxScore,
                overallLevel: saved.overallLevel as ScoreLevel,
                dimensions:   saved.dimensions as DimensionResult[],
              });
              setRecommendations(saved.recommendedCourses);
            } else {
              setStep(0);
              localStorage.removeItem(PERSIST_STEP);
            }
          }
        }
      }
    } catch { /* ignore storage errors */ }

    // Signal that restore is complete — persist effects are now safe to write
    setReady(true);
  }, []);

  // ── Persist only after initial restore to avoid overwriting saved data ────
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(PERSIST_STEP, String(step)); } catch { /* ignore */ }
  }, [step, ready]);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(PERSIST_ANSWERS, JSON.stringify(answers)); } catch { /* ignore */ }
  }, [answers, ready]);

  function handleAnswer(qIdx: number, optIdx: number) {
    setAnswers((prev) => ({ ...prev, [`${step}-${qIdx}`]: optIdx }));
    setError(null);
  }

  async function handleNext() {
    const missing = currentSection.questions.some(
      (_, qi) => answers[`${step}-${qi}`] === undefined,
    );
    if (missing) {
      setError("Por favor responde todas las preguntas antes de continuar.");
      return;
    }
    setError(null);
    if (step < totalSteps - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const newResult = calculateResults(answers);

      let recs: RecommendedCourse[] = [];
      if (session?.access_token) {
        try {
          const response = await recommendRoadmap(
            dimensionsToRoadmapInput(
              newResult.dimensions,
              newResult.overallLevel,
              newResult.totalScore,
              newResult.maxScore,
            ),
            session.access_token,
          );
          if (response.success && response.roadmap.length > 0) {
            recs = response.roadmap.map((r: RoadmapCourse) => ({
              course: r.course,
              reason: r.reason,
            }));
          }
        } catch {
          // Fallback to local computation if n8n fails
        }
      }

      saveDiagnosticResult({
        totalScore:   newResult.totalScore,
        maxScore:     newResult.maxScore,
        overallLevel: newResult.overallLevel,
        dimensions:   newResult.dimensions,
        recommendedCourses: recs,
        completedAt:  new Date().toISOString(),
      });
      setResult(newResult);
      setRecommendations(recs);
      setStep(totalSteps);
    }
  }

  function handlePrev() {
    if (step > 0) { setStep(step - 1); setError(null); window.scrollTo({ top: 0, behavior: "smooth" }); }
  }

  function handleRestart() {
    try {
      localStorage.removeItem(PERSIST_STEP);
      localStorage.removeItem(PERSIST_ANSWERS);
    } catch { /* ignore */ }
    setStep(0); setAnswers({}); setError(null); setResult(null); setRecommendations([]);
  }

  // ── Results view ─────────────────────────────────────────────────────────────
  if (step === totalSteps && result) {
    const overallStyle = LEVEL_STYLE[result.overallLevel];
    return (
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#F9FAFC" }}>
            Resultados del Diagnóstico
          </h1>
          <p className="text-sm mt-1" style={{ color: "rgba(249,250,252,0.45)" }}>
            {DIAGNOSTICO_DATA.subtitle}
          </p>
        </div>

        {/* Global score */}
        <div className="p-6 rounded-2xl" style={card}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: "rgba(249,250,252,0.65)" }}>
              Puntuación global
            </span>
            <span
              className="px-3 py-1 rounded-full text-sm font-bold"
              style={{ background: overallStyle.bg, color: overallStyle.color, border: `1px solid ${overallStyle.border}` }}
            >
              {result.overallLevel}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold" style={{ color: "#F9FAFC" }}>
              {result.totalScore}
            </span>
            <span className="text-sm" style={{ color: "rgba(249,250,252,0.4)" }}>
              / {result.maxScore}
            </span>
          </div>
          <div className="mt-3 rounded-full h-2" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div
              className="h-2 rounded-full transition-all"
              style={{ width: `${(result.totalScore / result.maxScore) * 100}%`, background: overallStyle.bar }}
            />
          </div>
        </div>

        {/* Dimensions */}
        <div className="space-y-3">
          {result.dimensions.map((dim) => {
            const s = LEVEL_STYLE[dim.level];
            return (
              <div key={dim.name} className="p-4 rounded-xl" style={card}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold" style={{ color: "#F9FAFC" }}>
                    {dim.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: "rgba(249,250,252,0.38)" }}>
                      {dim.score}/{dim.maxScore}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
                    >
                      {dim.level}
                    </span>
                  </div>
                </div>
                <div className="rounded-full h-1.5" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${(dim.score / dim.maxScore) * 100}%`, background: s.bar }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommended courses */}
        {recommendations.length > 0 && (
          <div
            className="p-5 rounded-2xl"
            style={{
              background:   "rgba(107,92,255,0.1)",
              border:       "1px solid rgba(107,92,255,0.25)",
              borderRadius: 16,
            }}
          >
            <h2 className="text-base font-bold mb-1" style={{ color: "#F9FAFC" }}>
              Cursos recomendados
            </h2>
            <p className="text-xs mb-4" style={{ color: "rgba(249,250,252,0.45)" }}>
              Basado en tus áreas de mejora, te sugerimos:
            </p>
            <div className="space-y-2">
              {recommendations.map((rec, i) => {
                const courseIdx = COURSE_NAMES.indexOf(rec.course as (typeof COURSE_NAMES)[number]);
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl"
                    style={card}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(107,92,255,0.3)", color: "#c4b8ff" }}
                      >
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: "#F9FAFC" }}>
                          {rec.course}
                        </p>
                        <p className="text-xs truncate" style={{ color: "rgba(249,250,252,0.45)" }}>
                          {rec.reason}
                        </p>
                      </div>
                    </div>
                    {courseIdx !== -1 && (
                      <Link
                        href={`/user/courses/${courseIdx}`}
                        className="flex-shrink-0 px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                        style={{ background: "#6B5CFF", color: "#F9FAFC" }}
                      >
                        Ver →
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-xs mt-3" style={{ color: "rgba(249,250,252,0.4)" }}>
              Tiempo estimado: {recommendations.length * 2} semanas · {recommendations.length} cursos
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleRestart}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: "rgba(107,92,255,0.1)",
              border:     "1px solid rgba(107,92,255,0.25)",
              color:      "rgba(249,250,252,0.75)",
            }}
          >
            Repetir diagnóstico
          </button>
          <Link
            href="/user/roadmap"
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: "#6B5CFF", color: "#F9FAFC" }}
          >
            Ver mi roadmap →
          </Link>
        </div>
      </div>
    );
  }

  // ── Stepper view ─────────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#F9FAFC" }}>
          {DIAGNOSTICO_DATA.title}
        </h1>
        <p className="text-sm mt-1" style={{ color: "rgba(249,250,252,0.45)" }}>
          {DIAGNOSTICO_DATA.subtitle}
        </p>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs mb-2" style={{ color: "rgba(249,250,252,0.45)" }}>
          <span>Dimensión {step + 1} de {totalSteps}</span>
          <span>{Math.round((step / totalSteps) * 100)}% completado</span>
        </div>
        <div className="flex gap-1">
          {sections.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1.5 rounded-full transition-all duration-300"
              style={{
                background:
                  i < step   ? "#6B5CFF" :
                  i === step ? "rgba(107,92,255,0.45)" :
                               "rgba(255,255,255,0.08)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Section label */}
      <div
        className="p-4 rounded-xl"
        style={{
          background: "rgba(107,92,255,0.1)",
          border:     "1px solid rgba(107,92,255,0.25)",
          borderRadius: 14,
        }}
      >
        <h2 className="text-base font-bold" style={{ color: "#F9FAFC" }}>
          {currentSection.name}
        </h2>
        <p className="text-sm mt-0.5" style={{ color: "rgba(249,250,252,0.5)" }}>
          Responde honestamente cada pregunta.
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-5">
        {currentSection.questions.map((q, qi) => {
          const sel = answers[`${step}-${qi}`];
          return (
            <div key={qi} className="p-5 rounded-xl" style={card}>
              <p className="text-sm font-semibold mb-4" style={{ color: "#F9FAFC" }}>
                {step * 4 + qi + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => (
                  <label
                    key={oi}
                    className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-150"
                    style={
                      sel === oi
                        ? {
                            background: "rgba(107,92,255,0.25)",
                            border:     "1px solid rgba(107,92,255,0.5)",
                          }
                        : {
                            background: "rgba(255,255,255,0.03)",
                            border:     "1px solid rgba(107,92,255,0.12)",
                          }
                    }
                  >
                    <input
                      type="radio"
                      name={`q-${step}-${qi}`}
                      value={oi}
                      checked={sel === oi}
                      onChange={() => handleAnswer(qi, oi)}
                      className="mt-0.5 flex-shrink-0"
                      style={{ accentColor: "#6B5CFF" }}
                    />
                    <span className="text-sm leading-relaxed" style={{ color: "rgba(249,250,252,0.8)" }}>
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Validation error */}
      {error && (
        <p
          className="text-sm p-3 rounded-lg"
          style={{
            background: "rgba(254,101,79,0.1)",
            border:     "1px solid rgba(254,101,79,0.3)",
            color:      "#FE654F",
          }}
        >
          {error}
        </p>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pb-4">
        {step > 0 && (
          <button
            onClick={handlePrev}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: "rgba(107,92,255,0.1)",
              border:     "1px solid rgba(107,92,255,0.25)",
              color:      "rgba(249,250,252,0.75)",
            }}
          >
            ← Anterior
          </button>
        )}
        <button
          onClick={handleNext}
          className="ml-auto px-6 py-2 rounded-lg text-sm font-semibold transition-all"
          style={{ background: "#6B5CFF", color: "#F9FAFC" }}
        >
          {step === totalSteps - 1 ? "Ver resultados" : "Siguiente →"}
        </button>
      </div>
    </div>
  );
}
