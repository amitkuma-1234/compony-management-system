const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authenticateToken, authorize } = require('../auth');
const { auditLogger } = require('../audit');

// Apply auth to all CRM routes
router.use(authenticateToken);
router.use(auditLogger('CRM'));

// GET all leads
router.get('/leads', (req, res) => {
  try {
    const leads = db.prepare('SELECT * FROM leads ORDER BY createdAt DESC').all();
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// CREATE lead
router.post('/leads', authorize(['admin', 'manager']), (req, res) => {
  const { company, type, value, stage } = req.body;
  if (!company || !type || !value) {
    return res.status(400).json({ error: 'Company, type and value are required' });
  }

  try {
    const info = db.prepare('INSERT INTO leads (company, type, value, stage) VALUES (?, ?, ?, ?)').run(
      company, type, value, stage || 'New'
    );
    res.status(201).json({ id: info.lastInsertRowid, company, type, value, stage: stage || 'New' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

// UPDATE lead (PUT)
router.put('/leads/:id', authorize(['admin', 'manager']), (req, res) => {
  const { id } = req.params;
  const { company, type, value, stage } = req.body;

  try {
    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    db.prepare('UPDATE leads SET company = ?, type = ?, value = ?, stage = ? WHERE id = ?').run(
      company || lead.company,
      type || lead.type,
      value || lead.value,
      stage || lead.stage,
      id
    );
    res.json({ id, message: 'Lead updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

// DELETE lead
router.delete('/leads/:id', authorize(['admin']), (req, res) => {
  const { id } = req.params;
  try {
    const info = db.prepare('DELETE FROM leads WHERE id = ?').run(id);
    if (info.changes === 0) return res.status(404).json({ error: 'Lead not found' });
    res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

module.exports = router;
