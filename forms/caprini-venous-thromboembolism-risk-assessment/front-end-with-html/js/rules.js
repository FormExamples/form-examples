// Declarative Caprini grading rules.
//
// The Caprini Risk Assessment Model scores a checklist of individual risk
// factors, each worth a fixed weight of 1, 2, 3, or 5 points. Every factor below
// is a yes/no item that fires (contributes its weight) when answered 'yes'. Age
// contributes through a separate age band handled in `grader.js`. Each rule
// mirrors one row of the
// `caprini_venous_thromboembolism_risk_assessment_grade_rule` SQL table
// (rule_id, factor, weight_group, points, category, description).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} CapriniRule
 * @property {string} id           - stable rule id, e.g. R-HISTORY-OF-VTE-3POINT-01
 * @property {string} section      - state section holding the field
 * @property {string} field        - camelCase field name within the section
 * @property {string} factor       - snake_case factor key (mirrors the SQL column)
 * @property {string} weightGroup  - 1-point | 2-point | 3-point | 5-point
 * @property {number} points       - points contributed when the rule fires
 * @property {string} category     - subject category (surgical, thrombophilia, ...)
 * @property {string} description  - human-readable description of the factor
 * @property {(d: AssessmentData) => boolean} evaluate
 */

// Wrapped in an IIFE; published via window.CapriniVenousThromboembolismRiskAssessment.
(function () {
'use strict';
window.CapriniVenousThromboembolismRiskAssessment =
  window.CapriniVenousThromboembolismRiskAssessment || {};

// Compact factor definitions: [section, field, points, category, description].
// The snake_case `factor` key and the stable `id` are derived below.
const factorDefs = [
  // ─── 1-POINT FACTORS ──────────────────────────────────────────
  ['onePoint', 'minorSurgery', 1, 'surgical', 'Minor surgery planned (< 45 minutes)'],
  ['onePoint', 'recentMajorSurgery', 1, 'surgical', 'Major surgery within the past month'],
  ['onePoint', 'varicoseVeins', 1, 'vascular', 'Varicose veins'],
  ['onePoint', 'inflammatoryBowelDisease', 1, 'medical', 'History of inflammatory bowel disease'],
  ['onePoint', 'swollenLegs', 1, 'vascular', 'Swollen legs (current oedema)'],
  ['onePoint', 'obesity', 1, 'medical', 'Obesity (BMI >= 25)'],
  ['onePoint', 'acuteMyocardialInfarction', 1, 'cardiac', 'Acute myocardial infarction'],
  ['onePoint', 'congestiveHeartFailure', 1, 'cardiac', 'Congestive heart failure within the past month'],
  ['onePoint', 'sepsis', 1, 'medical', 'Sepsis within the past month'],
  ['onePoint', 'seriousLungDisease', 1, 'respiratory', 'Serious lung disease including pneumonia within the past month'],
  ['onePoint', 'abnormalPulmonaryFunction', 1, 'respiratory', 'Abnormal pulmonary function (e.g. COPD)'],
  ['onePoint', 'medicalPatientBedRest', 1, 'mobility', 'Medical patient currently on bed rest'],
  ['onePoint', 'oralContraceptiveOrHrt', 1, 'hormonal', 'Oral contraceptive or hormone replacement therapy'],
  ['onePoint', 'pregnancyOrPostpartum', 1, 'hormonal', 'Pregnancy or postpartum within the past month'],
  ['onePoint', 'adversePregnancyHistory', 1, 'hormonal', 'History of recurrent pregnancy loss or adverse pregnancy outcome'],

  // ─── 2-POINT FACTORS ──────────────────────────────────────────
  ['twoPoint', 'arthroscopicSurgery', 2, 'surgical', 'Arthroscopic surgery'],
  ['twoPoint', 'majorOpenSurgery', 2, 'surgical', 'Major open surgery (> 45 minutes)'],
  ['twoPoint', 'laparoscopicSurgery', 2, 'surgical', 'Laparoscopic surgery (> 45 minutes)'],
  ['twoPoint', 'malignancy', 2, 'oncology', 'Malignancy (present or previous)'],
  ['twoPoint', 'confinedToBed', 2, 'mobility', 'Confined to bed (> 72 hours)'],
  ['twoPoint', 'immobilisingCast', 2, 'mobility', 'Immobilising plaster cast'],
  ['twoPoint', 'centralVenousAccess', 2, 'vascular', 'Central venous access (central line)'],

  // ─── 3-POINT FACTORS ──────────────────────────────────────────
  ['threePoint', 'historyOfVte', 3, 'thrombotic-history', 'Personal history of venous thromboembolism (DVT or PE)'],
  ['threePoint', 'familyHistoryOfThrombosis', 3, 'thrombophilia', 'Family history of thrombosis'],
  ['threePoint', 'factorVLeiden', 3, 'thrombophilia', 'Factor V Leiden mutation'],
  ['threePoint', 'prothrombin20210a', 3, 'thrombophilia', 'Prothrombin 20210A mutation'],
  ['threePoint', 'lupusAnticoagulant', 3, 'thrombophilia', 'Lupus anticoagulant positive'],
  ['threePoint', 'anticardiolipinAntibodies', 3, 'thrombophilia', 'Elevated anticardiolipin antibodies'],
  ['threePoint', 'elevatedHomocysteine', 3, 'thrombophilia', 'Elevated serum homocysteine'],
  ['threePoint', 'heparinInducedThrombocytopenia', 3, 'thrombophilia', 'Heparin-induced thrombocytopenia (HIT)'],
  ['threePoint', 'otherThrombophilia', 3, 'thrombophilia', 'Other congenital or acquired thrombophilia'],

  // ─── 5-POINT FACTORS ──────────────────────────────────────────
  ['fivePoint', 'stroke', 5, 'neurological', 'Stroke within the past month'],
  ['fivePoint', 'electiveArthroplasty', 5, 'surgical', 'Elective arthroplasty (hip or knee replacement)'],
  ['fivePoint', 'hipPelvisLegFracture', 5, 'trauma', 'Hip, pelvis, or leg fracture'],
  ['fivePoint', 'acuteSpinalCordInjury', 5, 'neurological', 'Acute spinal cord injury with paralysis within the past month'],
  ['fivePoint', 'multipleTrauma', 5, 'trauma', 'Multiple trauma within the past month']
];

/** camelCase field name -> snake_case factor key. */
function toSnake(field) {
  return field
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    .replace(/([a-zA-Z])([0-9])/g, '$1_$2')
    .toLowerCase();
}

/** @type {CapriniRule[]} */
const capriniRules = factorDefs.map(([section, field, points, category, description]) => {
  const factor = toSnake(field);
  const weightGroup = `${points}-point`;
  const id = `R-${factor.replace(/_/g, '-').toUpperCase()}-${points}POINT-01`;
  return {
    id,
    section,
    field,
    factor,
    weightGroup,
    points,
    category,
    description,
    evaluate: (d) => d[section] && d[section][field] === 'yes'
  };
});

window.CapriniVenousThromboembolismRiskAssessment.capriniRules = capriniRules;
})();
