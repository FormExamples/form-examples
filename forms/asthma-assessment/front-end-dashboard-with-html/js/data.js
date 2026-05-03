// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every control level and exacerbation-risk
// band, with allergy comorbidities flagged for a subset; NHS numbers in the
// canonical "NNN NNN NNNN" display form.

(function () {
'use strict';
window.AsthmaAssessmentDashboard = window.AsthmaAssessmentDashboard || {};

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Jane',
    actScore: 25,
    controlLevel: 'Well Controlled',
    exacerbationRisk: 'Low',
    allergyFlag: false
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    actScore: 22,
    controlLevel: 'Could Be Better',
    exacerbationRisk: 'Low',
    allergyFlag: true
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    actScore: 17,
    controlLevel: 'Not Well Controlled',
    exacerbationRisk: 'High',
    allergyFlag: false
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    actScore: 23,
    controlLevel: 'Could Be Better',
    exacerbationRisk: 'Low',
    allergyFlag: false
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    actScore: 10,
    controlLevel: 'Very Poorly Controlled',
    exacerbationRisk: 'High',
    allergyFlag: true
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    actScore: 25,
    controlLevel: 'Well Controlled',
    exacerbationRisk: 'Low',
    allergyFlag: false
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    actScore: 14,
    controlLevel: 'Very Poorly Controlled',
    exacerbationRisk: 'High',
    allergyFlag: true
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    actScore: 20,
    controlLevel: 'Could Be Better',
    exacerbationRisk: 'Moderate',
    allergyFlag: false
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    actScore: 18,
    controlLevel: 'Not Well Controlled',
    exacerbationRisk: 'High',
    allergyFlag: false
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    actScore: 24,
    controlLevel: 'Could Be Better',
    exacerbationRisk: 'Low',
    allergyFlag: false
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    actScore: 19,
    controlLevel: 'Not Well Controlled',
    exacerbationRisk: 'Moderate',
    allergyFlag: true
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    actScore: 8,
    controlLevel: 'Very Poorly Controlled',
    exacerbationRisk: 'High',
    allergyFlag: false
  }
];

window.AsthmaAssessmentDashboard.samplePatients = samplePatients;
})();
