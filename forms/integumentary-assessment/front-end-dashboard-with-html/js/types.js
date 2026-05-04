// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Braden Scale risk-level labels — match the strings emitted by the scoring
 * engine. Used both as filter values and as the badge label.
 *
 * @typedef {'No Risk' | 'Mild Risk' | 'Moderate Risk' | 'High Risk' | 'Very High Risk'} RiskLevel
 */

/**
 * Highest pressure-ulcer / wound stage observed for the patient. 'None'
 * indicates no wound was found during the head-to-toe inspection.
 *
 * @typedef {'None' | 'Stage 1' | 'Stage 2' | 'Stage 3' | 'Stage 4' | 'Unstageable'} WoundStage
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/integumentary-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                    - UUID of the assessment record
 * @property {string} nhsNumber             - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName           - "Surname, Given" display name
 * @property {number} bradenScore           - Braden Scale total score, 6-23
 * @property {RiskLevel} riskLevel          - Pressure-ulcer risk category
 * @property {boolean} woundPresent         - True when at least one wound is documented
 * @property {WoundStage} highestWoundStage - Highest documented wound stage (or 'None')
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
// namespace, `window.IntegumentaryAssessmentDashboard`.
(function () {
'use strict';
window.IntegumentaryAssessmentDashboard =
  window.IntegumentaryAssessmentDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.IntegumentaryAssessmentDashboard`.
})();
