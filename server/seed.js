const bcrypt = require('bcryptjs');
const { db, initDb } = require('./db');

async function seed() {
  initDb();

  // 1. Create Admin User
  const adminEmail = 'admin@amdox.com';
  const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    db.prepare('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)').run(
      adminEmail,
      hashedPassword,
      'Super Admin',
      'admin'
    );
    console.log('👤 Admin user created: admin@amdox.com / admin123');
  }

  // 1b. Create Test User for Gmail verification
  const testEmail = 'devyanibpatil3132@gmail.com';
  const existingTestUser = db.prepare('SELECT id FROM users WHERE email = ?').get(testEmail);
  if (!existingTestUser) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    db.prepare('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)').run(
      testEmail,
      hashedPassword,
      'Devyani Patil',
      'employee'
    );
    console.log('👤 Test user created: devyanibpatil3132@gmail.com / password123');
  }

  // 2. Clear and Seed Employees if empty
  const empCount = db.prepare('SELECT COUNT(*) as count FROM employees').get().count;
  if (empCount === 0) {
    const employees = [
      ['Amit Kumar', 'amit@amdox.com', 'Engineering', 'Lead Architect', 2400000, 'Jan 2024', 'Active', 'AK', 'linear-gradient(135deg,#6366f1,#a855f7)'],
      ['Priya Sharma', 'priya@amdox.com', 'Engineering', 'Senior Developer', 1800000, 'Feb 2024', 'Active', 'PS', 'linear-gradient(135deg,#ec4899,#f59e0b)'],
      ['Rahul Verma', 'rahul@amdox.com', 'Sales & Marketing', 'Regional Manager', 1500000, 'Mar 2024', 'Active', 'RV', 'linear-gradient(135deg,#22c55e,#06b6d4)']
    ];
    
    const insertEmp = db.prepare('INSERT INTO employees (name, email, department, role, salary, joinDate, status, initials, gradient) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    for (const emp of employees) {
      insertEmp.run(...emp);
    }
    console.log('👥 Employees seeded');
  }

  // 3. Seed Invoices if empty
  const invCount = db.prepare('SELECT COUNT(*) as count FROM invoices').get().count;
  if (invCount === 0) {
    const invoices = [
      ['INV-2024-001', 'Reliance Industries', 450000, '2026-06-15', 'Paid', 'Cloud Infrastructure'],
      ['INV-2024-002', 'Tata Consultancy', 820000, '2026-07-01', 'Pending', 'Platform License'],
      ['INV-2024-003', 'HDFC Bank', 1200000, '2026-06-20', 'Sent', 'Security Audit']
    ];
    
    const insertInv = db.prepare('INSERT INTO invoices (invoiceNo, client, amount, dueDate, status, description) VALUES (?, ?, ?, ?, ?, ?)');
    for (const inv of invoices) {
      insertInv.run(...inv);
    }
    console.log('🧾 Invoices seeded');
  }

  console.log('✅ Seeding complete');
}

seed().catch(err => console.error('❌ Seeding failed', err));
