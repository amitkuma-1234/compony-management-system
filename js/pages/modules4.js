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
      <div class="grid-2" style="margin-bottom: 24px;">
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
      </div>
      
      <!-- Manual ZIP Deployment Package Upload -->
      <div class="card">
        <div class="card-header">
          <span class="card-title"><i class="fas fa-file-archive" style="color:var(--cyan); margin-right:8px;"></i> Manual Deployment (ZIP Package)</span>
        </div>
        <div style="padding: 20px;">
          <div id="zip-upload-zone" style="border: 2px dashed rgba(6, 182, 212, 0.3); border-radius: 12px; padding: 30px; text-align: center; background: rgba(6, 182, 212, 0.02); cursor: pointer; transition: all 0.3s ease;">
            <div style="font-size: 40px; color: var(--cyan); margin-bottom: 12px;">
              <i class="fas fa-cloud-arrow-up" id="upload-icon"></i>
            </div>
            <h4 style="font-size: 15px; margin-bottom: 6px; color: var(--text-primary);" id="upload-zone-title">Drag & Drop ZIP deploy package here, or click to browse</h4>
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 15px;">Max file size: 50MB. Only .zip extension files are allowed.</p>
            <input type="file" id="zip-file-input" accept=".zip" style="display: none;" />
            <button class="btn btn-secondary btn-sm" id="select-zip-btn"><i class="fas fa-folder-open"></i> Select ZIP File</button>
            <div id="selected-file-info" style="display: none; margin-top: 15px; background: rgba(255,255,255,0.03); padding: 10px; border-radius: 8px; border: 1px solid var(--border);">
              <span style="font-size: 13px; font-family: var(--font-mono); color: var(--accent-light);" id="selected-file-name">filename.zip</span>
              <span style="font-size: 12px; color: var(--text-muted); margin-left: 10px;" id="selected-file-size">(0 KB)</span>
            </div>
          </div>
          <div style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px;">
            <button class="btn btn-primary" id="start-zip-upload-btn" disabled><i class="fas fa-upload"></i> Upload & Deploy Package</button>
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

    // Select ZIP File Event Hooks
    const zipFileInput = document.getElementById('zip-file-input');
    const zipUploadZone = document.getElementById('zip-upload-zone');
    const selectZipBtn = document.getElementById('select-zip-btn');
    const selectedFileInfo = document.getElementById('selected-file-info');
    const selectedFileName = document.getElementById('selected-file-name');
    const selectedFileSize = document.getElementById('selected-file-size');
    const startZipUploadBtn = document.getElementById('start-zip-upload-btn');
    const uploadIcon = document.getElementById('upload-icon');
    const uploadZoneTitle = document.getElementById('upload-zone-title');

    // Click on zone or select button triggers file selection
    zipUploadZone.addEventListener('click', (e) => {
      if (e.target !== selectZipBtn && e.target !== startZipUploadBtn && !startZipUploadBtn.contains(e.target)) {
        zipFileInput.click();
      }
    });
    selectZipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      zipFileInput.click();
    });

    zipFileInput.addEventListener('change', () => {
      if (zipFileInput.files.length > 0) {
        const file = zipFileInput.files[0];
        selectedFileName.textContent = file.name;
        selectedFileSize.textContent = `(${(file.size / 1024).toFixed(1)} KB)`;
        selectedFileInfo.style.display = 'block';
        startZipUploadBtn.disabled = false;
        
        // Visual feedback
        zipUploadZone.style.borderColor = 'var(--cyan)';
        zipUploadZone.style.background = 'rgba(6, 182, 212, 0.05)';
        uploadIcon.className = 'fas fa-file-zipper';
        uploadZoneTitle.textContent = 'ZIP File Selected';
      } else {
        selectedFileInfo.style.display = 'none';
        startZipUploadBtn.disabled = true;
        zipUploadZone.style.borderColor = 'rgba(6, 182, 212, 0.3)';
        zipUploadZone.style.background = 'rgba(6, 182, 212, 0.02)';
        uploadIcon.className = 'fas fa-cloud-arrow-up';
        uploadZoneTitle.textContent = 'Drag & Drop ZIP deploy package here, or click to browse';
      }
    });

    // Drag and Drop simulation/handling
    zipUploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zipUploadZone.style.borderColor = 'var(--cyan)';
      zipUploadZone.style.background = 'rgba(6, 182, 212, 0.08)';
    });

    zipUploadZone.addEventListener('dragleave', () => {
      if (zipFileInput.files.length === 0) {
        zipUploadZone.style.borderColor = 'rgba(6, 182, 212, 0.3)';
        zipUploadZone.style.background = 'rgba(6, 182, 212, 0.02)';
      }
    });

    zipUploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      if (e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.name.endsWith('.zip')) {
          zipFileInput.files = e.dataTransfer.files;
          zipFileInput.dispatchEvent(new Event('change'));
        } else {
          showToast('Only .zip files are allowed!', 'error');
          zipUploadZone.style.borderColor = 'rgba(6, 182, 212, 0.3)';
          zipUploadZone.style.background = 'rgba(6, 182, 212, 0.02)';
        }
      }
    });

    // Upload & Deploy handler
    startZipUploadBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (zipFileInput.files.length === 0) return;

      const file = zipFileInput.files[0];
      const formData = new FormData();
      formData.append('zipFile', file);

      startZipUploadBtn.disabled = true;
      startZipUploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
      
      try {
        const response = await fetch('/api/upload-zip', {
          method: 'POST',
          body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
          showToast('ZIP package uploaded & deployment verified!', 'success');
          
          // Clear input and UI state
          zipFileInput.value = '';
          selectedFileInfo.style.display = 'none';
          startZipUploadBtn.disabled = true;
          startZipUploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload & Deploy Package';
          zipUploadZone.style.borderColor = 'rgba(6, 182, 212, 0.3)';
          zipUploadZone.style.background = 'rgba(6, 182, 212, 0.02)';
          uploadIcon.className = 'fas fa-cloud-arrow-up';
          uploadZoneTitle.textContent = 'Drag & Drop ZIP deploy package here, or click to browse';

          // Insert a new Passed build to list
          const list = getBuilds();
          const currentStats = getStats();
          const nextBuildId = String(currentStats.builds + 1);
          
          const newBuild = {
            id: nextBuildId,
            branch: 'manual-zip',
            action: `Deployed package: ${result.fileInfo.originalName}`,
            time: 'Just now',
            status: 'Passed'
          };
          
          list.unshift(newBuild);
          saveBuilds(list);
          
          // Update Stats
          currentStats.builds += 1;
          currentStats.latency = Math.floor(30 + Math.random() * 10);
          saveStats(currentStats);

          renderDevOps();
        } else {
          showToast(`Error: ${result.error}`, 'error');
          startZipUploadBtn.disabled = false;
          startZipUploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload & Deploy Package';
        }
      } catch (error) {
        console.error('Upload failed:', error);
        showToast('Server upload error occurred!', 'error');
        startZipUploadBtn.disabled = false;
        startZipUploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload & Deploy Package';
      }
    });

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
