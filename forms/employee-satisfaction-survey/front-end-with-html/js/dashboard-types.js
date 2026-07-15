// Plain-JavaScript / JSDoc type definitions for the Employee Satisfaction
// Survey HR / management dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and so
// engineers can read the canonical shape of the dashboard data in one place.
//
// Every row in this dashboard is anonymous and aggregated at the
// department or team level. There are NO individual employee identifiers
// in any of the typedefs below — that is a hard constraint of the
// employee-satisfaction methodology. Even free-text comments are
// aggregated and never displayed in this dashboard.

/**
 * Satisfaction category emitted by the scoring engine, banded against the
 * normalised 0-100 composite score.
 *
 * - Excellent    (85-100): outstanding employee experience across all domains
 * - Good         (70-84):  above-average experience with minor improvement areas
 * - Satisfactory (50-69):  adequate experience with several improvement areas
 * - Poor         (25-49):  below-average experience requiring significant improvement
 * - Very Poor    (0-24):   critically deficient experience requiring urgent action
 *
 * @typedef {'Excellent' | 'Good' | 'Satisfactory' | 'Poor' | 'Very Poor'} SatisfactionCategory
 */

/**
 * One of the eight survey-domain names. Used both as filter values and to
 * label the worst-domain badge.
 *
 * @typedef {'Workload' | 'Management' | 'Growth' | 'Compensation' | 'Culture' | 'Environment' | 'Recognition' | 'Overall Experience'} SatisfactionDomain
 */

/**
 * Tenure band for a team or department aggregate. "Mixed" is used when the
 * team contains employees spanning multiple bands.
 *
 * @typedef {'<1 year' | '1-3 years' | '3-5 years' | '5-10 years' | '10+ years' | 'Mixed'} TenureBand
 */

/**
 * Aggregated domain means for one team or department. Each value is the
 * arithmetic mean of the underlying 1-5 Likert items in that domain.
 *
 * Range: 1.0 (worst) to 5.0 (best). Higher always means better — items
 * worded negatively are reverse-scored by the engine before aggregation.
 *
 * @typedef {Object} DomainMeans
 * @property {number} workload          - Workload & Work-Life Balance
 * @property {number} management        - Management & Leadership
 * @property {number} growth            - Growth & Development
 * @property {number} compensation      - Compensation & Benefits
 * @property {number} culture           - Culture & Inclusion
 * @property {number} environment       - Environment & Resources
 * @property {number} recognition       - Recognition & Engagement
 * @property {number} overallExperience - Overall Experience & Retention Intent
 */

/**
 * One row in the aggregate dashboard table. Represents a department or
 * team — never an individual employee.
 *
 * Mirrors `TeamRow` in
 * `forms/employee-satisfaction-survey/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} TeamRow
 * @property {string} id                       - UUID of the aggregate record
 * @property {string} department               - Department or team name (the only displayed identifier)
 * @property {number} responsesCount           - Number of completed responses contributing to this aggregate (>= agreed minimum)
 * @property {TenureBand} tenureBand           - Predominant tenure band, or "Mixed"
 * @property {number} composite                - Normalised composite score (0-100)
 * @property {SatisfactionCategory} category   - Banded category derived from `composite`
 * @property {DomainMeans} domainMeans         - Mean 1-5 score for each of the eight domains
 * @property {SatisfactionDomain} worstDomain  - Domain with the lowest mean (i.e. the highest priority for action)
 * @property {number} enps                     - Employee Net Promoter Score for this aggregate (-100..+100)
 */

/**
 * Response from `GET /api/dashboard/teams`.
 *
 * @typedef {Object} DashboardTeamsResponse
 * @property {TeamRow[]} items
 * @property {number} total
 */

// No runtime exports; types are JSDoc-only. Touch the namespace so this
// file is unambiguously side-effecting and other files can rely on it
// loading before they read `window.EmployeeSatisfactionSurveyDashboard`.
