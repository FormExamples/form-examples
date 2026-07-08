// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Menopausal status labels used in the dashboard. Match the strings emitted
 * by the questionnaire engine.
 *
 * @typedef {'Pre-menopausal' | 'Peri-menopausal' | 'Post-menopausal'} MenopausalStatus
 */

/**
 * Cervical screening status labels.
 *
 * @typedef {'Up to date' | 'Overdue' | 'Abnormal result'} ScreeningStatus
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/gynecology-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                  - UUID of the assessment record
 * @property {string} nhsNumber           - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName         - "Surname, Given" display name
 * @property {number} symptomScore        - Composite symptom severity score, 0-30
 * @property {string} primaryConcern      - Free-text chief complaint
 * @property {MenopausalStatus} menopausalStatus - Menopausal status
 * @property {ScreeningStatus} screeningStatus   - Cervical screening status
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
// namespace, `window.GynecologyAssessmentDashboard`.
(function () {
'use strict';
window.GynecologyAssessmentDashboard = window.GynecologyAssessmentDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.GynecologyAssessmentDashboard`.
})();
