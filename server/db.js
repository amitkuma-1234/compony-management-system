const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Initialize Tables
function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'employee', -- admin, manager, employee
      tenantId TEXT DEFAULT 'main',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      department TEXT NOT NULL,
      role TEXT NOT NULL,
      salary REAL NOT NULL,
      joinDate TEXT NOT NULL,
      status TEXT DEFAULT 'Active',
      initials TEXT,
      gradient TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoiceNo TEXT UNIQUE NOT NULL,
      client TEXT NOT NULL,
      amount REAL NOT NULL,
      dueDate TEXT NOT NULL,
      status TEXT DEFAULT 'Pending',
      description TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      type TEXT NOT NULL,
      value TEXT NOT NULL,
      stage TEXT DEFAULT 'New', -- New, Qualified, Proposal, Negotiation
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      tag TEXT NOT NULL,
      tagColor TEXT NOT NULL,
      status TEXT DEFAULT 'Backlog', -- Backlog, In Progress, Review, Done
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      action TEXT NOT NULL,
      module TEXT NOT NULL,
      description TEXT NOT NULL,
      changes TEXT, -- JSON string of changes
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS payrolls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employeeId INTEGER NOT NULL,
      month TEXT NOT NULL, -- e.g., '2026-06'
      basicSalary REAL NOT NULL,
      bonus REAL DEFAULT 0,
      deductions REAL DEFAULT 0, -- PF + ESI + TDS
      netSalary REAL NOT NULL,
      status TEXT DEFAULT 'Draft', -- Draft, Paid
      paidAt DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(employeeId) REFERENCES employees(id)
    );

    CREATE TABLE IF NOT EXISTS attendance_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employeeId INTEGER NOT NULL,
      date DATE NOT NULL,
      checkIn DATETIME,
      checkOut DATETIME,
      status TEXT, -- Present, Absent, Half-Day, Late
      location TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(employeeId) REFERENCES employees(id)
    );

    CREATE TABLE IF NOT EXISTS leave_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employeeId INTEGER NOT NULL,
      type TEXT NOT NULL, -- Sick, Annual, Casual
      startDate DATE NOT NULL,
      endDate DATE NOT NULL,
      reason TEXT,
      status TEXT DEFAULT 'Pending', -- Pending, Approved, Rejected
      approvedBy INTEGER,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(employeeId) REFERENCES employees(id)
    );
    CREATE TABLE IF NOT EXISTS vendors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      contactPerson TEXT,
      email TEXT,
      phone TEXT,
      paymentTerms TEXT DEFAULT 'Net 30', -- Net 30, Net 60, COD
      category TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS purchase_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      poNumber TEXT UNIQUE NOT NULL,
      vendorId INTEGER NOT NULL,
      totalAmount REAL NOT NULL,
      status TEXT DEFAULT 'Draft', -- Draft, Sent, Received, Cancelled
      orderDate DATE NOT NULL,
      expectedDelivery DATE,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(vendorId) REFERENCES vendors(id)
    );

    CREATE TABLE IF NOT EXISTS grns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      grnNumber TEXT UNIQUE NOT NULL,
      poId INTEGER NOT NULL,
      receivedBy INTEGER NOT NULL,
      receivedDate DATE NOT NULL,
      notes TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(poId) REFERENCES purchase_orders(id)
    );
  `);

  console.log('🔗 Database tables initialized');
}

module.exports = {
  db,
  initDb,
  query: (sql, params = []) => db.prepare(sql).all(params),
  get: (sql, params = []) => db.prepare(sql).get(params),
  run: (sql, params = []) => db.prepare(sql).run(params),
};
