// Sample review data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two implementations
// show identical demo content when the backend is offline. The rows span all
// three control classes, all three review-completeness statuses, every
// hypertension stage, and set the severe flag whenever clinic BP was >= 180/120.

/** @type {import('./dashboard-types.js').ReviewRow[]} */
const sampleReviews = [
  {
    id: '1',
    patientIdentifier: 'NHS 943 476 5919',
    patientName: 'Okafor, Chidi',
    practiceSite: 'Riverside Medical Practice',
    controlStatus: 'controlled',
    reviewStatus: 'complete',
    hypertensionStage: 'stage-1',
    severeFlag: false,
    reviewedAt: '2026-06-22'
  },
  {
    id: '2',
    patientIdentifier: 'NHS 611 208 3344',
    patientName: 'Doyle, Aoife',
    practiceSite: 'Kingsgate Surgery',
    controlStatus: 'severe-uncontrolled',
    reviewStatus: 'complete',
    hypertensionStage: 'stage-3-severe',
    severeFlag: true,
    reviewedAt: '2026-06-24'
  },
  {
    id: '3',
    patientIdentifier: 'NHS 330 149 7720',
    patientName: 'Nowak, Piotr',
    practiceSite: 'Elm Park Health Centre',
    controlStatus: 'uncontrolled',
    reviewStatus: 'partial',
    hypertensionStage: 'stage-2',
    severeFlag: false,
    reviewedAt: '2026-06-24'
  },
  {
    id: '4',
    patientIdentifier: 'NHS 905 513 2201',
    patientName: 'Fernandez, Rosa',
    practiceSite: 'Riverside Medical Practice',
    controlStatus: 'controlled',
    reviewStatus: 'complete',
    hypertensionStage: 'none',
    severeFlag: false,
    reviewedAt: '2026-06-25'
  },
  {
    id: '5',
    patientIdentifier: 'NHS 118 427 6650',
    patientName: 'Thompson, Gary',
    practiceSite: 'Kingsgate Surgery',
    controlStatus: 'uncontrolled',
    reviewStatus: 'partial',
    hypertensionStage: 'stage-1',
    severeFlag: false,
    reviewedAt: '2026-06-26'
  },
  {
    id: '6',
    patientIdentifier: 'NHS 771 488 1093',
    patientName: 'Abadi, Layla',
    practiceSite: 'Elm Park Health Centre',
    controlStatus: 'severe-uncontrolled',
    reviewStatus: 'partial',
    hypertensionStage: 'stage-3-severe',
    severeFlag: true,
    reviewedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'NHS 560 234 8817',
    patientName: 'Whitfield, Eleanor',
    practiceSite: 'Riverside Medical Practice',
    controlStatus: 'controlled',
    reviewStatus: 'complete',
    hypertensionStage: 'stage-1',
    severeFlag: false,
    reviewedAt: '2026-06-27'
  },
  {
    id: '8',
    patientIdentifier: 'NHS 204 815 5528',
    patientName: 'Sato, Kenji',
    practiceSite: 'Kingsgate Surgery',
    controlStatus: 'controlled',
    reviewStatus: 'incomplete',
    hypertensionStage: 'none',
    severeFlag: false,
    reviewedAt: '2026-06-28'
  }
];

export { sampleReviews };
