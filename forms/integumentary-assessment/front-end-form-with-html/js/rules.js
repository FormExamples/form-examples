// Braden Scale subscale rules.
//
// The Braden Scale for Predicting Pressure Sore Risk (Bergstrom et al. 1987)
// is composed of six subscales. Five are scored 1-4 and one
// (Friction & Shear) is scored 1-3, giving a possible total of 6-23 (lower
// scores indicate higher risk).
//
//   BRADEN-001  Sensory Perception   1-4
//   BRADEN-002  Moisture             1-4
//   BRADEN-003  Activity             1-4
//   BRADEN-004  Mobility             1-4
//   BRADEN-005  Nutrition            1-4
//   BRADEN-006  Friction and Shear   1-3
//
// Unanswered subscales return 0 from `evaluate()` and are excluded from
// the answered-count by the grader.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} BradenRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {number} maxScore
 * @property {(d: AssessmentData) => number} evaluate
 */

// Wrapped in an IIFE; published via window.IntegumentaryAssessment.
(function () {
'use strict';
window.IntegumentaryAssessment = window.IntegumentaryAssessment || {};

function nullableInt(v) {
  if (v === null || v === undefined || v === '') return 0;
  const n = Number(v);
  if (Number.isNaN(n)) return 0;
  return n;
}

/** @type {BradenRule[]} */
const bradenRules = [
  {
    id: 'BRADEN-001',
    category: 'Sensory Perception',
    description:
      'Ability to respond meaningfully to pressure-related discomfort.',
    maxScore: 4,
    evaluate: (d) => nullableInt(d.bradenScale.sensoryPerception)
  },
  {
    id: 'BRADEN-002',
    category: 'Moisture',
    description: 'Degree to which skin is exposed to moisture.',
    maxScore: 4,
    evaluate: (d) => nullableInt(d.bradenScale.moisture)
  },
  {
    id: 'BRADEN-003',
    category: 'Activity',
    description: 'Degree of physical activity.',
    maxScore: 4,
    evaluate: (d) => nullableInt(d.bradenScale.activity)
  },
  {
    id: 'BRADEN-004',
    category: 'Mobility',
    description: 'Ability to change and control body position.',
    maxScore: 4,
    evaluate: (d) => nullableInt(d.bradenScale.mobility)
  },
  {
    id: 'BRADEN-005',
    category: 'Nutrition',
    description: 'Usual food intake pattern.',
    maxScore: 4,
    evaluate: (d) => nullableInt(d.bradenScale.nutrition)
  },
  {
    id: 'BRADEN-006',
    category: 'Friction and Shear',
    description: 'Friction & shear during repositioning and transfers.',
    maxScore: 3,
    evaluate: (d) => nullableInt(d.bradenScale.frictionShear)
  }
];

window.IntegumentaryAssessment.bradenRules = bradenRules;
})();
