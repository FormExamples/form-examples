// Plain-JavaScript / JSDoc type definitions for the colonoscopy vetting
// dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases and so engineers can read the
// canonical shape of the dashboard data in one place.

/**
 * Appropriateness band emitted by the engine's Axis A (ASGE / EPAGE / NICE 1-9).
 * @typedef {'usually-appropriate' | 'may-be-appropriate' | 'usually-not-appropriate'} AppropriatenessBand
 */

/**
 * Cancer-pathway triage tier emitted by Axis B (NICE NG12 / DG56).
 * @typedef {'routine' | 'urgent' | 'two-week-wait' | 'emergency'} TriageTier
 */

/**
 * Pre-procedure risk band emitted by Axis D (BSG / ESGE + prep + ASA).
 * @typedef {'low' | 'moderate' | 'high'} RiskBand
 */

/**
 * Request row displayed in the vetting dashboard.
 *
 * @typedef {Object} RequestRow
 * @property {string} id              - UUID / case identifier of the request
 * @property {string} referralDate    - ISO date "YYYY-MM-DD" of the referral
 * @property {string} patient         - Patient display name
 * @property {string} nhs             - NHS number, formatted "NNN NNN NNNN"
 * @property {string} procedure       - Requested procedure (kebab-case)
 * @property {string} indication      - Primary clinical indication (kebab-case)
 * @property {AppropriatenessBand} appropriatenessBand - Axis A band
 * @property {TriageTier} triageTier  - Axis B cancer-pathway triage tier
 * @property {boolean} twoWeekWaitEligible - Axis B 2WW eligibility
 * @property {RiskBand} riskBand      - Axis D pre-procedure risk band
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

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules) so the page can be opened directly via `file://`.
// The IIFE attaches its public symbols to a single global namespace,
// `window.ColonoscopyTestRequestDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.ColonoscopyTestRequestDashboard`.
