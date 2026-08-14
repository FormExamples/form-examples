// Plain-JavaScript / JSDoc type definitions for the Perioperative Optimization
// dashboard.
//
// This file exports no runtime values; it exists so other modules can reference
// the JSDoc type aliases and so engineers can read the canonical shape of the
// dashboard data in one place.

/**
 * Surgical readiness band emitted by the engine.
 * @typedef {'ready' | 'optimization-in-progress' | 'optimization-required' | 'defer-surgery'} Readiness
 */

/**
 * Per-domain optimization status after time-to-surgery gating.
 * @typedef {'optimized' | 'in-progress' | 'action-required' | 'insufficient-time' | 'not-applicable'} DomainStatus
 */

/**
 * The explicit human decision recorded at sign-off.
 * @typedef {'proceed' | 'proceed-with-prehabilitation' | 'defer-and-optimize' | 'accept-unoptimized-risk' | 'mdt-review' | 'cancel'} GateDecision
 */

/**
 * One assessment row displayed in the dashboard.
 *
 * `weeksToSurgery` and `domainsShortOnTime` are the columns that make this
 * dashboard useful to a waiting-list coordinator: together they say which lists
 * are about to proceed without the optimization they were promised.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id                  - UUID / case identifier
 * @property {string} assessmentDate      - ISO date "YYYY-MM-DD"
 * @property {string} surgeryDate         - ISO date "YYYY-MM-DD", or '' when unlisted
 * @property {number|null} weeksToSurgery - whole weeks, or null when no surgery date
 * @property {string} patient             - patient display name
 * @property {string} nhs                 - NHS number, formatted "NNN NNN NNNN"
 * @property {string} procedure           - planned procedure
 * @property {string} severity            - surgical severity band
 * @property {Readiness} readiness        - final surgical readiness band
 * @property {string[]} domainsShortOnTime - domains graded insufficient-time
 * @property {number} actionRequired      - count of domains graded action-required
 * @property {GateDecision|''} gateDecision - the recorded gate decision
 * @property {string} surgeon             - consultant surgeon
 * @property {number} flagCount           - number of safety flags raised
 */

/**
 * Response from `GET /api/perioperative_optimizations`.
 *
 * The Loco back-end returns a bare JSON array; the dashboard accepts either a
 * bare array or an `{ items, total }` envelope so a future paginated response is
 * forwards-compatible.
 *
 * @typedef {AssessmentRow[] | { items: AssessmentRow[], total?: number }} DashboardResponse
 */

export {};
