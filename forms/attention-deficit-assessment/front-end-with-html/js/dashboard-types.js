// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * ASRS classification labels — match the strings emitted by the scoring
 * engine. Used both as filter values and as the badge label.
 *
 * @typedef {'unlikely' | 'possible' | 'likely' | 'highly-likely'} Classification
 */

/**
 * ADHD subtype emitted by the scoring engine.
 *
 * @typedef {'inattentive' | 'hyperactive-impulsive' | 'combined' | 'unspecified'} Subtype
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/attention-deficit-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id              - UUID of the assessment record
 * @property {string} nhsNumber       - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName     - "Surname, Given" display name
 * @property {number} asrsScore       - ASRS total score, 0-72
 * @property {Classification} classification - ADHD likelihood category
 * @property {Subtype} subtype        - ADHD subtype
 * @property {string} comorbidities   - Comma-separated comorbidities, or "None"
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
// namespace, `window.AttentionDeficitAssessmentDashboard`.
(function () {
'use strict';
window.AttentionDeficitAssessmentDashboard =
  window.AttentionDeficitAssessmentDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.AttentionDeficitAssessmentDashboard`.
})();
