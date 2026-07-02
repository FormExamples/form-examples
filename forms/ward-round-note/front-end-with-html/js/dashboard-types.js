// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Completeness status emitted by the grading engine.
 *
 * @typedef {'complete' | 'partial' | 'incomplete'} CompletenessStatus
 */

/**
 * Reviewing-clinician grade.
 *
 * @typedef {'fy1' | 'fy2' | 'core-trainee' | 'specialty-registrar' | 'acp' | 'physician-associate' | 'consultant'} ClinicianGrade
 */

/**
 * Ward-round-note row displayed in the clinician dashboard.
 *
 * Mirrors `NoteRow` in
 * `forms/ward-round-note/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} NoteRow
 * @property {string} id                        - UUID of the note record
 * @property {string} patientIdentifier         - local patient identifier
 * @property {string} patientName               - "Surname, Given" display name
 * @property {string} ward                       - ward / location
 * @property {ClinicianGrade} clinicianGrade      - reviewing-clinician grade
 * @property {CompletenessStatus} status          - complete | partial | incomplete
 * @property {number} completenessPercent         - 0..100 across the required components
 * @property {boolean} safetyFlag                 - true when a high-priority safety flag was raised
 * @property {string} reviewedAt                  - ISO date of the review (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/notes`.
 *
 * @typedef {Object} DashboardNotesResponse
 * @property {NoteRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.WardRoundNoteDashboard`.
(function () {
'use strict';
window.WardRoundNoteDashboard = window.WardRoundNoteDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.WardRoundNoteDashboard`.
})();
