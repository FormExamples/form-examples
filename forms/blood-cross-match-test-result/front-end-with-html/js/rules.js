// Four-axis grading rules for the blood cross-match test result.
//
// Faithful vanilla-JS port of the SvelteKit engine modules:
// - structured-findings predicates (src/lib/engine/utils.ts),
// - Axis A result classification (src/lib/engine/classification-rules.ts),
// - Axis B abnormality severity (src/lib/engine/severity-rules.ts),
// - Axis C report completeness (src/lib/engine/completeness-rules.ts),
// - Axis D follow-up urgency (src/lib/engine/follow-up-rules.ts).
//
// Rule IDs are stable and identical across every front-end and the back-end.

/**
 * @typedef {import('./types.js').BloodCrossMatchResult} BloodCrossMatchResult
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// ──────────────────────────────────────────────
// Structured-findings predicates
// ──────────────────────────────────────────────

/**
 * A critical result auto-escalates Axis D to critical-alert and raises the
 * critical-result-alert plus discrepancy-with-request flags. Mirrors the
 * back-end invariant: an incompatible crossmatch, clinically-significant
 * antibodies (a positive antibody screen), an ABO discrepancy (historical-group
 * non-concordance), or an unmet two-sample group-check rule.
 *
 * @param {BloodCrossMatchResult} r
 * @returns {boolean}
 */
function hasCriticalResult(r) {
  return (
    r.crossmatchResult === 'incompatible' ||
    r.antibodyScreenResult === 'positive' ||
    isAboDiscrepancy(r) ||
    isTwoSampleRuleUnmet(r)
  );
}

/**
 * Whether an ABO discrepancy (historical-group non-concordance) is recorded.
 * @param {BloodCrossMatchResult} r
 * @returns {boolean}
 */
function isAboDiscrepancy(r) {
  return r.aboGroup !== '' && !r.historicalGroupConcordant;
}

/**
 * Whether the two-sample (group-check) rule was not satisfied before issue.
 * @param {BloodCrossMatchResult} r
 * @returns {boolean}
 */
function isTwoSampleRuleUnmet(r) {
  // Only meaningful once grouping / crossmatch testing is under way.
  return !r.twoSampleRuleMet && (r.aboGroup !== '' || r.crossmatchResult !== '');
}

/**
 * Whether any abnormal structured finding is present.
 * @param {BloodCrossMatchResult} r
 * @returns {boolean}
 */
function hasAnyAbnormalFinding(r) {
  return (
    r.crossmatchResult === 'incompatible' ||
    r.antibodyScreenResult === 'positive' ||
    isAboDiscrepancy(r) ||
    isTwoSampleRuleUnmet(r) ||
    insufficientUnits(r) ||
    // gradeSeverity independently grades special component requirements on
    // a not-yet-compatible crossmatch as minor — Axis A must agree.
    (r.specialRequirements.trim() !== '' && r.crossmatchResult !== 'compatible')
  );
}

/**
 * Whether fewer compatible units are available than were crossmatched.
 * @param {BloodCrossMatchResult} r
 * @returns {boolean}
 */
function insufficientUnits(r) {
  return (
    r.unitsCrossmatched !== null &&
    r.unitsAvailable !== null &&
    r.unitsAvailable < r.unitsCrossmatched
  );
}

// ──────────────────────────────────────────────
// Axis A — result classification
// ──────────────────────────────────────────────

/**
 * Determines the overall compatibility conclusion:
 * - critical: an ABO discrepancy or an unmet two-sample group-check rule (a
 *   patient-identity / Wrong-Blood-in-Tube safety event).
 * - abnormal: an incompatible crossmatch or clinically-significant antibodies
 *   (a positive antibody screen) — abnormal but not necessarily an identity event.
 * - inconclusive: crossmatch not performed and grouping incomplete, with no
 *   confident impression recorded.
 * - normal: a compatible result on a complete, concordant work-up.
 *
 * Returns the classification plus the audit-trail rules that fired.
 *
 * @param {BloodCrossMatchResult} r
 * @returns {{ resultClassification: import('./types.js').ResultClassification, firedRules: FiredRule[] }}
 */
function classifyResult(r) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  if (isAboDiscrepancy(r) || isTwoSampleRuleUnmet(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-CRITICAL-01',
      axis: 'classification',
      category: 'identity-safety',
      description:
        'An ABO discrepancy (historical-group non-concordance) or an unmet two-sample group-check rule is present; classified as critical.'
    });
    return { resultClassification: 'critical', firedRules };
  }

  if (r.crossmatchResult === 'incompatible' || r.antibodyScreenResult === 'positive') {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-01',
      axis: 'classification',
      category: 'incompatible-or-antibodies',
      description:
        'An incompatible crossmatch or clinically-significant antibodies (positive antibody screen) is present; classified as abnormal.'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  if (
    r.crossmatchResult === 'not-performed' &&
    r.aboGroup === '' &&
    r.impression.trim() === ''
  ) {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-01',
      axis: 'classification',
      category: 'incomplete-workup',
      description:
        'Crossmatch not performed and grouping incomplete with no impression recorded; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (hasAnyAbnormalFinding(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-02',
      axis: 'classification',
      category: 'abnormal-finding',
      description:
        'An abnormal structured finding (e.g. insufficient compatible units) is present; classified as abnormal.'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  // Defensive: critical predicate covered above, kept for parity with the contract.
  if (hasCriticalResult(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-CRITICAL-02',
      axis: 'classification',
      category: 'critical-result',
      description: 'A critical result is present; classified as critical.'
    });
    return { resultClassification: 'critical', firedRules };
  }

  firedRules.push({
    ruleId: 'R-CLASS-NORMAL-01',
    axis: 'classification',
    category: 'compatible',
    description:
      'Compatible result on a complete, concordant work-up with no critical result; classified as normal.'
  });
  return { resultClassification: 'normal', firedRules };
}

// ──────────────────────────────────────────────
// Axis B — abnormality severity & structured-reporting category
// ──────────────────────────────────────────────

/**
 * Severity ladder (none → minor → moderate → major), grounded in BSH
 * pre-transfusion compatibility guidance and SHOT identity-safety priorities:
 * - major: an ABO discrepancy, an unmet two-sample rule, or an incompatible
 *   crossmatch (events that can cause an ABO-incompatible transfusion).
 * - moderate: clinically-significant antibodies (a positive antibody screen)
 *   requiring antigen-negative selection, or insufficient compatible units.
 * - minor: a minor administrative shortfall (e.g. a special requirement noted
 *   without a confirmed crossmatch).
 * - none: a compatible result with no abnormal finding.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * compatibility-status / antibody-significance reporting workflows.
 *
 * @param {BloodCrossMatchResult} r
 * @param {import('./types.js').ResultClassification} classification
 * @returns {{ abnormalitySeverity: import('./types.js').AbnormalitySeverity, reportingCategory: string, firedRules: FiredRule[] }}
 */
function gradeSeverity(r, classification) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  if (isAboDiscrepancy(r) || isTwoSampleRuleUnmet(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-01',
      axis: 'severity',
      category: 'identity-safety',
      description:
        'An ABO discrepancy or unmet two-sample rule is present; abnormality severity graded major.'
    });
    return { abnormalitySeverity: 'major', reportingCategory: 'identity-safety-event', firedRules };
  }

  if (r.crossmatchResult === 'incompatible') {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-02',
      axis: 'severity',
      category: 'incompatible-crossmatch',
      description: 'Crossmatch is incompatible; abnormality severity graded major.'
    });
    return { abnormalitySeverity: 'major', reportingCategory: 'incompatible', firedRules };
  }

  if (r.antibodyScreenResult === 'positive') {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-01',
      axis: 'severity',
      category: 'significant-antibodies',
      description:
        'Antibody screen positive (clinically-significant antibodies); antigen-negative selection required. Severity graded moderate.'
    });
    return {
      abnormalitySeverity: 'moderate',
      reportingCategory: 'clinically-significant-antibodies',
      firedRules
    };
  }

  if (insufficientUnits(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-02',
      axis: 'severity',
      category: 'insufficient-units',
      description:
        'Fewer compatible units are available than were crossmatched; severity graded moderate.'
    });
    return { abnormalitySeverity: 'moderate', reportingCategory: 'insufficient-units', firedRules };
  }

  if (r.specialRequirements.trim() !== '' && r.crossmatchResult !== 'compatible') {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-01',
      axis: 'severity',
      category: 'special-requirement',
      description:
        'A special component requirement is noted without a confirmed compatible crossmatch; severity graded minor.'
    });
    return { abnormalitySeverity: 'minor', reportingCategory: 'special-requirement', firedRules };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-SEV-NONE-02',
      axis: 'severity',
      category: 'inconclusive',
      description: 'Inconclusive work-up; abnormality severity not established.'
    });
    return { abnormalitySeverity: 'none', reportingCategory: 'indeterminate', firedRules };
  }

  firedRules.push({
    ruleId: 'R-SEV-NONE-01',
    axis: 'severity',
    category: 'compatible',
    description: 'No abnormal finding; abnormality severity graded none.'
  });
  return { abnormalitySeverity: 'none', reportingCategory: 'compatible', firedRules };
}

// ──────────────────────────────────────────────
// Axis C — report completeness
// ──────────────────────────────────────────────

/**
 * The five mandatory report sections per BSH pre-transfusion compatibility
 * reporting: clinical history, grouping, antibody screen, crossmatch, and
 * impression.
 *
 * @type {{ ruleId: string, category: string, label: string, present: (r: BloodCrossMatchResult) => boolean }[]}
 */
const completenessSections = [
  {
    ruleId: 'R-COMP-HISTORY-01',
    category: 'history',
    label: 'clinical history',
    present: (r) => r.clinicalHistory.trim() !== ''
  },
  {
    ruleId: 'R-COMP-GROUPING-01',
    category: 'grouping',
    label: 'ABO / RhD grouping',
    present: (r) => r.aboGroup !== '' && r.rhdGroup !== ''
  },
  {
    ruleId: 'R-COMP-ANTIBODY-01',
    category: 'antibody-screen',
    label: 'antibody screen',
    present: (r) => r.antibodyScreenResult !== ''
  },
  {
    ruleId: 'R-COMP-CROSSMATCH-01',
    category: 'crossmatch',
    label: 'crossmatch / compatibility outcome',
    present: (r) => r.crossmatchResult !== ''
  },
  {
    ruleId: 'R-COMP-IMPRESSION-01',
    category: 'impression',
    label: 'impression',
    present: (r) => r.impression.trim() !== ''
  }
];

/**
 * Returns the percentage (0-100, rounded) of mandatory report sections that
 * are present, plus an audit-trail rule for each missing section.
 *
 * @param {BloodCrossMatchResult} r
 * @returns {{ reportCompletenessPercent: number, firedRules: FiredRule[] }}
 */
function gradeCompleteness(r) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  let presentCount = 0;

  for (const section of completenessSections) {
    if (section.present(r)) {
      presentCount += 1;
    } else {
      firedRules.push({
        ruleId: section.ruleId,
        axis: 'completeness',
        category: section.category,
        description: 'Mandatory report section missing: ' + section.label + '.'
      });
    }
  }

  const reportCompletenessPercent =
    Math.round((presentCount / completenessSections.length) * 100);
  return { reportCompletenessPercent, firedRules };
}

// ──────────────────────────────────────────────
// Axis D — follow-up urgency
// ──────────────────────────────────────────────

/**
 * Follow-up urgency, plus the target timeframe and recommended action.
 *
 * Escalation ladder (routine → recommended → urgent → critical-alert). A
 * critical result (incompatible crossmatch, clinically-significant antibodies,
 * ABO discrepancy, or unmet two-sample rule) auto-escalates to critical-alert
 * regardless of the other axes (the safety invariant). The least-urgent band is
 * chosen only when no rule fires.
 *
 * @param {BloodCrossMatchResult} r
 * @param {import('./types.js').ResultClassification} classification
 * @param {import('./types.js').AbnormalitySeverity} severity
 * @returns {{ followUpUrgency: import('./types.js').FollowUpUrgency, targetTimeframe: string, recommendedAction: string, firedRules: FiredRule[] }}
 */
function gradeFollowUp(r, classification, severity) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  // ─── critical-alert: auto-escalation invariant ───
  if (hasCriticalResult(r) || classification === 'critical') {
    firedRules.push({
      ruleId: 'R-FU-CRITICAL-01',
      axis: 'follow-up',
      category: 'critical-result',
      description:
        'A critical result (incompatible crossmatch, clinically-significant antibodies, ABO discrepancy, or unmet two-sample rule) auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
    });
    return {
      followUpUrgency: 'critical-alert',
      targetTimeframe: 'immediate',
      recommendedAction:
        'Communicate the critical result directly to the requester now, withhold issue until resolved, and document the conversation.',
      firedRules
    };
  }

  // ─── urgent ───
  if (severity === 'major') {
    firedRules.push({
      ruleId: 'R-FU-URGENT-01',
      axis: 'follow-up',
      category: 'major-abnormality',
      description: 'Major abnormality present; follow-up urgency graded urgent.'
    });
    return {
      followUpUrgency: 'urgent',
      targetTimeframe: 'within 1 hour',
      recommendedAction:
        'Escalate to the consultant haematologist and expedite resolution before issue.',
      firedRules
    };
  }

  // ─── recommended ───
  if (severity === 'moderate' || insufficientUnits(r)) {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-01',
      axis: 'follow-up',
      category: 'moderate-abnormality',
      description: 'Moderate abnormality present; follow-up recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'before issue',
      recommendedAction:
        'Select antigen-negative units and/or order additional compatible units as clinically indicated.',
      firedRules
    };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-02',
      axis: 'follow-up',
      category: 'inconclusive',
      description: 'Inconclusive work-up; repeat or complete testing recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'before issue',
      recommendedAction:
        'Recommend a repeat sample or completion of testing to resolve the inconclusive work-up.',
      firedRules
    };
  }

  // ─── routine: least-urgent band, no rule fired ───
  firedRules.push({
    ruleId: 'R-FU-ROUTINE-01',
    axis: 'follow-up',
    category: 'compatible',
    description: 'No escalation rule fired; routine follow-up only.'
  });
  return {
    followUpUrgency: 'routine',
    targetTimeframe: 'no specific follow-up',
    recommendedAction:
      'Issue compatible units per the standard transfusion pathway; manage per usual care.',
    firedRules
  };
}

export { hasCriticalResult, isAboDiscrepancy, isTwoSampleRuleUnmet, hasAnyAbnormalFinding, insufficientUnits, classifyResult, gradeSeverity, gradeCompleteness, gradeFollowUp };
