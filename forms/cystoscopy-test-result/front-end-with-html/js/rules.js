// Declarative four-axis grading rules for the Cystoscopy Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine modules
// `src/lib/engine/{classification-rules,severity-rules,completeness-rules,
// follow-up-rules,utils}.ts` (predicates only — display helpers live in
// `types.js`). Rule IDs, categories, and descriptions are stable and identical
// across every front-end and the back-end; rows mirror the
// `cystoscopy_test_result_grade_rule` SQL table.
//
// The grader (`grader.js`) composes the four axis functions into the full
// `GradingResult`; `flags.js` raises the safety-critical flags independently.

/**
 * @typedef {import('./types.js').CystoscopyResult} CystoscopyResult
 * @typedef {import('./types.js').ResultClassification} ResultClassification
 * @typedef {import('./types.js').AbnormalitySeverity} AbnormalitySeverity
 * @typedef {import('./types.js').FollowUpUrgency} FollowUpUrgency
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.CystoscopyTestResult.
(function () {
'use strict';
window.CystoscopyTestResult = window.CystoscopyTestResult || {};

// ----------------------------------------------------------------------
// Structured-findings predicates (mirror `utils.ts`)
// ----------------------------------------------------------------------

/**
 * A critical finding (a bladder tumour or suspicious lesion) auto-escalates
 * Axis D to critical-alert. Mirrors the back-end invariant.
 * @param {CystoscopyResult} r
 * @returns {boolean}
 */
function hasCriticalFinding(r) {
  return r.bladderTumour;
}

/**
 * Whether any structured abnormal finding is present.
 * @param {CystoscopyResult} r
 * @returns {boolean}
 */
function hasAnyAbnormalFinding(r) {
  return (
    r.bladderTumour ||
    r.inflammationCystitis ||
    r.bladderStones ||
    r.urethralStricture ||
    r.trabeculation ||
    r.prostaticEnlargement
  );
}

/**
 * Whether the report describes only minor benign structural findings
 * (trabeculation and/or prostatic enlargement) with no more-significant
 * finding present.
 * @param {CystoscopyResult} r
 * @returns {boolean}
 */
function hasOnlyMinorFinding(r) {
  const minor = r.trabeculation || r.prostaticEnlargement;
  const significant =
    r.bladderTumour || r.inflammationCystitis || r.bladderStones || r.urethralStricture;
  return minor && !significant;
}

// ----------------------------------------------------------------------
// Axis A — result classification (mirrors `classification-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical structured finding (bladder tumour / suspicious
 *   lesion) is present.
 * - inconclusive: no structured finding was recorded (neither a normal
 *   examination nor any abnormal finding) and no impression was given, so the
 *   examination could not reach a conclusion.
 * - abnormal: any abnormal structured finding is present.
 * - normal: an explicitly normal examination with no abnormal finding.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 *
 * @param {CystoscopyResult} r
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
        'A bladder tumour or suspicious lesion is present; classified as critical.'
    });
    return { resultClassification: 'critical', firedRules };
  }

  if (!r.normalExamination && !hasAnyAbnormalFinding(r) && r.impression.trim() === '') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-01',
      axis: 'classification',
      category: 'no-conclusion',
      description:
        'No structured finding was recorded and no impression was given; classified as inconclusive.'
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

  firedRules.push({
    ruleId: 'R-CLASS-NORMAL-01',
    axis: 'classification',
    category: 'no-abnormal-finding',
    description:
      'A normal examination with no abnormal structured findings; classified as normal.'
  });
  return { resultClassification: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis B — abnormality severity (mirrors `severity-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in BAUS
 * actionable-reporting principles and structured-reporting systems such as the
 * EAU NMIBC risk groups and suspected-tumour categories:
 * - major: a bladder tumour / suspicious lesion, or a large lesion (>= 30 mm).
 * - moderate: an actionable abnormal finding (inflammation / cystitis, bladder
 *   stones, urethral stricture) or a measurable lesion (10–29 mm).
 * - minor: benign structural findings only (trabeculation / prostatic
 *   enlargement).
 * - none: a normal examination.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * structured-reporting workflows.
 *
 * @param {CystoscopyResult} r
 * @param {ResultClassification} classification
 * @returns {{ abnormalitySeverity: AbnormalitySeverity, reportingCategory: string, firedRules: FiredRule[] }}
 */
function gradeSeverity(r, classification) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  const size = r.tumourSizeMm;

  if (hasCriticalFinding(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-01',
      axis: 'severity',
      category: 'critical-finding',
      description:
        'Bladder tumour or suspicious lesion present; abnormality severity graded major.'
    });
    return { abnormalitySeverity: 'major', reportingCategory: 'suspected-tumour', firedRules };
  }

  if (size !== null && size >= 30) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-02',
      axis: 'severity',
      category: 'large-lesion',
      description: 'Largest lesion is 30 mm or larger; abnormality severity graded major.'
    });
    return { abnormalitySeverity: 'major', reportingCategory: 'large-lesion', firedRules };
  }

  const actionable = r.inflammationCystitis || r.bladderStones || r.urethralStricture;

  if (actionable) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-01',
      axis: 'severity',
      category: 'actionable-finding',
      description:
        'An actionable abnormal finding (inflammation / cystitis, bladder stones, or urethral stricture) is present; severity graded moderate.'
    });
    const category = size !== null && size >= 10 ? 'measurable-lesion' : 'actionable-finding';
    return { abnormalitySeverity: 'moderate', reportingCategory: category, firedRules };
  }

  if (hasOnlyMinorFinding(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-01',
      axis: 'severity',
      category: 'benign-structural-finding',
      description:
        'Benign structural finding(s) only (trabeculation / prostatic enlargement); abnormality severity graded minor.'
    });
    return { abnormalitySeverity: 'minor', reportingCategory: 'benign-structural', firedRules };
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
 * A mandatory report section, used to compute Axis C completeness.
 * The five mandatory report sections per BAUS / BAUN cystoscopy reporting
 * standards: clinical history, procedure, findings, impression, and
 * recommended follow-up.
 *
 * @type {Array<{ ruleId: string, category: string, label: string,
 *                present: (r: CystoscopyResult) => boolean }>}
 */
const sections = [
  {
    ruleId: 'R-COMP-HISTORY-01',
    category: 'history',
    label: 'clinical history',
    present: (r) => r.clinicalHistory.trim() !== ''
  },
  {
    ruleId: 'R-COMP-PROCEDURE-01',
    category: 'procedure',
    label: 'procedure',
    present: (r) => r.procedure !== ''
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
    ruleId: 'R-COMP-FOLLOW-UP-01',
    category: 'follow-up',
    label: 'recommended follow-up',
    present: (r) => r.recommendedFollowUp.trim() !== ''
  }
];

/**
 * Axis C — report completeness.
 *
 * Returns the percentage (0–100, rounded) of mandatory report sections that
 * are present, plus an audit-trail rule for each missing section.
 *
 * @param {CystoscopyResult} r
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
 * bladder tumour or suspicious lesion auto-escalates to critical-alert
 * regardless of the other axes (the safety invariant). The least-urgent band is
 * chosen only when no rule fires.
 *
 * @param {CystoscopyResult} r
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
        'Bladder tumour / suspicious lesion auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
    });
    return {
      followUpUrgency: 'critical-alert',
      targetTimeframe: 'immediate',
      recommendedAction:
        'Communicate the critical result to the referrer now, book urgent TURBT, and refer to the MDT.',
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
      recommendedAction:
        'Recommend specialist follow-up or further management as clinically indicated.',
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
      targetTimeframe: 'within 2 weeks',
      recommendedAction:
        'Recommend repeat or alternative examination to resolve the inconclusive study.',
      firedRules
    };
  }

  if (hasOnlyMinorFinding(r)) {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-03',
      axis: 'follow-up',
      category: 'benign-structural-finding',
      description:
        'Benign structural finding; structured follow-up per local surveillance guidance recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'per local surveillance guidance',
      recommendedAction:
        'Manage the benign structural finding per the relevant follow-up pathway.',
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
    recommendedAction: 'No specific cystoscopy follow-up required; manage per usual care.',
    firedRules
  };
}

Object.assign(window.CystoscopyTestResult, {
  hasCriticalFinding,
  hasAnyAbnormalFinding,
  hasOnlyMinorFinding,
  classifyResult,
  gradeSeverity,
  gradeCompleteness,
  gradeFollowUp
});
})();
