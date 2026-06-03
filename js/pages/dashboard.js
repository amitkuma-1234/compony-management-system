/* ============================================================
   Dashboard Page — Dynamic Role-Based Layout Manager
   ============================================================ */

pages.dashboard = function(container) {
  // 1. Fetch current logged in user from localStorage
  const userJson = localStorage.getItem('amdox_auth_user');
  let user = { name: 'Amit Kumar', role: 'Super Admin', email: 'amit@amdox.com' };
  if (userJson) {
    try {
      user = JSON.parse(userJson);
    } catch (e) {
      console.error("Failed to parse user session:", e);
    }
  }

  // 2. Select and render appropriate dashboard based on role
  if (user.role === 'Super Admin') {
    renderAdminDashboard(container, user);
  } else if (user.role === 'HR' || user.role === 'HR Manager') {
    renderHRDashboard(container, user);
  } else if (user.role === 'Manager' || user.role === 'Department Manager') {
    renderManagerDashboard(container, user);
  } else {
    // Treat all other roles (Engineering, Sales, etc.) as Employee Portal
    renderEmployeeDashboard(container, user);
  }
};

/* ═══════════════════════════════════════════════════════════
   ADMIN DASHBOARD (amit@amdox.com)
   ═══════════════════════════════════════════════════════════ */
function renderAdminDashboard(container, user) {
  container.innerHTML = `
    <div class="page-header animate-fade">
      <div>
        <h2>Welcome back, ${escHtml(user.name)} 👋</h2>
        <p>Here's what's happening across your organization today.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary btn-sm"><i class="fas fa-download"></i> Export</button>
        <button class="btn btn-primary btn-sm"><i class="fas fa-plus"></i> Quick Action</button>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card animate-slide-up">
        <div class="stat-card-header">
          <div class="stat-icon blue"><i class="fas fa-indian-rupee-sign"></i></div>
          <span class="stat-trend up"><i class="fas fa-arrow-up"></i> 18.2%</span>
        </div>
        <div class="stat-value">₹24.8L</div>
        <div class="stat-label">Total Revenue (May)</div>
        <div class="progress-bar" style="margin-top:10px"><div class="progress-fill blue" style="width:78%"></div></div>
      </div>
      <div class="stat-card animate-slide-up" style="animation-delay:0.1s">
        <div class="stat-card-header">
          <div class="stat-icon green"><i class="fas fa-users"></i></div>
          <span class="stat-trend up"><i class="fas fa-arrow-up"></i> 5</span>
        </div>
        <div class="stat-value">162</div>
        <div class="stat-label">Active Employees</div>
        <div class="progress-bar" style="margin-top:10px"><div class="progress-fill green" style="width:92%"></div></div>
      </div>
      <div class="stat-card animate-slide-up" style="animation-delay:0.2s">
        <div class="stat-card-header">
          <div class="stat-icon purple"><i class="fas fa-clipboard-check"></i></div>
          <span class="stat-trend up"><i class="fas fa-arrow-up"></i> 12%</span>
        </div>
        <div class="stat-value">47</div>
        <div class="stat-label">Active Projects</div>
        <div class="progress-bar" style="margin-top:10px"><div class="progress-fill purple" style="width:65%"></div></div>
      </div>
      <div class="stat-card animate-slide-up" style="animation-delay:0.3s">
        <div class="stat-card-header">
          <div class="stat-icon pink"><i class="fas fa-handshake"></i></div>
          <span class="stat-trend up"><i class="fas fa-arrow-up"></i> 8.5%</span>
        </div>
        <div class="stat-value">284</div>
        <div class="stat-label">CRM Leads</div>
        <div class="progress-bar" style="margin-top:10px"><div class="progress-fill yellow" style="width:54%"></div></div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header">
          <div><span class="card-title">Revenue vs Expenses</span><br><span class="card-subtitle">Last 12 months overview</span></div>
          <button class="btn btn-secondary btn-sm"><i class="fas fa-ellipsis"></i></button>
        </div>
        <div class="chart-container"><canvas data-chart="revenue"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header">
          <div><span class="card-title">Module Usage</span><br><span class="card-subtitle">Resource distribution</span></div>
          <button class="btn btn-secondary btn-sm"><i class="fas fa-ellipsis"></i></button>
        </div>
        <div class="chart-container"><canvas data-chart="doughnut"></canvas></div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header">
          <span class="card-title">Recent Activity</span>
          <a href="#notifications" class="btn btn-secondary btn-sm">View All</a>
        </div>
        <div class="activity-list">
          <div class="activity-item"><div class="activity-dot green"></div><div><div class="activity-text"><strong>Invoice #INV-2847</strong> approved by Finance team</div><div class="activity-time">2 minutes ago</div></div></div>
          <div class="activity-item"><div class="activity-dot blue"></div><div><div class="activity-text"><strong>Priya Sharma</strong> onboarded to Engineering dept</div><div class="activity-time">1 hour ago</div></div></div>
          <div class="activity-item"><div class="activity-dot yellow"></div><div><div class="activity-text"><strong>Stock Alert:</strong> 5 items below reorder level</div><div class="activity-time">2 hours ago</div></div></div>
          <div class="activity-item"><div class="activity-dot purple"></div><div><div class="activity-text"><strong>AI Forecast:</strong> Q3 revenue predicted at ₹2.4Cr</div><div class="activity-time">3 hours ago</div></div></div>
          <div class="activity-item"><div class="activity-dot red"></div><div><div class="activity-text"><strong>Security:</strong> Failed login attempt blocked from 192.168.1.45</div><div class="activity-time">5 hours ago</div></div></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <span class="card-title">Weekly Task Overview</span>
          <button class="btn btn-secondary btn-sm"><i class="fas fa-calendar"></i> This Week</button>
        </div>
        <div class="chart-container"><canvas data-chart="bar"></canvas></div>
      </div>
    </div>

    <div class="grid-3">
      <div class="card">
        <div class="card-header"><span class="card-title">Pending Approvals</span><span class="badge badge-warning">8 pending</span></div>
        <div class="activity-list">
          <div class="list-item"><div class="list-icon" style="background:rgba(245,158,11,0.12);color:var(--warning)"><i class="fas fa-file-invoice"></i></div><div class="list-content"><div class="list-title">Purchase Order #PO-1245</div><div class="list-subtitle">₹1,85,000 · Vendor: TechSupply Co</div></div></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(99,102,241,0.12);color:var(--accent)"><i class="fas fa-plane-departure"></i></div><div class="list-content"><div class="list-title">Leave Request — Rahul Singh</div><div class="list-subtitle">May 22-24 · Casual Leave</div></div></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(34,197,94,0.12);color:var(--success)"><i class="fas fa-receipt"></i></div><div class="list-content"><div class="list-title">Expense Claim #EXP-892</div><div class="list-subtitle">₹12,500 · Travel expenses</div></div></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Top Performers</span><span class="badge badge-success">This Month</span></div>
        <div class="activity-list">
          <div class="list-item"><div class="user-avatar" style="background:linear-gradient(135deg,#6366f1,#a855f7);width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff">RS</div><div class="list-content"><div class="list-title">Rahul Singh</div><div class="list-subtitle">Engineering · 98% KPI</div></div><span class="badge badge-success">⭐ Top</span></div>
          <div class="list-item"><div class="user-avatar" style="background:linear-gradient(135deg,#ec4899,#f59e0b);width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff">AP</div><div class="list-content"><div class="list-title">Anita Patel</div><div class="list-subtitle">Sales · 96% KPI</div></div><span class="badge badge-info">↗ Rising</span></div>
          <div class="list-item"><div class="user-avatar" style="background:linear-gradient(135deg,#22c55e,#06b6d4);width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff">VK</div><div class="list-content"><div class="list-title">Vikram Kumar</div><div class="list-subtitle">Finance · 94% KPI</div></div><span class="badge badge-purple">★ Star</span></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">System Health</span><span class="badge badge-success"><i class="fas fa-circle" style="font-size:6px"></i> All Systems Go</span></div>
        <div class="activity-list">
          <div class="list-item"><div class="list-icon" style="background:rgba(34,197,94,0.12);color:var(--success)"><i class="fas fa-server"></i></div><div class="list-content"><div class="list-title">API Server</div><div class="list-subtitle">Response: 45ms · Uptime: 99.98%</div></div><span class="badge badge-success">Healthy</span></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(34,197,94,0.12);color:var(--success)"><i class="fas fa-database"></i></div><div class="list-content"><div class="list-title">Database Cluster</div><div class="list-subtitle">Load: 23% · Connections: 142</div></div><span class="badge badge-success">Healthy</span></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(245,158,11,0.12);color:var(--warning)"><i class="fas fa-hard-drive"></i></div><div class="list-content"><div class="list-title">Storage</div><div class="list-subtitle">Used: 78% · 234GB / 300GB</div></div><span class="badge badge-warning">Watch</span></div>
        </div>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════════════════════
   HR MANAGER DASHBOARD (neha@amdox.com)
   ═══════════════════════════════════════════════════════════ */
function renderHRDashboard(container, user) {
  // Setup shared Leave Requests local storage
  const LS_LEAVES = 'amdox_leave_requests';
  const SEED_LEAVES = [
    { id: 1, name: "Rahul Singh", type: "Casual Leave", dates: "Jun 05 - Jun 08", days: 3, status: "Pending" },
    { id: 2, name: "Anita Patel", type: "Sick Leave", dates: "May 20", days: 1, status: "Approved" },
    { id: 3, name: "Vikram Kumar", type: "Annual Leave", dates: "Jun 15 - Jun 20", days: 5, status: "Pending" },
    { id: 4, name: "Sunita Rao", type: "Work From Home", dates: "May 25", days: 1, status: "Approved" }
  ];

  const getLeaves = () => {
    try { return JSON.parse(localStorage.getItem(LS_LEAVES)) || SEED_LEAVES; } catch { return SEED_LEAVES; }
  };
  const saveLeaves = (list) => {
    try { localStorage.setItem(LS_LEAVES, JSON.stringify(list)); } catch {}
  };

  const list = getLeaves();
  const pendingCount = list.filter(l => l.status === 'Pending').length;

  container.innerHTML = `
    <div class="page-header animate-fade">
      <div>
        <h2>HR Management Portal 👋</h2>
        <p>Welcome, ${escHtml(user.name)} · Centralized employee oversight &amp; leaves administration.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary btn-sm"><i class="fas fa-download"></i> Export HR Data</button>
        <button class="btn btn-primary btn-sm" id="hr-add-employee-btn"><i class="fas fa-plus"></i> Add Employee</button>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-users"></i></div></div>
        <div class="stat-value">162</div>
        <div class="stat-label">Total Staff Directory</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-header"><div class="stat-icon blue"><i class="fas fa-calendar-check"></i></div></div>
        <div class="stat-value">7</div>
        <div class="stat-label">Present On Duty Today</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-header"><div class="stat-icon yellow"><i class="fas fa-hourglass-half"></i></div></div>
        <div class="stat-value" id="hr-pending-leaves-badge">${pendingCount}</div>
        <div class="stat-label">Awaiting Approvals</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-header"><div class="stat-icon purple"><i class="fas fa-user-plus"></i></div></div>
        <div class="stat-value">3</div>
        <div class="stat-label">New Hires (This Month)</div>
      </div>
    </div>

    <div class="grid-2">
      <!-- Leave Requests Panel -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">Leave Request Pipeline</span>
          <span class="badge badge-warning" id="hr-pipeline-badge">${pendingCount} Pending</span>
        </div>
        <div class="activity-list" id="hr-leave-list-container" style="max-height: 380px; overflow-y: auto;">
          <!-- Dynamically Rendered -->
        </div>
      </div>

      <!-- Department Distribution Panel -->
      <div class="card">
        <div class="card-header"><span class="card-title">Department Distribution</span></div>
        <div style="padding: 10px 0;">
          ${[
            { name: "Engineering", count: 48, pct: 30, color: "var(--accent)" },
            { name: "Sales & Marketing", count: 35, pct: 22, color: "var(--info)" },
            { name: "Finance", count: 22, pct: 14, color: "var(--purple)" },
            { name: "HR & Admin", count: 18, pct: 11, color: "var(--warning)" },
            { name: "Operations", count: 39, pct: 24, color: "var(--pink)" }
          ].map(d => `
            <div style="margin-bottom: 18px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px;">
                <span style="color:var(--text-secondary)">${d.name}</span>
                <span style="font-weight: 600; color:var(--text-primary)">${d.count} (${d.pct}%)</span>
              </div>
              <div class="progress-bar"><div class="progress-fill" style="width: ${d.pct}%; background-color: ${d.color};"></div></div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="grid-2" style="margin-top: 24px;">
      <!-- Recruitment Board -->
      <div class="card">
        <div class="card-header"><span class="card-title">Active Job Postings</span></div>
        <div class="activity-list">
          <div class="list-item">
            <div class="list-icon" style="background:rgba(59,130,246,0.12);color:var(--info)"><i class="fas fa-code"></i></div>
            <div class="list-content">
              <div class="list-title">Senior Frontend Developer (React)</div>
              <div class="list-subtitle">Engineering · 34 Applicants</div>
            </div>
            <span class="badge badge-success">Active</span>
          </div>
          <div class="list-item">
            <div class="list-icon" style="background:rgba(59,130,246,0.12);color:var(--info)"><i class="fas fa-chart-line"></i></div>
            <div class="list-content">
              <div class="list-title">Sales Manager - Enterprise</div>
              <div class="list-subtitle">Sales · 21 Applicants</div>
            </div>
            <span class="badge badge-success">Active</span>
          </div>
          <div class="list-item">
            <div class="list-icon" style="background:rgba(168,85,247,0.12);color:var(--purple)"><i class="fas fa-palette"></i></div>
            <div class="list-content">
              <div class="list-title">UI/UX Designer</div>
              <div class="list-subtitle">Marketing · 12 Applicants</div>
            </div>
            <span class="badge badge-warning">Screening</span>
          </div>
        </div>
      </div>

      <!-- Top Performers KPI -->
      <div class="card">
        <div class="card-header"><span class="card-title">Performance KPI Leaderboard</span></div>
        <div class="activity-list">
          <div class="list-item"><div class="user-avatar" style="background:#22c55e">RS</div><div class="list-content"><div class="list-title">Rahul Singh</div><div class="list-subtitle">Engineering KPI: 98%</div></div><span class="badge badge-success">⭐ Top</span></div>
          <div class="list-item"><div class="user-avatar" style="background:#3b82f6">AP</div><div class="list-content"><div class="list-title">Anita Patel</div><div class="list-subtitle">Sales KPI: 96%</div></div><span class="badge badge-info">↗ Rising</span></div>
          <div class="list-item"><div class="user-avatar" style="background:#a855f7">VK</div><div class="list-content"><div class="list-title">Vikram Kumar</div><div class="list-subtitle">Finance KPI: 94%</div></div><span class="badge badge-purple">★ Star</span></div>
        </div>
      </div>
    </div>
  `;

  // Draw Leave requests with Approval Actions
  const renderLeavesList = () => {
    const freshList = getLeaves();
    const listContainer = document.getElementById('hr-leave-list-container');
    const badgeEl1 = document.getElementById('hr-pending-leaves-badge');
    const badgeEl2 = document.getElementById('hr-pipeline-badge');

    const pCount = freshList.filter(l => l.status === 'Pending').length;
    if (badgeEl1) badgeEl1.textContent = pCount;
    if (badgeEl2) badgeEl2.textContent = `${pCount} Pending`;

    if (freshList.length === 0) {
      listContainer.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted);">No leave requests registered.</div>`;
      return;
    }

    listContainer.innerHTML = freshList.map(l => {
      const initials = l.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
      let actionHtml = '';

      if (l.status === 'Pending') {
        actionHtml = `
          <div style="display:flex; gap:6px;">
            <button class="btn btn-primary btn-xs" style="background:var(--success); border:none; padding:4px 8px;" onclick="hrProcessLeave(${l.id}, 'Approved')"><i class="fas fa-check"></i></button>
            <button class="btn btn-secondary btn-xs" style="background:var(--danger); border:none; padding:4px 8px; color:#fff;" onclick="hrProcessLeave(${l.id}, 'Rejected')"><i class="fas fa-xmark"></i></button>
          </div>
        `;
      } else {
        const badgeColor = l.status === 'Approved' ? 'badge-success' : 'badge-danger';
        actionHtml = `<span class="badge ${badgeColor}">${l.status}</span>`;
      }

      return `
        <div style="display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid var(--border)">
          <div class="user-avatar" style="background:linear-gradient(135deg, var(--accent), var(--info)); width:36px; height:36px; display:flex; align-items:center; justify-content:center; border-radius:10px; font-weight:700; font-size:12px;">${initials}</div>
          <div style="flex:1;">
            <div style="font-size:13.5px; font-weight:600; color:var(--text-primary);">${escHtml(l.name)}</div>
            <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">${escHtml(l.type)} · ${escHtml(l.dates)} (${l.days}d)</div>
          </div>
          ${actionHtml}
        </div>
      `;
    }).join('');
  };

  // Define global action handler for processed leaves
  window.hrProcessLeave = function(id, status) {
    const freshList = getLeaves();
    const idx = freshList.findIndex(l => l.id === id);
    if (idx > -1) {
      freshList[idx].status = status;
      saveLeaves(freshList);
      showToast(`Leave Request ${status === 'Approved' ? 'approved' : 'rejected'} successfully!`, status === 'Approved' ? 'success' : 'error');
      renderLeavesList();
    }
  };

  // Add Employee Mock Action
  document.getElementById('hr-add-employee-btn').addEventListener('click', () => {
    showModal({
      title: '<i class="fas fa-user-plus" style="color:var(--accent)"></i> Register New Employee',
      submitLabel: 'Create Directory',
      fields: [
        { name: 'name', label: 'Full Name', required: true, placeholder: 'e.g. Ramesh Patel' },
        { name: 'email', label: 'Office Email', required: true, placeholder: 'e.g. ramesh@amdox.com' },
        { name: 'department', label: 'Department', type: 'select', options: ['Engineering', 'Finance', 'Sales', 'HR', 'Operations'], default: 'Engineering' },
        { name: 'role', label: 'Job Profile Title', required: true, placeholder: 'e.g. QA Automation' }
      ],
      async onSubmit(data, close) {
        showToast(`✅ Employee ${data.name} added to records!`, 'success');
        close();
      }
    });
  });

  renderLeavesList();
}

/* ═══════════════════════════════════════════════════════════
   MANAGER DASHBOARD (karan@amdox.com)
   ═══════════════════════════════════════════════════════════ */
function renderManagerDashboard(container, user) {
  const LS_TASKS = 'amdox_mgr_tasks';
  const SEED_TASKS = [
    { id: 1, title: "ERP Module Integration — Phase 2", due: "Jun 10", priority: "High", progress: 65, assignees: ["RS", "AP", "VM"] },
    { id: 2, title: "Cloud Migration of Legacy Systems", due: "Jun 25", priority: "High", progress: 30, assignees: ["VK", "SJ"] },
    { id: 3, title: "Q3 Sprint Planning & Roadmap", due: "Jun 12", priority: "Medium", progress: 80, assignees: ["RS", "MK"] },
    { id: 4, title: "Client Delivery — TechCorp Dashboard", due: "Jun 08", priority: "High", progress: 95, assignees: ["AP", "RS", "VK"] }
  ];

  const getTasks = () => {
    try { return JSON.parse(localStorage.getItem(LS_TASKS)) || SEED_TASKS; } catch { return SEED_TASKS; }
  };

  const LS_LEAVES = 'amdox_leave_requests';
  const SEED_LEAVES = [
    { id: 1, name: "Rahul Singh", type: "Casual Leave", dates: "Jun 05 - Jun 08", days: 3, status: "Pending" },
    { id: 3, name: "Vikram Kumar", type: "Annual Leave", dates: "Jun 15 - Jun 20", days: 5, status: "Pending" }
  ];
  const getLeaves = () => {
    try { return JSON.parse(localStorage.getItem(LS_LEAVES)) || SEED_LEAVES; } catch { return SEED_LEAVES; }
  };

  const teamLeaves = getLeaves().filter(l => l.status === 'Pending');
  const tasks = getTasks();
  const highPri = tasks.filter(t => t.priority === 'High').length;
  const avgProgress = Math.round(tasks.reduce((s, t) => s + t.progress, 0) / tasks.length);

  container.innerHTML = `
    <div class="page-header animate-fade">
      <div>
        <h2>Team Management Hub 🎯</h2>
        <p>Welcome, ${escHtml(user.name)} · Manage your team, track projects &amp; review approvals.</p>
      </div>
      <div class="page-actions">
        <button class="btn btn-secondary btn-sm"><i class="fas fa-download"></i> Team Report</button>
        <button class="btn btn-primary btn-sm" id="mgr-new-task-btn"><i class="fas fa-plus"></i> Assign Task</button>
      </div>
    </div>

    <!-- KPI Stats Row -->
    <div class="stats-grid">
      <div class="stat-card animate-slide-up">
        <div class="stat-card-header">
          <div class="stat-icon blue"><i class="fas fa-layer-group"></i></div>
          <span class="stat-trend up"><i class="fas fa-arrow-up"></i> 2 new</span>
        </div>
        <div class="stat-value">${tasks.length}</div>
        <div class="stat-label">Active Projects</div>
        <div class="progress-bar" style="margin-top:10px"><div class="progress-fill blue" style="width:${avgProgress}%"></div></div>
      </div>
      <div class="stat-card animate-slide-up" style="animation-delay:0.1s">
        <div class="stat-card-header">
          <div class="stat-icon green"><i class="fas fa-users"></i></div>
          <span class="stat-trend up"><i class="fas fa-arrow-up"></i> On Track</span>
        </div>
        <div class="stat-value">12</div>
        <div class="stat-label">Team Members</div>
        <div class="progress-bar" style="margin-top:10px"><div class="progress-fill green" style="width:85%"></div></div>
      </div>
      <div class="stat-card animate-slide-up" style="animation-delay:0.2s">
        <div class="stat-card-header">
          <div class="stat-icon yellow"><i class="fas fa-flag"></i></div>
          <span class="stat-trend down"><i class="fas fa-arrow-down"></i> Critical</span>
        </div>
        <div class="stat-value">${highPri}</div>
        <div class="stat-label">High Priority Tasks</div>
        <div class="progress-bar" style="margin-top:10px"><div class="progress-fill yellow" style="width:${(highPri/tasks.length)*100}%"></div></div>
      </div>
      <div class="stat-card animate-slide-up" style="animation-delay:0.3s">
        <div class="stat-card-header">
          <div class="stat-icon purple"><i class="fas fa-chart-pie"></i></div>
          <span class="stat-trend up"><i class="fas fa-arrow-up"></i> ${avgProgress}%</span>
        </div>
        <div class="stat-value">${avgProgress}%</div>
        <div class="stat-label">Avg. Project Progress</div>
        <div class="progress-bar" style="margin-top:10px"><div class="progress-fill purple" style="width:${avgProgress}%"></div></div>
      </div>
    </div>

    <div class="grid-2">
      <!-- Project Tracker -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="fas fa-diagram-project" style="color:var(--accent);margin-right:6px"></i>Project Tracker</span>
          <span class="badge badge-info">${tasks.length} Active</span>
        </div>
        <div id="mgr-project-list" style="display:flex; flex-direction:column; gap:16px; padding:4px 0;">
          ${tasks.map(t => {
            const priColor = t.priority === 'High' ? 'var(--danger)' : t.priority === 'Medium' ? 'var(--warning)' : 'var(--success)';
            const progressColor = t.progress >= 80 ? 'var(--success)' : t.progress >= 50 ? 'var(--accent)' : 'var(--warning)';
            return `
              <div style="padding:14px; background:rgba(255,255,255,0.02); border:1px solid var(--border); border-radius:12px; transition:all 0.2s;" onmouseover="this.style.borderColor='rgba(99,102,241,0.3)'" onmouseout="this.style.borderColor='var(--border)'">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                  <div style="flex:1;">
                    <div style="font-size:13.5px; font-weight:600; color:var(--text-primary);">${escHtml(t.title)}</div>
                    <div style="font-size:11.5px; color:var(--text-muted); margin-top:3px;"><i class="fas fa-calendar" style="margin-right:4px"></i>Due: ${escHtml(t.due)}</div>
                  </div>
                  <span style="font-size:10px; font-weight:700; padding:3px 8px; border-radius:6px; background:rgba(0,0,0,0.15); color:${priColor}; border:1px solid ${priColor};">${t.priority}</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                  <div style="display:flex; gap:-6px;">
                    ${t.assignees.map((a, i) => `<div style="width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--purple));display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;border:2px solid var(--bg-card);margin-left:${i>0?'-6px':'0'}">${a}</div>`).join('')}
                  </div>
                  <span style="font-size:12px; font-weight:700; color:${progressColor}">${t.progress}%</span>
                </div>
                <div class="progress-bar" style="height:6px;"><div class="progress-fill" style="width:${t.progress}%;background:${progressColor};border-radius:6px;"></div></div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Right Column -->
      <div style="display:flex; flex-direction:column; gap:20px;">
        <!-- Team Leave Approvals -->
        <div class="card">
          <div class="card-header">
            <span class="card-title"><i class="fas fa-calendar-check" style="color:var(--warning);margin-right:6px"></i>Team Leave Queue</span>
            <span class="badge badge-warning">${teamLeaves.length} Pending</span>
          </div>
          <div id="mgr-leave-list">
            ${teamLeaves.length === 0 
              ? `<div style="text-align:center;padding:20px;color:var(--text-muted);">No pending leave requests.</div>` 
              : teamLeaves.map(l => `
                <div style="display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid var(--border);">
                  <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,var(--accent),var(--info));display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;">${l.name.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase()}</div>
                  <div style="flex:1;">
                    <div style="font-size:13px;font-weight:600;color:var(--text-primary);">${escHtml(l.name)}</div>
                    <div style="font-size:11px;color:var(--text-muted);">${escHtml(l.type)} · ${escHtml(l.dates)}</div>
                  </div>
                  <div style="display:flex;gap:6px;">
                    <button class="btn btn-xs" style="background:rgba(34,197,94,0.15);color:var(--success);border:1px solid rgba(34,197,94,0.3);padding:4px 10px;" onclick="mgrApproveLeave(${l.id})"><i class="fas fa-check"></i></button>
                    <button class="btn btn-xs" style="background:rgba(239,68,68,0.15);color:var(--danger);border:1px solid rgba(239,68,68,0.3);padding:4px 10px;" onclick="mgrRejectLeave(${l.id})"><i class="fas fa-xmark"></i></button>
                  </div>
                </div>
              `).join('')}
          </div>
        </div>

        <!-- Team Performance -->
        <div class="card">
          <div class="card-header">
            <span class="card-title"><i class="fas fa-medal" style="color:var(--warning);margin-right:6px"></i>Team Performance</span>
            <span class="badge badge-success">This Month</span>
          </div>
          <div class="activity-list">
            ${[
              { init: "RS", name: "Rahul Singh", dept: "Engineering", kpi: 98, color: "#22c55e" },
              { init: "AP", name: "Anita Patel", dept: "Sales", kpi: 94, color: "#3b82f6" },
              { init: "VK", name: "Vikram Kumar", dept: "Finance", kpi: 90, color: "#a855f7" },
              { init: "SJ", name: "Sunita Jain", dept: "Operations", kpi: 87, color: "#f59e0b" }
            ].map(m => `
              <div style="display:flex; align-items:center; gap:12px; padding:8px 0; border-bottom:1px solid var(--border);">
                <div style="width:34px;height:34px;border-radius:10px;background:${m.color};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;">${m.init}</div>
                <div style="flex:1;">
                  <div style="font-size:13px;font-weight:600;color:var(--text-primary);">${m.name}</div>
                  <div style="font-size:11px;color:var(--text-muted);">${m.dept} · KPI: ${m.kpi}%</div>
                </div>
                <div style="width:60px;">
                  <div class="progress-bar" style="height:5px;"><div class="progress-fill" style="width:${m.kpi}%;background:${m.color};border-radius:6px;"></div></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Deadlines Row -->
    <div class="card" style="margin-top:20px;">
      <div class="card-header">
        <span class="card-title"><i class="fas fa-clock" style="color:var(--pink);margin-right:6px"></i>Upcoming Deadlines & Milestones</span>
        <button class="btn btn-secondary btn-sm"><i class="fas fa-calendar"></i> View Calendar</button>
      </div>
      <div style="display:flex; gap:12px; flex-wrap:wrap; padding:8px 0;">
        ${[
          { date: "Jun 08", task: "TechCorp Dashboard Delivery", project: "Client Delivery", urgency: "var(--danger)", tag: "Due Today" },
          { date: "Jun 10", task: "Phase 2 Integration Review", project: "ERP Integration", urgency: "var(--warning)", tag: "2 Days" },
          { date: "Jun 12", task: "Q3 Sprint Kickoff Meeting", project: "Planning", urgency: "var(--info)", tag: "4 Days" },
          { date: "Jun 25", task: "Cloud Migration Checkpoint", project: "Cloud Migration", urgency: "var(--success)", tag: "17 Days" }
        ].map(d => `
          <div style="flex:1; min-width:200px; padding:14px; background:rgba(255,255,255,0.02); border:1px solid var(--border); border-left:3px solid ${d.urgency}; border-radius:10px;">
            <div style="font-size:11px; font-weight:700; color:${d.urgency}; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.5px;">${d.tag} · ${d.date}</div>
            <div style="font-size:13px; font-weight:600; color:var(--text-primary); margin-bottom:4px;">${d.task}</div>
            <div style="font-size:11.5px; color:var(--text-muted);">${d.project}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Leave approval handlers
  window.mgrApproveLeave = function(id) {
    const leaves = getLeaves();
    const idx = leaves.findIndex(l => l.id === id);
    if (idx > -1) {
      leaves[idx].status = 'Approved';
      try { localStorage.setItem(LS_LEAVES, JSON.stringify(leaves)); } catch {}
      showToast('✅ Leave approved successfully!', 'success');
      renderManagerDashboard(container, user);
    }
  };

  window.mgrRejectLeave = function(id) {
    const leaves = getLeaves();
    const idx = leaves.findIndex(l => l.id === id);
    if (idx > -1) {
      leaves[idx].status = 'Rejected';
      try { localStorage.setItem(LS_LEAVES, JSON.stringify(leaves)); } catch {}
      showToast('Leave request rejected.', 'error');
      renderManagerDashboard(container, user);
    }
  };

  // Assign Task modal
  document.getElementById('mgr-new-task-btn').addEventListener('click', () => {
    showModal({
      title: '<i class="fas fa-tasks" style="color:var(--accent)"></i> Assign New Task',
      submitLabel: 'Create Task',
      fields: [
        { name: 'title', label: 'Task Title', required: true, placeholder: 'e.g. API Gateway Refactor' },
        { name: 'assignee', label: 'Assignee', type: 'select', options: ['Rahul Singh', 'Anita Patel', 'Vikram Kumar', 'Sunita Jain', 'Manoj Kapoor'], default: 'Rahul Singh' },
        { name: 'priority', label: 'Priority', type: 'select', options: ['High', 'Medium', 'Low'], default: 'Medium' },
        { name: 'due', label: 'Due Date', type: 'date', required: true }
      ],
      async onSubmit(data, close) {
        showToast(`✅ Task "${data.title}" assigned to ${data.assignee}!`, 'success');
        close();
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   EMPLOYEE DASHBOARD (rahul@amdox.com, priya@amdox.com, etc)
   ═══════════════════════════════════════════════════════════ */
function renderEmployeeDashboard(container, user) {
  const LS_TASKS = 'amdox_employee_tasks_' + user.email;
  const SEED_TASKS = [
    { id: 1, title: "Complete Q2 System Audit Log", due: "Today", priority: "High", done: false },
    { id: 2, title: "SSO simulator validation", due: "Today", priority: "Medium", done: true },
    { id: 3, title: "Write unit tests for file validation", due: "Tomorrow", priority: "High", done: false },
    { id: 4, title: "Update platform API schema documentation", due: "June 05", priority: "Low", done: false }
  ];

  const getTasks = () => {
    try { return JSON.parse(localStorage.getItem(LS_TASKS)) || SEED_TASKS; } catch { return SEED_TASKS; }
  };
  const saveTasks = (list) => {
    try { localStorage.setItem(LS_TASKS, JSON.stringify(list)); } catch {}
  };

  // Leaves reference (shared with HR dashboard)
  const LS_LEAVES = 'amdox_leave_requests';
  const SEED_LEAVES = [
    { id: 1, name: "Rahul Singh", type: "Casual Leave", dates: "Jun 05 - Jun 08", days: 3, status: "Pending" },
    { id: 2, name: "Anita Patel", type: "Sick Leave", dates: "May 20", days: 1, status: "Approved" },
    { id: 3, name: "Vikram Kumar", type: "Annual Leave", dates: "Jun 15 - Jun 20", days: 5, status: "Pending" },
    { id: 4, name: "Sunita Rao", type: "Work From Home", dates: "May 25", days: 1, status: "Approved" }
  ];
  const getLeaves = () => {
    try { return JSON.parse(localStorage.getItem(LS_LEAVES)) || SEED_LEAVES; } catch { return SEED_LEAVES; }
  };
  const saveLeaves = (list) => {
    try { localStorage.setItem(LS_LEAVES, JSON.stringify(list)); } catch {}
  };

  // Clock Check-In check status
  const checkedIn = localStorage.getItem('amdox_checked_in_' + user.email) === 'true';
  const checkinTime = localStorage.getItem('amdox_checkin_time_' + user.email) || '';

  const initials = user.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

  container.innerHTML = `
    <div class="page-content animate-fade" style="padding: 0;">
      <!-- Welcome Banner -->
      <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.1)); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 16px; padding: 24px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
        <div>
          <h2 style="font-size: 22px; font-weight: 800; color: var(--text-primary);">Good Day, ${escHtml(user.name)}! 👋</h2>
          <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px;">Role Profile: ${escHtml(user.role)} · Engineering Division</p>
          <div style="margin-top: 15px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
            <button class="btn ${checkedIn ? 'btn-secondary' : 'btn-primary'}" id="emp-checkin-btn" style="${checkedIn ? 'background:rgba(239,68,68,0.12); color:var(--danger); border:1px solid rgba(239,68,68,0.2)' : ''}">
              ${checkedIn ? '🔴 Check Out' : '🟢 Check In'}
            </button>
            <div id="emp-checkin-status" style="font-size: 13.5px; font-weight: 600; color: var(--success); ${checkedIn ? '' : 'display:none;'}">
              <i class="fas fa-circle-check"></i> Checked in ${checkinTime ? 'at ' + checkinTime : ''}
            </div>
          </div>
        </div>
        <div style="text-align: right; display: flex; align-items: center; gap: 12px;">
          <div style="text-align: right;">
            <div style="font-size: 14px; font-weight: 700; color: var(--text-primary);">${escHtml(user.name)}</div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${escHtml(user.email)}</div>
          </div>
          <div class="user-avatar" style="background: linear-gradient(135deg, var(--accent), var(--purple)); width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 14px; font-weight: 800; font-size: 18px; box-shadow: 0 4px 15px rgba(99,102,241,0.25);">${initials}</div>
        </div>
      </div>

      <!-- Mini KPI Stats Grid -->
      <div class="stats-grid" style="margin-bottom: 24px;">
        <div class="stat-card" style="padding: 14px 18px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(34,197,94,0.12); color: var(--success); display: flex; align-items: center; justify-content: center; font-size: 16px;"><i class="fas fa-calendar-day"></i></div>
            <div>
              <div style="font-size: 18px; font-weight: 800; color: var(--text-primary);">20/22</div>
              <div style="font-size: 11.5px; color: var(--text-secondary);">Days Present</div>
            </div>
          </div>
        </div>
        <div class="stat-card" style="padding: 14px 18px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(59,130,246,0.12); color: var(--info); display: flex; align-items: center; justify-content: center; font-size: 16px;"><i class="fas fa-plane-departure"></i></div>
            <div>
              <div style="font-size: 18px; font-weight: 800; color: var(--text-primary);">12 Days</div>
              <div style="font-size: 11.5px; color: var(--text-secondary);">Leave Balance</div>
            </div>
          </div>
        </div>
        <div class="stat-card" style="padding: 14px 18px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(245,158,11,0.12); color: var(--warning); display: flex; align-items: center; justify-content: center; font-size: 16px;"><i class="fas fa-circle-check"></i></div>
            <div>
              <div style="font-size: 18px; font-weight: 800; color: var(--text-primary);" id="emp-stat-tasks-done">0/0</div>
              <div style="font-size: 11.5px; color: var(--text-secondary);">Active Tasks Done</div>
            </div>
          </div>
        </div>
        <div class="stat-card" style="padding: 14px 18px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(168,85,247,0.12); color: var(--purple); display: flex; align-items: center; justify-content: center; font-size: 16px;"><i class="fas fa-award"></i></div>
            <div>
              <div style="font-size: 18px; font-weight: 800; color: var(--text-primary);">92%</div>
              <div style="font-size: 11.5px; color: var(--text-secondary);">Your KPI Score</div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-2" style="margin-bottom: 24px;">
        <!-- Tasks Card -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">My Pending Tasks</span>
            <span class="badge badge-warning" id="emp-tasks-badge">0 Pending</span>
          </div>
          <div class="activity-list" id="emp-tasks-container" style="max-height: 360px; overflow-y: auto;">
            <!-- Dynamically populated -->
          </div>
        </div>

        <!-- Apply Leave Form -->
        <div class="card">
          <div class="card-header">
            <span class="card-title"><i class="fas fa-calendar-plus" style="color:var(--accent); margin-right:6px;"></i> Request Leave Absence</span>
          </div>
          <div style="padding: 10px 0;">
            <form id="emp-leave-form" style="display:flex; flex-direction:column; gap:12px;">
              <div>
                <label style="display:block; font-size:11.5px; color:var(--text-secondary); font-weight:600; margin-bottom:5px;">Select Leave Type</label>
                <select id="emp-leave-type" class="form-input" style="background:rgba(255,255,255,0.03); border:1px solid var(--border); color:var(--text-primary); font-size:13px; width:100%; border-radius:8px; padding:10px;">
                  <option>Casual Leave</option>
                  <option>Sick Leave</option>
                  <option>Annual Leave</option>
                  <option>Work From Home</option>
                </select>
              </div>
              <div style="display:flex; gap:10px;">
                <div style="flex:1;">
                  <label style="display:block; font-size:11.5px; color:var(--text-secondary); font-weight:600; margin-bottom:5px;">From Date</label>
                  <input type="date" id="emp-leave-from" class="form-input" required style="background:rgba(255,255,255,0.03); border:1px solid var(--border); color:var(--text-primary); font-size:13px; width:100%; border-radius:8px; padding:9px;" />
                </div>
                <div style="flex:1;">
                  <label style="display:block; font-size:11.5px; color:var(--text-secondary); font-weight:600; margin-bottom:5px;">To Date</label>
                  <input type="date" id="emp-leave-to" class="form-input" required style="background:rgba(255,255,255,0.03); border:1px solid var(--border); color:var(--text-primary); font-size:13px; width:100%; border-radius:8px; padding:9px;" />
                </div>
              </div>
              <div>
                <label style="display:block; font-size:11.5px; color:var(--text-secondary); font-weight:600; margin-bottom:5px;">Reason</label>
                <textarea id="emp-leave-reason" class="form-input" required rows="2" placeholder="Brief explanation for leave..." style="background:rgba(255,255,255,0.03); border:1px solid var(--border); color:var(--text-primary); font-size:13px; width:100%; border-radius:8px; padding:10px; resize:none;"></textarea>
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%; padding:11px; font-weight:700;"><i class="fas fa-check"></i> Submit Leave Request</button>
            </form>
          </div>
        </div>
      </div>

      <div class="grid-2">
        <!-- Announcements Panel -->
        <div class="card">
          <div class="card-header"><span class="card-title">Corporate Announcements</span></div>
          <div class="activity-list">
            <div class="activity-item"><div class="activity-dot blue"></div><div><div class="activity-text">📢 **Town Hall Meeting**: Friday 4 PM IST, Q3 alignment huddle</div><div class="activity-time">2 hours ago</div></div></div>
            <div class="activity-item"><div class="activity-dot green"></div><div><div class="activity-text">🎉 **Q2 Financial Results**: Revenue targets exceeded by 18%!</div><div class="activity-time">1 day ago</div></div></div>
            <div class="activity-item"><div class="activity-dot yellow"></div><div><div class="activity-text">🏆 **Employee Performance Awards**: Rahul Singh announced top performer</div><div class="activity-time">3 days ago</div></div></div>
          </div>
        </div>

        <!-- Payslips Panel -->
        <div class="card">
          <div class="card-header"><span class="card-title">My Recent Payslips</span></div>
          <div class="activity-list">
            <div class="list-item">
              <div class="list-icon" style="background:rgba(34,197,94,0.12);color:var(--success)"><i class="fas fa-coins"></i></div>
              <div class="list-content"><div class="list-title">April 2026 Salary Slip</div><div class="list-subtitle">Paid: ₹72,000 · Salary credit</div></div>
              <button class="btn btn-secondary btn-xs" onclick="showToast('Downloading April 2026 Payslip...', 'info')"><i class="fas fa-download"></i></button>
            </div>
            <div class="list-item">
              <div class="list-icon" style="background:rgba(34,197,94,0.12);color:var(--success)"><i class="fas fa-coins"></i></div>
              <div class="list-content"><div class="list-title">March 2026 Salary Slip</div><div class="list-subtitle">Paid: ₹72,000 · Salary credit</div></div>
              <button class="btn btn-secondary btn-xs" onclick="showToast('Downloading March 2026 Payslip...', 'info')"><i class="fas fa-download"></i></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Draw Tasks List
  const renderTasks = () => {
    const list = getTasks();
    const tasksContainer = document.getElementById('emp-tasks-container');
    const badge = document.getElementById('emp-tasks-badge');
    const statBadge = document.getElementById('emp-stat-tasks-done');

    const pending = list.filter(t => !t.done);
    const completed = list.filter(t => t.done);

    if (badge) badge.textContent = `${pending.length} Pending`;
    if (statBadge) statBadge.textContent = `${completed.length}/${list.length}`;

    if (list.length === 0) {
      tasksContainer.innerHTML = `<div style="text-align:center; padding:30px; color:var(--text-muted);">All tasks completed!</div>`;
      return;
    }

    tasksContainer.innerHTML = list.map(t => {
      const priColorClass = t.priority === 'High' ? 'badge-danger' : (t.priority === 'Medium' ? 'badge-warning' : 'badge-success');
      return `
        <div style="display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid var(--border)">
          <div style="cursor:pointer; font-size:16px; color:${t.done ? 'var(--success)' : 'var(--text-muted)'};" onclick="empToggleTask(${t.id})">
            <i class="far ${t.done ? 'fa-check-circle' : 'fa-circle'}"></i>
          </div>
          <div style="flex:1;">
            <div style="font-size:13.5px; color:${t.done ? 'var(--text-muted)' : 'var(--text-primary)'}; text-decoration:${t.done ? 'line-through' : 'none'}; font-weight: 500;">${escHtml(t.title)}</div>
            <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">Due: ${escHtml(t.due)}</div>
          </div>
          <span class="badge ${priColorClass}" style="font-size:10px;">${escHtml(t.priority)}</span>
        </div>
      `;
    }).join('');
  };

  // Define global task toggling handler
  window.empToggleTask = function(id) {
    const list = getTasks();
    const idx = list.findIndex(t => t.id === id);
    if (idx > -1) {
      list[idx].done = !list[idx].done;
      saveTasks(list);
      renderTasks();
    }
  };

  // Handle Check-In / Check-Out Toggle
  const checkinBtn = document.getElementById('emp-checkin-btn');
  const checkinStatus = document.getElementById('emp-checkin-status');

  checkinBtn.addEventListener('click', () => {
    const isNowCheckedIn = localStorage.getItem('amdox_checked_in_' + user.email) !== 'true';
    localStorage.setItem('amdox_checked_in_' + user.email, isNowCheckedIn);

    if (isNowCheckedIn) {
      const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      localStorage.setItem('amdox_checkin_time_' + user.email, timeStr);
      
      checkinBtn.textContent = '🔴 Check Out';
      checkinBtn.className = 'btn btn-secondary';
      checkinBtn.style.cssText = 'background:rgba(239,68,68,0.12); color:var(--danger); border:1px solid rgba(239,68,68,0.2)';
      
      checkinStatus.innerHTML = `<i class="fas fa-circle-check"></i> Checked in at ${timeStr}`;
      checkinStatus.style.display = 'block';
      
      showToast('🟢 Successfully checked in for duty!', 'success');
    } else {
      localStorage.removeItem('amdox_checkin_time_' + user.email);
      
      checkinBtn.textContent = '🟢 Check In';
      checkinBtn.className = 'btn btn-primary';
      checkinBtn.style.cssText = '';
      
      checkinStatus.style.display = 'none';
      
      showToast('🔴 Checked out successfully.', 'info');
    }
  });

  // Handle Leave Request Submission
  const leaveForm = document.getElementById('emp-leave-form');
  leaveForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const type = document.getElementById('emp-leave-type').value;
    const fromVal = document.getElementById('emp-leave-from').value;
    const toVal = document.getElementById('emp-leave-to').value;
    const reason = document.getElementById('emp-leave-reason').value;

    if (!fromVal || !toVal || !reason) {
      showToast('Please fill all dates and reason!', 'error');
      return;
    }

    const fromDate = new Date(fromVal);
    const toDate = new Date(toVal);
    
    if (toDate < fromDate) {
      showToast('End date cannot be earlier than start date!', 'error');
      return;
    }

    // Add to shared leaves lists
    const freshLeavesList = getLeaves();
    
    // Parse formatting dates
    const opt = { day: '2-digit', month: 'short' };
    const dateRangeStr = `${fromDate.toLocaleDateString('en-US', opt)} - ${toDate.toLocaleDateString('en-US', opt)}`;
    const calcDays = Math.round((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

    const newLeaveReq = {
      id: Date.now(),
      name: user.name,
      type: type,
      dates: dateRangeStr,
      days: calcDays,
      status: 'Pending'
    };

    freshLeavesList.unshift(newLeaveReq);
    saveLeaves(freshLeavesList);

    // Reset Form
    leaveForm.reset();
    showToast('🚀 Leave application submitted successfully!', 'success');
  });

  renderTasks();
}

/* ── Global Helper: Escaping HTML values securely ── */
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
