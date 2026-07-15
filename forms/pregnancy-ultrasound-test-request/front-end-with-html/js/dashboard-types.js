// Plain-JavaScript / JSDoc type definitions for the obstetric ultrasound
// vetting dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases and so engineers can read the
// canonical shape of the dashboard data in one place.

/**
 * Appropriateness band emitted by the engine's Axis A (ACR 1-9).
 * @typedef {'usually-appropriate' | 'may-be-appropriate' | 'usually-not-appropriate'} AppropriatenessBand
 */

/**
 * Gestational-age window fit emitted by Axis B.
 * @typedef {'appropriate' | 'borderline' | 'outside-window'} WindowFit
 */

/**
 * Triage tier emitted by Axis D (red-flag escalation).
 * @typedef {'routine' | 'soon' | 'urgent' | 'emergency'} TriageTier
 */

/**
 * Request row displayed in the vetting dashboard.
 *
 * @typedef {Object} RequestRow
 * @property {string} id              - UUID / case identifier of the request
 * @property {string} referralDate    - ISO date "YYYY-MM-DD" of the referral
 * @property {string} patient         - Patient display name
 * @property {string} nhs             - NHS number, formatted "NNN NNN NNNN"
 * @property {string} scanType        - Requested scan type (kebab-case)
 * @property {string} indication      - Primary clinical indication (kebab-case)
 * @property {string} gestationalAge  - Gestational age "W+D" (e.g. "12+3")
 * @property {AppropriatenessBand} appropriatenessBand - Axis A band
 * @property {WindowFit} windowFit    - Axis B gestational-age window fit
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

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules) so the page can be opened directly via `file://`.
// The IIFE attaches its public symbols to a single global namespace,
// `window.PregnancyUltrasoundTestRequestDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.PregnancyUltrasoundTestRequestDashboard`.
