// Plain-JavaScript / JSDoc type definitions for the Hip Replacement Surgery
// Evaluation dashboard.
//
// This file deliberately exports no runtime values; it exists so other modules
// can reference the JSDoc type aliases and so engineers can read the canonical
// shape of the dashboard data in one place.

/**
 * Oxford Hip Score category band.
 * @typedef {'severe' | 'moderate' | 'mild-to-moderate' | 'satisfactory' | ''} OhsCategory
 */

/**
 * Surgical-candidacy recommendation.
 * @typedef {'strong-candidate' | 'candidate' | 'continue-conservative' | 'not-indicated' | 'mdt-review' | ''} Candidacy
 */

/**
 * One evaluation row displayed in the dashboard.
 *
 * @typedef {Object} EvaluationRow
 * @property {string} id                       - UUID / case identifier
 * @property {string} assessmentDate           - ISO date "YYYY-MM-DD"
 * @property {string} patient                  - Patient display name
 * @property {string} nhs                      - NHS number, formatted "NNN NNN NNNN"
 * @property {number|null} bmi                 - Body mass index in kg/m²
 * @property {number} ohsTotal                 - Oxford Hip Score total, 0 to 48
 * @property {OhsCategory} ohsCategory         - Oxford Hip Score category band
 * @property {number|null} kellgrenLawrenceGrade - Kellgren and Lawrence grade, 0 to 4
 * @property {Candidacy} candidacy              - Final surgical-candidacy recommendation
 * @property {string} clinician                 - Assessing clinician display name
 * @property {string[]} flags                   - Safety-flag categories (kebab-case)
 */

/**
 * Response from `GET /api/hip_replacement_surgery_evaluations`.
 *
 * The Loco back-end returns a bare JSON array of `EvaluationRow` objects; the
 * dashboard accepts either a bare array or an `{ items, total }` envelope so a
 * future paginated response is forwards-compatible.
 *
 * @typedef {EvaluationRow[] | { items: EvaluationRow[], total?: number }} DashboardEvaluationsResponse
 */

export {};
