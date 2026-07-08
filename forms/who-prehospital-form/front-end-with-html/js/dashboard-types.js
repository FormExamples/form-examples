// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Scene type where EMS responded.
 *
 * @typedef {'home' | 'roadside' | 'workplace' | 'public' | 'medical-facility' | 'other' | ''} SceneType
 */

/**
 * Triage category: RED (immediate), YELLOW (urgent), GREEN (non-urgent).
 *
 * @typedef {'red' | 'yellow' | 'green' | ''} TriageCategory
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/who-prehospital-form/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                       - UUID of the EMS call record
 * @property {string} patientName              - "Surname, Given" display name
 * @property {number} age                      - Patient age in years
 * @property {string} sex                      - 'F' | 'M' | other free text
 * @property {SceneType} sceneType
 * @property {string} chiefComplaint
 * @property {TriageCategory} triageCategory
 * @property {number | null} gcsTotal          - Glasgow Coma Scale total (3-15)
 * @property {0 | 1 | 2 | 3} reassessmentCount - Number of reassessments performed
 * @property {number} urgentFlagCount          - Number of urgent clinical flags raised
 * @property {string} providerName             - Attending EMS provider name (may be '')
 * @property {string} dispatchedAt             - ISO-8601 dispatch timestamp
 * @property {string | null} handoverAt        - ISO-8601 handover timestamp or null
 */

/**
 * Response from `GET /api/dashboard/patients`.
 *
 * @typedef {Object} DashboardPatientsResponse
 * @property {PatientRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.WhoPrehospitalDashboard`.
(function () {
'use strict';
window.WhoPrehospitalDashboard = window.WhoPrehospitalDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.WhoPrehospitalDashboard`.
})();
