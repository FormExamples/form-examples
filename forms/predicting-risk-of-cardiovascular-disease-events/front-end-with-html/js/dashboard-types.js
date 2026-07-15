// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * AHA PREVENT 10-year total-CVD risk category labels — match the strings
 * emitted by the scoring engine. Used both as filter values and as the
 * badge label.
 *
 * @typedef {'low' | 'borderline' | 'intermediate' | 'high'} RiskCategory
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/predicting-risk-of-cardiovascular-disease-events/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                  - UUID of the assessment record
 * @property {string} nhsNumber           - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName         - "Surname, Given" display name
 * @property {RiskCategory} riskCategory  - PREVENT 10-year total-CVD risk band
 * @property {number} tenYearRisk         - 10-year total-CVD risk percentage
 * @property {boolean} diabetes           - True when patient has diabetes
 * @property {number} egfr                - Estimated glomerular filtration rate (mL/min/1.73 m^2)
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
// before they read `window.PredictingRiskOfCardiovascularDiseaseEventsDashboard`.
