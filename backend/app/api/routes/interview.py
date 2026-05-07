from uuid import uuid4

from fastapi import APIRouter

from app.schemas.interview import (
    InterviewAnswerRequest,
    InterviewAnswerResponse,
    InterviewStartResponse,
)

router = APIRouter(prefix="/interview", tags=["Interview"])

QUESTIONS = [
    "Cuéntame cómo manejas un conflicto en equipo.",
    "¿Qué haces cuando recibes feedback crítico?",
    "¿Cómo priorizas tareas bajo presión?",
]

_sessions: dict[str, int] = {}


@router.post("/start", response_model=InterviewStartResponse)
def start_interview() -> InterviewStartResponse:
    session_id = str(uuid4())
    _sessions[session_id] = 0
    return InterviewStartResponse(session_id=session_id, first_question=QUESTIONS[0])


@router.post("/answer", response_model=InterviewAnswerResponse)
def submit_answer(payload: InterviewAnswerRequest) -> InterviewAnswerResponse:
    current_index = _sessions.get(payload.session_id, 0) + 1
    _sessions[payload.session_id] = current_index

    finished = current_index >= len(QUESTIONS)
    next_question = None if finished else QUESTIONS[current_index]

    return InterviewAnswerResponse(
        session_id=payload.session_id,
        next_question=next_question,
        finished=finished,
    )
