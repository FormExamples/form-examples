// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every AUDIT category, every DAST-10 category,
// every combined-severity band, with withdrawal risk flagged for a subset;
// NHS numbers in the canonical "NNN NNN NNNN" display form.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Jane',
    auditScore: 3,
    auditCategory: 'Low Risk',
    dastScore: 0,
    dastCategory: 'No Problems',
    combinedSeverity: 'Low',
    withdrawalRisk: false
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    auditScore: 11,
    auditCategory: 'Hazardous',
    dastScore: 1,
    dastCategory: 'Low Level',
    combinedSeverity: 'Moderate',
    withdrawalRisk: false
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    auditScore: 18,
    auditCategory: 'Harmful',
    dastScore: 4,
    dastCategory: 'Moderate Level',
    combinedSeverity: 'High',
    withdrawalRisk: false
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    auditScore: 6,
    auditCategory: 'Low Risk',
    dastScore: 2,
    dastCategory: 'Low Level',
    combinedSeverity: 'Low',
    withdrawalRisk: false
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    auditScore: 32,
    auditCategory: 'Dependence Likely',
    dastScore: 9,
    dastCategory: 'Severe Level',
    combinedSeverity: 'Critical',
    withdrawalRisk: true
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    auditScore: 0,
    auditCategory: 'Low Risk',
    dastScore: 0,
    dastCategory: 'No Problems',
    combinedSeverity: 'Low',
    withdrawalRisk: false
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    auditScore: 28,
    auditCategory: 'Dependence Likely',
    dastScore: 7,
    dastCategory: 'Substantial Level',
    combinedSeverity: 'Critical',
    withdrawalRisk: true
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    auditScore: 13,
    auditCategory: 'Hazardous',
    dastScore: 3,
    dastCategory: 'Moderate Level',
    combinedSeverity: 'Moderate',
    withdrawalRisk: false
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    auditScore: 17,
    auditCategory: 'Harmful',
    dastScore: 6,
    dastCategory: 'Substantial Level',
    combinedSeverity: 'High',
    withdrawalRisk: false
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    auditScore: 9,
    auditCategory: 'Hazardous',
    dastScore: 0,
    dastCategory: 'No Problems',
    combinedSeverity: 'Moderate',
    withdrawalRisk: false
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    auditScore: 19,
    auditCategory: 'Harmful',
    dastScore: 5,
    dastCategory: 'Moderate Level',
    combinedSeverity: 'High',
    withdrawalRisk: true
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    auditScore: 36,
    auditCategory: 'Dependence Likely',
    dastScore: 10,
    dastCategory: 'Severe Level',
    combinedSeverity: 'Critical',
    withdrawalRisk: true
  }
];

export { samplePatients };
