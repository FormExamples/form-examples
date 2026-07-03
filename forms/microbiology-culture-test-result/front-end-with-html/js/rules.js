// Declarative four-axis grading rules for the Microbiology Culture Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine modules
// `src/lib/engine/{classification-rules,severity-rules,completeness-rules,
// follow-up-rules,utils}.ts` (predicates only — display helpers live in
// `types.js`). Rule IDs, categories, and descriptions are stable and identical
// across every front-end and the back-end; rows mirror the
// `microbiology_culture_test_result_grade_rule` SQL table.
//
// The grader (`grader.js`) composes the four axis functions into the full
// `GradingResult`; `flags.js` raises the safety-critical flags independently.

/**
 * @typedef {import('./types.js').MicrobiologyCultureResult} MicrobiologyCultureResult
 * @typedef {import('./types.js').ResultClassification} ResultClassification
 * @typedef {import('./types.js').AbnormalitySeverity} AbnormalitySeverity
 * @typedef {import('./types.js').FollowUpUrgency} FollowUpUrgency
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.MicrobiologyCultureTestResult.
(function () {
'use strict';
window.MicrobiologyCultureTestResult = window.MicrobiologyCultureTestResult || {};

// ----------------------------------------------------------------------
// Structured-findings predicates (mirror `utils.ts`)
// ----------------------------------------------------------------------

/**
 * Whether the culture grew a clinically significant organism.
 * @param {MicrobiologyCultureResult} r
 * @returns {boolean}
 */
function isPositiveCulture(r) {
  return r.cultureResult === 'significant-growth' || r.cultureResult === 'positive';
}

/**
 * A critical organism / result auto-escalates Axis D to critical-alert.
 * Mirrors the back-end invariant: a positive blood culture, a CSF isolate, a
 * carbapenemase-producing Enterobacterales (CPE), or any record explicitly
 * flagged `criticalOrganism`.
 * @param {MicrobiologyCultureResult} r
 * @returns {boolean}
 */
function hasCriticalOrganism(r) {
  const grown = isPositiveCulture(r);
  const positiveBloodCulture = r.specimenType === 'blood-culture' && grown;
  const csfIsolate = r.specimenType === 'csf' && grown;
  return r.criticalOrganism || r.resistanceCpe || positiveBloodCulture || csfIsolate;
}

/**
 * Whether any resistance marker (MRSA / ESBL / CPE) is present.
 * @param {MicrobiologyCultureResult} r
 * @returns {boolean}
 */
function hasResistanceMarker(r) {
  return r.resistanceMrsa || r.resistanceEsbl || r.resistanceCpe;
}

/**
 * Whether a specialised test (C. difficile toxin or AFB) is positive.
 * @param {MicrobiologyCultureResult} r
 * @returns {boolean}
 */
function hasPositiveSpecialisedTest(r) {
  return r.cDifficileToxin === 'positive' || r.acidFastBacilli === 'positive';
}

/**
 * Whether any abnormal microbiological finding is present.
 * @param {MicrobiologyCultureResult} r
 * @returns {boolean}
 */
function hasAnyAbnormalFinding(r) {
  return (
    hasCriticalOrganism(r) ||
    isPositiveCulture(r) ||
    hasResistanceMarker(r) ||
    hasPositiveSpecialisedTest(r)
  );
}

// ----------------------------------------------------------------------
// Axis A — result classification (mirrors `classification-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical organism / result (positive blood culture, CSF
 *   isolate, CPE, or a flagged critical organism) is present.
 * - inconclusive: the specimen was insufficient / contaminated, or no
 *   confident impression could be reached.
 * - abnormal: any abnormal microbiological finding is present (significant
 *   growth, resistance marker, or positive specialised test).
 * - normal: no growth / no abnormal finding on a satisfactory specimen.
 *
 * @param {MicrobiologyCultureResult} r
 * @returns {{ resultClassification: ResultClassification, firedRules: FiredRule[] }}
 */
function classifyResult(r) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  if (hasCriticalOrganism(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-CRITICAL-01',
      axis: 'classification',
      category: 'critical-organism',
      description:
        'A critical organism / result (positive blood culture, CSF isolate, CPE, or flagged critical organism) is present; classified as critical.'
    });
    return { resultClassification: 'critical', firedRules };
  }

  if (r.specimenCondition === 'insufficient') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-01',
      axis: 'classification',
      category: 'insufficient-specimen',
      description: 'Specimen was insufficient for processing; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (
    (r.specimenCondition === 'contaminated' || r.cultureResult === 'mixed-growth') &&
    r.impression.trim() === ''
  ) {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-02',
      axis: 'classification',
      category: 'contaminated-no-impression',
      description:
        'Specimen was contaminated or grew mixed flora and no impression was recorded; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (hasAnyAbnormalFinding(r)) {
    const category = isPositiveCulture(r)
      ? 'significant-growth'
      : hasResistanceMarker(r)
        ? 'resistance-marker'
        : hasPositiveSpecialisedTest(r)
          ? 'positive-specialised-test'
          : 'abnormal-finding';
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-01',
      axis: 'classification',
      category,
      description:
        'A clinically significant microbiological finding is present (significant growth, resistance marker, or positive specialised test); classified as abnormal.'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  firedRules.push({
    ruleId: 'R-CLASS-NORMAL-01',
    axis: 'classification',
    category: 'no-significant-growth',
    description:
      'No significant growth and no abnormal finding on a satisfactory specimen; classified as normal.'
  });
  return { resultClassification: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis B — abnormality severity (mirrors `severity-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in the infection
 * significance of the finding and the resistance markers (MRSA / ESBL / CPE).
 *
 * @param {MicrobiologyCultureResult} r
 * @param {ResultClassification} classification
 * @returns {{ abnormalitySeverity: AbnormalitySeverity, reportingCategory: string,
 *             firedRules: FiredRule[] }}
 */
function gradeSeverity(r, classification) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  if (hasCriticalOrganism(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-01',
      axis: 'severity',
      category: 'critical-organism',
      description: 'Critical organism / result present; abnormality severity graded major.'
    });
    return { abnormalitySeverity: 'major', reportingCategory: 'critical-actionable', firedRules };
  }

  if (hasResistanceMarker(r) && isPositiveCulture(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-02',
      axis: 'severity',
      category: 'resistant-organism',
      description:
        'A resistant alert organism (MRSA / ESBL) on a significant culture; abnormality severity graded major.'
    });
    return { abnormalitySeverity: 'major', reportingCategory: 'resistant-organism', firedRules };
  }

  if (isPositiveCulture(r) || hasPositiveSpecialisedTest(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-01',
      axis: 'severity',
      category: 'significant-finding',
      description:
        'A clinically significant finding (significant growth or positive specialised test) is present; severity graded moderate.'
    });
    const category = hasPositiveSpecialisedTest(r) ? 'specialised-positive' : 'significant-growth';
    return { abnormalitySeverity: 'moderate', reportingCategory: category, firedRules };
  }

  if (hasResistanceMarker(r) || r.cultureResult === 'mixed-growth') {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-01',
      axis: 'severity',
      category: 'minor-finding',
      description:
        'Mixed / contaminant growth or an isolated resistance marker without a significant culture; abnormality severity graded minor.'
    });
    const category = r.cultureResult === 'mixed-growth' ? 'mixed-growth' : 'resistance-marker';
    return { abnormalitySeverity: 'minor', reportingCategory: category, firedRules };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-SEV-NONE-02',
      axis: 'severity',
      category: 'inconclusive',
      description: 'Inconclusive result; abnormality severity not established.'
    });
    return { abnormalitySeverity: 'none', reportingCategory: 'indeterminate', firedRules };
  }

  firedRules.push({
    ruleId: 'R-SEV-NONE-01',
    axis: 'severity',
    category: 'no-significant-growth',
    description: 'No significant growth; abnormality severity graded none.'
  });
  return { abnormalitySeverity: 'none', reportingCategory: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis C — report completeness (mirrors `completeness-rules.ts`)
// ----------------------------------------------------------------------

/**
 * The five mandatory report sections per RCPath / UK SMI reporting standards:
 * clinical history, specimen, microscopy/culture, sensitivities, and impression.
 *
 * @type {Array<{ ruleId: string, category: string, label: string,
 *                present: (r: MicrobiologyCultureResult) => boolean }>}
 */
const completenessSections = [
  {
    ruleId: 'R-COMP-HISTORY-01',
    category: 'history',
    label: 'clinical history',
    present: (r) => r.clinicalHistory.trim() !== ''
  },
  {
    ruleId: 'R-COMP-SPECIMEN-01',
    category: 'specimen',
    label: 'specimen type',
    present: (r) => r.specimenType !== ''
  },
  {
    ruleId: 'R-COMP-CULTURE-01',
    category: 'culture',
    label: 'microscopy / culture result',
    present: (r) => r.cultureResult !== '' || r.gramStainResult.trim() !== ''
  },
  {
    ruleId: 'R-COMP-SENSITIVITIES-01',
    category: 'sensitivities',
    label: 'antibiotic sensitivities',
    present: (r) => r.antibioticSensitivities.trim() !== ''
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
 * @param {MicrobiologyCultureResult} r
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
 * critical organism / result auto-escalates to critical-alert regardless of the
 * other axes (the safety invariant — RCPath critical-result communication). The
 * least-urgent band is chosen only when no rule fires.
 *
 * @param {MicrobiologyCultureResult} r
 * @param {ResultClassification} classification
 * @param {AbnormalitySeverity} severity
 * @returns {{ followUpUrgency: FollowUpUrgency, targetTimeframe: string,
 *             recommendedAction: string, firedRules: FiredRule[] }}
 */
function gradeFollowUp(r, classification, severity) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  // ─── critical-alert: auto-escalation invariant ───
  if (hasCriticalOrganism(r) || classification === 'critical') {
    firedRules.push({
      ruleId: 'R-FU-CRITICAL-01',
      axis: 'follow-up',
      category: 'critical-result',
      description:
        'Critical organism / result auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
    });
    return {
      followUpUrgency: 'critical-alert',
      targetTimeframe: 'immediate',
      recommendedAction:
        'Telephone the critical result to the requesting / infection team now and document the conversation.',
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
      recommendedAction:
        'Arrange urgent clinical / infection review and expedite antimicrobial advice.',
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
      targetTimeframe: 'within 48 hours',
      recommendedAction:
        'Recommend targeted antimicrobial therapy and clinical review as indicated.',
      firedRules
    };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-02',
      axis: 'follow-up',
      category: 'inconclusive',
      description: 'Inconclusive result; repeat specimen recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 48 hours',
      recommendedAction:
        'Recommend a repeat / fresh specimen to resolve the inconclusive result.',
      firedRules
    };
  }

  if (hasResistanceMarker(r)) {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-03',
      axis: 'follow-up',
      category: 'resistance-marker',
      description:
        'A resistance marker is present; infection-prevention follow-up recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'per local IPC policy',
      recommendedAction:
        'Manage per local infection-prevention-and-control (IPC) policy for the resistance marker.',
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
    recommendedAction: 'No specific microbiology follow-up required; manage per usual care.',
    firedRules
  };
}

Object.assign(window.MicrobiologyCultureTestResult, {
  isPositiveCulture,
  hasCriticalOrganism,
  hasResistanceMarker,
  hasPositiveSpecialisedTest,
  hasAnyAbnormalFinding,
  classifyResult,
  gradeSeverity,
  gradeCompleteness,
  gradeFollowUp
});
})();
