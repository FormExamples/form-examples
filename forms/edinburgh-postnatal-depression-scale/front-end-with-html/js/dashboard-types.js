// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the EPDS clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Total EPDS score — integer 0-30, or null when not yet scored.
 *
 * @typedef {number | null} TotalScore
 */

/**
 * Derived interpretation band emitted by the scoring engine.
 *
 * @typedef {'lower' | 'possible' | 'likely'} Band
 */

/**
 * Care setting where the EPDS was administered.
 *
 * @typedef {'maternity' | 'community' | 'general-practice' | 'perinatal-mh' | 'other'} CareSetting
 */

/**
 * Perinatal stage at assessment.
 *
 * @typedef {'antenatal' | 'postnatal'} PerinatalStage
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/edinburgh-postnatal-depression-scale/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                 - UUID of the assessment record
 * @property {string} respondentIdentifier - local respondent identifier
 * @property {string} respondentName     - "Surname, Given" display name
 * @property {CareSetting} careSetting    - where the EPDS was administered
 * @property {PerinatalStage} perinatalStage - antenatal or postnatal
 * @property {TotalScore} totalScore     - total EPDS score (0-30) or null
 * @property {Band} band                 - derived interpretation band
 * @property {boolean} selfHarmFlag      - true when item 10 > 0 (mandatory safety flag)
 * @property {string} assessedAt         - ISO date of assessment (yyyy-mm-dd)
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
// namespace, `window.EdinburghPostnatalDepressionScaleDashboard`.
(function () {
'use strict';
window.EdinburghPostnatalDepressionScaleDashboard =
  window.EdinburghPostnatalDepressionScaleDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.EdinburghPostnatalDepressionScaleDashboard`.
})();
