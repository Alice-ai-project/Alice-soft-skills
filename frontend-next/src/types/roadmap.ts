export interface RoadmapDimension {
  name: string;
  score: number;
  maxScore: number;
  level: string;
}

export interface RoadmapRecommendRequest {
  dimensions: RoadmapDimension[];
  overallLevel: string;
  totalScore: number;
  maxScore: number;
}

export interface RoadmapCourse {
  course: string;
  priority: number;
  reason: string;
  estimatedWeeks: number;
}

export interface RoadmapRecommendResponse {
  success: boolean;
  roadmap: RoadmapCourse[];
  summary: string;
  diagnostic: {
    overallLevel: string;
    totalScore: number;
    maxScore: number;
  };
  error?: string;
}

export function dimensionsToRoadmapInput(
  dimensions: RoadmapDimension[],
  overallLevel: string,
  totalScore: number,
  maxScore: number,
): RoadmapRecommendRequest {
  return {
    dimensions,
    overallLevel,
    totalScore,
    maxScore,
  };
}
