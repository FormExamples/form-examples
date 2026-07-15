// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * UK MEC category labels — match the strings emitted by the scoring
 * engine. Used both as filter values and as the badge label.
 *
 * @typedef {'UK MEC 1' | 'UK MEC 2' | 'UK MEC 3' | 'UK MEC 4'} MecCategory
 */

/**
 * DVT (deep vein thrombosis) risk band emitted by the scoring engine.
 *
 * @typedef {'Low' | 'Moderate' | 'High'} DvtRisk
 */

/**
 * Cardiovascular-disease risk band emitted by the scoring engine.
 *
 * @typedef {'Low' | 'Moderate' | 'High'} CvdRisk
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/birth-control-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                        - UUID of the assessment record
 * @property {string} nhsNumber                 - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName               - "Surname, Given" display name
 * @property {MecCategory} mecCategory          - UK MEC eligibility category
 * @property {string} methodRecommended         - Recommended contraceptive method
 * @property {DvtRisk} dvtRisk                  - DVT risk band
 * @property {CvdRisk} cvdRisk                  - Cardiovascular risk band
 * @property {boolean} migraineWithAuraFlag     - True when migraine with aura is reported
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
// before they read `window.BirthControlAssessmentDashboard`.
