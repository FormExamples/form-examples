// Sample review data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two implementations
// show identical demo content when the backend is offline. The rows span the
// KDIGO G-stages and albuminuria stages, all four risk zones, all three
// review-completeness statuses, and set the referral flag whenever a
// nephrology-referral criterion (very-high zone, eGFR < 30, or ACR >= 70) fired.

(function () {
'use strict';
window.ChronicKidneyDiseaseReviewDashboard =
  window.ChronicKidneyDiseaseReviewDashboard || {};

/** @type {import('./dashboard-types.js').ReviewRow[]} */
const sampleReviews = [
  {
    id: '1',
    patientIdentifier: 'NHS 943 476 5919',
    patientName: 'Okafor, Chidi',
    careSetting: 'general-practice',
    gfrCategory: 'G2',
    albuminuriaCategory: 'A1',
    kdigoRiskZone: 'low',
    reviewStatus: 'complete',
    referralFlag: false,
    reviewedAt: '2026-06-22'
  },
  {
    id: '2',
    patientIdentifier: 'NHS 611 208 3344',
    patientName: 'Doyle, Aoife',
    careSetting: 'community-nephrology',
    gfrCategory: 'G4',
    albuminuriaCategory: 'A3',
    kdigoRiskZone: 'very-high',
    reviewStatus: 'complete',
    referralFlag: true,
    reviewedAt: '2026-06-24'
  },
  {
    id: '3',
    patientIdentifier: 'NHS 330 149 7720',
    patientName: 'Nowak, Piotr',
    careSetting: 'long-term-conditions-clinic',
    gfrCategory: 'G3a',
    albuminuriaCategory: 'A2',
    kdigoRiskZone: 'high',
    reviewStatus: 'partial',
    referralFlag: false,
    reviewedAt: '2026-06-24'
  },
  {
    id: '4',
    patientIdentifier: 'NHS 905 513 2201',
    patientName: 'Fernandez, Rosa',
    careSetting: 'general-practice',
    gfrCategory: 'G1',
    albuminuriaCategory: 'A1',
    kdigoRiskZone: 'low',
    reviewStatus: 'complete',
    referralFlag: false,
    reviewedAt: '2026-06-25'
  },
  {
    id: '5',
    patientIdentifier: 'NHS 118 427 6650',
    patientName: 'Thompson, Gary',
    careSetting: 'general-practice',
    gfrCategory: 'G3b',
    albuminuriaCategory: 'A3',
    kdigoRiskZone: 'very-high',
    reviewStatus: 'partial',
    referralFlag: true,
    reviewedAt: '2026-06-26'
  },
  {
    id: '6',
    patientIdentifier: 'NHS 771 488 1093',
    patientName: 'Abadi, Layla',
    careSetting: 'community-nephrology',
    gfrCategory: 'G5',
    albuminuriaCategory: 'A3',
    kdigoRiskZone: 'very-high',
    reviewStatus: 'complete',
    referralFlag: true,
    reviewedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'NHS 560 234 8817',
    patientName: 'Whitfield, Eleanor',
    careSetting: 'general-practice',
    gfrCategory: 'G3a',
    albuminuriaCategory: 'A1',
    kdigoRiskZone: 'moderate',
    reviewStatus: 'complete',
    referralFlag: false,
    reviewedAt: '2026-06-27'
  },
  {
    id: '8',
    patientIdentifier: 'NHS 204 815 5528',
    patientName: 'Sato, Kenji',
    careSetting: 'long-term-conditions-clinic',
    gfrCategory: 'G2',
    albuminuriaCategory: '',
    kdigoRiskZone: '',
    reviewStatus: 'incomplete',
    referralFlag: false,
    reviewedAt: '2026-06-28'
  }
];

window.ChronicKidneyDiseaseReviewDashboard.sampleReviews = sampleReviews;
})();
