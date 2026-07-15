// Sample certificate data for the certifier / medical-examiner dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two implementations
// show identical demo content when the backend is offline. The rows span all
// three validity classes (valid, incomplete, refer-to-coroner), include a
// coroner-referral case and an unacceptable-sole-cause case, and cover a range
// of underlying causes.

/** @type {import('./dashboard-types.js').CertificateRow[]} */
const sampleCertificates = [
  {
    id: '1',
    patientIdentifier: '943 476 5919',
    deceasedName: 'Ellis, Margaret',
    validityClass: 'valid',
    underlyingCause: 'Chronic obstructive pulmonary disease',
    coronerReferralIndicated: false,
    certifyingDoctorName: 'Dr A. Okafor',
    updatedAt: '2026-06-20'
  },
  {
    id: '2',
    patientIdentifier: '611 209 3344',
    deceasedName: 'Nowak, Piotr',
    validityClass: 'valid',
    underlyingCause: 'Carcinoma of the sigmoid colon',
    coronerReferralIndicated: false,
    certifyingDoctorName: 'Dr L. Mensah',
    updatedAt: '2026-06-22'
  },
  {
    id: '3',
    patientIdentifier: '502 771 8820',
    deceasedName: 'Byrne, Aoife',
    validityClass: 'incomplete',
    underlyingCause: 'Cardiac arrest',
    coronerReferralIndicated: false,
    certifyingDoctorName: 'Dr S. Patel',
    updatedAt: '2026-06-25'
  },
  {
    id: '4',
    patientIdentifier: '778 334 1090',
    deceasedName: 'Okafor, Chidi',
    validityClass: 'refer-to-coroner',
    underlyingCause: 'Head injury following a fall',
    coronerReferralIndicated: true,
    certifyingDoctorName: 'Dr J. Hughes',
    updatedAt: '2026-06-26'
  },
  {
    id: '5',
    patientIdentifier: '120 998 4471',
    deceasedName: 'Fletcher, Rosemary',
    validityClass: 'valid',
    underlyingCause: 'Ischaemic heart disease',
    coronerReferralIndicated: false,
    certifyingDoctorName: 'Dr A. Okafor',
    updatedAt: '2026-06-27'
  },
  {
    id: '6',
    patientIdentifier: '365 447 2201',
    deceasedName: 'Silva, Marcos',
    validityClass: 'refer-to-coroner',
    underlyingCause: 'Mesothelioma (occupational asbestos exposure)',
    coronerReferralIndicated: true,
    certifyingDoctorName: 'Dr R. Ahmed',
    updatedAt: '2026-06-28'
  },
  {
    id: '7',
    patientIdentifier: '884 210 7745',
    deceasedName: 'Doyle, Sinead',
    validityClass: 'incomplete',
    underlyingCause: '',
    coronerReferralIndicated: false,
    certifyingDoctorName: 'Dr M. Green',
    updatedAt: '2026-06-29'
  }
];

export { sampleCertificates };
