#!/usr/bin/env bash
set -euo pipefail

PROJECT_TITLE="Alice - Desarrollo Soft Skills"
OWNER="${1:-}"
REPO="${2:-}"

if [[ -z "$OWNER" || -z "$REPO" ]]; then
  echo "Uso: $0 <owner> <repo>"
  exit 1
fi

ensure_label() {
  local name="$1" color="$2"
  gh label create "$name" --color "$color" --repo "$OWNER/$REPO" 2>/dev/null || true
}

ensure_milestone() {
  local title="$1" desc="$2"
  gh api -X POST "repos/$OWNER/$REPO/milestones" -f title="$title" -f description="$desc" >/dev/null 2>&1 || true
}

upsert_issue() {
  local title="$1" body="$2" milestone="$3" label="$4"
  local number
  number=$(gh issue list --repo "$OWNER/$REPO" --state all --search "in:title \"$title\"" --json number,title --jq ".[] | select(.title==\"$title\") | .number" | head -n1)

  if [[ -n "${number:-}" ]]; then
    gh issue edit "$number" --repo "$OWNER/$REPO" --title "$title" --body "$body" --milestone "$milestone" --add-label "$label" >/dev/null
  else
    gh issue create --repo "$OWNER/$REPO" --title "$title" --body "$body" --milestone "$milestone" --label "$label" >/dev/null
  fi
}

ensure_label "Backend" "1f6feb"
ensure_label "Frontend" "0e8a16"
ensure_label "IA/n8n" "a371f7"

ensure_milestone "Sprint 1" "Fundaciones y Core Conversacional"
ensure_milestone "Sprint 2" "IA, Analítica y Pulido"

upsert_issue "S1 - API de entrevista diagnóstica secuencial" "Backend: iniciar entrevista, servir preguntas una a una, registrar respuestas por turno y cierre de sesión diagnóstica." "Sprint 1" "Backend"
upsert_issue "S1 - UI entrevista interactiva con Avatar D-ID" "Frontend: mostrar opciones de respuesta mientras el avatar lee la pregunta y enviar respuesta del turno al backend." "Sprint 1" "Frontend"
upsert_issue "S1 - Sincronización Avatar-UI de respuestas" "Frontend: sincronizar estados del stream/video del avatar con habilitación de botones de respuesta." "Sprint 1" "Frontend"
upsert_issue "S1 - RAG en Supabase pgvector + n8n" "IA/n8n: cargar documentación de soft-skills, indexar embeddings y consultar contexto desde n8n para consejos personalizados." "Sprint 1" "IA/n8n"
upsert_issue "S1 - Prompts RAG y lógica de entrevistador en n8n" "IA/n8n: diseñar prompts y reglas de conversación para el entrevistador y la generación contextual de recomendaciones." "Sprint 1" "IA/n8n"
upsert_issue "S2 - Evaluación de viabilidad de Fine-Tuning (Opcional)" "IA/n8n: investigación de costo-beneficio, datos requeridos y riesgos frente a mantener estrategia RAG." "Sprint 2" "IA/n8n"

echo "Sincronización de issues completada para $OWNER/$REPO"
