import { AFP_CRITICAL, BETA_HCG_CRITICAL, MARKERS } from './types.js';

// Declarative four-axis grading rules for the Tumor Marker Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine modules
// `src/lib/engine/{classification-rules,severity-rules,completeness-rules,
// follow-up-rules,utils}.ts` (predicates only — display helpers live in
// `types.js`). Rule IDs, categories, and descriptions are stable and identical
// across every front-end and the back-end; rows mirror the
// `tumor_marker_test_result_grade_rule` SQL table.
//
// The grader (`grader.js`) composes the four axis functions into the full
// `GradingResult`; `flags.js` raises the safety-critical flags independently.

/**
 * @typedef {import('./types.js').TumorMarkerResult} TumorMarkerResult
 * @typedef {import('./types.js').ResultClassification} ResultClassification
 * @typedef {import('./types.js').AbnormalitySeverity} AbnormalitySeverity
 * @typedef {import('./types.js').FollowUpUrgency} FollowUpUrgency
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.TumorMarkerTestResult.

// ----------------------------------------------------------------------
// Measured-marker predicates (mirror `utils.ts`)
// ----------------------------------------------------------------------

/**
 * Whether any measured marker value is present (non-null).
 * @param {TumorMarkerResult} r
 * @returns {boolean}
 */
function hasAnyMeasuredMarker(r) {
  return MARKERS.some((m) => r[m.key] !== null && r[m.key] !== undefined);
}

/**
 * The count of measured (non-null) markers.
 * @param {TumorMarkerResult} r
 * @returns {number}
 */
function measuredMarkerCount(r) {
  return MARKERS.filter((m) => r[m.key] !== null && r[m.key] !== undefined).length;
}

/**
 * A very high AFP or beta-hCG (suggesting a germ-cell tumour) is the
 * critical-result trigger. Mirrors the back-end invariant.
 * @param {TumorMarkerResult} r
 * @returns {boolean}
 */
function hasGermCellCriticalMarker(r) {
  return (
    (r.alphaFetoproteinAfp !== null && r.alphaFetoproteinAfp >= AFP_CRITICAL) ||
    (r.betaHcg !== null && r.betaHcg >= BETA_HCG_CRITICAL)
  );
}

/**
 * Whether the result is critical (reported critical or a germ-cell critical
 * marker).
 * @param {TumorMarkerResult} r
 * @returns {boolean}
 */
function isCriticalResult(r) {
  return r.overallResultStatus === 'critical' || hasGermCellCriticalMarker(r);
}

/**
 * A markedly elevated value, or a rising trend (on treatment), is the action
 * signal that drives an abnormal / urgent oncology review.
 * @param {TumorMarkerResult} r
 * @returns {boolean}
 */
function hasActionSignal(r) {
  return r.markedlyElevated || r.trend === 'rising';
}

// ----------------------------------------------------------------------
// Axis A — result classification (mirrors `classification-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion in clinical context:
 * - critical: a very high AFP / beta-hCG (germ-cell pattern), or the reporting
 *   clinician recorded the overall status as critical.
 * - inconclusive: no marker was measured, or the specimen was insufficient.
 * - abnormal: a markedly elevated value, a rising trend on treatment, or the
 *   reporting clinician recorded the overall status as abnormal.
 * - normal: no action signal and an interpretable result.
 *
 * @param {TumorMarkerResult} r
 * @returns {{ resultClassification: ResultClassification, firedRules: FiredRule[] }}
 */
function classifyResult(r) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  if (isCriticalResult(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-CRITICAL-01',
      axis: 'classification',
      category: 'critical-result',
      description: hasGermCellCriticalMarker(r)
        ? 'A very high AFP / beta-hCG (suggesting a germ-cell tumour) is present; classified as critical.'
        : 'Overall result status recorded as critical; classified as critical.'
    });
    return { resultClassification: 'critical', firedRules };
  }

  if (r.specimenCondition === 'insufficient' || !hasAnyMeasuredMarker(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-01',
      axis: 'classification',
      category: 'no-interpretable-result',
      description:
        'No interpretable marker result (specimen insufficient or no marker measured); classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (hasActionSignal(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-01',
      axis: 'classification',
      category: 'action-signal',
      description:
        'A markedly elevated value or a rising trend on treatment is present; classified as abnormal.'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  if (r.overallResultStatus === 'abnormal') {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-02',
      axis: 'classification',
      category: 'reported-abnormal',
      description: 'Overall result status recorded as abnormal; classified as abnormal.'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  firedRules.push({
    ruleId: 'R-CLASS-NORMAL-01',
    axis: 'classification',
    category: 'no-action-signal',
    description:
      'No markedly elevated value, no rising trend, and an interpretable result; classified as normal.'
  });
  return { resultClassification: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis B — abnormality severity & structured reporting (mirrors
// `severity-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * @param {TumorMarkerResult} r
 * @param {ResultClassification} classification
 * @returns {{ abnormalitySeverity: AbnormalitySeverity, reportingCategory: string, firedRules: FiredRule[] }}
 */
function gradeSeverity(r, classification) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  if (isCriticalResult(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-01',
      axis: 'severity',
      category: 'critical-result',
      description: 'Critical result present; abnormality severity graded major.'
    });
    const category = hasGermCellCriticalMarker(r) ? 'germ-cell-marker-pattern' : 'critical-result';
    return { abnormalitySeverity: 'major', reportingCategory: category, firedRules };
  }

  if (hasActionSignal(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-01',
      axis: 'severity',
      category: 'action-signal',
      description:
        'A markedly elevated value or a rising trend on treatment is present; severity graded moderate.'
    });
    const category = r.trend === 'rising' ? 'rising-trend-on-treatment' : 'markedly-elevated';
    return { abnormalitySeverity: 'moderate', reportingCategory: category, firedRules };
  }

  if (r.overallResultStatus === 'abnormal') {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-01',
      axis: 'severity',
      category: 'mildly-raised',
      description:
        'Result reported abnormal without a markedly elevated value or rising trend; severity graded minor.'
    });
    return { abnormalitySeverity: 'minor', reportingCategory: 'mildly-raised', firedRules };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-SEV-NONE-02',
      axis: 'severity',
      category: 'inconclusive',
      description: 'Inconclusive result; abnormality severity not established.'
    });
    return { abnormalitySeverity: 'none', reportingCategory: 'indeterminate', firedRules };
  }

  firedRules.push({
    ruleId: 'R-SEV-NONE-01',
    axis: 'severity',
    category: 'normal',
    description: 'No abnormal marker pattern; abnormality severity graded none.'
  });
  return { abnormalitySeverity: 'none', reportingCategory: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis C — report completeness (mirrors `completeness-rules.ts`)
// ----------------------------------------------------------------------

/**
 * The five mandatory report sections per ACB / RCPath reporting standards:
 * clinical history, specimen condition, measured values, comparison with
 * previous, and impression.
 * @type {Array<{ ruleId: string, category: string, label: string, present: (r: TumorMarkerResult) => boolean }>}
 */
const sections = [
  {
    ruleId: 'R-COMP-HISTORY-01',
    category: 'history',
    label: 'clinical history',
    present: (r) => r.clinicalHistory.trim() !== ''
  },
  {
    ruleId: 'R-COMP-SPECIMEN-01',
    category: 'specimen-condition',
    label: 'specimen condition',
    present: (r) => r.specimenCondition !== ''
  },
  {
    ruleId: 'R-COMP-VALUES-01',
    category: 'measured-values',
    label: 'measured marker values',
    present: (r) => hasAnyMeasuredMarker(r)
  },
  {
    ruleId: 'R-COMP-COMPARISON-01',
    category: 'comparison',
    label: 'comparison with previous',
    present: (r) => r.comparisonWithPrevious.trim() !== '' || r.trend !== ''
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
 * @param {TumorMarkerResult} r
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
 * @param {TumorMarkerResult} r
 * @param {ResultClassification} classification
 * @param {AbnormalitySeverity} severity
 * @returns {{ followUpUrgency: FollowUpUrgency, targetTimeframe: string, recommendedAction: string, firedRules: FiredRule[] }}
 */
function gradeFollowUp(r, classification, severity) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  // ─── critical-alert: auto-escalation invariant ───
  if (isCriticalResult(r) || classification === 'critical') {
    firedRules.push({
      ruleId: 'R-FU-CRITICAL-01',
      axis: 'follow-up',
      category: 'critical-result',
      description:
        'A critical result (very high AFP / beta-hCG, or reported critical) auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
    });
    return {
      followUpUrgency: 'critical-alert',
      targetTimeframe: 'immediate',
      recommendedAction:
        'Communicate the critical result directly to the requester now and document the conversation; consider germ-cell tumour pathway.',
      firedRules
    };
  }

  // ─── urgent ───
  if (hasActionSignal(r) || severity === 'major') {
    firedRules.push({
      ruleId: 'R-FU-URGENT-01',
      axis: 'follow-up',
      category: 'action-signal',
      description:
        'A markedly elevated value or a rising trend on treatment is present; follow-up urgency graded urgent.'
    });
    return {
      followUpUrgency: 'urgent',
      targetTimeframe: 'within 1 week',
      recommendedAction: 'Arrange urgent oncology review and correlate with clinical context.',
      firedRules
    };
  }

  // ─── recommended ───
  if (severity === 'minor' || r.overallResultStatus === 'abnormal') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-01',
      axis: 'follow-up',
      category: 'mildly-raised',
      description: 'Mildly raised / abnormal result; repeat marker or specialist review recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 4 weeks',
      recommendedAction:
        'Recommend repeat tumour marker at the minimum retesting interval or specialist referral as clinically indicated.',
      firedRules
    };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-02',
      axis: 'follow-up',
      category: 'inconclusive',
      description: 'Inconclusive result; repeat on a satisfactory specimen recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 4 weeks',
      recommendedAction: 'Recommend repeat assay on a satisfactory specimen to resolve the inconclusive result.',
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
    targetTimeframe: 'per minimum retesting interval',
    recommendedAction: 'No specific action required; manage per usual care and minimum retesting intervals.',
    firedRules
  };
}

export { hasAnyMeasuredMarker, measuredMarkerCount, hasGermCellCriticalMarker, isCriticalResult, hasActionSignal, classifyResult, gradeSeverity, gradeCompleteness, gradeFollowUp };
