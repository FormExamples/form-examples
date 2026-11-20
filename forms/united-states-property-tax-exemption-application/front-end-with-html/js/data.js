// Sample application data for the assessor dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data/sample-reports.ts` so the two
// implementations show identical demo content when the backend is offline. The
// rows span all three eligibility classes and include a late filing. Synthetic
// data only.

/** @type {import('./dashboard-types.js').ApplicationRow[]} */
const sampleApplications = [
  {
    id: '1',
    parcelNumber: '0412-3300-0017',
    applicantName: 'Gonzalez, Maria',
    eligibilityClass: 'likely-eligible',
    exemptionsClaimed: 'Homestead, Senior',
    filedLate: false,
    countyState: 'Travis, TX',
    updatedAt: '2026-03-18'
  },
  {
    id: '2',
    parcelNumber: 'R-2291-0045',
    applicantName: 'Whitaker, Dale',
    eligibilityClass: 'incomplete',
    exemptionsClaimed: 'Homestead, Senior',
    filedLate: false,
    countyState: 'Orange, FL',
    updatedAt: '2026-02-10'
  },
  {
    id: '3',
    parcelNumber: '17-04-226-019',
    applicantName: 'Kowalski, Anna',
    eligibilityClass: 'likely-ineligible',
    exemptionsClaimed: 'Homestead',
    filedLate: true,
    countyState: 'Cook, IL',
    updatedAt: '2026-06-02'
  },
  {
    id: '4',
    parcelNumber: 'P-55-0312-88',
    applicantName: 'Nguyen, Linh',
    eligibilityClass: 'likely-eligible',
    exemptionsClaimed: 'Homestead',
    filedLate: false,
    countyState: 'Allegheny, PA',
    updatedAt: '2026-02-20'
  },
  {
    id: '5',
    parcelNumber: '010-001234',
    applicantName: 'Brooks, Harold',
    eligibilityClass: 'likely-ineligible',
    exemptionsClaimed: 'Senior',
    filedLate: false,
    countyState: 'Franklin, OH',
    updatedAt: '2026-11-04'
  },
  {
    id: '6',
    parcelNumber: '3829-114-006',
    applicantName: 'Reyes, Camila',
    eligibilityClass: 'incomplete',
    exemptionsClaimed: 'Homestead, Disabled veteran',
    filedLate: false,
    countyState: 'King, WA',
    updatedAt: '2026-04-15'
  },
  {
    id: '7',
    parcelNumber: 'APN 123-456-789',
    applicantName: 'Okafor, Ngozi',
    eligibilityClass: 'likely-eligible',
    exemptionsClaimed: 'Homestead',
    filedLate: false,
    countyState: 'Los Angeles, CA',
    updatedAt: '2026-02-03'
  }
];

export { sampleApplications };
