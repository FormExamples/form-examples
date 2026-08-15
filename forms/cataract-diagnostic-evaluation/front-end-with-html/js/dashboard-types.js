// Plain-JavaScript / JSDoc type definitions for the Cataract Diagnostic
// Evaluation dashboard.
//
// This file deliberately exports no runtime values; it exists so other
// modules can reference the JSDoc type aliases and so engineers can read the
// canonical shape of the dashboard data in one place.

/**
 * LOCS III severity band.
 * @typedef {'mild' | 'moderate' | 'severe' | ''} LocsIIISeverity
 */

/**
 * Surgical-candidacy recommendation.
 * @typedef {'not-indicated' | 'consider' | 'indicated' | 'urgent-referral' | ''} SurgicalCandidacy
 */

/**
 * One evaluation row displayed in the dashboard.
 *
 * @typedef {Object} EvaluationRow
 * @property {string} id                            - UUID / case identifier
 * @property {string} assessmentDate                - ISO date "YYYY-MM-DD"
 * @property {string} patient                        - Patient display name
 * @property {string} nhs                             - NHS number, formatted "NNN NNN NNNN"
 * @property {LocsIIISeverity} locsIIISeverityRight   - Right eye LOCS III severity band
 * @property {LocsIIISeverity} locsIIISeverityLeft    - Left eye LOCS III severity band
 * @property {SurgicalCandidacy} computedSurgicalCandidacy - Computed surgical candidacy
 * @property {SurgicalCandidacy} finalSurgicalCandidacy    - Final surgical candidacy (after any clinician override)
 * @property {string} clinician                       - Assessing clinician display name
 * @property {string} reviewDate                      - ISO date of the next planned review
 * @property {string[]} flags                         - Safety-flag categories (kebab-case)
 */

/**
 * Response from `GET /api/cataract_diagnostic_evaluations`.
 *
 * The Loco back-end returns a bare JSON array of `EvaluationRow` objects; the
 * dashboard accepts either a bare array or an `{ items, total }` envelope so
 * a future paginated response is forwards-compatible.
 *
 * @typedef {EvaluationRow[] | { items: EvaluationRow[], total?: number }} DashboardEvaluationsResponse
 */

export {};
