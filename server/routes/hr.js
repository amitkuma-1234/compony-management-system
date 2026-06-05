const express = require('express');
const router = express.Router();
const { db } = require('../db');
const { authenticateToken, authorize } = require('../auth');
const { auditLogger } = require('../audit');

router.use(authenticateToken);
router.use(auditLogger('HR'));

// ── GET Employees ──
router.get('/employees', (req, res) => {
  try {
    const employees = db.prepare('SELECT * FROM employees ORDER BY name ASC').all();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// ── PAYROLL MODULE ──

// 1. Calculate and Create Monthly Payroll Draft
router.post('/payroll/generate', authorize(['admin', 'manager']), (req, res) => {
  const { month } = req.body; // e.g., '2026-06'
  if (!month) return res.status(400).json({ error: 'Month is required (YYYY-MM)' });

  try {
    const employees = db.prepare('SELECT id, salary FROM employees WHERE status = ?').all('Active');
    const insertPayroll = db.prepare(`
      INSERT INTO payrolls (employeeId, month, basicSalary, bonus, deductions, netSalary) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const results = [];
    db.transaction(() => {
      for (const emp of employees) {
        const basic = emp.salary / 12;
        const bonus = 0;
        
        // Deduction Rules
        const pf = basic * 0.12; // 12% PF
        const esi = basic * 0.0075; // 0.75% ESI
        let tds = 0;
        if (basic > 100000) tds = basic * 0.20;
        else if (basic > 50000) tds = basic * 0.10;

        const deductions = pf + esi + tds;
        const netSalary = basic + bonus - deductions;

        const info = insertPayroll.run(emp.id, month, basic, bonus, deductions, netSalary);
        results.push({ id: info.lastInsertRowid, employeeId: emp.id, netSalary });
      }
    })();

    res.status(201).json({ message: `Payroll generated for ${employees.length} employees`, month, results });
  } catch (err) {
    res.status(500).json({ error: 'Payroll generation failed', details: err.message });
  }
});

// 2. Fetch Payroll for a month
router.get('/payroll/:month', (req, res) => {
  try {
    const payroll = db.prepare(`
      SELECT p.*, e.name, e.department, e.role 
      FROM payrolls p
      JOIN employees e ON p.employeeId = e.id
      WHERE p.month = ?
    `).all(req.params.month);
    res.json(payroll);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payroll' });
  }
});

// 3. Mark Payroll as Paid
router.put('/payroll/pay/:month', authorize(['admin']), (req, res) => {
  try {
    db.prepare('UPDATE payrolls SET status = "Paid", paidAt = CURRENT_TIMESTAMP WHERE month = ?').run(req.params.month);
    res.json({ message: `Payroll for ${req.params.month} marked as Paid` });
  } catch (err) {
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

// ── ATTENDANCE MODULE ──

router.post('/attendance/check-in', (req, res) => {
  const { employeeId, location } = req.body;
  const date = new Date().toISOString().split('T')[0];
  try {
    db.prepare(`
      INSERT INTO attendance_records (employeeId, date, checkIn, status, location) 
      VALUES (?, ?, CURRENT_TIMESTAMP, 'Present', ?)
    `).run(employeeId, date, location || 'Remote');
    res.json({ message: 'Checked in successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Check-in failed' });
  }
});

// ── LEAVE MANAGEMENT ──

router.post('/leaves/apply', (req, res) => {
  const { employeeId, type, startDate, endDate, reason } = req.body;
  try {
    db.prepare(`
      INSERT INTO leave_requests (employeeId, type, startDate, endDate, reason) 
      VALUES (?, ?, ?, ?, ?)
    `).run(employeeId, type, startDate, endDate, reason);
    res.json({ message: 'Leave application submitted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to apply for leave' });
  }
});

router.get('/leaves/pending', authorize(['admin', 'manager']), (req, res) => {
  try {
    const leaves = db.prepare(`
      SELECT l.*, e.name, e.department
      FROM leave_requests l
      JOIN employees e ON l.employeeId = e.id
      WHERE l.status = 'Pending'
    `).all();
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending leaves' });
  }
});

router.put('/leaves/approve/:id', authorize(['admin', 'manager']), (req, res) => {
  try {
    db.prepare('UPDATE leave_requests SET status = "Approved", approvedBy = ? WHERE id = ?').run(req.user.id, req.params.id);
    res.json({ message: 'Leave approved' });
  } catch (err) {
    res.status(500).json({ error: 'Approval failed' });
  }
});

module.exports = router;
