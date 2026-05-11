import { AuthModel } from './models/AuthModel.js';
import { AuthView } from './views/AuthView.js';
import { AuthController } from './controllers/AuthController.js';

document.addEventListener('DOMContentLoaded', () => {
    const appModel = new AuthModel();
    const appView = new AuthView();
    const appController = new AuthController(appModel, appView);

    console.log('Alice SPA initialized with MVC pattern.');
});
