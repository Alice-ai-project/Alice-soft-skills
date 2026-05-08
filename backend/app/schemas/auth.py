from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegister(BaseModel):
    document: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    document: Optional[str] = None
    username: str
    display_name: str
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True
