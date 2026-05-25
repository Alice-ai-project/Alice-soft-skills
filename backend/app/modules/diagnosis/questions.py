"""
Contenido parametrizable del diagnóstico conductual.

IMPORTANTE (producto / cumplimiento):
- No es PDA, DISC ni ningún instrumento psicométrico oficial.
- Las dimensiones, ítems, pesos e interpretaciones son PLACEHOLDER para desarrollo;
  deben sustituirse por parámetros validados por el equipo de producto / asesoría pertinente.

Para cambiar el cuestionario: edita DEFAULT_QUESTIONNAIRE o registra otro en QUESTIONNAIRES_BY_ID.
"""

from app.modules.diagnosis.types import (
    AnswerOptionDef,
    DimensionDef,
    QuestionDef,
    QuestionnaireConfig,
)

# Dimensiones de ejemplo: nombres genéricos orientativos (no categorías normadas).
_DIMENSIONS: tuple[DimensionDef, ...] = (
    DimensionDef(
        id="enfoque_personas",
        label="Orientación a personas y colaboración",
        description="Tendencia observable hacia la coordinación, escucha y clima en equipo (indicador educativo).",
    ),
    DimensionDef(
        id="enfoque_resultados",
        label="Orientación a resultados y estructura",
        description="Tendencia observable hacia la planificación, priorización y cierre de tareas (indicador educativo).",
    ),
    DimensionDef(
        id="enfoque_ajuste",
        label="Orientación al análisis y ajuste",
        description="Tendencia observable hacia la reflexión, el feedback y la mejora continua (indicador educativo).",
    ),
)

_DEFAULT_DISCLAIMER = (
    "Este cuestionario es una herramienta educativa interna de Alice. "
    "No constituye evaluación clínica ni sustituye instrumentos psicométricos homologados."
)

# Pesos por opción: valores ilustrativos; el equipo de producto debe entregar la matriz definitiva.
_QUESTIONS: tuple[QuestionDef, ...] = (
    QuestionDef(
        id="q1",
        text="Ante un desacuerdo fuerte en el equipo, ¿qué te resulta más natural?",
        options=(
            AnswerOptionDef(
                "q1_a",
                "Buscar entender las posturas y facilitar un espacio de diálogo.",
                {"enfoque_personas": 2.0, "enfoque_resultados": 0.5, "enfoque_ajuste": 1.0},
            ),
            AnswerOptionDef(
                "q1_b",
                "Proponer un plan claro y plazos para salir del bloqueo.",
                {"enfoque_personas": 0.5, "enfoque_resultados": 2.0, "enfoque_ajuste": 1.0},
            ),
            AnswerOptionDef(
                "q1_c",
                "Revisar datos, supuestos y criterios antes de decidir.",
                {"enfoque_personas": 1.0, "enfoque_resultados": 1.0, "enfoque_ajuste": 2.0},
            ),
        ),
    ),
    QuestionDef(
        id="q2",
        text="Cuando recibes feedback crítico sobre tu trabajo, lo más cercano a tu reacción habitual es:",
        options=(
            AnswerOptionDef(
                "q2_a",
                "Agradecer y pedir ejemplos concretos para entender el impacto en otros.",
                {"enfoque_personas": 2.0, "enfoque_resultados": 0.5, "enfoque_ajuste": 1.5},
            ),
            AnswerOptionDef(
                "q2_b",
                "Traducirlo en acciones y fechas para corregir el rumbo.",
                {"enfoque_personas": 0.5, "enfoque_resultados": 2.0, "enfoque_ajuste": 1.0},
            ),
            AnswerOptionDef(
                "q2_c",
                "Analizar si el criterio es consistente y qué aprendizaje extraigo.",
                {"enfoque_personas": 1.0, "enfoque_resultados": 1.0, "enfoque_ajuste": 2.0},
            ),
        ),
    ),
    QuestionDef(
        id="q3",
        text="Bajo mucha presión y con varias prioridades, sueles:",
        options=(
            AnswerOptionDef(
                "q3_a",
                "Alinear expectativas con quienes dependen del entregable.",
                {"enfoque_personas": 2.0, "enfoque_resultados": 1.0, "enfoque_ajuste": 1.0},
            ),
            AnswerOptionDef(
                "q3_b",
                "Ordenar por impacto y cerrar lo crítico primero.",
                {"enfoque_personas": 0.5, "enfoque_resultados": 2.5, "enfoque_ajuste": 1.0},
            ),
            AnswerOptionDef(
                "q3_c",
                "Revisar supuestos y recortar alcance con criterio explícito.",
                {"enfoque_personas": 1.0, "enfoque_resultados": 1.5, "enfoque_ajuste": 2.0},
            ),
        ),
    ),
)

_INTERPRETATION_PLACEHOLDER: dict[str, str] = {
    "enfoque_personas": (
        "Perfil dominante orientado a personas (placeholder): sueles privilegiar acuerdos, "
        "alineación y clima. En rutas de aprendizaje conviene balancear con herramientas de "
        "priorización y negociación de alcance."
    ),
    "enfoque_resultados": (
        "Perfil dominante orientado a resultados (placeholder): sueles empujar cierre, claridad "
        "y ejecución. Conviene reforzar escucha activa y gestión de tensiones interpersonales."
    ),
    "enfoque_ajuste": (
        "Perfil dominante orientado al ajuste (placeholder): sueles reflexionar, sistematizar y "
        "mejorar procesos. Conviene practicar decisiones con información incompleta y timeboxing."
    ),
}

_RECOMMENDATIONS_PLACEHOLDER: dict[str, tuple[str, ...]] = {
    "enfoque_personas": (
        "Módulo sugerido (placeholder): feedback no violento en equipos remotos.",
        "Práctica sugerida (placeholder): facilitación de reuniones con agenda y acuerdos explícitos.",
    ),
    "enfoque_resultados": (
        "Módulo sugerido (placeholder): priorización tipo RICE/WSJF adaptada a tu contexto.",
        "Práctica sugerida (placeholder): definición de criterios de 'terminado' con stakeholders.",
    ),
    "enfoque_ajuste": (
        "Módulo sugerido (placeholder): retrospectivas accionables y experimentos pequeños.",
        "Práctica sugerida (placeholder): límites de tiempo para análisis y decisión.",
    ),
}

DEFAULT_QUESTIONNAIRE = QuestionnaireConfig(
    id="alice_behavior_v0_placeholder",
    title="Diagnóstico conductual educativo (placeholder)",
    disclaimer=_DEFAULT_DISCLAIMER,
    dimensions=_DIMENSIONS,
    questions=_QUESTIONS,
    interpretation_placeholder_by_dominant=_INTERPRETATION_PLACEHOLDER,
    recommendations_placeholder_by_dominant=_RECOMMENDATIONS_PLACEHOLDER,
)

QUESTIONNAIRES_BY_ID: dict[str, QuestionnaireConfig] = {
    DEFAULT_QUESTIONNAIRE.id: DEFAULT_QUESTIONNAIRE,
}


def get_questionnaire(questionnaire_id: str | None) -> QuestionnaireConfig:
    if questionnaire_id is None or questionnaire_id == "":
        return DEFAULT_QUESTIONNAIRE
    return QUESTIONNAIRES_BY_ID.get(questionnaire_id, DEFAULT_QUESTIONNAIRE)
