// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Completeness level emitted by the scoring engine. Lower-cased so it can
 * be used directly as a CSS class suffix and as a filter dropdown value.
 *
 * @typedef {'incomplete' | 'partial' | 'complete' | 'verified'} CompletenessLevel
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/advance-statement-about-care/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                         - UUID of the assessment record
 * @property {string} nhsNumber                  - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName                - "Surname, Given" display name
 * @property {CompletenessLevel} completenessLevel - Statement completeness category
 * @property {string} reviewDate                 - ISO date "YYYY-MM-DD"; '' if not set
 * @property {boolean} witnessed                 - True when the statement is witnessed
 * @property {string} lastUpdated                - ISO date "YYYY-MM-DD" of last update
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
// namespace, `window.AdvanceStatementAboutCareDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.AdvanceStatementAboutCareDashboard`.
