// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Validity-status labels - match the strings emitted by the validity-grader.
 * Used both as filter values and as the badge label.
 *
 * @typedef {'Draft' | 'Complete' | 'Valid' | 'Invalid'} ValidityStatus
 */

/**
 * Lasting Power of Attorney status. The three known values mirror the
 * options in the SvelteKit dashboard's filter dropdown.
 *
 * @typedef {'None' | 'Health & Welfare' | 'Property & Financial'} LpaStatus
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/advance-decision-to-refuse-treatment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                          - UUID of the assessment record
 * @property {string} nhsNumber                   - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName                 - "Surname, Given" display name
 * @property {ValidityStatus} validityStatus      - ADRT validity classification
 * @property {boolean} lifeSustainingRefusal      - True when the ADRT refuses life-sustaining treatment
 * @property {boolean} witnessed                  - True when the ADRT has been signed by a witness
 * @property {string} reviewDate                  - ISO yyyy-mm-dd review date, or '' if none
 * @property {LpaStatus} lpaStatus                - Lasting Power of Attorney status
 */

/**
 * Response from `GET /api/dashboard/patients`.
 *
 * @typedef {Object} DashboardPatientsResponse
 * @property {PatientRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.AdvanceDecisionToRefuseTreatmentDashboard`.
