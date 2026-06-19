import pytest

from app.modules.diagnosis.scoring import compute_dimension_scores, dominant_dimension
from app.modules.diagnosis.types import AnswerOptionDef, DimensionDef, QuestionDef, QuestionnaireConfig


def _q_config_two_dims() -> QuestionnaireConfig:
    return QuestionnaireConfig(
        id="unit_test_q",
        title="Unit test questionnaire",
        disclaimer="Disclaimer de prueba.",
        dimensions=(
            DimensionDef("dim_a", "Dimensión A", ""),
            DimensionDef("dim_b", "Dimensión B", ""),
            DimensionDef("dim_c", "Dimensión C", ""),
        ),
        questions=(
            QuestionDef(
                "q1",
                "Primera",
                (
                    AnswerOptionDef(
                        "o1",
                        "Opción 1",
                        {"dim_a": 2.0, "dim_b": 1.0, "dim_c": 0.5},
                    ),
                ),
            ),
            QuestionDef(
                "q2",
                "Segunda",
                (
                    AnswerOptionDef(
                        "o2",
                        "Opción 2",
                        {"dim_a": 1.0, "dim_b": 3.0, "dim_c": 1.5},
                    ),
                ),
            ),
        ),
        interpretation_placeholder_by_dominant={
            "dim_a": "Interp A",
            "dim_b": "Interp B",
            "dim_c": "Interp C",
        },
        recommendations_placeholder_by_dominant={
            "dim_a": ("rec_a",),
            "dim_b": ("rec_b",),
            "dim_c": ("rec_c",),
        },
    )


def test_compute_dimension_scores_sums_weights() -> None:
    q = _q_config_two_dims()
    answers = [("q1", "o1"), ("q2", "o2")]
    scores = compute_dimension_scores(q, answers)
    assert scores == {"dim_a": 3.0, "dim_b": 4.0, "dim_c": 2.0}


def test_dominant_dimension_picks_highest() -> None:
    q = _q_config_two_dims()
    assert dominant_dimension(q, {"dim_a": 1.0, "dim_b": 9.0, "dim_c": 2.0}) == "dim_b"


def test_dominant_dimension_tie_breaks_by_declaration_order() -> None:
    q = _q_config_two_dims()
    assert dominant_dimension(q, {"dim_a": 5.0, "dim_b": 5.0, "dim_c": 5.0}) == "dim_a"
    assert dominant_dimension(q, {"dim_a": 2.0, "dim_b": 2.0, "dim_c": 3.0}) == "dim_c"


def test_compute_dimension_scores_invalid_option_raises() -> None:
    q = _q_config_two_dims()
    with pytest.raises(ValueError, match="invalid_option"):
        compute_dimension_scores(q, [("q1", "no_existe")])


def test_compute_dimension_scores_unknown_question_raises() -> None:
    q = _q_config_two_dims()
    with pytest.raises(ValueError, match="unknown_question"):
        compute_dimension_scores(q, [("q99", "o1")])
