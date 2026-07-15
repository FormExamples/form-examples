// Plain-JavaScript / JSDoc type definitions for the biopsy vetting dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases and so engineers can read the
// canonical shape of the dashboard data in one place.

/**
 * Appropriateness band emitted by the engine's Axis A (ACR 1-9).
 * @typedef {'usually-appropriate' | 'may-be-appropriate' | 'usually-not-appropriate'} AppropriatenessBand
 */

/**
 * Periprocedural bleeding-risk band emitted by Axis B.
 * @typedef {'low' | 'moderate' | 'high'} BleedingRiskBand
 */

/**
 * Triage tier emitted by Axis D (urgency / cancer-pathway escalation).
 * @typedef {'routine' | 'urgent' | 'two-week-wait' | 'emergency'} TriageTier
 */

/**
 * Request row displayed in the vetting dashboard.
 *
 * @typedef {Object} RequestRow
 * @property {string} id              - UUID / case identifier of the request
 * @property {string} referralDate    - ISO date "YYYY-MM-DD" of the referral
 * @property {string} patient         - Patient display name
 * @property {string} nhs             - NHS number, formatted "NNN NNN NNNN"
 * @property {string} biopsySite      - Biopsy site (kebab-case)
 * @property {string} biopsyMethod    - Biopsy method (kebab-case)
 * @property {string} indication      - Primary clinical indication (kebab-case)
 * @property {AppropriatenessBand} appropriatenessBand - Axis A band
 * @property {BleedingRiskBand} bleedingRiskBand - Axis B band
 * @property {TriageTier} triageTier  - Axis D triage tier
 * @property {boolean} twoWeekWaitEligible - NICE NG12 two-week-wait eligibility
 * @property {number} completenessPercent - Axis C completeness 0..100
 * @property {string} clinician       - Requesting clinician display name
 * @property {string[]} flags         - Safety-flag categories (kebab-case)
 */

/**
 * Response from `GET /api/requests`.
 *
 * The Loco backend returns a bare JSON array of `RequestRow` objects; the
 * dashboard accepts either a bare array or an `{ items, total }` envelope so
 * future paginated responses are forwards-compatible.
 *
 * @typedef {RequestRow[] | { items: RequestRow[], total?: number }} DashboardRequestsResponse
 */

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.BiopsyTestRequestDashboard`.
