const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authenticateToken, authorize } = require('../auth');
const { auditLogger } = require('../audit');

router.use(authenticateToken);
router.use(auditLogger('Projects'));

// GET all projects
router.get('/', (req, res) => {
  try {
    const projects = db.prepare('SELECT * FROM projects ORDER BY createdAt DESC').all();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// CREATE project
router.post('/', authorize(['admin', 'manager']), (req, res) => {
  const { title, tag, tagColor, status } = req.body;
  if (!title || !tag || !tagColor) {
    return res.status(400).json({ error: 'Title, tag and tagColor are required' });
  }

  try {
    const info = db.prepare('INSERT INTO projects (title, tag, tagColor, status) VALUES (?, ?, ?, ?)').run(
      title, tag, tagColor, status || 'Backlog'
    );
    res.status(201).json({ id: info.lastInsertRowid, ...req.body });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// UPDATE project (PUT)
router.put('/:id', authorize(['admin', 'manager']), (req, res) => {
  const { id } = req.params;
  const { title, tag, tagColor, status } = req.body;

  try {
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    db.prepare('UPDATE projects SET title = ?, tag = ?, tagColor = ?, status = ? WHERE id = ?').run(
      title || project.title,
      tag || project.tag,
      tagColor || project.tagColor,
      status || project.status,
      id
    );
    res.json({ id, message: 'Project updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

module.exports = router;
