// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Faecal haemoglobin concentration in ug Hb/g, or null when no valid result.
 *
 * @typedef {number | null} FaecalHaemoglobin
 */

/**
 * Result class emitted by the classification engine. Lower-case strings
 * matching the SvelteKit dashboard so the same backend payload can drive either
 * UI without translation. Empty string denotes an unclassified record (kit not
 * returned, or returned/adequate but no numeric result).
 *
 * @typedef {'negative' | 'positive' | 'spoilt' | ''} ResultClass
 */

/**
 * Recommended management action.
 *
 * @typedef {'routine-recall' | 'refer-colonoscopy' | 'repeat-kit' | ''} ManagementAction
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/bowel-cancer-screening-with-faecal-immunochemical-test/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                     - UUID of the screening record
 * @property {string} participantIdentifier  - local participant / episode identifier
 * @property {string} participantName        - "Surname, Given" display name
 * @property {string} screeningHub           - hub / centre that processed the kit
 * @property {FaecalHaemoglobin} faecalHaemoglobinUgG - measured faecal Hb (ug Hb/g) or null
 * @property {ResultClass} resultClass       - derived result classification
 * @property {ManagementAction} managementAction - derived management action
 * @property {boolean} symptomaticPathway    - true when red-flag symptoms route to the urgent pathway
 * @property {string} reviewedAt             - ISO date the result was reviewed (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/assessments`.
 *
 * @typedef {Object} DashboardAssessmentsResponse
 * @property {AssessmentRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.BowelCancerScreeningFitDashboard`.
(function () {
'use strict';
window.BowelCancerScreeningFitDashboard =
  window.BowelCancerScreeningFitDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.BowelCancerScreeningFitDashboard`.
})();
