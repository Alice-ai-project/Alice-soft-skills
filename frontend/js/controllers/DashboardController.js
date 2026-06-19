/**
 * Dashboard Controller
 */
export class DashboardController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.currentCourse = null;
        this.evaluationAnswers = {};
        this.init();
    }

    async init() {
        this.view.updateQuoteUI(this.model.getRandomQuote());
        this.view.bindViewChange(this.handleViewChange.bind(this));
        this.view.bindSidebarToggle(this.handleSidebarToggle.bind(this));
        this.view.bindMicControls(
            this.handleMicStart.bind(this),
            this.handleMicStop.bind(this)
        );
        this.view.bindExtraActions(
            () => this.handleViewChange('conversation'),
            () => this.handleViewChange('dashboard')
        );
        this.view.bindProfileUpdate(this.handleProfileUpdate.bind(this));
        this.view.bindCourseButtons(this.handleCourseStart.bind(this));
        this.view.setupAvatarAnimations();

        this.initSectionToggles();

        const backCourses = document.getElementById('back-to-courses');
        if (backCourses) {
            backCourses.addEventListener('click', () => this.handleViewChange('courses'));
        }

        const startPractice = document.getElementById('course-start-practice');
        if (startPractice) {
            startPractice.addEventListener('click', () => {
                const title = document.getElementById('course-detail-title')?.textContent || '';
                const chatBubble = document.getElementById('chat-response');
                if (chatBubble) {
                    chatBubble.textContent = `¡Perfecto! Vamos a trabajar en "${title}". Cuéntame, ¿qué situaciones has enfrentado recientemente donde sientas que podrías mejorar en esta área?`;
                }
                this.handleViewChange('conversation');
            });
        }

        this.initTabs();

        this.view.renderActiveView(this.model.activeView);

        const profile = await this.model.loadProfile();
        if (profile) {
            this.view.updateSettingsUI(this.model.userSettings);
        }

        const courses = await this.model.loadCourses();
        if (this.view.elements.coursesGrid && this.view.elements.coursesGrid.children.length === 0) {
            this.view.renderCourses(courses);
        } else if (window.lucide) {
            lucide.createIcons();
        }

        this.initDiagnostico();
    }

    initSectionToggles() {
        document.querySelectorAll('.nav-section-header').forEach(header => {
            header.addEventListener('click', () => {
                const section = header.closest('.nav-section');
                if (section) {
                    section.classList.toggle('active');
                }
            });
        });
    }

    initTabs() {
        document.querySelectorAll('.course-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.course-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const tabName = tab.dataset.tab;
                document.querySelectorAll('.course-tab-content').forEach(c => c.style.display = 'none');
                document.getElementById(`tab-${tabName}`).style.display = 'block';

                const ctaContainer = document.getElementById('course-cta-container');
                if (ctaContainer) {
                    ctaContainer.style.display = tabName === 'content' ? 'flex' : 'none';
                }
            });
        });
    }

    initDiagnostico() {
        if (typeof DIAGNOSTICO_DATA === 'undefined') return;

        const container = document.getElementById('diagnostico-questions');
        if (!container) return;

        this.diagnosticoAnswers = {};
        let questionIndex = 0;

        DIAGNOSTICO_DATA.sections.forEach((section, sectionIdx) => {
            const sectionEl = document.createElement('div');
            sectionEl.className = 'diag-section';
            sectionEl.innerHTML = `<h3 class="diag-section-title">${section.name}</h3>`;

            section.questions.forEach((q, qIdx) => {
                const globalIdx = questionIndex;
                const questionEl = document.createElement('div');
                questionEl.className = 'diag-question';
                questionEl.innerHTML = `
                    <div class="diag-question-number">Pregunta ${globalIdx + 1}</div>
                    <div class="diag-question-text">${q.question}</div>
                    <div class="diag-options">
                        ${q.options.map((opt, oIdx) => `
                            <div class="diag-option" data-question="${globalIdx}" data-option="${oIdx}">
                                <div class="diag-option-letter">${String.fromCharCode(65 + oIdx)}</div>
                                <span>${opt}</span>
                            </div>
                        `).join('')}
                    </div>
                `;
                sectionEl.appendChild(questionEl);
                questionIndex++;
            });

            container.appendChild(sectionEl);
        });

        container.querySelectorAll('.diag-option').forEach(option => {
            option.addEventListener('click', () => {
                const qIdx = option.dataset.question;
                const oIdx = option.dataset.option;

                container.querySelectorAll(`.diag-option[data-question="${qIdx}"]`).forEach(o => {
                    o.classList.remove('selected');
                });

                option.classList.add('selected');
                this.diagnosticoAnswers[qIdx] = parseInt(oIdx) + 1;

                this.updateDiagnosticoProgress();
            });
        });

        const submitBtn = document.getElementById('submit-diagnostico');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitDiagnostico());
        }

        if (window.lucide) lucide.createIcons();
    }

    updateDiagnosticoProgress() {
        const total = 24;
        const answered = Object.keys(this.diagnosticoAnswers).length;
        const pct = Math.round((answered / total) * 100);

        const textEl = document.getElementById('diag-progress-text');
        const barEl = document.getElementById('diag-progress-bar');
        const submitContainer = document.querySelector('.diagnostico-submit');

        if (textEl) textEl.textContent = `${answered} de ${total} preguntas`;
        if (barEl) barEl.style.width = `${pct}%`;
        if (submitContainer) {
            submitContainer.style.display = answered === total ? 'flex' : 'none';
        }
    }

    submitDiagnostico() {
        const total = 24;
        const answered = Object.keys(this.diagnosticoAnswers).length;

        if (answered < total) {
            alert('Por favor responde todas las preguntas antes de ver los resultados.');
            return;
        }

        let sectionScores = [];
        let questionIndex = 0;

        DIAGNOSTICO_DATA.sections.forEach((section, sIdx) => {
            let score = 0;
            section.questions.forEach((q, qIdx) => {
                score += this.diagnosticoAnswers[questionIndex] || 0;
                questionIndex++;
            });
            sectionScores.push({ name: section.name, score: score, max: 16 });
        });

        const totalScore = sectionScores.reduce((sum, s) => sum + s.score, 0);
        const maxTotal = 96;

        let level = '';
        let levelColor = '';
        if (totalScore >= 72) {
            level = 'Alta';
            levelColor = '#10b981';
        } else if (totalScore >= 48) {
            level = 'Media';
            levelColor = '#f59e0b';
        } else if (totalScore >= 24) {
            level = 'Baja';
            levelColor = '#f97316';
        } else {
            level = 'Muy Baja';
            levelColor = '#ef4444';
        }

        const resultsEl = document.getElementById('diagnostico-results');
        if (!resultsEl) return;

        const courseMapping = {
            'Autoconocimiento': ['Liderazgo Empático', 'Inteligencia Emocional'],
            'Autorregulación': ['Inteligencia Emocional', 'Resiliencia'],
            'Motivación': ['Liderazgo Empático', 'Creatividad e Innovación'],
            'Empatía': ['Comunicación Asertiva', 'Trabajo en Equipo'],
            'Habilidades Sociales': ['Comunicación Asertiva', 'Trabajo en Equipo'],
            'Conexión Emocional': ['Inteligencia Emocional', 'Pensamiento Crítico']
        };

        const weakSections = sectionScores
            .filter(s => s.score < 12)
            .sort((a, b) => a.score - b.score);

        const recommendedCourses = [];
        const seenCourses = new Set();

        weakSections.forEach(section => {
            const mapping = courseMapping[section.name];
            if (mapping) {
                mapping.forEach(course => {
                    if (!seenCourses.has(course)) {
                        seenCourses.add(course);
                        recommendedCourses.push({
                            course: course,
                            reason: `Mejorar ${section.name} (${section.score}/16)`
                        });
                    }
                });
            }
        });

        if (recommendedCourses.length === 0) {
            recommendedCourses.push(
                { course: 'Liderazgo Empático', reason: 'Mantener y fortalecer habilidades' },
                { course: 'Comunicación Asertiva', reason: 'Mantener y fortalecer habilidades' }
            );
        }

        resultsEl.style.display = 'block';
        resultsEl.innerHTML = `
            <div class="diag-results-card">
                <h3>Resultados del Diagnóstico</h3>
                <div class="diag-total-score">
                    <span class="diag-score-number" style="color: ${levelColor}">${totalScore}</span>
                    <span class="diag-score-total">/ ${maxTotal}</span>
                </div>
                <p class="diag-level" style="color: ${levelColor}">Nivel de Inteligencia Emocional: ${level}</p>
                
                <div class="diag-sections-results">
                    ${sectionScores.map(s => {
                        const pct = Math.round((s.score / s.max) * 100);
                        let secColor = pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
                        return `
                            <div class="diag-section-result">
                                <div class="diag-section-name">${s.name}</div>
                                <div class="diag-section-bar">
                                    <div class="diag-section-fill" style="width: ${pct}%; background: ${secColor};"></div>
                                </div>
                                <div class="diag-section-score" style="color: ${secColor}">${s.score}/${s.max}</div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <div class="roadmap-card">
                    <h4><i data-lucide="map"></i> Tu Roadmap de Aprendizaje</h4>
                    <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem;">
                        Basado en tus resultados, te recomendamos los siguientes cursos para mejorar:
                    </p>
                    
                    <div class="roadmap-timeline">
                        ${recommendedCourses.map((rec, idx) => `
                            <div class="roadmap-step">
                                <div class="roadmap-step-number">${idx + 1}</div>
                                <div class="roadmap-step-content">
                                    <h5>${rec.course}</h5>
                                    <p>${rec.reason}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="roadmap-summary">
                        <div class="roadmap-summary-item">
                            <i data-lucide="clock"></i>
                            <span>Tiempo estimado: ${recommendedCourses.length * 2} semanas</span>
                        </div>
                        <div class="roadmap-summary-item">
                            <i data-lucide="book-open"></i>
                            <span>${recommendedCourses.length} cursos recomendados</span>
                        </div>
                    </div>

                    <button class="cta-button" id="start-roadmap" style="margin-top: 1.5rem;">
                        <i data-lucide="play"></i>
                        Comenzar Primer Curso
                    </button>
                </div>

                <div class="diag-actions">
                    <button class="result-btn secondary" id="retry-diagnostico">Reiniciar</button>
                    <button class="result-btn primary" id="close-diagnostico">Cerrar</button>
                </div>
            </div>
        `;

        if (window.lucide) lucide.createIcons();

        document.getElementById('start-roadmap')?.addEventListener('click', () => {
            document.querySelector('[data-view="courses"]')?.click();
        });

        document.getElementById('retry-diagnostico')?.addEventListener('click', () => {
            this.diagnosticoAnswers = {};
            resultsEl.style.display = 'none';
            document.querySelectorAll('.diag-option').forEach(o => o.classList.remove('selected'));
            this.updateDiagnosticoProgress();
        });

        document.getElementById('close-diagnostico')?.addEventListener('click', () => {
            document.querySelector('[data-view="dashboard"]')?.click();
        });
    }

    handleViewChange(viewName) {
        if (this.view.elements.views[viewName]) {
            this.model.setActiveView(viewName);
            this.view.renderActiveView(viewName);
        }
    }

    handleSidebarToggle() {
        const isCollapsed = this.model.toggleSidebar();
        this.view.updateSidebarUI(isCollapsed);
    }

    handleMicStart() {
        this.model.setRecording(true);
        this.view.updateMicUI(true, 'Escuchando...');
    }

    handleMicStop() {
        this.model.setRecording(false);
        this.view.updateMicUI(false, 'Procesando...');
        setTimeout(() => {
            this.view.updateMicUI(false, 'Lista para escucharte');
        }, 2000);
    }

    handleProfileUpdate(newUsername) {
        this.model.userSettings.username = newUsername;
        this.view.updateSettingsUI(this.model.userSettings);
        alert('Perfil actualizado correctamente');
    }

    handleCourseStart(courseTitle) {
        const data = COURSES_DATA[courseTitle];
        const titleEl = document.getElementById('course-detail-title');
        const descEl = document.getElementById('course-detail-desc');
        const iconEl = document.getElementById('course-detail-icon');
        if (titleEl) titleEl.textContent = courseTitle;
        if (descEl) descEl.textContent = data?.description || 'Desarrolla esta habilidad con práctica interactiva.';
        if (iconEl && data) {
            const colorMap = {
                'course-red': 'background: rgba(239, 68, 68, 0.15);',
                'course-blue': 'background: rgba(59, 130, 246, 0.15);',
                'course-orange': 'background: rgba(249, 115, 22, 0.15);',
                'course-green': 'background: rgba(16, 185, 129, 0.15);',
                'course-purple': 'background: rgba(168, 85, 247, 0.15);',
                'course-yellow': 'background: rgba(234, 179, 8, 0.15);',
                'course-cyan': 'background: rgba(6, 182, 212, 0.15);',
                'course-magenta': 'background: rgba(236, 72, 153, 0.15);'
            };
            iconEl.style.cssText = colorMap[data.color] || 'background: rgba(192, 132, 252, 0.15);';
        }

        this.currentCourse = courseTitle;
        this.evaluationAnswers = {};

        document.querySelectorAll('.course-tab').forEach(t => t.classList.remove('active'));
        document.querySelector('.course-tab[data-tab="content"]')?.classList.add('active');
        document.querySelectorAll('.course-tab-content').forEach(c => c.style.display = 'none');
        document.getElementById('tab-content').style.display = 'block';

        const ctaContainer = document.getElementById('course-cta-container');
        if (ctaContainer) ctaContainer.style.display = 'flex';

        this.renderCourseContent(courseTitle);
        this.renderCourseResources(courseTitle);
        this.renderCourseEvaluation(courseTitle);

        this.handleViewChange('course-detail');
    }

    renderCourseContent(courseTitle) {
        const data = COURSES_DATA[courseTitle];
        if (!data?.content) return;

        const container = document.getElementById('course-content-body');
        if (!container) return;

        container.innerHTML = data.content.sections.map(section => `
            <div class="content-section">
                <h3>${section.heading}</h3>
                <p>${section.text}</p>
            </div>
        `).join('');

        if (window.lucide) lucide.createIcons();
    }

    renderCourseResources(courseTitle) {
        const data = COURSES_DATA[courseTitle];
        if (!data?.resources) return;

        const container = document.getElementById('course-resources-body');
        if (!container) return;

        const docsBase = './docs/';

        container.innerHTML = data.resources.map(resource => {
            const isPdf = resource.type === 'pdf';
            const icon = isPdf ? 'file-text' : 'play-circle';
            const typeLabel = isPdf ? 'PDF Document' : 'Video de YouTube';
            const href = isPdf ? `${docsBase}${resource.file}` : resource.url;
            const target = isPdf ? '_blank' : '_blank';

            return `
                <a href="${href}" target="${target}" class="resource-card">
                    <div class="resource-icon ${resource.type}">
                        <i data-lucide="${icon}"></i>
                    </div>
                    <div class="resource-info">
                        <h4>${resource.name}</h4>
                        <span>${typeLabel}</span>
                    </div>
                    <div class="resource-arrow">
                        <i data-lucide="external-link"></i>
                    </div>
                </a>
            `;
        }).join('');

        if (window.lucide) lucide.createIcons();
    }

    renderCourseEvaluation(courseTitle) {
        const data = COURSES_DATA[courseTitle];
        if (!data?.evaluation) return;

        const container = document.getElementById('course-evaluation-body');
        if (!container) return;

        const eval_ = data.evaluation;

        container.innerHTML = `
            <div class="evaluation-header">
                <h3>${eval_.title}</h3>
                <p>Responde las siguientes preguntas. Necesitas al menos ${eval_.passScore}% para aprobar.</p>
            </div>
            ${eval_.questions.map((q, i) => `
                <div class="evaluation-question" data-question="${i}">
                    <div class="question-number">Pregunta ${i + 1} de ${eval_.questions.length}</div>
                    <div class="question-text">${q.question}</div>
                    <div class="question-options">
                        ${q.options.map((opt, j) => `
                            <div class="question-option" data-question="${i}" data-option="${j}">
                                <div class="option-radio"></div>
                                <span>${opt}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
            <div class="submit-evaluation">
                <button class="cta-button" id="submit-evaluation">
                    <i data-lucide="check-circle"></i>
                    Enviar Evaluación
                </button>
            </div>
        `;

        container.querySelectorAll('.question-option').forEach(option => {
            option.addEventListener('click', () => {
                const qIdx = option.dataset.question;
                const oIdx = option.dataset.option;

                container.querySelectorAll(`.question-option[data-question="${qIdx}"]`).forEach(o => {
                    o.classList.remove('selected');
                });

                option.classList.add('selected');
                this.evaluationAnswers[qIdx] = parseInt(oIdx);
            });
        });

        const submitBtn = document.getElementById('submit-evaluation');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitEvaluation(courseTitle));
        }

        if (window.lucide) lucide.createIcons();
    }

    submitEvaluation(courseTitle) {
        const data = COURSES_DATA[courseTitle];
        if (!data?.evaluation) return;

        const eval_ = data.evaluation;
        const totalQuestions = eval_.questions.length;
        const answeredQuestions = Object.keys(this.evaluationAnswers).length;

        if (answeredQuestions < totalQuestions) {
            alert('Por favor responde todas las preguntas antes de enviar la evaluación.');
            return;
        }

        let correct = 0;
        eval_.questions.forEach((q, i) => {
            if (this.evaluationAnswers[i] === q.correct) {
                correct++;
            }
        });

        const score = Math.round((correct / totalQuestions) * 100);
        const passed = score >= eval_.passScore;

        const container = document.getElementById('course-evaluation-body');
        if (!container) return;

        container.querySelectorAll('.evaluation-question').forEach((q, i) => {
            const options = q.querySelectorAll('.question-option');
            options.forEach(opt => {
                const oIdx = parseInt(opt.dataset.option);
                opt.style.pointerEvents = 'none';

                if (oIdx === eval_.questions[i].correct) {
                    opt.classList.add('correct');
                } else if (this.evaluationAnswers[i] === oIdx && oIdx !== eval_.questions[i].correct) {
                    opt.classList.add('incorrect');
                }
            });
        });

        const submitArea = container.querySelector('.submit-evaluation');
        if (submitArea) {
            submitArea.innerHTML = `
                <div class="evaluation-result">
                    <div class="result-score ${passed ? 'passed' : 'failed'}">${score}%</div>
                    <div class="result-message">
                        ${passed
                            ? `¡Felicidades! Has aprobado la evaluación con ${correct} de ${totalQuestions} respuestas correctas.`
                            : `Has obtenido ${correct} de ${totalQuestions} respuestas correctas. Necesitas al menos ${eval_.passScore}% para aprobar.`
                        }
                    </div>
                    <div class="result-actions">
                        ${!passed ? `<button class="result-btn secondary" id="retry-evaluation">Reintentar</button>` : ''}
                        <button class="result-btn primary" id="close-evaluation">Cerrar</button>
                    </div>
                </div>
            `;

            const retryBtn = document.getElementById('retry-evaluation');
            if (retryBtn) {
                retryBtn.addEventListener('click', () => {
                    this.evaluationAnswers = {};
                    this.renderCourseEvaluation(courseTitle);
                });
            }

            const closeBtn = document.getElementById('close-evaluation');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    document.querySelector('.course-tab[data-tab="content"]')?.click();
                });
            }
        }
    }
}
