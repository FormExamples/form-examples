import { anyAgreed, daysBetween } from './types.js';

// Compliance-and-risk flag detection for the Neurodiversity Adjustment Response
// engine.
//
// Pure function returning flags using the grade_flag categories from SQL
// migration 07: discrimination-risk, grievance-escalation, undue-delay,
// no-review-scheduled, no-trial-defined, missing-rationale, incomplete-response,
// other. A high legal / discrimination risk auto-raises the discrimination-risk
// flag (F-DISCRIMINATION-RISK-001). Flags are returned sorted high → medium →
// low.
//
// Each flag is { flagId, category, priority, description, suggestedAction }.
// Flag IDs are stable and identical across every front-end and the back-end.
// Wrapped in an IIFE; published via `window.NeurodiversityAdjustmentResponse`.

/**
 * Detect compliance-and-risk flags for a neurodiversity adjustment response.
 *
 * @param {object} r - the flat response engine model
 * @param {object} axes - computed axis outputs { legalRiskBand, completenessPercent }
 * @returns {object[]} flags, sorted high → medium → low priority
 */
function detectFlags(r, axes) {
  const flags = [];
  const legalRiskBand = axes && axes.legalRiskBand;
  const completenessPercent = axes && axes.completenessPercent;

  // ─── discrimination-risk (auto-raised with a high legal risk) ───
  if (legalRiskBand === 'high-risk') {
    flags.push({
      flagId: 'F-DISCRIMINATION-RISK-001',
      category: 'discrimination-risk',
      priority: 'high',
      description: 'Adjustments declined for a worker likely covered by the Equality Act 2010 without adequate justification or alternatives.',
      suggestedAction: 'Reconsider the decision, or record a reasonableness justification and offer alternatives before finalising.'
    });
  }

  // ─── grievance-escalation ───
  if (r.escalated === true) {
    flags.push({
      flagId: 'F-GRIEVANCE-001',
      category: 'grievance-escalation',
      priority: 'high',
      description: 'Matter escalated (dispute / grievance / appeal).',
      suggestedAction: 'Engage HR and follow the grievance / appeal procedure.'
    });
  }

  // ─── undue-delay ───
  const delayDays = daysBetween(r.assessedDate, r.respondedDate);
  if (
    String(r.assessedDate || '').trim() !== '' &&
    String(r.respondedDate || '').trim() !== '' &&
    delayDays !== null &&
    delayDays > 20
  ) {
    flags.push({
      flagId: 'F-UNDUE-DELAY-001',
      category: 'undue-delay',
      priority: 'medium',
      description: 'More than 20 working days between assessment and response.',
      suggestedAction: 'The Equality Act duty is to act without unreasonable delay; expedite.'
    });
  }

  // ─── no-review-scheduled ───
  if (anyAgreed(r) && r.reviewScheduled === false) {
    flags.push({
      flagId: 'F-NO-REVIEW-001',
      category: 'no-review-scheduled',
      priority: 'medium',
      description: 'Adjustments agreed but no review date set.',
      suggestedAction: 'Schedule a review to check the adjustments are working.'
    });
  }

  // ─── no-trial-defined ───
  if (r.trialPeriod === true && (r.trialPeriodWeeks === null || r.trialPeriodWeeks === 0)) {
    flags.push({
      flagId: 'F-NO-TRIAL-001',
      category: 'no-trial-defined',
      priority: 'low',
      description: 'Trial adjustments without a defined trial period.',
      suggestedAction: 'Set a trial length and a review date.'
    });
  }

  // ─── missing-rationale ───
  if (
    String(r.overallDecision || '').trim() !== '' &&
    r.overallDecision !== 'agreed' &&
    String(r.decisionRationale || '').trim() === ''
  ) {
    flags.push({
      flagId: 'F-MISSING-RATIONALE-001',
      category: 'missing-rationale',
      priority: r.overallDecision === 'declined' ? 'high' : 'medium',
      description: 'A decision was recorded without a rationale.',
      suggestedAction: 'Record why the decision was reached, especially where anything was declined.'
    });
  }

  // ─── incomplete-response ───
  if (typeof completenessPercent === 'number' && completenessPercent < 60) {
    flags.push({
      flagId: 'F-INCOMPLETE-001',
      category: 'incomplete-response',
      priority: 'medium',
      description: 'Mandatory response sections are missing.',
      suggestedAction: 'Complete the decision, rationale, review arrangements, and point of contact.'
    });
  }

  // Sort: high > medium > low
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

export { detectFlags };
