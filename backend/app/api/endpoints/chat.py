from __future__ import annotations

import logging
import os
from typing import Annotated, Any

import httpx
from fastapi import APIRouter, Depends

from app.core.auth import get_current_user
from app.core.errors import InfrastructureError
from app.schemas.chat import ChatMessageRequest, ChatMessageResponse

logger = logging.getLogger(__name__)

router = APIRouter()


def _extract_reply(data: Any) -> str:
    """Normalize various n8n response shapes into a plain string reply."""
    if isinstance(data, list) and data:
        data = data[0]
    if isinstance(data, dict):
        for key in ("reply", "message", "output", "text", "response"):
            if data.get(key):
                return str(data[key])
    return str(data)


def _extract_conversation_id(data: Any, fallback: str | None) -> str | None:
    if isinstance(data, list) and data:
        data = data[0]
    if isinstance(data, dict):
        return data.get("conversation_id") or data.get("conversationId") or fallback
    return fallback


@router.post("/message", response_model=ChatMessageResponse)
async def chat_message(
    payload: ChatMessageRequest,
    current_user: Annotated[dict, Depends(get_current_user)],
) -> ChatMessageResponse:
    webhook_url = os.getenv("N8N_WEBHOOK_URL", "").strip()

    if not webhook_url:
        raise InfrastructureError(
            "AI_SERVICE_NOT_CONFIGURED",
            "Alice AI service is not configured yet.",
        )

    body = {
        "message": payload.message,
        "user_id": current_user["user_id"],
        "conversation_id": payload.conversation_id,
    }

    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(30.0)) as client:
            response = await client.post(webhook_url, json=body)
            response.raise_for_status()
            data = response.json()
    except httpx.TimeoutException:
        logger.warning("n8n chat webhook timed out")
        raise InfrastructureError(
            "AI_SERVICE_TIMEOUT",
            "Alice tardó demasiado en responder. Inténtalo de nuevo.",
        )
    except Exception:
        logger.warning("n8n chat webhook failed", exc_info=True)
        raise InfrastructureError(
            "AI_SERVICE_UNAVAILABLE",
            "Alice no está disponible ahora mismo. Inténtalo más tarde.",
        )

    return ChatMessageResponse(
        reply=_extract_reply(data),
        conversation_id=_extract_conversation_id(data, payload.conversation_id),
    )
