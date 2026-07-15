// Sample patient data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// Twelve realistic rows: span the full HHIE-S 0-40 range across all three
// severity tiers (No handicap / Mild to moderate / Significant), a mix of
// age bands (Under 50, 50-64, 65-74, 75-84, 85+), current hearing-aid users
// vs non-users, and occupational noise exposure flagged for a subset; NHS
// numbers in the canonical "NNN NNN NNNN" display form.

/** @type {import('./types.js').PatientRow[]} */
const samplePatients = [
  {
    id: '1',
    nhsNumber: '943 476 5919',
    patientName: 'Smith, Jane',
    age: 72,
    ageBand: '65-74',
    hhiesScore: 4,
    severity: 'No handicap',
    hearingAidUser: false,
    occupationalNoiseExposure: false
  },
  {
    id: '2',
    nhsNumber: '721 938 4102',
    patientName: 'Patel, Priya',
    age: 58,
    ageBand: '50-64',
    hhiesScore: 0,
    severity: 'No handicap',
    hearingAidUser: false,
    occupationalNoiseExposure: true
  },
  {
    id: '3',
    nhsNumber: '384 615 7230',
    patientName: 'Jones, Margaret',
    age: 81,
    ageBand: '75-84',
    hhiesScore: 32,
    severity: 'Significant handicap',
    hearingAidUser: true,
    occupationalNoiseExposure: false
  },
  {
    id: '4',
    nhsNumber: '512 847 9063',
    patientName: 'Williams, David',
    age: 45,
    ageBand: 'Under 50',
    hhiesScore: 12,
    severity: 'Mild to moderate handicap',
    hearingAidUser: false,
    occupationalNoiseExposure: true
  },
  {
    id: '5',
    nhsNumber: '167 293 8451',
    patientName: 'Brown, Sarah',
    age: 89,
    ageBand: '85+',
    hhiesScore: 40,
    severity: 'Significant handicap',
    hearingAidUser: true,
    occupationalNoiseExposure: false
  },
  {
    id: '6',
    nhsNumber: '835 162 4097',
    patientName: 'Taylor, James',
    age: 68,
    ageBand: '65-74',
    hhiesScore: 8,
    severity: 'No handicap',
    hearingAidUser: false,
    occupationalNoiseExposure: false
  },
  {
    id: '7',
    nhsNumber: '294 708 5316',
    patientName: 'Davies, Helen',
    age: 79,
    ageBand: '75-84',
    hhiesScore: 24,
    severity: 'Significant handicap',
    hearingAidUser: false,
    occupationalNoiseExposure: false
  },
  {
    id: '8',
    nhsNumber: '608 341 2975',
    patientName: 'Wilson, Robert',
    age: 62,
    ageBand: '50-64',
    hhiesScore: 18,
    severity: 'Mild to moderate handicap',
    hearingAidUser: true,
    occupationalNoiseExposure: true
  },
  {
    id: '9',
    nhsNumber: '473 926 1084',
    patientName: 'Evans, Catherine',
    age: 71,
    ageBand: '65-74',
    hhiesScore: 16,
    severity: 'Mild to moderate handicap',
    hearingAidUser: false,
    occupationalNoiseExposure: false
  },
  {
    id: '10',
    nhsNumber: '159 684 7302',
    patientName: 'Thomas, Michael',
    age: 54,
    ageBand: '50-64',
    hhiesScore: 6,
    severity: 'No handicap',
    hearingAidUser: false,
    occupationalNoiseExposure: true
  },
  {
    id: '11',
    nhsNumber: '742 051 3896',
    patientName: 'Robinson, Emma',
    age: 86,
    ageBand: '85+',
    hhiesScore: 22,
    severity: 'Mild to moderate handicap',
    hearingAidUser: true,
    occupationalNoiseExposure: false
  },
  {
    id: '12',
    nhsNumber: '386 219 5740',
    patientName: 'Clark, George',
    age: 77,
    ageBand: '75-84',
    hhiesScore: 36,
    severity: 'Significant handicap',
    hearingAidUser: true,
    occupationalNoiseExposure: true
  }
];

export { samplePatients };
