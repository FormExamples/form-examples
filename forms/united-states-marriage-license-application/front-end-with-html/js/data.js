// Sample application data for the review dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data` so the two implementations
// show identical demo content when the backend is offline. The rows span all
// three classes (ready-to-apply, incomplete, not-eligible), include an unlisted
// state that needs its rule verified, and cover several jurisdictions.

/** @type {import('./dashboard-types.js').ApplicationRow[]} */
const sampleApplications = [
  {
    id: '1',
    reference: 'A-1001',
    applicants: 'Garcia and Lee',
    applicationClass: 'ready-to-apply',
    earliestCeremony: '2026-09-04',
    verifyStateRule: false,
    jurisdiction: 'California, Los Angeles County',
    updatedAt: '2026-08-20'
  },
  {
    id: '2',
    reference: 'A-1002',
    applicants: 'Okafor and Reyes',
    applicationClass: 'ready-to-apply',
    earliestCeremony: '2026-09-11',
    verifyStateRule: false,
    jurisdiction: 'New York, Kings County',
    updatedAt: '2026-08-27'
  },
  {
    id: '3',
    reference: 'A-1003',
    applicants: 'Nowak and Silva',
    applicationClass: 'incomplete',
    earliestCeremony: '2026-09-08',
    verifyStateRule: false,
    jurisdiction: 'Texas, Travis County',
    updatedAt: '2026-08-30'
  },
  {
    id: '4',
    reference: 'A-1004',
    applicants: 'Hughes and Patel',
    applicationClass: 'not-eligible',
    earliestCeremony: '',
    verifyStateRule: false,
    jurisdiction: 'Florida, Orange County',
    updatedAt: '2026-09-01'
  },
  {
    id: '5',
    reference: 'A-1005',
    applicants: 'Byrne and Doyle',
    applicationClass: 'incomplete',
    earliestCeremony: '2026-09-03',
    verifyStateRule: true,
    jurisdiction: 'Vermont, Chittenden County',
    updatedAt: '2026-09-01'
  },
  {
    id: '6',
    reference: 'A-1006',
    applicants: 'Ellis and Fletcher',
    applicationClass: 'ready-to-apply',
    earliestCeremony: '2026-09-05',
    verifyStateRule: false,
    jurisdiction: 'Washington, King County',
    updatedAt: '2026-09-02'
  },
  {
    id: '7',
    reference: 'A-1007',
    applicants: 'Mensah and Ahmed',
    applicationClass: 'not-eligible',
    earliestCeremony: '2026-09-03',
    verifyStateRule: false,
    jurisdiction: 'Pennsylvania, Allegheny County',
    updatedAt: '2026-09-02'
  }
];

export { sampleApplications };
