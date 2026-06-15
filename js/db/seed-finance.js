/* Seed: Finance & Accounting */
const seedFinance = {
  invoices: [
    { id:1, invoiceNo:'INV-2847', client:'Infosys Ltd', amount:875000, dueDate:'May 25, 2026', status:'Pending' },
    { id:2, invoiceNo:'INV-2846', client:'Reliance Industries', amount:1240000, dueDate:'May 20, 2026', status:'Sent' },
    { id:3, invoiceNo:'INV-2845', client:'Tata Motors', amount:450000, dueDate:'May 15, 2026', status:'Paid' },
    { id:4, invoiceNo:'INV-2844', client:'HCL Technologies', amount:680000, dueDate:'May 10, 2026', status:'Paid' },
    { id:5, invoiceNo:'INV-2843', client:'Wipro Ltd', amount:920000, dueDate:'May 05, 2026', status:'Paid' },
    { id:6, invoiceNo:'INV-2842', client:'Tech Mahindra', amount:535000, dueDate:'Apr 30, 2026', status:'Paid' },
    { id:7, invoiceNo:'INV-2841', client:'Larsen & Toubro', amount:1850000, dueDate:'Apr 25, 2026', status:'Sent' },
    { id:8, invoiceNo:'INV-2840', client:'Bajaj Finance', amount:325000, dueDate:'Apr 20, 2026', status:'Paid' },
    { id:9, invoiceNo:'INV-2839', client:'Mahindra & Mahindra', amount:760000, dueDate:'Apr 15, 2026', status:'Pending' },
    { id:10, invoiceNo:'INV-2838', client:'Adani Enterprises', amount:1120000, dueDate:'Apr 10, 2026', status:'Sent' },
    { id:11, invoiceNo:'INV-2837', client:'Bharti Airtel', amount:490000, dueDate:'Apr 05, 2026', status:'Paid' },
    { id:12, invoiceNo:'INV-2836', client:'HDFC Bank', amount:680000, dueDate:'Mar 30, 2026', status:'Paid' },
    { id:13, invoiceNo:'INV-2835', client:'ICICI Bank', amount:410000, dueDate:'Mar 25, 2026', status:'Paid' },
    { id:14, invoiceNo:'INV-2834', client:'Sun Pharma', amount:575000, dueDate:'Mar 20, 2026', status:'Paid' },
    { id:15, invoiceNo:'INV-2833', client:'Asian Paints', amount:345000, dueDate:'Mar 15, 2026', status:'Sent' },
    { id:16, invoiceNo:'INV-2832', client:'Godrej Industries', amount:620000, dueDate:'Mar 10, 2026', status:'Paid' }
  ],
  transactions: [
    { id:1, type:'inflow', title:'Payment from Tata Motors', ref:'INV-2845', amount:450000, status:'Received' },
    { id:2, type:'outflow', title:'Vendor Payment — CloudHost', ref:'PO-1240', amount:120000, status:'Paid' },
    { id:3, type:'pending', title:'Invoice to Infosys', ref:'INV-2847', amount:875000, status:'Pending' },
    { id:4, type:'inflow', title:'Payment from Wipro', ref:'INV-2840', amount:325000, status:'Received' }
  ],
  cashflow: {
    labels: ['Jan','Feb','Mar','Apr','May','Jun'],
    inflow: [85,92,78,95,110,105],
    outflow: [65,70,72,68,75,80]
  },
  stats: {
    revenueYTD: '₹1.18Cr', revenueGrowth: '18%',
    expensesYTD: '₹58.2L', expenseChange: '3%',
    pendingInvoices: 24,
    netProfit: '₹59.8L', profitGrowth: '22%'
  }
};
