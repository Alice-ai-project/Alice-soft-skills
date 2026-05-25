from typing import Annotated

from fastapi import APIRouter, Body, HTTPException, status

from app.modules.diagnosis.service import get_diagnosis_service
from app.modules.diagnosis.types import QuestionDef
from app.schemas.diagnosis import (
    DiagnosisAnswerRequest,
    DiagnosisAnswerResponse,
    DiagnosisOptionOut,
    DiagnosisQuestionOut,
    DiagnosisResultResponse,
    DiagnosisStartRequest,
    DiagnosisStartResponse,
    DimensionScoreOut,
)

router = APIRouter(prefix="/diagnosis", tags=["Diagnosis"])


def _question_to_out(q: QuestionDef) -> DiagnosisQuestionOut:
    return DiagnosisQuestionOut(
        id=q.id,
        text=q.text,
        options=[DiagnosisOptionOut(id=o.id, label=o.label) for o in q.options],
    )


@router.post("/start", response_model=DiagnosisStartResponse)
def start_diagnosis(
    payload: Annotated[
        DiagnosisStartRequest,
        Body(default_factory=DiagnosisStartRequest),
    ],
) -> DiagnosisStartResponse:
    svc = get_diagnosis_service()
    session_id, questionnaire, first = svc.start(payload.questionnaire_id)
    return DiagnosisStartResponse(
        session_id=session_id,
        questionnaire_id=questionnaire.id,
        questionnaire_title=questionnaire.title,
        disclaimer=questionnaire.disclaimer,
        first_question=_question_to_out(first) if first else None,
    )


@router.post("/answer", response_model=DiagnosisAnswerResponse)
def answer_diagnosis(payload: DiagnosisAnswerRequest) -> DiagnosisAnswerResponse:
    svc = get_diagnosis_service()
    try:
        next_q, finished = svc.submit_answer(
            payload.session_id,
            payload.question_id,
            payload.option_id,
        )
    except KeyError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sesión no encontrada.")
    except ValueError as e:
        code = str(e)
        if code == "session_already_finished":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="La sesión ya está finalizada.",
            )
        if code == "question_mismatch":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La pregunta no corresponde al turno actual.",
            )
        if code == "invalid_option":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Opción no válida para esta pregunta.",
            )
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Solicitud inválida.") from e

    return DiagnosisAnswerResponse(
        session_id=payload.session_id,
        next_question=_question_to_out(next_q) if next_q else None,
        finished=finished,
    )


@router.get("/result/{session_id}", response_model=DiagnosisResultResponse)
def get_diagnosis_result(session_id: str) -> DiagnosisResultResponse:
    svc = get_diagnosis_service()
    try:
        result = svc.build_result(session_id)
    except KeyError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sesión no encontrada.")
    except ValueError as e:
        if str(e) == "session_not_finished":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="El diagnóstico aún no está completo.",
            )
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se pudo calcular el resultado.") from e

    dimension_scores = [
        DimensionScoreOut(
            dimension_id=dim_id,
            label=result.score_labels.get(dim_id, dim_id),
            score=score,
        )
        for dim_id, score in result.scores.items()
    ]

    return DiagnosisResultResponse(
        session_id=session_id,
        questionnaire_id=result.questionnaire_id,
        dimension_scores=dimension_scores,
        dominant_dimension_id=result.dominant_dimension_id,
        dominant_dimension_label=result.dominant_dimension_label,
        interpretation_placeholder=result.interpretation_placeholder,
        recommendations_placeholder=result.recommendations_placeholder,
        disclaimer=result.disclaimer,
    )
