// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * NIHSS-derived stroke severity labels — match the strings emitted by the
 * scoring engine. Used both as filter values and as the badge label.
 *
 * @typedef {'No stroke symptoms' | 'Minor stroke' | 'Moderate stroke' | 'Moderate to severe stroke' | 'Severe stroke'} StrokeSeverity
 */

/**
 * NIHSS score range filter values used by the dropdown.
 *
 * @typedef {'' | '0' | '1-4' | '5-15' | '16-20' | '21-42'} NihssRange
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/stroke-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                  - UUID of the assessment record
 * @property {string} nhsNumber           - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName         - "Surname, Given" display name
 * @property {number} nihssScore          - NIHSS total score, 0-42
 * @property {StrokeSeverity} strokeSeverity - NIHSS severity category
 * @property {string} onsetTime           - Symptom onset, ISO local "YYYY-MM-DDTHH:MM"
 * @property {boolean} thrombolysisEligible - True when patient meets tPA criteria
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
// namespace, `window.StrokeAssessmentDashboard`.
(function () {
'use strict';
window.StrokeAssessmentDashboard = window.StrokeAssessmentDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.StrokeAssessmentDashboard`.
})();
