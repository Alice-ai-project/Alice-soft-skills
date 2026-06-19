/**
 * Dashboard Model
 */
export class DashboardModel {
    constructor() {
        this.API_URL = 'http://localhost:8000';
        this.userId = null;
        this.activeView = 'dashboard';
        this.isSidebarCollapsed = false;
        this.isRecording = false;
        this.userSettings = {
            username: 'Usuario',
            theme: 'dark'
        };
        this.courses = [];
        this.stats = {
            completed: 0,
            chatSessions: 0,
            streak: 0
        };
        this.quotes = [
            "El éxito no es el final, el fracaso no es fatal: es el coraje para continuar lo que cuenta.",
            "Cree en ti mismo y en todo lo que eres. Hay algo dentro de ti que es más grande que cualquier obstáculo.",
            "La única forma de hacer un gran trabajo es amar lo que haces.",
            "Tu tiempo es limitado, así que no lo pierdas viviendo la vida de alguien más.",
            "La mejor manera de predecir el futuro es creándolo."
        ];
    }

    setUserId(userId) {
        this.userId = userId;
    }

    async loadProfile(userId) {
        if (userId) this.userId = userId;
        if (!this.userId) {
            console.warn('No userId available');
            return null;
        }
        try {
            const response = await fetch(`${this.API_URL}/api/v1/profiles/${this.userId}`);
            if (response.ok) {
                const data = await response.json();
                this.userSettings.username = data.display_name || data.username || this.userSettings.username;
                return data;
            } else {
                console.warn('Profile not found, using default data');
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
        return null;
    }

    async loadCourses() {
        try {
            const response = await fetch(`${this.API_URL}/api/v1/courses/`);
            if (response.ok) {
                const data = await response.json();
                this.courses = Array.isArray(data) ? data : [];
                return this.courses;
            }
        } catch (error) {
            console.error('Error loading courses:', error);
        }
        return [];
    }

    getRandomQuote() {
        return this.quotes[Math.floor(Math.random() * this.quotes.length)];
    }

    setActiveView(view) {
        this.activeView = view;
    }

    toggleSidebar() {
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
        return this.isSidebarCollapsed;
    }

    setRecording(state) {
        this.isRecording = state;
    }
}
