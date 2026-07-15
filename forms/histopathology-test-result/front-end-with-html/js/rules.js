// Declarative four-axis grading rules for the Histopathology Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine modules
// `src/lib/engine/{classification-rules,severity-rules,completeness-rules,
// follow-up-rules,utils}.ts` (predicates only — display helpers live in
// `types.js`). Rule IDs, categories, and descriptions are stable and identical
// across every front-end and the back-end; rows mirror the
// `histopathology_test_result_grade_rule` SQL table.
//
// The grader (`grader.js`) composes the four axis functions into the full
// `GradingResult`; `flags.js` raises the safety-critical flags independently.

/**
 * @typedef {import('./types.js').HistopathologyResult} HistopathologyResult
 * @typedef {import('./types.js').ResultClassification} ResultClassification
 * @typedef {import('./types.js').AbnormalitySeverity} AbnormalitySeverity
 * @typedef {import('./types.js').FollowUpUrgency} FollowUpUrgency
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.HistopathologyTestResult.

// ----------------------------------------------------------------------
// Structured-findings predicates (mirror `utils.ts`)
// ----------------------------------------------------------------------

/**
 * Whether an originating request reference is recorded. When malignancy is
 * present but the report is not linked to an originating request, the finding
 * is treated as unexpected.
 * @param {HistopathologyResult} r
 * @returns {boolean}
 */
function hasOriginatingRequest(r) {
  return r.originatingRequestReference.trim() !== '';
}

/**
 * Whether the malignancy is unexpected: malignancy is present but no
 * originating request reference links the report to a referral that
 * anticipated it. An unexpected malignancy is a critical finding.
 * @param {HistopathologyResult} r
 * @returns {boolean}
 */
function hasUnexpectedMalignancy(r) {
  return r.malignancyPresent && !hasOriginatingRequest(r);
}

/**
 * Whether a curative resection has an involved (positive) margin.
 * @param {HistopathologyResult} r
 * @returns {boolean}
 */
function hasInvolvedMargin(r) {
  return r.resectionMargins === 'involved';
}

/**
 * A critical finding (an unexpected malignancy, or an involved resection
 * margin) auto-escalates Axis D to critical-alert. Mirrors the back-end
 * invariant.
 * @param {HistopathologyResult} r
 * @returns {boolean}
 */
function hasCriticalFinding(r) {
  return hasUnexpectedMalignancy(r) || hasInvolvedMargin(r);
}

/**
 * Whether any structured abnormal finding is present.
 * @param {HistopathologyResult} r
 * @returns {boolean}
 */
function hasAnyAbnormalFinding(r) {
  return (
    r.malignancyPresent ||
    hasInvolvedMargin(r) ||
    r.resectionMargins === 'close' ||
    r.lymphovascularInvasion
  );
}

// ----------------------------------------------------------------------
// Axis A — result classification (mirrors `classification-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical finding (an unexpected malignancy, or an involved
 *   resection margin) is present.
 * - inconclusive: the specimen was inadequate, or suboptimal with no confident
 *   diagnosis.
 * - abnormal: confirmed (but expected) malignancy or another abnormal
 *   structured finding is present.
 * - normal: no abnormal finding on an adequate specimen.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 *
 * @param {HistopathologyResult} r
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
        'A critical finding (an unexpected malignancy or an involved resection margin) is present; classified as critical.'
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

  if (r.malignancyPresent) {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-01',
      axis: 'classification',
      category: 'malignancy-present',
      description: 'Malignancy is present; classified as abnormal.'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  if (hasAnyAbnormalFinding(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-02',
      axis: 'classification',
      category: 'abnormal-finding',
      description:
        'One or more abnormal structured findings (close margin or lymphovascular invasion) are present; classified as abnormal.'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  firedRules.push({
    ruleId: 'R-CLASS-NORMAL-01',
    axis: 'classification',
    category: 'no-abnormal-finding',
    description:
      'No malignancy and no abnormal structured findings on an adequate specimen; classified as normal.'
  });
  return { resultClassification: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis B — abnormality severity (mirrors `severity-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Builds the structured-reporting `reportingCategory` label from the RCPath
 * cancer-dataset core data items: histological grade and the pathological TNM
 * stage (pT / pN / pM). Falls back to a descriptive label where staging is not
 * recorded. The report's own free-text `reportingCategory` (the grade/stage
 * summary line) takes precedence when supplied.
 *
 * @param {HistopathologyResult} r
 * @param {string} fallback
 * @returns {string}
 */
function buildReportingCategory(r, fallback) {
  if (r.reportingCategory.trim() !== '') {
    return r.reportingCategory.trim();
  }
  /** @type {string[]} */
  const parts = [];
  const tnm = [r.tnmPt, r.tnmPn, r.tnmPm]
    .map(function (t) { return t.trim(); })
    .filter(function (t) { return t !== ''; });
  if (tnm.length > 0) {
    parts.push(tnm.join(' '));
  }
  if (r.histologicalGrade !== '' && r.histologicalGrade !== 'not-applicable') {
    parts.push(r.histologicalGrade);
  }
  return parts.length > 0 ? parts.join(', ') : fallback;
}

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in the RCPath
 * cancer-dataset grade/stage core items (differentiation, pTNM, resection
 * margins, lymphovascular invasion):
 * - major: a critical finding (unexpected malignancy / involved margin), an
 *   undifferentiated or poorly differentiated tumour, or nodal / distant
 *   metastatic disease.
 * - moderate: confirmed malignancy or another actionable abnormal finding.
 * - minor: a close margin or lymphovascular invasion without malignancy.
 * - none: a normal study.
 *
 * The `reportingCategory` carries the grade/stage summary suitable for
 * downstream structured-reporting and MDT workflows.
 *
 * @param {HistopathologyResult} r
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
    return {
      abnormalitySeverity: 'major',
      reportingCategory: buildReportingCategory(r, 'critical-actionable'),
      firedRules
    };
  }

  const highGrade =
    r.histologicalGrade === 'poorly-differentiated' ||
    r.histologicalGrade === 'undifferentiated';
  const nodalOrMetastatic =
    (r.tnmPn.trim() !== '' && !/N0/i.test(r.tnmPn)) ||
    (r.tnmPm.trim() !== '' && /M1/i.test(r.tnmPm));

  if (r.malignancyPresent && (highGrade || nodalOrMetastatic)) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-02',
      axis: 'severity',
      category: 'high-grade-or-advanced-stage',
      description:
        'Malignancy with a high histological grade or nodal / distant metastatic stage; abnormality severity graded major.'
    });
    return {
      abnormalitySeverity: 'major',
      reportingCategory: buildReportingCategory(r, 'high-grade-malignancy'),
      firedRules
    };
  }

  if (r.malignancyPresent) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-01',
      axis: 'severity',
      category: 'malignancy-present',
      description: 'Confirmed malignancy present; abnormality severity graded moderate.'
    });
    return {
      abnormalitySeverity: 'moderate',
      reportingCategory: buildReportingCategory(r, 'malignancy'),
      firedRules
    };
  }

  if (hasAnyAbnormalFinding(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-01',
      axis: 'severity',
      category: 'abnormal-finding',
      description:
        'A close margin or lymphovascular invasion without malignancy; abnormality severity graded minor.'
    });
    return {
      abnormalitySeverity: 'minor',
      reportingCategory: buildReportingCategory(r, 'borderline'),
      firedRules
    };
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
  return { abnormalitySeverity: 'none', reportingCategory: 'benign', firedRules };
}

// ----------------------------------------------------------------------
// Axis C — report completeness (mirrors `completeness-rules.ts`)
// ----------------------------------------------------------------------

/**
 * The five mandatory report sections per RCPath structured-reporting
 * standards: clinical history, macroscopic description, microscopic
 * description, diagnosis, and impression.
 *
 * @type {Array<{ ruleId: string, category: string, label: string,
 *                present: (r: HistopathologyResult) => boolean }>}
 */
const completenessSections = [
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
 * Axis C — report completeness.
 *
 * Returns the percentage (0-100, rounded) of mandatory report sections that
 * are present, plus an audit-trail rule for each missing section.
 *
 * @param {HistopathologyResult} r
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
 * critical finding (unexpected malignancy / involved margin) auto-escalates to
 * critical-alert regardless of the other axes (the safety invariant).
 * Confirmed malignancy drives urgent MDT discussion. The least-urgent band is
 * chosen only when no rule fires.
 *
 * @param {HistopathologyResult} r
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
        'Critical finding (unexpected malignancy or involved margin) auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
    });
    return {
      followUpUrgency: 'critical-alert',
      targetTimeframe: 'immediate',
      recommendedAction:
        'Communicate the critical result directly to the requester now, refer to the urgent cancer MDT, and document the conversation.',
      firedRules
    };
  }

  // ─── urgent ───
  if (r.malignancyPresent || severity === 'major') {
    firedRules.push({
      ruleId: 'R-FU-URGENT-01',
      axis: 'follow-up',
      category: 'malignancy-mdt',
      description:
        'Confirmed malignancy or a major abnormality present; urgent MDT discussion required.'
    });
    return {
      followUpUrgency: 'urgent',
      targetTimeframe: 'within 2 weeks',
      recommendedAction:
        'Refer to the cancer multidisciplinary team (MDT) and expedite onward management per the 2-week-wait pathway.',
      firedRules
    };
  }

  // ─── recommended ───
  if (severity === 'moderate' || severity === 'minor') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-01',
      axis: 'follow-up',
      category: 'abnormal-finding',
      description: 'Abnormal structured finding present; follow-up recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 2 weeks',
      recommendedAction:
        'Recommend clinical correlation, MDT review, or further sampling as clinically indicated.',
      firedRules
    };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-02',
      axis: 'follow-up',
      category: 'inconclusive',
      description: 'Inconclusive study; repeat or further sampling recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 2 weeks',
      recommendedAction:
        'Recommend a repeat or further specimen to resolve the inconclusive result.',
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
    recommendedAction: 'No specific pathology follow-up required; manage per usual care.',
    firedRules
  };
}

export { hasOriginatingRequest, hasUnexpectedMalignancy, hasInvolvedMargin, hasCriticalFinding, hasAnyAbnormalFinding, buildReportingCategory, classifyResult, gradeSeverity, gradeCompleteness, gradeFollowUp };
