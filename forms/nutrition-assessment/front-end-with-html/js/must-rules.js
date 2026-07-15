// Malnutrition Universal Screening Tool (MUST) scoring rules.
//
// MUST is a 3-step screening tool for adults that produces an overall risk
// score (sum of three sub-scores, range 0-6):
//
//   MUST-001: BMI score (0-2)
//     >20      -> 0
//     18.5-20  -> 1
//     <18.5    -> 2
//
//   MUST-002: Unplanned weight loss in past 3-6 months (0-2)
//     <5%      -> 0
//     5-10%    -> 1
//     >10%     -> 2
//
//   MUST-003: Acute disease effect (0 or 2)
//     None                                                  -> 0
//     Acutely ill with no nutritional intake for >5 days    -> 2
//
// Total score interpretation:
//   0  -> low risk
//   1  -> medium risk
//   >=2 -> high risk

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} MUSTRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {(d: AssessmentData) => number} evaluate
 */

/** @type {MUSTRule[]} */
const mustRules = [
  {
    id: 'MUST-001',
    category: 'BMI Score',
    description: 'Body Mass Index (BMI) category.',
    evaluate: (d) => {
      switch (d.nutritionalScreening.bmiCategory) {
        case '>=20': return 0;
        case '18.5-20': return 1;
        case '<18.5': return 2;
        default: return -1; // -1 = unanswered
      }
    }
  },
  {
    id: 'MUST-002',
    category: 'Weight Loss Score',
    description: 'Unplanned weight loss in the past 3-6 months.',
    evaluate: (d) => {
      switch (d.nutritionalScreening.weightLossCategory) {
        case '<5': return 0;
        case '5-10': return 1;
        case '>10': return 2;
        default: return -1;
      }
    }
  },
  {
    id: 'MUST-003',
    category: 'Acute Disease Effect Score',
    description:
      'Acutely ill and there has been or is likely to be no nutritional intake for >5 days.',
    evaluate: (d) => {
      switch (d.nutritionalScreening.acuteDisease) {
        case 'none': return 0;
        case 'acutely-ill-no-intake-5d': return 2;
        default: return -1;
      }
    }
  }
];

export { mustRules };
