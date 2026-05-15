document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleBtn');
    const toggleIcon = document.getElementById('toggleIcon');
    const motivationalQuote = document.getElementById('motivational-quote');

    const quotes = [
        "El éxito no es el final, el fracaso no es fatal: es el coraje para continuar lo que cuenta.",
        "Cree en ti mismo y en todo lo que eres. Hay algo dentro de ti que es más grande que cualquier obstáculo.",
        "La única forma de hacer un gran trabajo es amar lo que haces.",
        "Tu tiempo es limitado, así que no lo pierdas viviendo la vida de alguien más.",
        "La mejor manera de predecir el futuro es creándolo."
    ];

    // Toggle Sidebar
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');

        if (sidebar.classList.contains('collapsed')) {
            toggleIcon.setAttribute('data-lucide', 'chevron-right');
        } else {
            toggleIcon.setAttribute('data-lucide', 'chevron-left');
        }

        lucide.createIcons();
    });

    // Randomize quote on load
    if (motivationalQuote) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        motivationalQuote.textContent = `"${randomQuote}"`;
    }

    // View Management
    const navItems = document.querySelectorAll('.nav-item');
    const views = {
        'dashboard': document.getElementById('dashboard-view'),
        'conversation': document.getElementById('conversation-view')
    };

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetView = item.getAttribute('data-view');

            if (views[targetView]) {
                // Update nav active state
                navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                // Switch views
                Object.keys(views).forEach(v => {
                    if (views[v]) views[v].style.display = 'none';
                });
                views[targetView].style.display = 'block';

                // Visual feedback
                item.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    item.style.transform = 'scale(1)';
                }, 100);

                // Refresh icons for dynamic content
                lucide.createIcons();
            }
        });
    });

    // Handle "Hablar conmigo" CTA
    const chatCta = document.getElementById('chat-cta');
    if (chatCta) {
        chatCta.addEventListener('click', () => {
            const convNav = document.querySelector('[data-view="conversation"]');
            if (convNav) convNav.click();
        });
    }

    // Back to Dashboard
    const backBtn = document.getElementById('back-to-dash');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            const dashNav = document.querySelector('[data-view="dashboard"]');
            if (dashNav) dashNav.click();
        });
    }

    // Voice Controls (Visual Logic)
    const micBtn = document.getElementById('mic-btn');
    const stopBtn = document.getElementById('stop-btn');
    const aiStatusText = document.getElementById('ai-status-text');

    if (micBtn) {
        micBtn.addEventListener('click', () => {
            micBtn.classList.add('active');
            if (aiStatusText) aiStatusText.textContent = 'Escuchando...';
        });
    }

    if (stopBtn) {
        stopBtn.addEventListener('click', () => {
            if (micBtn) micBtn.classList.remove('active');
            if (aiStatusText) aiStatusText.textContent = 'Procesando...';
            setTimeout(() => {
                if (aiStatusText) aiStatusText.textContent = 'Lista para escucharte';
            }, 2000);
        });
    }

    // Avatar animations
    const avatar = document.getElementById('alice-avatar');
    if (avatar) {
        avatar.addEventListener('mouseover', () => {
            avatar.style.transform = 'scale(1.1) rotate(5deg)';
            avatar.style.transition = 'transform 0.3s ease';
        });
        avatar.addEventListener('mouseout', () => {
            avatar.style.transform = 'scale(1) rotate(0deg)';
        });
    }
});
