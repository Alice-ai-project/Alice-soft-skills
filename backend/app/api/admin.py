from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.core.auth import get_current_user
from app.core.supabase_client import supabase_client

router = APIRouter(prefix="/api/v1/admin", tags=["Admin"])


def _require_admin(current_user: dict[str, Any]) -> dict[str, Any]:
    metadata = current_user.get("metadata") or {}
    if metadata.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


def _require_db() -> Any:
    if supabase_client is None:
        raise HTTPException(status_code=503, detail="Database not configured")
    return supabase_client


class AdminUserRead(BaseModel):
    user_id: str
    email: str
    first_name: str | None = None
    last_name: str | None = None
    role: str | None = None
    created_at: str | None = None
    status: str | None = None


class AdminStatisticsRead(BaseModel):
    total_users: int


@router.get("/users", response_model=list[AdminUserRead])
def list_users(
    current_user: Annotated[dict, Depends(get_current_user)],
) -> list[AdminUserRead]:
    _require_admin(current_user)
    db = _require_db()
    try:
        response = db.auth.admin.list_users()
        # supabase-py v2 may return a list or a paginated response object
        raw_list = response if isinstance(response, list) else getattr(response, "users", []) or []
        users: list[AdminUserRead] = []
        for u in raw_list:
            meta = getattr(u, "user_metadata", {}) or {}
            confirmed_at = getattr(u, "email_confirmed_at", None)
            users.append(
                AdminUserRead(
                    user_id=str(u.id),
                    email=getattr(u, "email", "") or "",
                    first_name=meta.get("first_name"),
                    last_name=meta.get("last_name"),
                    role=meta.get("role", "user"),
                    created_at=str(u.created_at) if getattr(u, "created_at", None) else None,
                    status="active" if confirmed_at else "pending",
                )
            )
        return users
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Failed to fetch users: {exc}") from exc


@router.get("/statistics", response_model=AdminStatisticsRead)
def get_statistics(
    current_user: Annotated[dict, Depends(get_current_user)],
) -> AdminStatisticsRead:
    _require_admin(current_user)
    db = _require_db()
    try:
        response = db.auth.admin.list_users()
        raw_list = response if isinstance(response, list) else getattr(response, "users", []) or []
        return AdminStatisticsRead(total_users=len(raw_list))
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Failed to fetch statistics: {exc}") from exc
