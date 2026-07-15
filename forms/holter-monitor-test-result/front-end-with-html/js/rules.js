// Declarative four-axis grading rules for the Holter Monitor Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine modules
// `src/lib/engine/{classification-rules,severity-rules,completeness-rules,
// follow-up-rules,utils}.ts` (predicates only — display helpers live in
// `types.js`). Rule IDs, categories, and descriptions are stable and identical
// across every front-end and the back-end; rows mirror the
// `holter_monitor_test_result_grade_rule` SQL table.
//
// The grader (`grader.js`) composes the four axis functions into the full
// `GradingResult`; `flags.js` raises the safety-critical flags independently.

/**
 * @typedef {import('./types.js').HolterMonitorResult} HolterMonitorResult
 * @typedef {import('./types.js').ResultClassification} ResultClassification
 * @typedef {import('./types.js').AbnormalitySeverity} AbnormalitySeverity
 * @typedef {import('./types.js').FollowUpUrgency} FollowUpUrgency
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.HolterMonitorTestResult.

// ----------------------------------------------------------------------
// Structured-findings predicates (mirror `utils.ts`)
// ----------------------------------------------------------------------

/** A "fast atrial fibrillation" threshold: AF with a high maximum ventricular rate. */
const FAST_AF_MAX_HR_BPM = 150;

/** A clinically-significant pause threshold in seconds. */
const SIGNIFICANT_PAUSE_SECONDS = 3;

/**
 * A critical rhythm finding (ventricular tachycardia, a pause > 3 seconds,
 * high-grade AV block, or fast atrial fibrillation) auto-escalates Axis D to
 * critical-alert. Mirrors the back-end invariant.
 * @param {HolterMonitorResult} r
 * @returns {boolean}
 */
function hasCriticalFinding(r) {
  return (
    r.ventricularTachycardia ||
    r.highGradeAvBlock ||
    hasSignificantPause(r) ||
    hasFastAtrialFibrillation(r)
  );
}

/**
 * Whether a clinically-significant pause (> 3 seconds) is present.
 * @param {HolterMonitorResult} r
 * @returns {boolean}
 */
function hasSignificantPause(r) {
  return (
    r.significantPauses ||
    (r.longestPauseSeconds !== null && r.longestPauseSeconds > SIGNIFICANT_PAUSE_SECONDS)
  );
}

/**
 * Whether atrial fibrillation with a fast ventricular response is present.
 * @param {HolterMonitorResult} r
 * @returns {boolean}
 */
function hasFastAtrialFibrillation(r) {
  return (
    r.atrialFibrillationDetected &&
    r.maximumHeartRateBpm !== null &&
    r.maximumHeartRateBpm >= FAST_AF_MAX_HR_BPM
  );
}

/**
 * Whether any structured abnormal finding is present.
 * @param {HolterMonitorResult} r
 * @returns {boolean}
 */
function hasAnyAbnormalFinding(r) {
  return (
    r.atrialFibrillationDetected ||
    r.significantPauses ||
    r.ventricularTachycardia ||
    r.supraventricularTachycardia ||
    r.highGradeAvBlock ||
    hasSignificantPause(r) ||
    hasHighEctopyBurden(r)
  );
}

/**
 * Whether the ventricular ectopic burden is high (>= 10 %).
 * @param {HolterMonitorResult} r
 * @returns {boolean}
 */
function hasHighEctopyBurden(r) {
  return r.ventricularEctopicPercent !== null && r.ventricularEctopicPercent >= 10;
}

// ----------------------------------------------------------------------
// Axis A — result classification (mirrors `classification-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical rhythm finding (ventricular tachycardia, pause > 3 s,
 *   high-grade AV block, or fast atrial fibrillation) is present.
 * - inconclusive: the recording was inadequate (too little analysed), or the
 *   study is neither normal nor abnormal with no confident impression.
 * - abnormal: any abnormal structured finding is present.
 * - normal: the study is normal and the recording was adequate.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 *
 * @param {HolterMonitorResult} r
 * @returns {{ resultClassification: ResultClassification, firedRules: FiredRule[] }}
 */
function classifyResult(r) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  if (hasCriticalFinding(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-CRITICAL-01',
      axis: 'classification',
      category: 'critical-finding',
      description:
        'A critical rhythm finding (ventricular tachycardia, pause > 3 s, high-grade AV block, or fast atrial fibrillation) is present; classified as critical.'
    });
    return { resultClassification: 'critical', firedRules };
  }

  if (r.analysedPercent !== null && r.analysedPercent < 50) {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-01',
      axis: 'classification',
      category: 'inadequate-recording',
      description:
        'Less than 50% of the recording was analysable; classified as inconclusive.'
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

  if (r.normalStudy) {
    firedRules.push({
      ruleId: 'R-CLASS-NORMAL-01',
      axis: 'classification',
      category: 'normal-study',
      description: 'Study recorded as normal with no abnormal findings; classified as normal.'
    });
    return { resultClassification: 'normal', firedRules };
  }

  if (r.impression.trim() === '') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-02',
      axis: 'classification',
      category: 'no-impression',
      description:
        'No abnormal finding, study not marked normal, and no impression recorded; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  firedRules.push({
    ruleId: 'R-CLASS-NORMAL-02',
    axis: 'classification',
    category: 'no-abnormal-finding',
    description: 'No abnormal structured findings on an interpretable recording; classified as normal.'
  });
  return { resultClassification: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis B — abnormality severity (mirrors `severity-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in ambulatory
 * ECG actionable-reporting principles (ISHNE-HRS consensus, NICE NG196 AF-burden
 * categories, ESC pacing thresholds):
 * - major: a critical rhythm finding.
 * - moderate: an actionable arrhythmia (atrial fibrillation, supraventricular
 *   tachycardia) or a high ventricular ectopic burden (>= 10 %).
 * - minor: low-level ectopy or a symptom-rhythm correlation without a major
 *   arrhythmia.
 * - none: a normal study.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * structured-reporting workflows.
 *
 * @param {HolterMonitorResult} r
 * @param {ResultClassification} classification
 * @returns {{ abnormalitySeverity: AbnormalitySeverity, reportingCategory: string,
 *             firedRules: FiredRule[] }}
 */
function gradeSeverity(r, classification) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  if (hasCriticalFinding(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-01',
      axis: 'severity',
      category: 'critical-finding',
      description: 'Critical rhythm finding present; abnormality severity graded major.'
    });
    return { abnormalitySeverity: 'major', reportingCategory: 'critical-actionable', firedRules };
  }

  if (r.atrialFibrillationDetected) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-01',
      axis: 'severity',
      category: 'atrial-fibrillation',
      description: 'Atrial fibrillation detected; abnormality severity graded moderate.'
    });
    return { abnormalitySeverity: 'moderate', reportingCategory: 'af-detected', firedRules };
  }

  if (r.supraventricularTachycardia) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-02',
      axis: 'severity',
      category: 'supraventricular-tachycardia',
      description: 'Supraventricular tachycardia present; abnormality severity graded moderate.'
    });
    return { abnormalitySeverity: 'moderate', reportingCategory: 'svt', firedRules };
  }

  if (hasHighEctopyBurden(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-03',
      axis: 'severity',
      category: 'high-ectopy-burden',
      description:
        'High ventricular ectopic burden (>= 10 %); abnormality severity graded moderate.'
    });
    return { abnormalitySeverity: 'moderate', reportingCategory: 'high-ectopy', firedRules };
  }

  if (r.symptomRhythmCorrelation || r.significantPauses) {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-01',
      axis: 'severity',
      category: 'minor-finding',
      description:
        'A minor finding (symptom-rhythm correlation or low-level pause) is present; abnormality severity graded minor.'
    });
    return { abnormalitySeverity: 'minor', reportingCategory: 'minor-finding', firedRules };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-SEV-NONE-02',
      axis: 'severity',
      category: 'inconclusive',
      description: 'Inconclusive study; abnormality severity not established.'
    });
    return { abnormalitySeverity: 'none', reportingCategory: 'indeterminate', firedRules };
  }

  firedRules.push({
    ruleId: 'R-SEV-NONE-01',
    axis: 'severity',
    category: 'no-abnormal-finding',
    description: 'No abnormal finding; abnormality severity graded none.'
  });
  return { abnormalitySeverity: 'none', reportingCategory: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis C — report completeness (mirrors `completeness-rules.ts`)
// ----------------------------------------------------------------------

/**
 * The five mandatory report sections per ambulatory ECG reporting standards:
 * clinical history, rhythm summary, rate summary, findings, and impression.
 *
 * @type {Array<{ ruleId: string, category: string, label: string,
 *                present: (r: HolterMonitorResult) => boolean }>}
 */
const completenessSections = [
  {
    ruleId: 'R-COMP-HISTORY-01',
    category: 'history',
    label: 'clinical history',
    present: (r) => r.clinicalHistory.trim() !== ''
  },
  {
    ruleId: 'R-COMP-RHYTHM-01',
    category: 'rhythm-summary',
    label: 'rhythm summary (predominant rhythm)',
    present: (r) => r.predominantRhythm !== ''
  },
  {
    ruleId: 'R-COMP-RATE-01',
    category: 'rate-summary',
    label: 'rate summary (mean heart rate)',
    present: (r) => r.meanHeartRateBpm !== null
  },
  {
    ruleId: 'R-COMP-FINDINGS-01',
    category: 'findings',
    label: 'findings narrative',
    present: (r) => r.findingsNarrative.trim() !== ''
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
 * @param {HolterMonitorResult} r
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

// ----------------------------------------------------------------------
// Axis D — follow-up urgency (mirrors `follow-up-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis D — follow-up urgency, plus the target timeframe and recommended action.
 *
 * Escalation ladder (routine → recommended → urgent → critical-alert). A
 * critical rhythm finding auto-escalates to critical-alert regardless of the
 * other axes (the safety invariant). The least-urgent band is chosen only when
 * no rule fires.
 *
 * @param {HolterMonitorResult} r
 * @param {ResultClassification} classification
 * @param {AbnormalitySeverity} severity
 * @returns {{ followUpUrgency: FollowUpUrgency, targetTimeframe: string,
 *             recommendedAction: string, firedRules: FiredRule[] }}
 */
function gradeFollowUp(r, classification, severity) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  // ─── critical-alert: auto-escalation invariant ───
  if (hasCriticalFinding(r) || classification === 'critical') {
    firedRules.push({
      ruleId: 'R-FU-CRITICAL-01',
      axis: 'follow-up',
      category: 'critical-result',
      description:
        'Critical rhythm finding auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
    });
    return {
      followUpUrgency: 'critical-alert',
      targetTimeframe: 'immediate',
      recommendedAction:
        'Communicate the critical result directly to the referrer now and document the conversation.',
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
        'Recommend cardiology follow-up or further monitoring as clinically indicated.',
      firedRules
    };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-02',
      axis: 'follow-up',
      category: 'inconclusive',
      description: 'Inconclusive study; repeat or extended monitoring recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 2 weeks',
      recommendedAction:
        'Recommend repeat or extended ambulatory monitoring to resolve the inconclusive study.',
      firedRules
    };
  }

  if (severity === 'minor') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-03',
      axis: 'follow-up',
      category: 'minor-finding',
      description: 'Minor finding; structured follow-up per ambulatory ECG guidance recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'per ambulatory ECG guidance',
      recommendedAction:
        'Manage the minor finding per the relevant ambulatory ECG pathway and reassure as appropriate.',
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
    recommendedAction: 'No specific monitoring follow-up required; manage per usual care.',
    firedRules
  };
}

export { FAST_AF_MAX_HR_BPM, SIGNIFICANT_PAUSE_SECONDS, hasCriticalFinding, hasSignificantPause, hasFastAtrialFibrillation, hasAnyAbnormalFinding, hasHighEctopyBurden, classifyResult, gradeSeverity, gradeCompleteness, gradeFollowUp };
