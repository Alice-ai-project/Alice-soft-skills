from fastapi import APIRouter, HTTPException, Depends
from ...core.supabase_client import supabase
from ...schemas.profile import Profile
from uuid import UUID

router = APIRouter()

@router.get("/{profile_id}", response_model=Profile)
def get_profile(profile_id: UUID):
    response = supabase.table("profiles").select("*").eq("profiles_id", str(profile_id)).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    data = response.data[0]
    data["id"] = data.get("profiles_id")
    return data

@router.put("/{profile_id}", response_model=Profile)
def update_profile(profile_id: UUID, profile_update: dict):
    # Ensure we don't try to update profiles_id with a different type if id was passed
    if "id" in profile_update:
        profile_update["profiles_id"] = str(profile_update.pop("id"))
        
    response = supabase.table("profiles").update(profile_update).eq("profiles_id", str(profile_id)).execute()
    
    if not response.data:
        raise HTTPException(status_code=400, detail="Update failed")
        
    data = response.data[0]
    data["id"] = data.get("profiles_id")
    return data

