from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None
    content_url: Optional[str] = None
    duration_minutes: Optional[int] = None
    category: Optional[str] = None

class Course(CourseBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class LearningPath(BaseModel):
    id: UUID
    profile_id: UUID
    course_id: UUID
    status: str
    is_enabled: bool
    assigned_at: datetime
    course: Optional[Course] = None

    class Config:
        from_attributes = True
