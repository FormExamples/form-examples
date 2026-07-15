// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other modules
// can reference the JSDoc type aliases via `@typedef` imports and so engineers
// can read the canonical shape of the dashboard data in one place.

/**
 * 10-year CVD risk percentage — number (0.0..99.9) or null when not yet scored.
 *
 * @typedef {number | null} TenYearRiskPercent
 */

/**
 * Derived risk band emitted by the scoring engine. Lower-case strings matching
 * the SvelteKit dashboard so the same backend payload can drive either UI
 * without translation.
 *
 * @typedef {'low' | 'raised' | 'high'} RiskBand
 */

/**
 * Care setting where the assessment was performed.
 *
 * @typedef {'general-practice' | 'pharmacy' | 'nhs-health-check' | 'other'} CareSetting
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/qrisk3-cardiovascular-disease-risk-score/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                        - UUID of the assessment record
 * @property {string} patientIdentifier         - local patient identifier
 * @property {string} patientName               - "Surname, Given" display name
 * @property {CareSetting} careSetting          - where the assessment was performed
 * @property {TenYearRiskPercent} tenYearRiskPercent - 10-year CVD risk % or null
 * @property {RiskBand} riskBand                - derived risk band
 * @property {boolean} statinFlag               - true when risk >= 10% (NICE statin threshold)
 * @property {string} assessedAt                - ISO date of assessment (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/assessments`.
 *
 * @typedef {Object} DashboardAssessmentsResponse
 * @property {AssessmentRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only. Touch the namespace so this file is
// unambiguously side-effecting and other files can rely on it loading before
// they read `window.Qrisk3CardiovascularDiseaseRiskScoreDashboard`.
