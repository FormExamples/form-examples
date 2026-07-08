// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/types.ts` data model for the occupational health dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.
//
// Every row in this dashboard is anonymous and aggregated at the
// department or team level. There are NO individual employee identifiers
// in any of the typedefs below — that is a hard constraint of the
// HSE Management Standards methodology.

/**
 * Overall HSE risk band emitted by the scoring engine, benchmarked against
 * HSE percentile thresholds (20th / 50th / 80th).
 *
 * @typedef {'Low' | 'Moderate' | 'High' | 'Very High'} OverallRisk
 */

/**
 * One of the seven HSE Management Standards domain names. Used both as
 * filter values and to label the worst-domain badge.
 *
 * @typedef {'Demands' | 'Control' | 'Manager Support' | 'Peer Support' | 'Relationships' | 'Role' | 'Change'} HseDomain
 */

/**
 * Tenure band for a team or department aggregate. "Mixed" is used when the
 * team contains employees spanning multiple bands.
 *
 * @typedef {'<1 year' | '1-3 years' | '3-5 years' | '5-10 years' | '10+ years' | 'Mixed'} TenureBand
 */

/**
 * Aggregated domain means for one team or department. Each value is the
 * arithmetic mean of the underlying 1-5 Likert items in that HSE domain.
 *
 * Range: 1.0 (worst) to 5.0 (best). Demands and Change are reverse-scored
 * by the engine before being aggregated, so higher always means better.
 *
 * @typedef {Object} DomainMeans
 * @property {number} demands
 * @property {number} control
 * @property {number} managerSupport
 * @property {number} peerSupport
 * @property {number} relationships
 * @property {number} role
 * @property {number} change
 */

/**
 * One row in the aggregate dashboard table. Represents a department or
 * team — never an individual employee.
 *
 * Mirrors `TeamRow` in
 * `forms/workplace-stress-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} TeamRow
 * @property {string} id                  - UUID of the aggregate record
 * @property {string} department          - Department or team name (the only displayed identifier)
 * @property {number} responsesCount      - Number of completed responses contributing to this aggregate (>= agreed minimum)
 * @property {TenureBand} tenureBand      - Predominant tenure band, or "Mixed"
 * @property {DomainMeans} domainMeans    - Mean 1-5 score for each of the seven HSE domains
 * @property {OverallRisk} overallRisk    - Overall HSE risk band for the aggregate
 * @property {HseDomain} worstDomain      - Domain with the lowest mean (i.e. the highest risk)
 */

/**
 * Response from `GET /api/dashboard/teams`.
 *
 * @typedef {Object} DashboardTeamsResponse
 * @property {TeamRow[]} items
 * @property {number} total
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.WorkplaceStressAssessmentDashboard`.
(function () {
'use strict';
window.WorkplaceStressAssessmentDashboard =
  window.WorkplaceStressAssessmentDashboard || {};

// No runtime exports; types are JSDoc-only. Touch the namespace so this
// file is unambiguously side-effecting and other files can rely on it
// loading before they read `window.WorkplaceStressAssessmentDashboard`.
})();
