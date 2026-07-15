// Plain-JavaScript / JSDoc type definitions for the Holter monitor vetting
// dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases and so engineers can read the
// canonical shape of the dashboard data in one place.

/**
 * Appropriateness band emitted by the engine's Axis A (ACC/AHA 1-9).
 * @typedef {'usually-appropriate' | 'may-be-appropriate' | 'usually-not-appropriate'} AppropriatenessBand
 */

/**
 * Triage tier emitted by Axis B (red-flag escalation).
 * @typedef {'routine' | 'urgent' | 'emergency'} TriageTier
 */

/**
 * Clinical-priority band emitted by Axis D (acuity banding).
 * @typedef {'low' | 'moderate' | 'high'} PriorityBand
 */

/**
 * Request row displayed in the vetting dashboard.
 *
 * @typedef {Object} RequestRow
 * @property {string} id              - UUID / case identifier of the request
 * @property {string} referralDate    - ISO date "YYYY-MM-DD" of the referral
 * @property {string} patient         - Patient display name
 * @property {string} nhs             - NHS number, formatted "NNN NNN NNNN"
 * @property {string} monitorType     - Requested monitor type (kebab-case)
 * @property {string} indication      - Primary clinical indication (kebab-case)
 * @property {string} symptomFrequency - Symptom frequency (kebab-case)
 * @property {AppropriatenessBand} appropriatenessBand - Axis A band
 * @property {TriageTier} triageTier  - Axis B triage tier
 * @property {PriorityBand} priorityBand - Axis D clinical-priority band
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
// before they read `window.HolterMonitorTestRequestDashboard`.
