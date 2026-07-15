// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * ASA Physical Status Classification — five Roman-numeral grades emitted by
 * the scoring engine. Used both as filter values and as the badge label.
 *
 * @typedef {'I' | 'II' | 'III' | 'IV' | 'V'} AsaClass
 */

/**
 * Surgical wound classification (CDC) — four classes.
 *
 * @typedef {'I' | 'II' | 'III' | 'IV'} WoundClass
 */

/**
 * Surgical complexity score band (1 = minor, 4 = major reconstruction).
 *
 * @typedef {1 | 2 | 3 | 4} ComplexityScore
 */

/**
 * Overall risk level emitted by the scoring engine.
 *
 * @typedef {'Low' | 'Moderate' | 'High' | 'Critical'} RiskLevel
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/plastic-surgery-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                   - UUID of the assessment record
 * @property {string} nhsNumber            - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName          - "Surname, Given" display name
 * @property {AsaClass} asaClass           - ASA Physical Status (I-V)
 * @property {WoundClass} woundClass       - Surgical wound classification (I-IV)
 * @property {ComplexityScore} complexity  - Surgical complexity score (1-4)
 * @property {RiskLevel} riskLevel         - Overall risk band
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
// namespace, `window.PlasticSurgeryAssessmentDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.PlasticSurgeryAssessmentDashboard`.
