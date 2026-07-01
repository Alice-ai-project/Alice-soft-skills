# Alice - Plataforma de Desarrollo de Soft Skills

Alice es una plataforma web interactiva para el **diagnóstico, entrenamiento y desarrollo de habilidades blandas (soft skills)** en contextos empresariales y académicos.

## Arquitectura

```
Alice-soft-skills/
├── backend/                    # API REST (Python 3.11 / FastAPI)
│   ├── app/
│   │   ├── main.py            # Entrada FastAPI
│   │   ├── api/               # Endpoints REST
│   │   │   ├── auth.py        # Autenticación (login/me/refresh)
│   │   │   ├── diagnostics.py # API de diagnósticos
│   │   │   └── endpoints/     # Endpoints de cursos, perfiles, chat y roadmap
│   │   ├── core/              # Configuración y utilidades
│   │   ├── schemas/           # Modelos Pydantic
│   │   ├── services/          # Lógica de negocio
│   │   └── repositories/      # Acceso a datos
│   ├── Dockerfile
│   └── requirements.txt
├── frontend-next/              # Frontend principal (Next.js 16 / React 19)
│   ├── src/
│   │   ├── app/               # App Router (rutas de páginas)
│   │   ├── components/        # Componentes React
│   │   ├── services/          # Servicios API
│   │   ├── types/             # Tipos TypeScript
│   │   ├── utils/             # Utilidades
│   │   └── data/              # Datos estáticos
│   ├── Dockerfile
│   └── package.json
├── frontend/                   # Frontend legacy (HTML/JS vanilla)
├── n8n-workflows/              # Workflows de automatización
│   ├── roadmap-recommender.json         # Workflow original (HTTP Request a OpenAI)
│   └── roadmap-recommender-agent.json   # Workflow con AI Agent (activo)
├── supabase/                   # Migraciones de base de datos
└── docker-compose.yml          # Orquestación de servicios
```

## Stack Tecnológico

| Componente | Tecnología |
|---|---|
| **Frontend** | Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 |
| **Backend** | Python 3.11 + FastAPI + Uvicorn |
| **Base de datos** | PostgreSQL 16 + Supabase |
| **IA / Automatización** | n8n + OpenAI GPT-4o-mini |
| **Contenedores** | Docker + Docker Compose |

## Funcionalidades

### Autenticación
- Login con JWT de Supabase
- Endpoints protegidos con Bearer token
- Manejo de sesiones con refresh token

### Dashboard de Usuario
- Panel principal con avatar de IA
- Vista de cursos disponibles
- Chat con asistente de IA
- Configuración de perfil
- Estadísticas de progreso

### Sistema de Diagnóstico
- Cuestionario de 24 preguntas (6 dimensiones × 4 preguntas)
- Basado en el modelo de Inteligencia Emocional de Daniel Goleman
- Dimensiones: Autoconocimiento, Autorregulación, Motivación, Empatía, Habilidades Sociales, Conexión Emocional
- Scoring de 1-4 por pregunta (máximo 96 puntos)
- Interpretación automática: Muy Baja, Baja, Media, Alta

### Roadmap Personalizado con IA
- Generación de ruta de aprendizaje vía n8n AI Agent + OpenAI GPT-4o-mini
- Recomendaciones basadas en resultados del diagnóstico
- Cursos priorizados con razón y semanas estimadas
- Posibilidad de regenerar el roadmap desde la interfaz

### Cursos de Soft Skills
- 9 cursos interactivos con evaluaciones:
  - Comunicación Asertiva
  - Construcción Colectiva
  - Desarrollo de Sí Mismo
  - Flexibilidad y Adaptabilidad
  - Gestión del Tiempo
  - Gestión Emocional
  - Liderazgo
  - Resistencia a la Frustración
  - Resolución de Conflictos
- Cada curso incluye: contenido, recursos PDF, videos y evaluación

## Instalación

### Requisitos previos
- Docker v24+
- Docker Compose v2+
- Git

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/Alice-ai-project/Alice-soft-skills.git
cd Alice-soft-skills

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 3. Levantar servicios
docker compose up --build

# 4. Verificar
curl http://localhost:8000/health
```

### URLs de los servicios

| Servicio | URL |
|----------|-----|
| Frontend Next.js | http://localhost:3000 |
| Frontend Legacy | http://localhost:8080 |
| Backend API | http://localhost:8000 |
| n8n | http://localhost:5678 |
| PostgreSQL | localhost:5433 |

## Endpoints API

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/refresh` - Refrescar token
- `GET /auth/me` - Obtener usuario actual

### Diagnósticos
- `POST /api/v1/diagnostics` - Crear diagnóstico
- `GET /api/v1/diagnostics/{user_id}` - Obtener diagnóstico de usuario

### Roadmap
- `POST /api/v1/roadmap/recommend` - Generar roadmap personalizado con IA

### Cursos y Perfiles
- `GET /api/v1/courses/` - Listar cursos
- `GET /api/v1/courses/user/{profile_id}` - Ruta de aprendizaje
- `GET /api/v1/profiles/{profile_id}` - Obtener perfil
- `PUT /api/v1/profiles/{profile_id}` - Actualizar perfil

### Chat
- `POST /api/v1/chat/message` - Enviar mensaje al asistente de IA

### Salud
- `GET /health` - Health check
- `GET /supabase/health` - Estado de conexión Supabase

## Variables de Entorno

```env
# Base de datos
POSTGRES_DB=alice_db
POSTGRES_USER=alice_user
POSTGRES_PASSWORD=alice_password

# Supabase
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key

# n8n
N8N_HOST=localhost
N8N_WEBHOOK_URL=http://localhost:5678/
N8N_ROADMAP_WEBHOOK_URL=http://n8n:5678/webhook/roadmap-recommend-agent

# OpenAI (requerido para n8n AI Agent)
OPENAI_API_KEY=sk-your-openai-api-key
```

## Desarrollo

### Comandos útiles

```bash
# Levantar en segundo plano
docker compose up --build -d

# Ver logs de un servicio específico
docker compose logs -f frontend-next
docker compose logs -f backend

# Detener servicios
docker compose down

# Detener y borrar datos
docker compose down -v

# Reconstruir solo un servicio
docker compose up -d --build backend
docker compose up -d --build frontend-next
```

## Workflow de n8n

### Workflow Activo: AI Agent (`roadmap-recommender-agent.json`)

```
Webhook POST → Validate and Parse → Check Error → Prepare Prompt → AI Agent → Parse Response → Send Response
                                           ↑                                    ↓
                                    Error Response              [OpenAI Chat Model] + [Code Tool]
```

### Workflow Original (`roadmap-recommender.json`)

```
Webhook POST → Validate and Parse → Check Error → Prepare Prompt → OpenAI API (HTTP) → Parse Response → Send Response
```

### Para importar el workflow:
1. Abrir n8n en `http://localhost:5678`
2. Ir a **Workflows** → **Import from File**
3. Seleccionar el archivo JSON de `n8n-workflows/`
4. Configurar la credencial de OpenAI (ya existe como "OpenAI account")
5. Activar el workflow

## Licencia

Proyecto privado - Alice AI Project
