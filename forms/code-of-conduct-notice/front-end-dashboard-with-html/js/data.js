// Sample staff data for the compliance dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every acknowledgement status (acknowledged,
// pending, overdue, declined), every department (Nursing, Medical, Admin,
// Allied Health, IT, Pharmacy), and a mix of conflict-of-interest
// declarations and training currency bands.

(function () {
'use strict';
window.CodeOfConductNoticeDashboard = window.CodeOfConductNoticeDashboard || {};

/** @type {import('./types.js').StaffRow[]} */
const sampleStaff = [
  {
    id: '1',
    employeeId: 'EMP-10042',
    staffName: 'Smith, Jane',
    department: 'Nursing',
    role: 'Registered Nurse',
    acknowledgementStatus: 'Acknowledged',
    lastSignOffDate: '2026-02-14',
    conflictOfInterestDeclared: false,
    trainingCurrency: 'Current'
  },
  {
    id: '2',
    employeeId: 'EMP-10128',
    staffName: 'Patel, Priya',
    department: 'Medical',
    role: 'Consultant Physician',
    acknowledgementStatus: 'Acknowledged',
    lastSignOffDate: '2026-01-09',
    conflictOfInterestDeclared: true,
    trainingCurrency: 'Current'
  },
  {
    id: '3',
    employeeId: 'EMP-10215',
    staffName: 'Jones, Margaret',
    department: 'Admin',
    role: 'Records Officer',
    acknowledgementStatus: 'Overdue',
    lastSignOffDate: '2024-11-03',
    conflictOfInterestDeclared: false,
    trainingCurrency: 'Expired'
  },
  {
    id: '4',
    employeeId: 'EMP-10309',
    staffName: 'Williams, David',
    department: 'Allied Health',
    role: 'Physiotherapist',
    acknowledgementStatus: 'Pending',
    lastSignOffDate: '2025-03-22',
    conflictOfInterestDeclared: false,
    trainingCurrency: 'Due Soon'
  },
  {
    id: '5',
    employeeId: 'EMP-10417',
    staffName: 'Brown, Sarah',
    department: 'IT',
    role: 'Systems Administrator',
    acknowledgementStatus: 'Declined',
    lastSignOffDate: '2024-08-15',
    conflictOfInterestDeclared: true,
    trainingCurrency: 'Expired'
  },
  {
    id: '6',
    employeeId: 'EMP-10503',
    staffName: 'Taylor, James',
    department: 'Pharmacy',
    role: 'Clinical Pharmacist',
    acknowledgementStatus: 'Acknowledged',
    lastSignOffDate: '2026-04-02',
    conflictOfInterestDeclared: false,
    trainingCurrency: 'Current'
  },
  {
    id: '7',
    employeeId: 'EMP-10611',
    staffName: 'Davies, Helen',
    department: 'Nursing',
    role: 'Nurse Practitioner',
    acknowledgementStatus: 'Overdue',
    lastSignOffDate: '2024-10-19',
    conflictOfInterestDeclared: true,
    trainingCurrency: 'Expired'
  },
  {
    id: '8',
    employeeId: 'EMP-10728',
    staffName: 'Wilson, Robert',
    department: 'Medical',
    role: 'Resident Physician',
    acknowledgementStatus: 'Pending',
    lastSignOffDate: '2025-04-30',
    conflictOfInterestDeclared: false,
    trainingCurrency: 'Due Soon'
  },
  {
    id: '9',
    employeeId: 'EMP-10832',
    staffName: 'Evans, Catherine',
    department: 'Allied Health',
    role: 'Occupational Therapist',
    acknowledgementStatus: 'Acknowledged',
    lastSignOffDate: '2025-12-08',
    conflictOfInterestDeclared: false,
    trainingCurrency: 'Current'
  },
  {
    id: '10',
    employeeId: 'EMP-10947',
    staffName: 'Thomas, Michael',
    department: 'Admin',
    role: 'Department Manager',
    acknowledgementStatus: 'Acknowledged',
    lastSignOffDate: '2026-03-17',
    conflictOfInterestDeclared: true,
    trainingCurrency: 'Current'
  },
  {
    id: '11',
    employeeId: 'EMP-11055',
    staffName: 'Robinson, Emma',
    department: 'IT',
    role: 'Application Analyst',
    acknowledgementStatus: 'Pending',
    lastSignOffDate: '',
    conflictOfInterestDeclared: false,
    trainingCurrency: 'Expired'
  },
  {
    id: '12',
    employeeId: 'EMP-11163',
    staffName: 'Clark, George',
    department: 'Pharmacy',
    role: 'Pharmacy Technician',
    acknowledgementStatus: 'Declined',
    lastSignOffDate: '2024-07-26',
    conflictOfInterestDeclared: false,
    trainingCurrency: 'Expired'
  }
];

window.CodeOfConductNoticeDashboard.sampleStaff = sampleStaff;
})();
