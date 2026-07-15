// Sample plan data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span both statuses, the full completeness range, and every CPR
// recommendation (attempt, do-not-attempt, and not-yet-documented), with one
// past review date to exercise the governance styling.

/** @type {import('./dashboard-types.js').PlanRow[]} */
const samplePlans = [
  {
    id: '1',
    patientIdentifier: '943 476 5919',
    personName: 'Ellis, Margaret',
    status: 'complete',
    completenessPercent: 100,
    cprRecommendation: 'do-not-attempt',
    clinicianName: 'Dr A. Okafor',
    reviewDate: '2026-12-01',
    updatedAt: '2026-06-20'
  },
  {
    id: '2',
    patientIdentifier: '611 209 3344',
    personName: 'Nowak, Piotr',
    status: 'complete',
    completenessPercent: 100,
    cprRecommendation: 'attempt',
    clinicianName: 'Dr L. Mensah',
    reviewDate: '2027-01-15',
    updatedAt: '2026-06-22'
  },
  {
    id: '3',
    patientIdentifier: '502 771 8820',
    personName: 'Byrne, Aoife',
    status: 'incomplete',
    completenessPercent: 71,
    cprRecommendation: '',
    clinicianName: 'Dr S. Patel',
    reviewDate: null,
    updatedAt: '2026-06-25'
  },
  {
    id: '4',
    patientIdentifier: '778 334 1090',
    personName: 'Okafor, Chidi',
    status: 'incomplete',
    completenessPercent: 86,
    cprRecommendation: 'do-not-attempt',
    clinicianName: 'Sr J. Hughes',
    reviewDate: '2026-03-10',
    updatedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: '120 998 4471',
    personName: 'Fletcher, Rosemary',
    status: 'complete',
    completenessPercent: 100,
    cprRecommendation: 'do-not-attempt',
    clinicianName: 'Dr A. Okafor',
    reviewDate: '2026-11-05',
    updatedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: '365 447 2201',
    personName: 'Silva, Marcos',
    status: 'incomplete',
    completenessPercent: 43,
    cprRecommendation: '',
    clinicianName: '',
    reviewDate: null,
    updatedAt: '2026-06-28'
  }
];

export { samplePlans };
