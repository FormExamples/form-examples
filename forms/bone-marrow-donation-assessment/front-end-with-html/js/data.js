// Sample donor data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every eligibility classification and risk
// level, with a mix of HLA match grades and collection-method
// recommendations; NHS numbers in the canonical "NNN NNN NNNN" display form.

(function () {
'use strict';
window.BoneMarrowDonationAssessmentDashboard =
  window.BoneMarrowDonationAssessmentDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Jane',
    hlaMatch: '10/10',
    eligibility: 'Suitable',
    riskLevel: 'Low',
    collectionMethod: 'PBSC'
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    hlaMatch: '10/10',
    eligibility: 'Suitable',
    riskLevel: 'Low',
    collectionMethod: 'Either'
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    hlaMatch: '9/10',
    eligibility: 'Conditionally Suitable',
    riskLevel: 'Moderate',
    collectionMethod: 'PBSC'
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    hlaMatch: '10/10',
    eligibility: 'Suitable',
    riskLevel: 'Low',
    collectionMethod: 'Marrow'
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    hlaMatch: '7/10',
    eligibility: 'Unsuitable',
    riskLevel: 'Critical',
    collectionMethod: 'Neither'
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    hlaMatch: '10/10',
    eligibility: 'Suitable',
    riskLevel: 'Low',
    collectionMethod: 'PBSC'
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    hlaMatch: '<7/10',
    eligibility: 'Unsuitable',
    riskLevel: 'Critical',
    collectionMethod: 'Neither'
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    hlaMatch: '9/10',
    eligibility: 'Conditionally Suitable',
    riskLevel: 'Moderate',
    collectionMethod: 'Either'
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    hlaMatch: '8/10',
    eligibility: 'Conditionally Suitable',
    riskLevel: 'High',
    collectionMethod: 'Marrow'
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    hlaMatch: '10/10',
    eligibility: 'Suitable',
    riskLevel: 'Low',
    collectionMethod: 'PBSC'
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    hlaMatch: '8/10',
    eligibility: 'Conditionally Suitable',
    riskLevel: 'High',
    collectionMethod: 'PBSC'
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    hlaMatch: '7/10',
    eligibility: 'Unsuitable',
    riskLevel: 'Critical',
    collectionMethod: 'Neither'
  }
];

window.BoneMarrowDonationAssessmentDashboard.samplePatients = samplePatients;
})();
