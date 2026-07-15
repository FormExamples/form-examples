// Declarative four-axis grading rules for the DEXA Bone Density Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine modules
// `src/lib/engine/{classification-rules,severity-rules,completeness-rules,
// follow-up-rules,utils}.ts` (predicates only — display helpers live in
// `types.js`). Rule IDs, categories, and descriptions are stable and identical
// across every front-end and the back-end; rows mirror the
// `dexa_bone_density_test_result_grade_rule` SQL table.
//
// The grader (`grader.js`) composes the four axis functions into the full
// `GradingResult`; `flags.js` raises the safety-critical flags independently.

/**
 * @typedef {import('./types.js').DexaBoneDensityResult} DexaBoneDensityResult
 * @typedef {import('./types.js').WhoClassification} WhoClassification
 * @typedef {import('./types.js').ResultClassification} ResultClassification
 * @typedef {import('./types.js').AbnormalitySeverity} AbnormalitySeverity
 * @typedef {import('./types.js').FollowUpUrgency} FollowUpUrgency
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.DexaBoneDensityTestResult.

// ----------------------------------------------------------------------
// WHO densitometric classification + predicates (mirror `utils.ts`)
// ----------------------------------------------------------------------

/**
 * Derive the WHO densitometric classification from the lowest (most negative)
 * T-score and whether a fragility / vertebral fracture is identified:
 * - T >= -1.0 -> normal
 * - -1.0 > T > -2.5 -> osteopenia
 * - T <= -2.5 -> osteoporosis
 * - T <= -2.5 with a fragility / vertebral fracture -> severe-osteoporosis
 *
 * Returns '' when the lowest T-score has not been recorded.
 *
 * @param {number | null} lowestTScore
 * @param {boolean} vertebralFractureIdentified
 * @returns {WhoClassification}
 */
function deriveWhoClassification(lowestTScore, vertebralFractureIdentified) {
  if (lowestTScore === null) return '';
  if (lowestTScore <= -2.5) {
    return vertebralFractureIdentified ? 'severe-osteoporosis' : 'osteoporosis';
  }
  if (lowestTScore < -1.0) return 'osteopenia';
  return 'normal';
}

/**
 * The effective WHO classification used by the engine: the explicitly recorded
 * classification when present, otherwise the value derived from the lowest
 * T-score. Severe osteoporosis is upgraded when a fracture is identified.
 *
 * @param {DexaBoneDensityResult} r
 * @returns {WhoClassification}
 */
function effectiveWhoClassification(r) {
  const derived = deriveWhoClassification(r.lowestTScore, r.vertebralFractureIdentified);
  if (derived !== '') {
    // A fragility / vertebral fracture with T <= -2.5 establishes severe
    // disease even if the recorded classification was the plain
    // "osteoporosis" band.
    if (derived === 'severe-osteoporosis') return 'severe-osteoporosis';
    if (r.whoClassification === 'severe-osteoporosis' && r.vertebralFractureIdentified) {
      return 'severe-osteoporosis';
    }
    return r.whoClassification !== '' ? r.whoClassification : derived;
  }
  return r.whoClassification;
}

/**
 * A critical finding for a DEXA report: established (severe) osteoporosis —
 * T <= -2.5 together with an identified fragility / vertebral fracture. This
 * auto-escalates Axis D to critical-alert. Mirrors the back-end invariant.
 * @param {DexaBoneDensityResult} r
 * @returns {boolean}
 */
function hasCriticalFinding(r) {
  return effectiveWhoClassification(r) === 'severe-osteoporosis';
}

/**
 * Whether the result describes osteoporosis (T <= -2.5), severe or not.
 * @param {DexaBoneDensityResult} r
 * @returns {boolean}
 */
function hasOsteoporosis(r) {
  const w = effectiveWhoClassification(r);
  return w === 'osteoporosis' || w === 'severe-osteoporosis';
}

/**
 * Whether the result describes osteopenia (low bone mass).
 * @param {DexaBoneDensityResult} r
 * @returns {boolean}
 */
function hasOsteopenia(r) {
  return effectiveWhoClassification(r) === 'osteopenia';
}

/**
 * Whether any abnormal (non-normal) densitometric finding is present.
 * @param {DexaBoneDensityResult} r
 * @returns {boolean}
 */
function hasAnyAbnormalFinding(r) {
  const w = effectiveWhoClassification(r);
  return w === 'osteopenia' || w === 'osteoporosis' || w === 'severe-osteoporosis';
}

// ----------------------------------------------------------------------
// Axis A — result classification (mirrors `classification-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis A — result classification.
 *
 * Maps the WHO densitometric classification (driven by the lowest T-score)
 * onto the overall reporting conclusion:
 * - critical: severe (established) osteoporosis — T <= -2.5 with a fragility /
 *   vertebral fracture.
 * - inconclusive: the examination was non-diagnostic, or limited with no
 *   confident impression, or no lowest T-score was recorded.
 * - abnormal: osteopenia or osteoporosis.
 * - normal: T >= -1.0 on an adequate examination.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 *
 * @param {DexaBoneDensityResult} r
 * @returns {{ resultClassification: ResultClassification, firedRules: FiredRule[] }}
 */
function classifyResult(r) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  if (hasCriticalFinding(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-CRITICAL-01',
      axis: 'classification',
      category: 'severe-osteoporosis',
      description:
        'Severe (established) osteoporosis — T ≤ −2.5 with an identified fragility / vertebral fracture; classified as critical.'
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

  if (effectiveWhoClassification(r) === '') {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-03',
      axis: 'classification',
      category: 'no-quantitative-finding',
      description:
        'No lowest T-score / WHO classification was recorded; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (hasAnyAbnormalFinding(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-01',
      axis: 'classification',
      category: 'reduced-bone-density',
      description:
        'Reduced bone density (osteopenia or osteoporosis) on the WHO densitometric classification; classified as abnormal.'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  firedRules.push({
    ruleId: 'R-CLASS-NORMAL-01',
    axis: 'classification',
    category: 'normal-bone-density',
    description:
      'Normal bone density (T ≥ −1.0) on an interpretable examination; classified as normal.'
  });
  return { resultClassification: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis B — abnormality severity (mirrors `severity-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * The severity ladder (none -> minor -> moderate -> major) is grounded in the
 * WHO densitometric classification, and the `reportingCategory` **carries the
 * WHO class** (normal / osteopenia / osteoporosis / severe-osteoporosis) for
 * downstream structured-reporting workflows:
 * - major: severe (established) or plain osteoporosis (T <= -2.5).
 * - moderate: osteopenia (low bone mass).
 * - none: normal bone density.
 *
 * The recorded / derived WHO classification is the structured-reporting label.
 *
 * @param {DexaBoneDensityResult} r
 * @param {ResultClassification} classification
 * @returns {{ abnormalitySeverity: AbnormalitySeverity, reportingCategory: string, firedRules: FiredRule[] }}
 */
function gradeSeverity(r, classification) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  const who = effectiveWhoClassification(r);

  if (hasCriticalFinding(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-01',
      axis: 'severity',
      category: 'severe-osteoporosis',
      description:
        'Severe (established) osteoporosis; abnormality severity graded major.'
    });
    return {
      abnormalitySeverity: 'major',
      reportingCategory: 'severe-osteoporosis',
      firedRules
    };
  }

  if (who === 'osteoporosis') {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-02',
      axis: 'severity',
      category: 'osteoporosis',
      description: 'Osteoporosis (T ≤ −2.5); abnormality severity graded major.'
    });
    return { abnormalitySeverity: 'major', reportingCategory: 'osteoporosis', firedRules };
  }

  if (who === 'osteopenia') {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-01',
      axis: 'severity',
      category: 'osteopenia',
      description: 'Osteopenia (low bone mass); abnormality severity graded moderate.'
    });
    return { abnormalitySeverity: 'moderate', reportingCategory: 'osteopenia', firedRules };
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
    category: 'normal-bone-density',
    description: 'Normal bone density; abnormality severity graded none.'
  });
  return { abnormalitySeverity: 'none', reportingCategory: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis C — report completeness (mirrors `completeness-rules.ts`)
// ----------------------------------------------------------------------

/**
 * A mandatory report section, used to compute Axis C completeness.
 * @typedef {Object} SectionCheck
 * @property {string} ruleId
 * @property {string} category
 * @property {string} label
 * @property {(r: DexaBoneDensityResult) => boolean} present
 */

/**
 * The five mandatory report sections for a DEXA report: clinical history,
 * technique / adequacy, quantitative findings, comparison, and impression.
 * @type {SectionCheck[]}
 */
const sections = [
  {
    ruleId: 'R-COMP-HISTORY-01',
    category: 'history',
    label: 'clinical history',
    present: (r) => r.clinicalHistory.trim() !== ''
  },
  {
    ruleId: 'R-COMP-TECHNIQUE-01',
    category: 'technique',
    label: 'examination adequacy / technique',
    present: (r) => r.examinationAdequacy !== '' && r.scanRegion !== ''
  },
  {
    ruleId: 'R-COMP-FINDINGS-01',
    category: 'findings',
    label: 'quantitative findings (lowest T-score / WHO classification)',
    present: (r) => r.lowestTScore !== null || r.whoClassification !== ''
  },
  {
    ruleId: 'R-COMP-COMPARISON-01',
    category: 'comparison',
    label: 'comparison with previous imaging',
    present: (r) => r.comparisonWithPrevious.trim() !== ''
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
 * @param {DexaBoneDensityResult} r
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
 * Escalation ladder (routine -> recommended -> urgent -> critical-alert),
 * driven by the WHO densitometric classification:
 * - normal (T >= -1.0) -> routine.
 * - osteopenia (-1.0 > T > -2.5) -> recommended.
 * - osteoporosis (T <= -2.5) -> urgent.
 * - severe osteoporosis (T <= -2.5 + fragility / vertebral fracture) ->
 *   critical-alert (auto-escalation invariant, regardless of the other axes).
 *
 * The least-urgent band is chosen only when no rule fires.
 *
 * @param {DexaBoneDensityResult} r
 * @param {ResultClassification} classification
 * @param {AbnormalitySeverity} severity
 * @returns {{ followUpUrgency: FollowUpUrgency, targetTimeframe: string, recommendedAction: string, firedRules: FiredRule[] }}
 */
function gradeFollowUp(r, classification, severity) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  const who = effectiveWhoClassification(r);

  // --- critical-alert: auto-escalation invariant ---
  if (hasCriticalFinding(r) || classification === 'critical') {
    firedRules.push({
      ruleId: 'R-FU-CRITICAL-01',
      axis: 'follow-up',
      category: 'severe-osteoporosis',
      description:
        'Severe (established) osteoporosis auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
    });
    return {
      followUpUrgency: 'critical-alert',
      targetTimeframe: 'urgent — within days',
      recommendedAction:
        'Communicate the result to the referrer and refer urgently for a fracture-risk treatment review.',
      firedRules
    };
  }

  // --- urgent ---
  if (who === 'osteoporosis') {
    firedRules.push({
      ruleId: 'R-FU-URGENT-01',
      axis: 'follow-up',
      category: 'osteoporosis',
      description: 'Osteoporosis (T ≤ −2.5); follow-up urgency graded urgent.'
    });
    return {
      followUpUrgency: 'urgent',
      targetTimeframe: 'within 4 weeks',
      recommendedAction:
        'Refer for specialist osteoporosis / fracture-risk treatment review and consider pharmacological therapy.',
      firedRules
    };
  }

  // --- recommended ---
  if (who === 'osteopenia') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-01',
      axis: 'follow-up',
      category: 'osteopenia',
      description: 'Osteopenia (low bone mass); follow-up recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 3 months',
      recommendedAction:
        'Assess fracture risk (FRAX), advise lifestyle / bone-health measures, and arrange interval monitoring.',
      firedRules
    };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-02',
      axis: 'follow-up',
      category: 'inconclusive',
      description: 'Inconclusive study; repeat or alternative assessment recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 3 months',
      recommendedAction:
        'Recommend a repeat or alternative-site DEXA to resolve the inconclusive study.',
      firedRules
    };
  }

  // --- routine: least-urgent band, no rule fired ---
  firedRules.push({
    ruleId: 'R-FU-ROUTINE-01',
    axis: 'follow-up',
    category: 'normal',
    description: 'Normal bone density; routine follow-up only.'
  });
  return {
    followUpUrgency: 'routine',
    targetTimeframe: 'no specific follow-up',
    recommendedAction:
      'No specific DEXA follow-up required; manage fracture risk per usual care.',
    firedRules
  };
}

export { deriveWhoClassification, effectiveWhoClassification, hasCriticalFinding, hasOsteoporosis, hasOsteopenia, hasAnyAbnormalFinding, classifyResult, gradeSeverity, gradeCompleteness, gradeFollowUp };
