// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Total 4AT score — integer 0-12, or null when not yet scored.
 *
 * @typedef {number | null} FourATScore
 */

/**
 * Derived interpretation band emitted by the scoring engine. Lower-case strings
 * matching the SvelteKit dashboard so the same backend payload can drive either
 * UI without translation.
 *
 * @typedef {'unlikely' | 'possibleCognitiveImpairment' | 'possibleDelirium'} InterpretationBand
 */

/**
 * Care setting where the assessment was performed.
 *
 * @typedef {'acute' | 'ed' | 'periop' | 'careHome' | 'community' | 'other'} Setting
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/four-a-test-for-delirium/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                        - UUID of the assessment record
 * @property {string} patientIdentifier         - local patient identifier
 * @property {string} patientName               - "Surname, Given" display name
 * @property {Setting} setting                  - where the assessment was performed
 * @property {FourATScore} totalScore           - total 4AT score (0-12) or null
 * @property {InterpretationBand} interpretationBand - derived band
 * @property {boolean} deliriumFlag             - true when totalScore >= 4 (possible delirium)
 * @property {string} assessmentDate            - ISO date of assessment (yyyy-mm-dd)
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
// namespace, `window.FourATestForDeliriumDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.FourATestForDeliriumDashboard`.
