# Product Backlog — Proyecto Alice

## Contexto de planificación
- **Metodología:** Scrum.
- **Duración:** 2 sprints de 15 días calendario.
- **Equipo (5 integrantes):** desarrollo **Backend**, **Frontend** e **IA/n8n + Integración Avatar**.
- **Objetivo MVP:** autenticación, diagnóstico inicial, persistencia, automatización de ruta de aprendizaje, visualización de roadmap, tutor IA por streaming, y panel administrativo básico.

---

## Sprint 1 (Días 1–15) — Fundaciones y Core

### Objetivo del Sprint
Dejar operativo el flujo extremo a extremo base: login, diagnóstico, guardado de resultados y disparo de webhook hacia n8n, junto con una primera interfaz navegable y base de CMS.

### Tareas por rol

#### Backend
1. **Configurar autenticación con Supabase Auth (JWT) en FastAPI**  
   Implementar validación de token en backend, middleware/dependencias de seguridad y endpoint `/auth/me` para recuperar perfil autenticado.

2. **Diseñar esquema inicial de base de datos para MVP**  
   Definir modelos/tablas para `users`, `courses`, `questionnaires`, `questions`, `diagnostic_results` y `learning_roadmaps` con migraciones iniciales.

3. **Implementar API de diagnóstico inicial (create/read)**  
   Crear endpoints para registrar respuestas del cuestionario inicial, calcular puntajes base y persistir resultados.

4. **Implementar webhook saliente hacia n8n al guardar diagnóstico**  
   Enviar payload normalizado desde FastAPI al webhook de n8n con datos de usuario, métricas y timestamp del diagnóstico.

5. **Implementar endpoints base para panel administrativo (CRUD cursos y preguntas)**  
   Exponer operaciones CRUD para cursos, cuestionarios y preguntas con controles de rol administrador.

6. **Estandarizar manejo de errores y contratos API**  
   Incorporar esquema de respuestas (`success/error`), validaciones Pydantic y códigos HTTP consistentes para facilitar integración frontend.

#### Frontend
7. **Implementar flujo de login con Supabase en cliente web**  
   Construir pantallas de acceso y persistencia de sesión (token), incluyendo protección de rutas privadas.

8. **Construir UI del diagnóstico inicial (cuestionario)**  
   Crear vista para responder preguntas por módulos, validar campos y enviar respuestas al backend.

9. **Implementar vista básica de roadmap del usuario (placeholder funcional)**  
   Mostrar estado inicial del camino de aprendizaje con datos simulados/primer endpoint real.

10. **Crear base del panel administrativo (listado + formularios CRUD)**  
   Diseñar navegación administrativa y formularios para cursos/preguntas conectados a endpoints backend.

11. **Definir sistema base de componentes y estilos UI**  
   Estructurar componentes reutilizables (botones, tarjetas, tablas, formularios, alerts) y convenciones de Tailwind.

#### IA/n8n
12. **Configurar workflow n8n para recepción de diagnóstico**  
   Crear flujo con trigger por webhook, validación de payload y almacenamiento de logs de ejecución.

13. **Implementar lógica inicial de generación de ruta de aprendizaje**  
   Traducir resultados de diagnóstico a recomendaciones y estructura de roadmap (reglas iniciales o prompt asistido por IA).

14. **Publicar endpoint de retorno o actualización hacia backend**  
   Configurar paso final del workflow para actualizar roadmap del usuario en la API de FastAPI.

15. **Instrumentar monitoreo básico del flujo automatizado**  
   Definir alertas/seguimiento de errores en n8n (ejecuciones fallidas, reintentos y trazabilidad por usuario).

#### Transversal (equipo)
16. **Definir Definition of Done y checklist de calidad por historia**  
   Alinear criterios de aceptación, pruebas mínimas, revisión de código y documentación antes de cerrar tareas.

17. **Configurar tablero de GitHub Projects y convenciones Scrum**  
   Crear columnas/estados, etiquetas por rol y plantillas de issues para facilitar planificación y seguimiento.

### Milestone Sprint 1 (qué debe estar funcionando)
- Login con Supabase operativo en frontend + validación en backend.
- Diagnóstico inicial completo: carga de preguntas, envío de respuestas y persistencia en PostgreSQL.
- Webhook FastAPI → n8n ejecutándose de forma confiable con trazabilidad.
- Roadmap inicial generado por n8n y disponible en una vista funcional del frontend.
- Panel administrativo mínimo con CRUD de cursos y preguntas (operativo en entorno interno).

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

6. **Optimizar observabilidad y logs de negocio**  
   Estandarizar logging estructurado, correlación por `request_id` y métricas básicas de API.

#### Frontend
7. **Implementar UI final del camino de aprendizaje (roadmap interactivo)**  
   Visualizar progreso por etapas, estados de bloqueo/desbloqueo y recomendaciones generadas.

8. **Integrar experiencia de tutor IA en interfaz**  
   Construir pantalla de sesión de entrenamiento con controles de inicio/fin y estados de streaming.

9. **Agregar dashboard de reportes para administrador**  
   Presentar analítica cualitativa y evolución por empleado con tablas, filtros y visualizaciones simples.

10. **Mejorar UX de feedback inmediato y gamificación**  
   Añadir indicadores de logro, mensajes de progreso y microinteracciones para reforzar engagement.

11. **End-to-end QA visual y responsive**  
   Ajustar compatibilidad responsive, accesibilidad básica y consistencia de componentes entre vistas.

#### IA/n8n
12. **Integrar workflow de D-ID para sesiones de tutor**  
   Orquestar inicio de sesión, intercambio de eventos y cierre de interacción con backend.

13. **Automatizar generación de reportes cualitativos con IA**  
   Procesar señales de interacción para producir resumen cualitativo accionable por usuario.

14. **Implementar versionado de prompts/reglas de recomendación**  
   Gestionar iteraciones de lógica IA para comparar resultados y mejorar precisión del roadmap.

15. **Añadir mecanismos de resiliencia del flujo n8n**  
   Configurar reintentos, colas/esperas, timeouts y manejo de errores para dependencias externas.

#### Transversal (equipo)
16. **Pruebas integrales de flujo MVP de punta a punta**  
   Validar escenario completo: login → diagnóstico → ruta IA → tutor → reporte admin.

17. **Hardening de release y documentación operativa**  
   Consolidar guía de despliegue local, checklist de demo y runbook de incidencias comunes.

### Milestone Sprint 2 (qué debe estar funcionando)
- Tutor IA con streaming D-ID integrado en interfaz y trazabilidad de sesión.
- Roadmap visual interactivo con desbloqueo secuencial funcional.
- Reportes cualitativos generados por IA y visibles para administradores.
- Panel administrativo estable para operación del contenido (cursos y cuestionarios).
- Flujo integral MVP listo para demo interna/externa con documentación y criterios de aceptación cumplidos.

---

## Priorización sugerida (MVP)
1. **Crítica (P0):** autenticación Supabase, diagnóstico + persistencia, webhook n8n, generación de roadmap, vista base del camino.  
2. **Alta (P1):** CRUD admin de cursos/preguntas, progreso secuencial, robustez de flujos n8n.  
3. **Media (P2):** integración completa D-ID y reportes cualitativos avanzados.  
4. **Mejora (P3):** refinamientos UX/gamificación avanzados y optimizaciones de observabilidad.
