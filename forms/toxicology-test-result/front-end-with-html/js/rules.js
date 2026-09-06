// Declarative four-axis grading rules for the Toxicology Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine modules
// `src/lib/engine/{classification-rules,severity-rules,completeness-rules,
// follow-up-rules,utils}.ts` (predicates only — display helpers live in
// `types.js`). Rule IDs, categories, and descriptions are stable and identical
// across every front-end and the back-end; rows mirror the
// `toxicology_test_result_grade_rule` SQL table.
//
// The grader (`grader.js`) composes the four axis functions into the full
// `GradingResult`; `flags.js` raises the safety-critical flags independently.

/**
 * @typedef {import('./types.js').ToxicologyResult} ToxicologyResult
 * @typedef {import('./types.js').ResultClassification} ResultClassification
 * @typedef {import('./types.js').AbnormalitySeverity} AbnormalitySeverity
 * @typedef {import('./types.js').FollowUpUrgency} FollowUpUrgency
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// ----------------------------------------------------------------------
// Toxic thresholds (mirror `severity-rules.ts`)
//
// Therapeutic / toxic thresholds (grounded in TOXBASE / NPIS and the MHRA
// paracetamol nomogram). Modest elevation of a narrow-range drug (lithium) or
// a clear poisoning threshold (carboxyhaemoglobin) raises severity.
// ----------------------------------------------------------------------

const LITHIUM_TOXIC_MMOL_L = 1.5;
const CARBOXYHAEMOGLOBIN_TOXIC_PERCENT = 10;
const SALICYLATE_TOXIC_MG_L = 300;

// ----------------------------------------------------------------------
// Toxicology predicates (mirror `utils.ts`)
// ----------------------------------------------------------------------

/**
 * A toxic result (paracetamol above the treatment line, or any
 * `toxicLevelPresent`) auto-escalates Axis D to critical-alert. Mirrors the
 * back-end invariant.
 * @param {ToxicologyResult} r
 * @returns {boolean}
 */
function hasToxicResult(r) {
  return r.toxicLevelPresent || r.paracetamolNomogram === 'above-treatment-line';
}

/**
 * Whether the report describes a critical conclusion or toxic level.
 * @param {ToxicologyResult} r
 * @returns {boolean}
 */
function isCriticalResult(r) {
  return (
    hasToxicResult(r) ||
    r.overallResultStatus === 'critical' ||
    // gradeSeverity independently grades lithium, carboxyhaemoglobin, or
    // salicylate above their toxic thresholds as major (R-SEV-MAJOR-02) —
    // Axis A must classify these critical too, or the study reports normal
    // despite a major severity grade. Deliberately not folded into
    // hasToxicResult itself: that would make R-SEV-MAJOR-02 unreachable dead
    // code, since gradeSeverity checks hasToxicResult first.
    (r.lithiumLevelMmolL !== null && r.lithiumLevelMmolL >= LITHIUM_TOXIC_MMOL_L) ||
    (r.carboxyhaemoglobinPercent !== null &&
      r.carboxyhaemoglobinPercent >= CARBOXYHAEMOGLOBIN_TOXIC_PERCENT) ||
    (r.salicylateLevelMgL !== null && r.salicylateLevelMgL >= SALICYLATE_TOXIC_MG_L)
  );
}

/**
 * Whether any assay result value has been recorded.
 * @param {ToxicologyResult} r
 * @returns {boolean}
 */
function hasAnyResultValue(r) {
  return (
    r.paracetamolLevelMgL !== null ||
    r.salicylateLevelMgL !== null ||
    r.ethanolLevel !== null ||
    r.lithiumLevelMmolL !== null ||
    r.digoxinLevel !== null ||
    r.carboxyhaemoglobinPercent !== null ||
    r.drugsOfAbuseScreen.trim() !== '' ||
    r.specificDrugLevel.trim() !== ''
  );
}

// ----------------------------------------------------------------------
// Axis A — result classification (mirrors `classification-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a toxic level is present (paracetamol above the treatment line,
 *   or `toxicLevelPresent`), or the clinician recorded an overall critical
 *   status.
 * - inconclusive: the specimen was insufficient, or no assay result value was
 *   recorded at all (nothing to interpret).
 * - abnormal: the clinician recorded an overall abnormal status.
 * - normal: an interpretable assay with no toxic or abnormal status.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 *
 * @param {ToxicologyResult} r
 * @returns {{ resultClassification: ResultClassification, firedRules: FiredRule[] }}
 */
function classifyResult(r) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  if (isCriticalResult(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-CRITICAL-01',
      axis: 'classification',
      category: 'toxic-level',
      description:
        'A toxic level is present (paracetamol above the treatment line, toxic level flag, a reported level over a recognised toxic threshold, or overall critical status); classified as critical.'
    });
    return { resultClassification: 'critical', firedRules };
  }

  if (r.specimenCondition === 'insufficient') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-01',
      axis: 'classification',
      category: 'insufficient-specimen',
      description: 'Specimen was insufficient; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (!hasAnyResultValue(r) && r.overallResultStatus === '') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-02',
      axis: 'classification',
      category: 'no-result-value',
      description:
        'No assay result value and no overall status recorded; nothing to interpret. Classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (r.overallResultStatus === 'abnormal') {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-01',
      axis: 'classification',
      category: 'abnormal-status',
      description: 'Overall result status recorded as abnormal; classified as abnormal.'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  firedRules.push({
    ruleId: 'R-CLASS-NORMAL-01',
    axis: 'classification',
    category: 'no-abnormal-result',
    description: 'No toxic or abnormal result on an interpretable assay; classified as normal.'
  });
  return { resultClassification: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis B — abnormality severity (mirrors `severity-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in TOXBASE /
 * NPIS toxic-threshold guidance and the MHRA paracetamol treatment nomogram:
 * - major: a toxic level (paracetamol above the treatment line, toxic-level
 *   flag, or a level over a recognised toxic threshold).
 * - moderate: an actionable abnormal status without a frank toxic level.
 * - minor: a result value present but within range, with no abnormal status.
 * - none: a normal study with no result value.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * structured-reporting workflows (e.g. a paracetamol-nomogram band or a
 * therapeutic / toxic descriptor).
 *
 * @param {ToxicologyResult} r
 * @param {ResultClassification} classification
 * @returns {{ abnormalitySeverity: AbnormalitySeverity, reportingCategory: string,
 *             firedRules: FiredRule[] }}
 */
function gradeSeverity(r, classification) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  if (hasToxicResult(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-01',
      axis: 'severity',
      category: 'toxic-level',
      description: 'Toxic level present; abnormality severity graded major.'
    });
    const category =
      r.paracetamolNomogram === 'above-treatment-line'
        ? 'paracetamol-above-treatment-line'
        : 'toxic-range';
    return { abnormalitySeverity: 'major', reportingCategory: category, firedRules };
  }

  const overThreshold =
    (r.lithiumLevelMmolL !== null && r.lithiumLevelMmolL >= LITHIUM_TOXIC_MMOL_L) ||
    (r.carboxyhaemoglobinPercent !== null &&
      r.carboxyhaemoglobinPercent >= CARBOXYHAEMOGLOBIN_TOXIC_PERCENT) ||
    (r.salicylateLevelMgL !== null && r.salicylateLevelMgL >= SALICYLATE_TOXIC_MG_L);

  if (overThreshold) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-02',
      axis: 'severity',
      category: 'over-toxic-threshold',
      description:
        'A reported level is over a recognised toxic threshold (lithium, carboxyhaemoglobin, or salicylate); severity graded major.'
    });
    return { abnormalitySeverity: 'major', reportingCategory: 'toxic-range', firedRules };
  }

  if (r.overallResultStatus === 'abnormal' || classification === 'abnormal') {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-01',
      axis: 'severity',
      category: 'abnormal-status',
      description:
        'An actionable abnormal result is present without a frank toxic level; severity graded moderate.'
    });
    return { abnormalitySeverity: 'moderate', reportingCategory: 'elevated-range', firedRules };
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

  if (r.paracetamolNomogram === 'below-treatment-line') {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-01',
      axis: 'severity',
      category: 'below-treatment-line',
      description:
        'Paracetamol level is below the treatment line; a reassuring interpreted result. Severity graded minor.'
    });
    return {
      abnormalitySeverity: 'minor',
      reportingCategory: 'paracetamol-below-treatment-line',
      firedRules
    };
  }

  firedRules.push({
    ruleId: 'R-SEV-NONE-01',
    axis: 'severity',
    category: 'no-abnormal-result',
    description: 'No abnormal result; abnormality severity graded none.'
  });
  return { abnormalitySeverity: 'none', reportingCategory: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis C — report completeness (mirrors `completeness-rules.ts`)
// ----------------------------------------------------------------------

/**
 * The five mandatory report sections for a toxicology report: clinical
 * history, specimen condition, result values, interpretation (findings
 * narrative), and impression.
 *
 * @type {Array<{ ruleId: string, category: string, label: string,
 *                present: (r: ToxicologyResult) => boolean }>}
 */
const completenessSections = [
  {
    ruleId: 'R-COMP-HISTORY-01',
    category: 'history',
    label: 'clinical history',
    present: (r) => r.clinicalHistory.trim() !== ''
  },
  {
    ruleId: 'R-COMP-SPECIMEN-01',
    category: 'specimen',
    label: 'specimen condition',
    present: (r) => r.specimenCondition !== ''
  },
  {
    ruleId: 'R-COMP-RESULTS-01',
    category: 'result-values',
    label: 'result values',
    present: (r) => hasAnyResultValue(r)
  },
  {
    ruleId: 'R-COMP-INTERPRETATION-01',
    category: 'interpretation',
    label: 'interpretation / findings narrative',
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
 * @param {ToxicologyResult} r
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
 * Escalation ladder (routine → recommended → urgent → critical-alert). A toxic
 * result (paracetamol above the treatment line, or `toxicLevelPresent`)
 * auto-escalates to critical-alert regardless of the other axes (the safety
 * invariant), with an urgent antidote action (start N-acetylcysteine / NAC for
 * paracetamol). The least-urgent band is chosen only when no rule fires.
 *
 * @param {ToxicologyResult} r
 * @param {ResultClassification} classification
 * @param {AbnormalitySeverity} severity
 * @returns {{ followUpUrgency: FollowUpUrgency, targetTimeframe: string,
 *             recommendedAction: string, firedRules: FiredRule[] }}
 */
function gradeFollowUp(r, classification, severity) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  // ─── critical-alert: auto-escalation invariant ───
  if (hasToxicResult(r) || classification === 'critical') {
    firedRules.push({
      ruleId: 'R-FU-CRITICAL-01',
      axis: 'follow-up',
      category: 'critical-result',
      description:
        'Toxic level auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
    });
    const paracetamol = r.paracetamolNomogram === 'above-treatment-line';
    return {
      followUpUrgency: 'critical-alert',
      targetTimeframe: 'immediate',
      recommendedAction: paracetamol
        ? 'Start N-acetylcysteine (NAC) now, communicate the critical result directly to the requester, and document the conversation.'
        : 'Start the appropriate antidote / urgent treatment now, communicate the critical result directly to the requester, and document the conversation.',
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
      recommendedAction: 'Recommend a repeat level or specialist review as clinically indicated.',
      firedRules
    };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-02',
      axis: 'follow-up',
      category: 'inconclusive',
      description: 'Inconclusive study; repeat or alternative assay recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 2 weeks',
      recommendedAction: 'Recommend a repeat or alternative assay to resolve the inconclusive study.',
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
    recommendedAction: 'No specific toxicology follow-up required; manage per usual care.',
    firedRules
  };
}

export { LITHIUM_TOXIC_MMOL_L, CARBOXYHAEMOGLOBIN_TOXIC_PERCENT, SALICYLATE_TOXIC_MG_L, hasToxicResult, isCriticalResult, hasAnyResultValue, classifyResult, gradeSeverity, gradeCompleteness, gradeFollowUp };
