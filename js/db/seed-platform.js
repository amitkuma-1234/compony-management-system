/* Seed: AI Command Center */
const seedAI = {
  insights: [
    { id:1, icon:'📈', type:'Revenue Prediction', msg:'Q3 2026 projected at ₹2.4 Crore (+18% YoY)', confidence:94, dot:'purple' },
    { id:2, icon:'🚨', type:'Anomaly Alert', msg:'Unusual expense pattern detected in Marketing dept', confidence:87, dot:'red' },
    { id:3, icon:'✅', type:'Recommendation', msg:'Reorder SKU-0089 (Dell Monitor) — predicted stockout in 3 days', confidence:92, dot:'green' },
    { id:4, icon:'💡', type:'Optimization', msg:'Shift 2 engineers from Project A to B for 15% faster delivery', confidence:89, dot:'blue' }
  ],
  models: [
    { id:1, name:'Demand Forecasting', type:'LSTM & Prophet', status:'Active', icon:'fa-chart-line', gradient:'linear-gradient(135deg,var(--accent),var(--purple))' },
    { id:2, name:'Anomaly Detection', type:'Real-time fraud engine', status:'Active', icon:'fa-triangle-exclamation', gradient:'linear-gradient(135deg,var(--pink),var(--danger))' },
    { id:3, name:'AI Assistant', type:'NL business intelligence', status:'Active', icon:'fa-robot', gradient:'linear-gradient(135deg,var(--cyan),var(--info))' }
  ],
  stats: { modelsActive:156, forecastAccuracy:'94.2%', predictionsToday:'1,247', anomaliesDetected:23 }
};

/* Seed: Analytics & BI */
const seedAnalytics = {
  scheduledReports: [
    { id:1, name:'Monthly Financial Summary', schedule:'Every 1st', format:'PDF', recipients:12, icon:'fa-file-pdf', iconBg:'rgba(59,130,246,0.12)', iconColor:'var(--info)' },
    { id:2, name:'Weekly HR Report', schedule:'Every Monday', format:'Excel', recipients:5, icon:'fa-file-excel', iconBg:'rgba(34,197,94,0.12)', iconColor:'var(--success)' },
    { id:3, name:'Sales Pipeline Report', schedule:'Daily', format:'Dashboard', recipients:8, icon:'fa-chart-bar', iconBg:'rgba(168,85,247,0.12)', iconColor:'var(--purple)' }
  ],
  stats: { activeDashboards:12, reportsGenerated:248, dataProcessed:'1.2TB', avgQueryTime:'45ms' }
};

/* Seed: Auth & Security */
const seedAuth = {
  securityFeatures: [
    { id:1, name:'Multi-Factor Authentication', desc:'TOTP, SMS, Email verification', status:'Enabled' },
    { id:2, name:'SSO / OIDC / SAML', desc:'Google, Microsoft, Keycloak', status:'Enabled' },
    { id:3, name:'Role-Based Access Control', desc:'5 roles, 48 permissions', status:'Enabled' },
    { id:4, name:'Rate Limiting & DDoS Protection', desc:'100 req/min per user', status:'Enabled' },
    { id:5, name:'Device Fingerprinting', desc:'Behavioral analytics', status:'Planned' }
  ],
  auditLogs: [
    { id:1, action:'Login', detail:'Amit Kumar from Chrome/Windows', time:'2 min ago', ip:'192.168.1.10', dot:'green' },
    { id:2, action:'Permission', detail:"Role 'Manager' updated by Admin", time:'15 min ago', ip:'', dot:'blue' },
    { id:3, action:'Blocked', detail:'Failed login from 103.45.67.89', time:'1 hour ago', ip:'', dot:'red' },
    { id:4, action:'MFA', detail:'Enabled for user Priya Sharma', time:'3 hours ago', ip:'', dot:'yellow' },
    { id:5, action:'API Key', detail:'New key generated for Integration', time:'5 hours ago', ip:'', dot:'green' }
  ],
  stats: { securityScore:'99.9%', activeUsers:162, threatsBlocked:47, authMethod:'MFA' }
};

/* Seed: Notifications */
const seedNotifications = {
  channels: [
    { id:1, name:'Email (SMTP)', provider:'SendGrid integration', delivery:'99.2%', icon:'fa-envelope', iconBg:'rgba(59,130,246,0.12)', iconColor:'var(--info)', status:'Active' },
    { id:2, name:'SMS Gateway', provider:'Twilio', delivery:'OTP & alerts', icon:'fa-comment-sms', iconBg:'rgba(34,197,94,0.12)', iconColor:'var(--success)', status:'Active' },
    { id:3, name:'WhatsApp Business', provider:'Meta Cloud API', delivery:'', icon:'fab fa-whatsapp', iconBg:'rgba(6,182,212,0.12)', iconColor:'var(--cyan)', status:'Active' },
    { id:4, name:'Slack Integration', provider:'Workspace notifications', delivery:'', icon:'fab fa-slack', iconBg:'rgba(168,85,247,0.12)', iconColor:'var(--purple)', status:'Active' },
    { id:5, name:'Discord Webhooks', provider:'Dev team alerts', delivery:'', icon:'fab fa-discord', iconBg:'rgba(99,102,241,0.12)', iconColor:'var(--accent)', status:'Config' }
  ],
  recent: [
    { id:1, msg:'📧 Invoice #INV-2847 sent to Infosys via Email', time:'2 min ago · Delivered', dot:'green', detail: 'Dear Finance Team,\n\nPlease find attached Invoice #INV-2847 for the IT Infrastructure services provided in April 2026. The total amount due is ₹18,45,000.\n\nRegards,\nAmdox Finance' },
    { id:2, msg:'💬 OTP sent to +91-98765xxxxx via SMS', time:'10 min ago · Delivered', dot:'blue', detail: 'Verification Code: 482915. Use this code to authorize the pending bank transfer. Valid for 5 minutes.' },
    { id:3, msg:'🔔 Leave approval notification via WhatsApp', time:'30 min ago · Read', dot:'purple', detail: 'Hi Rahul Singh, your leave request for May 22-24 has been APPROVED by your manager Vikram Kumar.' },
    { id:4, msg:'⚡ Webhook triggered: inventory.stock.low', time:'1 hour ago · 200 OK', dot:'yellow', detail: 'Inventory Event: ITEM_LOW_STOCK\nProduct: Dell Monitor 27"\nRemaining: 3 units\nThreshold: 10 units\nAction: Triggered reorder recommendation.' }
  ],
  stats: { emailsSent:'2,847', smsDelivered:456, whatsappMessages:189, webhooksActive:34 }
};

/* Seed: Assets */
const seedAssets = {
  assets: [
    { id:1, assetId:'AST-001', name:'MacBook Pro 16" M3', category:'Laptop', assignedTo:'Rahul Singh', status:'In Use', value:'₹2,49,900' },
    { id:2, assetId:'AST-002', name:'Dell UltraSharp 32"', category:'Monitor', assignedTo:'Anita Patel', status:'In Use', value:'₹52,000' },
    { id:3, assetId:'AST-003', name:'Herman Miller Aeron', category:'Furniture', assignedTo:'Conference Room B', status:'In Use', value:'₹1,25,000' },
    { id:4, assetId:'AST-004', name:'Epson Projector', category:'AV Equipment', assignedTo:'—', status:'Maintenance', value:'₹85,000' }
  ],
  stats: { totalAssets:342, inUse:298, underMaintenance:18, retired:26 }
};

/* Seed: Legal */
const seedLegal = {
  contracts: [
    { id:1, title:'Master Service Agreement', party:'Infosys Ltd', type:'Service', startDate:'Jan 2025', endDate:'Dec 2026', status:'Active' },
    { id:2, title:'NDA — CloudHost', party:'CloudHost Inc', type:'NDA', startDate:'Mar 2026', endDate:'Mar 2027', status:'Active' },
    { id:3, title:'Vendor Agreement', party:'TechSupply Co', type:'Vendor', startDate:'Jun 2025', endDate:'Jun 2026', status:'Expiring' }
  ],
  stats: { activeContracts:86, gdprCompliant:'100%', expiringSoon:3, pendingApprovals:12 }
};

/* Seed: E-Commerce */
const seedEcommerce = {
  stores: [
    { id:1, platform:'Shopify', icon:'fab fa-shopify', products:842, status:'Connected', color:'rgba(34,197,94,0.12)', textColor:'var(--success)' },
    { id:2, platform:'WooCommerce', icon:'fab fa-wordpress', products:356, status:'Connected', color:'rgba(168,85,247,0.12)', textColor:'var(--purple)' },
    { id:3, platform:'Amazon Marketplace', icon:'fab fa-amazon', products:289, status:'Connected', color:'rgba(245,158,11,0.12)', textColor:'var(--warning)' }
  ],
  orders: [
    { id:1, orderId:'#ORD-4521', platform:'Shopify', platformIcon:'fab fa-shopify', platformBadge:'badge-success', customer:'Rajesh Gupta', amount:'₹4,299', status:'Delivered', date:'May 28, 2026', items:[{name:'Bluetooth Headphones', qty:1, price:3999},{name:'AA Batteries 4pk', qty:1, price:300}], tax:'₹249', total:'₹4,548' },
    { id:2, orderId:'#ORD-4520', platform:'WooCommerce', platformIcon:'fab fa-wordpress', platformBadge:'badge-purple', customer:'Sneha Reddy', amount:'₹12,500', status:'Shipped', date:'May 27, 2026', items:[{name:'Ergonomic Office Chair', qty:1, price:12500}], tax:'₹0', total:'₹12,500' },
    { id:3, orderId:'#ORD-4519', platform:'Amazon', platformIcon:'fab fa-amazon', platformBadge:'badge-warning', customer:'Karan Mehta', amount:'₹8,999', status:'Processing', date:'May 27, 2026', items:[{name:'Mechanical Keyboard', qty:1, price:7500},{name:'Gaming Mouse Pad', qty:1, price:1499}], tax:'₹720', total:'₹9,719' }
  ],
  stats: { ordersThisMonth:'1,842', ordersGrowth:'24%', ecomRevenue:'₹38.5L', connectedStores:3, syncStatus:'Real-time' }
};

/* Seed: Communication */
const seedComm = {
  channels: [
    { id:1, name:'#general', desc:'Company-wide discussions', members:162, unread:24, iconBg:'rgba(59,130,246,0.12)', iconColor:'var(--info)', countBg:'var(--info)' },
    { id:2, name:'#engineering', desc:'Tech discussions', members:48, unread:12, iconBg:'rgba(34,197,94,0.12)', iconColor:'var(--success)', countBg:'var(--success)' },
    { id:3, name:'#sales', desc:'Sales pipeline updates', members:32, unread:5, iconBg:'rgba(236,72,153,0.12)', iconColor:'var(--pink)', countBg:'var(--pink)' },
    { id:4, name:'#random', desc:'Fun & culture', members:162, unread:0, iconBg:'rgba(168,85,247,0.12)', iconColor:'var(--purple)', countBg:'' }
  ],
  announcements: [
    { id:1, icon:'📢', title:'Town Hall Meeting', detail:'Friday 4 PM, all hands deck', postedBy:'CEO', time:'2 hours ago', dot:'blue' },
    { id:2, icon:'🎉', title:'Q2 Results:', detail:'Revenue target exceeded by 18%!', postedBy:'Finance', time:'Yesterday', dot:'green' },
    { id:3, icon:'🚀', title:'New Feature:', detail:'AI Assistant now available for all employees', postedBy:'Engineering', time:'2 days ago', dot:'purple' }
  ],
  stats: { messagesToday:'1,245', activeMeetings:8, announcements:3, wikiArticles:124 }
};

/* Seed: DevOps */
const seedDevOps = {
  builds: [
    { id:1, buildNo:847, branch:'main', status:'Passed', detail:'Deployed to production', time:'5 min ago', iconBg:'rgba(34,197,94,0.12)', iconColor:'var(--success)', icon:'fa-check-circle' },
    { id:2, buildNo:846, branch:'feature/ai-module', status:'Passed', detail:'Deployed to staging', time:'1 hour ago', iconBg:'rgba(34,197,94,0.12)', iconColor:'var(--success)', icon:'fa-check-circle' },
    { id:3, buildNo:845, branch:'fix/auth-bug', status:'Failed', detail:'Test failed', time:'2 hours ago', iconBg:'rgba(239,68,68,0.12)', iconColor:'var(--danger)', icon:'fa-times-circle' },
    { id:4, buildNo:844, branch:'main', status:'Passed', detail:'Production', time:'5 hours ago', iconBg:'rgba(34,197,94,0.12)', iconColor:'var(--success)', icon:'fa-check-circle' }
  ],
  infra: [
    { id:1, name:'Docker', detail:'24 containers running', status:'Healthy', icon:'fab fa-docker', iconBg:'rgba(6,182,212,0.12)', iconColor:'var(--cyan)' },
    { id:2, name:'Kubernetes (EKS)', detail:'3 nodes, 24 pods', status:'Healthy', icon:'fa-dharmachakra', iconBg:'rgba(59,130,246,0.12)', iconColor:'var(--info)' },
    { id:3, name:'Terraform', detail:'42 resources managed', status:'Synced', icon:'fa-cloud', iconBg:'rgba(168,85,247,0.12)', iconColor:'var(--purple)' },
    { id:4, name:'Prometheus + Grafana', detail:'156 metrics tracked', status:'Active', icon:'fa-chart-area', iconBg:'rgba(245,158,11,0.12)', iconColor:'var(--warning)' }
  ],
  stats: { uptime:'99.98%', deployments:847, activePods:24, avgLatency:'45ms' }
};

/* Seed: Settings */
const seedSettings = {
  systemInfo: [
    { label:'Platform Version', value:'Amdox ERP v3.2.1' },
    { label:'Tenant', value:'Amdox Technologies Pvt Ltd' },
    { label:'Plan', value:'Enterprise', badge:'badge-purple' },
    { label:'Users', value:'162 / Unlimited' },
    { label:'Storage', value:'234 GB / 500 GB' },
    { label:'API Calls (Monthly)', value:'1.2M / 5M' },
    { label:'Last Backup', value:'May 18, 2026 · 02:00 AM IST' }
  ],
  settingsCards: [
    { id:1, name:'Company Profile', desc:'Name, logo, address', icon:'fa-building', iconBg:'rgba(99,102,241,0.12)', iconColor:'var(--accent)' },
    { id:2, name:'User Management', desc:'Roles & permissions', icon:'fa-users-gear', iconBg:'rgba(34,197,94,0.12)', iconColor:'var(--success)' },
    { id:3, name:'Integrations', desc:'APIs & webhooks', icon:'fa-puzzle-piece', iconBg:'rgba(168,85,247,0.12)', iconColor:'var(--purple)' },
    { id:4, name:'Billing & Plans', desc:'Subscription management', icon:'fa-credit-card', iconBg:'rgba(245,158,11,0.12)', iconColor:'var(--warning)' },
    { id:5, name:'Appearance', desc:'Theme & branding', icon:'fa-palette', iconBg:'rgba(236,72,153,0.12)', iconColor:'var(--pink)' },
    { id:6, name:'Data & Backup', desc:'Export & restore', icon:'fa-database', iconBg:'rgba(6,182,212,0.12)', iconColor:'var(--cyan)' }
  ]
};

/* Seed: Dashboard */
const seedDashboard = {
  stats: [
    { id:1, icon:'fa-indian-rupee-sign', color:'blue', value:'₹24.8L', label:'Total Revenue (May)', trend:'18.2%', progress:78 },
    { id:2, icon:'fa-users', color:'green', value:'162', label:'Active Employees', trend:'5', progress:92 },
    { id:3, icon:'fa-clipboard-check', color:'purple', value:'47', label:'Active Projects', trend:'12%', progress:65 },
    { id:4, icon:'fa-handshake', color:'pink', value:'284', label:'CRM Leads', trend:'8.5%', progress:54 }
  ],
  recentActivity: [
    { id:1, text:'<strong>Invoice #INV-2847</strong> approved by Finance team', time:'2 minutes ago', dot:'green' },
    { id:2, text:'<strong>Priya Sharma</strong> onboarded to Engineering dept', time:'1 hour ago', dot:'blue' },
    { id:3, text:'<strong>Stock Alert:</strong> 5 items below reorder level', time:'2 hours ago', dot:'yellow' },
    { id:4, text:'<strong>AI Forecast:</strong> Q3 revenue predicted at ₹2.4Cr', time:'3 hours ago', dot:'purple' },
    { id:5, text:'<strong>Security:</strong> Failed login attempt blocked from 192.168.1.45', time:'5 hours ago', dot:'red' }
  ],
  pendingApprovals: [
    { id:1, title:'Purchase Order #PO-1245', subtitle:'₹1,85,000 · Vendor: TechSupply Co', icon:'fa-file-invoice', iconBg:'rgba(245,158,11,0.12)', iconColor:'var(--warning)' },
    { id:2, title:'Leave Request — Rahul Singh', subtitle:'May 22-24 · Casual Leave', icon:'fa-plane-departure', iconBg:'rgba(99,102,241,0.12)', iconColor:'var(--accent)' },
    { id:3, title:'Expense Claim #EXP-892', subtitle:'₹12,500 · Travel expenses', icon:'fa-receipt', iconBg:'rgba(34,197,94,0.12)', iconColor:'var(--success)' }
  ],
  topPerformers: [
    { id:1, name:'Rahul Singh', dept:'Engineering', kpi:'98%', initials:'RS', gradient:'linear-gradient(135deg,#6366f1,#a855f7)', badge:'⭐ Top', badgeClass:'badge-success' },
    { id:2, name:'Anita Patel', dept:'Sales', kpi:'96%', initials:'AP', gradient:'linear-gradient(135deg,#ec4899,#f59e0b)', badge:'↗ Rising', badgeClass:'badge-info' },
    { id:3, name:'Vikram Kumar', dept:'Finance', kpi:'94%', initials:'VK', gradient:'linear-gradient(135deg,#22c55e,#06b6d4)', badge:'★ Star', badgeClass:'badge-purple' }
  ],
  systemHealth: [
    { id:1, name:'API Server', detail:'Response: 45ms · Uptime: 99.98%', status:'Healthy', icon:'fa-server', iconBg:'rgba(34,197,94,0.12)', iconColor:'var(--success)' },
    { id:2, name:'Database Cluster', detail:'Load: 23% · Connections: 142', status:'Healthy', icon:'fa-database', iconBg:'rgba(34,197,94,0.12)', iconColor:'var(--success)' },
    { id:3, name:'Storage', detail:'Used: 78% · 234GB / 300GB', status:'Watch', icon:'fa-hard-drive', iconBg:'rgba(245,158,11,0.12)', iconColor:'var(--warning)' }
  ]
};
