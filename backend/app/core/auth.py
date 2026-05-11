from typing import Any

from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.supabase_client import supabase_auth_client

# Bearer token security scheme
security_scheme = HTTPBearer()


def _get_value(source: Any, key: str) -> Any:
    if isinstance(source, dict):
        return source.get(key)
    return getattr(source, key, None)


def _require_supabase_auth_client():
    if supabase_auth_client is None:
        raise HTTPException(status_code=503, detail="Supabase auth is not configured")
    return supabase_auth_client


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security_scheme),
) -> dict[str, Any]:
    """
    Validate a Supabase access token and extract user information.

    Raises HTTPException with 401 status for invalid or missing tokens.
    """
    client = _require_supabase_auth_client()
    token = credentials.credentials

    try:
        response = client.auth.get_user(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = _get_value(response, "user")
    user_id = _get_value(user, "id")
    email = _get_value(user, "email")
    metadata = _get_value(user, "user_metadata") or {}

    if not user_id or not email:
        raise HTTPException(status_code=401, detail="Token missing required claims")

    return {"user_id": user_id, "email": email, "metadata": metadata}
