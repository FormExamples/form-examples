// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Total GRACE point total — integer (~0-350+), or null when not yet scored.
 *
 * @typedef {number | null} GracePoints
 */

/**
 * Derived overall risk category emitted by the scoring engine (the worse of the
 * in-hospital and 6-month mortality bands). Lower-case strings matching the
 * SvelteKit dashboard so the same backend payload can drive either UI.
 *
 * @typedef {'low' | 'intermediate' | 'high'} RiskCategory
 */

/**
 * Care setting where the assessment was performed.
 *
 * @typedef {'emergency-department' | 'acute-medical-unit' | 'coronary-care-unit' | 'cardiology-ward' | 'other'} CareSetting
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/grace-score-for-acute-coronary-syndrome/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                 - UUID of the assessment record
 * @property {string} patientIdentifier  - local patient identifier
 * @property {string} patientName        - "Surname, Given" display name
 * @property {CareSetting} careSetting    - where the assessment was performed
 * @property {GracePoints} gracePoints   - total GRACE point total or null
 * @property {RiskCategory} riskCategory - derived overall risk category
 * @property {boolean} escalationFlag    - true when High category (early angiography within 24 h)
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
// before they read `window.GraceScoreForAcuteCoronarySyndromeDashboard`.
