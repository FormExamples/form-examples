// Sample application data for the preparer dashboard.
//
// Mirrors the SvelteKit dashboard's sample data so the two implementations show
// identical demo content when the backend is offline. The rows span all four
// application classes (ready-to-submit, incomplete, evidence-missing,
// not-eligible) and include a replacement-limit case and a deceased-applicant
// case. The names are invented.

/** @type {import('./dashboard-types.js').ApplicationRow[]} */
const sampleApplications = [
  {
    id: '1',
    applicantName: 'Alvarez, Lucia',
    requestType: 'original',
    applicationClass: 'ready-to-submit',
    missingEvidenceCount: 0,
    replacementLimitReached: false,
    preparerName: 'F. Monroe',
    updatedAt: '2026-08-10'
  },
  {
    id: '2',
    applicantName: 'Brooks, Daniel',
    requestType: 'replacement',
    applicationClass: 'ready-to-submit',
    missingEvidenceCount: 0,
    replacementLimitReached: false,
    preparerName: 'F. Monroe',
    updatedAt: '2026-08-11'
  },
  {
    id: '3',
    applicantName: 'Chen, Mei',
    requestType: 'original',
    applicationClass: 'evidence-missing',
    missingEvidenceCount: 2,
    replacementLimitReached: false,
    preparerName: 'R. Patel',
    updatedAt: '2026-08-12'
  },
  {
    id: '4',
    applicantName: 'Dawson, Tyrone',
    requestType: 'replacement',
    applicationClass: 'not-eligible',
    missingEvidenceCount: 0,
    replacementLimitReached: true,
    preparerName: 'R. Patel',
    updatedAt: '2026-08-13'
  },
  {
    id: '5',
    applicantName: 'Eze, Ada',
    requestType: 'correction',
    applicationClass: 'incomplete',
    missingEvidenceCount: 1,
    replacementLimitReached: false,
    preparerName: 'K. Hughes',
    updatedAt: '2026-08-14'
  },
  {
    id: '6',
    applicantName: 'Fischer, Anna',
    requestType: 'original',
    applicationClass: 'ready-to-submit',
    missingEvidenceCount: 0,
    replacementLimitReached: false,
    preparerName: 'K. Hughes',
    updatedAt: '2026-08-15'
  },
  {
    id: '7',
    applicantName: 'Garcia, Mateo',
    requestType: 'original',
    applicationClass: 'not-eligible',
    missingEvidenceCount: 0,
    replacementLimitReached: false,
    preparerName: 'F. Monroe',
    updatedAt: '2026-08-16'
  }
];

export { sampleApplications };
