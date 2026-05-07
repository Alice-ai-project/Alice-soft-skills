# Product Backlog Reestructurado — Alice (Nivel Principiante)

## Perfil y enfoque
- **Contexto personal:** estudiante de Colombia, nivel principiante.
- **Base actual:** Python, HTML, CSS, JavaScript y MySQL en nivel basico.
- **Ruta principal:** automatizacion con IA usando **n8n**.
- **Meta del proyecto:** construir un MVP simple, funcional y entendible paso a paso.

## Reglas de planificacion (adaptadas)
- Cada tarea debe poder avanzar en bloques de **4 a 6 horas**.
- Priorizar lo que te ayude a **aprender haciendo** sobre lo mas complejo.
- Evitar arquitectura avanzada al inicio; primero flujo funcional de punta a punta.
- Mantener stack sencillo: FastAPI + Supabase + frontend web simple + n8n.

---

## Sprint 1 (Dias 1-15) — Base funcional y primeros flujos

### Objetivo del sprint
Dejar listo un flujo minimo: login, diagnostico, guardado en BD y envio de datos a n8n, con pantallas simples para probar todo.

### Historias (US)

#### Backend
1. **US-01 — Auth basica con Supabase en FastAPI**  
   Validar JWT y crear `GET /auth/me` para devolver usuario autenticado.

2. **US-02 — Modelo inicial de datos MVP**  
   Crear tablas base (`users`, `courses`, `questionnaires`, `questions`, `diagnostic_results`, `learning_roadmaps`).

3. **US-03 — API basica de diagnostico (guardar y consultar)**  
   Guardar respuestas y devolver resultado inicial del diagnostico.

4. **US-04 — Webhook FastAPI -> n8n**  
   Enviar JSON con resultado del diagnostico cuando se guarde.

5. **US-05 — CRUD admin minimo (cursos y preguntas)**  
   Crear endpoints simples para listar, crear, editar y eliminar.

6. **US-06 — Errores y respuestas consistentes**  
   Unificar formato de exito/error y validar entradas con Pydantic.

#### Frontend
7. **US-07 — Login simple en web**  
   Formulario de acceso y proteccion basica de rutas privadas.

8. **US-08 — Pantalla de diagnostico inicial**  
   Mostrar preguntas, validar campos y enviar respuestas al backend.

9. **US-09 — Vista inicial de roadmap**  
   Mostrar un estado basico del camino de aprendizaje.

10. **US-10 — Base de panel admin**  
   Pantalla de listado y formulario simple para cursos/preguntas.

11. **US-11 — Mini sistema de componentes UI**  
   Boton, input, tarjeta, tabla y alerta reutilizables.

#### IA/n8n
12. **US-12 — Workflow n8n para recibir diagnostico**  
   Webhook trigger, validacion de JSON y log basico de ejecucion.

13. **US-13 — Reglas iniciales para generar roadmap**  
   Traducir resultados del diagnostico a recomendaciones simples.

14. **US-14 — Respuesta de n8n hacia backend**  
   Enviar roadmap generado a un endpoint del backend.

15. **US-15 — Monitoreo basico en n8n**  
   Detectar errores comunes y registrar fallos por usuario.

#### Transversal
16. **US-16 — DoD simple por tarea**  
   Definir checklist minimo: codigo probado, sin errores y documentado.

17. **US-17 — Tablero y convenciones Scrum**  
   Mantener labels, milestones y avance diario en GitHub Projects.

### Meta de salida Sprint 1
- Login funcionando.
- Diagnostico guardado en BD.
- Webhook hacia n8n funcionando.
- Roadmap inicial visible en frontend.

---

## Sprint 2 (Dias 16-30) — IA aplicada y demo estable

### Objetivo del sprint
Mejorar la experiencia con tutor IA, reportes simples y estabilidad general para demo.

### Historias (US)

#### Backend
18. **US-18 — Ampliar datos para sesiones IA**  
   Agregar tablas de sesiones, eventos y reportes cualitativos.

19. **US-19 — API de progreso secuencial**  
   Desbloquear modulos segun avance del usuario.

20. **US-20 — Endpoint para metricas de sesiones**  
   Guardar duracion, transcripcion y eventos clave.

21. **US-21 — API de reportes cualitativos**  
   Consultar reportes por usuario y por vista admin.

22. **US-22 — Seguridad por roles (Empleado/Admin)**  
   Reforzar permisos por endpoint y recurso.

23. **US-23 — Logs y observabilidad basica**  
   Agregar `request_id` y logs utiles para depuracion.

#### Frontend
24. **US-24 — Roadmap interactivo final**  
   Mostrar progreso y estados bloqueado/desbloqueado.

25. **US-25 — Interfaz de tutor IA**  
   Pantalla con controles de iniciar/finalizar sesion.

26. **US-26 — Dashboard admin de reportes**  
   Tabla con filtros basicos para analizar resultados.

27. **US-27 — Feedback inmediato y gamificacion simple**  
   Mensajes de logro y progreso para motivar al usuario.

28. **US-28 — QA visual y responsive**  
   Ajustes de interfaz para movil y escritorio.

#### IA/n8n
29. **US-29 — Flujo n8n para sesiones de tutor**  
   Orquestar inicio, eventos y cierre de sesion.

30. **US-30 — Reportes cualitativos con IA**  
   Generar resumen accionable desde interacciones.

31. **US-31 — Versionado de prompts/reglas IA**  
   Guardar versiones para comparar resultados.

32. **US-32 — Resiliencia de flujos n8n**  
   Reintentos, timeouts y manejo de errores externos.

#### Transversal
33. **US-33 — Prueba E2E de todo el MVP**  
   Validar flujo completo: login -> diagnostico -> ruta -> tutor -> reporte.

34. **US-34 — Hardening y documentacion final**  
   Checklist de demo, guia de despliegue y runbook de incidencias.

### Meta de salida Sprint 2
- Tutor IA integrado a nivel MVP.
- Reportes cualitativos visibles para admin.
- Flujo completo estable para demo.

---

## Priorizacion recomendada (para aprender rapido)
1. **P0:** US-01, US-03, US-04, US-07, US-08, US-12, US-14.
2. **P1:** US-05, US-09, US-10, US-19, US-24, US-29.
3. **P2:** US-21, US-25, US-26, US-30, US-31.
4. **P3:** US-27, US-28, US-32, US-34.

---

## Plan diario (30 dias)

### Sprint 1 (Dias 1-15) — Base funcional
1. **Dia 1:** US-01 preparar entorno backend + variables Supabase + prueba de conexion.
2. **Dia 2:** US-01 validacion JWT y endpoint `GET /auth/me`.
3. **Dia 3:** US-02 crear tablas base (`users`, `courses`, `questionnaires`).
4. **Dia 4:** US-02 completar tablas restantes + migracion inicial + prueba insert/select.
5. **Dia 5:** US-03 endpoint guardar diagnostico (`POST`) con validaciones Pydantic.
6. **Dia 6:** US-03 endpoint consultar diagnostico (`GET`) + manejo de errores basicos.
7. **Dia 7:** US-07 maquetar login en frontend + validaciones de formulario.
8. **Dia 8:** US-07 conectar login con API/Supabase + guardar sesion.
9. **Dia 9:** US-08 UI cuestionario diagnostico + estado JS Vanilla.
10. **Dia 10:** US-08 enviar respuestas al backend + feedback de exito/error.
11. **Dia 11:** US-04 webhook FastAPI -> n8n (envio JSON diagnostico).
12. **Dia 12:** US-12 crear workflow n8n de recepcion + validacion JSON.
13. **Dia 13:** US-13 reglas iniciales/prompt para generar roadmap simple.
14. **Dia 14:** US-14 callback n8n -> backend para guardar roadmap.
15. **Dia 15:** Cierre Sprint 1: US-09 vista roadmap basica + smoke test completo (login -> diagnostico -> n8n -> roadmap).

### Sprint 2 (Dias 16-30) — IA aplicada y demo
16. **Dia 16:** US-18 ampliar modelo de datos para sesiones IA/reportes.
17. **Dia 17:** US-19 API de progreso secuencial (regla de desbloqueo simple).
18. **Dia 18:** US-20 endpoint de metricas de sesion (duracion/transcripcion/eventos).
19. **Dia 19:** US-21 API de reportes cualitativos (listado + detalle).
20. **Dia 20:** US-22 reforzar roles Empleado/Admin en endpoints clave.
21. **Dia 21:** US-23 logs basicos + `request_id` + trazabilidad minima.
22. **Dia 22:** US-24 roadmap interactivo frontend (estados bloqueado/completado).
23. **Dia 23:** US-25 pantalla tutor IA (iniciar/finalizar sesion).
24. **Dia 24:** US-26 dashboard admin de reportes (tabla + filtros basicos).
25. **Dia 25:** US-29 workflow n8n para sesiones tutor (inicio/eventos/cierre).
26. **Dia 26:** US-30 reporte cualitativo con IA (prompt + JSON valido).
27. **Dia 27:** US-31 versionado basico de prompts/reglas y comparacion.
28. **Dia 28:** US-32 resiliencia n8n (reintentos, timeout, errores comunes).
29. **Dia 29:** US-28 QA visual responsive + US-27 feedback/gamificacion simple.
30. **Dia 30:** Cierre Sprint 2: US-33 prueba E2E completa + US-34 checklist demo/documentacion final.
