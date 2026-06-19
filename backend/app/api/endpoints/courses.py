from fastapi import APIRouter, HTTPException
from ...core.supabase_client import supabase
from ...schemas.course import Course, LearningPath
from typing import List
from uuid import UUID
from datetime import datetime

router = APIRouter()

COURSES_SEED = [
    {"id": "11111111-1111-1111-1111-111111111101", "title": "Comunicación Asertiva", "description": "Desarrolla habilidades para expresar ideas de forma clara y respetuosa", "created_at": "2025-01-01T00:00:00Z"},
    {"id": "11111111-1111-1111-1111-111111111102", "title": "Construcción Colectiva", "description": "Aprende a construir soluciones en equipo de manera colaborativa", "created_at": "2025-01-01T00:00:00Z"},
    {"id": "11111111-1111-1111-1111-111111111103", "title": "Desarrollo de Sí Mismo", "description": "Explora tu potencial y defines tu camino de crecimiento personal", "created_at": "2025-01-01T00:00:00Z"},
    {"id": "11111111-1111-1111-1111-111111111104", "title": "Flexibilidad y Adaptabilidad", "description": "Cultiva la capacidad de ajustarte a cambios y nuevas situaciones", "created_at": "2025-01-01T00:00:00Z"},
    {"id": "11111111-1111-1111-1111-111111111105", "title": "Gestión del Tiempo", "description": "Domina técnicas para organizar y priorizar tus actividades", "created_at": "2025-01-01T00:00:00Z"},
    {"id": "11111111-1111-1111-1111-111111111106", "title": "Gestión Emocional", "description": "Aprende a identificar y manejar tus emociones de manera efectiva", "created_at": "2025-01-01T00:00:00Z"},
    {"id": "11111111-1111-1111-1111-111111111107", "title": "Inteligencia Emocional", "description": "Desarrolla la capacidad de reconocer y gestionar emociones propias y ajenas", "created_at": "2025-01-01T00:00:00Z"},
    {"id": "11111111-1111-1111-1111-111111111108", "title": "Liderazgo", "description": "Inspira y guía a otros hacia el logro de objetivos comunes", "created_at": "2025-01-01T00:00:00Z"},
    {"id": "11111111-1111-1111-1111-111111111109", "title": "Resistencia a la Frustración", "description": "Fortalece tu capacidad de enfrentar obstáculos sin desanimarte", "created_at": "2025-01-01T00:00:00Z"},
    {"id": "11111111-1111-1111-1111-111111111110", "title": "Resolución de Conflictos", "description": "Adquiere herramientas para mediar y resolver diferencias constructivamente", "created_at": "2025-01-01T00:00:00Z"},
]

@router.get("/", response_model=List[Course])
def list_courses():
    try:
        response = supabase.table("courses").select("*").execute()
        if response.data:
            return response.data
    except Exception as e:
        print(f"Error fetching courses from Supabase: {e}")
    return COURSES_SEED

@router.get("/user/{profile_id}", response_model=List[LearningPath])
def get_user_learning_path(profile_id: UUID):
    try:
        response = supabase.table("learning_paths").select("*, course:courses(*)").eq("profile_id", str(profile_id)).execute()
        return response.data
    except Exception as e:
        print(f"Error fetching learning paths: {e}")
        return []
