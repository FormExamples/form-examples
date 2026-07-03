// Declarative angiography four-axis grading rules.
//
// Faithful vanilla-JS port of the SvelteKit engine modules
// `src/lib/engine/{utils,classification-rules,severity-rules,
// completeness-rules,follow-up-rules}.ts`. Rule IDs are stable and identical
// across every front-end and the back-end; rows here mirror the
// `angiography_test_result_grade_rule` SQL table
// (rule_id, axis, category, description).
//
// Axes:
//   A — result classification (normal / abnormal / critical / inconclusive)
//   B — abnormality severity + structured reporting category
//   C — report completeness percent (0-100)
//   D — follow-up urgency + target timeframe + recommended action

/**
 * @typedef {import('./types.js').AngiographyResult} AngiographyResult
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.AngiographyTestResult.
(function () {
'use strict';
window.AngiographyTestResult = window.AngiographyTestResult || {};

// ----------------------------------------------------------------------
// Structured-findings predicates (mirror utils.ts)
// ----------------------------------------------------------------------

/** A critical stenosis threshold (near-occlusion); NASCET-style diameter reduction. */
const CRITICAL_STENOSIS_PERCENT = 99;

/**
 * Whether the maximum stenosis is in the critical (near-occlusion) range.
 * @param {AngiographyResult} r
 */
function hasCriticalStenosis(r) {
  return r.maxStenosisPercent !== null &&
    r.maxStenosisPercent >= CRITICAL_STENOSIS_PERCENT;
}

/**
 * A critical finding (active extravasation, dissection, occlusion, or a
 * critical near-occlusive stenosis) auto-escalates Axis D to critical-alert.
 * Mirrors the back-end invariant.
 * @param {AngiographyResult} r
 */
function hasCriticalFinding(r) {
  return r.activeExtravasation || r.dissection || r.occlusion ||
    hasCriticalStenosis(r);
}

/**
 * Whether any structured abnormal finding is present.
 * @param {AngiographyResult} r
 */
function hasAnyAbnormalFinding(r) {
  return (
    r.significantStenosis ||
    r.occlusion ||
    r.aneurysm ||
    r.dissection ||
    r.activeExtravasation ||
    r.thrombus
  );
}

/**
 * Whether the report describes only incidental findings (no abnormal ones).
 * @param {AngiographyResult} r
 */
function hasOnlyIncidentalFinding(r) {
  return r.incidentalFinding && !hasAnyAbnormalFinding(r);
}

/**
 * NASCET / ECST stenosis-severity category from the maximum stenosis percent.
 * Categories: <50% / 50-69% / 70-99% / near-occlusion / occluded.
 * @param {AngiographyResult} r
 * @returns {string}
 */
function stenosisSeverityCategory(r) {
  if (r.occlusion) return 'occluded';
  const pct = r.maxStenosisPercent;
  if (pct === null) return '';
  if (pct >= CRITICAL_STENOSIS_PERCENT) return 'near-occlusion';
  if (pct >= 70) return '70-99%';
  if (pct >= 50) return '50-69%';
  return '<50%';
}

// ----------------------------------------------------------------------
// Axis A — result classification (mirrors classification-rules.ts)
// ----------------------------------------------------------------------

/**
 * Determines the overall reporting conclusion:
 * - critical: a critical structured finding (active extravasation, dissection,
 *   occlusion, or a critical near-occlusive stenosis) is present.
 * - inconclusive: the examination was non-diagnostic, or limited with no
 *   confident impression.
 * - abnormal: any abnormal structured finding is present.
 * - normal: no abnormal finding and an adequate examination.
 *
 * Returns the classification plus the audit-trail rules that fired.
 *
 * @param {AngiographyResult} r
 * @returns {{ resultClassification: string, firedRules: FiredRule[] }}
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
        'A critical structured finding (active extravasation, dissection, occlusion, or critical stenosis) is present; classified as critical.'
    });
    return { resultClassification: 'critical', firedRules };
  }

  if (r.examinationAdequacy === 'non-diagnostic') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-01',
      axis: 'classification',
      category: 'non-diagnostic',
      description: 'Examination was non-diagnostic; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (r.examinationAdequacy === 'limited' && r.impression.trim() === '') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-02',
      axis: 'classification',
      category: 'limited-no-impression',
      description:
        'Examination was limited and no impression was recorded; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (hasAnyAbnormalFinding(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-01',
      axis: 'classification',
      category: 'abnormal-finding',
      description:
        'One or more abnormal structured findings are present; classified as abnormal.'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  if (hasOnlyIncidentalFinding(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-02',
      axis: 'classification',
      category: 'incidental-finding',
      description:
        'Only incidental finding(s) present; classified as abnormal (not a normal study).'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  firedRules.push({
    ruleId: 'R-CLASS-NORMAL-01',
    axis: 'classification',
    category: 'no-abnormal-finding',
    description:
      'No abnormal structured findings on an interpretable examination; classified as normal.'
  });
  return { resultClassification: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis B — abnormality severity (mirrors severity-rules.ts)
// ----------------------------------------------------------------------

/**
 * Severity ladder (none → minor → moderate → major), grounded in RCR
 * actionable-reporting principles and structured arterial-stenosis grading
 * (NASCET / ECST stenosis-severity categories):
 * - major: a critical finding, or a high-grade stenosis (>= 70 %).
 * - moderate: an actionable abnormal finding (significant stenosis, aneurysm,
 *   thrombus) or a moderate stenosis (50-69 %).
 * - minor: incidental-only findings.
 * - none: a normal study.
 *
 * The `reportingCategory` carries the stenosis-severity category
 * (<50% / 50-69% / 70-99% / near-occlusion / occluded) where applicable.
 *
 * @param {AngiographyResult} r
 * @param {string} classification - Axis A result
 * @returns {{ abnormalitySeverity: string, reportingCategory: string, firedRules: FiredRule[] }}
 */
function gradeSeverity(r, classification) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  const pct = r.maxStenosisPercent;
  const stenosisCategory = stenosisSeverityCategory(r);

  if (hasCriticalFinding(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-01',
      axis: 'severity',
      category: 'critical-finding',
      description: 'Critical finding present; abnormality severity graded major.'
    });
    return {
      abnormalitySeverity: 'major',
      reportingCategory: stenosisCategory || 'critical-actionable',
      firedRules
    };
  }

  if (pct !== null && pct >= 70) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-02',
      axis: 'severity',
      category: 'high-grade-stenosis',
      description:
        'Maximum stenosis is 70 % or greater; abnormality severity graded major.'
    });
    return {
      abnormalitySeverity: 'major',
      reportingCategory: stenosisCategory,
      firedRules
    };
  }

  const actionable = r.significantStenosis || r.aneurysm || r.thrombus;

  if (actionable || (pct !== null && pct >= 50)) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-01',
      axis: 'severity',
      category: 'actionable-finding',
      description:
        'An actionable abnormal finding (significant stenosis, aneurysm, thrombus, or 50–69 % stenosis) is present; severity graded moderate.'
    });
    return {
      abnormalitySeverity: 'moderate',
      reportingCategory: stenosisCategory || 'actionable-finding',
      firedRules
    };
  }

  if (hasOnlyIncidentalFinding(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-01',
      axis: 'severity',
      category: 'incidental-finding',
      description: 'Incidental finding(s) only; abnormality severity graded minor.'
    });
    return {
      abnormalitySeverity: 'minor',
      reportingCategory: 'incidental',
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
    return {
      abnormalitySeverity: 'none',
      reportingCategory: 'indeterminate',
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
    reportingCategory: stenosisCategory || 'normal',
    firedRules
  };
}

// ----------------------------------------------------------------------
// Axis C — report completeness (mirrors completeness-rules.ts)
// ----------------------------------------------------------------------

/**
 * The five mandatory report sections per RCR reporting standards:
 * clinical history, technique (examination), comparison, findings, and
 * impression.
 *
 * @type {{ ruleId: string, category: string, label: string,
 *          present: (r: AngiographyResult) => boolean }[]}
 */
const completenessSections = [
  {
    ruleId: 'R-COMP-HISTORY-01',
    category: 'history',
    label: 'clinical history',
    present: (r) => r.clinicalHistory.trim() !== ''
  },
  {
    ruleId: 'R-COMP-TECHNIQUE-01',
    category: 'technique',
    label: 'technique (angiography type)',
    present: (r) => r.angiographyType !== ''
  },
  {
    ruleId: 'R-COMP-COMPARISON-01',
    category: 'comparison',
    label: 'comparison with previous imaging',
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
 * Returns the percentage (0-100, rounded) of mandatory report sections that
 * are present, plus an audit-trail rule for each missing section.
 *
 * @param {AngiographyResult} r
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
        description: `Mandatory report section missing: ${section.label}.`
      });
    }
  }

  const reportCompletenessPercent =
    Math.round((presentCount / completenessSections.length) * 100);
  return { reportCompletenessPercent, firedRules };
}

// ----------------------------------------------------------------------
// Axis D — follow-up urgency (mirrors follow-up-rules.ts)
// ----------------------------------------------------------------------

/**
 * Escalation ladder (routine → recommended → urgent → critical-alert). A
 * critical finding (active extravasation, dissection, occlusion, or critical
 * stenosis) auto-escalates to critical-alert regardless of the other axes (the
 * safety invariant). The least-urgent band is chosen only when no rule fires.
 *
 * @param {AngiographyResult} r
 * @param {string} classification - Axis A result
 * @param {string} severity       - Axis B result
 * @returns {{ followUpUrgency: string, targetTimeframe: string,
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
        'Communicate the critical result directly to the referrer now and document the conversation.',
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
        'Arrange urgent clinical review and expedite onward referral.',
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
        'Recommend follow-up imaging or specialist referral as clinically indicated.',
      firedRules
    };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-02',
      axis: 'follow-up',
      category: 'inconclusive',
      description: 'Inconclusive study; repeat or alternative imaging recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 2 weeks',
      recommendedAction:
        'Recommend repeat or alternative imaging to resolve the inconclusive study.',
      firedRules
    };
  }

  if (hasOnlyIncidentalFinding(r)) {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-03',
      axis: 'follow-up',
      category: 'incidental-finding',
      description:
        'Incidental finding; structured follow-up per incidental-findings guidance recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'per incidental-findings guidance',
      recommendedAction:
        'Manage the incidental finding per the relevant structured incidental-findings pathway.',
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
      'No specific imaging follow-up required; manage per usual care.',
    firedRules
  };
}

Object.assign(window.AngiographyTestResult, {
  CRITICAL_STENOSIS_PERCENT,
  hasCriticalStenosis,
  hasCriticalFinding,
  hasAnyAbnormalFinding,
  hasOnlyIncidentalFinding,
  stenosisSeverityCategory,
  classifyResult,
  gradeSeverity,
  gradeCompleteness,
  gradeFollowUp
});
})();
