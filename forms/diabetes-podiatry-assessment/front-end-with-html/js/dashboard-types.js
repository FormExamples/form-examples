// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Overall diabetic-foot risk category emitted by the engine.
 *
 * @typedef {'low' | 'moderate' | 'high' | 'active-urgent'} RiskCategory
 */

/**
 * Review pathway emitted by the engine.
 *
 * @typedef {'urgent-mdt-referral' | 'high-risk-review'
 *   | 'moderate-risk-review' | 'annual-review'} ReviewPathway
 */

/**
 * Referral destination emitted by the engine.
 *
 * @typedef {'none' | 'foot-protection-service'
 *   | 'multidisciplinary-foot-team' | 'urgent-mdt'} Referral
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/diabetes-podiatry-assessment/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                    - UUID of the assessment record
 * @property {string} patientIdentifier     - local / NHS patient identifier
 * @property {string} patientName           - "Surname, Given" display name
 * @property {string} assessedAt            - ISO date of assessment (yyyy-mm-dd)
 * @property {RiskCategory} rightFootRisk   - right-foot risk category
 * @property {RiskCategory} leftFootRisk    - left-foot risk category
 * @property {RiskCategory} overallRisk     - overall (worse-foot) risk category
 * @property {ReviewPathway} reviewPathway  - recommended review pathway
 * @property {Referral} referral            - referral destination
 * @property {1 | 3 | 6 | 12 | null} reviewIntervalMonths - review interval
 * @property {boolean} urgentFlag           - true when active-urgent risk (urgent MDT referral)
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
// before they read `window.DiabetesPodiatryAssessmentDashboard`.
