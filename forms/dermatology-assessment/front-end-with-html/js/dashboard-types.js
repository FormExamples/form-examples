// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * DLQI severity-band labels — match the strings emitted by the scoring
 * engine. Used both as filter values and as the badge label.
 *
 * @typedef {'No effect on life' | 'Small effect' | 'Moderate effect' | 'Very large effect' | 'Extremely large effect'} Severity
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/dermatology-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                 - UUID of the assessment record
 * @property {string} nhsNumber          - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName        - "Surname, Given" display name
 * @property {number} dlqiScore          - DLQI total score, 0-30
 * @property {string} primaryCondition   - Primary dermatological condition
 * @property {Severity} severity         - DLQI severity band
 * @property {boolean} allergyFlag       - True when allergy comorbidity present
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
// before they read `window.DermatologyAssessmentDashboard`.
