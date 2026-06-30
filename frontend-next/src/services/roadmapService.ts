import { post } from "./apiClient";
import type {
  RoadmapRecommendRequest,
  RoadmapRecommendResponse,
} from "@/types/roadmap";

export async function recommendRoadmap(
  payload: RoadmapRecommendRequest,
  token: string,
): Promise<RoadmapRecommendResponse> {
  return post<RoadmapRecommendResponse>(
    "/api/v1/roadmap/recommend",
    payload,
    token,
  );
}
