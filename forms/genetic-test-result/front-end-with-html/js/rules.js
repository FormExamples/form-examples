// Declarative four-axis grading rules for the Genetic Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine modules
// `src/lib/engine/{classification-rules,severity-rules,completeness-rules,
// follow-up-rules,utils}.ts` (predicates only — display helpers live in
// `types.js`). Rule IDs, categories, and descriptions are stable and identical
// across every front-end and the back-end; rows mirror the
// `genetic_test_result_grade_rule` SQL table.
//
// The grader (`grader.js`) composes the four axis functions into the full
// `GradingResult`; `flags.js` raises the safety-critical flags independently.

/**
 * @typedef {import('./types.js').GeneticResult} GeneticResult
 * @typedef {import('./types.js').ResultClassification} ResultClassification
 * @typedef {import('./types.js').AbnormalitySeverity} AbnormalitySeverity
 * @typedef {import('./types.js').FollowUpUrgency} FollowUpUrgency
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.GeneticTestResult.

// ----------------------------------------------------------------------
// Structured-findings predicates (mirror `utils.ts`)
// ----------------------------------------------------------------------

/**
 * A critical / actionable finding — a pathogenic or likely-pathogenic variant,
 * or an actionable secondary finding — auto-escalates Axis D toward urgent /
 * critical-alert. Mirrors the back-end invariant.
 * @param {GeneticResult} r
 * @returns {boolean}
 */
function hasActionableFinding(r) {
  return (
    r.pathogenicVariantFound ||
    r.variantClassification === 'pathogenic' ||
    r.variantClassification === 'likely-pathogenic' ||
    r.secondaryFinding
  );
}

/**
 * Whether a pathogenic / likely-pathogenic variant is reported.
 * @param {GeneticResult} r
 * @returns {boolean}
 */
function hasPathogenicVariant(r) {
  return (
    r.pathogenicVariantFound ||
    r.variantClassification === 'pathogenic' ||
    r.variantClassification === 'likely-pathogenic'
  );
}

/**
 * Whether a variant of uncertain significance (VUS) is reported.
 * @param {GeneticResult} r
 * @returns {boolean}
 */
function hasVus(r) {
  return r.vusFound || r.variantClassification === 'variant-uncertain-significance';
}

/**
 * Whether the report records a negative / benign result.
 * @param {GeneticResult} r
 * @returns {boolean}
 */
function isNegativeResult(r) {
  return (
    r.noClinicallySignificantVariant ||
    r.variantClassification === 'no-variant-detected' ||
    r.variantClassification === 'benign' ||
    r.variantClassification === 'likely-benign'
  );
}

// ----------------------------------------------------------------------
// Axis A — result classification (mirrors `classification-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion, driven by the ACMG/AMP (ACGS)
 * variant classification and the structured finding booleans:
 * - critical: a pathogenic / likely-pathogenic actionable variant is present.
 * - abnormal: a positive carrier status, or a secondary / incidental finding.
 * - inconclusive: a variant of uncertain significance (VUS).
 * - normal: a negative / benign result, or no clinically significant variant.
 *
 * Returns the classification plus the audit-trail rules that fired.
 *
 * @param {GeneticResult} r
 * @returns {{ resultClassification: ResultClassification, firedRules: FiredRule[] }}
 */
function classifyResult(r) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  if (hasPathogenicVariant(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-CRITICAL-01',
      axis: 'classification',
      category: 'pathogenic-variant',
      description:
        'A pathogenic or likely-pathogenic actionable variant is present; classified as critical.'
    });
    return { resultClassification: 'critical', firedRules };
  }

  if (r.secondaryFinding) {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-01',
      axis: 'classification',
      category: 'secondary-finding',
      description:
        'A secondary / incidental actionable finding is present; classified as abnormal.'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  if (r.carrierStatusPositive) {
    firedRules.push({
      ruleId: 'R-CLASS-ABNORMAL-02',
      axis: 'classification',
      category: 'carrier-status',
      description:
        'Carrier status is positive for a recessive / X-linked condition; classified as abnormal.'
    });
    return { resultClassification: 'abnormal', firedRules };
  }

  if (hasVus(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-01',
      axis: 'classification',
      category: 'variant-uncertain-significance',
      description:
        'A variant of uncertain significance (VUS) is present; classified as inconclusive.'
    });
    return { resultClassification: 'inconclusive', firedRules };
  }

  if (isNegativeResult(r)) {
    firedRules.push({
      ruleId: 'R-CLASS-NORMAL-01',
      axis: 'classification',
      category: 'no-significant-variant',
      description:
        'A negative / benign result with no clinically significant variant; classified as normal.'
    });
    return { resultClassification: 'normal', firedRules };
  }

  firedRules.push({
    ruleId: 'R-CLASS-NORMAL-02',
    axis: 'classification',
    category: 'no-abnormal-finding',
    description: 'No actionable variant or finding recorded; classified as normal.'
  });
  return { resultClassification: 'normal', firedRules };
}

// ----------------------------------------------------------------------
// Axis B — abnormality severity (mirrors `severity-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in the ACMG/AMP
 * (ACGS) five-tier variant classification:
 * - major: a pathogenic variant (Class 5 — pathogenic).
 * - moderate: a likely-pathogenic variant (Class 4), or a positive carrier
 *   status / secondary finding requiring action.
 * - minor: a variant of uncertain significance (Class 3 — VUS).
 * - none: a benign / likely-benign result, or no variant detected.
 *
 * The `reportingCategory` is a short ACMG class label suitable for downstream
 * structured-reporting workflows; an explicitly entered category is preserved.
 *
 * @param {GeneticResult} r
 * @param {ResultClassification} classification
 * @returns {{ abnormalitySeverity: AbnormalitySeverity, reportingCategory: string,
 *             firedRules: FiredRule[] }}
 */
function gradeSeverity(r, classification) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  const explicit = r.reportingCategory.trim();

  if (r.variantClassification === 'pathogenic') {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-01',
      axis: 'severity',
      category: 'pathogenic',
      description: 'Pathogenic variant (ACMG Class 5); abnormality severity graded major.'
    });
    return {
      abnormalitySeverity: 'major',
      reportingCategory: explicit || 'Class 5 — pathogenic',
      firedRules
    };
  }

  if (r.variantClassification === 'likely-pathogenic' || hasPathogenicVariant(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-01',
      axis: 'severity',
      category: 'likely-pathogenic',
      description:
        'Likely-pathogenic actionable variant (ACMG Class 4); abnormality severity graded moderate.'
    });
    return {
      abnormalitySeverity: 'moderate',
      reportingCategory: explicit || 'Class 4 — likely pathogenic',
      firedRules
    };
  }

  if (r.secondaryFinding || r.carrierStatusPositive) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-02',
      axis: 'severity',
      category: 'actionable-finding',
      description:
        'A secondary finding or positive carrier status is present; severity graded moderate.'
    });
    return {
      abnormalitySeverity: 'moderate',
      reportingCategory: explicit || 'actionable-finding',
      firedRules
    };
  }

  if (hasVus(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-01',
      axis: 'severity',
      category: 'variant-uncertain-significance',
      description:
        'Variant of uncertain significance (ACMG Class 3); abnormality severity graded minor.'
    });
    return {
      abnormalitySeverity: 'minor',
      reportingCategory: explicit || 'Class 3 — uncertain significance',
      firedRules
    };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-SEV-NONE-02',
      axis: 'severity',
      category: 'inconclusive',
      description: 'Inconclusive result; abnormality severity not established.'
    });
    return {
      abnormalitySeverity: 'none',
      reportingCategory: explicit || 'indeterminate',
      firedRules
    };
  }

  firedRules.push({
    ruleId: 'R-SEV-NONE-01',
    axis: 'severity',
    category: 'no-significant-variant',
    description: 'No clinically significant variant; abnormality severity graded none.'
  });
  return {
    abnormalitySeverity: 'none',
    reportingCategory: explicit || 'Class 1/2 — benign / no variant',
    firedRules
  };
}

// ----------------------------------------------------------------------
// Axis C — report completeness (mirrors `completeness-rules.ts`)
// ----------------------------------------------------------------------

/**
 * The five mandatory report sections per ACGS genomic-reporting standards:
 * clinical history, test details, variants, interpretation, and impression.
 *
 * @type {Array<{ ruleId: string, category: string, label: string,
 *                present: (r: GeneticResult) => boolean }>}
 */
const completenessSections = [
  {
    ruleId: 'R-COMP-HISTORY-01',
    category: 'history',
    label: 'clinical history',
    present: (r) => r.clinicalHistory.trim() !== ''
  },
  {
    ruleId: 'R-COMP-TEST-DETAILS-01',
    category: 'test-details',
    label: 'test details (genes tested)',
    present: (r) => r.genesTested.trim() !== ''
  },
  {
    ruleId: 'R-COMP-VARIANTS-01',
    category: 'variants',
    label: 'variants detected',
    present: (r) => r.variantsDetected.trim() !== ''
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
 * @param {GeneticResult} r
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
 * pathogenic / likely-pathogenic actionable variant auto-escalates to
 * critical-alert regardless of the other axes (the safety invariant). The
 * least-urgent band is chosen only when no rule fires.
 *
 * @param {GeneticResult} r
 * @param {ResultClassification} classification
 * @param {AbnormalitySeverity} severity
 * @returns {{ followUpUrgency: FollowUpUrgency, targetTimeframe: string,
 *             recommendedAction: string, firedRules: FiredRule[] }}
 */
function gradeFollowUp(r, classification, severity) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  // ─── critical-alert: auto-escalation invariant ───
  if (hasPathogenicVariant(r) || classification === 'critical') {
    firedRules.push({
      ruleId: 'R-FU-CRITICAL-01',
      axis: 'follow-up',
      category: 'pathogenic-variant',
      description:
        'Pathogenic / likely-pathogenic actionable variant auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
    });
    return {
      followUpUrgency: 'critical-alert',
      targetTimeframe: 'immediate',
      recommendedAction:
        'Communicate the actionable result to the referrer now, arrange urgent genetics MDT / counselling, and offer cascade testing of at-risk relatives.',
      firedRules
    };
  }

  // ─── urgent ───
  if (r.secondaryFinding) {
    firedRules.push({
      ruleId: 'R-FU-URGENT-01',
      axis: 'follow-up',
      category: 'secondary-finding',
      description: 'Actionable secondary finding present; follow-up urgency graded urgent.'
    });
    return {
      followUpUrgency: 'urgent',
      targetTimeframe: 'within 2 weeks',
      recommendedAction:
        'Arrange genetics review of the secondary finding and onward referral as clinically indicated.',
      firedRules
    };
  }

  // ─── recommended ───
  if (r.carrierStatusPositive) {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-01',
      axis: 'follow-up',
      category: 'carrier-status',
      description: 'Positive carrier status; genetic counselling recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 6 weeks',
      recommendedAction:
        'Offer genetic counselling and partner / reproductive carrier testing as appropriate.',
      firedRules
    };
  }

  if (hasVus(r) || classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-02',
      axis: 'follow-up',
      category: 'variant-uncertain-significance',
      description:
        'Variant of uncertain significance; re-contact / reclassification follow-up recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'periodic reclassification review',
      recommendedAction:
        'Recommend periodic variant reclassification review and re-contact if the classification changes.',
      firedRules
    };
  }

  if (severity === 'moderate') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-03',
      axis: 'follow-up',
      category: 'moderate-abnormality',
      description: 'Moderate abnormality present; follow-up recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 6 weeks',
      recommendedAction: 'Recommend genetics review or specialist referral as clinically indicated.',
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
    recommendedAction: 'No specific genetics follow-up required; manage per usual care.',
    firedRules
  };
}

export { hasActionableFinding, hasPathogenicVariant, hasVus, isNegativeResult, classifyResult, gradeSeverity, gradeCompleteness, gradeFollowUp };
