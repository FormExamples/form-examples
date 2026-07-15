// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Recommended follow-up timeframe for the counter-referred patient.
 *
 * @typedef {'urgent' | '2-6-days' | '1-2-weeks' | 'over-2-weeks'} FollowUpTimeframe
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/who-counter-referral-form/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                       - UUID of the assessment record
 * @property {string} patientName              - "Surname, Given" display name
 * @property {string} dateOfBirth              - ISO-8601 date (YYYY-MM-DD)
 * @property {string} sex                      - "M", "F", or other code
 * @property {string} referralFacility         - Facility that received and treated the patient
 * @property {string} primaryCareFacility      - Facility taking the patient back into ongoing care
 * @property {string} finalDiagnosis           - Free-text final diagnosis / problem list
 * @property {FollowUpTimeframe} followUpTimeframe
 * @property {string[]} statusFlags            - e.g. ['cognitive-impairment', 'palliative-care']
 * @property {boolean} patientFamilyInformed   - Whether patient and/or family have been informed
 * @property {number} highPriorityFlagCount    - Aggregate count of high-priority status flags
 * @property {string} dischargedAt             - ISO-8601 timestamp of discharge
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
// namespace, `window.WhoCounterReferralDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.WhoCounterReferralDashboard`.
