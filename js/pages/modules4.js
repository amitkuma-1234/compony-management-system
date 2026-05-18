/* E-Commerce Page */
pages.ecommerce = function(container) {
  container.innerHTML = `
    <div class="module-hero">
      <h2><i class="fas fa-cart-shopping" style="color:var(--success)"></i> E-Commerce Integration</h2>
      <p>Shopify, WooCommerce, and marketplace API integrations with unified order management and inventory sync.</p>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-shopping-bag"></i></div><span class="stat-trend up"><i class="fas fa-arrow-up"></i> 24%</span></div><div class="stat-value">1,842</div><div class="stat-label">Orders This Month</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon blue"><i class="fas fa-indian-rupee-sign"></i></div></div><div class="stat-value">₹38.5L</div><div class="stat-label">E-Com Revenue</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon purple"><i class="fas fa-store"></i></div></div><div class="stat-value">3</div><div class="stat-label">Connected Stores</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon yellow"><i class="fas fa-rotate"></i></div></div><div class="stat-value">Real-time</div><div class="stat-label">Sync Status</div></div>
    </div>
    <div class="grid-3">
      <div class="card" style="border-color:rgba(34,197,94,0.3)"><div style="text-align:center;padding:20px"><div style="width:50px;height:50px;border-radius:12px;background:rgba(34,197,94,0.12);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:22px;color:var(--success)"><i class="fab fa-shopify"></i></div><h3 style="font-size:15px;margin-bottom:4px">Shopify</h3><p style="font-size:12px;color:var(--text-muted)">842 products synced</p><span class="badge badge-success" style="margin-top:8px">Connected</span></div></div>
      <div class="card" style="border-color:rgba(168,85,247,0.3)"><div style="text-align:center;padding:20px"><div style="width:50px;height:50px;border-radius:12px;background:rgba(168,85,247,0.12);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:22px;color:var(--purple)"><i class="fab fa-wordpress"></i></div><h3 style="font-size:15px;margin-bottom:4px">WooCommerce</h3><p style="font-size:12px;color:var(--text-muted)">356 products synced</p><span class="badge badge-success" style="margin-top:8px">Connected</span></div></div>
      <div class="card" style="border-color:rgba(245,158,11,0.3)"><div style="text-align:center;padding:20px"><div style="width:50px;height:50px;border-radius:12px;background:rgba(245,158,11,0.12);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:22px;color:var(--warning)"><i class="fab fa-amazon"></i></div><h3 style="font-size:15px;margin-bottom:4px">Amazon Marketplace</h3><p style="font-size:12px;color:var(--text-muted)">289 products synced</p><span class="badge badge-success" style="margin-top:8px">Connected</span></div></div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">Recent Orders</span></div>
      <div class="table-container"><table><thead><tr><th>Order ID</th><th>Platform</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead>
      <tbody>
        <tr><td style="font-family:var(--font-mono);font-size:12px;color:var(--accent-light)">#ORD-4521</td><td><span class="badge badge-success"><i class="fab fa-shopify"></i> Shopify</span></td><td>Rajesh Gupta</td><td>₹4,299</td><td><span class="badge badge-success">Delivered</span></td></tr>
        <tr><td style="font-family:var(--font-mono);font-size:12px;color:var(--accent-light)">#ORD-4520</td><td><span class="badge badge-purple"><i class="fab fa-wordpress"></i> WooCommerce</span></td><td>Sneha Reddy</td><td>₹12,500</td><td><span class="badge badge-info">Shipped</span></td></tr>
        <tr><td style="font-family:var(--font-mono);font-size:12px;color:var(--accent-light)">#ORD-4519</td><td><span class="badge badge-warning"><i class="fab fa-amazon"></i> Amazon</span></td><td>Karan Mehta</td><td>₹8,999</td><td><span class="badge badge-warning">Processing</span></td></tr>
      </tbody></table></div>
    </div>`;
};

/* Communication Page */
pages.communication = function(container) {
  container.innerHTML = `
    <div class="module-hero">
      <h2><i class="fas fa-comments" style="color:var(--info)"></i> Internal Communication</h2>
      <p>Team chat, video meetings, company announcements, knowledge base, and SOP documentation portal.</p>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon blue"><i class="fas fa-message"></i></div></div><div class="stat-value">1,245</div><div class="stat-label">Messages Today</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-video"></i></div></div><div class="stat-value">8</div><div class="stat-label">Active Meetings</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon purple"><i class="fas fa-bullhorn"></i></div></div><div class="stat-value">3</div><div class="stat-label">Announcements</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon cyan"><i class="fas fa-book"></i></div></div><div class="stat-value">124</div><div class="stat-label">Wiki Articles</div></div>
    </div>
    <div class="grid-2">
      <div class="card">
        <div class="card-header"><span class="card-title">Team Channels</span><button class="btn btn-primary btn-sm"><i class="fas fa-plus"></i> New Channel</button></div>
        <div class="activity-list">
          <div class="list-item"><div class="list-icon" style="background:rgba(59,130,246,0.12);color:var(--info)"><i class="fas fa-hashtag"></i></div><div class="list-content"><div class="list-title">#general</div><div class="list-subtitle">Company-wide discussions · 162 members</div></div><span class="nav-count" style="background:var(--info)">24</span></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(34,197,94,0.12);color:var(--success)"><i class="fas fa-hashtag"></i></div><div class="list-content"><div class="list-title">#engineering</div><div class="list-subtitle">Tech discussions · 48 members</div></div><span class="nav-count" style="background:var(--success)">12</span></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(236,72,153,0.12);color:var(--pink)"><i class="fas fa-hashtag"></i></div><div class="list-content"><div class="list-title">#sales</div><div class="list-subtitle">Sales pipeline updates · 32 members</div></div><span class="nav-count" style="background:var(--pink)">5</span></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(168,85,247,0.12);color:var(--purple)"><i class="fas fa-hashtag"></i></div><div class="list-content"><div class="list-title">#random</div><div class="list-subtitle">Fun & culture · 162 members</div></div></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Company Announcements</span></div>
        <div class="activity-list">
          <div class="activity-item"><div class="activity-dot blue"></div><div><div class="activity-text">📢 <strong>Town Hall Meeting</strong> — Friday 4 PM, all hands deck</div><div class="activity-time">Posted by CEO · 2 hours ago</div></div></div>
          <div class="activity-item"><div class="activity-dot green"></div><div><div class="activity-text">🎉 <strong>Q2 Results:</strong> Revenue target exceeded by 18%!</div><div class="activity-time">Posted by Finance · Yesterday</div></div></div>
          <div class="activity-item"><div class="activity-dot purple"></div><div><div class="activity-text">🚀 <strong>New Feature:</strong> AI Assistant now available for all employees</div><div class="activity-time">Posted by Engineering · 2 days ago</div></div></div>
        </div>
      </div>
    </div>`;
};

/* DevOps Page */
pages.devops = function(container) {
  container.innerHTML = `
    <div class="module-hero">
      <h2><i class="fas fa-server" style="color:var(--cyan)"></i> DevOps & Deployment</h2>
      <p>CI/CD pipelines, Docker/Kubernetes, Terraform IaC, ArgoCD GitOps, and Prometheus/Grafana monitoring.</p>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-circle-check"></i></div></div><div class="stat-value">99.98%</div><div class="stat-label">Uptime</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon blue"><i class="fas fa-code-branch"></i></div></div><div class="stat-value">847</div><div class="stat-label">Deployments</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon cyan"><i class="fas fa-cubes"></i></div></div><div class="stat-value">24</div><div class="stat-label">Active Pods</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon purple"><i class="fas fa-gauge-high"></i></div></div><div class="stat-value">45ms</div><div class="stat-label">Avg Latency</div></div>
    </div>
    <div class="grid-2">
      <div class="card">
        <div class="card-header"><span class="card-title">CI/CD Pipeline Status</span></div>
        <div class="activity-list">
          <div class="list-item"><div class="list-icon" style="background:rgba(34,197,94,0.12);color:var(--success)"><i class="fas fa-check-circle"></i></div><div class="list-content"><div class="list-title">Build #847 — main</div><div class="list-subtitle">Deployed to production · 5 min ago</div></div><span class="badge badge-success">Passed</span></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(34,197,94,0.12);color:var(--success)"><i class="fas fa-check-circle"></i></div><div class="list-content"><div class="list-title">Build #846 — feature/ai-module</div><div class="list-subtitle">Deployed to staging · 1 hour ago</div></div><span class="badge badge-success">Passed</span></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(239,68,68,0.12);color:var(--danger)"><i class="fas fa-times-circle"></i></div><div class="list-content"><div class="list-title">Build #845 — fix/auth-bug</div><div class="list-subtitle">Test failed · 2 hours ago</div></div><span class="badge badge-danger">Failed</span></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(34,197,94,0.12);color:var(--success)"><i class="fas fa-check-circle"></i></div><div class="list-content"><div class="list-title">Build #844 — main</div><div class="list-subtitle">Production · 5 hours ago</div></div><span class="badge badge-success">Passed</span></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Infrastructure Stack</span></div>
        <div class="activity-list">
          <div class="list-item"><div class="list-icon" style="background:rgba(6,182,212,0.12);color:var(--cyan)"><i class="fab fa-docker"></i></div><div class="list-content"><div class="list-title">Docker</div><div class="list-subtitle">24 containers running</div></div><span class="badge badge-success">Healthy</span></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(59,130,246,0.12);color:var(--info)"><i class="fas fa-dharmachakra"></i></div><div class="list-content"><div class="list-title">Kubernetes (EKS)</div><div class="list-subtitle">3 nodes, 24 pods</div></div><span class="badge badge-success">Healthy</span></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(168,85,247,0.12);color:var(--purple)"><i class="fas fa-cloud"></i></div><div class="list-content"><div class="list-title">Terraform</div><div class="list-subtitle">42 resources managed</div></div><span class="badge badge-success">Synced</span></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(245,158,11,0.12);color:var(--warning)"><i class="fas fa-chart-area"></i></div><div class="list-content"><div class="list-title">Prometheus + Grafana</div><div class="list-subtitle">156 metrics tracked</div></div><span class="badge badge-success">Active</span></div>
        </div>
      </div>
    </div>`;
};

/* Settings Page */
pages.settings = function(container) {
  container.innerHTML = `
    <div class="module-hero">
      <h2><i class="fas fa-gear" style="color:var(--text-secondary)"></i> Platform Settings</h2>
      <p>Company configuration, user management, integrations, billing, and system preferences.</p>
    </div>
    <div class="grid-3">
      <div class="card" style="cursor:pointer"><div style="text-align:center;padding:16px"><div style="width:48px;height:48px;border-radius:12px;background:rgba(99,102,241,0.12);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:20px;color:var(--accent)"><i class="fas fa-building"></i></div><h3 style="font-size:14px">Company Profile</h3><p style="font-size:12px;color:var(--text-muted);margin-top:4px">Name, logo, address</p></div></div>
      <div class="card" style="cursor:pointer"><div style="text-align:center;padding:16px"><div style="width:48px;height:48px;border-radius:12px;background:rgba(34,197,94,0.12);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:20px;color:var(--success)"><i class="fas fa-users-gear"></i></div><h3 style="font-size:14px">User Management</h3><p style="font-size:12px;color:var(--text-muted);margin-top:4px">Roles & permissions</p></div></div>
      <div class="card" style="cursor:pointer"><div style="text-align:center;padding:16px"><div style="width:48px;height:48px;border-radius:12px;background:rgba(168,85,247,0.12);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:20px;color:var(--purple)"><i class="fas fa-puzzle-piece"></i></div><h3 style="font-size:14px">Integrations</h3><p style="font-size:12px;color:var(--text-muted);margin-top:4px">APIs & webhooks</p></div></div>
      <div class="card" style="cursor:pointer"><div style="text-align:center;padding:16px"><div style="width:48px;height:48px;border-radius:12px;background:rgba(245,158,11,0.12);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:20px;color:var(--warning)"><i class="fas fa-credit-card"></i></div><h3 style="font-size:14px">Billing & Plans</h3><p style="font-size:12px;color:var(--text-muted);margin-top:4px">Subscription management</p></div></div>
      <div class="card" style="cursor:pointer"><div style="text-align:center;padding:16px"><div style="width:48px;height:48px;border-radius:12px;background:rgba(236,72,153,0.12);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:20px;color:var(--pink)"><i class="fas fa-palette"></i></div><h3 style="font-size:14px">Appearance</h3><p style="font-size:12px;color:var(--text-muted);margin-top:4px">Theme & branding</p></div></div>
      <div class="card" style="cursor:pointer"><div style="text-align:center;padding:16px"><div style="width:48px;height:48px;border-radius:12px;background:rgba(6,182,212,0.12);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:20px;color:var(--cyan)"><i class="fas fa-database"></i></div><h3 style="font-size:14px">Data & Backup</h3><p style="font-size:12px;color:var(--text-muted);margin-top:4px">Export & restore</p></div></div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">System Information</span></div>
      <div class="table-container"><table>
      <tbody>
        <tr><td style="font-weight:600;width:200px">Platform Version</td><td>Amdox ERP v3.2.1</td></tr>
        <tr><td style="font-weight:600">Tenant</td><td>Amdox Technologies Pvt Ltd</td></tr>
        <tr><td style="font-weight:600">Plan</td><td><span class="badge badge-purple">Enterprise</span></td></tr>
        <tr><td style="font-weight:600">Users</td><td>162 / Unlimited</td></tr>
        <tr><td style="font-weight:600">Storage</td><td>234 GB / 500 GB</td></tr>
        <tr><td style="font-weight:600">API Calls (Monthly)</td><td>1.2M / 5M</td></tr>
        <tr><td style="font-weight:600">Last Backup</td><td>May 18, 2026 · 02:00 AM IST</td></tr>
      </tbody></table></div>
    </div>`;
};
