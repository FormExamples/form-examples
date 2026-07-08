// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the UK DVLA V1 clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Applicant row displayed in the clinician dashboard for the UK DVLA V1 form.
 *
 * Mirrors `PatientRow` in
 * `forms/united-kingdom-driver-and-vehicle-licensing-agency-v1-form/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                       - UUID of the assessment record
 * @property {string} applicantName            - "Surname, Given" display name
 * @property {string} dateOfBirth              - ISO-8601 date (YYYY-MM-DD)
 * @property {string} drivingLicenceNumber     - DVLA driving licence number
 * @property {boolean} monocularVision         - True when applicant has vision in one eye only
 * @property {boolean} glaucomaDeclared        - True when glaucoma was declared
 * @property {boolean} diplopiaDeclared        - True when double vision was declared
 * @property {number} highPriorityFlagCount    - Count of high-priority risk flags
 * @property {number} validationCompleteness   - 0-100 percent of mandatory fields completed
 * @property {string} submittedAt              - ISO-8601 timestamp
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
// namespace, `window.DvlaV1Dashboard`.
(function () {
'use strict';
window.DvlaV1Dashboard = window.DvlaV1Dashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.DvlaV1Dashboard`.
})();
