// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Anion gap value in mmol/L, or null when a required electrolyte is missing.
 *
 * @typedef {number | null} AnionGap
 */

/**
 * Classification band emitted by the anion-gap engine. Lower-case strings
 * matching the SvelteKit dashboard so the same backend payload can drive either
 * UI without translation.
 *
 * @typedef {'low' | 'normal' | 'high' | 'very-high' | 'unknown'} Classification
 */

/**
 * Care setting where the calculation was performed.
 *
 * @typedef {'emergency-department' | 'ward' | 'intensive-care' | 'laboratory' | 'other'} CareSetting
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/anion-gap-calculator/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                     - UUID of the calculation record
 * @property {string} patientIdentifier      - local patient identifier
 * @property {string} patientName            - "Surname, Given" display name
 * @property {CareSetting} careSetting        - where the calculation was performed
 * @property {AnionGap} anionGap             - raw anion gap (mmol/L) or null
 * @property {AnionGap} correctedAnionGap    - albumin-corrected gap (mmol/L) or null
 * @property {Classification} classification - derived classification band
 * @property {boolean} raisedFlag            - true when classification is high or very-high
 * @property {string} assessedAt             - ISO date of calculation (yyyy-mm-dd)
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
// before they read `window.AnionGapCalculatorDashboard`.
