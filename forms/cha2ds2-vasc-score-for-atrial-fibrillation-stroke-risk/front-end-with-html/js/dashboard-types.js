// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Total CHA2DS2-VASc score — integer 0-9, or null when not yet scored.
 *
 * @typedef {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | null} Cha2ds2VascScore
 */

/**
 * Derived risk band emitted by the scoring engine.
 *
 * @typedef {'low' | 'intermediate' | 'high'} RiskBand
 */

/**
 * Care setting where the assessment was performed.
 *
 * @typedef {'primary-care' | 'cardiology' | 'anticoagulation-clinic' | 'emergency-department' | 'other'} CareSetting
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/cha2ds2-vasc-score-for-atrial-fibrillation-stroke-risk/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                       - UUID of the assessment record
 * @property {string} patientIdentifier        - local patient identifier
 * @property {string} patientName              - "Surname, Given" display name
 * @property {CareSetting} careSetting          - where the assessment was performed
 * @property {Cha2ds2VascScore} cha2ds2VascScore - total CHA2DS2-VASc score (0-9) or null
 * @property {RiskBand} riskBand               - derived risk band
 * @property {boolean} anticoagulationRecommended - true when riskBand == 'high'
 * @property {string} assessedAt               - ISO date of assessment (yyyy-mm-dd)
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
// namespace, `window.Cha2ds2VascScoreForAtrialFibrillationStrokeRiskDashboard`.
(function () {
'use strict';
window.Cha2ds2VascScoreForAtrialFibrillationStrokeRiskDashboard =
  window.Cha2ds2VascScoreForAtrialFibrillationStrokeRiskDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read the dashboard namespace.
})();
