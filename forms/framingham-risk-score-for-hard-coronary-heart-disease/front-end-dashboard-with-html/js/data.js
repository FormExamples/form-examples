// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: span every risk category, both sexes, and a mix of
// smokers / non-smokers. NHS numbers in the canonical "NNN NNN NNNN" form;
// ages within the Framingham-Hard-CHD validated range (30-79).

(function () {
'use strict';
window.FraminghamRiskScoreDashboard = window.FraminghamRiskScoreDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Jane',
    age: 42,
    sex: 'female',
    tenYearRiskPercent: 2.4,
    riskCategory: 'Low',
    smokerFlag: false
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    age: 55,
    sex: 'female',
    tenYearRiskPercent: 8.1,
    riskCategory: 'Low',
    smokerFlag: false
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    age: 68,
    sex: 'female',
    tenYearRiskPercent: 14.7,
    riskCategory: 'Intermediate',
    smokerFlag: true
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    age: 51,
    sex: 'male',
    tenYearRiskPercent: 9.6,
    riskCategory: 'Low',
    smokerFlag: false
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    age: 64,
    sex: 'female',
    tenYearRiskPercent: 22.5,
    riskCategory: 'High',
    smokerFlag: true
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    age: 39,
    sex: 'male',
    tenYearRiskPercent: 3.2,
    riskCategory: 'Low',
    smokerFlag: false
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    age: 72,
    sex: 'female',
    tenYearRiskPercent: 28.9,
    riskCategory: 'High',
    smokerFlag: true
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    age: 58,
    sex: 'male',
    tenYearRiskPercent: 16.3,
    riskCategory: 'Intermediate',
    smokerFlag: false
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    age: 47,
    sex: 'female',
    tenYearRiskPercent: 6.8,
    riskCategory: 'Low',
    smokerFlag: true
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    age: 61,
    sex: 'male',
    tenYearRiskPercent: 19.4,
    riskCategory: 'Intermediate',
    smokerFlag: false
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    age: 35,
    sex: 'female',
    tenYearRiskPercent: 1.1,
    riskCategory: 'Low',
    smokerFlag: false
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    age: 76,
    sex: 'male',
    tenYearRiskPercent: 31.7,
    riskCategory: 'High',
    smokerFlag: true
  }
];

window.FraminghamRiskScoreDashboard.samplePatients = samplePatients;
})();
