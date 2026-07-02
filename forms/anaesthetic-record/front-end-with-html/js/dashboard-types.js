// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the Anaesthetic Record clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * Completeness status emitted by the completeness engine.
 * @typedef {'complete' | 'partial' | 'incomplete'} CompletenessStatus
 */

/**
 * Procedure urgency.
 * @typedef {'elective' | 'urgent' | 'emergency' | 'immediate'} Urgency
 */

/**
 * Record row displayed in the clinician dashboard.
 *
 * Mirrors `RecordRow` in
 * `forms/anaesthetic-record/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} RecordRow
 * @property {string} id                     - UUID of the anaesthetic record
 * @property {string} patientIdentifier      - local patient identifier
 * @property {string} patientName            - "Surname, Given" display name
 * @property {string} theatre                - theatre / location
 * @property {string} anaesthetistName       - responsible anaesthetist
 * @property {Urgency} urgency               - procedure urgency
 * @property {number} completenessPercent    - 0..100 completeness percent
 * @property {CompletenessStatus} status     - complete | partial | incomplete
 * @property {number} flagCount              - number of safety flags raised
 * @property {string} operationDate          - ISO date of anaesthetic (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/records`.
 *
 * @typedef {Object} DashboardRecordsResponse
 * @property {RecordRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules). The IIFE attaches its public symbols to a single
// global namespace, `window.AnaestheticRecordDashboard`.
(function () {
'use strict';
window.AnaestheticRecordDashboard =
  window.AnaestheticRecordDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.AnaestheticRecordDashboard`.
})();
