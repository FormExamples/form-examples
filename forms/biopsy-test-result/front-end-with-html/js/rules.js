// Four-axis grading rules for the biopsy histopathology result.
//
// Faithful vanilla-JS port of the tested SvelteKit engine modules
// `classification-rules.ts`, `severity-rules.ts`, `completeness-rules.ts`,
// `follow-up-rules.ts`, and the diagnostic predicates in `utils.ts`.
// Rule IDs are stable and identical across every front-end and the back-end;
// rows mirror the `biopsy_test_result_grade_rule` SQL table.

/**
 * @typedef {import('./types.js').BiopsyResult} BiopsyResult
 * @typedef {import('./types.js').ResultClassification} ResultClassification
 * @typedef {import('./types.js').AbnormalitySeverity} AbnormalitySeverity
 * @typedef {import('./types.js').FollowUpUrgency} FollowUpUrgency
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.BiopsyTestResult.
(function () {
'use strict';
window.BiopsyTestResult = window.BiopsyTestResult || {};

// ──────────────────────────────────────────────
// Diagnostic predicates (utils.ts)
// ──────────────────────────────────────────────

/**
 * Whether the resection margin is involved (tumour at the cut edge).
 * @param {BiopsyResult} r
 * @returns {boolean}
 */
function hasInvolvedMargin(r) {
  return r.resectionMargins === 'involved';
}

/**
 * A critical finding — an unexpected malignancy (malignancy present with no
 * originating request reference recorded) or an involved resection margin —
 * auto-escalates Axis D to critical-alert. Mirrors the back-end invariant.
 * @param {BiopsyResult} r
 * @returns {boolean}
 */
function hasCriticalFinding(r) {
  const unexpectedMalignancy =
    r.malignancyPresent && r.originatingRequestReference.trim() === '';
  return unexpectedMalignancy || hasInvolvedMargin(r);
}

/**
 * Whether any abnormal diagnostic feature is present.
 * @param {BiopsyResult} r
 * @returns {boolean}
 */
function hasAnyAbnormalFinding(r) {
  return (
    r.malignancyPresent ||
    r.lymphovascularInvasion ||
    r.resectionMargins === 'involved' ||
    r.resectionMargins === 'close'
  );
}

// ──────────────────────────────────────────────
// Axis A — result classification (classification-rules.ts)
// ──────────────────────────────────────────────

/**
 * Determines the overall reporting conclusion:
 * - critical: a critical finding (unexpected malignancy or an involved
 *   resection margin) is present.
 * - inconclusive: the specimen was inadequate, or suboptimal with no
 *   confident diagnosis recorded.
 * - abnormal: malignancy or any abnormal diagnostic feature is present.
 * - normal: no abnormal feature on an adequate specimen.
 *
 * @param {BiopsyResult} r
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
        'A critical finding (unexpected malignancy or an involved resection margin) is present; classified as critical.'
    });
    return { resultClassification: 'critical', firedRules };
  }

  if (r.specimenAdequacy === 'inadequate') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-01',
      axis: 'classification',
      category: 'inadequate-specimen',
      description: 'Specimen was inadequate for diagnosis; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (r.specimenAdequacy === 'suboptimal' && r.diagnosis.trim() === '') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-02',
      axis: 'classification',
      category: 'suboptimal-no-diagnosis',
      description:
        'Specimen was suboptimal and no diagnosis was recorded; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (hasAnyAbnormalFinding(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-01',
      axis: 'classification',
      category: 'abnormal-finding',
      description:
        'Malignancy or an abnormal diagnostic feature is present; classified as abnormal.'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  firedRules.push({
    ruleId: 'R-CLASS-NORMAL-01',
    axis: 'classification',
    category: 'no-abnormal-finding',
    description:
      'No abnormal diagnostic feature on an interpretable specimen; classified as normal.'
  });
  return { resultClassification: 'normal', firedRules };
}

// ──────────────────────────────────────────────
// Axis B — abnormality severity & structured reporting (severity-rules.ts)
// ──────────────────────────────────────────────

/**
 * Maps the histological differentiation grade to its Axis B severity weight,
 * per the index.md mapping (RCPath / TNM8 differentiation grades):
 * - well-differentiated (G1) → minor
 * - moderately-differentiated (G2) → moderate
 * - poorly-differentiated (G3) / undifferentiated (G4) → major
 * - not-applicable (benign / non-neoplastic) → none
 *
 * @param {string} grade
 * @returns {AbnormalitySeverity}
 */
function gradeWeight(grade) {
  switch (grade) {
    case 'well-differentiated': return 'minor';
    case 'moderately-differentiated': return 'moderate';
    case 'poorly-differentiated':
    case 'undifferentiated': return 'major';
    default: return 'none';
  }
}

/**
 * Builds a short structured reporting category from the grade and margins.
 * @param {BiopsyResult} r
 * @returns {string}
 */
function buildReportingCategory(r) {
  if (r.reportingCategory.trim() !== '') return r.reportingCategory.trim();
  const parts = [];
  if (r.malignancyPresent) {
    parts.push('malignant');
    if (r.histologicalGrade !== '' && r.histologicalGrade !== 'not-applicable') {
      parts.push(r.histologicalGrade);
    }
  } else {
    parts.push('benign');
  }
  if (r.resectionMargins === 'involved') parts.push('margin-involved');
  else if (r.resectionMargins === 'close') parts.push('margin-close');
  return parts.join(' / ');
}

/**
 * Severity ladder (none → minor → moderate → major), grounded in RCPath
 * cancer-dataset core items and TNM8 / ICCR structured grading:
 * - major: a critical finding, an involved margin, or a poorly-differentiated /
 *   undifferentiated tumour.
 * - moderate: a moderately-differentiated tumour, or an abnormal feature
 *   (lymphovascular invasion / close margin) without a higher grade.
 * - minor: a well-differentiated tumour.
 * - none: a benign / non-neoplastic specimen.
 *
 * @param {BiopsyResult} r
 * @param {ResultClassification} classification
 * @returns {{ abnormalitySeverity: AbnormalitySeverity, reportingCategory: string, firedRules: FiredRule[] }}
 */
function gradeSeverity(r, classification) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  const weight = gradeWeight(r.histologicalGrade);

  // A free reportingCategory label carrying the grade / diagnosis summary.
  const category = buildReportingCategory(r);

  if (hasCriticalFinding(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-01',
      axis: 'severity',
      category: 'critical-finding',
      description:
        'Critical finding (unexpected malignancy or involved margin) present; abnormality severity graded major.'
    });
    return { abnormalitySeverity: 'major', reportingCategory: category, firedRules };
  }

  if (r.malignancyPresent && weight === 'major') {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-02',
      axis: 'severity',
      category: 'high-grade-malignancy',
      description:
        'Poorly-differentiated or undifferentiated malignancy; abnormality severity graded major.'
    });
    return { abnormalitySeverity: 'major', reportingCategory: category, firedRules };
  }

  if (r.malignancyPresent && weight === 'moderate') {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-01',
      axis: 'severity',
      category: 'intermediate-grade-malignancy',
      description: 'Moderately-differentiated malignancy; abnormality severity graded moderate.'
    });
    return { abnormalitySeverity: 'moderate', reportingCategory: category, firedRules };
  }

  if (r.lymphovascularInvasion || r.resectionMargins === 'close') {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-02',
      axis: 'severity',
      category: 'actionable-finding',
      description:
        'An actionable abnormal feature (lymphovascular invasion or a close margin) is present; severity graded moderate.'
    });
    return { abnormalitySeverity: 'moderate', reportingCategory: category, firedRules };
  }

  if (r.malignancyPresent && weight === 'minor') {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-01',
      axis: 'severity',
      category: 'low-grade-malignancy',
      description: 'Well-differentiated malignancy; abnormality severity graded minor.'
    });
    return { abnormalitySeverity: 'minor', reportingCategory: category, firedRules };
  }

  if (r.malignancyPresent) {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-02',
      axis: 'severity',
      category: 'malignancy-ungraded',
      description: 'Malignancy present without a recorded grade; abnormality severity graded minor.'
    });
    return { abnormalitySeverity: 'minor', reportingCategory: category, firedRules };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-SEV-NONE-02',
      axis: 'severity',
      category: 'inconclusive',
      description: 'Inconclusive specimen; abnormality severity not established.'
    });
    return {
      abnormalitySeverity: 'none',
      reportingCategory: category || 'indeterminate',
      firedRules
    };
  }

  firedRules.push({
    ruleId: 'R-SEV-NONE-01',
    axis: 'severity',
    category: 'no-abnormal-finding',
    description: 'No abnormal feature; abnormality severity graded none.'
  });
  return {
    abnormalitySeverity: 'none',
    reportingCategory: category || 'benign',
    firedRules
  };
}

// ──────────────────────────────────────────────
// Axis C — report completeness (completeness-rules.ts)
// ──────────────────────────────────────────────

/**
 * The five mandatory report sections per RCPath cancer-dataset reporting
 * standards: clinical history, macroscopic description, microscopic
 * description, diagnosis, and impression.
 *
 * @type {{ ruleId: string, category: string, label: string, present: (r: BiopsyResult) => boolean }[]}
 */
const sections = [
  {
    ruleId: 'R-COMP-HISTORY-01',
    category: 'history',
    label: 'clinical history',
    present: (r) => r.clinicalHistory.trim() !== ''
  },
  {
    ruleId: 'R-COMP-MACROSCOPIC-01',
    category: 'macroscopic',
    label: 'macroscopic description',
    present: (r) => r.macroscopicDescription.trim() !== ''
  },
  {
    ruleId: 'R-COMP-MICROSCOPIC-01',
    category: 'microscopic',
    label: 'microscopic description',
    present: (r) => r.microscopicDescription.trim() !== ''
  },
  {
    ruleId: 'R-COMP-DIAGNOSIS-01',
    category: 'diagnosis',
    label: 'diagnosis',
    present: (r) => r.diagnosis.trim() !== ''
  },
  {
    ruleId: 'R-COMP-IMPRESSION-01',
    category: 'impression',
    label: 'impression',
    present: (r) => r.impression.trim() !== ''
  }
];

/**
 * Returns the percentage (0-100, rounded) of mandatory report sections that
 * are present, plus an audit-trail rule for each missing section.
 *
 * @param {BiopsyResult} r
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

  const reportCompletenessPercent =
    Math.round((presentCount / sections.length) * 100);
  return { reportCompletenessPercent, firedRules };
}

// ──────────────────────────────────────────────
// Axis D — follow-up urgency (follow-up-rules.ts)
// ──────────────────────────────────────────────

/**
 * Follow-up urgency, plus the target timeframe and recommended action.
 *
 * Escalation ladder (routine → recommended → urgent → critical-alert). A
 * critical finding (unexpected malignancy or an involved resection margin)
 * auto-escalates to critical-alert / urgent MDT regardless of the other axes
 * (the safety invariant). The least-urgent band is chosen only when no rule
 * fires.
 *
 * @param {BiopsyResult} r
 * @param {ResultClassification} classification
 * @param {AbnormalitySeverity} severity
 * @returns {{ followUpUrgency: FollowUpUrgency, targetTimeframe: string, recommendedAction: string, firedRules: FiredRule[] }}
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
        'Critical finding auto-escalates follow-up urgency to critical-alert and urgent MDT regardless of the other axes.'
    });
    return {
      followUpUrgency: 'critical-alert',
      targetTimeframe: 'immediate',
      recommendedAction:
        'Communicate the critical result directly to the referrer now, document the conversation, and refer to the urgent MDT.',
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
      targetTimeframe: 'within 1 week',
      recommendedAction: 'Refer to the relevant cancer MDT and expedite onward management.',
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
      recommendedAction: 'Recommend MDT discussion or specialist referral as clinically indicated.',
      firedRules
    };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-02',
      axis: 'follow-up',
      category: 'inconclusive',
      description: 'Inconclusive specimen; repeat sampling or further testing recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 2 weeks',
      recommendedAction:
        'Recommend repeat biopsy or ancillary testing to resolve the inconclusive specimen.',
      firedRules
    };
  }

  if (severity === 'minor') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-03',
      axis: 'follow-up',
      category: 'minor-abnormality',
      description: 'Minor abnormality present; structured follow-up recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'per local pathway',
      recommendedAction:
        'Manage the low-grade finding per the relevant structured follow-up pathway.',
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
    recommendedAction:
      'No specific histopathology follow-up required; manage per usual care.',
    firedRules
  };
}

Object.assign(window.BiopsyTestResult, {
  hasInvolvedMargin,
  hasCriticalFinding,
  hasAnyAbnormalFinding,
  classifyResult,
  gradeSeverity,
  gradeCompleteness,
  gradeFollowUp
});
})();
