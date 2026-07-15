// Declarative four-axis grading rules for the Pulmonary Function Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine modules
// `src/lib/engine/{classification-rules,severity-rules,completeness-rules,
// follow-up-rules,utils}.ts` (predicates only — display helpers live in
// `types.js`). Rule IDs, categories, and descriptions are stable and identical
// across every front-end and the back-end; rows mirror the
// `pulmonary_function_test_result_grade_rule` SQL table.
//
// The grader (`grader.js`) composes the four axis functions into the full
// `GradingResult`; `flags.js` raises the safety-critical flags independently.

/**
 * @typedef {import('./types.js').PulmonaryFunctionResult} PulmonaryFunctionResult
 * @typedef {import('./types.js').ResultClassification} ResultClassification
 * @typedef {import('./types.js').AbnormalitySeverity} AbnormalitySeverity
 * @typedef {import('./types.js').FollowUpUrgency} FollowUpUrgency
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.PulmonaryFunctionTestResult.

// ----------------------------------------------------------------------
// Structured-findings predicates (mirror `utils.ts`)
// ----------------------------------------------------------------------

/**
 * A critical finding auto-escalates Axis D to critical-alert. Mirrors the
 * back-end invariant: severe / very-severe airflow obstruction or restriction.
 * @param {PulmonaryFunctionResult} r
 * @returns {boolean}
 */
function hasCriticalFinding(r) {
  return (
    (r.airflowObstruction || r.restriction) &&
    (r.severity === 'severe' || r.severity === 'very-severe')
  );
}

/**
 * Whether any structured abnormal finding is present.
 * @param {PulmonaryFunctionResult} r
 * @returns {boolean}
 */
function hasAnyAbnormalFinding(r) {
  return (
    r.airflowObstruction ||
    r.restriction ||
    r.reducedGasTransfer ||
    r.ventilatoryPattern === 'obstructive' ||
    r.ventilatoryPattern === 'restrictive' ||
    r.ventilatoryPattern === 'mixed'
  );
}

/**
 * Whether the report describes a normal study (no abnormal findings).
 * @param {PulmonaryFunctionResult} r
 * @returns {boolean}
 */
function isNormalStudy(r) {
  return r.normalSpirometry && !hasAnyAbnormalFinding(r);
}

// ----------------------------------------------------------------------
// Axis A — result classification (mirrors `classification-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical structured finding (severe / very-severe airflow
 *   obstruction or restriction) is present.
 * - inconclusive: the test quality was unacceptable, or sub-optimal with no
 *   confident impression.
 * - abnormal: any abnormal structured finding is present.
 * - normal: no abnormal finding on an interpretable test.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 *
 * @param {PulmonaryFunctionResult} r
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
        'A critical structured finding (severe or very-severe airflow obstruction or restriction) is present; classified as critical.'
    });
    return { resultClassification: 'critical', firedRules };
  }

  if (r.testQuality === 'unacceptable') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-01',
      axis: 'classification',
      category: 'unacceptable-quality',
      description: 'Test quality was unacceptable; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (r.testQuality === 'sub-optimal' && r.impression.trim() === '') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-02',
      axis: 'classification',
      category: 'sub-optimal-no-impression',
      description:
        'Test quality was sub-optimal and no impression was recorded; classified as inconclusive.'
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

  if (r.reducedGasTransfer) {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-02',
      axis: 'classification',
      category: 'reduced-gas-transfer',
      description: 'Reduced gas transfer is present; classified as abnormal (not a normal study).'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  if (!isNormalStudy(r) && r.normalSpirometry === false) {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-03',
      axis: 'classification',
      category: 'indeterminate',
      description:
        'No structured finding was recorded and the study was not flagged as normal; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  firedRules.push({
    ruleId: 'R-CLASS-NORMAL-01',
    axis: 'classification',
    category: 'no-abnormal-finding',
    description: 'No abnormal structured findings on an interpretable test; classified as normal.'
  });
  return { resultClassification: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis B — abnormality severity (mirrors `severity-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Maps the recorded ventilatory severity band to a GOLD / ATS-ERS structured
 * reporting-category label, banded by FEV1 % predicted where available
 * (GOLD 1 >= 80 %, GOLD 2 50-79 %, GOLD 3 30-49 %, GOLD 4 < 30 %).
 *
 * @param {PulmonaryFunctionResult} r
 * @returns {string}
 */
function reportingCategoryFor(r) {
  const pct = r.fev1PercentPredicted;
  if (r.airflowObstruction && pct !== null) {
    if (pct >= 80) return 'GOLD 1 (mild)';
    if (pct >= 50) return 'GOLD 2 (moderate)';
    if (pct >= 30) return 'GOLD 3 (severe)';
    return 'GOLD 4 (very-severe)';
  }
  switch (r.severity) {
    case 'mild': return 'ATS/ERS mild';
    case 'moderate': return 'ATS/ERS moderate';
    case 'severe': return 'ATS/ERS severe';
    case 'very-severe': return 'ATS/ERS very-severe';
    default:
      return r.reportingCategory.trim() !== '' ? r.reportingCategory.trim() : 'normal';
  }
}

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none -> minor -> moderate -> major), grounded in the
 * ATS/ERS 2022 z-score severity grading and GOLD percent-predicted banding:
 * - major: a critical finding, or severe / very-severe ventilatory impairment.
 * - moderate: a moderate ventilatory impairment, or any actionable abnormal
 *   structured finding.
 * - minor: mild ventilatory impairment, or reduced gas transfer only.
 * - none: a normal study.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * structured-reporting workflows.
 *
 * @param {PulmonaryFunctionResult} r
 * @param {ResultClassification} classification
 * @returns {{ abnormalitySeverity: AbnormalitySeverity, reportingCategory: string, firedRules: FiredRule[] }}
 */
function gradeSeverity(r, classification) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  const category = reportingCategoryFor(r);

  if (hasCriticalFinding(r) || r.severity === 'severe' || r.severity === 'very-severe') {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-01',
      axis: 'severity',
      category: 'severe-impairment',
      description:
        'Severe or very-severe ventilatory impairment; abnormality severity graded major.'
    });
    return { abnormalitySeverity: 'major', reportingCategory: category, firedRules };
  }

  if (r.severity === 'moderate') {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-01',
      axis: 'severity',
      category: 'moderate-impairment',
      description: 'Moderate ventilatory impairment; abnormality severity graded moderate.'
    });
    return { abnormalitySeverity: 'moderate', reportingCategory: category, firedRules };
  }

  if ((r.airflowObstruction || r.restriction) && r.severity === '') {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-02',
      axis: 'severity',
      category: 'actionable-finding',
      description:
        'Airflow obstruction or restriction present without a graded severity; severity graded moderate.'
    });
    return { abnormalitySeverity: 'moderate', reportingCategory: category, firedRules };
  }

  if (r.severity === 'mild' || r.reducedGasTransfer) {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-01',
      axis: 'severity',
      category: 'mild-impairment',
      description:
        'Mild ventilatory impairment or reduced gas transfer only; abnormality severity graded minor.'
    });
    return { abnormalitySeverity: 'minor', reportingCategory: category, firedRules };
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

  if (hasAnyAbnormalFinding(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-02',
      axis: 'severity',
      category: 'abnormal-finding',
      description:
        'An abnormal ventilatory pattern is present without a graded severity; severity graded minor.'
    });
    return { abnormalitySeverity: 'minor', reportingCategory: category, firedRules };
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
 * The five mandatory report sections per ATS/ERS reporting standards:
 * clinical history, measured values, interpretation, findings, and impression.
 *
 * @type {{ ruleId: string, category: string, label: string,
 *          present: (r: PulmonaryFunctionResult) => boolean }[]}
 */
const sections = [
  {
    ruleId: 'R-COMP-HISTORY-01',
    category: 'history',
    label: 'clinical history',
    present: (r) => r.clinicalHistory.trim() !== ''
  },
  {
    ruleId: 'R-COMP-MEASUREMENTS-01',
    category: 'measured-values',
    label: 'measured values',
    present: (r) => r.fev1Litres !== null || r.fvcLitres !== null || r.fev1FvcRatio !== null
  },
  {
    ruleId: 'R-COMP-INTERPRETATION-01',
    category: 'interpretation',
    label: 'ventilatory interpretation',
    present: (r) => r.ventilatoryPattern !== ''
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
 * @param {PulmonaryFunctionResult} r
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
 * critical finding (severe / very-severe airflow obstruction or restriction)
 * auto-escalates to critical-alert regardless of the other axes (the safety
 * invariant). The least-urgent band is chosen only when no rule fires.
 *
 * @param {PulmonaryFunctionResult} r
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
      targetTimeframe: 'immediate',
      recommendedAction:
        'Arrange urgent respiratory review and communicate the critical result directly to the referrer now; document the conversation.',
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
      targetTimeframe: 'within 1 week',
      recommendedAction: 'Arrange urgent respiratory review and expedite onward referral.',
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
      targetTimeframe: 'within 4 weeks',
      recommendedAction:
        'Recommend respiratory clinic review or repeat testing as clinically indicated.',
      firedRules
    };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-02',
      axis: 'follow-up',
      category: 'inconclusive',
      description: 'Inconclusive study; repeat testing recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 4 weeks',
      recommendedAction:
        'Recommend repeat lung-function testing to acceptable quality to resolve the inconclusive study.',
      firedRules
    };
  }

  if (severity === 'minor') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-03',
      axis: 'follow-up',
      category: 'minor-abnormality',
      description: 'Minor abnormality present; structured follow-up recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'per local respiratory pathway',
      recommendedAction:
        'Manage the minor abnormality per the relevant respiratory pathway and review at the next appointment.',
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
    recommendedAction: 'No specific lung-function follow-up required; manage per usual care.',
    firedRules
  };
}

export { hasCriticalFinding, hasAnyAbnormalFinding, isNormalStudy, reportingCategoryFor, classifyResult, gradeSeverity, gradeCompleteness, gradeFollowUp };
