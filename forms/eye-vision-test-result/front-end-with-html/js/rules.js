// Declarative four-axis grading rules for the Eye Vision Test Result.
//
// Faithful vanilla-JavaScript port of the SvelteKit engine modules
// `src/lib/engine/{classification-rules,severity-rules,completeness-rules,
// follow-up-rules,utils}.ts` (predicates only — display helpers live in
// `types.js`). Rule IDs, categories, and descriptions are stable and identical
// across every front-end and the back-end; rows mirror the
// `eye_vision_test_result_grade_rule` SQL table.
//
// The grader (`grader.js`) composes the four axis functions into the full
// `GradingResult`; `flags.js` raises the safety-critical flags independently.

/**
 * @typedef {import('./types.js').EyeVisionResult} EyeVisionResult
 * @typedef {import('./types.js').ResultClassification} ResultClassification
 * @typedef {import('./types.js').AbnormalitySeverity} AbnormalitySeverity
 * @typedef {import('./types.js').FollowUpUrgency} FollowUpUrgency
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// ----------------------------------------------------------------------
// Clinical thresholds (mirror `utils.ts`)
// ----------------------------------------------------------------------

/**
 * Acutely raised intraocular pressure threshold (mmHg). At or above this in
 * either eye is treated as an acute-angle-closure / ocular-emergency signal.
 */
const ACUTE_IOP_MMHG = 40;

/**
 * NICE NG81 single referral / treatment intraocular-pressure threshold (mmHg).
 */
const RAISED_IOP_MMHG = 24;

// ----------------------------------------------------------------------
// Structured-findings predicates (mirror `utils.ts`)
// ----------------------------------------------------------------------

/**
 * Whether either eye has an acutely raised intraocular pressure (>= 40 mmHg).
 * @param {EyeVisionResult} r
 * @returns {boolean}
 */
function hasAcuteRaisedIop(r) {
  const right = r.intraocularPressureRightMmhg;
  const left = r.intraocularPressureLeftMmhg;
  return (
    (right !== null && right >= ACUTE_IOP_MMHG) ||
    (left !== null && left >= ACUTE_IOP_MMHG)
  );
}

/**
 * Whether either eye has an intraocular pressure at or above the NG81 threshold.
 * @param {EyeVisionResult} r
 * @returns {boolean}
 */
function hasElevatedIop(r) {
  const right = r.intraocularPressureRightMmhg;
  const left = r.intraocularPressureLeftMmhg;
  return (
    (right !== null && right >= RAISED_IOP_MMHG) ||
    (left !== null && left >= RAISED_IOP_MMHG)
  );
}

/**
 * A critical finding auto-escalates Axis D to critical-alert. Mirrors the
 * back-end invariant. Critical ophthalmic findings are:
 * - proliferative diabetic retinopathy,
 * - acutely raised intraocular pressure (>= 40 mmHg), and
 * - a recorded reduced visual acuity together with an optic-disc abnormality
 *   (a proxy for sudden visual loss / GCA / retinal-detachment emergencies).
 * @param {EyeVisionResult} r
 * @returns {boolean}
 */
function hasCriticalFinding(r) {
  return (
    r.retinopathyGrade === 'proliferative' ||
    hasAcuteRaisedIop(r) ||
    (r.reducedVisualAcuity && r.opticDiscAbnormality)
  );
}

/**
 * Whether any structured abnormal finding is present.
 * @param {EyeVisionResult} r
 * @returns {boolean}
 */
function hasAnyAbnormalFinding(r) {
  return (
    r.reducedVisualAcuity ||
    r.visualFieldDefect ||
    r.raisedIntraocularPressure ||
    r.diabeticRetinopathy ||
    r.opticDiscAbnormality ||
    r.macularAbnormality ||
    // gradeSeverity independently grades a referable retinopathy grade, an
    // elevated raw IOP measurement, or a bilateral visual-field defect result
    // from their own dedicated fields — each independent of the boolean
    // checkboxes above — so Axis A must agree even when those checkboxes are
    // unset.
    hasReferableRetinopathy(r) ||
    hasElevatedIop(r) ||
    r.visualFieldResult === 'bilateral-defect'
  );
}

/**
 * Whether the diabetic-retinopathy grade is referable (R2/R3-equivalent or
 * maculopathy).
 * @param {EyeVisionResult} r
 * @returns {boolean}
 */
function hasReferableRetinopathy(r) {
  return (
    r.retinopathyGrade === 'pre-proliferative' ||
    r.retinopathyGrade === 'proliferative' ||
    r.retinopathyGrade === 'maculopathy'
  );
}

// ----------------------------------------------------------------------
// Axis A — result classification (mirrors `classification-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical structured finding (proliferative retinopathy, acutely
 *   raised intraocular pressure, or reduced acuity with an optic-disc
 *   abnormality) is present.
 * - inconclusive: nothing was recorded — no structured findings, no narrative,
 *   no impression, and no normal-examination flag — so the study is
 *   uninterpretable.
 * - abnormal: any abnormal structured finding is present.
 * - normal: no abnormal finding and an interpretable examination.
 *
 * Returns the classification plus the audit-trail rules that fired.
 *
 * @param {EyeVisionResult} r
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
        'A critical ophthalmic finding (proliferative retinopathy, acutely raised IOP, or reduced acuity with optic-disc abnormality) is present; classified as critical.'
    });
    return { resultClassification: 'critical', firedRules };
  }

  const nothingRecorded =
    !hasAnyAbnormalFinding(r) &&
    !r.normalExamination &&
    r.findingsNarrative.trim() === '' &&
    r.impression.trim() === '';

  if (nothingRecorded) {
    firedRules.push({
      ruleId: 'R-CLASS-INCONCLUSIVE-01',
      axis: 'classification',
      category: 'no-findings-recorded',
      description:
        'No findings, narrative, or impression were recorded; the examination is uninterpretable, classified as inconclusive.'
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
// Axis B — abnormality severity (mirrors `severity-rules.ts`)
// ----------------------------------------------------------------------

/**
 * Derives a structured-reporting category label from the diabetic-retinopathy
 * grade, in the style of an NHS Diabetic Eye Screening Programme grade
 * (e.g. R2M1). Falls back to a short descriptive label otherwise.
 * @param {EyeVisionResult} r
 * @returns {string}
 */
function reportingCategoryFor(r) {
  const rGrade =
    r.retinopathyGrade === 'none'
      ? 'R0'
      : r.retinopathyGrade === 'background'
        ? 'R1'
        : r.retinopathyGrade === 'pre-proliferative'
          ? 'R2'
          : r.retinopathyGrade === 'proliferative'
            ? 'R3'
            : '';
  const mGrade =
    r.retinopathyGrade === 'maculopathy' || r.macularAbnormality ? 'M1' : '';
  const composite = `${rGrade}${mGrade}`;
  if (composite !== '') return composite;
  if (hasAnyAbnormalFinding(r)) return 'actionable-finding';
  return 'normal';
}

/**
 * Axis B — abnormality severity & structured-reporting category.
 *
 * Severity ladder (none → minor → moderate → major), grounded in RCOphth
 * actionable-reporting principles, NICE NG81 intraocular-pressure thresholds,
 * and the NHS Diabetic Eye Screening Programme grading criteria:
 * - major: a critical finding, or referable diabetic retinopathy
 *   (pre-proliferative / proliferative / maculopathy).
 * - moderate: an actionable abnormal finding (optic-disc abnormality, macular
 *   abnormality, bilateral field defect, or an intraocular pressure at or above
 *   the NG81 threshold).
 * - minor: a single low-acuity / minor structured abnormal finding.
 * - none: a normal study.
 *
 * The `reportingCategory` is a short structured label suitable for downstream
 * structured-reporting workflows.
 *
 * @param {EyeVisionResult} r
 * @param {ResultClassification} classification
 * @returns {{ abnormalitySeverity: AbnormalitySeverity, reportingCategory: string,
 *             firedRules: FiredRule[] }}
 */
function gradeSeverity(r, classification) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  const reportingCategory = reportingCategoryFor(r);

  if (hasCriticalFinding(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-01',
      axis: 'severity',
      category: 'critical-finding',
      description: 'Critical finding present; abnormality severity graded major.'
    });
    return { abnormalitySeverity: 'major', reportingCategory, firedRules };
  }

  if (hasReferableRetinopathy(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MAJOR-02',
      axis: 'severity',
      category: 'referable-retinopathy',
      description:
        'Referable diabetic retinopathy (pre-proliferative, proliferative, or maculopathy) is present; abnormality severity graded major.'
    });
    return { abnormalitySeverity: 'major', reportingCategory, firedRules };
  }

  const actionable =
    r.opticDiscAbnormality ||
    r.macularAbnormality ||
    r.visualFieldResult === 'bilateral-defect' ||
    hasElevatedIop(r);

  if (actionable) {
    firedRules.push({
      ruleId: 'R-SEV-MODERATE-01',
      axis: 'severity',
      category: 'actionable-finding',
      description:
        'An actionable abnormal finding (optic-disc abnormality, macular abnormality, bilateral field defect, or elevated intraocular pressure) is present; severity graded moderate.'
    });
    return { abnormalitySeverity: 'moderate', reportingCategory, firedRules };
  }

  if (hasAnyAbnormalFinding(r)) {
    firedRules.push({
      ruleId: 'R-SEV-MINOR-01',
      axis: 'severity',
      category: 'minor-finding',
      description:
        'A minor structured abnormal finding (e.g. reduced acuity, unilateral field defect, or background retinopathy) is present; abnormality severity graded minor.'
    });
    return { abnormalitySeverity: 'minor', reportingCategory, firedRules };
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
  return { abnormalitySeverity: 'none', reportingCategory, firedRules };
}

// ----------------------------------------------------------------------
// Axis C — report completeness (mirrors `completeness-rules.ts`)
// ----------------------------------------------------------------------

/**
 * The five mandatory report sections per RCOphth reporting standards:
 * clinical history, measurements, findings, impression, and follow-up.
 *
 * @type {Array<{ ruleId: string, category: string, label: string,
 *                present: (r: EyeVisionResult) => boolean }>}
 */
const completenessSections = [
  {
    ruleId: 'R-COMP-HISTORY-01',
    category: 'history',
    label: 'clinical history',
    present: (r) => r.clinicalHistory.trim() !== ''
  },
  {
    ruleId: 'R-COMP-MEASUREMENTS-01',
    category: 'measurements',
    label: 'measurements (visual acuity, intraocular pressure, or visual fields)',
    present: (r) =>
      r.visualAcuityRight.trim() !== '' ||
      r.visualAcuityLeft.trim() !== '' ||
      r.intraocularPressureRightMmhg !== null ||
      r.intraocularPressureLeftMmhg !== null ||
      r.visualFieldResult !== ''
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
  },
  {
    ruleId: 'R-COMP-FOLLOWUP-01',
    category: 'follow-up',
    label: 'recommended follow-up',
    present: (r) => r.recommendedFollowUp.trim() !== ''
  }
];

/**
 * Axis C — report completeness.
 *
 * Returns the percentage (0-100, rounded) of mandatory report sections that
 * are present, plus an audit-trail rule for each missing section.
 *
 * @param {EyeVisionResult} r
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
 * critical finding auto-escalates to critical-alert regardless of the other
 * axes (the safety invariant). The least-urgent band is chosen only when no
 * rule fires.
 *
 * @param {EyeVisionResult} r
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
        'Critical ophthalmic finding auto-escalates follow-up urgency to critical-alert regardless of the other axes.'
    });
    return {
      followUpUrgency: 'critical-alert',
      targetTimeframe: 'immediate',
      recommendedAction:
        'Arrange urgent (same-day) ophthalmology review; communicate the critical result directly to the referrer now and document the conversation.',
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
      targetTimeframe: 'within 1 week',
      recommendedAction:
        'Arrange urgent ophthalmology review and expedite onward referral.',
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
      targetTimeframe: 'within 4 weeks',
      recommendedAction:
        'Recommend ophthalmology / optometry follow-up or referral as clinically indicated.',
      firedRules
    };
  }

  if (classification === 'inconclusive') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-02',
      axis: 'follow-up',
      category: 'inconclusive',
      description: 'Inconclusive study; repeat or alternative examination recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 4 weeks',
      recommendedAction:
        'Recommend repeat or alternative examination to resolve the inconclusive study.',
      firedRules
    };
  }

  if (severity === 'minor') {
    firedRules.push({
      ruleId: 'R-FU-RECOMMENDED-03',
      axis: 'follow-up',
      category: 'minor-abnormality',
      description: 'Minor abnormality; routine monitoring recommended.'
    });
    return {
      followUpUrgency: 'recommended',
      targetTimeframe: 'within 3 months',
      recommendedAction:
        'Recommend routine monitoring of the minor finding per the relevant pathway.',
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
      'No specific eye-care follow-up required; manage per usual care.',
    firedRules
  };
}

export { ACUTE_IOP_MMHG, RAISED_IOP_MMHG, hasAcuteRaisedIop, hasElevatedIop, hasCriticalFinding, hasAnyAbnormalFinding, hasReferableRetinopathy, classifyResult, gradeSeverity, gradeCompleteness, gradeFollowUp };
