// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Result classification emitted by the engine. Lower-case strings matching the
 * SvelteKit dashboard so the same backend payload can drive either UI.
 *
 * @typedef {'inadequate' | 'hpv-negative' | 'hpv-positive-cytology-normal'
 *   | 'hpv-positive-cytology-abnormal-low' | 'hpv-positive-cytology-abnormal-high'
 *   | 'hpv-positive-cytology-pending' | 'cease-not-eligible' | 'pending'} ResultClass
 */

/**
 * Recommended management action emitted by the engine.
 *
 * @typedef {'routine-recall' | 'early-repeat-12-months' | 'colposcopy-referral'
 *   | 'urgent-colposcopy-referral' | 'repeat-sample-3-months' | 'cease-screening'
 *   | 'awaiting-cytology' | 'awaiting-result'} ManagementAction
 */

/**
 * Care setting where the sample was taken.
 *
 * @typedef {'general-practice' | 'sexual-health' | 'other'} CareSetting
 */

/**
 * Screening row displayed in the clinician dashboard.
 *
 * Mirrors `ScreeningRow` in
 * `forms/cervical-screening/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} ScreeningRow
 * @property {string} id                    - UUID of the screening record
 * @property {string} patientIdentifier     - local patient identifier
 * @property {string} patientName           - "Surname, Given" display name
 * @property {CareSetting} careSetting       - where the sample was taken
 * @property {ResultClass} resultClass      - result classification
 * @property {ManagementAction} managementAction - recommended management action
 * @property {boolean} urgentFlag           - true when urgent colposcopy is indicated
 * @property {string} screenedAt            - ISO date of screening (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/screenings`.
 *
 * @typedef {Object} DashboardScreeningsResponse
 * @property {ScreeningRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.CervicalScreeningDashboard`.
(function () {
'use strict';
window.CervicalScreeningDashboard = window.CervicalScreeningDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.CervicalScreeningDashboard`.
})();
