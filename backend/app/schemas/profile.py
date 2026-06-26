from pydantic import BaseModel
from typing import Optional, Any
from uuid import UUID
from datetime import datetime


class Profile(BaseModel):
    """Mirrors the public.profiles table (id, created_at, updated_at are the only guaranteed columns)."""
    id: UUID
    created_at: datetime
    updated_at: datetime
    # Optional enrichment columns — may not exist in all deployments
    email: Optional[str] = None
    username: Optional[str] = None
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    biografia: Optional[str] = None
    soft_skill_goal: Optional[str] = None
    preferences: Optional[dict[str, Any]] = None

    class Config:
        from_attributes = True


class ProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    biografia: Optional[str] = None
    soft_skill_goal: Optional[str] = None
    preferences: Optional[dict[str, Any]] = None
