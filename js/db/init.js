/* ============================================================
   AMDOX ERP — Database Initialization
   Combines all seeds and initializes the db engine
   ============================================================ */
(function() {
  const allSeeds = {
    // HR
    departments: seedHR.departments,
    employees: seedHR.employees,
    attendance: seedHR.attendance,
    leaves: seedHR.leaves,
    hrStats: [seedHR.stats],
    // Finance
    invoices: seedFinance.invoices,
    transactions: seedFinance.transactions,
    cashflowData: [seedFinance.cashflow],
    financeStats: [seedFinance.stats],
    // Inventory
    products: seedInventory.products,
    lowStockAlerts: seedInventory.lowStockAlerts,
    stockByCategory: [seedInventory.stockByCategory],
    inventoryStats: [seedInventory.stats],
    // CRM
    leads: seedCRM.leads,
    crmPipeline: seedCRM.pipeline,
    tickets: seedCRM.tickets,
    pipelineChart: [seedCRM.pipelineChart],
    crmStats: [seedCRM.stats],
    // Projects
    kanban: [seedProjects.kanban],
    projectTimeline: seedProjects.timeline,
    sprintBurndown: [seedProjects.sprintBurndown],
    projectStats: [seedProjects.stats],
    // AI
    aiInsights: seedAI.insights,
    aiModels: seedAI.models,
    aiStats: [seedAI.stats],
    // Analytics
    scheduledReports: seedAnalytics.scheduledReports,
    analyticsStats: [seedAnalytics.stats],
    // Auth
    securityFeatures: seedAuth.securityFeatures,
    auditLogs: seedAuth.auditLogs,
    authStats: [seedAuth.stats],
    // Notifications
    notificationChannels: seedNotifications.channels,
    recentNotifications: seedNotifications.recent,
    notificationStats: [seedNotifications.stats],
    // Assets
    assets: seedAssets.assets,
    assetStats: [seedAssets.stats],
    // Legal
    contracts: seedLegal.contracts,
    legalStats: [seedLegal.stats],
    // E-Commerce
    ecomStores: seedEcommerce.stores,
    ecomOrders: seedEcommerce.orders,
    ecomStats: [seedEcommerce.stats],
    // Communication
    commChannels: seedComm.channels,
    announcements: seedComm.announcements,
    commStats: [seedComm.stats],
    // DevOps
    builds: seedDevOps.builds,
    infrastructure: seedDevOps.infra,
    devopsStats: [seedDevOps.stats],
    // Settings
    systemInfo: seedSettings.systemInfo,
    settingsCards: seedSettings.settingsCards,
    // Dashboard
    dashboardStats: seedDashboard.stats,
    recentActivity: seedDashboard.recentActivity,
    pendingApprovals: seedDashboard.pendingApprovals,
    topPerformers: seedDashboard.topPerformers,
    systemHealth: seedDashboard.systemHealth
  };

  db.init(allSeeds);
  console.log('✅ Amdox ERP Database ready — ' + Object.keys(allSeeds).length + ' tables loaded');
})();
