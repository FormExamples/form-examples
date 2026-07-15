// Declarative four-axis grading rules for the Cardiac Stress Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine modules
// `src/lib/engine/{classification-rules,severity-rules,completeness-rules,
// follow-up-rules,utils}.ts` (predicates only — display helpers live in
// `types.js`). Rule IDs, categories, and descriptions are stable and identical
// across every front-end and the back-end; rows mirror the
// `cardiac_stress_test_result_grade_rule` SQL table.
//
// The grader (`grader.js`) composes the four axis functions into the full
// `GradingResult`; `flags.js` raises the safety-critical flags independently.

/**
 * @typedef {import('./types.js').CardiacStressResult} CardiacStressResult
 * @typedef {import('./types.js').ResultClassification} ResultClassification
 * @typedef {import('./types.js').AbnormalitySeverity} AbnormalitySeverity
 * @typedef {import('./types.js').FollowUpUrgency} FollowUpUrgency
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.CardiacStressTestResult.

// ----------------------------------------------------------------------
// Clinical thresholds (mirror `utils.ts`)
// ----------------------------------------------------------------------

/** A high-risk Duke treadmill score is <= -11 (~65% five-year survival). */
const DUKE_HIGH_RISK_MAX = -11;
/** A low-risk Duke treadmill score is >= +5 (~97% five-year survival). */
const DUKE_LOW_RISK_MIN = 5;
/** Ischaemia induced at or below this functional capacity (METs) is low-workload. */
const LOW_WORKLOAD_METS = 5;

// ----------------------------------------------------------------------
// Structured-findings predicates (mirror `utils.ts`)
// ----------------------------------------------------------------------

/**
 * A strongly positive test: positive conclusion with induced ischaemic ST changes.
 * @param {CardiacStressResult} r
 * @returns {boolean}
 */
function isStronglyPositive(r) {
  return r.testPositive && r.ischaemicStChanges;
}

/**
 * Exertional hypotension: a hypotensive blood-pressure response to exercise.
 * @param {CardiacStressResult} r
 * @returns {boolean}
 */
function hasExertionalHypotension(r) {
  return r.bloodPressureResponse === 'hypotensive';
}

/**
 * Ischaemia induced at a low workload (ST changes with low functional capacity).
 * @param {CardiacStressResult} r
 * @returns {boolean}
 */
function hasIschaemiaAtLowWorkload(r) {
  return (
    r.ischaemicStChanges && r.metsAchieved !== null && r.metsAchieved <= LOW_WORKLOAD_METS
  );
}

/**
 * A high-risk Duke treadmill score (<= -11).
 * @param {CardiacStressResult} r
 * @returns {boolean}
 */
function hasHighRiskDukeScore(r) {
  return r.dukeTreadmillScore !== null && r.dukeTreadmillScore <= DUKE_HIGH_RISK_MAX;
}

/**
 * A critical result (strongly positive test, exertional hypotension, ischaemia
 * induced at low workload, or a high-risk Duke treadmill score) auto-escalates
 * Axis D to critical-alert. Mirrors the back-end invariant.
 * @param {CardiacStressResult} r
 * @returns {boolean}
 */
function hasCriticalResult(r) {
  return (
    isStronglyPositive(r) ||
    hasExertionalHypotension(r) ||
    hasIschaemiaAtLowWorkload(r) ||
    hasHighRiskDukeScore(r)
  );
}

/**
 * Whether any structured abnormal finding is present.
 * @param {CardiacStressResult} r
 * @returns {boolean}
 */
function hasAnyAbnormalFinding(r) {
  return (
    r.testPositive ||
    r.ischaemicStChanges ||
    r.chestPainInduced ||
    r.arrhythmiaInduced ||
    hasExertionalHypotension(r)
  );
}

/**
 * Whether the report describes an inconclusive / non-diagnostic study.
 * @param {CardiacStressResult} r
 * @returns {boolean}
 */
function isInconclusiveStudy(r) {
  return r.testInconclusive && !hasAnyAbnormalFinding(r);
}

/**
 * The Duke treadmill score risk band, used as the structured-reporting
 * `reportingCategory` label.
 * @param {number | null} score
 * @returns {string}
 */
function dukeRiskBand(score) {
  if (score === null) return '';
  if (score <= DUKE_HIGH_RISK_MAX) return 'duke-high-risk';
  if (score >= DUKE_LOW_RISK_MIN) return 'duke-low-risk';
  return 'duke-intermediate-risk';
}

// ----------------------------------------------------------------------
// Axis A — result classification (mirrors `classification-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical result (strongly positive test, exertional
 *   hypotension, ischaemia at low workload, or a high-risk Duke score).
 * - inconclusive: a non-diagnostic / inconclusive study (e.g. submaximal,
 *   uninterpretable), or an inconclusive flag with no impression.
 * - abnormal: any abnormal structured finding is present.
 * - normal: no abnormal finding on an interpretable study.
 *
 * Returns the classification plus the audit-trail rules that fired.
 *
 * @param {CardiacStressResult} r
 * @returns {{ resultClassification: ResultClassification, firedRules: FiredRule[] }}
 */
function classifyResult(r) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  if (hasCriticalResult(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-CRITICAL-01',
      axis: 'classification',
      category: 'critical-result',
      description:
        'A critical result (strongly positive test, exertional hypotension, ischaemia at low workload, or a high-risk Duke treadmill score) is present; classified as critical.'
    });
    return { resultClassification: 'critical', firedRules };
  }

  if (isInconclusiveStudy(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-01',
      axis: 'classification',
      category: 'non-diagnostic',
      description: 'Test was inconclusive / non-diagnostic; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (r.terminatedEarly && r.impression.trim() === '' && !hasAnyAbnormalFinding(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-02',
      axis: 'classification',
      category: 'terminated-no-impression',
      description:
        'Test was terminated early and no impression was recorded; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (hasAnyAbnormalFinding(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-01',
      axis: 'classification',
      category: 'abnormal-finding',
      description: 'One or more abnormal structured findings are present; classified as abnormal.'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  if (r.terminatedEarly) {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-02',
      axis: 'classification',
      category: 'early-termination',
      description:
        'Test was terminated early (submaximal) without a clearly negative endpoint; classified as abnormal.'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  firedRules.push({
    ruleId: 'R-CLASS-NORMAL-01',
    axis: 'classification',
    category: 'no-abnormal-finding',
    description:
      'No abnormal structured findings on an interpretable test; classified as normal.'
  });
  return { resultClassification: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis B — abnormality severity (mirrors `severity-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none -> minor -> moderate -> major), grounded in ACC/AHA
 * prognostic stratification and the Duke treadmill score risk bands:
 * - major: a critical result (strongly positive, exertional hypotension,
 *   ischaemia at low workload, or a high-risk Duke score).
 * - moderate: an actionable abnormal finding (induced ischaemia, chest pain,
 *   arrhythmia) without a critical trigger.
 * - minor: an isolated minor finding (e.g. early termination only).
 * - none: a negative / normal test.
 *
 * The `reportingCategory` carries the structured risk label — the Duke
 * treadmill score risk band where available (low / intermediate / high risk).
 *
 * @param {CardiacStressResult} r
 * @param {ResultClassification} classification
 * @returns {{ abnormalitySeverity: AbnormalitySeverity, reportingCategory: string, firedRules: FiredRule[] }}
 */
function gradeSeverity(r, classification) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  const dukeBand = dukeRiskBand(r.dukeTreadmillScore);

  if (hasCriticalResult(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-01',
      axis: 'severity',
      category: 'critical-result',
      description: 'Critical result present; abnormality severity graded major.'
    });
    return {
      abnormalitySeverity: 'major',
      reportingCategory: dukeBand || 'critical-actionable',
      firedRules
    };
  }

  const actionable = r.ischaemicStChanges || r.chestPainInduced || r.arrhythmiaInduced;

  if (actionable) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-01',
      axis: 'severity',
      category: 'actionable-finding',
      description:
        'An actionable abnormal finding (induced ischaemia, chest pain, or arrhythmia) is present; severity graded moderate.'
    });
    return {
      abnormalitySeverity: 'moderate',
      reportingCategory: dukeBand || 'actionable-finding',
      firedRules
    };
  }

  if (r.terminatedEarly && classification !== 'inconclusive') {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-01',
      axis: 'severity',
      category: 'early-termination',
      description: 'Test terminated early without an actionable finding; severity graded minor.'
    });
    return {
      abnormalitySeverity: 'minor',
      reportingCategory: dukeBand || 'submaximal',
      firedRules
    };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-SEV-NONE-02',
      axis: 'severity',
      category: 'inconclusive',
      description: 'Inconclusive study; abnormality severity not established.'
    });
    return {
      abnormalitySeverity: 'none',
      reportingCategory: dukeBand || 'indeterminate',
      firedRules
    };
  }

  firedRules.push({
    ruleId: 'R-SEV-NONE-01',
    axis: 'severity',
    category: 'no-abnormal-finding',
    description: 'No abnormal finding; abnormality severity graded none.'
  });
  // A negative test with a recorded low-risk Duke score is a reassuring band.
  const negativeBand =
    dukeBand ||
    (r.dukeTreadmillScore !== null && r.dukeTreadmillScore >= DUKE_LOW_RISK_MIN
      ? 'duke-low-risk'
      : 'normal');
  return { abnormalitySeverity: 'none', reportingCategory: negativeBand, firedRules };
}

// ----------------------------------------------------------------------
// Axis C — report completeness (mirrors `completeness-rules.ts`)
// ----------------------------------------------------------------------

/**
 * The five mandatory report sections per ACC/AHA exercise-testing reporting
 * standards: clinical history, protocol, haemodynamic response, findings, and
 * impression.
 *
 * @type {{ ruleId: string, category: string, label: string,
 *          present: (r: CardiacStressResult) => boolean }[]}
 */
const sections = [
  {
    ruleId: 'R-COMP-HISTORY-01',
    category: 'history',
    label: 'clinical history',
    present: (r) => r.clinicalHistory.trim() !== ''
  },
  {
    ruleId: 'R-COMP-PROTOCOL-01',
    category: 'protocol',
    label: 'stress protocol',
    present: (r) => r.protocol.trim() !== ''
  },
  {
    ruleId: 'R-COMP-HAEMODYNAMIC-01',
    category: 'haemodynamic',
    label: 'haemodynamic response',
    present: (r) =>
      r.maximumHeartRateBpm !== null ||
      r.percentPredictedHeartRate !== null ||
      r.metsAchieved !== null ||
      r.bloodPressureResponse !== ''
  },
  {
    ruleId: 'R-COMP-FINDINGS-01',
    category: 'findings',
    label: 'structured findings',
    present: (r) => r.testPositive || r.testNegative || r.testInconclusive
  },
  {
    ruleId: 'R-COMP-IMPRESSION-01',
    category: 'impression',
    label: 'impression',
    present: (r) => r.impression.trim() !== ''
  }
];

/**
 * Axis C — report completeness.
 *
 * Returns the percentage (0-100, rounded) of mandatory report sections that
 * are present, plus an audit-trail rule for each missing section.
 *
 * @param {CardiacStressResult} r
 * @returns {{ reportCompletenessPercent: number, firedRules: FiredRule[] }}
 */
function gradeCompleteness(r) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  let presentCount = 0;

  for (const section of sections) {
    if (section.present(r)) {
      presentCount += 1;
    } else {
      firedRules.push({
        ruleId: section.ruleId,
        axis: 'completeness',
        category: section.category,
        description: `Mandatory report section missing: ${section.label}.`
      });
    }
  }

  const reportCompletenessPercent = Math.round((presentCount / sections.length) * 100);
  return { reportCompletenessPercent, firedRules };
}

// ----------------------------------------------------------------------
// Axis D — follow-up urgency (mirrors `follow-up-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis D — follow-up urgency, plus the target timeframe and recommended action.
 *
 * Escalation ladder (routine -> recommended -> urgent -> critical-alert). A
 * critical result (strongly positive test, exertional hypotension, ischaemia
 * at low workload, or a high-risk Duke treadmill score) auto-escalates to
 * critical-alert with an urgent cardiology referral, regardless of the other
 * axes (the safety invariant). The least-urgent band is chosen only when no
 * rule fires.
 *
 * @param {CardiacStressResult} r
 * @param {ResultClassification} classification
 * @param {AbnormalitySeverity} severity
 * @returns {{ followUpUrgency: FollowUpUrgency, targetTimeframe: string,
 *             recommendedAction: string, firedRules: FiredRule[] }}
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
        'Critical result auto-escalates follow-up urgency to critical-alert with an urgent cardiology referral, regardless of the other axes.'
    });
    return {
      followUpUrgency: 'critical-alert',
      targetTimeframe: 'immediate',
      recommendedAction:
        'Communicate the critical result directly to the referrer now and make an urgent cardiology referral; document the conversation.',
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
      targetTimeframe: 'within 24 hours',
      recommendedAction: 'Arrange urgent cardiology review and expedite onward referral.',
      firedRules
    };
  }

  // ─── recommended ───
  if (severity === 'moderate') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-01',
      axis: 'follow-up',
      category: 'moderate-abnormality',
      description: 'Moderate abnormality present; follow-up recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 2 weeks',
      recommendedAction:
        'Recommend further functional or anatomical imaging or cardiology referral as clinically indicated.',
      firedRules
    };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-02',
      axis: 'follow-up',
      category: 'inconclusive',
      description: 'Inconclusive study; repeat or alternative testing recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 2 weeks',
      recommendedAction:
        'Recommend repeat or alternative stress / imaging testing to resolve the inconclusive study.',
      firedRules
    };
  }

  if (severity === 'minor') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-03',
      axis: 'follow-up',
      category: 'minor-finding',
      description: 'Minor finding present; routine cardiology follow-up recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 6 weeks',
      recommendedAction:
        'Recommend routine cardiology follow-up; consider repeating the test to a maximal endpoint.',
      firedRules
    };
  }

  // ─── routine: least-urgent band, no rule fired ───
  firedRules.push({
    ruleId: 'R-FU-ROUTINE-01',
    axis: 'follow-up',
    category: 'normal',
    description: 'No escalation rule fired; routine follow-up only.'
  });
  return {
    followUpUrgency: 'routine',
    targetTimeframe: 'no specific follow-up',
    recommendedAction: 'No specific cardiac follow-up required; manage per usual care.',
    firedRules
  };
}

export { DUKE_HIGH_RISK_MAX, DUKE_LOW_RISK_MIN, LOW_WORKLOAD_METS, isStronglyPositive, hasExertionalHypotension, hasIschaemiaAtLowWorkload, hasHighRiskDukeScore, hasCriticalResult, hasAnyAbnormalFinding, isInconclusiveStudy, dukeRiskBand, classifyResult, gradeSeverity, gradeCompleteness, gradeFollowUp };
