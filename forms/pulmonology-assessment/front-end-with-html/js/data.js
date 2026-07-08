// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show similar demo content when the backend is offline.
// Twelve realistic rows: spans every GOLD stage (I..IV) and ABCD group
// (A/B/E), with allergy and oxygen-therapy flags for a subset; NHS numbers
// in the canonical "NNN NNN NNNN" display form.

(function () {
'use strict';
window.PulmonologyAssessmentDashboard = window.PulmonologyAssessmentDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, John',
    goldStage: 2,
    abcdGroup: 'B',
    allergyFlag: false,
    oxygenTherapy: false
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    goldStage: 3,
    abcdGroup: 'E',
    allergyFlag: true,
    oxygenTherapy: false
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    goldStage: 4,
    abcdGroup: 'E',
    allergyFlag: false,
    oxygenTherapy: true
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    goldStage: 1,
    abcdGroup: 'A',
    allergyFlag: false,
    oxygenTherapy: false
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    goldStage: 3,
    abcdGroup: 'E',
    allergyFlag: true,
    oxygenTherapy: true
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    goldStage: 2,
    abcdGroup: 'A',
    allergyFlag: false,
    oxygenTherapy: false
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    goldStage: 2,
    abcdGroup: 'B',
    allergyFlag: true,
    oxygenTherapy: false
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    goldStage: 4,
    abcdGroup: 'E',
    allergyFlag: false,
    oxygenTherapy: true
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    goldStage: 1,
    abcdGroup: 'A',
    allergyFlag: false,
    oxygenTherapy: false
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    goldStage: 3,
    abcdGroup: 'B',
    allergyFlag: false,
    oxygenTherapy: false
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    goldStage: 2,
    abcdGroup: 'B',
    allergyFlag: true,
    oxygenTherapy: false
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    goldStage: 4,
    abcdGroup: 'E',
    allergyFlag: false,
    oxygenTherapy: true
  }
];

window.PulmonologyAssessmentDashboard.samplePatients = samplePatients;
})();
