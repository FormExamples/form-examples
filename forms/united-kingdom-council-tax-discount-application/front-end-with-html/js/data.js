// Sample application data for the Council Tax discount dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two implementations
// show identical demo content when the backend is offline. The rows span all
// three eligibility classes (likely-eligible, incomplete, likely-ineligible) and
// several claim types.

/** @type {import('./dashboard-types.js').ApplicationRow[]} */
const sampleApplications = [
  {
    id: '1',
    accountReference: 'CT-100234',
    applicantName: 'Okonkwo, Adaeze',
    claimType: 'single-person-discount',
    eligibilityClass: 'likely-eligible',
    indicativeOutcome: '25-percent-discount',
    billingAuthority: 'Leeds City Council',
    updatedAt: '2026-09-02'
  },
  {
    id: '2',
    accountReference: 'CT-100871',
    applicantName: 'Hughes, Rhys',
    claimType: 'student-exemption',
    eligibilityClass: 'likely-eligible',
    indicativeOutcome: 'full-exemption',
    billingAuthority: 'Leeds City Council',
    updatedAt: '2026-09-04'
  },
  {
    id: '3',
    accountReference: 'CT-204410',
    applicantName: 'Patel, Meera',
    claimType: 'severe-mental-impairment',
    eligibilityClass: 'incomplete',
    indicativeOutcome: 'smi-disregard',
    billingAuthority: 'Birmingham City Council',
    updatedAt: '2026-09-05'
  },
  {
    id: '4',
    accountReference: 'CT-310077',
    applicantName: 'Walker, Dennis',
    claimType: 'single-person-discount',
    eligibilityClass: 'likely-ineligible',
    indicativeOutcome: 'none',
    billingAuthority: 'Sheffield City Council',
    updatedAt: '2026-09-06'
  },
  {
    id: '5',
    accountReference: 'CT-411902',
    applicantName: 'Novak, Katarina',
    claimType: 'disabled-band-reduction',
    eligibilityClass: 'likely-eligible',
    indicativeOutcome: 'band-reduction',
    billingAuthority: 'Bristol City Council',
    updatedAt: '2026-09-08'
  },
  {
    id: '6',
    accountReference: 'CT-522631',
    applicantName: 'Brown, Imani',
    claimType: 'care-leaver-relief',
    eligibilityClass: 'likely-ineligible',
    indicativeOutcome: 'none',
    billingAuthority: 'Manchester City Council',
    updatedAt: '2026-09-09'
  },
  {
    id: '7',
    accountReference: 'CT-633115',
    applicantName: 'Ahmed, Farid',
    claimType: 'council-tax-reduction',
    eligibilityClass: 'incomplete',
    indicativeOutcome: 'means-tested-reduction',
    billingAuthority: 'Newcastle City Council',
    updatedAt: '2026-09-10'
  }
];

export { sampleApplications };
