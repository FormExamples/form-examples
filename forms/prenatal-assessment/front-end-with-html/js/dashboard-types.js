// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Risk-level labels emitted by the prenatal risk-stratification engine.
 * Lower-cased slug form so they double as filter values.
 *
 * @typedef {'low' | 'moderate' | 'high' | 'very-high'} RiskLevel
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/prenatal-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                - UUID of the assessment record
 * @property {string} nhsNumber         - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName       - "Surname, Given" display name
 * @property {RiskLevel} riskLevel      - Pregnancy risk stratification
 * @property {number} gestationalWeeks  - Gestational age in completed weeks
 * @property {string} primaryConcern    - Free-text primary clinical concern
 * @property {string} referralStatus    - 'None' or referral destination
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
// before they read `window.PrenatalAssessmentDashboard`.
