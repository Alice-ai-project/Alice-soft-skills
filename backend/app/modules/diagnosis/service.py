from dataclasses import dataclass
from uuid import uuid4

from app.modules.diagnosis.questions import get_questionnaire
from app.modules.diagnosis.scoring import (
    compute_dimension_scores,
    dimension_labels,
    dominant_dimension,
)
from app.modules.diagnosis.types import DiagnosisSessionState, QuestionDef, QuestionnaireConfig


@dataclass
class DiagnosisResult:
    questionnaire_id: str
    scores: dict[str, float]
    score_labels: dict[str, str]
    dominant_dimension_id: str
    dominant_dimension_label: str
    interpretation_placeholder: str
    recommendations_placeholder: list[str]
    disclaimer: str


class DiagnosisService:
    """Orquestación en memoria: sesiones, validación de turnos y cierre con scoring."""

    def __init__(self) -> None:
        self._sessions: dict[str, DiagnosisSessionState] = {}
        self._questionnaires: dict[str, QuestionnaireConfig] = {}

    def start(self, questionnaire_id: str | None = None) -> tuple[str, QuestionnaireConfig, QuestionDef | None]:
        q = get_questionnaire(questionnaire_id)
        session_id = str(uuid4())
        self._sessions[session_id] = DiagnosisSessionState(questionnaire_id=q.id)
        self._questionnaires[session_id] = q
        first = q.questions[0] if q.questions else None
        return session_id, q, first

    def _get_session(self, session_id: str) -> tuple[DiagnosisSessionState, QuestionnaireConfig]:
        state = self._sessions.get(session_id)
        if state is None:
            raise KeyError("session_not_found")
        q = self._questionnaires.get(session_id) or get_questionnaire(state.questionnaire_id)
        return state, q

    def submit_answer(
        self,
        session_id: str,
        question_id: str,
        option_id: str,
    ) -> tuple[QuestionDef | None, bool]:
        state, q = self._get_session(session_id)
        total = len(q.questions)
        if len(state.answers) >= total:
            raise ValueError("session_already_finished")

        expected = q.questions[len(state.answers)]
        if expected.id != question_id:
            raise ValueError("question_mismatch")

        if not any(o.id == option_id for o in expected.options):
            raise ValueError("invalid_option")

        state.answers.append((question_id, option_id))
        finished = len(state.answers) >= total
        next_q = None if finished else q.questions[len(state.answers)]
        return next_q, finished

    def build_result(self, session_id: str) -> DiagnosisResult:
        state, q = self._get_session(session_id)
        if len(state.answers) != len(q.questions):
            raise ValueError("session_not_finished")

        scores = compute_dimension_scores(q, state.answers)
        dom_id = dominant_dimension(q, scores)
        labels = dimension_labels(q)

        interpretation = q.interpretation_placeholder_by_dominant.get(
            dom_id,
            "Interpretación placeholder no definida para el perfil dominante.",
        )
        recs = list(q.recommendations_placeholder_by_dominant.get(dom_id, ()))

        return DiagnosisResult(
            questionnaire_id=q.id,
            scores=scores,
            score_labels=labels,
            dominant_dimension_id=dom_id,
            dominant_dimension_label=labels.get(dom_id, dom_id),
            interpretation_placeholder=interpretation,
            recommendations_placeholder=recs,
            disclaimer=q.disclaimer,
        )


_diagnosis_service: DiagnosisService | None = None


def get_diagnosis_service() -> DiagnosisService:
    global _diagnosis_service
    if _diagnosis_service is None:
        _diagnosis_service = DiagnosisService()
    return _diagnosis_service
