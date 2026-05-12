from __future__ import annotations

import logging
from typing import Any

from supabase import Client

from app.core.errors import InfrastructureError

logger = logging.getLogger(__name__)


class DiagnosticRepository:
    """Supabase persistence for diagnostics (service-role client)."""

    def __init__(self, client: Client) -> None:
        self._client = client

    def ensure_profile(self, user_id: str) -> None:
        try:
            self._client.table("profiles").upsert({"id": user_id}).execute()
        except Exception as exc:
            logger.exception("ensure_profile failed")
            raise InfrastructureError("database_error", "Could not persist user profile") from exc

    def questionnaire_exists(self, questionnaire_id: str) -> bool:
        try:
            result = (
                self._client.table("questionnaires")
                .select("id")
                .eq("id", questionnaire_id)
                .limit(1)
                .execute()
            )
        except Exception as exc:
            logger.exception("questionnaire_exists failed")
            raise InfrastructureError("database_error", "Could not validate questionnaire") from exc
        rows = result.data or []
        return len(rows) > 0

    def insert_diagnostic(
        self,
        user_id: str,
        questionnaire_id: str,
        scores: list[dict[str, Any]],
        answers: list[str],
    ) -> str:
        payload = {
            "user_id": user_id,
            "questionnaire_id": questionnaire_id,
            "scores": scores,
            "answers": answers,
        }
        try:
            result = self._client.table("diagnostic_results").insert(payload).execute()
        except Exception as exc:
            logger.exception("insert_diagnostic failed")
            raise InfrastructureError("database_error", "Could not save diagnostic result") from exc
        rows = result.data or []
        if not rows or "id" not in rows[0]:
            raise InfrastructureError("database_error", "Unexpected empty response when saving diagnostic")
        return str(rows[0]["id"])

    def get_latest_for_user(self, user_id: str) -> dict[str, Any] | None:
        try:
            result = (
                self._client.table("diagnostic_results")
                .select("id, user_id, questionnaire_id, scores, answers, created_at")
                .eq("user_id", user_id)
                .order("created_at", desc=True)
                .limit(1)
                .execute()
            )
        except Exception as exc:
            logger.exception("get_latest_for_user failed")
            raise InfrastructureError("database_error", "Could not load diagnostic result") from exc
        rows = result.data or []
        if not rows:
            return None
        return rows[0]
