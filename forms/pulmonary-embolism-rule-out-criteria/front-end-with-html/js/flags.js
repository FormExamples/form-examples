// Flagged-issue detection (red flags). Computed INDEPENDENTLY of the
// perc-negative / perc-positive classification (which the grader produces), this
// module raises clinician-facing safety flags per spec §5:
//
//   - Requires PE workup (high)   — classification == 'perc-positive'
//   - Not applicable (high)       — pretestProbability != 'low'
//   - Hypoxia (high)              — oxygenSaturation < 95
//   - Tachycardia (medium)        — heartRate >= 100
//   - Prior VTE (medium)          — priorVenousThromboembolism == 'yes'
//   - Incomplete assessment (low) — any criterion input or the pre-test
//                                   probability missing
//
// Rows here mirror the `pulmonary_embolism_rule_out_criteria_grade_flag` SQL
// table (flag_id, category, priority, description, suggested_action).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FlaggedIssue} FlaggedIssue
 */

// Wrapped in an IIFE; published via window.PulmonaryEmbolismRuleOutCriteria.
(function () {
'use strict';
window.PulmonaryEmbolismRuleOutCriteria = window.PulmonaryEmbolismRuleOutCriteria || {};

/**
 * True when any criterion input or the pre-test probability is unanswered.
 * @param {AssessmentData} data
 * @returns {boolean}
 */
function hasMissingInputs(data) {
  return (
    data.identification.age === null ||
    data.vitals.heartRate === null ||
    data.vitals.oxygenSaturation === null ||
    data.pretest.pretestProbability === '' ||
    data.criteria.unilateralLegSwelling === '' ||
    data.criteria.haemoptysis === '' ||
    data.criteria.recentSurgeryOrTrauma === '' ||
    data.criteria.priorVenousThromboembolism === '' ||
    data.criteria.oestrogenUse === ''
  );
}

/**
 * @param {AssessmentData} data
 * @param {{ classification: string }} grade  - result of calculatePercGrade
 * @returns {FlaggedIssue[]}
 */
function detectFlaggedIssues(data, grade) {
  /** @type {FlaggedIssue[]} */
  const flags = [];

  const classification = grade.classification;
  const pretest = data.pretest.pretestProbability;
  const spo2 = data.vitals.oxygenSaturation;
  const hr = data.vitals.heartRate;

  // ─── Requires PE workup (HIGH) ──────────────────────────────────
  if (classification === 'perc-positive') {
    flags.push({
      id: 'F-REQUIRES-WORKUP-001',
      category: 'requires-workup',
      priority: 'high',
      description:
        'PERC did not exclude pulmonary embolism (PERC-positive). PERC-positive is not a diagnosis of PE; it means PE cannot be ruled out on clinical grounds alone.',
      suggestedAction:
        'Proceed to the next step in the diagnostic pathway: D-dimer, and imaging (CT pulmonary angiography or V/Q) as indicated by local policy and further risk stratification.'
    });
  }

  // ─── Not applicable — pre-test probability not low (HIGH) ────────
  if (pretest !== 'low') {
    flags.push({
      id: 'F-NOT-APPLICABLE-001',
      category: 'not-applicable',
      priority: 'high',
      description:
        pretest === ''
          ? 'Pre-test probability not recorded. PERC applies only when the clinician has judged the gestalt pre-test probability of PE to be low.'
          : 'Pre-test probability is not low. PERC must not be used to rule out PE at moderate or high suspicion — the criteria do not exclude PE in this setting.',
      suggestedAction:
        'Do not rely on PERC. Proceed with D-dimer and/or imaging per local policy regardless of the eight criteria.'
    });
  }

  // ─── Hypoxia (HIGH) ─────────────────────────────────────────────
  if (spo2 !== null && spo2 < 95) {
    flags.push({
      id: 'F-HYPOXIA-001',
      category: 'hypoxia',
      priority: 'high',
      description: `Oxygen saturation ${spo2}% is below the reassuring threshold of 95%.`,
      suggestedAction:
        'Assess for a cause of hypoxia, provide oxygen as required, and escalate; hypoxia fails criterion 3 and warrants further evaluation.'
    });
  }

  // ─── Tachycardia (MEDIUM) ───────────────────────────────────────
  if (hr !== null && hr >= 100) {
    flags.push({
      id: 'F-TACHYCARDIA-001',
      category: 'tachycardia',
      priority: 'medium',
      description: `Heart rate ${hr} beats/min is at or above the threshold of 100.`,
      suggestedAction:
        'Review the cause of tachycardia; it fails criterion 2 and is a recognised feature of pulmonary embolism.'
    });
  }

  // ─── Prior venous thromboembolism (MEDIUM) ──────────────────────
  if (data.criteria.priorVenousThromboembolism === 'yes') {
    flags.push({
      id: 'F-PRIOR-VTE-001',
      category: 'prior-vte',
      priority: 'medium',
      description:
        'History of prior deep vein thrombosis or pulmonary embolism raises the baseline risk of PE.',
      suggestedAction:
        'Take the prior VTE history into account in further risk stratification; it fails criterion 7.'
    });
  }

  // ─── Incomplete assessment (LOW) ────────────────────────────────
  if (hasMissingInputs(data)) {
    flags.push({
      id: 'F-INCOMPLETE-001',
      category: 'incomplete',
      priority: 'low',
      description:
        'One or more criterion inputs or the pre-test probability are unanswered. Missing inputs are treated as failed, so the result defaults toward PERC-positive and may not reflect the true clinical picture.',
      suggestedAction:
        'Complete every criterion and the pre-test probability before relying on the classification.'
    });
  }

  // Sort: high > medium > low.
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  flags.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return flags;
}

Object.assign(window.PulmonaryEmbolismRuleOutCriteria, {
  hasMissingInputs,
  detectFlaggedIssues
});
})();
