// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * NICE CG156 fertility-concern bands — match the strings emitted by the
 * scoring engine. Used both as filter values and as the badge label.
 *
 * @typedef {'Low' | 'Moderate' | 'High'} ConcernLevel
 */

/**
 * Menstrual-cycle regularity category captured in Step 3 of the patient
 * questionnaire.
 *
 * @typedef {'Regular' | 'Irregular' | 'Absent'} CycleRegularity
 */

/**
 * Ovarian-reserve band derived from AMH / antral-follicle count.
 *
 * @typedef {'Normal' | 'Reduced' | 'Low'} OvarianReserve
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/fertility-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                       - UUID of the assessment record
 * @property {string} nhsNumber                - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName              - "Surname, Given" display name
 * @property {number} age                      - Female-partner age in years
 * @property {number} durationTryingMonths     - Months actively trying to conceive
 * @property {CycleRegularity} cycleRegularity - Menstrual-cycle regularity
 * @property {OvarianReserve} ovarianReserve   - Ovarian-reserve band (AMH/AFC)
 * @property {boolean} semenAnalysisAbnormal   - True when partner semen analysis is abnormal (WHO 2021)
 * @property {ConcernLevel} concernLevel       - Overall NICE CG156 concern band
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
// namespace, `window.FertilityAssessmentDashboard`.
(function () {
'use strict';
window.FertilityAssessmentDashboard = window.FertilityAssessmentDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.FertilityAssessmentDashboard`.
})();
