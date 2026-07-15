// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * IPSS symptom severity labels — match the strings emitted by the scoring
 * engine. Used both as filter values and as the badge label.
 *
 * @typedef {'Mild' | 'Moderate' | 'Severe'} SymptomSeverity
 */

/**
 * Referral urgency band emitted by the scoring engine.
 *
 * @typedef {'Routine' | 'Soon' | 'Urgent'} ReferralUrgency
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/urology-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                       - UUID of the assessment record
 * @property {string} nhsNumber                - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName              - "Surname, Given" display name
 * @property {number} ipssScore                - IPSS total score, 0-35
 * @property {SymptomSeverity} symptomSeverity - IPSS severity category
 * @property {string} psaLevel                 - PSA level in ng/mL (string for one-decimal display)
 * @property {ReferralUrgency} referralUrgency - Referral urgency band
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
// before they read `window.UrologyAssessmentDashboard`.
