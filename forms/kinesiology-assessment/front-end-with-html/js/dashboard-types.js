// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Injury-risk band derived from the FMS total score. The widely used
 * threshold of <=14 is treated as `at-risk`; scores of 15 or higher are
 * `low-risk`.
 *
 * @typedef {'low-risk' | 'at-risk'} RiskBand
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/kinesiology-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`,
 * extended with the dashboard-specific FMS counters (painful tests and
 * asymmetric tests) and an occupation field for the search box.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                - UUID of the assessment record
 * @property {string} nhsNumber         - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName       - "Surname, Given" display name
 * @property {string} occupation        - Free-text occupation (e.g. "athlete", "manual labour", "sedentary")
 * @property {number} fmsScore          - FMS total score, 0-21
 * @property {RiskBand} riskBand        - Derived from fmsScore (<=14 = at-risk)
 * @property {number} painfulTests      - Count of the 7 patterns with reported pain (0-7)
 * @property {number} asymmetricTests   - Count of bilateral patterns with left/right asymmetry (0-5)
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
// namespace, `window.KinesiologyAssessmentDashboard`.
(function () {
'use strict';
window.KinesiologyAssessmentDashboard = window.KinesiologyAssessmentDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.KinesiologyAssessmentDashboard`.
})();
