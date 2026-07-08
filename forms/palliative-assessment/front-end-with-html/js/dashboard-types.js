// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the palliative MDT clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * ESAS-r severity band derived from the total symptom score (0-100).
 *
 * Bands match the engine's grader:
 *   None      0-10
 *   Mild     11-30
 *   Moderate 31-60
 *   Severe   61-100
 *
 * @typedef {'None' | 'Mild' | 'Moderate' | 'Severe'} SeverityBand
 */

/**
 * Primary-diagnosis category — coarse grouping used as a dashboard filter.
 * Maps the underlying ICD-10 / SNOMED diagnosis to one of five buckets that
 * dominate adult palliative caseloads.
 *
 * @typedef {'Cancer' | 'Heart Failure' | 'COPD' | 'Dementia' | 'Neurological'} DiagnosisCategory
 */

/**
 * Palliative Performance Scale (PPS) band. PPS is recorded 10-100 in 10-point
 * steps; the dashboard groups those values into three clinically meaningful
 * bands so the filter dropdown stays compact.
 *
 *   High      70-100  (ambulatory, mostly self-care)
 *   Moderate  40-60   (reduced ambulation, considerable assistance)
 *   Low       10-30   (mainly bed-bound, total care)
 *
 * @typedef {'High' | 'Moderate' | 'Low'} PpsBand
 */

/**
 * Care setting — where the patient is currently being cared for.
 *
 * @typedef {'Home' | 'Hospice' | 'Hospital' | 'Care Home'} Setting
 */

/**
 * Per-symptom ESAS-r scores (0-10 each). Any value >= 7 is considered an
 * "individual flag" by the grader and surfaces as a chip in the table.
 *
 * @typedef {Object} EsasSymptomScores
 * @property {number} pain               - Pain severity, 0-10
 * @property {number} tiredness          - Tiredness / fatigue, 0-10
 * @property {number} drowsiness         - Drowsiness, 0-10
 * @property {number} nausea             - Nausea, 0-10
 * @property {number} appetite           - Lack of appetite, 0-10
 * @property {number} shortnessOfBreath  - Shortness of breath, 0-10
 * @property {number} depression         - Depression, 0-10
 * @property {number} anxiety            - Anxiety, 0-10
 * @property {number} wellbeing          - Wellbeing (10 = worst), 0-10
 * @property {number} other              - Other symptom (e.g. constipation), 0-10
 */

/**
 * Patient row displayed in the palliative MDT dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/palliative-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                       - UUID of the assessment record
 * @property {string} nhsNumber                - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName              - "Surname, Given" display name
 * @property {number} esasTotal                - ESAS-r total score, 0-100
 * @property {SeverityBand} severityBand       - Overall ESAS-r severity band
 * @property {string} primaryDiagnosis         - Free-text primary diagnosis (display)
 * @property {DiagnosisCategory} diagnosisCategory - Coarse diagnosis bucket
 * @property {number} pps                      - Palliative Performance Scale, 10-100
 * @property {PpsBand} ppsBand                 - PPS band derived from `pps`
 * @property {Setting} setting                 - Current care setting
 * @property {EsasSymptomScores} symptoms      - Individual ESAS-r symptom scores
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
// namespace, `window.PalliativeAssessmentDashboard`.
(function () {
'use strict';
window.PalliativeAssessmentDashboard = window.PalliativeAssessmentDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.PalliativeAssessmentDashboard`.
})();
