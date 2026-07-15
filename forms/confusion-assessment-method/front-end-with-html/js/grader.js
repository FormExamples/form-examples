import { camRules } from './rules.js';

// CAM grader. Pure functions: take an `AssessmentData` object, evaluate the
// four feature rules in `camRules`, and apply the fixed CAM diagnostic
// algorithm to derive a classification. This is a status / classification
// form — there is NO numeric total, no cut-off, and no band table.
//
// Diagnostic algorithm (spec §4):
//   deliriumPresent = feature1 AND feature2 AND (feature3 OR feature4)
//   classification  = deliriumPresent ? 'present' : 'absent'
//
// Edge case (spec §4): for the CAM-ICU variant, a patient who is unrousable
// (RASS -4 or -5) cannot be assessed. The algorithm is NOT evaluated and the
// classification is 'unable-to-assess'; deliriumPresent is null and the
// positive-feature set is empty.
//
// The engine also returns `positiveFeatures: number[]` — the subset of
// {1,2,3,4} that were positive — so the reasoning is auditable, plus a
// `firedRules` audit trail mirroring the SQL grade_rule table.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').Classification} Classification
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.ConfusionAssessmentMethod.

/**
 * Whether the CAM-ICU arousal gate blocks assessment: variant is CAM-ICU and
 * the RASS score is -4 or -5 (unrousable).
 * @param {AssessmentData} data
 * @returns {boolean}
 */
function isUnableToAssess(data) {
  return (
    data.context.camVariant === 'cam-icu' &&
    data.feature4.rassScore !== null &&
    (data.feature4.rassScore === -4 || data.feature4.rassScore === -5)
  );
}

/**
 * Evaluate the four CAM feature rules.
 * @param {AssessmentData} data
 * @returns {{ positives: Object.<number, boolean>, firedRules: FiredRule[] }}
 */
function evaluateFeatures(data) {
  /** @type {Object.<number, boolean>} */
  const positives = {};
  /** @type {FiredRule[]} */
  const firedRules = [];
  for (const rule of camRules) {
    let positive = false;
    try {
      positive = rule.evaluate(data) === true;
    } catch (e) {
      console.warn(`CAM rule ${rule.id} evaluation failed:`, e);
    }
    positives[rule.featureNumber] = positive;
    firedRules.push({
      id: rule.id,
      feature: rule.feature,
      positive,
      category: rule.category,
      description: `${rule.description} — ${positive ? 'POSITIVE' : 'negative'}`
    });
  }
  return { positives, firedRules };
}

/**
 * Compute the full CAM classification for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {{ classification: Classification, deliriumPresent: (boolean|null),
 *             positiveFeatures: number[],
 *             feature1Positive: (boolean|null), feature2Positive: (boolean|null),
 *             feature3Positive: (boolean|null), feature4Positive: (boolean|null),
 *             motoricSubtype: string, firedRules: FiredRule[] }}
 */
function calculateCamGrade(data) {
  const motoricSubtype = data.observations.motoricSubtype;

  // ─── Arousal gate (CAM-ICU RASS -4/-5) ──────────────────────────
  if (isUnableToAssess(data)) {
    return {
      classification: 'unable-to-assess',
      deliriumPresent: null,
      positiveFeatures: [],
      feature1Positive: null,
      feature2Positive: null,
      feature3Positive: null,
      feature4Positive: null,
      motoricSubtype,
      firedRules: [
        {
          id: 'R-AROUSAL-GATE-01',
          feature: 'arousal',
          positive: null,
          category: 'arousal-gate',
          description: `CAM-ICU RASS ${data.feature4.rassScore} (unrousable) — cannot assess; classification unable-to-assess`
        }
      ]
    };
  }

  // ─── Evaluate the four features ─────────────────────────────────
  const { positives, firedRules } = evaluateFeatures(data);
  const f1 = positives[1];
  const f2 = positives[2];
  const f3 = positives[3];
  const f4 = positives[4];

  // ─── Fixed CAM diagnostic algorithm ─────────────────────────────
  const deliriumPresent = f1 && f2 && (f3 || f4);
  /** @type {Classification} */
  const classification = deliriumPresent ? 'present' : 'absent';

  const positiveFeatures = [1, 2, 3, 4].filter((n) => positives[n]);

  // Record the algorithm-combiner decision as an audit row, mirroring the
  // grade_rule table's `algorithm` feature.
  firedRules.push({
    id: 'R-ALGORITHM-01',
    feature: 'algorithm',
    positive: null,
    category: 'algorithm-combiner',
    description: deliriumPresent
      ? '1 AND 2 AND (3 OR 4) satisfied — delirium present'
      : '1 AND 2 AND (3 OR 4) not satisfied — delirium absent'
  });

  return {
    classification,
    deliriumPresent,
    positiveFeatures,
    feature1Positive: f1,
    feature2Positive: f2,
    feature3Positive: f3,
    feature4Positive: f4,
    motoricSubtype,
    firedRules
  };
}

export { isUnableToAssess, evaluateFeatures, calculateCamGrade };
