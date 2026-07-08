// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Endocrine axis labels — one per system reviewed in the assessment, plus
 * 'None' when no axis exceeds the normal threshold. Used both as filter
 * values and as the axis-badge label.
 *
 * @typedef {'Thyroid' | 'Adrenal' | 'Glucose' | 'Reproductive' | 'Pituitary' | 'Bone & Calcium' | 'None'} EndocrineAxis
 */

/**
 * Disturbance severity emitted by the scoring engine. Reflects the worst
 * affected axis for the patient.
 *
 * @typedef {'Normal' | 'Subclinical' | 'Mild' | 'Moderate' | 'Severe'} DisturbanceSeverity
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/endocrinology-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                      - UUID of the assessment record
 * @property {string} nhsNumber               - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName             - "Surname, Given" display name
 * @property {EndocrineAxis} primaryAxis      - Worst affected endocrine axis (or 'None')
 * @property {DisturbanceSeverity} severity   - Worst disturbance severity across all axes
 * @property {number} flaggedIssuesCount      - Count of flagged issues from scoring engine
 * @property {string} lastReviewDate          - ISO 8601 date (YYYY-MM-DD) of last review
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
// namespace, `window.EndocrinologyAssessmentDashboard`.
(function () {
'use strict';
window.EndocrinologyAssessmentDashboard = window.EndocrinologyAssessmentDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.EndocrinologyAssessmentDashboard`.
})();
