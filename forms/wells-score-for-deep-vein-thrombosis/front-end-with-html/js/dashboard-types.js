// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * Total Wells DVT score — integer −2..9, or null when not yet scored.
 *
 * @typedef {number | null} WellsScore
 */

/**
 * Two-level (NICE NG158) band emitted by the scoring engine. Lower-case strings
 * matching the SvelteKit dashboard so the same backend payload can drive either
 * UI without translation.
 *
 * @typedef {'likely' | 'unlikely'} TwoLevelBand
 */

/**
 * Recommended first investigation, derived from the two-level band.
 *
 * @typedef {'proximal-leg-vein-ultrasound' | 'd-dimer'} RecommendedInvestigation
 */

/**
 * Care setting where the assessment was performed.
 *
 * @typedef {'emergency-department' | 'ambulatory' | 'acute-medical-unit' | 'dvt-clinic' | 'other'} CareSetting
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/wells-score-for-deep-vein-thrombosis/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                 - UUID of the assessment record
 * @property {string} patientIdentifier  - local patient identifier
 * @property {string} patientName        - "Surname, Given" display name
 * @property {CareSetting} careSetting    - where the assessment was performed
 * @property {WellsScore} wellsScore     - total Wells DVT score (−2..9) or null
 * @property {TwoLevelBand} twoLevelBand - derived two-level band
 * @property {RecommendedInvestigation} recommendedInvestigation - derived first test
 * @property {string} assessedAt         - ISO date of assessment (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/assessments`.
 *
 * @typedef {Object} DashboardAssessmentsResponse
 * @property {AssessmentRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.WellsScoreForDeepVeinThrombosisDashboard`.
