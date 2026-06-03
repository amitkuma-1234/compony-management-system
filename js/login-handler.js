document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const errDiv = document.getElementById('login-error');
    const submitBtn = document.getElementById('login-submit');

    if (!form) return;

    form.onsubmit = async (e) => {
        e.preventDefault();
        errDiv.style.display = 'none';
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('amdox_token', data.token);
                localStorage.setItem('amdox_user', JSON.stringify(data.user));
                window.location.href = 'index.html';
            } else {
                errDiv.textContent = data.error || 'Login failed. Please try again.';
                errDiv.style.display = 'block';
            }
        } catch (err) {
            errDiv.textContent = 'Connection error. Is the server running?';
            errDiv.style.display = 'block';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-right-to-bracket"></i> Sign In';
        }
    };
});
