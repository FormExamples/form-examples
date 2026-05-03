// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every severity category (Mild / Moderate /
// Severe / Profound), every communication-needs format, both capacity
// outcomes, and a mix of reasonable-adjustments flags. NHS numbers in the
// canonical "NNN NNN NNNN" display form.

(function () {
'use strict';
window.LearningDisabilityAssessmentDashboard = window.LearningDisabilityAssessmentDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Jane',
    severity: 'Mild',
    iqBand: '50-69',
    communicationNeed: 'Standard',
    capacityStatus: 'Has Capacity',
    reasonableAdjustmentsRequired: false
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    severity: 'Mild',
    iqBand: '50-69',
    communicationNeed: 'Easy-Read',
    capacityStatus: 'Has Capacity',
    reasonableAdjustmentsRequired: true
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    severity: 'Moderate',
    iqBand: '35-49',
    communicationNeed: 'Easy-Read',
    capacityStatus: 'Has Capacity',
    reasonableAdjustmentsRequired: true
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    severity: 'Moderate',
    iqBand: '35-49',
    communicationNeed: 'Makaton',
    capacityStatus: 'Lacks Capacity',
    reasonableAdjustmentsRequired: true
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    severity: 'Severe',
    iqBand: '20-34',
    communicationNeed: 'Makaton',
    capacityStatus: 'Lacks Capacity',
    reasonableAdjustmentsRequired: true
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    severity: 'Mild',
    iqBand: '50-69',
    communicationNeed: 'Standard',
    capacityStatus: 'Has Capacity',
    reasonableAdjustmentsRequired: false
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    severity: 'Profound',
    iqBand: '<20',
    communicationNeed: 'AAC',
    capacityStatus: 'Lacks Capacity',
    reasonableAdjustmentsRequired: true
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    severity: 'Moderate',
    iqBand: '35-49',
    communicationNeed: 'Easy-Read',
    capacityStatus: 'Has Capacity',
    reasonableAdjustmentsRequired: true
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    severity: 'Severe',
    iqBand: '20-34',
    communicationNeed: 'AAC',
    capacityStatus: 'Lacks Capacity',
    reasonableAdjustmentsRequired: true
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    severity: 'Mild',
    iqBand: '50-69',
    communicationNeed: 'Easy-Read',
    capacityStatus: 'Has Capacity',
    reasonableAdjustmentsRequired: false
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    severity: 'Moderate',
    iqBand: '35-49',
    communicationNeed: 'Makaton',
    capacityStatus: 'Has Capacity',
    reasonableAdjustmentsRequired: true
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    severity: 'Profound',
    iqBand: '<20',
    communicationNeed: 'AAC',
    capacityStatus: 'Lacks Capacity',
    reasonableAdjustmentsRequired: true
  }
];

window.LearningDisabilityAssessmentDashboard.samplePatients = samplePatients;
})();
