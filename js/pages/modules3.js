/* Analytics & BI Page */
pages.analytics = function(container) {
  container.innerHTML = `
    <div class="module-hero">
      <h2><i class="fas fa-chart-line" style="color:var(--info)"></i> Analytics & Business Intelligence</h2>
      <p>Interactive dashboards, KPI tracking, drill-down analytics, scheduled reports, and AI-generated natural language insights.</p>
      <div class="page-actions" style="margin-top:16px">
        <button class="btn btn-primary btn-sm"><i class="fas fa-plus"></i> New Dashboard</button>
        <button class="btn btn-secondary btn-sm"><i class="fas fa-file-pdf"></i> Export PDF</button>
        <button class="btn btn-secondary btn-sm"><i class="fas fa-file-excel"></i> Export Excel</button>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon blue"><i class="fas fa-chart-pie"></i></div></div><div class="stat-value">12</div><div class="stat-label">Active Dashboards</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-file-lines"></i></div></div><div class="stat-value">248</div><div class="stat-label">Reports Generated</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon purple"><i class="fas fa-database"></i></div></div><div class="stat-value">1.2TB</div><div class="stat-label">Data Processed</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon cyan"><i class="fas fa-clock-rotate-left"></i></div></div><div class="stat-value">45ms</div><div class="stat-label">Avg Query Time</div></div>
    </div>
    <div class="grid-2">
      <div class="card"><div class="card-header"><span class="card-title">Revenue Trends</span></div><div class="chart-container"><canvas data-chart="revenue"></canvas></div></div>
      <div class="card"><div class="card-header"><span class="card-title">Department Performance</span></div><div class="chart-container"><canvas data-chart="bar"></canvas></div></div>
    </div>
    <div class="grid-2">
      <div class="card"><div class="card-header"><span class="card-title">Resource Allocation</span></div><div class="chart-container"><canvas data-chart="doughnut"></canvas></div></div>
      <div class="card">
        <div class="card-header"><span class="card-title">Scheduled Reports</span></div>
        <div class="activity-list">
          <div class="list-item"><div class="list-icon" style="background:rgba(59,130,246,0.12);color:var(--info)"><i class="fas fa-file-pdf"></i></div><div class="list-content"><div class="list-title">Monthly Financial Summary</div><div class="list-subtitle">Every 1st · PDF · 12 recipients</div></div><span class="badge badge-success">Active</span></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(34,197,94,0.12);color:var(--success)"><i class="fas fa-file-excel"></i></div><div class="list-content"><div class="list-title">Weekly HR Report</div><div class="list-subtitle">Every Monday · Excel · 5 recipients</div></div><span class="badge badge-success">Active</span></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(168,85,247,0.12);color:var(--purple)"><i class="fas fa-chart-bar"></i></div><div class="list-content"><div class="list-title">Sales Pipeline Report</div><div class="list-subtitle">Daily · Dashboard · 8 recipients</div></div><span class="badge badge-success">Active</span></div>
        </div>
      </div>
    </div>`;
};

/* Auth & Security Page */
pages.auth = function(container) {
  container.innerHTML = `
    <div class="module-hero">
      <h2><i class="fas fa-shield-halved" style="color:var(--success)"></i> Authentication & Security</h2>
      <p>Multi-tenant RBAC, MFA/SSO, JWT security, OWASP protection, audit logging, and AI threat detection.</p>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-shield-check"></i></div></div><div class="stat-value">99.9%</div><div class="stat-label">Security Score</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon blue"><i class="fas fa-users"></i></div></div><div class="stat-value">162</div><div class="stat-label">Active Users</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon red"><i class="fas fa-ban"></i></div></div><div class="stat-value">47</div><div class="stat-label">Threats Blocked</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon purple"><i class="fas fa-key"></i></div></div><div class="stat-value">MFA</div><div class="stat-label">Auth Method</div></div>
    </div>
    <div class="grid-2">
      <div class="card">
        <div class="card-header"><span class="card-title">Security Features</span></div>
        <div class="activity-list">
          <div class="list-item"><div class="list-icon" style="background:rgba(34,197,94,0.12);color:var(--success)"><i class="fas fa-check"></i></div><div class="list-content"><div class="list-title">Multi-Factor Authentication</div><div class="list-subtitle">TOTP, SMS, Email verification</div></div><span class="badge badge-success">Enabled</span></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(34,197,94,0.12);color:var(--success)"><i class="fas fa-check"></i></div><div class="list-content"><div class="list-title">SSO / OIDC / SAML</div><div class="list-subtitle">Google, Microsoft, Keycloak</div></div><span class="badge badge-success">Enabled</span></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(34,197,94,0.12);color:var(--success)"><i class="fas fa-check"></i></div><div class="list-content"><div class="list-title">Role-Based Access Control</div><div class="list-subtitle">5 roles, 48 permissions</div></div><span class="badge badge-success">Enabled</span></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(34,197,94,0.12);color:var(--success)"><i class="fas fa-check"></i></div><div class="list-content"><div class="list-title">Rate Limiting & DDoS Protection</div><div class="list-subtitle">100 req/min per user</div></div><span class="badge badge-success">Enabled</span></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(245,158,11,0.12);color:var(--warning)"><i class="fas fa-clock"></i></div><div class="list-content"><div class="list-title">Device Fingerprinting</div><div class="list-subtitle">Behavioral analytics</div></div><span class="badge badge-warning">Planned</span></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Recent Audit Logs</span></div>
        <div class="activity-list">
          <div class="activity-item"><div class="activity-dot green"></div><div><div class="activity-text"><strong>Login:</strong> Amit Kumar from Chrome/Windows</div><div class="activity-time">2 min ago · 192.168.1.10</div></div></div>
          <div class="activity-item"><div class="activity-dot blue"></div><div><div class="activity-text"><strong>Permission:</strong> Role 'Manager' updated by Admin</div><div class="activity-time">15 min ago</div></div></div>
          <div class="activity-item"><div class="activity-dot red"></div><div><div class="activity-text"><strong>Blocked:</strong> Failed login from 103.45.67.89</div><div class="activity-time">1 hour ago</div></div></div>
          <div class="activity-item"><div class="activity-dot yellow"></div><div><div class="activity-text"><strong>MFA:</strong> Enabled for user Priya Sharma</div><div class="activity-time">3 hours ago</div></div></div>
          <div class="activity-item"><div class="activity-dot green"></div><div><div class="activity-text"><strong>API Key:</strong> New key generated for Integration</div><div class="activity-time">5 hours ago</div></div></div>
        </div>
      </div>
    </div>`;
};

/* Notifications Page */
pages.notifications = function(container) {
  container.innerHTML = `
    <div class="module-hero">
      <h2><i class="fas fa-bell" style="color:var(--warning)"></i> Notification & Event Engine</h2>
      <p>Multi-channel notifications — Email, SMS, WhatsApp, Push, Webhooks, Slack/Discord with BullMQ queue and retry mechanism.</p>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon blue"><i class="fas fa-envelope"></i></div></div><div class="stat-value">2,847</div><div class="stat-label">Emails Sent</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-comment-sms"></i></div></div><div class="stat-value">456</div><div class="stat-label">SMS Delivered</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon cyan"><i class="fab fa-whatsapp"></i></div></div><div class="stat-value">189</div><div class="stat-label">WhatsApp Messages</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon purple"><i class="fas fa-code"></i></div></div><div class="stat-value">34</div><div class="stat-label">Webhooks Active</div></div>
    </div>
    <div class="grid-2">
      <div class="card">
        <div class="card-header"><span class="card-title">Notification Channels</span></div>
        <div class="activity-list">
          <div class="list-item"><div class="list-icon" style="background:rgba(59,130,246,0.12);color:var(--info)"><i class="fas fa-envelope"></i></div><div class="list-content"><div class="list-title">Email (SMTP)</div><div class="list-subtitle">SendGrid integration · 99.2% delivery</div></div><span class="badge badge-success">Active</span></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(34,197,94,0.12);color:var(--success)"><i class="fas fa-comment-sms"></i></div><div class="list-content"><div class="list-title">SMS Gateway</div><div class="list-subtitle">Twilio · OTP & alerts</div></div><span class="badge badge-success">Active</span></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(6,182,212,0.12);color:var(--cyan)"><i class="fab fa-whatsapp"></i></div><div class="list-content"><div class="list-title">WhatsApp Business</div><div class="list-subtitle">Meta Cloud API</div></div><span class="badge badge-success">Active</span></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(168,85,247,0.12);color:var(--purple)"><i class="fab fa-slack"></i></div><div class="list-content"><div class="list-title">Slack Integration</div><div class="list-subtitle">Workspace notifications</div></div><span class="badge badge-success">Active</span></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(99,102,241,0.12);color:var(--accent)"><i class="fab fa-discord"></i></div><div class="list-content"><div class="list-title">Discord Webhooks</div><div class="list-subtitle">Dev team alerts</div></div><span class="badge badge-info">Config</span></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Recent Notifications</span></div>
        <div class="activity-list">
          <div class="activity-item"><div class="activity-dot green"></div><div><div class="activity-text">📧 Invoice #INV-2847 sent to Infosys via Email</div><div class="activity-time">2 min ago · Delivered</div></div></div>
          <div class="activity-item"><div class="activity-dot blue"></div><div><div class="activity-text">💬 OTP sent to +91-98765xxxxx via SMS</div><div class="activity-time">10 min ago · Delivered</div></div></div>
          <div class="activity-item"><div class="activity-dot purple"></div><div><div class="activity-text">🔔 Leave approval notification via WhatsApp</div><div class="activity-time">30 min ago · Read</div></div></div>
          <div class="activity-item"><div class="activity-dot yellow"></div><div><div class="activity-text">⚡ Webhook triggered: inventory.stock.low</div><div class="activity-time">1 hour ago · 200 OK</div></div></div>
        </div>
      </div>
    </div>`;
};

/* Asset Management Page */
pages.assets = function(container) {
  container.innerHTML = `
    <div class="module-hero">
      <h2><i class="fas fa-laptop" style="color:var(--cyan)"></i> Asset Management</h2>
      <p>Company assets tracking, device management, maintenance schedules, depreciation calculation, and QR code check-in.</p>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon cyan"><i class="fas fa-laptop"></i></div></div><div class="stat-value">342</div><div class="stat-label">Total Assets</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-circle-check"></i></div></div><div class="stat-value">298</div><div class="stat-label">In Use</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon yellow"><i class="fas fa-wrench"></i></div></div><div class="stat-value">18</div><div class="stat-label">Under Maintenance</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon red"><i class="fas fa-box-archive"></i></div></div><div class="stat-value">26</div><div class="stat-label">Retired</div></div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">Asset Register</span><button class="btn btn-primary btn-sm"><i class="fas fa-plus"></i> Add Asset</button></div>
      <div class="table-container"><table><thead><tr><th>Asset ID</th><th>Name</th><th>Category</th><th>Assigned To</th><th>Status</th><th>Value</th></tr></thead>
      <tbody>
        <tr><td style="font-family:var(--font-mono);font-size:12px;color:var(--accent-light)">AST-001</td><td>MacBook Pro 16" M3</td><td>Laptop</td><td>Rahul Singh</td><td><span class="badge badge-success">In Use</span></td><td>₹2,49,900</td></tr>
        <tr><td style="font-family:var(--font-mono);font-size:12px;color:var(--accent-light)">AST-002</td><td>Dell UltraSharp 32"</td><td>Monitor</td><td>Anita Patel</td><td><span class="badge badge-success">In Use</span></td><td>₹52,000</td></tr>
        <tr><td style="font-family:var(--font-mono);font-size:12px;color:var(--accent-light)">AST-003</td><td>Herman Miller Aeron</td><td>Furniture</td><td>Conference Room B</td><td><span class="badge badge-success">In Use</span></td><td>₹1,25,000</td></tr>
        <tr><td style="font-family:var(--font-mono);font-size:12px;color:var(--accent-light)">AST-004</td><td>Epson Projector</td><td>AV Equipment</td><td>—</td><td><span class="badge badge-warning">Maintenance</span></td><td>₹85,000</td></tr>
      </tbody></table></div>
    </div>`;
};

/* Legal & Compliance */
pages.legal = function(container) {
  container.innerHTML = `
    <div class="module-hero">
      <h2><i class="fas fa-gavel" style="color:var(--warning)"></i> Legal & Compliance</h2>
      <p>Contract management, compliance workflows, legal approvals, document storage, and regulatory tracking.</p>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon yellow"><i class="fas fa-file-contract"></i></div></div><div class="stat-value">86</div><div class="stat-label">Active Contracts</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-check-double"></i></div></div><div class="stat-value">100%</div><div class="stat-label">GDPR Compliant</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon red"><i class="fas fa-clock"></i></div></div><div class="stat-value">3</div><div class="stat-label">Expiring Soon</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon purple"><i class="fas fa-stamp"></i></div></div><div class="stat-value">12</div><div class="stat-label">Pending Approvals</div></div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">Contracts</span><button class="btn btn-primary btn-sm"><i class="fas fa-plus"></i> New Contract</button></div>
      <div class="table-container"><table><thead><tr><th>Contract</th><th>Party</th><th>Type</th><th>Start</th><th>End</th><th>Status</th></tr></thead>
      <tbody>
        <tr><td style="font-weight:600">Master Service Agreement</td><td>Infosys Ltd</td><td>Service</td><td>Jan 2025</td><td>Dec 2026</td><td><span class="badge badge-success">Active</span></td></tr>
        <tr><td style="font-weight:600">NDA — CloudHost</td><td>CloudHost Inc</td><td>NDA</td><td>Mar 2026</td><td>Mar 2027</td><td><span class="badge badge-success">Active</span></td></tr>
        <tr><td style="font-weight:600">Vendor Agreement</td><td>TechSupply Co</td><td>Vendor</td><td>Jun 2025</td><td>Jun 2026</td><td><span class="badge badge-danger">Expiring</span></td></tr>
      </tbody></table></div>
    </div>`;
};
