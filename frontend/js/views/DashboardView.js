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
            navItems: document.querySelectorAll('.nav-subitem, .nav-main-item'),
            navSections: document.querySelectorAll('.nav-section'),
            navSectionHeaders: document.querySelectorAll('.nav-section-header'),
            views: {
                'dashboard': document.getElementById('dashboard-view'),
                'conversation': document.getElementById('conversation-view'),
                'courses': document.getElementById('courses-view'),
                'course-detail': document.getElementById('course-detail-view'),
                'stats': document.getElementById('stats-view'),
                'config': document.getElementById('config-view'),
                'goals': document.getElementById('goals-view'),
                'resources': document.getElementById('resources-view'),
                'diagnostico': document.getElementById('diagnostico-view')
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

        // Render courses
        courses.forEach(course => {
            const card = document.createElement('div');
            card.className = `course-card ${course.color || ''}`;
            card.setAttribute('data-course-id', course.id || course.slug);
            
            const progress = course.progress || 0;
            
            card.innerHTML = `
                <div class="course-icon"><i data-lucide="${course.icon || 'book'}"></i></div>
                <h3 class="course-title">${course.name}</h3>
                <p class="course-desc">${course.description || ''}</p>
                <div class="course-progress">
                    <span>${progress}%</span>
                    <div class="p-bar"><div class="p-fill" style="width: ${progress}%;"></div></div>
                </div>
                <button class="course-btn">${progress > 0 ? 'Continuar' : 'Empezar'}</button>
            `;
            
            grid.appendChild(card);
        });

        if (window.lucide) lucide.createIcons();
    }

    bindViewChange(handler) {
        this.elements.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const viewName = item.getAttribute('data-view');
                if (viewName) {
                    handler(viewName);
                }
            });
        });
    }

    bindSidebarToggle(handler) {
        if (this.elements.toggleBtn) {
            this.elements.toggleBtn.addEventListener('click', handler);
        }
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

    renderActiveView(viewName) {
        this.elements.navItems.forEach(item => {
            if (item.getAttribute('data-view') === viewName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        this.elements.navSections.forEach(section => {
            const sectionItems = section.querySelectorAll('.nav-subitem');
            const hasActive = Array.from(sectionItems).some(item => 
                item.getAttribute('data-view') === viewName
            );
            if (hasActive) {
                section.classList.add('active');
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

    bindMicControls(onStart, onStop) {
        if (this.elements.micBtn) {
            this.elements.micBtn.addEventListener('mousedown', onStart);
            this.elements.micBtn.addEventListener('mouseup', onStop);
            this.elements.micBtn.addEventListener('mouseleave', onStop);
        }
        if (this.elements.stopBtn) {
            this.elements.stopBtn.addEventListener('click', onStop);
        }
    }

    updateMicUI(isRecording, statusText) {
        if (isRecording) {
            this.elements.micBtn?.classList.add('recording');
            this.elements.stopBtn?.style.setProperty('display', 'flex');
        } else {
            this.elements.micBtn?.classList.remove('recording');
            this.elements.stopBtn?.style.setProperty('display', 'none');
        }
        if (this.elements.aiStatusText) {
            this.elements.aiStatusText.textContent = statusText;
        }
    }

    updateQuoteUI(quote) {
        if (this.elements.motivationalQuote) {
            this.elements.motivationalQuote.textContent = `"${quote}"`;
        }
    }

    bindExtraActions(onChat, onDash) {
        if (this.elements.chatCta) {
            this.elements.chatCta.addEventListener('click', onChat);
        }
        if (this.elements.backBtn) {
            this.elements.backBtn.addEventListener('click', onDash);
        }
    }

    setupAvatarAnimations() {
        // Placeholder for avatar animation logic
    }

    bindCourseButtons(handler) {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('course-btn')) {
                const card = e.target.closest('.course-card');
                if (card) {
                    const title = card.querySelector('.course-title')?.textContent;
                    if (title) handler(title);
                }
            }
        });
    }

    bindProfileUpdate(handler) {
        if (this.elements.profileForm) {
            this.elements.profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const newUsername = this.elements.usernameInput?.value;
                if (newUsername) handler(newUsername);
            });
        }
    }

    updateSettingsUI(settings) {
        if (this.elements.usernameInput && settings.username) {
            this.elements.usernameInput.value = settings.username;
        }
        if (this.elements.headerUserName && settings.username) {
            this.elements.headerUserName.textContent = settings.username;
        }
    }
}
