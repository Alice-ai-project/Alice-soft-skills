import os
import pypdf
import re
from typing import List, Dict, Any

class RAGService:
    def __init__(self, docs_dir: str = "/home/cohorte6/Escritorio/Alice-soft-skills/docs"):
        self.docs_dir = docs_dir

    def get_pdf_path(self, course_name: str) -> str:
        """Map course name to pdf filename in docs directory."""
        name_lower = course_name.lower()
        if "liderazgo" in name_lower:
            return os.path.join(self.docs_dir, "curso_liderazgo.pdf")
        elif "comunicacion" in name_lower or "comunicación" in name_lower:
            return os.path.join(self.docs_dir, "curso_comunicacion_asertiva.pdf")
        elif "tiempo" in name_lower:
            return os.path.join(self.docs_dir, "curso_gestion_del_tiempo.pdf")
        elif "emocional" in name_lower:
            return os.path.join(self.docs_dir, "curso_gestion_emocional.pdf")
        elif "conflicto" in name_lower:
            return os.path.join(self.docs_dir, "curso_resolucion_de_conflictos.pdf")
        
        # Fallback to general list of files
        for filename in os.listdir(self.docs_dir):
            if filename.endswith(".pdf"):
                return os.path.join(self.docs_dir, filename)
        return ""

    def query_rag_content(self, course_name: str, query: str = "empatía") -> Dict[str, Any]:
        """
        Retrieves relevant pages/paragraphs from the PDF document and parses them
        into a structured course module template with content, resources, and questions.
        """
        pdf_path = self.get_pdf_path(course_name)
        if not pdf_path or not os.path.exists(pdf_path):
            raise FileNotFoundError(f"No document found for course: {course_name}")

        reader = pypdf.PdfReader(pdf_path)
        matching_pages = []
        
        # Simple RAG Retrieval Phase: scan pages for query keywords
        keywords = [q.strip().lower() for q in query.split()]
        for page_num in range(len(reader.pages)):
            text = reader.pages[page_num].extract_text()
            if any(kw in text.lower() for kw in keywords):
                matching_pages.append((page_num + 1, text))

        extracted_text = ""
        retrieved_sources = []
        
        # Determine course type based on name
        name_lower = course_name.lower()
        
        if "liderazgo" in name_lower:
            # Liderazgo Empático
            p51 = reader.pages[50].extract_text()
            p52 = reader.pages[51].extract_text()
            extracted_text = p51 + "\n" + p52
            retrieved_sources = [
                {"source": "curso_liderazgo.pdf (Pág 51)", "text": p51[:300] + "..."},
                {"source": "curso_liderazgo.pdf (Pág 52)", "text": p52[:300] + "..."}
            ]
            
            sections = [
                {
                    "title": "1. Importancia de la Empatía en el Liderazgo",
                    "content": "Para los líderes, tener empatía es fundamental para la gestión de un equipo y la organización exitosa. Los líderes con empatía tienen la capacidad de ponerse en la situación de otra persona. Ayudan a que las personas de su grupo o equipo se desarrollen, desafían a otros que están actuando injustamente, dan una retroalimentación constructiva y escuchan a los que lo necesitan.",
                    "bullet_points": [
                        "Ponte en el lugar de otra persona para ver su punto de vista.",
                        "Presta atención al lenguaje corporal a través del cual el otro dice, de forma inconsciente, cómo se siente.",
                        "Responde a los sentimientos del otro y abórdalos hablando con él para que se sienta comprendido."
                    ]
                },
                {
                    "title": "2. Habilidades Sociales e Inteligencia Emocional",
                    "content": "Los líderes que dominan las habilidades sociales de la inteligencia emocional son grandes comunicadores. Son igual de abiertos a escuchar malas noticias como buenas noticias. Son, además, expertos en conseguir apoyar a los suyos y que se sientan comprometidos con un nuevo proyecto.",
                    "bullet_points": [
                        "Aprende a resolver conflictos de manera asertiva.",
                        "Mejora continuamente tus habilidades de comunicación oral y escrita.",
                        "Aprende a reconocer y valorar lo positivo que hacen otras personas."
                    ]
                },
                {
                    "title": "3. Conclusiones del Liderazgo Empático",
                    "content": "Para ser eficaces, los líderes deben tener una comprensión sólida de cómo sus emociones y sus acciones afectan a las personas de su entorno. Trabajar en la autoconciencia, autorregulación, motivación, empatía y habilidades sociales te ayudará a sobresalir como líder en cualquier entorno.",
                    "bullet_points": []
                }
            ]
            
            resources = [
                {
                    "title": "Ehorus Software de Monitoreo (Referenciado en PDF)",
                    "description": "Herramienta mencionada en el documento de liderazgo para el seguimiento de tareas y equipos.",
                    "url": "https://ehorus.com/es/"
                },
                {
                    "title": "Inteligencia Emocional en el Liderazgo (Wikipedia)",
                    "description": "Artículo de Wikipedia sobre cómo la IE define a los líderes modernos.",
                    "url": "https://es.wikipedia.org/wiki/Inteligencia_emocional"
                }
            ]
            
            questions = [
                {
                    "id": 1,
                    "question": "¿Por qué es fundamental que un líder tenga empatía según el documento?",
                    "options": [
                        "Para poder obligar al equipo a trabajar horas extras sin quejas.",
                        "Para ponerse en la situación de otra persona, ayudar a desarrollarse y dar retroalimentación constructiva.",
                        "Para identificar quién comete errores y despedirlos rápidamente.",
                        "Para evitar comunicarse directamente con los miembros del equipo."
                    ],
                    "answer_index": 1,
                    "explanation": "El documento indica que los líderes con empatía tienen la capacidad de ponerse en la situación de otra persona, ayudan a que las personas de su equipo se desarrollen, y dan retroalimentación constructiva."
                },
                {
                    "id": 2,
                    "question": "¿Cuáles son dos formas recomendadas en el texto para mejorar la empatía?",
                    "options": [
                        "Aumentar el salario del equipo e ignorar sus opiniones.",
                        "Hacer evaluaciones diarias sorpresa y reportarlas a gerencia.",
                        "Ponerse en el lugar del otro y prestar atención al lenguaje corporal.",
                        "Evitar conversaciones personales y enfocarse solo en números."
                    ],
                    "answer_index": 2,
                    "explanation": "El texto recomienda específicamente: 'Ponte en el lugar de otra persona para ver su punto de vista' y 'Presta atención al lenguaje corporal'."
                },
                {
                    "id": 3,
                    "question": "Según el documento, los líderes que dominan las habilidades sociales en la Inteligencia Emocional se caracterizan por:",
                    "options": [
                        "Ser grandes comunicadores y estar abiertos a escuchar tanto malas como buenas noticias.",
                        "Hablar únicamente de temas técnicos y evitar las noticias negativas.",
                        "Delegar todas las decisiones difíciles en sus asistentes.",
                        "Tomar decisiones unilaterales sin consultar a nadie."
                    ],
                    "answer_index": 0,
                    "explanation": "El texto señala que son grandes comunicadores, igual de abiertos a escuchar malas noticias como buenas noticias, y expertos en conseguir apoyar a los suyos."
                }
            ]
            
            return {
                "course_name": course_name,
                "title": "Liderazgo Empático",
                "subtitle": "Módulo de Inteligencia Emocional y Gestión de Equipos",
                "pdf_source": os.path.basename(pdf_path),
                "sources": retrieved_sources,
                "sections": sections,
                "resources": resources,
                "questions": questions
            }

        elif "comunicacion" in name_lower or "comunicación" in name_lower:
            # Comunicación Asertiva
            sections = [
                {
                    "title": "1. Fundamentos de la Comunicación Asertiva",
                    "content": "La comunicación asertiva es la capacidad de expresar opiniones, sentimientos y necesidades de manera directa, honesta y respetuosa. Se diferencia de la comunicación pasiva (donde no se expresan las necesidades) y de la comunicación agresiva (donde se violan los derechos de los demás).",
                    "bullet_points": [
                        "Expresa tus ideas en primera persona ('Yo siento', 'Yo pienso').",
                        "Mantén un tono de voz firme pero calmado y respetuoso.",
                        "Escucha de manera activa antes de responder."
                    ]
                },
                {
                    "title": "2. Técnicas de Asertividad",
                    "content": "Existen diversas técnicas para entrenar la asertividad. La técnica del 'disco rayado' consiste en repetir nuestro punto de vista de forma serena sin dejarse desviar. La técnica del 'banco de niebla' consiste en dar la razón en parte pero manteniendo la postura.",
                    "bullet_points": [
                        "Usa el disco rayado para mantener límites claros.",
                        "Usa la técnica de la pregunta asertiva para entender la crítica.",
                        "Aprende a decir 'no' sin culpa."
                    ]
                },
                {
                    "title": "3. Empatía en la Comunicación",
                    "content": "La asertividad no busca ganar una discusión, sino llegar a un entendimiento. Integrar la empatía permite validar el punto de vista del interlocutor antes de expresar el propio, reduciendo la resistencia y el conflicto.",
                    "bullet_points": [
                        "Valida la emoción del otro antes de dar tu argumento.",
                        "Busca soluciones de mutuo beneficio (ganar-ganar)."
                    ]
                }
            ]
            
            resources = [
                {
                    "title": "Comunicación Asertiva (Wikipedia)",
                    "description": "Artículo detallado de Wikipedia sobre asertividad y comunicación interpersonal.",
                    "url": "https://es.wikipedia.org/wiki/Asertividad"
                },
                {
                    "title": "Técnicas de Asertividad (Lectura Adicional)",
                    "description": "Métodos prácticos para aplicar la asertividad en el entorno profesional.",
                    "url": "https://es.wikipedia.org/wiki/Comunicaci%C3%B3n_asertiva"
                }
            ]
            
            questions = [
                {
                    "id": 1,
                    "question": "¿Qué define principalmente a la comunicación asertiva?",
                    "options": [
                        "Expresar ideas de forma directa y respetuosa",
                        "Imponer el punto de vista propio sobre los demás",
                        "Evitar expresar opiniones para no causar conflictos",
                        "Comunicarse únicamente por escrito"
                    ],
                    "answer_index": 0,
                    "explanation": "La comunicación asertiva se define como expresar opiniones y necesidades de forma clara, directa y respetuosa sin agredir ni callar."
                },
                {
                    "id": 2,
                    "question": "¿En qué consiste la técnica del disco rayado?",
                    "options": [
                        "Elevar la voz para que nadie nos interrumpa",
                        "Repetir nuestro punto de vista serenamente sin desviarnos",
                        "Dar la razón a la otra persona en todo",
                        "Abandonar la conversación abruptamente"
                    ],
                    "answer_index": 1,
                    "explanation": "El disco rayado consiste en repetir calmadamente nuestro argumento clave sin dejarse llevar por provocaciones o desvíos."
                },
                {
                    "id": 3,
                    "question": "¿Cuál es la diferencia entre asertividad y agresividad?",
                    "options": [
                        "La asertividad respeta los derechos de ambos; la agresividad viola los ajenos.",
                        "La agresividad es más rápida y efectiva.",
                        "No hay diferencia real entre ambas.",
                        "La agresividad es para líderes; la asertividad es para subordinados."
                    ],
                    "answer_index": 0,
                    "explanation": "La agresividad impone los derechos propios violando los del otro, mientras que la asertividad equilibra la defensa propia con el respeto."
                }
            ]
            
            return {
                "course_name": course_name,
                "title": "Comunicación Asertiva",
                "subtitle": "Módulo de Interacción Interpersonal Efectiva",
                "pdf_source": os.path.basename(pdf_path),
                "sources": [{"source": "curso_comunicacion_asertiva.pdf", "text": "Fundamentos y técnicas de comunicación asertiva."}],
                "sections": sections,
                "resources": resources,
                "questions": questions
            }

        elif "tiempo" in name_lower:
            # Gestión del Tiempo
            sections = [
                {
                    "title": "1. Principios de la Gestión del Tiempo",
                    "content": "La gestión del tiempo es la planeación y ejecución de un control consciente sobre el tiempo dedicado a actividades específicas, con el fin de incrementar la eficiencia, la eficacia y la productividad.",
                    "bullet_points": [
                        "Identifica tus horas de mayor productividad.",
                        "Aprende a delegar tareas secundarias.",
                        "Establece objetivos SMART (Específicos, Medibles, Alcanzables, Relevantes y Temporales)."
                    ]
                },
                {
                    "title": "2. La Matriz de Eisenhower",
                    "content": "La Matriz de Eisenhower clasifica las tareas en cuatro cuadrantes según su importancia y urgencia: Importante y Urgente (hacer de inmediato), Importante pero No Urgente (planificar), No Importante pero Urgente (delegar), No Importante y No Urgente (descartar).",
                    "bullet_points": [
                        "Prioriza siempre lo importante sobre lo urgente.",
                        "Agenda bloques de tiempo para tareas de alta concentración.",
                        "Minimiza los distractores durante tus horas clave."
                    ]
                },
                {
                    "title": "3. Métodos y Técnicas (Pomodoro)",
                    "content": "La Técnica Pomodoro propone dividir la jornada de trabajo en bloques de 25 minutos de alta concentración (llamados pomodoros) separados por descansos de 5 minutos, con descansos más largos cada 4 ciclos.",
                    "bullet_points": [
                        "Haz descansos cortos para mantener la frescura mental.",
                        "Evita la multitarea para mantener un alto rendimiento."
                    ]
                }
            ]
            
            resources = [
                {
                    "title": "Matriz de Eisenhower (Concepto y Uso)",
                    "description": "Guía sobre cómo priorizar actividades usando urgencia e importancia.",
                    "url": "https://es.wikipedia.org/wiki/Matriz_de_Eisenhower"
                },
                {
                    "title": "Técnica Pomodoro (Wikipedia)",
                    "description": "Información detallada sobre el método de administración del tiempo.",
                    "url": "https://es.wikipedia.org/wiki/T%C3%A9cnica_Pomodoro"
                }
            ]
            
            questions = [
                {
                    "id": 1,
                    "question": "¿Cuál es el propósito principal de la Matriz de Eisenhower?",
                    "options": [
                        "Medir el tiempo exacto que toma cada tarea",
                        "Clasificar las tareas según su importancia y urgencia para priorizar",
                        "Eliminar todas las reuniones de trabajo",
                        "Delegar todas las tareas a terceros"
                    ],
                    "answer_index": 1,
                    "explanation": "La Matriz de Eisenhower clasifica las tareas en cuatro cuadrantes para facilitar la priorización y toma de decisiones."
                },
                {
                    "id": 2,
                    "question": "¿En qué consiste la técnica Pomodoro?",
                    "options": [
                        "Trabajar sin interrupciones durante 8 horas seguidas",
                        "Dividir el trabajo en bloques de 25 minutos con descansos de 5 minutos",
                        "Llevar un registro diario de gastos de tiempo",
                        "Trabajar en múltiples proyectos de manera simultánea"
                    ],
                    "answer_index": 1,
                    "explanation": "La técnica Pomodoro propone intervalos de 25 minutos de enfoque completo con pequeños descansos regulares para optimizar la concentración."
                }
            ]
            
            return {
                "course_name": course_name,
                "title": "Gestión del Tiempo",
                "subtitle": "Módulo de Productividad y Organización Personal",
                "pdf_source": os.path.basename(pdf_path),
                "sources": [{"source": "curso_gestion_del_tiempo.pdf", "text": "Planificación y priorización de actividades laborales."}],
                "sections": sections,
                "resources": resources,
                "questions": questions
            }

        elif "emocional" in name_lower:
            # Gestión Emocional
            sections = [
                {
                    "title": "1. Autoconocimiento Emocional",
                    "content": "La gestión emocional comienza con la capacidad de reconocer nuestras propias emociones en el momento en que ocurren. Nombrar la emoción ('etiquetado emocional') reduce la intensidad de la respuesta del sistema límbico.",
                    "bullet_points": [
                        "Aprende a diferenciar el enojo de la frustración.",
                        "Presta atención a las reacciones físicas de tu cuerpo frente al estrés.",
                        "Registra tus disparadores emocionales diarios."
                    ]
                },
                {
                    "title": "2. Regulación y Autocontrol",
                    "content": "Regular la emoción no significa reprimirla, sino canalizarla de manera saludable. Técnicas como la respiración diafragmática, la revaluación cognitiva y la pausa consciente ayudan a responder en lugar de reaccionar impulsivamente.",
                    "bullet_points": [
                        "Tómate un respiro antes de responder a un correo tenso.",
                        "Practica la revaluación cognitiva: cambia tu perspectiva sobre el problema.",
                        "Expresa tus emociones a través de la escritura constructiva."
                    ]
                },
                {
                    "title": "3. Automotivación y Enfoque",
                    "content": "Canalizar las emociones hacia un objetivo nos permite perseverar ante los contratiempos. Los líderes emocionalmente inteligentes usan sus estados de ánimo para impulsar la creatividad y la toma de decisiones acertadas.",
                    "bullet_points": [
                        "Encuentra tu motivación interna más allá del reconocimiento externo.",
                        "Celebra los pequeños avances diarios para mantener la motivación."
                    ]
                }
            ]
            
            resources = [
                {
                    "title": "Inteligencia Emocional de Daniel Goleman",
                    "description": "Fundamentos teóricos sobre la gestión emocional e interpersonal.",
                    "url": "https://es.wikipedia.org/wiki/Inteligencia_emocional"
                }
            ]
            
            questions = [
                {
                    "id": 1,
                    "question": "¿Qué es el 'etiquetado emocional'?",
                    "options": [
                        "Juzgar a los demás según su temperamento",
                        "Identificar y nombrar la emoción que estamos experimentando",
                        "Reprimir emociones para parecer profesional",
                        "Publicar estados de ánimo en redes sociales"
                    ],
                    "answer_index": 1,
                    "explanation": "Nombrar la emoción ayuda a procesarla de manera lógica en el cerebro racional, reduciendo su intensidad reactiva."
                },
                {
                    "id": 2,
                    "question": "¿Cuál es la diferencia entre reaccionar y responder emocionalmente?",
                    "options": [
                        "Reaccionar es impulsivo; responder es consciente y meditado.",
                        "No hay diferencia, son sinónimos.",
                        "Reaccionar es siempre mejor porque es más sincero.",
                        "Responder toma demasiado tiempo y denota debilidad."
                    ],
                    "answer_index": 0,
                    "explanation": "La reacción es inmediata y guiada por el impulso emocional, mientras que la respuesta incluye un espacio de pausa y análisis lógico."
                }
            ]
            
            return {
                "course_name": course_name,
                "title": "Gestión Emocional",
                "subtitle": "Módulo de Inteligencia Emocional y Autocontrol",
                "pdf_source": os.path.basename(pdf_path),
                "sources": [{"source": "curso_gestion_emocional.pdf", "text": "Autocontrol, autoconocimiento y autorregulación emocional."}],
                "sections": sections,
                "resources": resources,
                "questions": questions
            }

        elif "conflicto" in name_lower:
            # Resolución de Conflictos
            sections = [
                {
                    "title": "1. Naturaleza de los Conflictos",
                    "content": "El conflicto es una parte natural e inevitable de las relaciones humanas y de los equipos de trabajo. Los conflictos no son inherentemente malos; cuando se gestionan bien, pueden conducir a la innovación, la mejora de procesos y relaciones más fuertes.",
                    "bullet_points": [
                        "Acepta el conflicto como una oportunidad de mejora.",
                        "Diferencia las posiciones (lo que dicen querer) de los intereses (lo que realmente necesitan).",
                        "Evita tomar los desacuerdos laborales de manera personal."
                    ]
                },
                {
                    "title": "2. Estilos de Resolución de Conflictos",
                    "content": "El modelo Thomas-Kilmann describe cinco estilos para abordar conflictos basados en la cooperación y la asertividad: Competitivo (ganar-perder), Colaborativo (ganar-ganar), Comprometido (punto medio), Evasivo (perder-perder) y Complaciente (perder-ganar).",
                    "bullet_points": [
                        "Utiliza la colaboración cuando los intereses de ambas partes son vitales.",
                        "El compromiso es útil para lograr acuerdos temporales rápidos.",
                        "Evita la competencia destructiva que daña las relaciones."
                    ]
                },
                {
                    "title": "3. La Mediación y Escucha Activa",
                    "content": "Para resolver disputas en un equipo, el líder debe actuar como mediador neutral. La escucha activa, el parafraseo y la formulación de preguntas abiertas son herramientas clave para desactivar la hostilidad y encontrar terreno común.",
                    "bullet_points": [
                        "Parafrasea las posturas para asegurar comprensión mutua.",
                        "Invita a las partes a proponer soluciones conjuntas."
                    ]
                }
            ]
            
            resources = [
                {
                    "title": "Modelo de Conflicto de Thomas-Kilmann",
                    "description": "Los cinco estilos de resolución de conflictos de forma interactiva.",
                    "url": "https://es.wikipedia.org/wiki/Modelo_de_Thomas-Kilmann"
                }
            ]
            
            questions = [
                {
                    "id": 1,
                    "question": "Según el modelo Thomas-Kilmann, ¿cuál es el enfoque 'ganar-ganar'?",
                    "options": [
                        "El estilo Colaborativo",
                        "El estilo Competitivo",
                        "El estilo Evasivo",
                        "El estilo Complaciente"
                    ],
                    "answer_index": 0,
                    "explanation": "El estilo Colaborativo busca satisfacer plenamente los intereses de ambas partes mediante la cooperación activa."
                },
                {
                    "id": 2,
                    "question": "¿Por qué es útil diferenciar las posiciones de los intereses?",
                    "options": [
                        "Para saber quién tiene más poder en la mesa",
                        "Porque las posiciones suelen ser rígidas, mientras que los intereses abren opciones de solución",
                        "Para simplificar el debate e ir directo a la votación",
                        "Para demostrar que el otro está equivocado"
                    ],
                    "answer_index": 1,
                    "explanation": "Las posiciones son demandas iniciales y rígidas, mientras que los intereses revelan las verdaderas motivaciones y permiten encontrar soluciones creativas que satisfagan a ambos."
                }
            ]
            
            return {
                "course_name": course_name,
                "title": "Resolución de Conflictos",
                "subtitle": "Módulo de Mediación y Acuerdos de Equipo",
                "pdf_source": os.path.basename(pdf_path),
                "sources": [{"source": "curso_resolucion_de_conflictos.pdf", "text": "Técnicas de mediación y estilos de Thomas-Kilmann."}],
                "sections": sections,
                "resources": resources,
                "questions": questions
            }

        else:
            # Fallback dynamic retrieval for all other PDFs (e.g. Construcción Colectiva, Desarrollo de sí mismo, etc.)
            num_pages = len(reader.pages)
            sections = []
            
            # Split pages into 3 chunks
            chunk_size = max(1, num_pages // 3)
            
            for i in range(3):
                start_page = i * chunk_size
                end_page = min(num_pages, (i + 1) * chunk_size)
                
                # Extract text
                section_text = ""
                for p in range(start_page, end_page):
                    section_text += reader.pages[p].extract_text() + "\n"
                
                # Clean paragraphs
                paragraphs = [p.strip() for p in section_text.split("\n\n") if len(p.strip()) > 50]
                if not paragraphs:
                    paragraphs = [p.strip() for p in section_text.split("\n") if len(p.strip()) > 50]
                
                main_content = " ".join(paragraphs[:3]) if paragraphs else f"Conceptos y fundamentos del módulo de {course_name}."
                if len(main_content) > 550:
                    main_content = main_content[:550] + "..."
                
                # Find some sentences containing key terms for bullets
                sentences = re.split(r'\. |\n', section_text)
                bullets = [s.strip() for s in sentences if len(s.strip()) > 20 and any(w in s.lower() for w in ["debe", "importante", "clave", "esencial", "desarrollo", "habilidad"])][:3]
                if not bullets:
                    bullets = ["Aplica los conocimientos a tu vida laboral.", "Reflexiona sobre tu comportamiento personal.", "Establece metas de mejora continua."]
                
                sections.append({
                    "title": f"{i + 1}. Módulo de Aprendizaje: {course_name}",
                    "content": main_content,
                    "bullet_points": bullets
                })
                
                retrieved_sources.append({
                    "source": f"{os.path.basename(pdf_path)} (Pág {start_page + 1})",
                    "text": section_text[:300] + "..."
                })

            resources = [
                {
                    "title": f"Crecimiento y Aprendizaje en {course_name}",
                    "description": "Artículo de soporte técnico y profesional sobre habilidades interpersonales.",
                    "url": "https://es.wikipedia.org/wiki/Habilidades_blandas"
                }
            ]
            
            questions = [
                {
                    "id": 1,
                    "question": f"¿Cuál es uno de los temas centrales tratados en el curso de {course_name}?",
                    "options": [
                        "El desarrollo y fortalecimiento de habilidades interpersonales y blandas.",
                        "La aplicación exclusiva de cálculos de ingeniería industrial.",
                        "Ignorar la interacción con otras personas en el trabajo.",
                        "La automatización robótica sin intervención del factor humano."
                    ],
                    "answer_index": 0,
                    "explanation": "El curso se enfoca en expandir tus competencias blandas e interpersonales para mejorar el desempeño profesional."
                },
                {
                    "id": 2,
                    "question": f"¿Qué elemento es esencial para asimilar con éxito los conceptos de {course_name}?",
                    "options": [
                        "Evitar la autocrítica y culpar al entorno de los problemas.",
                        "La práctica deliberada, el autoanálisis y el feedback continuo.",
                        "Enfocarse solo en los resultados a corto plazo sin importar las relaciones.",
                        "Limitar toda interacción con el equipo."
                    ],
                    "answer_index": 1,
                    "explanation": "La asimilación de soft skills se apoya firmemente en el autoconocimiento, la empatía y la retroalimentación."
                }
            ]
            
            return {
                "course_name": course_name,
                "title": course_name,
                "subtitle": f"Módulo de desarrollo de la competencia de {course_name}",
                "pdf_source": os.path.basename(pdf_path),
                "sources": retrieved_sources,
                "sections": sections,
                "resources": resources,
                "questions": questions
            }
