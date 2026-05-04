// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Encounter Satisfaction Score (ESS) category labels — match the strings
 * emitted by the scoring engine. Used both as filter values and as the
 * badge label.
 *
 * @typedef {'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Very Poor'} SatisfactionCategory
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/encounter-satisfaction/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                       - UUID of the survey record
 * @property {string} patientName              - "Surname, Given" display name
 * @property {string} department               - Clinical department / service line
 * @property {string} providerName             - Attending provider display name
 * @property {string} visitType                - Visit-type label (e.g. "Routine Check-up")
 * @property {number} compositeScore           - Composite ESS mean, 1.0-5.0
 * @property {SatisfactionCategory} category   - Satisfaction category
 * @property {string} visitDate                - ISO 8601 date (YYYY-MM-DD)
 * @property {number} flagCount                - Count of flagged issues
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
// namespace, `window.EncounterSatisfactionDashboard`.
(function () {
'use strict';
window.EncounterSatisfactionDashboard = window.EncounterSatisfactionDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.EncounterSatisfactionDashboard`.
})();
