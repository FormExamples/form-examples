// Plain-JavaScript / JSDoc type definitions for the Workplace Climate
// Assessment leadership dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases via `@typedef` imports and
// so engineers can read the canonical shape of the dashboard data in one
// place.
//
// Every row in this dashboard is anonymous and aggregated at the
// department or team level. There are NO individual employee identifiers
// in any of the typedefs below — that is a hard constraint of the
// workplace-climate methodology. Even free-text comments are aggregated
// (or omitted entirely) and never displayed in this dashboard.

/**
 * Climate category emitted by the scoring engine, banded against the
 * normalised 0-100 Workplace Climate Index composite score.
 *
 * - Thriving   (85-100): strong, inclusive, psychologically safe climate
 * - Healthy    (70-84):  generally positive climate with minor growth areas
 * - Developing (50-69):  mixed climate with several improvement areas
 * - Strained   (25-49):  concerning climate requiring targeted intervention
 * - Critical   (0-24):   severely unhealthy climate requiring urgent leadership action
 *
 * @typedef {'Thriving' | 'Healthy' | 'Developing' | 'Strained' | 'Critical'} ClimateCategory
 */

/**
 * One of the nine climate-domain names. Used both as filter values and to
 * label the worst-domain badge. Order tracks the canonical step ordering
 * in the form spec (Demographics is excluded — it is not a climate domain).
 *
 * @typedef {'Leadership' | 'Psychological Safety' | 'Inclusion' | 'Communication' | 'Collaboration' | 'Recognition' | 'Wellbeing' | 'Career Development' | 'Overall Climate'} ClimateDomain
 */

/**
 * Tenure band for a team or department aggregate. "Mixed" is used when the
 * team contains employees spanning multiple bands.
 *
 * @typedef {'<1 year' | '1-3 years' | '3-5 years' | '5-10 years' | '10+ years' | 'Mixed'} TenureBand
 */

/**
 * Aggregated domain means for one team or department. Each value is the
 * arithmetic mean of the underlying 1-5 Likert items in that climate
 * domain.
 *
 * Range: 1.0 (worst) to 5.0 (best). Higher always means better — items
 * worded negatively are reverse-scored by the engine before aggregation.
 *
 * @typedef {Object} DomainMeans
 * @property {number} leadership          - Leadership & Management
 * @property {number} psychologicalSafety - Psychological Safety
 * @property {number} inclusion           - Inclusion & Belonging
 * @property {number} communication       - Communication
 * @property {number} collaboration       - Collaboration & Teamwork
 * @property {number} recognition         - Recognition & Reward
 * @property {number} wellbeing           - Wellbeing
 * @property {number} careerDevelopment   - Career Development
 * @property {number} overallClimate      - Overall Climate & Recommendations
 */

/**
 * One row in the aggregate dashboard table. Represents a department or
 * team — never an individual employee. The dashboard intentionally
 * exposes no personal identifiers in any column, sort key, or filter
 * input — only the department name is shown, by design.
 *
 * Mirrors `TeamRow` in
 * `forms/workplace-climate-assessment/front-end-dashboard-with-svelte/src/lib/types.ts`.
 *
 * @typedef {Object} TeamRow
 * @property {string} id                    - UUID of the aggregate record (opaque, not an employee id)
 * @property {string} department            - Department or team name (the only displayed identifier)
 * @property {number} responsesCount        - Number of completed responses contributing to this aggregate (>= agreed minimum)
 * @property {TenureBand} tenureBand        - Predominant tenure band, or "Mixed"
 * @property {number} composite             - Normalised Workplace Climate Index (0-100)
 * @property {ClimateCategory} category     - Banded category derived from `composite`
 * @property {DomainMeans} domainMeans      - Mean 1-5 score for each of the nine climate domains
 * @property {ClimateDomain} worstDomain    - Domain with the lowest mean (i.e. the highest priority for action)
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
// namespace, `window.WorkplaceClimateAssessmentDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this
// file is unambiguously side-effecting and other files can rely on it
// loading before they read `window.WorkplaceClimateAssessmentDashboard`.
