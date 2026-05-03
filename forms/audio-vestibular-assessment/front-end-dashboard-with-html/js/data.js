// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every WHO hearing-loss grade and every DHI
// handicap level, with vestibular involvement flagged for a subset; NHS
// numbers in the canonical "NNN NNN NNNN" display form.

(function () {
'use strict';
window.AudioVestibularAssessmentDashboard =
  window.AudioVestibularAssessmentDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Jane',
    hearingLossGrade: 'Normal',
    dhiScore: 4,
    dhiHandicapLevel: 'No Handicap',
    vestibularFlag: false
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    hearingLossGrade: 'Mild',
    dhiScore: 22,
    dhiHandicapLevel: 'Mild',
    vestibularFlag: true
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    hearingLossGrade: 'Moderate',
    dhiScore: 44,
    dhiHandicapLevel: 'Moderate',
    vestibularFlag: false
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    hearingLossGrade: 'Mild',
    dhiScore: 12,
    dhiHandicapLevel: 'No Handicap',
    vestibularFlag: false
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    hearingLossGrade: 'Profound',
    dhiScore: 78,
    dhiHandicapLevel: 'Severe',
    vestibularFlag: true
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    hearingLossGrade: 'Normal',
    dhiScore: 0,
    dhiHandicapLevel: 'No Handicap',
    vestibularFlag: false
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    hearingLossGrade: 'Severe',
    dhiScore: 62,
    dhiHandicapLevel: 'Severe',
    vestibularFlag: true
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    hearingLossGrade: 'Moderately Severe',
    dhiScore: 38,
    dhiHandicapLevel: 'Moderate',
    vestibularFlag: false
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    hearingLossGrade: 'Moderate',
    dhiScore: 30,
    dhiHandicapLevel: 'Mild',
    vestibularFlag: false
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    hearingLossGrade: 'Mild',
    dhiScore: 8,
    dhiHandicapLevel: 'No Handicap',
    vestibularFlag: false
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    hearingLossGrade: 'Moderately Severe',
    dhiScore: 50,
    dhiHandicapLevel: 'Moderate',
    vestibularFlag: true
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    hearingLossGrade: 'Severe',
    dhiScore: 70,
    dhiHandicapLevel: 'Severe',
    vestibularFlag: true
  }
];

window.AudioVestibularAssessmentDashboard.samplePatients = samplePatients;
})();
