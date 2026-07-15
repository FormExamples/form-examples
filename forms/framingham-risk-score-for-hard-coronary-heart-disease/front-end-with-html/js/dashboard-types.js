// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Framingham Hard CHD risk-category labels — match the strings emitted by
 * the scoring engine (Wilson 1998 / ATP III). Used both as filter values
 * and as the badge label.
 *
 * - Low:          10-year risk < 10 %
 * - Intermediate: 10-year risk 10 - < 20 %
 * - High:         10-year risk >= 20 %
 *
 * @typedef {'Low' | 'Intermediate' | 'High'} RiskCategory
 */

/**
 * Patient sex used by the risk equation. The form stores it lower-cased.
 *
 * @typedef {'male' | 'female'} Sex
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors the row shape that the SvelteKit dashboard expects from
 * `forms/framingham-risk-score-for-hard-coronary-heart-disease/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                    - UUID of the assessment record
 * @property {string} nhsNumber             - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName           - "Surname, Given" display name
 * @property {number} age                   - Patient age in years (30-79)
 * @property {Sex} sex                      - Patient sex
 * @property {number} tenYearRiskPercent    - 10-year hard-CHD risk, %
 * @property {RiskCategory} riskCategory    - Risk band (Low / Intermediate / High)
 * @property {boolean} smokerFlag           - True when current smoker
 */

/**
 * Response from `GET /api/dashboard/patients`.
 *
 * @typedef {Object} DashboardPatientsResponse
 * @property {PatientRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.FraminghamRiskScoreDashboard`.
