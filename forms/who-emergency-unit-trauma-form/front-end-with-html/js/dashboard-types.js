// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Triage category assigned in the emergency unit.
 *
 * @typedef {'red' | 'yellow' | 'green' | ''} TriageCategory
 */

/**
 * Mechanism of injury.
 *
 * @typedef {'road-traffic' | 'fall' | 'penetrating' | 'blunt' | 'burn' | 'other' | ''} Mechanism
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
 * `forms/who-emergency-unit-trauma-form/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                       - UUID of the encounter record
 * @property {string} patientName              - "Surname, Given" display name
 * @property {string} dateOfBirth              - ISO-8601 date (YYYY-MM-DD)
 * @property {string} sex                      - 'F' | 'M' | other free text
 * @property {string} injuryLocation           - Free-text injury location/scene
 * @property {TriageCategory} triageCategory
 * @property {boolean} deadOnArrival
 * @property {Mechanism} mechanism
 * @property {number | null} gcsTotal          - Glasgow Coma Scale total (3-15) or null
 * @property {boolean} fastPositive            - FAST ultrasound positive
 * @property {number} urgentFlagCount          - Number of urgent clinical flags raised
 * @property {Disposition} disposition
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

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.WhoEmergencyUnitTraumaDashboard`.
