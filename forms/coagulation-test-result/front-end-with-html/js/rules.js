// Declarative four-axis grading rules for the Coagulation Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine modules
// `src/lib/engine/{classification-rules,severity-rules,completeness-rules,
// follow-up-rules,utils}.ts` (predicates only — display helpers live in
// `types.js`). Rule IDs, categories, and descriptions are stable and identical
// across every front-end and the back-end; rows mirror the
// `coagulation_test_result_grade_rule` SQL table.
//
// The grader (`grader.js`) composes the four axis functions into the full
// `GradingResult`; `flags.js` raises the safety-critical flags independently.

/**
 * @typedef {import('./types.js').CoagulationResult} CoagulationResult
 * @typedef {import('./types.js').ResultClassification} ResultClassification
 * @typedef {import('./types.js').AbnormalitySeverity} AbnormalitySeverity
 * @typedef {import('./types.js').FollowUpUrgency} FollowUpUrgency
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// ----------------------------------------------------------------------
// Critical-value and abnormality predicates (mirror `utils.ts`)
// ----------------------------------------------------------------------

/**
 * Whether the reported result values breach a recognised critical threshold:
 * - INR > 8 (BSH oral-anticoagulation reversal threshold), or
 * - fibrinogen < 1.0 g/L (major-haemorrhage / DIC marker), or
 * - a DIC picture (low fibrinogen + raised D-dimer + prolonged PT or APTT).
 *
 * Mirrors the back-end invariant. A breach auto-escalates Axis D to
 * critical-alert regardless of the other axes.
 * @param {CoagulationResult} r
 * @returns {boolean}
 */
function hasCriticalValue(r) {
  return (
    r.criticalValuePresent ||
    r.overallResultStatus === 'critical' ||
    (r.inr !== null && r.inr > 8) ||
    (r.fibrinogenGL !== null && r.fibrinogenGL < 1.0) ||
    hasDicPicture(r)
  );
}

/**
 * A disseminated-intravascular-coagulation (DIC) picture: low fibrinogen plus a
 * raised D-dimer plus a prolonged PT or APTT, indicating a consumptive
 * coagulopathy.
 * @param {CoagulationResult} r
 * @returns {boolean}
 */
function hasDicPicture(r) {
  const lowFibrinogen = r.fibrinogenGL !== null && r.fibrinogenGL < 1.5;
  const highDDimer = r.dDimer !== null && r.dDimer >= 500;
  const prolongedPt = r.prothrombinTimeSeconds !== null && r.prothrombinTimeSeconds > 14;
  const prolongedAptt =
    r.activatedPartialThromboplastinTimeSeconds !== null &&
    r.activatedPartialThromboplastinTimeSeconds > 40;
  return lowFibrinogen && highDDimer && (prolongedPt || prolongedAptt);
}

/**
 * Whether any reported result value is outside its adult reference range.
 * @param {CoagulationResult} r
 * @returns {boolean}
 */
function hasAnyAbnormalValue(r) {
  return (
    (r.prothrombinTimeSeconds !== null && r.prothrombinTimeSeconds > 14) ||
    (r.inr !== null && r.inr > 1.2) ||
    (r.activatedPartialThromboplastinTimeSeconds !== null &&
      r.activatedPartialThromboplastinTimeSeconds > 40) ||
    (r.apttRatio !== null && r.apttRatio > 1.2) ||
    (r.fibrinogenGL !== null && (r.fibrinogenGL < 2.0 || r.fibrinogenGL > 4.0)) ||
    (r.dDimer !== null && r.dDimer >= 500) ||
    (r.thrombinTimeSeconds !== null && r.thrombinTimeSeconds > 20)
  );
}

/**
 * Whether an isolated APTT prolongation is present (APTT high but PT/INR normal).
 * @param {CoagulationResult} r
 * @returns {boolean}
 */
function hasIsolatedApttProlongation(r) {
  const apttProlonged =
    (r.activatedPartialThromboplastinTimeSeconds !== null &&
      r.activatedPartialThromboplastinTimeSeconds > 40) ||
    (r.apttRatio !== null && r.apttRatio > 1.2);
  const ptNormal =
    (r.prothrombinTimeSeconds === null || r.prothrombinTimeSeconds <= 14) &&
    (r.inr === null || r.inr <= 1.2);
  return apttProlonged && ptNormal;
}

/**
 * Whether at least one numeric result value has been recorded.
 * @param {CoagulationResult} r
 * @returns {boolean}
 */
function hasAnyResultValue(r) {
  return (
    r.prothrombinTimeSeconds !== null ||
    r.inr !== null ||
    r.activatedPartialThromboplastinTimeSeconds !== null ||
    r.apttRatio !== null ||
    r.fibrinogenGL !== null ||
    r.dDimer !== null ||
    r.thrombinTimeSeconds !== null ||
    r.factorAssays.trim() !== ''
  );
}

/**
 * Whether the specimen condition compromises interpretation.
 * @param {CoagulationResult} r
 * @returns {boolean}
 */
function hasSpecimenQualityIssue(r) {
  return (
    r.specimenCondition === 'clotted' ||
    r.specimenCondition === 'underfilled' ||
    r.specimenCondition === 'haemolysed' ||
    r.specimenCondition === 'insufficient'
  );
}

// ----------------------------------------------------------------------
// Axis A — result classification (mirrors `classification-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical (panic) value is present (INR > 8, fibrinogen < 1.0 g/L,
 *   a DIC picture, or an explicitly flagged critical value / status).
 * - inconclusive: the specimen condition compromises interpretation (clotted,
 *   underfilled, haemolysed, insufficient) and no confident impression exists.
 * - abnormal: the reported status is abnormal, or any result value is outside
 *   its reference range.
 * - normal: a reported normal status with no abnormal value.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 *
 * @param {CoagulationResult} r
 * @returns {{ resultClassification: ResultClassification, firedRules: FiredRule[] }}
 */
function classifyResult(r) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  if (hasCriticalValue(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-CRITICAL-01',
      axis: 'classification',
      category: 'critical-value',
      description:
        'A critical value (INR > 8, fibrinogen < 1.0 g/L, a DIC picture, or a flagged critical result) is present; classified as critical.'
    });
    return { resultClassification: 'critical', firedRules };
  }

  if (hasSpecimenQualityIssue(r) && r.impression.trim() === '') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-01',
      axis: 'classification',
      category: 'specimen-quality',
      description:
        'Specimen condition compromises interpretation and no impression was recorded; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (r.overallResultStatus === 'abnormal' || hasAnyAbnormalValue(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-01',
      axis: 'classification',
      category: 'abnormal-value',
      description:
        'The reported status is abnormal or one or more result values are outside the reference range; classified as abnormal.'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  firedRules.push({
    ruleId: 'R-CLASS-NORMAL-01',
    axis: 'classification',
    category: 'no-abnormal-value',
    description:
      'No abnormal or critical result values on a satisfactory specimen; classified as normal.'
  });
  return { resultClassification: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis B — abnormality severity (mirrors `severity-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in RCPath
 * actionable-reporting principles and BSH haemostasis structured-reporting
 * labels (anticoagulant-effect, DIC-picture, isolated-APTT-prolongation):
 * - major: a critical value, or a DIC picture.
 * - moderate: an actionable abnormal value outside the reference range.
 * - minor: a borderline anticoagulant effect with no other abnormality.
 * - none: a normal result.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * structured-reporting workflows.
 *
 * @param {CoagulationResult} r
 * @param {ResultClassification} classification
 * @returns {{ abnormalitySeverity: AbnormalitySeverity, reportingCategory: string,
 *             firedRules: FiredRule[] }}
 */
function gradeSeverity(r, classification) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  if (hasCriticalValue(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-01',
      axis: 'severity',
      category: 'critical-value',
      description: 'Critical value present; abnormality severity graded major.'
    });
    const category = hasDicPicture(r) ? 'DIC-picture' : 'critical-actionable';
    return { abnormalitySeverity: 'major', reportingCategory: category, firedRules };
  }

  if (hasDicPicture(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-02',
      axis: 'severity',
      category: 'dic-picture',
      description:
        'A DIC picture (low fibrinogen, raised D-dimer, and prolonged PT/APTT) is present; abnormality severity graded major.'
    });
    return { abnormalitySeverity: 'major', reportingCategory: 'DIC-picture', firedRules };
  }

  if (hasIsolatedApttProlongation(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-02',
      axis: 'severity',
      category: 'isolated-aptt-prolongation',
      description:
        'An isolated APTT prolongation (with a normal PT/INR) is present; severity graded moderate.'
    });
    return {
      abnormalitySeverity: 'moderate',
      reportingCategory: 'isolated-APTT-prolongation',
      firedRules
    };
  }

  if (r.overallResultStatus === 'abnormal' || hasAnyAbnormalValue(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-01',
      axis: 'severity',
      category: 'actionable-value',
      description:
        'One or more result values are outside the reference range; severity graded moderate.'
    });
    const category = r.onAnticoagulant ? 'anticoagulant-effect' : 'abnormal-haemostasis';
    return { abnormalitySeverity: 'moderate', reportingCategory: category, firedRules };
  }

  if (r.onAnticoagulant) {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-01',
      axis: 'severity',
      category: 'anticoagulant-effect',
      description:
        'Patient is on anticoagulant therapy with values within the expected therapeutic range; severity graded minor.'
    });
    return { abnormalitySeverity: 'minor', reportingCategory: 'anticoagulant-effect', firedRules };
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
    category: 'no-abnormal-value',
    description: 'No abnormal value; abnormality severity graded none.'
  });
  return { abnormalitySeverity: 'none', reportingCategory: 'normal-haemostasis', firedRules };
}

// ----------------------------------------------------------------------
// Axis C — report completeness (mirrors `completeness-rules.ts`)
// ----------------------------------------------------------------------

/**
 * The five mandatory report sections per RCPath / BSH reporting standards:
 * clinical history, result values, comparison, findings, and impression.
 *
 * @type {Array<{ ruleId: string, category: string, label: string,
 *                present: (r: CoagulationResult) => boolean }>}
 */
const completenessSections = [
  {
    ruleId: 'R-COMP-HISTORY-01',
    category: 'history',
    label: 'clinical history',
    present: (r) => r.clinicalHistory.trim() !== ''
  },
  {
    ruleId: 'R-COMP-RESULT-VALUES-01',
    category: 'result-values',
    label: 'result values',
    present: (r) => hasAnyResultValue(r)
  },
  {
    ruleId: 'R-COMP-COMPARISON-01',
    category: 'comparison',
    label: 'comparison with previous results',
    present: (r) => r.comparisonWithPrevious.trim() !== ''
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
 * @param {CoagulationResult} r
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
 * critical value auto-escalates to critical-alert regardless of the other axes
 * (the safety invariant). The least-urgent band is chosen only when no rule
 * fires.
 *
 * @param {CoagulationResult} r
 * @param {ResultClassification} classification
 * @param {AbnormalitySeverity} severity
 * @returns {{ followUpUrgency: FollowUpUrgency, targetTimeframe: string,
 *             recommendedAction: string, firedRules: FiredRule[] }}
 */
function gradeFollowUp(r, classification, severity) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  // ─── critical-alert: auto-escalation invariant ───
  if (hasCriticalValue(r) || classification === 'critical') {
    firedRules.push({
      ruleId: 'R-FU-CRITICAL-01',
      axis: 'follow-up',
      category: 'critical-result',
      description:
        'Critical value auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
    });
    return {
      followUpUrgency: 'critical-alert',
      targetTimeframe: 'immediate',
      recommendedAction:
        'Communicate the critical result directly to the referrer now, consider reversal / replacement therapy, and document the conversation.',
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
      recommendedAction: 'Arrange urgent clinical review and expedite onward referral.',
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
      recommendedAction: 'Recommend repeat testing or specialist referral as clinically indicated.',
      firedRules
    };
  }

  if (hasIsolatedApttProlongation(r)) {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-03',
      axis: 'follow-up',
      category: 'isolated-aptt-prolongation',
      description:
        'Isolated APTT prolongation; mixing studies / factor or inhibitor work-up recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 2 weeks',
      recommendedAction:
        'Recommend mixing studies and factor / inhibitor work-up to characterise the isolated APTT prolongation.',
      firedRules
    };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-02',
      axis: 'follow-up',
      category: 'inconclusive',
      description: 'Inconclusive result; repeat sampling recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 2 weeks',
      recommendedAction: 'Recommend a repeat specimen to resolve the inconclusive result.',
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
    recommendedAction: 'No specific follow-up required; manage per usual care.',
    firedRules
  };
}

export { hasCriticalValue, hasDicPicture, hasAnyAbnormalValue, hasIsolatedApttProlongation, hasAnyResultValue, hasSpecimenQualityIssue, classifyResult, gradeSeverity, gradeCompleteness, gradeFollowUp };
