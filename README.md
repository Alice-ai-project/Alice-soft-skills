# Alice - Plataforma de Desarrollo de Soft Skills

Plataforma interactiva para el diagnóstico, entrenamiento y desarrollo de habilidades blandas (soft skills). Combina una entrevista diagnóstica conversacional con un asistente avatarizado, recomendaciones personalizadas basadas en RAG, y un catálogo de cursos enfocados en competencias clave.

## Arquitectura del proyecto

```
├── backend/                  # API REST (FastAPI - Python 3.11)
│   ├── app/
│   │   ├── api/             # Endpoints
│   │   ├── core/            # Configuración y utilidades
│   │   ├── models/          # Modelos de base de datos
│   │   ├── schemas/         # Esquemas Pydantic
│   │   └── main.py          # Punto de entrada de la API
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                 # Cliente web (HTML5 + Vanilla JS + Tailwind CSS)
│   ├── css/
│   ├── js/
│   ├── index.html
│   └── Dockerfile
├── docs/                     # Material de cursos en PDF
├── scripts/                  # Utilidades (sincronización con GitHub, etc.)
├── docker-compose.yml        # Orquestación de servicios
└── .env.example              # Plantilla de variables de entorno
```

## Tecnologías

| Componente   | Tecnología                         |
|-------------|-----------------------------------|
| Frontend    | HTML5, JavaScript Vanilla, Tailwind CSS, Nginx |
| Backend     | Python 3.11, FastAPI, Uvicorn      |
| Base de datos | PostgreSQL 16                     |
| Automatización IA | n8n                           |
| Contenedores | Docker + Docker Compose           |

## Requisitos previos

- [Docker](https://docs.docker.com/get-docker/) (v24 o superior)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2 o superior)
- Git

## Primeros pasos

### 1. Clonar el repositorio

```bash
git clone https://github.com/Alice-ai-project/Alice-soft-skills.git
cd Alice-soft-skills
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` si es necesario. Los valores por defecto funcionan para desarrollo local:

```env
POSTGRES_DB=alice_db
POSTGRES_USER=alice_user
POSTGRES_PASSWORD=alice_password
N8N_HOST=localhost
N8N_WEBHOOK_URL=http://localhost:5678/
```

### 3. Levantar los servicios

```bash
docker compose up --build
```

Esto inicia los cuatro servicios:
- **`alice-frontend`** → http://localhost:8080
- **`alice-backend`** → http://localhost:8000
- **`alice-db`** → PostgreSQL en puerto 5432
- **`alice-n8n`** → http://localhost:5678

### 4. Verificar que todo funciona

```bash
# Health check del backend
curl http://localhost:8000/health
# → {"status":"ok"}
```

Abre http://localhost:8080 en tu navegador para ver la interfaz.

## Servicios

### Frontend (`localhost:8080`)
Interfaz web que incluye la entrevista diagnóstica con avatar interactivo y visualización de cursos.

### Backend API (`localhost:8000`)
API REST construida con FastAPI. Documentación interactiva disponible en:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Base de datos (`localhost:5432`)
PostgreSQL 16 con las tablas del dominio de soft skills (usuarios, diagnósticos, cursos, progreso).

### n8n (`localhost:5678`)
Plataforma de automatización de flujos de trabajo que orquesta la lógica de IA:
- Entrevista diagnóstica conversacional
- Generación de recomendaciones vía RAG con pgvector
- Prompts y reglas de conversación

## Comandos útiles

```bash
# Iniciar servicios en segundo plano
docker compose up --build -d

# Ver logs
docker compose logs -f

# Detener servicios
docker compose down

# Detener y eliminar volúmenes (borra datos de BD)
docker compose down -v

# Reconstruir un servicio específico
docker compose build backend
```

## Estructura de ramas

- `main` — Rama principal
- `develop` — Integración de características
- `feature/*` — Ramas de características activas

## Licencia

Este proyecto es de uso interno y académico.
