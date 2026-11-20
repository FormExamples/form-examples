// Sample petition data for the petitions dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data/sample-reports.ts` so the two
// implementations show identical demo content when the backend is offline. One
// row per persona in `examples/personas.json`, spanning all three readiness
// classes (ready-to-file, incomplete, not-yet-eligible).

/** @type {import('./dashboard-types.js').PetitionRow[]} */
const samplePetitions = [
  {
    id: '1',
    petitionerName: 'Maria L. Alvarez',
    respondentName: 'Daniel R. Alvarez',
    state: 'IL',
    caseType: 'uncontested',
    readinessClass: 'ready-to-file',
    earliestDecreeDate: null,
    updatedAt: '2026-09-02'
  },
  {
    id: '2',
    petitionerName: 'Priya N. Shah',
    respondentName: 'Arjun K. Shah',
    state: 'CA',
    caseType: 'uncontested',
    readinessClass: 'ready-to-file',
    earliestDecreeDate: '2027-01-21',
    updatedAt: '2026-09-03'
  },
  {
    id: '3',
    petitionerName: 'Hannah J. Brooks',
    respondentName: 'Tyler M. Brooks',
    state: 'TX',
    caseType: 'uncontested',
    readinessClass: 'not-yet-eligible',
    earliestDecreeDate: '2026-10-09',
    updatedAt: '2026-09-04'
  },
  {
    id: '4',
    petitionerName: 'Grace E. Kowalski',
    respondentName: 'Peter J. Kowalski',
    state: 'PA',
    caseType: 'contested',
    readinessClass: 'not-yet-eligible',
    earliestDecreeDate: '2026-11-23',
    updatedAt: '2026-09-05'
  },
  {
    id: '5',
    petitionerName: 'Carla M. Reyes',
    respondentName: '(not recorded)',
    state: 'FL',
    caseType: 'contested',
    readinessClass: 'incomplete',
    earliestDecreeDate: '2026-09-09',
    updatedAt: '2026-09-06'
  },
  {
    id: '6',
    petitionerName: 'Olivia T. Nguyen',
    respondentName: 'Ethan P. Nguyen',
    state: 'WA',
    caseType: 'uncontested',
    readinessClass: 'not-yet-eligible',
    earliestDecreeDate: '2026-10-08',
    updatedAt: '2026-09-07'
  },
  {
    id: '7',
    petitionerName: 'Sofia A. Lindqvist',
    respondentName: 'Marcus D. Lindqvist',
    state: 'MN',
    caseType: 'contested',
    readinessClass: 'ready-to-file',
    earliestDecreeDate: null,
    updatedAt: '2026-09-08'
  },
  {
    id: '8',
    petitionerName: 'Renee S. Dubois',
    respondentName: 'Paul A. Dubois',
    state: 'NY',
    caseType: 'uncontested',
    readinessClass: 'ready-to-file',
    earliestDecreeDate: null,
    updatedAt: '2026-09-09'
  },
  {
    id: '9',
    petitionerName: 'Kevin B. Walsh',
    respondentName: 'Laura C. Walsh',
    state: 'OH',
    caseType: 'contested',
    readinessClass: 'incomplete',
    earliestDecreeDate: null,
    updatedAt: '2026-09-10'
  },
  {
    id: '10',
    petitionerName: '(not recorded)',
    respondentName: '(not recorded)',
    state: '--',
    caseType: 'unset',
    readinessClass: 'incomplete',
    earliestDecreeDate: null,
    updatedAt: '2026-09-11'
  }
];

export { samplePetitions };
