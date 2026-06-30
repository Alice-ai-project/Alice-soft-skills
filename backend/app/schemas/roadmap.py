from __future__ import annotations

from pydantic import BaseModel, Field


class RoadmapDimension(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    score: int = Field(ge=0, le=100)
    maxScore: int = Field(ge=1, le=100)
    level: str = Field(min_length=1, max_length=20)


class RoadmapRecommendRequest(BaseModel):
    dimensions: list[RoadmapDimension] = Field(min_length=1)
    overallLevel: str = Field(min_length=1, max_length=20)
    totalScore: int = Field(ge=0)
    maxScore: int = Field(ge=1)


class RoadmapCourse(BaseModel):
    course: str
    priority: int
    reason: str
    estimatedWeeks: int


class RoadmapRecommendResponse(BaseModel):
    success: bool
    roadmap: list[RoadmapCourse] = []
    summary: str = ""
    diagnostic: dict = {}
    error: str | None = None
