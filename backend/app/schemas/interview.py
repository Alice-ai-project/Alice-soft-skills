from pydantic import BaseModel, UUID4, Field
from typing import List, Optional
from enum import Enum

# Defino los tipos de documentos válidos para validar con Pydantic (Error 400 si no coincide)
class DocumentTypeEnum(str, Enum):
    national = "document_national"
    foreigner = "document_foreigner"
    employee = "document_employee"
    passport = "passport"
    identity_card = "identity_card"

class InterviewFullRequest(BaseModel):
    profile_id: UUID4 = Field(..., example="550e8400-e29b-41d4-a716-446655440000")
    document_type: DocumentTypeEnum # Valida que sea uno de los strings de la tabla SQL
    transcript: str = Field(..., min_length=10, example="Usuario: Hola. Avatar: Cuéntame de ti...")

class InterviewResultResponse(BaseModel):
    session_id: str
    is_finished: bool
    overall_score: float
    diagnostic_summary: str