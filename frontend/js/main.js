import { AuthModel } from './models/AuthModel.js';
import { AuthView } from './views/AuthView.js';
import { AuthController } from './controllers/AuthController.js';
import { DashboardModel } from './models/DashboardModel.js';
import { DashboardView } from './views/DashboardView.js';
import { DashboardController } from './controllers/DashboardController.js';

document.addEventListener('DOMContentLoaded', () => {
    const appModel = new AuthModel();
    const appView = new AuthView();
    const appController = new AuthController(appModel, appView);

    // Override showDashboard to load the full dashboard
    const originalShowDashboard = appController.showDashboard.bind(appController);
    appController.showDashboard = function() {
        const user = this.model.getUser();
        if (!user) return;

        const appContainer = document.getElementById('auth-app');
        appContainer.innerHTML = '';

        // Load dashboard CSS
        const cssFiles = ['dashboard.css', 'conversation.css', 'courses.css', 'stats.css', 'config.css'];
        cssFiles.forEach(css => {
            if (!document.querySelector(`link[href="./css/${css}"]`)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = `./css/${css}`;
                document.head.appendChild(link);
            }
        });

        // Initialize Dashboard MVC
        const dashboardModel = new DashboardModel();
        dashboardModel.userSettings = { ...dashboardModel.userSettings, username: user.name, email: user.email };
        const dashboardView = new DashboardView();
        const dashboardController = new DashboardController(dashboardModel, dashboardView);

        console.log('Alice Dashboard loaded for user:', user.name);
    };

    console.log('Alice SPA initialized with MVC pattern.');
});
