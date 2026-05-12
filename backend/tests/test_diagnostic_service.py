from unittest.mock import MagicMock
from uuid import UUID, uuid4

import pytest

from app.core.errors import DomainError, NotFoundError
from app.schemas.diagnostics import DiagnosticCreate, DimensionScore
from app.services.diagnostic_service import DiagnosticService


@pytest.mark.asyncio
async def test_create_diagnostic_persists_when_questionnaire_exists() -> None:
    repo = MagicMock()
    repo.questionnaire_exists.return_value = True
    new_id = str(uuid4())
    repo.insert_diagnostic.return_value = new_id
    svc = DiagnosticService(repo)
    qid = uuid4()
    payload = DiagnosticCreate(
        questionnaire_id=qid,
        dimension_scores=[DimensionScore(name="communication", value=10)],
        answers=["I prefer async meetings"],
    )
    user_id = str(uuid4())
    out = await svc.create_diagnostic(user_id, payload)
    repo.ensure_profile.assert_called_once_with(user_id)
    repo.insert_diagnostic.assert_called_once()
    assert out.diagnostic_result_id == UUID(new_id)


@pytest.mark.asyncio
async def test_create_diagnostic_rejects_unknown_questionnaire() -> None:
    repo = MagicMock()
    repo.questionnaire_exists.return_value = False
    svc = DiagnosticService(repo)
    qid = uuid4()
    payload = DiagnosticCreate(
        questionnaire_id=qid,
        dimension_scores=[DimensionScore(name="communication", value=10)],
        answers=["ok"],
    )
    with pytest.raises(DomainError) as exc:
        await svc.create_diagnostic(str(uuid4()), payload)
    assert exc.value.code == "invalid_questionnaire"


def test_get_diagnostic_denies_cross_user() -> None:
    repo = MagicMock()
    svc = DiagnosticService(repo)
    with pytest.raises(NotFoundError) as exc:
        svc.get_diagnostic_for_user("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")
    assert exc.value.code == "diagnostic_not_found"


def test_get_diagnostic_not_found_when_empty() -> None:
    repo = MagicMock()
    repo.get_latest_for_user.return_value = None
    svc = DiagnosticService(repo)
    uid = str(uuid4())
    with pytest.raises(NotFoundError) as exc:
        svc.get_diagnostic_for_user(uid, uid)
    assert exc.value.code == "diagnostic_not_found"
