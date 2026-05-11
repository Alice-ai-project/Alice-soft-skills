from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Deben coincidir con los nombres de tu .env
    supabase_url: str
    supabase_annon_key: str
    supabase_service_key: str
    supabase_password: str
    n8n_host: str
    n8n_webhook_url: str
    rag_collection_name: str
    rag_top_k: int  # Nota que este es un número

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
        case_sensitive=False # <-- Esto hace que SUPABASE_URL sirva para supabase_url
    )

settings = Settings()