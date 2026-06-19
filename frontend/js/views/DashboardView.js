/**
 * Dashboard View
 */
import { ChatView } from './ChatView.js';
import { CoursesView } from './CoursesView.js';
import { StatsView } from './StatsView.js';
import { ConfigView } from './ConfigView.js';

export class DashboardView {
    constructor() {
        this.renderLayout();
        
        // Initialize sub-views
        this.chatView = new ChatView();
        this.coursesView = new CoursesView();
        this.statsView = new StatsView();
        this.configView = new ConfigView();

        this.elements = {
            sidebar: document.getElementById('sidebar'),
            toggleBtn: document.getElementById('toggleBtn'),
            toggleIcon: document.getElementById('toggleIcon'),
            motivationalQuote: document.getElementById('motivational-quote'),
            navItems: document.querySelectorAll('.nav-item'),
            views: {
                'dashboard': document.getElementById('dashboard-view'),
                'conversation': document.getElementById('conversation-view'),
                'courses': document.getElementById('courses-view'),
                'course-detail': document.getElementById('course-detail-view'),
                'stats': document.getElementById('stats-view'),
                'config': document.getElementById('config-view')
            },
            micBtn: document.getElementById('mic-btn'),
            stopBtn: document.getElementById('stop-btn'),
            aiStatusText: document.getElementById('ai-status-text'),
            chatCta: document.getElementById('chat-cta'),
            backBtn: document.getElementById('back-to-dash'),
            aliceAvatar: document.getElementById('alice-avatar'),
            profileForm: document.getElementById('profile-form'),
            usernameInput: document.getElementById('username-input'),
            headerUserName: document.getElementById('header-user-name'),
            coursesGrid: document.querySelector('.courses-grid'),
            tabBtns: document.querySelectorAll('.tab-btn'),
            overviewContent: document.getElementById('overview-content'),
            goalsContent: document.getElementById('goals-content')
        };
    }

    renderLayout() {
        // Create the background glows
        const glow1 = document.createElement('div');
        glow1.className = 'bg-glow-1';
        const glow2 = document.createElement('div');
        glow2.className = 'bg-glow-2';
        
        // Create the sidebar
        const sidebar = document.createElement('aside');
        sidebar.id = 'sidebar';
        sidebar.innerHTML = `
            <button class="sidebar-toggle" id="toggleBtn">
                <i data-lucide="chevron-left" id="toggleIcon"></i>
            </button>
            <div class="sidebar-header">
                <img src="./assets/logo.png" alt="Alice Logo" class="logo-img">
                <span class="brand-name">Alice</span>
            </div>
            <nav class="nav-links">
                <a href="#" class="nav-item active" data-view="dashboard">
                    <div class="nav-icon"><i data-lucide="layout-dashboard"></i></div>
                    <span class="nav-text">Panel Principal</span>
                </a>
                <a href="#" class="nav-item" data-view="conversation">
                    <div class="nav-icon"><i data-lucide="message-square"></i></div>
                    <span class="nav-text">Habla con el Asistente IA</span>
                </a>
                <a href="#" class="nav-item" data-view="courses">
                    <div class="nav-icon"><i data-lucide="graduation-cap"></i></div>
                    <span class="nav-text">Cursos</span>
                </a>
                <a href="#" class="nav-item" data-view="stats">
                    <div class="nav-icon"><i data-lucide="bar-chart-3"></i></div>
                    <span class="nav-text">Estadísticas</span>
                </a>
                <div style="flex: 1;"></div>
                <a href="#" class="nav-item" data-view="config">
                    <div class="nav-icon"><i data-lucide="settings"></i></div>
                    <span class="nav-text">Configuración</span>
                </a>
            </nav>
        `;

        // Create main container
        const main = document.createElement('main');
        main.innerHTML = `
            <!-- Dashboard View -->
            <div id="dashboard-view" class="view-container">
                <div class="header-top">
                    <div class="header-tabs">
                        <button class="tab-btn active" data-tab="overview">Resumen</button>
                        <button class="tab-btn" data-tab="goals">Objetivos</button>
                    </div>
                    <div class="user-profile" style="display: flex; align-items: center; gap: 1rem;">
                        <span style="font-weight: 500; color: var(--text-secondary);">Hola, <span id="header-user-name">Usuario</span></span>
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--surface-hover);"></div>
                    </div>
                </div>

                <div id="overview-content">
                    <section class="avatar-card">
                            <div class="voice-visualizer small-avatar" id="alice-avatar">
                                <span class="voice-bar"></span>
                                <span class="voice-bar"></span>
                                <span class="voice-bar"></span>
                                <span class="voice-bar"></span>
                                <span class="voice-bar"></span>
                            </div>
                        <div class="avatar-info">
                            <p class="avatar-quote" id="motivational-quote">"El éxito no es el final, el fracaso no es fatal: es el coraje para continuar lo que cuenta."</p>
                            <p class="avatar-subtext">Tu asistente personal Alice está lista para ayudarte hoy.</p>
                        </div>
                    </section>

                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-header">
                                <div class="stat-icon-bg"><i data-lucide="book-open"></i></div>
                                <span style="color: #10b981; font-size: 0.8rem; font-weight: 600;">+2 esta semana</span>
                            </div>
                            <div class="stat-value" id="stat-completed-courses">4</div>
                            <div class="stat-label">Cursos Completados</div>
                            <div class="progress-bar">
                                <div class="progress-fill" id="stat-completed-fill" style="width: 80%;"></div>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-header">
                                <div class="stat-icon-bg"><i data-lucide="clock"></i></div>
                                <span style="color: var(--accent-color); font-size: 0.8rem; font-weight: 600;">En progreso</span>
                            </div>
                            <div class="stat-value" id="stat-learning-time">12h</div>
                            <div class="stat-label">Tiempo de Aprendizaje</div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 65%;"></div>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div class="stat-header">
                                <div class="stat-icon-bg"><i data-lucide="award"></i></div>
                                <span style="color: #f59e0b; font-size: 0.8rem; font-weight: 600;">Nivel 5</span>
                            </div>
                            <div class="stat-value" id="stat-avg-score">85%</div>
                            <div class="stat-label">Calificación Promedio</div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 85%;"></div>
                            </div>
                        </div>
                    </div>

                    <div class="cta-container">
                        <button class="cta-button" id="chat-cta">
                            <i data-lucide="message-square"></i>
                            Hablar conmigo
                        </button>
                    </div>
                </div>

                <div id="goals-content" style="display: none;">
                    <div class="goals-list">
                        <div class="goal-item done">
                            <div class="goal-status-icon"><i data-lucide="check-circle"></i></div>
                            <div class="goal-info">
                                <h3>Completar curso de Liderazgo</h3>
                                <p>Finalizar todos los módulos y el examen final.</p>
                            </div>
                            <span class="status-badge">Hecho</span>
                        </div>
                        <div class="goal-item in-progress">
                            <div class="goal-status-icon"><i data-lucide="clock"></i></div>
                            <div class="goal-info">
                                <h3>Mejorar asertividad en el chat</h3>
                                <p>Realizar 5 sesiones con Alice enfocadas en comunicación.</p>
                            </div>
                            <span class="status-badge">En proceso</span>
                        </div>
                        <div class="goal-item pending">
                            <div class="goal-status-icon"><i data-lucide="circle"></i></div>
                            <div class="goal-info">
                                <h3>Obtener 1000 puntos de habilidad</h3>
                                <p>Sigue practicando para alcanzar el siguiente nivel.</p>
                            </div>
                            <span class="status-badge">No hecho</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Conversation View -->
            <div id="conversation-view" class="view-container" style="display: none;">
                <div class="header-top">
                    <h1 class="brand-name">Habla con el Asistente IA</h1>
                    <div class="user-profile" style="display: flex; align-items: center; gap: 1rem;">
                        <button class="back-btn" id="back-to-dash">
                            <i data-lucide="arrow-left"></i> Volver
                        </button>
                    </div>
                </div>

                <div class="chat-main">
                    <div class="alice-chat-container" id="chat-container">
                        <div class="alice-large-avatar">
                            <div class="pulse-ring"></div>
                            <div class="pulse-ring" style="animation-delay: 1s"></div>
                            <div class="voice-visualizer">
                                <span class="voice-bar"></span>
                                <span class="voice-bar"></span>
                                <span class="voice-bar"></span>
                                <span class="voice-bar"></span>
                                <span class="voice-bar"></span>
                                <span class="voice-bar"></span>
                                <span class="voice-bar"></span>
                            </div>
                        </div>
                        <div class="alice-status">
                            <span class="status-dot"></span>
                            <span id="ai-status-text">Lista para escucharte</span>
                        </div>
                        <div class="chat-bubble" id="chat-response">
                            "Hola, soy Alice. Estoy aquí para escucharte y ayudarte a mejorar tus soft skills. ¿Sobre qué te gustaría hablar hoy?"
                        </div>
                    </div>

                    <div class="voice-controls">
                        <button class="voice-btn stop" id="stop-btn" style="display: none;">
                            <i data-lucide="square"></i>
                        </button>
                        <button class="voice-btn record active" id="mic-btn">
                            <div class="mic-ripple"></div>
                            <i data-lucide="mic"></i>
                        </button>
                        <button class="voice-btn mute" id="mute-btn">
                            <i data-lucide="volume-2"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Courses View -->
            <div id="courses-view" class="view-container" style="display: none;">
                <div class="header-top">
                    <h1 class="brand-name">Cursos Disponibles</h1>
                    <div class="user-profile" style="display: flex; align-items: center; gap: 1rem;">
                        <span style="font-weight: 500; color: var(--text-secondary);">Progreso General: 35%</span>
                        <div class="progress-bar" style="width: 150px; margin-top: 0;">
                            <div class="progress-fill" style="width: 35%;"></div>
                        </div>
                    </div>
                </div>

                <div class="courses-grid">
                    <!-- Los cursos se cargan dinámicamente desde JavaScript -->
                </div>
            </div>

            <!-- Course Detail View (RAG Template) -->
            <div id="course-detail-view" class="view-container" style="display: none;">
                <div class="header-top">
                    <h1 class="brand-name" id="course-detail-title">Cargando Curso...</h1>
                    <div class="user-profile">
                        <button class="back-btn" id="back-to-courses-btn">
                            <i data-lucide="arrow-left"></i> Volver a Cursos
                        </button>
                    </div>
                </div>
                
                <div class="course-detail-container" id="course-detail-container">
                    <!-- RAG Content will load here dynamically -->
                </div>
            </div>

            <!-- Statistics View -->
            <div id="stats-view" class="view-container" style="display: none;">
                <div class="header-top">
                    <h1 class="brand-name">Tus Estadísticas</h1>
                    <div class="user-profile">
                        <button class="back-btn" onclick="document.querySelector('[data-view=\\'dashboard\\']').click()">
                            <i data-lucide="arrow-left"></i> Volver
                        </button>
                    </div>
                </div>

                <div class="stats-container">
                    <div class="stats-summary">
                        <div class="summary-card">
                            <div class="summary-icon"><i data-lucide="award"></i></div>
                            <div class="summary-info">
                                <h4>Cursos Completados</h4>
                                <div class="value" id="stat-total-courses">4</div>
                            </div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-icon"><i data-lucide="messages-square"></i></div>
                            <div class="summary-info">
                                <h4>Sesiones de Chat</h4>
                                <div class="value">12</div>
                            </div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-icon"><i data-lucide="zap"></i></div>
                            <div class="summary-info">
                                <h4>Racha Actual</h4>
                                <div class="value">3 días</div>
                            </div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-icon"><i data-lucide="trending-up"></i></div>
                            <div class="summary-info">
                                <h4>Nivel Alice</h4>
                                <div class="value">Plata</div>
                            </div>
                        </div>
                    </div>

                    <div class="details-grid">
                        <div class="chart-card">
                            <div class="card-header">
                                <h3>Actividad Semanal</h3>
                            </div>
                            <div class="bar-chart">
                                <div class="bar-group">
                                    <div class="bar" style="height: 60%;" data-value="12"></div>
                                    <span class="bar-label">Lun</span>
                                </div>
                                <div class="bar-group">
                                    <div class="bar" style="height: 85%;" data-value="18"></div>
                                    <span class="bar-label">Mar</span>
                                </div>
                                <div class="bar-group">
                                    <div class="bar" style="height: 45%;" data-value="9"></div>
                                    <span class="bar-label">Mie</span>
                                </div>
                                <div class="bar-group">
                                    <div class="bar" style="height: 100%;" data-value="22"></div>
                                    <span class="bar-label">Jue</span>
                                </div>
                                <div class="bar-group">
                                    <div class="bar" style="height: 70%;" data-value="14"></div>
                                    <span class="bar-label">Vie</span>
                                </div>
                                <div class="bar-group">
                                    <div class="bar" style="height: 30%;" data-value="6"></div>
                                    <span class="bar-label">Sab</span>
                                </div>
                                <div class="bar-group">
                                    <div class="bar" style="height: 50%;" data-value="10"></div>
                                    <span class="bar-label">Dom</span>
                                </div>
                            </div>
                        </div>

                        <div class="chart-card">
                            <div class="card-header">
                                <h3>Habilidades en Mejora</h3>
                            </div>
                            <div class="skills-list">
                                <div class="skill-item">
                                    <div class="skill-info">
                                        <span class="skill-name">Comunicación</span>
                                        <span class="skill-perc">85%</span>
                                    </div>
                                    <div class="skill-bar-bg"><div class="skill-bar-fill" style="width: 85%;"></div></div>
                                </div>
                                <div class="skill-item">
                                    <div class="skill-info">
                                        <span class="skill-name">Liderazgo</span>
                                        <span class="skill-perc">60%</span>
                                    </div>
                                    <div class="skill-bar-bg"><div class="skill-bar-fill" style="width: 60%;"></div></div>
                                </div>
                                <div class="skill-item">
                                    <div class="skill-info">
                                        <span class="skill-name">Resiliencia</span>
                                        <span class="skill-perc">45%</span>
                                    </div>
                                    <div class="skill-bar-bg"><div class="skill-bar-fill" style="width: 45%;"></div></div>
                                </div>
                                <div class="skill-item">
                                    <div class="skill-info">
                                        <span class="skill-name">Empatía</span>
                                        <span class="skill-perc">92%</span>
                                    </div>
                                    <div class="skill-bar-bg"><div class="skill-bar-fill" style="width: 92%;"></div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Configuration View -->
            <div id="config-view" class="view-container" style="display: none;">
                <div class="header-top">
                    <h1 class="brand-name">Configuración</h1>
                </div>

                <div class="config-container">
                    <section class="config-section">
                        <h3><i data-lucide="user"></i> Perfil de Usuario</h3>
                        <form id="profile-form">
                            <div class="form-group">
                                <label for="username-input">Nombre de Usuario</label>
                                <input type="text" id="username-input" class="form-control" value="Usuario">
                            </div>
                            <div class="form-group">
                                <label for="email-input">Correo Electrónico</label>
                                <input type="email" id="email-input" class="form-control" value="usuario@ejemplo.com" readonly>
                            </div>
                            <button type="submit" class="save-btn">Guardar Cambios</button>
                        </form>
                    </section>

                    <section class="config-section">
                        <h3><i data-lucide="sliders"></i> Preferencias</h3>
                        <div class="settings-grid">
                            <div class="setting-toggle">
                                <div class="toggle-info">
                                    <h4>Modo Oscuro</h4>
                                    <p>Alternar entre tema claro y oscuro</p>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" id="theme-toggle" checked>
                                    <span class="slider"></span>
                                </label>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        `;

        document.body.appendChild(glow1);
        document.body.appendChild(glow2);
        document.body.appendChild(sidebar);
        document.body.appendChild(main);

        if (window.lucide) {
            lucide.createIcons();
        }
    }

    renderActiveView(viewName) {
        console.log('Rendering active view:', viewName);
        
        // Hide all views
        Object.keys(this.elements.views).forEach(key => {
            if (this.elements.views[key]) {
                this.elements.views[key].style.display = 'none';
            }
        });

        // Show active view
        if (this.elements.views[viewName]) {
            this.elements.views[viewName].style.display = 'block';
        }

        // Update active sidebar nav link
        this.elements.navItems.forEach(item => {
            if (item.getAttribute('data-view') === viewName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    updateSidebarUI(isCollapsed) {
        if (isCollapsed) {
            this.elements.sidebar.classList.add('collapsed');
            this.elements.toggleIcon.setAttribute('data-lucide', 'chevron-right');
        } else {
            this.elements.sidebar.classList.remove('collapsed');
            this.elements.toggleIcon.setAttribute('data-lucide', 'chevron-left');
        }
        if (window.lucide) lucide.createIcons();
    }

    updateMicUI(isRecording, statusText) {
        this.chatView.updateMicUI(isRecording, statusText);
    }

    updateQuoteUI(quote) {
        if (this.elements.motivationalQuote) {
            this.elements.motivationalQuote.textContent = `"${quote}"`;
        }
    }

    switchDashboardTab(tabName) {
        if (tabName === 'overview') {
            this.elements.overviewContent.style.display = 'block';
            this.elements.goalsContent.style.display = 'none';
        } else {
            this.elements.overviewContent.style.display = 'none';
            this.elements.goalsContent.style.display = 'block';
        }

        this.elements.tabBtns.forEach(btn => {
            if (btn.getAttribute('data-tab') === tabName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        if (window.lucide) lucide.createIcons();
    }

    // Courses View delegations
    renderCourses(courses) {
        this.coursesView.renderCourses(courses);
    }

    bindCourseSelection(handler) {
        this.coursesView.bindCourseSelection(handler);
    }

    bindBackToCourses(handler) {
        this.coursesView.bindBackToCourses(handler);
    }

    renderCourseDetail(courseData, onCourseComplete) {
        this.coursesView.renderCourseDetail(courseData, onCourseComplete);
    }

    // Config View delegations
    updateSettingsUI(settings) {
        this.configView.updateSettingsUI(settings);
    }

    bindProfileUpdate(handler) {
        this.configView.bindProfileUpdate(handler);
    }

    // Stats View delegations
    updateStatsUI(stats) {
        this.statsView.updateStatsUI(stats);
    }

    // Chat View delegations
    displayAIMessage(message) {
        this.chatView.displayAIMessage(message);
    }

    displayUserMessage(message) {
        this.chatView.displayUserMessage(message);
    }

    bindMicControls(startHandler, stopHandler) {
        this.chatView.bindMicControls(startHandler, stopHandler);
    }

    // Event binders
    bindViewChange(handler) {
        this.elements.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const viewName = item.getAttribute('data-view');
                handler(viewName);
            });
        });
    }

    bindSidebarToggle(handler) {
        if (this.elements.toggleBtn) {
            this.elements.toggleBtn.addEventListener('click', handler);
        }
    }

    bindExtraActions(chatCtaHandler, backBtnHandler) {
        if (this.elements.chatCta) {
            this.elements.chatCta.addEventListener('click', chatCtaHandler);
        }
        if (this.elements.backBtn) {
            this.elements.backBtn.addEventListener('click', backBtnHandler);
        }
    }

    bindDashboardTabs(handler) {
        this.elements.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.getAttribute('data-tab');
                handler(tabName);
            });
        });
    }

    setupAvatarAnimations() {
        if (this.elements.aliceAvatar) {
            this.elements.aliceAvatar.addEventListener('mouseover', () => {
                this.elements.aliceAvatar.style.transform = 'scale(1.1) rotate(5deg)';
                this.elements.aliceAvatar.style.transition = 'transform 0.3s ease';
            });
            this.elements.aliceAvatar.addEventListener('mouseout', () => {
                this.elements.aliceAvatar.style.transform = 'scale(1) rotate(0deg)';
            });
        }
    }
}
