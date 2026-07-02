// Child-Pugh grader. Pure functions: take an `AssessmentData` object, score the
// five parameters (each 1-3 points via the helpers in `rules.js`), sum the
// answered points into a total (5-15 when complete), and band the total into a
// class (A/B/C) with its survival and surgical-risk estimates.
//
// Grading algorithm (spec §4):
//   bilirubinPoint      = totalBilirubin < 34 ? 1 : <= 50 ? 2 : 3        // µmol/L
//   albuminPoint        = serumAlbumin   > 35 ? 1 : >= 28 ? 2 : 3        // g/L
//   coagulationPoint    = inr < 1.7 ? 1 : <= 2.3 ? 2 : 3 (INR preferred; PT fallback)
//   ascitesPoint        = none ? 1 : mild ? 2 : 3
//   encephalopathyPoint = none ? 1 : grade-1-2 ? 2 : 3
//   childPughScore      = sum of answered points (5..15 when complete)
//   childPughClass      = childPughScore <= 6 ? 'A' : <= 9 ? 'B' : 'C'
//
// A missing parameter contributes no points to the (partial) total; `flags.js`
// raises a data-completeness flag separately. `complete` is true only once all
// five parameters are answered.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').ChildPughClass} ChildPughClass
 * @typedef {import('./types.js').SurgicalRisk} SurgicalRisk
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.ChildPughScore.
(function () {
'use strict';
window.ChildPughScore = window.ChildPughScore || {};
const {
  bilirubinPoints,
  albuminPoints,
  coagulationPoints,
  ascitesPoints,
  encephalopathyPoints,
  classBand,
  childPughRules
} = window.ChildPughScore;

/**
 * Evaluate the declarative rule table and collect the rows that fired (one per
 * answered parameter).
 * @param {AssessmentData} data
 * @returns {FiredRule[]}
 */
function evaluateRules(data) {
  /** @type {FiredRule[]} */
  const fired = [];
  for (const rule of childPughRules) {
    try {
      if (rule.evaluate(data)) {
        fired.push({
          id: rule.id,
          parameter: rule.parameter,
          points: rule.points,
          category: rule.category,
          description: rule.description
        });
      }
    } catch (e) {
      console.warn(`Child-Pugh rule ${rule.id} evaluation failed:`, e);
    }
  }
  return fired;
}

/**
 * Compute the full Child-Pugh grade for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {{ bilirubinPoint: 1|2|3|null, albuminPoint: 1|2|3|null,
 *             coagulationPoint: 1|2|3|null, ascitesPoint: 1|2|3|null,
 *             encephalopathyPoint: 1|2|3|null, childPughScore: number,
 *             childPughClass: ChildPughClass, oneYearSurvival: string,
 *             twoYearSurvival: string, surgicalRisk: SurgicalRisk,
 *             complete: boolean, firedRules: FiredRule[] }}
 */
function calculateChildPughGrade(data) {
  const bilirubinPoint = bilirubinPoints(data);
  const albuminPoint = albuminPoints(data);
  const coagulationPoint = coagulationPoints(data);
  const ascitesPoint = ascitesPoints(data);
  const encephalopathyPoint = encephalopathyPoints(data);

  const points = [
    bilirubinPoint,
    albuminPoint,
    coagulationPoint,
    ascitesPoint,
    encephalopathyPoint
  ];
  const complete = points.every((p) => p !== null);
  const childPughScore = points.reduce((sum, p) => sum + (p || 0), 0);

  const band = classBand(childPughScore);
  const firedRules = evaluateRules(data);

  // Record the derived class decision as a `class` audit row, mirroring the
  // grade_rule table's `class` parameter.
  firedRules.push({
    id: `R-CLASS-${band.childPughClass}-01`,
    parameter: 'class',
    points: null,
    category: 'class-band',
    description:
      `Child-Pugh total ${childPughScore}${complete ? '' : ' (partial)'} → ` +
      `Class ${band.childPughClass}; ~1-year survival ${band.oneYearSurvival}, ` +
      `~2-year survival ${band.twoYearSurvival}; ` +
      `peri-operative risk ${band.surgicalRisk}`
  });

  return {
    bilirubinPoint,
    albuminPoint,
    coagulationPoint,
    ascitesPoint,
    encephalopathyPoint,
    childPughScore,
    childPughClass: band.childPughClass,
    oneYearSurvival: band.oneYearSurvival,
    twoYearSurvival: band.twoYearSurvival,
    surgicalRisk: band.surgicalRisk,
    complete,
    firedRules
  };
}

Object.assign(window.ChildPughScore, {
  evaluateRules,
  calculateChildPughGrade
});
})();
