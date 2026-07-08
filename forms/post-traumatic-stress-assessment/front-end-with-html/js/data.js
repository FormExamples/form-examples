// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every PCL-5 severity category, with a mix
// of probable DSM-5 diagnoses and ongoing-trauma flags. NHS numbers in the
// canonical "NNN NNN NNNN" display form.
//
// PCL-5 score bands (per AGENTS.md):
//   Minimal  : 0-20
//   Mild     : 21-32
//   Moderate : 33-37 (probable PTSD threshold)
//   Severe   : 38-80

(function () {
'use strict';
window.PostTraumaticStressAssessmentDashboard =
  window.PostTraumaticStressAssessmentDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Jane',
    pcl5Score: 12,
    severityCategory: 'Minimal',
    probableDsm5Diagnosis: false,
    ongoingTraumaFlag: false
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    pcl5Score: 27,
    severityCategory: 'Mild',
    probableDsm5Diagnosis: false,
    ongoingTraumaFlag: false
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    pcl5Score: 35,
    severityCategory: 'Moderate',
    probableDsm5Diagnosis: true,
    ongoingTraumaFlag: false
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    pcl5Score: 8,
    severityCategory: 'Minimal',
    probableDsm5Diagnosis: false,
    ongoingTraumaFlag: false
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    pcl5Score: 62,
    severityCategory: 'Severe',
    probableDsm5Diagnosis: true,
    ongoingTraumaFlag: true
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    pcl5Score: 18,
    severityCategory: 'Minimal',
    probableDsm5Diagnosis: false,
    ongoingTraumaFlag: false
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    pcl5Score: 54,
    severityCategory: 'Severe',
    probableDsm5Diagnosis: true,
    ongoingTraumaFlag: true
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    pcl5Score: 30,
    severityCategory: 'Mild',
    probableDsm5Diagnosis: false,
    ongoingTraumaFlag: false
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    pcl5Score: 37,
    severityCategory: 'Moderate',
    probableDsm5Diagnosis: true,
    ongoingTraumaFlag: false
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    pcl5Score: 22,
    severityCategory: 'Mild',
    probableDsm5Diagnosis: false,
    ongoingTraumaFlag: true
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    pcl5Score: 44,
    severityCategory: 'Severe',
    probableDsm5Diagnosis: true,
    ongoingTraumaFlag: false
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    pcl5Score: 71,
    severityCategory: 'Severe',
    probableDsm5Diagnosis: true,
    ongoingTraumaFlag: true
  }
];

window.PostTraumaticStressAssessmentDashboard.samplePatients = samplePatients;
})();
