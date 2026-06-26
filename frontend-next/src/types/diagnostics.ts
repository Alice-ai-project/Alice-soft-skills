export interface DiagnosticOption {
  text: string;
  /** Score value 1–4 (index + 1 in the original array) */
  score: number;
}

export interface DiagnosticQuestion {
  question: string;
  /** Four options ordered from lowest to highest score */
  options: [string, string, string, string];
}

export type DimensionName =
  | "Autoconocimiento"
  | "Autorregulación"
  | "Motivación"
  | "Empatía"
  | "Habilidades Sociales"
  | "Conexión Emocional";

export interface DiagnosticSection {
  name: DimensionName;
  questions: DiagnosticQuestion[];
}

export interface DiagnosticData {
  title: string;
  subtitle: string;
  sections: DiagnosticSection[];
}

/** Score level thresholds (out of 16 per dimension) */
export type ScoreLevel = "Muy Baja" | "Baja" | "Media" | "Alta";

export interface DimensionResult {
  name: DimensionName;
  score: number;
  maxScore: number;
  level: ScoreLevel;
}

export interface DiagnosticResult {
  totalScore: number;
  maxScore: number;
  overallLevel: ScoreLevel;
  dimensions: DimensionResult[];
}
