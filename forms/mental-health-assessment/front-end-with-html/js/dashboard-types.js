// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Risk level emitted by the scoring engine.
 *
 * @typedef {'low' | 'medium' | 'high'} RiskLevel
 */

/**
 * PHQ-9 severity bands used by the dashboard's PHQ-9 filter dropdown.
 *
 * @typedef {'minimal' | 'mild' | 'moderate' | 'moderately-severe' | 'severe'} Phq9Severity
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/mental-health-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                       - UUID of the assessment record
 * @property {string} nhsNumber                - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName              - "Surname, Given" display name
 * @property {number} phq9Score                - PHQ-9 total score, 0-27
 * @property {number} gad7Score                - GAD-7 total score, 0-21
 * @property {RiskLevel} riskLevel             - Overall risk category
 * @property {boolean} allergyFlag             - True when allergy comorbidity present
 * @property {boolean} previousAdverseIncident - True when patient has a previous adverse incident on record
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
// namespace, `window.MentalHealthAssessmentDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.MentalHealthAssessmentDashboard`.
