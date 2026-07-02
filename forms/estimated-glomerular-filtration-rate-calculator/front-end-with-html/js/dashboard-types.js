// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * eGFR value in mL/min/1.73 m^2, or null when a required input is missing.
 *
 * @typedef {number | null} Egfr
 */

/**
 * CKD G-stage emitted by the engine, or 'unknown' when the eGFR is not
 * computed. Matches the SvelteKit dashboard so the same backend payload can
 * drive either UI without translation.
 *
 * @typedef {'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5' | 'unknown'} GStage
 */

/**
 * Care setting where the assessment was performed.
 *
 * @typedef {'primary-care' | 'secondary-care' | 'laboratory' | 'pharmacy' | 'other'} CareSetting
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/estimated-glomerular-filtration-rate-calculator/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                 - UUID of the calculation record
 * @property {string} patientIdentifier  - local patient identifier
 * @property {string} patientName        - "Surname, Given" display name
 * @property {CareSetting} careSetting    - where the assessment was performed
 * @property {Egfr} egfr                  - eGFR (mL/min/1.73 m^2) or null
 * @property {GStage} egfrStage           - derived CKD G-stage
 * @property {boolean} referralFlag       - true when G4 or G5 (nephrology referral)
 * @property {string} assessedAt          - ISO date of assessment (yyyy-mm-dd)
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
// namespace, `window.EstimatedGlomerularFiltrationRateCalculatorDashboard`.
(function () {
'use strict';
window.EstimatedGlomerularFiltrationRateCalculatorDashboard =
  window.EstimatedGlomerularFiltrationRateCalculatorDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.EstimatedGlomerularFiltrationRateCalculatorDashboard`.
})();
