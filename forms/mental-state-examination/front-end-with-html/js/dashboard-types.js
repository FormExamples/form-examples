// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Completeness status emitted by the grading engine.
 *
 * @typedef {'complete' | 'partial'} CompletenessStatus
 */

/**
 * Risk indicator derived from the highest-priority safety flag raised. Lower-case
 * strings matching the SvelteKit dashboard so the same backend payload can drive
 * either UI without translation.
 *
 * @typedef {'none' | 'low' | 'moderate' | 'high'} RiskLevel
 */

/**
 * Care setting where the examination was performed.
 *
 * @typedef {'outpatient' | 'inpatient' | 'liaison' | 'crisis' | 'primary-care' | 'other'} CareSetting
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/mental-state-examination/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                        - UUID of the examination record
 * @property {string} patientIdentifier         - local patient identifier
 * @property {string} patientName               - "Surname, Given" display name
 * @property {CareSetting} careSetting           - where the examination was performed
 * @property {CompletenessStatus} status         - complete | partial
 * @property {number} completenessPercent        - 0..100 across the 7 ASEPTIC domains
 * @property {RiskLevel} riskLevel               - derived risk indicator
 * @property {boolean} safetyFlag                - true when a high-priority safety flag was raised
 * @property {string} assessedAt                 - ISO date of assessment (yyyy-mm-dd)
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
// before they read `window.MentalStateExaminationDashboard`.
