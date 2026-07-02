// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the C-SSRS clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Highest affirmative ideation level — integer 0-5, or null when not yet scored.
 *
 * @typedef {0 | 1 | 2 | 3 | 4 | 5 | null} IdeationLevel
 */

/**
 * Derived risk tier emitted by the classification engine. Lower-case strings
 * matching the SvelteKit dashboard so the same backend payload can drive either
 * UI without translation.
 *
 * @typedef {'low' | 'moderate' | 'high'} RiskTier
 */

/**
 * Care setting where the assessment was performed.
 *
 * @typedef {'mental-health' | 'emergency-department' | 'primary-care' | 'crisis-service' | 'inpatient' | 'other'} CareSetting
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/columbia-suicide-severity-rating-scale/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                 - UUID of the assessment record
 * @property {string} patientIdentifier  - local patient identifier
 * @property {string} patientName        - "Surname, Given" display name
 * @property {CareSetting} careSetting    - where the assessment was performed
 * @property {IdeationLevel} ideationLevel - highest affirmative ideation level (0-5) or null
 * @property {RiskTier} riskTier         - derived Low / Moderate / High risk tier
 * @property {boolean} escalationFlag    - true when riskTier == 'high' (urgent response)
 * @property {string} assessedAt         - ISO date of assessment (yyyy-mm-dd)
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
// namespace, `window.ColumbiaSuicideSeverityRatingScaleDashboard`.
(function () {
'use strict';
window.ColumbiaSuicideSeverityRatingScaleDashboard =
  window.ColumbiaSuicideSeverityRatingScaleDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.ColumbiaSuicideSeverityRatingScaleDashboard`.
})();
