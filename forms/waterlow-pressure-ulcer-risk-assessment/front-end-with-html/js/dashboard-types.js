// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Total Waterlow score — integer 0..40+, or null when not yet scored.
 *
 * @typedef {number | null} WaterlowScore
 */

/**
 * Derived risk band emitted by the scoring engine. Lower-case strings matching
 * the SvelteKit dashboard so the same backend payload can drive either UI
 * without translation.
 *
 * @typedef {'low' | 'at-risk' | 'high' | 'very-high'} RiskBand
 */

/**
 * Care setting where the assessment was performed.
 *
 * @typedef {'acute-ward' | 'community' | 'care-home' | 'hospice' | 'other'} CareSetting
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/waterlow-pressure-ulcer-risk-assessment/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                    - UUID of the assessment record
 * @property {string} patientIdentifier     - local patient identifier
 * @property {string} patientName           - "Surname, Given" display name
 * @property {CareSetting} careSetting       - where the assessment was performed
 * @property {WaterlowScore} waterlowScore  - total Waterlow score or null
 * @property {RiskBand} riskBand            - derived risk band
 * @property {boolean} existingPressureDamage - true when existing pressure damage is present
 * @property {string} assessedAt            - ISO date of assessment (yyyy-mm-dd)
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
// before they read `window.WaterlowPressureUlcerRiskAssessmentDashboard`.
