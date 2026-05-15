/**
 * Auth Model - Manages user authentication state
 */
export class AuthModel {
    constructor() {
        this.user = null;
        this.isAuthenticated = false;
    }

    login(credentials) {
        // Implementation for login with Supabase/Backend
        console.log('Login attempt with:', credentials);
    }

    logout() {
        this.user = null;
        this.isAuthenticated = false;
    }
}
