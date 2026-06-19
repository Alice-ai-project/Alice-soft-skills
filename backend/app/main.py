from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.diagnostics import router as diagnostics_router
from app.api.endpoints import profiles, courses
from app.core.errors import AppError, app_error_handler, http_exception_handler, validation_exception_handler
from app.core.request_id import RequestIdMiddleware
from app.core.supabase_client import supabase_client, supabase_auth_client

app = FastAPI(
    title="Alice API",
    version="1.0.0",
    description="Backend service for Alice soft-skills platform.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
app.include_router(profiles.router, prefix="/api/v1/profiles", tags=["Profiles"])
app.include_router(courses.router, prefix="/api/v1/courses", tags=["Courses"])


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/supabase/health", tags=["Supabase"])
def supabase_health() -> dict[str, str]:
    return {
        "supabase": "configured" if supabase_client else "not configured",
        "supabase_auth": "configured" if supabase_auth_client else "not configured",
    }
