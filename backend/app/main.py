from fastapi import FastAPI

from app.api import api_router
from app.core.config import settings

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Backend service for Alice soft-skills platform.",
)

app.include_router(api_router, prefix="/api")


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}
