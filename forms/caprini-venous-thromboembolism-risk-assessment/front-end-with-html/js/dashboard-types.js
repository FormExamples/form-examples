// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Total Caprini score — integer 0..40+, or null when not yet scored.
 *
 * @typedef {number | null} CapriniScore
 */

/**
 * Derived risk band emitted by the scoring engine. Lower-case strings matching
 * the SvelteKit dashboard so the same backend payload can drive either UI
 * without translation.
 *
 * @typedef {'very-low' | 'low' | 'moderate' | 'high'} RiskBand
 */

/**
 * Recommended prophylaxis strategy emitted by the engine.
 *
 * @typedef {'early-ambulation' | 'mechanical' | 'pharmacological-or-mechanical' | 'pharmacological-plus-mechanical'} Prophylaxis
 */

/**
 * Care setting where the assessment was performed.
 *
 * @typedef {'surgical-ward' | 'medical-ward' | 'pre-operative-clinic' | 'other'} CareSetting
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/caprini-venous-thromboembolism-risk-assessment/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                          - UUID of the assessment record
 * @property {string} patientIdentifier           - local patient identifier
 * @property {string} patientName                 - "Surname, Given" display name
 * @property {CareSetting} careSetting            - where the assessment was performed
 * @property {CapriniScore} capriniScore          - total Caprini score or null
 * @property {RiskBand} riskBand                  - derived risk band
 * @property {Prophylaxis} recommendedProphylaxis - recommended prophylaxis strategy
 * @property {boolean} highBleedingRisk           - true when a high bleeding-risk contraindication is present
 * @property {string} assessedAt                  - ISO date of assessment (yyyy-mm-dd)
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
// before they read `window.CapriniVenousThromboembolismRiskAssessmentDashboard`.
