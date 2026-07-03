// Declarative four-axis grading rules for the Electrocardiogram Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine modules
// `src/lib/engine/{classification-rules,severity-rules,completeness-rules,
// follow-up-rules,utils}.ts` (predicates only — display helpers live in
// `types.js`). Rule IDs, categories, and descriptions are stable and identical
// across every front-end and the back-end; rows mirror the
// `electrocardiogram_test_result_grade_rule` SQL table.
//
// The grader (`grader.js`) composes the four axis functions into the full
// `GradingResult`; `flags.js` raises the safety-critical flags independently.

/**
 * @typedef {import('./types.js').ElectrocardiogramResult} ElectrocardiogramResult
 * @typedef {import('./types.js').ResultClassification} ResultClassification
 * @typedef {import('./types.js').AbnormalitySeverity} AbnormalitySeverity
 * @typedef {import('./types.js').FollowUpUrgency} FollowUpUrgency
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.ElectrocardiogramTestResult.
(function () {
'use strict';
window.ElectrocardiogramTestResult = window.ElectrocardiogramTestResult || {};

// ----------------------------------------------------------------------
// Structured-findings predicates (mirror `utils.ts`)
// ----------------------------------------------------------------------

/** The QTc threshold (ms) at or above which the QT is markedly prolonged. */
const QTC_PROLONGED_MS = 500;

/**
 * A critical finding auto-escalates Axis D to critical-alert. Mirrors the
 * back-end invariant: ST-segment elevation (STEMI / acute injury pattern),
 * ventricular tachycardia, complete (third-degree) heart block, or a markedly
 * prolonged QTc (>= 500 ms).
 * @param {ElectrocardiogramResult} r
 * @returns {boolean}
 */
function hasCriticalFinding(r) {
  return (
    r.stElevation ||
    r.rhythm === 'ventricular-tachycardia' ||
    r.rhythm === 'heart-block' ||
    (r.qtcMs !== null && r.qtcMs >= QTC_PROLONGED_MS)
  );
}

/**
 * Whether any structured abnormal finding is present.
 * @param {ElectrocardiogramResult} r
 * @returns {boolean}
 */
function hasAnyAbnormalFinding(r) {
  return (
    r.stElevation ||
    r.stDepression ||
    r.tWaveInversion ||
    r.pathologicalQWaves ||
    r.leftVentricularHypertrophy ||
    r.bundleBranchBlock ||
    r.ischaemia
  );
}

/**
 * Whether an abnormal rhythm (anything other than sinus / paced) is present.
 * @param {ElectrocardiogramResult} r
 * @returns {boolean}
 */
function hasAbnormalRhythm(r) {
  return (
    r.rhythm === 'atrial-fibrillation' ||
    r.rhythm === 'atrial-flutter' ||
    r.rhythm === 'svt' ||
    r.rhythm === 'ventricular-tachycardia' ||
    r.rhythm === 'heart-block'
  );
}

// ----------------------------------------------------------------------
// Axis A — result classification (mirrors `classification-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical finding (ST elevation / STEMI, ventricular
 *   tachycardia, complete heart block, or markedly prolonged QTc) is present.
 * - inconclusive: the recording quality was poor with no confident impression.
 * - abnormal: any abnormal structured finding or abnormal rhythm is present.
 * - normal: no abnormal finding on an interpretable trace.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 *
 * @param {ElectrocardiogramResult} r
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
        'A critical finding (ST elevation / STEMI, ventricular tachycardia, complete heart block, or markedly prolonged QTc) is present; classified as critical.'
    });
    return { resultClassification: 'critical', firedRules };
  }

  if (r.recordingQuality === 'poor' && r.impression.trim() === '') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-01',
      axis: 'classification',
      category: 'poor-quality',
      description:
        'Recording quality was poor and no impression was recorded; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (hasAnyAbnormalFinding(r) || hasAbnormalRhythm(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-01',
      axis: 'classification',
      category: 'abnormal-finding',
      description:
        'One or more abnormal structured findings or an abnormal rhythm are present; classified as abnormal.'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  firedRules.push({
    ruleId: 'R-CLASS-NORMAL-01',
    axis: 'classification',
    category: 'no-abnormal-finding',
    description: 'No abnormal structured findings on an interpretable trace; classified as normal.'
  });
  return { resultClassification: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis B — abnormality severity (mirrors `severity-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in AHA/ACCF/HRS
 * standardised interpretation statements and recognised acute-ischaemia
 * categories:
 * - major: a critical finding (STEMI / VT / complete heart block / prolonged
 *   QTc), or an acute ischaemic pattern.
 * - moderate: an actionable abnormal finding (ST depression, pathological Q
 *   waves, bundle branch block) or an abnormal non-critical rhythm.
 * - minor: an isolated minor finding (T-wave inversion or LVH only).
 * - none: a normal trace.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * structured-reporting workflows.
 *
 * @param {ElectrocardiogramResult} r
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
      description: 'Critical finding present; abnormality severity graded major.'
    });
    return { abnormalitySeverity: 'major', reportingCategory: 'critical-actionable', firedRules };
  }

  if (r.ischaemia) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-02',
      axis: 'severity',
      category: 'ischaemia',
      description: 'An ischaemic pattern is present; abnormality severity graded major.'
    });
    return { abnormalitySeverity: 'major', reportingCategory: 'acute-ischaemia', firedRules };
  }

  const actionable =
    r.stDepression || r.pathologicalQWaves || r.bundleBranchBlock || hasAbnormalRhythm(r);

  if (actionable) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-01',
      axis: 'severity',
      category: 'actionable-finding',
      description:
        'An actionable abnormal finding (ST depression, pathological Q waves, bundle branch block, or abnormal rhythm) is present; severity graded moderate.'
    });
    return { abnormalitySeverity: 'moderate', reportingCategory: 'actionable-finding', firedRules };
  }

  if (r.tWaveInversion || r.leftVentricularHypertrophy) {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-01',
      axis: 'severity',
      category: 'minor-finding',
      description:
        'An isolated minor finding (T-wave inversion or left ventricular hypertrophy) is present; severity graded minor.'
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
 * The five mandatory report sections per AHA/ACCF/HRS reporting standards:
 * clinical history, rate/rhythm, intervals, interpretation, and impression.
 *
 * @type {Array<{ ruleId: string, category: string, label: string,
 *                present: (r: ElectrocardiogramResult) => boolean }>}
 */
const completenessSections = [
  {
    ruleId: 'R-COMP-HISTORY-01',
    category: 'history',
    label: 'clinical history',
    present: (r) => r.clinicalHistory.trim() !== ''
  },
  {
    ruleId: 'R-COMP-RATE-RHYTHM-01',
    category: 'rate-rhythm',
    label: 'ventricular rate and rhythm',
    present: (r) => r.ventricularRateBpm !== null && r.rhythm !== ''
  },
  {
    ruleId: 'R-COMP-INTERVALS-01',
    category: 'intervals',
    label: 'PR / QRS / QT / QTc intervals',
    present: (r) =>
      r.prIntervalMs !== null &&
      r.qrsDurationMs !== null &&
      r.qtIntervalMs !== null &&
      r.qtcMs !== null
  },
  {
    ruleId: 'R-COMP-INTERPRETATION-01',
    category: 'interpretation',
    label: 'interpretation narrative',
    present: (r) => r.interpretation.trim() !== ''
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
 * @param {ElectrocardiogramResult} r
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
 * critical finding auto-escalates to critical-alert regardless of the other
 * axes (the safety invariant). The least-urgent band is chosen only when no
 * rule fires.
 *
 * @param {ElectrocardiogramResult} r
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
        'Critical finding auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
    });
    return {
      followUpUrgency: 'critical-alert',
      targetTimeframe: 'same hour',
      recommendedAction:
        'Communicate the critical result directly to the responsible team now (same hour) and document the conversation.',
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
      recommendedAction: 'Arrange urgent clinical review and expedite cardiology referral.',
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
        'Recommend cardiology review or further investigation as clinically indicated.',
      firedRules
    };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-02',
      axis: 'follow-up',
      category: 'inconclusive',
      description: 'Inconclusive study; repeat ECG recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 2 weeks',
      recommendedAction: 'Recommend a repeat ECG of adequate quality to resolve the inconclusive study.',
      firedRules
    };
  }

  if (severity === 'minor') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-03',
      axis: 'follow-up',
      category: 'minor-finding',
      description: 'Minor finding present; structured follow-up recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'routine clinic',
      recommendedAction: 'Correlate the minor finding clinically and follow up at routine review.',
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
    recommendedAction: 'No specific ECG follow-up required; manage per usual care.',
    firedRules
  };
}

Object.assign(window.ElectrocardiogramTestResult, {
  QTC_PROLONGED_MS,
  hasCriticalFinding,
  hasAnyAbnormalFinding,
  hasAbnormalRhythm,
  classifyResult,
  gradeSeverity,
  gradeCompleteness,
  gradeFollowUp
});
})();
