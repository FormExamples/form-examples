// Sample certificate data for the certifier / funeral-director dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data/sample-reports.ts` so the two
// implementations show identical demo content when the backend is offline. The
// rows span all three validity classes (valid, incomplete,
// refer-to-medical-examiner-or-coroner), include a referral case and a
// mechanism-as-sole-cause case, and cover a range of underlying causes.

/** @type {import('./dashboard-types.js').CertificateRow[]} */
const sampleCertificates = [
  { id: '1', stateFileNumber: 'CA-2026-004417', decedentName: 'Ellis, Margaret', validityClass: 'valid', underlyingCause: 'Chronic obstructive pulmonary disease', referralIndicated: false, certifierName: 'Dr A. Okafor', updatedAt: '2026-06-20' },
  { id: '2', stateFileNumber: 'NY-2026-118203', decedentName: 'Nowak, Piotr', validityClass: 'valid', underlyingCause: 'Adenocarcinoma of the sigmoid colon', referralIndicated: false, certifierName: 'Dr L. Mensah', updatedAt: '2026-06-22' },
  { id: '3', stateFileNumber: 'TX-2026-077120', decedentName: 'Byrne, Aoife', validityClass: 'incomplete', underlyingCause: 'Cardiac arrest', referralIndicated: false, certifierName: 'Dr S. Patel', updatedAt: '2026-06-25' },
  { id: '4', stateFileNumber: 'FL-2026-330981', decedentName: 'Okafor, Chidi', validityClass: 'refer-to-medical-examiner-or-coroner', underlyingCause: 'Blunt force head injury following a fall', referralIndicated: true, certifierName: 'Dr J. Hughes', updatedAt: '2026-06-26' },
  { id: '5', stateFileNumber: 'OH-2026-052266', decedentName: 'Fletcher, Rosemary', validityClass: 'valid', underlyingCause: 'Atherosclerotic heart disease', referralIndicated: false, certifierName: 'Dr A. Okafor', updatedAt: '2026-06-27' }
];

export { sampleCertificates };
