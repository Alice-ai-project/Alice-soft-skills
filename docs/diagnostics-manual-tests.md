# Pruebas manuales minimas - diagnosticos

## Objetivo
Validar en local/dev el flujo minimo del endpoint de diagnostico con Supabase Auth y persistencia en Supabase.

## Variables requeridas
- `API_URL`: URL del backend. Ejemplo: `http://localhost:8000`.
- `AUTH_TOKEN`: access token valido de Supabase Auth.
- `USER_ID`: id del usuario autenticado.
- `QUESTIONNAIRE_ID`: id existente en `public.questionnaires`.

## Casos minimos

### 1. Crear diagnostico - caso feliz
```bash
curl -i -X POST "$API_URL/api/v1/diagnostics" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "questionnaire_id": "'"$QUESTIONNAIRE_ID"'",
    "dimension_scores": [{"name": "communication", "value": 80}],
    "answers": ["Respuesta valida"]
  }'
```

Resultado esperado: `201` con `diagnostic_result_id`.

### 2. Consultar diagnostico - caso feliz
```bash
curl -i "$API_URL/api/v1/diagnostics/$USER_ID" \
  -H "Authorization: Bearer $AUTH_TOKEN"
```

Resultado esperado: `200` con `diagnostic_result_id`, `user_id`, `questionnaire_id`, `dimension_scores`, `answers` y `created_at`.

### 3. Payload invalido
```bash
curl -i -X POST "$API_URL/api/v1/diagnostics" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "questionnaire_id": "'"$QUESTIONNAIRE_ID"'",
    "dimension_scores": [],
    "answers": ["Respuesta valida"]
  }'
```

Resultado esperado: `400` con `error.code = invalid_payload`.

### 4. Token ausente o invalido
```bash
curl -i -X POST "$API_URL/api/v1/diagnostics" \
  -H "Content-Type: application/json" \
  -d '{
    "questionnaire_id": "'"$QUESTIONNAIRE_ID"'",
    "dimension_scores": [{"name": "communication", "value": 80}],
    "answers": ["Respuesta valida"]
  }'
```

Resultado esperado: `401` con `error.code = unauthorized`.

### 5. Diagnostico inexistente
```bash
curl -i "$API_URL/api/v1/diagnostics/00000000-0000-0000-0000-000000000000" \
  -H "Authorization: Bearer $AUTH_TOKEN"
```

Resultado esperado: `404` con `error.code = diagnostic_not_found`.

## Registro de ejecucion
- Fecha:
- Entorno:
- Responsable:
- Caso 1 resultado:
- Caso 2 resultado:
- Caso 3 resultado:
- Caso 4 resultado:
- Caso 5 resultado:
