// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * WHO severity scale labels — match the strings emitted by the scoring
 * engine. Used both as filter values and as the badge label.
 *
 * @typedef {'Near Miss' | 'Mild' | 'Moderate' | 'Severe' | 'Critical'} WhoSeverity
 */

/**
 * NCC MERP harm categories A-I emitted by the scoring engine.
 *
 * @typedef {'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I'} MerpCategory
 */

/**
 * Incident row displayed in the clinician dashboard.
 *
 * Mirrors `IncidentRow` in
 * `forms/medical-error-report/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} IncidentRow
 * @property {string} id                  - UUID of the incident record
 * @property {string} incidentId          - Human-readable incident identifier
 * @property {string} incidentDate        - ISO date "YYYY-MM-DD" of incident
 * @property {string} nhsNumber           - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName         - "Surname, Given" display name
 * @property {WhoSeverity} whoSeverity    - WHO severity label
 * @property {MerpCategory} merpCategory  - NCC MERP harm category A-I
 * @property {string} errorType           - Short error-type label
 * @property {boolean} reportedFlag       - True when report submitted to authority
 */

/**
 * Response from `GET /api/dashboard/incidents`.
 *
 * @typedef {Object} DashboardIncidentsResponse
 * @property {IncidentRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.MedicalErrorReportDashboard`.
