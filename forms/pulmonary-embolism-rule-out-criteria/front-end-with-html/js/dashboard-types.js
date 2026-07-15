// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.
//
// PERC is a status / classification form: the dashboard shows a binary
// classification (perc-negative / perc-positive), not a numeric score.

/**
 * Derived PERC classification emitted by the engine, or null when not yet
 * graded. Kebab-case strings matching the SQL and the SvelteKit dashboard so the
 * same backend payload can drive either UI without translation.
 *
 * @typedef {'perc-negative' | 'perc-positive' | null} Classification
 */

/**
 * Care setting where the assessment was carried out.
 *
 * @typedef {'emergency-department' | 'acute-ambulatory' | 'other' | ''} CareSetting
 */

/**
 * Clinician gestalt pre-test probability of PE.
 *
 * @typedef {'low' | 'not-low' | ''} PretestProbability
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/pulmonary-embolism-rule-out-criteria/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                          - UUID of the assessment record
 * @property {string} patientIdentifier           - local patient identifier
 * @property {string} patientName                 - "Surname, Given" display name
 * @property {CareSetting} careSetting             - care setting
 * @property {PretestProbability} pretestProbability - gestalt pre-test probability
 * @property {Classification} classification       - derived PERC classification
 * @property {boolean} applicable                  - true when pre-test probability is low
 * @property {boolean} workupFlag                  - true when classification == 'perc-positive'
 * @property {string} assessedAt                   - ISO date of assessment (yyyy-mm-dd)
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
// namespace, `window.PulmonaryEmbolismRuleOutCriteriaDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.PulmonaryEmbolismRuleOutCriteriaDashboard`.
