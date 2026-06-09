/* CRM Page */
pages.crm = function(container) {
  container.innerHTML = `
    <div class="module-hero">
      <h2><i class="fas fa-handshake" style="color:var(--pink)"></i> Customer Relationship Management</h2>
      <p>Lead management, sales pipeline, customer analytics, support ticketing, and WhatsApp/email marketing integration.</p>
      <div class="page-actions" style="margin-top:16px">
        <button class="btn btn-primary btn-sm" id="crm-add-btn"><i class="fas fa-user-plus"></i> New Lead</button>
        <button class="btn btn-secondary btn-sm" id="crm-campaign-btn"><i class="fas fa-bullhorn"></i> Campaign</button>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card" id="crm-stat-total"><div class="stat-card-header"><div class="stat-icon blue"><i class="fas fa-users"></i></div><span class="stat-trend up"><i class="fas fa-arrow-up"></i> 12%</span></div><div class="stat-value" id="crm-stats-total">—</div><div class="stat-label">Total Leads</div></div>
      <div class="stat-card" id="crm-stat-won"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-trophy"></i></div></div><div class="stat-value" id="crm-stats-won">—</div><div class="stat-label">Won This Month</div></div>
      <div class="stat-card" id="crm-stat-value"><div class="stat-card-header"><div class="stat-icon purple"><i class="fas fa-indian-rupee-sign"></i></div></div><div class="stat-value" id="crm-stats-value">—</div><div class="stat-label">Pipeline Value</div></div>
      <div class="stat-card" id="crm-stat-rate"><div class="stat-card-header"><div class="stat-icon yellow"><i class="fas fa-percent"></i></div></div><div class="stat-value">68%</div><div class="stat-label">Win Rate</div></div>
    </div>
    <div class="card" style="margin-bottom:24px">
      <div class="card-header"><span class="card-title">Sales Pipeline</span></div>
      <div class="pipeline" id="crm-pipeline-stages">
        <div class="pipeline-stage"><div class="pipeline-stage-name">New Leads</div><div class="pipeline-stage-value">—</div><div class="pipeline-stage-count">₹0L value</div></div>
        <div class="pipeline-stage"><div class="pipeline-stage-name">Qualified</div><div class="pipeline-stage-value">—</div><div class="pipeline-stage-count">₹0L value</div></div>
        <div class="pipeline-stage"><div class="pipeline-stage-name">Proposal</div><div class="pipeline-stage-value">—</div><div class="pipeline-stage-count">₹0L value</div></div>
        <div class="pipeline-stage"><div class="pipeline-stage-name">Negotiation</div><div class="pipeline-stage-value">—</div><div class="pipeline-stage-count">₹0L value</div></div>
        <div class="pipeline-stage"><div class="pipeline-stage-name">Closed Won</div><div class="pipeline-stage-value">—</div><div class="pipeline-stage-count">₹0L value</div></div>
      </div>
    </div>
    <div class="grid-2" style="margin-bottom:24px">
      <div class="card">
        <div class="card-header"><span class="card-title">Pipeline Analysis</span></div>
        <div class="chart-container"><canvas data-chart="pipeline"></canvas></div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Lead Directory</span></div>
        <div class="table-container" style="max-height: 280px; overflow-y: auto;">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Contact</th>
                <th>Value</th>
                <th>Stage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="crm-leads-tbody">
              <tr><td colspan="5" style="text-align:center;padding:40px;color:var(--text-muted)"><i class="fas fa-spinner fa-spin"></i> Loading leads...</td></tr>
            </tbody>
          </table>
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

  const LS_LEADS_KEY = 'amdox_leads';
  const SEED_LEADS = [
    { id: 1, company: 'Tata Consulting Services', contact: 'Arun Mehta', value: 1800000, stage: 'New' },
    { id: 2, company: 'Flipkart India', contact: 'Sunita Rao', value: 2500000, stage: 'Qualified' },
    { id: 3, company: 'Bajaj Finance', contact: 'Ravi Sharma', value: 3200000, stage: 'Proposal' },
    { id: 4, company: 'Mahindra Group', contact: 'Deepa Nair', value: 4500000, stage: 'Negotiation' }
  ];

  function getLeads() {
    try { return JSON.parse(localStorage.getItem(LS_LEADS_KEY)) || SEED_LEADS; } catch { return SEED_LEADS; }
  }
  function saveLeads(list) {
    try { localStorage.setItem(LS_LEADS_KEY, JSON.stringify(list)); } catch {}
  }

  let cachedLeads = [];

  async function loadLeads() {
    const tbody = document.getElementById('crm-leads-tbody');
    if (!tbody) return;

    const render = (leads) => {
      const totalVal = leads.length;
      const wonVal = leads.filter(l => l.stage === 'Closed Won' || l.stage === 'Won').length;
      const pipeVal = leads.reduce((sum, l) => sum + (parseFloat(l.value) || 0), 0);

      const totalEl = document.getElementById('crm-stats-total');
      const wonEl = document.getElementById('crm-stats-won');
      const valueEl = document.getElementById('crm-stats-value');

      if (totalEl) totalEl.textContent = totalVal;
      if (wonEl) wonEl.textContent = wonVal;
      if (valueEl) valueEl.textContent = '₹' + (pipeVal / 100000).toFixed(1) + 'L';

      const stages = ['New', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'];
      const stagesContainer = document.getElementById('crm-pipeline-stages');
      if (stagesContainer) {
        stagesContainer.innerHTML = stages.map(stg => {
          const matchingLeads = leads.filter(l => l.stage === stg || (stg === 'Closed Won' && l.stage === 'Won'));
          const stageCount = matchingLeads.length;
          const stageValue = matchingLeads.reduce((sum, l) => sum + (parseFloat(l.value) || 0), 0);
          const stageClass = stageCount > 0 ? 'pipeline-stage active' : 'pipeline-stage';
          return `
            <div class="${stageClass}">
              <div class="pipeline-stage-name">${stg}</div>
              <div class="pipeline-stage-value">${stageCount}</div>
              <div class="pipeline-stage-count">₹${(stageValue / 100000).toFixed(1)}L value</div>
            </div>`;
        }).join('');
      }

      if (leads.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:25px;color:var(--text-muted)">No leads found.</td></tr>`;
        return;
      }

      const stageBadge = s => {
        switch (s) {
          case 'New': return 'badge-info';
          case 'Qualified': return 'badge-purple';
          case 'Proposal': return 'badge-warning';
          case 'Negotiation': return 'badge-success';
          case 'Won':
          case 'Closed Won': return 'badge-success';
          default: return 'badge-secondary';
        }
      };

      tbody.innerHTML = leads.map(l => `
        <tr>
          <td><div style="font-weight:600">${escHtml(l.company)}</div></td>
          <td>${escHtml(l.contact)}</td>
          <td style="font-family:var(--font-mono)">₹${Number(l.value).toLocaleString('en-IN')}</td>
          <td><span class="badge ${stageBadge(l.stage)}">${escHtml(l.stage)}</span></td>
          <td>
            <div style="display:flex;gap:6px">
              <button class="btn btn-secondary btn-sm" onclick="crmEditLead(${l.id})"><i class="fas fa-pen"></i></button>
              <button class="btn btn-secondary btn-sm" style="color:var(--danger)" onclick="crmDeleteLead(${l.id},'${l.company.replace(/'/g,"\\'")}')"><i class="fas fa-trash"></i></button>
            </div>
          </td>
        </tr>`).join('');
    };

    if (!cachedLeads.length) {
      cachedLeads = getLeads();
    }
    render(cachedLeads);

    try {
      const res = await Promise.race([
        fetch(`${API_BASE}/leads`),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 1500))
      ]);
      const json = await res.json();
      if (json.success) {
        cachedLeads = json.data;
        render(cachedLeads);
        saveLeads(cachedLeads);
      }
    } catch (e) {
      console.warn('CRM fallback to localStorage leads:', e);
    }
  }

  loadLeads();

  document.getElementById('crm-add-btn').addEventListener('click', () => {
    showModal({
      title: '<i class="fas fa-user-plus" style="color:var(--pink)"></i> Add New Lead',
      submitLabel: 'Create Lead',
      fields: [
        { name: 'company', label: 'Company Name', required: true, placeholder: 'e.g. Acme Corp' },
        { name: 'contact', label: 'Contact Person', required: true, placeholder: 'e.g. Jane Doe' },
        { name: 'value', label: 'Estimated Value (₹)', required: true, type: 'number', placeholder: 'e.g. 500000', default: 0 },
        { name: 'stage', label: 'Pipeline Stage', type: 'select', options: ['New', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'], default: 'New' }
      ],
      async onSubmit(data, close) {
        try {
          const res = await Promise.race([
            fetch(`${API_BASE}/leads`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            }),
            new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 1500))
          ]);
          const json = await res.json();
          if (!json.success) { showToast(json.error || 'Failed to create lead', 'error'); return; }
          showToast(`✅ Lead for "${json.data.company}" added!`, 'success');
        } catch (e) {
          const list = getLeads();
          const newLead = { id: Date.now(), ...data };
          list.unshift(newLead);
          saveLeads(list);
          cachedLeads = list;
          showToast(`✅ Lead added! (saved locally)`, 'success');
        }
        close();
        loadLeads();
      }
    });
  });

  window.crmEditLead = async function(id) {
    let lead = cachedLeads.find(l => l.id === id);
    if (!lead) {
      showToast('Lead not found', 'error');
      return;
    }

    showModal({
      title: '<i class="fas fa-pen" style="color:var(--pink)"></i> Edit Lead',
      submitLabel: 'Save Changes',
      fields: [
        { name: 'company', label: 'Company Name', required: true, default: lead.company },
        { name: 'contact', label: 'Contact Person', required: true, default: lead.contact },
        { name: 'value', label: 'Estimated Value (₹)', required: true, type: 'number', default: lead.value },
        { name: 'stage', label: 'Pipeline Stage', type: 'select', options: ['New', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'], default: lead.stage }
      ],
      async onSubmit(data, close) {
        try {
          const res = await Promise.race([
            fetch(`${API_BASE}/leads/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            }),
            new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 1500))
          ]);
          const json = await res.json();
          if (!json.success) { showToast(json.error || 'Failed to update lead', 'error'); return; }
          showToast(`✅ Lead for "${json.data.company}" updated!`, 'success');
        } catch (e) {
          const list = getLeads();
          const idx = list.findIndex(l => l.id === id);
          if (idx > -1) {
            list[idx] = { ...list[idx], ...data };
            saveLeads(list);
          }
          cachedLeads = list;
          showToast(`✅ Lead updated! (saved locally)`, 'success');
        }
        close();
        loadLeads();
      }
    });
  };

  window.crmDeleteLead = function(id, company) {
    showConfirm(`Do you want to delete lead for <strong>${company}</strong>?`, async () => {
      try {
        const res = await Promise.race([
          fetch(`${API_BASE}/leads/${id}`, { method: 'DELETE' }),
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 1500))
        ]);
        const json = await res.json();
        if (!json.success) { showToast(json.error || 'Failed to delete lead', 'error'); return; }
        showToast(`Lead for "${company}" removed.`, 'success');
      } catch (e) {
        const list = getLeads().filter(l => l.id !== id);
        saveLeads(list);
        cachedLeads = list;
        showToast(`Lead for "${company}" removed. (locally)`, 'success');
      }
      loadLeads();
    });
  };

  document.getElementById('crm-campaign-btn').addEventListener('click', () => {
    showToast('CRM marketing campaigns simulator active. Check back in a bit!', 'info');
  });

  // ── Stat Card Click Handlers ──
  document.getElementById('crm-stat-total')?.addEventListener('click', () => {
    showModal({
      title: '<i class="fas fa-users" style="color:var(--info)"></i> Lead Acquisition Summary',
      submitLabel: 'New Lead',
      fields: [
        { label: 'Total Leads', default: String(cachedLeads.length), readonly: true },
        { label: 'Conversion Rate', default: '22.4%', readonly: true },
        { label: 'Acquisition Cost', default: '₹420 / lead', readonly: true },
        { label: 'Top Source', default: 'Direct Outreach (45%)', readonly: true }
      ],
      onSubmit(data, close) {
        close();
        document.getElementById('crm-add-btn')?.click();
      }
    });
  });

  document.getElementById('crm-stat-won')?.addEventListener('click', () => {
    const wonCount = cachedLeads.filter(l => l.stage === 'Closed Won' || l.stage === 'Won').length;
    showModal({
      title: '<i class="fas fa-trophy" style="color:var(--success)"></i> Success Metrics',
      submitLabel: 'Close',
      submitClass: 'btn-secondary',
      fields: [
        { label: 'Deals Won', default: String(wonCount), readonly: true },
        { label: 'Avg Deal Size', default: '₹12.5L', readonly: true },
        { label: 'Target Achievement', default: '84% of monthly goal', readonly: true }
      ],
      onSubmit(data, close) { close(); }
    });
  });

  document.getElementById('crm-stat-value')?.addEventListener('click', () => {
    const pipeVal = document.getElementById('crm-stats-value')?.textContent || '—';
    showModal({
      title: '<i class="fas fa-indian-rupee-sign" style="color:var(--purple)"></i> Sales Pipeline Analysis',
      submitLabel: 'Refresh Stages',
      fields: [
        { label: 'Total Value', default: pipeVal, readonly: true },
        { label: 'Wait Time (Avg)', default: '14 Days', readonly: true },
        { label: 'Pipeline Velocity', default: '₹8.5L / week', readonly: true }
      ],
      onSubmit(data, close) {
        close();
        loadLeads();
      }
    });
  });

  document.getElementById('crm-stat-rate')?.addEventListener('click', () => {
    showModal({
      title: '<i class="fas fa-percent" style="color:var(--warning)"></i> Relationship Health',
      submitLabel: 'View Analytics',
      fields: [
        { label: 'Win Rate', default: '68%', readonly: true },
        { label: 'Churn Rate', default: '4.2%', readonly: true },
        { label: 'Customer NPS', default: '72 (Excellent)', readonly: true },
        { label: 'Brand Loyalty', default: '88% Retention', readonly: true }
      ],
      onSubmit(data, close) {
        close();
        location.hash = '#analytics';
      }
    });
  });
};

/* Projects Page */
pages.projects = function(container) {
  container.innerHTML = `
    <div class="module-hero">
      <h2><i class="fas fa-diagram-project" style="color:var(--accent-light)"></i> Project Management</h2>
      <p>Agile workflows, Kanban boards, Gantt charts, sprint management, resource allocation, and budget tracking.</p>
      <div class="page-actions" style="margin-top:16px">
        <button class="btn btn-primary btn-sm" id="project-add-btn"><i class="fas fa-plus"></i> New Project</button>
        <button class="btn btn-secondary btn-sm" id="project-tasks-btn"><i class="fas fa-list-check"></i> My Tasks</button>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card" id="proj-stat-active"><div class="stat-card-header"><div class="stat-icon indigo"><i class="fas fa-folder-open"></i></div></div><div class="stat-value" id="project-stats-active">—</div><div class="stat-label">Active Projects</div></div>
      <div class="stat-card" id="proj-stat-done"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-check-double"></i></div></div><div class="stat-value" id="project-stats-done">—</div><div class="stat-label">Tasks Completed</div></div>
      <div class="stat-card" id="proj-stat-progress"><div class="stat-card-header"><div class="stat-icon yellow"><i class="fas fa-clock"></i></div></div><div class="stat-value" id="project-stats-progress">—</div><div class="stat-label">In Progress</div></div>
      <div class="stat-card" id="proj-stat-overdue"><div class="stat-card-header"><div class="stat-icon red"><i class="fas fa-flag"></i></div></div><div class="stat-value">7</div><div class="stat-label">Overdue</div></div>
    </div>
    <div class="tabs">
      <div class="tab active" data-proj-tab="kanban" onclick="projectTabSwitch(this, 'kanban')">Kanban Board</div>
      <div class="tab" data-proj-tab="gantt" onclick="projectTabSwitch(this, 'gantt')">Gantt Chart</div>
      <div class="tab" data-proj-tab="sprint" onclick="projectTabSwitch(this, 'sprint')">Sprint</div>
      <div class="tab" data-proj-tab="timeline" onclick="projectTabSwitch(this, 'timeline')">Timeline</div>
    </div>
    
    <div id="project-main-content">
      <!-- Kanban Board (Default) -->
      <div id="view-kanban" class="project-view-container active">
        <div class="kanban-board" style="margin-bottom:24px" id="project-kanban-board">
          <div class="kanban-column">
            <div class="kanban-column-header"><span class="kanban-column-title" style="color:var(--text-muted)">📋 Backlog</span><span class="kanban-count" id="proj-count-backlog">0</span></div>
            <div class="kanban-cards" id="proj-col-backlog"></div>
          </div>
          <div class="kanban-column">
            <div class="kanban-column-header"><span class="kanban-column-title" style="color:var(--info)">🔄 In Progress</span><span class="kanban-count" id="proj-count-progress">0</span></div>
            <div class="kanban-cards" id="proj-col-progress"></div>
          </div>
          <div class="kanban-column">
            <div class="kanban-column-header"><span class="kanban-column-title" style="color:var(--warning)">👀 Review</span><span class="kanban-count" id="proj-count-review">0</span></div>
            <div class="kanban-cards" id="proj-col-review"></div>
          </div>
          <div class="kanban-column">
            <div class="kanban-column-header"><span class="kanban-column-title" style="color:var(--success)">✅ Done</span><span class="kanban-count" id="proj-count-done">0</span></div>
            <div class="kanban-cards" id="proj-col-done"></div>
          </div>
        </div>

        <div class="grid-2">
          <div class="card"><div class="card-header"><span class="card-title">Quick Stats</span></div><div style="padding:10px 0;">
            <div style="display:flex; justify-content:space-between; margin-bottom:12px;"><span style="color:var(--text-secondary)">Task Efficiency</span><span style="font-weight:600; color:var(--success)">92%</span></div>
            <div class="progress-bar" style="height:6px; margin-bottom:20px;"><div class="progress-fill" style="width:92%; background:var(--success)"></div></div>
            <div style="display:flex; justify-content:space-between; margin-bottom:12px;"><span style="color:var(--text-secondary)">Resource Utilization</span><span style="font-weight:600; color:var(--accent)">78%</span></div>
            <div class="progress-bar" style="height:6px;"><div class="progress-fill" style="width:78%; background:var(--accent)"></div></div>
          </div></div>
          <div class="card"><div class="card-header"><span class="card-title">Recent Activity</span></div><div class="activity-list" style="margin-top:10px">
            <div class="activity-item"><div class="activity-dot blue"></div><div><div class="activity-text"><strong>Rahul</strong> moved ERP v3.2 to In Progress</div><div class="activity-time">5m ago</div></div></div>
            <div class="activity-item"><div class="activity-dot green"></div><div><div class="activity-text"><strong>Anita</strong> completed Payment Gateway</div><div class="activity-time">2h ago</div></div></div>
            <div class="activity-item"><div class="activity-dot yellow"></div><div><div class="activity-text"><strong>Vikram</strong> added subtasks to AI Module</div><div class="activity-time">Yesterday</div></div></div>
          </div></div>
        </div>
      </div>

      <!-- Gantt Chart View -->
      <div id="view-gantt" class="project-view-container" style="display:none;">
        <div class="card">
          <div class="card-header">
            <span class="card-title"><i class="fas fa-chart-gantt" style="color:var(--accent)"></i> Detailed Project Gantt</span>
            <div style="display:flex; gap:10px;" id="gantt-granularity-toggles">
              <button class="btn btn-secondary btn-xs" data-gantt="day">Day</button>
              <button class="btn btn-primary btn-xs" data-gantt="week">Week</button>
              <button class="btn btn-secondary btn-xs" data-gantt="month">Month</button>
            </div>
          </div>
          <div id="gantt-content" style="padding:20px 0;">
            <!-- Gantt timeline and rows will be rendered here -->
          </div>
        </div>
      </div>

      <!-- Sprint View -->
      <div id="view-sprint" class="project-view-container" style="display:none;">
        <div class="grid-2">
          <div class="card">
            <div class="card-header">
              <span class="card-title">Sprint 14 Burndown</span>
              <span class="badge badge-info">4 Days Left</span>
            </div>
            <div class="chart-container"><canvas data-chart="sprint"></canvas></div>
          </div>
          <div class="card">
            <div class="card-header"><span class="card-title">Active Sprint Backlog</span></div>
            <div class="activity-list">
              ${[
                { id: "S-102", task: "Implement OAuth2.0 Flow", story: 8, owner: "RS", status: "In Progress" },
                { id: "S-105", task: "Database Schema Migration", story: 5, owner: "VK", status: "In Progress" },
                { id: "S-108", task: "Landing Page SEO Audit", story: 3, owner: "AP", status: "Done" },
                { id: "S-112", task: "Bug #847: Login redirect", story: 2, owner: "RS", status: "Review" }
              ].map(s => `
                <div style="display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid var(--border);">
                  <div style="width:40px; height:40px; border-radius:10px; background:rgba(255,255,255,0.03); display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:700; color:var(--accent)">${s.id}</div>
                  <div style="flex:1;">
                    <div style="font-size:13.5px; font-weight:600; color:var(--text-primary);">${s.task}</div>
                    <div style="font-size:11px; color:var(--text-muted); margin-top:3px;">Story Points: ${s.story} • ${s.owner}</div>
                  </div>
                  <span class="badge ${s.status === 'Done' ? 'badge-success' : (s.status === 'Review' ? 'badge-warning' : 'badge-info')}" style="font-size:10px;">${s.status}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Timeline View -->
      <div id="view-timeline" class="project-view-container" style="display:none;">
        <div class="card">
          <div class="card-header"><span class="card-title">Organization Roadmap 2026</span></div>
          <div style="padding:20px 0;">
            <div style="position:relative; padding-left:40px; border-left:2px solid var(--border); margin-left:20px;">
              ${[
                { month: "June", title: "ERP v3.2 Release", desc: "Full migration to cloud-native architecture.", icon: "fa-rocket", color: "var(--accent)" },
                { month: "July", title: "AI Integration Phase 1", desc: "Beta launch of AI-driven demand forecasting.", icon: "fa-brain", color: "var(--purple)" },
                { month: "August", title: "Mobile App 2.0", desc: "Complete overhaul of iOS/Android user experience.", icon: "fa-mobile-screen", color: "var(--info)" },
                { month: "October", title: "Global Expansion", desc: "Support for multi-region data centers and localization.", icon: "fa-earth-americas", color: "var(--success)" }
              ].map(item => `
                <div class="roadmap-item" style="position:relative; margin-bottom:35px; cursor:pointer;" data-title="${item.title}" data-desc="${item.desc}" data-month="${item.month}">
                  <div style="position:absolute; left:-55px; top:0; width:30px; height:30px; border-radius:50%; background:${item.color}; border:4px solid var(--bg-card); display:flex; align-items:center; justify-content:center; color:#fff; font-size:12px; z-index:2;">
                    <i class="fas ${item.icon}"></i>
                  </div>
                  <div style="font-size:11px; font-weight:800; color:${item.color}; text-transform:uppercase; letter-spacing:1px; margin-bottom:5px;">${item.month}</div>
                  <div style="font-size:15px; font-weight:700; color:var(--text-primary); margin-bottom:4px;">${item.title}</div>
                  <div style="font-size:13px; color:var(--text-secondary);">${item.desc}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>`;

  const LS_PROJ_KEY = 'amdox_projects';
  const SEED_PROJ = [
    { id: 1, name: 'ERP v3.2', description: 'Core platform upgrade', status: 'In Progress', priority: 'High', assigned_to: 'Rahul Singh' },
    { id: 2, name: 'Mobile App', description: 'iOS & Android companion app', status: 'In Progress', priority: 'High', assigned_to: 'Priya Sharma' },
    { id: 3, name: 'AI Module', description: 'AI prediction engine', status: 'Backlog', priority: 'Medium', assigned_to: 'Vikram Kumar' },
    { id: 4, name: 'CRM Revamp', description: 'New CRM UI and pipeline tracking', status: 'Review', priority: 'Medium', assigned_to: 'Anita Patel' },
    { id: 5, name: 'Payment Gateway', description: 'Razorpay & Stripe integration', status: 'Done', priority: 'High', assigned_to: 'Anita Patel' }
  ];

  function getProjects() {
    try { return JSON.parse(localStorage.getItem(LS_PROJ_KEY)) || SEED_PROJ; } catch { return SEED_PROJ; }
  }
  function saveProjects(list) {
    try { localStorage.setItem(LS_PROJ_KEY, JSON.stringify(list)); } catch {}
  }

  let cachedProjects = [];

  async function loadProjects() {
    const kanban = document.getElementById('project-kanban-board');
    if (!kanban) return;

    const render = (projects) => {
      const activeEl = document.getElementById('project-stats-active');
      const doneEl = document.getElementById('project-stats-done');
      const progressEl = document.getElementById('project-stats-progress');

      const backlogCount = projects.filter(p => p.status === 'Backlog').length;
      const progressCount = projects.filter(p => p.status === 'In Progress').length;
      const reviewCount = projects.filter(p => p.status === 'Review').length;
      const doneCount = projects.filter(p => p.status === 'Done').length;

      if (activeEl) activeEl.textContent = (projects.length - doneCount);
      if (doneEl) doneEl.textContent = doneCount * 12 + 189;
      if (progressEl) progressEl.textContent = progressCount;

      document.getElementById('proj-count-backlog').textContent = backlogCount;
      document.getElementById('proj-count-progress').textContent = progressCount;
      document.getElementById('proj-count-review').textContent = reviewCount;
      document.getElementById('proj-count-done').textContent = doneCount;

      const populateCol = (statusVal, colId) => {
        const colEl = document.getElementById(colId);
        if (!colEl) return;
        const matching = projects.filter(p => p.status === statusVal);
        if (matching.length === 0) {
          colEl.innerHTML = `<div style="text-align:center;font-size:11px;color:var(--text-muted);padding:20px;border:1px dashed var(--border);border-radius:8px">No projects</div>`;
          return;
        }

        const priBadge = p => {
          switch (p) {
            case 'High': return 'badge-danger';
            case 'Medium': return 'badge-warning';
            case 'Low': return 'badge-info';
            default: return 'badge-info';
          }
        };

        const initials = name => (name || '—').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

        colEl.innerHTML = matching.map(p => `
          <div class="kanban-card" style="border-left: 3px solid var(--accent-light); position:relative;">
            <div style="position:absolute; top:8px; right:8px; display:flex; gap:4px">
              <button style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:11px" onclick="projectEdit(${p.id})"><i class="fas fa-pen"></i></button>
              <button style="background:none; border:none; color:var(--danger); cursor:pointer; font-size:11px" onclick="projectDelete(${p.id}, '${p.name.replace(/'/g,"\\'")}')"><i class="fas fa-trash"></i></button>
            </div>
            <div class="kanban-card-title" style="margin-right:25px">${escHtml(p.name)}</div>
            <div style="font-size:11.5px; color:var(--text-secondary); margin-bottom:10px">${escHtml(p.description || '')}</div>
            <div class="kanban-card-meta">
              <span class="badge ${priBadge(p.priority)}" style="font-size:10px">${escHtml(p.priority)}</span>
              <div class="avatar-group">
                <div class="avatar" title="${escHtml(p.assigned_to)}">${initials(p.assigned_to)}</div>
              </div>
            </div>
          </div>`).join('');
      };

      populateCol('Backlog', 'proj-col-backlog');
      populateCol('In Progress', 'proj-col-progress');
      populateCol('Review', 'proj-col-review');
      populateCol('Done', 'proj-col-done');
    };

    if (!cachedProjects.length) {
      cachedProjects = getProjects();
    }
    render(cachedProjects);

    try {
      const res = await Promise.race([
        fetch(`${API_BASE}/projects`),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 1500))
      ]);
      const json = await res.json();
      if (json.success) {
        cachedProjects = json.data;
        render(cachedProjects);
        saveProjects(cachedProjects);
      }
    } catch (e) {
      console.warn('Projects fallback to localStorage projects:', e);
    }
  }

  loadProjects();

  document.getElementById('project-add-btn').addEventListener('click', () => {
    showModal({
      title: '<i class="fas fa-plus" style="color:var(--accent-light)"></i> Create New Project',
      submitLabel: 'Create Project',
      fields: [
        { name: 'name', label: 'Project Name', required: true, placeholder: 'e.g. ERP integration v2' },
        { name: 'description', label: 'Description', placeholder: 'Brief summary of goals' },
        { name: 'status', label: 'Status / Column', type: 'select', options: ['Backlog', 'In Progress', 'Review', 'Done'], default: 'In Progress' },
        { name: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High'], default: 'Medium' },
        { name: 'assigned_to', label: 'Assigned Employee Name', placeholder: 'e.g. Rahul Singh' }
      ],
      async onSubmit(data, close) {
        try {
          const res = await Promise.race([
            fetch(`${API_BASE}/projects`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            }),
            new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 1500))
          ]);
          const json = await res.json();
          if (!json.success) { showToast(json.error || 'Failed to create project', 'error'); return; }
          showToast(`✅ Project "${json.data.name}" created!`, 'success');
        } catch (e) {
          const list = getProjects();
          const newP = { id: Date.now(), ...data };
          list.unshift(newP);
          saveProjects(list);
          cachedProjects = list;
          showToast(`✅ Project created! (saved locally)`, 'success');
        }
        close();
        loadProjects();
      }
    });
  });

  window.projectEdit = function(id) {
    const proj = cachedProjects.find(p => p.id === id);
    if (!proj) {
      showToast('Project not found', 'error');
      return;
    }

    showModal({
      title: '<i class="fas fa-pen" style="color:var(--accent-light)"></i> Edit Project',
      submitLabel: 'Save Changes',
      fields: [
        { name: 'name', label: 'Project Name', required: true, default: proj.name },
        { name: 'description', label: 'Description', default: proj.description },
        { name: 'status', label: 'Status / Column', type: 'select', options: ['Backlog', 'In Progress', 'Review', 'Done'], default: proj.status },
        { name: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High'], default: proj.priority },
        { name: 'assigned_to', label: 'Assigned Employee Name', default: proj.assigned_to }
      ],
      async onSubmit(data, close) {
        try {
          const res = await Promise.race([
            fetch(`${API_BASE}/projects/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            }),
            new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 1500))
          ]);
          const json = await res.json();
          if (!json.success) { showToast(json.error || 'Failed to update project', 'error'); return; }
          showToast(`✅ Project "${json.data.name}" updated!`, 'success');
        } catch (e) {
          const list = getProjects();
          const idx = list.findIndex(p => p.id === id);
          if (idx > -1) {
            list[idx] = { ...list[idx], ...data };
            saveProjects(list);
          }
          cachedProjects = list;
          showToast(`✅ Project updated! (saved locally)`, 'success');
        }
        close();
        loadProjects();
      }
    });
  };

  window.projectDelete = function(id, name) {
    showConfirm(`Do you want to delete project <strong>${name}</strong>?`, async () => {
      try {
        const res = await Promise.race([
          fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' }),
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 1500))
        ]);
        const json = await res.json();
        if (!json.success) { showToast(json.error || 'Failed to delete project', 'error'); return; }
        showToast(`Project "${name}" deleted.`, 'success');
      } catch (e) {
        const list = getProjects().filter(p => p.id !== id);
        saveProjects(list);
        cachedProjects = list;
        showToast(`Project "${name}" deleted. (locally)`, 'success');
      }
      loadProjects();
    });
  };

  document.getElementById('project-tasks-btn').addEventListener('click', () => {
    showToast('Task manager simulator active. 0 tasks overdue.', 'success');
  });

  // ── Tab Switching Logic ──
  window.projectTabSwitch = function(tabEl, viewId) {
    // 1. Update UI classes for tabs
    const tabs = tabEl.parentElement.querySelectorAll('.tab');
    tabs.forEach(t => t.classList.remove('active'));
    tabEl.classList.add('active');

    // 2. Hide all view containers
    const containers = document.querySelectorAll('.project-view-container');
    containers.forEach(c => c.style.display = 'none');

    // 3. Show the selected container
    const target = document.getElementById('view-' + viewId);
    if (target) {
      target.style.display = 'block';
      // Trigger chart re-initialization if needed (especially for Sprint chart)
      if (viewId === 'sprint' && typeof initChartsOnPage === 'function') {
        setTimeout(() => initChartsOnPage('projects'), 100);
      }
    }
  };

  // ── Stat Card Click Handlers ──
  document.getElementById('proj-stat-active')?.addEventListener('click', () => {
    const activeCount = cachedProjects.filter(p => p.status !== 'Done').length;
    showModal({
      title: '<i class="fas fa-folder-open" style="color:var(--accent-light)"></i> Active Project Portfolio',
      submitLabel: 'New Project',
      fields: [
        { label: 'Active Projects', default: String(activeCount), readonly: true },
        { label: 'Portfolio Health', default: 'Green (92%)', readonly: true },
        { label: 'Budget Utilization', default: '₹54.2L / ₹60L', readonly: true }
      ],
      onSubmit(data, close) {
        close();
        document.getElementById('project-add-btn')?.click();
      }
    });
  });

  document.getElementById('proj-stat-done')?.addEventListener('click', () => {
    const doneVal = document.getElementById('project-stats-done')?.textContent || '—';
    showModal({
      title: '<i class="fas fa-check-double" style="color:var(--success)"></i> Productivity Report',
      submitLabel: 'View Sprint',
      fields: [
        { label: 'Tasks Completed', default: doneVal, readonly: true },
        { label: 'Velocity', default: '42 story pts / week', readonly: true },
        { label: 'Quality Score', default: '98% Pass Rate', readonly: true }
      ],
      onSubmit(data, close) {
        close();
        document.querySelector('[data-proj-tab="sprint"]')?.click();
      }
    });
  });

  document.getElementById('proj-stat-progress')?.addEventListener('click', () => {
    const progVal = document.getElementById('project-stats-progress')?.textContent || '—';
    showModal({
      title: '<i class="fas fa-clock" style="color:var(--warning)"></i> Work in Progress',
      submitLabel: 'My Tasks',
      fields: [
        { label: 'Items in Progress', default: progVal, readonly: true },
        { label: 'Avg Cycle Time', default: '3.5 Days', readonly: true },
        { label: 'Blocked Items', default: '2 Tasks', readonly: true }
      ],
      onSubmit(data, close) {
        close();
        document.getElementById('project-tasks-btn')?.click();
      }
    });
  });

  document.getElementById('proj-stat-overdue')?.addEventListener('click', () => {
    showModal({
      title: '<i class="fas fa-flag" style="color:var(--danger)"></i> Critical Timeline Alerts',
      submitLabel: 'Open Kanban',
      fields: [
        { label: 'Overdue Tasks', default: '7', readonly: true },
        { label: 'High Priority', default: '3 Tasks', readonly: true },
        { label: 'Est. Delay Impact', default: '2 Business Days', readonly: true }
      ],
      onSubmit(data, close) {
        close();
        document.querySelector('[data-proj-tab="kanban"]')?.click();
      }
    });
  });

  // ── Gantt Re-rendering Logic ──
  const renderGantt = (mode = 'week') => {
    const ganttBox = document.getElementById('gantt-content');
    if (!ganttBox) return;

    let headers = [];
    if (mode === 'day') {
      headers = ['01 Jun', '02 Jun', '03 Jun', '04 Jun', '05 Jun', '06 Jun', '07 Jun', '08 Jun', '09 Jun', '10 Jun'];
    } else if (mode === 'week') {
      headers = ['Wk 22', 'Wk 23', 'Wk 24', 'Wk 25', 'Wk 26', 'Wk 27', 'Wk 28', 'Wk 29', 'Wk 30', 'Wk 31'];
    } else if (mode === 'month') {
      headers = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    }

    const rows = [
      { name: "ERP v3.2 Core", start: mode==='day'?10:0, end: mode==='day'?90:70, color: "var(--accent)" },
      { name: "Mobile UI Kit", start: mode==='day'?30:15, end: mode==='day'?60:40, color: "var(--info)" },
      { name: "API Security", start: mode==='day'?40:30, end: mode==='day'?80:60, color: "var(--purple)" },
      { name: "AI Engine Beta", start: mode==='day'?50:50, end: mode==='day'?100:90, color: "var(--pink)" },
      { name: "QA & Testing", start: mode==='day'?80:70, end: mode==='day'?120:100, color: "var(--success)" }
    ];

    ganttBox.innerHTML = `
      <div style="display:flex; border-bottom:1px solid var(--border); padding-bottom:10px; margin-bottom:10px;">
        <div style="width:160px; font-weight:700; color:var(--text-muted); font-size:11px; text-transform:uppercase;">Task / Project</div>
        <div style="flex:1; display:flex; font-weight:700; color:var(--text-muted); font-size:11px;">
          ${headers.map(h => `<div style="flex:1; text-align:center;">${h}</div>`).join('')}
        </div>
      </div>
      ${rows.map(row => `
        <div style="display:flex; align-items:center; height:45px; border-bottom:1px solid rgba(255,255,255,0.03);">
          <div style="width:160px; font-size:13px; font-weight:600; color:var(--text-primary);">${row.name}</div>
          <div style="flex:1; position:relative; height:12px; background:rgba(255,255,255,0.01); border-radius:10px;">
            <div style="position:absolute; left:${row.start}%; width:${Math.min(100, row.end - row.start)}%; height:100%; background:${row.color}; border-radius:10px; box-shadow:0 0 15px ${row.color}44;"></div>
          </div>
        </div>
      `).join('')}
    `;
  };

  // Initial render
  renderGantt('week');

  // ── Gantt Granularity Toggles ──
  document.getElementById('gantt-granularity-toggles')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    
    // Update active state classes
    const buttons = e.currentTarget.querySelectorAll('button');
    buttons.forEach(b => {
      b.classList.remove('btn-primary');
      b.classList.add('btn-secondary');
    });
    btn.classList.remove('btn-secondary');
    btn.classList.add('btn-primary');
    
    const mode = btn.getAttribute('data-gantt');
    renderGantt(mode);
  });

  // ── Roadmap Timeline Handlers ──
  document.getElementById('view-timeline')?.addEventListener('click', (e) => {
    const item = e.target.closest('.roadmap-item');
    if (!item) return;

    const title = item.getAttribute('data-title');
    const desc = item.getAttribute('data-desc');
    const month = item.getAttribute('data-month');

    showModal({
      title: `<i class="fas fa-flag" style="color:var(--accent)"></i> Milestone: ${title}`,
      submitLabel: 'Set Reminder',
      fields: [
        { label: 'Phase', default: month + ' 2026', readonly: true },
        { label: 'Objective', default: desc, readonly: true },
        { label: 'Status', default: 'Scheduled', readonly: true },
        { label: 'KPI Target', default: '99.9% Scalability', readonly: true }
      ],
      onSubmit(data, close) {
        showToast(`✅ Reminder set for ${title}!`, 'success');
        close();
      }
    });
  });
};

/* AI Command Center */
pages['ai-center'] = function(container) {
  const getAIState = () => {
    try {
      return JSON.parse(localStorage.getItem('amdox_ai_state')) || {
        anomalyResolved: false,
        skuOrdered: false,
        resourceOptimized: false,
        contractReviewed: false
      };
    } catch {
      return {
        anomalyResolved: false,
        skuOrdered: false,
        resourceOptimized: false,
        contractReviewed: false
      };
    }
  };

  const saveAIState = (state) => {
    try {
      localStorage.setItem('amdox_ai_state', JSON.stringify(state));
    } catch {}
  };

  const state = getAIState();
  const anomaliesCount = state.anomalyResolved ? 22 : 23;

  container.innerHTML = `
    <div class="module-hero" style="background:linear-gradient(135deg,rgba(99,102,241,0.1),rgba(168,85,247,0.1))">
      <h2><i class="fas fa-brain" style="color:var(--purple)"></i> AI Command Center</h2>
      <p>Demand forecasting, anomaly detection, intelligent approvals, predictive analytics, and AI-generated business insights.</p>
      <div class="page-actions" style="margin-top:16px">
        <button class="btn btn-primary btn-sm" id="btn-run-ai-analysis"><i class="fas fa-wand-magic-sparkles"></i> Run AI Analysis</button>
        <button class="btn btn-secondary btn-sm" id="btn-chat-with-ai"><i class="fas fa-robot"></i> Chat with AI</button>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon purple"><i class="fas fa-brain"></i></div></div><div class="stat-value">156</div><div class="stat-label">AI Models Active</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-bullseye"></i></div></div><div class="stat-value">94.2%</div><div class="stat-label">Forecast Accuracy</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon cyan"><i class="fas fa-bolt"></i></div></div><div class="stat-value">1,247</div><div class="stat-label">Predictions Today</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon pink"><i class="fas fa-shield-halved"></i></div></div><div class="stat-value" id="ai-anomalies-stat">${anomaliesCount}</div><div class="stat-label">Anomalies Detected</div></div>
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
        <div class="activity-list" id="ai-insights-list">
          <!-- Dynamically populated below -->
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Revenue Forecast</span></div>
        <div class="chart-container"><canvas data-chart="revenue"></canvas></div>
      </div>
    </div>`;

  const renderAIStateOnPage = () => {
    const currentState = getAIState();
    
    // Update anomalies count badge on page
    const statValEl = document.getElementById('ai-anomalies-stat');
    if (statValEl) {
      statValEl.textContent = currentState.anomalyResolved ? 22 : 23;
    }

    const insightsList = container.querySelector('#ai-insights-list');
    if (insightsList) {
      insightsList.innerHTML = `
        <div class="activity-item"><div class="activity-dot purple"></div><div><div class="activity-text">📈 <strong>Revenue Prediction:</strong> Q3 2026 projected at ₹2.4 Crore (+18% YoY)</div><div class="activity-time">AI Confidence: 94%</div></div></div>
        <div class="activity-item"><div class="activity-dot red"></div><div><div class="activity-text">🚨 <strong>Anomaly Alert:</strong> Unusual expense pattern detected in Marketing dept ${currentState.anomalyResolved ? '<span class="badge badge-success" style="font-size:10px;margin-left:6px">Resolved</span>' : ''}</div><div class="activity-time">AI Confidence: 87%</div></div></div>
        <div class="activity-item"><div class="activity-dot green"></div><div><div class="activity-text">✅ <strong>Recommendation:</strong> Reorder SKU-0089 (Dell Monitor) — predicted stockout in 3 days ${currentState.skuOrdered ? '<span class="badge badge-success" style="font-size:10px;margin-left:6px">Ordered</span>' : ''}</div><div class="activity-time">AI Confidence: 92%</div></div></div>
        <div class="activity-item"><div class="activity-dot blue"></div><div><div class="activity-text">💡 <strong>Optimization:</strong> Shift 2 engineers from Project A to B for 15% faster delivery ${currentState.resourceOptimized ? '<span class="badge badge-success" style="font-size:10px;margin-left:6px">Applied</span>' : ''}</div><div class="activity-time">AI Confidence: 89%</div></div></div>
      `;
    }
  };

  renderAIStateOnPage();

  // ── Run AI Analysis button ──
  document.getElementById('btn-run-ai-analysis').addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-box" style="max-width:560px">
        <div class="modal-header">
          <h3 class="modal-title"><i class="fas fa-wand-magic-sparkles" style="color:var(--purple)"></i> AI Analysis Engine</h3>
          <button class="modal-close" id="ai-analysis-close"><i class="fas fa-xmark"></i></button>
        </div>
        <div class="modal-body" id="ai-analysis-body">
          <div style="text-align:center;padding:20px 0">
            <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--purple));display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:28px;color:#fff;animation:pulse-glow 2s infinite">
              <i class="fas fa-brain"></i>
            </div>
            <h3 style="font-size:16px;margin-bottom:8px">Running AI Analysis...</h3>
            <p style="font-size:13px;color:var(--text-secondary);margin-bottom:20px">Analyzing data across all modules</p>
            <div class="progress-bar" style="height:8px;margin-bottom:12px">
              <div class="progress-fill blue" id="ai-progress-fill" style="width:0%;transition:width 0.5s ease"></div>
            </div>
            <p style="font-size:12px;color:var(--text-muted)" id="ai-progress-label">Initializing models...</p>
          </div>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('open'));

    const closeModal = () => { overlay.classList.remove('open'); setTimeout(() => overlay.remove(), 200); };
    overlay.querySelector('#ai-analysis-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

    // Simulate progress
    const fill = overlay.querySelector('#ai-progress-fill');
    const label = overlay.querySelector('#ai-progress-label');
    const body = overlay.querySelector('#ai-analysis-body');
    const steps = [
      { pct: 20, text: 'Scanning HR & Finance data...' },
      { pct: 45, text: 'Running anomaly detection...' },
      { pct: 65, text: 'Generating demand forecasts...' },
      { pct: 85, text: 'Computing revenue predictions...' },
      { pct: 100, text: 'Analysis complete!' }
    ];
    steps.forEach((step, i) => {
      setTimeout(() => {
        if (!document.body.contains(overlay)) return;
        fill.style.width = step.pct + '%';
        label.textContent = step.text;
        if (step.pct === 100) {
          setTimeout(() => {
            if (!document.body.contains(overlay)) return;
            const currentState = getAIState();
            body.innerHTML = `
              <div style="padding:8px 0">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">
                  <div style="width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,var(--success),#16a34a);display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px"><i class="fas fa-check"></i></div>
                  <div><h3 style="font-size:15px;font-weight:700">Analysis Complete</h3><p style="font-size:12px;color:var(--text-muted)">Processed 12,847 data points in 4.2s</p></div>
                </div>
                <div style="display:flex;flex-direction:column;gap:12px">
                  <div style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:14px">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><i class="fas fa-chart-trending-up" style="color:var(--success)"></i><strong style="font-size:13px">Revenue Forecast</strong></div>
                    <p style="font-size:13px;color:var(--text-secondary)">Q3 2026 revenue projected at <strong style="color:var(--success)">₹2.4 Crore</strong> (+18% YoY). High confidence (94%).</p>
                  </div>
                  <div style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:14px">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><i class="fas fa-triangle-exclamation" style="color:var(--warning)"></i><strong style="font-size:13px">Anomalies Found</strong></div>
                    <div style="display:flex;flex-direction:column;gap:8px">
                      <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:4px;padding:8px 10px;gap:10px">
                        <div style="font-size:12.5px;color:var(--text-secondary)">
                          ⚠️ <strong>Marketing Dept:</strong> Expenses deviate 23% from baseline pattern.
                        </div>
                        ${currentState.anomalyResolved 
                          ? '<span style="color:var(--success);font-size:11px;font-weight:600;white-space:nowrap;flex-shrink:0"><i class="fas fa-circle-check"></i> Resolved</span>' 
                          : '<button class="btn btn-danger btn-xs" id="btn-fix-anomaly" style="padding:4px 8px;font-size:11px;white-space:nowrap;flex-shrink:0">Resolve</button>'}
                      </div>
                    </div>
                  </div>
                  <div style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:var(--radius-sm);padding:14px">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><i class="fas fa-lightbulb" style="color:var(--accent-light)"></i><strong style="font-size:13px">Recommendations & Actions</strong></div>
                    <div style="display:flex;flex-direction:column;gap:8px">
                      <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:4px;padding:8px 10px;gap:10px">
                        <div style="font-size:12.5px;color:var(--text-secondary)">
                          📦 <strong>Inventory SKU-0089:</strong> Dell Monitor stockout predicted in 3 days.
                        </div>
                        ${currentState.skuOrdered
                          ? '<span style="color:var(--success);font-size:11px;font-weight:600;white-space:nowrap;flex-shrink:0"><i class="fas fa-circle-check"></i> Ordered</span>'
                          : '<button class="btn btn-primary btn-xs" id="btn-action-reorder" style="padding:4px 8px;font-size:11px;white-space:nowrap;flex-shrink:0">Auto-Reorder</button>'}
                      </div>
                      <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:4px;padding:8px 10px;gap:10px">
                        <div style="font-size:12.5px;color:var(--text-secondary)">
                          👥 <strong>Resource Allocation:</strong> Shift 2 developers from Project A to B.
                        </div>
                        ${currentState.resourceOptimized
                          ? '<span style="color:var(--success);font-size:11px;font-weight:600;white-space:nowrap;flex-shrink:0"><i class="fas fa-circle-check"></i> Applied</span>'
                          : '<button class="btn btn-primary btn-xs" id="btn-action-optimize" style="padding:4px 8px;font-size:11px;white-space:nowrap;flex-shrink:0">Optimize</button>'}
                      </div>
                      <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:4px;padding:8px 10px;gap:10px">
                        <div style="font-size:12.5px;color:var(--text-secondary)">
                          📄 <strong>Acme Corp Contract:</strong> Renewal deadline approaching.
                        </div>
                        ${currentState.contractReviewed
                          ? '<span style="color:var(--success);font-size:11px;font-weight:600;white-space:nowrap;flex-shrink:0"><i class="fas fa-circle-check"></i> Reviewed</span>'
                          : '<button class="btn btn-secondary btn-xs" id="btn-action-review" style="padding:4px 8px;font-size:11px;white-space:nowrap;flex-shrink:0">Review</button>'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px;padding-top:16px;border-top:1px solid var(--border-color)">
                <button class="btn btn-secondary btn-sm" id="ai-analysis-done">Close</button>
                <button class="btn btn-primary btn-sm" id="ai-analysis-export"><i class="fas fa-download"></i> Export Report</button>
              </div>`;

            // Anomaly Resolution Action
            const fixAnomalyBtn = overlay.querySelector('#btn-fix-anomaly');
            if (fixAnomalyBtn) {
              fixAnomalyBtn.addEventListener('click', (e) => {
                const btn = e.target;
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resolving...';
                
                setTimeout(() => {
                  const resolvedBadge = document.createElement('span');
                  resolvedBadge.style.color = 'var(--success)';
                  resolvedBadge.style.fontSize = '11px';
                  resolvedBadge.style.fontWeight = '600';
                  resolvedBadge.innerHTML = '<i class="fas fa-circle-check"></i> Resolved';
                  btn.replaceWith(resolvedBadge);
                  
                  // Save state
                  const latestState = getAIState();
                  latestState.anomalyResolved = true;
                  saveAIState(latestState);
                  
                  renderAIStateOnPage();
                  showToast('Anomaly resolved: Marketing department budget aligned with baseline guidelines.', 'success');
                }, 1200);
              });
            }

            // Auto-Reorder Action
            const reorderBtn = overlay.querySelector('#btn-action-reorder');
            if (reorderBtn) {
              reorderBtn.addEventListener('click', (e) => {
                const btn = e.target;
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                
                setTimeout(() => {
                  const completedBadge = document.createElement('span');
                  completedBadge.style.color = 'var(--success)';
                  completedBadge.style.fontSize = '11px';
                  completedBadge.style.fontWeight = '600';
                  completedBadge.innerHTML = '<i class="fas fa-circle-check"></i> Ordered';
                  btn.replaceWith(completedBadge);

                  // Save state
                  const latestState = getAIState();
                  latestState.skuOrdered = true;
                  saveAIState(latestState);

                  renderAIStateOnPage();
                  showToast('Purchase order generated successfully for SKU-0089 (Dell Monitor).', 'success');
                }, 1000);
              });
            }

            // Optimize Action
            const optimizeBtn = overlay.querySelector('#btn-action-optimize');
            if (optimizeBtn) {
              optimizeBtn.addEventListener('click', (e) => {
                const btn = e.target;
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Optimizing...';
                
                setTimeout(() => {
                  const completedBadge = document.createElement('span');
                  completedBadge.style.color = 'var(--success)';
                  completedBadge.style.fontSize = '11px';
                  completedBadge.style.fontWeight = '600';
                  completedBadge.innerHTML = '<i class="fas fa-circle-check"></i> Applied';
                  btn.replaceWith(completedBadge);

                  // Save state
                  const latestState = getAIState();
                  latestState.resourceOptimized = true;
                  saveAIState(latestState);

                  renderAIStateOnPage();
                  showToast('Resource allocation updated: 2 developers shifted to Project B.', 'success');
                }, 1000);
              });
            }

            // Review Action
            const reviewBtn = overlay.querySelector('#btn-action-review');
            if (reviewBtn) {
              reviewBtn.addEventListener('click', (e) => {
                const btn = e.target;
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                
                setTimeout(() => {
                  const completedBadge = document.createElement('span');
                  completedBadge.style.color = 'var(--success)';
                  completedBadge.style.fontSize = '11px';
                  completedBadge.style.fontWeight = '600';
                  completedBadge.innerHTML = '<i class="fas fa-circle-check"></i> Reviewed';
                  btn.replaceWith(completedBadge);

                  // Save state
                  const latestState = getAIState();
                  latestState.contractReviewed = true;
                  saveAIState(latestState);

                  renderAIStateOnPage();
                  showToast('Acme Corp contract flagged for review. Opened renewal checklist.', 'info');
                }, 1000);
              });
            }

            overlay.querySelector('#ai-analysis-done').addEventListener('click', closeModal);
            
            overlay.querySelector('#ai-analysis-export').addEventListener('click', () => {
              if (!window.jspdf) {
                showToast('PDF library is loading. Please try again in a few seconds.', 'error');
                return;
              }
              try {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                const now = new Date();
                const dateStr = now.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
                const timeStr = now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
                const finalState = getAIState();

                // Header block
                doc.setFillColor(30, 27, 75); // Dark deep blue background
                doc.rect(0, 0, 210, 35, 'F');
                
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(20);
                doc.setFont('helvetica', 'bold');
                doc.text('Amdox Technologies Pvt Ltd', 14, 15);
                doc.setFontSize(11);
                doc.setFont('helvetica', 'normal');
                doc.text('AI Command Center — Analysis Report', 14, 25);
                
                doc.setFontSize(9);
                doc.text('Generated: ' + dateStr + ' at ' + timeStr, 196, 25, { align:'right' });

                // Content title
                doc.setTextColor(40, 40, 40);
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.text('AI Analysis Summary', 14, 48);

                // Summary text info
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text('Processed 12,847 data points in 4.2 seconds across all enterprise modules.', 14, 55);

                // Revenue Forecast
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(34, 197, 94); // success color (green)
                doc.text('1. Revenue Forecast (High Confidence - 94%)', 14, 68);
                
                doc.setTextColor(80, 80, 80);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text('Q3 2026 revenue is projected at Rs. 2.4 Crore, reflecting a positive trajectory (+18% YoY growth).', 14, 75);

                // Anomalies Found
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(245, 158, 11); // warning color (amber/yellow)
                doc.text('2. Anomalies Detected (AI Confidence - 87%)', 14, 88);
                
                doc.setTextColor(80, 80, 80);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                const anomalyText = finalState.anomalyResolved 
                  ? '0 active anomalies (1 anomaly resolved: Marketing department budget successfully aligned).' 
                  : '1 active anomaly: Marketing department expenses deviate by 23% from baseline pattern.';
                doc.text(anomalyText, 14, 95);

                // Recommendations
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(99, 102, 241); // accent-light (purple/indigo)
                doc.text('3. AI Recommended Actions', 14, 112);
                
                doc.setTextColor(80, 80, 80);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text('Action items status:', 14, 119);

                // Recommendation bullets
                const reorderStatus = finalState.skuOrdered ? 'Completed' : 'Pending Action';
                const optimizeStatus = finalState.resourceOptimized ? 'Applied' : 'Pending Action';
                const reviewStatus = finalState.contractReviewed ? 'Reviewed' : 'Pending Action';

                doc.text(`• Inventory: Auto-reorder SKU-0089 (Dell Monitor) [Status: ${reorderStatus}]`, 18, 126);
                doc.text(`• Resource Allocation: Shift 2 engineers from Project A to B [Status: ${optimizeStatus}]`, 18, 132);
                doc.text(`• Procurement: Acme Corp contract renewal checklist [Status: ${reviewStatus}]`, 18, 138);

                // Footer
                doc.setDrawColor(220, 220, 220);
                doc.line(14, 275, 196, 275);
                doc.setFontSize(8);
                doc.setTextColor(150);
                doc.text('Amdox AI Command Center — Confidential Report | Page 1 of 1', 105, 282, { align:'center' });

                // Save PDF
                doc.save('Amdox_AI_Analysis_Report_' + dateStr.replace(/ /g,'_') + '.pdf');
                showToast('AI Analysis report downloaded successfully!', 'success');
                closeModal();
              } catch (err) {
                console.error('PDF export error:', err);
                showToast('Failed to export PDF: ' + err.message, 'error');
              }
            });
          }, 600);
        }
      }, (i + 1) * 800);
    });
  });

  // ── Chat with AI button ──
  document.getElementById('btn-chat-with-ai').addEventListener('click', () => {
    const panel = document.getElementById('ai-chat-panel');
    if (panel) {
      panel.classList.add('open');
      const input = document.getElementById('ai-input');
      if (input) input.focus();
    }
  });
};
