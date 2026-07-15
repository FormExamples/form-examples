// Declarative four-axis grading rules for the Urinalysis Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine modules
// `src/lib/engine/{classification-rules,severity-rules,completeness-rules,
// follow-up-rules,utils}.ts` (predicates only — display helpers live in
// `types.js`). Rule IDs, categories, and descriptions are stable and identical
// across every front-end and the back-end; rows mirror the
// `urinalysis_test_result_grade_rule` SQL table.
//
// The grader (`grader.js`) composes the four axis functions into the full
// `GradingResult`; `flags.js` raises the safety-critical flags independently.

/**
 * @typedef {import('./types.js').UrinalysisResult} UrinalysisResult
 * @typedef {import('./types.js').ResultClassification} ResultClassification
 * @typedef {import('./types.js').AbnormalitySeverity} AbnormalitySeverity
 * @typedef {import('./types.js').FollowUpUrgency} FollowUpUrgency
 * @typedef {import('./types.js').DipstickGrade} DipstickGrade
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.UrinalysisTestResult.

// ----------------------------------------------------------------------
// Structured-findings predicates (mirror `utils.ts`)
// ----------------------------------------------------------------------

/**
 * Whether a dipstick reagent grade is positive (anything above negative / blank).
 * @param {DipstickGrade} value
 * @returns {boolean}
 */
function isDipstickPositive(value) {
  return value === 'trace' || value === 'plus-one' || value === 'plus-two' || value === 'plus-three';
}

/**
 * Whether a dipstick reagent grade is strongly positive (1+ or higher).
 * @param {DipstickGrade} value
 * @returns {boolean}
 */
function isDipstickStrong(value) {
  return value === 'plus-one' || value === 'plus-two' || value === 'plus-three';
}

/**
 * A critical finding auto-escalates Axis D to critical-alert. Mirrors the
 * back-end invariant: significant growth in pregnancy, a critical organism,
 * suspected urosepsis, or visible (frank) haematuria.
 * @param {UrinalysisResult} r
 * @returns {boolean}
 */
function hasCriticalFinding(r) {
  const significantGrowthInPregnancy = r.cultureResult === 'significant-growth' && r.pregnant;
  return (
    significantGrowthInPregnancy ||
    r.criticalOrganism ||
    r.suspectedUrosepsis ||
    r.visibleHaematuria ||
    r.overallResultStatus === 'critical'
  );
}

/**
 * Whether significant bacteriuria (significant growth) is present.
 * @param {UrinalysisResult} r
 * @returns {boolean}
 */
function hasSignificantGrowth(r) {
  return r.cultureResult === 'significant-growth';
}

/**
 * Whether dipstick / microscopy suggest a urinary tract infection.
 * @param {UrinalysisResult} r
 * @returns {boolean}
 */
function hasUtiFeatures(r) {
  return (
    isDipstickPositive(r.leucocytes) ||
    r.nitrites === 'positive' ||
    r.organismsSeen
  );
}

/**
 * Whether any structured abnormal finding is present.
 * @param {UrinalysisResult} r
 * @returns {boolean}
 */
function hasAnyAbnormalFinding(r) {
  return (
    hasSignificantGrowth(r) ||
    hasUtiFeatures(r) ||
    isDipstickPositive(r.blood) ||
    isDipstickStrong(r.protein) ||
    isDipstickPositive(r.glucose) ||
    r.visibleHaematuria ||
    r.suspectedUrosepsis ||
    r.criticalOrganism ||
    r.overallResultStatus === 'abnormal' ||
    r.overallResultStatus === 'critical'
  );
}

/**
 * Whether the report describes only an incidental finding (no UTI / growth).
 * @param {UrinalysisResult} r
 * @returns {boolean}
 */
function hasOnlyIncidentalFinding(r) {
  const incidental =
    isDipstickPositive(r.glucose) || r.casts.trim() !== '' || r.crystals.trim() !== '';
  const significant =
    hasSignificantGrowth(r) ||
    hasUtiFeatures(r) ||
    isDipstickPositive(r.blood) ||
    isDipstickStrong(r.protein) ||
    r.visibleHaematuria ||
    r.suspectedUrosepsis ||
    r.criticalOrganism;
  return incidental && !significant;
}

// ----------------------------------------------------------------------
// Axis A — result classification (mirrors `classification-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical finding (significant growth in pregnancy, a critical
 *   organism, suspected urosepsis, or visible haematuria) is present.
 * - inconclusive: the specimen was insufficient, or contaminated / mixed-growth
 *   with no confident impression.
 * - abnormal: any abnormal finding (significant growth, UTI features, dipstick
 *   blood / protein) is present.
 * - normal: no abnormal finding on a satisfactory specimen.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 *
 * @param {UrinalysisResult} r
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
        'A critical finding (significant growth in pregnancy, critical organism, suspected urosepsis, or visible haematuria) is present; classified as critical.'
    });
    return { resultClassification: 'critical', firedRules };
  }

  if (r.specimenCondition === 'insufficient') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-01',
      axis: 'classification',
      category: 'insufficient-specimen',
      description: 'Specimen was insufficient; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (r.cultureResult === 'mixed-growth-likely-contaminant' && r.impression.trim() === '') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-02',
      axis: 'classification',
      category: 'mixed-growth-no-impression',
      description:
        'Mixed growth (likely contaminant) and no impression was recorded; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (hasSignificantGrowth(r) || hasUtiFeatures(r) || hasAnyAbnormalFinding(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-01',
      axis: 'classification',
      category: 'abnormal-finding',
      description: 'One or more abnormal findings are present; classified as abnormal.'
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
    description: 'No abnormal findings on a satisfactory specimen; classified as normal.'
  });
  return { resultClassification: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis B — abnormality severity (mirrors `severity-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in UK SMI B41
 * significance-of-bacteriuria principles and asymptomatic-bacteriuria
 * categories:
 * - major: a critical finding, or significant growth in pregnancy.
 * - moderate: significant bacteriuria, or UTI features (pyuria / nitrites /
 *   organisms seen), or visible / dipstick haematuria.
 * - minor: incidental-only findings (glucosuria, crystals, casts).
 * - none: a normal study.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * structured-reporting workflows.
 *
 * @param {UrinalysisResult} r
 * @param {ResultClassification} classification
 * @returns {{ abnormalitySeverity: AbnormalitySeverity, reportingCategory: string, firedRules: FiredRule[] }}
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
    const category =
      hasSignificantGrowth(r) && r.pregnant
        ? 'significant bacteriuria in pregnancy'
        : 'critical-actionable';
    return { abnormalitySeverity: 'major', reportingCategory: category, firedRules };
  }

  if (hasSignificantGrowth(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-01',
      axis: 'severity',
      category: 'significant-bacteriuria',
      description: 'Significant bacteriuria on culture; abnormality severity graded moderate.'
    });
    const organism = r.organismIsolated.trim() !== '' ? `significant ${r.organismIsolated} bacteriuria` : 'significant bacteriuria';
    return { abnormalitySeverity: 'moderate', reportingCategory: organism, firedRules };
  }

  if (hasUtiFeatures(r) || isDipstickPositive(r.blood) || isDipstickStrong(r.protein)) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-02',
      axis: 'severity',
      category: 'uti-features',
      description:
        'UTI features (pyuria, nitrites, organisms seen) or dipstick haematuria / proteinuria present; severity graded moderate.'
    });
    return { abnormalitySeverity: 'moderate', reportingCategory: 'suspected urinary tract infection', firedRules };
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
 * The five mandatory report sections per UK SMI B41 / RCPath reporting
 * standards: clinical history, specimen, dipstick, microscopy/culture, and
 * impression.
 *
 * @type {Array<{ ruleId: string, category: string, label: string,
 *                present: (r: UrinalysisResult) => boolean }>}
 */
const sections = [
  {
    ruleId: 'R-COMP-HISTORY-01',
    category: 'history',
    label: 'clinical history',
    present: (r) => r.clinicalHistory.trim() !== ''
  },
  {
    ruleId: 'R-COMP-SPECIMEN-01',
    category: 'specimen',
    label: 'specimen type and condition',
    present: (r) => r.specimenType !== '' && r.specimenCondition !== ''
  },
  {
    ruleId: 'R-COMP-DIPSTICK-01',
    category: 'dipstick',
    label: 'dipstick results',
    present: (r) =>
      r.leucocytes !== '' ||
      r.nitrites !== '' ||
      r.protein !== '' ||
      r.blood !== '' ||
      r.glucose !== '' ||
      r.ketones !== '' ||
      r.bilirubin !== '' ||
      r.ph !== null ||
      r.specificGravity !== null
  },
  {
    ruleId: 'R-COMP-CULTURE-01',
    category: 'microscopy-culture',
    label: 'microscopy / culture',
    present: (r) =>
      r.cultureResult !== '' ||
      r.organismsSeen ||
      r.whiteCellCount.trim() !== '' ||
      r.redCellCount.trim() !== '' ||
      r.organismIsolated.trim() !== ''
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
 * @param {UrinalysisResult} r
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
 * critical finding auto-escalates to critical-alert regardless of the other
 * axes (the safety invariant). The least-urgent band is chosen only when no
 * rule fires.
 *
 * @param {UrinalysisResult} r
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
  if (severity === 'moderate') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-01',
      axis: 'follow-up',
      category: 'moderate-abnormality',
      description: 'Moderate abnormality present; follow-up recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 1 week',
      recommendedAction:
        'Treat per antimicrobial guidance / sensitivities or recommend repeat testing as clinically indicated.',
      firedRules
    };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-02',
      axis: 'follow-up',
      category: 'inconclusive',
      description: 'Inconclusive study; repeat specimen recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 1 week',
      recommendedAction: 'Recommend a repeat midstream specimen to resolve the inconclusive study.',
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
        'Manage the incidental finding (e.g. glucosuria) per the relevant clinical pathway.',
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

export { isDipstickPositive, isDipstickStrong, hasCriticalFinding, hasSignificantGrowth, hasUtiFeatures, hasAnyAbnormalFinding, hasOnlyIncidentalFinding, classifyResult, gradeSeverity, gradeCompleteness, gradeFollowUp };
