export class AuthController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // Initialize
        this.view.renderStructure();
        
        // Bind events
        this.view.bindToggleMode(this.handleToggleMode.bind(this));
        this.view.bindAuthSubmit(this.handleAuthSubmit.bind(this));

        // Initial UI Update
        this.view.updateUI(this.model.getMode());
    }

    handleToggleMode(mode) {
        this.model.setMode(mode);
        this.view.updateUI(mode);
    }

    async handleAuthSubmit(mode, data) {
        this.view.showError(mode, null);
        this.view.setLoading(mode, true);

        try {
            // Simulation of API Call (Task: Consumir API con fetch)
            // In a real scenario, this would be: await fetch('http://localhost:8000/auth/login', ...)
            console.log(`Submitting ${mode} data:`, data);
            
            await new Promise(resolve => setTimeout(resolve, 1500)); // Mock delay

            if (mode === 'login') {
                if (data.email === 'test@alice.com' && data.password === '123456') {
                    this.model.setUser({ email: data.email, name: 'Alice User' });
                    this.showDashboard();
                } else {
                    throw new Error('Credenciales incorrectas. Prueba con test@alice.com / 123456');
                }
            } else {
                // Register mock
                this.model.setUser({ email: data.email, name: data.firstname });
                this.showDashboard();
            }
        } catch (error) {
            this.view.showError(mode, error.message);
        } finally {
            this.view.setLoading(mode, false);
        }
    }

    showDashboard() {
        // Basic protection of private routes (Task: Proteccion basica de rutas privadas)
        const user = this.model.getUser();
        if (!user) return;

        console.log('User authenticated, showing dashboard...');
        document.getElementById('auth-app').innerHTML = `
            <div class="container h-100 d-flex flex-column align-items-center justify-content-center text-center">
                <div class="p-5 bg-card-custom rounded-5 glass border border-white-10">
                    <h1 class="display-4 fw-bold mb-4">Bienvenido, ${user.name}</h1>
                    <p class="lead text-muted mb-5">Has accedido a tu ruta privada en Alice.</p>
                    <button id="logout-btn" class="btn btn-outline-danger px-5 rounded-pill">Cerrar Sesión</button>
                </div>
            </div>
        `;

        document.getElementById('logout-btn').addEventListener('click', () => {
            this.model.setUser(null);
            location.reload(); // Simple way to reset state and return to login
        });
    }
}
