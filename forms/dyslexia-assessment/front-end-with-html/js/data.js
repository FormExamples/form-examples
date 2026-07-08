// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every severity level and reading-severity
// band, with first-degree family history flagged for a subset; NHS numbers
// in the canonical "NNN NNN NNNN" display form.

(function () {
'use strict';
window.DyslexiaAssessmentDashboard = window.DyslexiaAssessmentDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Jane',
    standardScore: 108,
    severityLevel: 'No Dyslexia',
    readingSeverity: 'Average',
    familyHistoryFlag: false
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    standardScore: 82,
    severityLevel: 'Mild',
    readingSeverity: 'Below Average',
    familyHistoryFlag: true
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    standardScore: 64,
    severityLevel: 'Moderate',
    readingSeverity: 'Well Below Average',
    familyHistoryFlag: false
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    standardScore: 96,
    severityLevel: 'No Dyslexia',
    readingSeverity: 'Average',
    familyHistoryFlag: false
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    standardScore: 51,
    severityLevel: 'Severe',
    readingSeverity: 'Significantly Below Average',
    familyHistoryFlag: true
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    standardScore: 112,
    severityLevel: 'No Dyslexia',
    readingSeverity: 'Average',
    familyHistoryFlag: false
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    standardScore: 53,
    severityLevel: 'Severe',
    readingSeverity: 'Significantly Below Average',
    familyHistoryFlag: true
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    standardScore: 78,
    severityLevel: 'Mild',
    readingSeverity: 'Below Average',
    familyHistoryFlag: false
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    standardScore: 67,
    severityLevel: 'Moderate',
    readingSeverity: 'Well Below Average',
    familyHistoryFlag: true
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    standardScore: 101,
    severityLevel: 'No Dyslexia',
    readingSeverity: 'Average',
    familyHistoryFlag: false
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    standardScore: 84,
    severityLevel: 'Mild',
    readingSeverity: 'Below Average',
    familyHistoryFlag: true
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    standardScore: 48,
    severityLevel: 'Severe',
    readingSeverity: 'Significantly Below Average',
    familyHistoryFlag: false
  }
];

window.DyslexiaAssessmentDashboard.samplePatients = samplePatients;
})();
