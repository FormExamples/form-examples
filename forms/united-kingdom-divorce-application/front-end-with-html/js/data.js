// Sample application data for the caseworker dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data/sample-reports.ts` so the two
// implementations show identical demo content when the backend is offline. The
// rows span all three application classes (ready-to-apply, incomplete,
// not-eligible-yet) and all three stages (application, conditional order, final
// order).

/** @type {import('./dashboard-types.js').ApplicationRow[]} */
const sampleApplications = [
  {
    id: '1',
    applicantName: 'Ellis, Margaret',
    respondentName: 'Ellis, Peter',
    stage: 'application',
    applicationClass: 'ready-to-apply',
    earliestEligibleDate: '2026-03-14',
    caseworkerName: 'A. Okafor, solicitor',
    updatedAt: '2026-09-01'
  },
  {
    id: '2',
    applicantName: 'Nowak, Piotr',
    respondentName: 'Nowak, Anna',
    stage: 'conditional-order',
    applicationClass: 'not-eligible-yet',
    earliestEligibleDate: '2026-11-21',
    caseworkerName: 'L. Mensah, legal adviser',
    updatedAt: '2026-09-02'
  },
  {
    id: '3',
    applicantName: 'Byrne, Aoife',
    respondentName: 'Byrne, Declan',
    stage: 'application',
    applicationClass: 'incomplete',
    earliestEligibleDate: '',
    caseworkerName: 'S. Patel, solicitor',
    updatedAt: '2026-09-02'
  },
  {
    id: '4',
    applicantName: 'Okafor, Chidi',
    respondentName: 'Okafor, Ngozi',
    stage: 'final-order',
    applicationClass: 'ready-to-apply',
    earliestEligibleDate: '2026-06-18',
    caseworkerName: 'J. Hughes, solicitor',
    updatedAt: '2026-09-03'
  },
  {
    id: '5',
    applicantName: 'Fletcher, Rosemary',
    respondentName: 'Fletcher, Colin',
    stage: 'application',
    applicationClass: 'not-eligible-yet',
    earliestEligibleDate: '2026-12-05',
    caseworkerName: 'A. Okafor, solicitor',
    updatedAt: '2026-09-03'
  },
  {
    id: '6',
    applicantName: 'Silva, Marcos',
    respondentName: 'Silva, Helena',
    stage: 'final-order',
    applicationClass: 'not-eligible-yet',
    earliestEligibleDate: '2026-09-30',
    caseworkerName: 'R. Ahmed, court officer',
    updatedAt: '2026-09-04'
  },
  {
    id: '7',
    applicantName: 'Doyle, Sinead',
    respondentName: 'Doyle, Brendan',
    stage: 'conditional-order',
    applicationClass: 'incomplete',
    earliestEligibleDate: '2026-08-10',
    caseworkerName: 'M. Green, legal adviser',
    updatedAt: '2026-09-04'
  }
];

export { sampleApplications };
