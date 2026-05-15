/**
 * Dashboard Model
 */
export class DashboardModel {
    constructor() {
        this.API_URL = 'http://localhost:8000';
        this.userId = '896989ee-0df4-4353-b544-ae3394df6fc5'; // Real user from DB
        this.activeView = 'dashboard';
        this.isSidebarCollapsed = false;
        this.isRecording = false;
        this.userSettings = {
            username: 'Cargando...',
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

    async loadProfile(userId) {
        if (userId) this.userId = userId;
        try {
            const response = await fetch(`${this.API_URL}/profiles/${this.userId}`);
            if (response.ok) {
                const data = await response.json();
                this.userSettings.username = data.display_name || data.username;
                return data;
            } else {
                console.warn('Profile not found, using default data');
                this.userSettings.username = 'Invitado';
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            this.userSettings.username = 'Invitado';
        }
        return null;
    }

    async loadCourses() {
        try {
            const response = await fetch(`${this.API_URL}/courses/`);
            if (response.ok) {
                this.courses = await response.json();
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
