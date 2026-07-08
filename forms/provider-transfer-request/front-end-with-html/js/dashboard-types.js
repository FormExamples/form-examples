// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * SBAR completeness labels — match the strings emitted by the validation
 * engine. Used both as filter values and as the badge label.
 *
 * @typedef {'Complete' | 'Partial' | 'Incomplete'} Completeness
 */

/**
 * Transfer urgency band emitted by the requesting clinician.
 *
 * @typedef {'Routine' | 'Urgent' | 'Emergency'} Urgency
 */

/**
 * Transfer-request row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/provider-transfer-request/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                    - UUID of the transfer record
 * @property {string} nhsNumber             - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName           - "Surname, Given" display name
 * @property {string} requestingProvider    - Requesting clinician / unit
 * @property {string} receivingProvider     - Receiving clinician / unit
 * @property {Urgency} urgency              - Transfer urgency band
 * @property {Completeness} completeness    - SBAR validation outcome
 * @property {boolean} acknowledged         - True when receiver has acknowledged
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
// namespace, `window.ProviderTransferRequestDashboard`.
(function () {
'use strict';
window.ProviderTransferRequestDashboard = window.ProviderTransferRequestDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.ProviderTransferRequestDashboard`.
})();
