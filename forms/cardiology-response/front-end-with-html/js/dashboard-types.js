// Plain-JavaScript / JSDoc type definitions for the cardiology response
// interpretation dashboard.
//
// This file deliberately exports nothing executable; it exists so other
// modules can reference the JSDoc type aliases and so engineers can read the
// canonical shape of the dashboard data in one place. It also publishes the
// engine label helpers used by the dashboard renderer.

/**
 * Axis A overall response classification.
 * @typedef {'no-abnormality' | 'cardiac-condition' | 'critical' | 'inconclusive'} ResponseClassification
 */

/**
 * Axis B condition severity.
 * @typedef {'none' | 'minor' | 'moderate' | 'major'} Severity
 */

/**
 * Axis D follow-up urgency (critical-result auto-escalation).
 * @typedef {'routine' | 'recommended' | 'urgent' | 'critical-alert'} FollowUpUrgency
 */

/**
 * Response lifecycle status.
 * @typedef {'preliminary' | 'final' | 'amended' | 'cancelled'} ResponseStatus
 */

/**
 * Cardiology consultation type.
 * @typedef {'clinic-review' | 'advice-and-guidance' | 'telephone' | 'inpatient-review' | 'virtual'} ConsultationType
 */

/**
 * Response row displayed in the interpretation dashboard.
 *
 * @typedef {Object} ResponseRow
 * @property {string} id                          - Case identifier of the response
 * @property {string} patientName                 - Patient display name
 * @property {ConsultationType} consultationType  - Cardiology consultation type
 * @property {ResponseStatus} responseStatus      - Response lifecycle status
 * @property {string} respondedDate               - ISO date "YYYY-MM-DD" of the reply
 * @property {ResponseClassification} responseClassification - Axis A classification
 * @property {Severity} severity                  - Axis B condition severity
 * @property {FollowUpUrgency} followUpUrgency    - Axis D follow-up urgency
 * @property {number} completenessPercent         - Axis C completeness 0..100
 * @property {number} flagCount                   - Number of safety flags raised
 */

/**
 * Response from `GET /api/cardiology_responses`.
 *
 * The Loco backend returns a bare JSON array of `ResponseRow` objects; the
 * dashboard accepts either a bare array or an `{ items, total }` envelope so
 * future paginated responses are forwards-compatible.
 *
 * @typedef {ResponseRow[] | { items: ResponseRow[], total?: number }} DashboardResponsesResponse
 */

/** Axis A response-classification display label. */
function responseClassificationLabel(value) {
  switch (value) {
    case 'no-abnormality': return 'No abnormality';
    case 'cardiac-condition': return 'Cardiac condition';
    case 'critical': return 'Critical';
    case 'inconclusive': return 'Inconclusive';
    default: return 'Not graded';
  }
}

/** Axis B severity display label. */
function severityLabel(value) {
  switch (value) {
    case 'none': return 'None';
    case 'minor': return 'Minor';
    case 'moderate': return 'Moderate';
    case 'major': return 'Major';
    default: return 'Not graded';
  }
}

/** Axis D follow-up-urgency display label. */
function followUpUrgencyLabel(value) {
  switch (value) {
    case 'routine': return 'Routine';
    case 'recommended': return 'Recommended';
    case 'urgent': return 'Urgent';
    case 'critical-alert': return 'Critical alert';
    default: return 'Not graded';
  }
}

/** Human-readable consultation-type label. */
function consultationTypeLabel(value) {
  switch (value) {
    case 'clinic-review': return 'Clinic review';
    case 'advice-and-guidance': return 'Advice and guidance';
    case 'telephone': return 'Telephone';
    case 'inpatient-review': return 'Inpatient review';
    case 'virtual': return 'Virtual';
    default: return 'Unspecified';
  }
}

/** Human-readable response-status label. */
function responseStatusLabel(value) {
  switch (value) {
    case 'preliminary': return 'Preliminary';
    case 'final': return 'Final';
    case 'amended': return 'Amended';
    case 'cancelled': return 'Cancelled';
    default: return 'Unspecified';
  }
}

export { responseClassificationLabel, severityLabel, followUpUrgencyLabel, consultationTypeLabel, responseStatusLabel };
