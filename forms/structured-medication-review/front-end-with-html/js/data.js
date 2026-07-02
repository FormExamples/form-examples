// Sample review data for the clinician dashboard.
//
// Mirrors the SvelteKit dashboard's `src/lib/data.ts` so the two
// implementations show identical demo content when the backend is offline.
// The rows span every burden band, both review statuses, and every care
// setting, with medicine counts and ACB scores consistent with the band.

(function () {
'use strict';
window.StructuredMedicationReviewDashboard =
  window.StructuredMedicationReviewDashboard || {};

/** @type {import('./dashboard-types.js').ReviewRow[]} */
const sampleReviews = [
  {
    id: '1',
    patientIdentifier: 'GP-204817',
    patientName: 'Okafor, Beatrice',
    careSetting: 'gp-practice',
    medicineCount: 3,
    regularMedicineCount: 3,
    anticholinergicBurdenScore: 0,
    burdenBand: 'low',
    reviewStatus: 'complete',
    reviewedAt: '2026-06-22'
  },
  {
    id: '2',
    patientIdentifier: 'PCN-551903',
    patientName: 'Whitfield, Harold',
    careSetting: 'pcn',
    medicineCount: 8,
    regularMedicineCount: 7,
    anticholinergicBurdenScore: 2,
    burdenBand: 'moderate',
    reviewStatus: 'complete',
    reviewedAt: '2026-06-23'
  },
  {
    id: '3',
    patientIdentifier: 'CH-100442',
    patientName: 'Nowak, Irena',
    careSetting: 'care-home',
    medicineCount: 12,
    regularMedicineCount: 11,
    anticholinergicBurdenScore: 5,
    burdenBand: 'high',
    reviewStatus: 'incomplete',
    reviewedAt: '2026-06-24'
  },
  {
    id: '4',
    patientIdentifier: 'GP-204981',
    patientName: 'Ahmed, Yusuf',
    careSetting: 'gp-practice',
    medicineCount: 6,
    regularMedicineCount: 6,
    anticholinergicBurdenScore: 4,
    burdenBand: 'high',
    reviewStatus: 'complete',
    reviewedAt: '2026-06-25'
  },
  {
    id: '5',
    patientIdentifier: 'CP-773025',
    patientName: 'Fletcher, Margaret',
    careSetting: 'community-pharmacy',
    medicineCount: 5,
    regularMedicineCount: 5,
    anticholinergicBurdenScore: 1,
    burdenBand: 'moderate',
    reviewStatus: 'incomplete',
    reviewedAt: '2026-06-26'
  },
  {
    id: '6',
    patientIdentifier: 'PH-880137',
    patientName: 'Silva, Rui',
    careSetting: 'patient-home',
    medicineCount: 2,
    regularMedicineCount: 2,
    anticholinergicBurdenScore: 0,
    burdenBand: 'low',
    reviewStatus: 'complete',
    reviewedAt: '2026-06-27'
  },
  {
    id: '7',
    patientIdentifier: 'CH-100519',
    patientName: 'Byrne, Aoife',
    careSetting: 'care-home',
    medicineCount: 14,
    regularMedicineCount: 13,
    anticholinergicBurdenScore: 6,
    burdenBand: 'high',
    reviewStatus: 'incomplete',
    reviewedAt: '2026-06-28'
  }
];

window.StructuredMedicationReviewDashboard.sampleReviews = sampleReviews;
})();
