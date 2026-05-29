/* ============================================================
   AMDOX ERP SUITE — Express REST API Server
   ============================================================ */

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const db      = require('./database');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));  // serve frontend files

// ── Helper: log activity ──────────────────────────────────
function logActivity(module, action, description) {
  try {
    db.prepare('INSERT INTO activity_log (module, action, description) VALUES (?, ?, ?)').run(module, action, description);
  } catch(e) { /* non-critical */ }
}

// ═══════════════════════════════════════════════════════════
// AUTHENTICATION
// ═══════════════════════════════════════════════════════════

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }
    
    let user = null;
    if (email === 'amit@amdox.com') {
      user = { name: 'Amit Kumar', email: 'amit@amdox.com', role: 'Super Admin', status: 'Active' };
    } else {
      const emp = db.prepare('SELECT * FROM employees WHERE email = ?').get(email);
      if (emp) {
        user = { name: emp.name, email: emp.email, role: emp.role, status: emp.status };
      }
    }
    
    if (!user || user.status === 'Inactive') {
      return res.status(401).json({ success: false, error: 'User not found or account is inactive.' });
    }
    
    if (password !== 'password123') {
      return res.status(401).json({ success: false, error: 'Invalid password. Use "password123"' });
    }
    
    const token = Buffer.from(JSON.stringify({ email: user.email, exp: Date.now() + 24*60*60*1000 })).toString('base64');
    
    logActivity('Auth', 'LOGIN', `User logged in: ${user.name} (${user.email})`);
    
    res.json({
      success: true,
      token,
      user
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════
// HR — EMPLOYEES
// ═══════════════════════════════════════════════════════════

// GET all employees
app.get('/api/employees', (req, res) => {
  try {
    const employees = db.prepare('SELECT * FROM employees ORDER BY created_at DESC').all();
    res.json({ success: true, data: employees });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single employee
app.get('/api/employees/:id', (req, res) => {
  try {
    const emp = db.prepare('SELECT * FROM employees WHERE id = ?').get(req.params.id);
    if (!emp) return res.status(404).json({ success: false, error: 'Employee not found' });
    res.json({ success: true, data: emp });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create employee
app.post('/api/employees', (req, res) => {
  try {
    const { name, email, department, role, status, joined } = req.body;
    if (!name || !email || !department || !role) {
      return res.status(400).json({ success: false, error: 'Name, email, department, and role are required.' });
    }
    const stmt = db.prepare(`
      INSERT INTO employees (name, email, department, role, status, joined)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      name, email, department, role,
      status || 'Active',
      joined || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    );
    const newEmp = db.prepare('SELECT * FROM employees WHERE id = ?').get(result.lastInsertRowid);
    logActivity('HR', 'CREATE', `New employee added: ${name}`);
    res.status(201).json({ success: true, data: newEmp });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ success: false, error: 'An employee with this email already exists.' });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update employee
app.put('/api/employees/:id', (req, res) => {
  try {
    const { name, email, department, role, status } = req.body;
    const stmt = db.prepare(`
      UPDATE employees SET name=?, email=?, department=?, role=?, status=? WHERE id=?
    `);
    const result = stmt.run(name, email, department, role, status, req.params.id);
    if (result.changes === 0) return res.status(404).json({ success: false, error: 'Employee not found' });
    const updated = db.prepare('SELECT * FROM employees WHERE id = ?').get(req.params.id);
    logActivity('HR', 'UPDATE', `Employee updated: ${name}`);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE employee
app.delete('/api/employees/:id', (req, res) => {
  try {
    const emp = db.prepare('SELECT * FROM employees WHERE id = ?').get(req.params.id);
    if (!emp) return res.status(404).json({ success: false, error: 'Employee not found' });
    db.prepare('DELETE FROM employees WHERE id = ?').run(req.params.id);
    logActivity('HR', 'DELETE', `Employee removed: ${emp.name}`);
    res.json({ success: true, message: 'Employee deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════
// FINANCE — INVOICES
// ═══════════════════════════════════════════════════════════

// GET all invoices
app.get('/api/invoices', (req, res) => {
  try {
    const invoices = db.prepare('SELECT * FROM invoices ORDER BY created_at DESC').all();
    res.json({ success: true, data: invoices });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create invoice
const createInvoiceTx = db.transaction((client, amount, due_date, status) => {
  // Auto-generate invoice number
  const lastInvoice = db.prepare("SELECT invoice_no FROM invoices ORDER BY id DESC LIMIT 1").get();
  let nextNum = 2848;
  if (lastInvoice) {
    const lastNum = parseInt(lastInvoice.invoice_no.replace('INV-', ''), 10);
    nextNum = isNaN(lastNum) ? 2848 : lastNum + 1;
  }
  const invoiceNo = `INV-${nextNum}`;
  const stmt = db.prepare(`
    INSERT INTO invoices (invoice_no, client, amount, due_date, status)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(invoiceNo, client, parseFloat(amount), due_date, status || 'Pending');
  return db.prepare('SELECT * FROM invoices WHERE id = ?').get(result.lastInsertRowid);
});

app.post('/api/invoices', (req, res) => {
  try {
    const { client, amount, due_date, status } = req.body;
    if (!client || !amount || !due_date) {
      return res.status(400).json({ success: false, error: 'Client, amount, and due date are required.' });
    }
    const newInv = createInvoiceTx.immediate(client, amount, due_date, status);
    logActivity('Finance', 'CREATE', `New invoice created: ${newInv.invoice_no} for ${client}`);
    res.status(201).json({ success: true, data: newInv });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update invoice status
app.put('/api/invoices/:id', (req, res) => {
  try {
    const { client, amount, due_date, status } = req.body;
    const stmt = db.prepare('UPDATE invoices SET client=?, amount=?, due_date=?, status=? WHERE id=?');
    const result = stmt.run(client, parseFloat(amount), due_date, status, req.params.id);
    if (result.changes === 0) return res.status(404).json({ success: false, error: 'Invoice not found' });
    const updated = db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id);
    logActivity('Finance', 'UPDATE', `Invoice updated: ${updated.invoice_no}`);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE invoice
app.delete('/api/invoices/:id', (req, res) => {
  try {
    const inv = db.prepare('SELECT * FROM invoices WHERE id = ?').get(req.params.id);
    if (!inv) return res.status(404).json({ success: false, error: 'Invoice not found' });
    db.prepare('DELETE FROM invoices WHERE id = ?').run(req.params.id);
    logActivity('Finance', 'DELETE', `Invoice deleted: ${inv.invoice_no}`);
    res.json({ success: true, message: 'Invoice deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════
// INVENTORY — PRODUCTS
// ═══════════════════════════════════════════════════════════

// GET all products
app.get('/api/products', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create product
app.post('/api/products', (req, res) => {
  try {
    const { sku, name, category, stock, reorder_level, warehouse } = req.body;
    if (!sku || !name || !category) {
      return res.status(400).json({ success: false, error: 'SKU, name, and category are required.' });
    }
    const stmt = db.prepare(`
      INSERT INTO products (sku, name, category, stock, reorder_level, warehouse)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      sku.toUpperCase(), name, category,
      parseInt(stock) || 0,
      parseInt(reorder_level) || 10,
      warehouse || 'Warehouse A'
    );
    const newProd = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    logActivity('Inventory', 'CREATE', `New product added: ${name} (${sku})`);
    res.status(201).json({ success: true, data: newProd });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ success: false, error: 'A product with this SKU already exists.' });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update product
app.put('/api/products/:id', (req, res) => {
  try {
    const { name, category, stock, reorder_level, warehouse } = req.body;
    const stmt = db.prepare('UPDATE products SET name=?, category=?, stock=?, reorder_level=?, warehouse=? WHERE id=?');
    const result = stmt.run(name, category, parseInt(stock), parseInt(reorder_level), warehouse, req.params.id);
    if (result.changes === 0) return res.status(404).json({ success: false, error: 'Product not found' });
    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    logActivity('Inventory', 'UPDATE', `Product updated: ${name}`);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  try {
    const prod = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!prod) return res.status(404).json({ success: false, error: 'Product not found' });
    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    logActivity('Inventory', 'DELETE', `Product removed: ${prod.name}`);
    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════
// CRM — LEADS
// ═══════════════════════════════════════════════════════════

app.get('/api/leads', (req, res) => {
  try {
    const leads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
    res.json({ success: true, data: leads });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/leads', (req, res) => {
  try {
    const { company, contact, value, stage } = req.body;
    if (!company || !contact) {
      return res.status(400).json({ success: false, error: 'Company and contact are required.' });
    }
    const stmt = db.prepare('INSERT INTO leads (company, contact, value, stage) VALUES (?, ?, ?, ?)');
    const result = stmt.run(company, contact, parseFloat(value) || 0, stage || 'New');
    const newLead = db.prepare('SELECT * FROM leads WHERE id = ?').get(result.lastInsertRowid);
    logActivity('CRM', 'CREATE', `New lead added: ${company}`);
    res.status(201).json({ success: true, data: newLead });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/leads/:id', (req, res) => {
  try {
    const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
    if (!lead) return res.status(404).json({ success: false, error: 'Lead not found' });
    db.prepare('DELETE FROM leads WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Lead deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/leads/:id', (req, res) => {
  try {
    const { company, contact, value, stage } = req.body;
    if (!company || !contact) {
      return res.status(400).json({ success: false, error: 'Company and contact are required.' });
    }
    const stmt = db.prepare('UPDATE leads SET company=?, contact=?, value=?, stage=? WHERE id=?');
    const result = stmt.run(company, contact, parseFloat(value) || 0, stage || 'New', req.params.id);
    if (result.changes === 0) return res.status(404).json({ success: false, error: 'Lead not found' });
    const updated = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
    logActivity('CRM', 'UPDATE', `Lead updated: ${company}`);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════
// PROJECTS
// ═══════════════════════════════════════════════════════════

app.get('/api/projects', (req, res) => {
  try {
    const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/projects', (req, res) => {
  try {
    const { name, description, status, priority, assigned_to } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'Project name is required.' });
    const stmt = db.prepare('INSERT INTO projects (name, description, status, priority, assigned_to) VALUES (?, ?, ?, ?, ?)');
    const result = stmt.run(name, description || '', status || 'In Progress', priority || 'Medium', assigned_to || '');
    const newProj = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
    logActivity('Projects', 'CREATE', `New project: ${name}`);
    res.status(201).json({ success: true, data: newProj });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/projects/:id', (req, res) => {
  try {
    const proj = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    if (!proj) return res.status(404).json({ success: false, error: 'Project not found' });
    db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
    res.json({ success: true, message: 'Project deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/projects/:id', (req, res) => {
  try {
    const { name, description, status, priority, assigned_to } = req.body;
    if (!name) return res.status(400).json({ success: false, error: 'Project name is required.' });
    const stmt = db.prepare('UPDATE projects SET name=?, description=?, status=?, priority=?, assigned_to=? WHERE id=?');
    const result = stmt.run(name, description || '', status || 'In Progress', priority || 'Medium', assigned_to || '', req.params.id);
    if (result.changes === 0) return res.status(404).json({ success: false, error: 'Project not found' });
    const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    logActivity('Projects', 'UPDATE', `Project updated: ${name}`);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════
// ACTIVITY LOG
// ═══════════════════════════════════════════════════════════

app.get('/api/activity-log', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const logs = db.prepare('SELECT * FROM activity_log ORDER BY created_at DESC LIMIT ?').all(limit);
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════
// DASHBOARD STATS
// ═══════════════════════════════════════════════════════════

app.get('/api/stats', (req, res) => {
  try {
    const employees    = db.prepare("SELECT COUNT(*) as count FROM employees WHERE status='Active'").get();
    const allEmployees = db.prepare("SELECT COUNT(*) as count FROM employees").get();
    const invoices     = db.prepare("SELECT COUNT(*) as count FROM invoices WHERE status='Pending'").get();
    const revenue      = db.prepare("SELECT COALESCE(SUM(amount),0) as total FROM invoices WHERE status='Paid'").get();
    const products     = db.prepare("SELECT COUNT(*) as count FROM products").get();
    const lowStock     = db.prepare("SELECT COUNT(*) as count FROM products WHERE stock <= reorder_level").get();
    const leads        = db.prepare("SELECT COUNT(*) as count FROM leads").get();
    const projects     = db.prepare("SELECT COUNT(*) as count FROM projects WHERE status='In Progress'").get();

    res.json({
      success: true,
      data: {
        activeEmployees:   employees.count,
        totalEmployees:    allEmployees.count,
        pendingInvoices:   invoices.count,
        totalRevenue:      revenue.total,
        totalProducts:     products.count,
        lowStockAlerts:    lowStock.count,
        totalLeads:        leads.count,
        activeProjects:    projects.count
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║       AMDOX ERP SUITE — Server Running       ║
║  http://localhost:${PORT}                      ║
║  Database: erp_data.db (SQLite)              ║
╚══════════════════════════════════════════════╝
  `);
});
