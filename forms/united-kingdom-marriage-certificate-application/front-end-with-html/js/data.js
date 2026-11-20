// Sample application data for the register-office dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data/sample-reports.ts` so the two
// implementations show identical demo content when the backend is offline. The
// rows span all four validity classes (ready-to-submit, incomplete,
// needs-evidence, ineligible) and include an immigration-referral case.

/** @type {import('./dashboard-types.js').CertificateRow[]} */
const sampleCertificates = [
  {
    id: '1',
    reference: 'UKMCA-2026-0001',
    partyNames: 'Amara Okafor and Daniel Hughes',
    validityClass: 'ready-to-submit',
    ceremonyDate: '2026-09-12',
    immigrationReferralIndicated: false,
    registrationDistrict: 'Leeds',
    updatedAt: '2026-06-20'
  },
  {
    id: '2',
    reference: 'UKMCA-2026-0002',
    partyNames: 'Piotr Nowak and Helen Marsh',
    validityClass: 'needs-evidence',
    ceremonyDate: '2026-10-03',
    immigrationReferralIndicated: false,
    registrationDistrict: 'Bristol',
    updatedAt: '2026-06-22'
  },
  {
    id: '3',
    reference: 'UKMCA-2026-0003',
    partyNames: 'Aoife Byrne and Sam Patel',
    validityClass: 'incomplete',
    ceremonyDate: '',
    immigrationReferralIndicated: false,
    registrationDistrict: 'Manchester',
    updatedAt: '2026-06-25'
  },
  {
    id: '4',
    reference: 'UKMCA-2026-0004',
    partyNames: 'Chidi Eze and Lena Fischer',
    validityClass: 'needs-evidence',
    ceremonyDate: '2026-11-14',
    immigrationReferralIndicated: true,
    registrationDistrict: 'Birmingham',
    updatedAt: '2026-06-26'
  },
  {
    id: '5',
    reference: 'UKMCA-2026-0005',
    partyNames: 'Jamie Cole and Riley Cole',
    validityClass: 'ineligible',
    ceremonyDate: '2026-08-08',
    immigrationReferralIndicated: false,
    registrationDistrict: 'Cardiff',
    updatedAt: '2026-06-28'
  }
];

export { sampleCertificates };
