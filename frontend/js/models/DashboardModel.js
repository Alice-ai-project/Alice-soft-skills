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
        this.courses = [
            {
                title: "Liderazgo Empático",
                description: "Aprende a guiar equipos con inteligencia emocional y empatía.",
                icon: "users",
                color: "red",
                progress: 75
            },
            {
                title: "Comunicación Asertiva",
                description: "Domina el arte de expresar tus ideas con claridad y respeto.",
                icon: "message-circle",
                color: "blue",
                progress: 40
            },
            {
                title: "Creatividad e Innovación",
                description: "Desbloquea tu potencial creativo para resolver problemas.",
                icon: "lightbulb",
                color: "orange",
                progress: 10
            },
            {
                title: "Pensamiento Crítico",
                description: "Mejora tu capacidad de análisis y toma de decisiones.",
                icon: "brain",
                color: "green",
                progress: 0
            },
            {
                title: "Inteligencia Emocional",
                description: "Gestiona tus emociones para un mejor bienestar personal.",
                icon: "heart",
                color: "purple",
                progress: 90
            },
            {
                title: "Trabajo en Equipo",
                description: "Colabora de manera efectiva para alcanzar objetivos comunes.",
                icon: "user-plus",
                color: "yellow",
                progress: 25
            },
            {
                title: "Gestión del Tiempo",
                description: "Optimiza tu productividad y reduce el estrés laboral.",
                icon: "timer",
                color: "cyan",
                progress: 55
            },
            {
                title: "Resiliencia",
                description: "Fortalece tu capacidad para superar la adversidad.",
                icon: "shield",
                color: "magenta",
                progress: 0
            }
        ];
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
                const apiCourses = await response.json();
                if (apiCourses && apiCourses.length > 0) {
                    // Create a mapping of key prefixes to local mock details
                    const mockMap = {};
                    this.courses.forEach(c => {
                        const key = c.title.split(' ')[0].toLowerCase();
                        mockMap[key] = c;
                    });

                    // Load saved progress from localStorage
                    const savedProgress = JSON.parse(localStorage.getItem('alice_course_progress') || '{}');

                    this.courses = apiCourses.map(ac => {
                        const key = ac.title.split(' ')[0].toLowerCase();
                        const mock = mockMap[key] || {};
                        const title = ac.title === 'Liderazgo' ? 'Liderazgo Empático' : ac.title;
                        const progress = savedProgress[title] !== undefined ? savedProgress[title] : (ac.progress !== undefined ? ac.progress : (mock.progress !== undefined ? mock.progress : 0));
                        return {
                            ...ac,
                            title,
                            description: ac.description || mock.description || 'Desarrolla tus habilidades blandas y crece profesionalmente.',
                            icon: mock.icon || 'graduation-cap',
                            color: mock.color || 'blue',
                            progress
                        };
                    });
                    return this.courses;
                }
            }
        } catch (error) {
            console.error('Error loading courses:', error);
        }
        // Fallback to static mock courses
        return this.courses;
    }

    saveCourseProgress(courseTitle, progress) {
        const course = this.courses.find(c => c.title === courseTitle);
        if (course) {
            course.progress = progress;
        }
        
        // Save to localStorage
        const savedProgress = JSON.parse(localStorage.getItem('alice_course_progress') || '{}');
        savedProgress[courseTitle] = progress;
        localStorage.setItem('alice_course_progress', JSON.stringify(savedProgress));
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
