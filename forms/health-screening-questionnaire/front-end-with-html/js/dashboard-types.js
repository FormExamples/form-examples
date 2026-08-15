// Plain-JavaScript / JSDoc type definitions for the Health Screening
// Questionnaire dashboard.
//
// This file deliberately exports no runtime values; it exists so other
// modules can reference the JSDoc type aliases and so engineers can read the
// canonical shape of the dashboard data in one place.

/**
 * PAR-Q+ clearance status.
 * @typedef {'cleared' | 'further-assessment-required' | ''} ParqPlusClearance
 */

/**
 * AUDIT-C band.
 * @typedef {'low' | 'increasing-risk' | 'higher-risk' | ''} AuditCBand
 */

/**
 * Composite risk band, by the max-grade algorithm.
 * @typedef {'low' | 'moderate' | 'high' | 'refer-urgently' | ''} RiskBand
 */

/**
 * Referral recommendation.
 * @typedef {'clear-to-proceed' | 'routine-review' | 'gp-review-required' | 'refer-urgently' | 'paediatric-pathway' | ''} Recommendation
 */

/**
 * One questionnaire row displayed in the dashboard.
 *
 * @typedef {Object} QuestionnaireRow
 * @property {string} id                    - UUID / case identifier
 * @property {string} assessmentDate        - ISO date "YYYY-MM-DD"
 * @property {string} patient               - Patient display name
 * @property {string} identifier            - NHS or employee number
 * @property {string} screeningPurpose      - Screening purpose (kebab-case)
 * @property {ParqPlusClearance} parqPlusClearance - PAR-Q+ clearance status
 * @property {number|null} auditCScore      - AUDIT-C total, 0 to 12, or null when unanswered
 * @property {AuditCBand} auditCBand        - AUDIT-C band
 * @property {RiskBand} riskBand            - Final composite risk band
 * @property {Recommendation} recommendation - Referral recommendation
 * @property {string} assessor              - Assessing person's display name and role
 * @property {string[]} flags               - Safety-flag categories (kebab-case)
 */

/**
 * Response from `GET /api/health_screening_questionnaires`.
 *
 * The Loco back-end returns a bare JSON array of `QuestionnaireRow` objects;
 * the dashboard accepts either a bare array or an `{ items, total }` envelope
 * so a future paginated response is forwards-compatible.
 *
 * @typedef {QuestionnaireRow[] | { items: QuestionnaireRow[], total?: number }} DashboardQuestionnairesResponse
 */

export {};
