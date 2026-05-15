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
        this.view.setupAvatarAnimations();

        // Initial render
        this.view.renderActiveView(this.model.activeView);

        // Fetch Real Data
        const profile = await this.model.loadProfile();
        if (profile) {
            this.view.updateSettingsUI(this.model.userSettings);
        }

        const courses = await this.model.loadCourses();
        this.view.renderCourses(courses);
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
}
