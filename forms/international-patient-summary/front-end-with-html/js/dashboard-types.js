// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the IPS clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * IPS completeness status — match the strings emitted by the validation
 * engine (ISO 27269 / HL7 FHIR IPS IG). Used both as filter values and as
 * the badge label.
 *
 * @typedef {'Complete' | 'Partial' | 'Incomplete'} CompletenessStatus
 */

/**
 * Patient row displayed in the IPS clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/international-patient-summary/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                          - UUID of the IPS record
 * @property {string} ipsId                       - Human-readable IPS ID, e.g. "IPS-2026-0001"
 * @property {string} patientName                 - "Surname, Given" display name
 * @property {CompletenessStatus} completeness    - IPS completeness status
 * @property {number} missingMandatorySections    - Count of empty mandatory sections, 0-8
 * @property {boolean} allergyFlag                - True when one or more allergies recorded
 * @property {string} authoringClinician          - Authoring clinician display name
 * @property {string} updatedAt                   - ISO-8601 date string of last update
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
// namespace, `window.InternationalPatientSummaryDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.InternationalPatientSummaryDashboard`.
