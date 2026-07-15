// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * ACT control-level labels — match the strings emitted by the scoring
 * engine. Used both as filter values and as the badge label.
 *
 * @typedef {'Well Controlled' | 'Could Be Better' | 'Not Well Controlled' | 'Very Poorly Controlled'} ControlLevel
 */

/**
 * Exacerbation risk band emitted by the scoring engine.
 *
 * @typedef {'Low' | 'Moderate' | 'High'} ExacerbationRisk
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/asthma-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                    - UUID of the assessment record
 * @property {string} nhsNumber             - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName           - "Surname, Given" display name
 * @property {number} actScore              - ACT total score, 5-25
 * @property {ControlLevel} controlLevel    - Asthma control category
 * @property {ExacerbationRisk} exacerbationRisk - Exacerbation risk band
 * @property {boolean} allergyFlag          - True when allergy comorbidity present
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
// namespace, `window.AsthmaAssessmentDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.AsthmaAssessmentDashboard`.
