from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.supabase_client import supabase

from app.api.auth import router as auth_router

app = FastAPI(
    title="Alice API",
    version="0.1.0",
    description="Backend service for Alice soft-skills platform.",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router)

@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}

@app.get("/supabase-health", tags=["Health"])
def supabase_health_check():
    try:
        # Simple query to check connection
        response = supabase.table("_any_table_or_just_auth").select("count", count="exact").limit(1).execute()
        return {"status": "connected", "data": "Supabase client initialized"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
