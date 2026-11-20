// Sample application data for the United Kingdom Vehicle Registration
// Application dashboard.
//
// Mirrors the SvelteKit dashboard's sample data so the two implementations show
// identical demo content when the backend is offline. The rows span all three
// validity classes (ready-to-submit, incomplete, needs-supporting-documents) and
// every application variant (V62, V55/4, V55/5, import, V627/1).

/** @type {import('./dashboard-types.js').ApplicationRow[]} */
const sampleApplications = [
  {
    id: '1',
    applicantName: 'Ellis, Margaret',
    applicationType: 'v62-replacement-v5c',
    registrationNumber: 'AB12 CDE',
    validityClass: 'ready-to-submit',
    feeDueAsPence: 2500,
    missingItemCount: 0,
    updatedAt: '2026-06-20'
  },
  {
    id: '2',
    applicantName: 'Nowak, Piotr',
    applicationType: 'v55-4-new-vehicle',
    registrationNumber: '',
    validityClass: 'needs-supporting-documents',
    feeDueAsPence: 5500,
    missingItemCount: 2,
    updatedAt: '2026-06-22'
  },
  {
    id: '3',
    applicantName: 'Byrne, Aoife',
    applicationType: 'v55-5-used-vehicle',
    registrationNumber: '',
    validityClass: 'incomplete',
    feeDueAsPence: 5500,
    missingItemCount: 6,
    updatedAt: '2026-06-25'
  },
  {
    id: '4',
    applicantName: 'Okafor, Chidi',
    applicationType: 'imported-vehicle',
    registrationNumber: '',
    validityClass: 'needs-supporting-documents',
    feeDueAsPence: 5500,
    missingItemCount: 2,
    updatedAt: '2026-06-26'
  },
  {
    id: '5',
    applicantName: 'Fletcher, Rosemary',
    applicationType: 'v62-acquired-without-v5c',
    registrationNumber: 'BD51 SMR',
    validityClass: 'ready-to-submit',
    feeDueAsPence: 0,
    missingItemCount: 0,
    updatedAt: '2026-06-27'
  },
  {
    id: '6',
    applicantName: 'Silva, Marcos',
    applicationType: 'v627-1-rebuilt-or-kit',
    registrationNumber: '',
    validityClass: 'needs-supporting-documents',
    feeDueAsPence: 5500,
    missingItemCount: 1,
    updatedAt: '2026-06-28'
  },
  {
    id: '7',
    applicantName: 'Doyle, Sinead',
    applicationType: 'v62-replacement-v5c',
    registrationNumber: '',
    validityClass: 'incomplete',
    feeDueAsPence: null,
    missingItemCount: 9,
    updatedAt: '2026-06-29'
  }
];

export { sampleApplications };
