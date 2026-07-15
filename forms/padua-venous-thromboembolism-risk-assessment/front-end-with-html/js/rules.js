// Declarative Padua Prediction Score grading rules.
//
// The Padua instrument has eleven weighted risk factors. Each rule below
// evaluates the patient data and returns true when its factor is present; the
// grader (`grader.js`) sums the weighted points into the total Padua score
// (0-20) and derives the risk band (>= 4 -> high). Rows here mirror the
// `padua_venous_thromboembolism_risk_assessment_grade_rule` SQL table
// (rule_id, factor, points, category, description).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} PaduaRule
 * @property {string} id
 * @property {string} factor      - camelCase factor key, e.g. activeCancer
 * @property {number} points      - weighted points contributed when the rule fires
 * @property {string} category
 * @property {string} description
 * @property {(d: AssessmentData) => boolean} evaluate
 */

// Wrapped in an IIFE; published via window.PaduaVenousThromboembolismRiskAssessment.

/** @type {PaduaRule[]} */
const paduaRules = [
  // ─── FACTOR 1: ACTIVE CANCER (3) ──────────────────────────────
  {
    id: 'R-ACTIVE-CANCER-01',
    factor: 'activeCancer',
    points: 3,
    category: 'padua-factor',
    description: 'Active cancer — metastatic and/or chemo/radiotherapy in the previous 6 months',
    evaluate: (d) => d.history.activeCancer === 'yes'
  },

  // ─── FACTOR 2: PREVIOUS VTE (3) ───────────────────────────────
  {
    id: 'R-PREVIOUS-VTE-01',
    factor: 'previousVte',
    points: 3,
    category: 'padua-factor',
    description: 'Previous VTE — history of deep-vein thrombosis or pulmonary embolism (excluding superficial vein thrombosis)',
    evaluate: (d) => d.history.previousVte === 'yes'
  },

  // ─── FACTOR 3: REDUCED MOBILITY (3) ───────────────────────────
  {
    id: 'R-REDUCED-MOBILITY-01',
    factor: 'reducedMobility',
    points: 3,
    category: 'padua-factor',
    description: 'Reduced mobility — bed rest with bathroom privileges for at least 3 days',
    evaluate: (d) => d.mobility.reducedMobility === 'yes'
  },

  // ─── FACTOR 4: KNOWN THROMBOPHILIA (3) ────────────────────────
  {
    id: 'R-KNOWN-THROMBOPHILIA-01',
    factor: 'knownThrombophilia',
    points: 3,
    category: 'padua-factor',
    description: 'Known thrombophilia — e.g. antithrombin, protein C or S defect, factor V Leiden, prothrombin G20210A, antiphospholipid syndrome',
    evaluate: (d) => d.history.knownThrombophilia === 'yes'
  },

  // ─── FACTOR 5: RECENT TRAUMA OR SURGERY (2) ───────────────────
  {
    id: 'R-RECENT-TRAUMA-OR-SURGERY-01',
    factor: 'recentTraumaOrSurgery',
    points: 2,
    category: 'padua-factor',
    description: 'Recent (<= 1 month) trauma and/or surgery',
    evaluate: (d) => d.mobility.recentTraumaOrSurgery === 'yes'
  },

  // ─── FACTOR 6: ELDERLY AGE >= 70 (1) ──────────────────────────
  {
    id: 'R-ELDERLY-AGE-01',
    factor: 'elderlyAge',
    points: 1,
    category: 'padua-factor',
    description: 'Elderly age — 70 years or over',
    evaluate: (d) =>
      d.identification.ageYears !== null &&
      d.identification.ageYears >= 70
  },

  // ─── FACTOR 7: HEART/RESPIRATORY FAILURE (1) ──────────────────
  {
    id: 'R-HEART-OR-RESPIRATORY-FAILURE-01',
    factor: 'heartOrRespiratoryFailure',
    points: 1,
    category: 'padua-factor',
    description: 'Acute heart failure and/or respiratory failure',
    evaluate: (d) => d.cardiorespiratory.heartOrRespiratoryFailure === 'yes'
  },

  // ─── FACTOR 8: ACUTE MI OR ISCHAEMIC STROKE (1) ───────────────
  {
    id: 'R-ACUTE-MI-OR-ISCHAEMIC-STROKE-01',
    factor: 'acuteMiOrIschaemicStroke',
    points: 1,
    category: 'padua-factor',
    description: 'Acute myocardial infarction or ischaemic stroke',
    evaluate: (d) => d.cardiorespiratory.acuteMiOrIschaemicStroke === 'yes'
  },

  // ─── FACTOR 9: ACUTE INFECTION OR RHEUMATOLOGICAL (1) ─────────
  {
    id: 'R-ACUTE-INFECTION-OR-RHEUMATOLOGICAL-01',
    factor: 'acuteInfectionOrRheumatological',
    points: 1,
    category: 'padua-factor',
    description: 'Acute infection and/or rheumatological disorder',
    evaluate: (d) => d.cardiorespiratory.acuteInfectionOrRheumatological === 'yes'
  },

  // ─── FACTOR 10: OBESITY BMI >= 30 (1) ─────────────────────────
  {
    id: 'R-OBESITY-01',
    factor: 'obesity',
    points: 1,
    category: 'padua-factor',
    description: 'Obesity — body mass index 30 kg/m^2 or over',
    evaluate: (d) =>
      d.metabolic.bodyMassIndex !== null &&
      d.metabolic.bodyMassIndex >= 30
  },

  // ─── FACTOR 11: ONGOING HORMONAL TREATMENT (1) ────────────────
  {
    id: 'R-ONGOING-HORMONAL-TREATMENT-01',
    factor: 'ongoingHormonalTreatment',
    points: 1,
    category: 'padua-factor',
    description: 'Ongoing hormonal treatment',
    evaluate: (d) => d.metabolic.ongoingHormonalTreatment === 'yes'
  }
];

export { paduaRules };
