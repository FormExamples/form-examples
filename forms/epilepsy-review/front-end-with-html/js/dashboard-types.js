// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * Seizure-control class emitted by the grading engine.
 *
 * @typedef {'seizure-free' | 'controlled' | 'uncontrolled'} SeizureControl
 */

/**
 * Review completeness emitted by the grading engine.
 *
 * @typedef {'complete' | 'partial' | 'incomplete'} ReviewStatus
 */

/**
 * Care setting where the review was conducted.
 *
 * @typedef {'general-practice' | 'epilepsy-clinic' | 'community' | 'other'} CareSetting
 */

/**
 * Review row displayed in the clinician dashboard.
 *
 * Mirrors `ReviewRow` in
 * `forms/epilepsy-review/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} ReviewRow
 * @property {string} id                    - UUID of the review record
 * @property {string} patientIdentifier     - NHS number / local identifier
 * @property {string} patientName           - "Surname, Given" display name
 * @property {CareSetting} careSetting        - general-practice | epilepsy-clinic | community | other
 * @property {SeizureControl} seizureControl  - seizure-free | controlled | uncontrolled
 * @property {ReviewStatus} reviewStatus      - complete | partial | incomplete
 * @property {boolean} safetyFlag            - true when any high-priority safety flag was raised
 * @property {string} reviewedAt             - ISO date of review (yyyy-mm-dd)
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
// `window.EpilepsyReviewDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file is
// unambiguously side-effecting and other files can rely on it loading before
// they read `window.EpilepsyReviewDashboard`.
