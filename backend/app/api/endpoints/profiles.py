from fastapi import APIRouter, HTTPException, Depends
from ...core.supabase_client import supabase
from ...schemas.profile import Profile
from uuid import UUID

router = APIRouter()

@router.get("/{profile_id}", response_model=Profile)
def get_profile(profile_id: UUID):
    response = supabase.table("profiles").select("*").eq("id", str(profile_id)).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    return response.data[0]

@router.put("/{profile_id}", response_model=Profile)
def update_profile(profile_id: UUID, profile_update: dict):
    response = supabase.table("profiles").update(profile_update).eq("id", str(profile_id)).execute()
    
    if not response.data:
        raise HTTPException(status_code=400, detail="Update failed")
        
    return response.data[0]
