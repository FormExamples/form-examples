// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the SMR clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Composite burden band emitted by the scoring engine.
 * @typedef {'low' | 'moderate' | 'high'} BurdenBand
 */

/**
 * Overall review status.
 * @typedef {'complete' | 'incomplete'} ReviewStatus
 */

/**
 * Care setting where the review was performed.
 * @typedef {'gp-practice' | 'pcn' | 'care-home' | 'community-pharmacy' | 'patient-home'} CareSetting
 */

/**
 * Review row displayed in the clinician dashboard.
 *
 * Mirrors `ReviewRow` in
 * `forms/structured-medication-review/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} ReviewRow
 * @property {string} id                          - UUID of the review record
 * @property {string} patientIdentifier           - local patient identifier
 * @property {string} patientName                 - "Surname, Given" display name
 * @property {CareSetting} careSetting            - where the review was performed
 * @property {number} medicineCount               - total medicines reviewed
 * @property {number} regularMedicineCount        - regular medicines (polypharmacy count)
 * @property {number} anticholinergicBurdenScore  - ACB sum
 * @property {BurdenBand} burdenBand              - composite burden band
 * @property {ReviewStatus} reviewStatus          - complete | incomplete
 * @property {string} reviewedAt                  - ISO date of review (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/reviews`.
 *
 * @typedef {Object} DashboardReviewsResponse
 * @property {ReviewRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules). The IIFE attaches its public symbols to a single
// global namespace, `window.StructuredMedicationReviewDashboard`.
(function () {
'use strict';
window.StructuredMedicationReviewDashboard =
  window.StructuredMedicationReviewDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.StructuredMedicationReviewDashboard`.
})();
