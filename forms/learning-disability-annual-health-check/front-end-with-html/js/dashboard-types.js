// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * Completeness status emitted by the completeness engine.
 *
 * @typedef {'complete' | 'incomplete'} CompletenessStatus
 */

/**
 * Check row displayed in the clinician dashboard.
 *
 * Mirrors `CheckRow` in
 * `forms/learning-disability-annual-health-check/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} CheckRow
 * @property {string} id                 - UUID of the check record
 * @property {string} personIdentifier   - local person identifier
 * @property {string} personName         - "Surname, Given" display name
 * @property {string} practiceName       - GP practice
 * @property {CompletenessStatus} status - complete | incomplete
 * @property {number} completenessPercent - 0..100 share of required components completed
 * @property {boolean} healthActionPlan  - true when the Health Action Plan was produced and shared
 * @property {boolean} stompFlag         - true when the STOMP flag was raised
 * @property {string} checkedOn          - ISO date of the check (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/checks`.
 *
 * @typedef {Object} DashboardChecksResponse
 * @property {CheckRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.LearningDisabilityAnnualHealthCheckDashboard`.
(function () {
'use strict';
window.LearningDisabilityAnnualHealthCheckDashboard =
  window.LearningDisabilityAnnualHealthCheckDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file is
// unambiguously side-effecting and other files can rely on it loading before
// they read `window.LearningDisabilityAnnualHealthCheckDashboard`.
})();
