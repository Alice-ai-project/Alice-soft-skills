from __future__ import annotations

import logging
import os
from typing import Annotated, Any

import httpx
from fastapi import APIRouter, Depends

from app.core.auth import get_current_user
from app.core.errors import InfrastructureError
from app.schemas.roadmap import RoadmapRecommendRequest, RoadmapRecommendResponse

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/recommend", response_model=RoadmapRecommendResponse)
async def recommend_roadmap(
    payload: RoadmapRecommendRequest,
    current_user: Annotated[dict, Depends(get_current_user)],
) -> RoadmapRecommendResponse:
    webhook_url = os.getenv("N8N_ROADMAP_WEBHOOK_URL", "").strip()

    if not webhook_url:
        raise InfrastructureError(
            "ROADMAP_SERVICE_NOT_CONFIGURED",
            "Roadmap recommendation service is not configured.",
        )

    body = {
        "dimensions": [d.model_dump() for d in payload.dimensions],
        "overallLevel": payload.overallLevel,
        "totalScore": payload.totalScore,
        "maxScore": payload.maxScore,
    }

    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(30.0)) as client:
            response = await client.post(webhook_url, json=body)
            response.raise_for_status()
            data = response.json()
    except httpx.TimeoutException:
        logger.warning("n8n roadmap webhook timed out")
        raise InfrastructureError(
            "ROADMAP_SERVICE_TIMEOUT",
            "La generación del roadmap tardó demasiado. Inténtalo de nuevo.",
        )
    except Exception:
        logger.warning("n8n roadmap webhook failed", exc_info=True)
        raise InfrastructureError(
            "ROADMAP_SERVICE_UNAVAILABLE",
            "El servicio de roadmap no está disponible ahora mismo. Inténtalo más tarde.",
        )

    return RoadmapRecommendResponse(
        success=data.get("success", False),
        roadmap=data.get("roadmap", []),
        summary=data.get("summary", ""),
        diagnostic=data.get("diagnostic", {}),
        error=data.get("error"),
    )
