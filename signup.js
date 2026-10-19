// signup.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    // Your HTML uses "goggle-button", so we look for both spellings
    const googleBtn = document.querySelector('.goggle-button, .google-button');
    const createLink = form.querySelector('.auth-button a');

    // The "Create Account" text is a link to tast.html inside the submit button.
    // Without this, clicking it jumps straight to tast.html and skips all validation.
    if (createLink) {
        createLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (form.requestSubmit) {
                form.requestSubmit();
            } else {
                form.dispatchEvent(new Event('submit', { cancelable: true }));
            }
        });
    }

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const firstName = document.getElementById('firstname').value.trim();
        const lastName = document.getElementById('lastname').value.trim();
        const email = document.getElementById('reg-email').value.trim().toLowerCase();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const termsChecked = document.querySelector('.checkbox input[type="checkbox"]').checked;

        // ===== Validation =====
        if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
            showMessage('Please fill in all fields.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }

        if (!isValidPhone(phone)) {
            showMessage('Please enter a valid phone number.', 'error');
            return;
        }

        if (password.length < 6) {
            showMessage('Password must be at least 6 characters long.', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showMessage('Passwords do not match.', 'error');
            return;
        }

        if (!termsChecked) {
            showMessage('You must agree to the Terms and Privacy Policy.', 'error');
            return;
        }

        // ===== Check if email already exists =====
        const users = getUsers();
        const emailExists = users.some((user) => user.email === email);

        if (emailExists) {
            showMessage('This email is already registered. Please login instead.', 'error');
            return;
        }

        // ===== Save new user =====
        const newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            password: password, // Note: In real apps, never store plain passwords
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        showMessage('Account created successfully! Redirecting to login...', 'success');

        // Redirect to login page after success
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    });

    // Google button (demo only)
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            showMessage('Google signup is not connected yet (demo only).', 'info');
        });
    }

    // ===== Helper Functions =====
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPhone(phone) {
        return /^\+?[0-9\s\-()]{7,15}$/.test(phone);
    }

    function getUsers() {
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            return Array.isArray(users) ? users : [];
        } catch (err) {
            return [];
        }
    }

    const MESSAGE_COLORS = { error: '#c62828', success: '#2e7d32', info: '#1565c0' };

    function showMessage(text, type = 'info') {
        // Remove old message if exists
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

        // Insert the message above the form
        form.parentNode.insertBefore(msg, form);

        // Auto remove error/info messages after 4 seconds
        if (type !== 'success') {
            setTimeout(() => msg.remove(), 4000);
        }
    }
});