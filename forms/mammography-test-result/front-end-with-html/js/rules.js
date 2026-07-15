import { biRadsShortLabel } from './types.js';

// Declarative four-axis grading rules for the Mammography Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine modules
// `src/lib/engine/{classification-rules,severity-rules,completeness-rules,
// follow-up-rules,utils}.ts` (predicates only — display helpers live in
// `types.js`). Rule IDs, categories, and descriptions are stable and identical
// across every front-end and the back-end; rows mirror the
// `mammography_test_result_grade_rule` SQL table.
//
// The grader (`grader.js`) composes the four axis functions into the full
// `GradingResult`; `flags.js` raises the safety-critical flags independently.

/**
 * @typedef {import('./types.js').MammographyResult} MammographyResult
 * @typedef {import('./types.js').ResultClassification} ResultClassification
 * @typedef {import('./types.js').AbnormalitySeverity} AbnormalitySeverity
 * @typedef {import('./types.js').FollowUpUrgency} FollowUpUrgency
 * @typedef {import('./types.js').BiRadsCategory} BiRadsCategory
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.MammographyTestResult.

// ----------------------------------------------------------------------
// Structured-findings predicates (mirror `utils.ts`)
// ----------------------------------------------------------------------

/**
 * Whether any structured abnormal finding is present.
 * @param {MammographyResult} r
 * @returns {boolean}
 */
function hasAnyAbnormalFinding(r) {
  return (
    r.mass ||
    r.calcifications ||
    r.architecturalDistortion ||
    r.asymmetry ||
    r.skinOrNippleChange ||
    r.lymphadenopathy
  );
}

/**
 * Whether the report describes only incidental findings (no abnormal ones).
 * @param {MammographyResult} r
 * @returns {boolean}
 */
function hasOnlyIncidentalFinding(r) {
  return r.incidentalFinding && !hasAnyAbnormalFinding(r);
}

// ----------------------------------------------------------------------
// BI-RADS band helpers (the key structured score; mirror `utils.ts`)
// ----------------------------------------------------------------------

/**
 * A BI-RADS 4 or 5 (or 4a/4b/4c) final assessment is a critical / urgent band
 * that auto-escalates Axis D and raises the abnormal-requiring-action /
 * urgent-referral flags regardless of the other axes. Mirrors the back-end
 * invariant.
 * @param {BiRadsCategory | string} category
 * @returns {boolean}
 */
function isBiRadsUrgent(category) {
  return (
    category === '4a' ||
    category === '4b' ||
    category === '4c' ||
    category === '5'
  );
}

/**
 * A BI-RADS 4c or 5 final assessment maps to the critical classification band
 * (≥ 50 % likelihood of malignancy).
 * @param {BiRadsCategory | string} category
 * @returns {boolean}
 */
function isBiRadsCritical(category) {
  return category === '4c' || category === '5';
}

// ----------------------------------------------------------------------
// Axis A — result classification (mirrors `classification-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis A — result classification.
 *
 * Driven primarily by the ACR BI-RADS final assessment category:
 * - inconclusive: BI-RADS 0 (incomplete — needs additional imaging), or a
 *   non-diagnostic / limited-without-impression examination.
 * - normal: BI-RADS 1 (negative) or 2 (benign).
 * - critical: BI-RADS 4c or 5 (≥ 50 % likelihood of malignancy).
 * - abnormal: BI-RADS 3, 4a, 4b, or 6 (known malignancy), or — when no
 *   BI-RADS category has been assigned — any abnormal structured finding.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 *
 * @param {MammographyResult} r
 * @returns {{ resultClassification: ResultClassification, firedRules: FiredRule[] }}
 */
function classifyResult(r) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  const cat = r.biRadsCategory;

  // ─── BI-RADS 0 — incomplete / inconclusive ───
  if (cat === '0') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-01',
      axis: 'classification',
      category: 'birads-0',
      description:
        'BI-RADS 0 (incomplete — additional imaging required); classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  // ─── BI-RADS 4c / 5 — critical band ───
  if (cat === '4c' || cat === '5') {
    firedRules.push({
      ruleId: 'R-CLASS-CRITICAL-01',
      axis: 'classification',
      category: 'birads-high',
      description: `BI-RADS ${cat} (≥ 50 % likelihood of malignancy); classified as critical.`
    });
    return { resultClassification: 'critical', firedRules };
  }

  // ─── BI-RADS 3 / 4a / 4b — abnormal band ───
  if (cat === '3' || cat === '4a' || cat === '4b') {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-01',
      axis: 'classification',
      category: 'birads-suspicious',
      description: `BI-RADS ${cat} (probably benign or suspicious); classified as abnormal.`
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  // ─── BI-RADS 6 — known biopsy-proven malignancy ───
  if (cat === '6') {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-02',
      axis: 'classification',
      category: 'birads-known-malignancy',
      description: 'BI-RADS 6 (known biopsy-proven malignancy); classified as abnormal.'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  // ─── BI-RADS 1 / 2 — normal band ───
  if (cat === '1' || cat === '2') {
    firedRules.push({
      ruleId: 'R-CLASS-NORMAL-01',
      axis: 'classification',
      category: 'birads-negative',
      description: `BI-RADS ${cat} (negative or benign); classified as normal.`
    });
    return { resultClassification: 'normal', firedRules };
  }

  // ─── No BI-RADS assigned: fall back to adequacy and structured findings ───
  if (r.examinationAdequacy === 'non-diagnostic') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-02',
      axis: 'classification',
      category: 'non-diagnostic',
      description: 'Examination was non-diagnostic; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (r.examinationAdequacy === 'limited' && r.impression.trim() === '') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-03',
      axis: 'classification',
      category: 'limited-no-impression',
      description:
        'Examination was limited and no impression was recorded; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (hasAnyAbnormalFinding(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-03',
      axis: 'classification',
      category: 'abnormal-finding',
      description: 'One or more abnormal structured findings are present; classified as abnormal.'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  if (hasOnlyIncidentalFinding(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-04',
      axis: 'classification',
      category: 'incidental-finding',
      description: 'Only incidental finding(s) present; classified as abnormal (not a normal study).'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  firedRules.push({
    ruleId: 'R-CLASS-NORMAL-02',
    axis: 'classification',
    category: 'no-abnormal-finding',
    description:
      'No BI-RADS category assigned and no abnormal structured findings on an interpretable examination; classified as normal.'
  });
  return { resultClassification: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis B — abnormality severity (mirrors `severity-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), driven by the ACR
 * BI-RADS final assessment category, which is also carried verbatim in the
 * `reportingCategory` label (e.g. "BI-RADS 4b"):
 * - major: BI-RADS 4c / 5 / 6 (high suspicion or known malignancy).
 * - moderate: BI-RADS 4a / 4b (suspicious), or an actionable abnormal finding
 *   when no BI-RADS category has been assigned.
 * - minor: BI-RADS 3 (probably benign), or incidental-only findings.
 * - none: BI-RADS 1 / 2 (negative / benign) or a normal study.
 *
 * @param {MammographyResult} r
 * @param {ResultClassification} classification
 * @returns {{ abnormalitySeverity: AbnormalitySeverity, reportingCategory: string,
 *             firedRules: FiredRule[] }}
 */
function gradeSeverity(r, classification) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  const cat = r.biRadsCategory;
  // The reporting category always carries the BI-RADS final assessment.
  const reportingCategory = cat === '' ? 'unassigned' : biRadsShortLabel(cat);

  if (cat === '4c' || cat === '5' || cat === '6') {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-01',
      axis: 'severity',
      category: 'birads-high',
      description: `BI-RADS ${cat}; abnormality severity graded major.`
    });
    return { abnormalitySeverity: 'major', reportingCategory, firedRules };
  }

  if (cat === '4a' || cat === '4b') {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-01',
      axis: 'severity',
      category: 'birads-suspicious',
      description: `BI-RADS ${cat} (suspicious); abnormality severity graded moderate.`
    });
    return { abnormalitySeverity: 'moderate', reportingCategory, firedRules };
  }

  if (cat === '3') {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-01',
      axis: 'severity',
      category: 'birads-probably-benign',
      description: 'BI-RADS 3 (probably benign); abnormality severity graded minor.'
    });
    return { abnormalitySeverity: 'minor', reportingCategory, firedRules };
  }

  if (cat === '1' || cat === '2') {
    firedRules.push({
      ruleId: 'R-SEV-NONE-01',
      axis: 'severity',
      category: 'birads-negative',
      description: `BI-RADS ${cat} (negative / benign); abnormality severity graded none.`
    });
    return { abnormalitySeverity: 'none', reportingCategory, firedRules };
  }

  // ─── No BI-RADS assigned: fall back to structured findings ───
  const actionable =
    r.mass ||
    r.architecturalDistortion ||
    r.asymmetry ||
    r.skinOrNippleChange ||
    r.lymphadenopathy ||
    r.calcifications;

  if (actionable) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-02',
      axis: 'severity',
      category: 'actionable-finding',
      description:
        'An actionable abnormal finding (mass, calcifications, distortion, asymmetry, skin/nipple change, or lymphadenopathy) is present; severity graded moderate.'
    });
    return { abnormalitySeverity: 'moderate', reportingCategory: 'actionable-finding', firedRules };
  }

  if (hasOnlyIncidentalFinding(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-02',
      axis: 'severity',
      category: 'incidental-finding',
      description: 'Incidental finding(s) only; abnormality severity graded minor.'
    });
    return { abnormalitySeverity: 'minor', reportingCategory: 'incidental', firedRules };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-SEV-NONE-03',
      axis: 'severity',
      category: 'inconclusive',
      description: 'Inconclusive study; abnormality severity not established.'
    });
    return { abnormalitySeverity: 'none', reportingCategory: 'indeterminate', firedRules };
  }

  firedRules.push({
    ruleId: 'R-SEV-NONE-02',
    axis: 'severity',
    category: 'no-abnormal-finding',
    description:
      'No BI-RADS category assigned and no abnormal finding; abnormality severity graded none.'
  });
  return { abnormalitySeverity: 'none', reportingCategory: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis C — report completeness (mirrors `completeness-rules.ts`)
// ----------------------------------------------------------------------

/**
 * The five mandatory report sections per RCR / NHSBSP reporting standards:
 * clinical history, technique / adequacy, comparison, findings, and impression.
 *
 * @type {Array<{ ruleId: string, category: string, label: string,
 *                present: (r: MammographyResult) => boolean }>}
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
    label: 'technique / examination adequacy',
    present: (r) => r.examinationAdequacy !== ''
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
 * Axis C — report completeness.
 *
 * Returns the percentage (0-100, rounded) of mandatory report sections that
 * are present, plus an audit-trail rule for each missing section.
 *
 * @param {MammographyResult} r
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
 * Escalation ladder (routine → recommended → urgent → critical-alert), driven
 * by the ACR BI-RADS management pathway:
 * - critical-alert: BI-RADS 4c / 5 (critical classification) auto-escalate
 *   regardless of the other axes — the safety invariant.
 * - urgent: BI-RADS 4a / 4b — tissue diagnosis / biopsy referral.
 * - recommended: BI-RADS 0 (further imaging), 3 (short-interval follow-up),
 *   6 (per agreed management), or a moderate/inconclusive study.
 * - routine: BI-RADS 1 / 2 (least-urgent band, only when no rule fires).
 *
 * @param {MammographyResult} r
 * @param {ResultClassification} classification
 * @param {AbnormalitySeverity} severity
 * @returns {{ followUpUrgency: FollowUpUrgency, targetTimeframe: string,
 *             recommendedAction: string, firedRules: FiredRule[] }}
 */
function gradeFollowUp(r, classification, severity) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  const cat = r.biRadsCategory;

  // ─── critical-alert: BI-RADS 4c / 5 auto-escalation invariant ───
  if (isBiRadsCritical(cat) || classification === 'critical') {
    firedRules.push({
      ruleId: 'R-FU-CRITICAL-01',
      axis: 'follow-up',
      category: 'birads-critical',
      description:
        'BI-RADS 4c or 5 (highly suspicious) auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
    });
    return {
      followUpUrgency: 'critical-alert',
      targetTimeframe: 'two-week-wait biopsy',
      recommendedAction:
        'Refer for image-guided biopsy and communicate to the breast MDT now; document the conversation.',
      firedRules
    };
  }

  // ─── urgent: BI-RADS 4a / 4b ───
  if (isBiRadsUrgent(cat)) {
    firedRules.push({
      ruleId: 'R-FU-URGENT-01',
      axis: 'follow-up',
      category: 'birads-suspicious',
      description: `BI-RADS ${cat} (suspicious); urgent tissue diagnosis / biopsy referral.`
    });
    return {
      followUpUrgency: 'urgent',
      targetTimeframe: 'two-week-wait biopsy',
      recommendedAction: 'Refer for tissue diagnosis / image-guided biopsy on a two-week-wait pathway.',
      firedRules
    };
  }

  // ─── recommended: BI-RADS 0 — further imaging ───
  if (cat === '0') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-01',
      axis: 'follow-up',
      category: 'birads-0',
      description: 'BI-RADS 0 (incomplete); additional imaging / prior comparison recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'additional imaging',
      recommendedAction:
        'Arrange additional imaging (further views / ultrasound) or obtain priors for comparison.',
      firedRules
    };
  }

  // ─── recommended: BI-RADS 3 — short-interval follow-up ───
  if (cat === '3') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-02',
      axis: 'follow-up',
      category: 'birads-3',
      description: 'BI-RADS 3 (probably benign); short-interval follow-up recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: '6-month short-interval',
      recommendedAction: 'Arrange short-interval (typically 6-month) follow-up imaging.',
      firedRules
    };
  }

  // ─── recommended: BI-RADS 6 — per agreed management ───
  if (cat === '6') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-03',
      axis: 'follow-up',
      category: 'birads-6',
      description: 'BI-RADS 6 (known malignancy); follow-up per agreed oncology / surgical management.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'per agreed management',
      recommendedAction: 'Continue per the agreed oncology / surgical management plan.',
      firedRules
    };
  }

  // ─── recommended: moderate abnormality (no BI-RADS assigned) ───
  if (severity === 'moderate' || severity === 'major') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-04',
      axis: 'follow-up',
      category: 'abnormal-finding',
      description: 'Abnormal finding without an assigned BI-RADS category; follow-up recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 2 weeks',
      recommendedAction: 'Assign a BI-RADS category and recommend follow-up imaging or referral.',
      firedRules
    };
  }

  // ─── recommended: inconclusive study ───
  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-05',
      axis: 'follow-up',
      category: 'inconclusive',
      description: 'Inconclusive study; repeat or additional imaging recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'additional imaging',
      recommendedAction: 'Recommend repeat or additional imaging to resolve the inconclusive study.',
      firedRules
    };
  }

  // ─── recommended: incidental finding ───
  if (hasOnlyIncidentalFinding(r)) {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-06',
      axis: 'follow-up',
      category: 'incidental-finding',
      description: 'Incidental finding; structured follow-up per incidental-findings guidance recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'per incidental-findings guidance',
      recommendedAction:
        'Manage the incidental finding per the relevant structured incidental-findings pathway.',
      firedRules
    };
  }

  // ─── routine: BI-RADS 1 / 2 or no escalation rule fired ───
  firedRules.push({
    ruleId: 'R-FU-ROUTINE-01',
    axis: 'follow-up',
    category: 'normal',
    description: 'No escalation rule fired; routine screening interval only.'
  });
  return {
    followUpUrgency: 'routine',
    targetTimeframe: 'routine screening interval',
    recommendedAction: 'Return to the routine screening interval; no specific follow-up required.',
    firedRules
  };
}

export { hasAnyAbnormalFinding, hasOnlyIncidentalFinding, isBiRadsUrgent, isBiRadsCritical, classifyResult, gradeSeverity, gradeCompleteness, gradeFollowUp };
