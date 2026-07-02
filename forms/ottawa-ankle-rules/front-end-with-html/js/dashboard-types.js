// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.
//
// The Ottawa Ankle Rules produce two independent BOOLEAN imaging decisions
// (there is no score and no risk band), so each row carries `ankleXrayIndicated`
// and `footXrayIndicated` rather than a numeric total.

/**
 * Injured side recorded for the assessment.
 *
 * @typedef {'left' | 'right'} InjuredSide
 */

/**
 * Care setting where the assessment was performed.
 *
 * @typedef {'emergency-department' | 'minor-injury-unit' | 'urgent-care' | 'other'} CareSetting
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/ottawa-ankle-rules/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                    - UUID of the assessment record
 * @property {string} patientIdentifier     - local patient identifier
 * @property {string} patientName           - "Surname, Given" display name
 * @property {CareSetting} careSetting        - where the assessment was performed
 * @property {InjuredSide} injuredSide        - injured side (left / right)
 * @property {boolean} ankleXrayIndicated    - ankle X-ray decision (yes/no)
 * @property {boolean} footXrayIndicated     - foot X-ray decision (yes/no)
 * @property {string} assessedAt             - ISO date of assessment (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/assessments`.
 *
 * @typedef {Object} DashboardAssessmentsResponse
 * @property {AssessmentRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules) so the page can be opened directly via `file://`.
// The IIFE attaches its public symbols to a single global namespace,
// `window.OttawaAnkleRulesDashboard`.
(function () {
'use strict';
window.OttawaAnkleRulesDashboard = window.OttawaAnkleRulesDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.OttawaAnkleRulesDashboard`.
})();
