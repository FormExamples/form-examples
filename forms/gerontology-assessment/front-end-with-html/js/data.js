// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every CFS band and falls-risk level, with
// cognitive status varying across rows; NHS numbers in the canonical
// "NNN NNN NNNN" display form.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Thompson, Margaret',
    cfsScore: 1,
    fallsRisk: 'Low',
    cognitiveStatus: 'Normal'
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Singh, Rajesh',
    cfsScore: 3,
    fallsRisk: 'Low',
    cognitiveStatus: 'Normal'
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Dorothy',
    cfsScore: 5,
    fallsRisk: 'High',
    cognitiveStatus: 'Mild Impairment'
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, Harold',
    cfsScore: 4,
    fallsRisk: 'Medium',
    cognitiveStatus: 'Normal'
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Edith',
    cfsScore: 7,
    fallsRisk: 'High',
    cognitiveStatus: 'Severe Impairment'
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, Arthur',
    cfsScore: 2,
    fallsRisk: 'Low',
    cognitiveStatus: 'Normal'
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Gladys',
    cfsScore: 6,
    fallsRisk: 'High',
    cognitiveStatus: 'Moderate Impairment'
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Stanley',
    cfsScore: 3,
    fallsRisk: 'Low',
    cognitiveStatus: 'Normal'
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Iris',
    cfsScore: 5,
    fallsRisk: 'High',
    cognitiveStatus: 'Mild Impairment'
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Gerald',
    cfsScore: 4,
    fallsRisk: 'Medium',
    cognitiveStatus: 'Mild Impairment'
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Vera',
    cfsScore: 8,
    fallsRisk: 'High',
    cognitiveStatus: 'Severe Impairment'
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, Albert',
    cfsScore: 6,
    fallsRisk: 'High',
    cognitiveStatus: 'Moderate Impairment'
  }
];

export { samplePatients };
