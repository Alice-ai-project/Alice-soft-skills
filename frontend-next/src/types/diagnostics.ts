export interface DiagnosticQuestion {
  question: string;
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
