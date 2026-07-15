// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Authorisation status values emitted by the validation engine. Used both as
 * filter values and as the badge label.
 *
 * @typedef {'pending' | 'approved' | 'expired'} AuthorisationStatus
 */

/**
 * Stated purpose for releasing the medical record. Drives the purpose filter
 * dropdown and is shown verbatim in the table cell.
 *
 * @typedef {'Continuing Care' | 'Second Opinion' | 'Insurance' | 'Legal Proceedings' | 'Personal Use' | 'Research' | 'Employment'} ReleasePurpose
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/medical-records-release-permission/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                     - UUID of the authorisation record
 * @property {string} nhsNumber              - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName            - "Surname, Given" display name
 * @property {string} recipientOrg           - Recipient organisation name
 * @property {ReleasePurpose|string} purpose - Stated purpose of the release
 * @property {AuthorisationStatus|string} status - Authorisation lifecycle state
 * @property {string} submittedDate          - ISO-8601 calendar date (YYYY-MM-DD)
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
// namespace, `window.MedicalRecordsReleasePermissionDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.MedicalRecordsReleasePermissionDashboard`.
