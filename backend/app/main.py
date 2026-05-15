from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.endpoints import profiles, courses

app = FastAPI(
    title="Alice API",
    version="0.1.0",
    description="Backend service for Alice soft-skills platform.",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(profiles.router, prefix="/profiles", tags=["Profiles"])
app.include_router(courses.router, prefix="/courses", tags=["Courses"])

@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}
