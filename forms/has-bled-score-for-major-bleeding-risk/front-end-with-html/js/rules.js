// Declarative HAS-BLED grading rules.
//
// HAS-BLED has nine scored criteria, each worth 0 or 1 point. The two letters
// A (abnormal renal, abnormal liver) and D (drugs, alcohol) each cover two
// independently scored items, so nine rules cover H, A, A, S, B, L, E, D, D.
// Each rule below evaluates the patient data and returns true when its
// criterion is positive; the grader (`grader.js`) sums the points into the
// total HAS-BLED score (0-9) and derives the risk band. Rows here mirror the
// `has_bled_score_for_major_bleeding_risk_grade_rule` SQL table
// (rule_id, criterion, points, category, description).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} HasBledRule
 * @property {string} id
 * @property {string} criterion   - hypertension | renal | liver | stroke | bleeding | labile-inr | elderly | drugs | alcohol
 * @property {number} points      - points contributed when the rule fires (1)
 * @property {string} category
 * @property {string} description
 * @property {(d: AssessmentData) => boolean} evaluate
 */

/** @type {HasBledRule[]} */
const hasBledRules = [
  // ─── H: HYPERTENSION ─────────────────────────────────────────
  {
    id: 'R-HYPERTENSION-01',
    criterion: 'hypertension',
    points: 1,
    category: 'has-bled-criterion',
    description: 'Uncontrolled hypertension — systolic blood pressure > 160 mmHg',
    evaluate: (d) => d.hypertension.hypertensionUncontrolled === 'yes'
  },

  // ─── A: ABNORMAL RENAL FUNCTION ──────────────────────────────
  {
    id: 'R-RENAL-01',
    criterion: 'renal',
    points: 1,
    category: 'has-bled-criterion',
    description: 'Abnormal renal function — dialysis, transplant, or serum creatinine >= 200 umol/L',
    evaluate: (d) => d.organFunction.abnormalRenalFunction === 'yes'
  },

  // ─── A: ABNORMAL LIVER FUNCTION ──────────────────────────────
  {
    id: 'R-LIVER-01',
    criterion: 'liver',
    points: 1,
    category: 'has-bled-criterion',
    description: 'Abnormal liver function — chronic hepatic disease (e.g. cirrhosis) or bilirubin > 2x ULN with AST/ALT/ALP > 3x ULN',
    evaluate: (d) => d.organFunction.abnormalLiverFunction === 'yes'
  },

  // ─── S: STROKE ───────────────────────────────────────────────
  {
    id: 'R-STROKE-01',
    criterion: 'stroke',
    points: 1,
    category: 'has-bled-criterion',
    description: 'Previous stroke history',
    evaluate: (d) => d.stroke.strokeHistory === 'yes'
  },

  // ─── B: BLEEDING HISTORY OR PREDISPOSITION ───────────────────
  {
    id: 'R-BLEEDING-01',
    criterion: 'bleeding',
    points: 1,
    category: 'has-bled-criterion',
    description: 'Bleeding history or predisposition — prior major bleeding, bleeding diathesis, or anaemia',
    evaluate: (d) => d.bleeding.bleedingHistory === 'yes'
  },

  // ─── L: LABILE INR ───────────────────────────────────────────
  {
    id: 'R-LABILE-INR-01',
    criterion: 'labile-inr',
    points: 1,
    category: 'has-bled-criterion',
    description: 'Labile INR — unstable or high INRs, or time in therapeutic range < 60%',
    evaluate: (d) => d.labileInr.labileInr === 'yes'
  },

  // ─── E: ELDERLY (derived from age) ───────────────────────────
  {
    id: 'R-ELDERLY-01',
    criterion: 'elderly',
    points: 1,
    category: 'has-bled-criterion',
    description: 'Elderly — age > 65 years',
    evaluate: (d) =>
      d.identification.ageYears !== null &&
      d.identification.ageYears > 65
  },

  // ─── D: DRUGS ────────────────────────────────────────────────
  {
    id: 'R-DRUGS-01',
    criterion: 'drugs',
    points: 1,
    category: 'has-bled-criterion',
    description: 'Drugs — concomitant antiplatelet agents or NSAIDs',
    evaluate: (d) => d.drugsAlcohol.antiplateletOrNsaid === 'yes'
  },

  // ─── D: ALCOHOL ──────────────────────────────────────────────
  {
    id: 'R-ALCOHOL-01',
    criterion: 'alcohol',
    points: 1,
    category: 'has-bled-criterion',
    description: 'Alcohol — >= 8 units per week',
    evaluate: (d) =>
      d.drugsAlcohol.alcoholUnitsPerWeek !== null &&
      d.drugsAlcohol.alcoholUnitsPerWeek >= 8
  }
];

export { hasBledRules };
