require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { initDb } = require('./db');
const { authRoutes } = require('./auth');

const app = express();
const PORT = process.env.PORT || 4000;

// Initialize Database
initDb();

// 1. Core Middlewares (helmet DISABLED to avoid blocking inline scripts in legacy frontend)
app.use(cors());
app.use(express.json());

// 2. Routes
authRoutes(app);
app.use('/api/crm', require('./routes/crm'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/hr', require('./routes/hr'));
app.use('/api/finance', require('./routes/finance'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/system', require('./routes/system'));

// 3. Rate Limiting (API only)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

// 4. Static Files (Serving the frontend)
app.use(express.static(path.join(__dirname, '../')));

// 5. Fallback: serve index.html for SPA routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// 6. Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'active', timestamp: new Date().toISOString() });
});

// 7. Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Amdox ERP Backend running on http://localhost:${PORT}`);
  console.log(`💻 Open your browser to: http://localhost:${PORT}`);
});
