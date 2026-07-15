// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * GOLD airflow-limitation grade — integer 1-4, or null when not yet graded.
 *
 * @typedef {1 | 2 | 3 | 4 | null} GoldGrade
 */

/**
 * Combined ABE assessment group, or null when it could not be assigned.
 *
 * @typedef {'A' | 'B' | 'E' | null} AbeGroup
 */

/**
 * Review-completeness grade emitted by the grading engine.
 *
 * @typedef {'complete' | 'partial' | 'incomplete'} ReviewStatus
 */

/**
 * Review type.
 *
 * @typedef {'routine-annual' | 'post-exacerbation' | 'opportunistic'} ReviewType
 */

/**
 * Review row displayed in the clinician dashboard.
 *
 * Mirrors `ReviewRow` in
 * `forms/chronic-obstructive-pulmonary-disease-review/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} ReviewRow
 * @property {string} id                 - UUID of the review record
 * @property {string} patientIdentifier  - local patient identifier
 * @property {string} patientName        - "Surname, Given" display name
 * @property {ReviewType} reviewType     - type of review
 * @property {GoldGrade} goldGrade       - GOLD airflow grade (1-4) or null
 * @property {AbeGroup} abeGroup         - combined ABE assessment group
 * @property {ReviewStatus} reviewStatus - review-completeness grade
 * @property {boolean} escalationFlag    - true when abeGroup == 'E' (escalate therapy)
 * @property {string} reviewedAt         - ISO date of review (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/reviews`.
 *
 * @typedef {Object} DashboardReviewsResponse
 * @property {ReviewRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only. Touch the namespace so this file is
// unambiguously side-effecting and other files can rely on it loading before
// they read `window.ChronicObstructivePulmonaryDiseaseReviewDashboard`.
