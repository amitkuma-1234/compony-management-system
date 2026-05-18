/* HR Management Page */
pages.hr = function(container) {
  container.innerHTML = `
    <div class="module-hero">
      <h2><i class="fas fa-users" style="color:var(--accent-light)"></i> HR Management</h2>
      <p>Complete workforce management with AI-powered insights, attendance tracking, payroll processing, and performance reviews.</p>
      <div class="page-actions" style="margin-top:16px">
        <button class="btn btn-primary btn-sm"><i class="fas fa-user-plus"></i> Add Employee</button>
        <button class="btn btn-secondary btn-sm"><i class="fas fa-file-export"></i> Export Report</button>
        <button class="btn btn-secondary btn-sm"><i class="fas fa-brain"></i> AI Insights</button>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon blue"><i class="fas fa-users"></i></div><span class="stat-trend up"><i class="fas fa-arrow-up"></i> 5</span></div><div class="stat-value">162</div><div class="stat-label">Total Employees</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-user-check"></i></div><span class="stat-trend up"><i class="fas fa-arrow-up"></i> 96%</span></div><div class="stat-value">148</div><div class="stat-label">Present Today</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon yellow"><i class="fas fa-plane-departure"></i></div></div><div class="stat-value">12</div><div class="stat-label">On Leave</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon purple"><i class="fas fa-user-plus"></i></div></div><div class="stat-value">8</div><div class="stat-label">New This Month</div></div>
    </div>
    <div class="tabs"><div class="tab active" onclick="this.parentElement.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));this.classList.add('active')">Employees</div><div class="tab" onclick="this.parentElement.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));this.classList.add('active')">Attendance</div><div class="tab" onclick="this.parentElement.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));this.classList.add('active')">Leave</div><div class="tab" onclick="this.parentElement.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));this.classList.add('active')">Payroll</div><div class="tab" onclick="this.parentElement.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));this.classList.add('active')">Performance</div></div>
    <div class="grid-2">
      <div class="card">
        <div class="card-header"><span class="card-title">Attendance This Week</span></div>
        <div class="chart-container"><canvas data-chart="attendance"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Department Distribution</span></div>
        <div style="display:flex;flex-direction:column;gap:12px;padding-top:8px">
          <div><div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px"><span>Engineering</span><span style="color:var(--text-muted)">48 employees</span></div><div class="progress-bar"><div class="progress-fill blue" style="width:72%"></div></div></div>
          <div><div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px"><span>Sales & Marketing</span><span style="color:var(--text-muted)">32 employees</span></div><div class="progress-bar"><div class="progress-fill green" style="width:52%"></div></div></div>
          <div><div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px"><span>Finance</span><span style="color:var(--text-muted)">24 employees</span></div><div class="progress-bar"><div class="progress-fill purple" style="width:38%"></div></div></div>
          <div><div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px"><span>HR & Admin</span><span style="color:var(--text-muted)">18 employees</span></div><div class="progress-bar"><div class="progress-fill yellow" style="width:28%"></div></div></div>
          <div><div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px"><span>Operations</span><span style="color:var(--text-muted)">40 employees</span></div><div class="progress-bar"><div class="progress-fill blue" style="width:62%"></div></div></div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">Employee Directory</span><button class="btn btn-primary btn-sm"><i class="fas fa-plus"></i> Add</button></div>
      <div class="table-container">
        <table>
          <thead><tr><th>Employee</th><th>Department</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>
            <tr><td><div style="display:flex;align-items:center;gap:10px"><div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#6366f1,#a855f7);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff">RS</div><div><div style="font-weight:600">Rahul Singh</div><div style="font-size:11px;color:var(--text-muted)">rahul@amdox.com</div></div></div></td><td>Engineering</td><td>Senior Developer</td><td><span class="badge badge-success">Active</span></td><td>Jan 2024</td><td><button class="btn btn-secondary btn-sm btn-icon"><i class="fas fa-ellipsis"></i></button></td></tr>
            <tr><td><div style="display:flex;align-items:center;gap:10px"><div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#ec4899,#f59e0b);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff">AP</div><div><div style="font-weight:600">Anita Patel</div><div style="font-size:11px;color:var(--text-muted)">anita@amdox.com</div></div></div></td><td>Sales</td><td>Sales Manager</td><td><span class="badge badge-success">Active</span></td><td>Mar 2023</td><td><button class="btn btn-secondary btn-sm btn-icon"><i class="fas fa-ellipsis"></i></button></td></tr>
            <tr><td><div style="display:flex;align-items:center;gap:10px"><div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#22c55e,#06b6d4);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff">VK</div><div><div style="font-weight:600">Vikram Kumar</div><div style="font-size:11px;color:var(--text-muted)">vikram@amdox.com</div></div></div></td><td>Finance</td><td>Financial Analyst</td><td><span class="badge badge-success">Active</span></td><td>Jun 2023</td><td><button class="btn btn-secondary btn-sm btn-icon"><i class="fas fa-ellipsis"></i></button></td></tr>
            <tr><td><div style="display:flex;align-items:center;gap:10px"><div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#f59e0b,#ef4444);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff">PS</div><div><div style="font-weight:600">Priya Sharma</div><div style="font-size:11px;color:var(--text-muted)">priya@amdox.com</div></div></div></td><td>Engineering</td><td>Frontend Developer</td><td><span class="badge badge-info">Probation</span></td><td>May 2026</td><td><button class="btn btn-secondary btn-sm btn-icon"><i class="fas fa-ellipsis"></i></button></td></tr>
            <tr><td><div style="display:flex;align-items:center;gap:10px"><div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#a855f7,#6366f1);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff">NK</div><div><div style="font-weight:600">Neha Kapoor</div><div style="font-size:11px;color:var(--text-muted)">neha@amdox.com</div></div></div></td><td>HR</td><td>HR Manager</td><td><span class="badge badge-success">Active</span></td><td>Sep 2022</td><td><button class="btn btn-secondary btn-sm btn-icon"><i class="fas fa-ellipsis"></i></button></td></tr>
          </tbody>
        </table>
      </div>
    </div>`;
};

/* Finance & Accounting Page */
pages.finance = function(container) {
  container.innerHTML = `
    <div class="module-hero">
      <h2><i class="fas fa-coins" style="color:var(--warning)"></i> Finance & Accounting</h2>
      <p>Double-entry accounting, AP/AR automation, multi-currency support, tax management, and AI-powered fraud detection.</p>
      <div class="page-actions" style="margin-top:16px">
        <button class="btn btn-primary btn-sm"><i class="fas fa-file-invoice"></i> New Invoice</button>
        <button class="btn btn-secondary btn-sm"><i class="fas fa-receipt"></i> Record Expense</button>
        <button class="btn btn-secondary btn-sm"><i class="fas fa-calculator"></i> Tax Calculator</button>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-arrow-trend-up"></i></div><span class="stat-trend up"><i class="fas fa-arrow-up"></i> 18%</span></div><div class="stat-value">₹1.18Cr</div><div class="stat-label">Revenue YTD</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon red"><i class="fas fa-arrow-trend-down"></i></div><span class="stat-trend down"><i class="fas fa-arrow-down"></i> 3%</span></div><div class="stat-value">₹58.2L</div><div class="stat-label">Expenses YTD</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon blue"><i class="fas fa-file-invoice-dollar"></i></div></div><div class="stat-value">24</div><div class="stat-label">Pending Invoices</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon purple"><i class="fas fa-piggy-bank"></i></div><span class="stat-trend up"><i class="fas fa-arrow-up"></i> 22%</span></div><div class="stat-value">₹59.8L</div><div class="stat-label">Net Profit</div></div>
    </div>
    <div class="grid-2">
      <div class="card"><div class="card-header"><span class="card-title">Cash Flow</span><span class="card-subtitle">Inflow vs Outflow (6 months)</span></div><div class="chart-container"><canvas data-chart="cashflow"></canvas></div></div>
      <div class="card">
        <div class="card-header"><span class="card-title">Recent Transactions</span></div>
        <div class="activity-list">
          <div class="list-item"><div class="list-icon" style="background:rgba(34,197,94,0.12);color:var(--success)"><i class="fas fa-arrow-down"></i></div><div class="list-content"><div class="list-title">Payment from Tata Motors</div><div class="list-subtitle">INV-2845 · ₹4,50,000</div></div><span class="badge badge-success">Received</span></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(239,68,68,0.12);color:var(--danger)"><i class="fas fa-arrow-up"></i></div><div class="list-content"><div class="list-title">Vendor Payment — CloudHost</div><div class="list-subtitle">PO-1240 · ₹1,20,000</div></div><span class="badge badge-danger">Paid</span></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(245,158,11,0.12);color:var(--warning)"><i class="fas fa-clock"></i></div><div class="list-content"><div class="list-title">Invoice to Infosys</div><div class="list-subtitle">INV-2847 · ₹8,75,000</div></div><span class="badge badge-warning">Pending</span></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(34,197,94,0.12);color:var(--success)"><i class="fas fa-arrow-down"></i></div><div class="list-content"><div class="list-title">Payment from Wipro</div><div class="list-subtitle">INV-2840 · ₹3,25,000</div></div><span class="badge badge-success">Received</span></div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">Invoice Ledger</span></div>
      <div class="table-container">
        <table><thead><tr><th>Invoice #</th><th>Client</th><th>Amount</th><th>Due Date</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          <tr><td style="font-weight:600;color:var(--accent-light)">INV-2847</td><td>Infosys Ltd</td><td>₹8,75,000</td><td>May 25, 2026</td><td><span class="badge badge-warning">Pending</span></td><td><button class="btn btn-secondary btn-sm">View</button></td></tr>
          <tr><td style="font-weight:600;color:var(--accent-light)">INV-2846</td><td>Reliance Industries</td><td>₹12,40,000</td><td>May 20, 2026</td><td><span class="badge badge-info">Sent</span></td><td><button class="btn btn-secondary btn-sm">View</button></td></tr>
          <tr><td style="font-weight:600;color:var(--accent-light)">INV-2845</td><td>Tata Motors</td><td>₹4,50,000</td><td>May 15, 2026</td><td><span class="badge badge-success">Paid</span></td><td><button class="btn btn-secondary btn-sm">View</button></td></tr>
          <tr><td style="font-weight:600;color:var(--accent-light)">INV-2844</td><td>HCL Technologies</td><td>₹6,80,000</td><td>May 10, 2026</td><td><span class="badge badge-success">Paid</span></td><td><button class="btn btn-secondary btn-sm">View</button></td></tr>
        </tbody></table>
      </div>
    </div>`;
};

/* Inventory & Supply Chain Page */
pages.inventory = function(container) {
  container.innerHTML = `
    <div class="module-hero">
      <h2><i class="fas fa-warehouse" style="color:var(--cyan)"></i> Inventory & Supply Chain</h2>
      <p>Warehouse management, barcode/RFID tracking, vendor management, automated reorder, and IoT sensor integration.</p>
      <div class="page-actions" style="margin-top:16px">
        <button class="btn btn-primary btn-sm"><i class="fas fa-plus"></i> Add Product</button>
        <button class="btn btn-secondary btn-sm"><i class="fas fa-truck"></i> New PO</button>
        <button class="btn btn-secondary btn-sm"><i class="fas fa-barcode"></i> Scan</button>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon cyan"><i class="fas fa-boxes-stacked"></i></div></div><div class="stat-value">1,487</div><div class="stat-label">Total Products</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-check-circle"></i></div></div><div class="stat-value">1,342</div><div class="stat-label">In Stock</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon red"><i class="fas fa-exclamation-triangle"></i></div></div><div class="stat-value">28</div><div class="stat-label">Low Stock Alerts</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon purple"><i class="fas fa-truck-fast"></i></div></div><div class="stat-value">15</div><div class="stat-label">Pending Orders</div></div>
    </div>
    <div class="grid-2">
      <div class="card"><div class="card-header"><span class="card-title">Stock by Category</span></div><div class="chart-container"><canvas data-chart="inventory"></canvas></div></div>
      <div class="card">
        <div class="card-header"><span class="card-title">Low Stock Alerts</span><span class="badge badge-danger">5 critical</span></div>
        <div class="activity-list">
          <div class="list-item"><div class="list-icon" style="background:rgba(239,68,68,0.12);color:var(--danger)"><i class="fas fa-exclamation"></i></div><div class="list-content"><div class="list-title">Dell Monitor 27"</div><div class="list-subtitle">Stock: 3 / Reorder: 20</div></div><button class="btn btn-primary btn-sm">Reorder</button></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(239,68,68,0.12);color:var(--danger)"><i class="fas fa-exclamation"></i></div><div class="list-content"><div class="list-title">USB-C Cables</div><div class="list-subtitle">Stock: 8 / Reorder: 50</div></div><button class="btn btn-primary btn-sm">Reorder</button></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(245,158,11,0.12);color:var(--warning)"><i class="fas fa-triangle-exclamation"></i></div><div class="list-content"><div class="list-title">Keyboard Mechanical</div><div class="list-subtitle">Stock: 12 / Reorder: 25</div></div><button class="btn btn-secondary btn-sm">Watch</button></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(245,158,11,0.12);color:var(--warning)"><i class="fas fa-triangle-exclamation"></i></div><div class="list-content"><div class="list-title">A4 Paper Ream</div><div class="list-subtitle">Stock: 15 / Reorder: 30</div></div><button class="btn btn-secondary btn-sm">Watch</button></div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">Product Inventory</span></div>
      <div class="table-container">
        <table><thead><tr><th>SKU</th><th>Product</th><th>Category</th><th>Stock</th><th>Warehouse</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td style="font-family:var(--font-mono);font-size:12px;color:var(--accent-light)">SKU-0012</td><td>MacBook Pro 16"</td><td>Electronics</td><td>45</td><td>Warehouse A</td><td><span class="badge badge-success">In Stock</span></td></tr>
          <tr><td style="font-family:var(--font-mono);font-size:12px;color:var(--accent-light)">SKU-0045</td><td>Office Chair Ergonomic</td><td>Furniture</td><td>82</td><td>Warehouse B</td><td><span class="badge badge-success">In Stock</span></td></tr>
          <tr><td style="font-family:var(--font-mono);font-size:12px;color:var(--accent-light)">SKU-0089</td><td>Dell Monitor 27"</td><td>Electronics</td><td>3</td><td>Warehouse A</td><td><span class="badge badge-danger">Low Stock</span></td></tr>
          <tr><td style="font-family:var(--font-mono);font-size:12px;color:var(--accent-light)">SKU-0156</td><td>Printer Paper A4</td><td>Supplies</td><td>520</td><td>Warehouse C</td><td><span class="badge badge-success">In Stock</span></td></tr>
        </tbody></table>
      </div>
    </div>`;
};
