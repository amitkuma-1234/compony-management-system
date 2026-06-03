/* ============================================================
   AMDOX ERP SUITE — Main Application Controller
   ============================================================ */

// ── Page Renderers ──
const pages = window.pages;

// ── App Init ──
function initApp() {

  // Wait 2200ms to allow splash animation to play and scripts to settle
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    const app = document.getElementById('app');
    
    if (preloader) preloader.classList.add('hidden');
    if (app) app.classList.add('visible');

    // Initialize logic only after the delay to ensure pages are populated
    initRouter();
    initSidebar();
    initTopbar();
    initAIPanel();
    initCommandPalette();
    initNotifications();
    initQuickActions();
    initAddEmployeeModal();
    initNewInvoiceModal();
    initRecordExpenseModal();
    initTaxCalculatorModal();
    initViewInvoiceModal();
    initAddProductModal();
    initNewPOModal();
    initScanInventoryModal();
    initAddLeadModal();
    initEditLeadModal();
    initEditProjectModal();
    initNewCampaignModal();
    initNewProjectModal();
    initMyTasksModal();
    initCreateDealModal();
    initSupportTicketModal();
    initAddTaskModal();
    initNotificationModal();
    initChannelModal();
    initStatDetailModal();
    initGlobalActions();
  }, 2200);
}

// Logout function
window.logout = function() {
    localStorage.removeItem('amdox_token');
    localStorage.removeItem('amdox_user');
    window.location.href = 'login.html';
};

// Bootstrap the application
if (document.readyState === 'complete') {
  initApp();
} else {
  window.addEventListener('load', initApp);
}

// ── Router ──
function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

function handleRoute() {
  const hash = (location.hash || '#dashboard').replace('#', '');
  console.log('🔄 Routing to:', hash);
  navigateTo(hash);
}

function navigateTo(page) {
  const container = document.getElementById('page-content');
  if (!container) {
    console.error('❌ Error: #page-content container NOT FOUND in DOM');
    return;
  }

  console.log('🏗️ Navigating to page:', page);
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
  if (renderFn) {
    console.log('✅ Found renderer for:', page);
    renderFn(container);
  } else {
    console.error('❌ Missing renderer for:', page, '(and dashboard fallback)');
  }
  // Init charts after render
  setTimeout(() => initChartsOnPage(page), 100);

  // Clear notification badge if navigating to notifications page
  if (page === 'notifications') {
    const badge = document.querySelector('.nav-count');
    if (badge) badge.style.display = 'none';
    const dot = document.querySelector('.notification-dot');
    if (dot) dot.style.display = 'none';
  }

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

  window.openAIPanel = function(initialMessage) {
      panel.classList.add('open');
      if (initialMessage) {
          input.value = initialMessage;
          sendMessage();
      }
  };
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

  const commandList = palette.querySelector('.command-palette-results');
  const originalContent = commandList.innerHTML;

  // Dynamic filter results with Global Database Search
  input.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    
    if (!q) {
      commandList.innerHTML = originalContent;
      // Re-attach listeners to original items since they were replaced
      commandList.querySelectorAll('.command-item').forEach(item => {
        item.addEventListener('click', () => {
          const action = item.dataset.action;
          if (action) location.hash = action;
          palette.classList.remove('open');
        });
      });
      return;
    }

    // 1. Search Database
    const emps = db.table('employees').find(e => e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q));
    const invs = db.table('invoices').find(i => i.invoiceNo.toLowerCase().includes(q) || i.client.toLowerCase().includes(q));
    const leads = db.table('leads').find(l => l.company.toLowerCase().includes(q));

    let html = '';
    if (emps.length) {
      html += `<div class="command-group"><span class="command-group-title">Employees (${emps.length})</span>`;
      html += emps.map(e => `<div class="command-item" onclick="location.hash='hr'; openCommandPalette(false);"><i class="fas fa-user"></i> <span>${e.name} (${e.department})</span></div>`).join('');
      html += `</div>`;
    }
    if (invs.length) {
      html += `<div class="command-group"><span class="command-group-title">Invoices (${invs.length})</span>`;
      html += invs.map(i => `<div class="command-item" onclick="location.hash='finance'; openCommandPalette(false);"><i class="fas fa-file-invoice-dollar"></i> <span>${i.invoiceNo} - ${i.client}</span></div>`).join('');
      html += `</div>`;
    }
    if (leads.length) {
      html += `<div class="command-group"><span class="command-group-title">Leads (${leads.length})</span>`;
      html += leads.map(l => `<div class="command-item" onclick="location.hash='crm'; openCommandPalette(false);"><i class="fas fa-building"></i> <span>${l.company} (${l.stage})</span></div>`).join('');
      html += `</div>`;
    }

    commandList.innerHTML = html || `<div style="padding:40px 20px; text-align:center; color:var(--text-muted)"><i class="fas fa-search" style="font-size:24px; margin-bottom:12px; display:block; opacity:0.3"></i>No records found for "${q}"</div>`;
  });
}

function openCommandPalette(show = true) {
  const palette = document.getElementById('command-palette');
  if (!show) { palette.classList.remove('open'); return; }
  palette.classList.add('open');
  const input = document.getElementById('command-input');
  input.value = '';
  // Trigger input event to reset to original content
  input.dispatchEvent(new Event('input'));
  setTimeout(() => input.focus(), 10);
}

// ── Notifications ──
function initNotifications() {
  const panel = document.getElementById('notification-panel');
  const btn = document.getElementById('notification-btn');
  const items = document.querySelectorAll('.notification-item');
  const dot = document.querySelector('.notification-dot');
  const sidebarCount = document.querySelector('#nav-notifications .nav-count');

  // Helper to update all counts
  const updateCounts = () => {
    const unreadCount = document.querySelectorAll('.notification-item.unread').length;
    if (sidebarCount) {
        sidebarCount.textContent = unreadCount;
        sidebarCount.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
    if (dot) dot.style.display = unreadCount > 0 ? 'block' : 'none';
  };

  // Initial update
  updateCounts();

  btn.addEventListener('click', () => {
    panel.classList.toggle('open');
  });

  // Mark all read
  document.getElementById('mark-all-read').addEventListener('click', () => {
    items.forEach(n => n.classList.remove('unread'));
    updateCounts();
    showToast('All notifications marked as read', 'success');
  });

  // Click individual notification
  items.forEach(item => {
    item.addEventListener('click', () => {
      if (item.classList.contains('unread')) {
        item.classList.remove('unread');
        updateCounts();
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
      
      if (task === 'onboard-emp' || task === 'add-employee') {
        setTimeout(() => openAddEmployeeModal(), 100);
        return;
      }
      
      if (task === 'new-invoice') {
        setTimeout(() => { if (typeof window.openNewInvoiceModal === 'function') window.openNewInvoiceModal(); }, 100);
        return;
      }

      if (task === 'record-expense') {
        setTimeout(() => { if (typeof window.openRecordExpenseModal === 'function') window.openRecordExpenseModal(); }, 100);
        return;
      }

      if (task === 'tax-calc') {
        setTimeout(() => { if (typeof window.openTaxCalculatorModal === 'function') window.openTaxCalculatorModal(); }, 100);
        return;
      }

      if (task === 'add-product') {
        setTimeout(() => { if (typeof window.openAddProductModal === 'function') window.openAddProductModal(); }, 100);
        return;
      }

      if (task === 'new-po') {
        setTimeout(() => { if (typeof window.openNewPOModal === 'function') window.openNewPOModal(); }, 100);
        return;
      }

      if (task === 'new-lead') {
        setTimeout(() => { if (typeof window.openAddLeadModal === 'function') window.openAddLeadModal(); }, 100);
        return;
      }

      if (task === 'new-deal') {
        setTimeout(() => { if (typeof window.openCreateDealModal === 'function') window.openCreateDealModal(); }, 100);
        return;
      }

      if (task === 'support-ticket') {
        setTimeout(() => { if (typeof window.openSupportTicketModal === 'function') window.openSupportTicketModal(); }, 100);
        return;
      }

      if (task === 'new-project') {
        setTimeout(() => { if (typeof window.openNewProjectModal === 'function') window.openNewProjectModal(); }, 100);
        return;
      }

      if (task === 'new-task') {
        setTimeout(() => { if (typeof window.openAddTaskModal === 'function') window.openAddTaskModal(); }, 100);
        return;
      }
      
      // Navigate to the module
      if (action) location.hash = action;
      // Show contextual toast
      const msg = taskMessages[task] || `Opening ${item.querySelector('.qa-label').textContent}...`;
      setTimeout(() => showToast(msg, 'success'), 300);
    });
  });
}

// ── Add Employee Modal ──
function initAddEmployeeModal() {
  const modal = document.getElementById('add-employee-modal');
  if (!modal) return;
  const backdrop = modal.querySelector('.quick-action-backdrop');
  const closeBtn = document.getElementById('add-employee-close');
  const cancelBtn = document.getElementById('add-employee-cancel');
  const form = document.getElementById('add-employee-form');

  window.openAddEmployeeModal = function() {
    modal.classList.add('open');
    if (!form.dataset.editId) {
        form.reset();
        modal.querySelector('h3').textContent = 'Add Employee';
        modal.querySelector('span').textContent = 'Onboard a new team member';
        modal.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-check"></i> Save Employee';
    } else {
        modal.querySelector('h3').textContent = 'Edit Employee';
        modal.querySelector('span').textContent = 'Update employee details';
        modal.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> Update Employee';
    }
    setTimeout(() => document.getElementById('emp-name').focus(), 100);
  };

  function closeModal() { 
      modal.classList.remove('open'); 
      delete form.dataset.editId;
  }
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('emp-name').value.trim();
    const email = document.getElementById('emp-email').value.trim();
    const department = document.getElementById('emp-dept').value;
    const role = document.getElementById('emp-role').value.trim();
    const joinDate = document.getElementById('emp-date').value.trim();
    const salary = document.getElementById('emp-salary').value;

    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'EMP';
    
    if (form.dataset.editId) {
        // Edit Mode
        const empId = form.dataset.editId;
        const existing = db.table('employees').getById(empId);
        
        // Handle department change for counts
        if (existing.department !== department) {
            const deptTable = db.table('departments');
            const oldDept = deptTable.findOne(d => d.name === existing.department);
            if (oldDept) deptTable.update(oldDept.id, { employeeCount: oldDept.employeeCount - 1 });
            const newDept = deptTable.findOne(d => d.name === department);
            if (newDept) deptTable.update(newDept.id, { employeeCount: newDept.employeeCount + 1 });
        }
        
        db.table('employees').update(empId, {
            name, email, initials, department, role, joinDate, salary: Number(salary)
        });
        showToast(`Employee ${name} updated successfully!`, 'success');
    } else {
        // Create Mode
        const gradients = [
          'linear-gradient(135deg,#6366f1,#a855f7)',
          'linear-gradient(135deg,#ec4899,#f59e0b)',
          'linear-gradient(135deg,#22c55e,#06b6d4)',
          'linear-gradient(135deg,#3b82f6,#8b5cf6)'
        ];
        const gradient = gradients[Math.floor(Math.random() * gradients.length)];

        const newEmp = {
          name, email, initials, department, role, 
          status: 'Active', joinDate, salary: Number(salary), gradient
        };

        db.table('employees').create(newEmp);
        
        const statsTable = db.table('hrStats');
        const stats = statsTable.getAll()[0];
        statsTable.update(stats.id, { 
            totalEmployees: stats.totalEmployees + 1,
            newThisMonth: stats.newThisMonth + 1
        });

        const dbStatsTable = db.table('dashboardStats');
        const dbStat = dbStatsTable.findOne(s => s.id === 2 || s.label === 'Active Employees');
        if (dbStat) {
            const newCount = db.table('employees').count().toString();
            dbStatsTable.update(dbStat.id, { trend: (Number(dbStat.trend) + 1).toString(), value: newCount });
        }

        const deptTable = db.table('departments');
        const dept = deptTable.findOne(d => d.name === department);
        if (dept) deptTable.update(dept.id, { employeeCount: dept.employeeCount + 1 });

        showToast(`Employee ${name} added successfully!`, 'success');
    }

    closeModal();
    if (location.hash === '#hr' || location.hash === '' || location.hash === '#dashboard') handleRoute();
  });
}

// ── Employee Table Actions ──
window.deleteEmployee = function(id) {
    if (!confirm('Are you sure you want to delete this employee? This action cannot be undone.')) return;
    
    const emp = db.table('employees').getById(id);
    if (!emp) return;
    
    // Update department stats
    const deptTable = db.table('departments');
    const dept = deptTable.findOne(d => d.name === emp.department);
    if (dept) deptTable.update(dept.id, { employeeCount: Math.max(0, dept.employeeCount - 1) });
    
    // Update HR stats
    const statsTable = db.table('hrStats');
    const stats = statsTable.getAll()[0];
    statsTable.update(stats.id, { 
        totalEmployees: Math.max(0, stats.totalEmployees - 1),
        newThisMonth: Math.max(0, stats.newThisMonth - 1)
    });

    // Update Dashboard stats trend
    const dbStatsTable = db.table('dashboardStats');
    const dbStat = dbStatsTable.findOne(s => s.id === 2 || s.label === 'Active Employees');
        if (dbStat) {
            const newCount = db.table('employees').count().toString();
            const newTrend = Math.max(0, Number(dbStat.trend) - 1).toString();
            dbStatsTable.update(dbStat.id, { trend: newTrend, value: newCount });
        }
    
    db.table('employees').delete(id);
    showToast(`Employee deleted successfully!`, 'success');
    
    if (location.hash === '#hr' || location.hash === '' || location.hash === '#dashboard') handleRoute();
};

window.editEmployee = function(id) {
    const emp = db.table('employees').getById(id);
    if (!emp) return;
    
    const form = document.getElementById('add-employee-form');
    if (!form) return;
    
    form.dataset.editId = id;
    document.getElementById('emp-name').value = emp.name;
    document.getElementById('emp-email').value = emp.email;
    document.getElementById('emp-dept').value = emp.department;
    document.getElementById('emp-role').value = emp.role;
    document.getElementById('emp-date').value = emp.joinDate;
    document.getElementById('emp-salary').value = emp.salary || 100000;
    
    window.openAddEmployeeModal();
};

window.exportHRReport = function() {
    const emps = db.table('employees').getAll();
    if (!emps || emps.length === 0) {
        showToast('No employee data to export', 'error');
        return;
    }
    
    showToast('Generating export...', 'info');
    
    const headers = ['ID', 'Name', 'Email', 'Department', 'Role', 'Status', 'Join Date', 'Salary'];
    const csvRows = [];
    csvRows.push(headers.join(','));
    
    emps.forEach(e => {
        const row = [
            e.id,
            `"${e.name}"`,
            `"${e.email}"`,
            `"${e.department}"`,
            `"${e.role}"`,
            e.status,
            e.joinDate,
            e.salary
        ];
        csvRows.push(row.join(','));
    });
    
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "hr_report.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => showToast('Report exported successfully!', 'success'), 1000);
};

// ── Chart Dropdown Menu Actions ──
window.toggleChartMenu = function(e, menuId) {
    e.stopPropagation();
    // Close all other chart dropdowns first
    document.querySelectorAll('.chart-dropdown.open').forEach(d => {
        if (d.id !== menuId) d.classList.remove('open');
    });
    const menu = document.getElementById(menuId);
    if (menu) menu.classList.toggle('open');
};

// Close chart menus on outside click
document.addEventListener('click', function(e) {
    if (!e.target.closest('.chart-menu-wrapper')) {
        document.querySelectorAll('.chart-dropdown.open').forEach(d => d.classList.remove('open'));
    }
});

window.downloadChartPNG = function(e, chartType) {
    e.preventDefault();
    e.stopPropagation();
    const canvas = document.querySelector(`canvas[data-chart="${chartType}"]`);
    if (!canvas) { showToast('Chart not found', 'error'); return; }
    
    // Use Canvas toDataURL to create a PNG download
    const link = document.createElement('a');
    link.download = `${chartType}_chart.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast(`${chartType === 'revenue' ? 'Revenue vs Expenses' : 'Module Usage'} chart downloaded as PNG`, 'success');
    document.querySelectorAll('.chart-dropdown.open').forEach(d => d.classList.remove('open'));
};

window.exportChartCSV = function(e, chartType) {
    e.preventDefault();
    e.stopPropagation();
    let csvContent = '';
    
    if (chartType === 'revenue') {
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const revenue = [42,48,40,52,58,55,62,68,56,72,78,82];
        const expenses = [28,32,30,34,38,36,40,44,38,48,50,52];
        csvContent = 'Month,Revenue (₹L),Expenses (₹L)\n';
        months.forEach((m, i) => { csvContent += `${m},${revenue[i]},${expenses[i]}\n`; });
    } else {
        csvContent = 'Module,Usage %\nHR,28\nFinance,22\nCRM,18\nInventory,15\nProjects,12\nOther,5\n';
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${chartType}_data.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    
    showToast(`${chartType === 'revenue' ? 'Revenue' : 'Module Usage'} data exported as CSV`, 'success');
    document.querySelectorAll('.chart-dropdown.open').forEach(d => d.classList.remove('open'));
};

window.refreshChart = function(e, chartType) {
    e.preventDefault();
    e.stopPropagation();
    document.querySelectorAll('.chart-dropdown.open').forEach(d => d.classList.remove('open'));
    showToast('Refreshing chart data...', 'info');
    setTimeout(() => {
        initChartsOnPage('dashboard');
        showToast(`${chartType === 'revenue' ? 'Revenue vs Expenses' : 'Module Usage'} chart refreshed`, 'success');
    }, 800);
};

window.fullscreenChart = function(e, chartType) {
    e.preventDefault();
    e.stopPropagation();
    document.querySelectorAll('.chart-dropdown.open').forEach(d => d.classList.remove('open'));
    
    const canvas = document.querySelector(`canvas[data-chart="${chartType}"]`);
    if (!canvas) { showToast('Chart not found', 'error'); return; }
    
    const card = canvas.closest('.card');
    if (card) {
        if (!document.fullscreenElement) {
            card.requestFullscreen().then(() => {
                card.style.background = 'var(--bg-primary)';
                card.style.padding = '20px';
                showToast('Press ESC to exit fullscreen', 'info');
            }).catch(() => showToast('Fullscreen not supported', 'error'));
        } else {
            document.exitFullscreen();
        }
    }
};

// ── Weekly Tasks action ──
window.showWeeklyTasks = function() {
    if (typeof window.openMyTasksModal === 'function') {
        window.openMyTasksModal();
    } else {
        showToast('📋 Showing tasks for this week — 12 tasks pending, 8 completed', 'info');
    }
};

// ── Low Stock Alert Actions ──
window.watchLowStockItem = function(id) {
    // Handle both dedicated alert table and product-derived alerts
    let item;
    const alertTable = db.table('lowStockAlerts');
    const productTable = db.table('products');
    
    if (id.toString().startsWith('prod-')) {
        const prodId = parseInt(id.replace('prod-', ''));
        item = productTable.get(prodId);
        if (item) {
            // Simulator: Products don't have 'watched' field in seed, so we toggle it in memory or update if exists
            const wasWatched = item.watched || false;
            productTable.update(prodId, { watched: !wasWatched });
            showToast(`${!wasWatched ? 'Started' : 'Stopped'} watching ${item.name}`, 'success');
        }
    } else {
        item = alertTable.get(id);
        if (item) {
            const newState = !item.watched;
            alertTable.update(id, { watched: newState });
            showToast(`${newState ? 'Started' : 'Stopped'} watching ${item.name}`, 'success');
        }
    }
    
    // Refresh dashboard UI to reflect status if we're on the dashboard
    if (location.hash === '' || location.hash === '#dashboard') {
        setTimeout(() => handleRoute(), 300);
    }
};

window.reorderLowStockItem = function(id) {
    let name = 'this item';
    if (id.toString().startsWith('prod-')) {
        const prod = db.table('products').get(parseInt(id.replace('prod-', '')));
        if (prod) name = prod.name;
    } else {
        const alert = db.table('lowStockAlerts').get(id);
        if (alert) name = alert.name;
    }
    
    showToast(`📦 Reorder request sent! Purchase Order generated for ${name}.`, 'success');
};

// ── HR Module Actions ──
window.markAttendance = function() {
    const statsTable = db.table('hrStats');
    const stats = statsTable.getAll()[0];
    if (stats.presentToday < stats.totalEmployees) {
        statsTable.update(stats.id, { presentToday: stats.presentToday + 1 });
        showToast('Attendance marked successfully!', 'success');
        if (location.hash === '#hr' || location.hash === '') handleRoute();
    } else {
        showToast('All employees are already present!', 'info');
    }
};

window.applyLeave = function() {
    const reason = prompt("Enter reason for leave:");
    if (reason) {
        const statsTable = db.table('hrStats');
        const stats = statsTable.getAll()[0];
        statsTable.update(stats.id, { onLeave: stats.onLeave + 1, presentToday: Math.max(0, stats.presentToday - 1) });
        showToast('Leave request submitted.', 'success');
        if (location.hash === '#hr' || location.hash === '') handleRoute();
    }
};

window.runPayroll = function() {
    showToast('Processing payroll...', 'info');
    setTimeout(() => {
        showToast('Payroll processed for all active employees!', 'success');
    }, 1500);
};

window.newReview = function() {
    const emp = prompt("Enter employee name for review:");
    if (emp) {
        showToast(`Performance review started for ${emp}`, 'success');
    }
};

// ── New Invoice Modal ──
function initNewInvoiceModal() {
  const modal = document.getElementById('new-invoice-modal');
  if (!modal) return;
  const backdrop = modal.querySelector('.quick-action-backdrop');
  const closeBtn = document.getElementById('new-invoice-close');
  const cancelBtn = document.getElementById('new-invoice-cancel');
  const form = document.getElementById('new-invoice-form');

  function generateInvoiceNo() {
    const invoices = db.table('invoices').getAll();
    if (invoices.length === 0) return 'INV-3001';
    const maxNum = Math.max(...invoices.map(inv => {
      const num = parseInt(inv.invoiceNo.replace('INV-', ''), 10);
      return isNaN(num) ? 0 : num;
    }));
    return 'INV-' + (maxNum + 1);
  }

  window.openNewInvoiceModal = function() {
    modal.classList.add('open');
    if (!form.dataset.editId) {
        form.reset();
        document.getElementById('inv-number').value = generateInvoiceNo();
        // Set default due date to 30 days from now
        const defaultDue = new Date();
        defaultDue.setDate(defaultDue.getDate() + 30);
        document.getElementById('inv-due-date').value = defaultDue.toISOString().split('T')[0];
        const h3 = modal.querySelector('h3');
        if (h3) h3.textContent = 'Create Invoice';
        const span = modal.querySelector('span');
        if (span) span.textContent = 'Generate a new invoice';
        const btn = modal.querySelector('button[type="submit"]');
        if (btn) btn.innerHTML = '<i class="fas fa-check"></i> Create Invoice';
    } else {
        const h3 = modal.querySelector('h3');
        if (h3) h3.textContent = 'Edit Invoice';
        const span = modal.querySelector('span');
        if (span) span.textContent = 'Update invoice details';
        const btn = modal.querySelector('button[type="submit"]');
        if (btn) btn.innerHTML = '<i class="fas fa-save"></i> Update Invoice';
    }
    setTimeout(() => document.getElementById('inv-client').focus(), 100);
  };

  function closeModal() { 
    modal.classList.remove('open'); 
    delete form.dataset.editId;
  }
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const invoiceNo = document.getElementById('inv-number').value;
    const client = document.getElementById('inv-client').value.trim();
    const amount = Number(document.getElementById('inv-amount').value);
    const dueDateRaw = document.getElementById('inv-due-date').value;
    const status = document.getElementById('inv-status').value;
    const description = document.getElementById('inv-description').value.trim();

    // Format date as "May 25, 2026"
    const dateObj = new Date(dueDateRaw + 'T00:00:00');
    const dueDate = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    if (form.dataset.editId) {
        const invId = form.dataset.editId;
        const existing = db.table('invoices').getById(invId);
        
        db.table('invoices').update(invId, { client, amount, dueDate, status, description });
        
        if (existing.status !== status) {
            const statsTable = db.table('financeStats');
            const stats = statsTable.getAll()[0];
            if (stats) {
                let pendingChange = 0;
                if (status === 'Pending') pendingChange = 1;
                else if (existing.status === 'Pending') pendingChange = -1;
                statsTable.update(stats.id, { pendingInvoices: Math.max(0, (stats.pendingInvoices || 0) + pendingChange) });
            }
        }
        showToast(`Invoice ${invoiceNo} updated successfully!`, 'success');
    } else {
        const newInvoice = { invoiceNo, client, amount, dueDate, status, description };
        db.table('invoices').create(newInvoice);

        // Update pending invoices count in finance stats if status is Pending
        if (status === 'Pending') {
          const statsTable = db.table('financeStats');
          const stats = statsTable.getAll()[0];
          if (stats) {
            statsTable.update(stats.id, { pendingInvoices: (stats.pendingInvoices || 0) + 1 });
          }
        }

        // Also add a corresponding transaction entry
        const txnType = status === 'Paid' ? 'inflow' : 'pending';
        const txnStatus = status === 'Paid' ? 'Received' : 'Pending';
        db.table('transactions').create({
          type: txnType,
          title: (status === 'Paid' ? 'Payment from ' : 'Invoice to ') + client,
          ref: invoiceNo,
          amount: amount,
          status: txnStatus
        });

        showToast(`Invoice ${invoiceNo} created for ${client} — ₹${amount.toLocaleString('en-IN')}`, 'success');
    }
    
    closeModal();

    // Re-render current page to reflect new data
    if (location.hash === '#finance' || location.hash === '#dashboard' || location.hash === '') {
      handleRoute();
    }
  });
}

// ── Invoice Actions ──
window.deleteInvoice = function(id) {
    if (!confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) return;
    
    const inv = db.table('invoices').getById(id);
    if (!inv) return;
    
    // Update pending invoices stat if needed
    if (inv.status === 'Pending') {
        const statsTable = db.table('financeStats');
        const stats = statsTable.getAll()[0];
        if (stats) {
            statsTable.update(stats.id, { pendingInvoices: Math.max(0, (stats.pendingInvoices || 0) - 1) });
        }
    }
    
    db.table('invoices').delete(id);
    showToast(`Invoice deleted successfully!`, 'success');
    
    if (location.hash === '#finance' || location.hash === '#dashboard' || location.hash === '') handleRoute();
};

window.editInvoice = function(id) {
    const inv = db.table('invoices').getById(id);
    if (!inv) return;
    
    const form = document.getElementById('new-invoice-form');
    if (!form) return;
    
    form.dataset.editId = id;
    document.getElementById('inv-number').value = inv.invoiceNo;
    document.getElementById('inv-client').value = inv.client;
    document.getElementById('inv-amount').value = inv.amount;
    document.getElementById('inv-status').value = inv.status || 'Pending';
    document.getElementById('inv-description').value = inv.description || '';
    
    // Parse back date from something like "May 25, 2026"
    const d = new Date(inv.dueDate);
    if (!isNaN(d.getTime())) {
        document.getElementById('inv-due-date').value = d.toISOString().split('T')[0];
    } else {
        // Fallback if parsing fails
        const fallback = new Date();
        document.getElementById('inv-due-date').value = fallback.toISOString().split('T')[0];
    }
    
    window.openNewInvoiceModal();
};

// ── Record Expense Modal ──
function initRecordExpenseModal() {
  const modal = document.getElementById('record-expense-modal');
  if (!modal) return;
  const backdrop = modal.querySelector('.quick-action-backdrop');
  const closeBtn = document.getElementById('record-expense-close');
  const cancelBtn = document.getElementById('record-expense-cancel');
  const form = document.getElementById('record-expense-form');

  window.openRecordExpenseModal = function() {
    modal.classList.add('open');
    form.reset();
    // Set default date to today
    document.getElementById('exp-date').value = new Date().toISOString().split('T')[0];
    setTimeout(() => document.getElementById('exp-title').focus(), 100);
  };

  function closeModal() { modal.classList.remove('open'); }
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('exp-title').value.trim();
    const category = document.getElementById('exp-category').value;
    const amount = Number(document.getElementById('exp-amount').value);
    const dateRaw = document.getElementById('exp-date').value;
    const method = document.getElementById('exp-method').value;
    const ref = document.getElementById('exp-ref').value.trim() || 'EXP-' + Math.floor(1000 + Math.random() * 9000);

    // Add to transactions
    db.table('transactions').create({
      type: 'outflow',
      title: title,
      ref: ref,
      amount: amount,
      status: 'Paid'
    });

    // Update Finance Stats
    const statsTable = db.table('financeStats');
    const stats = statsTable.getAll()[0];
    if (stats && stats.expensesYTD) {
        // Parse "₹58.2L"
        let val = parseFloat(stats.expensesYTD.replace('₹', '').replace('L', ''));
        if (!isNaN(val)) {
            val += (amount / 100000);
            statsTable.update(stats.id, { expensesYTD: `₹${val.toFixed(1)}L` });
        }
    }

    showToast(`Expense recorded: ${title} — ₹${amount.toLocaleString('en-IN')}`, 'success');
    closeModal();

    if (location.hash === '#finance' || location.hash === '#dashboard' || location.hash === '') {
      handleRoute();
    }
  });
}

// ── Tax Calculator Modal ──
function initTaxCalculatorModal() {
  const modal = document.getElementById('tax-calculator-modal');
  
  window.openTaxCalculatorModal = function() {
    const m = document.getElementById('tax-calculator-modal');
    if (!m) {
        console.error('Tax Calculator Modal element NOT FOUND in DOM');
        showToast('Error: Calculator UI missing', 'error');
        return;
    }
    m.classList.add('open');
    const baseInput = document.getElementById('tax-base-amount');
    if (baseInput) {
        baseInput.value = '';
        setTimeout(() => baseInput.focus(), 100);
    }
    document.getElementById('tax-result-amount').textContent = '₹0.00';
    document.getElementById('tax-result-total').textContent = '₹0.00';
  };

  if (!modal) {
      console.warn('initTaxCalculatorModal: Modal element not found during init');
      return;
  }

  const backdrop = modal.querySelector('.quick-action-backdrop');
  const closeBtn = document.getElementById('tax-calc-close');
  const doneBtn = document.getElementById('tax-calc-done');
  const copyBtn = document.getElementById('tax-calc-copy');
  
  const baseInput = document.getElementById('tax-base-amount');
  const typeSelect = document.getElementById('tax-type');
  const rateSelect = document.getElementById('tax-rate');
  const customRateContainer = document.getElementById('custom-rate-container');
  const customRateInput = document.getElementById('tax-custom-rate');
  
  const resultTax = document.getElementById('tax-result-amount');
  const resultTotal = document.getElementById('tax-result-total');

  function calculate() {
    const base = parseFloat(baseInput.value) || 0;
    let rate = rateSelect.value === 'custom' ? parseFloat(customRateInput.value) : parseFloat(rateSelect.value);
    if (isNaN(rate)) rate = 0;
    
    const tax = (base * rate) / 100;
    const total = base + tax;
    
    resultTax.textContent = `₹${tax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    resultTotal.textContent = `₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  const closeModal = () => modal.classList.remove('open');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (doneBtn) doneBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  if (baseInput) baseInput.addEventListener('input', calculate);
  if (rateSelect) rateSelect.addEventListener('change', () => {
    if (customRateContainer) customRateContainer.style.display = rateSelect.value === 'custom' ? 'flex' : 'none';
    calculate();
  });
  if (customRateInput) customRateInput.addEventListener('input', calculate);

  if (copyBtn) copyBtn.addEventListener('click', () => {
    const text = `Base: ₹${baseInput.value || 0}\nTax (${rateSelect.value}%): ${resultTax.textContent}\nTotal: ${resultTotal.textContent}`;
    navigator.clipboard.writeText(text).then(() => {
      showToast('Calculation copied to clipboard!', 'success');
    });
  });
}

// ── View Invoice Modal ──
function initViewInvoiceModal() {
  const modal = document.getElementById('view-invoice-modal');
  
  window.viewInvoice = function(id) {
    const m = document.getElementById('view-invoice-modal');
    if (!m) {
        console.error('View Invoice Modal element NOT FOUND');
        showToast('Error: Viewer UI missing', 'error');
        return;
    }
    const inv = db.table('invoices').getById(id);
    if (!inv) {
        showToast('Error: Invoice not found', 'error');
        return;
    }
    
    document.getElementById('view-inv-no').textContent = inv.invoiceNo;
    document.getElementById('view-inv-client').textContent = inv.client;
    document.getElementById('view-inv-date').textContent = inv.dueDate;
    document.getElementById('view-inv-amount').textContent = `₹${inv.amount.toLocaleString('en-IN')}`;
    
    const statusEl = document.getElementById('view-inv-status');
    const statusClass = {Pending:'badge-warning',Sent:'badge-info',Paid:'badge-success'}[inv.status];
    statusEl.innerHTML = `<span class="badge ${statusClass}">${inv.status}</span>`;
    
    m.classList.add('open');
  };

  if (!modal) return;

  const backdrop = modal.querySelector('.quick-action-backdrop');
  const closeBtn = document.getElementById('view-inv-close');
  const doneBtn = document.getElementById('view-inv-done');
  const printBtn = document.getElementById('view-inv-print');

  const closeModal = () => modal.classList.remove('open');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (doneBtn) doneBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
  
  if (printBtn) printBtn.addEventListener('click', () => {
    showToast('Printing functionality is not available in demo mode', 'info');
  });
}


// ── Add Product Modal ──
function initAddProductModal() {
  const modal = document.getElementById('add-product-modal');
  if (!modal) return;
  const backdrop = modal.querySelector('.quick-action-backdrop');
  const closeBtn = document.getElementById('add-product-close');
  const cancelBtn = document.getElementById('add-product-cancel');
  const form = document.getElementById('add-product-form');

  function generateSKU() {
    const products = db.table('products').getAll();
    const maxNum = products.length === 0 ? 200 : Math.max(...products.map(p => {
      const num = parseInt(p.sku.replace('SKU-', ''), 10);
      return isNaN(num) ? 0 : num;
    }));
    return 'SKU-' + String(maxNum + 1).padStart(4, '0');
  }

  window.openAddProductModal = function() {
    modal.classList.add('open');
    form.reset();
    document.getElementById('prod-sku').value = generateSKU();
    setTimeout(() => document.getElementById('prod-name').focus(), 100);
  };

  function closeModal() { modal.classList.remove('open'); }
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('prod-name').value.trim();
    const sku = document.getElementById('prod-sku').value;
    const category = document.getElementById('prod-category').value;
    const stock = Number(document.getElementById('prod-stock').value);
    const warehouse = document.getElementById('prod-warehouse').value;
    const price = Number(document.getElementById('prod-price').value);
    const status = stock > 20 ? 'In Stock' : 'Low Stock';

    db.table('products').create({ sku, name, category, stock, warehouse, status, price });

    // Update inventory stats
    const statsTable = db.table('inventoryStats');
    const stats = statsTable.getAll()[0];
    if (stats) {
      statsTable.update(stats.id, {
        totalProducts: stats.totalProducts + 1,
        inStock: stats.inStock + (status === 'In Stock' ? 1 : 0),
        lowStockAlerts: stats.lowStockAlerts + (status === 'Low Stock' ? 1 : 0)
      });
    }

    showToast(`Product "${name}" (${sku}) added to ${warehouse}`, 'success');
    closeModal();
    if (location.hash === '#inventory' || location.hash === '#dashboard' || location.hash === '') handleRoute();
  });
}

// ── New Purchase Order Modal ──
function initNewPOModal() {
  const modal = document.getElementById('new-po-modal');
  if (!modal) return;
  const backdrop = modal.querySelector('.quick-action-backdrop');
  const closeBtn = document.getElementById('new-po-close');
  const cancelBtn = document.getElementById('new-po-cancel');
  const form = document.getElementById('new-po-form');

  function generatePONumber() {
    return 'PO-' + (1200 + Math.floor(Math.random() * 800));
  }

  window.openNewPOModal = function() {
    modal.classList.add('open');
    form.reset();
    document.getElementById('po-number').value = generatePONumber();
    // Set default delivery to 7 days from now
    const defaultDelivery = new Date();
    defaultDelivery.setDate(defaultDelivery.getDate() + 7);
    document.getElementById('po-delivery-date').value = defaultDelivery.toISOString().split('T')[0];
    setTimeout(() => document.getElementById('po-vendor').focus(), 100);
  };

  function closeModal() { modal.classList.remove('open'); }
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const poNumber = document.getElementById('po-number').value;
    const vendor = document.getElementById('po-vendor').value;
    const items = document.getElementById('po-items').value.trim();
    const amount = Number(document.getElementById('po-amount').value);
    const deliveryDate = document.getElementById('po-delivery-date').value;
    const priority = document.getElementById('po-priority').value;
    const warehouse = document.getElementById('po-warehouse').value;

    // Add to transactions as outflow
    db.table('transactions').create({
      type: 'outflow',
      title: `PO to ${vendor} — ${items}`,
      ref: poNumber,
      amount: amount,
      status: 'Pending'
    });

    // Update inventory stats (pending orders)
    const statsTable = db.table('inventoryStats');
    const stats = statsTable.getAll()[0];
    if (stats) {
      statsTable.update(stats.id, { pendingOrders: stats.pendingOrders + 1 });
    }

    const priorityLabel = priority !== 'Normal' ? ` [${priority}]` : '';
    showToast(`Purchase Order ${poNumber} created for ${vendor}${priorityLabel} — ₹${amount.toLocaleString('en-IN')}`, 'success');
    closeModal();
    if (location.hash === '#inventory' || location.hash === '#finance' || location.hash === '#dashboard' || location.hash === '') handleRoute();
  });
}

// ── Barcode Scanner Modal ──
function initScanInventoryModal() {
  const modal = document.getElementById('scan-inventory-modal');
  if (!modal) return;
  const backdrop = modal.querySelector('.quick-action-backdrop');
  const closeBtn = document.getElementById('scan-inv-close');
  const doneBtn = document.getElementById('scan-done-btn');
  const clearBtn = document.getElementById('scan-clear-btn');
  const lookupBtn = document.getElementById('scan-lookup-btn');
  const simulateBtn = document.getElementById('scan-simulate-btn');
  const barcodeInput = document.getElementById('scan-barcode-input');
  const modeButtons = modal.querySelectorAll('.scan-mode-btn');
  const manualMode = document.getElementById('scan-manual-mode');
  const cameraMode = document.getElementById('scan-camera-mode');
  const resultDiv = document.getElementById('scan-result');
  const notFoundDiv = document.getElementById('scan-not-found');

  window.openScanInventoryModal = function() {
    modal.classList.add('open');
    clearScan();
    setTimeout(() => barcodeInput.focus(), 100);
  };

  function closeModal() { modal.classList.remove('open'); }
  closeBtn.addEventListener('click', closeModal);
  doneBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  // Mode switching
  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b => { b.className = 'btn btn-secondary btn-sm scan-mode-btn'; });
      btn.className = 'btn btn-primary btn-sm scan-mode-btn active';
      const mode = btn.dataset.mode;
      manualMode.style.display = mode === 'manual' ? '' : 'none';
      cameraMode.style.display = mode === 'camera' ? '' : 'none';
    });
  });

  function clearScan() {
    barcodeInput.value = '';
    resultDiv.style.display = 'none';
    notFoundDiv.style.display = 'none';
    // Reset to manual mode
    modeButtons.forEach(b => { b.className = 'btn btn-secondary btn-sm scan-mode-btn'; });
    modeButtons[0].className = 'btn btn-primary btn-sm scan-mode-btn active';
    manualMode.style.display = '';
    cameraMode.style.display = 'none';
  }
  clearBtn.addEventListener('click', clearScan);

  function lookupProduct(sku) {
    const searchTerm = sku.trim().toUpperCase();
    if (!searchTerm) {
      showToast('Please enter a SKU or barcode', 'error');
      return;
    }

    const product = db.table('products').findOne(p => p.sku.toUpperCase() === searchTerm);
    notFoundDiv.style.display = 'none';
    resultDiv.style.display = 'none';

    if (product) {
      document.getElementById('scan-result-sku').textContent = product.sku;
      document.getElementById('scan-result-name').textContent = product.name;
      document.getElementById('scan-result-category').textContent = product.category;
      document.getElementById('scan-result-stock').textContent = product.stock + ' units';
      document.getElementById('scan-result-warehouse').textContent = product.warehouse;
      const statusClass = product.status === 'In Stock' ? 'badge-success' : 'badge-danger';
      document.getElementById('scan-result-status').innerHTML = `<span class="badge ${statusClass}">${product.status}</span>`;
      resultDiv.style.display = '';
      showToast(`Product found: ${product.name}`, 'success');
    } else {
      notFoundDiv.style.display = '';
      showToast(`No product found for SKU: ${searchTerm}`, 'error');
    }
  }

  lookupBtn.addEventListener('click', () => lookupProduct(barcodeInput.value));
  barcodeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') lookupProduct(barcodeInput.value);
  });

  // Simulate camera scan — pick a random product
  simulateBtn.addEventListener('click', () => {
    const products = db.table('products').getAll();
    if (products.length === 0) {
      showToast('No products in inventory to scan', 'error');
      return;
    }
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    showToast('Scanning...', 'info');
    setTimeout(() => {
      barcodeInput.value = randomProduct.sku;
      // Switch to manual mode to show result
      modeButtons.forEach(b => { b.className = 'btn btn-secondary btn-sm scan-mode-btn'; });
      modeButtons[0].className = 'btn btn-primary btn-sm scan-mode-btn active';
      manualMode.style.display = '';
      cameraMode.style.display = 'none';
      lookupProduct(randomProduct.sku);
    }, 1200);
  });
}

// ── Lead Management Modals ──
function initAddLeadModal() {
  const modal = document.getElementById('add-lead-modal');
  if (!modal) return;
  const backdrop = modal.querySelector('.quick-action-backdrop');
  const closeBtn = document.getElementById('add-lead-close');
  const cancelBtn = document.getElementById('add-lead-cancel');
  const form = document.getElementById('add-lead-form');

  window.openAddLeadModal = function() {
    modal.classList.add('open');
    form.reset();
  };

  const closeModal = () => modal.classList.remove('open');
  [closeBtn, cancelBtn, backdrop].forEach(el => el.addEventListener('click', closeModal));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const company = document.getElementById('lead-company').value.trim();
    const contact = document.getElementById('lead-contact').value.trim();
    const type = document.getElementById('lead-type').value;
    const value = document.getElementById('lead-value').value;
    const stage = document.getElementById('lead-stage').value;

    db.table('leads').create({
      company, contact, type,
      value: `₹${Number(value).toLocaleString('en-IN')}`,
      stage: stage
    });

    // Update CRM Stats
    const statsTable = db.table('crmStats');
    const s = statsTable.getAll()[0];
    if (s) {
      statsTable.update(s.id, { totalLeads: s.totalLeads + 1 });
    }

    showToast(`New lead added for ${company} — Value: ₹${Number(value).toLocaleString('en-IN')}`, 'success');
    closeModal();
    if (location.hash === '#crm') handleRoute();
  });
}

function initNewCampaignModal() {
  const modal = document.getElementById('new-campaign-modal');
  if (!modal) return;
  const backdrop = modal.querySelector('.quick-action-backdrop');
  const closeBtn = document.getElementById('new-campaign-close');
  const cancelBtn = document.getElementById('new-campaign-cancel');
  const form = document.getElementById('new-campaign-form');

  window.openNewCampaignModal = function() {
    modal.classList.add('open');
    form.reset();
  };

  const closeModal = () => modal.classList.remove('open');
  [closeBtn, cancelBtn, backdrop].forEach(el => el.addEventListener('click', closeModal));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('camp-name').value.trim();
    const channel = document.getElementById('camp-channel').value;
    const budget = Number(document.getElementById('camp-budget').value);
    const audience = document.getElementById('camp-audience').value.trim();

    // Log campaign launch logic
    showToast(`🚀 Campaign "${name}" launched successfully via ${channel}!`, 'success');
    
    closeModal();
  });
}


// ── Project Management Modals ──
function initNewProjectModal() {
  const modal = document.getElementById('new-project-modal');
  if (!modal) return;
  const backdrop = modal.querySelector('.quick-action-backdrop');
  const closeBtn = document.getElementById('new-project-close');
  const cancelBtn = document.getElementById('new-project-cancel');
  const form = document.getElementById('new-project-form');

  window.openNewProjectModal = function() {
    modal.classList.add('open');
    form.reset();
  };

  const closeModal = () => modal.classList.remove('open');
  [closeBtn, cancelBtn, backdrop].forEach(el => el.addEventListener('click', closeModal));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('project-name').value.trim();
    const manager = document.getElementById('project-mgr').value;
    const priority = document.getElementById('project-priority').value;
    const deadline = document.getElementById('project-deadline').value;

    // Update Project Stats
    const statsTable = db.table('projectStats');
    const s = statsTable.getAll()[0];
    if (s) {
      statsTable.update(s.id, { activeProjects: s.activeProjects + 1 });
    }

    showToast(`Project workspace "${name}" created under ${manager} (Deadline: ${deadline})`, 'success');
    closeModal();
    if (location.hash === '#projects') handleRoute();
  });
}

function initMyTasksModal() {
  const modal = document.getElementById('my-tasks-modal');
  if (!modal) return;
  const backdrop = modal.querySelector('.quick-action-backdrop');
  const closeBtn = document.getElementById('my-tasks-close');
  const doneBtn = document.getElementById('my-tasks-done');

  window.openMyTasksModal = function() {
    modal.classList.add('open');
  };

  const closeModal = () => modal.classList.remove('open');
  [closeBtn, doneBtn, backdrop].forEach(el => el.addEventListener('click', closeModal));
}

// ── Inventory Low Stock Actions ──
window.reorderLowStockItem = function(alertId) {
    const alert = db.table('lowStockAlerts').getById(alertId);
    if (!alert) {
        showToast('Error: Alert data not found', 'error');
        return;
    }

    // Find matching product in products table
    const product = db.table('products').findOne(p => p.name === alert.name);

    if (typeof window.openNewPOModal === 'function') {
        window.openNewPOModal();

        // Pre-fill the PO form with the product details after modal opens
        setTimeout(() => {
            const itemsField = document.getElementById('po-items');
            const amountField = document.getElementById('po-amount');
            const priorityField = document.getElementById('po-priority');
            const warehouseField = document.getElementById('po-warehouse');

            if (itemsField) {
                const reorderQty = alert.reorderLevel - alert.stock;
                itemsField.value = `${alert.name} x ${Math.max(reorderQty, alert.reorderLevel)} units (Restock)`;
            }
            if (amountField && product && product.price) {
                const reorderQty = Math.max(alert.reorderLevel - alert.stock, alert.reorderLevel);
                amountField.value = product.price * reorderQty;
            } else if (amountField) {
                amountField.value = alert.reorderLevel * 500; // Estimate ₹500 per unit
            }
            if (priorityField) {
                priorityField.value = alert.severity === 'critical' ? 'Urgent' : 'Normal';
            }
            if (warehouseField && product) {
                warehouseField.value = product.warehouse || 'Warehouse A';
            }
        }, 150);

        showToast(`📦 Reorder initiated for ${alert.name} — Stock: ${alert.stock}/${alert.reorderLevel}`, 'info');
    } else {
        showToast('Error: Purchase Order modal not available', 'error');
    }
};

window.watchLowStockItem = function(alertId) {
    const alertsTable = db.table('lowStockAlerts');
    const alert = alertsTable.getById(alertId);
    if (!alert) {
        showToast('Error: Alert not found', 'error');
        return;
    }

    const isCurrentlyWatched = alert.watched || false;
    alertsTable.update(alertId, { watched: !isCurrentlyWatched });

    // Update button immediately without full page re-render
    const btn = document.getElementById('watch-btn-' + alertId);
    if (btn) {
        if (!isCurrentlyWatched) {
            // Now watching
            btn.className = 'btn btn-success btn-sm';
            btn.innerHTML = '<i class="fas fa-eye" style="margin-right:4px"></i>Watching';
            btn.style.transition = 'all 0.3s ease';
        } else {
            // Stopped watching
            btn.className = 'btn btn-secondary btn-sm';
            btn.innerHTML = '<i class="fas fa-eye" style="margin-right:4px"></i>Watch';
            btn.style.transition = 'all 0.3s ease';
        }
    }

    if (!isCurrentlyWatched) {
        showToast(`👁️ Now watching "${alert.name}" — You'll be notified when stock changes`, 'success');
        
        // Add to persistent notifications list
        db.table('recentNotifications').create({
            msg: `🔍 Started watching "${alert.name}" for inventory variations`,
            time: 'Just now',
            dot: 'blue',
            detail: `Monitoring enabled for ${alert.name}.\nSystem will now track every stock change and generate alerts if levels drop further below ${alert.reorderLevel} units.`
        });

        // Simulate a stock monitoring notification after a short delay
        setTimeout(() => {
            showToast(`📊 Watch Alert: "${alert.name}" — Current stock ${alert.stock} units is ${Math.round((1 - alert.stock/alert.reorderLevel)*100)}% below reorder level`, 'info');
        }, 4000);
    } else {
        showToast(`🔕 Stopped watching "${alert.name}"`, 'info');
        
        db.table('recentNotifications').create({
            msg: `🔕 Unfollowed "${alert.name}" stock alerts`,
            time: 'Just now',
            dot: 'gray',
            detail: `Monitoring disabled for ${alert.name}. You will no longer receive proactive alerts for this item.`
        });
    }
};

// ── Global Mock Actions ──
function initGlobalActions() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (btn) {
      // Skip if this is handled by a modal or has its own handler
      if (btn.id === 'quick-action-btn' || btn.closest('.quick-action-modal')) return;
      if (btn.hasAttribute('onclick')) return;
      if (btn.tagName === 'A' && btn.hasAttribute('href')) return;
      
      const text = btn.textContent.trim();
      if (btn.id === 'btn-add-employee' || btn.id === 'btn-add-employee-table') {
        if (typeof window.openAddEmployeeModal === 'function') {
            window.openAddEmployeeModal();
            return;
        } else {
            showToast('Error: Modal not initialized', 'error');
        }
      }
      
      if (btn.id === 'btn-new-invoice') {
        if (typeof window.openNewInvoiceModal === 'function') {
            window.openNewInvoiceModal();
            return;
        } else {
            showToast('Error: Invoice modal not initialized', 'error');
        }
      }

      if (btn.id === 'btn-record-expense' || text.toLowerCase() === 'record expense') {
        if (typeof window.openRecordExpenseModal === 'function') {
            window.openRecordExpenseModal();
            return;
        } else {
            showToast('Error: Expense modal not initialized', 'error');
        }
      }

      if (btn.id === 'btn-tax-calc' || text.toLowerCase().includes('tax calculator')) {
        if (typeof window.openTaxCalculatorModal === 'function') {
            window.openTaxCalculatorModal();
            return;
        } else {
            console.error('openTaxCalculatorModal not defined');
            showToast('Error: Tax Calculator modal not initialized', 'error');
            return;
        }
      }

      // View Invoice Handler
      if (btn.classList.contains('btn-view-invoice') || text.toLowerCase() === 'view') {
        const invId = btn.dataset.id;
        if (invId && typeof window.viewInvoice === 'function') {
            window.viewInvoice(invId);
            return;
        }
        
        // Fallback for text matching if data-id is missing (older cached modules1.js)
        const row = btn.closest('tr');
        if (row) {
            const firstCell = row.querySelector('td');
            if (firstCell) {
                const invNo = firstCell.textContent.trim();
                const inv = db.table('invoices').findOne(i => i.invoiceNo === invNo);
                if (inv && typeof window.viewInvoice === 'function') {
                    window.viewInvoice(inv.id);
                    return;
                }
            }
        }
      }

      // Inventory Module Buttons
      if (btn.id === 'btn-add-product') {
        if (typeof window.openAddProductModal === 'function') {
            window.openAddProductModal();
            return;
        }
      }

      if (btn.id === 'btn-new-po') {
        if (typeof window.openNewPOModal === 'function') {
            window.openNewPOModal();
            return;
        }
      }

      if (btn.id === 'btn-scan-inventory') {
        if (typeof window.openScanInventoryModal === 'function') {
            window.openScanInventoryModal();
            return;
        }
      }

      if (btn.id === 'btn-new-lead') {
        if (typeof window.openAddLeadModal === 'function') {
            window.openAddLeadModal();
            return;
        }
      }

      if (btn.id === 'btn-new-campaign' || text.toLowerCase().includes('campaign')) {
        if (typeof window.openNewCampaignModal === 'function') {
            window.openNewCampaignModal();
            return;
        }
      }

      if (btn.id === 'btn-new-project' || text.toLowerCase().includes('new project')) {
        if (typeof window.openNewProjectModal === 'function') {
            window.openNewProjectModal();
            return;
        }
      }

      if (btn.id === 'btn-my-tasks' || text.toLowerCase().includes('my tasks')) {
        if (typeof window.openMyTasksModal === 'function') {
            window.openMyTasksModal();
            return;
        }
      }

      if (btn.id === 'btn-add-task' || text.toLowerCase() === 'add task') {
        if (typeof window.openAddTaskModal === 'function') {
            window.openAddTaskModal();
            return;
        }
      }
      
      if (btn.id === 'btn-export-hr') {
        if (typeof window.exportHRReport === 'function') {
            window.exportHRReport();
            return;
        }
      }
      
      if (btn.id === 'btn-hr-ai-insights') {
          if (typeof window.openAIPanel === 'function') {
              window.openAIPanel('Generate HR insights based on current data');
              return;
          }
      }
      
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

// ── Tab Switching ──
window.switchHRTab = function(tabId, el) {
  // Update active tab styling
  el.parentElement.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  
  // Show target content, hide others
  document.querySelectorAll('.hr-tab-content').forEach(c => c.style.display = 'none');
  const target = document.getElementById('hr-tab-' + tabId);
  if (target) target.style.display = 'block';
};

// ── Toast ──
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:10px;pointer-events:none;';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success:'check-circle', error:'times-circle', info:'info-circle', warning:'exclamation-triangle', danger:'times-circle' };
  const bgColors = { success:'rgba(34,197,94,0.15)', error:'rgba(239,68,68,0.15)', info:'rgba(99,102,241,0.15)', warning:'rgba(245,158,11,0.15)', danger:'rgba(239,68,68,0.15)' };
  const borderColors = { success:'rgba(34,197,94,0.4)', error:'rgba(239,68,68,0.4)', info:'rgba(99,102,241,0.4)', warning:'rgba(245,158,11,0.4)', danger:'rgba(239,68,68,0.4)' };
  const textColors = { success:'#22c55e', error:'#ef4444', info:'#818cf8', warning:'#f59e0b', danger:'#ef4444' };
  toast.style.cssText = `pointer-events:auto;display:flex;align-items:center;gap:10px;padding:12px 18px;background:${bgColors[type] || bgColors.info};border:1px solid ${borderColors[type] || borderColors.info};border-radius:10px;color:${textColors[type] || textColors.info};font-size:13px;font-weight:500;font-family:'Inter',sans-serif;box-shadow:0 8px 32px rgba(0,0,0,0.3);backdrop-filter:blur(12px);min-width:300px;max-width:450px;animation:slideInRight 0.3s ease;`;
  toast.innerHTML = `<i class="fas fa-${icons[type] || 'info-circle'}" style="font-size:16px;flex-shrink:0;"></i><span class="toast-message" style="flex:1;">${message}</span><span class="toast-close" onclick="this.parentElement.remove()" style="cursor:pointer;opacity:0.6;font-size:14px;"><i class="fas fa-xmark"></i></span>`;
  container.appendChild(toast);
  setTimeout(() => { if (toast.parentElement) toast.remove(); }, 4000);
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
// ── Create Deal Modal ──
function initCreateDealModal() {
  const modal = document.getElementById('create-deal-modal');
  if (!modal) return;
  const backdrop = modal.querySelector('.quick-action-backdrop');
  const closeBtn = document.getElementById('create-deal-close');
  const cancelBtn = document.getElementById('create-deal-cancel');
  const form = document.getElementById('create-deal-form');

  window.openCreateDealModal = function() {
    modal.classList.add('open');
    form.reset();
    setTimeout(() => document.getElementById('deal-name').focus(), 100);
  };

  const closeModal = () => modal.classList.remove('open');
  [closeBtn, cancelBtn, backdrop].forEach(el => el.addEventListener('click', closeModal));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('deal-name').value.trim();
    const company = document.getElementById('deal-company').value.trim();
    const value = document.getElementById('deal-value').value;
    const stage = document.getElementById('deal-stage').value;
    const probability = document.getElementById('deal-probability').value;
    const owner = document.getElementById('deal-owner').value.trim();

    // Add to CRM pipeline counts
    const pipelineTable = db.table('crmPipeline');
    const pipeStage = pipelineTable.findOne(p => p.name === stage);
    if (pipeStage) {
      pipelineTable.update(pipeStage.id, { count: pipeStage.count + 1 });
    }

    // Also track as a lead
    db.table('leads').create({
      company: company || name,
      contact: owner,
      type: 'Deal',
      value: `₹${Number(value).toLocaleString('en-IN')}`,
      stage: stage === 'Qualified' ? 'Qualified' : stage === 'Proposal' ? 'Proposal' : stage === 'Negotiation' ? 'Negotiation' : 'New'
    });

    showToast(`🤝 Deal "${name}" created for ${company} — ₹${Number(value).toLocaleString('en-IN')} (${probability}% probability)`, 'success');
    closeModal();
    if (location.hash === '#crm') handleRoute();
  });
}

// ── Support Ticket Modal ──
function initSupportTicketModal() {
  const modal = document.getElementById('support-ticket-modal');
  if (!modal) return;
  const backdrop = modal.querySelector('.quick-action-backdrop');
  const closeBtn = document.getElementById('support-ticket-close');
  const cancelBtn = document.getElementById('support-ticket-cancel');
  const form = document.getElementById('support-ticket-form');

  window.openSupportTicketModal = function() {
    modal.classList.add('open');
    form.reset();
    // Auto-generate ticket number
    const tickets = db.table('tickets').getAll();
    const maxNum = tickets.reduce((max, t) => {
      const n = parseInt(t.ticketNo.replace('#TKT-', ''));
      return n > max ? n : max;
    }, 1000);
    document.getElementById('ticket-number').value = '#TKT-' + (maxNum + 1);
    setTimeout(() => document.getElementById('ticket-customer').focus(), 100);
  };

  const closeModal = () => modal.classList.remove('open');
  [closeBtn, cancelBtn, backdrop].forEach(el => el.addEventListener('click', closeModal));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ticketNo = document.getElementById('ticket-number').value;
    const customer = document.getElementById('ticket-customer').value.trim();
    const subject = document.getElementById('ticket-subject').value.trim();
    const priority = document.getElementById('ticket-priority').value;
    const category = document.getElementById('ticket-category').value;
    const description = document.getElementById('ticket-description').value.trim();
    const assigned = document.getElementById('ticket-assigned').value;

    db.table('tickets').create({
      ticketNo,
      customer,
      subject,
      priority,
      category,
      description,
      status: 'Open',
      assigned
    });

    showToast(`🎫 Support Ticket ${ticketNo} created for ${customer} — Priority: ${priority}`, 'success');
    closeModal();
    if (location.hash === '#crm') handleRoute();
  });
}

// ── Add Task Modal ──
function initAddTaskModal() {
  const modal = document.getElementById('add-task-modal');
  if (!modal) return;
  const backdrop = modal.querySelector('.quick-action-backdrop');
  const closeBtn = document.getElementById('add-task-close');
  const cancelBtn = document.getElementById('add-task-cancel');
  const form = document.getElementById('add-task-form');

  window.openAddTaskModal = function() {
    modal.classList.add('open');
    form.reset();
    setTimeout(() => document.getElementById('task-title').focus(), 100);
  };

  const closeModal = () => modal.classList.remove('open');
  [closeBtn, cancelBtn, backdrop].forEach(el => el.addEventListener('click', closeModal));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('task-title').value.trim();
    const project = document.getElementById('task-project').value;
    const assignee = document.getElementById('task-assignee').value;
    const priority = document.getElementById('task-priority').value;
    const sprint = document.getElementById('task-sprint').value;
    const dueDate = document.getElementById('task-due').value;

    // Add to Kanban backlog
    const kanbanTable = db.table('kanban');
    const kanbanData = kanbanTable.getAll()[0];
    if (kanbanData) {
      const tagColorMap = { High: 'danger', Medium: 'warning', Low: 'info' };
      const initials = assignee.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      kanbanData.backlog.push({
        id: Date.now(),
        title: title,
        tag: priority,
        tagColor: tagColorMap[priority] || 'info',
        assignees: [initials || 'AK']
      });
      kanbanTable.update(kanbanData.id, { backlog: kanbanData.backlog });
    }

    // Update project stats
    const statsTable = db.table('projectStats');
    const s = statsTable.getAll()[0];
    if (s) {
      statsTable.update(s.id, { inProgress: s.inProgress + 1 });
    }

    showToast(`📋 Task "${title}" added to ${sprint} backlog — ${priority} priority, assigned to ${assignee}`, 'success');
    closeModal();
    if (location.hash === '#projects') handleRoute();
  });
}

// ── Stat Detail Logic ──
window.viewStatDetail = function(category, label) {
    const modal = document.getElementById('stat-detail-modal');
    if (!modal) return;

    const nameEl = document.getElementById('sd-name');
    const categoryEl = document.getElementById('sd-category');
    const metaEl = document.getElementById('sd-meta');
    const listEl = document.getElementById('sd-list');

    nameEl.textContent = label;
    categoryEl.textContent = category.toUpperCase();

    // Logic to pull data based on label
    if (category === 'Security Feature' || category === 'Audit Log' || category === 'Security' || category === 'Projects' || category === 'E-Commerce' || category === 'Communication' || category === 'DevOps' || category === 'Order' || category === 'Channel' || category === 'Announcement') {
        metaEl.textContent = `Real-time analytical data for ${label}.`;
        const categoryLabel = (category === 'Security' || category === 'Projects' || category === 'E-Commerce') ? (category === 'Security' ? 'PLATFORM SECURITY' : categoryLabel === 'E-Commerce' ? 'E-COMMERCE INTELLIGENCE' : 'PROJECT INTELLIGENCE') : category.toUpperCase();
        document.getElementById('sd-category').textContent = categoryLabel;
        document.getElementById('sd-icon').className = 'quick-action-icon';
        
        let iconClass = 'fa-chart-line';
        if (category === 'Projects') iconClass = 'fa-diagram-project';
        else if (category === 'E-Commerce') iconClass = 'fa-cart-shopping';
        else if (category === 'Communication') iconClass = 'fa-comments';
        else if (category === 'DevOps') iconClass = 'fa-server';
        
        document.getElementById('sd-icon').innerHTML = `<i class="fas ${iconClass}"></i>`;
        document.getElementById('sd-icon').style.background = 'var(--accent-gradient)';

        let recordsHTML = '';
        if (category === 'Projects') {
            if (label.includes('Active')) {
                const projects = db.table('projectTimeline').getAll();
                recordsHTML = projects.map(p => `<div class="list-item"><div class="list-icon blue"><i class="fas fa-folder"></i></div><div class="list-content"><div class="list-title">${p.name}</div><div class="list-subtitle">${p.progress}% Complete</div></div></div>`).join('');
            } else {
                const tasks = db.table('kanban').getAll()[0]?.inProgress || [];
                recordsHTML = tasks.slice(0, 5).map(t => `<div class="list-item"><div class="list-icon purple"><i class="fas fa-list-check"></i></div><div class="list-content"><div class="list-title">${t.title}</div><div class="list-subtitle">Priority: ${t.tag}</div></div></div>`).join('');
            }
        } else if (category === 'Audit Log') {
            const logs = db.table('auditLogs').getAll().slice(0, 5);
            recordsHTML = logs.map(l => `<div class="activity-item"><div class="activity-dot ${l.dot}"></div><div class="activity-text"><strong>${l.action}:</strong> ${l.detail}</div></div>`).join('');
        } else if (category === 'E-Commerce' || category === 'Order') {
            const orders = db.table('ecomOrders').getAll();
            if (category === 'Order') {
                const o = orders.find(ord => ord.orderId === label);
                if (o) {
                    const statusColor = o.status==='Delivered'?'var(--success)':o.status==='Shipped'?'var(--info)':o.status==='Cancelled'?'var(--danger)':'var(--warning)';
                    recordsHTML = `
                        <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-color); border-radius:12px; padding:18px; margin-bottom:16px;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:12px; font-size:13px;">
                                <span style="color:var(--text-muted)">Customer:</span>
                                <span style="font-weight:600">${o.customer}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; margin-bottom:12px; font-size:13px;">
                                <span style="color:var(--text-muted)">Order Date:</span>
                                <span style="font-weight:600">${o.date || 'May 28, 2026'}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; margin-bottom:12px; font-size:13px;">
                                <span style="color:var(--text-muted)">Platform:</span>
                                <span style="font-weight:600"><i class="${o.platformIcon}"></i> ${o.platform}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center; font-size:13px;">
                                <span style="color:var(--text-muted)">Current Status:</span>
                                <div style="display:flex; align-items:center; gap:10px;">
                                    <span style="font-weight:700; color:${statusColor}">${o.status}</span>
                                    <button onclick="window.updateStatus('${o.orderId}','${o.status}')" style="background:rgba(99,102,241,0.15); border:none; color:var(--accent-light); padding:4px 10px; border-radius:6px; font-size:11px; cursor:pointer; font-weight:600; transition:background 0.2s;" onmouseover="this.style.background='rgba(99,102,241,0.3)'" onmouseout="this.style.background='rgba(99,102,241,0.15)'"><i class="fas fa-pen" style="margin-right:4px"></i>Change</button>
                                </div>
                            </div>
                        </div>
                        <div style="font-size:12px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">Order Items</div>
                        <table style="width:100%; border-collapse:collapse; font-size:13px;">
                            <thead style="border-bottom:1px solid var(--border-color); color:var(--text-muted)">
                                <tr><th style="text-align:left; padding:8px 0;">Item</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Subtotal</th></tr>
                            </thead>
                            <tbody>
                                ${(o.items||[]).length ? (o.items||[]).map(it => `<tr><td style="padding:10px 0;">${it.name}</td><td style="text-align:center;">${it.qty}</td><td style="text-align:right;">₹${(it.qty * it.price).toLocaleString()}</td></tr>`).join('') : '<tr><td colspan="3" style="padding:12px 0; text-align:center; color:var(--text-muted)">No items added yet</td></tr>'}
                            </tbody>
                            <tfoot style="border-top:1px solid var(--border-color); font-weight:700;">
                                <tr><td colspan="2" style="padding:10px 0; color:var(--text-muted); font-weight:400">GST (18%):</td><td style="text-align:right;">${o.tax || '₹0'}</td></tr>
                                <tr><td colspan="2" style="padding:5px 0; font-size:15px;">Total Amount:</td><td style="text-align:right; font-size:15px; color:var(--success);">${o.total || o.amount}</td></tr>
                            </tfoot>
                        </table>
                    `;
                }
            } else {
                recordsHTML = orders.map(o => {
                    const sc = o.status==='Delivered'?'success':o.status==='Shipped'?'info':o.status==='Cancelled'?'danger':'warning';
                    return `<div class="list-item" onclick="window.viewStatDetail('Order','${o.orderId}')" style="cursor:pointer"><div class="list-icon green"><i class="fas fa-box"></i></div><div class="list-content"><div class="list-title">${o.orderId} — ${o.customer}</div><div class="list-subtitle">${o.platform} · ${o.amount}</div></div><span class="badge badge-${sc}">${o.status}</span></div>`;
                }).join('');
            }
        } else if (category === 'Communication' || category === 'Channel' || category === 'Announcement') {
            if (label === 'Company Announcements' || category === 'Announcement') {
                const anns = db.table('announcements').getAll().slice(0, 5);
                recordsHTML = anns.map(a => `
                    <div class="list-item">
                        <div class="list-icon purple"><i class="fas fa-bullhorn"></i></div>
                        <div class="list-content">
                            <div class="list-title">${a.title}</div>
                            <div class="list-subtitle">${a.detail} · ${a.postedBy}</div>
                        </div>
                        <span class="badge badge-info" style="font-size:10px">${a.time}</span>
                    </div>`).join('');
            } else {
                const channels = db.table('commChannels').getAll();
                recordsHTML = channels.map(c => `
                    <div class="list-item" onclick="window.openChannel('${c.name}', ${c.id})" style="cursor:pointer">
                        <div class="list-icon blue"><i class="fas fa-hashtag"></i></div>
                        <div class="list-content">
                            <div class="list-title">${c.name}</div>
                            <div class="list-subtitle">${c.desc} · ${c.members} members</div>
                        </div>
                        ${c.unread ? `<span class="nav-count" style="margin-left:auto">${c.unread}</span>` : '<span class="badge badge-success" style="font-size:10px;margin-left:auto">Read</span>'}
                    </div>`).join('');
            }
        }

        listEl.innerHTML = `
            <div style="padding: 16px; background: rgba(99,102,241,0.05); border-radius: 12px; border: 1px solid rgba(99,102,241,0.2); margin-top: 10px; cursor:default; margin-bottom: 20px;">
                <div style="display:flex; align-items:center; gap:12px; width: 100%;">
                    <div style="width:10px; height:10px; border-radius:50%; background:var(--accent); position:relative;">
                        <span style="position:absolute; width:100%; height:100%; background:var(--accent); border-radius:50%; animation: pulse 2s infinite; opacity:0.5;"></span>
                    </div>
                    <div style="flex:1">
                        <div style="font-weight:600; font-size:16px; color: #fff; margin-bottom: 2px;">System Analytics</div>
                        <div style="font-size:13px; color:var(--text-muted)">Detailed reporting currently being calculated...</div>
                    </div>
                    <span class="badge" onclick="showToast('Refreshing real-time ${label} telemetry...', 'info')" style="font-size:12px; font-weight:700; color:var(--purple); text-transform:uppercase; letter-spacing:0.5px; cursor:pointer; background:rgba(168,85,247,0.1); padding:4px 8px; border-radius:4px; transition: all 0.2s;" onmouseover="this.style.background='rgba(168,85,247,0.2)'" onmouseout="this.style.background='rgba(168,85,247,0.1)'">LIVE</span>
                </div>
            </div>
            <div style="margin-bottom:12px; font-size:12px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; padding-left: 4px;">Detailed Records</div>
            <div class="records-list">${recordsHTML || `<div style="padding:20px; text-align:center; color:var(--text-muted); font-size:13px;">No direct records linked to ${label}. Review module dashboards for full history.</div>`}</div>
            <div style="margin-top:20px; padding: 15px; border-radius: 10px; background: rgba(255,255,255,0.02); border: 1px dashed var(--border-color); text-align:center; font-size:13px; color:var(--text-muted)">
                <i class="fas fa-spinner fa-spin" style="margin-right:8px"></i> Synthesizing historical patterns for ${label}...
            </div>
        `;
        modal.classList.add('open');
        return;
    }

    let items = [];
    let icon = 'fa-chart-line';
    let color = 'var(--accent)';

    if (label.includes('Employees')) {
        const emp = db.table('employees').getAll().slice(0, 5);
        items = emp.map(e => ({ title: e.name, subtitle: e.role, meta: e.department, dot: 'green' }));
        metaEl.textContent = `Recent additions to the workforce across all departments.`;
        icon = 'fa-users'; color = 'var(--success)';
    } else if (label.includes('Invoices') || label.includes('Profit') || label.includes('Revenue')) {
        const inv = db.table('invoices').getAll().slice(0, 5);
        items = inv.map(i => ({ title: i.client, subtitle: i.status, meta: `₹${i.amount.toLocaleString()}`, dot: i.status === 'Paid' ? 'green' : 'yellow' }));
        metaEl.textContent = `Latest financial transactions and invoice statuses.`;
        icon = 'fa-file-invoice-dollar'; color = 'var(--info)';
    } else if (label.includes('Stock') || label.includes('Product')) {
        const prod = db.table('products').getAll().filter(p => p.stock < 20).slice(0, 5);
        items = prod.map(p => ({ title: p.name, subtitle: `${p.stock} units in stock`, meta: `SKU: ${p.sku}`, dot: 'red' }));
        metaEl.textContent = `Critical stock levels and inventory alerts requiring attention.`;
        icon = 'fa-boxes-stacked'; color = 'var(--danger)';
    } else if (label.includes('Project') || label.includes('Task')) {
        const projects = db.table('kanban').getAll()[0]?.columns.flatMap(c => c.tasks).slice(0, 5) || [];
        items = projects.map(t => ({ title: t.title, subtitle: t.priority, meta: 'In Progress', dot: 'purple' }));
        metaEl.textContent = `Active project milestones and task progress logs.`;
        icon = 'fa-list-check'; color = 'var(--purple)';
    } else if (label.includes('Leads')) {
        const leads = db.table('leads').getAll();
        const stageDotMap = { New: 'cyan', Qualified: 'blue', Proposal: 'yellow', Negotiation: 'purple', Won: 'green' };
        // Show up to 15 recent and important leads to represent the 284 total
        items = leads.slice(0, 15).map(l => ({ 
            title: l.company, 
            subtitle: l.type, 
            meta: l.value, 
            dot: stageDotMap[l.stage] || 'blue' 
        }));
        metaEl.textContent = `Displaying key opportunities from your ${leads.length} total leads. Use the CRM module for full list management.`;
        icon = 'fa-handshake'; color = 'var(--cyan)';
    } else if (category === 'Projects') {
        const pStats = db.table('projectStats').getAll()[0];
        const kanban = db.table('kanban').getAll()[0] || {};
        metaEl.textContent = `Detailed breakdown of your ${label.toLowerCase()} across all active workstreams.`;
        icon = 'fa-diagram-project'; color = 'var(--accent)';
        
        if (label.includes('Active')) {
            const timeline = db.table('projectTimeline').getAll();
            items = timeline.map(t => ({ 
                title: t.name, subtitle: `${t.progress}% complete`, meta: 'In Progress', dot: 'purple',
                actions: `<button class="btn btn-primary btn-sm" onclick="showToast('Loading ${t.name} timeline...','info')">Manage</button>`
            }));
        } else if (label.includes('Completed')) {
            const tasks = kanban.done || [];
            items = tasks.map(t => ({ 
                title: t.title, subtitle: t.tag, meta: 'Completed', dot: 'green',
                actions: `<button class="btn btn-secondary btn-sm" onclick="showToast('Opening files for ${t.title}','info')"><i class="fas fa-file"></i> View Files</button>`
            }));
        } else if (label.includes('In Progress')) {
            const tasks = kanban.inProgress || [];
            items = tasks.map(t => ({ 
                title: t.title, subtitle: t.tag, meta: 'Active', dot: 'yellow',
                actions: `<button class="btn btn-primary btn-sm" onclick="window.viewTicket('t-${t.id}')">Update</button>`
            }));
        } else {
            const tasks = kanban.backlog || [];
            items = tasks.map(t => ({ 
                title: t.title, subtitle: t.tag, meta: 'High Priority', dot: 'red',
                actions: `<button class="btn btn-danger btn-sm" onclick="showToast('Escalating ${t.title} to manager','warning')">Escalate</button>`
            }));
        }
    } else {
        items = [{ title: 'System Analytics', subtitle: 'Detailed reporting currently being calculated...', meta: 'Live', dot: 'blue' }];
        metaEl.textContent = `Real-time analytical data for ${label}.`;
    }

    document.getElementById('sd-icon').style.background = color;
    document.getElementById('sd-icon').innerHTML = `<i class="fas ${icon}"></i>`;

    listEl.innerHTML = items.map(item => `
        <div class="activity-item" style="border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 12px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; gap: 12px; flex: 1;">
                <div class="activity-dot ${item.dot}"></div>
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div class="activity-text" style="font-weight: 600;">${item.title}</div>
                        <div style="font-size: 11px; font-weight: 700; color: var(--accent-light);">${item.meta}</div>
                    </div>
                    <div class="activity-time" style="font-size: 12px;">${item.subtitle}</div>
                </div>
            </div>
            ${item.actions ? `<div style="margin-left: 16px;">${item.actions}</div>` : ''}
        </div>
    `).join('');

    modal.classList.add('open');
};

function initStatDetailModal() {
    const modal = document.getElementById('stat-detail-modal');
    if (!modal) return;
    
    const closeBtns = [
        document.getElementById('sd-close'),
        document.getElementById('sd-close-btn')
    ];

    closeBtns.forEach(btn => {
        if (btn) btn.onclick = () => modal.classList.remove('open');
    });

    const backdrop = modal.querySelector('.quick-action-backdrop');
    if (backdrop) backdrop.onclick = () => modal.classList.remove('open');
}

// ── Support Ticket CRUD ──
window.viewTicket = function(id) {
    const ticket = db.table('tickets').findOne(t => t.id === id);
    if (!ticket) return;
    
    // Reuse stat modal for quick view
    window.viewStatDetail('Support', `Ticket ${ticket.ticketNo}`);
    const listEl = document.getElementById('sd-list');
    listEl.innerHTML = `
        <div style="padding: 10px; border-radius: 8px; background: rgba(255,255,255,0.03);">
            <div style="margin-bottom: 12px;"><strong style="color:var(--accent-light)">Customer:</strong> ${ticket.customer}</div>
            <div style="margin-bottom: 12px;"><strong style="color:var(--accent-light)">Subject:</strong> ${ticket.subject}</div>
            <div style="margin-bottom: 12px;"><strong style="color:var(--accent-light)">Priority:</strong> <span class="badge ${ticket.priority==='High'?'badge-danger':'badge-info'}">${ticket.priority}</span></div>
            <div style="margin-bottom: 12px;"><strong style="color:var(--accent-light)">Status:</strong> <span class="badge badge-warning">${ticket.status}</span></div>
            <div><strong style="color:var(--accent-light)">Assigned To:</strong> ${ticket.assigned}</div>
        </div>
    `;
    document.getElementById('sd-meta').textContent = "Detailed ticket view with customer context and priority flags.";
};

window.editTicket = function(id) {
    const ticket = db.table('tickets').findOne(t => t.id === id);
    if (!ticket) return;
    
    const newSubject = prompt("Edit Ticket Subject:", ticket.subject);
    if (newSubject) {
        db.table('tickets').update(id, { subject: newSubject });
        showToast(`Ticket ${ticket.ticketNo} updated`, 'success');
        refreshPage();
    }
};

window.deleteTicket = function(id) {
    const ticket = db.table('tickets').findOne(t => t.id === id);
    if (confirm(`Are you sure you want to delete ticket ${ticket?.ticketNo || ''}?`)) {
        db.table('tickets').delete(id);
        showToast("Ticket deleted successfully", "info");
        refreshPage();
    }
};

window.onDragLead = function(e, id) {
    e.dataTransfer.setData('text/plain', id);
    e.target.style.opacity = '0.4';
};

window.onDropLead = function(e, stageName) {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData('text/plain'));
    const lead = db.table('leads').findOne(l => l.id === id);
    
    if (lead && lead.stage !== stageName) {
        db.table('leads').update(id, { stage: stageName });
        showToast(`Lead moved to ${stageName}`, 'success');
        refreshPage();
    }
};

window.editLead = function(id) {
    const lead = db.table('leads').findOne(l => l.id === id);
    if (!lead) return;
    
    document.getElementById('edit-lead-id').value = lead.id;
    document.getElementById('edit-lead-company').value = lead.company;
    document.getElementById('edit-lead-type').value = lead.type;
    document.getElementById('edit-lead-value').value = lead.value;
    document.getElementById('edit-lead-stage').value = lead.stage;
    
    const modal = document.getElementById('edit-lead-modal');
    modal.classList.add('open');
};

window.editProject = function(id) {
    const project = db.table('projects').findOne(p => p.id === id);
    if (!project) return;
    
    document.getElementById('edit-project-id').value = project.id;
    document.getElementById('edit-project-title').value = project.title;
    document.getElementById('edit-project-tag').value = project.tag;
    document.getElementById('edit-project-color').value = project.tagColor;
    document.getElementById('edit-project-status').value = project.status;
    
    const modal = document.getElementById('edit-project-modal');
    modal.classList.add('open');
};

function initEditProjectModal() {
    const btnSave = document.getElementById('btn-save-project');
    if (!btnSave) return;
    
    btnSave.onclick = function() {
        const id = parseInt(document.getElementById('edit-project-id').value);
        const title = document.getElementById('edit-project-title').value;
        const tag = document.getElementById('edit-project-tag').value;
        const tagColor = document.getElementById('edit-project-color').value;
        const status = document.getElementById('edit-project-status').value;
        
        if (!title || !tag) {
            showToast('All fields are required', 'danger');
            return;
        }
        
        try {
            db.table('projects').update(id, { title, tag, tagColor, status });
            showToast('Project updated successfully', 'success');
            document.getElementById('edit-project-modal').classList.remove('open');
            refreshPage();
        } catch (err) {
            showToast('Update failed: ' + err.message, 'danger');
        }
    };
}

function initEditLeadModal() {
    const btnSave = document.getElementById('btn-save-lead');
    if (!btnSave) return;
    
    btnSave.onclick = function() {
        const id = parseInt(document.getElementById('edit-lead-id').value);
        const company = document.getElementById('edit-lead-company').value;
        const type = document.getElementById('edit-lead-type').value;
        const value = document.getElementById('edit-lead-value').value;
        const stage = document.getElementById('edit-lead-stage').value;
        
        if (!company || !type || !value) {
            showToast('All fields are required', 'danger');
            return;
        }
        
        try {
            db.table('leads').update(id, { company, type, value, stage });
            showToast('Lead updated successfully', 'success');
            document.getElementById('edit-lead-modal').classList.remove('open');
            refreshPage();
        } catch (err) {
            showToast('Update failed: ' + err.message, 'danger');
        }
    };
}

// ── HR Operations ──
window.markAttendance = function() {
    showToast('Marking attendance for all employees...', 'info');
    setTimeout(() => {
        showToast('Attendance records updated successfully', 'success');
        refreshPage();
    }, 1000);
};

window.applyLeave = function() {
    const type = prompt("Leave Type (Sick, Casual, Annual):", "Annual Leave");
    if (type) {
        showToast(`Leave application for '${type}' submitted`, 'success');
        refreshPage();
    }
};

window.approveLeave = function(id) {
    db.table('leaves').update(parseInt(id), { status: 'Approved' });
    showToast('Leave request approved', 'success');
    refreshPage();
};

window.rejectLeave = function(id) {
    db.table('leaves').update(parseInt(id), { status: 'Rejected' });
    showToast('Leave request rejected', 'warning');
    closeModal();
};

window.updateStatus = function(orderId, currentStatus) {
    const modal = document.getElementById('order-status-modal');
    if (!modal) return;

    document.getElementById('os-title').textContent = `Update ${orderId}`;
    document.getElementById('os-current').innerHTML = `Current status: <strong style="color:var(--accent-light)">${currentStatus}</strong>`;

    const statuses = [
        { value: 'Processing', icon: 'fa-clock', color: 'var(--warning)', bg: '245,158,11' },
        { value: 'Shipped',    icon: 'fa-truck',  color: 'var(--info)',    bg: '59,130,246' },
        { value: 'Delivered',  icon: 'fa-check-circle', color: 'var(--success)', bg: '34,197,94' },
        { value: 'Cancelled',  icon: 'fa-ban',    color: 'var(--danger)',  bg: '239,68,68' },
        { value: 'Returned',   icon: 'fa-rotate-left', color: 'var(--purple)', bg: '168,85,247' }
    ];

    const optionsEl = document.getElementById('os-options');
    optionsEl.innerHTML = statuses.map(s => {
        const inputId = `status-${s.value}`;
        const isCurrent = s.value === currentStatus;
        const rgbaBg = `rgba(${s.bg}, 0.08)`;
        const border = isCurrent ? s.color : 'var(--border-color)';
        const currentBg = isCurrent ? rgbaBg : 'transparent';
        
        return `
        <label for="${inputId}" class="status-option" data-status="${s.value}" style="display:flex; align-items:center; gap:12px; padding:12px 16px; border-radius:10px; border:1px solid ${border}; background:${currentBg}; cursor:pointer; transition:all 0.2s;" 
            onclick="window.updateSelectionVisuals(this, '${s.color}', '${rgbaBg}')">
            <input type="radio" id="${inputId}" name="order-status" value="${s.value}" ${isCurrent ? 'checked' : ''} style="accent-color:${s.color}; width:16px; height:16px; margin:0; pointer-events: none;">
            <i class="fas ${s.icon}" style="color:${s.color}; font-size:16px; width:20px; text-align:center;"></i>
            <span style="font-weight:600; font-size:14px; color:var(--text-primary)">${s.value}</span>
            ${isCurrent ? '<span class="badge badge-info" style="margin-left:auto; font-size:10px;">Current</span>' : ''}
        </label>`;
    }).join('');

    // helper for selection visuals
    window.updateSelectionVisuals = function(el, color, bg) {
        document.querySelectorAll('.status-option').forEach(opt => {
            opt.style.background = 'transparent';
            opt.style.borderColor = 'var(--border-color)';
        });
        el.style.background = bg;
        el.style.borderColor = color;
        // manually check the native radio since it's pointer-events: none
        el.querySelector('input').checked = true;
    };

    // Wire up confirm button
    const confirmBtn = document.getElementById('os-confirm-btn');
    confirmBtn.style.cursor = 'pointer';
    confirmBtn.style.transition = 'all 0.2s ease';
    confirmBtn.onmouseover = () => confirmBtn.style.transform = 'scale(1.02)';
    confirmBtn.onmouseout = () => confirmBtn.style.transform = 'scale(1)';

    confirmBtn.onclick = function() {
        const selected = document.querySelector('input[name="order-status"]:checked');
        if (!selected) {
            showToast('Please select a status', 'warning');
            return;
        }
        const newStatus = selected.value;
        const ordersTable = db.table('ecomOrders');
        const order = ordersTable.getAll().find(o => o.orderId === orderId);
        if (order) {
            ordersTable.update(order.id, { status: newStatus });
            showToast(`✅ Order ${orderId} updated to ${newStatus}`, 'success');
            modal.classList.remove('open');
            if (location.hash === '#ecommerce') handleRoute();
        }
    };

    modal.classList.add('open');
};

window.showNewOrderModal = function() {
    const modal = document.getElementById('new-order-modal');
    if (!modal) return;

    // Reset fields
    document.getElementById('no-customer').value = '';
    document.getElementById('no-platform').value = 'Shopify';
    document.getElementById('no-amount').value = '';
    document.getElementById('no-status').value = 'Processing';

    // Wire up submit button
    const submitBtn = document.getElementById('no-submit-btn');
    const newSubmit = submitBtn.cloneNode(true);
    submitBtn.parentNode.replaceChild(newSubmit, submitBtn);
    newSubmit.addEventListener('click', function() {
        const customer = document.getElementById('no-customer').value.trim();
        if (!customer) {
            showToast('Please enter a customer name', 'warning');
            return;
        }
        const platform = document.getElementById('no-platform').value;
        const amount = parseInt(document.getElementById('no-amount').value) || 0;
        const status = document.getElementById('no-status').value;

        const newId = '#ORD-' + (4522 + Math.floor(Math.random() * 1000));
        const iconMap = { Shopify:'fab fa-shopify', WooCommerce:'fab fa-wordpress', Amazon:'fab fa-amazon' };
        const badgeMap = { Shopify:'badge-success', WooCommerce:'badge-purple', Amazon:'badge-warning' };

        db.table('ecomOrders').create({
            orderId: newId,
            platform: platform,
            platformIcon: iconMap[platform] || 'fab fa-shopify',
            platformBadge: badgeMap[platform] || 'badge-success',
            customer: customer,
            amount: '₹' + amount.toLocaleString(),
            status: status,
            date: new Date().toLocaleDateString('en-IN', { month:'short', day:'numeric', year:'numeric' }),
            items: [],
            tax: '₹0',
            total: '₹' + amount.toLocaleString()
        });

        showToast(`📦 Order ${newId} created for ${customer} on ${platform}`, 'success');
        modal.classList.remove('open');
        if (location.hash === '#ecommerce') handleRoute();
    });

    modal.classList.add('open');
};

window.runPayroll = function() {
    showToast('Calculating salaries and taxes...', 'info');
    setTimeout(() => {
        showToast('Payroll processed for May 2026', 'success');
        refreshPage();
    }, 1500);
};

window.newReview = function() {
    prompt("Employee Name for Performance Review:");
    showToast('Performance review cycle initiated', 'info');
};

// ── HR Event Listeners ──
function initHRButtons() {
    const addBtn = document.getElementById('btn-add-employee');
    const tableAddBtn = document.getElementById('btn-add-employee-table');
    const exportBtn = document.getElementById('btn-export-hr');
    const aiBtn = document.getElementById('btn-hr-ai-insights');
    const searchInput = document.getElementById('hr-employee-search');

    const addNewEmployee = () => {
        const name = prompt("New Employee Full Name:");
        if (name) {
            db.table('employees').create({ 
                name, 
                department: 'Engineering', 
                role: 'Junior Associate', 
                status: 'Active', 
                joinDate: 'May 2026',
                initials: name.split(' ').map(n=>n[0]).join('')
            });
            showToast(`Employee ${name} added successfully`, 'success');
            refreshPage();
        }
    };

    if (addBtn) addBtn.onclick = addNewEmployee;
    if (tableAddBtn) tableAddBtn.onclick = addNewEmployee;

    if (exportBtn) exportBtn.onclick = () => {
        showToast('Preparing HR report for download...', 'info');
        setTimeout(() => showToast('HR_Global_Report_2026.csv exported', 'success'), 1200);
    };

    if (aiBtn) aiBtn.onclick = () => {
        showToast('Analyzing workforce trends with AI...', 'info');
        setTimeout(() => {
            window.viewStatDetail('AI-HR', 'Workforce Predicted Growth: +12% for Q3');
            document.getElementById('sd-meta').textContent = "AI analysis suggests expanding the Engineering team by 5-8 members to meet project demand.";
        }, 1000);
    };

    if (searchInput) {
        searchInput.oninput = (e) => {
            const query = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#hr-employee-table tbody tr');
            rows.forEach(row => {
                const text = row.innerText.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });
        };
    }
}

// ── Open Channel (clears unread badge) ──
window.openChannel = function(channelName, channelId) {
    // Clear the unread count in the database
    const channelsTable = db.table('commChannels');
    const channel = channelsTable.getAll().find(c => c.name === channelName || c.id === channelId);
    if (channel && channel.unread > 0) {
        channelsTable.update(channel.id, { unread: 0 });
        showToast(`✅ ${channelName} — ${channel.unread} messages marked as read`, 'success');
    } else {
        showToast(`💬 Opening ${channelName}...`, 'info');
    }

    // Close any open detail modal
    const detailModal = document.getElementById('stat-detail-modal');
    if (detailModal) detailModal.classList.remove('open');

    // Re-render the Communication page if we're on it
    if (location.hash === '#communication') {
        handleRoute();
    }
};

// ── AI Command Center Actions ──
window.showNewChannelModal = function() {
    const name = prompt("Enter New Channel Name (e.g. marketing):");
    if (!name) return;
    const desc = prompt("Enter Channel Description:", "General discussion");
    
    db.table('commChannels').create({
        name: `#${name.replace('#','')}`,
        desc: desc,
        members: '1',
        iconBg: 'rgba(59,130,246,0.12)',
        iconColor: 'var(--info)'
    });
    
    showToast(`🚀 Channel #${name} created successfully!`, 'success');
    if (location.hash === '#communication') handleRoute();
};

window.runAnalysis = function() {
    // Prevent multiple clicks
    const btn = document.getElementById('btn-run-ai-page');
    if (btn) btn.disabled = true;

    showToast('🚀 Initializing Deep AI Data Scan...', 'info');
    setTimeout(() => showToast('📊 Processing multi-module correlation...', 'info'), 1000);
    setTimeout(() => {
        if (btn) btn.disabled = false;
        showToast('✨ Analysis Complete! Opening Insights...', 'success');
        window.viewStatDetail('AI-ANALYSIS', 'Deep Business Intelligence Report');
        const listEl = document.getElementById('sd-list');
        listEl.innerHTML = `
            <div style="padding:15px; background:rgba(99,102,241,0.05); border-radius:12px; border:1px solid rgba(99,102,241,0.2)">
                <div style="margin-bottom:15px"><strong style="color:var(--purple)">Demand Forecast:</strong> Q3 orders expected to rise by <span class="badge badge-success">14.2%</span> based on seasonal trends.</div>
                <div style="margin-bottom:15px"><strong style="color:var(--purple)">Anomaly Alert:</strong> 3 unusual patterns detected in Inventory/Procurement. Review Purchase Order PO-1245.</div>
                <div style="margin-bottom:15px"><strong style="color:var(--purple)">Resource Optimization:</strong> Engineering team utilization is at 92%. Recommendation: Hire 2 Frontend developers.</div>
                <div><strong style="color:var(--purple)">Cashflow Prediction:</strong> Positive net cashflow of ₹42.5L projected for next month.</div>
            </div>
        `;
        document.getElementById('sd-meta').textContent = "Real-time AI analysis synthesized from HR, Finance, and Inventory data streams.";
    }, 2500);
};

// Wrap refreshPage to include HR button init
const originalRefreshPage = window.refreshPage;
window.refreshPage = function() {
    if (originalRefreshPage) originalRefreshPage();
    setTimeout(initHRButtons, 100);
};

// ── Channel Detail Modal ──
window.viewChannel = function(id) {
    const channel = db.table('notificationChannels').getById(id);
    if (!channel) return;

    const modal = document.getElementById('channel-detail-modal');
    if (!modal) return;

    document.getElementById('channel-name').textContent = channel.name;
    document.getElementById('channel-provider').textContent = channel.provider;
    document.getElementById('channel-icon').style.background = channel.iconBg || 'var(--accent-gradient)';
    document.getElementById('channel-icon').innerHTML = `<i class="${channel.icon.startsWith('fab')?channel.icon:'fas '+channel.icon}"></i>`;
    document.getElementById('channel-uptime').textContent = channel.delivery ? '99.9%' : '100%';

    // Scale history filtering based on channel name
    const type = channel.name.toLowerCase();
    const history = db.table('recentNotifications').getAll().filter(n => {
        const msg = n.msg.toLowerCase();
        if (type.includes('email') && msg.includes('email')) return true;
        if (type.includes('sms') && msg.includes('sms')) return true;
        if (type.includes('whatsapp') && msg.includes('whatsapp')) return true;
        if (type.includes('webhook') && msg.includes('webhook')) return true;
        if (type.includes('slack') && msg.includes('slack')) return true;
        return false;
    });

    const historyEl = document.getElementById('channel-history');
    if (history.length > 0) {
        historyEl.innerHTML = history.map(h => `
            <div class="activity-item" onclick="window.viewNotification('${h.id}')" style="cursor:pointer; border-bottom: 1px solid rgba(255,255,255,0.03); padding-bottom: 8px; transition: background 0.2s; border-radius: 6px;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
                <div class="activity-dot ${h.dot}"></div>
                <div>
                    <div class="activity-text" style="font-size: 12px; font-weight: 500;">${h.msg}</div>
                    <div class="activity-time">${h.time}</div>
                </div>
            </div>
        `).join('');
    } else {
        historyEl.innerHTML = '<div style="text-align:center; padding: 20px; color: var(--text-muted); font-size: 13px;">No recent activity logs for this gateway.</div>';
    }

    modal.classList.add('open');
};

function initChannelModal() {
    const modal = document.getElementById('channel-detail-modal');
    if (!modal) return;
    
    const closeBtns = [
        document.getElementById('channel-close'),
        document.getElementById('channel-close-btn')
    ];

    closeBtns.forEach(btn => {
        if (btn) btn.onclick = () => modal.classList.remove('open');
    });

    const backdrop = modal.querySelector('.quick-action-backdrop');
    if (backdrop) backdrop.onclick = () => modal.classList.remove('open');
}

// ── Notification Detail Modal ──
window.viewNotification = function(id) {
    const notif = db.table('recentNotifications').getById(id);
    if (!notif) {
        showToast('Notification not found', 'error');
        return;
    }

    const modal = document.getElementById('notification-detail-modal');
    const title = document.getElementById('notif-title');
    const meta = document.getElementById('notif-meta');
    const body = document.getElementById('notif-body');

    if (modal && title && meta && body) {
        // Strip emojis for title for a cleaner look
        const cleanMsg = notif.msg.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF])/g, '').trim();
        title.textContent = cleanMsg;
        meta.textContent = notif.time;
        body.textContent = notif.detail || "No details available for this notification.";
        
        modal.classList.add('open');
    }
};

function initNotificationModal() {
    const modal = document.getElementById('notification-detail-modal');
    if (!modal) return;
    const closeBtns = [
        document.getElementById('notif-close'),
        document.getElementById('notif-close-btn')
    ];

    closeBtns.forEach(btn => {
        if (btn) {
            btn.onclick = () => modal.classList.remove('open');
        }
    });

    const backdrop = modal.querySelector('.quick-action-backdrop');
    if (backdrop) {
        backdrop.onclick = () => modal.classList.remove('open');
    }
}

// ── Utility ──
function formatCurrency(n) { return '₹' + n.toLocaleString('en-IN'); }
function formatNumber(n) { return n.toLocaleString('en-IN'); }

