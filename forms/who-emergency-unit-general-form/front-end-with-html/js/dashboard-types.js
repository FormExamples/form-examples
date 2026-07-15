// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Mode by which the patient arrived at the emergency unit.
 *
 * @typedef {'walking' | 'wheelchair' | 'stretcher' | 'ambulance' | ''} ArrivalMode
 */

/**
 * AVPU level of consciousness: Alert, Verbal, Pain, Unresponsive.
 *
 * @typedef {'A' | 'V' | 'P' | 'U' | ''} Avpu
 */

/**
 * Disposition outcome from the emergency unit.
 *
 * @typedef {'admit' | 'transfer' | 'discharge' | 'died' | 'lwbs' | ''} Disposition
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/who-emergency-unit-general-form/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                       - UUID of the encounter record
 * @property {string} patientName              - "Surname, Given" display name
 * @property {string} dateOfBirth              - ISO-8601 date (YYYY-MM-DD)
 * @property {string} sex                      - 'F' | 'M' | other free text
 * @property {ArrivalMode} arrivalMode
 * @property {string} chiefComplaint
 * @property {Avpu} avpu
 * @property {boolean} highRiskSignsPresent    - True when any high-risk sign positive
 * @property {Disposition} disposition
 * @property {number} urgentFlagCount          - Number of urgent clinical flags raised
 * @property {string} providerName             - Attending provider name (may be '')
 * @property {string | null} dispositionAt     - ISO-8601 timestamp or null
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
// namespace, `window.WhoEmergencyUnitGeneralDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.WhoEmergencyUnitGeneralDashboard`.
