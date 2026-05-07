from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Alice API"
    app_version: str = "0.2.0"

    database_url: str = "postgresql://alice_user:alice_password@db:5432/alice_db"
    n8n_webhook_url: str = "http://n8n:5678/webhook/alice-diagnostic"

    rag_collection_name: str = "softskills_docs"
    rag_top_k: int = 4

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
