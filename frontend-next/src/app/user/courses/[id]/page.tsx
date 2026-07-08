"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { COURSES_DATA, COURSE_NAMES } from "@/data/courses-data";
import type { CourseEvaluation } from "@/types/courses";

const card: React.CSSProperties = {
  background:   "rgba(255,255,255,0.08)",
  border:       "1px solid rgba(124,58,237,0.25)",
  borderRadius: 14,
};

function EvaluationQuiz({ evaluation }: { evaluation: CourseEvaluation }) {
  const [selected,  setSelected]  = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const totalQ = evaluation.questions.length;

  function handleSubmit() {
    if (Object.keys(selected).length < totalQ) {
      setError("Por favor responde todas las preguntas.");
      return;
    }
    setError(null);
    setSubmitted(true);
  }

  function handleReset() {
    setSelected({});
    setSubmitted(false);
    setError(null);
  }

  const score  = submitted ? evaluation.questions.filter((q, i) => selected[i] === q.correct).length : 0;
  const pct    = submitted ? Math.round((score / totalQ) * 100) : 0;
  const passed = pct >= evaluation.passScore;

  return (
    <div className="space-y-4">
      {evaluation.questions.map((q, qi) => (
        <div key={qi} className="rounded-xl p-4" style={card}>
          <p className="text-sm font-semibold mb-3" style={{ color: "#F9FAFC" }}>
            {qi + 1}. {q.question}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, oi) => {
              const isCorrect  = oi === q.correct;
              const isSelected = selected[qi] === oi;

              let optStyle: React.CSSProperties;
              let textColor: string;

              if (submitted) {
                if (isCorrect) {
                  optStyle  = { background: "rgba(90,204,164,0.12)", border: "1px solid rgba(90,204,164,0.4)" };
                  textColor = "#5ACCA4";
                } else if (isSelected) {
                  optStyle  = { background: "rgba(254,101,79,0.1)", border: "1px solid rgba(254,101,79,0.4)" };
                  textColor = "#FE654F";
                } else {
                  optStyle  = { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(124,58,237,0.08)", opacity: 0.45 };
                  textColor = "rgba(249,250,252,0.55)";
                }
              } else {
                optStyle  = isSelected
                  ? { background: "rgba(124,58,237,0.25)", border: "1px solid rgba(124,58,237,0.5)" }
                  : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(124,58,237,0.12)" };
                textColor = isSelected ? "#d8b4fe" : "rgba(249,250,252,0.75)";
              }

              return (
                <label
                  key={oi}
                  className="flex items-start gap-3 p-3 rounded-lg transition-colors"
                  style={{ ...optStyle, cursor: submitted ? "default" : "pointer" }}
                >
                  <input
                    type="radio"
                    name={`eval-${qi}`}
                    value={oi}
                    checked={isSelected}
                    onChange={() => !submitted && setSelected((p) => ({ ...p, [qi]: oi }))}
                    disabled={submitted}
                    className="mt-0.5 flex-shrink-0 accent-[#7c3aed]"
                  />
                  <span className="text-sm" style={{ color: textColor }}>{opt}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {error && (
        <p
          className="text-sm rounded-lg p-3"
          style={{
            color:      "#FE654F",
            background: "rgba(254,101,79,0.1)",
            border:     "1px solid rgba(254,101,79,0.3)",
          }}
        >
          {error}
        </p>
      )}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="px-6 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-85"
          style={{ background: "#7c3aed", color: "#F9FAFC" }}
        >
          Enviar evaluación
        </button>
      ) : (
        <>
          <div
            className="rounded-xl p-4"
            style={
              passed
                ? { background: "rgba(90,204,164,0.1)", border: "1px solid rgba(90,204,164,0.35)" }
                : { background: "rgba(254,101,79,0.1)", border: "1px solid rgba(254,101,79,0.35)" }
            }
          >
            <p className="font-semibold text-sm" style={{ color: passed ? "#5ACCA4" : "#FE654F" }}>
              {passed ? "¡Aprobado!" : "No aprobado"} — {score}/{totalQ} correctas ({pct}%)
            </p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(249,250,252,0.4)" }}>
              Puntaje mínimo para aprobar: {evaluation.passScore}%
            </p>
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-75"
            style={{
              background: "rgba(124,58,237,0.1)",
              border:     "1px solid rgba(124,58,237,0.25)",
              color:      "rgba(249,250,252,0.75)",
            }}
          >
            Intentar de nuevo
          </button>
        </>
      )}
    </div>
  );
}

export default function CourseDetailPage() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const idx    = Number(params.id);

  if (isNaN(idx) || idx < 0 || idx >= COURSE_NAMES.length) {
    return (
      <div className="text-center py-16">
        <p className="text-sm" style={{ color: "rgba(249,250,252,0.45)" }}>
          Curso no encontrado.
        </p>
        <Link
          href="/user/courses"
          className="text-sm mt-3 inline-block"
          style={{ color: "#7c3aed" }}
        >
          ← Volver a cursos
        </Link>
      </div>
    );
  }

  const name   = COURSE_NAMES[idx];
  const course = COURSES_DATA[name];

  return (
    <div className="max-w-3xl space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm" style={{ color: "rgba(249,250,252,0.38)" }}>
        <Link
          href="/user/courses"
          className="transition-colors hover:text-[#7c3aed]"
        >
          Cursos
        </Link>
        <span>/</span>
        <span style={{ color: "rgba(249,250,252,0.75)" }}>{name}</span>
      </nav>

      {/* Header */}
      <div className="p-6 rounded-xl" style={card}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold" style={{ color: "#F9FAFC" }}>
              {name}
            </h1>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(249,250,252,0.55)" }}>
              {course.description}
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.setItem("alice_chat_context", name);
              router.push("/user/chat");
            }}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-85"
            style={{ background: "#7c3aed", color: "#F9FAFC" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Practicar con Alice
          </button>
        </div>
      </div>

      {/* Content sections */}
      <section>
        <h2 className="text-base font-bold mb-3" style={{ color: "#F9FAFC" }}>
          {course.content.title}
        </h2>
        <div className="space-y-2">
          {course.content.sections.map((sec, i) => (
            <details
              key={i}
              className="rounded-xl group open:border-[rgba(124,58,237,0.35)]"
              style={card}
            >
              <summary
                className="flex items-center justify-between gap-3 p-4 cursor-pointer list-none select-none text-sm font-medium"
                style={{ color: "rgba(249,250,252,0.85)" }}
              >
                <span>{sec.heading}</span>
                <svg
                  className="w-4 h-4 flex-shrink-0 transition-transform group-open:rotate-180"
                  style={{ color: "rgba(124,58,237,0.6)" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div
                className="px-4 pb-4 pt-3"
                style={{ borderTop: "1px solid rgba(124,58,237,0.12)" }}
              >
                <p className="text-sm leading-relaxed" style={{ color: "rgba(249,250,252,0.6)" }}>
                  {sec.text}
                </p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Resources */}
      {course.resources.length > 0 && (
        <section>
          <h2 className="text-base font-bold mb-3" style={{ color: "#F9FAFC" }}>
            Recursos
          </h2>
          <div className="space-y-2">
            {course.resources.map((res, i) => {
              const href = res.url ?? (res.file ? `/docs/${res.file}` : null);
              const isPdf = res.type === "pdf";
              const accentColor = isPdf ? "#FE654F" : "#7c3aed";
              const iconBg = isPdf
                ? { background: "rgba(254,101,79,0.12)", border: "1px solid rgba(254,101,79,0.25)" }
                : { background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)" };

              const inner = (
                <>
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
                    style={iconBg}
                  >
                    {isPdf ? "📄" : "▶️"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate transition-colors"
                      style={{ color: "#F9FAFC" }}
                    >
                      {res.name}
                    </p>
                    <p className="text-xs capitalize" style={{ color: "rgba(249,250,252,0.38)" }}>
                      {res.type === "pdf" ? "PDF" : "YouTube"}
                    </p>
                  </div>
                  <svg
                    className="w-4 h-4 flex-shrink-0 opacity-50 transition-opacity"
                    style={{ color: accentColor }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </>
              );

              return href ? (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 rounded-xl transition-all duration-150"
                  style={card}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${accentColor}55`;
                    (e.currentTarget as HTMLElement).style.boxShadow   = `0 0 16px ${accentColor}12`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.25)";
                    (e.currentTarget as HTMLElement).style.boxShadow   = "none";
                  }}
                >
                  {inner}
                </a>
              ) : (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl" style={card}>
                  {inner}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Evaluation */}
      <section>
        <h2 className="text-base font-bold mb-3" style={{ color: "#F9FAFC" }}>
          {course.evaluation.title}
        </h2>
        <EvaluationQuiz evaluation={course.evaluation} />
      </section>
    </div>
  );
}
