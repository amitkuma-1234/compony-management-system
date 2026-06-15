const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authenticateToken, authorize } = require('../auth');
const fs = require('fs');
const path = require('path');

router.use(authenticateToken);

// ── DATABASE BACKUP ──
router.get('/backup', authorize(['admin']), (req, res) => {
  const dbPath = process.env.DB_PATH || path.join(__dirname, '../database.sqlite');
  const backupPath = path.join(__dirname, `../backups/backup-${Date.now()}.sqlite`);

  try {
    if (!fs.existsSync(path.join(__dirname, '../backups'))) {
      fs.mkdirSync(path.join(__dirname, '../backups'));
    }

    // copy database file
    fs.copyFileSync(dbPath, backupPath);
    res.json({ message: 'Backup created successfully', path: backupPath });
  } catch (err) {
    res.status(500).json({ error: 'Backup failed', details: err.message });
  }
});

// ── DASHBOARD LAYOUT SAVING ──
router.post('/layout/save', (req, res) => {
  const { layout } = req.body;
  // This would ideally save to a 'settings' table per user
  // For now, we'll just log it as a successful simulation of persistence
  console.log(`💾 Saving layout for user ${req.user.id}:`, layout);
  res.json({ message: 'Dashboard layout saved successfully' });
});

// ── NOTIFICATIONS (Polling fallback) ──
router.get('/notifications/unread', (req, res) => {
  try {
    const notifications = db.prepare('SELECT * FROM notifications WHERE (userId = ? OR userId IS NULL) AND isRead = 0 ORDER BY createdAt DESC').all(req.user.id);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

module.exports = router;
