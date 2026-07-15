// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Corrected calcium value in mmol/L, or null when either input is missing.
 *
 * @typedef {number | null} CorrectedCalcium
 */

/**
 * Classification band emitted by the correction engine. Lower-case strings
 * matching the SvelteKit dashboard so the same backend payload can drive either
 * UI without translation.
 *
 * @typedef {'hypocalcaemia' | 'normal' | 'hypercalcaemia' | 'unknown'} Classification
 */

/**
 * Care setting where the assessment was performed.
 *
 * @typedef {'general-practice' | 'ward' | 'emergency-department' | 'outpatient' | 'laboratory' | 'other'} CareSetting
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/corrected-calcium-calculator/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                     - UUID of the calculation record
 * @property {string} patientIdentifier      - local patient identifier
 * @property {string} patientName            - "Surname, Given" display name
 * @property {CareSetting} careSetting        - where the assessment was performed
 * @property {CorrectedCalcium} correctedCalcium - corrected calcium (mmol/L) or null
 * @property {Classification} classification - derived classification band
 * @property {boolean} severeFlag            - true when correctedCalcium >= 3.0 or < 1.9
 * @property {string} assessedAt             - ISO date of assessment (yyyy-mm-dd)
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
// before they read `window.CorrectedCalciumCalculatorDashboard`.
