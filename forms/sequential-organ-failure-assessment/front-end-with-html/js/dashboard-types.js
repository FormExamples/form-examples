// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Total SOFA score — integer 0-24, or null when not yet scored.
 *
 * @typedef {number | null} TotalSofa
 */

/**
 * Change in total SOFA versus baseline — integer, or null when no baseline.
 *
 * @typedef {number | null} DeltaSofa
 */

/**
 * Derived mortality-risk band emitted by the scoring engine. camelCase strings
 * matching the SvelteKit dashboard so the same backend payload can drive either
 * UI without translation.
 *
 * @typedef {'low' | 'moderate' | 'high' | 'veryHigh' | 'extreme'} MortalityBand
 */

/**
 * Care location where the assessment was performed.
 *
 * @typedef {'icu' | 'hdu' | 'critical-care-outreach' | 'acute-medical-unit' | 'emergency-department' | 'other'} CareLocation
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/sequential-organ-failure-assessment/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                  - UUID of the assessment record
 * @property {string} patientIdentifier   - local patient identifier
 * @property {string} patientName         - "Surname, Given" display name
 * @property {CareLocation} careLocation  - where the assessment was performed
 * @property {TotalSofa} totalSofa        - total SOFA score (0-24) or null
 * @property {DeltaSofa} deltaSofa        - change versus baseline or null
 * @property {MortalityBand} mortalityBand - derived mortality-risk band
 * @property {boolean} sepsis3Flag        - true when Sepsis-3 criterion met
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
// namespace, `window.SequentialOrganFailureAssessmentDashboard`.
(function () {
'use strict';
window.SequentialOrganFailureAssessmentDashboard =
  window.SequentialOrganFailureAssessmentDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.SequentialOrganFailureAssessmentDashboard`.
})();
