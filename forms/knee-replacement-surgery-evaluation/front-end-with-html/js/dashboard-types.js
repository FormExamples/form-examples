// Plain-JavaScript / JSDoc type definitions for the Knee Replacement Surgery
// Evaluation dashboard.
//
// This file deliberately exports no runtime values; it exists so other
// modules can reference the JSDoc type aliases and so engineers can read the
// canonical shape of the dashboard data in one place. Mirrors the
// `EvaluationRow` interface in
// ../../front-end-with-svelte/src/lib/engine/types.ts.

/**
 * Oxford Knee Score category.
 * @typedef {'severe' | 'moderate' | 'mild-to-moderate' | 'satisfactory' | ''} OksCategory
 */

/**
 * Computed surgical-candidacy recommendation.
 * @typedef {'strong-candidate' | 'candidate' | 'continue-conservative' | 'not-indicated' | 'mdt-review' | ''} Candidacy
 */

/**
 * Clinician recommendation on the management plan, step 14.
 * @typedef {'total-knee-replacement' | 'partial-knee-replacement' | 'continue-conservative-management' | 'mdt-review' | 'not-currently-a-candidate' | ''} PlanRecommendation
 */

/**
 * One evaluation row displayed in the dashboard.
 *
 * @typedef {Object} EvaluationRow
 * @property {string} id                       - UUID / case identifier
 * @property {string} assessmentDate           - ISO date "YYYY-MM-DD"
 * @property {string} patient                  - Patient display name
 * @property {string} nhs                      - NHS number, formatted "NNN NNN NNNN"
 * @property {string} kneeSide                 - Affected knee: left, right, or bilateral
 * @property {number} oksTotal                 - Oxford Knee Score total, 0 to 48
 * @property {OksCategory} oksCategory         - Oxford Knee Score category
 * @property {Candidacy} candidacy             - Final surgical-candidacy recommendation
 * @property {string} clinician                - Assessing clinician display name
 * @property {PlanRecommendation} planRecommendation - Clinician's step-14 recommendation
 * @property {string[]} flags                  - Safety-flag categories (kebab-case)
 */

/**
 * Response from `GET /api/knee_replacement_surgery_evaluations`.
 *
 * The Loco back-end returns a bare JSON array of `EvaluationRow` objects; the
 * dashboard accepts either a bare array or an `{ items, total }` envelope so a
 * future paginated response is forwards-compatible.
 *
 * @typedef {EvaluationRow[] | { items: EvaluationRow[], total?: number }} DashboardEvaluationsResponse
 */

export {};
