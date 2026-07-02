// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the Zarit Burden Interview clinician
// dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Total ZBI score — integer 0-88 (ZBI-22) or 0-48 (ZBI-12), or null when not
 * yet scored.
 *
 * @typedef {number | null} TotalScore
 */

/**
 * Derived burden band emitted by the scoring engine. The ZBI-22 bands are
 * `little-or-none | mild-to-moderate | moderate-to-severe | severe`; the ZBI-12
 * bands are `lower | high`.
 *
 * @typedef {'little-or-none' | 'mild-to-moderate' | 'moderate-to-severe' | 'severe' | 'lower' | 'high'} Band
 */

/**
 * Which instrument form was scored.
 *
 * @typedef {'zbi22' | 'zbi12'} InstrumentForm
 */

/**
 * Care setting where the ZBI was administered.
 *
 * @typedef {'memory-service' | 'community' | 'general-practice' | 'social-care' | 'other'} CareSetting
 */

/**
 * Primary condition of the care recipient.
 *
 * @typedef {'dementia' | 'chronic-illness' | 'disability' | 'other'} RecipientCondition
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/zarit-burden-interview/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                 - UUID of the assessment record
 * @property {string} carerIdentifier    - local carer identifier
 * @property {string} carerName          - "Surname, Given" display name of the carer
 * @property {CareSetting} careSetting    - where the ZBI was administered
 * @property {InstrumentForm} instrumentForm - zbi22 or zbi12
 * @property {RecipientCondition} recipientCondition - care-recipient primary condition
 * @property {TotalScore} totalScore     - total ZBI score or null
 * @property {number} maxScore           - 88 (ZBI-22) or 48 (ZBI-12)
 * @property {Band} burdenBand           - derived burden band
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
// namespace, `window.ZaritBurdenInterviewDashboard`.
(function () {
'use strict';
window.ZaritBurdenInterviewDashboard =
  window.ZaritBurdenInterviewDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.ZaritBurdenInterviewDashboard`.
})();
