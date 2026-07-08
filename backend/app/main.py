from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from app.api.admin import router as admin_router
from app.api.auth import router as auth_router
from app.api.diagnostics import router as diagnostics_router
from app.api.endpoints import profiles, courses, chat as chat_endpoint, roadmap as roadmap_endpoint
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
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://167.233.41.7:3000",
        "http://167.233.41.7",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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
app.include_router(chat_endpoint.router, prefix="/api/v1/chat", tags=["Chat"])
app.include_router(roadmap_endpoint.router, prefix="/api/v1/roadmap", tags=["Roadmap"])
app.include_router(admin_router)


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/supabase/health", tags=["Supabase"])
def supabase_health() -> dict[str, str]:
    return {
        "supabase": "configured" if supabase_client else "not configured",
        "supabase_auth": "configured" if supabase_auth_client else "not configured",
    }
