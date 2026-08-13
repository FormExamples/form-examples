// Plain-JavaScript / JSDoc type definitions for the Dietetic Assessment
// dashboard.
//
// This file deliberately exports no runtime values; it exists so other modules
// can reference the JSDoc type aliases and so engineers can read the canonical
// shape of the dashboard data in one place.

/**
 * MUST risk category emitted by the engine.
 * @typedef {'low' | 'medium' | 'high'} MustRisk
 */

/**
 * GLIM malnutrition diagnosis.
 * @typedef {'none' | 'moderate' | 'severe'} GlimDiagnosis
 */

/**
 * Refeeding-syndrome risk per NICE CG32.
 * @typedef {'none' | 'high' | 'highest'} RefeedingRisk
 */

/**
 * Composite nutrition risk, by the max-grade algorithm.
 * @typedef {'low' | 'moderate' | 'high' | 'critical'} CompositeRisk
 */

/**
 * Overall recommendation.
 * @typedef {'routine-care' | 'observe-and-rescreen' | 'dietetic-treatment-plan' | 'urgent-referral' | 'discharge'} Recommendation
 */

/**
 * One assessment row displayed in the dashboard.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                    - UUID / case identifier
 * @property {string} assessmentDate        - ISO date "YYYY-MM-DD"
 * @property {string} patient               - Patient display name
 * @property {string} nhs                   - NHS number, formatted "NNN NNN NNNN"
 * @property {number|null} bmi              - Body mass index in kg/m², or null when estimated from MUAC
 * @property {number|null} weightLossPercent - Unplanned weight loss over 3 to 6 months
 * @property {number} mustScore             - MUST total, 0 to 6
 * @property {MustRisk} mustRisk            - MUST risk category
 * @property {boolean} mustIsEstimated      - Whether the MUST score relies on an estimate
 * @property {GlimDiagnosis} glimDiagnosis  - GLIM malnutrition diagnosis
 * @property {RefeedingRisk} refeedingRisk  - Refeeding-syndrome risk
 * @property {CompositeRisk} compositeRisk  - Final composite nutrition risk
 * @property {Recommendation} recommendation - Overall recommendation
 * @property {string} dietitian             - Assessing dietitian display name
 * @property {string} reviewDate            - ISO date of the next planned review
 * @property {string[]} flags               - Safety-flag categories (kebab-case)
 */

/**
 * Response from `GET /api/dietic_assessments`.
 *
 * The Loco back-end returns a bare JSON array of `AssessmentRow` objects; the
 * dashboard accepts either a bare array or an `{ items, total }` envelope so a
 * future paginated response is forwards-compatible.
 *
 * @typedef {AssessmentRow[] | { items: AssessmentRow[], total?: number }} DashboardAssessmentsResponse
 */

export {};
