from unittest.mock import MagicMock
from uuid import uuid4

from fastapi.testclient import TestClient

from app.api import diagnostics as diagnostics_api
from app.core.auth import get_current_user
from app.schemas.diagnostics import DiagnosticCreate, DimensionScore
from app.services.diagnostic_service import DiagnosticService


def test_post_diagnostics_returns_201(client: TestClient) -> None:
    user_id = str(uuid4())
    qid = str(uuid4())
    new_id = str(uuid4())

    repo = MagicMock()
    repo.questionnaire_exists.return_value = True
    repo.insert_diagnostic.return_value = new_id

    def _fake_user() -> dict:
        return {"user_id": user_id, "email": "user@example.com", "metadata": {}}

    def _fake_service() -> DiagnosticService:
        return DiagnosticService(repo)

    app = client.app
    app.dependency_overrides[get_current_user] = _fake_user
    app.dependency_overrides[diagnostics_api.get_diagnostic_service] = _fake_service

    payload = {
        "questionnaire_id": qid,
        "dimension_scores": [{"name": "communication", "value": 5}],
        "answers": ["answer one"],
    }
    response = client.post("/api/v1/diagnostics", json=payload)
    assert response.status_code == 201
    body = response.json()
    assert body["diagnostic_result_id"] == new_id
    assert "X-Request-Id" in response.headers


def test_post_diagnostics_validation_error_400(client: TestClient) -> None:
    user_id = str(uuid4())

    def _fake_user() -> dict:
        return {"user_id": user_id, "email": "user@example.com", "metadata": {}}

    app = client.app
    app.dependency_overrides[get_current_user] = _fake_user

    response = client.post(
        "/api/v1/diagnostics",
        json={
            "questionnaire_id": str(uuid4()),
            "dimension_scores": [],
            "answers": ["x"],
        },
    )
    assert response.status_code == 400
    err = response.json()["error"]
    assert err["code"] == "invalid_payload"
    assert err["request_id"]


def test_get_diagnostics_not_found(client: TestClient) -> None:
    user_id = str(uuid4())

    repo = MagicMock()
    repo.get_latest_for_user.return_value = None

    def _fake_user() -> dict:
        return {"user_id": user_id, "email": "user@example.com", "metadata": {}}

    def _fake_service() -> DiagnosticService:
        return DiagnosticService(repo)

    app = client.app
    app.dependency_overrides[get_current_user] = _fake_user
    app.dependency_overrides[diagnostics_api.get_diagnostic_service] = _fake_service

    response = client.get(f"/api/v1/diagnostics/{user_id}")
    assert response.status_code == 404
    err = response.json()["error"]
    assert err["code"] == "diagnostic_not_found"
