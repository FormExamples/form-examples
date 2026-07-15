// Plain-JavaScript / JSDoc type definitions for the neurodiversity
// reasonable-adjustments request dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases and so engineers can read the
// canonical shape of the dashboard data in one place.

/**
 * Equality Act 2010 eligibility band emitted by the engine's Axis A.
 * @typedef {'likely-covered' | 'possibly-covered' | 'unclear'} EligibilityBand
 */

/**
 * Impact / wellbeing band emitted by Axis B.
 * @typedef {'ok' | 'caution' | 'high-risk'} ImpactBand
 */

/**
 * Handling-priority tier emitted by Axis D (absence-risk / severe-impact escalation).
 * @typedef {'routine' | 'soon' | 'urgent'} PriorityTier
 */

/**
 * Overall handling recommendation.
 * @typedef {'progress-to-meeting' | 'seek-occupational-health' | 'request-more-detail' | 'signpost-access-to-work'} Recommendation
 */

/**
 * Request row displayed in the adjustments dashboard.
 *
 * @typedef {Object} RequestRow
 * @property {string} id              - UUID / case identifier of the request
 * @property {string} requestDate     - ISO date "YYYY-MM-DD" of the request
 * @property {string} worker          - Worker display name
 * @property {string} jobTitle        - Worker job title
 * @property {string} department      - Worker department / team
 * @property {EligibilityBand} eligibilityBand - Axis A band
 * @property {ImpactBand} impactBand  - Axis B impact / wellbeing band
 * @property {PriorityTier} priorityTier - Axis D priority tier
 * @property {number} completenessPercent - Axis C completeness 0..100
 * @property {Recommendation} recommendation - Overall handling recommendation
 * @property {string} manager         - Manager / HR contact display name
 * @property {string[]} flags         - Compliance / wellbeing flag categories (kebab-case)
 */

/**
 * Response from `GET /api/neurodiversity_adjustment_requests`.
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
// `window.NeurodiversityAdjustmentRequestDashboard`.

// No runtime exports; types are JSDoc-only. Touch the namespace so this file
// is unambiguously side-effecting and other files can rely on it loading
// before they read `window.NeurodiversityAdjustmentRequestDashboard`.
