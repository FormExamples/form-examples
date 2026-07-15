// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: spans every concern level, cycle-regularity
// category, and ovarian-reserve band, with semen-analysis abnormalities
// flagged for a subset; NHS numbers in the canonical "NNN NNN NNNN" display
// form.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Jane',
    age: 28,
    durationTryingMonths: 8,
    cycleRegularity: 'Regular',
    ovarianReserve: 'Normal',
    semenAnalysisAbnormal: false,
    concernLevel: 'Low'
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    age: 32,
    durationTryingMonths: 14,
    cycleRegularity: 'Regular',
    ovarianReserve: 'Normal',
    semenAnalysisAbnormal: false,
    concernLevel: 'Moderate'
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    age: 39,
    durationTryingMonths: 18,
    cycleRegularity: 'Irregular',
    ovarianReserve: 'Reduced',
    semenAnalysisAbnormal: false,
    concernLevel: 'High'
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    age: 30,
    durationTryingMonths: 13,
    cycleRegularity: 'Regular',
    ovarianReserve: 'Normal',
    semenAnalysisAbnormal: true,
    concernLevel: 'Moderate'
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    age: 41,
    durationTryingMonths: 24,
    cycleRegularity: 'Irregular',
    ovarianReserve: 'Low',
    semenAnalysisAbnormal: true,
    concernLevel: 'High'
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    age: 26,
    durationTryingMonths: 5,
    cycleRegularity: 'Regular',
    ovarianReserve: 'Normal',
    semenAnalysisAbnormal: false,
    concernLevel: 'Low'
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    age: 38,
    durationTryingMonths: 30,
    cycleRegularity: 'Absent',
    ovarianReserve: 'Low',
    semenAnalysisAbnormal: false,
    concernLevel: 'High'
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    age: 33,
    durationTryingMonths: 12,
    cycleRegularity: 'Regular',
    ovarianReserve: 'Normal',
    semenAnalysisAbnormal: true,
    concernLevel: 'Moderate'
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    age: 36,
    durationTryingMonths: 16,
    cycleRegularity: 'Irregular',
    ovarianReserve: 'Reduced',
    semenAnalysisAbnormal: false,
    concernLevel: 'Moderate'
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    age: 29,
    durationTryingMonths: 7,
    cycleRegularity: 'Regular',
    ovarianReserve: 'Normal',
    semenAnalysisAbnormal: false,
    concernLevel: 'Low'
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    age: 34,
    durationTryingMonths: 15,
    cycleRegularity: 'Irregular',
    ovarianReserve: 'Normal',
    semenAnalysisAbnormal: true,
    concernLevel: 'Moderate'
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    age: 42,
    durationTryingMonths: 36,
    cycleRegularity: 'Absent',
    ovarianReserve: 'Low',
    semenAnalysisAbnormal: true,
    concernLevel: 'High'
  }
];

export { samplePatients };
