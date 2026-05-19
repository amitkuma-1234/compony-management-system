/* ============================================================
   AMDOX ERP SUITE — Main Application Controller
   ============================================================ */

// ── Page Renderers (imported below) ──
const pages = {};

// ── App Init ──
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
    document.getElementById('app').classList.add('visible');
    initRouter();
    initSidebar();
    initTopbar();
    initAIPanel();
    initCommandPalette();
    initNotifications();
    initQuickActions();
    initGlobalActions();
  }, 2200);
});

// ── Router ──
function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

function handleRoute() {
  const hash = (location.hash || '#dashboard').replace('#', '');
  navigateTo(hash);
}

function navigateTo(page) {
  const container = document.getElementById('page-content');
  // Update nav
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navItem = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navItem) navItem.classList.add('active');
  // Update breadcrumb
  const titles = {
    dashboard:'Dashboard', analytics:'Analytics & BI', 'ai-center':'AI Command Center',
    hr:'HR Management', finance:'Finance & Accounting', inventory:'Inventory & Supply Chain',
    crm:'CRM', projects:'Project Management', auth:'Auth & Security',
    notifications:'Notifications', assets:'Asset Management', legal:'Legal & Compliance',
    ecommerce:'E-Commerce', communication:'Communication', devops:'DevOps & Deploy',
    settings:'Settings'
  };
  document.getElementById('breadcrumb-current').textContent = titles[page] || page;
  // Render page
  container.innerHTML = '';
  container.className = 'page-content animate-fade';
  const renderFn = pages[page] || pages.dashboard;
  if (renderFn) renderFn(container);
  // Init charts after render
  setTimeout(() => initChartsOnPage(page), 100);
  // Close mobile sidebar
  document.getElementById('sidebar').classList.remove('mobile-open');
}

// ── Sidebar ──
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebar-toggle');
  const mobileBtn = document.getElementById('mobile-menu-btn');

  toggle.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
  mobileBtn.addEventListener('click', () => sidebar.classList.toggle('mobile-open'));

  // Search filter
  document.getElementById('sidebar-search-input').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.nav-item').forEach(item => {
      const text = item.querySelector('span')?.textContent.toLowerCase() || '';
      item.style.display = text.includes(q) ? '' : 'none';
    });
  });

  // Nav clicks
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.page;
      location.hash = page;
    });
  });

  // User menu button logout link
  const userMenuBtn = document.getElementById('user-menu-btn');
  if (userMenuBtn) {
    userMenuBtn.addEventListener('click', () => {
      window.location.href = 'login.html';
    });
  }
}

// ── Topbar ──
function initTopbar() {
  // Theme toggle
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const html = document.documentElement;
    const isDark = html.dataset.theme === 'dark';
    html.dataset.theme = isDark ? 'light' : 'dark';
    const icon = document.querySelector('#theme-toggle i');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    showToast(isDark ? 'Light mode enabled' : 'Dark mode enabled', 'info');
  });

  // Fullscreen
  document.getElementById('fullscreen-btn').addEventListener('click', () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  });

  // Global search
  document.getElementById('global-search-input').addEventListener('focus', () => {
    openCommandPalette();
  });

  // Profile dropdown toggle
  const profileBtn = document.getElementById('topbar-profile');
  const dropdown = document.getElementById('profile-dropdown');
  if (profileBtn && dropdown) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!profileBtn.contains(e.target)) dropdown.classList.remove('open');
    });
  }
}

// ── AI Panel ──
function initAIPanel() {
  const panel = document.getElementById('ai-chat-panel');
  const btn = document.getElementById('ai-assistant-btn');
  const closeBtn = document.getElementById('ai-chat-close');
  const input = document.getElementById('ai-input');
  const sendBtn = document.getElementById('ai-send-btn');
  const messagesContainer = document.getElementById('ai-chat-messages');

  btn.addEventListener('click', () => panel.classList.toggle('open'));
  closeBtn.addEventListener('click', () => panel.classList.remove('open'));

  const sendMessage = () => {
    const text = input.value.trim();
    if (!text) return;
    // User message
    const userMsg = document.createElement('div');
    userMsg.className = 'ai-message user';
    userMsg.innerHTML = `<div class="ai-message-content">${text}</div>`;
    messagesContainer.appendChild(userMsg);
    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    // Bot response
    setTimeout(() => {
      const botMsg = document.createElement('div');
      botMsg.className = 'ai-message bot';
      const responses = [
        `I've analyzed your request about "${text}". Based on current ERP data, here are the key insights and recommended actions.`,
        `Processing "${text}"... I found relevant data across HR, Finance, and Inventory modules. Would you like a detailed report?`,
        `Great question! Based on AI analysis, the trend for "${text}" shows positive growth. I can generate a forecast report.`,
        `I've queried all modules for "${text}". Found 12 related records. Shall I create a summary dashboard?`
      ];
      botMsg.innerHTML = `<div class="ai-message-avatar"><i class="fas fa-robot"></i></div><div class="ai-message-content"><p>${responses[Math.floor(Math.random()*responses.length)]}</p></div>`;
      messagesContainer.appendChild(botMsg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
  };

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });

  // Suggestion chips
  document.querySelectorAll('.ai-suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      input.value = chip.textContent;
      sendMessage();
    });
  });
}

// ── Command Palette ──
function initCommandPalette() {
  const palette = document.getElementById('command-palette');
  const input = document.getElementById('command-input');
  const items = document.querySelectorAll('.command-item');

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openCommandPalette();
    }
    if (e.key === 'Escape') palette.classList.remove('open');
  });

  palette.querySelector('.command-palette-backdrop').addEventListener('click', () => {
    palette.classList.remove('open');
  });

  // Dynamic filter results
  input.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(q) ? 'flex' : 'none';
    });
  });

  items.forEach(item => {
    item.addEventListener('click', () => {
      const action = item.dataset.action;
      if (action) location.hash = action;
      palette.classList.remove('open');
    });
  });
}

function openCommandPalette() {
  const palette = document.getElementById('command-palette');
  palette.classList.add('open');
  document.getElementById('command-input').value = '';
  document.querySelectorAll('.command-item').forEach(item => item.style.display = 'flex');
  document.getElementById('command-input').focus();
}

// ── Notifications ──
function initNotifications() {
  const panel = document.getElementById('notification-panel');
  const btn = document.getElementById('notification-btn');
  const items = document.querySelectorAll('.notification-item');
  const dot = document.querySelector('.notification-dot');
  const countBadge = document.querySelector('.nav-count');

  btn.addEventListener('click', () => panel.classList.toggle('open'));

  // Mark all read
  document.getElementById('mark-all-read').addEventListener('click', () => {
    items.forEach(n => n.classList.remove('unread'));
    if (dot) dot.style.display = 'none';
    if (countBadge) countBadge.style.display = 'none';
    showToast('All notifications marked as read', 'success');
  });

  // Click individual notification
  items.forEach(item => {
    item.addEventListener('click', () => {
      if (item.classList.contains('unread')) {
        item.classList.remove('unread');
        const unreadCount = document.querySelectorAll('.notification-item.unread').length;
        if (unreadCount === 0) {
          if (dot) dot.style.display = 'none';
          if (countBadge) countBadge.style.display = 'none';
        } else {
          if (countBadge) countBadge.textContent = unreadCount;
        }
        showToast('Notification marked as read', 'success');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && !btn.contains(e.target)) panel.classList.remove('open');
  });
}

// ── Quick Actions Modal ──
function initQuickActions() {
  const modal = document.getElementById('quick-action-modal');
  if (!modal) return;
  const backdrop = modal.querySelector('.quick-action-backdrop');
  const closeBtn = document.getElementById('quick-action-close');
  const searchInput = document.getElementById('quick-action-search');
  const items = modal.querySelectorAll('.quick-action-item');
  const categories = modal.querySelectorAll('.quick-action-category');

  // Open modal
  window.openQuickActions = function() {
    modal.classList.add('open');
    searchInput.value = '';
    items.forEach(i => i.classList.remove('hidden'));
    categories.forEach(c => c.style.display = '');
    setTimeout(() => searchInput.focus(), 100);
  };

  // Close modal
  function closeModal() { modal.classList.remove('open'); }
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  // Search filter
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    items.forEach(item => {
      const label = item.querySelector('.qa-label').textContent.toLowerCase();
      const desc = item.querySelector('.qa-desc').textContent.toLowerCase();
      item.classList.toggle('hidden', !(label.includes(q) || desc.includes(q)));
    });
    // Hide empty categories
    categories.forEach(cat => {
      const visibleItems = cat.querySelectorAll('.quick-action-item:not(.hidden)');
      cat.style.display = visibleItems.length === 0 ? 'none' : '';
    });
  });

  // Action item click
  const taskMessages = {
    'add-employee': '👤 Opening Employee Onboarding form...',
    'mark-attendance': '✅ Opening Attendance Tracker...',
    'leave-request': '✈️ Opening Leave Management...',
    'run-payroll': '💰 Initiating Payroll Processing...',
    'new-invoice': '🧾 Opening Invoice Creator...',
    'record-expense': '📝 Opening Expense Entry form...',
    'tax-calc': '🧮 Opening Tax Calculator...',
    'new-lead': '🎯 Opening Lead Registration form...',
    'new-deal': '🤝 Opening Deal Pipeline...',
    'support-ticket': '🎫 Opening Support Ticket form...',
    'new-project': '📁 Opening Project Setup wizard...',
    'new-task': '📋 Opening Task Creation form...',
    'add-product': '📦 Opening Product Registration...',
    'new-po': '🚚 Opening Purchase Order form...',
    'add-asset': '💻 Opening Asset Registration...',
    'announcement': '📢 Opening Announcement Editor...',
    'new-report': '📊 Generating Analytics Report...',
    'new-contract': '📄 Opening Contract Drafting tool...'
  };

  items.forEach(item => {
    item.addEventListener('click', () => {
      const action = item.dataset.action;
      const task = item.dataset.task;
      closeModal();
      // Navigate to the module
      if (action) location.hash = action;
      // Show contextual toast
      const msg = taskMessages[task] || `Opening ${item.querySelector('.qa-label').textContent}...`;
      setTimeout(() => showToast(msg, 'success'), 300);
    });
  });
}

// ── Global Mock Actions ──
function initGlobalActions() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (btn) {
      // Skip if this is the Quick Action button (handled by its own modal)
      if (btn.id === 'quick-action-btn' || btn.closest('#quick-action-modal')) return;
      const text = btn.textContent.trim();
      if (text.toLowerCase().includes('quick action')) {
        openQuickActions();
        return;
      }
      if (text.toLowerCase().includes('export')) {
        showToast(`Exporting data... ${text}`, 'info');
      } else if (text.toLowerCase().includes('new') || text.toLowerCase().includes('add') || text.toLowerCase().includes('create')) {
        showToast(`Opening creation workflow: ${text}`, 'success');
      } else if (text.toLowerCase().includes('save') || text.toLowerCase().includes('update')) {
        showToast(`Configuration updated successfully!`, 'success');
      } else if (text) {
        showToast(`Action triggered: ${text}`, 'info');
      }
    }
  });
}

// ── Toast ──
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success:'check-circle', error:'times-circle', info:'info-circle' };
  toast.innerHTML = `<i class="fas fa-${icons[type] || 'info-circle'}"></i><span class="toast-message">${message}</span><span class="toast-close" onclick="this.parentElement.remove()"><i class="fas fa-xmark"></i></span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// ── Chart Initialization ──
function initChartsOnPage(page) {
  document.querySelectorAll('canvas[data-chart]').forEach(canvas => {
    const type = canvas.dataset.chart;
    const ctx = canvas.getContext('2d');
    const chartConfigs = getChartConfig(type);
    if (chartConfigs) new Chart(ctx, chartConfigs);
  });
}

function getChartConfig(type) {
  const gridColor = 'rgba(255,255,255,0.05)';
  const configs = {
    revenue: {
      type:'line',
      data:{
        labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets:[{
          label:'Revenue (₹ Lakhs)', data:[42,48,55,51,67,72,78,85,82,95,102,118],
          borderColor:'#6366f1', backgroundColor:'rgba(99,102,241,0.1)',
          fill:true, tension:0.4, pointRadius:4, pointBackgroundColor:'#6366f1',
          borderWidth:2
        },{
          label:'Expenses (₹ Lakhs)', data:[28,32,35,38,40,42,45,48,44,50,52,58],
          borderColor:'#ec4899', backgroundColor:'rgba(236,72,153,0.1)',
          fill:true, tension:0.4, pointRadius:4, pointBackgroundColor:'#ec4899',
          borderWidth:2
        }]
      },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'top',labels:{color:'#94a3b8',usePointStyle:true,padding:20}}}, scales:{x:{grid:{color:gridColor},ticks:{color:'#64748b'}},y:{grid:{color:gridColor},ticks:{color:'#64748b'}}} }
    },
    doughnut: {
      type:'doughnut',
      data:{
        labels:['HR','Finance','Inventory','CRM','Projects'],
        datasets:[{ data:[25,30,20,15,10], backgroundColor:['#6366f1','#22c55e','#f59e0b','#ec4899','#06b6d4'], borderWidth:0 }]
      },
      options:{ responsive:true, maintainAspectRatio:false, cutout:'72%', plugins:{legend:{position:'bottom',labels:{color:'#94a3b8',usePointStyle:true,padding:16}}} }
    },
    bar: {
      type:'bar',
      data:{
        labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
        datasets:[{
          label:'Tasks Completed', data:[12,19,8,15,22,10,5],
          backgroundColor:'rgba(99,102,241,0.7)', borderRadius:6, borderSkipped:false
        },{
          label:'Tasks Created', data:[15,22,12,18,25,14,8],
          backgroundColor:'rgba(168,85,247,0.4)', borderRadius:6, borderSkipped:false
        }]
      },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'top',labels:{color:'#94a3b8',usePointStyle:true}}}, scales:{x:{grid:{display:false},ticks:{color:'#64748b'}},y:{grid:{color:gridColor},ticks:{color:'#64748b'}}} }
    },
    attendance: {
      type:'bar',
      data:{
        labels:['Mon','Tue','Wed','Thu','Fri'],
        datasets:[{
          label:'Present', data:[142,148,145,150,138],
          backgroundColor:'rgba(34,197,94,0.7)', borderRadius:4
        },{
          label:'Absent', data:[8,5,10,3,15],
          backgroundColor:'rgba(239,68,68,0.7)', borderRadius:4
        },{
          label:'WFH', data:[12,9,7,9,9],
          backgroundColor:'rgba(99,102,241,0.7)', borderRadius:4
        }]
      },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'top',labels:{color:'#94a3b8',usePointStyle:true}}}, scales:{x:{stacked:true,grid:{display:false},ticks:{color:'#64748b'}},y:{stacked:true,grid:{color:gridColor},ticks:{color:'#64748b'}}} }
    },
    cashflow: {
      type:'line',
      data:{
        labels:['Jan','Feb','Mar','Apr','May','Jun'],
        datasets:[{
          label:'Inflow', data:[85,92,78,95,110,105],
          borderColor:'#22c55e', backgroundColor:'rgba(34,197,94,0.1)',
          fill:true, tension:0.4, borderWidth:2
        },{
          label:'Outflow', data:[65,70,72,68,75,80],
          borderColor:'#ef4444', backgroundColor:'rgba(239,68,68,0.1)',
          fill:true, tension:0.4, borderWidth:2
        }]
      },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'top',labels:{color:'#94a3b8',usePointStyle:true}}}, scales:{x:{grid:{color:gridColor},ticks:{color:'#64748b'}},y:{grid:{color:gridColor},ticks:{color:'#64748b'}}} }
    },
    inventory: {
      type:'bar',
      data:{
        labels:['Electronics','Furniture','Supplies','Software','Hardware','Services'],
        datasets:[{
          label:'Stock Level', data:[340,180,520,90,210,150],
          backgroundColor:['rgba(99,102,241,0.7)','rgba(236,72,153,0.7)','rgba(34,197,94,0.7)','rgba(245,158,11,0.7)','rgba(6,182,212,0.7)','rgba(168,85,247,0.7)'],
          borderRadius:6
        }]
      },
      options:{ responsive:true, maintainAspectRatio:false, indexAxis:'y', plugins:{legend:{display:false}}, scales:{x:{grid:{color:gridColor},ticks:{color:'#64748b'}},y:{grid:{display:false},ticks:{color:'#94a3b8'}}} }
    },
    pipeline: {
      type:'doughnut',
      data:{
        labels:['Qualified','Proposal','Negotiation','Closed Won','Closed Lost'],
        datasets:[{ data:[35,25,18,15,7], backgroundColor:['#3b82f6','#6366f1','#f59e0b','#22c55e','#ef4444'], borderWidth:0 }]
      },
      options:{ responsive:true, maintainAspectRatio:false, cutout:'65%', plugins:{legend:{position:'bottom',labels:{color:'#94a3b8',usePointStyle:true,padding:12}}} }
    },
    sprint: {
      type:'line',
      data:{
        labels:['Day 1','Day 2','Day 3','Day 4','Day 5','Day 6','Day 7','Day 8','Day 9','Day 10'],
        datasets:[{
          label:'Ideal', data:[40,36,32,28,24,20,16,12,8,0],
          borderColor:'rgba(148,163,184,0.5)', borderDash:[5,5], borderWidth:2, pointRadius:0, fill:false
        },{
          label:'Actual', data:[40,38,35,30,28,22,20,15,11,6],
          borderColor:'#6366f1', backgroundColor:'rgba(99,102,241,0.1)',
          fill:true, tension:0.3, borderWidth:2
        }]
      },
      options:{ responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'top',labels:{color:'#94a3b8',usePointStyle:true}}}, scales:{x:{grid:{color:gridColor},ticks:{color:'#64748b'}},y:{grid:{color:gridColor},ticks:{color:'#64748b'}}} }
    }
  };
  return configs[type] || null;
}

// ── Utility ──
function formatCurrency(n) { return '₹' + n.toLocaleString('en-IN'); }
function formatNumber(n) { return n.toLocaleString('en-IN'); }
