// Pure SAD grader. Takes an `AssessmentData` object and returns the SPAQ
// total + band, the PHQ-9 total + band, the combined severity, and the
// audit trail of fired rules.
//
// Combined severity rules (in order — first match wins):
//   1. critical  -> active suicidal ideation, suicidal intent, self-harm Yes,
//                   PHQ-9 q9 >= 1, or PHQ-9 total >= 20.
//   2. severe    -> SPAQ band 'sad-likely' AND PHQ-9 band moderately-severe+
//                   OR PHQ-9 band severe alone.
//   3. moderate  -> SPAQ 'sad-likely' OR PHQ-9 band moderate.
//   4. mild      -> SPAQ 'subsyndromal' OR PHQ-9 band mild.
//   5. no-sad    -> otherwise.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').CombinedSeverity} CombinedSeverity
 * @typedef {import('./types.js').SpaqBand} SpaqBand
 * @typedef {import('./types.js').Phq9Band} Phq9Band
 */

(function () {
'use strict';
window.SeasonalAffectiveDisorderAssessment =
  window.SeasonalAffectiveDisorderAssessment || {};

const NS = window.SeasonalAffectiveDisorderAssessment;
const { spaqItems, phq9Items, classifySpaq, classifyPhq9 } = NS;

/**
 * Grade a SAD assessment.
 *
 * @param {AssessmentData} data
 * @returns {{
 *   spaqScore: number,
 *   spaqBand: SpaqBand,
 *   phq9Score: number,
 *   phq9Band: Phq9Band,
 *   combinedSeverity: CombinedSeverity,
 *   firedRules: FiredRule[]
 * }}
 */
function gradeSAD(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  // ─── SPAQ Global Seasonality Score ────────────────────────
  let spaqScore = 0;
  for (const item of spaqItems) {
    const sub = data[item.section]?.[item.subsection];
    const v = sub ? sub[item.field] : null;
    if (typeof v === 'number' && Number.isFinite(v)) {
      spaqScore += v;
      firedRules.push({
        id: item.id,
        category: `SPAQ • ${item.category}`,
        description: item.label,
        score: v
      });
    }
  }
  const spaqBand = classifySpaq(spaqScore);

  // ─── PHQ-9 ────────────────────────────────────────────────
  let phq9Score = 0;
  const phq9 = data.currentMood?.phq9 || {};
  for (const item of phq9Items) {
    const v = phq9[item.field];
    if (typeof v === 'number' && Number.isFinite(v)) {
      phq9Score += v;
      firedRules.push({
        id: item.id,
        category: `PHQ-9 • ${item.category}`,
        description: item.label,
        score: v
      });
    }
  }
  const phq9Band = classifyPhq9(phq9Score);

  // ─── Combined severity ────────────────────────────────────
  const risk = data.riskAssessment || {};
  const phq9Q9 = typeof phq9.q9 === 'number' ? phq9.q9 : 0;

  let combinedSeverity;
  if (
    risk.suicidalIdeation === 'yes' ||
    risk.suicidalIntent === 'yes' ||
    risk.selfHarm === 'yes' ||
    risk.previousAttempt === 'yes' ||
    phq9Q9 >= 1 ||
    phq9Score >= 20
  ) {
    combinedSeverity = 'critical';
  } else if (
    phq9Band === 'severe' ||
    (spaqBand === 'sad-likely' && phq9Band === 'moderately-severe')
  ) {
    combinedSeverity = 'severe';
  } else if (
    spaqBand === 'sad-likely' ||
    phq9Band === 'moderate' ||
    phq9Band === 'moderately-severe'
  ) {
    combinedSeverity = 'moderate';
  } else if (spaqBand === 'subsyndromal' || phq9Band === 'mild') {
    combinedSeverity = 'mild';
  } else {
    combinedSeverity = 'no-sad';
  }

  return {
    spaqScore,
    spaqBand,
    phq9Score,
    phq9Band,
    combinedSeverity,
    firedRules
  };
}

Object.assign(window.SeasonalAffectiveDisorderAssessment, {
  gradeSAD
});
})();
