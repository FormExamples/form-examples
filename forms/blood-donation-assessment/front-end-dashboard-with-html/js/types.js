// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * JPAC eligibility-status labels — match the strings emitted by the donor
 * grader. Used both as filter values and as the badge label.
 *
 * @typedef {'Eligible' | 'Temporarily Deferred' | 'Permanently Deferred'} EligibilityStatus
 */

/**
 * Vital-sign status band derived from hemoglobin, blood pressure, and pulse
 * relative to JPAC DSG donation thresholds.
 *
 * @typedef {'Normal' | 'Borderline' | 'Out of Range'} VitalsStatus
 */

/**
 * Donor row displayed in the clinician dashboard.
 *
 * Mirrors `DonorRow` in
 * `forms/blood-donation-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} DonorRow
 * @property {string} id                       - UUID of the assessment record
 * @property {string} nhsNumber                - NHS number, formatted "NNN NNN NNNN"
 * @property {string} donorName                - "Surname, Given" display name
 * @property {EligibilityStatus} eligibility   - JPAC DSG eligibility category
 * @property {number} hemoglobinGdl            - Capillary hemoglobin in g/dL
 * @property {VitalsStatus} vitalsStatus       - Combined vital-signs band
 * @property {boolean} riskFlag                - True when travel/lifestyle/medication risk present
 */

/**
 * Response from `GET /api/dashboard/donors`.
 *
 * @typedef {Object} DashboardDonorsResponse
 * @property {DonorRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.BloodDonationAssessmentDashboard`.
(function () {
'use strict';
window.BloodDonationAssessmentDashboard = window.BloodDonationAssessmentDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.BloodDonationAssessmentDashboard`.
})();
