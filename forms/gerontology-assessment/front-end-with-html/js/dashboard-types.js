// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Clinical Frailty Scale (CFS) integer score, 1-9.
 * 1 = Very Fit, 4 = Vulnerable, 7 = Severely Frail, 9 = Terminally Ill.
 *
 * @typedef {1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9} CfsScore
 */

/**
 * Falls risk band emitted by the scoring engine.
 *
 * @typedef {'Low' | 'Medium' | 'High'} FallsRisk
 */

/**
 * Cognitive status category.
 *
 * @typedef {'Normal' | 'Mild Impairment' | 'Moderate Impairment' | 'Severe Impairment'} CognitiveStatus
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/gerontology-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                       - UUID of the assessment record
 * @property {string} nhsNumber                - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName              - "Surname, Given" display name
 * @property {CfsScore} cfsScore               - Clinical Frailty Scale score, 1-9
 * @property {FallsRisk} fallsRisk             - Falls risk band
 * @property {CognitiveStatus} cognitiveStatus - Cognitive status category
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
// before they read `window.GerontologyAssessmentDashboard`.
