/* Seed: Inventory & Supply Chain */
const seedInventory = {
  products: [
    { id:1, sku:'SKU-0012', name:'MacBook Pro 16"', category:'Electronics', stock:45, warehouse:'Warehouse A', status:'In Stock' },
    { id:2, sku:'SKU-0045', name:'Office Chair Ergonomic', category:'Furniture', stock:82, warehouse:'Warehouse B', status:'In Stock' },
    { id:3, sku:'SKU-0089', name:'Dell Monitor 27"', category:'Electronics', stock:3, warehouse:'Warehouse A', status:'Low Stock' },
    { id:4, sku:'SKU-0156', name:'Printer Paper A4', category:'Supplies', stock:520, warehouse:'Warehouse C', status:'In Stock' }
  ],
  lowStockAlerts: [
    { id:1, name:'Dell Monitor 27"', stock:3, reorderLevel:20, severity:'critical' },
    { id:2, name:'USB-C Cables', stock:8, reorderLevel:50, severity:'critical' },
    { id:3, name:'Keyboard Mechanical', stock:12, reorderLevel:25, severity:'warning' },
    { id:4, name:'A4 Paper Ream', stock:15, reorderLevel:30, severity:'warning' }
  ],
  stockByCategory: {
    labels: ['Electronics','Furniture','Supplies','Software','Hardware','Services'],
    data: [340,180,520,90,210,150]
  },
  stats: { totalProducts:1487, inStock:1342, lowStockAlerts:28, pendingOrders:15 }
};

/* Seed: CRM */
const seedCRM = {
  leads: [
    { id:1, company:'Tata Consulting Services', type:'Enterprise License', value:'₹18L', stage:'New', icon:'info' },
    { id:2, company:'Flipkart India', type:'Custom Integration', value:'₹25L', stage:'Qualified', icon:'purple' },
    { id:3, company:'Bajaj Finance', type:'ERP Suite', value:'₹32L', stage:'Proposal', icon:'warning' },
    { id:4, company:'Mahindra Group', type:'Full Platform', value:'₹45L', stage:'Negotiation', icon:'success' }
  ],
  pipeline: [
    { id:1, name:'New Leads', count:85, value:'₹28L' },
    { id:2, name:'Qualified', count:62, value:'₹35L' },
    { id:3, name:'Proposal', count:38, value:'₹42L' },
    { id:4, name:'Negotiation', count:18, value:'₹25L' },
    { id:5, name:'Closed Won', count:42, value:'₹1.2Cr' }
  ],
  tickets: [
    { id:1, ticketNo:'#TKT-1024', customer:'Infosys', subject:'API integration issue', priority:'High', status:'In Progress', assigned:'Rahul S.' },
    { id:2, ticketNo:'#TKT-1023', customer:'Wipro', subject:'Dashboard loading slow', priority:'Medium', status:'Open', assigned:'Vikram K.' },
    { id:3, ticketNo:'#TKT-1022', customer:'HCL Tech', subject:'Report export failing', priority:'Medium', status:'Resolved', assigned:'Anita P.' },
    { id:4, ticketNo:'#TKT-1021', customer:'Reliance Ind', subject:'SSO login timeout', priority:'High', status:'Open', assigned:'Priya S.' },
    { id:5, ticketNo:'#TKT-1020', customer:'Airtel', subject:'Payment gateway 503 error', priority:'High', status:'In Progress', assigned:'Rahul S.' },
    { id:6, ticketNo:'#TKT-1019', customer:'Zomato', subject:'Mobile app sync lag', priority:'Medium', status:'Open', assigned:'Nikhil P.' },
    { id:7, ticketNo:'#TKT-1018', customer:'Swiggy', subject:'Order API latency', priority:'Medium', status:'In Progress', assigned:'Anita P.' },
    { id:8, ticketNo:'#TKT-1017', customer:'TATA Steel', subject:'Inventory sync mismatch', priority:'High', status:'Open', assigned:'Vikram K.' },
    { id:9, ticketNo:'#TKT-1016', customer:'ICICI Bank', subject:'Security audit requested', priority:'High', status:'Open', assigned:'Priya S.' },
    { id:10, ticketNo:'#TKT-1015', customer:'HDFC Life', subject:'Bulk upload size limit', priority:'Medium', status:'In Progress', assigned:'Rahul S.' },
    { id:11, ticketNo:'#TKT-1014', customer:'Ola Electric', subject:'Map integration bug', priority:'Medium', status:'Open', assigned:'Vikram K.' },
    { id:12, ticketNo:'#TKT-1013', customer:'Paytm', subject:'Wallet refund issue', priority:'High', status:'In Progress', assigned:'Anita P.' },
    { id:13, ticketNo:'#TKT-1012', customer:'L&T', subject:'Project timeline lag', priority:'Medium', status:'Open', assigned:'Nikhil P.' },
    { id:14, ticketNo:'#TKT-1011', customer:'Vedanta', subject:'Cloud migration help', priority:'High', status:'In Progress', assigned:'Priya S.' },
    { id:15, ticketNo:'#TKT-1010', customer:'Adani Ent', subject:'Multi-currency setup', priority:'Medium', status:'Open', assigned:'Rahul S.' }
  ],
  pipelineChart: { labels:['Qualified','Proposal','Negotiation','Closed Won','Closed Lost'], data:[35,25,18,15,7] },
  stats: { totalLeads:284, leadsGrowth:'12%', wonThisMonth:42, pipelineValue:'₹1.2Cr', winRate:'68%' }
};

/* Seed: Projects */
const seedProjects = {
  kanban: {
    backlog: [
      { id:1, title:'Design System Update', tag:'Design', tagColor:'info', assignees:['RS'] },
      { id:2, title:'API Rate Limiting', tag:'Backend', tagColor:'purple', assignees:['VK'] },
      { id:3, title:'Mobile App Wireframes', tag:'Design', tagColor:'info', assignees:['PS'] }
    ],
    inProgress: [
      { id:4, title:'Payment Gateway Integration', tag:'High', tagColor:'danger', assignees:['AP','RS'] },
      { id:5, title:'HR Dashboard Redesign', tag:'Medium', tagColor:'warning', assignees:['PS'] }
    ],
    review: [
      { id:6, title:'Inventory Barcode Scanner', tag:'Feature', tagColor:'success', assignees:['VK'] },
      { id:7, title:'Email Template Engine', tag:'Backend', tagColor:'info', assignees:['NK'] }
    ],
    done: [
      { id:8, title:'SSO Authentication', tag:'Complete', tagColor:'success', assignees:['RS'] },
      { id:9, title:'Multi-currency Support', tag:'Complete', tagColor:'success', assignees:['AP'] }
    ]
  },
  timeline: [
    { id:1, name:'ERP v3.2', progress:60, gradient:'linear-gradient(90deg,var(--accent),var(--purple))' },
    { id:2, name:'Mobile App', progress:35, gradient:'linear-gradient(90deg,var(--info),var(--cyan))' },
    { id:3, name:'AI Module', progress:45, gradient:'linear-gradient(90deg,var(--pink),var(--purple))' },
    { id:4, name:'CRM Revamp', progress:80, gradient:'linear-gradient(90deg,var(--success),var(--cyan))' },
    { id:5, name:'DevOps', progress:90, gradient:'linear-gradient(90deg,var(--warning),var(--danger))' }
  ],
  sprintBurndown: {
    labels:['Day 1','Day 2','Day 3','Day 4','Day 5','Day 6','Day 7','Day 8','Day 9','Day 10'],
    ideal:[40,36,32,28,24,20,16,12,8,0],
    actual:[40,38,35,30,28,22,20,15,11,6]
  },
  stats: { activeProjects:47, tasksCompleted:189, inProgress:34, overdue:7 }
};
