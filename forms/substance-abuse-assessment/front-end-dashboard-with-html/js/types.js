// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * AUDIT category labels — match the strings emitted by the AUDIT scoring
 * engine. Used both as filter values and as the badge label.
 *
 * @typedef {'Low Risk' | 'Hazardous' | 'Harmful' | 'Dependence Likely'} AuditCategory
 */

/**
 * DAST-10 category labels — match the strings emitted by the DAST-10
 * scoring engine.
 *
 * @typedef {'No Problems' | 'Low Level' | 'Moderate Level' | 'Substantial Level' | 'Severe Level'} DastCategory
 */

/**
 * Combined severity band emitted by the scoring engine, derived from the
 * two instruments plus withdrawal/overdose-risk indicators.
 *
 * @typedef {'Low' | 'Moderate' | 'High' | 'Critical'} CombinedSeverity
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/substance-abuse-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                       - UUID of the assessment record
 * @property {string} nhsNumber                - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName              - "Surname, Given" display name
 * @property {number} auditScore               - AUDIT total score, 0-40
 * @property {AuditCategory} auditCategory     - AUDIT risk category
 * @property {number} dastScore                - DAST-10 total score, 0-10
 * @property {DastCategory} dastCategory       - DAST-10 problem level
 * @property {CombinedSeverity} combinedSeverity - Overall combined severity
 * @property {boolean} withdrawalRisk          - True when withdrawal/overdose risk present
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
// namespace, `window.SubstanceAbuseAssessmentDashboard`.
(function () {
'use strict';
window.SubstanceAbuseAssessmentDashboard =
  window.SubstanceAbuseAssessmentDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.SubstanceAbuseAssessmentDashboard`.
})();
