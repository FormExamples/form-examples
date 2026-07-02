// Sample review data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two implementations
// show identical demo content when the backend is offline. The rows span all
// three seizure-control classes, all three review-completeness statuses, every
// care setting, and set the safety flag whenever a high-priority safety flag
// (valproate PPP, status epilepticus, DVLA driving, or suicidality) was raised.

(function () {
'use strict';
window.EpilepsyReviewDashboard =
  window.EpilepsyReviewDashboard || {};

/** @type {import('./dashboard-types.js').ReviewRow[]} */
const sampleReviews = [
  {
    id: '1',
    patientIdentifier: 'NHS 943 476 5919',
    patientName: 'Okafor, Chidi',
    careSetting: 'general-practice',
    seizureControl: 'seizure-free',
    reviewStatus: 'complete',
    safetyFlag: false,
    reviewedAt: '2026-06-22'
  },
  {
    id: '2',
    patientIdentifier: 'NHS 611 208 3344',
    patientName: 'Doyle, Aoife',
    careSetting: 'epilepsy-clinic',
    seizureControl: 'uncontrolled',
    reviewStatus: 'complete',
    safetyFlag: true,
    reviewedAt: '2026-06-24'
  },
  {
    id: '3',
    patientIdentifier: 'NHS 330 149 7720',
    patientName: 'Nowak, Piotr',
    careSetting: 'community',
    seizureControl: 'controlled',
    reviewStatus: 'partial',
    safetyFlag: false,
    reviewedAt: '2026-06-24'
  },
  {
    id: '4',
    patientIdentifier: 'NHS 905 513 2201',
    patientName: 'Fernandez, Rosa',
    careSetting: 'general-practice',
    seizureControl: 'seizure-free',
    reviewStatus: 'complete',
    safetyFlag: false,
    reviewedAt: '2026-06-25'
  },
  {
    id: '5',
    patientIdentifier: 'NHS 118 427 6650',
    patientName: 'Thompson, Gary',
    careSetting: 'epilepsy-clinic',
    seizureControl: 'uncontrolled',
    reviewStatus: 'partial',
    safetyFlag: true,
    reviewedAt: '2026-06-26'
  },
  {
    id: '6',
    patientIdentifier: 'NHS 771 488 1093',
    patientName: 'Abadi, Layla',
    careSetting: 'community',
    seizureControl: 'controlled',
    reviewStatus: 'partial',
    safetyFlag: true,
    reviewedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'NHS 560 234 8817',
    patientName: 'Whitfield, Eleanor',
    careSetting: 'general-practice',
    seizureControl: 'controlled',
    reviewStatus: 'complete',
    safetyFlag: false,
    reviewedAt: '2026-06-27'
  },
  {
    id: '8',
    patientIdentifier: 'NHS 204 815 5528',
    patientName: 'Sato, Kenji',
    careSetting: 'epilepsy-clinic',
    seizureControl: 'seizure-free',
    reviewStatus: 'incomplete',
    safetyFlag: false,
    reviewedAt: '2026-06-28'
  }
];

window.EpilepsyReviewDashboard.sampleReviews = sampleReviews;
})();
