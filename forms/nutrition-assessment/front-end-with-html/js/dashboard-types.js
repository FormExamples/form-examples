// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * MUST risk category labels — match the strings emitted by the scoring
 * engine. Used both as filter values and as the badge label.
 *
 * @typedef {'low' | 'medium' | 'high'} MustRiskCategory
 */

/**
 * Overall nutritional risk level emitted by the scoring engine,
 * incorporating MUST plus other assessment factors.
 *
 * @typedef {'low' | 'moderate' | 'high' | 'critical'} OverallRiskLevel
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors the `PatientRow` shape that the SvelteKit dashboard would derive
 * from `forms/nutrition-assessment/front-end-dashboard-with-svelte/src/lib/data.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                          - UUID of the assessment record
 * @property {string} nhsNumber                   - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName                 - "Surname, Given" display name
 * @property {number} mustTotalScore              - MUST total score, 0-6
 * @property {MustRiskCategory} mustRiskCategory  - MUST risk category
 * @property {OverallRiskLevel} overallRiskLevel  - Overall nutritional risk level
 * @property {number} bmi                         - Body Mass Index, kg/m^2 (one decimal)
 * @property {boolean} nutritionalSupportFlag     - True when patient is on enteral/parenteral/oral nutritional support
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
// namespace, `window.NutritionAssessmentDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.NutritionAssessmentDashboard`.
