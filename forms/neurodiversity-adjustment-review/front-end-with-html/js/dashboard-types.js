// Plain-JavaScript / JSDoc type definitions for the neurodiversity adjustment
// review dashboard.
//
// This file deliberately exports nothing executable beyond label helpers; it
// exists so other modules can reference the JSDoc type aliases and so engineers
// can read the canonical shape of the dashboard data in one place. It also
// publishes the engine label helpers used by the dashboard renderer.

/**
 * Axis A effectiveness band.
 * @typedef {'effective' | 'partially-effective' | 'ineffective' | 'not-yet-assessed'} EffectivenessBand
 */

/**
 * Axis B wellbeing-risk band.
 * @typedef {'ok' | 'caution' | 'high-risk'} WellbeingRiskBand
 */

/**
 * Axis D next-step urgency (wellbeing-risk auto-escalation).
 * @typedef {'none' | 'review-scheduled' | 'adjust-now' | 'escalate'} NextStepUrgency
 */

/**
 * Review lifecycle status.
 * @typedef {'draft' | 'completed' | 'changes-agreed' | 'escalated' | 'cancelled'} ReviewStatus
 */

/**
 * Review row displayed in the dashboard.
 *
 * @typedef {Object} ReviewRow
 * @property {string} id                             - Case identifier of the review
 * @property {string} workerName                     - Worker display name
 * @property {string} department                     - Worker department
 * @property {ReviewStatus} reviewStatus             - Review lifecycle status
 * @property {string} reviewDate                     - ISO date "YYYY-MM-DD" of the review
 * @property {EffectivenessBand} effectivenessBand   - Axis A effectiveness
 * @property {WellbeingRiskBand} wellbeingRiskBand   - Axis B wellbeing risk
 * @property {NextStepUrgency} nextStepUrgency       - Axis D next-step urgency
 * @property {number} completenessPercent            - Axis C completeness 0..100
 * @property {number} flagCount                      - Number of review flags raised
 */

/**
 * Response from `GET /api/neurodiversity_adjustment_reviews`.
 *
 * The Loco backend returns a bare JSON array of `ReviewRow` objects; the
 * dashboard accepts either a bare array or an `{ items, total }` envelope so
 * future paginated responses are forwards-compatible.
 *
 * @typedef {ReviewRow[] | { items: ReviewRow[], total?: number }} DashboardReviewsResponse
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules) so the page can be opened directly via `file://`.
// The IIFE attaches its public symbols to a single global namespace,
// `window.NeurodiversityAdjustmentReviewDashboard`.
(function () {
'use strict';
window.NeurodiversityAdjustmentReviewDashboard =
  window.NeurodiversityAdjustmentReviewDashboard || {};

/** Axis A effectiveness-band display label. */
function effectivenessBandLabel(value) {
  switch (value) {
    case 'effective': return 'Effective';
    case 'partially-effective': return 'Partially effective';
    case 'ineffective': return 'Ineffective';
    case 'not-yet-assessed': return 'Not yet assessed';
    default: return 'Not graded';
  }
}

/** Axis B wellbeing-risk display label. */
function wellbeingRiskBandLabel(value) {
  switch (value) {
    case 'ok': return 'OK';
    case 'caution': return 'Caution';
    case 'high-risk': return 'High risk';
    default: return 'Not graded';
  }
}

/** Axis D next-step-urgency display label. */
function nextStepUrgencyLabel(value) {
  switch (value) {
    case 'none': return 'None';
    case 'review-scheduled': return 'Review scheduled';
    case 'adjust-now': return 'Adjust now';
    case 'escalate': return 'Escalate';
    default: return 'Not graded';
  }
}

/** Human-readable review-status label. */
function reviewStatusLabel(value) {
  switch (value) {
    case 'draft': return 'Draft';
    case 'completed': return 'Completed';
    case 'changes-agreed': return 'Changes agreed';
    case 'escalated': return 'Escalated';
    case 'cancelled': return 'Cancelled';
    default: return 'Unspecified';
  }
}

Object.assign(window.NeurodiversityAdjustmentReviewDashboard, {
  effectivenessBandLabel,
  wellbeingRiskBandLabel,
  nextStepUrgencyLabel,
  reviewStatusLabel
});
})();
