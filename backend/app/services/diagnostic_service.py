from __future__ import annotations

import logging
import os
from uuid import UUID

import httpx

from app.core.errors import DomainError, NotFoundError
from app.repositories.diagnostic_repository import DiagnosticRepository
from app.schemas.diagnostics import DiagnosticCreate, DiagnosticCreatedRead, DiagnosticResultRead, DimensionScore

logger = logging.getLogger(__name__)


class DiagnosticService:
    def __init__(self, repository: DiagnosticRepository) -> None:
        self._repo = repository

    async def create_diagnostic(self, user_id: str, payload: DiagnosticCreate) -> DiagnosticCreatedRead:
        qid = str(payload.questionnaire_id)
        self._repo.ensure_profile(user_id)
        if not self._repo.questionnaire_exists(qid):
            raise DomainError("invalid_questionnaire", "Questionnaire does not exist")

        scores = [s.model_dump() for s in payload.dimension_scores]
        diagnostic_id = self._repo.insert_diagnostic(user_id, qid, scores, payload.answers)

        await self._notify_integration(
            diagnostic_result_id=diagnostic_id,
            user_id=user_id,
            questionnaire_id=qid,
        )
        return DiagnosticCreatedRead(diagnostic_result_id=UUID(diagnostic_id))

    def get_diagnostic_for_user(self, requester_id: str, target_user_id: str) -> DiagnosticResultRead:
        if requester_id != target_user_id:
            raise NotFoundError(
                "diagnostic_not_found",
                "No diagnostic was found for this user",
            )
        row = self._repo.get_latest_for_user(target_user_id)
        if row is None:
            raise NotFoundError(
                "diagnostic_not_found",
                "No diagnostic was found for this user",
            )
        scores_raw = row.get("scores") or []
        dimension_scores: list[DimensionScore] = []
        if isinstance(scores_raw, list):
            for item in scores_raw:
                if isinstance(item, dict) and "name" in item and "value" in item:
                    dimension_scores.append(DimensionScore(name=str(item["name"]), value=int(item["value"])))
        answers_raw = row.get("answers") or []
        answers: list[str] = [str(a) for a in answers_raw] if isinstance(answers_raw, list) else []

        return DiagnosticResultRead(
            diagnostic_result_id=UUID(str(row["id"])),
            user_id=UUID(str(row["user_id"])),
            questionnaire_id=UUID(str(row["questionnaire_id"])),
            dimension_scores=dimension_scores,
            answers=answers,
            created_at=row["created_at"],
        )

    async def _notify_integration(
        self,
        *,
        diagnostic_result_id: str,
        user_id: str,
        questionnaire_id: str,
    ) -> None:
        url = os.getenv("N8N_DIAGNOSTIC_WEBHOOK_URL", "").strip()
        if not url:
            return
        body = {
            "event": "diagnostic.created",
            "diagnostic_result_id": diagnostic_result_id,
            "user_id": user_id,
            "questionnaire_id": questionnaire_id,
        }
        try:
            async with httpx.AsyncClient(timeout=httpx.Timeout(5.0)) as client:
                response = await client.post(url, json=body)
                response.raise_for_status()
        except Exception:
            logger.warning("n8n webhook failed", exc_info=True)
