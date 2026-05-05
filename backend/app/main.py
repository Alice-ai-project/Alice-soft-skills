from fastapi import FastAPI

from .core.supabase_client import supabase_client

app = FastAPI(
    title="Alice API",
    version="0.1.0",
    description="Backend service for Alice soft-skills platform.",
)


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/supabase/health", tags=["Supabase"])
def supabase_health() -> dict[str, str]:
    return {"supabase": "configured" if supabase_client else "not configured"}
