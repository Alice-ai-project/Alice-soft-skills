# Product Backlog — Proyecto Alice

## Contexto de planificación
- **Metodología:** Scrum.
- **Duración:** 2 sprints de 15 días calendario.
- **Equipo (5 integrantes):** desarrollo **Backend**, **Frontend** e **IA/n8n + Integración Avatar**.
- **Objetivo MVP:** autenticación, entrevista diagnóstica con avatar, persistencia, automatización de ruta de aprendizaje con RAG, visualización de roadmap, tutor IA por streaming, y panel administrativo básico.

---

## Sprint 1 (Días 1–15) — Fundaciones y Core Conversacional

### Objetivo del Sprint
Dejar operativo el flujo extremo a extremo base: login, entrevista interactiva con avatar, guardado de resultados y disparo de webhook hacia n8n, junto con una primera interfaz navegable y base de CMS.

### Tareas por rol

#### Backend
1. **Configurar autenticación con Supabase Auth (JWT) en FastAPI**  
   Implementar validación de token en backend, middleware/dependencias de seguridad y endpoint `/auth/me` para recuperar perfil autenticado.

2. **Diseñar esquema inicial de base de datos para MVP**  
   Definir modelos/tablas para `users`, `courses`, `questionnaires`, `questions`, `interview_sessions`, `diagnostic_results` y `learning_roadmaps` con migraciones iniciales.

3. **Implementar API de entrevista diagnóstica secuencial (Q&A por turnos)**  
   Crear endpoints para iniciar entrevista, servir preguntas una a una, recibir respuesta de cada turno y calcular puntajes base.

4. **Implementar webhook saliente hacia n8n al finalizar entrevista**  
   Enviar payload normalizado desde FastAPI al webhook de n8n con datos de usuario, respuestas, métricas y timestamp.

5. **Implementar endpoints base para panel administrativo (CRUD cursos y preguntas)**  
   Exponer operaciones CRUD para cursos, cuestionarios y preguntas con controles de rol administrador.

6. **Estandarizar manejo de errores y contratos API**  
   Incorporar esquema de respuestas (`success/error`), validaciones Pydantic y códigos HTTP consistentes para facilitar integración frontend.

#### Frontend
7. **Implementar flujo de login con Supabase en cliente web**  
   Construir pantallas de acceso y persistencia de sesión (token), incluyendo protección de rutas privadas.

8. **Construir UI de entrevista interactiva con avatar (D-ID)**  
   Mostrar opciones de respuesta en pantalla mientras el avatar reproduce la pregunta y capturar respuesta del usuario por turno.

9. **Implementar sincronización Avatar-UI para respuestas**  
   Desarrollar lógica de sincronización entre reproducción de video/stream y habilitación de botones de respuesta para cada pregunta.

10. **Implementar vista básica de roadmap del usuario (placeholder funcional)**  
    Mostrar estado inicial del camino de aprendizaje con datos simulados/primer endpoint real.

11. **Crear base del panel administrativo (listado + formularios CRUD)**  
    Diseñar navegación administrativa y formularios para cursos/preguntas conectados a endpoints backend.

#### IA/n8n
12. **Configurar workflow n8n para recepción de entrevista diagnóstica**  
    Crear flujo con trigger por webhook, validación de payload y almacenamiento de logs de ejecución.

13. **Configurar base vectorial y flujo RAG en Supabase (pgvector)**  
    Cargar documentación de soft-skills, indexarla en pgvector y habilitar consultas desde n8n para enriquecer consejos personalizados.

14. **Diseñar prompts RAG y lógica de entrevistador en n8n**  
    Definir prompts para recuperación contextual + generación de recomendaciones y reglas de comportamiento del entrevistador.

15. **Publicar endpoint de retorno o actualización hacia backend**  
    Configurar paso final del workflow para actualizar roadmap del usuario en la API de FastAPI.

16. **Instrumentar monitoreo básico del flujo automatizado**  
    Definir alertas/seguimiento de errores en n8n (ejecuciones fallidas, reintentos y trazabilidad por usuario).

#### Transversal (equipo)
17. **Definir Definition of Done y checklist de calidad por historia**  
    Alinear criterios de aceptación, pruebas mínimas, revisión de código y documentación antes de cerrar tareas.

18. **Configurar tablero de GitHub Projects y convenciones Scrum**  
    Crear columnas/estados, etiquetas por rol y plantillas de issues para facilitar planificación y seguimiento.

### Milestone Sprint 1 (qué debe estar funcionando)
- Login con Supabase operativo en frontend + validación en backend.
- Entrevista interactiva con avatar funcional (preguntas secuenciales + respuestas por turno).
- Persistencia en PostgreSQL de sesiones y resultados de entrevista.
- Webhook FastAPI → n8n ejecutándose de forma confiable con trazabilidad.
- RAG inicial activo en Supabase pgvector consultado desde n8n para enriquecer consejos.
- Roadmap inicial generado por n8n y disponible en una vista funcional del frontend.

---

## Sprint 2 (Días 16–30) — IA, Analítica y Pulido

### Objetivo del Sprint
Completar las capacidades inteligentes y de experiencia: tutor por streaming D-ID, analítica cualitativa, gamificación del camino y robustez final de plataforma para demo MVP.

### Tareas por rol

#### Backend
1. **Extender modelo de datos para sesiones de tutor IA y analítica**  
   Incorporar entidades para `tutor_sessions`, `interaction_events`, `qualitative_reports` y progreso por módulo.

2. **Implementar API de progreso y desbloqueo secuencial**  
   Exponer reglas para habilitar módulos/cuestionarios según cumplimiento de hitos previos.

3. **Integrar endpoint para recepción de métricas de D-ID**  
   Guardar eventos de sesión (duración, transcripción, señales clave) respetando memoria volátil por sesión activa.

4. **Implementar API de reportes cualitativos por usuario/admin**  
   Entregar reportes por dimensiones (tono, claridad, resolución de conflictos) con filtros y paginación.

5. **Fortalecer seguridad y roles (Empleado/Admin)**  
   Endurecer permisos por endpoint, auditoría básica y validaciones de acceso por recurso.

#### Frontend
6. **Implementar UI final del camino de aprendizaje (roadmap interactivo)**  
   Visualizar progreso por etapas, estados de bloqueo/desbloqueo y recomendaciones generadas.

7. **Integrar experiencia de tutor IA en interfaz**  
   Construir pantalla de sesión de entrenamiento con controles de inicio/fin y estados de streaming.

8. **Agregar dashboard de reportes para administrador**  
   Presentar analítica cualitativa y evolución por empleado con tablas, filtros y visualizaciones simples.

9. **Mejorar UX de feedback inmediato y gamificación**  
   Añadir indicadores de logro, mensajes de progreso y microinteracciones para reforzar engagement.

#### IA/n8n
10. **Integrar workflow de D-ID para sesiones de tutor**  
    Orquestar inicio de sesión, intercambio de eventos y cierre de interacción con backend.

11. **Automatizar generación de reportes cualitativos con IA**  
    Procesar señales de interacción para producir resumen cualitativo accionable por usuario.

12. **Implementar versionado de prompts/reglas de recomendación**  
    Gestionar iteraciones de lógica IA para comparar resultados y mejorar precisión del roadmap.

13. **Añadir mecanismos de resiliencia del flujo n8n**  
    Configurar reintentos, colas/esperas, timeouts y manejo de errores para dependencias externas.

14. **Evaluación de viabilidad para Fine-Tuning del modelo de lenguaje (Opcional)**  
    Investigación técnica de costo, riesgos, datos requeridos y retorno esperado frente a estrategia RAG actual.

#### Transversal (equipo)
15. **Pruebas integrales de flujo MVP de punta a punta**  
    Validar escenario completo: login → entrevista avatar → ruta IA (RAG) → tutor → reporte admin.

16. **Hardening de release y documentación operativa**  
    Consolidar guía de despliegue local, checklist de demo y runbook de incidencias comunes.

### Milestone Sprint 2 (qué debe estar funcionando)
- Tutor IA con streaming D-ID integrado en interfaz y trazabilidad de sesión.
- Roadmap visual interactivo con desbloqueo secuencial funcional.
- Reportes cualitativos generados por IA y visibles para administradores.
- Evaluación documentada sobre viabilidad de Fine-Tuning vs enfoque RAG.
- Flujo integral MVP listo para demo interna/externa con documentación y criterios de aceptación cumplidos.

---

## Priorización sugerida (MVP)
1. **Crítica (P0):** autenticación Supabase, entrevista con avatar, persistencia secuencial, webhook n8n, RAG base, vista inicial del camino.  
2. **Alta (P1):** CRUD admin de cursos/preguntas, progreso secuencial, robustez de flujos n8n.  
3. **Media (P2):** integración completa D-ID tutor y reportes cualitativos avanzados.  
4. **Baja / Opcional (P3):** estudio de Fine-Tuning y refinamientos UX/gamificación avanzados.
