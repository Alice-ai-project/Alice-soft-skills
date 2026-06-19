from dataclasses import dataclass, field
from typing import Mapping


@dataclass(frozen=True)
class DimensionDef:
    """Definición declarativa de una dimensión conductual (etiqueta educativa, no instrumento clínico)."""

    id: str
    label: str
    description: str


@dataclass(frozen=True)
class AnswerOptionDef:
    """Opción de respuesta con aportes por dimensión (pesos configurables, reemplazables por producto)."""

    id: str
    label: str
    weights: Mapping[str, float]


@dataclass(frozen=True)
class QuestionDef:
    id: str
    text: str
    options: tuple[AnswerOptionDef, ...]


@dataclass(frozen=True)
class QuestionnaireConfig:
    """Paquete completo de contenido del cuestionario: dimensiones, ítems y textos placeholder."""

    id: str
    title: str
    disclaimer: str
    dimensions: tuple[DimensionDef, ...]
    questions: tuple[QuestionDef, ...]
    interpretation_placeholder_by_dominant: Mapping[str, str]
    recommendations_placeholder_by_dominant: Mapping[str, tuple[str, ...]]


@dataclass
class DiagnosisSessionState:
    questionnaire_id: str
    answers: list[tuple[str, str]] = field(default_factory=list)
