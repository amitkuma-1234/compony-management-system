/* Seed: HR & People */
const seedHR = {
  departments: [
    { id:1, name:'Engineering', headId:1, employeeCount:48 },
    { id:2, name:'Sales & Marketing', headId:3, employeeCount:32 },
    { id:3, name:'Finance', headId:4, employeeCount:24 },
    { id:4, name:'HR & Admin', headId:5, employeeCount:18 },
    { id:5, name:'Operations', headId:6, employeeCount:40 }
  ],
  employees: [
    { id:1, name:'Aakash Singh', email:'aakashsingh@4344@gmail.com', initials:'AS', department:'Engineering', role:'junior developer', status:'Active', joinDate:'may 2025', salary:120000, gradient:'linear-gradient(135deg,#6366f1,#a855f7)' },
    { id:2, name:'Rohan Mehra', email:'Rohan234@gmail.com', initials:'RM', department:'Engineering', role:'junior developer', status:'Inactive', joinDate:'12 may 2023', salary:110000, gradient:'linear-gradient(135deg,#ec4899,#f59e0b)' },
    { id:3, name:'Arjun Mehta', email:'arjun@amdox.com', initials:'AM', department:'Engineering', role:'Software Engineer', status:'Active', joinDate:'Jan 2024', salary:95000, gradient:'linear-gradient(135deg,#22c55e,#06b6d4)' },
    { id:4, name:'Priya Sharma', email:'priya@amdox.com', initials:'PS', department:'HR & Admin', role:'HR Manager', status:'Active', joinDate:'Mar 2023', salary:105000, gradient:'linear-gradient(135deg,#a855f7,#6366f1)' },
    { id:5, name:'Rahul Desai', email:'rahul@amdox.com', initials:'RD', department:'Engineering', role:'Sales Executive', status:'Active', joinDate:'May 2026', salary:90000, gradient:'linear-gradient(135deg,#f59e0b,#ef4444)' }
  ],
  attendance: [
    { id:1, day:'Mon', present:142, absent:8, wfh:12 },
    { id:2, day:'Tue', present:148, absent:5, wfh:9 },
    { id:3, day:'Wed', present:145, absent:10, wfh:7 },
    { id:4, day:'Thu', present:150, absent:3, wfh:9 },
    { id:5, day:'Fri', present:138, absent:15, wfh:9 }
  ],
  leaves: [
    { id:1, employeeId:1, employeeName:'Rahul Singh', type:'Casual Leave', startDate:'May 22, 2026', endDate:'May 24, 2026', status:'Pending', days:3 },
    { id:2, employeeId:4, employeeName:'Priya Sharma', type:'Sick Leave', startDate:'May 18, 2026', endDate:'May 18, 2026', status:'Approved', days:1 }
  ],
  stats: {
    totalEmployees: 5,
    presentToday: 4,
    onLeave: 12,
    newThisMonth: 1
  }
};

