/* CRM Page — reads from db */
pages.crm = function(container) {
  const s = db.table('crmStats').getAll()[0];
  const leads = db.table('leads').getAll();
  const pipeline = db.table('crmPipeline').getAll();
  const tickets = db.table('tickets').getAll();

  const pipeHTML = pipeline.map((p,i) => `<div class="pipeline-stage${i===0?' active':''}" ondragover="event.preventDefault()" ondrop="window.onDropLead(event, '${p.name}')" onclick="window.viewStatDetail('CRM', '${p.name}')" style="cursor:pointer"><div class="pipeline-stage-name">${p.name}</div><div class="pipeline-stage-value">${p.count}</div><div class="pipeline-stage-count">${p.value} value</div></div>`).join('');

  const badgeMap = {New:'badge-info',Qualified:'badge-purple',Proposal:'badge-warning',Negotiation:'badge-success'};
  const iconMap = {New:'rgba(59,130,246,0.12)',Qualified:'rgba(168,85,247,0.12)',Proposal:'rgba(245,158,11,0.12)',Negotiation:'rgba(34,197,94,0.12)'};
  const colorMap = {New:'var(--info)',Qualified:'var(--purple)',Proposal:'var(--warning)',Negotiation:'var(--success)'};
  const leadsHTML = leads.map(l => `<div class="list-item" draggable="true" ondragstart="window.onDragLead(event, '${l.id}')" onclick="window.editLead('${l.id}')" style="cursor:pointer"><div class="list-icon" style="background:${iconMap[l.stage]};color:${colorMap[l.stage]}"><i class="fas fa-building"></i></div><div class="list-content"><div class="list-title">${l.company}</div><div class="list-subtitle">${l.type} · ${l.value}</div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px"><span class="badge ${badgeMap[l.stage]}">${l.stage}</span><i class="fas fa-pen" style="font-size:10px;color:var(--text-muted)"></i></div></div>`).join('');

  const openTicketsCount = tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length;
  const ticketRows = tickets.map(t => {
    const pClass = {High:'badge-danger',Medium:'badge-info'}[t.priority]||'badge-info';
    const sClass = {'In Progress':'badge-warning',Open:'badge-info',Resolved:'badge-success'}[t.status]||'badge-info';
    return `<tr><td style="font-family:var(--font-mono);font-size:12px;color:var(--accent-light)">${t.ticketNo}</td><td>${t.customer}</td><td>${t.subject}</td><td><span class="badge ${pClass}">${t.priority}</span></td><td><span class="badge ${sClass}">${t.status}</span></td><td>${t.assigned}</td></tr>`;
  }).join('');

  container.innerHTML = `
    <div class="module-hero"><h2><i class="fas fa-handshake" style="color:var(--pink)"></i> Customer Relationship Management</h2><p>Lead management, sales pipeline, customer analytics, support ticketing, and WhatsApp/email marketing integration.</p><div class="page-actions" style="margin-top:16px"><button id="btn-new-lead" class="btn btn-primary btn-sm"><i class="fas fa-user-plus"></i> New Lead</button><button id="btn-new-campaign" class="btn btn-secondary btn-sm"><i class="fas fa-bullhorn"></i> Campaign</button></div></div>
    <div class="stats-grid">
      <div class="stat-card" onclick="window.viewStatDetail('CRM', 'Total Leads')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon blue"><i class="fas fa-users"></i></div><span class="stat-trend up"><i class="fas fa-arrow-up"></i> ${s.leadsGrowth}</span></div><div class="stat-value">${s.totalLeads}</div><div class="stat-label">Total Leads</div></div>
      <div class="stat-card" onclick="window.viewStatDetail('CRM', 'Won Cases')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-trophy"></i></div></div><div class="stat-value">${s.wonThisMonth}</div><div class="stat-label">Won This Month</div></div>
      <div class="stat-card" onclick="window.viewStatDetail('CRM', 'Pipeline Value')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon purple"><i class="fas fa-indian-rupee-sign"></i></div></div><div class="stat-value">${s.pipelineValue}</div><div class="stat-label">Pipeline Value</div></div>
      <div class="stat-card" onclick="window.viewStatDetail('CRM', 'Win Rate')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon yellow"><i class="fas fa-percent"></i></div></div><div class="stat-value">${s.winRate}</div><div class="stat-label">Win Rate</div></div>
    </div>
    <div class="card" style="margin-bottom:24px"><div class="card-header"><span class="card-title">Sales Pipeline</span></div><div class="pipeline">${pipeHTML}</div></div>
    <div class="grid-2">
      <div class="card"><div class="card-header"><span class="card-title">Pipeline Analysis</span></div><div class="chart-container"><canvas data-chart="pipeline"></canvas></div></div>
      <div class="card"><div class="card-header"><span class="card-title">Recent Leads</span></div><div class="activity-list">${leadsHTML}</div></div>
    </div>
    <div class="card"><div class="card-header"><span class="card-title">Support Tickets</span><span class="badge badge-warning">${openTicketsCount} open</span></div><div class="table-container" style="max-height:400px;overflow-y:auto"><table><thead><tr><th>Ticket</th><th>Customer</th><th>Subject</th><th>Priority</th><th>Status</th><th>Assigned</th><th>Actions</th></tr></thead><tbody>${
      tickets.map(t => {
        const pClass = {High:'badge-danger',Medium:'badge-info'}[t.priority]||'badge-info';
        const sClass = {'In Progress':'badge-warning',Open:'badge-info',Resolved:'badge-success'}[t.status]||'badge-info';
        return `<tr><td style="font-family:var(--font-mono);font-size:12px;color:var(--accent-light)">${t.ticketNo}</td><td>${t.customer}</td><td>${t.subject}</td><td><span class="badge ${pClass}">${t.priority}</span></td><td><span class="badge ${sClass}">${t.status}</span></td><td>${t.assigned}</td><td><div style="display:flex;gap:4px"><button class="btn btn-secondary btn-sm btn-icon" title="View" onclick="window.viewTicket('${t.id}')"><i class="fas fa-eye"></i></button><button class="btn btn-secondary btn-sm btn-icon" title="Edit" onclick="window.editTicket('${t.id}')"><i class="fas fa-pen"></i></button><button class="btn btn-secondary btn-sm btn-icon" style="color:var(--danger)" title="Delete" onclick="window.deleteTicket('${t.id}')"><i class="fas fa-trash"></i></button></div></td></tr>`;
      }).join('')
    }</tbody></table></div></div>`;
};


/* Projects Page — reads from db */
pages.projects = function(container) {
  const s = db.table('projectStats').getAll()[0];
  const kanban = db.table('kanban').getAll()[0];
  const timeline = db.table('projectTimeline').getAll();

  function renderCards(cards, borderColor, opacity) {
    return cards.map(c => {
      const avatars = c.assignees.map(a => `<div class="avatar">${a}</div>`).join('');
      return `<div class="kanban-card" onclick="window.editProject('${c.id}')" ${borderColor?` style="border-left:3px solid var(--${borderColor})${opacity?';opacity:0.7':''}"`:''}><div class="kanban-card-title">${c.title}</div><div class="kanban-card-meta"><span class="badge badge-${c.tagColor}" style="font-size:10px">${c.tag}</span><div class="avatar-group">${avatars}</div></div></div>`;
    }).join('');
  }

  const ganttHTML = timeline.map(t => `
    <div class="gantt-row">
      <div class="gantt-label">${t.name}</div>
      <div class="gantt-bar-container">
        <div class="gantt-bar" style="left:${Math.max(0, t.progress - 40)}%; width:${t.progress}%; background:${t.gradient}">
          <span style="padding-left:10px">${t.progress}%</span>
        </div>
      </div>
    </div>`).join('');

  const timelineMilestones = [
    { date: 'May 12', title: 'Phase 1 Completion', desc: 'Core infrastructure and database schema finalized.', type: 'success', icon: 'fa-check' },
    { date: 'May 20', title: 'UI Design Approved', desc: 'Figma prototypes for all modules signed off by stakeholders.', type: 'info', icon: 'fa-palette' },
    { date: 'June 02', title: 'API Integration Start', desc: 'Moving from local mock data to actual microservices integration.', type: 'warning', icon: 'fa-link' },
    { date: 'June 15', title: 'Internal Beta Launch', desc: 'Soft launch for internal testing and QA.', type: 'purple', icon: 'fa-rocket' },
    { date: 'July 01', title: 'Client UAT', desc: 'User Acceptance Testing begins with regional heads.', type: 'accent', icon: 'fa-users-viewfinder' }
  ];

  const timelineHTML = timelineMilestones.map(m => `
    <div class="activity-item">
      <div class="activity-dot ${m.type}"></div>
      <div style="flex:1">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px">
          <div class="activity-text"><i class="fas ${m.icon}" style="margin-right:8px; opacity:0.8"></i> <strong>${m.title}</strong></div>
          <div class="activity-time">${m.date}</div>
        </div>
        <div style="font-size:13px; color:var(--text-muted); line-height:1.4">${m.desc}</div>
      </div>
    </div>`).join('');

  container.innerHTML = `
    <div class="module-hero">
      <h2><i class="fas fa-diagram-project" style="color:var(--accent-light)"></i> Project Management</h2>
      <p>Agile workflows, Kanban boards, Gantt charts, sprint management, resource allocation, and budget tracking.</p>
      <div class="page-actions" style="margin-top:16px">
        <button id="btn-new-project" class="btn btn-primary btn-sm"><i class="fas fa-plus"></i> New Project</button>
        <button id="btn-add-task" class="btn btn-primary btn-sm"><i class="fas fa-list-check"></i> Add Task</button>
        <button id="btn-my-tasks" class="btn btn-secondary btn-sm"><i class="fas fa-tasks"></i> My Tasks</button>
      </div>
    </div>
    
    <div class="stats-grid">
      <div class="stat-card" onclick="window.viewStatDetail('Projects', 'Active Projects')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon indigo"><i class="fas fa-folder-open"></i></div></div><div class="stat-value">${s.activeProjects}</div><div class="stat-label">Active Projects</div></div>
      <div class="stat-card" onclick="window.viewStatDetail('Projects', 'Tasks Completed')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-check-double"></i></div></div><div class="stat-value">${s.tasksCompleted}</div><div class="stat-label">Tasks Completed</div></div>
      <div class="stat-card" onclick="window.viewStatDetail('Projects', 'Tasks In Progress')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon yellow"><i class="fas fa-clock"></i></div></div><div class="stat-value">${s.inProgress}</div><div class="stat-label">In Progress</div></div>
      <div class="stat-card" onclick="window.viewStatDetail('Projects', 'Overdue Tasks')" style="cursor:pointer"><div class="stat-card-header"><div class="stat-icon red"><i class="fas fa-flag"></i></div></div><div class="stat-value">${s.overdue}</div><div class="stat-label">Overdue</div></div>
    </div>

    <div class="tabs">
      <div class="tab active" onclick="switchProjectView('kanban', this)">Kanban Board</div>
      <div class="tab" onclick="switchProjectView('gantt', this)">Gantt Chart</div>
      <div class="tab" onclick="switchProjectView('sprint', this)">Sprint</div>
      <div class="tab" onclick="switchProjectView('timeline', this)">Timeline</div>
    </div>

    <div id="project-view-content" class="animate-fade">
      <!-- Kanban View -->
      <div id="view-kanban" class="project-view">
        <div class="kanban-board" style="margin-bottom:24px">
          <div class="kanban-column"><div class="kanban-column-header"><span class="kanban-column-title" style="color:var(--text-muted)">📋 Backlog</span><span class="kanban-count">${kanban.backlog.length}</span></div><div class="kanban-cards">${renderCards(kanban.backlog)}</div></div>
          <div class="kanban-column"><div class="kanban-column-header"><span class="kanban-column-title" style="color:var(--info)">🔄 In Progress</span><span class="kanban-count">${kanban.inProgress.length}</span></div><div class="kanban-cards">${renderCards(kanban.inProgress,'info')}</div></div>
          <div class="kanban-column"><div class="kanban-column-header"><span class="kanban-column-title" style="color:var(--warning)">👀 Review</span><span class="kanban-count">${kanban.review.length}</span></div><div class="kanban-cards">${renderCards(kanban.review,'warning')}</div></div>
          <div class="kanban-column"><div class="kanban-column-header"><span class="kanban-column-title" style="color:var(--success)">✅ Done</span><span class="kanban-count">${kanban.done.length}</span></div><div class="kanban-cards">${renderCards(kanban.done,'success',true)}</div></div>
        </div>
      </div>

      <!-- Gantt View -->
      <div id="view-gantt" class="project-view" style="display:none">
        <div class="card">
          <div class="card-header">
            <span class="card-title">Project Roadmap & Gantt Schedule</span>
            <span class="badge badge-info">July 2026</span>
          </div>
          <div style="padding: 10px 0;">
            ${ganttHTML}
          </div>
        </div>
      </div>

      <!-- Sprint View -->
      <div id="view-sprint" class="project-view" style="display:none">
        <div class="grid-2">
          <div class="card">
            <div class="card-header"><span class="card-title">Sprint Burndown — Sprint 14</span></div>
            <div class="chart-container"><canvas data-chart="sprint"></canvas></div>
          </div>
          <div class="card">
            <div class="card-header"><span class="card-title">Sprint Velocity</span></div>
            <div class="activity-list" style="padding: 20px;">
              <div style="text-align:center; margin-bottom: 24px;">
                <div style="font-size: 32px; font-weight: 800; color: var(--success);">48</div>
                <div style="font-size: 13px; color: var(--text-muted);">Points Completed this Sprint</div>
              </div>
              <div style="height: 1px; background: var(--border-color); margin-bottom: 20px;"></div>
              <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                <span style="font-size:13px; color:var(--text-muted);">Planned Points</span>
                <span style="font-weight:600;">52</span>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
                <span style="font-size:13px; color:var(--text-muted);">Scope Creep</span>
                <span style="font-weight:600; color:var(--danger);">+4</span>
              </div>
              <div style="display:flex; justify-content:space-between;">
                <span style="font-size:13px; color:var(--text-muted);">Unfinished Tasks</span>
                <span style="font-weight:600;">3</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Timeline View -->
      <div id="view-timeline" class="project-view" style="display:none">
        <div class="card">
          <div class="card-header"><span class="card-title">Detailed Project Milestones</span></div>
          <div class="activity-list" style="padding: 10px 0;">
            ${timelineHTML}
          </div>
        </div>
      </div>
    </div>`;

  // Define local switching logic
  window.switchProjectView = function(viewId, el) {
    // UI Tabs
    el.parentElement.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');

    // Views
    document.querySelectorAll('.project-view').forEach(v => v.style.display = 'none');
    const target = document.getElementById('view-' + viewId);
    if (target) {
      target.style.display = 'block';
      target.classList.add('animate-fade');
    }
    
    // Re-init chart if switching to sprint
    if (viewId === 'sprint') {
        setTimeout(() => initChartsOnPage('projects'), 100);
    }
  };
};

/* AI Command Center — reads from db */
pages['ai-center'] = function(container) {
  const s = db.table('aiStats').getAll()[0];
  const insights = db.table('aiInsights').getAll();
  const models = db.table('aiModels').getAll();

  const modelsHTML = models.map(m => `<div class="card" style="border-color:rgba(99,102,241,0.3)"><div style="text-align:center;padding:20px 0"><div style="width:60px;height:60px;border-radius:16px;background:${m.gradient};display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:24px;color:#fff"><i class="fas ${m.icon}"></i></div><h3 style="font-size:16px;margin-bottom:6px">${m.name}</h3><p style="font-size:13px;color:var(--text-secondary)">${m.type}</p><div style="margin-top:16px"><span class="badge badge-success">${m.status}</span></div></div></div>`).join('');

  const insightsHTML = insights.map(i => `<div class="activity-item"><div class="activity-dot ${i.dot}"></div><div><div class="activity-text">${i.icon} <strong>${i.type}:</strong> ${i.msg}</div><div class="activity-time">AI Confidence: ${i.confidence}%</div></div></div>`).join('');

  container.innerHTML = `
    <div class="module-hero" style="background:linear-gradient(135deg,rgba(99,102,241,0.1),rgba(168,85,247,0.1))"><h2><i class="fas fa-brain" style="color:var(--purple)"></i> AI Command Center</h2><p>Demand forecasting, anomaly detection, intelligent approvals, predictive analytics, and AI-generated business insights.</p><div class="page-actions" style="margin-top:16px"><button id="btn-run-ai-page" onclick="window.runAnalysis()" class="btn btn-primary btn-sm"><i class="fas fa-wand-magic-sparkles"></i> Run AI Analysis</button><button id="btn-chat-ai-page" onclick="window.openAIPanel('Generate a business intelligence report for Q2')" class="btn btn-secondary btn-sm"><i class="fas fa-robot"></i> Chat with AI</button></div></div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon purple"><i class="fas fa-brain"></i></div></div><div class="stat-value">${s.modelsActive}</div><div class="stat-label">AI Models Active</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-bullseye"></i></div></div><div class="stat-value">${s.forecastAccuracy}</div><div class="stat-label">Forecast Accuracy</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon cyan"><i class="fas fa-bolt"></i></div></div><div class="stat-value">${s.predictionsToday}</div><div class="stat-label">Predictions Today</div></div>
      <div class="stat-card"><div class="stat-card-header"><div class="stat-icon pink"><i class="fas fa-shield-halved"></i></div></div><div class="stat-value">${s.anomaliesDetected}</div><div class="stat-label">Anomalies Detected</div></div>
    </div>
    <div class="grid-3">${modelsHTML}</div>
    <div class="grid-2">
      <div class="card"><div class="card-header"><span class="card-title">AI-Generated Insights</span><span class="badge badge-purple">Last 24h</span></div><div class="activity-list">${insightsHTML}</div></div>
      <div class="card"><div class="card-header"><span class="card-title">Revenue Forecast</span></div><div class="chart-container"><canvas data-chart="revenue"></canvas></div></div>
    </div>`;
};
