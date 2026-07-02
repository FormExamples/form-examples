// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * A per-timepoint Apgar total — integer 0-10, or null when not scored.
 *
 * @typedef {number | null} ApgarTotal
 */

/**
 * Derived band emitted by the scoring engine for the latest scored timepoint.
 * Lower-case strings matching the SvelteKit dashboard so the same backend
 * payload can drive either UI without translation.
 *
 * @typedef {'reassuring' | 'moderately-low' | 'low'} Band
 */

/**
 * Care setting where the birth was attended.
 *
 * @typedef {'delivery-room' | 'theatre' | 'birth-centre' | 'home' | 'neonatal-unit' | 'other'} CareSetting
 */

/**
 * Assessment row displayed in the clinician dashboard. Each row summarises one
 * Apgar assessment: the 1- and 5-minute totals, the band for the latest scored
 * timepoint, and a resuscitation flag (raised when any timepoint total <= 3).
 *
 * Mirrors `AssessmentRow` in
 * `forms/apgar-score/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                 - UUID of the assessment record
 * @property {string} patientIdentifier  - local newborn identifier
 * @property {string} patientName        - "Surname, Given" display name
 * @property {CareSetting} careSetting    - where the birth was attended
 * @property {ApgarTotal} oneMinuteScore - 1-minute total (0-10) or null
 * @property {ApgarTotal} fiveMinuteScore - 5-minute total (0-10) or null
 * @property {Band} band                 - band of the latest scored timepoint
 * @property {boolean} resuscitationFlag - true when any timepoint total <= 3
 * @property {string} assessedAt         - ISO date of birth (yyyy-mm-dd)
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
// namespace, `window.ApgarScoreDashboard`.
(function () {
'use strict';
window.ApgarScoreDashboard = window.ApgarScoreDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.ApgarScoreDashboard`.
})();
