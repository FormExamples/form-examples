// Flagged-issue detection (safety-escalation flags). Computed independently of
// the aggregate escalation band (which the grader produces), this module raises
// clinician-facing safety flags per spec §5. Flag / category IDs are shared with
// the SvelteKit front-end and the Loco back-end, mirroring the
// `paediatric_early_warning_score_grade_flag` SQL table
// (flag_id, category, priority, description, suggested_action):
//
//   - urgent-review (high)         — aggregateScore >= 6 (high escalation)
//   - single-parameter-3 (high)    — maxParameterScore == 3
//   - urgent-review (high)         — aggregateScore 4-5 (medium escalation)
//   - parent-nurse-concern (high)  — parentConcern == 'yes'
//   - parent-nurse-concern (high)  — nurseConcern == 'yes'
//   - deteriorating-trend (medium) — aggregateScore 2-3 (low escalation)
//   - incomplete (low)             — any parameter or the age band not recorded

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').Subscores} Subscores
 * @typedef {import('./types.js').Flag} Flag
 */

// Wrapped in an IIFE; published via window.PaediatricEarlyWarningScore.
(function () {
'use strict';
window.PaediatricEarlyWarningScore = window.PaediatricEarlyWarningScore || {};

/**
 * @param {AssessmentData} data
 * @param {{ subscores: Subscores, aggregateScore: number, maxParameterScore: number }} grade
 * @returns {Flag[]}
 */
function detectFlaggedIssues(data, grade) {
  /** @type {Flag[]} */
  const flags = [];
  const { subscores, aggregateScore, maxParameterScore } = grade;

  // ─── High escalation (HIGH) — aggregate >= 6 ────────────────
  if (aggregateScore >= 6) {
    flags.push({
      id: 'F-URGENT-REVIEW-HIGH-001',
      category: 'urgent-review',
      priority: 'high',
      description: `Aggregate PEWS total ${aggregateScore} (≥ 6) — high escalation.`,
      suggestedAction:
        'Immediate review by a senior doctor / registrar; consider critical-care outreach; continuous monitoring.'
    });
  } else if (aggregateScore >= 4) {
    // ─── Medium escalation (HIGH) — aggregate 4-5 ─────────────
    flags.push({
      id: 'F-URGENT-REVIEW-MEDIUM-001',
      category: 'urgent-review',
      priority: 'high',
      description: `Aggregate PEWS total ${aggregateScore} (4–5) — medium escalation.`,
      suggestedAction:
        'Urgent review by the nurse in charge and a doctor within 30 minutes; continuous monitoring; consider outreach.'
    });
  }

  // ─── Single parameter critical (HIGH) — any subscore == 3 ───
  if (maxParameterScore === 3) {
    const which = [];
    if (subscores.respiratoryRate === 3) which.push('respiratory rate');
    if (subscores.respiratoryEffort === 3) which.push('respiratory effort');
    if (subscores.oxygenSaturation === 3) which.push('oxygen saturation');
    if (subscores.supplementalOxygen === 3) which.push('supplemental oxygen');
    if (subscores.heartRate === 3) which.push('heart rate');
    if (subscores.capillaryRefill === 3) which.push('capillary refill');
    if (subscores.consciousness === 3) which.push('consciousness');
    flags.push({
      id: 'F-SINGLE-PARAMETER-3-001',
      category: 'single-parameter-3',
      priority: 'high',
      description: `Single parameter grossly abnormal: ${which.join(', ')} scored 3 — a derangement the aggregate can mask.`,
      suggestedAction:
        'Urgent review regardless of the aggregate total; escalate to at least medium and treat the deranged parameter.'
    });
  }

  // ─── Parent / carer concern (HIGH) ──────────────────────────
  if (data.concern.parentConcern === 'yes') {
    flags.push({
      id: 'F-PARENT-CONCERN-001',
      category: 'parent-nurse-concern',
      priority: 'high',
      description: 'Documented parent / carer concern — a recognised predictor of deterioration.',
      suggestedAction:
        'Escalate and act on the documented concern; record it and inform the nurse in charge.'
    });
  }

  // ─── Nurse / staff concern (HIGH) ───────────────────────────
  if (data.concern.nurseConcern === 'yes') {
    flags.push({
      id: 'F-NURSE-CONCERN-001',
      category: 'parent-nurse-concern',
      priority: 'high',
      description: 'Documented nurse / staff concern — an independent escalation trigger.',
      suggestedAction:
        'Escalate on the documented concern regardless of the aggregate total.'
    });
  }

  // ─── Deteriorating trend (MEDIUM) — aggregate 2-3 ───────────
  if (aggregateScore >= 2 && aggregateScore <= 3) {
    flags.push({
      id: 'F-DETERIORATING-TREND-001',
      category: 'deteriorating-trend',
      priority: 'medium',
      description: `Aggregate PEWS total ${aggregateScore} (2–3) — low escalation; watch for a rising trend.`,
      suggestedAction:
        'Increase observation frequency (e.g. hourly), inform the nurse in charge, and compare against the previous score.'
    });
  }

  // ─── Incomplete assessment (LOW) ────────────────────────────
  const missing = [];
  if (data.identification.ageBand === '') missing.push('age band');
  if (data.respiratory.respiratoryRate === null) missing.push('respiratory rate');
  if (data.respiratory.respiratoryEffort === '') missing.push('respiratory effort');
  if (data.respiratory.oxygenSaturation === null) missing.push('oxygen saturation');
  if (data.respiratory.supplementalOxygen === '') missing.push('supplemental oxygen');
  if (data.cardiovascular.heartRate === null) missing.push('heart rate');
  if (data.cardiovascular.capillaryRefill === '') missing.push('capillary refill');
  if (data.behaviour.consciousness === '') missing.push('consciousness (ACVPU)');
  if (missing.length > 0) {
    flags.push({
      id: 'F-INCOMPLETE-001',
      category: 'incomplete',
      priority: 'low',
      description: `Missing input(s): ${missing.join(', ')} — the score may understate risk.`,
      suggestedAction:
        'Record the missing observation(s) and the age band, then re-score.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

window.PaediatricEarlyWarningScore.detectFlaggedIssues = detectFlaggedIssues;
})();
