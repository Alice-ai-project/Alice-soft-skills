from fastapi import APIRouter

from app.api.routes import diagnosis, interview

api_router = APIRouter()
api_router.include_router(interview.router)
api_router.include_router(diagnosis.router)
