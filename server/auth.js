const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { db } = require('./db');

// ── Decrypt Fernet-encrypted credentials ─────────────────
function decryptFernetCredential(credFilename) {
  try {
    const rootDir = path.join(__dirname, '..');
    const keyData = fs.readFileSync(path.join(rootDir, '.email_key'), 'utf8').trim();
    const encData = fs.readFileSync(path.join(rootDir, credFilename), 'utf8').trim();

    // Fernet token format: Version(1) || Timestamp(8) || IV(16) || Ciphertext(N) || HMAC(32)
    const tokenBytes = Buffer.from(encData, 'base64url');
    const keyBytes = Buffer.from(keyData, 'base64url');
    const signingKey = keyBytes.slice(0, 16);
    const encryptionKey = keyBytes.slice(16, 32);

    const iv = tokenBytes.slice(9, 25);
    const hmac = tokenBytes.slice(tokenBytes.length - 32);
    const ciphertext = tokenBytes.slice(25, tokenBytes.length - 32);

    // Verify HMAC
    const hmacCheck = crypto.createHmac('sha256', signingKey);
    hmacCheck.update(tokenBytes.slice(0, tokenBytes.length - 32));
    const expectedHmac = hmacCheck.digest();
    if (!crypto.timingSafeEqual(hmac, expectedHmac)) {
      throw new Error('HMAC verification failed — key mismatch or tampered data');
    }

    // Decrypt AES-128-CBC
    const decipher = crypto.createDecipheriv('aes-128-cbc', encryptionKey, iv);
    let decrypted = decipher.update(ciphertext);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
  } catch (err) {
    console.warn(`[WARN] Could not decrypt ${credFilename}:`, err.message);
    return null;
  }
}

const JWT_SECRET = decryptFernetCredential('.jwt_cred') || process.env.JWT_SECRET || 'super-secret-key';

// Global verification code store (in-memory)
// Keys are emails, values are { code, expiresAt }
const verificationCodes = {};

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
  // Login Route
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
        success: true,
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

  // Verify JWT Token Route
  app.get('/api/auth/verify', authenticateToken, (req, res) => {
    res.json({ valid: true, user: req.user });
  });

  // Forgot Password: Request Verification Code Route
  app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    try {
      // Check if user or employee exists
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      const employee = db.prepare('SELECT * FROM employees WHERE email = ?').get(email);

      if (!user && !employee) {
        return res.status(404).json({ error: 'This email is not registered on this device.' });
      }

      // Generate 6-digit verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      // Store in memory with 10-minute expiry
      verificationCodes[email] = {
        code,
        expiresAt: Date.now() + 10 * 60 * 1000
      };

      // Execute Python send_email.py script
      const scriptPath = path.join(__dirname, '../send_email.py');
      console.log(`Sending verification email to: ${email} with code: ${code}`);

      exec(`python "${scriptPath}" "${email}" "${code}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Email send error:`, error, stderr);
          return res.status(500).json({ error: 'Failed to send verification email. Please try again.' });
        }
        console.log(`Python stdout:`, stdout);
        res.json({ success: true, message: 'Verification code sent to your Gmail.' });
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error', details: err.message });
    }
  });

  // Verify Code Route
  app.post('/api/auth/verify-code', (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: 'Email and verification code are required' });
    }

    const record = verificationCodes[email];
    if (!record) {
      return res.status(400).json({ error: 'No verification request found for this email' });
    }

    if (record.expiresAt < Date.now()) {
      delete verificationCodes[email];
      return res.status(400).json({ error: 'Verification code has expired' });
    }

    if (record.code !== code.trim()) {
      return res.status(400).json({ error: 'Incorrect verification code' });
    }

    res.json({ success: true, message: 'Code verified successfully' });
  });

  // Reset Password Route
  app.post('/api/auth/reset-password', async (req, res) => {
    const { email, code, password } = req.body;
    if (!email || !code || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const record = verificationCodes[email];
    if (!record || record.code !== code.trim() || record.expiresAt < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired verification code session' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

      if (user) {
        db.prepare('UPDATE users SET password = ? WHERE email = ?').run(hashedPassword, email);
      } else {
        const emp = db.prepare('SELECT * FROM employees WHERE email = ?').get(email);
        db.prepare('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)').run(
          email,
          hashedPassword,
          emp ? emp.name : 'User',
          'employee'
        );
      }

      // Cleanup code
      delete verificationCodes[email];

      res.json({ success: true, message: 'Password reset successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to reset password', details: err.message });
    }
  });

  // ── Registration Route ───────────────────────────────────
  app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, department, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    try {
      // Check if user already exists
      const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
      if (existing) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert into users table
      const userRole = (role || 'employee').toLowerCase();
      const stmt = db.prepare(
        'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)'
      );
      stmt.run(email, hashedPassword, name, userRole);

      // Also create a matching employee record so they appear in HR module
      try {
        const empStmt = db.prepare(
          "INSERT INTO employees (name, email, department, role, salary, joinDate, status, initials, gradient) VALUES (?, ?, ?, ?, ?, ?, 'Active', ?, ?)"
        );
        const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        const gradients = [
          'linear-gradient(135deg,#6366f1,#a855f7)',
          'linear-gradient(135deg,#ec4899,#f59e0b)',
          'linear-gradient(135deg,#22c55e,#06b6d4)',
          'linear-gradient(135deg,#f59e0b,#ef4444)',
          'linear-gradient(135deg,#06b6d4,#6366f1)'
        ];
        const gradient = gradients[Math.floor(Math.random() * gradients.length)];
        empStmt.run(
          name,
          email,
          department || 'General',
          role || 'Employee',
          0,
          new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          initials,
          gradient
        );
      } catch (empErr) {
        // Employee may already exist — non-critical
        console.log('Employee record note:', empErr.message);
      }

      console.log(`✅ New user registered: ${name} (${email})`);
      res.status(201).json({ success: true, message: 'Account created successfully.' });
    } catch (err) {
      console.error('Registration error:', err);
      if (err.message && err.message.includes('UNIQUE')) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }
      res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
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
