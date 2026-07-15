// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every ASA class (I-V), every wound class
// (I-IV), every complexity score (1-4), and every risk level (Low,
// Moderate, High, Critical). NHS numbers in canonical "NNN NNN NNNN"
// display form.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Jane',
    asaClass: 'I',
    woundClass: 'I',
    complexity: 1,
    riskLevel: 'Low'
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    asaClass: 'II',
    woundClass: 'I',
    complexity: 2,
    riskLevel: 'Low'
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    asaClass: 'III',
    woundClass: 'II',
    complexity: 3,
    riskLevel: 'High'
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    asaClass: 'II',
    woundClass: 'II',
    complexity: 2,
    riskLevel: 'Moderate'
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    asaClass: 'IV',
    woundClass: 'IV',
    complexity: 4,
    riskLevel: 'Critical'
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    asaClass: 'I',
    woundClass: 'I',
    complexity: 1,
    riskLevel: 'Low'
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    asaClass: 'III',
    woundClass: 'III',
    complexity: 4,
    riskLevel: 'High'
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    asaClass: 'II',
    woundClass: 'II',
    complexity: 2,
    riskLevel: 'Moderate'
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    asaClass: 'III',
    woundClass: 'II',
    complexity: 3,
    riskLevel: 'High'
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    asaClass: 'I',
    woundClass: 'I',
    complexity: 1,
    riskLevel: 'Low'
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    asaClass: 'II',
    woundClass: 'III',
    complexity: 3,
    riskLevel: 'Moderate'
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    asaClass: 'V',
    woundClass: 'IV',
    complexity: 4,
    riskLevel: 'Critical'
  }
];

export { samplePatients };
