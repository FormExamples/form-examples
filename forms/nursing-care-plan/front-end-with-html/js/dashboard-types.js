// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the Nursing Care Plan clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Overall care-plan completeness status emitted by the engine.
 * @typedef {'complete' | 'partial' | 'incomplete'} PlanStatus
 */

/**
 * A care setting for the plan.
 * @typedef {'ward' | 'community' | 'care-home' | 'hospice' | 'other'} CareSetting
 */

/**
 * One care-plan row displayed in the clinician dashboard.
 *
 * Mirrors `PlanRow` in
 * `forms/nursing-care-plan/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PlanRow
 * @property {string} id                    - UUID of the care-plan record
 * @property {string} patientIdentifier     - local / NHS identifier
 * @property {string} patientName           - "Surname, Given" display name
 * @property {string} wardLocation          - ward / location
 * @property {CareSetting} careSetting       - care setting
 * @property {PlanStatus} status             - completeness status
 * @property {number} completenessPercent    - 0..100
 * @property {number} problemCount           - number of problems recorded
 * @property {number} flagCount              - number of high-priority flags
 */

/**
 * Response from `GET /api/dashboard/care-plans`.
 *
 * @typedef {Object} DashboardCarePlansResponse
 * @property {PlanRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.NursingCarePlanDashboard`.
