// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every severity band and priority level, with
// red-flag features flagged for a subset; NHS numbers in the canonical
// "NNN NNN NNNN" display form.
//
// SNOT-22 severity bands (from the form spec):
//   Mild      0-7
//   Moderate  8-19
//   Severe    20+

(function () {
'use strict';
window.OtolaryngologyAssessmentDashboard =
  window.OtolaryngologyAssessmentDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Jane',
    snot22Score: 4,
    severity: 'Mild',
    priority: 'Routine',
    redFlag: false
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    snot22Score: 12,
    severity: 'Moderate',
    priority: 'Soon',
    redFlag: false
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    snot22Score: 47,
    severity: 'Severe',
    priority: 'Urgent',
    redFlag: true
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    snot22Score: 9,
    severity: 'Moderate',
    priority: 'Routine',
    redFlag: false
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    snot22Score: 78,
    severity: 'Severe',
    priority: 'Urgent',
    redFlag: true
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    snot22Score: 2,
    severity: 'Mild',
    priority: 'Routine',
    redFlag: false
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    snot22Score: 33,
    severity: 'Severe',
    priority: 'Urgent',
    redFlag: false
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    snot22Score: 17,
    severity: 'Moderate',
    priority: 'Soon',
    redFlag: false
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    snot22Score: 25,
    severity: 'Severe',
    priority: 'Soon',
    redFlag: true
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    snot22Score: 6,
    severity: 'Mild',
    priority: 'Routine',
    redFlag: false
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    snot22Score: 14,
    severity: 'Moderate',
    priority: 'Soon',
    redFlag: false
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    snot22Score: 92,
    severity: 'Severe',
    priority: 'Urgent',
    redFlag: true
  }
];

window.OtolaryngologyAssessmentDashboard.samplePatients = samplePatients;
})();
