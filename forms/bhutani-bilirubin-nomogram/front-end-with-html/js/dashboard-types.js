// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Percentile risk zone emitted by the classifier, or null when not classified.
 *
 * @typedef {'low' | 'low-intermediate' | 'high-intermediate' | 'high' | null} RiskZone
 */

/**
 * Care setting where the assessment was performed.
 *
 * @typedef {'postnatal-ward' | 'neonatal-unit' | 'midwife-led-unit' | 'community' | 'other'} CareSetting
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/bhutani-bilirubin-nomogram/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                        - UUID of the assessment record
 * @property {string} patientIdentifier         - local infant identifier
 * @property {string} patientName               - "Surname, Given" display name
 * @property {CareSetting} careSetting           - where the assessment was performed
 * @property {number | null} ageHours            - age at measurement (hours) or null
 * @property {number | null} totalSerumBilirubinUmolL - measured TSB (µmol/L) or null
 * @property {RiskZone} riskZone                 - percentile risk zone
 * @property {boolean} aboveExchange             - true when TSB >= exchange threshold
 * @property {string} assessedAt                 - ISO date of assessment (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/assessments`.
 *
 * @typedef {Object} DashboardAssessmentsResponse
 * @property {AssessmentRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules) so the page can be opened directly via `file://`.
// The IIFE attaches its public symbols to a single global namespace,
// `window.BhutaniBilirubinNomogramDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.BhutaniBilirubinNomogramDashboard`.
