// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Heart-failure subtype by ejection fraction.
 *
 * @typedef {'reduced' | 'mildly-reduced' | 'preserved' | 'unknown'} HeartFailureType
 */

/**
 * NYHA functional status derived from the recorded NYHA class.
 *
 * @typedef {'stable' | 'symptomatic' | 'advanced' | 'unknown'} FunctionalStatus
 */

/**
 * Four-pillar medication-optimisation status.
 *
 * @typedef {'optimised' | 'partial' | 'suboptimal' | 'not-applicable'} OptimisationStatus
 */

/**
 * Review-completeness grade across the six required review domains.
 *
 * @typedef {'complete' | 'partial' | 'incomplete'} ReviewStatus
 */

/**
 * Care setting where the review was performed.
 *
 * @typedef {'general-practice' | 'community-hf-service' | 'hospital-clinic' | 'other'} CareSetting
 */

/**
 * Review row displayed in the clinician dashboard.
 *
 * Mirrors `ReviewRow` in
 * `forms/heart-failure-review/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} ReviewRow
 * @property {string} id                        - UUID of the review record
 * @property {string} patientIdentifier         - local patient identifier
 * @property {string} patientName               - "Surname, Given" display name
 * @property {CareSetting} careSetting           - where the review was performed
 * @property {HeartFailureType} heartFailureType - HF subtype by ejection fraction
 * @property {FunctionalStatus} functionalStatus - derived NYHA functional status
 * @property {OptimisationStatus} optimisationStatus - four-pillar optimisation status
 * @property {ReviewStatus} reviewStatus         - review-completeness grade
 * @property {boolean} urgentFlag                - true when an urgent-review flag was raised
 * @property {string} reviewedAt                 - ISO date of review (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/reviews`.
 *
 * @typedef {Object} DashboardReviewsResponse
 * @property {ReviewRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.HeartFailureReviewDashboard`.
