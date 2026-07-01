// Plain-JavaScript / JSDoc type definitions for the cardiology request
// vetting dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases and so engineers can read the
// canonical shape of the dashboard data in one place.

/**
 * Referral appropriateness band emitted by the engine's Axis A.
 * @typedef {'usually-appropriate' | 'may-be-appropriate' | 'usually-not-appropriate'} AppropriatenessBand
 */

/**
 * Safety / red-flag band emitted by Axis B.
 * @typedef {'ok' | 'caution' | 'red-flag'} SafetyBand
 */

/**
 * Triage tier emitted by Axis D (red-flag escalation).
 * @typedef {'routine' | 'urgent' | 'emergency'} TriageTier
 */

/**
 * Overall vetting recommendation.
 * @typedef {'accept' | 'query-referrer' | 'redirect' | 'reject'} Recommendation
 */

/**
 * Request row displayed in the vetting dashboard.
 *
 * @typedef {Object} RequestRow
 * @property {string} id              - UUID / case identifier of the request
 * @property {string} referralDate    - ISO date "YYYY-MM-DD" of the referral
 * @property {string} patient         - Patient display name
 * @property {string} nhs             - NHS number, formatted "NNN NNN NNNN"
 * @property {string} service         - Requested cardiology service (kebab-case)
 * @property {string} reason          - Primary referral reason (kebab-case)
 * @property {AppropriatenessBand} appropriatenessBand - Axis A band
 * @property {SafetyBand} safetyBand  - Axis B safety / red-flag band
 * @property {TriageTier} triageTier  - Axis D triage tier
 * @property {number} completenessPercent - Axis C completeness 0..100
 * @property {Recommendation} recommendation - Overall vetting recommendation
 * @property {string} clinician       - Referring clinician display name
 * @property {string[]} flags         - Safety-flag categories (kebab-case)
 */

/**
 * Response from `GET /api/cardiology_requests`.
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
// `window.CardiologyRequestDashboard`.
(function () {
'use strict';
window.CardiologyRequestDashboard =
  window.CardiologyRequestDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.CardiologyRequestDashboard`.
})();
