from fastapi import APIRouter, HTTPException
from ...core.supabase_client import supabase
from ...schemas.course import Course, LearningPath
from typing import List
from uuid import UUID

router = APIRouter()

@router.get("/", response_model=List[Course])
def list_courses():
    response = supabase.table("courses").select("*").execute()
    return response.data

@router.get("/user/{profile_id}", response_model=List[LearningPath])
def get_user_learning_path(profile_id: UUID):
    # Join with courses table
    response = supabase.table("learning_paths").select("*, course:courses(*)").eq("profile_id", str(profile_id)).execute()
    return response.data
