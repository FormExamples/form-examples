// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Care setting where the assessment was performed.
 *
 * @typedef {'emergency-department' | 'burns-unit' | 'intensive-care' | 'retrieval' | 'other'} CareSetting
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/parkland-formula-for-burns/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                       - UUID of the calculation record
 * @property {string} patientIdentifier        - local patient identifier
 * @property {string} patientName              - "Surname, Given" display name
 * @property {CareSetting} careSetting          - where the assessment was performed
 * @property {number | null} tbsaPercent       - %TBSA burned, or null
 * @property {number | null} total24hVolumeMl  - total 24 h crystalloid (mL) or null
 * @property {boolean} majorBurnFlag           - true when %TBSA meets the age-band referral threshold
 * @property {string} assessedAt               - ISO date of assessment (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/assessments`.
 *
 * @typedef {Object} DashboardAssessmentsResponse
 * @property {AssessmentRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.ParklandFormulaForBurnsDashboard`.
