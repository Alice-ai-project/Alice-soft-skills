# N8N Workflow: Roadmap Recommender

Este workflow de n8n utiliza OpenAI para recomendar un roadmap personalizado de cursos basado en los resultados del diagnóstico del usuario.

## Configuración

### 1. Importar el Workflow

1. Abre n8n en `http://localhost:5678`
2. Ve a **Workflows** → **Import from File**
3. Selecciona el archivo `roadmap-recommender.json`
4. Haz clic en **Import**

### 2. Configurar la API Key de OpenAI

1. Ve a **Settings** → **Variables** en n8n
2. Crea una nueva variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Tu API key de OpenAI (empieza con `sk-...`)
3. Guarda la variable

### 3. Activar el Workflow

1. Abre el workflow importado
2. Haz clic en el toggle **Active** en la esquina superior derecha
3. El workflow estará disponible en: `http://localhost:5678/webhook/roadmap-recommend`

## Uso

### Endpoint

```
POST http://localhost:5678/webhook/roadmap-recommend
```

### Headers

```
Content-Type: application/json
```

### Body (JSON)

```json
{
  "dimensions": [
    {
      "name": "Autoconocimiento",
      "score": 8,
      "maxScore": 16,
      "level": "Baja"
    },
    {
      "name": "Autorregulación",
      "score": 12,
      "maxScore": 16,
      "level": "Media"
    },
    {
      "name": "Motivación",
      "score": 14,
      "maxScore": 16,
      "level": "Alta"
    },
    {
      "name": "Empatía",
      "score": 10,
      "maxScore": 16,
      "level": "Media"
    },
    {
      "name": "Habilidades Sociales",
      "score": 7,
      "maxScore": 16,
      "level": "Baja"
    },
    {
      "name": "Conexión Emocional",
      "score": 9,
      "maxScore": 16,
      "level": "Baja"
    }
  ],
  "overallLevel": "Baja",
  "totalScore": 60,
  "maxScore": 96
}
```

### Respuesta Exitosa (200)

```json
{
  "success": true,
  "roadmap": [
    {
      "course": "Liderazgo",
      "priority": 1,
      "reason": "Tu área de Autoconocimiento está en nivel bajo, y este curso te ayudará a desarrollar esa habilidad fundamental.",
      "estimatedWeeks": 3
    },
    {
      "course": "Gestion Emocional",
      "priority": 2,
      "reason": "Mejorar tu Autorregulación y Conexión Emocional con técnicas prácticas de gestión emocional.",
      "estimatedWeeks": 2
    },
    {
      "course": "Comunicacion Asertiva",
      "priority": 3,
      "reason": "Fortalecer tus Habilidades Sociales aprendiendo a comunicarte de forma efectiva y respetuosa.",
      "estimatedWeeks": 2
    }
  ],
  "summary": "Basado en tu diagnóstico, te recomiendas comenzar con Liderazgo para fortalecer tu autoconocimiento, luego Gestion Emocional para mejorar tu autorregulación, y finalmente Comunicación Asertiva para potenciar tus habilidades sociales.",
  "diagnostic": {
    "overallLevel": "Baja",
    "totalScore": 60,
    "maxScore": 96
  }
}
```

### Respuesta de Error (400/500)

```json
{
  "success": false,
  "error": "Missing required field: dimensions"
}
```

## Cursos Disponibles

| Curso | Descripción |
|-------|-------------|
| Comunicacion Asertiva | Domina el arte de expresar tus ideas con claridad, respeto y confianza |
| Construccion Colectiva | Colabora de manera efectiva para alcanzar objetivos comunes |
| Desarrollo de Si mismo | Explora el autoconocimiento, la autoestima y el crecimiento personal |
| Flexibilidad y Adaptabilidad | Desbloquea tu potencial creativo para resolver problemas innovadores |
| Gestion del Tiempo | Optimiza tu productividad y reduce el estrés laboral |
| Gestion Emocional | Gestiona tus emociones para un mejor bienestar |
| Liderazgo | Desarrolla habilidades de liderazgo basadas en la empatía |
| Resistencia a la Frustracion | Fortalece tu capacidad para superar la adversidad |
| Resolucion de Conflictos | Mejora tu capacidad de análisis y toma de decisiones |

## Mapeo de Dimensiones a Cursos

| Dimensión Débil | Cursos Recomendados |
|-----------------|---------------------|
| Autoconocimiento | Liderazgo, DesarrolloSub de Si mismo |
| Autorregulación | Gestion Emocional, Resistencia a la Frustracion |
| Motivación | Liderazgo, Flexibilidad y Adaptabilidad |
| Empatía | Comunicacion Asertiva, Construccion Colectiva |
| Habilidades Sociales | Comunicacion Asertiva, Resolucion de Conflictos |
| Conexión Emocional | Gestion Emocional, Resolucion de Conflictos |

## Notas

- El workflow usa el modelo `gpt-4o-mini` de OpenAI (más económico)
- La temperatura está configurada en 0.7 para respuestas variadas pero coherentes
- El timeout de la API es de 30 segundos
- Se incluyen headers CORS para permitir llamadas desde el frontend
