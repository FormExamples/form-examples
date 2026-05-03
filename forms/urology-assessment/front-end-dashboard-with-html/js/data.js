// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every IPSS severity category and referral
// urgency band; NHS numbers in the canonical "NNN NNN NNNN" display form.

(function () {
'use strict';
window.UrologyAssessmentDashboard = window.UrologyAssessmentDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, John',
    ipssScore: 4,
    symptomSeverity: 'Mild',
    psaLevel: '1.2',
    referralUrgency: 'Routine'
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Raj',
    ipssScore: 15,
    symptomSeverity: 'Moderate',
    psaLevel: '3.8',
    referralUrgency: 'Soon'
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, William',
    ipssScore: 28,
    symptomSeverity: 'Severe',
    psaLevel: '6.5',
    referralUrgency: 'Urgent'
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    ipssScore: 2,
    symptomSeverity: 'Mild',
    psaLevel: '0.8',
    referralUrgency: 'Routine'
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Michael',
    ipssScore: 22,
    symptomSeverity: 'Severe',
    psaLevel: '5.1',
    referralUrgency: 'Urgent'
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    ipssScore: 10,
    symptomSeverity: 'Moderate',
    psaLevel: '2.4',
    referralUrgency: 'Soon'
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Robert',
    ipssScore: 18,
    symptomSeverity: 'Moderate',
    psaLevel: '4.2',
    referralUrgency: 'Urgent'
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Thomas',
    ipssScore: 6,
    symptomSeverity: 'Mild',
    psaLevel: '1.5',
    referralUrgency: 'Routine'
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Richard',
    ipssScore: 25,
    symptomSeverity: 'Severe',
    psaLevel: '8.3',
    referralUrgency: 'Urgent'
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Peter',
    ipssScore: 1,
    symptomSeverity: 'Mild',
    psaLevel: '0.6',
    referralUrgency: 'Routine'
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, George',
    ipssScore: 12,
    symptomSeverity: 'Moderate',
    psaLevel: '3.1',
    referralUrgency: 'Soon'
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, Andrew',
    ipssScore: 30,
    symptomSeverity: 'Severe',
    psaLevel: '12.7',
    referralUrgency: 'Urgent'
  }
];

window.UrologyAssessmentDashboard.samplePatients = samplePatients;
})();
