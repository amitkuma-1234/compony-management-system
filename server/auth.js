const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('./db');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
};

// Auth routes
const authRoutes = (app) => {
  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Create JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name, tenantId: user.tenantId },
        JWT_SECRET,
        { expiresIn: '8h' } // Session timeout (8 hours)
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tenantId: user.tenantId
        }
      });
    } catch (err) {
      res.status(500).json({ error: 'Login failed', details: err.message });
    }
  });

  app.get('/api/auth/verify', authenticateToken, (req, res) => {
    res.json({ valid: true, user: req.user });
  });
};

// Middleware to authorize roles
const authorize = (roles = []) => {
  if (typeof roles === 'string') roles = [roles];

  return (req, res, next) => {
    if (!req.user || (roles.length && !roles.includes(req.user.role))) {
      return res.status(403).json({ error: 'Forbidden. Insufficient permissions.' });
    }
    next();
  };
};

module.exports = { authenticateToken, authorize, authRoutes };
