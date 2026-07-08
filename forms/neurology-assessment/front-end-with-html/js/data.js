// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every NIHSS severity band and stroke-risk
// band, with NHS numbers in the canonical "NNN NNN NNNN" display form.

(function () {
'use strict';
window.NeurologyAssessmentDashboard = window.NeurologyAssessmentDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, John',
    nihssScore: 0,
    primaryCondition: 'Migraine with aura',
    strokeRisk: 'Low'
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    nihssScore: 3,
    primaryCondition: 'TIA',
    strokeRisk: 'Medium'
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    nihssScore: 12,
    primaryCondition: 'Ischaemic stroke (MCA)',
    strokeRisk: 'High'
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    nihssScore: 1,
    primaryCondition: 'Epilepsy - focal seizures',
    strokeRisk: 'Low'
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    nihssScore: 22,
    primaryCondition: 'Haemorrhagic stroke',
    strokeRisk: 'High'
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    nihssScore: 0,
    primaryCondition: 'Carpal tunnel syndrome',
    strokeRisk: 'Low'
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    nihssScore: 8,
    primaryCondition: 'Multiple sclerosis relapse',
    strokeRisk: 'Medium'
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    nihssScore: 4,
    primaryCondition: 'Peripheral neuropathy',
    strokeRisk: 'Low'
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    nihssScore: 16,
    primaryCondition: 'Ischaemic stroke (posterior)',
    strokeRisk: 'High'
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    nihssScore: 0,
    primaryCondition: 'Tension headache',
    strokeRisk: 'Low'
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    nihssScore: 2,
    primaryCondition: "Parkinson's disease",
    strokeRisk: 'Medium'
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    nihssScore: 28,
    primaryCondition: 'Large vessel occlusion stroke',
    strokeRisk: 'High'
  }
];

window.NeurologyAssessmentDashboard.samplePatients = samplePatients;
})();
