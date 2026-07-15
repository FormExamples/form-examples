// Declarative four-axis grading rules for the Bronchoscopy Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine modules
// `src/lib/engine/{classification-rules,severity-rules,completeness-rules,
// follow-up-rules,utils}.ts` (predicates only — display helpers live in
// `types.js`). Rule IDs, categories, and descriptions are stable and identical
// across every front-end and the back-end; rows mirror the
// `bronchoscopy_test_result_grade_rule` SQL table.
//
// The grader (`grader.js`) composes the four axis functions into the full
// `GradingResult`; `flags.js` raises the safety-critical flags independently.

/**
 * @typedef {import('./types.js').BronchoscopyResult} BronchoscopyResult
 * @typedef {import('./types.js').ResultClassification} ResultClassification
 * @typedef {import('./types.js').AbnormalitySeverity} AbnormalitySeverity
 * @typedef {import('./types.js').FollowUpUrgency} FollowUpUrgency
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// ----------------------------------------------------------------------
// Structured-findings predicates (mirror `utils.ts`)
// ----------------------------------------------------------------------

/**
 * A critical finding (a suspected endobronchial tumour i.e. an endobronchial
 * lesion, massive haemoptysis i.e. bleeding, or a procedural pneumothorax)
 * auto-escalates Axis D to critical-alert. Mirrors the back-end invariant.
 * @param {BronchoscopyResult} r
 * @returns {boolean}
 */
function hasCriticalFinding(r) {
  return r.endobronchialLesion || r.bleeding || r.complication === 'pneumothorax';
}

/**
 * Whether any structured abnormal finding is present.
 * @param {BronchoscopyResult} r
 * @returns {boolean}
 */
function hasAnyAbnormalFinding(r) {
  return (
    r.endobronchialLesion ||
    r.mucosalAbnormality ||
    r.extrinsicCompression ||
    r.bleeding ||
    r.foreignBody ||
    r.secretionsPurulent
  );
}

/**
 * Whether the report describes purulent secretions only (no other abnormal
 * finding).
 * @param {BronchoscopyResult} r
 * @returns {boolean}
 */
function hasOnlyIncidentalFinding(r) {
  return (
    r.secretionsPurulent &&
    !r.endobronchialLesion &&
    !r.mucosalAbnormality &&
    !r.extrinsicCompression &&
    !r.bleeding &&
    !r.foreignBody
  );
}

// ----------------------------------------------------------------------
// Axis A — result classification (mirrors `classification-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical structured finding (suspected endobronchial tumour,
 *   massive haemoptysis, or a procedural pneumothorax) is present.
 * - inconclusive: the extent examined was not recorded and no confident
 *   impression was reached.
 * - abnormal: any abnormal structured finding is present.
 * - normal: no abnormal finding on an interpretable examination.
 *
 * Returns the classification plus the audit-trail rules that fired.
 *
 * @param {BronchoscopyResult} r
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
        'A critical structured finding (endobronchial lesion, bleeding, or pneumothorax) is present; classified as critical.'
    });
    return { resultClassification: 'critical', firedRules };
  }

  if (r.extentExamined.trim() === '' && r.impression.trim() === '') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-01',
      axis: 'classification',
      category: 'extent-not-recorded',
      description:
        'The extent of the airway examined was not recorded and no impression was reached; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (r.complication === 'hypoxia' && r.impression.trim() === '') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-02',
      axis: 'classification',
      category: 'aborted-no-impression',
      description:
        'Procedure complicated by hypoxia and no impression was recorded; classified as inconclusive.'
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
      description:
        'Only purulent secretions present; classified as abnormal (not a normal study).'
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
 * Severity ladder (none → minor → moderate → major), grounded in BTS
 * actionable-reporting principles and structured endobronchial-findings /
 * lung-cancer-pathway categories:
 * - major: a critical finding (suspected tumour, massive haemoptysis,
 *   pneumothorax), or extrinsic central-airway compression.
 * - moderate: an actionable abnormal finding (mucosal abnormality, foreign
 *   body).
 * - minor: purulent-secretions-only findings.
 * - none: a normal study.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * structured-reporting workflows.
 *
 * @param {BronchoscopyResult} r
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
    const category = r.endobronchialLesion ? 'suspected-malignancy' : 'critical-actionable';
    return { abnormalitySeverity: 'major', reportingCategory: category, firedRules };
  }

  if (r.extrinsicCompression) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-02',
      axis: 'severity',
      category: 'extrinsic-compression',
      description: 'Extrinsic central-airway compression present; abnormality severity graded major.'
    });
    return { abnormalitySeverity: 'major', reportingCategory: 'central-airway-compromise', firedRules };
  }

  const actionable = r.mucosalAbnormality || r.foreignBody;

  if (actionable) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-01',
      axis: 'severity',
      category: 'actionable-finding',
      description:
        'An actionable abnormal finding (mucosal abnormality or foreign body) is present; severity graded moderate.'
    });
    const category = r.foreignBody ? 'foreign-body' : 'mucosal-abnormality';
    return { abnormalitySeverity: 'moderate', reportingCategory: category, firedRules };
  }

  if (hasOnlyIncidentalFinding(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-01',
      axis: 'severity',
      category: 'incidental-finding',
      description: 'Purulent secretions only; abnormality severity graded minor.'
    });
    return { abnormalitySeverity: 'minor', reportingCategory: 'purulent-secretions', firedRules };
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
 * The five mandatory report sections per BTS reporting standards:
 * clinical history, procedure / extent examined, findings, samples, and
 * impression.
 *
 * @type {Array<{ ruleId: string, category: string, label: string,
 *                present: (r: BronchoscopyResult) => boolean }>}
 */
const completenessSections = [
  {
    ruleId: 'R-COMP-HISTORY-01',
    category: 'history',
    label: 'clinical history',
    present: (r) => r.clinicalHistory.trim() !== ''
  },
  {
    ruleId: 'R-COMP-PROCEDURE-01',
    category: 'procedure',
    label: 'procedure / extent examined',
    present: (r) => r.procedure !== '' && r.extentExamined.trim() !== ''
  },
  {
    ruleId: 'R-COMP-FINDINGS-01',
    category: 'findings',
    label: 'findings narrative',
    present: (r) => r.findingsNarrative.trim() !== ''
  },
  {
    ruleId: 'R-COMP-SAMPLES-01',
    category: 'samples',
    label: 'samples taken',
    present: (r) => r.samplesTaken.trim() !== ''
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
 * @param {BronchoscopyResult} r
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
 * critical finding (suspected tumour, massive haemoptysis, pneumothorax)
 * auto-escalates to critical-alert regardless of the other axes (the safety
 * invariant), and triggers an urgent lung-cancer MDT referral where a tumour is
 * suspected. The least-urgent band is chosen only when no rule fires.
 *
 * @param {BronchoscopyResult} r
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
    const action = r.endobronchialLesion
      ? 'Communicate the critical result to the referrer now, document the conversation, and refer urgently to the lung-cancer MDT.'
      : 'Communicate the critical result directly to the referrer now and document the conversation.';
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
      recommendedAction: 'Recommend specialist follow-up or further investigation as clinically indicated.',
      firedRules
    };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-02',
      axis: 'follow-up',
      category: 'inconclusive',
      description: 'Inconclusive study; repeat or alternative investigation recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 2 weeks',
      recommendedAction: 'Recommend repeat or alternative investigation to resolve the inconclusive study.',
      firedRules
    };
  }

  if (hasOnlyIncidentalFinding(r)) {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-03',
      axis: 'follow-up',
      category: 'incidental-finding',
      description: 'Purulent secretions; microbiological follow-up recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'per microbiology guidance',
      recommendedAction:
        'Send samples for microbiology and treat any infection per the relevant pathway.',
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

export { hasCriticalFinding, hasAnyAbnormalFinding, hasOnlyIncidentalFinding, classifyResult, gradeSeverity, gradeCompleteness, gradeFollowUp };
