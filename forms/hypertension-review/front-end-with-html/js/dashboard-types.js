// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * Blood-pressure control class emitted by the grading engine.
 *
 * @typedef {'controlled' | 'uncontrolled' | 'severe-uncontrolled'} ControlClass
 */

/**
 * Review completeness emitted by the grading engine.
 *
 * @typedef {'complete' | 'partial' | 'incomplete'} ReviewStatus
 */

/**
 * Hypertension stage from the raw readings.
 *
 * @typedef {'none' | 'stage-1' | 'stage-2' | 'stage-3-severe'} HypertensionStage
 */

/**
 * Review row displayed in the clinician dashboard.
 *
 * Mirrors `ReviewRow` in
 * `forms/hypertension-review/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} ReviewRow
 * @property {string} id                       - UUID of the review record
 * @property {string} patientIdentifier        - NHS number / local identifier
 * @property {string} patientName              - "Surname, Given" display name
 * @property {string} practiceSite             - practice or site
 * @property {ControlClass} controlStatus       - controlled | uncontrolled | severe-uncontrolled
 * @property {ReviewStatus} reviewStatus        - complete | partial | incomplete
 * @property {HypertensionStage} hypertensionStage - none | stage-1 | stage-2 | stage-3-severe
 * @property {boolean} severeFlag               - true when a severe-hypertension flag was raised
 * @property {string} reviewedAt                - ISO date of review (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/reviews`.
 *
 * @typedef {Object} DashboardReviewsResponse
 * @property {ReviewRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules) so the page can be opened directly via `file://`.
// The IIFE attaches its public symbols to a single global namespace,
// `window.HypertensionReviewDashboard`.
(function () {
'use strict';
window.HypertensionReviewDashboard =
  window.HypertensionReviewDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file is
// unambiguously side-effecting and other files can rely on it loading before
// they read `window.HypertensionReviewDashboard`.
})();
