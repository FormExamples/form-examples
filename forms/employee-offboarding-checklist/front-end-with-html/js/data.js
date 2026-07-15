// Sample employee data for the HR / management offboarding dashboard.
//
// Twelve realistic rows: span every department (Nursing, Medical, Admin,
// Allied Health, IT, Pharmacy), every completion status (Complete, Partial,
// Incomplete) and a representative mix of blocker categories (None, Access
// Not Revoked, Equipment Outstanding, NDA Pending). Days-since-leaving
// values range from upcoming (negative) through long-overdue (90+) so the
// default sort can demonstrate the "incomplete first, then days-since-
// leaving descending" behaviour required for HR triage.
//
// `leavingDate` and `daysSinceLeaving` are intentionally consistent against
// today's date of 2026-05-04; if the page is viewed substantially later the
// numbers will simply look older — which is fine for sample data.

/** @type {import('./types.js').EmployeeRow[]} */
const sampleEmployees = [
  {
    id: '1',
    employeeId: 'EMP-20501',
    employeeName: 'Khan, Aisha',
    department: 'Nursing',
    role: 'Staff Nurse',
    completionStatus: 'Incomplete',
    blockerCategory: 'Access Not Revoked',
    leavingDate: '2026-04-04',
    daysSinceLeaving: 30,
    hasBlockers: true
  },
  {
    id: '2',
    employeeId: 'EMP-20502',
    employeeName: 'O\u2019Connor, Liam',
    department: 'Medical',
    role: 'Foundation Year 2 Doctor',
    completionStatus: 'Incomplete',
    blockerCategory: 'Equipment Outstanding',
    leavingDate: '2026-02-04',
    daysSinceLeaving: 89,
    hasBlockers: true
  },
  {
    id: '3',
    employeeId: 'EMP-20503',
    employeeName: 'Williams, Sarah',
    department: 'Allied Health',
    role: 'Physiotherapist',
    completionStatus: 'Partial',
    blockerCategory: 'None',
    leavingDate: '2026-04-25',
    daysSinceLeaving: 9,
    hasBlockers: false
  },
  {
    id: '4',
    employeeId: 'EMP-20504',
    employeeName: 'Patel, Rohan',
    department: 'IT',
    role: 'Clinical Systems Analyst',
    completionStatus: 'Incomplete',
    blockerCategory: 'NDA Pending',
    leavingDate: '2026-01-15',
    daysSinceLeaving: 109,
    hasBlockers: true
  },
  {
    id: '5',
    employeeId: 'EMP-20505',
    employeeName: 'Brown, Sarah',
    department: 'Admin',
    role: 'Ward Clerk',
    completionStatus: 'Complete',
    blockerCategory: 'None',
    leavingDate: '2026-03-20',
    daysSinceLeaving: 45,
    hasBlockers: false
  },
  {
    id: '6',
    employeeId: 'EMP-20506',
    employeeName: 'Taylor, James',
    department: 'Medical',
    role: 'Consultant Cardiologist',
    completionStatus: 'Complete',
    blockerCategory: 'None',
    leavingDate: '2026-04-30',
    daysSinceLeaving: 4,
    hasBlockers: false
  },
  {
    id: '7',
    employeeId: 'EMP-20507',
    employeeName: 'Davies, Helen',
    department: 'Nursing',
    role: 'Senior Charge Nurse',
    completionStatus: 'Partial',
    blockerCategory: 'None',
    leavingDate: '2026-04-18',
    daysSinceLeaving: 16,
    hasBlockers: false
  },
  {
    id: '8',
    employeeId: 'EMP-20508',
    employeeName: 'Wilson, Robert',
    department: 'Allied Health',
    role: 'Occupational Therapist',
    completionStatus: 'Incomplete',
    blockerCategory: 'Equipment Outstanding',
    leavingDate: '2026-03-07',
    daysSinceLeaving: 58,
    hasBlockers: true
  },
  {
    id: '9',
    employeeId: 'EMP-20509',
    employeeName: 'Evans, Catherine',
    department: 'Pharmacy',
    role: 'Clinical Pharmacist',
    completionStatus: 'Partial',
    blockerCategory: 'None',
    leavingDate: '2026-05-10',
    daysSinceLeaving: -6,
    hasBlockers: false
  },
  {
    id: '10',
    employeeId: 'EMP-20510',
    employeeName: 'Thomas, Michael',
    department: 'IT',
    role: 'Network Administrator',
    completionStatus: 'Incomplete',
    blockerCategory: 'Access Not Revoked',
    leavingDate: '2026-04-27',
    daysSinceLeaving: 7,
    hasBlockers: true
  },
  {
    id: '11',
    employeeId: 'EMP-20511',
    employeeName: 'Robinson, Emma',
    department: 'Pharmacy',
    role: 'Pharmacy Technician',
    completionStatus: 'Complete',
    blockerCategory: 'None',
    leavingDate: '2026-02-28',
    daysSinceLeaving: 65,
    hasBlockers: false
  },
  {
    id: '12',
    employeeId: 'EMP-20512',
    employeeName: 'Clark, George',
    department: 'Admin',
    role: 'Medical Secretary',
    completionStatus: 'Incomplete',
    blockerCategory: 'NDA Pending',
    leavingDate: '2026-05-20',
    daysSinceLeaving: -16,
    hasBlockers: true
  }
];

export { sampleEmployees };
