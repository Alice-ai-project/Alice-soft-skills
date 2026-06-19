from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


class DimensionScore(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    value: int = Field(ge=0, le=100)

    @field_validator("name")
    @classmethod
    def strip_name(cls, v: str) -> str:
        s = v.strip()
        if not s:
            raise ValueError("name cannot be blank")
        return s


class DiagnosticCreate(BaseModel):
    questionnaire_id: UUID
    dimension_scores: list[DimensionScore] = Field(min_length=1)
    answers: list[str] = Field(min_length=1)

    @field_validator("answers")
    @classmethod
    def answers_non_empty_strings(cls, v: list[str]) -> list[str]:
        out: list[str] = []
        for item in v:
            s = item.strip()
            if not s:
                raise ValueError("answers must contain only non-empty strings")
            out.append(s)
        return out


class DiagnosticCreatedRead(BaseModel):
    diagnostic_result_id: UUID


class DiagnosticResultRead(BaseModel):
    diagnostic_result_id: UUID
    user_id: UUID
    questionnaire_id: UUID
    dimension_scores: list[DimensionScore]
    answers: list[str]
    created_at: datetime
