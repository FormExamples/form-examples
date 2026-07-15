// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every risk category (low/moderate/high), both
// sexes, a range of ages 39-73, heart-age gaps positive and negative, and
// flag counts from 0 to 6. NHS numbers in canonical "NNN NNN NNNN" form.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, John',
    age: 62,
    sex: 'male',
    riskCategory: 'high',
    tenYearRisk: 24.3,
    heartAge: 78,
    flagCount: 3,
    submittedDate: '2026-03-01'
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    age: 55,
    sex: 'female',
    riskCategory: 'moderate',
    tenYearRisk: 14.7,
    heartAge: 64,
    flagCount: 2,
    submittedDate: '2026-03-05'
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    age: 48,
    sex: 'female',
    riskCategory: 'low',
    tenYearRisk: 4.2,
    heartAge: 46,
    flagCount: 0,
    submittedDate: '2026-03-08'
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    age: 71,
    sex: 'male',
    riskCategory: 'high',
    tenYearRisk: 31.5,
    heartAge: 89,
    flagCount: 5,
    submittedDate: '2026-02-18'
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    age: 44,
    sex: 'female',
    riskCategory: 'low',
    tenYearRisk: 2.8,
    heartAge: 40,
    flagCount: 0,
    submittedDate: '2026-03-10'
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    age: 58,
    sex: 'male',
    riskCategory: 'moderate',
    tenYearRisk: 16.2,
    heartAge: 68,
    flagCount: 2,
    submittedDate: '2026-03-06'
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    age: 67,
    sex: 'female',
    riskCategory: 'high',
    tenYearRisk: 22.1,
    heartAge: 80,
    flagCount: 4,
    submittedDate: '2026-02-28'
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    age: 52,
    sex: 'male',
    riskCategory: 'moderate',
    tenYearRisk: 11.8,
    heartAge: 60,
    flagCount: 1,
    submittedDate: '2026-03-02'
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    age: 39,
    sex: 'female',
    riskCategory: 'low',
    tenYearRisk: 1.5,
    heartAge: 35,
    flagCount: 0,
    submittedDate: '2026-03-09'
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    age: 65,
    sex: 'male',
    riskCategory: 'high',
    tenYearRisk: 28.9,
    heartAge: 84,
    flagCount: 4,
    submittedDate: '2026-02-20'
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    age: 50,
    sex: 'female',
    riskCategory: 'low',
    tenYearRisk: 5.6,
    heartAge: 52,
    flagCount: 1,
    submittedDate: '2026-03-07'
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    age: 73,
    sex: 'male',
    riskCategory: 'high',
    tenYearRisk: 35.2,
    heartAge: 92,
    flagCount: 6,
    submittedDate: '2026-02-15'
  }
];

export { samplePatients };
