window.pages = window.pages || {};
var pages = window.pages;
/* ============================================================
   HTML Sanitization Utility — prevents XSS in template literals
   ============================================================ */
function escHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ============================================================
   HR Management Page — Live Database Integration
   ============================================================ */
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
    <div class="module-hero">
      <h2><i class="fas fa-users" style="color:var(--accent-light)"></i> HR Management</h2>
      <p>Complete workforce management with AI-powered insights, attendance tracking, payroll processing, and performance reviews.</p>
      <div class="page-actions" style="margin-top:16px">
        <button class="btn btn-primary btn-sm" id="hr-add-btn"><i class="fas fa-user-plus"></i> Add Employee</button>
        <button class="btn btn-secondary btn-sm"><i class="fas fa-file-export"></i> Export Report</button>
        <button class="btn btn-secondary btn-sm" id="hr-ai-insights-btn"><i class="fas fa-brain"></i> AI Insights</button>
      </div>
    </div>
    <div class="stats-grid" id="hr-stats">
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon blue"><i class="fas fa-users"></i></div></div><div class="stat-value" id="hr-total">—</div><div class="stat-label">Total Employees</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-user-check"></i></div></div><div class="stat-value" id="hr-active">—</div><div class="stat-label">Active</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon yellow"><i class="fas fa-plane-departure"></i></div></div><div class="stat-value" id="hr-onleave">12</div><div class="stat-label">On Leave</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon purple"><i class="fas fa-user-plus"></i></div></div><div class="stat-value" id="hr-new">—</div><div class="stat-label">New This Month</div></div>
    </div>
    <div class="tabs"><div class="tab active" onclick="this.parentElement.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));this.classList.add('active')">Employees</div><div class="tab" onclick="this.parentElement.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));this.classList.add('active')">Attendance</div><div class="tab" onclick="this.parentElement.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));this.classList.add('active')">Leave</div><div class="tab" onclick="this.parentElement.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));this.classList.add('active')">Payroll</div></div>
    <div class="grid-2">
      <div class="card">
        <div class="card-header"><span class="card-title">Attendance This Week</span></div>
        <div class="chart-container"><canvas data-chart="attendance"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Department Distribution</span></div>
        <div id="hr-dept-distribution" style="display:flex;flex-direction:column;gap:12px;padding-top:8px">
          <!-- Dynamically populated -->
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <span class="card-title">Employee Directory</span>
        <div style="display:flex;gap:8px;align-items:center">
          <input type="text" class="form-control" id="emp-search" placeholder="Search employees..." style="width:200px;padding:6px 12px;font-size:13px;">
          <button class="btn btn-primary btn-sm" id="hr-add-btn2"><i class="fas fa-plus"></i> Add</button>
        </div>
      </div>
      <div class="table-container">
        <table>
          <thead><tr><th>Employee</th><th>Department</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody id="emp-tbody"><tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-muted)"><i class="fas fa-spinner fa-spin"></i> Loading employees...</td></tr></tbody>
        </table>
      </div>
    </div>`;

  // Helper: get initials with gradient
  function empAvatar(name) {
    const initials = name.split(' ').map(w => w[0]).join('').substring(0,2).toUpperCase();
    const gradients = ['linear-gradient(135deg,#6366f1,#a855f7)','linear-gradient(135deg,#ec4899,#f59e0b)','linear-gradient(135deg,#22c55e,#06b6d4)','linear-gradient(135deg,#f59e0b,#ef4444)','linear-gradient(135deg,#a855f7,#6366f1)'];
    const g = gradients[initials.charCodeAt(0) % gradients.length];
    return `<div style="width:32px;height:32px;border-radius:8px;background:${g};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0">${initials}</div>`;
  }

  // ── LocalStorage helpers (fallback when server is offline) ──
  const LS_EMP_KEY = 'amdox_employees';
  const SEED_EMPLOYEES = [
    { id: 1, name: 'Arjun Mehta', email: 'arjun@amdox.com', department: 'Engineering', role: 'Software Engineer', status: 'Active', joined: 'Jan 2024' },
    { id: 2, name: 'Priya Sharma', email: 'priya@amdox.com', department: 'HR & Admin', role: 'HR Manager', status: 'Active', joined: 'Mar 2023' },
    { id: 3, name: 'Rahul Desai', email: 'rahul@amdox.com', department: 'Sales & Marketing', role: 'Sales Executive', status: 'Probation', joined: 'May 2026' }
  ];

  function lsGetEmployees() {
    try { return JSON.parse(localStorage.getItem(LS_EMP_KEY)) || SEED_EMPLOYEES; } catch { return SEED_EMPLOYEES; }
  }
  function lsSaveEmployees(list) {
    try { localStorage.setItem(LS_EMP_KEY, JSON.stringify(list)); } catch {}
  }
  function lsNextEmpId() {
    const list = lsGetEmployees();
    return list.length ? Math.max(...list.map(i=>i.id))+1 : 1;
  }

  let cachedEmployees = [];

  // Render employees table
  async function loadEmployees(query='') {
    const tbody = document.getElementById('emp-tbody');
    if (!tbody) return;

    const render = (employees) => {
      const totalEl  = document.getElementById('hr-total');
      const activeEl = document.getElementById('hr-active');
      const newEl    = document.getElementById('hr-new');
      if (totalEl)  totalEl.textContent  = employees.length;
      if (activeEl) activeEl.textContent = employees.filter(e => e.status === 'Active').length;
      if (newEl) {
        const thisMonth = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        newEl.textContent = employees.filter(e => e.joined === thisMonth || e.joined.includes(new Date().getFullYear().toString())).length;
      }
      
      const onLeaveEl = document.getElementById('hr-onleave');
      if (onLeaveEl) {
        onLeaveEl.textContent = employees.filter(e => e.status === 'On Leave').length;
      }

      const deptDistributionEl = document.getElementById('hr-dept-distribution');
      if (deptDistributionEl) {
        const depts = ['Engineering', 'Sales', 'Finance', 'HR', 'Operations', 'Marketing', 'Legal'];
        const counts = {};
        depts.forEach(d => counts[d] = 0);
        
        employees.forEach(e => {
          const dept = e.department || 'Engineering';
          counts[dept] = (counts[dept] || 0) + 1;
        });
        
        const colors = {
          'Engineering': 'blue',
          'Sales': 'green',
          'Finance': 'purple',
          'HR': 'yellow',
          'Operations': 'cyan',
          'Marketing': 'pink',
          'Legal': 'blue'
        };
        
        const maxVal = Math.max(...Object.values(counts), 1);
        const sortedDepts = depts.sort((a,b) => counts[b] - counts[a]);
        
        deptDistributionEl.innerHTML = sortedDepts.map(k => {
          const count = counts[k];
          const pct = Math.round((count / maxVal) * 80) + 10;
          const color = colors[k] || 'blue';
          return `<div>
            <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px">
              <span>${escHtml(k)}</span>
              <span style="color:var(--text-muted)">${count} employee${count === 1 ? '' : 's'}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill ${color}" style="width:${pct}%"></div>
            </div>
          </div>`;
        }).join('');
      }

      let filtered = employees;
      if (query) filtered = filtered.filter(e => e.name.toLowerCase().includes(query) || e.department.toLowerCase().includes(query) || e.role.toLowerCase().includes(query));
      if (!filtered.length) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-muted)">No employees found.</td></tr>`;
        return;
      }
      const statusBadge = s => ({ Active:'badge-success', Probation:'badge-info', 'On Leave':'badge-warning', Inactive:'badge-danger' }[s] || 'badge-secondary');
      tbody.innerHTML = filtered.map(e => `
        <tr>
          <td><div style="display:flex;align-items:center;gap:10px">${empAvatar(e.name)}<div><div style="font-weight:600">${e.name}</div><div style="font-size:11px;color:var(--text-muted)">${e.email}</div></div></div></td>
          <td>${e.department}</td>
          <td>${e.role}</td>
          <td><span class="badge ${statusBadge(e.status)}">${e.status}</span></td>
          <td>${e.joined}</td>
          <td style="display:flex;gap:6px">
            <button class="btn btn-secondary btn-sm" onclick="hrEditEmployee(${e.id})"><i class="fas fa-pen"></i></button>
            <button class="btn btn-secondary btn-sm" style="color:var(--danger)" onclick="hrDeleteEmployee(${e.id},'${e.name.replace(/'/g,"\\'")}')"><i class="fas fa-trash"></i></button>
          </td>
        </tr>`).join('');
    };

    if (!cachedEmployees.length) {
      cachedEmployees = lsGetEmployees();
    }
    render(cachedEmployees);

    if (query) return; // Skip API fetch while searching

    try {
      const res = await Promise.race([
        fetch(`${API_BASE}/employees`),
        new Promise((_,rej) => setTimeout(() => rej(new Error('timeout')), 1500))
      ]);
      const json = await res.json();
      if (json.success) {
        cachedEmployees = json.data;
        render(cachedEmployees);
      }
    } catch (err) {}
  }

  loadEmployees();

  // Search
  document.getElementById('emp-search')?.addEventListener('input', e => loadEmployees(e.target.value.toLowerCase()));

  // Add employee modal
  function openAddModal() {
    showModal({
      title: '<i class="fas fa-user-plus" style="color:var(--accent-light)"></i> Add New Employee',
      submitLabel: 'Add Employee',
      fields: [
        { name:'name',       label:'Full Name',   required:true, placeholder:'e.g. Arjun Mehta' },
        { name:'email',      label:'Email',        required:true, type:'email', placeholder:'e.g. arjun@amdox.com' },
        { name:'department', label:'Department',   required:true, type:'select', options:['Engineering','Sales','Finance','HR','Operations','Marketing','Legal'], default:'Engineering' },
        { name:'role',       label:'Job Title',    required:true, placeholder:'e.g. Software Engineer' },
        { name:'status',     label:'Status',       type:'select',  options:['Active','Probation','On Leave','Inactive'], default:'Active' },
        { name:'joined',     label:'Join Date',    placeholder:'e.g. Jun 2026' }
      ],
      async onSubmit(data, close) {
        try {
          const res = await Promise.race([
            fetch(`${API_BASE}/employees`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) }),
            new Promise((_,rej) => setTimeout(() => rej(new Error('timeout')), 1500))
          ]);
          const json = await res.json();
          if (!json.success) { showToast(json.error || 'Failed to add employee', 'error'); return; }
          showToast(`✅ Employee "${json.data.name}" added successfully!`, 'success');
        } catch {
          const newEmp = { id: lsNextEmpId(), ...data, joined: data.joined || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) };
          const list = lsGetEmployees();
          list.unshift(newEmp);
          lsSaveEmployees(list);
          cachedEmployees = list;
          showToast(`✅ Employee "${newEmp.name}" added! (saved locally)`, 'success');
        }
        close();
        loadEmployees();
      }
    });
  }

  document.getElementById('hr-add-btn')?.addEventListener('click',  openAddModal);
  document.getElementById('hr-add-btn2')?.addEventListener('click', openAddModal);

  document.getElementById('hr-ai-insights-btn')?.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-box" style="max-width:540px">
        <div class="modal-header">
          <h3 class="modal-title"><i class="fas fa-brain" style="color:var(--purple)"></i> HR Predictive Insights</h3>
          <button class="modal-close" id="hr-ai-close"><i class="fas fa-xmark"></i></button>
        </div>
        <div class="modal-body" style="padding:20px; display:flex; flex-direction:column; gap:16px;">
          <div style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:14px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><i class="fas fa-user-xmark" style="color:var(--danger)"></i><strong style="font-size:13px">Flight Risk Alerts</strong></div>
            <p style="font-size:13px;color:var(--text-secondary)"><strong style="color:var(--danger)">1 employee</strong> flagged with high flight risk (82% probability based on low communication activity and tenure). Check-in recommended.</p>
          </div>
          <div style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:14px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><i class="fas fa-graduation-cap" style="color:var(--info)"></i><strong style="font-size:13px">Skill Gap Analysis</strong></div>
            <p style="font-size:13px;color:var(--text-secondary)"><strong style="color:var(--info)">3 engineers</strong> lacking advanced cloud security certifications. Training course <strong style="color:var(--info)">AWS Cloud Architect Essentials</strong> is suggested.</p>
          </div>
          <div style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:14px">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><i class="fas fa-face-smile" style="color:var(--success)"></i><strong style="font-size:13px">Sentiment Index</strong></div>
            <p style="font-size:13px;color:var(--text-secondary)">Overall team satisfaction is at <strong style="color:var(--success)">8.4 / 10</strong> (+5% YoY). Highest satisfaction observed in the Engineering department.</p>
          </div>
        </div>
        <div class="modal-footer" style="padding: 12px 20px; display: flex; justify-content: flex-end;">
          <button class="btn btn-secondary btn-sm" id="hr-ai-done">Close</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('open'));

    const closeModal = () => {
      overlay.classList.remove('open');
      setTimeout(() => overlay.remove(), 200);
    };
    overlay.querySelector('#hr-ai-close').addEventListener('click', closeModal);
    overlay.querySelector('#hr-ai-done').addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  });

  // Edit employee
  window.hrEditEmployee = async function(id) {
    let e = cachedEmployees.find(emp => emp.id === id);
    if (!e) {
      try {
        const res = await Promise.race([
          fetch(`${API_BASE}/employees/${id}`),
          new Promise((_,rej) => setTimeout(() => rej(new Error('timeout')), 1500))
        ]);
        const json = await res.json();
        if (json.success) e = json.data;
      } catch {}
    }
    if (!e) { showToast('Could not load employee', 'error'); return; }
    
    showModal({
      title: '<i class="fas fa-pen" style="color:var(--accent-light)"></i> Edit Employee',
      submitLabel: 'Save Changes',
      fields: [
        { name:'name',       label:'Full Name',   required:true, default:e.name },
        { name:'email',      label:'Email',        required:true, type:'email', default:e.email },
        { name:'department', label:'Department',   required:true, type:'select', options:['Engineering','Sales','Finance','HR','Operations','Marketing','Legal'], default:e.department },
        { name:'role',       label:'Job Title',    required:true, default:e.role },
        { name:'status',     label:'Status',       type:'select',  options:['Active','Probation','On Leave','Inactive'], default:e.status }
      ],
      async onSubmit(data, close) {
        try {
          const r = await Promise.race([
            fetch(`${API_BASE}/employees/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) }),
            new Promise((_,rej) => setTimeout(() => rej(new Error('timeout')), 1500))
          ]);
          const json = await r.json();
          if (!json.success) { showToast(json.error || 'Update failed', 'error'); return; }
          showToast(`✅ Employee "${json.data.name}" updated!`, 'success');
        } catch {
          const list = lsGetEmployees();
          const idx = list.findIndex(emp => emp.id === id);
          if (idx > -1) {
            list[idx] = { ...list[idx], ...data };
            lsSaveEmployees(list);
          }
          cachedEmployees = list;
          showToast(`✅ Employee updated! (saved locally)`, 'success');
        }
        close();
        loadEmployees();
      }
    });
  };

  // Delete employee
  window.hrDeleteEmployee = function(id, name) {
    showConfirm(`Do you want to delete <strong>${name}</strong>?`, async () => {
      try {
        const res = await Promise.race([
          fetch(`${API_BASE}/employees/${id}`, { method:'DELETE' }),
          new Promise((_,rej) => setTimeout(() => rej(new Error('timeout')), 1500))
        ]);
        const json = await res.json();
        if (!json.success) { showToast(json.error || 'Delete failed', 'error'); return; }
        showToast(`Employee "${name}" removed.`, 'success');
      } catch {
        const list = lsGetEmployees().filter(emp => emp.id !== id);
        lsSaveEmployees(list);
        cachedEmployees = list;
        showToast(`Employee "${name}" removed. (locally)`, 'success');
      }
      loadEmployees();
    });
  };
};

/* ============================================================
   Finance & Accounting Page — Live Database Integration
   ============================================================ */
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
    <div class="module-hero">
      <h2><i class="fas fa-coins" style="color:var(--warning)"></i> Finance & Accounting</h2>
      <p>Double-entry accounting, AP/AR automation, multi-currency support, tax management, and AI-powered fraud detection.</p>
      <div class="page-actions" style="margin-top:16px">
        <button class="btn btn-primary btn-sm" id="inv-add-btn"><i class="fas fa-file-invoice"></i> New Invoice</button>
        <button class="btn btn-secondary btn-sm" id="exp-add-btn"><i class="fas fa-receipt"></i> Record Expense</button>
        <button class="btn btn-secondary btn-sm" id="tax-calc-btn"><i class="fas fa-calculator"></i> Tax Calculator</button>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-arrow-trend-up"></i></div></div><div class="stat-value" id="fin-revenue">—</div><div class="stat-label">Revenue (Paid Invoices)</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon red"><i class="fas fa-arrow-trend-down"></i></div></div><div class="stat-value" id="fin-expenses">—</div><div class="stat-label">Total Expenses & Taxes</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon blue"><i class="fas fa-file-invoice-dollar"></i></div></div><div class="stat-value" id="fin-pending">—</div><div class="stat-label">Pending Invoices</div></div>
      <div class="stat-card" id="fin-profit-card" style="cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.2)';" onmouseout="this.style.transform='none'; this.style.boxShadow='none';">
        <div class="stat-card-header">
          <div class="stat-icon purple"><i class="fas fa-piggy-bank"></i></div>
          <span style="font-size:11px;font-weight:600;color:var(--accent-light);display:flex;align-items:center;gap:4px">Breakdown <i class="fas fa-chevron-right" style="font-size:9px"></i></span>
        </div>
        <div class="stat-value" id="fin-profit">—</div>
        <div class="stat-label">Net Profit</div>
      </div>
    </div>
    <div class="grid-2">
      <div class="card"><div class="card-header"><span class="card-title">Cash Flow</span><span class="card-subtitle">Inflow vs Outflow (6 months)</span></div><div class="chart-container"><canvas data-chart="cashflow"></canvas></div></div>
      <div class="card">
        <div class="card-header"><span class="card-title">Recent Transactions</span></div>
        <div class="activity-list" id="fin-recent-txn">
          <div class="list-item"><div class="list-icon" style="background:rgba(34,197,94,0.12);color:var(--success)"><i class="fas fa-arrow-down"></i></div><div class="list-content"><div class="list-title">Payment from Tata Motors</div><div class="list-subtitle">INV-2845 · ₹4,50,000</div></div><span class="badge badge-success">Received</span></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(239,68,68,0.12);color:var(--danger)"><i class="fas fa-arrow-up"></i></div><div class="list-content"><div class="list-title">Vendor Payment — CloudHost</div><div class="list-subtitle">PO-1240 · ₹1,20,000</div></div><span class="badge badge-danger">Paid</span></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(245,158,11,0.12);color:var(--warning)"><i class="fas fa-clock"></i></div><div class="list-content"><div class="list-title">Invoice to Infosys</div><div class="list-subtitle">INV-2847 · ₹8,75,000</div></div><span class="badge badge-warning">Pending</span></div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <span class="card-title">Invoice Ledger</span>
        <div style="display:flex;gap:8px;align-items:center">
          <select class="form-control" id="inv-filter" style="width:150px;padding:6px 10px;font-size:13px">
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Sent">Sent</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
          <button class="btn btn-primary btn-sm" id="inv-add-btn2"><i class="fas fa-plus"></i> New</button>
        </div>
      </div>
      <div class="table-container">
        <table>
          <thead><tr><th>Invoice #</th><th>Client</th><th>Amount</th><th>Due Date</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="inv-tbody"><tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-muted)"><i class="fas fa-spinner fa-spin"></i> Loading invoices...</td></tr></tbody>
        </table>
      </div>
    </div>`;

  // ── LocalStorage helpers (fallback when server is offline) ──
  const LS_KEY = 'amdox_invoices';
  const SEED_INVOICES = [
    { id:1, invoice_no:'INV-2847', client:'Infosys Ltd',         amount:875000,  due_date:'May 25, 2026', status:'Pending' },
    { id:2, invoice_no:'INV-2846', client:'Reliance Industries',  amount:1240000, due_date:'May 20, 2026', status:'Sent'    },
    { id:3, invoice_no:'INV-2845', client:'Tata Motors',          amount:450000,  due_date:'May 15, 2026', status:'Paid'    },
    { id:4, invoice_no:'INV-2844', client:'HCL Technologies',     amount:680000,  due_date:'May 10, 2026', status:'Paid'    }
  ];

  function lsGetInvoices() {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || SEED_INVOICES; } catch { return SEED_INVOICES; }
  }
  function lsSaveInvoices(list) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch {}
  }
  function lsNextInvoiceNo() {
    const list = lsGetInvoices();
    const nums = list.map(i => parseInt(i.invoice_no.replace('INV-',''),10)).filter(n=>!isNaN(n));
    return 'INV-' + (nums.length ? Math.max(...nums)+1 : 2848);
  }
  function lsNextId() {
    const list = lsGetInvoices();
    return list.length ? Math.max(...list.map(i=>i.id))+1 : 1;
  }

  // ── Expenses & Taxes LocalStorage helpers ──
  const LS_EXP_KEY = 'amdox_expenses';
  function lsGetExpenses() {
    try {
      const data = JSON.parse(localStorage.getItem(LS_EXP_KEY));
      if (!data) return [{ amount: 5820000, vendor: 'Base Historical Expenses & Taxes', category: 'General', date: 'Prior' }];
      return data.map(item => {
        if (typeof item === 'number') {
          return { amount: item, vendor: 'Recorded Expense', category: 'General', date: 'May 2026' };
        }
        return item;
      });
    } catch {
      return [{ amount: 5820000, vendor: 'Base Historical Expenses & Taxes', category: 'General', date: 'Prior' }];
    }
  }
  function lsAddExpense(obj) {
    const list = lsGetExpenses();
    list.push({
      amount: parseFloat(obj.amount) || 0,
      vendor: obj.vendor || 'General Expense',
      category: obj.category || 'General',
      date: obj.date || 'May 28, 2026'
    });
    try { localStorage.setItem(LS_EXP_KEY, JSON.stringify(list)); } catch {}
  }

  // ── Try server first, fall back to localStorage ──
  async function apiRequest(method, path, body) {
    try {
      const opts = { method, headers:{'Content-Type':'application/json'} };
      if (body) opts.body = JSON.stringify(body);
      const res  = await Promise.race([
        fetch(`${API_BASE}${path}`, opts),
        new Promise((_,rej) => setTimeout(() => rej(new Error('timeout')), 2000))
      ]);
      return await res.json();
    } catch { return null; /* server offline */ }
  }

  // ── Render helpers ──
  const statusBadge = s => ({ Pending:'badge-warning', Sent:'badge-info', Paid:'badge-success', Overdue:'badge-danger' }[s] || 'badge-secondary');
  const fmtAmount   = a => '₹' + Number(a).toLocaleString('en-IN');

  function updateStats(invoices) {
    // Pending
    const pEl = document.getElementById('fin-pending');
    if (pEl) pEl.textContent = invoices.filter(i => i.status === 'Pending').length;
    
    // Revenue (Sum of Paid)
    const rev = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0) + 11800000; // adding base 1.18Cr for demo
    const rEl = document.getElementById('fin-revenue');
    if (rEl) rEl.textContent = '₹' + (rev >= 10000000 ? (rev/10000000).toFixed(2) + 'Cr' : (rev/100000).toFixed(1) + 'L');

    // Expenses
    const expenses = lsGetExpenses().reduce((sum, item) => sum + item.amount, 0);
    const eEl = document.getElementById('fin-expenses');
    if (eEl) eEl.textContent = '₹' + (expenses >= 10000000 ? (expenses/10000000).toFixed(2) + 'Cr' : (expenses/100000).toFixed(1) + 'L');

    // Net Profit
    const profit = rev - expenses;
    const npEl = document.getElementById('fin-profit');
    if (npEl) npEl.textContent = '₹' + (profit >= 10000000 ? (profit/10000000).toFixed(2) + 'Cr' : (profit/100000).toFixed(1) + 'L');
  }

  function showProfitBreakdown() {
    const paidInvs = cachedInvoices.filter(i => i.status === 'Paid');
    const rev = paidInvs.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0) + 11800000;
    const expensesList = lsGetExpenses();
    const expenses = expensesList.reduce((sum, item) => sum + item.amount, 0);
    const profit = rev - expenses;
    const ratio = rev > 0 ? Math.round((expenses / rev) * 100) : 0;

    // Create overlay
    document.querySelector('#profit-modal-overlay')?.remove();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'profit-modal-overlay';
    overlay.innerHTML = `
      <div class="modal-box" style="max-width: 680px;">
        <div class="modal-header">
          <h3 class="modal-title"><i class="fas fa-chart-line" style="color:var(--accent-light)"></i> Net Profit Breakdown</h3>
          <button class="modal-close" id="profit-modal-close-btn" aria-label="Close"><i class="fas fa-xmark"></i></button>
        </div>
        <div class="modal-body" style="padding: 24px; display:flex; flex-direction:column; gap:16px;">
          
          <!-- Math Formula Cards -->
          <div style="display: flex; gap: 12px; align-items: center; justify-content: space-between; margin-bottom: 8px; background: rgba(255,255,255,0.03); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="text-align: center; flex: 1;">
              <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Revenue</div>
              <div style="font-size: 18px; font-weight: 700; color: var(--success); margin-top: 4px;" id="breakdown-rev-val">₹0</div>
            </div>
            <div style="font-size: 18px; color: var(--text-muted); font-weight: 300;">—</div>
            <div style="text-align: center; flex: 1;">
              <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Expenses</div>
              <div style="font-size: 18px; font-weight: 700; color: var(--danger); margin-top: 4px;" id="breakdown-exp-val">₹0</div>
            </div>
            <div style="font-size: 18px; color: var(--text-muted); font-weight: 300;">=</div>
            <div style="text-align: center; flex: 1; background: rgba(168, 85, 247, 0.1); padding: 8px; border-radius: var(--radius-sm); border: 1px solid rgba(168, 85, 247, 0.2);">
              <div style="font-size: 11px; color: var(--accent-light); text-transform: uppercase; letter-spacing: 0.5px;">Net Profit</div>
              <div style="font-size: 20px; font-weight: 800; color: var(--accent-light); margin-top: 4px;" id="breakdown-profit-val">₹0</div>
            </div>
          </div>

          <!-- Ratio Bar -->
          <div style="margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
              <span style="color: var(--text-secondary)">Expense-to-Revenue Ratio</span>
              <span style="font-weight: 600; color: var(--text-primary)" id="breakdown-ratio-percent">0%</span>
            </div>
            <div class="progress-bar" style="height: 8px;">
              <div class="progress-fill red" id="breakdown-ratio-fill" style="width: 0%;"></div>
            </div>
          </div>

          <!-- Inflow and Outflow Tabs / Split View -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            
            <!-- Revenue List -->
            <div>
              <h4 style="font-size: 13px; font-weight: 600; color: var(--success); margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                <i class="fas fa-arrow-trend-up"></i> Inflow (Revenue)
              </h4>
              <div style="max-height: 250px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: var(--radius-md); background: rgba(0,0,0,0.15);">
                <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                  <thead>
                    <tr style="border-bottom: 1px solid var(--border-color); background: rgba(255,255,255,0.02);">
                      <th style="padding: 8px 12px; text-align: left; color: var(--text-muted); font-size:11px;">Source</th>
                      <th style="padding: 8px 12px; text-align: right; color: var(--text-muted); font-size:11px;">Amount</th>
                    </tr>
                  </thead>
                  <tbody id="breakdown-rev-tbody">
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Expenses List -->
            <div>
              <h4 style="font-size: 13px; font-weight: 600; color: var(--danger); margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                <i class="fas fa-arrow-trend-down"></i> Outflow (Expenses)
              </h4>
              <div style="max-height: 250px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: var(--radius-md); background: rgba(0,0,0,0.15);">
                <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                  <thead>
                    <tr style="border-bottom: 1px solid var(--border-color); background: rgba(255,255,255,0.02);">
                      <th style="padding: 8px 12px; text-align: left; color: var(--text-muted); font-size:11px;">Source</th>
                      <th style="padding: 8px 12px; text-align: right; color: var(--text-muted); font-size:11px;">Amount</th>
                    </tr>
                  </thead>
                  <tbody id="breakdown-exp-tbody">
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
        <div class="modal-footer" style="padding: 16px 24px; display: flex; justify-content: flex-end;">
          <button type="button" class="btn btn-secondary btn-sm" id="profit-modal-close-btn2">Close Statement</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);

    overlay.querySelector('#breakdown-rev-val').textContent = '₹' + Number(rev).toLocaleString('en-IN');
    overlay.querySelector('#breakdown-exp-val').textContent = '₹' + Number(expenses).toLocaleString('en-IN');
    overlay.querySelector('#breakdown-profit-val').textContent = '₹' + Number(profit).toLocaleString('en-IN');
    overlay.querySelector('#breakdown-ratio-percent').textContent = ratio + '%';
    overlay.querySelector('#breakdown-ratio-fill').style.width = Math.min(ratio, 100) + '%';

    const revTbody = overlay.querySelector('#breakdown-rev-tbody');
    const expTbody = overlay.querySelector('#breakdown-exp-tbody');

    // Revenue items list
    let revHtml = paidInvs.map(i => `
      <tr style="border-bottom:1px solid var(--border-color)">
        <td style="padding:10px 12px;line-height:1.4">
          <div style="font-weight:600;color:var(--text-primary)">${i.client}</div>
          <div style="color:var(--text-muted);font-size:10px">${i.invoice_no}</div>
        </td>
        <td style="padding:10px 12px;text-align:right;font-weight:600;color:var(--success)">
          ₹${Number(i.amount).toLocaleString('en-IN')}
        </td>
      </tr>
    `).join('');
    revHtml += `
      <tr>
        <td style="padding:10px 12px;line-height:1.4">
          <div style="font-weight:600;color:var(--text-primary)">Historical Base Revenue</div>
          <div style="color:var(--text-muted);font-size:10px">Pre-system ledger</div>
        </td>
        <td style="padding:10px 12px;text-align:right;font-weight:600;color:var(--success)">
          ₹1,18,00,000
        </td>
      </tr>
    `;
    revTbody.innerHTML = revHtml;

    // Expense items list
    const expHtml = expensesList.map(e => `
      <tr style="border-bottom:1px solid var(--border-color)">
        <td style="padding:10px 12px;line-height:1.4">
          <div style="font-weight:600;color:var(--text-primary)">${e.vendor}</div>
          <div style="color:var(--text-muted);font-size:10px">${e.category} · ${e.date}</div>
        </td>
        <td style="padding:10px 12px;text-align:right;font-weight:600;color:var(--danger)">
          ₹${Number(e.amount).toLocaleString('en-IN')}
        </td>
      </tr>
    `).join('');
    expTbody.innerHTML = expHtml;

    requestAnimationFrame(() => overlay.classList.add('open'));
    const closeModal = () => {
      overlay.classList.remove('open');
      setTimeout(() => overlay.remove(), 200);
    };
    overlay.querySelector('#profit-modal-close-btn').addEventListener('click', closeModal);
    overlay.querySelector('#profit-modal-close-btn2').addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  }

  function renderTable(invoices) {
    const tbody = document.getElementById('inv-tbody');
    if (!tbody) return;
    const filter = document.getElementById('inv-filter')?.value || '';
    const list   = filter ? invoices.filter(i => i.status === filter) : invoices;
    if (!list.length) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text-muted)">No invoices found.</td></tr>`;
      return;
    }
    tbody.innerHTML = list.map(i => `
      <tr>
        <td style="font-weight:600;color:var(--accent-light)">${i.invoice_no}</td>
        <td>${i.client}</td>
        <td style="font-weight:600">${fmtAmount(i.amount)}</td>
        <td>${i.due_date}</td>
        <td><span class="badge ${statusBadge(i.status)}">${i.status}</span></td>
        <td style="display:flex;gap:6px">
          <button class="btn btn-secondary btn-sm" title="Edit" onclick="finEditInvoice(${i.id})"><i class="fas fa-pen"></i></button>
          <button class="btn btn-secondary btn-sm" title="Delete" style="color:var(--danger)" onclick="finDeleteInvoice(${i.id},'${i.invoice_no}')"><i class="fas fa-trash"></i></button>
        </td>
      </tr>`).join('');
  }

  // ── Load invoices ──
  let cachedInvoices = [];

  async function loadInvoices() {
    cachedInvoices = lsGetInvoices();
    updateStats(cachedInvoices);
    renderTable(cachedInvoices);

    const result = await apiRequest('GET', '/invoices');
    if (result && result.success) {
      cachedInvoices = result.data;
      updateStats(cachedInvoices);
      renderTable(cachedInvoices);
    }
  }

  loadInvoices();
  document.getElementById('inv-filter')?.addEventListener('change', () => renderTable(cachedInvoices));
  document.getElementById('fin-profit-card')?.addEventListener('click', showProfitBreakdown);

  // ── New Invoice Modal ──
  function openInvoiceModal() {
    showModal({
      title: '<i class="fas fa-file-invoice-dollar" style="color:var(--warning);margin-right:4px"></i> Create New Invoice',
      submitLabel: 'Create Invoice',
      fields: [
        { name:'client',   label:'Client Name',   required:true,  placeholder:'e.g. Wipro Ltd' },
        { name:'amount',   label:'Amount (₹)',     required:true,  type:'number', placeholder:'e.g. 500000' },
        { name:'due_date', label:'Due Date',       required:true,  placeholder:'e.g. Jun 30, 2026' },
        { name:'status',   label:'Invoice Status', type:'select',
          options:[
            {value:'Pending', label:'⏳ Pending'},
            {value:'Sent',    label:'📤 Sent'},
            {value:'Paid',    label:'✅ Paid'},
            {value:'Overdue', label:'🔴 Overdue'}
          ],
          default:'Pending'
        }
      ],
      async onSubmit(data, close) {
        // Save locally first for instant feedback
        const newInv = {
          id: lsNextId(),
          invoice_no: lsNextInvoiceNo(),
          client:   data.client,
          amount:   parseFloat(data.amount),
          due_date: data.due_date,
          status:   data.status || 'Pending'
        };
        const list = lsGetInvoices();
        list.unshift(newInv);
        lsSaveInvoices(list);
        cachedInvoices = list;
        showToast(`✅ Invoice ${newInv.invoice_no} created!`, 'success');
        close();
        updateStats(cachedInvoices);
        renderTable(cachedInvoices);

        // Try server in background (non-blocking)
        apiRequest('POST', '/invoices', data).then(result => {
          if (result && result.success) {
            // Update with server-assigned data
            const idx = cachedInvoices.findIndex(i => i.id === newInv.id);
            if (idx > -1) cachedInvoices[idx] = result.data;
            renderTable(cachedInvoices);
          }
        });
      }
    });
  }

  document.getElementById('inv-add-btn')?.addEventListener('click',  openInvoiceModal);
  document.getElementById('inv-add-btn2')?.addEventListener('click', openInvoiceModal);

  // ── Edit Invoice ──
  window.finEditInvoice = function(id) {
    const inv = cachedInvoices.find(i => i.id === id);
    if (!inv) { showToast('Invoice not found', 'error'); return; }
    showModal({
      title: `<i class="fas fa-pen" style="color:var(--warning);margin-right:4px"></i> Edit ${inv.invoice_no}`,
      submitLabel: 'Save Changes',
      fields: [
        { name:'client',   label:'Client Name',   required:true,  default:inv.client },
        { name:'amount',   label:'Amount (₹)',     required:true,  type:'number', default:inv.amount },
        { name:'due_date', label:'Due Date',       required:true,  default:inv.due_date },
        { name:'status',   label:'Invoice Status', type:'select',
          options:[
            {value:'Pending', label:'⏳ Pending'},
            {value:'Sent',    label:'📤 Sent'},
            {value:'Paid',    label:'✅ Paid'},
            {value:'Overdue', label:'🔴 Overdue'}
          ],
          default:inv.status
        }
      ],
      async onSubmit(data, close) {
        // Save locally first for instant feedback
        const list = lsGetInvoices();
        const idx  = list.findIndex(i => i.id === id);
        if (idx > -1) {
          list[idx] = { ...list[idx], ...data, amount: parseFloat(data.amount) };
          lsSaveInvoices(list);
          cachedInvoices = list;
        }
        showToast(`✅ Invoice updated!`, 'success');
        
        // Add to Recent Transactions if it was just marked as Paid
        if (inv.status !== 'Paid' && data.status === 'Paid') {
          const txnList = document.getElementById('fin-recent-txn');
          if (txnList) {
            const item = document.createElement('div');
            item.className = 'list-item';
            item.innerHTML = `<div class="list-icon" style="background:rgba(34,197,94,0.12);color:var(--success)"><i class="fas fa-arrow-down"></i></div>
                              <div class="list-content">
                                <div class="list-title">Payment from ${data.client}</div>
                                <div class="list-subtitle">${inv.invoice_no} · ₹${Number(data.amount).toLocaleString('en-IN')}</div>
                              </div>
                              <span class="badge badge-success">Received</span>`;
            txnList.insertBefore(item, txnList.firstChild);
            if (txnList.children.length > 3) txnList.removeChild(txnList.lastChild);
          }
        }

        close();
        renderTable(cachedInvoices);
        updateStats(cachedInvoices);

        // Try server in background (non-blocking)
        apiRequest('PUT', `/invoices/${id}`, data).then(result => {
          if (result && result.success) {
            const si = cachedInvoices.findIndex(i => i.id === id);
            if (si > -1) cachedInvoices[si] = result.data;
            renderTable(cachedInvoices);
          }
        });
      }
    });
  };

  // ── Delete Invoice ──
  window.finDeleteInvoice = function(id, invoiceNo) {
    showConfirm(`Do you want to delete invoice <strong>${invoiceNo}</strong>?`, async () => {
      // Save locally first for instant feedback
      const list = lsGetInvoices().filter(i => i.id !== id);
      lsSaveInvoices(list);
      cachedInvoices = list;
      showToast(`Invoice ${invoiceNo} deleted.`, 'success');
      renderTable(cachedInvoices);
      updateStats(cachedInvoices);

      // Try server in background (non-blocking)
      apiRequest('DELETE', `/invoices/${id}`);
    });
  };
  // ── Record Expense ──
  document.getElementById('exp-add-btn')?.addEventListener('click', () => {
    showModal({
      title: '<i class="fas fa-receipt" style="color:var(--danger);margin-right:4px"></i> Record Expense',
      submitLabel: 'Save Expense',
      fields: [
        { name:'vendor',   label:'Vendor / Payee', required:true, placeholder:'e.g. Amazon Web Services' },
        { name:'category', label:'Category',       type:'select', options:['Software & IT','Office Supplies','Travel','Marketing','Utilities','Legal','Payroll'], default:'Software & IT' },
        { name:'amount',   label:'Amount (₹)',     required:true, type:'number', placeholder:'e.g. 15000' },
        { name:'date',     label:'Date',           required:true, placeholder:'e.g. May 28, 2026' }
      ],
      onSubmit(data, close) {
        // Add to recent transactions UI
        const list = document.getElementById('fin-recent-txn');
        if (list) {
          const item = document.createElement('div');
          item.className = 'list-item';
          item.innerHTML = `<div class="list-icon" style="background:rgba(239,68,68,0.12);color:var(--danger)"><i class="fas fa-arrow-up"></i></div>
                            <div class="list-content">
                              <div class="list-title">Payment to ${data.vendor}</div>
                              <div class="list-subtitle">${data.category} · ₹${Number(data.amount).toLocaleString('en-IN')}</div>
                            </div>
                            <span class="badge badge-danger">Paid</span>`;
          list.insertBefore(item, list.firstChild);
          // Remove 4th item if it exists to keep it recent
          if (list.children.length > 3) list.removeChild(list.lastChild);
        }
        showToast(`✅ Expense recorded for ${data.vendor}!`, 'success');
        lsAddExpense(data);
        updateStats(cachedInvoices);
        close();
      }
    });
  });
  // ── Tax Calculator ──
  document.getElementById('tax-calc-btn')?.addEventListener('click', () => {
    showModal({
      title: '<i class="fas fa-calculator" style="color:var(--info);margin-right:4px"></i> Tax Calculator',
      submitLabel: 'Record Tax Payment',
      fields: [
        { name:'tax_type', label:'Tax Type',       type:'select', options:['GST / VAT','Income Tax','Corporate Tax','TDS (Withholding)','Property Tax'], default:'GST / VAT' },
        { name:'period',   label:'Tax Period',     required:true, placeholder:'e.g. Q1 2026' },
        { name:'amount',   label:'Tax Amount (₹)', required:true, type:'number', placeholder:'e.g. 50000' }
      ],
      onSubmit(data, close) {
        const list = document.getElementById('fin-recent-txn');
        if (list) {
          const item = document.createElement('div');
          item.className = 'list-item';
          item.innerHTML = `<div class="list-icon" style="background:rgba(239,68,68,0.12);color:var(--danger)"><i class="fas fa-landmark"></i></div>
                            <div class="list-content">
                              <div class="list-title">${data.tax_type} Payment</div>
                              <div class="list-subtitle">Period: ${data.period} · ₹${Number(data.amount).toLocaleString('en-IN')}</div>
                            </div>
                            <span class="badge badge-danger">Paid</span>`;
          list.insertBefore(item, list.firstChild);
          if (list.children.length > 3) list.removeChild(list.lastChild);
        }
        showToast(`✅ ${data.tax_type} payment of ₹${Number(data.amount).toLocaleString('en-IN')} recorded!`, 'success');
        lsAddExpense({ amount: data.amount, vendor: data.tax_type + ' Payment', category: 'Taxes', date: data.period });
        updateStats(cachedInvoices);
        close();
      }
    });
  });
};

/* ============================================================
   Inventory & Supply Chain Page — Live Database Integration
   ============================================================ */
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
    <div class="module-hero">
      <h2><i class="fas fa-warehouse" style="color:var(--cyan)"></i> Inventory & Supply Chain</h2>
      <p>Warehouse management, barcode/RFID tracking, vendor management, automated reorder, and IoT sensor integration.</p>
      <div class="page-actions" style="margin-top:16px">
        <button class="btn btn-primary btn-sm" id="prod-add-btn"><i class="fas fa-plus"></i> Add Product</button>
        <button class="btn btn-secondary btn-sm" id="inv-po-btn"><i class="fas fa-truck"></i> New PO</button>
        <button class="btn btn-secondary btn-sm" id="inv-scan-btn"><i class="fas fa-barcode"></i> Scan</button>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon cyan"><i class="fas fa-boxes-stacked"></i></div></div><div class="stat-value" id="inv-total">—</div><div class="stat-label">Total Products</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-check-circle"></i></div></div><div class="stat-value" id="inv-instock">—</div><div class="stat-label">In Stock</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon red"><i class="fas fa-exclamation-triangle"></i></div></div><div class="stat-value" id="inv-low">—</div><div class="stat-label">Low Stock Alerts</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon purple"><i class="fas fa-truck-fast"></i></div></div><div class="stat-value" id="inv-pending-po">—</div><div class="stat-label">Pending Orders</div></div>
    </div>
    <div class="grid-2">
      <div class="card"><div class="card-header"><span class="card-title">Stock by Category</span></div><div class="chart-container"><canvas data-chart="inventory"></canvas></div></div>
      <div class="card">
        <div class="card-header"><span class="card-title">Low Stock Alerts</span><span class="badge badge-danger" id="low-stock-badge">loading...</span></div>
        <div class="activity-list" id="low-stock-list"><div style="text-align:center;padding:20px;color:var(--text-muted)"><i class="fas fa-spinner fa-spin"></i></div></div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <span class="card-title">Product Inventory</span>
        <div style="display:flex;gap:8px;align-items:center">
          <input type="text" class="form-control" id="prod-search" placeholder="Search products..." style="width:200px;padding:6px 12px;font-size:13px">
          <select class="form-control" id="prod-cat-filter" style="width:150px;padding:6px 10px;font-size:13px">
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Supplies">Supplies</option>
            <option value="Accessories">Accessories</option>
            <option value="Software">Software</option>
            <option value="Hardware">Hardware</option>
          </select>
          <button class="btn btn-primary btn-sm" id="prod-add-btn2"><i class="fas fa-plus"></i> Add</button>
        </div>
      </div>
      <div class="table-container">
        <table>
          <thead><tr><th>SKU</th><th>Product</th><th>Category</th><th>Stock</th><th>Reorder Lvl</th><th>Warehouse</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="prod-tbody"><tr><td colspan="8" style="text-align:center;padding:40px;color:var(--text-muted)"><i class="fas fa-spinner fa-spin"></i> Loading products...</td></tr></tbody>
        </table>
      </div>
    </div>`;

  // ── LocalStorage Fallback ──
  const LS_PROD_KEY = 'amdox_products';
  const SEED_PRODS = [
    { id:1, sku:'SKU-0010', name:'MacBook Pro 16"', category:'Electronics', stock:12, reorder_level:10, warehouse:'Warehouse A' },
    { id:2, sku:'SKU-0021', name:'Ergonomic Chair', category:'Furniture', stock:45, reorder_level:20, warehouse:'Warehouse B' },
    { id:3, sku:'SKU-0033', name:'Printer Ink Black', category:'Supplies', stock:5, reorder_level:15, warehouse:'Warehouse A' },
    { id:4, sku:'SKU-0045', name:'Logitech MX Master 3', category:'Accessories', stock:30, reorder_level:15, warehouse:'Warehouse C' }
  ];

  function lsGetProducts() {
    try { return JSON.parse(localStorage.getItem(LS_PROD_KEY)) || SEED_PRODS; } catch { return SEED_PRODS; }
  }
  function lsSaveProducts(list) {
    try { localStorage.setItem(LS_PROD_KEY, JSON.stringify(list)); } catch {}
  }
  function lsNextProdId() {
    const list = lsGetProducts();
    return list.length ? Math.max(...list.map(i=>i.id))+1 : 1;
  }

  // Pending PO tracker
  const LS_PO_KEY = 'amdox_pending_po';
  function lsGetPOs() {
    try { return JSON.parse(localStorage.getItem(LS_PO_KEY)) || 15; } catch { return 15; } // Default 15
  }
  function lsAddPO() {
    try { localStorage.setItem(LS_PO_KEY, JSON.stringify(lsGetPOs() + 1)); } catch {}
  }

  async function apiRequest(method, path, body) {
    try {
      const opts = { method, headers:{'Content-Type':'application/json'} };
      if (body) opts.body = JSON.stringify(body);
      const res = await Promise.race([
        fetch(`${API_BASE}${path}`, opts),
        new Promise((_,rej) => setTimeout(() => rej(new Error('timeout')), 2000))
      ]);
      return await res.json();
    } catch { return null; }
  }

  let allProducts = [];

  async function loadProducts() {
    allProducts = lsGetProducts();
    updateStats(allProducts);
    renderProductTable(allProducts);
    renderLowStock(allProducts);

    const result = await apiRequest('GET', '/products');
    if (result && result.success) {
      allProducts = result.data;
      updateStats(allProducts);
      renderProductTable(allProducts);
      renderLowStock(allProducts);
    }
  }

  function updateStats(products) {
    const totalEl   = document.getElementById('inv-total');
    const instockEl = document.getElementById('inv-instock');
    const lowEl     = document.getElementById('inv-low');
    const poEl      = document.getElementById('inv-pending-po');
    if (totalEl)   totalEl.textContent   = products.length;
    if (instockEl) instockEl.textContent = products.filter(p => p.stock > p.reorder_level).length;
    if (lowEl)     lowEl.textContent     = products.filter(p => p.stock <= p.reorder_level).length;
    if (poEl)      poEl.textContent      = lsGetPOs();
  }

  function renderLowStock(products) {
    const lowStock = products.filter(p => p.stock <= p.reorder_level).sort((a,b) => a.stock - b.stock);
    const badge    = document.getElementById('low-stock-badge');
    const list     = document.getElementById('low-stock-list');
    if (badge) badge.textContent = `${lowStock.length} alerts`;
    if (!list) return;
    if (!lowStock.length) { list.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-muted)">No low stock items 🎉</div>`; return; }
    const critical = p => p.stock <= Math.floor(p.reorder_level * 0.3);
    list.innerHTML = lowStock.slice(0,5).map(p => `
      <div class="list-item">
        <div class="list-icon" style="background:rgba(${critical(p)?'239,68,68':'245,158,11'},0.12);color:var(--${critical(p)?'danger':'warning'})">
          <i class="fas fa-${critical(p)?'exclamation':'triangle-exclamation'}"></i>
        </div>
        <div class="list-content">
          <div class="list-title">${p.name}</div>
          <div class="list-subtitle">Stock: ${p.stock} / Reorder: ${p.reorder_level}</div>
        </div>
        <button class="btn btn-${critical(p)?'primary':'secondary'} btn-sm">Reorder</button>
      </div>`).join('');
  }

  function renderProductTable(products) {
    const query  = document.getElementById('prod-search')?.value.toLowerCase() || '';
    const cat    = document.getElementById('prod-cat-filter')?.value || '';
    let filtered = products;
    if (query) filtered = filtered.filter(p => p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query));
    if (cat)   filtered = filtered.filter(p => p.category === cat);
    const tbody = document.getElementById('prod-tbody');
    if (!tbody) return;
    if (!filtered.length) { tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--text-muted)">No products found.</td></tr>`; return; }
    const getStatus = p => p.stock === 0 ? ['badge-danger','Out of Stock'] : p.stock <= p.reorder_level ? ['badge-warning','Low Stock'] : ['badge-success','In Stock'];
    tbody.innerHTML = filtered.map(p => {
      const [cls, label] = getStatus(p);
      return `<tr>
        <td style="font-family:var(--font-mono);font-size:12px;color:var(--accent-light)">${p.sku}</td>
        <td>${p.name}</td>
        <td>${p.category}</td>
        <td><strong>${p.stock}</strong></td>
        <td>${p.reorder_level}</td>
        <td>${p.warehouse}</td>
        <td><span class="badge ${cls}">${label}</span></td>
        <td style="display:flex;gap:6px">
          <button class="btn btn-secondary btn-sm" onclick="invEditProduct(${p.id})"><i class="fas fa-pen"></i></button>
          <button class="btn btn-secondary btn-sm" style="color:var(--danger)" onclick="invDeleteProduct(${p.id},'${p.name.replace(/'/g,"\\'")}')"><i class="fas fa-trash"></i></button>
        </td>
      </tr>`;
    }).join('');
  }

  loadProducts();

  document.getElementById('prod-search')?.addEventListener('input',    () => renderProductTable(allProducts));
  document.getElementById('prod-cat-filter')?.addEventListener('change', () => renderProductTable(allProducts));

  function openAddProductModal() {
    showModal({
      title: '<i class="fas fa-boxes-stacked" style="color:var(--cyan)"></i> Add New Product',
      submitLabel: 'Add Product',
      fields: [
        { name:'sku',           label:'SKU',           required:true, placeholder:'e.g. SKU-0300' },
        { name:'name',          label:'Product Name',  required:true, placeholder:'e.g. iPhone 15 Pro' },
        { name:'category',      label:'Category',      required:true, type:'select', options:['Electronics','Furniture','Supplies','Accessories','Software','Hardware','Services'], default:'Electronics' },
        { name:'stock',         label:'Stock Qty',     required:true, type:'number', placeholder:'e.g. 50', default:'0' },
        { name:'reorder_level', label:'Reorder Level', type:'number', placeholder:'e.g. 10', default:'10' },
        { name:'warehouse',     label:'Warehouse',     type:'select', options:['Warehouse A','Warehouse B','Warehouse C'], default:'Warehouse A' }
      ],
      async onSubmit(data, close) {
        data.stock = parseInt(data.stock) || 0;
        data.reorder_level = parseInt(data.reorder_level) || 0;
        const result = await apiRequest('POST', '/products', data);
        if (result && result.success) {
          showToast(`✅ Product "${result.data.name}" added!`, 'success');
        } else {
          const list = lsGetProducts();
          data.id = lsNextProdId();
          list.push(data);
          lsSaveProducts(list);
          showToast(`✅ Product "${data.name}" added locally!`, 'success');
        }
        close();
        loadProducts();
      }
    });
  }

  document.getElementById('prod-add-btn')?.addEventListener('click',  openAddProductModal);
  document.getElementById('prod-add-btn2')?.addEventListener('click', openAddProductModal);

  window.invEditProduct = function(id) {
    const prod = allProducts.find(p => p.id === id);
    if (!prod) return;
    showModal({
      title: '<i class="fas fa-pen" style="color:var(--cyan)"></i> Edit Product',
      submitLabel: 'Save Changes',
      fields: [
        { name:'name',          label:'Product Name',  required:true, default:prod.name },
        { name:'category',      label:'Category',      required:true, type:'select', options:['Electronics','Furniture','Supplies','Accessories','Software','Hardware','Services'], default:prod.category },
        { name:'stock',         label:'Stock Qty',     required:true, type:'number', default:prod.stock },
        { name:'reorder_level', label:'Reorder Level', type:'number', default:prod.reorder_level },
        { name:'warehouse',     label:'Warehouse',     type:'select', options:['Warehouse A','Warehouse B','Warehouse C'], default:prod.warehouse }
      ],
      async onSubmit(data, close) {
        data.stock = parseInt(data.stock) || 0;
        data.reorder_level = parseInt(data.reorder_level) || 0;
        const result = await apiRequest('PUT', `/products/${id}`, data);
        if (result && result.success) {
          showToast(`✅ Product "${result.data.name}" updated!`, 'success');
        } else {
          const list = lsGetProducts();
          const idx = list.findIndex(p => p.id === id);
          if (idx > -1) {
            list[idx] = { ...list[idx], ...data };
            lsSaveProducts(list);
          }
          showToast(`✅ Product updated locally!`, 'success');
        }
        close();
        loadProducts();
      }
    });
  };

  window.invDeleteProduct = function(id, name) {
    showConfirm(`Do you want to delete product <strong>${name}</strong> from inventory?`, async () => {
      const result = await apiRequest('DELETE', `/products/${id}`);
      if (result && result.success) {
        showToast(`Product "${name}" removed.`, 'success');
      } else {
        const list = lsGetProducts().filter(p => p.id !== id);
        lsSaveProducts(list);
        showToast(`Product "${name}" removed locally.`, 'success');
      }
      loadProducts();
    });
  };

  // ── New PO Modal ──
  document.getElementById('inv-po-btn')?.addEventListener('click', () => {
    showModal({
      title: '<i class="fas fa-truck" style="color:var(--cyan);margin-right:4px"></i> New Purchase Order',
      submitLabel: 'Create PO',
      fields: [
        { name:'vendor', label:'Vendor Name', required:true, placeholder:'e.g. Foxconn' },
        { name:'item',   label:'Item SKU',    required:true, placeholder:'e.g. SKU-0010' },
        { name:'qty',    label:'Quantity',    required:true, type:'number', placeholder:'e.g. 100' },
        { name:'date',   label:'Expected Delivery', required:true, placeholder:'e.g. Jun 10, 2026' }
      ],
      onSubmit(data, close) {
        showToast(`✅ Purchase Order for ${data.qty} units from ${data.vendor} created!`, 'success');
        lsAddPO();
        updateStats(allProducts);
        close();
      }
    });
  });

  // ── Scan Barcode Modal ──
  document.getElementById('inv-scan-btn')?.addEventListener('click', () => {
    // Audio beep player using Web Audio API
    const playBeep = () => {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
      } catch {}
    };

    // Create overlay
    document.querySelector('#scan-modal-overlay')?.remove();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'scan-modal-overlay';
    overlay.innerHTML = `
      <div class="modal-box" style="max-width: 780px;">
        <div class="modal-header">
          <h3 class="modal-title"><i class="fas fa-barcode" style="color:var(--info);margin-right:4px"></i> Barcode Scan Terminal</h3>
          <button class="modal-close" id="scan-modal-close-btn" aria-label="Close"><i class="fas fa-xmark"></i></button>
        </div>
        <div class="modal-body" style="padding: 24px; display: grid; grid-template-columns: 1.1fr 1.3fr; gap: 24px; color: var(--text-primary);">
          
          <!-- Left Panel: Manual Controls -->
          <div style="display:flex; flex-direction:column; gap:16px;">
            <h4 style="font-size: 14px; font-weight: 600; color: var(--text-primary); border-bottom: 1px solid var(--border-color); padding-bottom: 8px; margin: 0;">
              <i class="fas fa-sliders" style="margin-right:4px"></i> Scanner Controls
            </h4>
            
            <div class="form-group" style="display:flex; flex-direction:column; gap:6px;">
              <label class="form-label" style="font-size:12px; font-weight:600; color:var(--text-secondary);">Scan Action</label>
              <select class="form-control" id="scan-terminal-action" style="padding:8px 12px; font-size:13px;">
                <option value="Check In (Receive)">⏳ Check In (Receive Stock)</option>
                <option value="Check Out (Ship)">📤 Check Out (Ship / Sell)</option>
                <option value="Audit Inventory">🔍 Audit Inventory (Correct Stock)</option>
              </select>
            </div>

            <div class="form-group" style="display:flex; flex-direction:column; gap:6px;">
              <label class="form-label" style="font-size:12px; font-weight:600; color:var(--text-secondary);">Quantity to Process</label>
              <input class="form-control" type="number" id="scan-terminal-qty" value="1" min="1" style="padding:8px 12px; font-size:13px;" />
            </div>

            <div class="form-group" style="display:flex; flex-direction:column; gap:6px;">
              <label class="form-label" style="font-size:12px; font-weight:600; color:var(--text-secondary);">Barcode / SKU Code</label>
              <input class="form-control" type="text" id="scan-terminal-sku" placeholder="Autofills via shelf, or type manually..." style="padding:8px 12px; font-size:13px; font-family:monospace;" />
            </div>

            <button type="button" class="btn btn-primary" id="scan-terminal-submit" style="margin-top: 8px; width: 100%; display:flex; justify-content:center; align-items:center; gap:8px;">
              <i class="fas fa-bolt" id="scan-btn-icon"></i>
              <span id="scan-btn-label">Process Transaction</span>
            </button>

            <!-- In-modal transaction result panel -->
            <div id="scan-tx-result" style="display:none; margin-top:10px; padding:12px 14px; border-radius:var(--radius-md); font-size:13px; font-weight:500; line-height:1.5; animation: toast-in 0.2s ease;"></div>
          </div>

          <!-- Right Panel: Virtual Warehouse Shelf -->
          <div style="display:flex; flex-direction:column; gap:12px;">
            <h4 style="font-size: 14px; font-weight: 600; color: var(--text-primary); border-bottom: 1px solid var(--border-color); padding-bottom: 8px; margin: 0; display:flex; justify-content:space-between; align-items:center;">
              <span><i class="fas fa-warehouse" style="margin-right:4px"></i> Warehouse Shelf</span>
              <span style="font-size:11px; font-weight:normal; color:var(--text-muted)">Click barcode card to scan</span>
            </h4>

            <input type="text" class="form-control" id="scan-shelf-search" placeholder="🔍 Filter products on shelf..." style="padding:6px 12px; font-size:12px;" />

            <div id="scan-shelf-list" style="max-height: 255px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; padding-right: 4px;">
            </div>
          </div>

        </div>
        <div class="modal-footer" style="padding: 16px 24px; display: flex; justify-content: flex-end; border-top:1px solid var(--border-color)">
          <button type="button" class="btn btn-secondary btn-sm" id="scan-modal-close-btn2">Close Terminal</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);

    const renderShelf = (q = '') => {
      const listDiv = overlay.querySelector('#scan-shelf-list');
      if (!listDiv) return;

      const filtered = q
        ? allProducts.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
        : allProducts;

      if (!filtered.length) {
        listDiv.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:12px;">No matching products on shelf.</div>`;
        return;
      }

      listDiv.innerHTML = filtered.map(p => `
        <div class="shelf-item" style="border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 8px 12px; display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.02); transition: all 0.2s; cursor: pointer; position: relative; overflow: hidden;" data-sku="${p.sku}">
          <div class="laser-line" style="position: absolute; left: 0; right: 0; height: 2px; background: rgba(239, 68, 68, 0.95); box-shadow: 0 0 10px rgba(239, 68, 68, 0.95); top: 50%; transform: translateY(-50%) scaleX(0); transition: transform 0.12s ease-out; pointer-events: none; z-index: 10;"></div>
          <div style="flex: 1; padding-right:12px;">
            <div style="font-weight: 600; font-size: 13px; color: var(--text-primary);">${p.name}</div>
            <div style="font-size: 11px; color: var(--text-muted); display:flex; gap:12px; margin-top:4px;">
              <span>SKU: <strong style="color:var(--accent-light); font-family:monospace">${p.sku}</strong></span>
              <span>Stock: <strong style="color:var(--text-primary)">${p.stock}</strong></span>
            </div>
          </div>
          <!-- Barcode CSS Card -->
          <div style="display:flex; flex-direction:column; align-items:center; gap:2px; background:#fff; padding:4px 6px; border-radius:3px; width:65px; flex-shrink:0; opacity:0.85;">
            <div style="display:flex; height:18px; width:100%; justify-content:space-between;">
              <div style="width:2px; background:#000; height:100%"></div>
              <div style="width:1px; background:#000; height:100%"></div>
              <div style="width:3px; background:#000; height:100%"></div>
              <div style="width:1px; background:#000; height:100%"></div>
              <div style="width:2px; background:#000; height:100%"></div>
              <div style="width:3px; background:#000; height:100%"></div>
              <div style="width:1px; background:#000; height:100%"></div>
              <div style="width:2px; background:#000; height:100%"></div>
            </div>
            <span style="font-size:7px; color:#000; font-family:monospace; scale: 0.9;">${p.sku}</span>
          </div>
        </div>
      `).join('');

      listDiv.querySelectorAll('.shelf-item').forEach(el => {
        el.addEventListener('click', () => {
          const sku = el.dataset.sku;
          const laser = el.querySelector('.laser-line');

          // Animate laser scan
          playBeep();
          if (laser) {
            laser.style.transform = 'translateY(-50%) scaleX(1)';
            setTimeout(() => {
              laser.style.transform = 'translateY(-50%) scaleX(0)';
            }, 120);
          }

          // Highlight selected shelf item
          listDiv.querySelectorAll('.shelf-item').forEach(s => {
            s.style.borderColor = '';
            s.style.background = 'rgba(255,255,255,0.02)';
          });
          el.style.borderColor = 'var(--accent)';
          el.style.background = 'rgba(99,102,241,0.08)';

          // Fill SKU field — user must click Process Transaction to confirm
          overlay.querySelector('#scan-terminal-sku').value = sku;
          overlay.querySelector('#scan-terminal-sku').focus();

          // Clear any previous result panel
          const resultEl = overlay.querySelector('#scan-tx-result');
          if (resultEl) resultEl.style.display = 'none';
        });
      });
    };

    const showTxResult = (ok, html) => {
      const el = overlay.querySelector('#scan-tx-result');
      if (!el) return;
      el.style.display = 'block';
      el.style.background = ok ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)';
      el.style.border    = ok ? '1px solid rgba(34,197,94,0.35)' : '1px solid rgba(239,68,68,0.35)';
      el.style.color     = ok ? 'var(--success)' : 'var(--danger)';
      el.innerHTML = html;
    };

    const processScanTx = (sku) => {
      const action  = overlay.querySelector('#scan-terminal-action').value;
      const qty     = parseInt(overlay.querySelector('#scan-terminal-qty').value) || 0;
      const btnIcon = overlay.querySelector('#scan-btn-icon');
      const btnLbl  = overlay.querySelector('#scan-btn-label');
      const btn     = overlay.querySelector('#scan-terminal-submit');

      // Show loading state on button
      if (btn) btn.disabled = true;
      if (btnIcon) { btnIcon.className = 'fas fa-spinner fa-spin'; }
      if (btnLbl)  { btnLbl.textContent = 'Processing...'; }

      // Hide old result
      const resultEl = overlay.querySelector('#scan-tx-result');
      if (resultEl) resultEl.style.display = 'none';

      // Small delay so loading state is visible
      setTimeout(() => {
        try {
          if (qty <= 0) {
            showToast('❌ Quantity must be greater than 0!', 'error');
            showTxResult(false, '<i class="fas fa-times-circle"></i> &nbsp;Quantity must be greater than 0.');
            return;
          }

          const list = lsGetProducts();
          const prod = list.find(p => p.sku.toUpperCase() === sku.toUpperCase());

          if (!prod) {
            showToast(`❌ SKU "${sku}" not found in inventory!`, 'error');
            showTxResult(false, `<i class="fas fa-times-circle"></i> &nbsp;SKU <strong>${sku}</strong> not found in inventory.`);
            return;
          }

          let msg = '';
          let txLabel = '';

          if (action === 'Check In (Receive)') {
            prod.stock += qty;
            txLabel = 'Checked In';
            msg = `<i class="fas fa-check-circle"></i> &nbsp;<strong>${txLabel}:</strong> ${qty} unit(s) of <strong>${prod.name}</strong><br>
                   <span style="font-size:11px;opacity:0.8;">SKU: ${prod.sku} &nbsp;·&nbsp; New Stock: <strong>${prod.stock}</strong></span>`;
            showToast(`✅ ${txLabel} ${qty}× "${prod.name}" — Stock: ${prod.stock}`, 'success');
          } else if (action === 'Check Out (Ship)') {
            if (prod.stock < qty) {
              const errMsg = `Insufficient stock for "${prod.name}" — only ${prod.stock} available.`;
              showToast(`❌ ${errMsg}`, 'error');
              showTxResult(false, `<i class="fas fa-times-circle"></i> &nbsp;${errMsg}`);
              return;
            }
            prod.stock -= qty;
            txLabel = 'Checked Out';
            msg = `<i class="fas fa-check-circle"></i> &nbsp;<strong>${txLabel}:</strong> ${qty} unit(s) of <strong>${prod.name}</strong><br>
                   <span style="font-size:11px;opacity:0.8;">SKU: ${prod.sku} &nbsp;·&nbsp; Remaining Stock: <strong>${prod.stock}</strong></span>`;
            showToast(`✅ ${txLabel} ${qty}× "${prod.name}" — Remaining: ${prod.stock}`, 'success');
          } else if (action === 'Audit Inventory') {
            prod.stock = qty;
            txLabel = 'Audited';
            msg = `<i class="fas fa-check-circle"></i> &nbsp;<strong>${txLabel}:</strong> <strong>${prod.name}</strong> stock set to <strong>${qty}</strong><br>
                   <span style="font-size:11px;opacity:0.8;">SKU: ${prod.sku}</span>`;
            showToast(`✅ Audited "${prod.name}" — Stock set to ${qty}`, 'success');
          }

          lsSaveProducts(list);
          allProducts = list;

          showTxResult(true, msg);
          renderShelf(overlay.querySelector('#scan-shelf-search').value.toLowerCase().trim());
          updateStats(allProducts);
          renderProductTable(allProducts);
          renderLowStock(allProducts);

          setTimeout(() => {
            if (typeof initChartsOnPage === 'function') initChartsOnPage('inventory');
          }, 100);

        } finally {
          // Restore button state
          if (btn) btn.disabled = false;
          if (btnIcon) { btnIcon.className = 'fas fa-bolt'; }
          if (btnLbl)  { btnLbl.textContent = 'Process Transaction'; }
        }
      }, 300);
    };

    requestAnimationFrame(() => overlay.classList.add('open'));
    
    const closeModal = () => {
      overlay.classList.remove('open');
      setTimeout(() => overlay.remove(), 200);
    };

    overlay.querySelector('#scan-modal-close-btn').addEventListener('click', closeModal);
    overlay.querySelector('#scan-modal-close-btn2').addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

    const openCameraScanner = () => {
      const scannerOverlay = document.createElement('div');
      scannerOverlay.className = 'modal-overlay open';
      scannerOverlay.id = 'camera-scanner-overlay';
      scannerOverlay.style.zIndex = '99999';
      scannerOverlay.innerHTML = `
        <div class="modal-box" style="max-width: 540px; text-align: center; overflow: hidden; background: var(--bg-card);">
          <div class="modal-header">
            <h3 class="modal-title"><i class="fas fa-camera" style="color:var(--info);margin-right:8px"></i> Camera Barcode Scanner</h3>
            <button class="modal-close" id="camera-scanner-close-btn" aria-label="Close"><i class="fas fa-xmark"></i></button>
          </div>
          <div class="modal-body" style="padding: 24px;">
            <div id="qr-reader" style="width: 100%; border-radius: var(--radius-lg); overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.3); border: 1px solid var(--border-color); background: #000;"></div>
            <p style="margin-top: 16px; font-size: 13px; color: var(--text-muted);"><i class="fas fa-info-circle"></i> Point your camera at a barcode to scan.</p>
          </div>
        </div>`;
      document.body.appendChild(scannerOverlay);

      const html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", { 
        fps: 10, 
        qrbox: { width: 300, height: 150 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true
      });
      
      const onScanSuccess = (decodedText) => {
        html5QrcodeScanner.clear();
        scannerOverlay.classList.remove('open');
        setTimeout(() => scannerOverlay.remove(), 200);
        
        const skuInput = overlay.querySelector('#scan-terminal-sku');
        if (skuInput) {
            skuInput.value = decodedText;
            skuInput.focus();
        }
        playBeep();
        
        // Immediately process it
        processScanTx(decodedText);
      };
      
      html5QrcodeScanner.render(onScanSuccess, () => {});

      scannerOverlay.querySelector('#camera-scanner-close-btn').addEventListener('click', () => {
        html5QrcodeScanner.clear();
        scannerOverlay.classList.remove('open');
        setTimeout(() => scannerOverlay.remove(), 200);
      });
      
      scannerOverlay.addEventListener('click', e => { 
        if (e.target === scannerOverlay) {
          html5QrcodeScanner.clear();
          scannerOverlay.classList.remove('open');
          setTimeout(() => scannerOverlay.remove(), 200);
        }
      });
    };

    overlay.querySelector('#scan-terminal-submit').addEventListener('click', () => {
      const sku = overlay.querySelector('#scan-terminal-sku').value.trim();
      if (!sku) {
        openCameraScanner();
        return;
      }
      playBeep();
      processScanTx(sku);
    });

    overlay.querySelector('#scan-shelf-search').addEventListener('input', (e) => {
      renderShelf(e.target.value.toLowerCase().trim());
    });

    renderShelf();
  });
};
