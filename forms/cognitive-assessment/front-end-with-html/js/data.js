// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every cognitive level, every age band, and
// every referral source; NHS numbers in the canonical "NNN NNN NNNN"
// display form.

(function () {
'use strict';
window.CognitiveAssessmentDashboard = window.CognitiveAssessmentDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, John',
    mmseScore: 28,
    cognitiveLevel: 'Normal cognition',
    ageGroup: '65-74',
    referralSource: 'GP'
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    mmseScore: 21,
    cognitiveLevel: 'Mild cognitive impairment',
    ageGroup: '75-84',
    referralSource: 'Neurologist'
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    mmseScore: 14,
    cognitiveLevel: 'Moderate cognitive impairment',
    ageGroup: '85+',
    referralSource: 'Geriatrician'
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    mmseScore: 30,
    cognitiveLevel: 'Normal cognition',
    ageGroup: '65-74',
    referralSource: 'GP'
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    mmseScore: 7,
    cognitiveLevel: 'Severe cognitive impairment',
    ageGroup: '85+',
    referralSource: 'Psychiatrist'
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    mmseScore: 24,
    cognitiveLevel: 'Normal cognition',
    ageGroup: '75-84',
    referralSource: 'GP'
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    mmseScore: 19,
    cognitiveLevel: 'Mild cognitive impairment',
    ageGroup: '75-84',
    referralSource: 'Family'
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    mmseScore: 26,
    cognitiveLevel: 'Normal cognition',
    ageGroup: '65-74',
    referralSource: 'Self'
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    mmseScore: 12,
    cognitiveLevel: 'Moderate cognitive impairment',
    ageGroup: '85+',
    referralSource: 'Geriatrician'
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    mmseScore: 29,
    cognitiveLevel: 'Normal cognition',
    ageGroup: '55-64',
    referralSource: 'GP'
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    mmseScore: 16,
    cognitiveLevel: 'Moderate cognitive impairment',
    ageGroup: '75-84',
    referralSource: 'Neurologist'
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    mmseScore: 5,
    cognitiveLevel: 'Severe cognitive impairment',
    ageGroup: '85+',
    referralSource: 'Geriatrician'
  }
];

window.CognitiveAssessmentDashboard.samplePatients = samplePatients;
})();
