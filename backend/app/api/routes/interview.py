import logging
from uuid import uuid4
import httpx
from fastapi import APIRouter, HTTPException, status
from app.core.config import settings
from app.core.db import get_db_connection

# Importamos los schemas actualizados
from app.schemas.interview import (
    InterviewFullRequest,   # Nueva estructura para recibir todo el transcript
    InterviewResultResponse
)

logger = logging.getLogger(__name__)

# Defino el router. Elimino /start y /answer porque ahora el Front maneja la charla
router = APIRouter(prefix="/interview", tags=["Interview Diagnostic"])

def _process_ai_evaluation(profile_id: str, transcript: str, scores: dict) -> None:
    """
    FUNCIÓN AUXILIAR: Guarda el resultado final en la base de datos.
    Se conecta a 'ai_evaluations' y 'diagnostic_attempts'.
    """
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                # 1. Creamos el registro del intento de diagnóstico
                cur.execute(
                    """
                    INSERT INTO diagnostic_attempts (user_id, total_score)
                    VALUES (%s, %s) RETURNING id
                    """,
                    (profile_id, scores.get("overall", 0))
                )
                
                # 2. Guardamos el análisis detallado de la IA
                cur.execute(
                    """
                    INSERT INTO ai_evaluations (profile_id, raw_transcript, overall_score)
                    VALUES (%s, %s, %s)
                    """,
                    (profile_id, transcript, scores.get("overall", 0))
                )
                conn.commit()
                logger.info(f"Evaluación guardada exitosamente para el usuario {profile_id}")
    except Exception as e:
        logger.error(f"Error guardando en BD: {e}")
        raise HTTPException(status_code=500, detail="Error al persistir la evaluación.")

@router.post(
    "/process",
    response_model=InterviewResultResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Procesar diagnóstico final",
)
def process_full_interview(payload: InterviewFullRequest):
    """
    ESTA ES TU TAREA PRINCIPAL (4-6 Horas):
    1. Recibe el perfil del usuario y todo lo que habló con el avatar.
    2. Valida que el usuario exista (Manejo de error 404).
    3. Envía los datos a n8n para que la IA analice el texto.
    4. Devuelve el resultado inicial al Frontend.
    """
    
    # --- SUBTAREA: Manejar errores comunes (404) ---
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT id FROM profiles WHERE id = %s", (payload.profile_id,))
                if cur.fetchone() is None:
                    raise HTTPException(
                        status_code=404, 
                        detail="El perfil de usuario no existe. Regístrese primero."
                    )
    except HTTPException: raise
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error de conexión con la base de datos.")

    # --- SUBTAREA: Integrar con n8n/IA ---
    # Simulamos que n8n nos devuelve un análisis rápido
    analysis_payload = {
        "user_id": payload.profile_id,
        "content": payload.transcript, # Todo lo que el usuario dijo
        "document_type": payload.document_type_id # Validación del documento
    }

    try:
        # Aquí se dispara el webhook de n8n
        # response = httpx.post(settings.n8n_webhook_url, json=analysis_payload)
        # scores = response.json()
        
        # Simulación de respuesta de IA para la prueba local:
        mock_scores = {"overall": 85, "summary": "Excelente comunicación, pero debe mejorar la dicción."}
        
        # --- SUBTAREA: Guardar respuestas (Persistencia) ---
        _process_ai_evaluation(payload.profile_id, payload.transcript, mock_scores)
        
        return InterviewResultResponse(
            session_id=str(uuid4()),
            is_finished=True,
            overall_score=mock_scores["overall"],
            diagnostic_summary=mock_scores["summary"]
        )

    except Exception as e:
        logger.error(f"Error en el flujo de IA: {e}")
        raise HTTPException(status_code=400, detail="No se pudo procesar el diagnóstico con la IA.")