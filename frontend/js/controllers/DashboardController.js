/**
 * Dashboard Controller
 */
export class DashboardController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
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
        this.view.bindDashboardTabs((tabName) => this.view.switchDashboardTab(tabName));
        this.view.setupAvatarAnimations();

        // Bind Course Selection
        this.view.bindCourseSelection(this.handleCourseSelect.bind(this));
        this.view.bindBackToCourses(() => this.handleViewChange('courses'));

        // Initial render
        this.view.renderActiveView(this.model.activeView);

        // Fetch Real Data
        const profile = await this.model.loadProfile();
        if (profile) {
            this.view.updateSettingsUI(this.model.userSettings);
        }

        const courses = await this.model.loadCourses();
        this.view.renderCourses(courses);

        // Update stats from real course data
        this.updateStatsFromCourses(courses);
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

    async handleCourseSelect(courseTitle) {
        try {
            // Show loading state
            const titleEl = document.getElementById('course-detail-title');
            if (titleEl) titleEl.textContent = 'Cargando...';
            this.handleViewChange('course-detail');

            // Fetch from backend RAG endpoint dynamically
            const response = await fetch(`${this.model.API_URL}/courses/rag?course_name=${encodeURIComponent(courseTitle)}`);
            if (!response.ok) {
                throw new Error('Error al obtener el contenido RAG desde el servidor.');
            }

            const courseData = await response.json();
            
            // Set real title
            if (titleEl) titleEl.textContent = courseData.title || courseTitle;

            // Render view detail
            this.view.renderCourseDetail(courseData, async (score) => {
                await this.handleCourseComplete(courseTitle, score);
            });

        } catch (error) {
            console.error('Error fetching course RAG content:', error);
            alert('Hubo un error al cargar el contenido del curso. Por favor, asegúrese de que el servidor backend esté corriendo.');
            
            // Back to courses
            this.handleViewChange('courses');
        }
    }

    async handleCourseComplete(courseTitle, score) {
        // Update model progress locally and persist in localStorage
        this.model.saveCourseProgress(courseTitle, 100);
        
        // Update stats based on new progress list
        this.updateStatsFromCourses(this.model.courses);

        // Re-render courses list
        this.view.renderCourses(this.model.courses);
        
        // Navigate back to courses view
        this.handleViewChange('courses');
    }

    updateStatsFromCourses(courses) {
        if (!courses || courses.length === 0) return;
        const total = courses.length;
        const completed = courses.filter(c => c.progress === 100).length;
        
        // Calculate average score/progress from courses list
        const totalProgress = courses.reduce((sum, c) => sum + (c.progress || 0), 0);
        const avgScore = Math.round(totalProgress / total);
        
        this.model.stats = {
            total: total,
            completed: completed,
            avg_score: avgScore,
            chatSessions: this.model.stats.chatSessions || 12,
            streak: this.model.stats.streak || 3
        };
        
        this.view.updateStatsUI(this.model.stats);
    }
}

