// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every ASRM stage and every severity band,
// with fertility-concern flags on a subset; NHS numbers in the canonical
// "NNN NNN NNNN" display form. ASRM points fall inside the canonical bands
// (Stage I 1-5, Stage II 6-15, Stage III 16-40, Stage IV >40); EHP-30
// scores range 0-100 (higher = worse health-related quality of life).

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Jane',
    asrmPoints: 3,
    asrmStage: 'Stage I',
    ehp30Score: 18,
    severity: 'Mild',
    fertilityConcern: false
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    asrmPoints: 12,
    asrmStage: 'Stage II',
    ehp30Score: 34,
    severity: 'Mild',
    fertilityConcern: true
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    asrmPoints: 28,
    asrmStage: 'Stage III',
    ehp30Score: 62,
    severity: 'Moderate',
    fertilityConcern: false
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    asrmPoints: 9,
    asrmStage: 'Stage II',
    ehp30Score: 27,
    severity: 'Mild',
    fertilityConcern: false
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    asrmPoints: 58,
    asrmStage: 'Stage IV',
    ehp30Score: 88,
    severity: 'Critical',
    fertilityConcern: true
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    asrmPoints: 2,
    asrmStage: 'Stage I',
    ehp30Score: 9,
    severity: 'Mild',
    fertilityConcern: false
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    asrmPoints: 47,
    asrmStage: 'Stage IV',
    ehp30Score: 79,
    severity: 'Severe',
    fertilityConcern: true
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    asrmPoints: 21,
    asrmStage: 'Stage III',
    ehp30Score: 48,
    severity: 'Moderate',
    fertilityConcern: false
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    asrmPoints: 35,
    asrmStage: 'Stage III',
    ehp30Score: 71,
    severity: 'Severe',
    fertilityConcern: false
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    asrmPoints: 14,
    asrmStage: 'Stage II',
    ehp30Score: 41,
    severity: 'Moderate',
    fertilityConcern: false
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    asrmPoints: 19,
    asrmStage: 'Stage III',
    ehp30Score: 56,
    severity: 'Moderate',
    fertilityConcern: true
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, Georgina',
    asrmPoints: 64,
    asrmStage: 'Stage IV',
    ehp30Score: 93,
    severity: 'Critical',
    fertilityConcern: true
  }
];

export { samplePatients };
