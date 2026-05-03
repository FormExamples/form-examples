// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every risk level (low / moderate / high /
// very-high), all three trimesters, and a mix of referred / non-referred
// statuses. NHS numbers in the canonical "NNN NNN NNNN" display form.

(function () {
'use strict';
window.PrenatalAssessmentDashboard = window.PrenatalAssessmentDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Emma',
    riskLevel: 'low',
    gestationalWeeks: 28,
    primaryConcern: 'Routine antenatal check',
    referralStatus: 'None'
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    riskLevel: 'high',
    gestationalWeeks: 34,
    primaryConcern: 'Gestational diabetes',
    referralStatus: 'Diabetic clinic'
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    riskLevel: 'very-high',
    gestationalWeeks: 32,
    primaryConcern: 'Preeclampsia signs',
    referralStatus: 'Urgent obstetric review'
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, Sarah',
    riskLevel: 'low',
    gestationalWeeks: 16,
    primaryConcern: 'Routine booking visit',
    referralStatus: 'None'
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Lisa',
    riskLevel: 'moderate',
    gestationalWeeks: 24,
    primaryConcern: 'Previous cesarean section',
    referralStatus: 'VBAC counselling'
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, Jessica',
    riskLevel: 'high',
    gestationalWeeks: 30,
    primaryConcern: 'Twin pregnancy',
    referralStatus: 'Multiple pregnancy clinic'
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    riskLevel: 'moderate',
    gestationalWeeks: 20,
    primaryConcern: 'Thyroid disorder',
    referralStatus: 'Endocrinology'
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Rebecca',
    riskLevel: 'low',
    gestationalWeeks: 12,
    primaryConcern: 'First trimester screening',
    referralStatus: 'None'
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    riskLevel: 'very-high',
    gestationalWeeks: 36,
    primaryConcern: 'Placenta previa with bleeding',
    referralStatus: 'Emergency obstetrics'
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michelle',
    riskLevel: 'low',
    gestationalWeeks: 38,
    primaryConcern: 'Pre-labour assessment',
    referralStatus: 'None'
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Fatima',
    riskLevel: 'high',
    gestationalWeeks: 26,
    primaryConcern: 'Rh-negative with antibodies',
    referralStatus: 'Haematology'
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, Amelia',
    riskLevel: 'moderate',
    gestationalWeeks: 22,
    primaryConcern: 'Previous preterm birth',
    referralStatus: 'Cervical length monitoring'
  }
];

window.PrenatalAssessmentDashboard.samplePatients = samplePatients;
})();
