// Declarative four-axis grading rules for the Lumbar Puncture Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine modules
// `src/lib/engine/{classification-rules,severity-rules,completeness-rules,
// follow-up-rules,utils}.ts` (predicates only — display helpers live in
// `types.js`). Rule IDs, categories, and descriptions are stable and identical
// across every front-end and the back-end; rows mirror the
// `lumbar_puncture_test_result_grade_rule` SQL table.
//
// The grader (`grader.js`) composes the four axis functions into the full
// `GradingResult`; `flags.js` raises the safety-critical flags independently.

/**
 * @typedef {import('./types.js').LumbarPunctureResult} LumbarPunctureResult
 * @typedef {import('./types.js').ResultClassification} ResultClassification
 * @typedef {import('./types.js').AbnormalitySeverity} AbnormalitySeverity
 * @typedef {import('./types.js').FollowUpUrgency} FollowUpUrgency
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// ----------------------------------------------------------------------
// Structured-findings predicates (mirror `utils.ts`)
// ----------------------------------------------------------------------

/**
 * Whether the CSF culture grew an organism (a positive culture is a critical
 * result). A free-text culture is treated as positive when it is non-empty and
 * does not match a recognised negative phrase.
 * @param {LumbarPunctureResult} r
 * @returns {boolean}
 */
function culturePositive(r) {
  const text = r.cultureResult.trim().toLowerCase();
  if (text === '') return false;
  const negativePhrases = ['no growth', 'negative', 'sterile', 'no organism', 'not grown', 'awaited', 'pending'];
  return !negativePhrases.some((p) => text.includes(p));
}

/**
 * A critical CSF result — a bacterial meningitis pattern, a suggested
 * subarachnoid haemorrhage, or a positive culture — auto-escalates Axis D to
 * critical-alert. Mirrors the back-end invariant.
 * @param {LumbarPunctureResult} r
 * @returns {boolean}
 */
function hasCriticalFinding(r) {
  return (
    r.bacterialMeningitisPattern ||
    r.subarachnoidHaemorrhageSuggested ||
    culturePositive(r)
  );
}

/**
 * Whether any structured abnormal finding / pattern is present.
 * @param {LumbarPunctureResult} r
 * @returns {boolean}
 */
function hasAnyAbnormalFinding(r) {
  return (
    r.raisedProtein ||
    r.pleocytosis ||
    r.lowGlucose ||
    r.bacterialMeningitisPattern ||
    r.viralPattern ||
    r.subarachnoidHaemorrhageSuggested ||
    r.oligoclonalBands === 'positive' ||
    r.xanthochromia === 'positive' ||
    culturePositive(r)
  );
}

/**
 * Whether the core CSF dataset is too sparse to interpret.
 * @param {LumbarPunctureResult} r
 * @returns {boolean}
 */
function isUninterpretable(r) {
  return (
    r.csfAppearance === '' &&
    r.csfWhiteCellCount === null &&
    r.csfProteinGL === null &&
    r.csfGlucoseMmolL === null &&
    !hasAnyAbnormalFinding(r) &&
    !r.normalCsf
  );
}

/**
 * Derives the structured-reporting category (CSF pattern label) for downstream
 * structured-reporting workflows.
 * @param {LumbarPunctureResult} r
 * @returns {string}
 */
function deriveReportingCategory(r) {
  if (r.bacterialMeningitisPattern || culturePositive(r)) return 'bacterial-pattern';
  if (r.subarachnoidHaemorrhageSuggested || r.xanthochromia === 'positive') return 'SAH-pattern';
  if (r.viralPattern) return 'viral-pattern';
  if (r.oligoclonalBands === 'positive') return 'inflammatory-demyelinating';
  if (r.pleocytosis) return 'pleocytosis';
  if (r.raisedProtein) return 'raised-protein';
  if (r.normalCsf) return 'normal';
  return 'indeterminate';
}

// ----------------------------------------------------------------------
// Axis A — result classification (mirrors `classification-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical CSF result (bacterial meningitis pattern, suggested
 *   subarachnoid haemorrhage, or a positive culture) is present.
 * - inconclusive: the core CSF dataset is too sparse to interpret, or the report
 *   is internally contradictory (an abnormal pattern asserted with no impression).
 * - abnormal: any abnormal structured finding / pattern is present.
 * - normal: no abnormal finding and a recorded normal-CSF interpretation.
 *
 * @param {LumbarPunctureResult} r
 * @returns {{ resultClassification: ResultClassification, firedRules: FiredRule[] }}
 */
function classifyResult(r) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  if (hasCriticalFinding(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-CRITICAL-01',
      axis: 'classification',
      category: 'critical-result',
      description:
        'A critical CSF result (bacterial meningitis pattern, suggested subarachnoid haemorrhage, or positive culture) is present; classified as critical.'
    });
    return { resultClassification: 'critical', firedRules };
  }

  if (isUninterpretable(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-01',
      axis: 'classification',
      category: 'insufficient-data',
      description:
        'Insufficient CSF data recorded to interpret the analysis; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (hasAnyAbnormalFinding(r) && r.impression.trim() === '') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-02',
      axis: 'classification',
      category: 'abnormal-no-impression',
      description:
        'An abnormal CSF pattern is asserted but no impression was recorded; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (hasAnyAbnormalFinding(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-01',
      axis: 'classification',
      category: 'abnormal-finding',
      description: 'One or more abnormal structured CSF findings are present; classified as abnormal.'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  firedRules.push({
    ruleId: 'R-CLASS-NORMAL-01',
    axis: 'classification',
    category: 'no-abnormal-finding',
    description: 'No abnormal structured CSF findings on an interpretable analysis; classified as normal.'
  });
  return { resultClassification: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis B — abnormality severity (mirrors `severity-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in standard CSF
 * interpretation and NICE NG240 / UK NEQAS thresholds:
 * - major: a critical CSF result (bacterial meningitis pattern, suggested SAH,
 *   or positive culture).
 * - moderate: an actionable abnormal pattern (viral pattern, low glucose,
 *   combined pleocytosis with raised protein, or positive xanthochromia).
 * - minor: an isolated single abnormality (raised protein only, isolated
 *   pleocytosis, or positive oligoclonal bands).
 * - none: a normal CSF analysis.
 *
 * @param {LumbarPunctureResult} r
 * @param {ResultClassification} classification
 * @returns {{ abnormalitySeverity: AbnormalitySeverity, reportingCategory: string,
 *             firedRules: FiredRule[] }}
 */
function gradeSeverity(r, classification) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  const reportingCategory = r.reportingCategory.trim() !== '' ? r.reportingCategory : deriveReportingCategory(r);

  if (hasCriticalFinding(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-01',
      axis: 'severity',
      category: 'critical-result',
      description: 'Critical CSF result present; abnormality severity graded major.'
    });
    return { abnormalitySeverity: 'major', reportingCategory, firedRules };
  }

  const moderate =
    r.viralPattern ||
    r.lowGlucose ||
    (r.pleocytosis && r.raisedProtein) ||
    r.xanthochromia === 'positive';

  if (moderate) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-01',
      axis: 'severity',
      category: 'actionable-pattern',
      description:
        'An actionable abnormal CSF pattern (viral pattern, low glucose, combined pleocytosis with raised protein, or positive xanthochromia) is present; severity graded moderate.'
    });
    return { abnormalitySeverity: 'moderate', reportingCategory, firedRules };
  }

  const minor =
    r.raisedProtein ||
    r.pleocytosis ||
    r.oligoclonalBands === 'positive';

  if (minor) {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-01',
      axis: 'severity',
      category: 'isolated-abnormality',
      description: 'An isolated single CSF abnormality is present; abnormality severity graded minor.'
    });
    return { abnormalitySeverity: 'minor', reportingCategory, firedRules };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-SEV-NONE-02',
      axis: 'severity',
      category: 'inconclusive',
      description: 'Inconclusive analysis; abnormality severity not established.'
    });
    return { abnormalitySeverity: 'none', reportingCategory: 'indeterminate', firedRules };
  }

  firedRules.push({
    ruleId: 'R-SEV-NONE-01',
    axis: 'severity',
    category: 'no-abnormal-finding',
    description: 'No abnormal CSF finding; abnormality severity graded none.'
  });
  return { abnormalitySeverity: 'none', reportingCategory: reportingCategory || 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis C — report completeness (mirrors `completeness-rules.ts`)
// ----------------------------------------------------------------------

/**
 * The five mandatory report sections for a CSF analysis report: clinical
 * history, CSF appearance, cell counts, biochemistry, and impression.
 *
 * @type {Array<{ ruleId: string, category: string, label: string,
 *                present: (r: LumbarPunctureResult) => boolean }>}
 */
const completenessSections = [
  {
    ruleId: 'R-COMP-HISTORY-01',
    category: 'history',
    label: 'clinical history',
    present: (r) => r.clinicalHistory.trim() !== ''
  },
  {
    ruleId: 'R-COMP-APPEARANCE-01',
    category: 'appearance',
    label: 'CSF appearance',
    present: (r) => r.csfAppearance !== ''
  },
  {
    ruleId: 'R-COMP-CELLCOUNTS-01',
    category: 'cell-counts',
    label: 'CSF cell counts',
    present: (r) => r.csfWhiteCellCount !== null || r.csfRedCellCount !== null
  },
  {
    ruleId: 'R-COMP-BIOCHEMISTRY-01',
    category: 'biochemistry',
    label: 'CSF biochemistry',
    present: (r) => r.csfProteinGL !== null || r.csfGlucoseMmolL !== null
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
 * @param {LumbarPunctureResult} r
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
 * critical CSF result auto-escalates to critical-alert regardless of the other
 * axes (the safety invariant). The least-urgent band is chosen only when no
 * rule fires.
 *
 * @param {LumbarPunctureResult} r
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
        'Critical CSF result auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
    });
    return {
      followUpUrgency: 'critical-alert',
      targetTimeframe: 'immediate',
      recommendedAction:
        'Communicate the critical result directly to the requesting / responsible clinician now, do not delay antibiotics for investigations (NICE NG240), and document the conversation.',
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
      recommendedAction: 'Recommend specialist review or repeat sampling as clinically indicated.',
      firedRules
    };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-02',
      axis: 'follow-up',
      category: 'inconclusive',
      description: 'Inconclusive analysis; repeat or additional CSF testing recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 2 weeks',
      recommendedAction: 'Recommend repeat lumbar puncture or additional CSF tests to resolve the inconclusive analysis.',
      firedRules
    };
  }

  if (severity === 'minor') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-03',
      axis: 'follow-up',
      category: 'minor-abnormality',
      description: 'Isolated minor abnormality; structured follow-up recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'per clinical pathway',
      recommendedAction:
        'Correlate the isolated CSF abnormality clinically and follow up per the relevant pathway.',
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
    recommendedAction: 'No specific CSF follow-up required; manage per usual care.',
    firedRules
  };
}

export { culturePositive, hasCriticalFinding, hasAnyAbnormalFinding, classifyResult, gradeSeverity, gradeCompleteness, gradeFollowUp };
