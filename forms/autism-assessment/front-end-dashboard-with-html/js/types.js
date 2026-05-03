// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * AQ-10 screening outcome label — matches the strings emitted by the
 * scoring engine. Used both as filter values and as the badge label.
 *
 * @typedef {'Below threshold' | 'At or above threshold'} ScreeningOutcome
 */

/**
 * Age group banding used when reviewing AQ-10 results.
 *
 * @typedef {'Child' | 'Adolescent' | 'Adult'} AgeGroup
 */

/**
 * Referral pathway status assigned by the clinician after reviewing the
 * AQ-10 screening result.
 *
 * @typedef {'No referral needed' | 'Monitoring' | 'Referred for assessment' | 'Urgent referral'} ReferralStatus
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/autism-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                  - UUID of the assessment record
 * @property {string} nhsNumber           - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName         - "Surname, Given" display name
 * @property {number} aq10Score           - AQ-10 total score, 0-10
 * @property {ScreeningOutcome} screeningOutcome - Below or at/above threshold
 * @property {AgeGroup} ageGroup          - Child, Adolescent, or Adult
 * @property {ReferralStatus} referralStatus - Referral pathway status
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
// namespace, `window.AutismAssessmentDashboard`.
(function () {
'use strict';
window.AutismAssessmentDashboard = window.AutismAssessmentDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.AutismAssessmentDashboard`.
})();
