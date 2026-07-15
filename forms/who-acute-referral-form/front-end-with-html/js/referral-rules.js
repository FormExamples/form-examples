import { hasText, isYesNoUnknownAnswered } from './types.js';

// WHO Acute Referral Form - completeness validation rules.
//
// Each rule maps to one required field. Conditional fields (Other-precaution
// details only when "Other" is ticked; receipt-side fields only once any
// receipt field has been touched) are gated by `applies()` so the validator
// only counts a rule when its branch is active.
//
// Rule IDs follow the pattern <SECTION>-<NN>; the prefix lets the report
// group fired rules by section.

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
const referralRules = [
  // --- Step 1 - Patient Identification --------------------------------
  {
    id: 'PID-01',
    section: 'patientIdentification',
    description: 'Patient last name (family name) is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.patientIdentification.patientLastName)
  },
  {
    id: 'PID-02',
    section: 'patientIdentification',
    description: 'Patient first name (given name) is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.patientIdentification.patientFirstName)
  },
  {
    id: 'PID-03',
    section: 'patientIdentification',
    description: 'Patient date of birth is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.patientIdentification.dateOfBirth)
  },
  {
    id: 'PID-04',
    section: 'patientIdentification',
    description: 'Patient sex (Male / Female / Unknown) is required.',
    applies: () => true,
    isSatisfied: (d) =>
      d.patientIdentification.sex === 'male' ||
      d.patientIdentification.sex === 'female' ||
      d.patientIdentification.sex === 'unknown'
  },

  // --- Step 2 - Facility & Transport ----------------------------------
  {
    id: 'FT-01',
    section: 'facilityAndTransport',
    description: 'Initiating facility name is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.facilityAndTransport.initiatingFacility.name)
  },
  {
    id: 'FT-02',
    section: 'facilityAndTransport',
    description: 'Initiating facility focal point (contact person) is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.facilityAndTransport.initiatingFacility.focalPoint)
  },
  {
    id: 'FT-03',
    section: 'facilityAndTransport',
    description: 'Initiating facility phone number is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.facilityAndTransport.initiatingFacility.phoneNumber)
  },
  {
    id: 'FT-04',
    section: 'facilityAndTransport',
    description: 'Reason for referral is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.facilityAndTransport.reasonForReferral)
  },
  {
    id: 'FT-05',
    section: 'facilityAndTransport',
    description: 'Referral facility name is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.facilityAndTransport.referralFacility.name)
  },
  {
    id: 'FT-06',
    section: 'facilityAndTransport',
    description: 'Referral facility phone number is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.facilityAndTransport.referralFacility.phoneNumber)
  },
  {
    id: 'FT-07',
    section: 'facilityAndTransport',
    description: 'Date and time of transfer decision is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.facilityAndTransport.transferDecisionDateTime)
  },
  {
    id: 'FT-08',
    section: 'facilityAndTransport',
    description: 'Date and time of departure is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.facilityAndTransport.departureDateTime)
  },
  {
    id: 'FT-09',
    section: 'facilityAndTransport',
    description: 'Mode of transfer (Ground / Air / Sea) is required.',
    applies: () => true,
    isSatisfied: (d) =>
      d.facilityAndTransport.modeOfTransfer === 'ground' ||
      d.facilityAndTransport.modeOfTransfer === 'air' ||
      d.facilityAndTransport.modeOfTransfer === 'sea'
  },

  // --- Step 3 - Situation ---------------------------------------------
  {
    id: 'SIT-01',
    section: 'situation',
    description: 'Chief complaint is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.situation.chiefComplaint)
  },
  {
    id: 'SIT-02',
    section: 'situation',
    description: 'Primary diagnosis is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.situation.primaryDiagnosis)
  },
  {
    id: 'SIT-03',
    section: 'situation',
    description: 'Pregnancy status (Yes / No / Unknown) is required.',
    applies: () => true,
    isSatisfied: (d) => isYesNoUnknownAnswered(d.situation.pregnant)
  },

  // --- Step 4 - Background (history + ABCDE) --------------------------
  {
    id: 'BG-01',
    section: 'background',
    description: 'Brief history of present illness is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.background.historyOfPresentIllness)
  },
  {
    id: 'BG-A',
    section: 'background',
    description:
      'Airway: a finding (or "Normal") and an intervention (or "None") must be recorded.',
    applies: () => true,
    isSatisfied: (d) =>
      (d.background.airway.findingNormal || hasText(d.background.airway.findingDetails)) &&
      (d.background.airway.interventionNone ||
        hasText(d.background.airway.interventionDetails))
  },
  {
    id: 'BG-B',
    section: 'background',
    description:
      'Breathing: a finding (or "Normal") and an intervention (or "None") must be recorded.',
    applies: () => true,
    isSatisfied: (d) =>
      (d.background.breathing.findingNormal ||
        hasText(d.background.breathing.findingDetails)) &&
      (d.background.breathing.interventionNone ||
        hasText(d.background.breathing.interventionDetails))
  },
  {
    id: 'BG-C',
    section: 'background',
    description:
      'Circulation: a finding (or "Normal") and an intervention (or "None") must be recorded.',
    applies: () => true,
    isSatisfied: (d) =>
      (d.background.circulation.findingNormal ||
        hasText(d.background.circulation.findingDetails)) &&
      (d.background.circulation.interventionNone ||
        hasText(d.background.circulation.interventionDetails))
  },
  {
    id: 'BG-D',
    section: 'background',
    description:
      'Disability (neurologic): a finding (or "Normal") and an intervention (or "None") must be recorded.',
    applies: () => true,
    isSatisfied: (d) =>
      (d.background.disability.findingNormal ||
        hasText(d.background.disability.findingDetails)) &&
      (d.background.disability.interventionNone ||
        hasText(d.background.disability.interventionDetails))
  },
  {
    id: 'BG-E',
    section: 'background',
    description:
      'Exposure: a finding (or "Normal") and an intervention (or "None") must be recorded.',
    applies: () => true,
    isSatisfied: (d) =>
      (d.background.exposure.findingNormal ||
        hasText(d.background.exposure.findingDetails)) &&
      (d.background.exposure.interventionNone ||
        hasText(d.background.exposure.interventionDetails))
  },

  // --- Step 5 - Assessment --------------------------------------------
  {
    id: 'ASS-01',
    section: 'assessment',
    description:
      'Clinical assessment (description of the patient and need for referral) is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.assessment.clinicalAssessment)
  },

  // --- Step 6 - Recommendations ---------------------------------------
  {
    id: 'REC-01',
    section: 'recommendations',
    description:
      'Treatment plan during transport (next steps, therapies continued in transit) is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.recommendations.treatmentPlanDuringTransport)
  },
  {
    id: 'REC-02',
    section: 'recommendations',
    description:
      'Description of how the "Other" precaution applies is required when ticked.',
    applies: (d) => d.recommendations.precautions.other,
    isSatisfied: (d) => hasText(d.recommendations.precautions.otherDetails)
  },

  // --- Step 7 - Initiating Provider Sign-off --------------------------
  {
    id: 'IPS-01',
    section: 'initiatingProviderSignoff',
    description: 'Initiating facility provider name is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.initiatingProviderSignoff.providerName)
  },
  {
    id: 'IPS-02',
    section: 'initiatingProviderSignoff',
    description: 'Initiating facility provider signature is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.initiatingProviderSignoff.signature)
  },
  {
    id: 'IPS-03',
    section: 'initiatingProviderSignoff',
    description: 'Initiating facility provider signature date is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.initiatingProviderSignoff.signatureDate)
  },

  // --- Step 8 - Referral Facility Receipt -----------------------------
  // These rules only apply once the receiving facility has begun its part
  // of the form. We trigger them as soon as any receipt-side field has
  // been touched (arrival time recorded, provider name entered, etc.).
  {
    id: 'RFR-01',
    section: 'referralFacilityReceipt',
    description: 'Receiving provider name is required once arrival time is recorded.',
    applies: (d) =>
      hasText(d.referralFacilityReceipt.patientArrivalDateTime) ||
      hasText(d.referralFacilityReceipt.receivingProviderSignature),
    isSatisfied: (d) => hasText(d.referralFacilityReceipt.receivingProviderName)
  },
  {
    id: 'RFR-02',
    section: 'referralFacilityReceipt',
    description:
      'Receiving provider signature is required once arrival time is recorded.',
    applies: (d) =>
      hasText(d.referralFacilityReceipt.patientArrivalDateTime) ||
      hasText(d.referralFacilityReceipt.receivingProviderName),
    isSatisfied: (d) => hasText(d.referralFacilityReceipt.receivingProviderSignature)
  },
  {
    id: 'RFR-03',
    section: 'referralFacilityReceipt',
    description:
      'Patient arrival date and time is required once any other receipt field is filled.',
    applies: (d) =>
      hasText(d.referralFacilityReceipt.receivingProviderName) ||
      hasText(d.referralFacilityReceipt.receivingProviderSignature),
    isSatisfied: (d) => hasText(d.referralFacilityReceipt.patientArrivalDateTime)
  }
];

export { referralRules };
