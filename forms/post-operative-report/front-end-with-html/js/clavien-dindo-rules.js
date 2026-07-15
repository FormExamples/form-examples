// Clavien-Dindo classification rules.
//
// The Clavien-Dindo system grades each surgical complication on the
// intervention required:
//
//   Grade 0:   No complication
//   Grade I:   Any deviation from normal course; no pharmacologic, surgical,
//              endoscopic, or radiologic intervention required.
//   Grade II:  Pharmacological treatment required (incl. blood transfusion, TPN).
//   Grade IIIa: Intervention required, without general anaesthesia.
//   Grade IIIb: Intervention required, with general anaesthesia.
//   Grade IVa:  Life-threatening, single-organ dysfunction.
//   Grade IVb:  Life-threatening, multi-organ dysfunction.
//   Grade V:    Death of the patient.
//
// Each rule below maps a single complication grade key to a description.
// They are exposed for the report's per-rule audit trail.

/**
 * @typedef {import('./types.js').ClavienDindoGradeKey} ClavienDindoGradeKey
 *
 * @typedef {Object} ClavienDindoRule
 * @property {ClavienDindoGradeKey} grade
 * @property {string} label
 * @property {string} shortLabel
 * @property {string} description
 * @property {number} order
 */

// Wrapped in an IIFE; published via window.PostOperativeReport.

/** @type {ClavienDindoRule[]} */
const clavienDindoRules = [
  {
    grade: 'grade-0',
    label: 'Grade 0',
    shortLabel: '0',
    description: 'No complication occurred during or after the procedure.',
    order: 0
  },
  {
    grade: 'grade-i',
    label: 'Grade I',
    shortLabel: 'I',
    description:
      'Any deviation from the normal post-operative course without pharmacological treatment or surgical, endoscopic, or radiological interventions. Allowed therapeutic regimens are antiemetics, antipyretics, analgesics, diuretics, electrolytes and physiotherapy. Wound infections opened at the bedside are also included.',
    order: 1
  },
  {
    grade: 'grade-ii',
    label: 'Grade II',
    shortLabel: 'II',
    description:
      'Requires pharmacological treatment with drugs other than those allowed for grade I. Blood transfusions and total parenteral nutrition are also included.',
    order: 2
  },
  {
    grade: 'grade-iiia',
    label: 'Grade IIIa',
    shortLabel: 'IIIa',
    description:
      'Requires surgical, endoscopic or radiological intervention not under general anaesthesia.',
    order: 3
  },
  {
    grade: 'grade-iiib',
    label: 'Grade IIIb',
    shortLabel: 'IIIb',
    description:
      'Requires surgical, endoscopic or radiological intervention under general anaesthesia.',
    order: 4
  },
  {
    grade: 'grade-iva',
    label: 'Grade IVa',
    shortLabel: 'IVa',
    description:
      'Life-threatening complication (incl. CNS complications) requiring intermediate care or intensive care unit management — single-organ dysfunction (incl. dialysis).',
    order: 5
  },
  {
    grade: 'grade-ivb',
    label: 'Grade IVb',
    shortLabel: 'IVb',
    description:
      'Life-threatening complication (incl. CNS complications) requiring intermediate care or intensive care unit management — multi-organ dysfunction.',
    order: 6
  },
  {
    grade: 'grade-v',
    label: 'Grade V',
    shortLabel: 'V',
    description: 'Death of the patient.',
    order: 7
  }
];

/** @type {Object<string, ClavienDindoRule>} */
const rulesByGrade = clavienDindoRules.reduce((acc, r) => {
  acc[r.grade] = r;
  return acc;
}, {});

export { clavienDindoRules, rulesByGrade as clavienDindoRuleByGrade };
