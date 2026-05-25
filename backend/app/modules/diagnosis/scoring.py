"""
Cálculo de puntuaciones a partir de respuestas y definición del cuestionario.

La lógica es deliberadamente simple (suma ponderada por dimensión) para poder sustituir
por un modelo acordado con psicometría / producto sin tocar el flujo HTTP.
"""

from app.modules.diagnosis.types import QuestionnaireConfig


def compute_dimension_scores(
    questionnaire: QuestionnaireConfig,
    answers: list[tuple[str, str]],
) -> dict[str, float]:
    """Suma los pesos por dimensión según las opciones elegidas."""
    scores = {d.id: 0.0 for d in questionnaire.dimensions}
    by_qid = {q.id: q for q in questionnaire.questions}

    for question_id, option_id in answers:
        question = by_qid.get(question_id)
        if question is None:
            raise ValueError("unknown_question")
        chosen = next((o for o in question.options if o.id == option_id), None)
        if chosen is None:
            raise ValueError("invalid_option")
        for dim_id, weight in chosen.weights.items():
            if dim_id in scores:
                scores[dim_id] += weight

    return scores


def dominant_dimension(
    questionnaire: QuestionnaireConfig,
    scores: dict[str, float],
) -> str:
    """Dimensión con mayor puntuación; empate por orden de declaración en questionnaire.dimensions."""
    if not questionnaire.dimensions:
        return ""
    best_id = questionnaire.dimensions[0].id
    best_val = scores.get(best_id, 0.0)
    for dim in questionnaire.dimensions[1:]:
        v = scores.get(dim.id, 0.0)
        if v > best_val:
            best_val = v
            best_id = dim.id
    return best_id


def dimension_labels(questionnaire: QuestionnaireConfig) -> dict[str, str]:
    return {d.id: d.label for d in questionnaire.dimensions}
