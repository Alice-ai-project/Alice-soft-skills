from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.auth import get_current_user
from app.core.supabase_client import supabase_auth_client
from app.schemas.auth import AuthLogin, AuthMeResponse, AuthRegister, AuthSessionRead, AuthUserRead

router = APIRouter(prefix="/auth", tags=["auth"])


def _get_value(source: Any, key: str) -> Any:
    if isinstance(source, dict):
        return source.get(key)
    return getattr(source, key, None)


def _auth_client():
    if supabase_auth_client is None:
        raise HTTPException(status_code=503, detail="Supabase auth is not configured")
    return supabase_auth_client


def _build_user_read(user: Any) -> AuthUserRead:
    metadata = _get_value(user, "user_metadata") or {}
    return AuthUserRead(
        user_id=_get_value(user, "id"),
        email=_get_value(user, "email"),
        first_name=metadata.get("first_name"),
        last_name=metadata.get("last_name"),
    )


def _build_session_read(response: Any) -> AuthSessionRead:
    user = _get_value(response, "user")
    session = _get_value(response, "session")

    if user is None:
        raise HTTPException(status_code=401, detail="Authentication failed")

    return AuthSessionRead(
        access_token=_get_value(session, "access_token"),
        refresh_token=_get_value(session, "refresh_token"),
        expires_in=_get_value(session, "expires_in"),
        user=_build_user_read(user),
        email_confirmation_required=session is None,
    )


@router.post("/login", response_model=AuthSessionRead)
async def login(payload: AuthLogin) -> AuthSessionRead:
    """
    Authenticate an existing user with Supabase Auth.
    """
    try:
        response = _auth_client().auth.sign_in_with_password(
            {"email": payload.email, "password": payload.password}
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    session_read = _build_session_read(response)
    if not session_read.access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email confirmation is required before login",
        )
    return session_read


@router.post("/register", response_model=AuthSessionRead, status_code=status.HTTP_201_CREATED)
async def register(payload: AuthRegister) -> AuthSessionRead:
    """
    Register a user with Supabase Auth.
    """
    try:
        response = _auth_client().auth.sign_up(
            {
                "email": payload.email,
                "password": payload.password,
                "options": {
                    "data": {
                        "first_name": payload.first_name,
                        "last_name": payload.last_name,
                    }
                },
            }
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not register user",
        )

    return _build_session_read(response)


@router.get("/me", response_model=AuthMeResponse)
async def get_current_user_endpoint(user: dict = Depends(get_current_user)) -> AuthMeResponse:
    """
    Get current authenticated user information.

    Requires valid JWT token in Authorization header.
    """
    metadata = user.get("metadata") or {}
    return AuthMeResponse(
        user_id=user["user_id"],
        email=user["email"],
        first_name=metadata.get("first_name"),
        last_name=metadata.get("last_name"),
    )
