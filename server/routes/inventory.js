const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authenticateToken, authorize } = require('../auth');
const { auditLogger } = require('../audit');

router.use(authenticateToken);
router.use(auditLogger('Inventory'));

// ── VENDORS ──
router.get('/vendors', (req, res) => {
  try {
    const vendors = db.prepare('SELECT * FROM vendors ORDER BY name ASC').all();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
});

router.post('/vendors', authorize(['admin', 'manager']), (req, res) => {
  const { name, contactPerson, email, phone, paymentTerms, category } = req.body;
  try {
    db.prepare(`
      INSERT INTO vendors (name, contactPerson, email, phone, paymentTerms, category) 
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, contactPerson, email, phone, paymentTerms || 'Net 30', category);
    res.status(201).json({ message: 'Vendor added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add vendor' });
  }
});

// ── PURCHASE ORDERS ──
router.get('/pos', (req, res) => {
  try {
    const pos = db.prepare(`
      SELECT po.*, v.name as vendorName 
      FROM purchase_orders po
      JOIN vendors v ON po.vendorId = v.id
      ORDER BY po.createdAt DESC
    `).all();
    res.json(pos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch POs' });
  }
});

router.post('/pos', authorize(['admin', 'manager']), (req, res) => {
  const { vendorId, totalAmount, orderDate, expectedDelivery } = req.body;
  const poNumber = `PO-${Date.now()}`;
  try {
    db.prepare(`
      INSERT INTO purchase_orders (poNumber, vendorId, totalAmount, orderDate, expectedDelivery, status) 
      VALUES (?, ?, ?, ?, ?, 'Draft')
    `).run(poNumber, vendorId, totalAmount, orderDate, expectedDelivery);
    res.status(201).json({ poNumber, message: 'PO created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create PO' });
  }
});

// ── GOOD RECEIPT NOTES (GRN) ──
router.post('/grns', authorize(['admin', 'manager']), (req, res) => {
  const { poId, notes } = req.body;
  const grnNumber = `GRN-${Date.now()}`;
  const date = new Date().toISOString().split('T')[0];
  try {
    db.transaction(() => {
      // 1. Create GRN
      db.prepare(`
        INSERT INTO grns (grnNumber, poId, receivedBy, receivedDate, notes) 
        VALUES (?, ?, ?, ?, ?)
      `).run(grnNumber, poId, req.user.id, date, notes);

      // 2. Update PO Status
      db.prepare('UPDATE purchase_orders SET status = "Received" WHERE id = ?').run(poId);
    })();
    res.status(201).json({ grnNumber, message: 'Stock received and GRN generated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to receive goods' });
  }
});

module.exports = router;
