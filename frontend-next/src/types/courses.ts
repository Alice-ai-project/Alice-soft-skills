export type ResourceType = "pdf" | "youtube";

export interface CourseResource {
  type: ResourceType;
  name: string;
  file?: string;
  url?: string;
}

export interface CourseSection {
  heading: string;
  text: string;
}

export interface CourseEvaluationQuestion {
  question: string;
  options: [string, string, string, string];
  correct: number;
}

export interface CourseEvaluation {
  title: string;
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
  | "Comunicacion Asertiva"
  | "Construccion Colectiva"
  | "Desarrollo de Si mismo"
  | "Flexibilidad y Adaptabilidad"
  | "Gestion del Tiempo"
  | "Gestion Emocional"
  | "Liderazgo"
  | "Resistencia a la Frustracion"
  | "Resolucion de Conflictos";

export type CoursesData = Record<CourseName, Course>;
