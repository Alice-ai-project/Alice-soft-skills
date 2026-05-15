/**
 * Dashboard View
 */
export class DashboardView {
    constructor() {
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
            coursesGrid: document.querySelector('.courses-grid')
        };
    }

    renderCourses(courses) {
        const grid = this.elements.coursesGrid;
        if (!grid) {
            console.error('Courses grid element not found!');
            return;
        }
        
        console.log('View: renderCourses called with', courses?.length, 'courses');
        
        if (!courses || !Array.isArray(courses) || courses.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 3rem;">' +
                             '<i data-lucide="search-x" style="width: 48px; height: 48px; margin-bottom: 1rem; opacity: 0.5;"></i>' +
                             '<p>No hay cursos disponibles en este momento.</p></div>';
            if (window.lucide) lucide.createIcons();
            return;
        }

        // Clear existing content
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
                const colorClass = `course-${colors[index % colors.length]}`;
                const progress = Math.floor(Math.random() * 50);
                
                let iconName = 'graduation-cap';
                for (const [key, icon] of Object.entries(iconMap)) {
                    if ((course.category && course.category.includes(key)) || (course.title && course.title.includes(key))) {
                        iconName = icon;
                        break;
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
                        <button class="course-btn">${progress > 0 ? 'Continuar' : 'Empezar'}</button>
                    </div>
                `;
                grid.appendChild(card);
            } catch (err) {
                console.error('Error rendering course card:', err);
            }
        });

        if (window.lucide) {
            lucide.createIcons();
            console.log('Lucide icons created for dynamic cards');
        }
    }

    updateSettingsUI(settings) {
        if (this.elements.usernameInput) {
            this.elements.usernameInput.value = settings.username;
        }
        if (this.elements.headerUserName) {
            this.elements.headerUserName.textContent = settings.username;
        }
    }

    updateStatsUI(stats) {
        // Update summary cards on main dashboard
        const statValues = document.querySelectorAll('.stat-value');
        if (statValues.length >= 2) {
            statValues[0].textContent = stats.completed || 0;
            // stats.chatSessions or learning time could go here
        }
    }

    renderActiveView(viewName) {
        this.elements.navItems.forEach(item => {
            if (item.getAttribute('data-view') === viewName) {
                item.classList.add('active');
                item.style.transform = 'scale(0.95)';
                setTimeout(() => item.style.transform = 'scale(1)', 100);
            } else {
                item.classList.remove('active');
            }
        });

        Object.keys(this.elements.views).forEach(key => {
            const viewEl = this.elements.views[key];
            if (viewEl) {
                viewEl.style.display = (key === viewName) ? 'block' : 'none';
            }
        });

        if (window.lucide) lucide.createIcons();
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

    updateQuoteUI(quote) {
        if (this.elements.motivationalQuote) {
            this.elements.motivationalQuote.textContent = `"${quote}"`;
        }
    }

    updateMicUI(isRecording, statusText) {
        if (this.elements.micBtn) {
            if (isRecording) {
                this.elements.micBtn.classList.add('active');
            } else {
                this.elements.micBtn.classList.remove('active');
            }
        }
        if (this.elements.aiStatusText) {
            this.elements.aiStatusText.textContent = statusText;
        }
    }

    bindViewChange(handler) {
        this.elements.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                handler(item.getAttribute('data-view'));
            });
        });
    }

    bindSidebarToggle(handler) {
        if (this.elements.toggleBtn) {
            this.elements.toggleBtn.addEventListener('click', handler);
        }
    }

    bindMicControls(startHandler, stopHandler) {
        if (this.elements.micBtn) {
            this.elements.micBtn.addEventListener('click', startHandler);
        }
        if (this.elements.stopBtn) {
            this.elements.stopBtn.addEventListener('click', stopHandler);
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

    bindProfileUpdate(handler) {
        if (this.elements.profileForm) {
            this.elements.profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                handler(this.elements.usernameInput.value);
            });
        }
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
