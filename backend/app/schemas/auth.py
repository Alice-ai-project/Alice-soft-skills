from pydantic import BaseModel, EmailStr
from pydantic import Field


class AuthLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class AuthUserRead(BaseModel):
    user_id: str
    email: EmailStr
    first_name: str | None = None
    last_name: str | None = None
    role: str | None = None


class AuthSessionRead(BaseModel):
    access_token: str | None = None
    refresh_token: str | None = None
    token_type: str = "bearer"
    expires_in: int | None = None
    user: AuthUserRead
    email_confirmation_required: bool = False


class AuthMeResponse(BaseModel):
    user_id: str
    email: EmailStr
    first_name: str | None = None
    last_name: str | None = None
    role: str | None = None


class AuthRefresh(BaseModel):
    refresh_token: str
