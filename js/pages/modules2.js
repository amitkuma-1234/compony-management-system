/* CRM Page */
pages.crm = function(container) {
  container.innerHTML = `
    <div class="module-hero">
      <h2><i class="fas fa-handshake" style="color:var(--pink)"></i> Customer Relationship Management</h2>
      <p>Lead management, sales pipeline, customer analytics, support ticketing, and WhatsApp/email marketing integration.</p>
      <div class="page-actions" style="margin-top:16px">
        <button class="btn btn-primary btn-sm"><i class="fas fa-user-plus"></i> New Lead</button>
        <button class="btn btn-secondary btn-sm"><i class="fas fa-bullhorn"></i> Campaign</button>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon blue"><i class="fas fa-users"></i></div><span class="stat-trend up"><i class="fas fa-arrow-up"></i> 12%</span></div><div class="stat-value">284</div><div class="stat-label">Total Leads</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-trophy"></i></div></div><div class="stat-value">42</div><div class="stat-label">Won This Month</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon purple"><i class="fas fa-indian-rupee-sign"></i></div></div><div class="stat-value">₹1.2Cr</div><div class="stat-label">Pipeline Value</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon yellow"><i class="fas fa-percent"></i></div></div><div class="stat-value">68%</div><div class="stat-label">Win Rate</div></div>
    </div>
    <div class="card" style="margin-bottom:24px">
      <div class="card-header"><span class="card-title">Sales Pipeline</span></div>
      <div class="pipeline">
        <div class="pipeline-stage active"><div class="pipeline-stage-name">New Leads</div><div class="pipeline-stage-value">85</div><div class="pipeline-stage-count">₹28L value</div></div>
        <div class="pipeline-stage"><div class="pipeline-stage-name">Qualified</div><div class="pipeline-stage-value">62</div><div class="pipeline-stage-count">₹35L value</div></div>
        <div class="pipeline-stage"><div class="pipeline-stage-name">Proposal</div><div class="pipeline-stage-value">38</div><div class="pipeline-stage-count">₹42L value</div></div>
        <div class="pipeline-stage"><div class="pipeline-stage-name">Negotiation</div><div class="pipeline-stage-value">18</div><div class="pipeline-stage-count">₹25L value</div></div>
        <div class="pipeline-stage"><div class="pipeline-stage-name">Closed Won</div><div class="pipeline-stage-value">42</div><div class="pipeline-stage-count">₹1.2Cr value</div></div>
      </div>
    </div>
    <div class="grid-2">
      <div class="card">
        <div class="card-header"><span class="card-title">Pipeline Analysis</span></div>
        <div class="chart-container"><canvas data-chart="pipeline"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Recent Leads</span></div>
        <div class="activity-list">
          <div class="list-item"><div class="list-icon" style="background:rgba(59,130,246,0.12);color:var(--info)"><i class="fas fa-building"></i></div><div class="list-content"><div class="list-title">Tata Consulting Services</div><div class="list-subtitle">Enterprise License · ₹18L</div></div><span class="badge badge-info">New</span></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(168,85,247,0.12);color:var(--purple)"><i class="fas fa-building"></i></div><div class="list-content"><div class="list-title">Flipkart India</div><div class="list-subtitle">Custom Integration · ₹25L</div></div><span class="badge badge-purple">Qualified</span></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(245,158,11,0.12);color:var(--warning)"><i class="fas fa-building"></i></div><div class="list-content"><div class="list-title">Bajaj Finance</div><div class="list-subtitle">ERP Suite · ₹32L</div></div><span class="badge badge-warning">Proposal</span></div>
          <div class="list-item"><div class="list-icon" style="background:rgba(34,197,94,0.12);color:var(--success)"><i class="fas fa-building"></i></div><div class="list-content"><div class="list-title">Mahindra Group</div><div class="list-subtitle">Full Platform · ₹45L</div></div><span class="badge badge-success">Negotiation</span></div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">Support Tickets</span><span class="badge badge-warning">12 open</span></div>
      <div class="table-container"><table><thead><tr><th>Ticket</th><th>Customer</th><th>Subject</th><th>Priority</th><th>Status</th><th>Assigned</th></tr></thead>
      <tbody>
        <tr><td style="font-family:var(--font-mono);font-size:12px;color:var(--accent-light)">#TKT-1024</td><td>Infosys</td><td>API integration issue</td><td><span class="badge badge-danger">High</span></td><td><span class="badge badge-warning">In Progress</span></td><td>Rahul S.</td></tr>
        <tr><td style="font-family:var(--font-mono);font-size:12px;color:var(--accent-light)">#TKT-1023</td><td>Wipro</td><td>Dashboard loading slow</td><td><span class="badge badge-info">Medium</span></td><td><span class="badge badge-info">Open</span></td><td>Vikram K.</td></tr>
        <tr><td style="font-family:var(--font-mono);font-size:12px;color:var(--accent-light)">#TKT-1022</td><td>HCL Tech</td><td>Report export failing</td><td><span class="badge badge-warning">Medium</span></td><td><span class="badge badge-success">Resolved</span></td><td>Anita P.</td></tr>
      </tbody></table></div>
    </div>`;
};

/* Projects Page */
pages.projects = function(container) {
  container.innerHTML = `
    <div class="module-hero">
      <h2><i class="fas fa-diagram-project" style="color:var(--accent-light)"></i> Project Management</h2>
      <p>Agile workflows, Kanban boards, Gantt charts, sprint management, resource allocation, and budget tracking.</p>
      <div class="page-actions" style="margin-top:16px">
        <button class="btn btn-primary btn-sm"><i class="fas fa-plus"></i> New Project</button>
        <button class="btn btn-secondary btn-sm"><i class="fas fa-list-check"></i> My Tasks</button>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon indigo"><i class="fas fa-folder-open"></i></div></div><div class="stat-value">47</div><div class="stat-label">Active Projects</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-check-double"></i></div></div><div class="stat-value">189</div><div class="stat-label">Tasks Completed</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon yellow"><i class="fas fa-clock"></i></div></div><div class="stat-value">34</div><div class="stat-label">In Progress</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon red"><i class="fas fa-flag"></i></div></div><div class="stat-value">7</div><div class="stat-label">Overdue</div></div>
    </div>
    <div class="tabs"><div class="tab active" onclick="this.parentElement.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));this.classList.add('active')">Kanban Board</div><div class="tab" onclick="this.parentElement.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));this.classList.add('active')">Gantt Chart</div><div class="tab" onclick="this.parentElement.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));this.classList.add('active')">Sprint</div><div class="tab" onclick="this.parentElement.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));this.classList.add('active')">Timeline</div></div>
    <div class="kanban-board" style="margin-bottom:24px">
      <div class="kanban-column">
        <div class="kanban-column-header"><span class="kanban-column-title" style="color:var(--text-muted)">📋 Backlog</span><span class="kanban-count">4</span></div>
        <div class="kanban-cards">
          <div class="kanban-card"><div class="kanban-card-title">Design System Update</div><div class="kanban-card-meta"><span class="badge badge-info" style="font-size:10px">Design</span><div class="avatar-group"><div class="avatar">RS</div></div></div></div>
          <div class="kanban-card"><div class="kanban-card-title">API Rate Limiting</div><div class="kanban-card-meta"><span class="badge badge-purple" style="font-size:10px">Backend</span><div class="avatar-group"><div class="avatar">VK</div></div></div></div>
          <div class="kanban-card"><div class="kanban-card-title">Mobile App Wireframes</div><div class="kanban-card-meta"><span class="badge badge-info" style="font-size:10px">Design</span><div class="avatar-group"><div class="avatar">PS</div></div></div></div>
        </div>
      </div>
      <div class="kanban-column">
        <div class="kanban-column-header"><span class="kanban-column-title" style="color:var(--info)">🔄 In Progress</span><span class="kanban-count">3</span></div>
        <div class="kanban-cards">
          <div class="kanban-card" style="border-left:3px solid var(--info)"><div class="kanban-card-title">Payment Gateway Integration</div><div class="kanban-card-meta"><span class="badge badge-danger" style="font-size:10px">High</span><div class="avatar-group"><div class="avatar">AP</div><div class="avatar">RS</div></div></div></div>
          <div class="kanban-card" style="border-left:3px solid var(--info)"><div class="kanban-card-title">HR Dashboard Redesign</div><div class="kanban-card-meta"><span class="badge badge-warning" style="font-size:10px">Medium</span><div class="avatar-group"><div class="avatar">PS</div></div></div></div>
        </div>
      </div>
      <div class="kanban-column">
        <div class="kanban-column-header"><span class="kanban-column-title" style="color:var(--warning)">👀 Review</span><span class="kanban-count">2</span></div>
        <div class="kanban-cards">
          <div class="kanban-card" style="border-left:3px solid var(--warning)"><div class="kanban-card-title">Inventory Barcode Scanner</div><div class="kanban-card-meta"><span class="badge badge-success" style="font-size:10px">Feature</span><div class="avatar-group"><div class="avatar">VK</div></div></div></div>
          <div class="kanban-card" style="border-left:3px solid var(--warning)"><div class="kanban-card-title">Email Template Engine</div><div class="kanban-card-meta"><span class="badge badge-info" style="font-size:10px">Backend</span><div class="avatar-group"><div class="avatar">NK</div></div></div></div>
        </div>
      </div>
      <div class="kanban-column">
        <div class="kanban-column-header"><span class="kanban-column-title" style="color:var(--success)">✅ Done</span><span class="kanban-count">5</span></div>
        <div class="kanban-cards">
          <div class="kanban-card" style="border-left:3px solid var(--success);opacity:0.7"><div class="kanban-card-title">SSO Authentication</div><div class="kanban-card-meta"><span class="badge badge-success" style="font-size:10px">Complete</span><div class="avatar-group"><div class="avatar">RS</div></div></div></div>
          <div class="kanban-card" style="border-left:3px solid var(--success);opacity:0.7"><div class="kanban-card-title">Multi-currency Support</div><div class="kanban-card-meta"><span class="badge badge-success" style="font-size:10px">Complete</span><div class="avatar-group"><div class="avatar">AP</div></div></div></div>
        </div>
      </div>
    </div>
    <div class="grid-2">
      <div class="card"><div class="card-header"><span class="card-title">Sprint Burndown — Sprint 14</span></div><div class="chart-container"><canvas data-chart="sprint"></canvas></div></div>
      <div class="card">
        <div class="card-header"><span class="card-title">Project Timeline</span></div>
        <div style="padding-top:8px">
          <div class="gantt-row"><div class="gantt-label">ERP v3.2</div><div class="gantt-bar-container"><div class="gantt-bar" style="left:5%;width:60%;background:linear-gradient(90deg,var(--accent),var(--purple))">60%</div></div></div>
          <div class="gantt-row"><div class="gantt-label">Mobile App</div><div class="gantt-bar-container"><div class="gantt-bar" style="left:15%;width:35%;background:linear-gradient(90deg,var(--info),var(--cyan))">35%</div></div></div>
          <div class="gantt-row"><div class="gantt-label">AI Module</div><div class="gantt-bar-container"><div class="gantt-bar" style="left:25%;width:45%;background:linear-gradient(90deg,var(--pink),var(--purple))">45%</div></div></div>
          <div class="gantt-row"><div class="gantt-label">CRM Revamp</div><div class="gantt-bar-container"><div class="gantt-bar" style="left:0%;width:80%;background:linear-gradient(90deg,var(--success),var(--cyan))">80%</div></div></div>
          <div class="gantt-row"><div class="gantt-label">DevOps</div><div class="gantt-bar-container"><div class="gantt-bar" style="left:10%;width:90%;background:linear-gradient(90deg,var(--warning),var(--danger))">90%</div></div></div>
        </div>
      </div>
    </div>`;
};

/* AI Command Center */
pages['ai-center'] = function(container) {
  container.innerHTML = `
    <div class="module-hero" style="background:linear-gradient(135deg,rgba(99,102,241,0.1),rgba(168,85,247,0.1))">
      <h2><i class="fas fa-brain" style="color:var(--purple)"></i> AI Command Center</h2>
      <p>Demand forecasting, anomaly detection, intelligent approvals, predictive analytics, and AI-generated business insights.</p>
      <div class="page-actions" style="margin-top:16px">
        <button class="btn btn-primary btn-sm"><i class="fas fa-wand-magic-sparkles"></i> Run AI Analysis</button>
        <button class="btn btn-secondary btn-sm"><i class="fas fa-robot"></i> Chat with AI</button>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon purple"><i class="fas fa-brain"></i></div></div><div class="stat-value">156</div><div class="stat-label">AI Models Active</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-bullseye"></i></div></div><div class="stat-value">94.2%</div><div class="stat-label">Forecast Accuracy</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon cyan"><i class="fas fa-bolt"></i></div></div><div class="stat-value">1,247</div><div class="stat-label">Predictions Today</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon pink"><i class="fas fa-shield-halved"></i></div></div><div class="stat-value">23</div><div class="stat-label">Anomalies Detected</div></div>
    </div>
    <div class="grid-3">
      <div class="card" style="border-color:rgba(99,102,241,0.3)">
        <div style="text-align:center;padding:20px 0"><div style="width:60px;height:60px;border-radius:16px;background:linear-gradient(135deg,var(--accent),var(--purple));display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:24px;color:#fff"><i class="fas fa-chart-line"></i></div><h3 style="font-size:16px;margin-bottom:6px">Demand Forecasting</h3><p style="font-size:13px;color:var(--text-secondary)">LSTM & Prophet models for accurate predictions</p><div style="margin-top:16px"><span class="badge badge-success">Active</span></div></div>
      </div>
      <div class="card" style="border-color:rgba(236,72,153,0.3)">
        <div style="text-align:center;padding:20px 0"><div style="width:60px;height:60px;border-radius:16px;background:linear-gradient(135deg,var(--pink),var(--danger));display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:24px;color:#fff"><i class="fas fa-triangle-exclamation"></i></div><h3 style="font-size:16px;margin-bottom:6px">Anomaly Detection</h3><p style="font-size:13px;color:var(--text-secondary)">Real-time fraud & anomaly detection engine</p><div style="margin-top:16px"><span class="badge badge-success">Active</span></div></div>
      </div>
      <div class="card" style="border-color:rgba(6,182,212,0.3)">
        <div style="text-align:center;padding:20px 0"><div style="width:60px;height:60px;border-radius:16px;background:linear-gradient(135deg,var(--cyan),var(--info));display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:24px;color:#fff"><i class="fas fa-robot"></i></div><h3 style="font-size:16px;margin-bottom:6px">AI Assistant</h3><p style="font-size:13px;color:var(--text-secondary)">Natural language business intelligence</p><div style="margin-top:16px"><span class="badge badge-success">Active</span></div></div>
      </div>
    </div>
    <div class="grid-2">
      <div class="card">
        <div class="card-header"><span class="card-title">AI-Generated Insights</span><span class="badge badge-purple">Last 24h</span></div>
        <div class="activity-list">
          <div class="activity-item"><div class="activity-dot purple"></div><div><div class="activity-text">📈 <strong>Revenue Prediction:</strong> Q3 2026 projected at ₹2.4 Crore (+18% YoY)</div><div class="activity-time">AI Confidence: 94%</div></div></div>
          <div class="activity-item"><div class="activity-dot red"></div><div><div class="activity-text">🚨 <strong>Anomaly Alert:</strong> Unusual expense pattern detected in Marketing dept</div><div class="activity-time">AI Confidence: 87%</div></div></div>
          <div class="activity-item"><div class="activity-dot green"></div><div><div class="activity-text">✅ <strong>Recommendation:</strong> Reorder SKU-0089 (Dell Monitor) — predicted stockout in 3 days</div><div class="activity-time">AI Confidence: 92%</div></div></div>
          <div class="activity-item"><div class="activity-dot blue"></div><div><div class="activity-text">💡 <strong>Optimization:</strong> Shift 2 engineers from Project A to B for 15% faster delivery</div><div class="activity-time">AI Confidence: 89%</div></div></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Revenue Forecast</span></div>
        <div class="chart-container"><canvas data-chart="revenue"></canvas></div>
      </div>
    </div>`;
};
