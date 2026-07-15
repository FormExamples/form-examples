// Declarative four-axis grading rules for the Colonoscopy Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine modules
// `src/lib/engine/{classification-rules,severity-rules,completeness-rules,
// follow-up-rules,utils}.ts` (predicates only — display helpers live in
// `types.js`). Rule IDs, categories, and descriptions are stable and identical
// across every front-end and the back-end; rows mirror the
// `colonoscopy_test_result_grade_rule` SQL table.
//
// The grader (`grader.js`) composes the four axis functions into the full
// `GradingResult`; `flags.js` raises the safety-critical flags independently.

/**
 * @typedef {import('./types.js').ColonoscopyResult} ColonoscopyResult
 * @typedef {import('./types.js').ResultClassification} ResultClassification
 * @typedef {import('./types.js').AbnormalitySeverity} AbnormalitySeverity
 * @typedef {import('./types.js').FollowUpUrgency} FollowUpUrgency
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// ----------------------------------------------------------------------
// Structured-findings predicates (mirror `utils.ts`)
// ----------------------------------------------------------------------

/**
 * A critical finding (a mass lesion suspicious for malignancy, or a perforation
 * complication) auto-escalates Axis D to critical-alert. Mirrors the back-end
 * invariant.
 * @param {ColonoscopyResult} r
 * @returns {boolean}
 */
function hasCriticalFinding(r) {
  return r.massLesion || r.complication === 'perforation';
}

/**
 * Whether any structured abnormal finding is present.
 * @param {ColonoscopyResult} r
 * @returns {boolean}
 */
function hasAnyAbnormalFinding(r) {
  return (
    r.polypsFound ||
    r.massLesion ||
    r.diverticulosis ||
    r.inflammationIbd ||
    r.angiodysplasia ||
    r.bleedingSourceIdentified
  );
}

/**
 * Whether the report describes only diverticulosis (a common incidental finding).
 * @param {ColonoscopyResult} r
 * @returns {boolean}
 */
function hasOnlyIncidentalFinding(r) {
  return (
    r.diverticulosis &&
    !r.polypsFound &&
    !r.massLesion &&
    !r.inflammationIbd &&
    !r.angiodysplasia &&
    !r.bleedingSourceIdentified
  );
}

// ----------------------------------------------------------------------
// Axis A — result classification (mirrors `classification-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical structured finding (mass lesion or a perforation
 *   complication) is present.
 * - inconclusive: the examination was incomplete, or limited by poor bowel
 *   preparation with no confident impression.
 * - abnormal: any abnormal structured finding is present.
 * - normal: no abnormal finding and an adequate, complete examination.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 *
 * @param {ColonoscopyResult} r
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
        'A critical structured finding (mass lesion or perforation complication) is present; classified as critical.'
    });
    return { resultClassification: 'critical', firedRules };
  }

  if (r.extentReached === 'incomplete') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-01',
      axis: 'classification',
      category: 'incomplete-examination',
      description: 'Examination was incomplete; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (r.bowelPreparationQuality === 'poor' && r.impression.trim() === '') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-02',
      axis: 'classification',
      category: 'poor-prep-no-impression',
      description:
        'Bowel preparation was poor and no impression was recorded; classified as inconclusive.'
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
 * Severity ladder (none → minor → moderate → major), grounded in BSG
 * actionable-reporting principles and the BSG / ACPGBI / PHE polyp-surveillance
 * risk bands:
 * - major: a critical finding (mass / perforation), or a large polyp (>= 20 mm).
 * - moderate: an actionable abnormal finding (polyps, inflammation suggestive of
 *   IBD, angiodysplasia, an identified bleeding source) or a surveillance-band
 *   polyp burden (>= 10 mm or >= 3 polyps).
 * - minor: incidental-only findings (e.g. isolated diverticulosis).
 * - none: a normal study.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * polyp-surveillance workflows.
 *
 * @param {ColonoscopyResult} r
 * @param {ResultClassification} classification
 * @returns {{ abnormalitySeverity: AbnormalitySeverity, reportingCategory: string,
 *             firedRules: FiredRule[] }}
 */
function gradeSeverity(r, classification) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  const size = r.largestPolypMm;
  const count = r.polypCount;

  if (hasCriticalFinding(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-01',
      axis: 'severity',
      category: 'critical-finding',
      description: 'Critical finding present; abnormality severity graded major.'
    });
    return { abnormalitySeverity: 'major', reportingCategory: 'critical-actionable', firedRules };
  }

  if (size !== null && size >= 20) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-02',
      axis: 'severity',
      category: 'large-polyp',
      description: 'Largest polyp is 20 mm or larger; abnormality severity graded major.'
    });
    return { abnormalitySeverity: 'major', reportingCategory: 'large-polyp', firedRules };
  }

  const actionable =
    r.polypsFound ||
    r.inflammationIbd ||
    r.angiodysplasia ||
    r.bleedingSourceIdentified;

  if (actionable) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-01',
      axis: 'severity',
      category: 'actionable-finding',
      description:
        'An actionable abnormal finding (polyps, IBD inflammation, angiodysplasia, or an identified bleeding source) is present; severity graded moderate.'
    });
    const highRiskBurden = (size !== null && size >= 10) || (count !== null && count >= 3);
    const category = highRiskBurden ? 'high-risk-surveillance' : 'low-risk-surveillance';
    return { abnormalitySeverity: 'moderate', reportingCategory: category, firedRules };
  }

  if (hasOnlyIncidentalFinding(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-01',
      axis: 'severity',
      category: 'incidental-finding',
      description: 'Incidental finding(s) only; abnormality severity graded minor.'
    });
    return { abnormalitySeverity: 'minor', reportingCategory: 'incidental', firedRules };
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
 * The five mandatory report sections per BSG / JAG reporting standards:
 * clinical history, procedure / extent, findings, impression, and follow-up.
 *
 * @type {Array<{ ruleId: string, category: string, label: string,
 *                present: (r: ColonoscopyResult) => boolean }>}
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
    label: 'procedure and extent reached',
    present: (r) => r.procedure !== '' && r.extentReached !== ''
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
  },
  {
    ruleId: 'R-COMP-FOLLOWUP-01',
    category: 'follow-up',
    label: 'recommended follow-up',
    present: (r) => r.recommendedFollowUp.trim() !== ''
  }
];

/**
 * Axis C — report completeness.
 *
 * Returns the percentage (0-100, rounded) of mandatory report sections that
 * are present, plus an audit-trail rule for each missing section.
 *
 * @param {ColonoscopyResult} r
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
 * critical finding (mass lesion or perforation) auto-escalates to critical-alert
 * regardless of the other axes (the safety invariant), typically triggering an
 * urgent MDT / colorectal-surgical referral. The least-urgent band is chosen
 * only when no rule fires.
 *
 * @param {ColonoscopyResult} r
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
        'Communicate the critical result directly to the referrer now, document the conversation, and arrange an urgent MDT / colorectal-surgical referral.',
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
      targetTimeframe: 'per surveillance guidance',
      recommendedAction:
        'Recommend a surveillance interval or specialist referral per BSG / ACPGBI / PHE polyp-surveillance guidance.',
      firedRules
    };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-02',
      axis: 'follow-up',
      category: 'inconclusive',
      description: 'Inconclusive study; repeat or alternative examination recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 6 weeks',
      recommendedAction:
        'Recommend a repeat or alternative examination (e.g. CT colonography) to complete assessment.',
      firedRules
    };
  }

  if (hasOnlyIncidentalFinding(r)) {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-03',
      axis: 'follow-up',
      category: 'incidental-finding',
      description: 'Incidental finding; structured follow-up per relevant guidance recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'per incidental-findings guidance',
      recommendedAction:
        'Manage the incidental finding (e.g. diverticulosis) per the relevant structured pathway.',
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
    recommendedAction: 'No specific endoscopic follow-up required; manage per usual care.',
    firedRules
  };
}

export { hasCriticalFinding, hasAnyAbnormalFinding, hasOnlyIncidentalFinding, classifyResult, gradeSeverity, gradeCompleteness, gradeFollowUp };
