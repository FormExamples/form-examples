// Sample patient data for the Patient Satisfaction Survey clinician
// dashboard.
//
// Twelve realistic rows: spans every satisfaction category and every
// visit department, with the would-recommend flag mixed across the set;
// NHS numbers in the canonical "NNN NNN NNNN" display form. The page
// falls back to this data when the backend is unreachable so a clinician
// can still demo and review the dashboard offline.

(function () {
'use strict';
window.PatientSatisfactionSurveyDashboard =
  window.PatientSatisfactionSurveyDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Jane',
    visitDepartment: 'General Practice',
    satisfactionScore: 92,
    satisfactionCategory: 'Excellent',
    recommendFlag: true
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    visitDepartment: 'Outpatient',
    satisfactionScore: 88,
    satisfactionCategory: 'Excellent',
    recommendFlag: true
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    visitDepartment: 'Emergency',
    satisfactionScore: 41,
    satisfactionCategory: 'Poor',
    recommendFlag: false
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    visitDepartment: 'Inpatient',
    satisfactionScore: 76,
    satisfactionCategory: 'Good',
    recommendFlag: true
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    visitDepartment: 'Emergency',
    satisfactionScore: 18,
    satisfactionCategory: 'Very Poor',
    recommendFlag: false
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    visitDepartment: 'Day Surgery',
    satisfactionScore: 95,
    satisfactionCategory: 'Excellent',
    recommendFlag: true
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    visitDepartment: 'Inpatient',
    satisfactionScore: 22,
    satisfactionCategory: 'Very Poor',
    recommendFlag: false
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    visitDepartment: 'Outpatient',
    satisfactionScore: 64,
    satisfactionCategory: 'Satisfactory',
    recommendFlag: true
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    visitDepartment: 'Maternity',
    satisfactionScore: 81,
    satisfactionCategory: 'Good',
    recommendFlag: true
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    visitDepartment: 'General Practice',
    satisfactionScore: 57,
    satisfactionCategory: 'Satisfactory',
    recommendFlag: false
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    visitDepartment: 'Maternity',
    satisfactionScore: 73,
    satisfactionCategory: 'Good',
    recommendFlag: true
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    visitDepartment: 'Day Surgery',
    satisfactionScore: 38,
    satisfactionCategory: 'Poor',
    recommendFlag: false
  }
];

window.PatientSatisfactionSurveyDashboard.samplePatients = samplePatients;
})();
