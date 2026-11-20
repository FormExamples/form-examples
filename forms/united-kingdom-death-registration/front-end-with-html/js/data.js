// Sample registration data for the family / registrar dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two implementations
// show identical demo content when the backend is offline. The rows span all
// four registration classes and several 5-day deadline statuses.

/** @type {import('./dashboard-types.js').RegistrationRow[]} */
const sampleRegistrations = [
  {
    id: '1',
    deceasedName: 'Ellis, Margaret',
    registrationClass: 'ready-to-register',
    deadlineStatus: 'on-track',
    daysSinceConfirmation: 2,
    informantName: 'Ellis, Peter',
    informantQualified: true,
    updatedAt: '2026-09-01'
  },
  {
    id: '2',
    deceasedName: 'Nowak, Piotr',
    registrationClass: 'registered',
    deadlineStatus: 'registered',
    daysSinceConfirmation: 3,
    informantName: 'Nowak, Anna',
    informantQualified: true,
    updatedAt: '2026-09-02'
  },
  {
    id: '3',
    deceasedName: 'Byrne, Aoife',
    registrationClass: 'incomplete',
    deadlineStatus: 'not-started',
    daysSinceConfirmation: null,
    informantName: 'Byrne, Sean',
    informantQualified: false,
    updatedAt: '2026-09-02'
  },
  {
    id: '4',
    deceasedName: 'Okafor, Chidi',
    registrationClass: 'referred-to-coroner-pending',
    deadlineStatus: 'paused-coroner',
    daysSinceConfirmation: null,
    informantName: 'Okafor, Ngozi',
    informantQualified: true,
    updatedAt: '2026-09-03'
  },
  {
    id: '5',
    deceasedName: 'Fletcher, Rosemary',
    registrationClass: 'ready-to-register',
    deadlineStatus: 'overdue',
    daysSinceConfirmation: 7,
    informantName: 'Fletcher, John',
    informantQualified: true,
    updatedAt: '2026-09-03'
  },
  {
    id: '6',
    deceasedName: 'Hughes, Gareth',
    registrationClass: 'registered',
    deadlineStatus: 'registered-late',
    daysSinceConfirmation: 8,
    informantName: 'Hughes, Dilys',
    informantQualified: true,
    updatedAt: '2026-09-03'
  },
  {
    id: '7',
    deceasedName: 'Doyle, Sinead',
    registrationClass: 'ready-to-register',
    deadlineStatus: 'due-soon',
    daysSinceConfirmation: 4,
    informantName: 'Doyle, Brian',
    informantQualified: true,
    updatedAt: '2026-09-03'
  }
];

export { sampleRegistrations };
