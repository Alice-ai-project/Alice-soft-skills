# Plan MVP (US-02 + Endpoint diagnostico)

## Revision rapida
- Ya existe base de API/Auth en `backend/app/api/auth.py`, `backend/app/schemas/auth.py` y `backend/app/core/auth.py`.
- Este plan se enfoca en: modelo de datos base + endpoint de diagnostico + validaciones + integracion + errores.
- Nota clave: si se usa Supabase Auth, evitar duplicar identidad. Usar `auth.users` como fuente principal y una tabla de perfil enlazada por `id`.

## Enfoque principiante (bloques de 4 a 6 horas)

### Bloque 1 (4-6h): modelo de datos MVP
- Crear/ajustar tablas: `courses`, `questionnaires`, `questions`, `diagnostic_results`, `learning_roadmaps`.
- Definir `users` como perfil vinculado a `auth.users(id)` cuando aplique.
- Verificar relaciones minimas (FK) y campos obligatorios.

### Bloque 2 (4-6h): endpoint principal
- Implementar `POST /diagnostics` para guardar resultado diagnostico.
- Implementar `GET /diagnostics/{user_id}` para consulta basica.
- Probar ambos endpoints en local.

### Bloque 3 (4-6h): validaciones con Pydantic
- Reglas basicas: campos requeridos, tipos correctos, rangos validos y listas no vacias.
- Responder error controlado ante entradas invalidas.
- Mantener esquemas simples y legibles para nivel inicial.

### Bloque 4 (4-6h): integracion (Supabase o n8n)
- Opcion A: persistencia directa con Supabase.
- Opcion B: webhook a n8n despues de guardar diagnostico.
- Validar integracion en entorno local/dev con al menos un flujo exitoso.

### Bloque 5 (4-6h): manejo de errores comunes
- Cubrir respuestas claras para `400`, `401` y `404`.
- Estandarizar formato de error, por ejemplo:

```json
{
  "error": {
    "code": "diagnostic_not_found",
    "message": "No se encontro diagnostico para el usuario",
    "request_id": "optional-trace-id"
  }
}
```

### Bloque 6 (4-6h): pruebas manuales minimas
- Ejecutar minimo 5 casos:
  - 2 casos felices (crear y consultar).
  - 3 casos de error (payload invalido, token invalido, recurso inexistente).
- Guardar evidencia de requests/responses (Postman o `curl`) usando `docs/diagnostics-manual-tests.md`.

## Subtareas tecnicas (tasklist)
- Crear/ajustar endpoint principal y probarlo en local.
- Agregar validaciones con Pydantic para entradas invalidas.
- Integrar con Supabase o n8n segun la historia.
- Manejar errores comunes con respuestas claras (`400/401/404`).

## Criterios de aceptacion (medibles)
- Endpoint funcional con validaciones basicas y errores controlados.
- `POST /diagnostics` responde `201` con `diagnostic_result_id`.
- `GET /diagnostics/{user_id}` responde `200` con datos esperados.
- Integracion validada en entorno local o dev (Supabase o n8n).
- Pruebas manuales minimas completadas y registradas.

## Checklist final
- [x] Tablas base creadas y relacionadas.
- [x] Endpoint `POST /diagnostics` operativo.
- [x] Endpoint `GET /diagnostics/{user_id}` operativo.
- [x] Validaciones Pydantic aplicadas.
- [x] Errores `400/401/404` implementados con formato consistente.
- [ ] Integracion local/dev verificada.
- [x] Plantilla de evidencia de pruebas manuales creada.
