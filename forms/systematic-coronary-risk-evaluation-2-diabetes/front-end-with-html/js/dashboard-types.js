// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the SCORE2-Diabetes clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * SCORE2-Diabetes risk-category labels — match the strings emitted by the
 * scoring engine. Used both as filter values and as the badge label.
 *
 * @typedef {'low' | 'moderate' | 'high' | 'veryHigh'} RiskCategory
 */

/**
 * Review status of a submitted assessment.
 *
 * @typedef {'pending' | 'reviewed' | 'urgent'} ReviewStatus
 */

/**
 * Patient row displayed in the clinician dashboard.
 *
 * Mirrors `PatientRow` in
 * `forms/systematic-coronary-risk-evaluation-2-diabetes/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} PatientRow
 * @property {string} id                 - UUID of the assessment record
 * @property {string} nhsNumber          - NHS number, formatted "NNN NNN NNNN"
 * @property {string} patientName        - "Surname, Given" display name
 * @property {RiskCategory} riskCategory - SCORE2-Diabetes risk band
 * @property {number} hba1cMmolMol       - HbA1c in mmol/mol (IFCC units)
 * @property {number} systolicBp         - Systolic blood pressure, mmHg
 * @property {boolean} hasEstablishedCvd - True when prior CVD documented
 * @property {number} flagCount          - Count of active safety flags
 * @property {ReviewStatus} status       - Review status
 * @property {string} submittedDate      - ISO-8601 date (YYYY-MM-DD)
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
// namespace, `window.SystematicCoronaryRiskEvaluation2DiabetesDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.SystematicCoronaryRiskEvaluation2DiabetesDashboard`.
