/* HR Management Page — reads from db */
pages.hr = function(container) {
  const s = db.table('hrStats').getAll()[0];
  const emps = db.table('employees').getAll();
  const depts = db.table('departments').getAll();

  const empRows = emps.map(e => `<tr><td><div style="display:flex;align-items:center;gap:10px"><div style="width:32px;height:32px;border-radius:8px;background:${e.gradient};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff">${e.initials}</div><div><div style="font-weight:600">${e.name}</div><div style="font-size:11px;color:var(--text-muted)">${e.email}</div></div></div></td><td>${e.department}</td><td>${e.role}</td><td><span class="badge badge-${e.status==='Active'?'success':'danger'}">${e.status}</span></td><td>${e.joinDate}</td><td><div style="display:flex;gap:6px"><button class="btn btn-secondary btn-sm btn-icon" title="Edit" onclick="editEmployee('${e.id}')"><i class="fas fa-pen"></i></button><button class="btn btn-secondary btn-sm btn-icon" style="color:var(--danger)" title="Delete" onclick="deleteEmployee('${e.id}')"><i class="fas fa-trash"></i></button></div></td></tr>`).join('');

  const maxDeptCount = Math.max(...depts.map(dep => emps.filter(e => e.department === dep.name).length), 1);
  const deptBars = depts.map(d => {
    const colors = {Engineering:'blue','Sales & Marketing':'green',Finance:'purple','HR & Admin':'yellow',Operations:'blue'};
    const count = emps.filter(e => e.department === d.name).length;
    const pct = Math.round((count / maxDeptCount) * 100);
    return `<div><div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px"><span>${d.name}</span><span style="color:var(--text-muted)">${count} employees</span></div><div class="progress-bar"><div class="progress-fill ${colors[d.name]||'blue'}" style="width:${pct}%"></div></div></div>`;
  }).join('');

  container.innerHTML = `
    <div class="module-hero"><h2><i class="fas fa-users" style="color:var(--accent-light)"></i> HR Management</h2><p>Complete workforce management with AI-powered insights, attendance tracking, payroll processing, and performance reviews.</p><div class="page-actions" style="margin-top:16px"><button id="btn-add-employee" class="btn btn-primary btn-sm"><i class="fas fa-user-plus"></i> Add Employee</button><button id="btn-export-hr" class="btn btn-secondary btn-sm"><i class="fas fa-file-export"></i> Export Report</button><button id="btn-hr-ai-insights" class="btn btn-secondary btn-sm"><i class="fas fa-brain"></i> AI Insights</button></div></div>
    <div class="stats-grid">
      <div class="stat-card" onclick="window.viewStatDetail('HR', 'Total Employees')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon blue"><i class="fas fa-users"></i></div><span class="stat-trend up"><i class="fas fa-arrow-up"></i> ${s.newThisMonth}</span></div><div class="stat-value">${emps.length}</div><div class="stat-label">Total Employees</div></div>
      <div class="stat-card" onclick="window.viewStatDetail('HR', 'Present Today')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-user-check"></i></div><span class="stat-trend up"><i class="fas fa-arrow-up"></i> 96%</span></div><div class="stat-value">${s.presentToday}</div><div class="stat-label">Active</div></div>
      <div class="stat-card" onclick="window.viewStatDetail('HR', 'On Leave')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon yellow"><i class="fas fa-plane-departure"></i></div></div><div class="stat-value">${s.onLeave}</div><div class="stat-label">On Leave</div></div>
      <div class="stat-card" onclick="window.viewStatDetail('HR', 'New Hires')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon purple"><i class="fas fa-user-plus"></i></div></div><div class="stat-value">${s.newThisMonth}</div><div class="stat-label">New This Month</div></div>
    </div>
    <div class="tabs">
      <div class="tab active" onclick="switchHRTab('employees', this)">Employees</div>
      <div class="tab" onclick="switchHRTab('attendance', this)">Attendance</div>
      <div class="tab" onclick="switchHRTab('leave', this)">Leave</div>
      <div class="tab" onclick="switchHRTab('payroll', this)">Payroll</div>
      <div class="tab" onclick="switchHRTab('performance', this)">Performance</div>
    </div>
    
    <div id="hr-tab-employees" class="hr-tab-content" style="display:block">
      <div class="grid-2">
        <div class="card"><div class="card-header"><span class="card-title">Attendance This Week</span></div><div class="chart-container"><canvas data-chart="attendance"></canvas></div></div>
        <div class="card"><div class="card-header"><span class="card-title">Department Distribution</span></div><div style="display:flex;flex-direction:column;gap:12px;padding-top:8px">${deptBars}</div></div>
      </div>
      <div class="card">
        <div class="card-header">
          <span class="card-title">Employee Directory</span>
          <div style="display:flex;gap:10px;align-items:center">
            <div class="search-box" style="margin:0; width:220px">
              <i class="fas fa-search"></i>
              <input type="text" id="hr-employee-search" placeholder="Search employees..." style="background:transparent;border:none;color:#fff;outline:none;font-size:13px;width:100%">
            </div>
            <button id="btn-add-employee-table" class="btn btn-primary btn-sm"><i class="fas fa-plus"></i> Add</button>
          </div>
        </div>
        <div class="table-container" style="max-height: 550px; overflow-y: auto;">
          <table id="hr-employee-table">
            <thead style="position: sticky; top: 0; background: var(--bg-card); z-index: 10;">
              <tr><th>Employee</th><th>Department</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>${empRows}</tbody>
          </table>
        </div>
      </div>
    </div>
    
    <div id="hr-tab-attendance" class="hr-tab-content" style="display:none">
      <div class="card"><div class="card-header"><span class="card-title">Weekly Attendance Logs</span><button class="btn btn-primary btn-sm" onclick="window.markAttendance()"><i class="fas fa-check"></i> Mark Attendance</button></div><div class="table-container"><table><thead><tr><th>Date</th><th>Employee</th><th>Check-in</th><th>Check-out</th><th>Status</th></tr></thead><tbody>${
        db.table('employees').getAll().slice(0,8).map((e,i) => `<tr><td>May ${25-i}, 2026</td><td>${e.name}</td><td>09:0${i} AM</td><td>06:1${i} PM</td><td><span class="badge badge-success">Present</span></td></tr>`).join('')
      }</tbody></table></div></div>
    </div>
    
    <div id="hr-tab-leave" class="hr-tab-content" style="display:none">
      <div class="card"><div class="card-header"><span class="card-title">Recent Leave Requests</span><button class="btn btn-primary btn-sm" onclick="window.applyLeave()"><i class="fas fa-paper-plane"></i> Apply Leave</button></div><div class="table-container"><table><thead><tr><th>Employee</th><th>Leave Type</th><th>Dates</th><th>Days</th><th>Status</th><th>Actions</th></tr></thead><tbody>${
        db.table('leaves').getAll().map(l => `<tr><td style="font-weight:600">${l.employeeName}</td><td>${l.type}</td><td>${l.startDate} - ${l.endDate}</td><td>${l.days}</td><td><span class="badge badge-${l.status==='Pending'?'warning':'success'}">${l.status}</span></td><td><div style="display:flex;gap:4px"><button class="btn btn-success btn-sm btn-icon" title="Approve" onclick="window.approveLeave('${l.id}')"><i class="fas fa-check"></i></button><button class="btn btn-danger btn-sm btn-icon" title="Reject" onclick="window.rejectLeave('${l.id}')"><i class="fas fa-times"></i></button></div></td></tr>`).join('')
      }</tbody></table></div></div>
    </div>
    
    <div id="hr-tab-payroll" class="hr-tab-content" style="display:none">
      <div class="card"><div class="card-header"><span class="card-title">Salary Processing (May 2026)</span><button class="btn btn-primary btn-sm" onclick="window.runPayroll()"><i class="fas fa-money-bill-wave"></i> Run Payroll</button></div><div class="table-container"><table><thead><tr><th>Employee</th><th>Base Salary</th><th>Allowances</th><th>Deductions</th><th>Net Pay</th><th>Status</th></tr></thead><tbody>${
        db.table('employees').getAll().slice(0,8).map(e => `<tr><td style="font-weight:600">${e.name}</td><td>₹${(e.salary/12).toLocaleString()}</td><td>₹${Math.floor(e.salary/60).toLocaleString()}</td><td>₹${Math.floor(e.salary/100).toLocaleString()}</td><td>₹${(Math.floor(e.salary/12) + Math.floor(e.salary/60) - Math.floor(e.salary/100)).toLocaleString()}</td><td><span class="badge badge-info">Calculated</span></td></tr>`).join('')
      }</tbody></table></div></div>
    </div>
    
    <div id="hr-tab-performance" class="hr-tab-content" style="display:none">
      <div class="card"><div class="card-header"><span class="card-title">Performance Cycle (Q2 2026)</span><button class="btn btn-primary btn-sm" onclick="window.newReview()"><i class="fas fa-star"></i> New Review</button></div><div class="table-container"><table><thead><tr><th>Employee</th><th>Rating</th><th>Last Review</th><th>Manager</th><th>Goal Progress</th></tr></thead><tbody>${
        db.table('employees').getAll().slice(2,10).map(e => `<tr><td style="font-weight:600">${e.name}</td><td><div style="color:var(--warning)"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i></div></td><td>Mar 12, 2026</td><td>Neha Kapoor</td><td><div class="progress-bar" style="height:6px;width:100px"><div class="progress-fill blue" style="width:75%"></div></div></td></tr>`).join('')
      }</tbody></table></div></div>
    </div>`;
};

/* Finance & Accounting Page — reads from db */
pages.finance = function(container) {
  const s = db.table('financeStats').getAll()[0];
  const invoices = db.table('invoices').getAll();
  const txns = db.table('transactions').getAll();

  const txnHTML = txns.map(t => {
    const colors = {inflow:{bg:'rgba(34,197,94,0.12)',color:'var(--success)',icon:'fa-arrow-down',badge:'badge-success',label:'Received'},outflow:{bg:'rgba(239,68,68,0.12)',color:'var(--danger)',icon:'fa-arrow-up',badge:'badge-danger',label:'Paid'},pending:{bg:'rgba(245,158,11,0.12)',color:'var(--warning)',icon:'fa-clock',badge:'badge-warning',label:'Pending'}};
    const c = colors[t.type];
    return `<div class="list-item"><div class="list-icon" style="background:${c.bg};color:${c.color}"><i class="fas ${c.icon}"></i></div><div class="list-content"><div class="list-title">${t.title}</div><div class="list-subtitle">${t.ref} · ₹${(t.amount/100000).toFixed(1)}L</div></div><span class="badge ${c.badge}">${t.status}</span></div>`;
  }).join('');

  const invRows = invoices.map(inv => {
    const statusClass = {Pending:'badge-warning',Sent:'badge-info',Paid:'badge-success'}[inv.status];
    return `<tr><td style="font-weight:600;color:var(--accent-light)">${inv.invoiceNo}</td><td>${inv.client}</td><td>₹${inv.amount.toLocaleString('en-IN')}</td><td>${inv.dueDate}</td><td><span class="badge ${statusClass}">${inv.status}</span></td><td><div style="display:flex;gap:6px"><button class="btn btn-secondary btn-sm btn-icon" title="Edit" onclick="editInvoice('${inv.id}')"><i class="fas fa-pen"></i></button><button class="btn btn-secondary btn-sm btn-icon" style="color:var(--danger)" title="Delete" onclick="deleteInvoice('${inv.id}')"><i class="fas fa-trash"></i></button></div></td></tr>`;
  }).join('');

  container.innerHTML = `
    <div class="module-hero"><h2><i class="fas fa-coins" style="color:var(--warning)"></i> Finance & Accounting</h2><p>Double-entry accounting, AP/AR automation, multi-currency support, tax management, and AI-powered fraud detection.</p><div class="page-actions" style="margin-top:16px"><button id="btn-new-invoice" class="btn btn-primary btn-sm"><i class="fas fa-file-invoice"></i> New Invoice</button><button id="btn-record-expense" class="btn btn-secondary btn-sm"><i class="fas fa-receipt"></i> Record Expense</button><button id="btn-tax-calc" class="btn btn-secondary btn-sm" onclick="window.openTaxCalculatorModal()"><i class="fas fa-calculator"></i> Tax Calculator</button></div></div>
    <div class="stats-grid">
      <div class="stat-card" onclick="window.viewStatDetail('Finance', 'Revenue YTD')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-arrow-trend-up"></i></div><span class="stat-trend up"><i class="fas fa-arrow-up"></i> ${s.revenueGrowth}</span></div><div class="stat-value">${s.revenueYTD}</div><div class="stat-label">Revenue YTD</div></div>
      <div class="stat-card" onclick="window.viewStatDetail('Finance', 'Expenses YTD')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon red"><i class="fas fa-arrow-trend-down"></i></div><span class="stat-trend down"><i class="fas fa-arrow-down"></i> ${s.expenseChange}</span></div><div class="stat-value">${s.expensesYTD}</div><div class="stat-label">Expenses YTD</div></div>
      <div class="stat-card" onclick="window.viewStatDetail('Finance', 'Pending Invoices')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon blue"><i class="fas fa-file-invoice-dollar"></i></div></div><div class="stat-value">${s.pendingInvoices}</div><div class="stat-label">Pending Invoices</div></div>
      <div class="stat-card" onclick="window.viewStatDetail('Finance', 'Net Profit')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon purple"><i class="fas fa-piggy-bank"></i></div><span class="stat-trend up"><i class="fas fa-arrow-up"></i> ${s.profitGrowth}</span></div><div class="stat-value">${s.netProfit}</div><div class="stat-label">Net Profit</div></div>
    </div>
    <div class="grid-2">
      <div class="card"><div class="card-header"><span class="card-title">Cash Flow</span><span class="card-subtitle">Inflow vs Outflow (6 months)</span></div><div class="chart-container"><canvas data-chart="cashflow"></canvas></div></div>
      <div class="card"><div class="card-header"><span class="card-title">Recent Transactions</span></div><div class="activity-list">${txnHTML}</div></div>
    </div>
    <div class="card"><div class="card-header"><span class="card-title">Invoice Ledger</span><span class="badge badge-info" style="font-size:12px;padding:4px 12px;margin-left:10px">${invoices.length} Total</span></div><div class="table-container" style="max-height:420px;overflow-y:auto"><table><thead style="position:sticky;top:0;background:var(--bg-card);z-index:10"><tr><th>Invoice #</th><th>Client</th><th>Amount</th><th>Due Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>${invRows}</tbody></table></div></div>`;
};

/* Inventory & Supply Chain Page — reads from db */
pages.inventory = function(container) {
  const s = db.table('inventoryStats').getAll()[0];
  const products = db.table('products').getAll();
  const alerts = db.table('lowStockAlerts').getAll();

  const alertsHTML = alerts.map(a => {
    const isCritical = a.severity === 'critical';
    const watched = a.watched ? true : false;
    if (isCritical) {
      return `<div class="list-item"><div class="list-icon" style="background:rgba(239,68,68,0.12);color:var(--danger)"><i class="fas fa-exclamation"></i></div><div class="list-content"><div class="list-title">${a.name}</div><div class="list-subtitle">Stock: ${a.stock} / Reorder: ${a.reorderLevel}</div></div><button class="btn btn-primary btn-sm" onclick="reorderLowStockItem('${a.id}')"><i class="fas fa-truck-fast" style="margin-right:4px"></i>Reorder</button></div>`;
    } else {
      return `<div class="list-item"><div class="list-icon" style="background:rgba(245,158,11,0.12);color:var(--warning)"><i class="fas fa-triangle-exclamation"></i></div><div class="list-content"><div class="list-title">${a.name}</div><div class="list-subtitle">Stock: ${a.stock} / Reorder: ${a.reorderLevel}</div></div><button class="btn btn-${watched?'success':'secondary'} btn-sm" onclick="watchLowStockItem('${a.id}')" id="watch-btn-${a.id}">${watched?'<i class=\"fas fa-eye\" style=\"margin-right:4px\"></i>Watching':'<i class=\"fas fa-eye\" style=\"margin-right:4px\"></i>Watch'}</button></div>`;
    }
  }).join('');

  const prodRows = products.map(p => `<tr><td style="font-family:var(--font-mono);font-size:12px;color:var(--accent-light)">${p.sku}</td><td>${p.name}</td><td>${p.category}</td><td>${p.stock}</td><td>${p.warehouse}</td><td><span class="badge badge-${p.status==='In Stock'?'success':'danger'}">${p.status}</span></td></tr>`).join('');

  container.innerHTML = `
    <div class="module-hero"><h2><i class="fas fa-warehouse" style="color:var(--cyan)"></i> Inventory & Supply Chain</h2><p>Warehouse management, barcode/RFID tracking, vendor management, automated reorder, and IoT sensor integration.</p><div class="page-actions" style="margin-top:16px"><button id="btn-add-product" class="btn btn-primary btn-sm"><i class="fas fa-plus"></i> Add Product</button><button id="btn-new-po" class="btn btn-secondary btn-sm"><i class="fas fa-truck"></i> New PO</button><button id="btn-scan-inventory" class="btn btn-secondary btn-sm"><i class="fas fa-barcode"></i> Scan</button></div></div>
    <div class="stats-grid">
      <div class="stat-card" onclick="window.viewStatDetail('Inventory', 'Total Products')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon cyan"><i class="fas fa-boxes-stacked"></i></div></div><div class="stat-value">${s.totalProducts.toLocaleString()}</div><div class="stat-label">Total Products</div></div>
      <div class="stat-card" onclick="window.viewStatDetail('Inventory', 'In Stock Items')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-check-circle"></i></div></div><div class="stat-value">${s.inStock.toLocaleString()}</div><div class="stat-label">In Stock</div></div>
      <div class="stat-card" onclick="window.viewStatDetail('Inventory', 'Low Stock Alerts')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon red"><i class="fas fa-exclamation-triangle"></i></div></div><div class="stat-value">${s.lowStockAlerts}</div><div class="stat-label">Low Stock Alerts</div></div>
      <div class="stat-card" onclick="window.viewStatDetail('Inventory', 'Pending Orders')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon purple"><i class="fas fa-truck-fast"></i></div></div><div class="stat-value">${s.pendingOrders}</div><div class="stat-label">Pending Orders</div></div>
    </div>
    <div class="grid-2">
      <div class="card"><div class="card-header"><span class="card-title">Stock by Category</span></div><div class="chart-container"><canvas data-chart="inventory"></canvas></div></div>
      <div class="card"><div class="card-header"><span class="card-title">Low Stock Alerts</span><span class="badge badge-danger">5 critical</span></div><div class="activity-list">${alertsHTML}</div></div>
    </div>
    <div class="card"><div class="card-header"><span class="card-title">Product Inventory</span></div><div class="table-container"><table><thead><tr><th>SKU</th><th>Product</th><th>Category</th><th>Stock</th><th>Warehouse</th><th>Status</th></tr></thead><tbody>${prodRows}</tbody></table></div></div>`;
};
