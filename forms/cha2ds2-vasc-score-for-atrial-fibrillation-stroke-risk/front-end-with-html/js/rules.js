// Declarative CHA2DS2-VASc grading rules.
//
// The CHA2DS2-VASc instrument has eight weighted criteria. Each rule below
// evaluates the patient data and returns true when its criterion is positive;
// the grader (`grader.js`) sums the points into the total score (0-9) and
// derives the risk band. The two age rules are mutually exclusive by their
// predicates (>= 75 scores 2; 65-74 scores 1; never both). Rows here mirror the
// `cha2ds2_vasc_grade_rule` SQL table (rule_id, criterion, points, category,
// description).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} Cha2ds2VascRule
 * @property {string} id
 * @property {string} criterion   - congestive-heart-failure | hypertension | age | diabetes | stroke | vascular-disease | sex
 * @property {number} points      - points contributed when the rule fires
 * @property {string} category
 * @property {string} description
 * @property {(d: AssessmentData) => boolean} evaluate
 */

// Wrapped in an IIFE; published via
// window.Cha2ds2VascScoreForAtrialFibrillationStrokeRisk.

/** @type {Cha2ds2VascRule[]} */
const cha2ds2VascRules = [
  // ─── C: CONGESTIVE HEART FAILURE / LV DYSFUNCTION (1) ─────────
  {
    id: 'R-CONGESTIVE-HEART-FAILURE-01',
    criterion: 'congestive-heart-failure',
    points: 1,
    category: 'criterion-fired',
    description: 'Congestive heart failure or left-ventricular dysfunction present',
    evaluate: (d) => d.cardiac.congestiveHeartFailure === 'yes'
  },

  // ─── H: HYPERTENSION (1) ──────────────────────────────────────
  {
    id: 'R-HYPERTENSION-01',
    criterion: 'hypertension',
    points: 1,
    category: 'criterion-fired',
    description: 'Hypertension: history of hypertension, on treatment, or BP > 140/90',
    evaluate: (d) => d.cardiac.hypertension === 'yes'
  },

  // ─── A2: AGE >= 75 (2) ────────────────────────────────────────
  {
    id: 'R-AGE-2POINT-01',
    criterion: 'age',
    points: 2,
    category: 'criterion-fired',
    description: 'Age 75 years or older',
    evaluate: (d) =>
      d.identification.ageYears !== null && d.identification.ageYears >= 75
  },

  // ─── A: AGE 65-74 (1) ─────────────────────────────────────────
  {
    id: 'R-AGE-1POINT-01',
    criterion: 'age',
    points: 1,
    category: 'criterion-fired',
    description: 'Age 65 to 74 years inclusive',
    evaluate: (d) =>
      d.identification.ageYears !== null &&
      d.identification.ageYears >= 65 &&
      d.identification.ageYears < 75
  },

  // ─── D: DIABETES MELLITUS (1) ─────────────────────────────────
  {
    id: 'R-DIABETES-01',
    criterion: 'diabetes',
    points: 1,
    category: 'criterion-fired',
    description: 'Diabetes mellitus: fasting glucose > 125 mg/dL (7 mmol/L) or on hypoglycaemic treatment',
    evaluate: (d) => d.metabolic.diabetes === 'yes'
  },

  // ─── S2: PRIOR STROKE / TIA / THROMBOEMBOLISM (2) ─────────────
  {
    id: 'R-STROKE-2POINT-01',
    criterion: 'stroke',
    points: 2,
    category: 'criterion-fired',
    description: 'Prior stroke, transient ischaemic attack, or systemic thromboembolism',
    evaluate: (d) => d.metabolic.priorStrokeTiaThromboembolism === 'yes'
  },

  // ─── V: VASCULAR DISEASE (1) ──────────────────────────────────
  {
    id: 'R-VASCULAR-DISEASE-01',
    criterion: 'vascular-disease',
    points: 1,
    category: 'criterion-fired',
    description: 'Vascular disease: prior myocardial infarction, peripheral artery disease, or aortic plaque',
    evaluate: (d) => d.cardiac.vascularDisease === 'yes'
  },

  // ─── Sc: SEX CATEGORY (FEMALE) (1) ────────────────────────────
  {
    id: 'R-SEX-FEMALE-01',
    criterion: 'sex',
    points: 1,
    category: 'criterion-fired',
    description: 'Female sex category (risk modifier, not an independent risk factor)',
    evaluate: (d) => d.identification.sex === 'female'
  }
];

export { cha2ds2VascRules };
