// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Body mass index in kg/m², or null when either input is missing.
 *
 * @typedef {number | null} Bmi
 */

/**
 * WHO adult weight-status category emitted by the calculation engine. Lower-case
 * strings matching the SvelteKit dashboard so the same backend payload can drive
 * either UI without translation.
 *
 * @typedef {'underweight' | 'normal' | 'overweight' | 'obese-class-1' | 'obese-class-2' | 'obese-class-3' | 'unknown'} BmiCategory
 */

/**
 * Care setting where the assessment was performed.
 *
 * @typedef {'primary-care' | 'outpatient' | 'inpatient' | 'oncology' | 'pre-operative' | 'other'} CareSetting
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/body-mass-index-and-body-surface-area-calculator/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                  - UUID of the calculation record
 * @property {string} patientIdentifier   - local patient identifier
 * @property {string} patientName         - "Surname, Given" display name
 * @property {CareSetting} careSetting     - where the assessment was performed
 * @property {Bmi} bmi                     - body mass index (kg/m²) or null
 * @property {BmiCategory} bmiCategory     - derived WHO weight-status category
 * @property {number | null} bsaMosteller  - Mosteller BSA (m²) or null
 * @property {boolean} severeFlag          - true when bmi >= 40 or bmi < 18.5
 * @property {string} assessedAt           - ISO date of assessment (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/assessments`.
 *
 * @typedef {Object} DashboardAssessmentsResponse
 * @property {AssessmentRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.BmiBsaCalculatorDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.BmiBsaCalculatorDashboard`.
