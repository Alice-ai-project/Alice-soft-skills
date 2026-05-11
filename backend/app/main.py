from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# 1. Importamos el router que acabamos de actualizar
from app.api.routes import interview 
from app.core.config import settings

app = FastAPI(
    title="Alice AI - Soft Skills Tutor",
    description="Backend para el diagnóstico y entrenamiento de habilidades blandas",
    version="1.0.0"
)

# Configuración de CORS (Vital para que el Frontend se conecte)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En producción cambia esto por tu dominio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Registramos el router de la entrevista
# Esto hace que todos los endpoints en interview.py empiecen con /api/v1/interview
app.include_router(interview.router, prefix="/api/v1")

@app.get("/")
async def root():
    """Ruta de salud para verificar que el servidor está arriba"""
    return {"message": "Alice AI API is running", "status": "ok"}