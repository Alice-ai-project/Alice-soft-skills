import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.modules.diagnosis.service import DiagnosisService


@pytest.fixture
def diagnosis_service() -> DiagnosisService:
    return DiagnosisService()


@pytest.fixture
def client(diagnosis_service: DiagnosisService, monkeypatch: pytest.MonkeyPatch) -> TestClient:
    monkeypatch.setattr(
        "app.api.routes.diagnosis.get_diagnosis_service",
        lambda: diagnosis_service,
    )
    return TestClient(app)
