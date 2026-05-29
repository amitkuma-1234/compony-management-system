/* ============================================================
   AMDOX ERP SUITE — Database Initialization (SQLite)
   ============================================================ */

const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'erp_data.db');
const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Create Tables ──────────────────────────────────────────
db.exec(`
  -- Employees
  CREATE TABLE IF NOT EXISTS employees (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    email       TEXT    NOT NULL UNIQUE,
    department  TEXT    NOT NULL,
    role        TEXT    NOT NULL,
    status      TEXT    NOT NULL DEFAULT 'Active',
    joined      TEXT    NOT NULL DEFAULT (strftime('%b %Y', 'now')),
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  -- Invoices
  CREATE TABLE IF NOT EXISTS invoices (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_no  TEXT    NOT NULL UNIQUE,
    client      TEXT    NOT NULL,
    amount      REAL    NOT NULL,
    due_date    TEXT    NOT NULL,
    status      TEXT    NOT NULL DEFAULT 'Pending',
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  -- Inventory / Products
  CREATE TABLE IF NOT EXISTS products (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    sku         TEXT    NOT NULL UNIQUE,
    name        TEXT    NOT NULL,
    category    TEXT    NOT NULL,
    stock       INTEGER NOT NULL DEFAULT 0,
    reorder_level INTEGER NOT NULL DEFAULT 10,
    warehouse   TEXT    NOT NULL DEFAULT 'Warehouse A',
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  -- CRM Leads
  CREATE TABLE IF NOT EXISTS leads (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    company     TEXT    NOT NULL,
    contact     TEXT    NOT NULL,
    value       REAL    NOT NULL DEFAULT 0,
    stage       TEXT    NOT NULL DEFAULT 'New',
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  -- Projects
  CREATE TABLE IF NOT EXISTS projects (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    description TEXT,
    status      TEXT    NOT NULL DEFAULT 'In Progress',
    priority    TEXT    NOT NULL DEFAULT 'Medium',
    assigned_to TEXT,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  -- Activity Log (audit trail)
  CREATE TABLE IF NOT EXISTS activity_log (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    module      TEXT    NOT NULL,
    action      TEXT    NOT NULL,
    description TEXT    NOT NULL,
    created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`);

// ── Seed Default Data (only if tables are empty) ───────────
const seedEmployees = db.prepare('SELECT COUNT(*) as count FROM employees').get();
if (seedEmployees.count === 0) {
  const insert = db.prepare(`
    INSERT INTO employees (name, email, department, role, status, joined)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const seed = db.transaction(() => {
    insert.run('Rahul Singh',  'rahul@amdox.com',  'Engineering', 'Senior Developer',   'Active',   'Jan 2024');
    insert.run('Anita Patel',  'anita@amdox.com',  'Sales',       'Sales Manager',       'Active',   'Mar 2023');
    insert.run('Vikram Kumar', 'vikram@amdox.com', 'Finance',     'Financial Analyst',   'Active',   'Jun 2023');
    insert.run('Priya Sharma', 'priya@amdox.com',  'Engineering', 'Frontend Developer',  'Probation','May 2026');
    insert.run('Neha Kapoor',  'neha@amdox.com',   'HR',          'HR Manager',          'Active',   'Sep 2022');
  });
  seed();
}

const seedInvoices = db.prepare('SELECT COUNT(*) as count FROM invoices').get();
if (seedInvoices.count === 0) {
  const insert = db.prepare(`
    INSERT INTO invoices (invoice_no, client, amount, due_date, status)
    VALUES (?, ?, ?, ?, ?)
  `);
  const seed = db.transaction(() => {
    insert.run('INV-2847', 'Infosys Ltd',          875000,  'May 25, 2026', 'Pending');
    insert.run('INV-2846', 'Reliance Industries',  1240000, 'May 20, 2026', 'Sent');
    insert.run('INV-2845', 'Tata Motors',           450000, 'May 15, 2026', 'Paid');
    insert.run('INV-2844', 'HCL Technologies',      680000, 'May 10, 2026', 'Paid');
  });
  seed();
}

const seedProducts = db.prepare('SELECT COUNT(*) as count FROM products').get();
if (seedProducts.count === 0) {
  const insert = db.prepare(`
    INSERT INTO products (sku, name, category, stock, reorder_level, warehouse)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const seed = db.transaction(() => {
    insert.run('SKU-0012', 'MacBook Pro 16"',      'Electronics', 45,  20, 'Warehouse A');
    insert.run('SKU-0045', 'Office Chair Ergonomic','Furniture',   82,  15, 'Warehouse B');
    insert.run('SKU-0089', 'Dell Monitor 27"',     'Electronics',  3,  20, 'Warehouse A');
    insert.run('SKU-0156', 'Printer Paper A4',     'Supplies',    520,  30, 'Warehouse C');
    insert.run('SKU-0201', 'USB-C Cables',         'Accessories',   8,  50, 'Warehouse A');
    insert.run('SKU-0215', 'Keyboard Mechanical',  'Accessories',  12,  25, 'Warehouse B');
  });
  seed();
}

const seedLeads = db.prepare('SELECT COUNT(*) as count FROM leads').get();
if (seedLeads.count === 0) {
  const insert = db.prepare(`
    INSERT INTO leads (company, contact, value, stage)
    VALUES (?, ?, ?, ?)
  `);
  const seed = db.transaction(() => {
    insert.run('Tata Consulting Services', 'Arun Mehta',    1800000, 'New');
    insert.run('Flipkart India',           'Sunita Rao',    2500000, 'Qualified');
    insert.run('Bajaj Finance',            'Ravi Sharma',   3200000, 'Proposal');
    insert.run('Mahindra Group',           'Deepa Nair',    4500000, 'Negotiation');
  });
  seed();
}

const seedProjects = db.prepare('SELECT COUNT(*) as count FROM projects').get();
if (seedProjects.count === 0) {
  const insert = db.prepare(`
    INSERT INTO projects (name, description, status, priority, assigned_to)
    VALUES (?, ?, ?, ?, ?)
  `);
  const seed = db.transaction(() => {
    insert.run('ERP v3.2',              'Core platform upgrade',          'In Progress', 'High',   'Rahul Singh');
    insert.run('Mobile App',           'iOS & Android companion app',     'In Progress', 'High',   'Priya Sharma');
    insert.run('AI Module',            'AI prediction engine',            'In Progress', 'Medium', 'Vikram Kumar');
    insert.run('CRM Revamp',           'New CRM UI and pipeline tracking','In Progress', 'Medium', 'Anita Patel');
    insert.run('Payment Gateway',      'Razorpay & Stripe integration',   'In Progress', 'High',   'Anita Patel');
  });
  seed();
}

console.log('✅ Database initialized:', DB_PATH);

module.exports = db;
