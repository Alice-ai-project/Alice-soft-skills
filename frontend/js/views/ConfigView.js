export class ConfigView {
    constructor() {
        this.profileForm = document.getElementById('profile-form');
        this.usernameInput = document.getElementById('username-input');
        this.headerUserName = document.getElementById('header-user-name');
    }

    updateSettingsUI(settings) {
        if (this.usernameInput) {
            this.usernameInput.value = settings.username;
        }
        if (this.headerUserName) {
            this.headerUserName.textContent = settings.username;
        }
    }

    bindProfileUpdate(handler) {
        if (this.profileForm) {
            this.profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                handler(this.usernameInput.value);
            });
        }
    }
}
