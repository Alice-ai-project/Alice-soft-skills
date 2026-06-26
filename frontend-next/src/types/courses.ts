export type ResourceType = "pdf" | "youtube";

export interface CourseResource {
  type: ResourceType;
  name: string;
  /** PDF filename (only when type === "pdf") */
  file?: string;
  /** YouTube URL (only when type === "youtube") */
  url?: string;
}

export interface CourseSection {
  heading: string;
  text: string;
}

export interface CourseEvaluationQuestion {
  question: string;
  options: [string, string, string, string];
  /** Index of the correct option (0–3) */
  correct: number;
}

export interface CourseEvaluation {
  title: string;
  /** Minimum percentage (0–100) to pass */
  passScore: number;
  questions: CourseEvaluationQuestion[];
}

export interface Course {
  description: string;
  icon: string;
  color: string;
  content: {
    title: string;
    sections: CourseSection[];
  };
  resources: CourseResource[];
  evaluation: CourseEvaluation;
}

export type CourseName =
  | "Liderazgo"
  | "Comunicación Asertiva"
  | "Flexibilidad y Adaptabilidad"
  | "Resolución de Conflictos"
  | "Gestión Emocional"
  | "Construcción Colectiva"
  | "Agilidad y Gestión del Tiempo"
  | "Tolerancia a la Frustración"
  | "Argumentación"
  | "Desarrollo de Sí mismo";

export type CoursesData = Record<CourseName, Course>;
