// Plain-JavaScript / JSDoc type definitions for the neurodiversity adjustment
// response dashboard.
//
// This file deliberately exports nothing executable beyond label helpers; it
// exists so other modules can reference the JSDoc type aliases and so engineers
// can read the canonical shape of the dashboard data in one place. It also
// publishes the engine label helpers used by the dashboard renderer.

/**
 * Axis A outcome classification.
 * @typedef {'fully-agreed' | 'partially-agreed' | 'alternative-offered' | 'declined' | 'deferred'} OutcomeClassification
 */

/**
 * Axis B legal / discrimination-risk band.
 * @typedef {'ok' | 'caution' | 'high-risk'} LegalRiskBand
 */

/**
 * Axis D follow-up / review urgency (discrimination-risk auto-escalation).
 * @typedef {'none' | 'review-scheduled' | 'urgent-review' | 'escalation-needed'} FollowUpUrgency
 */

/**
 * Response lifecycle status.
 * @typedef {'draft' | 'agreed' | 'partially-agreed' | 'trial' | 'declined' | 'deferred' | 'cancelled'} ResponseStatus
 */

/**
 * Response row displayed in the dashboard.
 *
 * @typedef {Object} ResponseRow
 * @property {string} id                             - Case identifier of the response
 * @property {string} workerName                     - Worker display name
 * @property {string} department                     - Worker department
 * @property {ResponseStatus} responseStatus         - Response lifecycle status
 * @property {string} respondedDate                  - ISO date "YYYY-MM-DD" of the reply
 * @property {OutcomeClassification} outcomeClassification - Axis A outcome
 * @property {LegalRiskBand} legalRiskBand           - Axis B legal / discrimination risk
 * @property {FollowUpUrgency} followUpUrgency       - Axis D follow-up urgency
 * @property {number} completenessPercent            - Axis C completeness 0..100
 * @property {number} flagCount                      - Number of compliance / risk flags raised
 */

/**
 * Response from `GET /api/neurodiversity_adjustment_responses`.
 *
 * The Loco backend returns a bare JSON array of `ResponseRow` objects; the
 * dashboard accepts either a bare array or an `{ items, total }` envelope so
 * future paginated responses are forwards-compatible.
 *
 * @typedef {ResponseRow[] | { items: ResponseRow[], total?: number }} DashboardResponsesResponse
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules) so the page can be opened directly via `file://`.
// The IIFE attaches its public symbols to a single global namespace,
// `window.NeurodiversityAdjustmentResponseDashboard`.

/** Axis A outcome-classification display label. */
function outcomeClassificationLabel(value) {
  switch (value) {
    case 'fully-agreed': return 'Fully agreed';
    case 'partially-agreed': return 'Partially agreed';
    case 'alternative-offered': return 'Alternative offered';
    case 'declined': return 'Declined';
    case 'deferred': return 'Deferred';
    default: return 'Not graded';
  }
}

/** Axis B legal / discrimination-risk display label. */
function legalRiskBandLabel(value) {
  switch (value) {
    case 'ok': return 'OK';
    case 'caution': return 'Caution';
    case 'high-risk': return 'High risk';
    default: return 'Not graded';
  }
}

/** Axis D follow-up / review-urgency display label. */
function followUpUrgencyLabel(value) {
  switch (value) {
    case 'none': return 'None';
    case 'review-scheduled': return 'Review scheduled';
    case 'urgent-review': return 'Urgent review';
    case 'escalation-needed': return 'Escalation needed';
    default: return 'Not graded';
  }
}

/** Human-readable response-status label. */
function responseStatusLabel(value) {
  switch (value) {
    case 'draft': return 'Draft';
    case 'agreed': return 'Agreed';
    case 'partially-agreed': return 'Partially agreed';
    case 'trial': return 'Trial';
    case 'declined': return 'Declined';
    case 'deferred': return 'Deferred';
    case 'cancelled': return 'Cancelled';
    default: return 'Unspecified';
  }
}

export { outcomeClassificationLabel, legalRiskBandLabel, followUpUrgencyLabel, responseStatusLabel };
