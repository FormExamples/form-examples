// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Risk category emitted by the simplified QRISK3-based scoring engine.
 * 'draft' is reserved for incomplete records (age or sex missing) but the
 * dashboard only renders submitted assessments so the visible filter values
 * are 'low' | 'moderate' | 'high'.
 *
 * @typedef {'low' | 'moderate' | 'high' | 'draft'} RiskCategory
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/heart-health-check/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                  - UUID of the assessment record
 * @property {string} nhsNumber           - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName         - "Surname, Given" display name
 * @property {number} age                 - Chronological age in years
 * @property {string} sex                 - 'female' | 'male'
 * @property {RiskCategory} riskCategory  - Computed risk category
 * @property {number} tenYearRisk         - 10-year CVD risk percentage (0.1-95.0)
 * @property {number | null} heartAge     - Heart age in years, or null when undefined
 * @property {number} flagCount           - Count of flagged issues raised by the engine
 * @property {string} submittedDate       - ISO-8601 date the assessment was submitted
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
// namespace, `window.HeartHealthCheckDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.HeartHealthCheckDashboard`.
