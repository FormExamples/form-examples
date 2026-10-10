// JSDoc type definitions for the DTAC assessor dashboard data model.
// Exports nothing executable; other modules reference these via `@typedef` imports.

/**
 * Overall DTAC outcome emitted by the grading engine (js/grader.js).
 *
 * @typedef {'meets' | 'conditional' | 'does-not-meet' | 'incomplete'} Outcome
 */

/**
 * Assessment row displayed in the assessor dashboard.
 *
 * @typedef {Object} AssessmentRow
 * @property {string} id              - Case identifier of the assessment
 * @property {string} date            - ISO date "YYYY-MM-DD" of the assessment
 * @property {string} assessment      - Short assessment label
 * @property {string} supplier        - Supplier name
 * @property {string} product         - Product name
 * @property {Outcome} outcome        - Graded outcome
 * @property {number} mandatoryMet    - Applicable mandatory criteria met
 * @property {number} mandatoryTotal  - Applicable mandatory criteria
 * @property {number} advisoryMet     - Applicable advisory criteria met
 * @property {number} advisoryTotal   - Applicable advisory criteria
 * @property {string[]} flags         - Flag ids (for example F-MFA-001)
 * @property {string} assessor        - Assessor display name
 */

/**
 * Response from `GET /api/assessments`: a bare array or an `{ items, total }` envelope.
 *
 * @typedef {AssessmentRow[] | { items: AssessmentRow[], total?: number }} DashboardAssessmentsResponse
 */
