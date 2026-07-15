// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * HHIE-S severity-tier labels — match the strings emitted by the scoring
 * engine in `engine/utils.ts` (`hhiesCategory`). Used both as filter values
 * and as the badge label.
 *
 *   0-8   = No handicap
 *   10-22 = Mild to moderate handicap
 *   24-40 = Significant handicap
 *
 * @typedef {'No handicap' | 'Mild to moderate handicap' | 'Significant handicap'} Severity
 */

/**
 * Age band buckets used by the dashboard's age-band filter. The HHIE-S
 * instrument was originally validated for the "elderly" (65+) but is widely
 * applied to younger adults too, so the bands span a generous range.
 *
 * @typedef {'Under 50' | '50-64' | '65-74' | '75-84' | '85+'} AgeBand
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/hearing-aid-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                    - UUID of the assessment record
 * @property {string} nhsNumber             - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName           - "Surname, Given" display name
 * @property {number} age                   - Patient age in years
 * @property {AgeBand} ageBand              - Bucketed age band for filtering
 * @property {number} hhiesScore            - HHIE-S total score, 0-40
 * @property {Severity} severity            - HHIE-S severity tier
 * @property {boolean} hearingAidUser       - True when the patient currently uses hearing aids
 * @property {boolean} occupationalNoiseExposure - True when occupational noise exposure is reported
 */

/**
 * Response from `GET /api/dashboard/patients`.
 *
 * @typedef {Object} DashboardPatientsResponse
 * @property {PatientRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.HearingAidAssessmentDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.HearingAidAssessmentDashboard`.
