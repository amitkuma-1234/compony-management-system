/* ============================================================
   Dashboard Page
   ============================================================ */
pages.dashboard = function(container) {
  container.innerHTML = `
    <div class="page-header">
      <div>
        <h2>Welcome back, Amit 👋</h2>
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
};
