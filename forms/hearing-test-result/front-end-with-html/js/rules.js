// Declarative four-axis grading rules for the Hearing Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine modules
// `src/lib/engine/{classification-rules,severity-rules,completeness-rules,
// follow-up-rules,utils}.ts` (predicates only — display helpers live in
// `types.js`). Rule IDs, categories, and descriptions are stable and identical
// across every front-end and the back-end; rows mirror the
// `hearing_test_result_grade_rule` SQL table.
//
// The grader (`grader.js`) composes the four axis functions into the full
// `GradingResult`; `flags.js` raises the safety-critical flags independently.

/**
 * @typedef {import('./types.js').HearingResult} HearingResult
 * @typedef {import('./types.js').ResultClassification} ResultClassification
 * @typedef {import('./types.js').AbnormalitySeverity} AbnormalitySeverity
 * @typedef {import('./types.js').FollowUpUrgency} FollowUpUrgency
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// ----------------------------------------------------------------------
// Structured-findings predicates (mirror `utils.ts`)
// ----------------------------------------------------------------------

/**
 * A critical finding — sudden sensorineural hearing loss (an otological
 * emergency) or a marked asymmetry between ears (red flag for retrocochlear
 * pathology) — auto-escalates Axis D to critical-alert. Mirrors the back-end
 * invariant.
 * @param {HearingResult} r
 * @returns {boolean}
 */
function hasCriticalFinding(r) {
  return r.suddenSensorineuralLoss || r.asymmetricLoss;
}

/**
 * Whether any structured abnormal finding is present.
 * @param {HearingResult} r
 * @returns {boolean}
 */
function hasAnyAbnormalFinding(r) {
  const pta = worstPureToneAverage(r);
  return (
    r.hearingLossPresent ||
    r.asymmetricLoss ||
    r.suddenSensorineuralLoss ||
    r.conductiveComponent ||
    // gradeSeverity independently grades any worst pure-tone average >= 21
    // dB HL (mild loss or worse) from the raw measurement, even when the
    // hearingLossPresent checkbox itself is unset — Axis A must agree.
    (pta !== null && pta >= 21)
  );
}

/**
 * Whether the report demonstrates normal hearing with no abnormal finding.
 * @param {HearingResult} r
 * @returns {boolean}
 */
function isNormalHearing(r) {
  return r.normalHearing && !hasAnyAbnormalFinding(r);
}

/**
 * The more-severe (worse) of the two per-ear PTAs, or null if neither given.
 * @param {HearingResult} r
 * @returns {number | null}
 */
function worstPureToneAverage(r) {
  const values = [r.pureToneAverageRightDb, r.pureToneAverageLeftDb].filter(
    (v) => v !== null
  );
  if (values.length === 0) return null;
  return Math.max.apply(null, values);
}

// ----------------------------------------------------------------------
// Axis A — result classification (mirrors `classification-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical structured finding (sudden sensorineural hearing loss
 *   or marked asymmetry suggesting retrocochlear pathology) is present.
 * - inconclusive: the test was unreliable (poor reliability) with no confident
 *   impression.
 * - abnormal: any abnormal structured finding is present.
 * - normal: normal hearing on a reliable, interpretable test.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 *
 * @param {HearingResult} r
 * @returns {{resultClassification: ResultClassification, firedRules: FiredRule[]}}
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
        'A critical structured finding (sudden sensorineural hearing loss or marked asymmetry) is present; classified as critical.'
    });
    return { resultClassification: 'critical', firedRules };
  }

  if (r.testReliability === 'poor' && r.impression.trim() === '') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-01',
      axis: 'classification',
      category: 'unreliable-no-impression',
      description:
        'Test reliability was poor and no impression was recorded; classified as inconclusive.'
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

  if (isNormalHearing(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-NORMAL-01',
      axis: 'classification',
      category: 'normal-hearing',
      description:
        'Normal hearing on an interpretable test with no abnormal structured findings; classified as normal.'
    });
    return { resultClassification: 'normal', firedRules };
  }

  firedRules.push({
    ruleId: 'R-CLASS-NORMAL-02',
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
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in the British
 * Society of Audiology audiometric descriptors derived from the pure-tone
 * average (PTA, dB HL):
 * - major: a critical finding, or a severe/profound loss (worst PTA >= 71).
 * - moderate: a moderate / moderately-severe loss (worst PTA 41–70) or an
 *   actionable structured finding (hearing loss present, conductive component).
 * - minor: a mild loss (worst PTA 21–40).
 * - none: normal hearing (worst PTA <= 20 or no abnormal finding).
 *
 * The `reportingCategory` is a short BSA audiometric descriptor suitable for
 * downstream structured-reporting workflows.
 *
 * @param {HearingResult} r
 * @param {ResultClassification} classification
 * @returns {{abnormalitySeverity: AbnormalitySeverity, reportingCategory: string, firedRules: FiredRule[]}}
 */
function gradeSeverity(r, classification) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  const pta = worstPureToneAverage(r);

  if (hasCriticalFinding(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-01',
      axis: 'severity',
      category: 'critical-finding',
      description: 'Critical finding present; abnormality severity graded major.'
    });
    return { abnormalitySeverity: 'major', reportingCategory: 'critical-actionable', firedRules };
  }

  if (pta !== null && pta >= 71) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-02',
      axis: 'severity',
      category: 'severe-profound-loss',
      description:
        'Worst pure-tone average is 71 dB HL or greater (severe/profound); abnormality severity graded major.'
    });
    return { abnormalitySeverity: 'major', reportingCategory: 'severe-profound', firedRules };
  }

  if (pta !== null && pta >= 41) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-01',
      axis: 'severity',
      category: 'moderate-loss',
      description:
        'Worst pure-tone average is 41–70 dB HL (moderate / moderately-severe); severity graded moderate.'
    });
    return { abnormalitySeverity: 'moderate', reportingCategory: 'moderate-loss', firedRules };
  }

  const actionable = r.hearingLossPresent || r.conductiveComponent;
  if (actionable && (pta === null || pta >= 21)) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-02',
      axis: 'severity',
      category: 'actionable-finding',
      description:
        'An actionable abnormal finding (hearing loss present or conductive component) is present; severity graded moderate.'
    });
    const category = r.conductiveComponent ? 'conductive-component' : 'actionable-finding';
    return { abnormalitySeverity: 'moderate', reportingCategory: category, firedRules };
  }

  if (pta !== null && pta >= 21) {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-01',
      axis: 'severity',
      category: 'mild-loss',
      description: 'Worst pure-tone average is 21–40 dB HL (mild); abnormality severity graded minor.'
    });
    return { abnormalitySeverity: 'minor', reportingCategory: 'mild-loss', firedRules };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-SEV-NONE-02',
      axis: 'severity',
      category: 'inconclusive',
      description: 'Inconclusive test; abnormality severity not established.'
    });
    return { abnormalitySeverity: 'none', reportingCategory: 'indeterminate', firedRules };
  }

  if (hasAnyAbnormalFinding(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-02',
      axis: 'severity',
      category: 'abnormal-finding',
      description: 'An abnormal structured finding is present; abnormality severity graded minor.'
    });
    return { abnormalitySeverity: 'minor', reportingCategory: 'abnormal', firedRules };
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
 * The five mandatory report sections per BSA / NICE reporting standards:
 * clinical history, test reliability, measurements (pure-tone averages),
 * findings, and impression.
 *
 * @type {{ruleId: string, category: string, label: string,
 *         present: (r: HearingResult) => boolean}[]}
 */
const sections = [
  {
    ruleId: 'R-COMP-HISTORY-01',
    category: 'history',
    label: 'clinical history',
    present: (r) => r.clinicalHistory.trim() !== ''
  },
  {
    ruleId: 'R-COMP-RELIABILITY-01',
    category: 'reliability',
    label: 'test reliability',
    present: (r) => r.testReliability !== ''
  },
  {
    ruleId: 'R-COMP-MEASUREMENTS-01',
    category: 'measurements',
    label: 'pure-tone average measurements',
    present: (r) => r.pureToneAverageRightDb !== null || r.pureToneAverageLeftDb !== null
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
 * Returns the percentage (0–100, rounded) of mandatory report sections that
 * are present, plus an audit-trail rule for each missing section.
 *
 * @param {HearingResult} r
 * @returns {{reportCompletenessPercent: number, firedRules: FiredRule[]}}
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
 * Escalation ladder (routine → recommended → urgent → critical-alert). A
 * critical finding — sudden sensorineural hearing loss (an otological
 * emergency) or marked asymmetry (retrocochlear red flag) — auto-escalates to
 * critical-alert regardless of the other axes (the safety invariant). The
 * least-urgent band is chosen only when no rule fires.
 *
 * @param {HearingResult} r
 * @param {ResultClassification} classification
 * @param {AbnormalitySeverity} severity
 * @returns {{followUpUrgency: FollowUpUrgency, targetTimeframe: string,
 *            recommendedAction: string, firedRules: FiredRule[]}}
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
        'Critical finding (sudden sensorineural loss or marked asymmetry) auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
    });
    const action = r.suddenSensorineuralLoss
      ? 'Refer urgently to ENT as an otological emergency and communicate the critical result to the referrer now.'
      : 'Refer urgently to ENT for MRI of the internal auditory meatus to exclude retrocochlear pathology, and communicate the critical result now.';
    return {
      followUpUrgency: 'critical-alert',
      targetTimeframe: 'immediate',
      recommendedAction: action,
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
      targetTimeframe: 'within 2 weeks',
      recommendedAction: 'Arrange urgent ENT / audiology review and expedite onward referral.',
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
      targetTimeframe: 'within 6 weeks',
      recommendedAction:
        'Recommend hearing-aid assessment or specialist referral as clinically indicated.',
      firedRules
    };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-02',
      axis: 'follow-up',
      category: 'inconclusive',
      description: 'Inconclusive test; repeat or alternative testing recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 6 weeks',
      recommendedAction: 'Recommend repeat or alternative audiological testing to resolve the inconclusive result.',
      firedRules
    };
  }

  if (severity === 'minor' || hasAnyAbnormalFinding(r)) {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-03',
      axis: 'follow-up',
      category: 'minor-abnormality',
      description: 'Minor abnormality / hearing loss; structured audiology follow-up recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'per audiology pathway',
      recommendedAction:
        'Manage the hearing loss per the relevant audiology pathway (e.g. hearing-aid fitting, rehabilitation).',
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
    recommendedAction: 'No specific audiology follow-up required; manage per usual care.',
    firedRules
  };
}

export { hasCriticalFinding, hasAnyAbnormalFinding, isNormalHearing, worstPureToneAverage, classifyResult, gradeSeverity, gradeCompleteness, gradeFollowUp };
