from fastapi import APIRouter, HTTPException
from uuid import UUID

from ...core.supabase_client import supabase
from ...schemas.profile import Profile, ProfileUpdate

router = APIRouter()


def _get_client():
    if supabase is None:
        raise HTTPException(status_code=503, detail="Database client not configured")
    return supabase


@router.get("/{profile_id}", response_model=Profile)
def get_profile(profile_id: UUID) -> Profile:
    client = _get_client()
    try:
        response = client.table("profiles").select("*").eq("id", str(profile_id)).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Database error: {exc}")

    if not response.data:
        raise HTTPException(status_code=404, detail="Profile not found")

    return response.data[0]


@router.put("/{profile_id}", response_model=Profile)
def update_profile(profile_id: UUID, profile_update: ProfileUpdate) -> Profile:
    client = _get_client()
    payload = profile_update.model_dump(exclude_unset=True)
    try:
        response = client.table("profiles").update(payload).eq("id", str(profile_id)).execute()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Database error: {exc}")

    if not response.data:
        raise HTTPException(status_code=400, detail="Update failed or profile not found")

    return response.data[0]
