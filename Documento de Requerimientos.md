# Documento de Requerimientos del Proyecto

## 1. Información General
- **Nombre del Proyecto:** Alice
- **Objetivo Principal:** Automatizar la evaluación y el entrenamiento de habilidades blandas (soft skills) mediante retroalimentación inmediata y personalizada.
- **Equipo de Desarrollo:** 5 integrantes (incluyendo un AI Engineer).

## 2. Definición del Problema
- Evaluación manual de soft skills sin inmediatez ni personalización.
- Falta de herramientas para medir progreso y generar rutas de mejora basadas en datos.

## 3. Requisitos Funcionales (RF)
### 3.1 Gestión de Usuarios y Seguridad
- **Perfiles:** Empleado (usuario final) y Administrador (gestor).
- **Autenticación:** Implementación inicial con Supabase Auth y posterior migración a Google OAuth.

### 3.2 Panel Administrativo (CMS)
- **Gestión de Contenido:** CRUD de cursos y preguntas de cuestionarios en la base de datos.
- **Monitoreo:** Visualización de reportes de desempeño detallados por empleado.

### 3.3 Diagnóstico y Evaluación Inicial
- **Pruebas:** Cuestionarios iniciales para identificar fortalezas y debilidades.
- **Persistencia:** Almacenamiento de resultados en la base de datos a través de FastAPI.

### 3.4 Automatización y Personalización (IA)
- **Disparador:** Webhook desde FastAPI hacia n8n al guardar resultados.
- **Generación de Ruta:** n8n procesa los datos y actualiza el roadmap del usuario mediante IA.

### 3.5 Interfaz de Progreso y Gamificación (UX)
- **Roadmap Visual:** Visualización del camino de aprendizaje para el empleado.
- **Habilitación Secuencial:** Cuestionarios obligatorios por módulo para desbloquear el siguiente paso.

### 3.6 Tutor de Entrenamiento IA (Avatar D-ID)
- **Funciones:** Simulación de entrevistas, vocalización y resolución de casos en tiempo real.
- **Interacción:** Verbal (micrófono) mediante agentes de streaming de D-ID.
- **Memoria:** Volátil, limitada exclusivamente a la sesión activa (borrón y cuenta nueva).

### 3.7 Reportes y Analítica
- **Análisis Detallado:** Reportes cualitativos (tono, claridad, resolución de conflictos) generados por IA.

## 4. Requisitos No Funcionales (RNF)
- **Arquitectura:** Basada en eventos y microservicios comunicados vía Webhooks.
- **Infraestructura:** Entorno estandarizado mediante contenedores Docker.

## 5. Arquitectura Técnica (Stack)
- **Frontend:** HTML5, JavaScript (Vanilla JS), Tailwind CSS.
- **Backend:** FastAPI (Python).
- **Persistencia:** PostgreSQL (Instancia local y Supabase).
- **Automatización:** n8n (Instancia local).
- **Infraestructura:** Docker & Docker Compose.
- **Interfaz de IA:** Agentes de D-ID (API de streaming).
