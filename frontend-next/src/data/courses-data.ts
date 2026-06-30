import type { CoursesData } from "@/types/courses";

export const COURSES_DATA: CoursesData = {
  "Comunicacion Asertiva": {
    description:
      "Domina el arte de expresar tus ideas con claridad, respeto y confianza. Aprende a comunicarte de forma efectiva en cualquier situación.",
    icon: "message-circle",
    color: "course-blue",
    content: {
      title: "Contenido del Curso",
      sections: [
        {
          heading: "¿Qué es la Comunicación Asertiva?",
          text: "La comunicación asertiva es la capacidad de expresar pensamientos, sentimientos y necesidades de manera directa, honesta y respetuosa. Se diferencia de la pasividad (no expresar lo que se piensa) y de la agresividad (expresarlo sin respeto al otro). La asertividad es una habilidad que se puede aprender y practicar.",
        },
        {
          heading: "Proceso de la Comunicación",
          text: "La comunicación involucra un proceso completo: emisor, mensaje, canal, receptor y retroalimentación. Los elementos clave incluyen los pensamientos, los sentimientos y las conductas. La comunicación asertiva busca que el mensaje llegue de forma clara y respetuosa, minimizando malentendidos y maximizando la comprensión mutua.",
        },
        {
          heading: "Componentes de la Comunicación",
          text: "La comunicación asertiva involucra tres canales simultáneos: el verbal (las palabras que elegimos), el paraverbal (el tono, ritmo y volumen de la voz) y el no verbal (lenguaje corporal, expresiones faciales). La coherencia entre estos tres canales es clave para ser percibido como asertivo.",
        },
        {
          heading: "Técnicas de Comunicación Asertiva",
          text: "Existen diversas técnicas poderosas: el Mensaje Yo (expresar desde la primera persona), la técnica del sándwich (retroalimentación constructiva), la negociación asertiva y la pregunta asertiva. Estas herramientas permiten expresar lo que necesitas sin generar conflicto, facilitando diálogos productivos en el ámbito personal y profesional.",
        },
        {
          heading: "Comunicación en el Ámbito Laboral",
          text: "En el entorno laboral, la comunicación asertiva es esencial para gestionar reuniones, dar y recibir retroalimentación, manejar desacuerdos y construir relaciones profesionales sólidas. Aprender a decir 'no' de forma asertiva, expresar un desacuerdo sin generar conflicto y manejar quejas y sugerencias son habilidades fundamentales para el éxito profesional.",
        },
      ],
    },
    resources: [
      { type: "pdf", name: "Curso de Comunicación Asertiva", file: "curso_comunicacion_asertiva.pdf" },
      { type: "youtube", name: "¿Qué es la Comunicación Asertiva?", url: "https://www.youtube.com/watch?v=HOPwDKqjyxM" },
      { type: "youtube", name: "Técnicas de Comunicación Asertiva", url: "https://www.youtube.com/watch?v=SzUMmcC2hOY" },
      { type: "youtube", name: "Cómo Decir NO de Forma Asertiva", url: "https://www.youtube.com/watch?v=BIcC2HPnHBo" },
    ],
    evaluation: {
      title: "Evaluación de Comunicación Asertiva",
      passScore: 70,
      questions: [
        {
          question: "¿Cuál es la diferencia principal entre comunicación asertiva y agresiva?",
          options: [
            "La asertiva es callar y la agresiva es gritar",
            "La asertiva expresa con respeto, la agresiva sin respeto al otro",
            "No hay diferencia",
            "La asertiva es para debilidad, la agresiva es para fuertes",
          ],
          correct: 1,
        },
        {
          question: "¿Cuáles son los tres canales de la comunicación asertiva?",
          options: [
            "Escrito, oral y digital",
            "Verbal, paraverbal y no verbal",
            "Formal, informal y social",
            "Personal, grupal y masiva",
          ],
          correct: 1,
        },
        {
          question: "¿Qué es el Mensaje Yo?",
          options: [
            "Un mensaje que culpa al otro",
            "Una técnica para expresar desde la primera persona sin culpar",
            "Un tipo de mensaje agresivo",
            "Una forma de decir que no",
          ],
          correct: 1,
        },
        {
          question: '¿Cuál es la técnica del "sándwich" en la retroalimentación?',
          options: [
            "Dar solo críticas negativas",
            "Alternar halago, corrección y halago",
            "Decir solo cosas positivas",
            "No dar retroalimentación",
          ],
          correct: 1,
        },
        {
          question: "¿Por qué es importante la coherencia entre los canales de comunicación?",
          options: [
            "Para que el mensaje sea más largo",
            "Para que el receptor confíe en lo que decimos",
            "Para demostrar que sabemos hablar",
            "No es importante",
          ],
          correct: 1,
        },
        {
          question: "¿Cuáles son los tres estilos básicos de comunicación?",
          options: [
            "Formal, informal y técnica",
            "Pasiva, agresiva y asertiva",
            "Verbal, no verbal y escrita",
            "Personal, grupal y masiva",
          ],
          correct: 1,
        },
        {
          question: "¿En qué porcentaje del tiempo dedicamos la comunicación a escuchar?",
          options: ["El 22%", "El 23%", "El 55%", "El 75%"],
          correct: 2,
        },
        {
          question: '¿Qué es la técnica del "disco rayado" en la comunicación asertiva?',
          options: [
            "Repetir una canción varias veces",
            "La repetición ecuánime de una frase que exprese claramente lo que deseamos",
            "Cambiar de tema constantemente",
            "Gritar para hacerse escuchar",
          ],
          correct: 1,
        },
        {
          question: '¿Cuáles son las tres "C" de la calidad en el servicio?',
          options: [
            "Credibilidad, Capacidad y Compromiso",
            "Compromiso, Capacidad y Comunicación",
            "Cortesía, Celeridad y Calidez",
            "Creatividad, Constancia y Confianza",
          ],
          correct: 1,
        },
      ],
    },
  },

  "Construccion Colectiva": {
    description:
      "Colabora de manera efectiva para alcanzar objetivos comunes. Aprende a construir equipos cohesionados y productivos.",
    icon: "user-plus",
    color: "course-yellow",
    content: {
      title: "Contenido del Curso",
      sections: [
        {
          heading: "La Construcción Colectiva del Conocimiento",
          text: "La construcción colectiva es un proceso de enseñanza y aprendizaje donde los aprendices son sujetos activos que transforman y conservan la cultura mediante la interacción social. Los intercambios estimulantes y activos entre maestro y alumno son fundamentales para aprender a pensar.",
        },
        {
          heading: "Aprendizaje Colaborativo",
          text: "Las actividades grupales constituyen uno de los medios más acertados para aprender a pensar sobre el pensamiento, y de esta forma tener alumnos independientes capaces de construir juicios. Los intercambios dentro del salón deben estimular el aprendizaje de contenidos y enseñar a pensar.",
        },
        {
          heading: "Dinámicas de Equipo",
          text: "Los equipos pasan por fases de desarrollo: formación, tormenta, normación y desempeño. Comprender estas fases permite al equipo navegar los conflictos y alcanzar un alto rendimiento. La confianza mutua, los roles definidos y la comunicación efectiva son pilares del trabajo en equipo exitoso.",
        },
        {
          heading: "Comunicación y Colaboración",
          text: "La comunicación es el pegamento del equipo. Sin comunicación efectiva, los equipos se fragmentan. Aprender a escuchar activamente, dar feedback constructivo y alinear expectativas es fundamental para la colaboración.",
        },
        {
          heading: "Construcción Colectiva en la Organización",
          text: "En el ámbito organizacional, la construcción colectiva implica crear conocimiento compartido a través de la interacción social. Las comunidades de práctica y aprendizaje permiten que los miembros compartan experiencias, resuelvan problemas juntos y generen soluciones innovadoras.",
        },
      ],
    },
    resources: [
      { type: "pdf", name: "La Construcción Colectiva del Conocimiento", file: "curso_construccion_colectiva.pdf" },
      { type: "youtube", name: "Trabajo en Equipo Efectivo", url: "https://www.youtube.com/watch?v=8BvJq1gDb3M" },
      { type: "youtube", name: "Fases del Desarrollo de un Equipo", url: "https://www.youtube.com/watch?v=Uz7Sfz1cFMg" },
      { type: "youtube", name: "Aprendizaje Colaborativo", url: "https://www.youtube.com/watch?v=vLHxjKv4Jn8" },
    ],
    evaluation: {
      title: "Evaluación de Trabajo en Equipo",
      passScore: 70,
      questions: [
        {
          question: "¿Qué es la construcción colectiva del conocimiento?",
          options: [
            "Copiar el trabajo de otros",
            "Un proceso donde el conocimiento se crea a través de la interacción social",
            "Estudiar solo",
            "Memorizar información",
          ],
          correct: 1,
        },
        {
          question: "¿Cuáles son las fases del desarrollo de un equipo?",
          options: [
            "Inicio, desarrollo, cierre",
            "Formación, tormenta, normación, desempeño",
            "Planeación, ejecución, control",
            "Ninguna de las anteriores",
          ],
          correct: 1,
        },
        {
          question: "¿Por qué es importante la comunicación en el equipo?",
          options: [
            "No es importante",
            "Es el pegamento que mantiene unido al equipo",
            "Solo para repartir tareas",
            "Para que todos opinen lo mismo",
          ],
          correct: 1,
        },
        {
          question: "¿Qué diferencia hay entre aprendizaje individual y colaborativo?",
          options: [
            "No hay diferencia",
            "El colaborativo es más lento pero más rico en perspectivas",
            "El individual es siempre mejor",
            "El colaborativo es solo para niños",
          ],
          correct: 1,
        },
        {
          question: "¿Qué son las comunidades de práctica?",
          options: [
            "Grupos de estudio tradicionales",
            "Grupos donde los miembros comparten experiencias y resuelven problemas juntos",
            "Clases en línea",
            "Redes sociales",
          ],
          correct: 1,
        },
        {
          question: "¿Qué es la construcción colectiva en el ámbito educativo?",
          options: [
            "Cuando cada estudiante trabaja individualmente",
            "Un proceso donde maestro y alumnos se relacionan interactivamente para transformar y reconstruir conocimiento",
            "La acumulación de trabajos individuales de los alumnos",
            "Un método donde solo el maestro explica",
          ],
          correct: 1,
        },
        {
          question: "¿Por qué las actividades grupales son importantes para aprender a pensar?",
          options: [
            "Porque son más fáciles que las individuales",
            "Porque permiten construir juicios y desarrollar habilidades de razonamiento de manera independiente",
            "Porque reducen el tiempo de enseñanza",
            "Porque evitan los conflictos en el aula",
          ],
          correct: 1,
        },
        {
          question: "¿Cuál es la doble tarea del maestro en la construcción colectiva?",
          options: [
            "Enseñar contenido y calificar exámenes",
            'El "pensar sobre el tema" y el "pensar sobre el pensamiento"',
            "Dar clases y vigilar el salón",
            "Explicar y repetir los mismos contenidos",
          ],
          correct: 1,
        },
        {
          question: '¿Qué sucede cuando un maestro reduce el intercambio interactivo a solo algunos alumnos?',
          options: [
            "Se mejora la calidad de la enseñanza",
            'El resto del grupo queda en calidad de "espectadores"',
            "Se logra un aprendizaje más profundo",
            "Los alumnos aprenden más rápido",
          ],
          correct: 1,
        },
      ],
    },
  },

  "Desarrollo de Si mismo": {
    description:
      "Explora el autoconocimiento, la autoestima y el crecimiento personal como base para el desempeño profesional y el bienestar integral.",
    icon: "user",
    color: "course-teal",
    content: {
      title: "Contenido del Curso",
      sections: [
        {
          heading: "Autoconocimiento: el punto de partida",
          text: "El autoconocimiento es la capacidad de reconocer nuestras emociones, pensamientos, fortalezas, debilidades, valores y motivaciones. Es la base del desarrollo personal y profesional. Conocerse a uno mismo permite tomar decisiones más alineadas con quiénes somos y qué queremos, y nos hace más auténticos en las relaciones.",
        },
        {
          heading: "Autoestima y autoimagen",
          text: "La autoestima es la valoración que hacemos de nosotros mismos. Una autoestima saludable no significa creer que somos perfectos, sino aceptarnos con nuestras virtudes y áreas de mejora. La autoimagen influye en cómo nos relacionamos, cómo enfrentamos retos y cómo respondemos a la crítica. Cultivarla requiere práctica y autocompasión.",
        },
        {
          heading: "Valores y propósito personal",
          text: "Los valores son los principios que guían nuestras decisiones y comportamientos. Identificar los propios valores ayuda a vivir de forma coherente y a encontrar sentido en el trabajo y la vida. El propósito personal —el 'para qué' de lo que hacemos— es un motor de motivación profunda y sostenida que va más allá de los objetivos inmediatos.",
        },
        {
          heading: "Hábitos y disciplina personal",
          text: "El desarrollo personal requiere constancia. Los hábitos son rutinas automatizadas que, bien elegidas, nos llevan gradualmente hacia nuestros objetivos. La disciplina no es rigidez: es la capacidad de mantener el rumbo incluso cuando la motivación fluctúa. La planificación, el autocuidado y la gestión del tiempo son pilares de la disciplina personal.",
        },
        {
          heading: "Crecimiento continuo y mentalidad de desarrollo",
          text: "La mentalidad de crecimiento (growth mindset) es la creencia de que nuestras habilidades pueden desarrollarse con esfuerzo y aprendizaje. Contrasta con la mentalidad fija, que asume que las capacidades son estáticas. Adoptar una mentalidad de crecimiento nos hace más resilientes ante el fracaso, más curiosos ante los retos y más abiertos al aprendizaje permanente.",
        },
      ],
    },
    resources: [
      { type: "pdf", name: "Desarrollo de Sí Mismo", file: "curso_desarrollo_de_si_mismo.pdf" },
      { type: "youtube", name: "Cómo desarrollarte como persona — Claves prácticas", url: "https://www.youtube.com/watch?v=M1CHPnZfFmU" },
    ],
    evaluation: {
      title: "Evaluación de Desarrollo de Sí mismo",
      passScore: 70,
      questions: [
        {
          question: "¿Qué es el autoconocimiento?",
          options: [
            "Conocer las debilidades de los demás para compararlas con las propias",
            "La capacidad de reconocer nuestras emociones, fortalezas y valores",
            "El proceso de imitar a personas exitosas",
            "Memorizar teorías psicológicas sobre la personalidad",
          ],
          correct: 1,
        },
        {
          question: "Una autoestima saludable implica:",
          options: [
            "Creer que uno es superior a los demás",
            "Nunca cometer errores ni tener dudas",
            "Aceptarse con virtudes y áreas de mejora",
            "Depender de la validación externa para sentirse bien",
          ],
          correct: 2,
        },
        {
          question: "¿Qué es la mentalidad de crecimiento (growth mindset)?",
          options: [
            "Creer que el talento es innato y no se puede cambiar",
            "Enfocarse solo en las metas económicas",
            "La creencia de que las habilidades se desarrollan con esfuerzo y aprendizaje",
            "Evitar todo tipo de fracaso para proteger la autoestima",
          ],
          correct: 2,
        },
        {
          question: "¿Para qué sirve identificar los propios valores?",
          options: [
            "Para imponerlos a los demás",
            "Para vivir de forma coherente y encontrar sentido en lo que hacemos",
            "Para evitar tomar decisiones difíciles",
            "No tienen impacto en el desarrollo profesional",
          ],
          correct: 1,
        },
        {
          question: "¿Cuál es la diferencia entre disciplina y rigidez?",
          options: [
            "No existe diferencia, ambas implican seguir reglas estrictas",
            "La disciplina requiere ausencia total de descanso",
            "La disciplina es mantener el rumbo con flexibilidad; la rigidez no se adapta al cambio",
            "La rigidez es más efectiva para lograr objetivos a largo plazo",
          ],
          correct: 2,
        },
      ],
    },
  },

  "Flexibilidad y Adaptabilidad": {
    description:
      "Desbloquea tu potencial creativo para resolver problemas de forma innovadora. Aprende a pensar fuera de lo convencional.",
    icon: "lightbulb",
    color: "course-orange",
    content: {
      title: "Contenido del Curso",
      sections: [
        {
          heading: "Flexibilidad Laboral y Adaptación Tecnológica",
          text: "Vivimos en una revolución tecnológica que ha transformado la manera en que trabajamos. La flexibilidad laboral y la adaptación al presente tecnológico son habilidades fundamentales. Los factores que impulsaron esta revolución incluyen la digitalización, la globalización y la necesidad de respuestas ágiles.",
        },
        {
          heading: "Flexibilidad Psicológica",
          text: "El modelo Hexaflex describe seis procesos de la flexibilidad psicológica: aceptación, descontacto cognitivo, atención plena, yo como contexto, valores y acción comprometida. Esta flexibilidad permite adaptarse al cambio, manejar la incertidumbre y mantener el bienestar en entornos laborales cambiantes.",
        },
        {
          heading: "Innovación y Teletrabajo",
          text: "El teletrabajo es una manifestación de la flexibilidad laboral que ha crecido exponencialmente. Requiere habilidades de autorregulación, gestión del tiempo y comunicación digital efectiva. La innovación surge cuando combinamos flexibilidad tecnológica con creatividad para resolver problemas de manera novedosa.",
        },
        {
          heading: "Herramientas de Pensamiento Creativo",
          text: "Existen diversas herramientas que estructuran el proceso creativo: Design Thinking (empatizar, definir, idear, prototipar, testar), brainstorming, mapas mentales, la técnica SCAMPER (Sustituir, Combinar, Adaptar, Modificar, Poner en otros usos, Eliminar, Reorganizar) y el pensamiento lateral.",
        },
        {
          heading: "Innovación en el Entorno Laboral",
          text: "La innovación no es solo para departamentos de I+D. Cada profesional puede innovar en su área. La adaptabilidad al cambio tecnológico, la flexibilidad laboral y la apertura al aprendizaje continuo son clave para mantenerse relevante. La innovación incremental mejora procesos existentes, mientras que la disruptiva crea nuevos mercados.",
        },
      ],
    },
    resources: [
      { type: "pdf", name: "Flexibilidad Laboral y Adaptación Tecnológica", file: "curso_flexibilidad_adaptabilidad.pdf" },
      { type: "youtube", name: "¿Qué es el Design Thinking?", url: "https://www.youtube.com/watch?v=JLwHjwslnOQ" },
      { type: "youtube", name: "Técnica SCAMPER para Creatividad", url: "https://www.youtube.com/watch?v=8nZBDFvRwOQ" },
      { type: "youtube", name: "Innovación en el Trabajo", url: "https://www.youtube.com/watch?v=DQrFu8dYMIc" },
    ],
    evaluation: {
      title: "Evaluación de Creatividad e Innovación",
      passScore: 70,
      questions: [
        {
          question: "¿Qué es la flexibilidad laboral?",
          options: [
            "Trabajar horas extra sin pago",
            "Capacidad de adaptarse a diferentes formas de organizar el trabajo",
            "No tener horario fijo",
            "Trabajar desde casa siempre",
          ],
          correct: 1,
        },
        {
          question: "¿Qué significa SCAMPER en la técnica creativa?",
          options: [
            "Un tipo de lluvia de ideas",
            "Sustituir, Combinar, Adaptar, Modificar, Poner en otros usos, Eliminar, Reorganizar",
            "Un software de diseño",
            "Una marca de productos creativos",
          ],
          correct: 1,
        },
        {
          question: "¿Cuáles son las fases del Design Thinking?",
          options: [
            "Planificar, ejecutar, medir",
            "Empatizar, definir, idear, prototipar, testar",
            "Pensar, crear, vender",
            "Investigar, desarrollar, lanzar",
          ],
          correct: 1,
        },
        {
          question: "¿Qué es la flexibilidad psicológica?",
          options: [
            "No tener opiniones fijas",
            "Capacidad de adaptarse mentalmente al cambio y la incertidumbre",
            "Ser indiferente a todo",
            "Cambiar de opinión constantemente",
          ],
          correct: 1,
        },
        {
          question: "¿Cuál es la diferencia entre innovación incremental y disruptiva?",
          options: [
            "No hay diferencia",
            "La incremental mejora lo existente, la disruptiva crea algo nuevo",
            "La disruptiva es para grandes empresas",
            "La incremental es más cara",
          ],
          correct: 1,
        },
        {
          question: "¿Qué significa el acrónimo VUCA en el entorno laboral?",
          options: [
            "Voluntad, Unidad, Creatividad, Acción",
            "Volátil, Ambiguo, Incierto y Complejo",
            "Visión, Urgencia, Capacidad, Adaptación",
            "Valor, Utilidad, Calidad, Aplicación",
          ],
          correct: 1,
        },
        {
          question: "¿Cuántos componentes tiene el modelo Hexaflex de flexibilidad psicológica?",
          options: ["Cuatro", "Cinco", "Seis", "Siete"],
          correct: 2,
        },
        {
          question: "¿Qué es la flexibilidad psicológica?",
          options: [
            "La capacidad de cambiar de personalidad constantemente",
            "La capacidad de alterar la función de experiencias internas respondiendo flexiblemente a pensamientos y sentimientos negativos",
            "La habilidad de evitar todo tipo de problemas",
            "La capacidad de no sentir emociones negativas",
          ],
          correct: 1,
        },
        {
          question: "¿Qué factor impulsó significativamente la adopción del teletrabajo a nivel mundial?",
          options: [
            "El deseo de los trabajadores de no ir a la oficina",
            "La pandemia mundial originada por el COVID-19",
            "La falta de oficinas disponibles",
            "Las leyes gubernamentales que lo obligaron",
          ],
          correct: 1,
        },
      ],
    },
  },

  "Gestion del Tiempo": {
    description:
      "Optimiza tu productividad y reduce el estrés laboral mediante técnicas efectivas de organización y planificación del tiempo.",
    icon: "timer",
    color: "course-cyan",
    content: {
      title: "Contenido del Curso",
      sections: [
        {
          heading: "Las Razones del Éxito",
          text: "La gestión eficaz del tiempo es una de las razones del éxito personal y profesional. Los pilares son: saber qué queremos (claridad de objetivos), establecer un plan de acción, concentrar esfuerzos en lo que realmente importa, y comprender que hacer bien lo que se hace es más importante que hacer muchas cosas.",
        },
        {
          heading: "Autocontrol de Pensamientos",
          text: "La dispersión de pensamiento, la procrastinación y la falta de prioridades son los principales ladrones de tiempo. El autocontrol permite anticipar el esfuerzo y costo de cada actividad. La anticipación de esfuerzo y costo, la falta de previsión y supervisión, y la postergación son patrones que debemos identificar y modificar.",
        },
        {
          heading: "Planificación y Programación",
          text: "La planificación define QUÉ queremos lograr, la programación define CÓMO y CUÁNDO lo haremos. Las normas para programar el tiempo incluyen: establecer prioridades, definir plazos realistas, asignar recursos y prever obstáculos. Las técnicas como la matriz de Eisenhower, el time blocking y la regla 80/20 son herramientas fundamentales.",
        },
        {
          heading: "Leyes del Tiempo y Ladrones de Tiempo",
          text: "Existen leyes naturales del tiempo que debemos respetar: la ley de Parkinson (el trabajo se expande para llenar el tiempo disponible), la ley de los rendimientos marginales decrecientes y la ley del caos. Los ladrones de tiempo incluyen interrupciones, teléfono, reuniones innecesarios y falta de objetivos claros.",
        },
        {
          heading: "Gestión Anticipativa y Reactiva",
          text: "La gestión anticipativa implica planificar y prevenir problemas antes de que ocurran. La gestión reactiva responde a situaciones ya presentes. El equilibrio entre ambas es clave: debemos ser proactivos sin perder la capacidad de respuesta. La gestión eficaz del tiempo reduce el estrés y mejora la productividad.",
        },
      ],
    },
    resources: [
      { type: "pdf", name: "Gestión Eficaz del Tiempo", file: "curso_gestion_del_tiempo.pdf" },
      { type: "youtube", name: "Técnica Pomodoro Explicada", url: "https://www.youtube.com/watch?v=Fk2KLqTK1hU" },
      { type: "youtube", name: "Matriz de Eisenhower", url: "https://www.youtube.com/watch?v=7FJLrY3z3eY" },
      { type: "youtube", name: "Cómo Vencer la Procrastinación", url: "https://www.youtube.com/watch?v=mhFQW4ebRcQ" },
    ],
    evaluation: {
      title: "Evaluación de Gestión del Tiempo",
      passScore: 70,
      questions: [
        {
          question: "¿Cuáles son los pilares de la gestión eficaz del tiempo?",
          options: [
            "Trabajar más horas",
            "Claridad de objetivos, plan de acción, concentrar esfuerzos, hacer bien lo que se hace",
            "Hacer muchas cosas a la vez",
            "No descansar",
          ],
          correct: 1,
        },
        {
          question: "¿Qué es la técnica Pomodoro?",
          options: [
            "Una receta de cocina",
            "Trabajar en intervalos de 25 minutos con descansos",
            "Una forma de medir el tiempo",
            "Un tipo de reunión",
          ],
          correct: 1,
        },
        {
          question: "¿Qué dice la Ley de Parkinson?",
          options: [
            "El tiempo vuela cuando te diviertes",
            "El trabajo se expande para llenar el tiempo disponible",
            "Más tiempo = mejor resultado",
            "No hay leyes del tiempo",
          ],
          correct: 1,
        },
        {
          question: "¿Qué es la gestión anticipativa?",
          options: [
            "Esperar a que pasen las cosas",
            "Planificar y prevenir problemas antes de que ocurran",
            "Reaccionar rápidamente",
            "No planificar nada",
          ],
          correct: 1,
        },
        {
          question: "¿Cuál de estos es un ladrón de tiempo?",
          options: [
            "Planificar el día",
            "Interrupciones frecuentes",
            "Establecer prioridades",
            "Descansar adecuadamente",
          ],
          correct: 1,
        },
        {
          question: "¿Cuál es la diferencia entre eficiencia y eficacia?",
          options: [
            "Son conceptos exactamente iguales",
            "La eficiencia hace bien lo que se hace; la eficacia hace lo que se debe hacer",
            "La eficacia se centra en el método; la eficiencia en el fin",
            "La eficiencia es más importante que la eficacia",
          ],
          correct: 1,
        },
        {
          question: "¿Qué dice la Ley de Parkinson sobre las tareas?",
          options: [
            "Las tareas se completan más rápido de lo esperado",
            "Toda tarea se dilata indefinidamente hasta ocupar todo el tiempo disponible",
            "Las tareas importantes siempre se hacen primero",
            "El tiempo no afecta la calidad del trabajo",
          ],
          correct: 1,
        },
        {
          question: "¿Cuál es el porcentaje máximo de tiempo que se recomienda programar?",
          options: ["El 100% del tiempo", "El 50% del tiempo", "El 70% del tiempo", "El 90% del tiempo"],
          correct: 2,
        },
        {
          question: "¿Cuál es el criterio correcto para establecer prioridades?",
          options: ["Lo más fácil de hacer", "Lo más corto", "Lo más urgente", "Lo más importante"],
          correct: 3,
        },
      ],
    },
  },

  "Gestion Emocional": {
    description:
      "Gestiona tus emociones para un mejor bienestar personal y profesional. Aprende a reconocer, comprender y regular tus emociones.",
    icon: "heart",
    color: "course-purple",
    content: {
      title: "Contenido del Curso",
      sections: [
        {
          heading: "¿Qué es la Gestión Emocional?",
          text: "La gestión emocional hace referencia a la toma de conciencia de las propias emociones, a la aceptación de las mismas y a su correspondiente regulación. Las emociones son estados psicológicos complejos influidos por la experiencia personal, originados en respuesta a un acontecimiento interno o externo.",
        },
        {
          heading: "Autoconocimiento: Nuestro Universo Interno",
          text: "El autoconocimiento es la capacidad de dirigir la atención hacia uno mismo y tomar conciencia de diferentes aspectos de la identidad, así como de nuestras emociones, pensamientos y conductas. Se basa en tres pilares: la identidad y las metas, el desarrollo de la atención y la conciencia de las emociones.",
        },
        {
          heading: "Componentes de la Inteligencia Emocional",
          text: "Según Daniel Goleman, la inteligencia emocional incluye: autoconocimiento (conocer nuestras propias emociones), autorregulación (manejar nuestras reacciones), motivación (impulso interno), empatía (comprender las emociones de los demás) y habilidades sociales (construir relaciones).",
        },
        {
          heading: "Gestión Emocional en la Práctica",
          text: "Las emociones nos aportan información y nos impulsan a actuar. En función de cómo pensemos o interpretemos la realidad, así nos sentiremos y actuaremos. Gestionar nuestras emociones contribuye a mejorar nuestra autoestima y a relacionarnos con los demás de manera más saludable.",
        },
        {
          heading: "Emociones y Bienestar",
          text: "Lograr una adecuada gestión emocional contribuye a que seamos más felices. Las emociones cumplen una función informativa y motivadora. La gestión emocional nos ayuda a mantener la calma, responder en lugar de reaccionar y construir relaciones más sanas y productivas.",
        },
      ],
    },
    resources: [
      { type: "pdf", name: "Gestión Emocional", file: "curso_gestion_emocional.pdf" },
      { type: "pdf", name: "Inteligencia Emocional - Daniel Goleman", file: "Goleman Daniel Inteligencia Emocional.pdf" },
      { type: "youtube", name: "Inteligencia Emocional - Daniel Goleman", url: "https://www.youtube.com/watch?v=6PSs2P5Cz5M" },
      { type: "youtube", name: "¿Qué es la Gestión Emocional?", url: "https://www.youtube.com/watch?v=RbGfVfT3lWE" },
    ],
    evaluation: {
      title: "Evaluación de Inteligencia Emocional",
      passScore: 70,
      questions: [
        {
          question: "¿Qué es la gestión emocional?",
          options: [
            "No sentir emociones",
            "Tomar conciencia, aceptar y regular nuestras emociones",
            "Expresar todas las emociones sin filtro",
            "Ignorar lo que sentimos",
          ],
          correct: 1,
        },
        {
          question: "¿Cuáles son los tres componentes de una emoción según el texto?",
          options: [
            "Pensamiento, acción, resultado",
            "Experiencia subjetiva, respuesta fisiológica, respuesta conductual",
            "Razón, intuición, sentimiento",
            "Cuerpo, mente, espíritu",
          ],
          correct: 1,
        },
        {
          question: "¿Qué pilares fundamenta el autoconocimiento?",
          options: [
            "Memoria, lógica, creatividad",
            "Identidad y metas, desarrollo de la atención, conciencia emocional",
            "Trabajo, descanso, diversión",
            "Familia, amigos, pareja",
          ],
          correct: 1,
        },
        {
          question: "¿Cuáles son los 5 componentes de la inteligencia emocional según Goleman?",
          options: [
            "Memoria, concentración, análisis, síntesis, evaluación",
            "Autoconocimiento, autorregulación, motivación, empatía, habilidades sociales",
            "Visión, misión, valores, objetivos, metas",
            "Ninguna de las anteriores",
          ],
          correct: 1,
        },
        {
          question: "¿Por qué son importantes las emociones en nuestra vida?",
          options: [
            "No son importantes",
            "Nos aportan información y nos impulsan a actuar",
            "Solo sirven para problemas",
            "Debemos controlarlas completamente",
          ],
          correct: 1,
        },
        {
          question: "¿Qué componentes interactúan en una emoción?",
          options: [
            "Solo pensamientos racionales",
            "Experiencia subjetiva, respuesta fisiológica y respuesta conductual",
            "Solo respuestas físicas del cuerpo",
            "Solo el estado de ánimo",
          ],
          correct: 1,
        },
        {
          question: "¿Cuál es el primer paso para una adecuada gestión emocional?",
          options: [
            "Reprimir las emociones negativas",
            "Poner nombre a la emoción que estamos experimentando",
            "Evitar cualquier situación que genere emociones",
            "Actuar inmediatamente según la emoción",
          ],
          correct: 1,
        },
        {
          question: "¿Qué es la resiliencia?",
          options: [
            "La capacidad de no sentir nunca emociones negativas",
            "La capacidad de afrontar las adversidades y adaptarse sin salir debilitados",
            "Evitar los problemas esperando que se resuelvan solos",
            "La habilidad de controlar las emociones de los demás",
          ],
          correct: 1,
        },
        {
          question: "¿Cuál es la función de las emociones?",
          options: [
            "Obstaculizar el pensamiento racional",
            "Solo generar sufrimiento",
            "Ser una señal, prepararnos para la acción, vigilar relaciones y evaluar si las cosas van bien",
            "No tienen ninguna función importante",
          ],
          correct: 2,
        },
      ],
    },
  },

  "Liderazgo": {
    description:
      "Desarrolla habilidades de liderazgo basadas en la empatía, la comunicación efectiva y la inteligencia emocional para guiar equipos de forma inspiradora.",
    icon: "users",
    color: "course-red",
    content: {
      title: "Contenido del Curso",
      sections: [
        {
          heading: "Definición de Liderazgo",
          text: "El liderazgo es la capacidad de influir positivamente en otras personas para alcanzar objetivos comunes. No se trata solo de ocupar un cargo, sino de generar un impacto positivo en el equipo y la organización. Un líder empático escucha activamente, comprende las necesidades de su equipo y adapta su estilo según las circunstancias.",
        },
        {
          heading: "Las 10 Habilidades Clave",
          text: "Todo líder eficaz desarrolla un conjunto de habilidades esenciales: iniciativa, proactividad, innovación, creatividad, toma de decisiones bajo presión, comunicación asertiva, delegación efectiva, gestión de conflictos, motivación y reconocimiento, y adaptabilidad al cambio. Estas competencias permiten anticiparse a los cambios y guiar al equipo con visión de futuro.",
        },
        {
          heading: "Proceso de Toma de Decisiones",
          text: "La indecisión es uno de los principales obstáculos del liderazgo. Un líder debe aprender a analizar situaciones, evaluar alternativas y tomar decisiones oportunas. El proceso incluye: identificar el problema, generar opciones, evaluar riesgos y comprometerse con la acción. El análisis de tipos de problemas y decisiones permite abordar cada situación con criterio.",
        },
        {
          heading: "Comunicación Organizacional",
          text: "La comunicación es el vehículo del liderazgo. En el ámbito organizacional existen distintos tipos: formal, informal, descendente, ascendente y lateral. Dominar los modelos clásicos de comunicación permite transmitir ideas con claridad, elaborar documentos efectivos (memorandos, notas informativas) y generar confianza en el equipo.",
        },
        {
          heading: "Inteligencia Emocional Aplicada",
          text: "El líder debe desarrollar inteligencia emocional: conciencia de sí mismo, autorregulación, motivación, empatía y habilidades sociales. Esto permite conducir las propias emociones, gestionar el estrés laboral, planificar efectivamente y evitar los ladrones del tiempo como la procrastinación. El descanso activo es clave para mantener la productividad.",
        },
        {
          heading: "Trabajo en Equipo y Toma de Decisiones",
          text: "Un equipo eficaz se define por su capacidad de colaboración, confianza mutua y roles claros. El líder debe fomentar la creatividad en el equipo, seguir pasos para ser eficaz y eficiente, y tomar decisiones fundamentadas. La toma de decisiones en la empresa requiere un proceso estructurado que incluye identificar alternativas, evaluar consecuencias y comprometerse con la implementación.",
        },
      ],
    },
    resources: [
      { type: "pdf", name: "Manual de Prácticas de Liderazgo", file: "curso_liderazgo.pdf" },
      { type: "youtube", name: "Liderazgo Empático - Conceptos Clave", url: "https://www.youtube.com/watch?v=QV0lgVHOx2s" },
      { type: "youtube", name: "Las 10 Habilidades de un Líder", url: "https://www.youtube.com/watch?v=2fQBVqHVn_s" },
      { type: "youtube", name: "Inteligencia Emocional en el Liderazgo", url: "https://www.youtube.com/watch?v=5D2ILg5qTcc" },
    ],
    evaluation: {
      title: "Evaluación de Liderazgo Empático",
      passScore: 70,
      questions: [
        {
          question: "¿Cuál es la diferencia principal entre un jefe y un líder?",
          options: [
            "El jefe tiene autoridad formal, el líder tiene influencia e inspiración",
            "El jefe es más inteligente que el líder",
            "El líder siempre tiene más poder",
            "No hay diferencia",
          ],
          correct: 0,
        },
        {
          question: "¿Cuál de estas NO es una habilidad clave del liderazgo?",
          options: [
            "Iniciativa y proactividad",
            "Control absoluto del equipo",
            "Comunicación asertiva",
            "Gestión de conflictos",
          ],
          correct: 1,
        },
        {
          question: "¿Qué es la inteligencia emocional en el liderazgo?",
          options: [
            "Ser el más inteligente del equipo",
            "Capacidad de reconocer y gestionar emociones propias y ajenas",
            "No mostrar emociones en el trabajo",
            "Imponer decisiones sin consultar",
          ],
          correct: 1,
        },
        {
          question: "¿Cuál es el primer paso en el proceso de toma de decisiones?",
          options: [
            "Elegir la primera opción que surja",
            "Consultar con todos los miembros del equipo",
            "Identificar y definir el problema",
            "Dejar que otros decidan",
          ],
          correct: 2,
        },
        {
          question: "¿Qué tipo de comunicación fluye de los superiores a los subordinados?",
          options: [
            "Comunicación ascendente",
            "Comunicación lateral",
            "Comunicación descendente",
            "Comunicación informal",
          ],
          correct: 2,
        },
        {
          question: "¿Cómo se define el liderazgo en el manual?",
          options: [
            "El cargo o posición jerárquica que una persona ocupa",
            "El proceso de dirigir la conducta de otros hacia el alcance de algún objetivo",
            "La capacidad de dar órdenes sin cuestionamientos",
            "Un conjunto de habilidades innatas que no se pueden aprender",
          ],
          correct: 1,
        },
        {
          question: "¿Cuál de las siguientes NO es una de las 10 habilidades que todo buen líder debe tener?",
          options: ["Compromiso", "Persuasión", "Autoritarismo", "Empatía"],
          correct: 2,
        },
        {
          question: "¿En qué consiste la proactividad?",
          options: [
            "Esperar a que otros resuelvan los problemas",
            "Anticiparse de forma activa a los eventos o problemas futuros",
            "Reaccionar únicamente cuando ocurre un problema",
            "Seguir las instrucciones sin cuestionar",
          ],
          correct: 1,
        },
        {
          question: "¿Qué es un problema según la definición administrativa?",
          options: [
            "Una situación que nunca tiene solución",
            "La brecha existente entre el Estado Actual y el Estado Deseado",
            "Un error que cometió un empleado",
            "Algo que solo afecta a los subordinados",
          ],
          correct: 1,
        },
      ],
    },
  },

  "Resistencia a la Frustracion": {
    description:
      "Fortalece tu capacidad para superar la adversidad, adaptarte a los cambios y crecer a partir de las dificultades.",
    icon: "shield",
    color: "course-magenta",
    content: {
      title: "Contenido del Curso",
      sections: [
        {
          heading: "Definición de Frustración",
          text: "La frustración es una situación en la que una expectativa, un deseo, un proyecto o una ilusión no se cumple. Cuando esto ocurre, experimentamos enfado, tristeza, miedo o amedrentamiento. La frustración no es patológica en sí misma, pero debemos aprender a manejarla.",
        },
        {
          heading: "¿Qué es la Tolerancia a la Frustración?",
          text: "Manejar la frustración es poner la energía para aceptar el evento interno manteniendo una posición valorizante de uno mismo y activa en relación con las circunstancias del entorno. Antes de poner energía en el Adulto (según el Análisis Transaccional), es necesario que el estado del yo Padre envíe mensajes que consientan al Niño aceptar la frustración.",
        },
        {
          heading: "Resiliencia como Capacidad de Recuperación",
          text: "La resiliencia es la capacidad de adaptarse y recuperarse ante la adversidad. Mientras la frustración es la reacción ante el obstáculo, la resiliencia es la capacidad de superarlo y crecer. La resiliencia se construye mediante estrategias como la reevaluación cognitiva, el apoyo social, el autocuidado y la búsqueda de sentido en las dificultades.",
        },
        {
          heading: "Estrategias para Superar la Frustración",
          text: "Para manejar la frustración debemos: reconocer la emoción sin juzgarla, aceptar la situación como es, mantener la posición OK (valorizante de uno mismo), buscar apoyo social, practicar el autocuidado y reevaluar la situación encontrando aprendizajes. La frustración no se elimina, se maneja con inteligencia emocional.",
        },
        {
          heading: "Resiliencia en el Entorno Laboral",
          text: "En el ámbito laboral, la resiliencia es clave para enfrentar cambios organizacionales, presión por resultados, conflictos interpersonales y situaciones de incertidumbre. Los profesionales resilientes son más productivos, tienen mejor bienestar y pueden transformar las dificultades en oportunidades de crecimiento.",
        },
      ],
    },
    resources: [
      { type: "pdf", name: "La Tolerancia a la Frustración", file: "curso_resistencia_a_la_frustracion.pdf" },
      { type: "youtube", name: "¿Qué es la Resiliencia?", url: "https://www.youtube.com/watch?v=0l0fJ1Kf1bI" },
      { type: "youtube", name: "Cómo Superar la Frustración", url: "https://www.youtube.com/watch?v=Cm2mKJ1K0bE" },
      { type: "youtube", name: "Estrategias de Resiliencia Laboral", url: "https://www.youtube.com/watch?v=bY1mP1bK1cI" },
    ],
    evaluation: {
      title: "Evaluación de Resiliencia",
      passScore: 70,
      questions: [
        {
          question: "¿Qué es la frustración?",
          options: [
            "Un defecto de personalidad",
            "La vivencia emocional cuando un deseo o expectativa no se cumple",
            "Sentirse feliz",
            "No tener problemas",
          ],
          correct: 1,
        },
        {
          question: "¿Qué es la tolerancia a la frustración?",
          options: [
            "Aguantar sin hacer nada",
            "Aceptar la situación manteniendo una posición valorizante de uno mismo",
            "Ignorar el problema",
            "Culpar a otros",
          ],
          correct: 1,
        },
        {
          question: "¿Cuál es la diferencia entre frustración y resiliencia?",
          options: [
            "No hay diferencia",
            "La frustración es la reacción al obstáculo, la resiliencia es superarlo y crecer",
            "La resiliencia es para personas débiles",
            "La frustración es positiva",
          ],
          correct: 1,
        },
        {
          question: "¿Qué dice el Análisis Transaccional sobre manejar la frustración?",
          options: [
            "Reprimir las emociones",
            "El Padre debe consolar al Niño para que el Adulto pueda manejar la situación",
            "No sentir nada",
            "Expresar la frustración agresivamente",
          ],
          correct: 1,
        },
        {
          question: "¿Por qué es importante la resiliencia en el trabajo?",
          options: [
            "No es importante",
            "Permite enfrentar cambios, presión y conflictos de manera constructiva",
            "Solo sirve para personas con problemas",
            "Es innecesaria en entornos estables",
          ],
          correct: 1,
        },
        {
          question: "¿Qué es la frustración según el documento?",
          options: [
            "Una enfermedad mental que requiere tratamiento urgente",
            "Una vivencia emocional ante una situación en la que un deseo o necesidad no se satisface",
            "Una actitud negativa que debe eliminarse completamente",
            "Un signo de debilidad personal",
          ],
          correct: 1,
        },
        {
          question: "¿Cuál de las siguientes es una forma en que los padres pueden generar baja tolerancia a la frustración?",
          options: [
            "Establecer límites claros y firmes",
            "Dar siempre caricias incondicionales y evitar toda experiencia de insatisfacción",
            "Permitir que el niño enfrente pequeñas dificultades",
            "Enseñar al niño a aceptar la realidad",
          ],
          correct: 1,
        },
        {
          question: "¿Qué significa tener un nivel alto de tolerancia a la frustración?",
          options: [
            "No sentir nunca emociones negativas",
            "Necesitar una frustración muy alta para enfadarse, asustarse o ponerse triste",
            "Evitar todas las situaciones difíciles",
            "No depender de nadie",
          ],
          correct: 1,
        },
        {
          question: "¿Cuál es el aprendizaje clave para manejar la frustración de la omnipotencia?",
          options: [
            "Que todo es posible si uno se esfuerza lo suficiente",
            "Aceptar que hay límites propios, ajenos y de la realidad",
            "Evitar toda situación que pueda generar frustración",
            "Depender de otros para resolver los problemas",
          ],
          correct: 1,
        },
      ],
    },
  },

  "Resolucion de Conflictos": {
    description:
      "Mejora tu capacidad de análisis, evaluación y toma de decisiones basada en evidencia y razonamiento lógico.",
    icon: "brain",
    color: "course-green",
    content: {
      title: "Contenido del Curso",
      sections: [
        {
          heading: "Gestión y Resolución de Conflictos",
          text: "Encarar los conflictos de manera creativa y propositiva o destructiva depende de cómo nos hayamos preparado. La comprensión tradicional se refleja en disposiciones directivas que atañen al arbitraje o juicio, dejando poco espacio al desarrollo de habilidades para negociar y resolver autogestivamente nuestras diferencias.",
        },
        {
          heading: "Capacidades Personales e Interpersonales",
          text: "El desarrollo de capacidades personales, interpersonales e interinstitucionales permite la búsqueda y el logro de soluciones autogestionadas de los conflictos. Esto implica aprender a analizar situaciones, evaluar argumentos, identificar sesgos cognitivos y tomar decisiones fundamentadas.",
        },
        {
          heading: "Identificación de Sesgos Cognitivos",
          text: "Los sesgos cognitivos son patrones sistemáticos de desviación del juicio racional. Entre los más comunes están el sesgo de confirmación (buscar información que confirme nuestras creencias), el efecto ancla (depender excesivamente de la primera información recibida) y la falacia del superviviente.",
        },
        {
          heading: "Técnicas de Análisis y Argumentación",
          text: "La argumentación lógica, el análisis DAFO (Debilidades, Amenazas, Fortalezas, Oportunidades), el pensamiento lateral y la resolución creativa de conflictos son herramientas fundamentales. Un argumento válido requiere premises verdaderas, razonamiento válido y evidencia que lo respalde.",
        },
        {
          heading: "Toma de Decisiones Basada en Evidencia",
          text: "La toma de decisiones informada requiere recopilar evidencia, evaluar alternativas y prever consecuencias. En el ámbito organizacional, las decisiones basadas en datos reducen el riesgo y mejoran los resultados. El proceso incluye: definir el problema, generar alternativas, evaluar opciones, elegir la mejor alternativa y planificar la implementación.",
        },
      ],
    },
    resources: [
      { type: "pdf", name: "Manual de Gestión y Resolución de Conflictos", file: "curso_resolucion_de_conflictos.pdf" },
      { type: "youtube", name: "¿Qué es el Pensamiento Crítico?", url: "https://www.youtube.com/watch?v=eP1TKLjsE5g" },
      { type: "youtube", name: "Sesgos Cognitivos Explicados", url: "https://www.youtube.com/watch?v=kF_X1M_kC_Y" },
      { type: "youtube", name: "Resolución de Conflictos Laborales", url: "https://www.youtube.com/watch?v=3aCChRGyWbI" },
    ],
    evaluation: {
      title: "Evaluación de Pensamiento Crítico",
      passScore: 70,
      questions: [
        {
          question: "¿Qué es el pensamiento crítico?",
          options: [
            "Ser negativo con todo",
            "Analizar información de manera objetiva y tomar decisiones fundamentadas",
            "No estar de acuerdo con nadie",
            "Pensar rápido",
          ],
          correct: 1,
        },
        {
          question: "¿Qué es el sesgo de confirmación?",
          options: [
            "Confirmar que tenemos razón",
            "Buscar solo información que confirme nuestras creencias previas",
            "Preguntar para confirmar datos",
            "Un tipo de análisis estadístico",
          ],
          correct: 1,
        },
        {
          question: "¿Qué significa DAFO?",
          options: [
            "Debilidades, Amenazas, Fortalezas, Oportunidades",
            "Datos, Análisis, Factores, Objetivos",
            "Derechos, Actitudes, Funciones, Opciones",
            "Ninguna de las anteriores",
          ],
          correct: 0,
        },
        {
          question: "¿Cuál es el primer paso en la toma de decisiones basada en evidencia?",
          options: [
            "Elegir la opción más fácil",
            "Recopilar toda la información disponible",
            "Definir y comprender el problema",
            "Consultar con un superior",
          ],
          correct: 2,
        },
        {
          question: "¿Qué es la falacia del superviviente?",
          options: [
            "Cuando alguien se rinde fácilmente",
            "Generalizar basándose solo en casos exitosos ignorando los fracasos",
            "Un error de razonamiento lógico",
            "Una táctica de debate",
          ],
          correct: 1,
        },
        {
          question: "¿Qué es el conflicto según la definición presentada en el manual?",
          options: [
            "Una pelea física entre dos o más personas",
            "Cualquier situación en la que dos o más entidades sociales perciben que tienen objetivos incompatibles",
            "Un desacuerdo que siempre termina en violencia",
            "Un problema que solo se resuelve con arbitraje externo",
          ],
          correct: 1,
        },
        {
          question: "¿Cuáles son los cinco estilos para responder al conflicto según el modelo de Ron Kraybill?",
          options: [
            "Directivo, Evitador, Negociador, Armonizador, Cooperador",
            "Pasivo, Agresivo, Asertivo, Colaborativo, Competitivo",
            "Líder, Seguidor, Mediador, Arbitro, Observador",
            "Racional, Emocional, Impulsivo, Reflexivo, Neutro",
          ],
          correct: 0,
        },
        {
          question: "¿Qué tipo de conflicto se refiere a las diferencias de criterio al evaluar ideas o comportamientos?",
          options: [
            "Conflicto de datos",
            "Conflicto de intereses",
            "Conflicto de valores",
            "Conflicto estructural",
          ],
          correct: 2,
        },
        {
          question: "¿Cuál es el primer paso para comprender y manejar un conflicto?",
          options: [
            "Aplicar una sanción inmediata",
            "Tomar distancia del problema para conocer sus componentes",
            "Buscar un tercero que decida por las partes",
            "Ignorar el conflicto hasta que desaparezca",
          ],
          correct: 1,
        },
      ],
    },
  },
};

export const COURSE_NAMES = Object.keys(COURSES_DATA) as (keyof typeof COURSES_DATA)[];
