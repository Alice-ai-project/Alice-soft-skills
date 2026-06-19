# Alice - Plataforma de Desarrollo de Soft Skills

Alice es una plataforma web interactiva para el **diagnóstico, entrenamiento y desarrollo de habilidades blandas (soft skills)** en contextos empresariales y académicos.

## Arquitectura

```
Alice-soft-skills/
├── backend/                    # API REST (Python 3.11 / FastAPI)
│   ├── app/
│   │   ├── api/               # Endpoints REST
│   │   │   ├── auth.py        # Autenticación (login/register/me)
│   │   │   ├── diagnostics.py # API de diagnósticos
│   │   │   └── endpoints/     # Endpoints de cursos y perfiles
│   │   ├── core/              # Configuración y utilidades
│   │   │   ├── config.py      # Settings con pydantic-settings
│   │   │   ├── supabase_client.py # Cliente Supabase
│   │   │   ├── auth.py        # Middleware de autenticación JWT
│   │   │   ├── errors.py      # Manejo centralizado de errores
│   │   │   └── request_id.py  # Middleware de request tracking
│   │   ├── modules/           # Módulos de dominio
│   │   │   └── diagnosis/     # Sistema de diagnóstico
│   │   ├── schemas/           # Modelos Pydantic
│   │   ├── services/          # Lógica de negocio
│   │   └── repositories/      # Acceso a datos
│   └── tests/                 # Suite de pruebas
├── frontend/                   # Cliente web SPA
│   ├── css/                   # Estilos modulares
│   ├── js/                    # Arquitectura MVC
│   │   ├── models/            # Modelos de estado
│   │   ├── views/             # Renderizado del DOM
│   │   └── controllers/       # Orquestación
│   └── assets/                # Recursos estáticos
├── supabase/                   # Migraciones de base de datos
├── docs/                      # Documentación y cursos PDF
└── scripts/                   # Scripts de utilidad
```

## Stack Tecnológico

| Componente | Tecnología |
|---|---|
| **Frontend** | HTML5 + JavaScript ES Modules + CSS3 |
| **Backend** | Python 3.11 + FastAPI + Uvicorn |
| **Base de datos** | Supabase (PostgreSQL + Auth + RLS) |
| **Automatización** | n8n (orquestación de workflows IA) |
| **Contenedores** | Docker + Docker Compose |

## Funcionalidades

### Autenticación
- Registro de usuarios con email y contraseña
- Login con JWT de Supabase
- Endpoints protegidos con Bearer token
- Manejo de sesiones

### Dashboard
- Panel principal con estadísticas
- Vista de cursos disponibles (8 cursos de soft skills)
- Conversación con avatar de IA
- Estadísticas de progreso
- Configuración de usuario

### Sistema de Diagnóstico
- Cuestionarios parametrizables
- Scoring por dimensiones conductuales
- Interpretación y recomendaciones personalizadas
- Persistencia de resultados

### Cursos de Soft Skills
- 10 cursos en PDF:
  - Comunicación Asertiva
  - Construcción Colectiva
  - Desarrollo de Sí Mismo
  - Flexibilidad y Adaptabilidad
  - Gestión del Tiempo
  - Gestión Emocional
  - Inteligencia Emocional (Goleman)
  - Liderazgo
  - Resistencia a la Frustración
  - Resolución de Conflictos

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
# Editar .env con tus credenciales de Supabase

# 3. Levantar servicios
docker compose up --build

# 4. Verificar
curl http://localhost:8000/health
# Abrir http://localhost:8080 en el navegador
```

## Endpoints API

### Autenticación
- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Iniciar sesión
- `GET /auth/me` - Obtener usuario actual

### Diagnósticos
- `GET /api/v1/diagnostics/courses` - Listar cursos
- `GET /api/v1/diagnostics/questionnaires/{course_id}` - Obtener cuestionarios
- `POST /api/v1/diagnostics/submit` - Enviar respuestas

### Cursos y Perfiles
- `GET /api/v1/courses/` - Listar cursos
- `GET /api/v1/courses/user/{profile_id}` - Ruta de aprendizaje
- `GET /api/v1/profiles/{profile_id}` - Obtener perfil
- `PUT /api/v1/profiles/{profile_id}` - Actualizar perfil

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
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key

# n8n
N8N_HOST=localhost
N8N_WEBHOOK_URL=http://localhost:5678/

# RAG
RAG_COLLECTION_NAME=softskills_docs
RAG_TOP_K=4
```

## Desarrollo

### Comandos útiles

```bash
# Levantar en segundo plano
docker compose up --build -d

# Ver logs
docker compose logs -f

# Detener servicios
docker compose down

# Detener y borrar datos
docker compose down -v

# Reconstruir solo backend
docker compose build backend
```

### Ejecutar tests

```bash
# Dentro del contenedor backend
docker compose exec backend pytest

# O localmente
cd backend
pip install -r requirements.txt
pytest
```

## Estructura de Ramas

- `main` - Producción estable
- `develop` - Desarrollo principal
- `feature/combined` - Versión combinada de todas las features
- `feature/cursos` - Sistema de cursos y dashboard
- `feature/diagnosis` - Módulo de diagnóstico
- `feature/diagnostics-completion` - API de diagnósticos completa
- `feature/login-register` - Sistema de autenticación
- `feature/conexionSupabase` - Integración con Supabase

## Documentación

- `definicion_conceptual.md` - Qué es y qué no es Alice
- `metodologia.md` - Metodología del producto
- `docs/diagnostico_guia.md` - Instrumento de diagnóstico Goleman
- `docs/preguntas_cursos.md` - Preguntas por curso
- `backlog.md` - Product Backlog completo
- `Documento de Requerimientos.md` - Requisitos del proyecto

## Licencia

Proyecto privado - Alice AI Project
