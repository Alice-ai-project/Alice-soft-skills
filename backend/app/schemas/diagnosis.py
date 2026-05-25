from pydantic import BaseModel, Field


class DiagnosisOptionOut(BaseModel):
    id: str
    label: str


class DiagnosisQuestionOut(BaseModel):
    id: str
    text: str
    options: list[DiagnosisOptionOut]


class DiagnosisStartRequest(BaseModel):
    questionnaire_id: str | None = Field(
        default=None,
        description="ID del cuestionario configurado; por defecto usa el placeholder interno.",
    )


class DiagnosisStartResponse(BaseModel):
    session_id: str
    questionnaire_id: str
    questionnaire_title: str
    disclaimer: str
    first_question: DiagnosisQuestionOut | None


class DiagnosisAnswerRequest(BaseModel):
    session_id: str
    question_id: str
    option_id: str


class DiagnosisAnswerResponse(BaseModel):
    session_id: str
    next_question: DiagnosisQuestionOut | None
    finished: bool


class DimensionScoreOut(BaseModel):
    dimension_id: str
    label: str
    score: float


class DiagnosisResultResponse(BaseModel):
    session_id: str
    questionnaire_id: str
    dimension_scores: list[DimensionScoreOut]
    dominant_dimension_id: str
    dominant_dimension_label: str
    interpretation_placeholder: str
    recommendations_placeholder: list[str]
    disclaimer: str
