// Declarative four-axis grading rules for the Sleep Study Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine modules
// `src/lib/engine/{classification-rules,severity-rules,completeness-rules,
// follow-up-rules,utils}.ts` (predicates only — display helpers live in
// `types.js`). Rule IDs, categories, and descriptions are stable and identical
// across every front-end and the back-end; rows mirror the
// `sleep_study_test_result_grade_rule` SQL table.
//
// The grader (`grader.js`) composes the four axis functions into the full
// `GradingResult`; `flags.js` raises the safety-critical flags independently.

/**
 * @typedef {import('./types.js').SleepStudyResult} SleepStudyResult
 * @typedef {import('./types.js').ResultClassification} ResultClassification
 * @typedef {import('./types.js').AbnormalitySeverity} AbnormalitySeverity
 * @typedef {import('./types.js').FollowUpUrgency} FollowUpUrgency
 * @typedef {import('./types.js').OsaSeverity} OsaSeverity
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// ----------------------------------------------------------------------
// Structured-findings predicates (mirror `utils.ts`)
// ----------------------------------------------------------------------

/** AASM AHI severity threshold (events/hour) for severe OSA. */
const SEVERE_AHI_THRESHOLD = 30;

/**
 * Whether the recorded AHI corresponds to the severe band (>= 30).
 * @param {SleepStudyResult} r
 * @returns {boolean}
 */
function isSevereAhi(r) {
  return r.apnoeaHypopnoeaIndex !== null && r.apnoeaHypopnoeaIndex >= SEVERE_AHI_THRESHOLD;
}

/**
 * A critical finding — severe OSA (AHI >= 30) with significant desaturation, or
 * nocturnal hypoventilation — auto-escalates Axis D to critical-alert. Mirrors
 * the back-end invariant.
 * @param {SleepStudyResult} r
 * @returns {boolean}
 */
function hasCriticalFinding(r) {
  return (isSevereAhi(r) && r.significantDesaturation) || r.nocturnalHypoventilation;
}

/**
 * Whether any structured abnormal finding (sleep-disordered breathing) is present.
 * @param {SleepStudyResult} r
 * @returns {boolean}
 */
function hasAnyAbnormalFinding(r) {
  return (
    r.obstructiveSleepApnoea ||
    r.centralSleepApnoea ||
    r.nocturnalHypoventilation ||
    r.significantDesaturation
  );
}

/**
 * Whether the report describes only periodic limb movements (no sleep-disordered
 * breathing and not flagged as a normal study).
 * @param {SleepStudyResult} r
 * @returns {boolean}
 */
function hasOnlyPeriodicLimbMovements(r) {
  return r.periodicLimbMovements && !hasAnyAbnormalFinding(r);
}

/**
 * Maps an AHI value to the AASM OSA severity band.
 * @param {number | null} ahi
 * @returns {OsaSeverity}
 */
function ahiSeverityBand(ahi) {
  if (ahi === null) return '';
  if (ahi < 5) return 'none';
  if (ahi < 15) return 'mild';
  if (ahi < 30) return 'moderate';
  return 'severe';
}

/**
 * A free-text structured-reporting label for the AHI severity band.
 * @param {number | null} ahi
 * @returns {string}
 */
function ahiReportingCategory(ahi) {
  switch (ahiSeverityBand(ahi)) {
    case 'none': return 'No OSA (AHI <5)';
    case 'mild': return 'Mild OSA (AHI 5 to <15)';
    case 'moderate': return 'Moderate OSA (AHI 15 to <30)';
    case 'severe': return 'Severe OSA (AHI >=30)';
    default: return 'AHI not recorded';
  }
}

// ----------------------------------------------------------------------
// Axis A — result classification (mirrors `classification-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical finding (severe OSA with significant desaturation, or
 *   nocturnal hypoventilation) is present.
 * - inconclusive: the study failed, or was limited with no confident impression.
 * - abnormal: any abnormal structured finding (sleep-disordered breathing) is
 *   present, or periodic limb movements only.
 * - normal: no abnormal finding and an adequate study.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 *
 * @param {SleepStudyResult} r
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
        'A critical finding (severe OSA with significant desaturation, or nocturnal hypoventilation) is present; classified as critical.'
    });
    return { resultClassification: 'critical', firedRules };
  }

  if (r.studyAdequacy === 'failed') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-01',
      axis: 'classification',
      category: 'failed-study',
      description: 'Study failed; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (r.studyAdequacy === 'limited' && r.impression.trim() === '') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-02',
      axis: 'classification',
      category: 'limited-no-impression',
      description:
        'Study was limited and no impression was recorded; classified as inconclusive.'
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

  if (hasOnlyPeriodicLimbMovements(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-02',
      axis: 'classification',
      category: 'periodic-limb-movements',
      description:
        'Periodic limb movements only (no sleep-disordered breathing); classified as abnormal (not a normal study).'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  firedRules.push({
    ruleId: 'R-CLASS-NORMAL-01',
    axis: 'classification',
    category: 'no-abnormal-finding',
    description: 'No abnormal structured findings on an interpretable study; classified as normal.'
  });
  return { resultClassification: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis B — abnormality severity (mirrors `severity-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in the AASM AHI
 * severity bands (none <5, mild 5 to <15, moderate 15 to <30, severe >=30)
 * interpreted alongside the desaturation burden:
 * - major: a critical finding, or severe OSA (AHI >= 30).
 * - moderate: moderate OSA (AHI 15 to <30) or another actionable finding.
 * - minor: mild OSA, or periodic-limb-movements only.
 * - none: a normal study.
 *
 * The `reportingCategory` is the AHI severity-band label suitable for
 * downstream structured-reporting workflows.
 *
 * @param {SleepStudyResult} r
 * @param {ResultClassification} classification
 * @returns {{ abnormalitySeverity: AbnormalitySeverity, reportingCategory: string,
 *             firedRules: FiredRule[] }}
 */
function gradeSeverity(r, classification) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  const band = ahiSeverityBand(r.apnoeaHypopnoeaIndex);
  const category = ahiReportingCategory(r.apnoeaHypopnoeaIndex);

  if (hasCriticalFinding(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-01',
      axis: 'severity',
      category: 'critical-finding',
      description: 'Critical finding present; abnormality severity graded major.'
    });
    return { abnormalitySeverity: 'major', reportingCategory: category, firedRules };
  }

  if (band === 'severe') {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-02',
      axis: 'severity',
      category: 'severe-osa',
      description: 'Severe OSA (AHI >= 30); abnormality severity graded major.'
    });
    return { abnormalitySeverity: 'major', reportingCategory: category, firedRules };
  }

  const actionable =
    band === 'moderate' ||
    r.centralSleepApnoea ||
    r.significantDesaturation;

  if (actionable) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-01',
      axis: 'severity',
      category: 'actionable-finding',
      description:
        'An actionable abnormal finding (moderate OSA, central sleep apnoea, or significant desaturation) is present; severity graded moderate.'
    });
    return { abnormalitySeverity: 'moderate', reportingCategory: category, firedRules };
  }

  if (band === 'mild' || r.obstructiveSleepApnoea) {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-01',
      axis: 'severity',
      category: 'mild-osa',
      description: 'Mild OSA; abnormality severity graded minor.'
    });
    return { abnormalitySeverity: 'minor', reportingCategory: category, firedRules };
  }

  if (hasOnlyPeriodicLimbMovements(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-02',
      axis: 'severity',
      category: 'periodic-limb-movements',
      description: 'Periodic limb movements only; abnormality severity graded minor.'
    });
    return { abnormalitySeverity: 'minor', reportingCategory: 'Periodic limb movements', firedRules };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-SEV-NONE-02',
      axis: 'severity',
      category: 'inconclusive',
      description: 'Inconclusive study; abnormality severity not established.'
    });
    return { abnormalitySeverity: 'none', reportingCategory: 'Indeterminate', firedRules };
  }

  firedRules.push({
    ruleId: 'R-SEV-NONE-01',
    axis: 'severity',
    category: 'no-abnormal-finding',
    description: 'No abnormal finding; abnormality severity graded none.'
  });
  return { abnormalitySeverity: 'none', reportingCategory: category, firedRules };
}

// ----------------------------------------------------------------------
// Axis C — report completeness (mirrors `completeness-rules.ts`)
// ----------------------------------------------------------------------

/**
 * The five mandatory report sections per AASM / structured-reporting standards:
 * clinical history, study technique/adequacy, comparison, findings, and
 * impression.
 *
 * @type {Array<{ ruleId: string, category: string, label: string,
 *                present: (r: SleepStudyResult) => boolean }>}
 */
const completenessSections = [
  {
    ruleId: 'R-COMP-HISTORY-01',
    category: 'history',
    label: 'clinical history',
    present: (r) => r.clinicalHistory.trim() !== ''
  },
  {
    ruleId: 'R-COMP-TECHNIQUE-01',
    category: 'technique',
    label: 'study technique / adequacy',
    present: (r) => r.studyType !== '' && r.studyAdequacy !== ''
  },
  {
    ruleId: 'R-COMP-COMPARISON-01',
    category: 'comparison',
    label: 'comparison with previous studies',
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
 * @param {SleepStudyResult} r
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
 * critical finding — severe OSA with significant desaturation, or nocturnal
 * hypoventilation — auto-escalates to critical-alert regardless of the other
 * axes (the safety invariant), triggering an urgent CPAP / ventilation review
 * and noting occupational-driver (DVLA) implications. The least-urgent band is
 * chosen only when no rule fires.
 *
 * @param {SleepStudyResult} r
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
        'Arrange an urgent CPAP / ventilation review, communicate the critical result directly to the referrer now and document the conversation, and advise on occupational-driver (DVLA) implications.',
      firedRules
    };
  }

  // ─── urgent ───
  if (severity === 'major') {
    firedRules.push({
      ruleId: 'R-FU-URGENT-01',
      axis: 'follow-up',
      category: 'major-abnormality',
      description: 'Major abnormality (severe OSA) present; follow-up urgency graded urgent.'
    });
    return {
      followUpUrgency: 'urgent',
      targetTimeframe: 'within 2 weeks',
      recommendedAction:
        'Arrange urgent sleep-clinic review for CPAP titration and advise on DVLA driving implications.',
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
        'Recommend sleep-clinic review and consider CPAP if symptomatic, as clinically indicated.',
      firedRules
    };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-02',
      axis: 'follow-up',
      category: 'inconclusive',
      description: 'Inconclusive study; repeat or alternative study recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 6 weeks',
      recommendedAction: 'Recommend a repeat or alternative sleep study to resolve the inconclusive result.',
      firedRules
    };
  }

  if (severity === 'minor') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-03',
      axis: 'follow-up',
      category: 'minor-abnormality',
      description: 'Mild OSA or periodic limb movements; conservative follow-up recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 3 months',
      recommendedAction: hasOnlyPeriodicLimbMovements(r)
        ? 'Manage periodic limb movements per the relevant sleep-medicine pathway.'
        : 'Recommend conservative measures and review symptoms; escalate to CPAP if symptomatic.',
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
    recommendedAction: 'No specific sleep-study follow-up required; manage per usual care.',
    firedRules
  };
}

export { SEVERE_AHI_THRESHOLD, isSevereAhi, hasCriticalFinding, hasAnyAbnormalFinding, hasOnlyPeriodicLimbMovements, ahiSeverityBand, ahiReportingCategory, classifyResult, gradeSeverity, gradeCompleteness, gradeFollowUp };
