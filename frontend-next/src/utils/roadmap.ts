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
