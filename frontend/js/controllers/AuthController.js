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

        const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
        const baseUrl = 'http://localhost:8000'; // Ajusta esto si tu backend está en otra URL

        try {
            console.log(`Submitting ${mode} to ${baseUrl}${endpoint}:`, data);
            
            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            console.log(`Backend response for ${mode}:`, result);

            if (!response.ok) {
                throw new Error(result.detail || `Error en el ${mode}`);
            }

            // Success
            if (mode === 'register') {
                this.view.showSuccess('register', '¡Cuenta creada con éxito! Por favor, inicia sesión.');
                await new Promise(resolve => setTimeout(resolve, 2000));
                this.handleToggleMode('login');
            } else {
                this.view.showSuccess('login', '¡Iniciando sesión con éxito!');
                await new Promise(resolve => setTimeout(resolve, 1500)); 
                this.model.setUser({ 
                    email: result.email, 
                    name: result.display_name || result.username || 'Usuario' 
                });
                this.showDashboard();
            }

        } catch (error) {
            console.error(`Auth error (${mode}):`, error);
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
