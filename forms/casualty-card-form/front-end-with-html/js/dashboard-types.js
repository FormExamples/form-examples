// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * NEWS2 (National Early Warning Score 2) clinical-response band emitted by
 * the scoring engine. Used both as filter values and as the badge label.
 *
 * @typedef {'low' | 'low-medium' | 'medium' | 'high'} News2Response
 */

/**
 * Manchester Triage System (MTS) priority category emitted by the triage
 * step. Each value carries the numeric priority and a human-readable slug.
 *
 * @typedef {'1-immediate' | '2-very-urgent' | '3-urgent' | '4-standard' | '5-non-urgent'} MtsCategory
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/casualty-card-form/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                       - UUID of the casualty record
 * @property {string} nhsNumber                - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName              - "Surname, Given" display name
 * @property {number} news2Score               - NEWS2 total score, 0-20
 * @property {News2Response} news2Response     - NEWS2 clinical-response band
 * @property {MtsCategory} mtsCategory         - MTS priority category
 * @property {string} chiefComplaint           - Free-text presenting complaint
 * @property {boolean} allergyFlag             - True when allergies recorded
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
// namespace, `window.CasualtyCardFormDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.CasualtyCardFormDashboard`.
