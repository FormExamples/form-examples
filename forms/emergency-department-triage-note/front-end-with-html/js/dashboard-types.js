// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Manchester Triage System priority level — 1 (most urgent) to 5.
 * @typedef {1 | 2 | 3 | 4 | 5} PriorityLevel
 */

/**
 * MTS priority colour token, derived directly from the level.
 * @typedef {'red' | 'orange' | 'yellow' | 'green' | 'blue'} PriorityColour
 */

/**
 * Care setting where triage was performed.
 * @typedef {'emergency-department' | 'urgent-treatment-centre' | 'minor-injuries-unit'} CareSetting
 */

/**
 * Triage-note row displayed in the clinician dashboard.
 *
 * Mirrors `TriageRow` in
 * `forms/emergency-department-triage-note/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} TriageRow
 * @property {string} id                  - UUID of the triage record
 * @property {string} patientIdentifier   - local patient identifier (NHS number / MRN)
 * @property {string} patientName         - "Surname, Given" display name
 * @property {CareSetting} careSetting     - where triage was performed
 * @property {string} presentingComplaint - chief complaint (short)
 * @property {PriorityLevel} priorityLevel - assigned MTS priority level (1-5)
 * @property {PriorityColour} priorityColour - derived colour token
 * @property {string} priorityName        - Immediate / Very urgent / Urgent / Standard / Non-urgent
 * @property {number} targetMinutes       - target time to first assessment (0/10/60/120/240)
 * @property {number} news2Total          - supporting NEWS2 aggregate
 * @property {string} triagedAt           - ISO date of triage (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/triage-notes`.
 *
 * @typedef {Object} DashboardTriageNotesResponse
 * @property {TriageRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.EmergencyDepartmentTriageNoteDashboard`.
(function () {
'use strict';
window.EmergencyDepartmentTriageNoteDashboard =
  window.EmergencyDepartmentTriageNoteDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.EmergencyDepartmentTriageNoteDashboard`.
})();
