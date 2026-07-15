// Declarative four-axis grading rules for the Blood Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine modules
// `src/lib/engine/{classification-rules,severity-rules,completeness-rules,
// follow-up-rules,utils}.ts` (predicates only — display helpers live in
// `types.js`). Rule IDs, categories, and descriptions are stable and identical
// across every front-end and the back-end; rows mirror the
// `blood_test_result_grade_rule` SQL table.
//
// The grader (`grader.js`) composes the four axis functions into the full
// `GradingResult`; `flags.js` raises the safety-critical flags independently.

/**
 * @typedef {import('./types.js').BloodTestResult} BloodTestResult
 * @typedef {import('./types.js').ResultClassification} ResultClassification
 * @typedef {import('./types.js').AbnormalitySeverity} AbnormalitySeverity
 * @typedef {import('./types.js').FollowUpUrgency} FollowUpUrgency
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.BloodTestResult.

// ----------------------------------------------------------------------
// Interpretation-summary predicates (mirror `utils.ts`)
// ----------------------------------------------------------------------

/**
 * A critical (panic) value auto-escalates Axis A to critical and Axis D to
 * critical-alert. Driven by the reporter-supplied summary flag (and an overall
 * status of critical). Mirrors the back-end invariant.
 * @param {BloodTestResult} r
 * @returns {boolean}
 */
function hasCriticalValue(r) {
  return r.criticalValuePresent || r.overallResultStatus === 'critical';
}

/**
 * Whether any analyte result is flagged abnormal (but not critical).
 * @param {BloodTestResult} r
 * @returns {boolean}
 */
function hasAbnormalResult(r) {
  return r.abnormalResultsPresent || r.overallResultStatus === 'abnormal';
}

/**
 * The full set of analyte result values, in panel order, with display
 * metadata. Mirrors `analyteValues` in `utils.ts`.
 * @param {BloodTestResult} r
 * @returns {Array<{ key: string, label: string, panel: string, units: string,
 *                   value: number | null }>}
 */
function analyteValues(r) {
  return [
    { key: 'haemoglobinGL', label: 'Haemoglobin', panel: 'Full blood count', units: 'g/L', value: r.haemoglobinGL },
    { key: 'whiteCellCount', label: 'White cell count', panel: 'Full blood count', units: '×10⁹/L', value: r.whiteCellCount },
    { key: 'platelets', label: 'Platelets', panel: 'Full blood count', units: '×10⁹/L', value: r.platelets },
    { key: 'neutrophils', label: 'Neutrophils', panel: 'Full blood count', units: '×10⁹/L', value: r.neutrophils },
    { key: 'sodiumMmolL', label: 'Sodium', panel: 'Urea & electrolytes / renal', units: 'mmol/L', value: r.sodiumMmolL },
    { key: 'potassiumMmolL', label: 'Potassium', panel: 'Urea & electrolytes / renal', units: 'mmol/L', value: r.potassiumMmolL },
    { key: 'ureaMmolL', label: 'Urea', panel: 'Urea & electrolytes / renal', units: 'mmol/L', value: r.ureaMmolL },
    { key: 'creatinineUmolL', label: 'Creatinine', panel: 'Urea & electrolytes / renal', units: 'µmol/L', value: r.creatinineUmolL },
    { key: 'egfr', label: 'eGFR', panel: 'Urea & electrolytes / renal', units: 'mL/min/1.73m²', value: r.egfr },
    { key: 'altUL', label: 'ALT', panel: 'Liver function', units: 'U/L', value: r.altUL },
    { key: 'alkalinePhosphatase', label: 'Alkaline phosphatase', panel: 'Liver function', units: 'U/L', value: r.alkalinePhosphatase },
    { key: 'bilirubinUmolL', label: 'Bilirubin', panel: 'Liver function', units: 'µmol/L', value: r.bilirubinUmolL },
    { key: 'albuminGL', label: 'Albumin', panel: 'Liver function', units: 'g/L', value: r.albuminGL },
    { key: 'cReactiveProtein', label: 'C-reactive protein', panel: 'Inflammation', units: 'mg/L', value: r.cReactiveProtein },
    { key: 'hba1cMmolMol', label: 'HbA1c', panel: 'Glycaemic', units: 'mmol/mol', value: r.hba1cMmolMol },
    { key: 'glucoseMmolL', label: 'Glucose', panel: 'Glycaemic', units: 'mmol/L', value: r.glucoseMmolL },
    { key: 'tsh', label: 'TSH', panel: 'Endocrine', units: 'mU/L', value: r.tsh },
    { key: 'ferritin', label: 'Ferritin', panel: 'Haematinics', units: 'µg/L', value: r.ferritin },
    { key: 'inr', label: 'INR', panel: 'Coagulation', units: 'ratio', value: r.inr }
  ];
}

/**
 * Whether at least one analyte result value was measured (non-null).
 * @param {BloodTestResult} r
 * @returns {boolean}
 */
function hasAnyResultValue(r) {
  return analyteValues(r).some((a) => a.value !== null);
}

// ----------------------------------------------------------------------
// Axis A — result classification (mirrors `classification-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion against reference ranges and
 * critical (panic) values:
 * - critical: a critical (panic) value is present.
 * - inconclusive: no analyte result values were measured / the specimen was
 *   inadequate with no confident impression.
 * - abnormal: one or more abnormal results are present.
 * - normal: no abnormal result on an adequate specimen.
 *
 * Returns the classification plus the audit-trail rules that fired.
 *
 * @param {BloodTestResult} r
 * @returns {{ resultClassification: ResultClassification, firedRules: FiredRule[] }}
 */
function classifyResult(r) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  if (hasCriticalValue(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-CRITICAL-01',
      axis: 'classification',
      category: 'critical-value',
      description:
        'A critical (panic) value is present; classified as critical.'
    });
    return { resultClassification: 'critical', firedRules };
  }

  if (!hasAnyResultValue(r) && r.impression.trim() === '') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-01',
      axis: 'classification',
      category: 'no-result-values',
      description:
        'No analyte result values were measured and no impression was recorded; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (r.specimenCondition === 'insufficient' && r.impression.trim() === '') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-02',
      axis: 'classification',
      category: 'inadequate-specimen',
      description:
        'Specimen was insufficient and no impression was recorded; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (hasAbnormalResult(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-01',
      axis: 'classification',
      category: 'abnormal-result',
      description: 'One or more abnormal results are present; classified as abnormal.'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  firedRules.push({
    ruleId: 'R-CLASS-NORMAL-01',
    axis: 'classification',
    category: 'no-abnormal-result',
    description: 'No abnormal results on an adequate specimen; classified as normal.'
  });
  return { resultClassification: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis B — abnormality severity (mirrors `severity-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Structured-reporting category derived from analyte values: an eGFR CKD stage
 * or a glycaemic (HbA1c) band, grounded in NICE CKD staging and the WHO/IFCC
 * HbA1c diagnostic thresholds. Returns '' when no structured band applies.
 * @param {BloodTestResult} r
 * @returns {string}
 */
function structuredReportingCategory(r) {
  if (r.egfr !== null) {
    if (r.egfr >= 90) return 'eGFR CKD G1 (>=90)';
    if (r.egfr >= 60) return 'eGFR CKD G2 (60-89)';
    if (r.egfr >= 45) return 'eGFR CKD G3a (45-59)';
    if (r.egfr >= 30) return 'eGFR CKD G3b (30-44)';
    if (r.egfr >= 15) return 'eGFR CKD G4 (15-29)';
    return 'eGFR CKD G5 (<15)';
  }
  if (r.hba1cMmolMol !== null) {
    if (r.hba1cMmolMol >= 48) return 'HbA1c diabetes range (>=48)';
    if (r.hba1cMmolMol >= 42) return 'HbA1c prediabetes (42-47)';
    return 'HbA1c normal (<42)';
  }
  return '';
}

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in RCPath
 * actionable-reporting and the magnitude of deviation from the reference range:
 * - major: a critical (panic) value, or an overall status of critical.
 * - moderate: an abnormal result present (per the reporter summary flag).
 * - minor: a structured band that deviates from normal but is not flagged
 *   abnormal (e.g. CKD G2, prediabetes).
 * - none: a normal study.
 *
 * The `reportingCategory` is a short structured label (e.g. an eGFR CKD stage
 * or a glycaemic band) suitable for downstream structured-reporting workflows;
 * if the reporter supplied one, it takes precedence.
 *
 * @param {BloodTestResult} r
 * @param {ResultClassification} classification
 * @returns {{ abnormalitySeverity: AbnormalitySeverity, reportingCategory: string,
 *             firedRules: FiredRule[] }}
 */
function gradeSeverity(r, classification) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  const structured = structuredReportingCategory(r);
  const category = r.reportingCategory.trim() !== '' ? r.reportingCategory.trim() : structured;

  if (hasCriticalValue(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-01',
      axis: 'severity',
      category: 'critical-value',
      description: 'Critical (panic) value present; abnormality severity graded major.'
    });
    return {
      abnormalitySeverity: 'major',
      reportingCategory: category || 'critical-actionable',
      firedRules
    };
  }

  if (hasAbnormalResult(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-01',
      axis: 'severity',
      category: 'abnormal-result',
      description:
        'One or more abnormal results are present; abnormality severity graded moderate.'
    });
    return {
      abnormalitySeverity: 'moderate',
      reportingCategory: category || 'abnormal',
      firedRules
    };
  }

  if (structured !== '' && !structured.includes('G1') && !structured.includes('normal')) {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-01',
      axis: 'severity',
      category: 'structured-band',
      description:
        'A structured-reporting band deviates from normal but no result was flagged abnormal; severity graded minor.'
    });
    return { abnormalitySeverity: 'minor', reportingCategory: category, firedRules };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-SEV-NONE-02',
      axis: 'severity',
      category: 'inconclusive',
      description: 'Inconclusive study; abnormality severity not established.'
    });
    return { abnormalitySeverity: 'none', reportingCategory: category || 'indeterminate', firedRules };
  }

  firedRules.push({
    ruleId: 'R-SEV-NONE-01',
    axis: 'severity',
    category: 'no-abnormal-result',
    description: 'No abnormal result; abnormality severity graded none.'
  });
  return { abnormalitySeverity: 'none', reportingCategory: category || 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis C — report completeness (mirrors `completeness-rules.ts`)
// ----------------------------------------------------------------------

/**
 * The five mandatory report sections per RCPath actionable-reporting
 * standards: clinical history, results, comparison, findings, and impression.
 *
 * @type {Array<{ ruleId: string, category: string, label: string,
 *                present: (r: BloodTestResult) => boolean }>}
 */
const completenessSections = [
  {
    ruleId: 'R-COMP-HISTORY-01',
    category: 'history',
    label: 'clinical history',
    present: (r) => r.clinicalHistory.trim() !== ''
  },
  {
    ruleId: 'R-COMP-RESULTS-01',
    category: 'results',
    label: 'result values',
    present: (r) => hasAnyResultValue(r)
  },
  {
    ruleId: 'R-COMP-COMPARISON-01',
    category: 'comparison',
    label: 'comparison with previous results',
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
 * @param {BloodTestResult} r
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
 * critical (panic) value auto-escalates to critical-alert regardless of the
 * other axes (the safety invariant). An abnormal-but-not-critical result maps
 * to recommended. The least-urgent band is chosen only when no rule fires.
 *
 * @param {BloodTestResult} r
 * @param {ResultClassification} classification
 * @param {AbnormalitySeverity} severity
 * @returns {{ followUpUrgency: FollowUpUrgency, targetTimeframe: string,
 *             recommendedAction: string, firedRules: FiredRule[] }}
 */
function gradeFollowUp(r, classification, severity) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  // ─── critical-alert: auto-escalation invariant ───
  if (hasCriticalValue(r) || classification === 'critical') {
    firedRules.push({
      ruleId: 'R-FU-CRITICAL-01',
      axis: 'follow-up',
      category: 'critical-value',
      description:
        'Critical (panic) value auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
    });
    return {
      followUpUrgency: 'critical-alert',
      targetTimeframe: 'immediate',
      recommendedAction:
        'Communicate the critical result directly to the requester now and document the conversation.',
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
  if (severity === 'moderate' || hasAbnormalResult(r)) {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-01',
      axis: 'follow-up',
      category: 'abnormal-result',
      description: 'Abnormal result present; follow-up recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 2 weeks',
      recommendedAction: 'Recommend repeat testing or specialist referral as clinically indicated.',
      firedRules
    };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-02',
      axis: 'follow-up',
      category: 'inconclusive',
      description: 'Inconclusive study; repeat or supplementary testing recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 2 weeks',
      recommendedAction: 'Recommend repeat or supplementary testing to resolve the inconclusive result.',
      firedRules
    };
  }

  if (severity === 'minor') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-03',
      axis: 'follow-up',
      category: 'structured-band',
      description: 'A structured-reporting band deviates from normal; structured follow-up recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'per structured-reporting guidance',
      recommendedAction:
        'Manage per the relevant structured pathway (e.g. CKD or glycaemic monitoring guidance).',
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

export { hasCriticalValue, hasAbnormalResult, analyteValues, hasAnyResultValue, structuredReportingCategory, classifyResult, gradeSeverity, gradeCompleteness, gradeFollowUp };
