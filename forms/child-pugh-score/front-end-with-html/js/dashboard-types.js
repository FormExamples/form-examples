// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Total Child-Pugh score — integer 5-15, or null when not yet scored.
 *
 * @typedef {number | null} ChildPughScoreValue
 */

/**
 * Derived Child-Pugh class emitted by the scoring engine.
 *
 * @typedef {'A' | 'B' | 'C'} ChildPughClass
 */

/**
 * Care setting where the assessment was performed.
 *
 * @typedef {'hepatology-clinic' | 'ward' | 'pre-operative' | 'intensive-care' | 'other'} CareSetting
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/child-pugh-score/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                  - UUID of the assessment record
 * @property {string} patientIdentifier   - local patient identifier
 * @property {string} patientName         - "Surname, Given" display name
 * @property {CareSetting} careSetting     - where the assessment was performed
 * @property {ChildPughScoreValue} childPughScore - total Child-Pugh score (5-15) or null
 * @property {ChildPughClass} childPughClass       - derived class A/B/C
 * @property {boolean} decompensatedFlag  - true when Class C (decompensated cirrhosis)
 * @property {string} assessedAt          - ISO date of assessment (yyyy-mm-dd)
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
// before they read `window.ChildPughScoreDashboard`.
