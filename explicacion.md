# Alice — Plataforma de Desarrollo de Soft Skills con IA

## El problema que todas las empresas enfrentan

Las habilidades blandas —liderazgo, comunicación asertiva, inteligencia emocional, trabajo en equipo— son el motor del rendimiento laboral. Sin embargo, la mayoría de organizaciones:

- **No tienen forma de medirlas.** Se basan en impresiones subjetivas, no en datos.
- **Ofrecen capacitaciones genéricas.** Cada empleado recibe lo mismo, sin importar sus debilidades reales.
- **Pierden el seguimiento.** No hay forma de saber si la formación tuvo impacto.

El resultado: equipos desmotivados, alta rotación, conflictos innecesarios y productividad estancada.

---

## La solución: Alice

Alice es una plataforma web integral para **diagnosticar, entrenar y desarrollar** habilidades blandas en entornos corporativos y educativos. Combina evaluación basada en evidencia, contenido educativo estructurado y asistencia de IA en un solo lugar.

### Qué incluye

| Módulo | Qué hace |
|--------|----------|
| **Diagnóstico de Inteligencia Emocional** | Evaluación de 24 preguntas basada en el modelo de Daniel Goleman. Mide 6 dimensiones: autoconocimiento, autorregulación, motivación, empatía, habilidades sociales y conexión emocional. Genera un puntaje de 0 a 96 y un nivel de interpretación claro. |
| **8 Cursos Especializados** | Liderazgo Empático, Comunicación Asertiva, Creatividad e Innovación, Pensamiento Crítico, Inteligencia Emocional, Trabajo en Equipo, Gestión del Tiempo y Resiliencia. Cada uno con contenido teórico, recursos PDF, videos y evaluaciones. |
| **Asistente de IA (Alice)** | Chat interactivo con reconocimiento de voz para practicar situaciones reales de comunicación y liderazgo. Integrado con RAG para respuestas contextualizadas. |
| **Roadmap de Aprendizaje Personalizado** | Después del diagnóstico, la plataforma recomienda automáticamente los cursos que cada persona necesita, en el orden correcto. |
| **Panel de Seguimiento** | Dashboard con estadísticas de progreso, habilidades en mejora, actividad semanal y niveles de logro. |

---

## Por qué es diferente

1. **Basado en evidencia.** El diagnóstico utiliza el modelo de Daniel Goleman, el estándar internacional en inteligencia emocional. No es un cuestionario random de internet.

2. **Personalizado desde el primer día.** Cada usuario recibe un plan de desarrollo distinto según sus resultados. No hay contenido genérico.

3. **Asistente de IA para práctica.** No basta con leer sobre comunicación asertiva: hay que practicarla. Alice simula conversaciones y da retroalimentación en tiempo real.

4. **Desplegable en cualquier entorno.** Arquitectura Dockerizada (frontend + backend + base de datos) que se levanta con un solo comando. Compatible con infraestructura existente.

5. **Stack profesional y escalable.** FastAPI, PostgreSQL (Supabase), Nginx, autenticación JWT, Row Level Security. listo para producción.

---

## Para quién está pensado

### Empresas y departamentos de RRHH
- Evaluar competencias socioemocionales de los empleados de forma objetiva.
- Crear planes de capacitación personalizados a escala.
- Medir el impacto de la formación con datos reales.

### Consultoras de desarrollo organizacional
- Ofrecer una herramienta digital como parte de sus servicios de coaching.
- Diagnosticar equipos completos y generar reportes.

### Universidades y centros educativos
- Integrar formación en soft skills como complemento a carreras profesionales.
- Dar a los estudiantes una ventaja competitiva antes de entrar al mercado laboral.

### Coaches y psicólogos organizacionales
- Usar el diagnóstico como punto de partida para sesiones personalizadas.
- Dar a sus clientes una herramienta de práctica continua con IA.

---

## Impacto esperado

| Métrica | Antes de Alice | Con Alice |
|---------|---------------|-----------|
| Evaluación de soft skills | Subjetiva, basada en percepción | Cuantitativa, basada en evidencia |
| Capacitación | Genérica para todos | Personalizada por empleado |
| Seguimiento | Inexistente o manual | Automático con dashboard |
| Práctica de habilidades | Teórica (cursos, lecturas) | Interactiva con IA |
| Tiempo de implementación | Meses de consultoría | Días con Docker |

---

## Especificaciones técnicas

| Componente | Tecnología |
|------------|------------|
| Backend | Python 3.11 + FastAPI |
| Frontend | HTML5 + JavaScript (MVC) + CSS3 |
| Base de datos | PostgreSQL 16 (Supabase) |
| Autenticación | JWT + Row Level Security |
| IA / Automatización | n8n + RAG |
| Infraestructura | Docker + Docker Compose |
| Servidor web | Nginx 1.27 Alpine |

---

## Cómo empezar

Alice está diseñado para desplegarse con un solo comando:

```bash
docker-compose up -d
```

La plataforma queda disponible de inmediato, lista para registrar usuarios, ejecutar diagnósticos y comenzar a capacitar.

---

## Resumen ejecutivo

Alice no es otro curso online de habilidades blandas. Es una **plataforma de diagnóstico y desarrollo** que:

- Mide lo que importa (inteligencia emocional basada en Goleman).
- Enseña lo que cada persona necesita (cursos personalizados por debilidades).
- Permite practicar con IA (asistente interactivo con voz).
- Da visibilidad al equipo de RRHH (dashboard de seguimiento).

**Inversión:** la plataforma está lista para ser implementada.
**ROI:** equipos más competentes, mejor clima laboral, menor rotación.

¿Listos para que su equipo desarrolle las habilidades que realmente marcan la diferencia?
