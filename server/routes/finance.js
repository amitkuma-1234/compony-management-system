const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authenticateToken, authorize } = require('../auth');
const { auditLogger } = require('../audit');

router.use(authenticateToken);
router.use(auditLogger('Finance'));

// GET all invoices
router.get('/invoices', (req, res) => {
  try {
    const invoices = db.prepare('SELECT * FROM invoices ORDER BY createdAt DESC').all();
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// CSV Export for Monthly Revenue
router.get('/export/csv', authorize(['admin', 'manager']), (req, res) => {
  try {
    const invoices = db.prepare('SELECT * FROM invoices').all();
    
    let csv = 'InvoiceNo,Client,Amount,DueDate,Status,Description\n';
    invoices.forEach(i => {
      csv += `${i.invoiceNo},"${i.client}",${i.amount},${i.dueDate},${i.status},"${i.description}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=financial_report.csv');
    res.status(200).send(csv);
  } catch (err) {
    res.status(500).json({ error: 'Export failed' });
  }
});

module.exports = router;
