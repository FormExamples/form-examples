// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every Braden risk band, with wound presence
// and a range of pressure-ulcer stages flagged for a subset; NHS numbers in
// the canonical "NNN NNN NNNN" display form.

(function () {
'use strict';
window.IntegumentaryAssessmentDashboard =
  window.IntegumentaryAssessmentDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Jane',
    bradenScore: 22,
    riskLevel: 'No Risk',
    woundPresent: false,
    highestWoundStage: 'None'
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    bradenScore: 20,
    riskLevel: 'No Risk',
    woundPresent: false,
    highestWoundStage: 'None'
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    bradenScore: 17,
    riskLevel: 'Mild Risk',
    woundPresent: true,
    highestWoundStage: 'Stage 1'
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    bradenScore: 18,
    riskLevel: 'Mild Risk',
    woundPresent: false,
    highestWoundStage: 'None'
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    bradenScore: 14,
    riskLevel: 'Moderate Risk',
    woundPresent: true,
    highestWoundStage: 'Stage 2'
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    bradenScore: 23,
    riskLevel: 'No Risk',
    woundPresent: false,
    highestWoundStage: 'None'
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    bradenScore: 11,
    riskLevel: 'High Risk',
    woundPresent: true,
    highestWoundStage: 'Stage 3'
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    bradenScore: 13,
    riskLevel: 'Moderate Risk',
    woundPresent: true,
    highestWoundStage: 'Stage 1'
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    bradenScore: 16,
    riskLevel: 'Mild Risk',
    woundPresent: true,
    highestWoundStage: 'Stage 2'
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    bradenScore: 19,
    riskLevel: 'No Risk',
    woundPresent: false,
    highestWoundStage: 'None'
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    bradenScore: 12,
    riskLevel: 'High Risk',
    woundPresent: true,
    highestWoundStage: 'Unstageable'
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    bradenScore: 8,
    riskLevel: 'Very High Risk',
    woundPresent: true,
    highestWoundStage: 'Stage 4'
  }
];

window.IntegumentaryAssessmentDashboard.samplePatients = samplePatients;
})();
