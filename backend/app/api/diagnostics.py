from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, status

from app.core.auth import get_current_user
from app.core.errors import InfrastructureError
from app.core.supabase_client import supabase_client
from app.repositories.diagnostic_repository import DiagnosticRepository
from app.schemas.diagnostics import DiagnosticCreate, DiagnosticCreatedRead, DiagnosticResultRead
from app.services.diagnostic_service import DiagnosticService

router = APIRouter(prefix="/diagnostics", tags=["diagnostics"])


def get_diagnostic_repository() -> DiagnosticRepository:
    if supabase_client is None:
        raise InfrastructureError("supabase_not_configured", "Database is not configured")
    return DiagnosticRepository(supabase_client)


def get_diagnostic_service(
    repo: Annotated[DiagnosticRepository, Depends(get_diagnostic_repository)],
) -> DiagnosticService:
    return DiagnosticService(repo)


@router.post(
    "",
    response_model=DiagnosticCreatedRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_diagnostic(
    payload: DiagnosticCreate,
    user: Annotated[dict, Depends(get_current_user)],
    service: Annotated[DiagnosticService, Depends(get_diagnostic_service)],
) -> DiagnosticCreatedRead:
    return await service.create_diagnostic(user["user_id"], payload)


@router.get(
    "/{user_id}",
    response_model=DiagnosticResultRead,
)
def get_diagnostic(
    user_id: UUID,
    user: Annotated[dict, Depends(get_current_user)],
    service: Annotated[DiagnosticService, Depends(get_diagnostic_service)],
) -> DiagnosticResultRead:
    return service.get_diagnostic_for_user(user["user_id"], str(user_id))
