// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the clinician dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.

/**
 * Total Padua Prediction Score — integer 0-20, or null when not yet scored.
 *
 * @typedef {number | null} PaduaScore
 */

/**
 * Derived risk band emitted by the scoring engine. Lower-case strings matching
 * the SvelteKit dashboard so the same backend payload can drive either UI
 * without translation.
 *
 * @typedef {'low' | 'high'} RiskBand
 */

/**
 * Prophylaxis recommendation emitted by the scoring engine.
 *
 * @typedef {'pharmacological' | 'mechanical' | 'none'} ProphylaxisRecommendation
 */

/**
 * Care setting where the assessment was performed.
 *
 * @typedef {'acute-medical' | 'general-medical' | 'admissions-unit' | 'other'} CareSetting
 */

/**
 * Assessment row displayed in the clinician dashboard.
 *
 * Mirrors `AssessmentRow` in
 * `forms/padua-venous-thromboembolism-risk-assessment/front-end-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                 - UUID of the assessment record
 * @property {string} patientIdentifier  - local patient identifier
 * @property {string} patientName        - "Surname, Given" display name
 * @property {CareSetting} careSetting    - where the assessment was performed
 * @property {PaduaScore} paduaScore     - total Padua score (0-20) or null
 * @property {RiskBand} riskBand         - derived risk band
 * @property {ProphylaxisRecommendation} prophylaxisRecommendation - gated recommendation
 * @property {string} assessedAt         - ISO date of assessment (yyyy-mm-dd)
 */

/**
 * Response from `GET /api/dashboard/assessments`.
 *
 * @typedef {Object} DashboardAssessmentsResponse
 * @property {AssessmentRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.PaduaVenousThromboembolismRiskAssessmentDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.PaduaVenousThromboembolismRiskAssessmentDashboard`.
