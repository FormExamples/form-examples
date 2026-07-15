// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Morse Fall Scale severity bands emitted by the scoring engine.
 *
 * - Low      : MFS 0-24
 * - Moderate : MFS 25-44
 * - High     : MFS >= 45
 * - Critical : recurrent falls with injury, anticoagulated, or MFS >= 75
 *
 * @typedef {'Low' | 'Moderate' | 'High' | 'Critical'} Severity
 */

/**
 * Inpatient ward / care setting where the patient is being assessed.
 *
 * @typedef {'Geriatric' | 'Orthopaedic' | 'Stroke' | 'Surgical' | 'Neurology' | 'Community'} Ward
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/fall-risk-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                - UUID of the assessment record
 * @property {string} nhsNumber         - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName       - "Surname, Given" display name
 * @property {number} mfsScore          - Morse Fall Scale total, 0-125
 * @property {Severity} severity        - Severity band for the row
 * @property {Ward} ward                - Ward / care setting
 * @property {boolean} anticoagulant    - Anticoagulant medication status
 * @property {boolean} recentFall       - Fall within prior 3 months
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
// before they read `window.FallRiskAssessmentDashboard`.
