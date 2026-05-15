from pydantic import BaseModel, EmailStr
from typing import Optional, Any
from uuid import UUID
from datetime import datetime

class ProfileBase(BaseModel):
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    biografia: Optional[str] = None
    soft_skill_goal: Optional[str] = None
    preferences: Optional[dict[str, Any]] = None

class ProfileCreate(ProfileBase):
    id: UUID
    email: EmailStr
    username: str

class Profile(ProfileBase):
    id: UUID
    email: EmailStr
    username: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
