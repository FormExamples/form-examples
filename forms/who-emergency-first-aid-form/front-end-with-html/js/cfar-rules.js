import { hasAnyAirwayIntervention, hasAnyBreathingIntervention, hasAnyCirculationIntervention, hasAnyDisabilityIntervention, hasAnyExposureIntervention, hasAnyMajorBleedingIntervention, hasText, isAssessmentAnswered, medicationTakenAnswered } from './types.js';

// WHO Emergency First Aid Form — completeness rules for Community First
// Aid Responders (CFAR). Each rule maps to one required field. Conditional
// follow-ups (tourniquet time, "Other" precaution details) are gated by
// `applies()` so the validator only counts the rule when the conditional
// branch is active. Rule IDs follow the pattern <SECTION>-<NN> so the
// report can group fired rules by section.
//
// Ported 1:1 from
// `front-end-form-with-svelte/src/lib/engine/cfar-rules.ts`.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} ValidationRule
 * @property {string} id
 * @property {string} section
 * @property {string} description
 * @property {(d: AssessmentData) => boolean} applies
 * @property {(d: AssessmentData) => boolean} isSatisfied
 */

/** @type {ValidationRule[]} */
const cfarRules = [
  // ─── Step 1 — Patient Identification ─────────────────
  {
    id: 'PI-01',
    section: 'patientIdentification',
    description: 'Patient name (LAST, First) is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.patientIdentification.patientName)
  },
  {
    id: 'PI-02',
    section: 'patientIdentification',
    description: 'Patient sex (Male / Female / Unknown) is required.',
    applies: () => true,
    isSatisfied: (d) =>
      d.patientIdentification.sex === 'male' ||
      d.patientIdentification.sex === 'female' ||
      d.patientIdentification.sex === 'unknown'
  },

  // ─── Step 2 — Referral & Transport ───────────────────
  {
    id: 'RT-01',
    section: 'referralTransport',
    description: 'Referral facility name is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.referralTransport.referralFacility.name)
  },
  {
    id: 'RT-02',
    section: 'referralTransport',
    description: 'Date and time of event is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.referralTransport.eventDateTime)
  },
  {
    id: 'RT-03',
    section: 'referralTransport',
    description: 'Date and time of departure from scene is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.referralTransport.departureDateTime)
  },

  // ─── Step 3 — Situation ──────────────────────────────
  {
    id: 'ST-01',
    section: 'situation',
    description: 'Problem type (Medical and/or Trauma) must be selected.',
    applies: () => true,
    isSatisfied: (d) => d.situation.medical || d.situation.trauma
  },
  {
    id: 'ST-02',
    section: 'situation',
    description: 'Pregnancy status (Yes / No / Unknown) is required.',
    applies: () => true,
    isSatisfied: (d) =>
      d.situation.pregnant === 'yes' ||
      d.situation.pregnant === 'no' ||
      d.situation.pregnant === 'unknown'
  },
  {
    id: 'ST-03',
    section: 'situation',
    description: 'A description of what happened to the patient is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.situation.whatHappened)
  },

  // ─── Step 4 — Background ─────────────────────────────
  {
    id: 'BG-01',
    section: 'background',
    description:
      'Past medical and surgical history is required (write "None" if there is no relevant history).',
    applies: () => true,
    isSatisfied: (d) => hasText(d.background.pastMedicalAndSurgicalHistory)
  },
  {
    id: 'BG-02',
    section: 'background',
    description:
      'Current medications or allergies are required (write "None" if there are none).',
    applies: () => true,
    isSatisfied: (d) => hasText(d.background.currentMedicationsOrAllergies)
  },

  // ─── Step 5 — Major Bleeding (C) ─────────────────────
  {
    id: 'MB-01',
    section: 'majorBleeding',
    description: 'Major bleeding assessment: tick "Normal" or describe findings.',
    applies: () => true,
    isSatisfied: (d) => isAssessmentAnswered(d.majorBleeding)
  },
  {
    id: 'MB-02',
    section: 'majorBleeding',
    description: 'Major bleeding intervention: tick at least one intervention or "None".',
    applies: () => true,
    isSatisfied: (d) => hasAnyMajorBleedingIntervention(d.majorBleeding)
  },
  {
    id: 'MB-03',
    section: 'majorBleeding',
    description: 'Tourniquet application time is required when a tourniquet was applied.',
    applies: (d) => d.majorBleeding.interventions.tourniquet,
    isSatisfied: (d) => hasText(d.majorBleeding.interventions.tourniquetApplicationTime)
  },

  // ─── Step 6 — Airway (A) ─────────────────────────────
  {
    id: 'AW-01',
    section: 'airway',
    description: 'Airway assessment: tick "Normal" or describe findings.',
    applies: () => true,
    isSatisfied: (d) => isAssessmentAnswered(d.airway)
  },
  {
    id: 'AW-02',
    section: 'airway',
    description: 'Airway intervention: tick at least one intervention or "None".',
    applies: () => true,
    isSatisfied: (d) => hasAnyAirwayIntervention(d.airway)
  },

  // ─── Step 7 — Breathing (B) ──────────────────────────
  {
    id: 'BR-01',
    section: 'breathing',
    description: 'Breathing assessment: tick "Normal" or describe findings.',
    applies: () => true,
    isSatisfied: (d) => isAssessmentAnswered(d.breathing)
  },
  {
    id: 'BR-02',
    section: 'breathing',
    description: 'Breathing intervention: tick at least one intervention or "None".',
    applies: () => true,
    isSatisfied: (d) => hasAnyBreathingIntervention(d.breathing)
  },

  // ─── Step 8 — Circulation (C) ────────────────────────
  {
    id: 'CR-01',
    section: 'circulation',
    description: 'Circulation assessment: tick "Normal" or describe findings.',
    applies: () => true,
    isSatisfied: (d) => isAssessmentAnswered(d.circulation)
  },
  {
    id: 'CR-02',
    section: 'circulation',
    description: 'Circulation intervention: tick at least one intervention or "None".',
    applies: () => true,
    isSatisfied: (d) => hasAnyCirculationIntervention(d.circulation)
  },

  // ─── Step 9 — Disability (D) ─────────────────────────
  {
    id: 'DS-01',
    section: 'disability',
    description: 'Disability assessment: tick "Normal" or describe findings.',
    applies: () => true,
    isSatisfied: (d) => isAssessmentAnswered(d.disability)
  },
  {
    id: 'DS-02',
    section: 'disability',
    description: 'Disability intervention: tick at least one intervention or "None".',
    applies: () => true,
    isSatisfied: (d) => hasAnyDisabilityIntervention(d.disability)
  },

  // ─── Step 10 — Exposure / Other (E) ──────────────────
  {
    id: 'EX-01',
    section: 'exposure',
    description: 'Exposure assessment: tick "Normal" or describe findings.',
    applies: () => true,
    isSatisfied: (d) => isAssessmentAnswered(d.exposure)
  },
  {
    id: 'EX-02',
    section: 'exposure',
    description: 'Exposure intervention: tick at least one intervention or "None".',
    applies: () => true,
    isSatisfied: (d) => hasAnyExposureIntervention(d.exposure)
  },
  {
    id: 'EX-03',
    section: 'exposure',
    description:
      'Any medication taken: tick "None" or describe medications taken.',
    applies: () => true,
    isSatisfied: (d) => medicationTakenAnswered(d)
  },

  // ─── Step 11 — Recommendations ───────────────────────
  {
    id: 'RC-01',
    section: 'recommendations',
    description: 'Next steps in the transport plan are required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.recommendations.transportPlan)
  },
  {
    id: 'RC-02',
    section: 'recommendations',
    description: 'Details of "Other" precaution are required when "Other" is ticked.',
    applies: (d) => d.recommendations.precautions.other,
    isSatisfied: (d) => hasText(d.recommendations.precautions.otherDetails)
  },

  // ─── Step 12 — Responder Details (CFAR) ──────────────
  {
    id: 'RD-01',
    section: 'responderDetails',
    description: 'CFAR responder name is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.responderDetails.name)
  },
  {
    id: 'RD-02',
    section: 'responderDetails',
    description: 'CFAR responder signature is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.responderDetails.signature)
  },
  {
    id: 'RD-03',
    section: 'responderDetails',
    description: 'CFAR responder contact information is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.responderDetails.contactInformation)
  },
  {
    id: 'RD-04',
    section: 'responderDetails',
    description: 'CFAR organization is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.responderDetails.cfarOrganization)
  }
];

export { cfarRules };
