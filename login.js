// login.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const rememberCheckbox = document.querySelector('.login-options input[type="checkbox"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    // Your HTML uses "goggle-button", so we look for both spellings
    const googleBtn = document.querySelector('.goggle-button, .google-button');
    const forgotLink = document.querySelector('.forget-link');

    // Built-in demo account (so you can always test the login)
    const DEMO_USER = { firstName: 'Demo', email: 'demo@taskflow.com', password: '123456' };

    // Where to go after a successful login
    const AFTER_LOGIN_PAGE = 'tast.html';

    // Load remembered email (if any)
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberCheckbox.checked = true;
    }

    // ===== Form Submit =====
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value.trim();

        // Basic validation
        if (!email || !password) {
            showMessage('Please fill in both email and password.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }

        if (password.length < 6) {
            showMessage('Password must be at least 6 characters.', 'error');
            return;
        }

        loginUser(email, password);
    });

    // ===== Google Login (Mock) =====
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            showMessage('Google login is not connected yet (demo only).', 'info');
        });
    }

    // ===== Forgot Password =====
    if (forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();

            if (!email) {
                showMessage('Please enter your email first.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showMessage('Please enter a valid email.', 'error');
                return;
            }

            showMessage(`Password reset link sent to ${email} (demo)`, 'success');
        });
    }

    // ===== Helper Functions =====
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Users created on the signup page are saved in localStorage under "users"
    function getUsers() {
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            return Array.isArray(users) ? users : [];
        } catch (err) {
            return [];
        }
    }

    // Check registered users first, then the demo account
    function findUser(email, password) {
        const registered = getUsers().find(
            (user) => user.email === email && user.password === password
        );
        if (registered) return registered;

        if (email === DEMO_USER.email && password === DEMO_USER.password) {
            return DEMO_USER;
        }
        return null;
    }

    function loginUser(email, password) {
        showMessage('Logging in...', 'info');
        submitBtn.disabled = true; // stop double clicks while "loading"

        // Simulate network delay
        setTimeout(() => {
            const user = findUser(email, password);

            if (!user) {
                submitBtn.disabled = false;
                showMessage('Invalid email or password.', 'error');
                return;
            }

            // Remember Me
            if (rememberCheckbox.checked) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            // Save logged-in user
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', user.firstName || '');

            showMessage('Login successful! Redirecting...', 'success');

            // Redirect after short delay
            setTimeout(() => {
                window.location.href = AFTER_LOGIN_PAGE;
            }, 1200);
        }, 800);
    }

    const MESSAGE_COLORS = { error: '#c62828', success: '#2e7d32', info: '#1565c0' };

    function showMessage(text, type = 'info') {
        // Remove existing message
        const oldMsg = document.querySelector('.auth-message');
        if (oldMsg) oldMsg.remove();

        const msg = document.createElement('div');
        msg.className = `auth-message ${type}`;
        msg.setAttribute('role', type === 'error' ? 'alert' : 'status');
        msg.textContent = text;

        // Small inline style so the message is readable without touching your CSS files
        msg.style.color = MESSAGE_COLORS[type] || MESSAGE_COLORS.info;
        msg.style.fontSize = '14px';
        msg.style.textAlign = 'center';
        msg.style.margin = '0 0 12px';

        // Insert above the form
        form.parentNode.insertBefore(msg, form);

        // Auto remove after 4 seconds (except success)
        if (type !== 'success') {
            setTimeout(() => msg.remove(), 4000);
        }
    }
});