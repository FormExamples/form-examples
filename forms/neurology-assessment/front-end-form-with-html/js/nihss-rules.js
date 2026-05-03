// NIHSS (National Institutes of Health Stroke Scale) scoring rules.
//
// 15 items scored across neurological domains. Each rule reads a single
// numeric value from `data.nihssAssessment` and returns it (defaulting to
// 0 when the item has not been answered). Total score range: 0-42.
//
// NIHSS-1A:  Level of consciousness          (0-3)
// NIHSS-1B:  LOC questions                   (0-2)
// NIHSS-1C:  LOC commands                    (0-2)
// NIHSS-2:   Best gaze                        (0-2)
// NIHSS-3:   Visual fields                    (0-3)
// NIHSS-4:   Facial palsy                     (0-3)
// NIHSS-5A:  Motor arm — left                 (0-4)
// NIHSS-5B:  Motor arm — right                (0-4)
// NIHSS-6A:  Motor leg — left                 (0-4)
// NIHSS-6B:  Motor leg — right                (0-4)
// NIHSS-7:   Limb ataxia                      (0-2)
// NIHSS-8:   Sensory                          (0-2)
// NIHSS-9:   Best language                    (0-3)
// NIHSS-10:  Dysarthria                       (0-2)
// NIHSS-11:  Extinction and inattention       (0-2)

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} NIHSSRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {string} field
 * @property {(d: AssessmentData) => number} evaluate
 */

// Wrapped in an IIFE; published via window.NeurologyAssessment.
(function () {
'use strict';
window.NeurologyAssessment = window.NeurologyAssessment || {};

/** @type {NIHSSRule[]} */
const nihssRules = [
  {
    id: 'NIHSS-1A',
    category: 'Consciousness',
    description: 'Level of consciousness',
    field: 'consciousness',
    evaluate: (d) => d.nihssAssessment.consciousness ?? 0
  },
  {
    id: 'NIHSS-1B',
    category: 'Consciousness',
    description: 'LOC questions (month, age)',
    field: 'consciousnessQuestions',
    evaluate: (d) => d.nihssAssessment.consciousnessQuestions ?? 0
  },
  {
    id: 'NIHSS-1C',
    category: 'Consciousness',
    description: 'LOC commands (open/close eyes, grip/release)',
    field: 'consciousnessCommands',
    evaluate: (d) => d.nihssAssessment.consciousnessCommands ?? 0
  },
  {
    id: 'NIHSS-2',
    category: 'Cranial Nerves',
    description: 'Best gaze (horizontal eye movement)',
    field: 'gaze',
    evaluate: (d) => d.nihssAssessment.gaze ?? 0
  },
  {
    id: 'NIHSS-3',
    category: 'Cranial Nerves',
    description: 'Visual fields',
    field: 'visual',
    evaluate: (d) => d.nihssAssessment.visual ?? 0
  },
  {
    id: 'NIHSS-4',
    category: 'Cranial Nerves',
    description: 'Facial palsy',
    field: 'facialPalsy',
    evaluate: (d) => d.nihssAssessment.facialPalsy ?? 0
  },
  {
    id: 'NIHSS-5A',
    category: 'Motor',
    description: 'Motor arm - left',
    field: 'motorLeftArm',
    evaluate: (d) => d.nihssAssessment.motorLeftArm ?? 0
  },
  {
    id: 'NIHSS-5B',
    category: 'Motor',
    description: 'Motor arm - right',
    field: 'motorRightArm',
    evaluate: (d) => d.nihssAssessment.motorRightArm ?? 0
  },
  {
    id: 'NIHSS-6A',
    category: 'Motor',
    description: 'Motor leg - left',
    field: 'motorLeftLeg',
    evaluate: (d) => d.nihssAssessment.motorLeftLeg ?? 0
  },
  {
    id: 'NIHSS-6B',
    category: 'Motor',
    description: 'Motor leg - right',
    field: 'motorRightLeg',
    evaluate: (d) => d.nihssAssessment.motorRightLeg ?? 0
  },
  {
    id: 'NIHSS-7',
    category: 'Coordination',
    description: 'Limb ataxia',
    field: 'limbAtaxia',
    evaluate: (d) => d.nihssAssessment.limbAtaxia ?? 0
  },
  {
    id: 'NIHSS-8',
    category: 'Sensory',
    description: 'Sensory',
    field: 'sensory',
    evaluate: (d) => d.nihssAssessment.sensory ?? 0
  },
  {
    id: 'NIHSS-9',
    category: 'Language',
    description: 'Best language (aphasia)',
    field: 'language',
    evaluate: (d) => d.nihssAssessment.language ?? 0
  },
  {
    id: 'NIHSS-10',
    category: 'Language',
    description: 'Dysarthria',
    field: 'dysarthria',
    evaluate: (d) => d.nihssAssessment.dysarthria ?? 0
  },
  {
    id: 'NIHSS-11',
    category: 'Neglect',
    description: 'Extinction and inattention',
    field: 'extinctionInattention',
    evaluate: (d) => d.nihssAssessment.extinctionInattention ?? 0
  }
];

window.NeurologyAssessment.nihssRules = nihssRules;
})();
