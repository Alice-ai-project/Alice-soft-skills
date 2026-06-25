/**
 * Alice - Main Entry Point
 */
import { DashboardModel } from './models/DashboardModel.js';
import { DashboardView } from './views/DashboardView.js';
import { DashboardController } from './controllers/DashboardController.js';

const AUTH_HTML = `
<div class="auth-container">
    <div class="auth-card">
        <div class="auth-header">
            <img src="./assets/logo.png" alt="Alice Logo" class="auth-logo">
            <h1>Alice Platform</h1>
            <p>Accede a tu cuenta para continuar</p>
        </div>
        <form id="login-form">
            <div id="login-error" class="auth-error" style="display: none;"></div>
            <div class="form-group">
                <label>Correo Electrónico</label>
                <input type="email" name="email" class="form-control" placeholder="tu@ejemplo.com" required>
            </div>
            <div class="form-group">
                <label>Contraseña</label>
                <input type="password" name="password" class="form-control" placeholder="••••••••" required minlength="6">
            </div>
            <button type="submit" class="auth-btn" id="login-submit">
                <span class="spinner" style="display: none;"></span>
                <span>Iniciar Sesión</span>
            </button>
        </form>
    </div>
</div>
`;

function hideDashboard() {
    const sidebar = document.getElementById('sidebar');
    const main = document.querySelector('main');
    if (sidebar) sidebar.style.display = 'none';
    if (main) main.style.display = 'none';
}

function showDashboard() {
    const sidebar = document.getElementById('sidebar');
    const main = document.querySelector('main');
    if (sidebar) sidebar.style.display = '';
    if (main) main.style.display = '';
}

function showLogin() {
    hideDashboard();
    
    let authApp = document.getElementById('auth-app');
    if (!authApp) {
        authApp = document.createElement('main');
        authApp.id = 'auth-app';
        authApp.className = 'container-fluid p-0';
        document.body.appendChild(authApp);
    }
    
    authApp.innerHTML = AUTH_HTML;
    authApp.style.display = '';
    document.getElementById('login-form').addEventListener('submit', handleLogin);
}

async function handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    const btn = document.getElementById('login-submit');
    const errorDiv = document.getElementById('login-error');
    const spinner = btn.querySelector('.spinner');
    
    btn.disabled = true;
    spinner.style.display = 'inline-block';
    errorDiv.style.display = 'none';
    
    const data = {
        email: form.email.value,
        password: form.password.value
    };
    
    try {
        const response = await fetch('http://localhost:8000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.detail || 'Error al iniciar sesión');
        }
        
        localStorage.setItem('alice_user', JSON.stringify({
            user_id: result.user?.user_id || result.user_id,
            email: result.email || result.user?.email,
            name: result.user?.first_name || result.first_name || 'Usuario',
            access_token: result.access_token,
            refresh_token: result.refresh_token
        }));
        
        initDashboard();
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    } finally {
        btn.disabled = false;
        spinner.style.display = 'none';
    }
}

function initDashboard() {
    const user = JSON.parse(localStorage.getItem('alice_user'));
    
    const authApp = document.getElementById('auth-app');
    if (authApp) {
        authApp.remove();
    }
    
    showDashboard();
    
    const dashboardModel = new DashboardModel();
    if (user?.user_id) {
        dashboardModel.setUserId(user.user_id);
    }
    if (user?.name) {
        dashboardModel.userSettings.username = user.name;
    }
    
    const dashboardView = new DashboardView();
    new DashboardController(dashboardModel, dashboardView);

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('alice_user');
            location.reload();
        });
    }
    
    if (user?.name) {
        const headerName = document.getElementById('header-user-name');
        if (headerName) headerName.textContent = user.name;
    }
    
    lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('alice_user'));
    if (user?.access_token) {
        try {
            const response = await fetch('http://localhost:8000/auth/me', {
                headers: { 'Authorization': `Bearer ${user.access_token}` }
            });
            if (response.ok) {
                initDashboard();
                console.log('Alice Application Initialized');
                return;
            }
        } catch (e) {
            console.warn('Session validation failed:', e);
        }
    }
    localStorage.removeItem('alice_user');
    showLogin();
    console.log('Alice Application Initialized');
});
