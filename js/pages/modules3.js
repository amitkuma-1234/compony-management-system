/* Analytics & BI Page — reads from db */
pages.analytics = function(container) {
  const s = db.table('analyticsStats').getAll()[0];
  const reports = db.table('scheduledReports').getAll();
  const reportsHTML = reports.map(r => `<div class="list-item"><div class="list-icon" style="background:${r.iconBg};color:${r.iconColor}"><i class="fas ${r.icon}"></i></div><div class="list-content"><div class="list-title">${r.name}</div><div class="list-subtitle">${r.schedule} · ${r.format} · ${r.recipients} recipients</div></div><span class="badge badge-success">Active</span></div>`).join('');

  container.innerHTML = `
    <div class="module-hero"><h2><i class="fas fa-chart-line" style="color:var(--info)"></i> Analytics & Business Intelligence</h2><p>Interactive dashboards, KPI tracking, drill-down analytics, scheduled reports, and AI-generated natural language insights.</p><div class="page-actions" style="margin-top:16px"><button class="btn btn-primary btn-sm"><i class="fas fa-plus"></i> New Dashboard</button><button class="btn btn-secondary btn-sm"><i class="fas fa-file-pdf"></i> Export PDF</button><button class="btn btn-secondary btn-sm"><i class="fas fa-file-excel"></i> Export Excel</button></div></div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon blue"><i class="fas fa-chart-pie"></i></div></div><div class="stat-value">${s.activeDashboards}</div><div class="stat-label">Active Dashboards</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-file-lines"></i></div></div><div class="stat-value">${s.reportsGenerated}</div><div class="stat-label">Reports Generated</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon purple"><i class="fas fa-database"></i></div></div><div class="stat-value">${s.dataProcessed}</div><div class="stat-label">Data Processed</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon cyan"><i class="fas fa-clock-rotate-left"></i></div></div><div class="stat-value">${s.avgQueryTime}</div><div class="stat-label">Avg Query Time</div></div>
    </div>
    <div class="grid-2"><div class="card"><div class="card-header"><span class="card-title">Revenue Trends</span></div><div class="chart-container"><canvas data-chart="revenue"></canvas></div></div><div class="card"><div class="card-header"><span class="card-title">Department Performance</span></div><div class="chart-container"><canvas data-chart="bar"></canvas></div></div></div>
    <div class="grid-2"><div class="card"><div class="card-header"><span class="card-title">Resource Allocation</span></div><div class="chart-container"><canvas data-chart="doughnut"></canvas></div></div><div class="card"><div class="card-header"><span class="card-title">Scheduled Reports</span></div><div class="activity-list">${reportsHTML}</div></div></div>`;
};

/* Auth & Security Page — reads from db */
pages.auth = function(container) {
  const s = db.table('authStats').getAll()[0];
  const features = db.table('securityFeatures').getAll();
  const logs = db.table('auditLogs').getAll();

  const featHTML = features.map(f => {
    const isEnabled = f.status === 'Enabled';
    return `<div class="list-item" onclick="window.viewStatDetail('Security Feature', '${f.name}')" style="cursor:pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.03)'" onmouseout="this.style.background='transparent'"><div class="list-icon" style="background:${isEnabled?'rgba(34,197,94,0.12)':'rgba(245,158,11,0.12)'};color:${isEnabled?'var(--success)':'var(--warning)'}"><i class="fas ${isEnabled?'fa-check':'fa-clock'}"></i></div><div class="list-content"><div class="list-title">${f.name}</div><div class="list-subtitle">${f.desc}</div></div><span class="badge badge-${isEnabled?'success':'warning'}">${f.status}</span></div>`;
  }).join('');

  const logsHTML = logs.map(l => `<div class="activity-item" onclick="window.viewStatDetail('Audit Log', '${l.action}')" style="cursor:pointer; padding: 10px; border-radius: 8px; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.03)'" onmouseout="this.style.background='transparent'"><div class="activity-dot ${l.dot}"></div><div><div class="activity-text"><strong>${l.action}:</strong> ${l.detail}</div><div class="activity-time">${l.time}${l.ip?' · '+l.ip:''}</div></div></div>`).join('');

  container.innerHTML = `
    <div class="module-hero"><h2><i class="fas fa-shield-halved" style="color:var(--success)"></i> Authentication & Security</h2><p>Multi-tenant RBAC, MFA/SSO, JWT security, OWASP protection, audit logging, and AI threat detection.</p></div>
    <div class="stats-grid">
      <div class="stat-card" onclick="window.viewStatDetail('Security', 'Security Score')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-shield-check"></i></div></div><div class="stat-value">${s.securityScore}</div><div class="stat-label">Security Score</div></div>
      <div class="stat-card" onclick="window.viewStatDetail('Security', 'Active Users')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon blue"><i class="fas fa-users"></i></div></div><div class="stat-value">${s.activeUsers}</div><div class="stat-label">Active Users</div></div>
      <div class="stat-card" onclick="window.viewStatDetail('Security', 'Threats Blocked')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon red"><i class="fas fa-ban"></i></div></div><div class="stat-value">${s.threatsBlocked}</div><div class="stat-label">Threats Blocked</div></div>
      <div class="stat-card" onclick="window.viewStatDetail('Security', 'Auth Method')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon purple"><i class="fas fa-key"></i></div></div><div class="stat-value">${s.authMethod}</div><div class="stat-label">Auth Method</div></div>
    </div>
    <div class="grid-2"><div class="card"><div class="card-header"><span class="card-title">Security Features</span></div><div class="activity-list">${featHTML}</div></div><div class="card"><div class="card-header"><span class="card-title">Recent Audit Logs</span></div><div class="activity-list">${logsHTML}</div></div></div>`;
};

/* Notifications Page — reads from db */
pages.notifications = function(container) {
  const s = db.table('notificationStats').getAll()[0];
  const channels = db.table('notificationChannels').getAll();
  const recent = db.table('recentNotifications').getAll();

  const chHTML = channels.map(c => `
    <div class="list-item" onclick="window.viewChannel('${c.id}')" style="cursor:pointer; transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.03)'; this.style.borderColor='var(--border-active)'" onmouseout="this.style.background='transparent'; this.style.borderColor='transparent'">
      <div class="list-icon" style="background:${c.iconBg};color:${c.iconColor}"><i class="${c.icon.startsWith('fab')?c.icon:'fas '+c.icon}"></i></div>
      <div class="list-content">
        <div class="list-title">${c.name}</div>
        <div class="list-subtitle">${c.provider}${c.delivery?' · '+c.delivery:''}</div>
      </div>
      <span class="badge badge-${c.status==='Active'?'success':'info'}">${c.status}</span>
    </div>`).join('');

  const recHTML = recent.map(r => `
    <div class="activity-item" onclick="window.viewNotification('${r.id}')" style="cursor:pointer; border-radius:8px; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.03)'" onmouseout="this.style.background='transparent'">
      <div class="activity-dot ${r.dot}"></div>
      <div>
        <div class="activity-text">${r.msg}</div>
        <div class="activity-time">${r.time}</div>
      </div>
    </div>`).join('');

  container.innerHTML = `
    <div class="module-hero"><h2><i class="fas fa-bell" style="color:var(--warning)"></i> Notification & Event Engine</h2><p>Multi-channel notifications — Email, SMS, WhatsApp, Push, Webhooks, Slack/Discord with BullMQ queue and retry mechanism.</p></div>
    <div class="stats-grid">
      <div class="stat-card" onclick="window.viewChannel('1')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon blue"><i class="fas fa-envelope"></i></div></div><div class="stat-value">${s.emailsSent}</div><div class="stat-label">Emails Sent</div></div>
      <div class="stat-card" onclick="window.viewChannel('2')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-comment-sms"></i></div></div><div class="stat-value">${s.smsDelivered}</div><div class="stat-label">SMS Delivered</div></div>
      <div class="stat-card" onclick="window.viewChannel('3')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon cyan"><i class="fab fa-whatsapp"></i></div></div><div class="stat-value">${s.whatsappMessages}</div><div class="stat-label">WhatsApp Messages</div></div>
      <div class="stat-card" onclick="window.viewChannel('5')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon purple"><i class="fas fa-code"></i></div></div><div class="stat-value">${s.webhooksActive}</div><div class="stat-label">Webhooks Active</div></div>
    </div>
    <div class="grid-2"><div class="card"><div class="card-header"><span class="card-title">Notification Channels</span></div><div class="activity-list">${chHTML}</div></div><div class="card"><div class="card-header"><span class="card-title">Recent Notifications</span></div><div class="activity-list">${recHTML}</div></div></div>`;
};

/* Asset Management — reads from db */
pages.assets = function(container) {
  const s = db.table('assetStats').getAll()[0];
  const assets = db.table('assets').getAll();
  const rows = assets.map(a => `<tr><td style="font-family:var(--font-mono);font-size:12px;color:var(--accent-light)">${a.assetId}</td><td>${a.name}</td><td>${a.category}</td><td>${a.assignedTo}</td><td><span class="badge badge-${a.status==='In Use'?'success':'warning'}">${a.status}</span></td><td>${a.value}</td></tr>`).join('');

  container.innerHTML = `
    <div class="module-hero"><h2><i class="fas fa-laptop" style="color:var(--cyan)"></i> Asset Management</h2><p>Company assets tracking, device management, maintenance schedules, depreciation calculation, and QR code check-in.</p></div>
    <div class="stats-grid">
      <div class="stat-card" onclick="window.viewStatDetail('Assets', 'Total Assets')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon cyan"><i class="fas fa-laptop"></i></div></div><div class="stat-value">${s.totalAssets}</div><div class="stat-label">Total Assets</div></div>
      <div class="stat-card" onclick="window.viewStatDetail('Assets', 'In Use')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-circle-check"></i></div></div><div class="stat-value">${s.inUse}</div><div class="stat-label">In Use</div></div>
      <div class="stat-card" onclick="window.viewStatDetail('Assets', 'Maintenance')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon yellow"><i class="fas fa-wrench"></i></div></div><div class="stat-value">${s.underMaintenance}</div><div class="stat-label">Under Maintenance</div></div>
      <div class="stat-card" onclick="window.viewStatDetail('Assets', 'Retired Assets')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon red"><i class="fas fa-box-archive"></i></div></div><div class="stat-value">${s.retired}</div><div class="stat-label">Retired</div></div>
    </div>
    <div class="card"><div class="card-header"><span class="card-title">Asset Register</span><button class="btn btn-primary btn-sm"><i class="fas fa-plus"></i> Add Asset</button></div><div class="table-container"><table><thead><tr><th>Asset ID</th><th>Name</th><th>Category</th><th>Assigned To</th><th>Status</th><th>Value</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
};

/* Legal & Compliance — reads from db */
pages.legal = function(container) {
  const s = db.table('legalStats').getAll()[0];
  const contracts = db.table('contracts').getAll();
  const rows = contracts.map(c => `<tr><td style="font-weight:600">${c.title}</td><td>${c.party}</td><td>${c.type}</td><td>${c.startDate}</td><td>${c.endDate}</td><td><span class="badge badge-${c.status==='Active'?'success':'danger'}">${c.status}</span></td></tr>`).join('');

  container.innerHTML = `
    <div class="module-hero"><h2><i class="fas fa-gavel" style="color:var(--warning)"></i> Legal & Compliance</h2><p>Contract management, compliance workflows, legal approvals, document storage, and regulatory tracking.</p></div>
    <div class="stats-grid">
      <div class="stat-card" onclick="window.viewStatDetail('Legal', 'Active Contracts')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon yellow"><i class="fas fa-file-contract"></i></div></div><div class="stat-value">${s.activeContracts}</div><div class="stat-label">Active Contracts</div></div>
      <div class="stat-card" onclick="window.viewStatDetail('Legal', 'Compliance Status')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-check-double"></i></div></div><div class="stat-value">${s.gdprCompliant}</div><div class="stat-label">GDPR Compliant</div></div>
      <div class="stat-card" onclick="window.viewStatDetail('Legal', 'Expiring Soon')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon red"><i class="fas fa-clock"></i></div></div><div class="stat-value">${s.expiringSoon}</div><div class="stat-label">Expiring Soon</div></div>
      <div class="stat-card" onclick="window.viewStatDetail('Legal', 'Pending Legal Approvals')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon purple"><i class="fas fa-stamp"></i></div></div><div class="stat-value">${s.pendingApprovals}</div><div class="stat-label">Pending Approvals</div></div>
    </div>
    <div class="card"><div class="card-header"><span class="card-title">Contracts</span><button class="btn btn-primary btn-sm"><i class="fas fa-plus"></i> New Contract</button></div><div class="table-container"><table><thead><tr><th>Contract</th><th>Party</th><th>Type</th><th>Start</th><th>End</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
};
