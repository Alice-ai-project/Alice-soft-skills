import type { DimensionResult, DimensionName } from "@/types/diagnostics";

export interface RecommendedCourse {
  course: string;
  reason: string;
}

export interface SavedDiagnosticResult {
  totalScore: number;
  maxScore: number;
  overallLevel: string;
  dimensions: Array<{ name: string; score: number; maxScore: number; level: string }>;
  recommendedCourses: RecommendedCourse[];
  completedAt: string;
}

const COURSE_MAPPING: Record<DimensionName, string[]> = {
  Autoconocimiento:       ["Liderazgo",               "Desarrollo de Sí mismo"],
  Autorregulación:        ["Gestión Emocional",        "Tolerancia a la Frustración"],
  Motivación:             ["Liderazgo",                "Flexibilidad y Adaptabilidad"],
  Empatía:                ["Comunicación Asertiva",    "Construcción Colectiva"],
  "Habilidades Sociales": ["Comunicación Asertiva",    "Argumentación"],
  "Conexión Emocional":   ["Gestión Emocional",        "Resolución de Conflictos"],
};

const WEAK_THRESHOLD = 12;

export function computeRecommendations(dimensions: DimensionResult[]): RecommendedCourse[] {
  const weakDims = dimensions
    .filter((d) => d.score < WEAK_THRESHOLD)
    .sort((a, b) => a.score - b.score);

  const seen = new Set<string>();
  const recs: RecommendedCourse[] = [];

  for (const dim of weakDims) {
    for (const course of COURSE_MAPPING[dim.name] ?? []) {
      if (!seen.has(course)) {
        seen.add(course);
        recs.push({ course, reason: `Mejorar ${dim.name} (${dim.score}/${dim.maxScore})` });
      }
    }
  }

  if (recs.length === 0) {
    recs.push(
      { course: "Liderazgo",            reason: "Mantener y fortalecer habilidades" },
      { course: "Comunicación Asertiva", reason: "Mantener y fortalecer habilidades" },
    );
  }

  return recs;
}

const STORAGE_KEY = "alice_diagnostic_result";

export function saveDiagnosticResult(data: SavedDiagnosticResult): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadDiagnosticResult(): SavedDiagnosticResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedDiagnosticResult) : null;
  } catch {
    return null;
  }
}
