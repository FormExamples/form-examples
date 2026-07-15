// Plain-JavaScript / JSDoc type definitions for the sleep study vetting
// dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases and so engineers can read the
// canonical shape of the dashboard data in one place.

/**
 * Appropriateness band emitted by the engine's Axis A (NICE NG202 / SIGN 1-9).
 * @typedef {'usually-appropriate' | 'may-be-appropriate' | 'usually-not-appropriate'} AppropriatenessBand
 */

/**
 * Clinical priority band emitted by Axis B.
 * @typedef {'low' | 'moderate' | 'high'} PriorityBand
 */

/**
 * Triage tier emitted by Axis D (DVLA escalation).
 * @typedef {'routine' | 'urgent'} TriageTier
 */

/**
 * Request row displayed in the vetting dashboard.
 *
 * @typedef {Object} RequestRow
 * @property {string} id              - UUID / case identifier of the request
 * @property {string} referralDate    - ISO date "YYYY-MM-DD" of the referral
 * @property {string} patient         - Patient display name
 * @property {string} nhs             - NHS number, formatted "NNN NNN NNNN"
 * @property {string} studyType       - Requested study type (kebab-case)
 * @property {string} indication      - Primary clinical indication (kebab-case)
 * @property {(number|null)} epworthScore - Epworth Sleepiness Scale 0..24 or null
 * @property {(number|null)} stopBangScore - STOP-BANG score 0..8 or null
 * @property {AppropriatenessBand} appropriatenessBand - Axis A band
 * @property {PriorityBand} priorityBand - Axis B clinical priority
 * @property {TriageTier} triageTier  - Axis D triage tier
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
// before they read `window.SleepStudyTestRequestDashboard`.
