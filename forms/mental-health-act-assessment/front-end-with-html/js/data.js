// Sample assessment data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two implementations
// show identical demo content when the backend is offline. The rows span both
// completeness statuses, several recommended-section classes (including a
// holding power, an emergency power, and a non-detaining 'none' outcome), and
// every urgency class.

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
const sampleAssessments = [
  {
    id: '1',
    patientIdentifier: '943 476 5919',
    personName: 'Ellis, Margaret',
    completenessStatus: 'valid',
    recommendedSectionClass: 'section-2',
    urgency: 'urgent',
    amhpName: 'A. Okafor',
    updatedAt: '2026-06-20'
  },
  {
    id: '2',
    patientIdentifier: '611 209 3344',
    personName: 'Nowak, Piotr',
    completenessStatus: 'valid',
    recommendedSectionClass: 'section-3',
    urgency: 'urgent',
    amhpName: 'L. Mensah',
    updatedAt: '2026-06-22'
  },
  {
    id: '3',
    patientIdentifier: '502 771 8820',
    personName: 'Byrne, Aoife',
    completenessStatus: 'incomplete',
    recommendedSectionClass: 'section-2',
    urgency: 'urgent',
    amhpName: 'S. Patel',
    updatedAt: '2026-06-25'
  },
  {
    id: '4',
    patientIdentifier: '778 334 1090',
    personName: 'Okafor, Chidi',
    completenessStatus: 'valid',
    recommendedSectionClass: 'section-136',
    urgency: 'emergency',
    amhpName: 'J. Hughes',
    updatedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: '120 998 4471',
    personName: 'Fletcher, Rosemary',
    completenessStatus: 'valid',
    recommendedSectionClass: 'none',
    urgency: 'routine',
    amhpName: 'A. Okafor',
    updatedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: '365 447 2201',
    personName: 'Silva, Marcos',
    completenessStatus: 'incomplete',
    recommendedSectionClass: 'section-4',
    urgency: 'emergency',
    amhpName: '',
    updatedAt: '2026-06-28'
  },
  {
    id: '7',
    patientIdentifier: '884 210 7745',
    personName: 'Doyle, Sinead',
    completenessStatus: 'incomplete',
    recommendedSectionClass: 'section-5-2',
    urgency: 'emergency',
    amhpName: 'R. Ahmed',
    updatedAt: '2026-06-29'
  }
];

export { sampleAssessments };
