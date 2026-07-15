// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Aggregate PEWS total — integer 0-21, or null when not yet scored.
 *
 * @typedef {number | null} AggregateScore
 */

/**
 * Derived escalation band emitted by the scoring engine. Matches the SvelteKit
 * dashboard so the same backend payload can drive either UI.
 *
 * @typedef {'routine' | 'low' | 'medium' | 'high'} EscalationBand
 */

/**
 * Age band that drives the normal ranges for the rate parameters.
 *
 * @typedef {'neonate' | 'infant' | 'young-child' | 'child' | 'adolescent'} AgeBand
 */

/**
 * Care setting where the observation set was recorded.
 *
 * @typedef {'ward' | 'childrens-assessment-unit' | 'emergency-department' | 'other'} CareSetting
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/paediatric-early-warning-score/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                 - UUID of the observation record
 * @property {string} patientIdentifier  - local patient identifier (NHS number / MRN)
 * @property {string} patientName        - "Surname, Given" display name
 * @property {AgeBand} ageBand           - age band driving the normal ranges
 * @property {CareSetting} careSetting    - where the assessment was performed
 * @property {AggregateScore} aggregateScore - aggregate PEWS total (0-21) or null
 * @property {EscalationBand} escalationBand  - derived escalation band
 * @property {boolean} singleParameterTrigger - true when any single parameter scored 3
 * @property {boolean} concernTrigger    - true when nurse or parent concern documented
 * @property {string} monitoringFrequency - recommended monitoring frequency
 * @property {string} observedAt         - ISO date of observation (yyyy-mm-dd)
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
// before they read `window.PaediatricEarlyWarningScoreDashboard`.
