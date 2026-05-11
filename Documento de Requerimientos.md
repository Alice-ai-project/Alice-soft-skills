He realizado cambios estratégicos en los requerimientos del proyecto 'Alice' y necesito que actualices el tablero de GitHub Projects y los Issues correspondientes:

Reestructuración del Diagnóstico:

La tarea de 'Diagnóstico inicial' ya no es un formulario simple. Actualízala para que sea una 'Entrevista Interactiva con Avatar'.

El Frontend debe mostrar las opciones de respuesta mientras el Avatar (D-ID) lee la pregunta.

El Backend debe gestionar el flujo de preguntas secuenciales.

Integración de RAG (Retrieval-Augmented Generation):

Crea una nueva tarea técnica en el Sprint 1 para el rol de IA/n8n: 'Configurar base de datos vectorial y flujo RAG'.

El objetivo es cargar documentación de soft-skills en Supabase (usando pgvector) para que n8n la consulte al generar consejos.

Actualización de Subtareas (Dailies):

Refactoriza las subtareas de los Issues afectados para incluir:

IA/n8n: Diseño de prompts para el RAG y lógica de 'entrevistador' en n8n.

Backend: Endpoints para servir preguntas una a una y recibir respuestas de la entrevista.

Frontend: Lógica de sincronización entre el video del avatar y los botones de respuesta.

Nota de Fine-Tuning:

Agrega una tarea de investigación en el Sprint 2 (Prioridad Baja/Opcional): 'Evaluación de viabilidad para Fine-Tuning del modelo de lenguaje'.

Por favor, modifica los títulos y descripciones de los Issues actuales para que reflejen esta nueva arquitectura basada en una experiencia conversacional
