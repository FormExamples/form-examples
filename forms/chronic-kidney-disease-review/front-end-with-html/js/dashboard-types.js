// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * KDIGO G-stage emitted by the grading engine.
 *
 * @typedef {'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5' | ''} GfrCategory
 */

/**
 * KDIGO albuminuria stage emitted by the grading engine.
 *
 * @typedef {'A1' | 'A2' | 'A3' | ''} AlbuminuriaCategory
 */

/**
 * KDIGO risk zone from the GFR x albuminuria heat-map.
 *
 * @typedef {'low' | 'moderate' | 'high' | 'very-high' | ''} KdigoRiskZone
 */

/**
 * Review completeness emitted by the grading engine.
 *
 * @typedef {'complete' | 'partial' | 'incomplete'} ReviewStatus
 */

/**
 * Review row displayed in the clinician dashboard.
 *
 * Mirrors `ReviewRow` in
 * `forms/chronic-kidney-disease-review/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} ReviewRow
 * @property {string} id                       - UUID of the review record
 * @property {string} patientIdentifier        - NHS number / local identifier
 * @property {string} patientName              - "Surname, Given" display name
 * @property {string} careSetting              - care setting of the review
 * @property {GfrCategory} gfrCategory          - G1 | G2 | G3a | G3b | G4 | G5
 * @property {AlbuminuriaCategory} albuminuriaCategory - A1 | A2 | A3
 * @property {KdigoRiskZone} kdigoRiskZone       - low | moderate | high | very-high
 * @property {ReviewStatus} reviewStatus        - complete | partial | incomplete
 * @property {boolean} referralFlag             - true when a nephrology-referral flag was raised
 * @property {string} reviewedAt                - ISO date of review (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/reviews`.
 *
 * @typedef {Object} DashboardReviewsResponse
 * @property {ReviewRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules) so the page can be opened directly via `file://`.
// The IIFE attaches its public symbols to a single global namespace,
// `window.ChronicKidneyDiseaseReviewDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file is
// unambiguously side-effecting and other files can rely on it loading before
// they read `window.ChronicKidneyDiseaseReviewDashboard`.
