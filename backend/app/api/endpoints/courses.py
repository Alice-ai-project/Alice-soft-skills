from fastapi import APIRouter, HTTPException, Query
from ...core.supabase_client import supabase
from ...schemas.course import Course, LearningPath
from ...core.rag_service import RAGService
from typing import List
from uuid import UUID

router = APIRouter()

@router.get("/", response_model=List[Course])
def list_courses():
    response = supabase.table("courses").select("*").execute()
    return response.data

@router.get("/rag")
def query_course_rag(course_name: str = Query(..., description="Name of the course"), query: str = Query("empatía", description="Query to search within docs")):
    try:
        rag = RAGService()
        return rag.query_rag_content(course_name, query)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/{profile_id}", response_model=List[LearningPath])
def get_user_learning_path(profile_id: UUID):
    # Join with courses table
    response = supabase.table("learning_paths").select("*, course:courses(*)").eq("profile_id", str(profile_id)).execute()
    return response.data

