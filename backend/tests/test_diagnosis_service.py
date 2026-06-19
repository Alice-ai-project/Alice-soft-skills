import pytest

from app.modules.diagnosis.questions import DEFAULT_QUESTIONNAIRE
from app.modules.diagnosis.service import DiagnosisService


def test_start_creates_session_with_first_question() -> None:
    svc = DiagnosisService()
    session_id, questionnaire, first = svc.start(None)
    assert session_id
    assert questionnaire.id == DEFAULT_QUESTIONNAIRE.id
    assert first is not None
    assert first.id == DEFAULT_QUESTIONNAIRE.questions[0].id


def test_answer_stores_response_and_returns_next_question() -> None:
    svc = DiagnosisService()
    session_id, q, first = svc.start(None)
    assert first is not None
    opt0 = first.options[0].id

    next_q, finished = svc.submit_answer(session_id, first.id, opt0)
    assert finished is False
    assert next_q is not None
    assert next_q.id == q.questions[1].id

    q2 = q.questions[1]
    next_q2, finished2 = svc.submit_answer(session_id, q2.id, q2.options[0].id)
    assert finished2 is False
    assert next_q2 is not None
    assert next_q2.id == q.questions[2].id

    with pytest.raises(ValueError, match="question_mismatch"):
        svc.submit_answer(session_id, first.id, opt0)


def test_answer_rejects_wrong_question_order() -> None:
    svc = DiagnosisService()
    session_id, q, first = svc.start(None)
    assert first is not None
    wrong_id = q.questions[1].id
    with pytest.raises(ValueError, match="question_mismatch"):
        svc.submit_answer(session_id, wrong_id, q.questions[1].options[0].id)


def test_answer_rejects_invalid_option() -> None:
    svc = DiagnosisService()
    session_id, _, first = svc.start(None)
    assert first is not None
    with pytest.raises(ValueError, match="invalid_option"):
        svc.submit_answer(session_id, first.id, "opcion_inventada")


def test_build_result_before_completion_raises() -> None:
    svc = DiagnosisService()
    session_id, _, first = svc.start(None)
    assert first is not None
    with pytest.raises(ValueError, match="session_not_finished"):
        svc.build_result(session_id)


def test_build_result_returns_scores_dominant_interpretation_recommendations_disclaimer() -> None:
    svc = DiagnosisService()
    session_id, q, first = svc.start(None)
    assert first is not None

    for question in q.questions:
        current = question
        opt = current.options[0].id
        next_q, finished = svc.submit_answer(session_id, current.id, opt)
        if finished:
            assert next_q is None
            break

    result = svc.build_result(session_id)
    assert result.questionnaire_id == q.id
    assert set(result.scores.keys()) == {d.id for d in q.dimensions}
    assert result.dominant_dimension_id in {d.id for d in q.dimensions}
    assert result.dominant_dimension_label == result.score_labels[result.dominant_dimension_id]
    assert result.interpretation_placeholder
    assert result.interpretation_placeholder == q.interpretation_placeholder_by_dominant[result.dominant_dimension_id]
    assert result.recommendations_placeholder == list(
        q.recommendations_placeholder_by_dominant[result.dominant_dimension_id]
    )
    assert result.disclaimer == q.disclaimer
