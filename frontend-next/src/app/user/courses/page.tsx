"use client";

import Link from "next/link";
import { COURSES_DATA, COURSE_NAMES } from "@/data/courses-data";

const COURSE_EMOJIS: Record<string, string> = {
  "Liderazgo":                     "🎯",
  "Comunicación Asertiva":         "💬",
  "Flexibilidad y Adaptabilidad":  "🌿",
  "Resolución de Conflictos":      "🤝",
  "Gestión Emocional":             "❤️",
  "Construcción Colectiva":        "👥",
  "Agilidad y Gestión del Tiempo": "⏱️",
  "Tolerancia a la Frustración":   "🌱",
  "Argumentación":                 "🧠",
  "Desarrollo de Sí mismo":        "✨",
};

const ACCENTS = [
  { color: "#6B5CFF", bg: "rgba(107,92,255,0.14)" },
  { color: "#5ACCA4", bg: "rgba(90,204,164,0.12)"  },
  { color: "#EAA2FC", bg: "rgba(234,162,252,0.12)" },
  { color: "#FE654F", bg: "rgba(254,101,79,0.12)"  },
  { color: "#E6CA52", bg: "rgba(230,202,82,0.12)"  },
  { color: "#6B5CFF", bg: "rgba(107,92,255,0.14)" },
  { color: "#5ACCA4", bg: "rgba(90,204,164,0.12)"  },
  { color: "#EAA2FC", bg: "rgba(234,162,252,0.12)" },
  { color: "#FE654F", bg: "rgba(254,101,79,0.12)"  },
  { color: "#E6CA52", bg: "rgba(230,202,82,0.12)"  },
];

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: "#F9FAFC" }}>
          Cursos Disponibles
        </h1>
        <p className="text-sm mt-1" style={{ color: "rgba(249,250,252,0.45)" }}>
          {COURSE_NAMES.length} cursos de habilidades blandas para tu desarrollo profesional.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {COURSE_NAMES.map((name, idx) => {
          const course = COURSES_DATA[name];
          const accent = ACCENTS[idx % ACCENTS.length];
          return (
            <Link
              key={name}
              href={`/user/courses/${idx}`}
              className="group flex flex-col gap-4 p-5 rounded-2xl transition-all duration-200 cursor-pointer"
              style={{
                background:   "rgba(255,255,255,0.08)",
                border:       `1px solid ${accent.color}30`,
                borderRadius: 16,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = accent.color + "60";
                (e.currentTarget as HTMLElement).style.boxShadow   = `0 0 20px ${accent.color}18`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = accent.color + "30";
                (e.currentTarget as HTMLElement).style.boxShadow   = "none";
              }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform duration-200 group-hover:scale-110"
                style={{ background: accent.bg }}
              >
                {COURSE_EMOJIS[name] ?? "📚"}
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3 className="font-semibold text-sm leading-snug" style={{ color: "#F9FAFC" }}>
                  {name}
                </h3>
                <p
                  className="text-xs mt-1.5 leading-relaxed line-clamp-3"
                  style={{ color: "rgba(249,250,252,0.45)" }}
                >
                  {course.description}
                </p>
              </div>

              {/* Inline CTA */}
              <span
                className="inline-flex items-center gap-1 text-xs font-semibold transition-all duration-150"
                style={{ color: accent.color }}
              >
                Ver curso
                <svg className="w-3 h-3 transition-transform duration-150 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
