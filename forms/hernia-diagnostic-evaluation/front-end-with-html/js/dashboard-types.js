// Plain-JavaScript / JSDoc type definitions for the Hernia Diagnostic
// Evaluation dashboard.
//
// This file deliberately exports no runtime values; it exists so other
// modules can reference the JSDoc type aliases and so engineers can read the
// canonical shape of the dashboard data in one place.

/**
 * Hernia type.
 * @typedef {'inguinal' | 'femoral' | 'umbilical' | 'epigastric' | 'incisional' | 'paraumbilical' | 'spigelian' | 'other' | ''} HerniaType
 */

/**
 * Clinician judgement of reducibility.
 * @typedef {'reducible' | 'irreducible' | 'incarcerated' | ''} ReducibilityStatus
 */

/**
 * Urgency band, computed red-flag-first rather than by summing a score.
 * @typedef {'routine' | 'soon' | 'urgent' | 'emergency' | ''} UrgencyBand
 */

/**
 * Overall recommendation, derived from the final urgency band.
 * @typedef {'watchful-waiting' | 'elective-repair-referral' | 'urgent-referral' | 'emergency-referral' | 'conservative' | ''} ManagementPlan
 */

/**
 * One evaluation row displayed in the dashboard.
 *
 * @typedef {Object} EvaluationRow
 * @property {string} id                        - UUID / case identifier
 * @property {string} assessmentDate            - ISO date "YYYY-MM-DD"
 * @property {string} patient                   - Patient display name
 * @property {string} nhs                       - NHS number, formatted "NNN NNN NNNN"
 * @property {HerniaType} herniaType             - Classified hernia type
 * @property {ReducibilityStatus} reducibilityStatus - Reducibility status
 * @property {UrgencyBand} computedUrgency       - Engine-computed urgency band
 * @property {UrgencyBand} finalUrgency          - Urgency band after any clinician override
 * @property {ManagementPlan} recommendation     - Overall recommendation
 * @property {string} clinician                  - Assessing clinician display name
 * @property {string[]} flags                    - Safety-flag categories (kebab-case)
 */

/**
 * Response from `GET /api/hernia_diagnostic_evaluations`.
 *
 * The Loco back-end returns a bare JSON array of `EvaluationRow` objects; the
 * dashboard accepts either a bare array or an `{ items, total }` envelope so a
 * future paginated response is forwards-compatible.
 *
 * @typedef {EvaluationRow[] | { items: EvaluationRow[], total?: number }} DashboardEvaluationsResponse
 */

export {};
