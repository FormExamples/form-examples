// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every combined-severity band (no-sad / mild /
// moderate / severe / critical), every seasonal pattern (Winter / Summer /
// Non-seasonal), every treatment modality (None / Light Therapy / SSRI /
// CBT), and a mix of suicidal-risk safety flags. NHS numbers in the
// canonical "NNN NNN NNNN" display form.

(function () {
'use strict';
window.SeasonalAffectiveDisorderAssessmentDashboard =
  window.SeasonalAffectiveDisorderAssessmentDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Jane',
    gssScore: 4,
    phq9Score: 2,
    combinedSeverity: 'no-sad',
    seasonalPattern: 'Non-seasonal',
    treatmentStatus: 'None',
    suicidalRiskFlag: false
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    gssScore: 9,
    phq9Score: 6,
    combinedSeverity: 'mild',
    seasonalPattern: 'Winter',
    treatmentStatus: 'Light Therapy',
    suicidalRiskFlag: false
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    gssScore: 14,
    phq9Score: 12,
    combinedSeverity: 'moderate',
    seasonalPattern: 'Winter',
    treatmentStatus: 'SSRI',
    suicidalRiskFlag: false
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    gssScore: 18,
    phq9Score: 17,
    combinedSeverity: 'severe',
    seasonalPattern: 'Winter',
    treatmentStatus: 'SSRI',
    suicidalRiskFlag: false
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    gssScore: 22,
    phq9Score: 24,
    combinedSeverity: 'critical',
    seasonalPattern: 'Winter',
    treatmentStatus: 'SSRI',
    suicidalRiskFlag: true
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    gssScore: 6,
    phq9Score: 3,
    combinedSeverity: 'no-sad',
    seasonalPattern: 'Non-seasonal',
    treatmentStatus: 'None',
    suicidalRiskFlag: false
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    gssScore: 19,
    phq9Score: 21,
    combinedSeverity: 'critical',
    seasonalPattern: 'Winter',
    treatmentStatus: 'CBT',
    suicidalRiskFlag: true
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    gssScore: 10,
    phq9Score: 8,
    combinedSeverity: 'mild',
    seasonalPattern: 'Summer',
    treatmentStatus: 'CBT',
    suicidalRiskFlag: false
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    gssScore: 15,
    phq9Score: 13,
    combinedSeverity: 'moderate',
    seasonalPattern: 'Winter',
    treatmentStatus: 'Light Therapy',
    suicidalRiskFlag: false
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    gssScore: 12,
    phq9Score: 16,
    combinedSeverity: 'severe',
    seasonalPattern: 'Summer',
    treatmentStatus: 'SSRI',
    suicidalRiskFlag: false
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    gssScore: 13,
    phq9Score: 11,
    combinedSeverity: 'moderate',
    seasonalPattern: 'Winter',
    treatmentStatus: 'CBT',
    suicidalRiskFlag: false
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    gssScore: 21,
    phq9Score: 23,
    combinedSeverity: 'critical',
    seasonalPattern: 'Winter',
    treatmentStatus: 'None',
    suicidalRiskFlag: true
  }
];

window.SeasonalAffectiveDisorderAssessmentDashboard.samplePatients =
  samplePatients;
})();
