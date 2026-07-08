// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * REBA musculoskeletal risk-level labels — match the strings emitted by the
 * scoring engine. Used both as filter values and as the badge label.
 *
 * @typedef {'Negligible risk' | 'Low risk' | 'Medium risk' | 'High risk' | 'Very high risk'} RiskLevel
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/ergonomic-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id           - UUID of the assessment record
 * @property {string} nhsNumber    - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName  - "Surname, Given" display name
 * @property {number} rebaScore    - REBA total score, 1-15
 * @property {RiskLevel} riskLevel - REBA risk band
 * @property {string} occupation   - Patient's job title / role
 * @property {number} painSeverity - 0-10 numeric rating scale
 * @property {string} keyFinding   - One-line clinician-facing summary
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
// namespace, `window.ErgonomicAssessmentDashboard`.
(function () {
'use strict';
window.ErgonomicAssessmentDashboard = window.ErgonomicAssessmentDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.ErgonomicAssessmentDashboard`.
})();
