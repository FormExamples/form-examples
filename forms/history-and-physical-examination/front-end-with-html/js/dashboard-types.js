// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * Documentation-completeness status emitted by the grading engine.
 *
 * @typedef {'complete' | 'partial' | 'incomplete'} CompletenessStatus
 */

/**
 * Care setting where the clerking was performed.
 *
 * @typedef {'emergency-department' | 'acute-medical-unit' | 'ward' | 'other'} CareSetting
 */

/**
 * Clerking row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/history-and-physical-examination/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                     - UUID of the clerking record
 * @property {string} patientIdentifier      - local patient identifier
 * @property {string} patientName            - "Surname, Given" display name
 * @property {CareSetting} careSetting        - where the clerking was performed
 * @property {CompletenessStatus} status     - documentation-completeness status
 * @property {number | null} completenessPercent - 0-100, or null when not graded
 * @property {boolean} blockingFlag          - true when a blocking flag (allergies
 *                                             undocumented, or no impression and no plan) fired
 * @property {string} clerkedAt              - ISO date of clerking (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/assessments`.
 *
 * @typedef {Object} DashboardAssessmentsResponse
 * @property {AssessmentRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules) so the page can be opened directly via `file://`.
// The IIFE attaches its public symbols to a single global namespace,
// `window.HistoryAndPhysicalExaminationDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file is
// unambiguously side-effecting and other files can rely on it loading first.
