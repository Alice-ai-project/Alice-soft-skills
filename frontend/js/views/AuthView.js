export class AuthView {
    constructor() {
        this.app = document.getElementById('auth-app');
    }

    renderStructure() {
        this.app.innerHTML = `
            <!-- Sliding Overlay -->
            <div id="sliding-overlay" class="overlay-container">
                <div class="overlay-logo-bg">
                    <img src="./assets/logo.png" alt="Alice Logo" class="logo-decoration">
                </div>
                <div id="phrase-login" class="phrase-content">
                    <h2 class="phrase-title">Potencia tus <span class="text-accent">Soft Skills</span> con Alice</h2>
                    <p class="phrase-subtitle">La plataforma inteligente que transforma tu comunicación y liderazgo a través de IA avanzada.</p>
                    <div class="phrase-line left"></div>
                </div>
                <div id="phrase-register" class="phrase-content hidden-phrase">
                    <h2 class="phrase-title">¿Por qué unirte a <span class="text-accent">nosotros</span>?</h2>
                    <p class="phrase-subtitle">Únete a una comunidad de aprendizaje continuo y desbloquea tu verdadero potencial profesional hoy mismo.</p>
                    <div class="phrase-line right"></div>
                </div>
            </div>

            <!-- Login Form -->
            <div id="login-form-container" class="form-container">
                <div class="form-wrapper">
                    <div class="text-center mb-4">
                        <img src="./assets/logo.png" alt="Alice Logo" class="form-logo">
                        <h1 class="h4 fw-bold mt-3">Alice Platform</h1>
                    </div>
                    <div class="mb-5">
                        <h3 class="h2 fw-bold mb-2">Bienvenido de nuevo</h3>
                        <p class="text-muted-custom">Ingresa tus credenciales para continuar</p>
                    </div>

                    <form id="login-form">
                        <div id="login-error" class="alert alert-danger d-none py-2 small" role="alert"></div>
                        <div class="mb-3">
                            <label class="form-label small fw-semibold text-light-muted">Correo Electrónico</label>
                            <input type="email" name="email" class="form-control" placeholder="tu@ejemplo.com" required>
                        </div>
                        <div class="mb-4">
                            <div class="d-flex justify-content-between mb-2">
                                <label class="form-label small fw-semibold text-light-muted">Contraseña</label>
                                <a href="#" class="btn-link-custom">¿Olvidaste tu contraseña?</a>
                            </div>
                            <input type="password" name="password" class="form-control" placeholder="••••••••" required minlength="6">
                        </div>
                        <button type="submit" class="btn btn-premium w-100 mb-4" id="login-submit">
                            <span class="spinner-border spinner-border-sm d-none me-2" role="status"></span>
                            <span>Iniciar Sesión</span>
                        </button>
                        <p class="text-center text-muted-custom">
                            ¿No tienes cuenta? 
                            <button type="button" id="to-register-btn" class="btn-toggle">Regístrate</button>
                        </p>
                    </form>
                </div>
            </div>

            <!-- Register Form -->
            <div id="register-form-container" class="form-container hidden">
                <div class="form-wrapper">
                    <div class="text-center mb-4">
                        <img src="./assets/logo.png" alt="Alice Logo" class="form-logo">
                        <h1 class="h4 fw-bold mt-3">Alice Platform</h1>
                    </div>
                    <div class="mb-5">
                        <h3 class="h2 fw-bold mb-2">Crea tu cuenta</h3>
                        <p class="text-muted-custom">Empieza tu camino en Alice</p>
                    </div>

                    <form id="register-form">
                        <div id="register-error" class="alert alert-danger d-none py-2 small" role="alert"></div>
                        <div class="row g-3 mb-3">
                            <div class="col">
                                <label class="form-label small fw-semibold text-light-muted">Nombre</label>
                                <input type="text" name="firstname" class="form-control" placeholder="Alice" required>
                            </div>
                            <div class="col">
                                <label class="form-label small fw-semibold text-light-muted">Apellido</label>
                                <input type="text" name="lastname" class="form-control" placeholder="Smith" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-semibold text-light-muted">Correo Electrónico</label>
                            <input type="email" name="email" class="form-control" placeholder="tu@ejemplo.com" required>
                        </div>
                        <div class="mb-4">
                            <label class="form-label small fw-semibold text-light-muted">Contraseña</label>
                            <input type="password" name="password" class="form-control" placeholder="••••••••" required minlength="8">
                        </div>
                        <button type="submit" class="btn btn-premium w-100 mb-4" id="register-submit">
                            <span class="spinner-border spinner-border-sm d-none me-2" role="status"></span>
                            <span>Crear Cuenta</span>
                        </button>
                        <p class="text-center text-muted-custom">
                            ¿Ya tienes cuenta? 
                            <button type="button" id="to-login-btn" class="btn-toggle">Inicia Sesión</button>
                        </p>
                    </form>
                </div>
            </div>
        `;

        this.overlay = document.getElementById('sliding-overlay');
        this.loginForm = document.getElementById('login-form-container');
        this.registerForm = document.getElementById('register-form-container');
        this.phraseLogin = document.getElementById('phrase-login');
        this.phraseRegister = document.getElementById('phrase-register');
    }

    updateUI(mode) {
        if (mode === 'register') {
            this.overlay.classList.add('right');
            this.loginForm.classList.add('hidden');
            this.registerForm.classList.remove('hidden');
            this.phraseLogin.classList.add('hidden-phrase');
            this.phraseRegister.classList.remove('hidden-phrase');
        } else {
            this.overlay.classList.remove('right');
            this.loginForm.classList.remove('hidden');
            this.registerForm.classList.add('hidden');
            this.phraseLogin.classList.remove('hidden-phrase');
            this.phraseRegister.classList.add('hidden-phrase');
        }
    }

    setLoading(mode, isLoading) {
        const btnId = mode === 'login' ? 'login-submit' : 'register-submit';
        const btn = document.getElementById(btnId);
        const spinner = btn.querySelector('.spinner-border');
        
        if (isLoading) {
            btn.disabled = true;
            spinner.classList.remove('d-none');
        } else {
            btn.disabled = false;
            spinner.classList.add('d-none');
        }
    }

    showError(mode, message) {
        const errorDivId = mode === 'login' ? 'login-error' : 'register-error';
        const errorDiv = document.getElementById(errorDivId);
        if (message) {
            errorDiv.textContent = message;
            errorDiv.classList.remove('d-none');
        } else {
            errorDiv.classList.add('d-none');
        }
    }

    bindToggleMode(handler) {
        document.getElementById('to-register-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.showError('login', null);
            handler('register');
        });
        document.getElementById('to-login-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.showError('register', null);
            handler('login');
        });
    }

    bindAuthSubmit(handler) {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(loginForm);
                const data = Object.fromEntries(formData.entries());
                handler('login', data);
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(registerForm);
                const data = Object.fromEntries(formData.entries());
                handler('register', data);
            });
        }
    }
}
