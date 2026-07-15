// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * SNOT-22 severity band emitted by the scoring engine.
 *
 * Thresholds (from the form specification):
 *   Mild      0-7
 *   Moderate  8-19
 *   Severe    20+
 *
 * @typedef {'Mild' | 'Moderate' | 'Severe'} Severity
 */

/**
 * Management priority assigned by the ENT clinician based on overall
 * SNOT-22 severity, examination findings, and red-flag features.
 *
 * @typedef {'Routine' | 'Soon' | 'Urgent'} Priority
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/otolaryngology-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id              - UUID of the assessment record
 * @property {string} nhsNumber       - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName     - "Surname, Given" display name
 * @property {number} snot22Score     - SNOT-22 total score, 0-110
 * @property {Severity} severity      - SNOT-22 severity band
 * @property {Priority} priority      - Clinician-assigned management priority
 * @property {boolean} redFlag        - True when an ENT red-flag feature is present
 *                                      (e.g. unilateral epistaxis, neck mass,
 *                                      sudden hearing loss, persistent dysphagia)
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
// namespace, `window.OtolaryngologyAssessmentDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.OtolaryngologyAssessmentDashboard`.
