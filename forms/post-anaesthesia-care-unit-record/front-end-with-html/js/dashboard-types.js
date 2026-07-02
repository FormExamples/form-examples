// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the recovery-team dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * Total Modified Aldrete score — integer 0-10, or null when not yet scored.
 *
 * @typedef {number | null} AldreteTotal
 */

/**
 * Derived readiness band emitted by the scoring engine.
 *
 * @typedef {'not-ready' | 'discharge-ready'} ReadinessBand
 */

/**
 * Anaesthetic technique used for the case.
 *
 * @typedef {'general' | 'regional' | 'sedation' | 'combined'} AnaestheticTechnique
 */

/**
 * Recovery-record row displayed in the dashboard.
 *
 * Mirrors `RecordRow` in
 * `forms/post-anaesthesia-care-unit-record/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} RecordRow
 * @property {string} id                            - UUID of the recovery record
 * @property {string} patientIdentifier             - local patient identifier
 * @property {string} patientName                   - "Surname, Given" display name
 * @property {AnaestheticTechnique} anaestheticTechnique - technique used
 * @property {AldreteTotal} aldreteTotal            - total Aldrete score (0-10) or null
 * @property {ReadinessBand} readinessBand          - derived readiness band
 * @property {boolean} notReadyFlag                 - true when readinessBand === 'not-ready'
 * @property {string} admittedAt                    - ISO date of PACU admission (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/records`.
 *
 * @typedef {Object} DashboardRecordsResponse
 * @property {RecordRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules) so the page can be opened directly via `file://`.
// The IIFE attaches its public symbols to a single global namespace,
// `window.PostAnaesthesiaCareUnitRecordDashboard`.
(function () {
'use strict';
window.PostAnaesthesiaCareUnitRecordDashboard =
  window.PostAnaesthesiaCareUnitRecordDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file is
// unambiguously side-effecting and other files can rely on it loading before
// they read `window.PostAnaesthesiaCareUnitRecordDashboard`.
})();
