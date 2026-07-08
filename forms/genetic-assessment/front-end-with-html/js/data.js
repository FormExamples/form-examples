// Sample proband data for the clinician dashboard.
//
// Twelve realistic rows spanning the three risk levels (Low / Moderate /
// High) and a mix of presenting concerns: breast/ovarian, colorectal/Lynch,
// cardiovascular, neurological, paediatric, and reproductive. Family-history
// affected counts and Manchester Scores reflect plausible clinical scenarios
// for cancer-genetics referrals. Manchester Score is `null` for non-BRCA
// concerns.
//
// NHS numbers are in the canonical "NNN NNN NNNN" display form.

(function () {
'use strict';
window.GeneticAssessmentDashboard = window.GeneticAssessmentDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, John',
    riskLevel: 'Low',
    riskScore: 1,
    presentingConcern: 'Reproductive',
    familyAffectedCount: 0,
    manchesterScore: null,
    recommendation: 'Routine follow-up'
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    riskLevel: 'High',
    riskScore: 9,
    presentingConcern: 'Breast/Ovarian Cancer',
    familyAffectedCount: 4,
    manchesterScore: 22,
    recommendation: 'Panel testing'
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    riskLevel: 'Moderate',
    riskScore: 4,
    presentingConcern: 'Reproductive',
    familyAffectedCount: 1,
    manchesterScore: null,
    recommendation: 'Genetic counselling'
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    riskLevel: 'High',
    riskScore: 7,
    presentingConcern: 'Neurological',
    familyAffectedCount: 3,
    manchesterScore: null,
    recommendation: 'Predictive testing'
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    riskLevel: 'High',
    riskScore: 11,
    presentingConcern: 'Breast/Ovarian Cancer',
    familyAffectedCount: 5,
    manchesterScore: 28,
    recommendation: 'Urgent counselling'
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    riskLevel: 'Low',
    riskScore: 0,
    presentingConcern: 'Reproductive',
    familyAffectedCount: 0,
    manchesterScore: null,
    recommendation: 'Routine follow-up'
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    riskLevel: 'Moderate',
    riskScore: 5,
    presentingConcern: 'Colorectal/Lynch',
    familyAffectedCount: 2,
    manchesterScore: null,
    recommendation: 'Genetic counselling'
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    riskLevel: 'High',
    riskScore: 8,
    presentingConcern: 'Cardiovascular',
    familyAffectedCount: 3,
    manchesterScore: null,
    recommendation: 'Urgent counselling'
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    riskLevel: 'Moderate',
    riskScore: 4,
    presentingConcern: 'Breast/Ovarian Cancer',
    familyAffectedCount: 2,
    manchesterScore: 15,
    recommendation: 'Genetic counselling'
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    riskLevel: 'Low',
    riskScore: 2,
    presentingConcern: 'Paediatric',
    familyAffectedCount: 0,
    manchesterScore: null,
    recommendation: 'Routine follow-up'
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    riskLevel: 'High',
    riskScore: 12,
    presentingConcern: 'Breast/Ovarian Cancer',
    familyAffectedCount: 6,
    manchesterScore: 31,
    recommendation: 'Panel testing'
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    riskLevel: 'Moderate',
    riskScore: 3,
    presentingConcern: 'Paediatric',
    familyAffectedCount: 1,
    manchesterScore: null,
    recommendation: 'Genetic counselling'
  }
];

window.GeneticAssessmentDashboard.samplePatients = samplePatients;
})();
