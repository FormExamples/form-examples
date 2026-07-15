// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Aggregate MEWS — integer 0-14, or null when not yet scored.
 *
 * @typedef {number | null} MewsScore
 */

/**
 * Derived risk band emitted by the scoring engine. Lower-case strings matching
 * the SvelteKit dashboard so the same backend payload can drive either UI
 * without translation.
 *
 * @typedef {'low' | 'medium' | 'high'} RiskBand
 */

/**
 * Care setting where the observation was recorded.
 *
 * @typedef {'acute-ward' | 'admissions-unit' | 'assessment-unit' | 'other'} CareSetting
 */

/**
 * Observation row displayed in the clinician dashboard.
 *
 * Mirrors `ObservationRow` in
 * `forms/modified-early-warning-score/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} ObservationRow
 * @property {string} id                       - UUID of the observation record
 * @property {string} patientIdentifier        - local patient identifier
 * @property {string} patientName              - "Surname, Given" display name
 * @property {CareSetting} careSetting          - where the observation was recorded
 * @property {MewsScore} mewsScore             - aggregate MEWS (0-14) or null
 * @property {RiskBand} riskBand               - derived risk band
 * @property {boolean} singleParameterTrigger  - true when any parameter scored 3
 * @property {string} observedAt               - ISO date of observation (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/observations`.
 *
 * @typedef {Object} DashboardObservationsResponse
 * @property {ObservationRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.ModifiedEarlyWarningScoreDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.ModifiedEarlyWarningScoreDashboard`.
