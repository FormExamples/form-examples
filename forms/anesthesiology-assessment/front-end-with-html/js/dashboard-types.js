// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * ASA Physical Status grade labels emitted by the scoring engine.
 *
 * @typedef {'I' | 'II' | 'III' | 'IV' | 'V' | 'VI'} AsaGrade
 */

/**
 * Mallampati airway class labels emitted by the scoring engine.
 *
 * @typedef {'I' | 'II' | 'III' | 'IV'} MallampatiClass
 */

/**
 * Composite perioperative risk band emitted by the scoring engine.
 *
 * @typedef {'Low' | 'Moderate' | 'High' | 'Critical'} CompositeRisk
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/anesthesiology-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                     - UUID of the assessment record
 * @property {string} nhsNumber              - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName            - "Surname, Given" display name
 * @property {string} surgeryType            - Planned surgical procedure
 * @property {AsaGrade} asaGrade             - ASA Physical Status (I-VI)
 * @property {MallampatiClass} mallampatiClass - Mallampati airway class (I-IV)
 * @property {number} rcriScore              - Revised Cardiac Risk Index, 0-6
 * @property {number} stopBangScore          - STOP-BANG OSA score, 0-8
 * @property {CompositeRisk} compositeRisk   - Composite perioperative risk
 * @property {boolean} difficultAirwayFlag   - True when difficult-airway predicted
 */

/**
 * Response from `GET /api/dashboard/patients`.
 *
 * @typedef {Object} DashboardPatientsResponse
 * @property {PatientRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.AnesthesiologyAssessmentDashboard`.
