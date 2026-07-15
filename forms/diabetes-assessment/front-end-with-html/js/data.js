// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every control level and diabetes type, with a
// variety of HbA1c, complication counts, and last-review dates; NHS numbers
// in the canonical "NNN NNN NNNN" display form.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, John',
    diabetesType: 'type2',
    hba1c: 48,
    controlLevel: 'wellControlled',
    complications: 0,
    lastReview: '2026-02-15'
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    diabetesType: 'type2',
    hba1c: 72,
    controlLevel: 'suboptimal',
    complications: 2,
    lastReview: '2026-01-20'
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    diabetesType: 'type1',
    hba1c: 91,
    controlLevel: 'veryPoor',
    complications: 4,
    lastReview: '2025-12-10'
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    diabetesType: 'type2',
    hba1c: 55,
    controlLevel: 'suboptimal',
    complications: 1,
    lastReview: '2026-03-01'
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    diabetesType: 'type1',
    hba1c: 64,
    controlLevel: 'suboptimal',
    complications: 3,
    lastReview: '2026-02-28'
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    diabetesType: 'type2',
    hba1c: 42,
    controlLevel: 'wellControlled',
    complications: 0,
    lastReview: '2026-03-05'
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    diabetesType: 'type2',
    hba1c: 78,
    controlLevel: 'poor',
    complications: 2,
    lastReview: '2026-01-14'
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    diabetesType: 'type1',
    hba1c: 58,
    controlLevel: 'suboptimal',
    complications: 1,
    lastReview: '2026-02-22'
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    diabetesType: 'type2',
    hba1c: 95,
    controlLevel: 'veryPoor',
    complications: 5,
    lastReview: '2025-11-30'
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    diabetesType: 'type2',
    hba1c: 51,
    controlLevel: 'wellControlled',
    complications: 0,
    lastReview: '2026-03-08'
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    diabetesType: 'gestational',
    hba1c: 39,
    controlLevel: 'wellControlled',
    complications: 0,
    lastReview: '2026-03-10'
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    diabetesType: 'type2',
    hba1c: 88,
    controlLevel: 'poor',
    complications: 3,
    lastReview: '2025-12-20'
  }
];

export { samplePatients };
