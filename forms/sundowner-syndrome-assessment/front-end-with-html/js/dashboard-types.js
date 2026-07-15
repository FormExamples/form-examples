// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Sundowner severity categories — emitted by the CMAI scoring engine.
 *   Mild     — Occasional restlessness, redirectable, CMAI 29-45
 *   Moderate — Daily episodes, requires intervention, CMAI 46-75
 *   Severe   — Aggressive behaviour, safety risk, CMAI 76-120
 *   Critical — Self-harm risk, requires constant supervision, CMAI >120
 *
 * @typedef {'Mild' | 'Moderate' | 'Severe' | 'Critical'} Severity
 */

/**
 * Underlying dementia diagnosis — drives differential management.
 *
 * @typedef {"Alzheimer's" | 'Vascular' | 'Lewy Body' | 'Mixed' | 'Frontotemporal' | 'None'} DementiaType
 */

/**
 * Where the patient lives / receives care — relevant to environmental
 * triggers and carer support.
 *
 * @typedef {'Own Home' | 'Family Carer' | 'Residential Care' | 'Nursing Home' | 'Hospital'} ResidentialSetting
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/sundowner-syndrome-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string}             id                  - UUID of the assessment record
 * @property {string}             nhsNumber           - NHS number, formatted "NNN NNN NNNN"
 * @property {string}             patientName         - "Surname, Given" display name
 * @property {number}             age                 - Patient age in years
 * @property {number}             cmaiScore           - CMAI total, 29-203
 * @property {number}             npiScore            - NPI total, 0-144
 * @property {Severity}           severity            - Sundowner severity category
 * @property {DementiaType}       dementiaType        - Underlying dementia diagnosis
 * @property {ResidentialSetting} residentialSetting  - Where the patient lives
 * @property {string}             managementPlan      - Brief plan summary
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
// before they read `window.SundownerSyndromeAssessmentDashboard`.
