// Sample review data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline. The
// rows span every heart-failure type, all four NYHA functional statuses, all
// four medication-optimisation statuses, and every review-completeness grade,
// with the urgent-review flag set for the symptomatic / advanced patients.

(function () {
'use strict';
window.HeartFailureReviewDashboard = window.HeartFailureReviewDashboard || {};

/** @type {import('./dashboard-types.js').ReviewRow[]} */
const sampleReviews = [
  {
    id: '1',
    patientIdentifier: 'HF-204815',
    patientName: 'Okafor, Chidi',
    careSetting: 'general-practice',
    heartFailureType: 'reduced',
    functionalStatus: 'stable',
    optimisationStatus: 'optimised',
    reviewStatus: 'complete',
    urgentFlag: false,
    reviewedAt: '2026-06-18'
  },
  {
    id: '2',
    patientIdentifier: 'HF-771302',
    patientName: 'Doyle, Aoife',
    careSetting: 'community-hf-service',
    heartFailureType: 'reduced',
    functionalStatus: 'advanced',
    optimisationStatus: 'suboptimal',
    reviewStatus: 'partial',
    urgentFlag: true,
    reviewedAt: '2026-06-20'
  },
  {
    id: '3',
    patientIdentifier: 'HF-330149',
    patientName: 'Nowak, Piotr',
    careSetting: 'general-practice',
    heartFailureType: 'preserved',
    functionalStatus: 'symptomatic',
    optimisationStatus: 'partial',
    reviewStatus: 'partial',
    urgentFlag: true,
    reviewedAt: '2026-06-22'
  },
  {
    id: '4',
    patientIdentifier: 'HF-905513',
    patientName: 'Fernandez, Rosa',
    careSetting: 'hospital-clinic',
    heartFailureType: 'mildly-reduced',
    functionalStatus: 'stable',
    optimisationStatus: 'optimised',
    reviewStatus: 'complete',
    urgentFlag: false,
    reviewedAt: '2026-06-23'
  },
  {
    id: '5',
    patientIdentifier: 'HF-118427',
    patientName: 'Thompson, Gary',
    careSetting: 'general-practice',
    heartFailureType: 'reduced',
    functionalStatus: 'stable',
    optimisationStatus: 'partial',
    reviewStatus: 'incomplete',
    urgentFlag: false,
    reviewedAt: '2026-06-24'
  },
  {
    id: '6',
    patientIdentifier: 'HF-771488',
    patientName: 'Abadi, Layla',
    careSetting: 'community-hf-service',
    heartFailureType: 'reduced',
    functionalStatus: 'advanced',
    optimisationStatus: 'optimised',
    reviewStatus: 'complete',
    urgentFlag: true,
    reviewedAt: '2026-06-25'
  },
  {
    id: '7',
    patientIdentifier: 'HF-560234',
    patientName: 'Whitfield, Eleanor',
    careSetting: 'general-practice',
    heartFailureType: 'preserved',
    functionalStatus: 'stable',
    optimisationStatus: 'not-applicable',
    reviewStatus: 'complete',
    urgentFlag: false,
    reviewedAt: '2026-06-26'
  },
  {
    id: '8',
    patientIdentifier: 'HF-330217',
    patientName: 'Sato, Kenji',
    careSetting: 'hospital-clinic',
    heartFailureType: 'unknown',
    functionalStatus: 'unknown',
    optimisationStatus: 'not-applicable',
    reviewStatus: 'incomplete',
    urgentFlag: false,
    reviewedAt: '2026-06-27'
  }
];

window.HeartFailureReviewDashboard.sampleReviews = sampleReviews;
})();
