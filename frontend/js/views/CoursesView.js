export class CoursesView {
    constructor() {
        this.coursesGrid = document.querySelector('.courses-grid');
        this.onCourseSelect = null;
    }

    renderCourses(courses) {
        const grid = this.coursesGrid;
        if (!grid) {
            console.error('Courses grid element not found!');
            return;
        }
        
        if (!courses || !Array.isArray(courses) || courses.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 3rem;">' +
                             '<i data-lucide="search-x" style="width: 48px; height: 48px; margin-bottom: 1rem; opacity: 0.5;"></i>' +
                             '<p>No hay cursos disponibles en este momento.</p></div>';
            if (window.lucide) lucide.createIcons();
            return;
        }

        grid.innerHTML = '';
        const colors = ['red', 'blue', 'orange', 'green', 'purple', 'yellow', 'cyan', 'magenta'];
        const iconMap = {
            'Liderazgo': 'users',
            'Comunicación': 'message-circle',
            'Construcción': 'user-plus',
            'Desarrollo': 'user',
            'Flexibilidad': 'refresh-cw',
            'Gestión del Tiempo': 'timer',
            'Gestión Emocional': 'heart',
            'Resistencia': 'shield',
            'Resolución': 'brain'
        };
        
        courses.forEach((course, index) => {
            try {
                const colorClass = course.color ? `course-${course.color}` : `course-${colors[index % colors.length]}`;
                const progress = course.progress !== undefined ? course.progress : Math.floor(Math.random() * 50);
                
                let iconName = course.icon || 'graduation-cap';
                if (!course.icon) {
                    for (const [key, icon] of Object.entries(iconMap)) {
                        if ((course.category && course.category.includes(key)) || (course.title && course.title.includes(key))) {
                            iconName = icon;
                            break;
                        }
                    }
                }
                
                const card = document.createElement('div');
                card.className = `course-card ${colorClass}`;
                card.innerHTML = `
                    <div class="course-icon"><i data-lucide="${iconName}"></i></div>
                    <h3 class="course-title">${course.title || 'Sin título'}</h3>
                    <p class="course-desc">${course.description || ''}</p>
                    <div class="course-footer">
                        <div class="course-progress">
                            <span>${progress}%</span>
                            <div class="p-bar"><div class="p-fill" style="width: ${progress}%;"></div></div>
                        </div>
                        <button class="course-btn" data-title="${course.title || 'Sin título'}">${progress > 0 ? 'Continuar' : 'Empezar'}</button>
                    </div>
                `;
                grid.appendChild(card);
            } catch (err) {
                console.error('Error rendering course card:', err);
            }
        });

        grid.querySelectorAll('.course-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const title = btn.getAttribute('data-title');
                if (this.onCourseSelect) {
                    this.onCourseSelect(title);
                }
            });
        });

        if (window.lucide) {
            lucide.createIcons();
        }
    }

    bindCourseSelection(handler) {
        this.onCourseSelect = handler;
    }

    bindBackToCourses(handler) {
        const btn = document.getElementById('back-to-courses-btn');
        if (btn) {
            btn.addEventListener('click', handler);
        }
    }

    renderCourseDetail(courseData, onCourseComplete) {
        const container = document.getElementById('course-detail-container');
        if (!container) return;

        const totalSections = courseData.sections.length;
        const totalSlides = totalSections + 1; // sections + 1 (resources)
        let currentSlide = 0;
        let userAnswers = {};

        const updateProgress = () => {
            const progress = Math.round((currentSlide / (totalSlides - 1)) * 100);
            const fill = document.getElementById('course-progress-fill');
            const text = document.getElementById('course-progress-text');
            if (fill) fill.style.width = `${progress}%`;
            if (text) text.textContent = `${progress}%`;
            return progress;
        };

        const renderSlide = () => {
            const readerCard = document.getElementById('reader-card');
            if (!readerCard) return;

            readerCard.innerHTML = '';

            if (currentSlide < totalSections) {
                const section = courseData.sections[currentSlide];
                const slideDiv = document.createElement('div');
                slideDiv.className = 'reader-slide active';
                
                let bulletsHtml = '';
                if (section.bullet_points && section.bullet_points.length > 0) {
                    bulletsHtml = `<ul class="bullet-list">` + 
                        section.bullet_points.map(pt => `<li><i data-lucide="check-circle-2"></i><span>${pt}</span></li>`).join('') + 
                        `</ul>`;
                }

                slideDiv.innerHTML = `
                    <h2>${section.title}</h2>
                    <div class="reader-content">${section.content}</div>
                    ${bulletsHtml}
                `;
                readerCard.appendChild(slideDiv);
            } else {
                const slideDiv = document.createElement('div');
                slideDiv.className = 'reader-slide active';
                
                const resourcesHtml = courseData.resources.map(res => `
                    <div class="resource-item">
                        <div class="resource-info">
                            <h4>${res.title}</h4>
                            <p>${res.description}</p>
                        </div>
                        <a href="${res.url}" target="_blank" class="resource-link">
                            Visitar enlace <i data-lucide="external-link"></i>
                        </a>
                    </div>
                `).join('');

                slideDiv.innerHTML = `
                    <h2>Referencias y Recursos de Aprendizaje</h2>
                    <p style="color: var(--text-secondary); font-size: 0.95rem;">Profundiza en los conceptos clave estudiados en la documentación:</p>
                    <div class="resources-list">
                        ${resourcesHtml}
                    </div>
                    
                    <div class="evaluation-box" id="eval-box" style="margin-top: 2rem;">
                        <i data-lucide="award" style="width: 48px; height: 48px; color: #10b981; margin-bottom: 0.5rem;"></i>
                        <h3>¡Módulo Completado!</h3>
                        <p>Has leído todo el contenido y las referencias recuperadas del curso. Estás listo para realizar la evaluación.</p>
                        <button class="evaluation-btn" id="start-eval-btn">
                            <i data-lucide="clipboard-check"></i> Iniciar Evaluación (0 - 100)
                        </button>
                    </div>
                `;
                readerCard.appendChild(slideDiv);

                const startEvalBtn = document.getElementById('start-eval-btn');
                if (startEvalBtn) {
                    startEvalBtn.addEventListener('click', () => {
                        renderEvaluation();
                    });
                }
            }

            const prevBtn = document.getElementById('slide-prev');
            const nextBtn = document.getElementById('slide-next');

            if (prevBtn) {
                prevBtn.style.visibility = currentSlide === 0 ? 'hidden' : 'visible';
            }
            if (nextBtn) {
                if (currentSlide === totalSlides - 1) {
                    nextBtn.style.display = 'none';
                } else {
                    nextBtn.style.display = 'flex';
                    nextBtn.innerHTML = `Siguiente <i data-lucide="arrow-right"></i>`;
                }
            }

            if (window.lucide) lucide.createIcons();
        };

        const renderEvaluation = () => {
            const readerHeader = document.querySelector('.course-progress-header');
            if (readerHeader) readerHeader.style.display = 'none';

            container.innerHTML = `
                <div class="quiz-container">
                    <h2 style="font-size: 1.75rem; font-weight: 700; margin-bottom: 0.5rem;">Evaluación de Conocimiento</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 2rem;">Responde las preguntas para obtener una calificación de 0 a 100.</p>
                    
                    <div class="quiz-questions">
                        ${courseData.questions.map((q, qIdx) => `
                            <div class="quiz-question-card" data-q-id="${q.id}">
                                <div class="question-text">${qIdx + 1}. ${q.question}</div>
                                <div class="quiz-options">
                                    ${q.options.map((opt, optIdx) => `
                                        <button class="option-btn" data-q-id="${q.id}" data-opt-idx="${optIdx}">
                                            <div class="option-indicator">${String.fromCharCode(65 + optIdx)}</div>
                                            <span>${opt}</span>
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <button class="evaluation-btn" id="submit-eval-btn" style="width: 100%; margin-top: 1rem; justify-content: center;">
                        <i data-lucide="send"></i> Enviar Evaluación y Ver Resultados
                    </button>
                </div>
            `;

            if (window.lucide) lucide.createIcons();

            const optionBtns = container.querySelectorAll('.option-btn');
            optionBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const qId = btn.getAttribute('data-q-id');
                    const optIdx = parseInt(btn.getAttribute('data-opt-idx'));
                    
                    container.querySelectorAll(`.option-btn[data-q-id="${qId}"]`).forEach(opt => {
                        opt.classList.remove('selected');
                    });

                    btn.classList.add('selected');
                    userAnswers[qId] = optIdx;
                });
            });

            const submitBtn = document.getElementById('submit-eval-btn');
            if (submitBtn) {
                submitBtn.addEventListener('click', () => {
                    const answeredCount = Object.keys(userAnswers).length;
                    if (answeredCount < courseData.questions.length) {
                        alert('Por favor, responde todas las preguntas antes de enviar la evaluación.');
                        return;
                    }
                    submitEvaluation();
                });
            }
        };

        const submitEvaluation = () => {
            let correctCount = 0;
            const reviewData = [];

            courseData.questions.forEach(q => {
                const selectedIdx = userAnswers[q.id];
                const isCorrect = selectedIdx === q.answer_index;
                if (isCorrect) correctCount++;

                reviewData.push({
                    question: q.question,
                    selected: q.options[selectedIdx],
                    correct: q.options[q.answer_index],
                    isCorrect: isCorrect,
                    explanation: q.explanation
                });
            });

            const finalScore = Math.round((correctCount / courseData.questions.length) * 100);
            let scoreClass = 'success';
            let titleFeedback = '¡Excelente Trabajo!';
            let descFeedback = 'Has dominado el módulo con éxito.';

            if (finalScore < 60) {
                scoreClass = 'fail';
                titleFeedback = 'Sigue Practicando';
                descFeedback = 'Te sugerimos releer el material para mejorar tus conceptos.';
            } else if (finalScore < 85) {
                scoreClass = 'success';
                titleFeedback = '¡Buen Intento!';
                descFeedback = 'Has aprobado, pero puedes lograr una puntuación más alta.';
            }

            container.innerHTML = `
                <div class="results-card">
                    <div class="score-circle ${scoreClass}">
                        <span class="score-value">${finalScore}</span>
                        <span class="score-label">Puntos</span>
                    </div>
                    
                    <h2 style="font-size: 1.75rem; font-weight: 700; margin-top: 1rem;">${titleFeedback}</h2>
                    <p style="color: var(--text-secondary); max-width: 500px;">${descFeedback}</p>
                    
                    <div class="results-review">
                        <h3>Revisión de la Evaluación</h3>
                        ${reviewData.map((item, idx) => `
                            <div class="review-item ${item.isCorrect ? 'correct' : 'incorrect'}">
                                <div class="review-question">${idx + 1}. ${item.question}</div>
                                <div class="review-details">
                                    <p><strong>Tu respuesta:</strong> <span style="color: ${item.isCorrect ? '#10b981' : '#ef4444'}">${item.selected}</span></p>
                                    ${!item.isCorrect ? `<p><strong>Respuesta correcta:</strong> <span style="color: #10b981">${item.correct}</span></p>` : ''}
                                </div>
                                <div class="review-explanation">
                                    <i data-lucide="info" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle; margin-right: 0.25rem;"></i>
                                    <strong>Contexto RAG:</strong> ${item.explanation}
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div style="display: flex; gap: 1rem; width: 100%; margin-top: 2rem;">
                        <button class="reader-btn prev" id="retry-eval-btn" style="flex: 1; justify-content: center;">
                            <i data-lucide="rotate-ccw"></i> Reintentar Evaluación
                        </button>
                        <button class="reader-btn next" id="finish-course-btn" style="flex: 1; justify-content: center;">
                            <i data-lucide="check"></i> Finalizar y Volver
                        </button>
                    </div>
                </div>
            `;

            if (window.lucide) lucide.createIcons();

            const retryBtn = document.getElementById('retry-eval-btn');
            if (retryBtn) {
                retryBtn.addEventListener('click', () => {
                    userAnswers = {};
                    renderEvaluation();
                });
            }

            const finishBtn = document.getElementById('finish-course-btn');
            if (finishBtn) {
                finishBtn.addEventListener('click', () => {
                    if (onCourseComplete) {
                        onCourseComplete(finalScore);
                    }
                });
            }
        };

        container.innerHTML = `
            <div class="course-progress-header">
                <div class="course-progress-info">
                    <h3>Progreso en la lectura</h3>
                    <span id="course-progress-text">0%</span>
                </div>
                <div class="p-bar">
                    <div class="p-fill" id="course-progress-fill" style="width: 0%;"></div>
                </div>
            </div>

            <div class="course-reader-card" id="reader-card">
                <!-- Active page content loads here -->
            </div>

            <div class="reader-navigation" id="reader-navigation">
                <button class="reader-btn prev" id="slide-prev">
                    <i data-lucide="chevron-left"></i> Anterior
                </button>
                <button class="reader-btn next" id="slide-next">
                    Siguiente <i data-lucide="chevron-right"></i>
                </button>
            </div>
        `;

        const prevBtn = container.querySelector('#slide-prev');
        const nextBtn = container.querySelector('#slide-next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentSlide > 0) {
                    currentSlide--;
                    renderSlide();
                    updateProgress();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentSlide < totalSlides - 1) {
                    currentSlide++;
                    renderSlide();
                    updateProgress();
                }
            });
        }

        renderSlide();
        updateProgress();
    }
}
