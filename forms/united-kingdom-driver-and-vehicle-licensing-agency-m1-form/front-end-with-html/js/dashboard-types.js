// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the UK DVLA M1 clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Applicant row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/united-kingdom-driver-and-vehicle-licensing-agency-m1-form/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                          - UUID of the assessment record
 * @property {string} applicantName               - "Surname, Given" display name
 * @property {string} dateOfBirth                 - ISO-8601 date (YYYY-MM-DD)
 * @property {string} drivingLicenceNumber        - DVLA driving licence number
 * @property {string[]} mentalHealthConditions    - Array of category labels (Q2)
 * @property {boolean} suicidalThoughtsVariant    - True when "anxiety/depression (with suicidal thoughts or impairment)" is selected
 * @property {boolean} recentContact              - True when applicant has had recent healthcare contact (Q3)
 * @property {number} highPriorityFlagCount       - Count of high-priority clinical review flags
 * @property {string} submittedAt                 - ISO-8601 timestamp
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
// before they read `window.DvlaM1Dashboard`.
