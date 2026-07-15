// Sample document rows for the arc42 architecture dashboard.
//
// Used when the backend is offline so the dashboard is usable standalone.
// Each row is derived by running the shared maturity engine over one of the
// four canonical sample arc42 documents (a draft, a reviewable, a ready, and a
// mature document), mirroring the SvelteKit `sample-reports.ts`
// `sampleDocumentRows`. The values here are the engine output for those
// documents, so the HTML dashboard, the Svelte dashboard, and the report agree.

/** @type {import('./dashboard-types.js').DashboardRow[]} */
const sampleDocuments = [
  {
    id: 'arc42-2026-0001',
    name: 'Inventory Service',
    owner: 'Platform Team',
    updatedDate: '2026-06-02',
    maturity: 'draft',
    sectionsComplete: 0,
    flagCount: 12,
    recommendation: ''
  },
  {
    id: 'arc42-2026-0002',
    name: 'Payments Gateway',
    owner: 'Payments Team',
    updatedDate: '2026-06-10',
    maturity: 'reviewable',
    sectionsComplete: 3,
    flagCount: 8,
    recommendation: ''
  },
  {
    id: 'arc42-2026-0003',
    name: 'Order Platform',
    owner: 'Commerce Team',
    updatedDate: '2026-06-14',
    maturity: 'ready',
    sectionsComplete: 12,
    flagCount: 0,
    recommendation: 'revise-first'
  },
  {
    id: 'arc42-2026-0004',
    name: 'Identity Service',
    owner: 'Security Team',
    updatedDate: '2026-06-20',
    maturity: 'mature',
    sectionsComplete: 12,
    flagCount: 0,
    recommendation: 'proceed'
  }
];

export { sampleDocuments };
