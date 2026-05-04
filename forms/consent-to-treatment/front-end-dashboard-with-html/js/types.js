// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Consent form status — matches the strings emitted by the backend
 * validation engine. Used both as filter values and as the badge label.
 *
 * @typedef {'pending' | 'signed' | 'expired'} ConsentStatus
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/consent-to-treatment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id              - UUID of the consent record
 * @property {string} nhsNumber       - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName     - "Surname, Given" display name
 * @property {string} procedureName   - Free-text procedure label
 * @property {string} department      - Clinical department
 * @property {ConsentStatus} status   - Consent form status
 * @property {string} scheduledDate   - ISO 8601 date (YYYY-MM-DD)
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
// namespace, `window.ConsentToTreatmentDashboard`.
(function () {
'use strict';
window.ConsentToTreatmentDashboard = window.ConsentToTreatmentDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.ConsentToTreatmentDashboard`.
})();
