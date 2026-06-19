const DIAGNOSTICO_DATA = {
    title: 'Diagnóstico de Habilidades Socioemocionales',
    subtitle: 'Basado en "Inteligencia Emocional" de Daniel Goleman',
    sections: [
        {
            name: 'Autoconocimiento',
            questions: [
                {
                    question: '¿Con qué frecuencia identifica con precisión las emociones que está experimentando en un momento dado?',
                    options: [
                        'Casi nunca sé qué estoy sintiendo exactamente',
                        'A veces reconozco mis emociones, pero me cuesta distinguir entre ellas',
                        'Generalmente identifico mis emociones con claridad',
                        'Siempre sé qué siento, por qué lo siento y cómo afecta mi comportamiento'
                    ]
                },
                {
                    question: '¿Qué tan consciente es de sus fortalezas y limitaciones personales?',
                    options: [
                        'No suelo reflexionar sobre mis capacidades',
                        'Tengo una idea general pero no muy clara',
                        'Conozco bien mis fortalezas y estoy trabajando en mis debilidades',
                        'Tengo un autoconocimiento profundo que me permite tomar decisiones alineadas con mi potencial'
                    ]
                },
                {
                    question: 'Cuando recibe una retroalimentación negativa, ¿cómo reacciona típicamente?',
                    options: [
                        'Me defiendo o minimizo lo que me dicen',
                        'Me siento molesto pero trato de no mostrarlo',
                        'Escucho con atención y busco aprender de la crítica',
                        'Agradezco la retroalimentación, la analizo objetivamente y la uso para mejorar'
                    ]
                },
                {
                    question: '¿Qué tan consciente es del efecto que sus emociones tienen en las demás personas?',
                    options: [
                        'Rara vez presto atención a cómo me perciben los demás',
                        'A veces noto las reacciones de otros, pero no siempre las entiendo',
                        'Generalmente percibo cómo se sienten los demás en relación conmigo',
                        'Siempre tengo clara la influencia de mi estado emocional en mi entorno y la gestiono adecuadamente'
                    ]
                }
            ]
        },
        {
            name: 'Autorregulación',
            questions: [
                {
                    question: '¿Cómo maneja la ira cuando alguien le provoca?',
                    options: [
                        'Reacciono de inmediato, a veces de forma desproporcionada',
                        'Trato de contenerme, pero a veces exploto',
                        'Me tomo un momento para reflexionar antes de responder',
                        'Siempre mantengo la calma, evalúo la situación y respondo de forma constructiva'
                    ]
                },
                {
                    question: '¿Qué hace cuando se enfrenta a una situación de alta presión o estrés?',
                    options: [
                        'Me paralizo o actúo de forma impulsiva',
                        'Siento ansiedad que a veces me impide pensar con claridad',
                        'Aplico técnicas de manejo del estrés (respiración, pausa, reencuadre)',
                        'Mantengo el control, priorizo acciones y busco soluciones de manera calmada y eficiente'
                    ]
                },
                {
                    question: '¿Cómo responde ante los cambios inesperados o los contratiempos?',
                    options: [
                        'Me frustro mucho y me cuesta adaptarme',
                        'Me incomodo pero eventualmente me ajusto',
                        'Busco ver el lado positivo y me adapto con relativa facilidad',
                        'Abrazo los cambios como oportunidades de aprendizaje y me ajusto rápidamente'
                    ]
                },
                {
                    question: '¿Qué tan bien tolera la frustración cuando no logra un objetivo?',
                    options: [
                        'Me desanimo fácilmente y tiendo a abandonar',
                        'Me siento frustrado pero sigo intentando',
                        'Acepto la frustración como parte del proceso y persisto',
                        'Veo los fracasos como retroalimentación y uso la frustración para mejorar mi estrategia'
                    ]
                }
            ]
        },
        {
            name: 'Motivación',
            questions: [
                {
                    question: '¿Qué lo impulsa a trabajar y alcanzar metas?',
                    options: [
                        'Principalmente la obligación externa o el miedo a las consecuencias',
                        'Recompensas materiales o la aprobación de otros',
                        'El deseo de superarme y alcanzar un propósito personal',
                        'Una visión clara de mis valores y objetivos que me mantiene comprometido incluso ante dificultades'
                    ]
                },
                {
                    question: '¿Cómo reacciona cuando fracasa en algo importante?',
                    options: [
                        'Me siento derrotado y pierdo el ánimo durante tiempo',
                        'Me decepciono pero poco a poco retomo la actividad',
                        'Analizo qué salió mal y busco alternativas',
                        'Mantengo el optimismo, extraigo lecciones y me reinicio con mayor determinación'
                    ]
                },
                {
                    question: '¿Qué tan persistente es cuando enfrenta obstáculos en un proyecto?',
                    options: [
                        'Tiendo a rendirme cuando las cosas se ponen difíciles',
                        'Sigo adelante pero con dificultad',
                        'Persisto de forma constante buscando soluciones',
                        'Soy altamente persistente, mantengo el enfoque y la energía hasta alcanzar mi meta'
                    ]
                },
                {
                    question: '¿Cómo es su nivel de iniciativa y proactividad?',
                    options: [
                        'Espero a que me digan qué hacer',
                        'A veces tomo la iniciativa, pero no de forma constante',
                        'Generalmente busco oportunidades y actúo antes de que me lo pidan',
                        'Siempre estoy un paso adelante, anticipando necesidades y tomando acción sin esperar instrucciones'
                    ]
                }
            ]
        },
        {
            name: 'Empatía',
            questions: [
                {
                    question: '¿Qué tan bien comprende las emociones de las demás personas?',
                    options: [
                        'Me cuesta detectar cómo se sienten los demás',
                        'A veces noto las emociones de otros, pero a veces me equivoco',
                        'Generalmente comprendo bien lo que sienten los demás',
                        'Tengo una capacidad profunda para percibir y comprender las emociones, necesidades y preocupaciones de los demás'
                    ]
                },
                {
                    question: '¿Cómo reacciona cuando alguien cercano está pasando por un momento difícil?',
                    options: [
                        'No suelo darme cuenta o no sé qué hacer',
                        'Intento ayudar pero a veces no acierto con lo que necesita',
                        'Escucho con atención y ofrezco apoyo emocional',
                        'Me conecto genuinamente con la persona, valid sus emociones y ofrezco el apoyo más adecuado'
                    ]
                },
                {
                    question: '¿Qué tan bien tolera puntos de vista diferentes a los suyos?',
                    options: [
                        'Me cuesta aceptar opiniones contrarias',
                        'Las acepto intelectualmente pero a veces me generan incomodidad',
                        'Respeto y valoro las diferentes perspectivas',
                        'Busco activamente entender otras posturas y aprendo de la diversidad de pensamiento'
                    ]
                },
                {
                    question: '¿Cómo maneja las diferencias interpersonales en un equipo de trabajo?',
                    options: [
                        'Evito los conflictos o me impongo',
                        'Trato de mantener la paz, aunque a veces a costa de mis ideas',
                        'Busco soluciones que beneficien a todas las partes',
                        'Facilito el diálogo, integro perspectivas diversas y transformo los desacuerdos en oportunidades de crecimiento colectivo'
                    ]
                }
            ]
        },
        {
            name: 'Habilidades Sociales',
            questions: [
                {
                    question: '¿Qué tan efectiva es su comunicación con los demás?',
                    options: [
                        'Me cuesta expresar lo que pienso y siento',
                        'Me comunico pero a veces genero malentendidos',
                        'Me comunico con claridad y respeto',
                        'Me comunico de forma asertiva, empática y efectiva, adaptándome a diferentes audiencias y contextos'
                    ]
                },
                {
                    question: '¿Cómo maneja los conflictos interpersonales?',
                    options: [
                        'Los evito o los enfrento de forma agresiva',
                        'Trato de resolverlos pero a veces no encuentro la mejor solución',
                        'Busco soluciones colaborativas que satisfagan a ambas partes',
                        'Gestión los conflictos de manera constructiva, transformándolos en oportunidades de fortalecer relaciones'
                    ]
                },
                {
                    question: '¿Qué tan bien trabaja en equipo?',
                    options: [
                        'Prefiero trabajar solo, me cuesta colaborar',
                        'Colaboro cuando es necesario, pero no siempre de forma activa',
                        'Contribuyo de forma positiva al equipo',
                        'Potencio el desempeño del equipo, facilito la colaboración y ayudo a que todos den lo mejor de sí'
                    ]
                },
                {
                    question: '¿Qué tan bien influye y motiva a los demás?',
                    options: [
                        'Rara vez influyo positivamente en otros',
                        'A veces logro motivar a las personas, pero no de forma consistente',
                        'Generalmente soy capaz de inspirar y guiar a otros',
                        'Tengo una capacidad natural para liderar, inspirar y movilizar a las personas hacia metas comunes'
                    ]
                }
            ]
        },
        {
            name: 'Conexión Emocional',
            questions: [
                {
                    question: '¿Qué tan bien identifica las emociones básicas (miedo, ira, tristeza, alegría, asco, sorpresa) en los demás?',
                    options: [
                        'Me resulta difícil distinguir estas emociones en otros',
                        'Identifico las emociones más evidentes pero me cuesta las sutiles',
                        'Identifico con precisión la mayoría de las emociones en otros',
                        'Leo las emociones con gran precisión incluso en expresiones faciales sutiles, tono de voz y lenguaje corporal'
                    ]
                },
                {
                    question: '¿Qué tan bien se pone en el lugar del otro antes de reaccionar?',
                    options: [
                        'Casi nunca considero la perspectiva del otro',
                        'A veces lo hago, pero no de forma automática',
                        'Generalmente intento entender al otro antes de juzgar',
                        'Siempre busco comprender la experiencia del otro como base para mi respuesta'
                    ]
                },
                {
                    question: '¿Qué tan bien detecta las dinámicas emocionales en un grupo?',
                    options: [
                        'No suelo percibir el "clima emocional" de un grupo',
                        'A veces noto las tensiones o armonías, pero no siempre las entiendo',
                        'Generalmente percibo bien la atmósfera emocional del grupo',
                        'Tengo una percepción aguda de las dinámicas emocionales grupales y puedo actuar para mejorarlas'
                    ]
                },
                {
                    question: '¿Qué tan bien maneja las relaciones con personas de diferentes contextos culturales o sociales?',
                    options: [
                        'Me resulta difícil conectar con personas diferentes a mí',
                        'Me adapto pero a veces con dificultad',
                        'Generalmente me relaciono bien con diversidad de personas',
                        'Conecto profundamente con personas de cualquier origen, adaptando mi comunicación y comportamiento con naturalidad'
                    ]
                }
            ]
        }
    ]
};
