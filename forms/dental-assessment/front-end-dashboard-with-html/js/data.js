// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every DMFT category (caries-free through
// very-high) and every periodontal status, with NHS numbers in the
// canonical "NNN NNN NNNN" display form.

(function () {
'use strict';
window.DentalAssessmentDashboard = window.DentalAssessmentDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, John',
    dmftScore: 0,
    chiefComplaint: 'Routine check-up',
    periodontalStatus: 'Healthy'
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    dmftScore: 8,
    chiefComplaint: 'Toothache lower right',
    periodontalStatus: 'Gingivitis'
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    dmftScore: 15,
    chiefComplaint: 'Broken crown',
    periodontalStatus: 'Moderate periodontitis'
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    dmftScore: 3,
    chiefComplaint: 'Sensitivity to cold',
    periodontalStatus: 'Healthy'
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    dmftScore: 22,
    chiefComplaint: 'Multiple teeth pain',
    periodontalStatus: 'Severe periodontitis'
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    dmftScore: 1,
    chiefComplaint: 'Routine check-up',
    periodontalStatus: 'Healthy'
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    dmftScore: 12,
    chiefComplaint: 'Gum bleeding',
    periodontalStatus: 'Moderate periodontitis'
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    dmftScore: 6,
    chiefComplaint: 'Chipped front tooth',
    periodontalStatus: 'Mild gingivitis'
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    dmftScore: 18,
    chiefComplaint: 'Abscess upper left',
    periodontalStatus: 'Severe periodontitis'
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    dmftScore: 0,
    chiefComplaint: 'Scale and polish',
    periodontalStatus: 'Healthy'
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    dmftScore: 5,
    chiefComplaint: 'Wisdom tooth pain',
    periodontalStatus: 'Mild gingivitis'
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    dmftScore: 25,
    chiefComplaint: 'Full mouth rehabilitation',
    periodontalStatus: 'Severe periodontitis'
  }
];

window.DentalAssessmentDashboard.samplePatients = samplePatients;
})();
