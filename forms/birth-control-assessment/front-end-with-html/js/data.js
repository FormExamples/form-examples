// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every UK MEC category and DVT/CVD risk band,
// with migraine-with-aura flagged for a subset; NHS numbers in the canonical
// "NNN NNN NNNN" display form.

(function () {
'use strict';
window.BirthControlAssessmentDashboard = window.BirthControlAssessmentDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Jane',
    mecCategory: 'UK MEC 1',
    methodRecommended: 'Combined oral contraceptive',
    dvtRisk: 'Low',
    cvdRisk: 'Low',
    migraineWithAuraFlag: false
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    mecCategory: 'UK MEC 2',
    methodRecommended: 'Progestogen-only pill',
    dvtRisk: 'Low',
    cvdRisk: 'Moderate',
    migraineWithAuraFlag: false
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    mecCategory: 'UK MEC 4',
    methodRecommended: 'Copper IUD',
    dvtRisk: 'High',
    cvdRisk: 'High',
    migraineWithAuraFlag: true
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    mecCategory: 'UK MEC 1',
    methodRecommended: 'Condom',
    dvtRisk: 'Low',
    cvdRisk: 'Low',
    migraineWithAuraFlag: false
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    mecCategory: 'UK MEC 3',
    methodRecommended: 'Levonorgestrel IUS',
    dvtRisk: 'Moderate',
    cvdRisk: 'High',
    migraineWithAuraFlag: false
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    mecCategory: 'UK MEC 1',
    methodRecommended: 'Combined oral contraceptive',
    dvtRisk: 'Low',
    cvdRisk: 'Low',
    migraineWithAuraFlag: false
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    mecCategory: 'UK MEC 4',
    methodRecommended: 'Progestogen-only implant',
    dvtRisk: 'High',
    cvdRisk: 'Moderate',
    migraineWithAuraFlag: true
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    mecCategory: 'UK MEC 2',
    methodRecommended: 'Combined hormonal patch',
    dvtRisk: 'Moderate',
    cvdRisk: 'Moderate',
    migraineWithAuraFlag: false
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    mecCategory: 'UK MEC 3',
    methodRecommended: 'Depot medroxyprogesterone acetate',
    dvtRisk: 'Moderate',
    cvdRisk: 'High',
    migraineWithAuraFlag: false
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    mecCategory: 'UK MEC 2',
    methodRecommended: 'Progestogen-only pill',
    dvtRisk: 'Low',
    cvdRisk: 'Moderate',
    migraineWithAuraFlag: false
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    mecCategory: 'UK MEC 3',
    methodRecommended: 'Copper IUD',
    dvtRisk: 'High',
    cvdRisk: 'Moderate',
    migraineWithAuraFlag: true
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    mecCategory: 'UK MEC 4',
    methodRecommended: 'Levonorgestrel IUS',
    dvtRisk: 'High',
    cvdRisk: 'High',
    migraineWithAuraFlag: true
  }
];

window.BirthControlAssessmentDashboard.samplePatients = samplePatients;
})();
