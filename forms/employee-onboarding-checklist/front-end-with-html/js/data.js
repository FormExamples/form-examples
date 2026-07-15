// Sample employee data for the HR / management dashboard.
//
// Twelve realistic rows: span every department (Nursing, Medical, Admin,
// Allied Health, IT), every completion status (Not Started, In Progress,
// Complete, Overdue) and a mix of milestones from Pre-arrival through 90
// Day. A subset are flagged as overdue so the default sort can demonstrate
// the "overdue first" behaviour required for HR triage.

/** @type {import('./types.js').EmployeeRow[]} */
const sampleEmployees = [
  {
    id: '1',
    employeeId: 'EMP-10421',
    employeeName: 'Khan, Aisha',
    department: 'Nursing',
    role: 'Staff Nurse',
    completionPercent: 92,
    completionStatus: 'Complete',
    milestoneReached: '90 Day',
    startDate: '2026-02-02',
    overdue: false
  },
  {
    id: '2',
    employeeId: 'EMP-10422',
    employeeName: 'O\u2019Connor, Liam',
    department: 'Medical',
    role: 'Foundation Year 1 Doctor',
    completionPercent: 45,
    completionStatus: 'Overdue',
    milestoneReached: 'Week 1',
    startDate: '2026-03-09',
    overdue: true
  },
  {
    id: '3',
    employeeId: 'EMP-10423',
    employeeName: 'Williams, Sarah',
    department: 'Allied Health',
    role: 'Physiotherapist',
    completionPercent: 78,
    completionStatus: 'In Progress',
    milestoneReached: '60 Day',
    startDate: '2026-03-02',
    overdue: false
  },
  {
    id: '4',
    employeeId: 'EMP-10424',
    employeeName: 'Patel, Rohan',
    department: 'IT',
    role: 'Clinical Systems Analyst',
    completionPercent: 0,
    completionStatus: 'Not Started',
    milestoneReached: 'Pre-arrival',
    startDate: '2026-05-18',
    overdue: false
  },
  {
    id: '5',
    employeeId: 'EMP-10425',
    employeeName: 'Brown, Sarah',
    department: 'Admin',
    role: 'Ward Clerk',
    completionPercent: 30,
    completionStatus: 'Overdue',
    milestoneReached: 'Day 1',
    startDate: '2026-03-30',
    overdue: true
  },
  {
    id: '6',
    employeeId: 'EMP-10426',
    employeeName: 'Taylor, James',
    department: 'Medical',
    role: 'Consultant Cardiologist',
    completionPercent: 100,
    completionStatus: 'Complete',
    milestoneReached: '90 Day',
    startDate: '2026-01-26',
    overdue: false
  },
  {
    id: '7',
    employeeId: 'EMP-10427',
    employeeName: 'Davies, Helen',
    department: 'Nursing',
    role: 'Senior Charge Nurse',
    completionPercent: 65,
    completionStatus: 'In Progress',
    milestoneReached: '30 Day',
    startDate: '2026-03-23',
    overdue: false
  },
  {
    id: '8',
    employeeId: 'EMP-10428',
    employeeName: 'Wilson, Robert',
    department: 'Allied Health',
    role: 'Occupational Therapist',
    completionPercent: 55,
    completionStatus: 'Overdue',
    milestoneReached: 'Week 1',
    startDate: '2026-03-16',
    overdue: true
  },
  {
    id: '9',
    employeeId: 'EMP-10429',
    employeeName: 'Evans, Catherine',
    department: 'Admin',
    role: 'Medical Secretary',
    completionPercent: 88,
    completionStatus: 'In Progress',
    milestoneReached: '60 Day',
    startDate: '2026-02-23',
    overdue: false
  },
  {
    id: '10',
    employeeId: 'EMP-10430',
    employeeName: 'Thomas, Michael',
    department: 'IT',
    role: 'Network Administrator',
    completionPercent: 15,
    completionStatus: 'In Progress',
    milestoneReached: 'Day 1',
    startDate: '2026-04-27',
    overdue: false
  },
  {
    id: '11',
    employeeId: 'EMP-10431',
    employeeName: 'Robinson, Emma',
    department: 'Nursing',
    role: 'Health Care Assistant',
    completionPercent: 5,
    completionStatus: 'Not Started',
    milestoneReached: 'Pre-arrival',
    startDate: '2026-05-25',
    overdue: false
  },
  {
    id: '12',
    employeeId: 'EMP-10432',
    employeeName: 'Clark, George',
    department: 'Medical',
    role: 'Specialty Registrar',
    completionPercent: 95,
    completionStatus: 'Complete',
    milestoneReached: '90 Day',
    startDate: '2026-01-19',
    overdue: false
  }
];

export { sampleEmployees };
