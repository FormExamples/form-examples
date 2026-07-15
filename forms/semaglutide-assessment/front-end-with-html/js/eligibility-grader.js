import { absoluteContraindications, bmiThresholds, relativeContraindications } from './eligibility-rules.js';
import { bmiCategory, calculateBMI } from './types.js';

// Semaglutide eligibility grader. Pure functions: take an `AssessmentData`
// object, return the eligibility status (Eligible / Conditional / Ineligible),
// the BMI and category, and the lists of fired absolute and relative
// contraindications.
//
// Eligibility logic:
//   - Any absolute contraindication        -> Ineligible
//   - Any relative contraindication        -> Conditional
//   - (Or BMI < 27 with weight-management) -> Conditional
//   - Otherwise                            -> Eligible
//
// Ported 1:1 from `src/lib/engine/eligibility-grader.ts`.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').EligibilityStatus} EligibilityStatus
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.SemaglutideAssessment.

/**
 * Pure function: evaluates eligibility for semaglutide therapy.
 *
 * @param {AssessmentData} data
 * @returns {{
 *   eligibilityStatus: EligibilityStatus,
 *   bmi: number | null,
 *   bmiCategoryLabel: string,
 *   absoluteContraindications: FiredRule[],
 *   relativeContraindications: FiredRule[]
 * }}
 */
function evaluateEligibility(data) {
  /** @type {FiredRule[]} */
  const firedAbsolute = [];
  /** @type {FiredRule[]} */
  const firedRelative = [];

  const cs = data.contraindicationsScreening;

  // ─── Absolute contraindications ──────────────────────────
  if (cs.personalHistoryMTC === 'yes') {
    firedAbsolute.push(Object.assign({}, absoluteContraindications[0]));
  }
  if (cs.familyHistoryMTC === 'yes') {
    firedAbsolute.push(Object.assign({}, absoluteContraindications[1]));
  }
  if (cs.men2Syndrome === 'yes') {
    firedAbsolute.push(Object.assign({}, absoluteContraindications[2]));
  }
  if (cs.pancreatitisHistory === 'yes') {
    firedAbsolute.push(Object.assign({}, absoluteContraindications[3]));
  }
  if (cs.pregnancyPlanned === 'yes') {
    firedAbsolute.push(Object.assign({}, absoluteContraindications[4]));
  }
  if (cs.type1Diabetes === 'yes') {
    firedAbsolute.push(Object.assign({}, absoluteContraindications[5]));
  }
  if (cs.allergySemaglutide === 'yes') {
    firedAbsolute.push(Object.assign({}, absoluteContraindications[6]));
  }

  // ─── Relative contraindications ─────────────────────────
  const gi = data.gastrointestinalHistory;
  if (gi.gastroparesis === 'yes') {
    firedRelative.push(Object.assign({}, relativeContraindications[0]));
  }
  if (gi.gallstoneHistory === 'yes') {
    firedRelative.push(Object.assign({}, relativeContraindications[1]));
  }
  if (cs.diabeticRetinopathySevere === 'yes') {
    firedRelative.push(Object.assign({}, relativeContraindications[2]));
  }
  if (data.mentalHealthScreening.eatingDisorderHistory === 'yes') {
    firedRelative.push(Object.assign({}, relativeContraindications[3]));
  }
  if (data.mentalHealthScreening.suicidalIdeation === 'yes') {
    firedRelative.push(Object.assign({}, relativeContraindications[4]));
  }
  if (cs.breastfeeding === 'yes') {
    firedRelative.push(Object.assign({}, relativeContraindications[5]));
  }
  if (cs.severeGIDisease === 'yes') {
    firedRelative.push(Object.assign({}, relativeContraindications[6]));
  }

  // ─── BMI evaluation ─────────────────────────────────────
  const bmi = calculateBMI(data.bodyComposition.heightCm, data.bodyComposition.weightKg);
  const bmiCategoryLabel = bmi !== null ? bmiCategory(bmi) : '';

  // Check BMI threshold for weight-management indication
  if (data.indicationGoals.primaryIndication === 'weight-management' && bmi !== null) {
    const thresholds = bmiThresholds['weight-management'];
    if (thresholds.minimumBmiWithComorbidity !== null && bmi < thresholds.minimumBmiWithComorbidity) {
      firedRelative.push({
        id: 'BMI-LOW-001',
        category: 'Body Composition',
        description: `BMI ${bmi.toFixed(1)} below minimum threshold of ${thresholds.minimumBmiWithComorbidity} for weight management indication`,
        type: 'relative'
      });
    }
  }

  // ─── Determine overall eligibility ──────────────────────
  /** @type {EligibilityStatus} */
  let eligibilityStatus;
  if (firedAbsolute.length > 0) {
    eligibilityStatus = 'Ineligible';
  } else if (firedRelative.length > 0) {
    eligibilityStatus = 'Conditional';
  } else {
    eligibilityStatus = 'Eligible';
  }

  return {
    eligibilityStatus,
    bmi,
    bmiCategoryLabel,
    absoluteContraindications: firedAbsolute,
    relativeContraindications: firedRelative
  };
}

export { evaluateEligibility };
