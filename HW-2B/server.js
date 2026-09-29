const path = require('path');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' }
});

function validateLogin(email, password) {
  if (typeof email !== 'string' || typeof password !== 'string') {
    return 'Email and password are required.';
  }
  const cleanEmail = email.trim();
  if (!cleanEmail || !password) return 'Email and password cannot be empty.';
  if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) return 'Enter a valid email address.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (cleanEmail.length > 254 || password.length > 128) return 'Input is too long.';
  return null;
}

// Demo only: real applications retrieve a user and bcrypt hash from a database.
const demoUser = {
  email: 'student@example.com',
  passwordHash: '$2b$12$P6fWk7hnJQVKfi02tYBFIu29cJRrA0zVwHqJ5XK9zmtqTIjZqjp2a'
};

app.post('/api/login', loginLimiter, async (req, res, next) => {
  const { email, password } = req.body || {};
  const validationError = validateLogin(email, password);
  if (validationError) return res.status(400).json({ error: validationError });

  try {
    // No SQL string is constructed from user input. A real DB query must be parameterized.
    const emailMatches = email.trim().toLowerCase() === demoUser.email;
    const passwordMatches = await bcrypt.compare(password, demoUser.passwordHash);
    if (!emailMatches || !passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    return res.status(200).json({ message: 'Login validation succeeded.' });
  } catch (error) {
    return next(error);
  }
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'An unexpected error occurred.' });
});

app.listen(port, () => console.log(`Open http://localhost:${port}`));
