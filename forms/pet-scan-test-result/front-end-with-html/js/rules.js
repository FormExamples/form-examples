// Declarative four-axis grading rules for the PET Scan Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine modules
// `src/lib/engine/{classification-rules,severity-rules,completeness-rules,
// follow-up-rules,utils}.ts` (predicates only — display helpers live in
// `types.js`). Rule IDs, categories, and descriptions are stable and identical
// across every front-end and the back-end; rows mirror the
// `pet_scan_test_result_grade_rule` SQL table.
//
// The grader (`grader.js`) composes the four axis functions into the full
// `GradingResult`; `flags.js` raises the safety-critical flags independently.

/**
 * @typedef {import('./types.js').PetScanResult} PetScanResult
 * @typedef {import('./types.js').ResultClassification} ResultClassification
 * @typedef {import('./types.js').AbnormalitySeverity} AbnormalitySeverity
 * @typedef {import('./types.js').FollowUpUrgency} FollowUpUrgency
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// ----------------------------------------------------------------------
// Structured-findings predicates (mirror `utils.ts`)
// ----------------------------------------------------------------------

/**
 * A critical finding — distant metastatic tracer-avid disease, or a
 * progressive metabolic treatment response — auto-escalates Axis D to
 * critical-alert. Mirrors the back-end invariant.
 * @param {PetScanResult} r
 * @returns {boolean}
 */
function hasCriticalFinding(r) {
  return r.distantMetastasis || r.treatmentResponse === 'progressive';
}

/**
 * Whether any structured abnormal finding is present.
 * @param {PetScanResult} r
 * @returns {boolean}
 */
function hasAnyAbnormalFinding(r) {
  return (
    r.hypermetabolicLesion ||
    r.nodalUptake ||
    r.distantMetastasis ||
    // gradeSeverity independently grades an SUVmax >= 10 as major from the
    // raw measurement, even when the hypermetabolicLesion checkbox itself is
    // unset — Axis A must agree.
    (r.suvMax !== null && r.suvMax >= 10)
  );
}

/**
 * Whether the report describes only incidental findings (no abnormal ones).
 * @param {PetScanResult} r
 * @returns {boolean}
 */
function hasOnlyIncidentalFinding(r) {
  return r.incidentalFinding && !hasAnyAbnormalFinding(r);
}

/**
 * Whether the study is negative (no abnormal uptake / physiological only).
 * @param {PetScanResult} r
 * @returns {boolean}
 */
function isNegativeStudy(r) {
  return (r.noAbnormalUptake || r.physiologicalUptakeOnly) && !hasAnyAbnormalFinding(r);
}

// ----------------------------------------------------------------------
// Axis A — result classification (mirrors `classification-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical structured finding (distant metastasis) or a
 *   progressive metabolic treatment response is present.
 * - inconclusive: the examination was non-diagnostic, or limited with no
 *   confident impression.
 * - abnormal: any abnormal structured finding (hypermetabolic lesion / nodal
 *   uptake) is present.
 * - normal: no abnormal finding and an adequate examination.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 *
 * @param {PetScanResult} r
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
        'A critical structured finding (distant metastasis or progressive disease) is present; classified as critical.'
    });
    return { resultClassification: 'critical', firedRules };
  }

  if (r.examinationAdequacy === 'non-diagnostic') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-01',
      axis: 'classification',
      category: 'non-diagnostic',
      description: 'Examination was non-diagnostic; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (r.examinationAdequacy === 'limited' && r.impression.trim() === '') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-02',
      axis: 'classification',
      category: 'limited-no-impression',
      description:
        'Examination was limited and no impression was recorded; classified as inconclusive.'
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

  if (hasOnlyIncidentalFinding(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-02',
      axis: 'classification',
      category: 'incidental-finding',
      description: 'Only incidental finding(s) present; classified as abnormal (not a normal study).'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  firedRules.push({
    ruleId: 'R-CLASS-NORMAL-01',
    axis: 'classification',
    category: 'no-abnormal-finding',
    description: 'No abnormal structured findings on an interpretable examination; classified as normal.'
  });
  return { resultClassification: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis B — abnormality severity (mirrors `severity-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in RCR
 * actionable-reporting principles and the metabolic structured-reporting
 * systems — the 5-point Deauville score (Lugano classification, lymphoma) and
 * PERCIST (solid tumours):
 * - major: a critical finding (distant metastasis / progressive disease), or
 *   high metabolic avidity (SUVmax >= 10).
 * - moderate: an actionable abnormal finding (hypermetabolic lesion / nodal
 *   uptake) or a measurable lesion.
 * - minor: incidental-only findings.
 * - none: a normal / negative study.
 *
 * The `reportingCategory` carries the clinician's free-text structured-reporting
 * label (e.g. a Deauville score 1-5 or a PERCIST response category) when one was
 * entered; otherwise a short derived label suitable for downstream workflows.
 *
 * @param {PetScanResult} r
 * @param {ResultClassification} classification
 * @returns {{ abnormalitySeverity: AbnormalitySeverity, reportingCategory: string, firedRules: FiredRule[] }}
 */
function gradeSeverity(r, classification) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  const entered = r.reportingCategory.trim();
  const suv = r.suvMax;

  if (hasCriticalFinding(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-01',
      axis: 'severity',
      category: 'critical-finding',
      description: 'Critical finding present; abnormality severity graded major.'
    });
    return {
      abnormalitySeverity: 'major',
      reportingCategory: entered || 'critical-actionable',
      firedRules
    };
  }

  if (suv !== null && suv >= 10) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-02',
      axis: 'severity',
      category: 'high-avidity',
      description: 'Highly tracer-avid disease (SUVmax 10 or greater); abnormality severity graded major.'
    });
    return {
      abnormalitySeverity: 'major',
      reportingCategory: entered || 'high-avidity',
      firedRules
    };
  }

  const actionable = r.hypermetabolicLesion || r.nodalUptake || hasAnyAbnormalFinding(r);

  if (actionable) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-01',
      axis: 'severity',
      category: 'actionable-finding',
      description:
        'An actionable abnormal finding (hypermetabolic lesion or nodal uptake) is present; severity graded moderate.'
    });
    const derived =
      r.largestLesionSizeMm !== null && r.largestLesionSizeMm >= 10
        ? 'measurable-lesion'
        : 'actionable-finding';
    return {
      abnormalitySeverity: 'moderate',
      reportingCategory: entered || derived,
      firedRules
    };
  }

  if (hasOnlyIncidentalFinding(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-01',
      axis: 'severity',
      category: 'incidental-finding',
      description: 'Incidental finding(s) only; abnormality severity graded minor.'
    });
    return { abnormalitySeverity: 'minor', reportingCategory: entered || 'incidental', firedRules };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-SEV-NONE-02',
      axis: 'severity',
      category: 'inconclusive',
      description: 'Inconclusive study; abnormality severity not established.'
    });
    return {
      abnormalitySeverity: 'none',
      reportingCategory: entered || 'indeterminate',
      firedRules
    };
  }

  firedRules.push({
    ruleId: 'R-SEV-NONE-01',
    axis: 'severity',
    category: 'no-abnormal-finding',
    description: 'No abnormal finding; abnormality severity graded none.'
  });
  return { abnormalitySeverity: 'none', reportingCategory: entered || 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis C — report completeness (mirrors `completeness-rules.ts`)
// ----------------------------------------------------------------------

/**
 * The five mandatory report sections per RCR reporting standards:
 * clinical history, technique / acquisition, comparison, findings, and
 * impression. For a PET-CT report the acquisition section is satisfied by a
 * recorded injected activity (IR(ME)R dose audit datum).
 *
 * @type {{ ruleId: string, category: string, label: string,
 *          present: (r: PetScanResult) => boolean }[]}
 */
const sections = [
  {
    ruleId: 'R-COMP-HISTORY-01',
    category: 'history',
    label: 'clinical history',
    present: (r) => r.clinicalHistory.trim() !== ''
  },
  {
    ruleId: 'R-COMP-TECHNIQUE-01',
    category: 'technique',
    label: 'technique / acquisition (injected activity)',
    present: (r) => r.injectedActivityMbq !== null
  },
  {
    ruleId: 'R-COMP-COMPARISON-01',
    category: 'comparison',
    label: 'comparison with previous imaging',
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
 * Returns the percentage (0–100, rounded) of mandatory report sections that
 * are present, plus an audit-trail rule for each missing section.
 *
 * @param {PetScanResult} r
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
 * Escalation ladder (routine → recommended → urgent → critical-alert). A
 * critical finding (distant metastasis or progressive disease) auto-escalates
 * to critical-alert regardless of the other axes (the safety invariant). The
 * least-urgent band is chosen only when no rule fires.
 *
 * @param {PetScanResult} r
 * @param {ResultClassification} classification
 * @param {AbnormalitySeverity} severity
 * @returns {{ followUpUrgency: FollowUpUrgency, targetTimeframe: string,
 *             recommendedAction: string, firedRules: FiredRule[] }}
 */
function gradeFollowUp(r, classification, severity) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  // --- critical-alert: auto-escalation invariant ---
  if (hasCriticalFinding(r) || classification === 'critical') {
    firedRules.push({
      ruleId: 'R-FU-CRITICAL-01',
      axis: 'follow-up',
      category: 'critical-result',
      description:
        'Critical finding (distant metastasis or progressive disease) auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
    });
    return {
      followUpUrgency: 'critical-alert',
      targetTimeframe: 'immediate',
      recommendedAction:
        'Communicate the critical result directly to the referrer now, request urgent oncology review, and document the conversation.',
      firedRules
    };
  }

  // --- urgent ---
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
      recommendedAction: 'Arrange urgent clinical review and expedite onward oncology referral.',
      firedRules
    };
  }

  // --- recommended ---
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
      recommendedAction: 'Recommend follow-up imaging or specialist referral as clinically indicated.',
      firedRules
    };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-02',
      axis: 'follow-up',
      category: 'inconclusive',
      description: 'Inconclusive study; repeat or alternative imaging recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 2 weeks',
      recommendedAction: 'Recommend repeat or alternative imaging to resolve the inconclusive study.',
      firedRules
    };
  }

  if (hasOnlyIncidentalFinding(r)) {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-03',
      axis: 'follow-up',
      category: 'incidental-finding',
      description: 'Incidental finding; structured follow-up per incidental-findings guidance recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'per incidental-findings guidance',
      recommendedAction:
        'Manage the incidental finding per the relevant structured incidental-findings pathway.',
      firedRules
    };
  }

  // --- routine: least-urgent band, no rule fired ---
  firedRules.push({
    ruleId: 'R-FU-ROUTINE-01',
    axis: 'follow-up',
    category: 'normal',
    description: 'No escalation rule fired; routine follow-up only.'
  });
  return {
    followUpUrgency: 'routine',
    targetTimeframe: 'no specific follow-up',
    recommendedAction: 'No specific imaging follow-up required; manage per usual care.',
    firedRules
  };
}

export { hasCriticalFinding, hasAnyAbnormalFinding, hasOnlyIncidentalFinding, isNegativeStudy, classifyResult, gradeSeverity, gradeCompleteness, gradeFollowUp };
