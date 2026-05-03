// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every hearing-grade band, every affected-ear
// classification, every hearing-loss type, and every hearing-aid status,
// with tinnitus flagged for a subset; NHS numbers in the canonical
// "NNN NNN NNNN" display form.

(function () {
'use strict';
window.AudiologyAssessmentDashboard = window.AudiologyAssessmentDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, John',
    hearingGrade: 'normal',
    affectedEar: 'N/A',
    hearingLossType: 'N/A',
    tinnitus: false,
    hearingAidStatus: 'None'
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    hearingGrade: 'mild',
    affectedEar: 'Both',
    hearingLossType: 'Sensorineural',
    tinnitus: true,
    hearingAidStatus: 'Candidate'
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    hearingGrade: 'moderate',
    affectedEar: 'Right',
    hearingLossType: 'Conductive',
    tinnitus: false,
    hearingAidStatus: 'Fitted'
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    hearingGrade: 'severe',
    affectedEar: 'Both',
    hearingLossType: 'Mixed',
    tinnitus: true,
    hearingAidStatus: 'Fitted'
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    hearingGrade: 'profound',
    affectedEar: 'Left',
    hearingLossType: 'Sensorineural',
    tinnitus: true,
    hearingAidStatus: 'Cochlear implant candidate'
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    hearingGrade: 'mild',
    affectedEar: 'Right',
    hearingLossType: 'Conductive',
    tinnitus: false,
    hearingAidStatus: 'None'
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    hearingGrade: 'moderate',
    affectedEar: 'Both',
    hearingLossType: 'Sensorineural',
    tinnitus: true,
    hearingAidStatus: 'Fitted'
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    hearingGrade: 'normal',
    affectedEar: 'N/A',
    hearingLossType: 'N/A',
    tinnitus: true,
    hearingAidStatus: 'None'
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    hearingGrade: 'severe',
    affectedEar: 'Both',
    hearingLossType: 'Sensorineural',
    tinnitus: false,
    hearingAidStatus: 'Fitted'
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    hearingGrade: 'mild',
    affectedEar: 'Left',
    hearingLossType: 'Conductive',
    tinnitus: false,
    hearingAidStatus: 'Candidate'
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    hearingGrade: 'moderate',
    affectedEar: 'Both',
    hearingLossType: 'Mixed',
    tinnitus: true,
    hearingAidStatus: 'Fitted'
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    hearingGrade: 'profound',
    affectedEar: 'Both',
    hearingLossType: 'Sensorineural',
    tinnitus: false,
    hearingAidStatus: 'Cochlear implant candidate'
  }
];

window.AudiologyAssessmentDashboard.samplePatients = samplePatients;
})();
