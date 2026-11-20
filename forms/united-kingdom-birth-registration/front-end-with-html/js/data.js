// Sample application data for the registrar dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data` so the two implementations
// show identical demo content when the backend is offline. The rows span all
// four readiness classes (ready-to-submit, incomplete, needs-additional-evidence,
// out-of-scope) and include late registrations.

/** @type {import('./dashboard-types.js').RegistrationRow[]} */
const sampleRegistrations = [
  {
    id: '1',
    reference: 'BR-0001',
    childName: 'Ellis, Amara',
    readinessClass: 'ready-to-submit',
    daysSinceBirth: 12,
    lateRegistration: false,
    informantName: 'Beatrice Ellis',
    updatedAt: '2026-06-20'
  },
  {
    id: '2',
    reference: 'BR-0002',
    childName: 'Nowak, Jakub',
    readinessClass: 'ready-to-submit',
    daysSinceBirth: 3,
    lateRegistration: false,
    informantName: 'Ewa Nowak',
    updatedAt: '2026-06-22'
  },
  {
    id: '3',
    reference: 'BR-0003',
    childName: 'Byrne, Saoirse',
    readinessClass: 'incomplete',
    daysSinceBirth: null,
    lateRegistration: false,
    informantName: 'Aoife Byrne',
    updatedAt: '2026-06-25'
  },
  {
    id: '4',
    reference: 'BR-0004',
    childName: 'Okoye, Chidi',
    readinessClass: 'needs-additional-evidence',
    daysSinceBirth: 21,
    lateRegistration: false,
    informantName: 'Ada Okoye',
    updatedAt: '2026-06-27'
  },
  {
    id: '5',
    reference: 'BR-0005',
    childName: 'Hughes, Rhys',
    readinessClass: 'needs-additional-evidence',
    daysSinceBirth: 63,
    lateRegistration: true,
    informantName: 'Carys Hughes',
    updatedAt: '2026-06-30'
  },
  {
    id: '6',
    reference: 'BR-0006',
    childName: 'Macleod, Iona',
    readinessClass: 'out-of-scope',
    daysSinceBirth: 9,
    lateRegistration: false,
    informantName: 'Fiona Macleod',
    updatedAt: '2026-07-01'
  },
  {
    id: '7',
    reference: 'BR-0007',
    childName: 'Patel, Anika',
    readinessClass: 'ready-to-submit',
    daysSinceBirth: 44,
    lateRegistration: true,
    informantName: 'Priya Patel',
    updatedAt: '2026-07-02'
  }
];

export { sampleRegistrations };
