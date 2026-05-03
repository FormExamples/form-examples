// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the WHO Emergency First Aid clinician
// dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Problem type per WHO Emergency First Aid form (medical vs trauma).
 *
 * @typedef {'medical' | 'trauma' | ''} ProblemType
 */

/**
 * Glasgow Coma Scale level captured under Disability (D).
 *
 * @typedef {'alert' | 'confused' | 'unconscious' | ''} GcsLevel
 */

/**
 * Patient row displayed in the CFAR clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/who-emergency-first-aid-form/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                   - UUID of the encounter record
 * @property {string} patientName          - "Surname, Given" display name
 * @property {number | null} age           - Age in years (null when unknown)
 * @property {string} sex                  - 'M' | 'F' | other
 * @property {ProblemType} problemType
 * @property {boolean} majorBleeding       - C: catastrophic haemorrhage present
 * @property {boolean} tourniquetApplied   - Tourniquet placed for life-threatening bleed
 * @property {boolean} airwayIntervention  - A: any airway intervention performed
 * @property {GcsLevel} gcsLevel           - D: Glasgow Coma Scale level
 * @property {number} urgentFlagCount      - Number of precaution / safety flags raised
 * @property {string} recordedBy           - CFAR responder name
 * @property {string} recordedAt           - ISO-8601 timestamp
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
// namespace, `window.WhoEmergencyFirstAidDashboard`.
(function () {
'use strict';
window.WhoEmergencyFirstAidDashboard = window.WhoEmergencyFirstAidDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.WhoEmergencyFirstAidDashboard`.
})();
