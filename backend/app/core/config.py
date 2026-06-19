import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Estas variables deben estar en el archivo .env
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_key: str = ""

    class Config:
        env_file = ".env"
        case_sensitive = False

# Instancia global de configuración
settings = Settings()

# Validación simple para ayudar al diagnóstico
if not settings.supabase_url:
    print(" ADVERTENCIA: SUPABASE_URL no detectada. Revisa tu archivo .env")
if not settings.supabase_service_key and not settings.supabase_anon_key:
    print(" ADVERTENCIA: No se detectaron llaves de Supabase. Revisa tu archivo .env")
