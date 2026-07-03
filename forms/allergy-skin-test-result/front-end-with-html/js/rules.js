// Declarative four-axis grading rules for the Allergy Skin Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine modules
// `src/lib/engine/{classification-rules,severity-rules,completeness-rules,
// follow-up-rules,utils}.ts` (predicates only — display helpers live in
// `types.js`). Rule IDs, categories, and descriptions are stable and identical
// across every front-end and the back-end; rows mirror the
// `allergy_skin_test_result_grade_rule` SQL table.
//
// The grader (`grader.js`) composes the four axis functions into the full
// `GradingResult`; `flags.js` raises the safety-critical flags independently.

/**
 * @typedef {import('./types.js').AllergySkinResult} AllergySkinResult
 * @typedef {import('./types.js').ResultClassification} ResultClassification
 * @typedef {import('./types.js').AbnormalitySeverity} AbnormalitySeverity
 * @typedef {import('./types.js').FollowUpUrgency} FollowUpUrgency
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.AllergySkinTestResult.
(function () {
'use strict';
window.AllergySkinTestResult = window.AllergySkinTestResult || {};

// ----------------------------------------------------------------------
// Structured-findings predicates (mirror `utils.ts`)
// ----------------------------------------------------------------------

/**
 * A critical event (anaphylaxis / systemic reaction during the test)
 * auto-escalates Axis D to critical-alert. Mirrors the back-end invariant.
 * @param {AllergySkinResult} r
 * @returns {boolean}
 */
function hasCriticalFinding(r) {
  return r.anaphylaxisDuringTest;
}

/**
 * Whether clinically relevant sensitisation or a positive reaction is present.
 * @param {AllergySkinResult} r
 * @returns {boolean}
 */
function hasAnyAbnormalFinding(r) {
  return r.sensitisationConfirmed || r.positiveReactions;
}

/**
 * Whether the test was invalid / non-interpretable (antihistamines not
 * withheld, absent positive control, dermographism).
 * @param {AllergySkinResult} r
 * @returns {boolean}
 */
function isInvalidTest(r) {
  return r.testInvalid;
}

// ----------------------------------------------------------------------
// Axis A — result classification (mirrors `classification-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a systemic / anaphylactic reaction occurred during the test.
 * - inconclusive: the test was invalid / non-interpretable.
 * - abnormal: clinically relevant sensitisation or a positive reaction is present.
 * - normal: all allergens negative on a valid, interpretable test.
 *
 * Returns the classification plus the audit-trail rules that fired.
 *
 * @param {AllergySkinResult} r
 * @returns {{ resultClassification: ResultClassification, firedRules: FiredRule[] }}
 */
function classifyResult(r) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  if (hasCriticalFinding(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-CRITICAL-01',
      axis: 'classification',
      category: 'anaphylaxis-during-test',
      description:
        'A systemic / anaphylactic reaction occurred during the test; classified as critical.'
    });
    return { resultClassification: 'critical', firedRules };
  }

  if (isInvalidTest(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-01',
      axis: 'classification',
      category: 'invalid-test',
      description:
        'Test was invalid / non-interpretable (antihistamines not withheld, absent positive control, or dermographism); classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (r.sensitisationConfirmed) {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-01',
      axis: 'classification',
      category: 'clinically-relevant-sensitisation',
      description:
        'Clinically relevant sensitisation was confirmed; classified as abnormal.'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  if (r.positiveReactions) {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-02',
      axis: 'classification',
      category: 'positive-reaction',
      description:
        'One or more positive reactions are present (sensitisation, not necessarily clinical allergy); classified as abnormal.'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  firedRules.push({
    ruleId: 'R-CLASS-NORMAL-01',
    axis: 'classification',
    category: 'all-negative',
    description:
      'No positive reactions on a valid, interpretable test; classified as normal.'
  });
  return { resultClassification: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis B — abnormality severity (mirrors `severity-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in EAACI /
 * BSACI skin-test and specific-IgE interpretation guidance:
 * - major: a critical event (anaphylaxis during the test).
 * - moderate: clinically relevant sensitisation confirmed.
 * - minor: a positive reaction (sensitisation) without confirmed clinical relevance.
 * - none: an all-negative or inconclusive study.
 *
 * @param {AllergySkinResult} r
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
      category: 'anaphylaxis-during-test',
      description: 'Anaphylaxis during the test; abnormality severity graded major.'
    });
    return { abnormalitySeverity: 'major', reportingCategory: 'critical-actionable', firedRules };
  }

  if (r.sensitisationConfirmed) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-01',
      axis: 'severity',
      category: 'clinically-relevant-sensitisation',
      description:
        'Clinically relevant sensitisation confirmed; abnormality severity graded moderate.'
    });
    return {
      abnormalitySeverity: 'moderate',
      reportingCategory: 'clinically-relevant-sensitisation',
      firedRules
    };
  }

  if (r.positiveReactions) {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-01',
      axis: 'severity',
      category: 'sensitisation',
      description:
        'Positive reaction(s) present without confirmed clinical relevance (sensitisation only); abnormality severity graded minor.'
    });
    return { abnormalitySeverity: 'minor', reportingCategory: 'sensitisation', firedRules };
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
    category: 'all-negative',
    description: 'No positive reaction; abnormality severity graded none.'
  });
  return { abnormalitySeverity: 'none', reportingCategory: 'all-negative', firedRules };
}

// ----------------------------------------------------------------------
// Axis C — report completeness (mirrors `completeness-rules.ts`)
// ----------------------------------------------------------------------

/**
 * The five mandatory report sections per BSACI / EAACI reporting standards:
 * clinical history, validity controls, allergens / weal sizes, interpretation,
 * and impression.
 *
 * @type {Array<{ ruleId: string, category: string, label: string,
 *                present: (r: AllergySkinResult) => boolean }>}
 */
const completenessSections = [
  {
    ruleId: 'R-COMP-HISTORY-01',
    category: 'history',
    label: 'clinical history',
    present: (r) => r.clinicalHistory.trim() !== ''
  },
  {
    ruleId: 'R-COMP-VALIDITY-01',
    category: 'validity-controls',
    label: 'validity controls (antihistamine washout / positive control)',
    present: (r) => r.antihistaminesWithheld || r.positiveControlValid
  },
  {
    ruleId: 'R-COMP-ALLERGENS-01',
    category: 'allergens',
    label: 'allergens tested / weal sizes',
    present: (r) =>
      r.allergensTested.trim() !== '' ||
      r.whealSizes.trim() !== '' ||
      r.specificIgeResults.trim() !== ''
  },
  {
    ruleId: 'R-COMP-INTERPRETATION-01',
    category: 'interpretation',
    label: 'interpretation',
    present: (r) => r.interpretation.trim() !== ''
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
 * @param {AllergySkinResult} r
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
 * critical event (anaphylaxis during the test) auto-escalates to critical-alert
 * regardless of the other axes (the safety invariant). The least-urgent band is
 * chosen only when no rule fires.
 *
 * @param {AllergySkinResult} r
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
        'Anaphylaxis during the test auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
    });
    return {
      followUpUrgency: 'critical-alert',
      targetTimeframe: 'immediate',
      recommendedAction:
        'Communicate the critical result directly to the referrer now, document the reaction and resuscitation, and arrange urgent allergy / immunology review.',
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
      description: 'Clinically relevant sensitisation present; follow-up recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 2 weeks',
      recommendedAction:
        'Recommend allergen avoidance advice, immunotherapy referral, or oral food / drug challenge as clinically indicated.',
      firedRules
    };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-02',
      axis: 'follow-up',
      category: 'inconclusive',
      description: 'Invalid / inconclusive test; repeat or alternative testing recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 2 weeks',
      recommendedAction:
        'Recommend repeat testing after an adequate antihistamine washout, or alternative specific-IgE testing.',
      firedRules
    };
  }

  if (severity === 'minor') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-03',
      axis: 'follow-up',
      category: 'sensitisation',
      description:
        'Positive reaction (sensitisation only); correlate with clinical history and consider further evaluation.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'per allergy pathway',
      recommendedAction:
        'Interpret the sensitisation against the clinical history; consider an oral challenge to confirm or exclude clinical allergy.',
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
    recommendedAction: 'No specific allergy follow-up required; manage per usual care.',
    firedRules
  };
}

Object.assign(window.AllergySkinTestResult, {
  hasCriticalFinding,
  hasAnyAbnormalFinding,
  isInvalidTest,
  classifyResult,
  gradeSeverity,
  gradeCompleteness,
  gradeFollowUp
});
})();
