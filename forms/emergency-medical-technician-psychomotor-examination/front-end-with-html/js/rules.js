// NREMT EMT Psychomotor Skills Examination — declarative checklist rules.
//
// Each rule maps a single observed action to a tri-state value:
//   'yes' = performed correctly      (awards `points` on the rule)
//   'no'  = not performed / failed   (awards 0 points)
//   'na'  = not applicable           (excluded from the maxPoints denominator
//                                      and from grading)
//   ''    = examiner has not yet recorded an answer (excluded)
//
// Critical criteria (per NREMT Medical Patient station): any 'no' on a
// rule with `critical: true` forces an automatic overall Fail, regardless
// of how many points the candidate has accumulated.
//
// Steps with checklist scoring: 2 Scene Size-Up, 3 Primary Survey,
// 4 History & Secondary Assessment, 5 Reassessment. Step 6 (Critical
// Criteria Review) carries two additional critical-only checks.
// Step 1 (Candidate, Examiner & Scenario) is purely demographic and
// has no scored rules.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').TriState} TriState
 *
 * @typedef {Object} PsychomotorRule
 * @property {string} id
 * @property {number} step
 * @property {string} category
 * @property {string} label
 * @property {boolean} critical
 * @property {number} points
 * @property {(d: AssessmentData) => TriState} evaluate
 */

(function () {
'use strict';
window.EmergencyMedicalTechnicianPsychomotorExamination =
  window.EmergencyMedicalTechnicianPsychomotorExamination || {};

const NS = window.EmergencyMedicalTechnicianPsychomotorExamination;

/**
 * Helper: read a tri-state field, normalising missing/unknown values.
 * @param {AssessmentData} d
 * @param {string} section
 * @param {string} field
 * @returns {TriState}
 */
function read(d, section, field) {
  const v = d[section] && d[section][field];
  if (v === 'yes' || v === 'no' || v === 'na') return v;
  return '';
}

/** @type {PsychomotorRule[]} */
const psychomotorRules = [

  // --- Step 2: Scene Size-Up ---------------------------------------------
  {
    id: 'EMT-SS-PPE',
    step: 2,
    category: 'Scene Size-Up',
    label: 'Takes or verbalizes appropriate body-substance / PPE precautions.',
    critical: true,
    points: 1,
    evaluate: (d) => read(d, 'sceneSizeUp', 'ppePrecautions')
  },
  {
    id: 'EMT-SS-SAFE',
    step: 2,
    category: 'Scene Size-Up',
    label: 'Determines the scene / situation is safe before approaching the patient.',
    critical: true,
    points: 1,
    evaluate: (d) => read(d, 'sceneSizeUp', 'sceneSafe')
  },
  {
    id: 'EMT-SS-MOI-NOI',
    step: 2,
    category: 'Scene Size-Up',
    label: 'Determines the mechanism of injury / nature of illness (MOI/NOI).',
    critical: false,
    points: 1,
    evaluate: (d) => read(d, 'sceneSizeUp', 'mechanismOrNature')
  },
  {
    id: 'EMT-SS-PATIENTS',
    step: 2,
    category: 'Scene Size-Up',
    label: 'Determines the number of patients on scene.',
    critical: false,
    points: 1,
    evaluate: (d) => read(d, 'sceneSizeUp', 'numberOfPatients')
  },
  {
    id: 'EMT-SS-RESOURCES',
    step: 2,
    category: 'Scene Size-Up',
    label: 'Requests additional EMS / ALS / fire / law-enforcement resources as needed.',
    critical: false,
    points: 1,
    evaluate: (d) => read(d, 'sceneSizeUp', 'additionalResources')
  },
  {
    id: 'EMT-SS-CSPINE',
    step: 2,
    category: 'Scene Size-Up',
    label: 'Considers stabilization of the spine when indicated by MOI.',
    critical: false,
    points: 1,
    evaluate: (d) => read(d, 'sceneSizeUp', 'considersCspine')
  },

  // --- Step 3: Primary Survey --------------------------------------------
  {
    id: 'EMT-PS-IMPRESSION',
    step: 3,
    category: 'Primary Survey',
    label: 'Verbalizes a general impression of the patient.',
    critical: false,
    points: 1,
    evaluate: (d) => read(d, 'primarySurvey', 'generalImpression')
  },
  {
    id: 'EMT-PS-MENTAL',
    step: 3,
    category: 'Primary Survey',
    label: 'Determines responsiveness / level of consciousness (AVPU).',
    critical: false,
    points: 1,
    evaluate: (d) => read(d, 'primarySurvey', 'mentalStatus')
  },
  {
    id: 'EMT-PS-AIRWAY',
    step: 3,
    category: 'Primary Survey',
    label: 'Assesses airway and initiates appropriate airway management.',
    critical: true,
    points: 1,
    evaluate: (d) => read(d, 'primarySurvey', 'airway')
  },
  {
    id: 'EMT-PS-BREATHING',
    step: 3,
    category: 'Primary Survey',
    label: 'Assesses breathing and initiates appropriate ventilatory support.',
    critical: true,
    points: 1,
    evaluate: (d) => read(d, 'primarySurvey', 'breathing')
  },
  {
    id: 'EMT-PS-OXYGEN',
    step: 3,
    category: 'Primary Survey',
    label: 'Provides appropriate oxygen therapy when indicated.',
    critical: true,
    points: 1,
    evaluate: (d) => read(d, 'primarySurvey', 'oxygenTherapy')
  },
  {
    id: 'EMT-PS-CIRCULATION',
    step: 3,
    category: 'Primary Survey',
    label: 'Assesses circulation, controls major bleeding, and manages shock.',
    critical: true,
    points: 1,
    evaluate: (d) => read(d, 'primarySurvey', 'circulation')
  },
  {
    id: 'EMT-PS-TRANSPORT',
    step: 3,
    category: 'Primary Survey',
    label: 'Identifies patient priority and makes a transport urgency decision.',
    critical: true,
    points: 1,
    evaluate: (d) => read(d, 'primarySurvey', 'transportPriority')
  },

  // --- Step 4: History Taking & Secondary Assessment ---------------------
  {
    id: 'EMT-HX-CC',
    step: 4,
    category: 'History',
    label: 'Elicits the chief complaint clearly.',
    critical: false,
    points: 1,
    evaluate: (d) => read(d, 'historySecondaryAssessment', 'chiefComplaint')
  },
  {
    id: 'EMT-HX-OPQRST',
    step: 4,
    category: 'History',
    label: 'Obtains OPQRST history of the present illness.',
    critical: false,
    points: 2,
    evaluate: (d) => read(d, 'historySecondaryAssessment', 'historyOnsetOpqrst')
  },
  {
    id: 'EMT-HX-SAMPLE-S',
    step: 4,
    category: 'SAMPLE History',
    label: 'SAMPLE — Signs / Symptoms.',
    critical: false,
    points: 1,
    evaluate: (d) => read(d, 'historySecondaryAssessment', 'sampleSignsSymptoms')
  },
  {
    id: 'EMT-HX-SAMPLE-A',
    step: 4,
    category: 'SAMPLE History',
    label: 'SAMPLE — Allergies.',
    critical: false,
    points: 1,
    evaluate: (d) => read(d, 'historySecondaryAssessment', 'sampleAllergies')
  },
  {
    id: 'EMT-HX-SAMPLE-M',
    step: 4,
    category: 'SAMPLE History',
    label: 'SAMPLE — Medications.',
    critical: false,
    points: 1,
    evaluate: (d) => read(d, 'historySecondaryAssessment', 'sampleMedications')
  },
  {
    id: 'EMT-HX-SAMPLE-P',
    step: 4,
    category: 'SAMPLE History',
    label: 'SAMPLE — Past pertinent medical / surgical history.',
    critical: false,
    points: 1,
    evaluate: (d) => read(d, 'historySecondaryAssessment', 'samplePastHistory')
  },
  {
    id: 'EMT-HX-SAMPLE-L',
    step: 4,
    category: 'SAMPLE History',
    label: 'SAMPLE — Last oral intake.',
    critical: false,
    points: 1,
    evaluate: (d) => read(d, 'historySecondaryAssessment', 'sampleLastIntake')
  },
  {
    id: 'EMT-HX-SAMPLE-E',
    step: 4,
    category: 'SAMPLE History',
    label: 'SAMPLE — Events leading up to the illness.',
    critical: false,
    points: 1,
    evaluate: (d) => read(d, 'historySecondaryAssessment', 'sampleEvents')
  },
  {
    id: 'EMT-SA-FOCUSED',
    step: 4,
    category: 'Secondary Assessment',
    label: 'Performs a focused / detailed physical exam appropriate to the chief complaint.',
    critical: false,
    points: 2,
    evaluate: (d) => read(d, 'historySecondaryAssessment', 'focusedExam')
  },
  {
    id: 'EMT-SA-VITALS-BP',
    step: 4,
    category: 'Baseline Vitals',
    label: 'Obtains baseline blood pressure.',
    critical: false,
    points: 1,
    evaluate: (d) => read(d, 'historySecondaryAssessment', 'baselineVitalsBp')
  },
  {
    id: 'EMT-SA-VITALS-PULSE',
    step: 4,
    category: 'Baseline Vitals',
    label: 'Obtains baseline pulse rate and quality.',
    critical: false,
    points: 1,
    evaluate: (d) => read(d, 'historySecondaryAssessment', 'baselineVitalsPulse')
  },
  {
    id: 'EMT-SA-VITALS-RESP',
    step: 4,
    category: 'Baseline Vitals',
    label: 'Obtains baseline respiratory rate and quality.',
    critical: false,
    points: 1,
    evaluate: (d) => read(d, 'historySecondaryAssessment', 'baselineVitalsRespirations')
  },
  {
    id: 'EMT-SA-FIELD-IMPRESSION',
    step: 4,
    category: 'Secondary Assessment',
    label: 'States a field impression / working diagnosis.',
    critical: false,
    points: 1,
    evaluate: (d) => read(d, 'historySecondaryAssessment', 'fieldImpression')
  },
  {
    id: 'EMT-SA-INTERVENTIONS',
    step: 4,
    category: 'Secondary Assessment',
    label: 'Initiates appropriate interventions and verbalizes care plan.',
    critical: false,
    points: 1,
    evaluate: (d) => read(d, 'historySecondaryAssessment', 'interventions')
  },

  // --- Step 5: Reassessment ----------------------------------------------
  {
    id: 'EMT-RA-MENTAL',
    step: 5,
    category: 'Reassessment',
    label: 'Repeats mental-status assessment.',
    critical: false,
    points: 1,
    evaluate: (d) => read(d, 'reassessment', 'repeatsMentalStatus')
  },
  {
    id: 'EMT-RA-AIRWAY',
    step: 5,
    category: 'Reassessment',
    label: 'Repeats airway assessment.',
    critical: false,
    points: 1,
    evaluate: (d) => read(d, 'reassessment', 'repeatsAirway')
  },
  {
    id: 'EMT-RA-BREATHING',
    step: 5,
    category: 'Reassessment',
    label: 'Repeats breathing assessment.',
    critical: false,
    points: 1,
    evaluate: (d) => read(d, 'reassessment', 'repeatsBreathing')
  },
  {
    id: 'EMT-RA-CIRCULATION',
    step: 5,
    category: 'Reassessment',
    label: 'Repeats circulation assessment.',
    critical: false,
    points: 1,
    evaluate: (d) => read(d, 'reassessment', 'repeatsCirculation')
  },
  {
    id: 'EMT-RA-VITALS',
    step: 5,
    category: 'Reassessment',
    label: 'Repeats and records vital signs.',
    critical: false,
    points: 1,
    evaluate: (d) => read(d, 'reassessment', 'repeatsVitals')
  },
  {
    id: 'EMT-RA-FOCUSED',
    step: 5,
    category: 'Reassessment',
    label: 'Repeats focused assessment regarding patient complaint or injuries.',
    critical: false,
    points: 1,
    evaluate: (d) => read(d, 'reassessment', 'repeatsFocusedExam')
  },
  {
    id: 'EMT-RA-EVAL-INT',
    step: 5,
    category: 'Reassessment',
    label: 'Evaluates effectiveness of interventions and adjusts as needed.',
    critical: false,
    points: 1,
    evaluate: (d) => read(d, 'reassessment', 'evaluatesInterventions')
  },
  {
    id: 'EMT-RA-TRANSPORT-INT',
    step: 5,
    category: 'Reassessment',
    label: 'Manages and reassesses transport interventions en route.',
    critical: false,
    points: 1,
    evaluate: (d) => read(d, 'reassessment', 'transportInterventions')
  },
  {
    id: 'EMT-RA-FIFTEEN-MIN',
    step: 5,
    category: 'Reassessment',
    label: 'Provides patient hand-off / radio report within 15 minutes of arrival on scene.',
    critical: true,
    points: 1,
    evaluate: (d) => read(d, 'reassessment', 'fifteenMinuteCall')
  },

  // --- Step 6: Critical Criteria Review (critical-only checks) -----------
  // These two are tracked as scored rules so they can be 'yes' (no critical
  // failure) or 'no' (critical failure). They are critical=true; the
  // grader will Fail the exam on any 'no'. They contribute one point each
  // to the maxPoints denominator when answered.
  {
    id: 'EMT-CC-DANGEROUS',
    step: 6,
    category: 'Critical Criteria',
    label: 'Did NOT perform any dangerous or harmful intervention.',
    critical: true,
    points: 1,
    evaluate: (d) => read(d, 'criticalCriteriaReview', 'dangerousIntervention')
  },
  {
    id: 'EMT-CC-SPINAL',
    step: 6,
    category: 'Critical Criteria',
    label: 'Provided spinal protection when indicated by MOI.',
    critical: true,
    points: 1,
    evaluate: (d) => read(d, 'criticalCriteriaReview', 'spinalProtection')
  }
];

NS.psychomotorRules = psychomotorRules;
})();
