export class AuthModel {
    constructor() {
        this.currentMode = 'login'; // 'login' or 'register'
        this.user = null;
        this.error = null;
        this.isLoading = false;
    }

    setMode(mode) {
        this.currentMode = mode;
    }

    getMode() {
        return this.currentMode;
    }

    setUser(user) {
        this.user = user;
    }

    getUser() {
        return this.user;
    }

    setLoading(status) {
        this.isLoading = status;
    }

    setError(error) {
        this.error = error;
    }

    getError() {
        return this.error;
    }

    isAuthenticated() {
        return this.user !== null;
    }
}
