/**
 * Alice - Main Entry Point
 */
import { DashboardModel } from './models/DashboardModel.js';
import { DashboardView } from './views/DashboardView.js';
import { DashboardController } from './controllers/DashboardController.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Dashboard
    const dashboardApp = new DashboardController(
        new DashboardModel(), 
        new DashboardView()
    );

    console.log('Alice Application Initialized');
});
