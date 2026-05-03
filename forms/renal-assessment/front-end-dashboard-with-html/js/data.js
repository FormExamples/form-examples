// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every GFR category (G1-G5), every albuminuria
// category (A1-A3), and every KDIGO composite-risk band; NHS numbers in the
// canonical "NNN NNN NNNN" display form.

(function () {
'use strict';
window.RenalAssessmentDashboard = window.RenalAssessmentDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Jane',
    egfr: 102,
    gfrCategory: 'G1',
    albuminuriaCategory: 'A1',
    compositeRisk: 'Low'
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    egfr: 78,
    gfrCategory: 'G2',
    albuminuriaCategory: 'A1',
    compositeRisk: 'Low'
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    egfr: 95,
    gfrCategory: 'G1',
    albuminuriaCategory: 'A2',
    compositeRisk: 'Moderate'
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    egfr: 68,
    gfrCategory: 'G2',
    albuminuriaCategory: 'A2',
    compositeRisk: 'Moderate'
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    egfr: 52,
    gfrCategory: 'G3a',
    albuminuriaCategory: 'A1',
    compositeRisk: 'Moderate'
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    egfr: 48,
    gfrCategory: 'G3a',
    albuminuriaCategory: 'A2',
    compositeRisk: 'High'
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    egfr: 38,
    gfrCategory: 'G3b',
    albuminuriaCategory: 'A1',
    compositeRisk: 'High'
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    egfr: 33,
    gfrCategory: 'G3b',
    albuminuriaCategory: 'A3',
    compositeRisk: 'Very High'
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    egfr: 24,
    gfrCategory: 'G4',
    albuminuriaCategory: 'A2',
    compositeRisk: 'Very High'
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    egfr: 19,
    gfrCategory: 'G4',
    albuminuriaCategory: 'A3',
    compositeRisk: 'Very High'
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    egfr: 12,
    gfrCategory: 'G5',
    albuminuriaCategory: 'A3',
    compositeRisk: 'Very High'
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    egfr: 88,
    gfrCategory: 'G2',
    albuminuriaCategory: 'A3',
    compositeRisk: 'High'
  }
];

window.RenalAssessmentDashboard.samplePatients = samplePatients;
})();
