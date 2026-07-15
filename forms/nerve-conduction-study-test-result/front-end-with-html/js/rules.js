// Declarative four-axis grading rules for the Nerve Conduction Study Test
// Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine modules
// `src/lib/engine/{classification-rules,severity-rules,completeness-rules,
// follow-up-rules,utils}.ts` (predicates only — display helpers live in
// `types.js`). Rule IDs, categories, and descriptions are stable and identical
// across every front-end and the back-end; rows mirror the
// `nerve_conduction_study_test_result_grade_rule` SQL table.
//
// The grader (`grader.js`) composes the four axis functions into the full
// `GradingResult`; `flags.js` raises the safety-critical flags independently.

/**
 * @typedef {import('./types.js').NerveConductionStudyResult} NerveConductionStudyResult
 * @typedef {import('./types.js').ResultClassification} ResultClassification
 * @typedef {import('./types.js').AbnormalitySeverity} AbnormalitySeverity
 * @typedef {import('./types.js').FollowUpUrgency} FollowUpUrgency
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.NerveConductionStudyTestResult.

// ----------------------------------------------------------------------
// Structured-findings predicates (mirror `utils.ts`)
// ----------------------------------------------------------------------

/**
 * A severe acute neuropathy (e.g. a GBS / acute inflammatory demyelinating
 * pattern): a peripheral neuropathy that is severe and demyelinating.
 * @param {NerveConductionStudyResult} r
 * @returns {boolean}
 */
function isSevereAcuteNeuropathy(r) {
  return r.peripheralNeuropathy && r.severity === 'severe' && r.pattern === 'demyelinating';
}

/**
 * A critical finding — motor neurone disease / anterior-horn-cell features, or
 * a severe acute neuropathy such as a Guillain-Barré syndrome (acute
 * inflammatory demyelinating) pattern — auto-escalates Axis D to
 * critical-alert. Mirrors the back-end invariant.
 * @param {NerveConductionStudyResult} r
 * @returns {boolean}
 */
function hasCriticalFinding(r) {
  return r.motorNeuroneDiseaseFeatures || isSevereAcuteNeuropathy(r);
}

/**
 * Whether any structured abnormal (diagnostic) finding is present.
 * @param {NerveConductionStudyResult} r
 * @returns {boolean}
 */
function hasAnyAbnormalFinding(r) {
  return (
    r.carpalTunnelSyndrome ||
    r.peripheralNeuropathy ||
    r.radiculopathy ||
    r.motorNeuroneDiseaseFeatures ||
    r.myopathy ||
    r.neuromuscularJunctionDisorder
  );
}

/**
 * Whether the study is recorded as electrodiagnostically normal.
 * @param {NerveConductionStudyResult} r
 * @returns {boolean}
 */
function isNormalStudy(r) {
  return r.normalStudy && !hasAnyAbnormalFinding(r);
}

// ----------------------------------------------------------------------
// Axis A — result classification (mirrors `classification-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis A — result classification.
 *
 * Determines the overall electrodiagnostic conclusion:
 * - critical: a critical structured finding (motor neurone disease features,
 *   or a severe acute neuropathy such as a GBS pattern) is present.
 * - inconclusive: the study was non-diagnostic, or limited with no confident
 *   impression.
 * - abnormal: any abnormal structured finding is present.
 * - normal: an electrodiagnostically normal study on an adequate examination.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 *
 * @param {NerveConductionStudyResult} r
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
      description: r.motorNeuroneDiseaseFeatures
        ? 'Motor neurone disease / anterior-horn-cell features are present; classified as critical.'
        : 'A severe acute neuropathy (e.g. GBS pattern) is present; classified as critical.'
    });
    return { resultClassification: 'critical', firedRules };
  }

  if (r.studyAdequacy === 'non-diagnostic') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-01',
      axis: 'classification',
      category: 'non-diagnostic',
      description: 'Study was non-diagnostic; classified as inconclusive.'
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

  if (isNormalStudy(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-NORMAL-01',
      axis: 'classification',
      category: 'normal-study',
      description: 'Electrodiagnostically normal study; classified as normal.'
    });
    return { resultClassification: 'normal', firedRules };
  }

  firedRules.push({
    ruleId: 'R-CLASS-NORMAL-02',
    axis: 'classification',
    category: 'no-abnormal-finding',
    description:
      'No abnormal structured findings on an interpretable study; classified as normal.'
  });
  return { resultClassification: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis B — abnormality severity (mirrors `severity-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Derives a short structured-reporting label. Prefers the report's own
 * free-text reporting category; otherwise summarises the predominant
 * structured finding, pattern, and severity.
 * @param {NerveConductionStudyResult} r
 * @returns {string}
 */
function deriveReportingCategory(r) {
  if (r.reportingCategory.trim() !== '') return r.reportingCategory.trim();

  /** @type {string[]} */
  const parts = [];
  if (r.motorNeuroneDiseaseFeatures) parts.push('motor-neurone-disease');
  else if (r.carpalTunnelSyndrome) parts.push('carpal-tunnel-syndrome');
  else if (r.peripheralNeuropathy) parts.push('peripheral-neuropathy');
  else if (r.radiculopathy) parts.push('radiculopathy');
  else if (r.myopathy) parts.push('myopathy');
  else if (r.neuromuscularJunctionDisorder) parts.push('neuromuscular-junction-disorder');

  if (parts.length === 0) return 'normal';

  if (r.severity && r.severity !== 'not-applicable') parts.push(r.severity);
  if (r.pattern && r.pattern !== 'not-applicable') parts.push(r.pattern);
  return parts.join('-');
}

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in the AANEM
 * severity descriptors (e.g. CTS mild / moderate / severe; axonal vs
 * demyelinating polyneuropathy):
 * - major: a critical finding, or a severe abnormality.
 * - moderate: an abnormal finding of moderate severity (or unspecified severity).
 * - minor: an abnormal finding of mild severity.
 * - none: a normal study.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * structured-reporting workflows; the report's own free-text category is used
 * when present.
 *
 * @param {NerveConductionStudyResult} r
 * @param {ResultClassification} classification
 * @returns {{ abnormalitySeverity: AbnormalitySeverity, reportingCategory: string,
 *             firedRules: FiredRule[] }}
 */
function gradeSeverity(r, classification) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  const category = deriveReportingCategory(r);

  if (hasCriticalFinding(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-01',
      axis: 'severity',
      category: 'critical-finding',
      description: 'Critical finding present; abnormality severity graded major.'
    });
    return { abnormalitySeverity: 'major', reportingCategory: category, firedRules };
  }

  if (hasAnyAbnormalFinding(r) && r.severity === 'severe') {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-02',
      axis: 'severity',
      category: 'severe-abnormality',
      description: 'Severe electrodiagnostic abnormality present; abnormality severity graded major.'
    });
    return { abnormalitySeverity: 'major', reportingCategory: category, firedRules };
  }

  if (hasAnyAbnormalFinding(r) && r.severity === 'mild') {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-01',
      axis: 'severity',
      category: 'mild-abnormality',
      description: 'Mild electrodiagnostic abnormality present; abnormality severity graded minor.'
    });
    return { abnormalitySeverity: 'minor', reportingCategory: category, firedRules };
  }

  if (hasAnyAbnormalFinding(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-01',
      axis: 'severity',
      category: 'abnormal-finding',
      description:
        'An abnormal structured finding is present; abnormality severity graded moderate.'
    });
    return { abnormalitySeverity: 'moderate', reportingCategory: category, firedRules };
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
 * The five mandatory report sections per AANEM reporting standards: clinical
 * history, study technique / adequacy, comparison, findings, and impression.
 *
 * @type {Array<{ ruleId: string, category: string, label: string,
 *                present: (r: NerveConductionStudyResult) => boolean }>}
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
    present: (r) => r.studyAdequacy !== ''
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
    present: (r) => r.nerveConductionFindings.trim() !== '' || r.emgFindings.trim() !== ''
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
 * @param {NerveConductionStudyResult} r
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
 * critical finding (motor neurone disease features, or a severe acute
 * neuropathy such as a GBS pattern) auto-escalates to critical-alert
 * regardless of the other axes (the safety invariant). The least-urgent band
 * is chosen only when no rule fires.
 *
 * @param {NerveConductionStudyResult} r
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
        'Communicate the critical result directly to the referrer now, arrange urgent neurology review, and document the conversation.',
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
      recommendedAction: 'Arrange urgent clinical review and expedite onward neurology referral.',
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
        'Recommend specialist follow-up or further electrodiagnostic study as clinically indicated.',
      firedRules
    };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-02',
      axis: 'follow-up',
      category: 'inconclusive',
      description: 'Inconclusive study; repeat or supplementary study recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 2 weeks',
      recommendedAction:
        'Recommend a repeat or supplementary electrodiagnostic study to resolve the inconclusive result.',
      firedRules
    };
  }

  if (severity === 'minor') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-03',
      axis: 'follow-up',
      category: 'minor-abnormality',
      description: 'Mild abnormality; routine specialist follow-up recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'per clinical pathway',
      recommendedAction:
        'Recommend routine specialist follow-up per the relevant clinical pathway.',
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
    recommendedAction: 'No specific electrodiagnostic follow-up required; manage per usual care.',
    firedRules
  };
}

export { hasCriticalFinding, isSevereAcuteNeuropathy, hasAnyAbnormalFinding, isNormalStudy, classifyResult, gradeSeverity, gradeCompleteness, gradeFollowUp };
