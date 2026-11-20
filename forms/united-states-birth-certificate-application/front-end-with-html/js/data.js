// Sample application data for the applications dashboard.
//
// Mirrors the SvelteKit dashboard's sample data so the two implementations show
// identical demo content when the backend is offline. The rows span all three
// application classes.

/** @type {import('./dashboard-types.js').ApplicationRow[]} */
const sampleApplications = [
  {
    id: '1',
    registrantName: 'Garcia, Elena',
    birthState: 'CA',
    requesterRelationship: 'self',
    applicationClass: 'ready-to-submit',
    ineligibleRequester: false,
    applicantName: 'Elena Garcia',
    updatedAt: '2026-10-11'
  },
  {
    id: '2',
    registrantName: 'Okafor, Chidi',
    birthState: 'TX',
    requesterRelationship: 'parent',
    applicationClass: 'ready-to-submit',
    ineligibleRequester: false,
    applicantName: 'Ngozi Okafor',
    updatedAt: '2026-10-12'
  },
  {
    id: '3',
    registrantName: 'Nowak, Piotr',
    birthState: 'NY',
    requesterRelationship: 'spouse',
    applicationClass: 'incomplete',
    ineligibleRequester: false,
    applicantName: 'Anna Nowak',
    updatedAt: '2026-10-13'
  },
  {
    id: '4',
    registrantName: 'Brown, Marcus',
    birthState: 'FL',
    requesterRelationship: 'sibling',
    applicationClass: 'ineligible-requester',
    ineligibleRequester: true,
    applicantName: 'Devon Brown',
    updatedAt: '2026-10-14'
  },
  {
    id: '5',
    registrantName: 'Lee, Hana',
    birthState: 'WA',
    requesterRelationship: 'grandparent',
    applicationClass: 'ready-to-submit',
    ineligibleRequester: false,
    applicantName: 'Min-ji Lee',
    updatedAt: '2026-10-15'
  },
  {
    id: '6',
    registrantName: 'Silva, Marcos',
    birthState: 'IL',
    requesterRelationship: 'other',
    applicationClass: 'ineligible-requester',
    ineligibleRequester: true,
    applicantName: 'R. Costa',
    updatedAt: '2026-10-16'
  },
  {
    id: '7',
    registrantName: 'Ellis, Margaret',
    birthState: 'PA',
    requesterRelationship: 'child',
    applicationClass: 'incomplete',
    ineligibleRequester: false,
    applicantName: 'Tom Ellis',
    updatedAt: '2026-10-17'
  }
];

export { sampleApplications };
