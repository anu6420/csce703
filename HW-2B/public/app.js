const form = document.querySelector('#login-form');
const statusMessage = document.querySelector('#status');

function showStatus(message, isError = false) {
  // Use textContent not HTML so submitted input cannot run scripts avoid XSS
  statusMessage.textContent = message;
  statusMessage.className = isError ? 'error' : 'success';
}

function validateLogin(email, password) {
  if (!email || !password) return 'Email and password cannot be empty.';
  if (!email.includes('@')) return 'Email must contain @.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  return null;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = form.email.value.trim();
  const password = form.password.value;
  const validationError = validateLogin(email, password);
  if (validationError) return showStatus(validationError, true);

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const result = await response.json();
    showStatus(result.message || result.error, !response.ok);
  } catch {
    showStatus('Unable to reach the server.', true);
  }
});
