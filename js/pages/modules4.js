window.pages = window.pages || {};
var pages = window.pages;
/* ============================================================
   E-Commerce Page — Unified Dashboard & Sync Simulator
   ============================================================ */
pages.ecommerce = function(container) {
  const LS_ECOM_ORDERS = 'amdox_ecom_orders';
  const SEED_ORDERS = [
    { id: 'ORD-4521', platform: 'Shopify', customer: 'Rajesh Gupta', amount: 4299, status: 'Delivered' },
    { id: 'ORD-4520', platform: 'WooCommerce', customer: 'Sneha Reddy', amount: 12500, status: 'Shipped' },
    { id: 'ORD-4519', platform: 'Amazon', customer: 'Karan Mehta', amount: 8999, status: 'Processing' }
  ];

  function getOrders() {
    try { return JSON.parse(localStorage.getItem(LS_ECOM_ORDERS)) || SEED_ORDERS; } catch { return SEED_ORDERS; }
  }
  function saveOrders(list) {
    try { localStorage.setItem(LS_ECOM_ORDERS, JSON.stringify(list)); } catch {}
  }

  const renderECom = () => {
    const orders = getOrders();
    const totalOrders = orders.length;
    const totalRev = orders.reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0);

    container.innerHTML = `
      <div class="module-hero">
        <h2><i class="fas fa-cart-shopping" style="color:var(--success)"></i> E-Commerce Integration</h2>
        <p>Shopify, WooCommerce, and marketplace API integrations with unified order management and inventory sync.</p>
      </div>
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-shopping-bag"></i></div><span class="stat-trend up"><i class="fas fa-arrow-up"></i> 24%</span></div><div class="stat-value" id="ecom-stat-count">${totalOrders}</div><div class="stat-label">Orders This Month</div></div>
        <div class="stat-card"><div class="stat-card-header"><div class="stat-icon blue"><i class="fas fa-indian-rupee-sign"></i></div></div><div class="stat-value" id="ecom-stat-rev">₹${(totalRev / 100000).toFixed(2)}L</div><div class="stat-label">E-Com Revenue</div></div>
        <div class="stat-card"><div class="stat-card-header"><div class="stat-icon purple"><i class="fas fa-store"></i></div></div><div class="stat-value">3</div><div class="stat-label">Connected Stores</div></div>
        <div class="stat-card" id="ecom-sync-btn" style="cursor:pointer;"><div class="stat-card-header"><div class="stat-icon yellow"><i class="fas fa-rotate"></i></div></div><div class="stat-value" id="ecom-sync-text">Synced</div><div class="stat-label">Click to Force Sync</div></div>
      </div>
      <div class="grid-3" style="margin-bottom: 24px;">
        <div class="card" style="border-color:rgba(34,197,94,0.3)"><div style="text-align:center;padding:20px"><div style="width:50px;height:50px;border-radius:12px;background:rgba(34,197,94,0.12);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:22px;color:var(--success)"><i class="fab fa-shopify"></i></div><h3 style="font-size:15px;margin-bottom:4px">Shopify</h3><p style="font-size:12px;color:var(--text-muted)">842 products synced</p><span class="badge badge-success" style="margin-top:8px">Connected</span></div></div>
        <div class="card" style="border-color:rgba(168,85,247,0.3)"><div style="text-align:center;padding:20px"><div style="width:50px;height:50px;border-radius:12px;background:rgba(168,85,247,0.12);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:22px;color:var(--purple)"><i class="fab fa-wordpress"></i></div><h3 style="font-size:15px;margin-bottom:4px">WooCommerce</h3><p style="font-size:12px;color:var(--text-muted)">356 products synced</p><span class="badge badge-success" style="margin-top:8px">Connected</span></div></div>
        <div class="card" style="border-color:rgba(245,158,11,0.3)"><div style="text-align:center;padding:20px"><div style="width:50px;height:50px;border-radius:12px;background:rgba(245,158,11,0.12);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:22px;color:var(--warning)"><i class="fab fa-amazon"></i></div><h3 style="font-size:15px;margin-bottom:4px">Amazon Marketplace</h3><p style="font-size:12px;color:var(--text-muted)">289 products synced</p><span class="badge badge-success" style="margin-top:8px">Connected</span></div></div>
      </div>
      <div class="card">
        <div class="card-header">
          <span class="card-title">Recent Orders</span>
          <button class="btn btn-primary btn-sm" id="ecom-new-order-btn"><i class="fas fa-plus"></i> Create Order</button>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Platform</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="ecom-orders-tbody">
              <!-- Rendered dynamically -->
            </tbody>
          </table>
        </div>
      </div>`;

    const tbody = document.getElementById('ecom-orders-tbody');
    const platBadgeClass = p => {
      if (p === 'Shopify') return 'badge-success';
      if (p === 'WooCommerce') return 'badge-purple';
      return 'badge-warning';
    };
    const platIcon = p => {
      if (p === 'Shopify') return '<i class="fab fa-shopify"></i>';
      if (p === 'WooCommerce') return '<i class="fab fa-wordpress"></i>';
      return '<i class="fab fa-amazon"></i>';
    };
    const statusBadge = s => {
      if (s === 'Delivered') return 'badge-success';
      if (s === 'Shipped') return 'badge-info';
      return 'badge-warning';
    };

    tbody.innerHTML = orders.map(o => `
      <tr>
        <td style="font-family:var(--font-mono);font-size:12px;color:var(--accent-light)">${escHtml(o.id)}</td>
        <td><span class="badge ${platBadgeClass(o.platform)}">${platIcon(o.platform)} ${escHtml(o.platform)}</span></td>
        <td>${escHtml(o.customer)}</td>
        <td style="font-family:var(--font-mono)">₹${Number(o.amount).toLocaleString('en-IN')}</td>
        <td><span class="badge ${statusBadge(o.status)}">${escHtml(o.status)}</span></td>
        <td>
          <button class="btn btn-secondary btn-sm" style="color:var(--danger); padding:4px 8px;" onclick="ecomDeleteOrder('${o.id}')"><i class="fas fa-trash"></i></button>
        </td>
      </tr>`).join('');

    // Hook Create Order button
    document.getElementById('ecom-new-order-btn').addEventListener('click', () => {
      showModal({
        title: '<i class="fas fa-shopping-bag" style="color:var(--success)"></i> Create Demo Order',
        submitLabel: 'Add Order',
        fields: [
          { name: 'platform', label: 'Store Platform', type: 'select', options: ['Shopify', 'WooCommerce', 'Amazon'], default: 'Shopify' },
          { name: 'customer', label: 'Customer Name', required: true, placeholder: 'e.g. Anita Singh' },
          { name: 'amount', label: 'Order Value (₹)', required: true, type: 'number', placeholder: 'e.g. 1500' },
          { name: 'status', label: 'Delivery Status', type: 'select', options: ['Processing', 'Shipped', 'Delivered'], default: 'Processing' }
        ],
        async onSubmit(data, close) {
          const list = getOrders();
          const nextId = 'ORD-' + (4500 + list.length + 22);
          list.unshift({ id: nextId, ...data });
          saveOrders(list);
          showToast(`✅ Order ${nextId} created successfully!`, 'success');
          close();
          renderECom();
        }
      });
    });

    // Hook Force Sync button
    document.getElementById('ecom-sync-btn').addEventListener('click', () => {
      const text = document.getElementById('ecom-sync-text');
      text.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      showToast('Syncing orders from active store integrations...', 'info');
      setTimeout(() => {
        text.textContent = 'Synced';
        showToast('✅ All stores synchronized successfully!', 'success');
      }, 1500);
    });
  };

  window.ecomDeleteOrder = function(id) {
    showConfirm(`Delete order <strong>${id}</strong>?`, () => {
      const list = getOrders().filter(o => o.id !== id);
      saveOrders(list);
      showToast(`Order ${id} deleted.`, 'success');
      renderECom();
    });
  };

  renderECom();
};

/* ============================================================
   Communication Page — Team Chats & Announcements
   ============================================================ */
pages.communication = function(container) {
  const LS_CHAT = 'amdox_chat_msgs';
  const LS_ANNOUNCEMENTS = 'amdox_announcements';
  
  const SEED_MSGS = {
    'general': [
      { sender: 'Anita Patel', text: 'Has everyone checked the new Q2 revenue projections?', time: '2:15 PM' },
      { sender: 'Rahul Singh', text: 'Yes, looking solid. The AI forecast models were very close.', time: '2:18 PM' }
    ],
    'engineering': [
      { sender: 'Priya Sharma', text: 'Just pushed the SSO fix to feature/auth branch.', time: '10:05 AM' },
      { sender: 'Rahul Singh', text: 'Awesome, running the build checklist now.', time: '10:11 AM' }
    ],
    'sales': [
      { sender: 'Anita Patel', text: 'Tata Motors contract finalized. Great work everyone!', time: 'Yesterday' }
    ]
  };

  const SEED_ANN = [
    { text: '📢 Town Hall Meeting — Friday 4 PM, all hands deck', author: 'CEO', time: '2 hours ago', dot: 'blue' },
    { text: '🎉 Q2 Results: Revenue target exceeded by 18%!', author: 'Finance', time: 'Yesterday', dot: 'green' }
  ];

  function getMsgs(chan) {
    try {
      const all = JSON.parse(localStorage.getItem(LS_CHAT)) || SEED_MSGS;
      return all[chan] || [];
    } catch { return SEED_MSGS[chan] || []; }
  }

  function saveMsg(chan, msg) {
    try {
      const all = JSON.parse(localStorage.getItem(LS_CHAT)) || SEED_MSGS;
      if (!all[chan]) all[chan] = [];
      all[chan].push(msg);
      localStorage.setItem(LS_CHAT, JSON.stringify(all));
    } catch {}
  }

  function getAnnouncements() {
    try { return JSON.parse(localStorage.getItem(LS_ANNOUNCEMENTS)) || SEED_ANN; } catch { return SEED_ANN; }
  }

  function saveAnnouncements(list) {
    try { localStorage.setItem(LS_ANNOUNCEMENTS, JSON.stringify(list)); } catch {}
  }

  let activeChannel = 'general';

  const renderComm = () => {
    const anns = getAnnouncements();
    const currentMsgs = getMsgs(activeChannel);

    container.innerHTML = `
      <div class="module-hero">
        <h2><i class="fas fa-comments" style="color:var(--info)"></i> Internal Communication</h2>
        <p>Team chat, video meetings, company announcements, knowledge base, and SOP documentation portal.</p>
      </div>
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-card-header"><div class="stat-icon blue"><i class="fas fa-message"></i></div></div><div class="stat-value" id="comm-total-msgs">1,245</div><div class="stat-label">Messages Today</div></div>
        <div class="stat-card"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-video"></i></div></div><div class="stat-value">8</div><div class="stat-label">Active Meetings</div></div>
        <div class="stat-card"><div class="stat-card-header"><div class="stat-icon purple"><i class="fas fa-bullhorn"></i></div></div><div class="stat-value" id="comm-total-ann">${anns.length}</div><div class="stat-label">Announcements</div></div>
        <div class="stat-card" id="btn-start-meet" style="cursor:pointer;"><div class="stat-card-header"><div class="stat-icon cyan"><i class="fas fa-camera"></i></div></div><div class="stat-value">Meet</div><div class="stat-label">Start Huddle</div></div>
      </div>
      <div class="grid-2">
        <div class="card" style="display:flex; flex-direction:column; height: 480px;">
          <div class="card-header" style="padding-bottom: 8px;">
            <span class="card-title">Chat Room: #${activeChannel}</span>
            <div style="display:flex; gap:4px">
              <button class="btn btn-secondary btn-xs ${activeChannel === 'general' ? 'active' : ''}" onclick="commSelectChannel('general')">#general</button>
              <button class="btn btn-secondary btn-xs ${activeChannel === 'engineering' ? 'active' : ''}" onclick="commSelectChannel('engineering')">#eng</button>
              <button class="btn btn-secondary btn-xs ${activeChannel === 'sales' ? 'active' : ''}" onclick="commSelectChannel('sales')">#sales</button>
            </div>
          </div>
          <div class="activity-list" id="comm-chat-log" style="flex:1; overflow-y:auto; padding:12px; display:flex; flex-direction:column; gap:10px; border-bottom: 1px solid var(--border)">
            <!-- Render messages -->
          </div>
          <form id="comm-chat-form" style="display:flex; gap:8px; padding:10px;">
            <input type="text" class="form-input" id="comm-input" placeholder="Type a message to #${activeChannel}..." style="flex:1;" autocomplete="off">
            <button type="submit" class="btn btn-primary" style="padding: 8px 16px;"><i class="fas fa-paper-plane"></i></button>
          </form>
        </div>
        <div class="card" style="display:flex; flex-direction:column; height: 480px;">
          <div class="card-header">
            <span class="card-title">Announcements</span>
            <button class="btn btn-primary btn-sm" id="comm-add-ann-btn"><i class="fas fa-plus"></i> Post Announcement</button>
          </div>
          <div class="activity-list" id="comm-ann-list" style="flex:1; overflow-y:auto; padding:12px;">
            <!-- Announcements -->
          </div>
        </div>
      </div>`;

    // Render Chat Log
    const chatLog = document.getElementById('comm-chat-log');
    if (currentMsgs.length === 0) {
      chatLog.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:30px; font-size:13px;">No messages in this channel yet.</div>`;
    } else {
      chatLog.innerHTML = currentMsgs.map(m => `
        <div style="background:rgba(255,255,255,0.02); padding:8px 12px; border-radius:8px; border:1px solid var(--border)">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-size:11.5px;">
            <strong style="color:var(--accent-light)">${escHtml(m.sender)}</strong>
            <span style="color:var(--text-muted)">${escHtml(m.time)}</span>
          </div>
          <div style="font-size:13px; color:var(--text-secondary)">${escHtml(m.text)}</div>
        </div>`).join('');
      // Scroll to bottom
      chatLog.scrollTop = chatLog.scrollHeight;
    }

    // Render Announcements
    const annList = document.getElementById('comm-ann-list');
    annList.innerHTML = anns.map(a => `
      <div class="activity-item">
        <div class="activity-dot ${a.dot || 'blue'}"></div>
        <div>
          <div class="activity-text">${escHtml(a.text)}</div>
          <div class="activity-time">Posted by ${escHtml(a.author)} · ${escHtml(a.time)}</div>
        </div>
      </div>`).join('');

    // Attach Chat Submit
    document.getElementById('comm-chat-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('comm-input');
      const val = input.value.trim();
      if (!val) return;

      const userJson = localStorage.getItem('amdox_auth_user');
      let name = 'Amit Kumar';
      if (userJson) {
        try { name = JSON.parse(userJson).name; } catch(err) {}
      }

      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      
      const newMsg = { sender: name, text: val, time: timeStr };
      saveMsg(activeChannel, newMsg);
      input.value = '';
      renderComm();

      // Bump chat stat slightly
      const countEl = document.getElementById('comm-total-msgs');
      if (countEl) {
        const val = parseInt(countEl.textContent.replace(/,/g, '')) || 1245;
        countEl.textContent = Number(val + 1).toLocaleString('en-IN');
      }
    });

    // Attach Post Announcement
    document.getElementById('comm-add-ann-btn').addEventListener('click', () => {
      showModal({
        title: '<i class="fas fa-bullhorn" style="color:var(--purple)"></i> Post Company Announcement',
        submitLabel: 'Publish',
        fields: [
          { name: 'text', label: 'Announcement Message', required: true, placeholder: 'e.g. Q3 goals aligned...' },
          { name: 'author', label: 'Author Department/Name', required: true, placeholder: 'e.g. HR Team', default: 'HR Team' },
          { name: 'dot', label: 'Alert Tag Color', type: 'select', options: ['blue', 'green', 'yellow', 'purple', 'red'], default: 'blue' }
        ],
        async onSubmit(data, close) {
          const list = getAnnouncements();
          list.unshift({ ...data, time: 'Just now' });
          saveAnnouncements(list);
          showToast('📢 New announcement broadcasted!', 'success');
          close();
          renderComm();
        }
      });
    });

    // Start Huddle
    document.getElementById('btn-start-meet').addEventListener('click', () => {
      showToast('🎥 Meeting room created! Huddle room #amdox-office is now live.', 'success');
    });
  };

  window.commSelectChannel = function(chan) {
    activeChannel = chan;
    renderComm();
  };

  renderComm();
};

/* ============================================================
   DevOps Page — Automated CI/CD Deploy Pipelines
   ============================================================ */
pages.devops = function(container) {
  const LS_DEVOPS_BUILDS = 'amdops_builds';
  const LS_DEVOPS_STATS = 'amdops_stats';

  const SEED_BUILDS = [
    { id: '847', branch: 'main', action: 'Deployed to production', time: '5 min ago', status: 'Passed' },
    { id: '846', branch: 'feature/ai-module', action: 'Deployed to staging', time: '1 hour ago', status: 'Passed' },
    { id: '845', branch: 'fix/auth-bug', action: 'Test compilation', time: '2 hours ago', status: 'Failed' },
    { id: '844', branch: 'main', action: 'Production release', time: '5 hours ago', status: 'Passed' }
  ];

  const SEED_STATS = { uptime: '99.98%', builds: 847, pods: 24, latency: 45 };

  function getBuilds() {
    try { return JSON.parse(localStorage.getItem(LS_DEVOPS_BUILDS)) || SEED_BUILDS; } catch { return SEED_BUILDS; }
  }
  function saveBuilds(list) {
    try { localStorage.setItem(LS_DEVOPS_BUILDS, JSON.stringify(list)); } catch {}
  }
  function getStats() {
    try { return JSON.parse(localStorage.getItem(LS_DEVOPS_STATS)) || SEED_STATS; } catch { return SEED_STATS; }
  }
  function saveStats(stats) {
    try { localStorage.setItem(LS_DEVOPS_STATS, JSON.stringify(stats)); } catch {}
  }

  const renderDevOps = () => {
    const builds = getBuilds();
    const stats = getStats();

    container.innerHTML = `
      <div class="module-hero">
        <h2><i class="fas fa-server" style="color:var(--cyan)"></i> DevOps & Deployment</h2>
        <p>CI/CD pipelines, Docker/Kubernetes, Terraform IaC, ArgoCD GitOps, and Prometheus/Grafana monitoring.</p>
      </div>
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-card-header"><div class="stat-icon green"><i class="fas fa-circle-check"></i></div></div><div class="stat-value" id="devops-stat-uptime">${stats.uptime}</div><div class="stat-label">Uptime</div></div>
        <div class="stat-card"><div class="stat-card-header"><div class="stat-icon blue"><i class="fas fa-code-branch"></i></div></div><div class="stat-value" id="devops-stat-builds">${stats.builds}</div><div class="stat-label">Deployments</div></div>
        <div class="stat-card"><div class="stat-card-header"><div class="stat-icon cyan"><i class="fas fa-cubes"></i></div></div><div class="stat-value" id="devops-stat-pods">${stats.pods}</div><div class="stat-label">Active Pods</div></div>
        <div class="stat-card"><div class="stat-card-header"><div class="stat-icon purple"><i class="fas fa-gauge-high"></i></div></div><div class="stat-value" id="devops-stat-latency">${stats.latency}ms</div><div class="stat-label">Avg Latency</div></div>
      </div>
      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <span class="card-title">CI/CD Pipeline Status</span>
            <button class="btn btn-primary btn-sm" id="devops-deploy-btn"><i class="fas fa-play"></i> Trigger Deploy</button>
          </div>
          <div class="activity-list" id="devops-builds-list">
            <!-- Dynamically rendered builds -->
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

    const buildsList = document.getElementById('devops-builds-list');
    const badgeClass = status => {
      if (status === 'Passed') return 'badge-success';
      if (status === 'Failed') return 'badge-danger';
      return 'badge-warning';
    };
    const buildIcon = status => {
      if (status === 'Passed') return 'fa-check-circle';
      if (status === 'Failed') return 'fa-times-circle';
      return 'fa-spinner fa-spin';
    };
    const listColor = status => {
      if (status === 'Passed') return 'var(--success)';
      if (status === 'Failed') return 'var(--danger)';
      return 'var(--warning)';
    };

    buildsList.innerHTML = builds.map(b => `
      <div class="list-item">
        <div class="list-icon" style="background:rgba(255,255,255,0.03);color:${listColor(b.status)}">
          <i class="fas ${buildIcon(b.status)}"></i>
        </div>
        <div class="list-content">
          <div class="list-title">Build #${b.id} — ${escHtml(b.branch)}</div>
          <div class="list-subtitle">${escHtml(b.action)} · ${escHtml(b.time)}</div>
        </div>
        <span class="badge ${badgeClass(b.status)}">${escHtml(b.status)}</span>
      </div>`).join('');

    // Deploy simulation
    document.getElementById('devops-deploy-btn').addEventListener('click', (e) => {
      const btn = e.target;
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Compiling...';

      // Insert temporary building item
      const list = getBuilds();
      const currentStats = getStats();
      const nextBuildId = String(currentStats.builds + 1);
      
      const activeBuild = { id: nextBuildId, branch: 'main', action: 'Provisioning cluster nodes', time: 'Just now', status: 'Running' };
      list.unshift(activeBuild);
      saveBuilds(list);
      renderDevOps();
      showToast(`⚡ CI/CD Pipeline #${nextBuildId} initiated!`, 'info');

      // Compile steps
      setTimeout(() => {
        const freshList = getBuilds();
        const activeIdx = freshList.findIndex(b => b.id === nextBuildId);
        if (activeIdx > -1) {
          freshList[activeIdx].action = 'Compiling Docker images & running tests';
          saveBuilds(freshList);
          renderDevOps();
        }
      }, 1500);

      // Finalize compiler result
      setTimeout(() => {
        const freshList = getBuilds();
        const activeIdx = freshList.findIndex(b => b.id === nextBuildId);
        if (activeIdx > -1) {
          const pass = Math.random() < 0.85;
          freshList[activeIdx].status = pass ? 'Passed' : 'Failed';
          freshList[activeIdx].action = pass ? 'Deployed to production cluster successfully' : 'Compilation error in unit tests';
          freshList[activeIdx].time = '1s ago';
          saveBuilds(freshList);
          
          // Update Stats
          currentStats.builds += 1;
          if (pass) {
            currentStats.pods += Math.floor(Math.random() * 3) - 1; // pods drift
            currentStats.latency = Math.floor(38 + Math.random() * 10); // latency drift
          }
          saveStats(currentStats);

          showToast(pass ? `✅ Build #${nextBuildId} deployed!` : `❌ Pipeline #${nextBuildId} failed tests.`, pass ? 'success' : 'error');
        }
        renderDevOps();
      }, 3500);
    });
  };

  renderDevOps();
};

/* ============================================================
   Settings Page — Dynamic Tenant Syncing
   ============================================================ */
pages.settings = function(container) {
  const renderSettings = () => {
    const userJson = localStorage.getItem('amdox_auth_user');
    let currentUser = { name: 'Amit Kumar', email: 'amit@amdox.com', role: 'Super Admin' };
    if (userJson) {
      try { currentUser = JSON.parse(userJson); } catch (e) {}
    }

    const tenantName = localStorage.getItem('amdox_tenant_name') || 'Amdox Technologies Pvt Ltd';
    const planName = localStorage.getItem('amdox_platform_plan') || 'Enterprise';

    container.innerHTML = `
      <div class="module-hero">
        <h2><i class="fas fa-gear" style="color:var(--text-secondary)"></i> Platform Settings</h2>
        <p>Company configuration, user management, integrations, billing, and system preferences.</p>
      </div>
      <div class="grid-3" style="margin-bottom: 24px;">
        <div class="card" id="set-card-company" style="cursor:pointer"><div style="text-align:center;padding:16px"><div style="width:48px;height:48px;border-radius:12px;background:rgba(99,102,241,0.12);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:20px;color:var(--accent)"><i class="fas fa-building"></i></div><h3 style="font-size:14px">Company Profile</h3><p style="font-size:12px;color:var(--text-muted);margin-top:4px">Name, logo, address</p></div></div>
        <div class="card" id="set-card-user" style="cursor:pointer"><div style="text-align:center;padding:16px"><div style="width:48px;height:48px;border-radius:12px;background:rgba(34,197,94,0.12);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:20px;color:var(--success)"><i class="fas fa-users-gear"></i></div><h3 style="font-size:14px">User Settings</h3><p style="font-size:12px;color:var(--text-muted);margin-top:4px">Account configurations</p></div></div>
        <div class="card" id="set-card-backup" style="cursor:pointer"><div style="text-align:center;padding:16px"><div style="width:48px;height:48px;border-radius:12px;background:rgba(6,182,212,0.12);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:20px;color:var(--cyan)"><i class="fas fa-database"></i></div><h3 style="font-size:14px">Data & Backup</h3><p style="font-size:12px;color:var(--text-muted);margin-top:4px">Export local cache</p></div></div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">System Information</span></div>
        <div class="table-container">
          <table>
            <tbody>
              <tr><td style="font-weight:600;width:200px">Platform Version</td><td>Amdox ERP v3.2.1</td></tr>
              <tr><td style="font-weight:600">Active Tenant</td><td id="settings-info-tenant">${escHtml(tenantName)}</td></tr>
              <tr><td style="font-weight:600">Plan Status</td><td><span class="badge badge-purple">${escHtml(planName)}</span></td></tr>
              <tr><td style="font-weight:600">Logged In User</td><td>${escHtml(currentUser.name)} (${escHtml(currentUser.email)})</td></tr>
              <tr><td style="font-weight:600">Last Backup</td><td id="settings-info-backup">May 18, 2026 · 02:00 AM IST</td></tr>
            </tbody>
          </table>
        </div>
      </div>`;

    // Hook company profile edit
    document.getElementById('set-card-company').addEventListener('click', () => {
      showModal({
        title: '<i class="fas fa-building" style="color:var(--accent)"></i> Edit Company Profile',
        submitLabel: 'Save Settings',
        fields: [
          { name: 'tenant', label: 'Company / Tenant Name', required: true, default: tenantName },
          { name: 'plan', label: 'Platform Plan Tier', type: 'select', options: ['Starter', 'Professional', 'Enterprise', 'Ultimate'], default: planName }
        ],
        async onSubmit(data, close) {
          localStorage.setItem('amdox_tenant_name', data.tenant);
          localStorage.setItem('amdox_platform_plan', data.plan);
          
          // Dynamically change index.html tenant dropdown if present
          const select = document.getElementById('tenant-select');
          if (select && select.options.length > 0) {
            select.options[0].text = data.tenant;
          }

          showToast('✅ Company settings saved successfully!', 'success');
          close();
          renderSettings();
        }
      });
    });

    // Hook user settings edit
    document.getElementById('set-card-user').addEventListener('click', () => {
      showModal({
        title: '<i class="fas fa-users-gear" style="color:var(--success)"></i> Edit User Profile',
        submitLabel: 'Save Profile',
        fields: [
          { name: 'name', label: 'Your Full Name', required: true, default: currentUser.name },
          { name: 'role', label: 'Your Role / Job Title', required: true, default: currentUser.role }
        ],
        async onSubmit(data, close) {
          currentUser.name = data.name;
          currentUser.role = data.role;
          localStorage.setItem('amdox_auth_user', JSON.stringify(currentUser));
          
          // Trigger global app profile bar update
          if (typeof updateSidebarAndProfile === 'function') {
            updateSidebarAndProfile();
          }

          showToast('✅ User profile updated!', 'success');
          close();
          renderSettings();
        }
      });
    });

    // Hook backup actions
    document.getElementById('set-card-backup').addEventListener('click', () => {
      showConfirm('Trigger cloud backup of active system storage data?', () => {
        showToast('Running background DB schema export...', 'info');
        setTimeout(() => {
          const nowStr = new Date().toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
          document.getElementById('settings-info-backup').textContent = nowStr + ' IST';
          showToast('✅ Enterprise system backup completed successfully!', 'success');
        }, 1200);
      });
    });
  };

  renderSettings();
};

window.openSettingsPanel = function(panelName) {
    const container = document.getElementById('settings-panel-container');
    if (!container) return;
    let formHTML = '';

    if (panelName === 'Company Profile') {
        const tenant = db.table('systemInfo').getAll().find(s => s.label === 'Tenant')?.value || 'Amdox Technologies Pvt Ltd';
        formHTML = `
            <div class="card animate-fade" style="border:1px solid rgba(99,102,241,0.3);position:relative;">
                <button onclick="document.getElementById('settings-panel-container').innerHTML=''" style="position:absolute;top:15px;right:15px;background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:16px;"><i class="fas fa-xmark"></i></button>
                <div class="card-header"><span class="card-title"><i class="fas fa-building" style="color:var(--accent);margin-right:8px"></i>Company Profile Settings</span></div>
                <div style="padding:20px;">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;">
                        <div><label class="form-label" style="font-size:12px;color:var(--text-muted);display:block;margin-bottom:5px;">Company Name</label><input type="text" id="company-name-input" value="${tenant}" style="width:100%;padding:10px;background:var(--bg-color);border:1px solid var(--border-color);border-radius:6px;color:white;"></div>
                        <div><label class="form-label" style="font-size:12px;color:var(--text-muted);display:block;margin-bottom:5px;">Support Email</label><input type="email" value="support@amdox.com" style="width:100%;padding:10px;background:var(--bg-color);border:1px solid var(--border-color);border-radius:6px;color:white;"></div>
                    </div>
                    <div><label class="form-label" style="font-size:12px;color:var(--text-muted);display:block;margin-bottom:5px;">Headquarters Address</label><textarea style="width:100%;padding:10px;background:var(--bg-color);border:1px solid var(--border-color);border-radius:6px;color:white;resize:none;" rows="3">Tech Park, Phase 2, Bangalore, India</textarea></div>
                    <div style="margin-top:20px;text-align:right;"><button class="btn btn-primary" onclick="window.saveCompanyProfile()">Save Changes</button></div>
                </div>
            </div>`;
    } else if (panelName === 'User Management') {
        formHTML = `
            <div class="card animate-fade" style="border:1px solid rgba(34,197,94,0.3);position:relative;">
                <button onclick="document.getElementById('settings-panel-container').innerHTML=''" style="position:absolute;top:15px;right:15px;background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:16px;"><i class="fas fa-xmark"></i></button>
                <div class="card-header"><span class="card-title"><i class="fas fa-users-gear" style="color:var(--success);margin-right:8px"></i>User Management & Roles</span></div>
                <div style="padding:20px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                        <span style="font-size:14px;color:var(--text-muted);">Manage roles and permissions for 162 active users.</span>
                        <button class="btn btn-sm" style="background:var(--success);color:white;" onclick="if(window.openAddEmployeeModal) window.openAddEmployeeModal(); else showToast('Add Employee Modal not loaded', 'warning')"><i class="fas fa-user-plus"></i> Add User</button>
                    </div>
                    <table style="width:100%;border-collapse:collapse;font-size:13px;text-align:left;">
                        <tr style="border-bottom:1px solid var(--border-color);"><th style="padding:10px;">Role Name</th><th style="padding:10px;">Users</th><th style="padding:10px;">Permissions</th><th style="padding:10px;text-align:right;">Action</th></tr>
                        <tr style="border-bottom:1px solid var(--border-color);transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='none'">
                            <td style="padding:10px;font-weight:600;">Super Admin</td>
                            <td style="padding:10px;">3</td>
                            <td style="padding:10px;"><span class="badge badge-purple" style="cursor:pointer;" title="Click to manage" onclick="window.editRolePermissions(this, 'Super Admin')">Full Access</span></td>
                            <td style="padding:10px;text-align:right;"><button class="btn btn-icon" title="Edit Permissions" onclick="window.editRolePermissions(this, 'Super Admin')"><i class="fas fa-edit"></i></button></td>
                        </tr>
                        <tr style="border-bottom:1px solid var(--border-color);transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='none'">
                            <td style="padding:10px;font-weight:600;">HR Manager</td>
                            <td style="padding:10px;">5</td>
                            <td style="padding:10px;"><span class="badge badge-info" style="cursor:pointer;" title="Click to manage" onclick="window.editRolePermissions(this, 'HR Manager')">HR, Payroll</span></td>
                            <td style="padding:10px;text-align:right;"><button class="btn btn-icon" title="Edit Permissions" onclick="window.editRolePermissions(this, 'HR Manager')"><i class="fas fa-edit"></i></button></td>
                        </tr>
                        <tr style="border-bottom:1px solid var(--border-color);transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='none'">
                            <td style="padding:10px;font-weight:600;">HR Admin</td>
                            <td style="padding:10px;">8</td>
                            <td style="padding:10px;"><span class="badge badge-warning" style="cursor:pointer;" title="Click to manage" onclick="window.editRolePermissions(this, 'HR Admin')">HR Only</span></td>
                            <td style="padding:10px;text-align:right;"><button class="btn btn-icon" title="Edit Permissions" onclick="window.editRolePermissions(this, 'HR Admin')"><i class="fas fa-edit"></i></button></td>
                        </tr>
                        <tr style="transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='none'">
                            <td style="padding:10px;font-weight:600;">Employee</td>
                            <td style="padding:10px;">154</td>
                            <td style="padding:10px;"><span class="badge badge-success" style="cursor:pointer;" title="Click to manage" onclick="window.editRolePermissions(this, 'Employee')">Self Service</span></td>
                            <td style="padding:10px;text-align:right;"><button class="btn btn-icon" title="Edit Permissions" onclick="window.editRolePermissions(this, 'Employee')"><i class="fas fa-edit"></i></button></td>
                        </tr>
                    </table>
                </div>
            </div>`;
    } else if (panelName === 'Integrations') {
        formHTML = `
            <div class="card animate-fade" style="border:1px solid rgba(168,85,247,0.3);position:relative;">
                <button onclick="document.getElementById('settings-panel-container').innerHTML=''" style="position:absolute;top:15px;right:15px;background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:16px;"><i class="fas fa-xmark"></i></button>
                <div class="card-header"><span class="card-title"><i class="fas fa-puzzle-piece" style="color:var(--purple);margin-right:8px"></i>API & Webhook Integrations</span></div>
                <div style="padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:20px;">
                    <div style="padding:15px;border:1px solid var(--border-color);border-radius:8px;background:rgba(255,255,255,0.02);display:flex;align-items:center;justify-content:space-between;">
                        <div><div style="font-weight:600;margin-bottom:4px;"><i class="fab fa-slack" style="color:#e01e5a;margin-right:6px;"></i>Slack Notifications</div><div style="font-size:12px;color:var(--text-muted);">Status: <span style="color:var(--success)">Connected</span></div></div>
                        <button class="btn btn-sm" style="border:1px solid var(--danger);color:var(--danger);background:none;" onclick="window.toggleIntegration(this, 'Slack')">Disconnect</button>
                    </div>
                    <div style="padding:15px;border:1px solid var(--border-color);border-radius:8px;background:rgba(255,255,255,0.02);display:flex;align-items:center;justify-content:space-between;">
                        <div><div style="font-weight:600;margin-bottom:4px;"><i class="fab fa-stripe" style="color:#6366f1;margin-right:6px;"></i>Stripe Payment Gateway</div><div style="font-size:12px;color:var(--text-muted);">Status: <span style="color:var(--success)">Connected</span></div></div>
                        <button class="btn btn-sm" style="border:1px solid var(--danger);color:var(--danger);background:none;" onclick="window.toggleIntegration(this, 'Stripe')">Disconnect</button>
                    </div>
                    <div style="padding:15px;border:1px dashed var(--border-color);border-radius:8px;display:flex;align-items:center;justify-content:space-between;">
                        <div><div style="font-weight:600;color:var(--text-muted);margin-bottom:4px;"><i class="fab fa-google" style="margin-right:6px;"></i>Google Workspace</div><div style="font-size:12px;color:var(--text-muted);">Status: Not Connected</div></div>
                        <button class="btn btn-sm btn-primary" onclick="window.toggleIntegration(this, 'Google Workspace')">Connect</button>
                    </div>
                </div>
            </div>`;
    } else if (panelName === 'Billing & Plans') {
        formHTML = `
            <div class="card animate-fade" style="border:1px solid rgba(245,158,11,0.3);position:relative;">
                <button onclick="document.getElementById('settings-panel-container').innerHTML=''" style="position:absolute;top:15px;right:15px;background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:16px;"><i class="fas fa-xmark"></i></button>
                <div class="card-header"><span class="card-title"><i class="fas fa-credit-card" style="color:var(--warning);margin-right:8px"></i>Billing & Subscription</span></div>
                <div style="padding:20px;">
                    <div style="background:linear-gradient(135deg,rgba(245,158,11,0.1),rgba(234,88,12,0.1));border:1px solid rgba(245,158,11,0.2);border-radius:10px;padding:20px;display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                        <div>
                            <div style="font-size:12px;color:var(--warning);font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:5px;">Current Plan</div>
                            <div style="font-size:24px;font-weight:700;color:white;margin-bottom:5px;">Enterprise <span style="font-size:14px;color:var(--text-muted);font-weight:400;">/ ₹1,20,000 per year</span></div>
                            <div style="font-size:13px;color:var(--text-muted);">Next billing date: <strong>March 01, 2027</strong></div>
                        </div>
                        <button class="btn" style="background:var(--warning);color:#111;font-weight:600;" onclick="window.upgradePlan(this)"><i class="fas fa-arrow-up"></i> Upgrade Plan</button>
                    </div>
                    <div style="font-weight:600;margin-bottom:10px;">Payment Method</div>
                    <div style="display:flex;align-items:center;gap:15px;padding:15px;border:1px solid var(--border-color);border-radius:8px;background:var(--bg-color);">
                        <i class="fab fa-cc-visa" style="font-size:24px;color:white;"></i>
                        <div style="flex:1;">Visa ending in <strong>4242</strong><div style="font-size:12px;color:var(--text-muted);">Expires 12/28</div></div>
                        <button class="btn btn-sm btn-secondary" onclick="window.updatePaymentMethod(this)">Update</button>
                    </div>
                </div>
            </div>`;
    } else if (panelName === 'Appearance') {
        formHTML = `
            <div class="card animate-fade" style="border:1px solid rgba(236,72,153,0.3);position:relative;">
                <button onclick="document.getElementById('settings-panel-container').innerHTML=''" style="position:absolute;top:15px;right:15px;background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:16px;"><i class="fas fa-xmark"></i></button>
                <div class="card-header"><span class="card-title"><i class="fas fa-palette" style="color:var(--pink);margin-right:8px"></i>Theme & Branding</span></div>
                <div style="padding:20px;">
                    <div style="margin-bottom:20px;">
                        <label class="form-label" style="font-size:12px;color:var(--text-muted);display:block;margin-bottom:10px;">System Theme</label>
                        <div style="display:flex;gap:15px;">
                            <label style="cursor:pointer;display:flex;align-items:center;gap:8px;"><input type="radio" name="theme" onclick="document.documentElement.dataset.theme='dark'; document.querySelector('#theme-toggle i').className='fas fa-moon'" checked> <i class="fas fa-moon"></i> Dark Mode (Default)</label>
                            <label style="cursor:pointer;display:flex;align-items:center;gap:8px;color:var(--text-muted);"><input type="radio" name="theme" onclick="document.documentElement.dataset.theme='light'; document.querySelector('#theme-toggle i').className='fas fa-sun'"> <i class="fas fa-sun"></i> Light Mode</label>
                        </div>
                    </div>
                    <div style="margin-bottom:20px;">
                        <label class="form-label" style="font-size:12px;color:var(--text-muted);display:block;margin-bottom:10px;">Accent Color</label>
                        <div style="display:flex;gap:15px;">
                            <div style="width:30px;height:30px;border-radius:50%;background:#6366f1;cursor:pointer;border:2px solid white;" onclick="document.documentElement.style.setProperty('--accent', '#6366f1'); document.documentElement.style.setProperty('--accent-glow', 'rgba(99,102,241,0.3)'); Array.from(this.parentElement.children).forEach(c=>c.style.border='none'); this.style.border='2px solid white'"></div>
                            <div style="width:30px;height:30px;border-radius:50%;background:#ec4899;cursor:pointer;opacity:0.5;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.5'" onclick="document.documentElement.style.setProperty('--accent', '#ec4899'); document.documentElement.style.setProperty('--accent-glow', 'rgba(236,72,153,0.3)'); Array.from(this.parentElement.children).forEach(c=>{c.style.border='none'; c.style.opacity='0.5'}); this.style.border='2px solid white'; this.style.opacity='1'" onmouseout="if(this.style.border==='none') this.style.opacity='0.5'"></div>
                            <div style="width:30px;height:30px;border-radius:50%;background:#22c55e;cursor:pointer;opacity:0.5;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.5'" onclick="document.documentElement.style.setProperty('--accent', '#22c55e'); document.documentElement.style.setProperty('--accent-glow', 'rgba(34,197,94,0.3)'); Array.from(this.parentElement.children).forEach(c=>{c.style.border='none'; c.style.opacity='0.5'}); this.style.border='2px solid white'; this.style.opacity='1'" onmouseout="if(this.style.border==='none') this.style.opacity='0.5'"></div>
                            <div style="width:30px;height:30px;border-radius:50%;background:#f59e0b;cursor:pointer;opacity:0.5;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.5'" onclick="document.documentElement.style.setProperty('--accent', '#f59e0b'); document.documentElement.style.setProperty('--accent-glow', 'rgba(245,158,11,0.3)'); Array.from(this.parentElement.children).forEach(c=>{c.style.border='none'; c.style.opacity='0.5'}); this.style.border='2px solid white'; this.style.opacity='1'" onmouseout="if(this.style.border==='none') this.style.opacity='0.5'"></div>
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="showToast('Theme preferences saved!', 'success')">Apply Theme</button>
                </div>
            </div>`;
    } else if (panelName === 'Data & Backup') {
        const activity = db.table('settingsActivity').getAll().sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);
        const activityHTML = activity.length > 0 
            ? activity.map(a => `
                <div class="list-item" style="display:flex;justify-content:space-between;padding:12px;border-bottom:1px solid rgba(255,255,255,0.03);font-size:12px;cursor:pointer;transition:background 0.2s;" 
                     onclick="window.viewBackupDetails(${a.id})"
                     onmouseover="this.style.background='rgba(255,255,255,0.03)'"
                     onmouseout="this.style.background='none'">
                    <div><i class="fas ${a.icon}" style="margin-right:8px;color:${a.color}"></i>${a.action}</div>
                    <div style="display:flex;align-items:center;gap:10px;">
                        <span style="font-size:10px;color:var(--text-muted)">View details <i class="fas fa-chevron-right" style="font-size:9px"></i></span>
                        <div style="color:var(--text-muted)">${a.timeLabel}</div>
                    </div>
                </div>`).join('')
            : '<div style="padding:20px;text-align:center;color:var(--text-muted);font-size:12px;">No recent backup activity</div>';

        formHTML = `
            <div class="card animate-fade" style="border:1px solid rgba(6,182,212,0.3);position:relative;overflow:hidden;">
                <button onclick="document.getElementById('settings-panel-container').innerHTML=''" style="position:absolute;top:15px;right:15px;background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:16px;z-index:10;"><i class="fas fa-xmark"></i></button>
                <div id="backup-detail-overlay" style="display:none;position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(15,23,42,0.95);backdrop-filter:blur(8px);z-index:100;padding:30px;flex-direction:column;"></div>
                <div class="card-header"><span class="card-title"><i class="fas fa-database" style="color:var(--cyan);margin-right:8px"></i>Data Backup & Export</span></div>
                <div style="padding:20px;">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;">
                        <div style="padding:20px;border:1px solid var(--border-color);border-radius:10px;text-align:center;background:rgba(255,255,255,0.01);">
                            <i class="fas fa-cloud-download-alt" style="font-size:32px;color:var(--info);margin-bottom:15px;"></i>
                            <h4 style="margin-bottom:5px;font-size:14px;">Manual Backup</h4>
                            <p style="font-size:11px;color:var(--text-muted);margin-bottom:15px;">Full SQL dump (Gzip compressed)</p>
                            <button class="btn btn-secondary" style="width:100%" onclick="window.performManualBackup()">Download SQL</button>
                        </div>
                        <div style="padding:20px;border:1px solid var(--border-color);border-radius:10px;text-align:center;background:rgba(255,255,255,0.01);">
                            <i class="fas fa-file-export" style="font-size:32px;color:var(--success);margin-bottom:15px;"></i>
                            <h4 style="margin-bottom:5px;font-size:14px;">Export Records</h4>
                            <p style="font-size:11px;color:var(--text-muted);margin-bottom:15px;">Module records to CSV/Excel</p>
                            <button class="btn btn-secondary" style="width:100%" onclick="window.performExportRecords()">Export CSV</button>
                        </div>
                    </div>
                    <div style="border:1px solid var(--border-color);border-radius:8px;overflow:hidden;">
                        <div style="background:rgba(255,255,255,0.03);padding:10px 15px;font-size:12px;font-weight:600;display:flex;justify-content:space-between;align-items:center;">
                            <span>Recent Backup Activity</span>
                            <button class="btn btn-sm" onclick="window.clearBackupLogs()" style="padding:2px 8px;font-size:10px;height:24px;background:rgba(239,68,68,0.1);color:rgb(239,68,68);border:1px solid rgba(239,68,68,0.2);">
                                <i class="fas fa-trash-alt" style="margin-right:4px;"></i> Clear All Logs
                            </button>
                        </div>
                        <div id="backup-activity-list">${activityHTML}</div>
                    </div>
                </div>
            </div>`;
    }

    container.innerHTML = formHTML;
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

window.clearBackupLogs = function() {
    if (confirm("Are you sure you want to permanently delete all backup and export history? This action cannot be undone.")) {
        const list = document.getElementById('backup-activity-list');
        if (list) {
            list.style.opacity = '0';
            list.style.transition = 'opacity 0.3s ease';
        }
        
        setTimeout(() => {
            db.table('settingsActivity').reset([]);
            window.openSettingsPanel('Data & Backup');
            showToast('Activity logs cleared successfully.', 'success');
        }, 300);
    }
};

window.viewBackupDetails = function(logId) {
    const log = db.table('settingsActivity').getById(logId);
    if (!log) return;
    const overlay = document.getElementById('backup-detail-overlay');
    if (!overlay) return;

    const isBackup = log.icon.includes('code');
    const type = isBackup ? 'SQL Dump' : 'CSV Export';
    
    overlay.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <div style="font-size:18px;font-weight:700;"><i class="fas ${log.icon}" style="margin-right:10px;color:${log.color}"></i> Operation Details</div>
            <button onclick="document.getElementById('backup-detail-overlay').style.display='none'" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:24px;"><i class="fas fa-xmark"></i></button>
        </div>
        <div style="background:var(--bg-color);border:1px solid var(--border-color);border-radius:12px;padding:20px;flex:1;overflow-y:auto;">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-bottom:25px;">
                <div><div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;margin-bottom:4px;">Operation</div><div style="font-weight:600;">${log.action}</div></div>
                <div><div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;margin-bottom:4px;">Format</div><div style="font-weight:600;">${type}</div></div>
                <div><div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;margin-bottom:4px;">Timestamp</div><div style="font-weight:600;">${new Date(log.time).toLocaleString()}</div></div>
                <div><div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;margin-bottom:4px;">Status</div><div style="font-weight:600;color:var(--success)">Succeeded</div></div>
            </div>
            
            <div style="font-size:14px;font-weight:600;margin-bottom:12px;">Included Tables & Metrics</div>
            <div style="font-size:13px;color:var(--text-muted);">
                <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.03);"><span>systemInfo</span><span>12 records</span></div>
                <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.03);"><span>employees</span><span>162 records</span></div>
                <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.03);"><span>finance_invoices</span><span>2,482 records</span></div>
                <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.03);"><span>crm_leads</span><span>856 records</span></div>
                <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.03);"><span>inventory_products</span><span>1,489 records</span></div>
            </div>
            
            <div style="margin-top:30px;padding:15px;background:rgba(34,197,94,0.05);border:1px solid rgba(34,197,94,0.1);border-radius:8px;">
                <div style="font-size:12px;font-weight:600;color:var(--success);margin-bottom:5px;"><i class="fas fa-shield-check"></i> Integrity Verified</div>
                <div style="font-size:11px;color:var(--text-muted)">Checksum: SHA-256 (hash: 7e2f5b...1e8a)</div>
            </div>
            
            <div style="margin-top:20px;text-align:center;display:flex;gap:10px;">
                <button class="btn btn-secondary" style="flex:1" onclick="window.viewBackupPDF(${log.id})">
                    <i class="fas fa-file-pdf" style="color:var(--danger)"></i> View PDF Report
                </button>
                <button class="btn btn-primary" style="flex:1" onclick="showToast('Re-downloading archive...', 'info'); setTimeout(() => showToast('Download started', 'success'), 800)">
                    <i class="fas fa-download"></i> Re-download ${isBackup ? '.sql.gz' : '.csv'}
                </button>
            </div>
        </div>
    `;
    overlay.style.display = 'flex';
};

window.viewBackupPDF = function(logId) {
    const log = db.table('settingsActivity').getById(logId);
    const overlay = document.getElementById('backup-detail-overlay');
    if (!log || !overlay) return;

    const tenant = db.table('systemInfo').getAll().find(s => s.label === 'Tenant')?.value || 'Amdox Technologies';
    const employees = db.table('employees').getAll().slice(0, 10);
    const invoices = db.table('finance_invoices').getAll().slice(0, 5);

    const empRows = employees.map(e => `
        <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px;">${e.name}</td>
            <td style="padding:10px;">${e.role}</td>
            <td style="padding:10px;">${e.dept}</td>
            <td style="padding:10px;">${e.status}</td>
        </tr>`).join('');

    const invRows = invoices.map(i => `
        <tr style="border-bottom:1px solid #eee;">
            <td style="padding:10px;">${i.invoiceId}</td>
            <td style="padding:10px;">${i.client}</td>
            <td style="padding:10px;">${i.amount}</td>
            <td style="padding:10px;">${i.status}</td>
        </tr>`).join('');

    overlay.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
            <div style="font-size:16px;font-weight:700;"><i class="fas fa-file-pdf" style="margin-right:10px;color:var(--danger)"></i> Report Preview: ${log.action}</div>
            <div style="display:flex;gap:10px;">
                <button class="btn btn-xs btn-secondary" onclick="window.viewBackupDetails(${logId})"><i class="fas fa-arrow-left"></i> Back</button>
                <button onclick="document.getElementById('backup-detail-overlay').style.display='none'" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:24px;"><i class="fas fa-xmark"></i></button>
            </div>
        </div>
        
        <div id="pdf-container" style="background:#fff;color:#333;border-radius:4px;padding:50px;flex:1;overflow-y:auto;box-shadow:inset 0 0 50px rgba(0,0,0,0.1);font-family:serif;">
            <div style="display:flex;justify-content:space-between;border-bottom:2px solid #333;padding-bottom:20px;margin-bottom:30px;">
                <div>
                    <h1 style="margin:0;font-size:32px;color:#111;text-transform:uppercase;">Data Export Report</h1>
                    <p style="margin:5px 0;font-size:14px;color:#666;">Generated on: ${new Date(log.time).toLocaleDateString()}</p>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:20px;font-weight:900;color:#3b82f6;">AMDOX ERP</div>
                    <div style="font-size:12px;color:#666;">Enterprise Suite v3.2</div>
                </div>
            </div>
            
            <div style="margin-bottom:40px;">
                <h3 style="border-bottom:1px solid #ddd;padding-bottom:8px;margin-bottom:15px;color:#111;">1. System Summary</h3>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;font-size:14px;">
                    <div><strong>Organization:</strong> ${tenant}</div>
                    <div><strong>Backup ID:</strong> ${log.id}</div>
                    <div><strong>Log Action:</strong> ${log.action}</div>
                    <div><strong>Report Integrity:</strong> Verified (Checksum OK)</div>
                </div>
            </div>
            
            <div style="margin-bottom:40px;">
                <h3 style="border-bottom:1px solid #ddd;padding-bottom:8px;margin-bottom:15px;color:#111;">2. Personnel Data (Snapshot)</h3>
                <table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;">
                    <thead style="background:#f9f9f9;">
                        <tr><th style="padding:10px;">Name</th><th style="padding:10px;">Role</th><th style="padding:10px;">Department</th><th style="padding:10px;">Status</th></tr>
                    </thead>
                    <tbody>${empRows}</tbody>
                </table>
                <p style="font-size:11px;color:#999;margin-top:10px;">* Displaying first 10 records only. Total records: 162</p>
            </div>

            <div style="margin-bottom:40px;">
                <h3 style="border-bottom:1px solid #ddd;padding-bottom:8px;margin-bottom:15px;color:#111;">3. Financial Records (Recent)</h3>
                <table style="width:100%;border-collapse:collapse;font-size:12px;text-align:left;">
                    <thead style="background:#f9f9f9;">
                        <tr><th style="padding:10px;">Invoice ID</th><th style="padding:10px;">Client</th><th style="padding:10px;">Amount</th><th style="padding:10px;">Status</th></tr>
                    </thead>
                    <tbody>${invRows}</tbody>
                </table>
            </div>

            <div style="margin-top:50px;border-top:1px solid #eee;padding-top:20px;text-align:center;font-size:10px;color:#999;">
                This document is a system-generated export from Amdox ERP. Authorized use only.<br>
                © 2026 Amdox Technologies Private Limited.
            </div>
        </div>
        
        <div style="margin-top:15px;text-align:right;">
            <button class="btn btn-primary" onclick="window.printReport('pdf-container')"><i class="fas fa-print"></i> Download as Real PDF</button>
        </div>
    `;
};

window.printReport = function(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    showToast('Converting to PDF document...', 'info');
    setTimeout(() => {
        showToast('PDF Report downloaded successfully!', 'success');
    }, 2000);
};

window.performManualBackup = function() {
    showToast('Processing database dump...', 'info');
    setTimeout(() => {
        const log = db.table('settingsActivity').create({
            action: 'Full SQL Backup Generated',
            icon: 'fa-file-code',
            color: 'var(--info)',
            time: new Date().toISOString(),
            timeLabel: 'Just now'
        });
        window.openSettingsPanel('Data & Backup');
        showToast('Backup archive downloaded successfully!', 'success');
        // Auto-open findings if it's the first one recently
        setTimeout(() => window.viewBackupDetails(log.id), 500);
    }, 1500);
};

window.performExportRecords = function() {
    showToast('Generating CSV report...', 'info');
    setTimeout(() => {
        const log = db.table('settingsActivity').create({
            action: 'CSV Export: All Modules',
            icon: 'fa-file-csv',
            color: 'var(--success)',
            time: new Date().toISOString(),
            timeLabel: 'Just now'
        });
        window.openSettingsPanel('Data & Backup');
        showToast('Module data exported to CSV!', 'success');
        setTimeout(() => window.viewBackupDetails(log.id), 500);
    }, 1200);
};

window.toggleIntegration = function(btn, name) {
    const isDisconnecting = btn.textContent.trim() === 'Disconnect';
    const statusDiv = btn.previousElementSibling.lastElementChild;
    const parentContainer = btn.parentElement;

    if (isDisconnecting) {
        btn.textContent = 'Connect';
        btn.className = 'btn btn-sm btn-primary';
        btn.style.cssText = ''; 
        statusDiv.innerHTML = 'Status: Not Connected';
        parentContainer.style.border = '1px dashed var(--border-color)';
        parentContainer.style.background = 'none';
        showToast(`${name} Disconnected.`, 'warning');
    } else {
        btn.textContent = 'Disconnect';
        btn.className = 'btn btn-sm';
        btn.style.cssText = 'border:1px solid var(--danger);color:var(--danger);background:none;';
        statusDiv.innerHTML = 'Status: <span style="color:var(--success)">Connected</span>';
        parentContainer.style.border = '1px solid var(--border-color)';
        parentContainer.style.background = 'rgba(255,255,255,0.02)';
        showToast(`Successfully connected to ${name}!`, 'success');
    }
};

window.saveCompanyProfile = function() {
    const nameInput = document.getElementById('company-name-input');
    const newName = nameInput ? nameInput.value : 'Amdox Technologies Pvt Ltd';
    
    // Update local database
    const sysInfo = db.table('systemInfo').getAll();
    const tenantRow = sysInfo.find(s => s.label === 'Tenant');
    if (tenantRow) {
        db.table('systemInfo').update(tenantRow.id, { value: newName });
        
        // Re-render main settings page to update the "System Information" table
        const mainContainer = document.getElementById('module-container');
        if (mainContainer) pages.settings(mainContainer);
        
        // Refresh the current panel to show it was saved
        window.openSettingsPanel('Company Profile');
        
        showToast(`Company Profile saved as "${newName}"`, 'success');
    } else {
        showToast('Could not find tenant record in database', 'danger');
    }
};

window.upgradePlan = function(btn) {
    const confirmUpgrade = confirm("Are you sure you want to upgrade to the 'Enterprise Plus' tier for ₹2,40,000/year?");
    if (confirmUpgrade) {
        const planContainer = btn.parentElement.querySelector('div');
        planContainer.innerHTML = `
            <div style="font-size:12px;color:var(--success);font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:5px;">Current Plan</div>
            <div style="font-size:24px;font-weight:700;color:white;margin-bottom:5px;">Enterprise Plus <span style="font-size:14px;color:var(--text-muted);font-weight:400;">/ ₹2,40,000 per year</span></div>
            <div style="font-size:13px;color:var(--text-muted);">Next billing date: <strong>March 01, 2027</strong></div>
        `;
        btn.parentElement.style.background = 'linear-gradient(135deg,rgba(34,197,94,0.1),rgba(16,185,129,0.1))';
        btn.parentElement.style.border = '1px solid rgba(34,197,94,0.2)';
        btn.style.background = 'var(--success)';
        btn.style.color = 'white';
        btn.innerHTML = '<i class="fas fa-check"></i> Highest Tier Active';
        btn.disabled = true;
        showToast('Successfully upgraded to Enterprise Plus!', 'success');
    }
};

window.updatePaymentMethod = function(btn) {
    const newCard = prompt("Enter new card number (last 4 digits):", "");
    if (newCard && newCard.length === 4 && !isNaN(newCard)) {
        const textContainer = btn.previousElementSibling;
        textContainer.innerHTML = `Visa ending in <strong>${newCard}</strong><div style="font-size:12px;color:var(--text-muted);">Expires 12/29</div>`;
        showToast('Payment method updated successfully!', 'success');
    } else if (newCard) {
        showToast('Invalid card format. Please enter exactly 4 numbers.', 'danger');
    }
};

window.editRolePermissions = function(btn, roleName) {
    const tr = btn.closest('tr');
    if (tr.nextElementSibling && tr.nextElementSibling.classList.contains('role-edit-row')) {
        tr.nextElementSibling.remove();
        return;
    }
    const isSA = roleName === 'Super Admin';
    const isHR = roleName === 'HR Manager';
    const isHRAdmin = roleName === 'HR Admin';
    const isEmp = roleName === 'Employee';

    const editRow = document.createElement('tr');
    editRow.className = 'role-edit-row animate-fade';
    editRow.innerHTML = `
        <td colspan="4" style="padding:15px;background:var(--bg-secondary);border-bottom:1px solid var(--border-color);">
            <div style="font-weight:600;margin-bottom:10px;color:var(--accent);">Edit Permissions: ${roleName} ${isSA ? '<span style="color:var(--danger);font-size:10px;margin-left:10px;">(Warning: Root Access)</span>' : ''}</div>
            <div style="display:flex;gap:20px;margin-bottom:15px;font-size:12px;color:var(--text-primary);flex-wrap:wrap;">
                <label style="display:flex;align-items:center;gap:6px;cursor:pointer;"><input type="checkbox" ${isSA ? 'checked' : ''}> Full System Access</label>
                <label style="display:flex;align-items:center;gap:6px;cursor:pointer;"><input type="checkbox" ${isSA || isHR || isHRAdmin ? 'checked' : ''}> HR & Payroll</label>
                <label style="display:flex;align-items:center;gap:6px;cursor:pointer;"><input type="checkbox" ${isSA ? 'checked' : ''}> Finance Ledger</label>
                <label style="display:flex;align-items:center;gap:6px;cursor:pointer;"><input type="checkbox" ${isSA ? 'checked' : ''}> CRM & Leads</label>
                <label style="display:flex;align-items:center;gap:6px;cursor:pointer;"><input type="checkbox" ${isSA || isEmp || isHR || isHRAdmin ? 'checked' : ''}> Self Service</label>
                <label style="display:flex;align-items:center;gap:6px;cursor:pointer;"><input type="checkbox" ${isSA ? 'checked' : ''}> System Logs</label>
            </div>
            <div style="text-align:right;">
                <button class="btn btn-sm btn-secondary" style="margin-right:10px;" onclick="this.closest('tr').remove()">Cancel</button>
                <button class="btn btn-sm btn-primary" onclick="
                    const checks = Array.from(this.parentElement.previousElementSibling.querySelectorAll('input:checked'));
                    const labels = checks.map(c => c.parentElement.textContent.trim());
                    const badgeSpan = this.closest('tr').previousElementSibling.querySelector('.badge');
                    if(labels.length === 0) {
                        badgeSpan.textContent = 'None';
                        badgeSpan.className = 'badge';
                    } else if(labels.includes('Full System Access')) {
                        badgeSpan.textContent = 'Full Access';
                        badgeSpan.className = 'badge badge-purple';
                    } else {
                        badgeSpan.textContent = labels.slice(0, 2).join(', ') + (labels.length > 2 ? ' + ' + (labels.length - 2) : '');
                        badgeSpan.className = 'badge badge-info';
                    }
                    showToast('Permissions updated for ${roleName}', 'success');
                    this.closest('tr').remove();
                ">Save Permissions</button>
            </div>
        </td>
    `;
    tr.insertAdjacentElement('afterend', editRow);
};
