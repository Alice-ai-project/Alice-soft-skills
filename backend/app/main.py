from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.diagnostics import router as diagnostics_router
from app.core.errors import AppError, app_error_handler, http_exception_handler, validation_exception_handler
from app.core.request_id import RequestIdMiddleware
from .core.supabase_client import supabase_auth_client, supabase_client

app = FastAPI(
    title="Alice API",
    version="0.1.0",
    description="Backend service for Alice soft-skills platform.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RequestIdMiddleware)

app.add_exception_handler(AppError, app_error_handler)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)

app.include_router(auth_router)
app.include_router(diagnostics_router, prefix="/api/v1")


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/supabase/health", tags=["Supabase"])
def supabase_health() -> dict[str, str]:
    return {
        "supabase": "configured" if supabase_client else "not configured",
        "supabase_auth": "configured" if supabase_auth_client else "not configured",
    }
