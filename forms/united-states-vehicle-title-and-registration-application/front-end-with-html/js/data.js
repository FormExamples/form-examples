// Sample application data for the clerk dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data/sample-reports.ts` so the two
// implementations show identical demo content when the backend is offline. The
// rows span all three application classes (ready-to-submit, incomplete,
// title-brand-or-lien-issue) and cover a range of states and vehicles. The VINs
// pass the 49 CFR 565.15 check digit.

/** @type {import('./dashboard-types.js').ApplicationRow[]} */
const sampleApplications = [
  {
    id: '1',
    ownerName: 'Alvarez, Marisol',
    vin: '1HGCM82633A004352',
    state: 'CA',
    vehicle: '2003 Honda Accord',
    applicationClass: 'ready-to-submit',
    brandOrLienIssue: false,
    outstandingItemCount: 0,
    updatedAt: '2026-10-14'
  },
  {
    id: '2',
    ownerName: 'Brooks, Daniel',
    vin: '1FTFW1E55NFA12345',
    state: 'TX',
    vehicle: '2022 Ford F-150',
    applicationClass: 'incomplete',
    brandOrLienIssue: false,
    outstandingItemCount: 4,
    updatedAt: '2026-10-18'
  },
  {
    id: '3',
    ownerName: 'Chen, Wei',
    vin: '5YJ3E1EA1PF000123',
    state: 'WA',
    vehicle: '2023 Tesla Model 3',
    applicationClass: 'ready-to-submit',
    brandOrLienIssue: false,
    outstandingItemCount: 0,
    updatedAt: '2026-10-21'
  },
  {
    id: '4',
    ownerName: 'Delaney, Ruth',
    vin: '1GCHK24K9TE234567',
    state: 'PA',
    vehicle: '2026 Chevrolet Silverado',
    applicationClass: 'title-brand-or-lien-issue',
    brandOrLienIssue: true,
    outstandingItemCount: 2,
    updatedAt: '2026-10-25'
  },
  {
    id: '5',
    ownerName: 'Evans, Tomasz',
    vin: '3VWFE21C24M000999',
    state: 'FL',
    vehicle: '2004 Volkswagen Jetta',
    applicationClass: 'title-brand-or-lien-issue',
    brandOrLienIssue: true,
    outstandingItemCount: 1,
    updatedAt: '2026-10-29'
  },
  {
    id: '6',
    ownerName: 'Fischer, Anneliese',
    vin: 'JTDKN3DU6A0123456',
    state: 'MT',
    vehicle: '2010 Toyota Prius',
    applicationClass: 'ready-to-submit',
    brandOrLienIssue: false,
    outstandingItemCount: 0,
    updatedAt: '2026-11-02'
  },
  {
    id: '7',
    ownerName: 'Gupta, Rohan',
    vin: '2HGFC2F59SH500321',
    state: 'IL',
    vehicle: '2025 Honda Civic',
    applicationClass: 'incomplete',
    brandOrLienIssue: false,
    outstandingItemCount: 3,
    updatedAt: '2026-11-05'
  }
];

export { sampleApplications };
