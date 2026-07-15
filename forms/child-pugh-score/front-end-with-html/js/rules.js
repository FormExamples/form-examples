// Declarative Child-Pugh grading rules.
//
// The Child-Pugh instrument scores five parameters — total bilirubin, serum
// albumin, coagulation (INR or prothrombin time), ascites, and hepatic
// encephalopathy — each awarding 1, 2, or 3 points against fixed thresholds
// (spec §4). This file holds the pure per-parameter scoring helpers, the class
// banding, and a declarative rule table whose rows mirror the
// `child_pugh_score_grade_rule` SQL table (rule_id, parameter, points,
// category, description). The grader (`grader.js`) sums the five points into a
// total of 5-15 and derives the class (A/B/C) with its survival and
// surgical-risk band.
//
// Thresholds (spec §4):
//   bilirubin (µmol/L):  < 34 → 1,  34-50 → 2,  > 50 → 3
//   albumin   (g/L):     > 35 → 1,  28-35 → 2,  < 28 → 3
//   coagulation (INR):   < 1.7 → 1, 1.7-2.3 → 2, > 2.3 → 3
//     PT-prolongation fallback (seconds): < 4 → 1, 4-6 → 2, > 6 → 3
//   ascites:             none → 1,  mild → 2,  moderate-severe → 3
//   encephalopathy:      none → 1,  grade-1-2 → 2,  grade-3-4 → 3
//
// A parameter with no input cannot be scored — its helper returns null and the
// grader excludes it from the (partial) total, raising a data-completeness flag
// separately in `flags.js`.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').ChildPughClass} ChildPughClass
 * @typedef {import('./types.js').SurgicalRisk} SurgicalRisk
 *
 * @typedef {Object} ChildPughRule
 * @property {string} id
 * @property {string} parameter   - bilirubin | albumin | coagulation | ascites | encephalopathy
 * @property {number} points      - points awarded when the rule fires (1-3)
 * @property {string} category
 * @property {string} description
 * @property {(d: AssessmentData) => boolean} evaluate
 */

/**
 * Parameter 1 — total bilirubin (µmol/L). Returns 1-3, or null when unmeasured.
 * @param {AssessmentData} d
 * @returns {1 | 2 | 3 | null}
 */
function bilirubinPoints(d) {
  const v = d.bilirubin.totalBilirubin;
  if (v === null || v === undefined) return null;
  if (v < 34) return 1;
  if (v <= 50) return 2;
  return 3;
}

/**
 * Parameter 2 — serum albumin (g/L). Returns 1-3, or null when unmeasured.
 * @param {AssessmentData} d
 * @returns {1 | 2 | 3 | null}
 */
function albuminPoints(d) {
  const v = d.albumin.serumAlbumin;
  if (v === null || v === undefined) return null;
  if (v > 35) return 1;
  if (v >= 28) return 2;
  return 3;
}

/**
 * Parameter 3 — coagulation. INR is preferred; prothrombin-time prolongation
 * (seconds) is the fallback used only when no INR is recorded. Returns 1-3, or
 * null when neither measure is available.
 * @param {AssessmentData} d
 * @returns {1 | 2 | 3 | null}
 */
function coagulationPoints(d) {
  const inr = d.coagulation.inr;
  if (inr !== null && inr !== undefined) {
    if (inr < 1.7) return 1;
    if (inr <= 2.3) return 2;
    return 3;
  }
  const pt = d.coagulation.prothrombinTimeProlongation;
  if (pt !== null && pt !== undefined) {
    if (pt < 4) return 1;
    if (pt <= 6) return 2;
    return 3;
  }
  return null;
}

/**
 * Parameter 4 — ascites. Returns 1-3, or null when ungraded.
 * @param {AssessmentData} d
 * @returns {1 | 2 | 3 | null}
 */
function ascitesPoints(d) {
  switch (d.ascitesStep.ascites) {
    case 'none': return 1;
    case 'mild': return 2;
    case 'moderate-severe': return 3;
    default: return null;
  }
}

/**
 * Parameter 5 — hepatic encephalopathy. Returns 1-3, or null when ungraded.
 * @param {AssessmentData} d
 * @returns {1 | 2 | 3 | null}
 */
function encephalopathyPoints(d) {
  switch (d.encephalopathyStep.encephalopathy) {
    case 'none': return 1;
    case 'grade-1-2': return 2;
    case 'grade-3-4': return 3;
    default: return null;
  }
}

/**
 * Band a Child-Pugh total (5-15) into a class with its survival and
 * surgical-risk estimates. Partial totals below 5 still band to Class A; the
 * grade is flagged provisional while the assessment is incomplete.
 * @param {number} score
 * @returns {{ childPughClass: ChildPughClass, oneYearSurvival: string,
 *             twoYearSurvival: string, surgicalRisk: SurgicalRisk }}
 */
function classBand(score) {
  if (score <= 6) {
    return {
      childPughClass: 'A',
      oneYearSurvival: '~100%',
      twoYearSurvival: '~85%',
      surgicalRisk: 'low'
    };
  }
  if (score <= 9) {
    return {
      childPughClass: 'B',
      oneYearSurvival: '~80%',
      twoYearSurvival: '~60%',
      surgicalRisk: 'moderate'
    };
  }
  return {
    childPughClass: 'C',
    oneYearSurvival: '~45%',
    twoYearSurvival: '~35%',
    surgicalRisk: 'high'
  };
}

// Declarative rule table — one row per parameter/point combination. Exactly one
// row per parameter fires when that parameter is answered; none fire when it is
// missing. Rows mirror the `child_pugh_score_grade_rule` SQL table.
/** @type {ChildPughRule[]} */
const childPughRules = [
  // ─── PARAMETER 1: TOTAL BILIRUBIN ─────────────────────────────
  {
    id: 'R-BILIRUBIN-1POINT-01',
    parameter: 'bilirubin',
    points: 1,
    category: 'threshold-band',
    description: 'Total bilirubin < 34 µmol/L (< 2 mg/dL)',
    evaluate: (d) => bilirubinPoints(d) === 1
  },
  {
    id: 'R-BILIRUBIN-2POINT-01',
    parameter: 'bilirubin',
    points: 2,
    category: 'threshold-band',
    description: 'Total bilirubin 34-50 µmol/L (2-3 mg/dL)',
    evaluate: (d) => bilirubinPoints(d) === 2
  },
  {
    id: 'R-BILIRUBIN-3POINT-01',
    parameter: 'bilirubin',
    points: 3,
    category: 'threshold-band',
    description: 'Total bilirubin > 50 µmol/L (> 3 mg/dL)',
    evaluate: (d) => bilirubinPoints(d) === 3
  },

  // ─── PARAMETER 2: SERUM ALBUMIN ───────────────────────────────
  {
    id: 'R-ALBUMIN-1POINT-01',
    parameter: 'albumin',
    points: 1,
    category: 'threshold-band',
    description: 'Serum albumin > 35 g/L',
    evaluate: (d) => albuminPoints(d) === 1
  },
  {
    id: 'R-ALBUMIN-2POINT-01',
    parameter: 'albumin',
    points: 2,
    category: 'threshold-band',
    description: 'Serum albumin 28-35 g/L',
    evaluate: (d) => albuminPoints(d) === 2
  },
  {
    id: 'R-ALBUMIN-3POINT-01',
    parameter: 'albumin',
    points: 3,
    category: 'threshold-band',
    description: 'Serum albumin < 28 g/L',
    evaluate: (d) => albuminPoints(d) === 3
  },

  // ─── PARAMETER 3: COAGULATION (INR OR PROTHROMBIN TIME) ────────
  {
    id: 'R-COAGULATION-1POINT-01',
    parameter: 'coagulation',
    points: 1,
    category: 'threshold-band',
    description: 'INR < 1.7 (or prothrombin time < 4 s prolonged)',
    evaluate: (d) => coagulationPoints(d) === 1
  },
  {
    id: 'R-COAGULATION-2POINT-01',
    parameter: 'coagulation',
    points: 2,
    category: 'threshold-band',
    description: 'INR 1.7-2.3 (or prothrombin time 4-6 s prolonged)',
    evaluate: (d) => coagulationPoints(d) === 2
  },
  {
    id: 'R-COAGULATION-3POINT-01',
    parameter: 'coagulation',
    points: 3,
    category: 'threshold-band',
    description: 'INR > 2.3 (or prothrombin time > 6 s prolonged)',
    evaluate: (d) => coagulationPoints(d) === 3
  },

  // ─── PARAMETER 4: ASCITES ─────────────────────────────────────
  {
    id: 'R-ASCITES-1POINT-01',
    parameter: 'ascites',
    points: 1,
    category: 'ordinal-grade',
    description: 'No ascites',
    evaluate: (d) => ascitesPoints(d) === 1
  },
  {
    id: 'R-ASCITES-2POINT-01',
    parameter: 'ascites',
    points: 2,
    category: 'ordinal-grade',
    description: 'Mild ascites (diuretic-responsive)',
    evaluate: (d) => ascitesPoints(d) === 2
  },
  {
    id: 'R-ASCITES-3POINT-01',
    parameter: 'ascites',
    points: 3,
    category: 'ordinal-grade',
    description: 'Moderate-to-severe (diuretic-refractory) ascites',
    evaluate: (d) => ascitesPoints(d) === 3
  },

  // ─── PARAMETER 5: HEPATIC ENCEPHALOPATHY ──────────────────────
  {
    id: 'R-ENCEPHALOPATHY-1POINT-01',
    parameter: 'encephalopathy',
    points: 1,
    category: 'ordinal-grade',
    description: 'No hepatic encephalopathy',
    evaluate: (d) => encephalopathyPoints(d) === 1
  },
  {
    id: 'R-ENCEPHALOPATHY-2POINT-01',
    parameter: 'encephalopathy',
    points: 2,
    category: 'ordinal-grade',
    description: 'Grade 1-2 encephalopathy (or medically controlled)',
    evaluate: (d) => encephalopathyPoints(d) === 2
  },
  {
    id: 'R-ENCEPHALOPATHY-3POINT-01',
    parameter: 'encephalopathy',
    points: 3,
    category: 'ordinal-grade',
    description: 'Grade 3-4 encephalopathy (or refractory)',
    evaluate: (d) => encephalopathyPoints(d) === 3
  }
];

export { bilirubinPoints, albuminPoints, coagulationPoints, ascitesPoints, encephalopathyPoints, classBand, childPughRules };
