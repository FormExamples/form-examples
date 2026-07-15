// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Aggregate NEWS2 total — integer 0-20+, or null when not yet scored.
 *
 * @typedef {number | null} AggregateScore
 */

/**
 * Derived clinical-risk band emitted by the scoring engine. Matches the
 * SvelteKit dashboard so the same backend payload can drive either UI.
 *
 * @typedef {'low' | 'low-medium' | 'medium' | 'high'} RiskBand
 */

/**
 * Care setting where the observation set was recorded.
 *
 * @typedef {'emergency-department' | 'acute-medical-unit' | 'ward' | 'pre-hospital' | 'other'} CareSetting
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/national-early-warning-score-2/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                 - UUID of the observation record
 * @property {string} patientIdentifier  - local patient identifier (NHS number / MRN)
 * @property {string} patientName        - "Surname, Given" display name
 * @property {CareSetting} careSetting    - where the assessment was performed
 * @property {AggregateScore} aggregateScore - aggregate NEWS2 total (0-20+) or null
 * @property {RiskBand} riskBand         - derived clinical-risk band
 * @property {boolean} redScore          - true when any single parameter scored 3
 * @property {string} monitoringFrequency - RCP-recommended monitoring frequency
 * @property {string} observedAt         - ISO date of observation (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/assessments`.
 *
 * @typedef {Object} DashboardAssessmentsResponse
 * @property {AssessmentRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.NationalEarlyWarningScore2Dashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.NationalEarlyWarningScore2Dashboard`.
