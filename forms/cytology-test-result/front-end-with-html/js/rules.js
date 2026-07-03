// Declarative four-axis grading rules for the Cytology Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine modules
// `src/lib/engine/{classification-rules,severity-rules,completeness-rules,
// follow-up-rules,utils}.ts` (predicates only — display helpers live in
// `types.js`). Rule IDs, categories, and descriptions are stable and identical
// across every front-end and the back-end; rows mirror the
// `cytology_test_result_grade_rule` SQL table.
//
// The grader (`grader.js`) composes the four axis functions into the full
// `GradingResult`; `flags.js` raises the safety-critical flags independently.

/**
 * @typedef {import('./types.js').CytologyResult} CytologyResult
 * @typedef {import('./types.js').ResultClassification} ResultClassification
 * @typedef {import('./types.js').AbnormalitySeverity} AbnormalitySeverity
 * @typedef {import('./types.js').FollowUpUrgency} FollowUpUrgency
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.CytologyTestResult.
(function () {
'use strict';
window.CytologyTestResult = window.CytologyTestResult || {};

// ----------------------------------------------------------------------
// Cytology-finding predicates (mirror `utils.ts`)
// ----------------------------------------------------------------------

/**
 * Lower-cased concatenation of the category fields, for keyword matching.
 * @param {CytologyResult} r
 * @returns {string}
 */
function categoryText(r) {
  return (r.cytologyResultCategory + ' ' + r.reportingCategory).toLowerCase();
}

/**
 * Whether the recorded category text indicates a high-grade / malignant
 * reporting band: high-grade dyskaryosis, glandular neoplasia, Thy5, breast C5,
 * high-grade urothelial carcinoma, or an explicit "malignant" / "suspicious"
 * category. Used by the critical and severity rules.
 * @param {CytologyResult} r
 * @returns {boolean}
 */
function hasHighGradeCategory(r) {
  const t = categoryText(r);
  return (
    t.includes('high-grade') ||
    t.includes('high grade') ||
    t.includes('glandular') ||
    t.includes('thy5') ||
    t.includes('thy 5') ||
    t.includes('c5') ||
    t.includes('malignant') ||
    t.includes('carcinoma') ||
    t.includes('neoplasia')
  );
}

/**
 * Whether the category text indicates a borderline / low-grade / atypical /
 * suspicious band that is abnormal but not unambiguously critical.
 * @param {CytologyResult} r
 * @returns {boolean}
 */
function hasLowGradeCategory(r) {
  const t = categoryText(r);
  return (
    t.includes('low-grade') ||
    t.includes('low grade') ||
    t.includes('borderline') ||
    t.includes('atypia') ||
    t.includes('atypical') ||
    t.includes('suspicious') ||
    t.includes('thy3') ||
    t.includes('thy 3') ||
    t.includes('thy4') ||
    t.includes('thy 4') ||
    t.includes('c3') ||
    t.includes('c4')
  );
}

/**
 * A critical finding — malignant cells present, or a high-grade dyskaryosis /
 * Thy5 / breast C5 / malignant reporting category — auto-escalates Axis D to
 * critical-alert. Mirrors the back-end invariant.
 * @param {CytologyResult} r
 * @returns {boolean}
 */
function hasCriticalFinding(r) {
  return r.malignancyPresent || hasHighGradeCategory(r);
}

/**
 * Whether any abnormal cytology finding is present.
 * @param {CytologyResult} r
 * @returns {boolean}
 */
function hasAnyAbnormalFinding(r) {
  return (
    r.malignancyPresent ||
    r.dysplasiaPresent ||
    hasHighGradeCategory(r) ||
    hasLowGradeCategory(r)
  );
}

/**
 * Whether HPV is positive on an otherwise non-malignant specimen.
 * @param {CytologyResult} r
 * @returns {boolean}
 */
function hasIsolatedHpvPositive(r) {
  return r.hpvResult === 'positive' && !hasAnyAbnormalFinding(r);
}

// ----------------------------------------------------------------------
// Axis A — result classification (mirrors `classification-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: malignant cells, or a high-grade dyskaryosis / Thy5 / breast C5 /
 *   malignant reporting category, is present.
 * - inconclusive: the specimen was unsatisfactory / inadequate, or no diagnosis
 *   could be reached.
 * - abnormal: any abnormal cytology finding (dysplasia, HPV-driven, low-grade)
 *   is present.
 * - normal: no abnormal finding and a satisfactory specimen.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 *
 * @param {CytologyResult} r
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
        'A critical finding (malignant cells, high-grade dyskaryosis, Thy5, or breast C5) is present; classified as critical.'
    });
    return { resultClassification: 'critical', firedRules };
  }

  if (r.specimenAdequacy === 'unsatisfactory') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-01',
      axis: 'classification',
      category: 'unsatisfactory-specimen',
      description: 'Specimen was unsatisfactory for interpretation; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (r.cytologyResultCategory.trim() === '' && r.diagnosis.trim() === '') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-02',
      axis: 'classification',
      category: 'no-diagnosis',
      description:
        'No result category and no diagnosis were recorded; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (hasAnyAbnormalFinding(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-01',
      axis: 'classification',
      category: 'abnormal-finding',
      description:
        'One or more abnormal cytology findings (dysplasia / dyskaryosis, low-grade or atypical category) are present; classified as abnormal.'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  if (r.hpvResult === 'positive') {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-02',
      axis: 'classification',
      category: 'hpv-positive',
      description:
        'HPV positive with negative cytology; classified as abnormal (HPV surveillance pathway).'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  firedRules.push({
    ruleId: 'R-CLASS-NORMAL-01',
    axis: 'classification',
    category: 'no-abnormal-finding',
    description:
      'No abnormal cytology finding on a satisfactory specimen; classified as normal.'
  });
  return { resultClassification: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis B — abnormality severity (mirrors `severity-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in the NHS
 * cervical-screening / RCPath structured-reporting bands:
 * - major: a critical finding (malignant cells, high-grade dyskaryosis, Thy5,
 *   breast C5).
 * - moderate: dysplasia / dyskaryosis present, or a low-grade / borderline /
 *   atypical / suspicious reporting category.
 * - minor: an isolated HPV-positive surveillance result.
 * - none: a normal specimen.
 *
 * The `reportingCategory` carries the recorded structured-reporting grading
 * label (e.g. an NHS dyskaryosis grade, RCPath Thy or breast C category); it
 * falls back to a derived label when the report did not record one.
 *
 * @param {CytologyResult} r
 * @param {ResultClassification} classification
 * @returns {{ abnormalitySeverity: AbnormalitySeverity, reportingCategory: string,
 *             firedRules: FiredRule[] }}
 */
function gradeSeverity(r, classification) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  const recorded = r.reportingCategory.trim();

  if (hasCriticalFinding(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-01',
      axis: 'severity',
      category: 'critical-finding',
      description: 'Critical finding present; abnormality severity graded major.'
    });
    return {
      abnormalitySeverity: 'major',
      reportingCategory: recorded || 'high-grade / malignant',
      firedRules
    };
  }

  if (r.dysplasiaPresent || hasLowGradeCategory(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-01',
      axis: 'severity',
      category: 'low-grade-abnormality',
      description:
        'Dysplasia / dyskaryosis or a low-grade / borderline / atypical category is present; severity graded moderate.'
    });
    return {
      abnormalitySeverity: 'moderate',
      reportingCategory: recorded || 'low-grade / borderline',
      firedRules
    };
  }

  if (r.hpvResult === 'positive') {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-01',
      axis: 'severity',
      category: 'hpv-positive',
      description: 'HPV positive with negative cytology; abnormality severity graded minor.'
    });
    return {
      abnormalitySeverity: 'minor',
      reportingCategory: recorded || 'hpv-surveillance',
      firedRules
    };
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
      reportingCategory: recorded || 'indeterminate',
      firedRules
    };
  }

  firedRules.push({
    ruleId: 'R-SEV-NONE-01',
    axis: 'severity',
    category: 'no-abnormal-finding',
    description: 'No abnormal finding; abnormality severity graded none.'
  });
  return {
    abnormalitySeverity: 'none',
    reportingCategory: recorded || 'negative',
    firedRules
  };
}

// ----------------------------------------------------------------------
// Axis C — report completeness (mirrors `completeness-rules.ts`)
// ----------------------------------------------------------------------

/**
 * The five mandatory report sections per RCPath cytopathology reporting
 * standards: clinical history, specimen adequacy, microscopic description,
 * diagnosis, and impression.
 *
 * @type {Array<{ ruleId: string, category: string, label: string,
 *                present: (r: CytologyResult) => boolean }>}
 */
const completenessSections = [
  {
    ruleId: 'R-COMP-HISTORY-01',
    category: 'history',
    label: 'clinical history',
    present: (r) => r.clinicalHistory.trim() !== ''
  },
  {
    ruleId: 'R-COMP-ADEQUACY-01',
    category: 'adequacy',
    label: 'specimen adequacy',
    present: (r) => r.specimenAdequacy !== ''
  },
  {
    ruleId: 'R-COMP-MICROSCOPY-01',
    category: 'microscopy',
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
 * Axis C — report completeness.
 *
 * Returns the percentage (0-100, rounded) of mandatory report sections that
 * are present, plus an audit-trail rule for each missing section.
 *
 * @param {CytologyResult} r
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
 * critical finding (malignant cells, high-grade dyskaryosis, Thy5, breast C5)
 * auto-escalates to critical-alert regardless of the other axes (the safety
 * invariant), recommending urgent colposcopy / MDT referral. The least-urgent
 * band is chosen only when no rule fires.
 *
 * @param {CytologyResult} r
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
        'Communicate the critical result directly to the referrer now, document the conversation, and refer for urgent colposcopy / MDT review.',
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
      recommendedAction: 'Arrange urgent colposcopy / specialist referral on a 2-week-wait pathway.',
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
        'Recommend colposcopy referral or repeat cytology per the relevant screening protocol.',
      firedRules
    };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-02',
      axis: 'follow-up',
      category: 'inconclusive',
      description: 'Inconclusive / unsatisfactory specimen; repeat sampling recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 3 months',
      recommendedAction: 'Recommend repeat specimen to resolve the inadequate / inconclusive result.',
      firedRules
    };
  }

  if (r.hpvResult === 'positive') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-03',
      axis: 'follow-up',
      category: 'hpv-positive',
      description: 'HPV positive; early recall / surveillance recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'early recall (12 months)',
      recommendedAction:
        'Manage per the HPV-surveillance pathway with early recall for repeat HPV testing.',
      firedRules
    };
  }

  // ─── routine: least-urgent band, no rule fired ───
  firedRules.push({
    ruleId: 'R-FU-ROUTINE-01',
    axis: 'follow-up',
    category: 'normal',
    description: 'No escalation rule fired; routine recall only.'
  });
  return {
    followUpUrgency: 'routine',
    targetTimeframe: 'routine recall',
    recommendedAction: 'No specific follow-up required; return to routine recall.',
    firedRules
  };
}

Object.assign(window.CytologyTestResult, {
  hasHighGradeCategory,
  hasLowGradeCategory,
  hasCriticalFinding,
  hasAnyAbnormalFinding,
  hasIsolatedHpvPositive,
  classifyResult,
  gradeSeverity,
  gradeCompleteness,
  gradeFollowUp
});
})();
