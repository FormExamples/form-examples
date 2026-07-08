// DVLA B1 - completeness validation rules.
//
// Each rule maps to one required field. Conditional sections (Q4 No -> skip
// Q5/Q6, Q10 No -> skip Q10a/b, Q12 No -> skip Q12a/b, epilepsy declaration
// when epilepsy or >1 seizure) are gated by `applies()` so the validator
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

(function () {
'use strict';
window.DvlaB1Form = window.DvlaB1Form || {};
const { hasText, isYesNoAnswered, epilepsyDeclarationRequired } = window.DvlaB1Form;

/** @type {ValidationRule[]} */
const b1Rules = [
  // --- Step 1 - Personal Details (Part A) -----------------------------
  {
    id: 'PD-01',
    section: 'personalDetails',
    description: 'Title is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.personalDetails.title)
  },
  {
    id: 'PD-02',
    section: 'personalDetails',
    description: 'Full name is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.personalDetails.fullName)
  },
  {
    id: 'PD-03',
    section: 'personalDetails',
    description: 'Date of birth is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.personalDetails.dateOfBirth)
  },
  {
    id: 'PD-04',
    section: 'personalDetails',
    description: 'Address is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.personalDetails.addressLine1)
  },
  {
    id: 'PD-05',
    section: 'personalDetails',
    description: 'Postcode is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.personalDetails.postcode)
  },
  {
    id: 'PD-06',
    section: 'personalDetails',
    description: 'Contact number is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.personalDetails.contactNumber)
  },

  // --- Step 2 - Healthcare Professionals (Part B) --------------------
  {
    id: 'HC-01',
    section: 'healthcareProfessionals',
    description: 'GP name is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.healthcareProfessionals.gp.gpName)
  },
  {
    id: 'HC-02',
    section: 'healthcareProfessionals',
    description: 'GP surgery name is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.healthcareProfessionals.gp.surgeryName)
  },
  {
    id: 'HC-03',
    section: 'healthcareProfessionals',
    description: 'GP postcode is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.healthcareProfessionals.gp.postcode)
  },
  {
    id: 'HC-04',
    section: 'healthcareProfessionals',
    description: 'GP date last seen for this condition is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.healthcareProfessionals.gp.dateLastSeen)
  },

  // --- Step 3 - Q1 Condition History ---------------------------------
  {
    id: 'Q1-01',
    section: 'conditionHistory',
    description:
      'At least one Q1 condition or brain-surgery answer (or "Not applicable") is required.',
    applies: () => true,
    isSatisfied: (d) =>
      d.conditionHistory.brainHaemorrhage ||
      d.conditionHistory.severeHeadInjury ||
      d.conditionHistory.otherCondition ||
      d.conditionHistory.brainSurgeryNotApplicable ||
      hasText(d.conditionHistory.brainSurgeryDate)
  },
  {
    id: 'Q1-02',
    section: 'conditionHistory',
    description: 'Date of brain haemorrhage is required when ticked.',
    applies: (d) => d.conditionHistory.brainHaemorrhage,
    isSatisfied: (d) => hasText(d.conditionHistory.brainHaemorrhageDate)
  },
  {
    id: 'Q1-03',
    section: 'conditionHistory',
    description: 'Date of severe head injury is required when ticked.',
    applies: (d) => d.conditionHistory.severeHeadInjury,
    isSatisfied: (d) => hasText(d.conditionHistory.severeHeadInjuryDate)
  },
  {
    id: 'Q1-04',
    section: 'conditionHistory',
    description: 'Details of "other condition" are required when ticked.',
    applies: (d) => d.conditionHistory.otherCondition,
    isSatisfied: (d) => hasText(d.conditionHistory.otherConditionDetails)
  },

  // --- Step 4 - Q2 Treatment Provider --------------------------------
  {
    id: 'Q2-01',
    section: 'treatmentProvider',
    description: 'Provider last seen for this condition (GP or Consultant) is required.',
    applies: () => true,
    isSatisfied: (d) =>
      d.treatmentProvider.lastSeen === 'gp' ||
      d.treatmentProvider.lastSeen === 'consultant'
  },
  {
    id: 'Q2-02',
    section: 'treatmentProvider',
    description: 'GP date of last contact is required when last seen by GP.',
    applies: (d) => d.treatmentProvider.lastSeen === 'gp',
    isSatisfied: (d) => hasText(d.treatmentProvider.gpLastContactDate)
  },
  {
    id: 'Q2-03',
    section: 'treatmentProvider',
    description:
      'Consultant date of last contact is required when last seen by consultant.',
    applies: (d) => d.treatmentProvider.lastSeen === 'consultant',
    isSatisfied: (d) => hasText(d.treatmentProvider.consultantLastContactDate)
  },

  // --- Step 5 - Q3 Blackouts -----------------------------------------
  {
    id: 'Q3-01',
    section: 'blackouts',
    description: 'Q3: blackouts/altered consciousness Yes or No is required.',
    applies: () => true,
    isSatisfied: (d) => isYesNoAnswered(d.blackouts.hadBlackouts)
  },
  {
    id: 'Q3-02',
    section: 'blackouts',
    description: 'Q3: date of blackout is required when answered Yes.',
    applies: (d) => d.blackouts.hadBlackouts === 'yes',
    isSatisfied: (d) => hasText(d.blackouts.blackoutDate)
  },

  // --- Step 6 - Q4-Q6 Seizures ---------------------------------------
  {
    id: 'Q4-01',
    section: 'seizures',
    description: 'Q4: ever had seizures or epileptic attacks (Yes or No) is required.',
    applies: () => true,
    isSatisfied: (d) => isYesNoAnswered(d.seizures.hadSeizures)
  },
  {
    id: 'Q4-02',
    section: 'seizures',
    description: 'Q4: seizure diagnosis (first ever, or more than one/epilepsy) is required.',
    applies: (d) => d.seizures.hadSeizures === 'yes',
    isSatisfied: (d) =>
      d.seizures.diagnosis === 'first-ever' ||
      d.seizures.diagnosis === 'more-than-one-or-epilepsy'
  },
  {
    id: 'Q5-01',
    section: 'seizures',
    description: 'Q5: date of first ever seizure is required.',
    applies: (d) =>
      d.seizures.hadSeizures === 'yes' && d.seizures.diagnosis === 'first-ever',
    isSatisfied: (d) => hasText(d.seizures.firstEver.date)
  },
  {
    id: 'Q6a-01',
    section: 'seizures',
    description: 'Q6a: two or more seizures within 5 years (Yes or No) is required.',
    applies: (d) =>
      d.seizures.hadSeizures === 'yes' &&
      d.seizures.diagnosis === 'more-than-one-or-epilepsy',
    isSatisfied: (d) => isYesNoAnswered(d.seizures.multiple.twoOrMoreWithinFiveYears)
  },
  {
    id: 'Q6g-01',
    section: 'seizures',
    description: 'Q6g: have seizures affected level of consciousness (Yes or No)?',
    applies: (d) =>
      d.seizures.hadSeizures === 'yes' &&
      d.seizures.diagnosis === 'more-than-one-or-epilepsy',
    isSatisfied: (d) => isYesNoAnswered(d.seizures.multiple.affectedConsciousness)
  },
  {
    id: 'Q6h-01',
    section: 'seizures',
    description: 'Q6h: would seizures have affected vehicle control (Yes or No)?',
    applies: (d) =>
      d.seizures.hadSeizures === 'yes' &&
      d.seizures.diagnosis === 'more-than-one-or-epilepsy' &&
      d.seizures.multiple.affectedConsciousness === 'yes',
    isSatisfied: (d) => isYesNoAnswered(d.seizures.multiple.wouldHaveAffectedDriving)
  },
  {
    id: 'Q6i-01',
    section: 'seizures',
    description:
      'Q6i: was last seizure a result of medication advice from your doctor (Yes or No)?',
    applies: (d) =>
      d.seizures.hadSeizures === 'yes' &&
      d.seizures.diagnosis === 'more-than-one-or-epilepsy',
    isSatisfied: (d) => isYesNoAnswered(d.seizures.multiple.resultOfMedicationAdvice)
  },
  {
    id: 'Q6-EPI-01',
    section: 'seizures',
    description: 'Epilepsy declaration must be accepted.',
    applies: (d) => epilepsyDeclarationRequired(d),
    isSatisfied: (d) => d.seizures.epilepsyDeclaration.declarationAccepted
  },
  {
    id: 'Q6-EPI-02',
    section: 'seizures',
    description: 'Epilepsy declaration: signed name is required.',
    applies: (d) => epilepsyDeclarationRequired(d),
    isSatisfied: (d) => hasText(d.seizures.epilepsyDeclaration.signedName)
  },
  {
    id: 'Q6-EPI-03',
    section: 'seizures',
    description: 'Epilepsy declaration: signature date is required.',
    applies: (d) => epilepsyDeclarationRequired(d),
    isSatisfied: (d) => hasText(d.seizures.epilepsyDeclaration.signatureDate)
  },

  // --- Step 7 - Q7 Medication ----------------------------------------
  {
    id: 'Q7-01',
    section: 'medication',
    description:
      'Q7: at least one medication entry, or "No medication taken" must be ticked.',
    applies: () => true,
    isSatisfied: (d) =>
      d.medication.noMedicationTaken ||
      d.medication.entries.some((e) => hasText(e.name))
  },
  {
    id: 'Q7a-01',
    section: 'medication',
    description: 'Q7a: medication makes you drowsy or confused when driving (Yes or No)?',
    applies: (d) =>
      !d.medication.noMedicationTaken &&
      d.medication.entries.some((e) => hasText(e.name)),
    isSatisfied: (d) => isYesNoAnswered(d.medication.makesDrowsyOrConfused)
  },

  // --- Step 8 - Q8 VP Shunt ------------------------------------------
  {
    id: 'Q8-01',
    section: 'vpShunt',
    description: 'Q8: VP shunt or external ventricular drain (Yes or No) is required.',
    applies: () => true,
    isSatisfied: (d) => isYesNoAnswered(d.vpShunt.hadVpShuntOrDrain)
  },
  {
    id: 'Q8-02',
    section: 'vpShunt',
    description: 'Q8: date of procedure is required when answered Yes.',
    applies: (d) => d.vpShunt.hadVpShuntOrDrain === 'yes',
    isSatisfied: (d) => hasText(d.vpShunt.procedureDate)
  },

  // --- Step 9 - Q9 Daily Living --------------------------------------
  {
    id: 'Q9-01',
    section: 'dailyLiving',
    description:
      'Q9: do you need help from another person with day-to-day living (Yes or No)?',
    applies: () => true,
    isSatisfied: (d) => isYesNoAnswered(d.dailyLiving.needsHelp)
  },
  {
    id: 'Q9-02',
    section: 'dailyLiving',
    description: 'Q9: details of how a helper assists you are required when answered Yes.',
    applies: (d) => d.dailyLiving.needsHelp === 'yes',
    isSatisfied: (d) => hasText(d.dailyLiving.helpDetails)
  },

  // --- Step 10 - Q10 Double Vision -----------------------------------
  {
    id: 'Q10-01',
    section: 'doubleVision',
    description: 'Q10: double vision/diplopia (Yes or No) is required.',
    applies: () => true,
    isSatisfied: (d) => isYesNoAnswered(d.doubleVision.hasDoubleVision)
  },
  {
    id: 'Q10a-01',
    section: 'doubleVision',
    description: 'Q10a: is double vision suppressed or controlled (Yes or No)?',
    applies: (d) => d.doubleVision.hasDoubleVision === 'yes',
    isSatisfied: (d) => isYesNoAnswered(d.doubleVision.suppressedOrControlled)
  },
  {
    id: 'Q10b-01',
    section: 'doubleVision',
    description: 'Q10b: correction method is required when double vision is controlled.',
    applies: (d) =>
      d.doubleVision.hasDoubleVision === 'yes' &&
      d.doubleVision.suppressedOrControlled === 'yes',
    isSatisfied: (d) =>
      d.doubleVision.correctionMethod === 'patch' ||
      d.doubleVision.correctionMethod === 'prism' ||
      d.doubleVision.correctionMethod === 'glasses-or-lenses' ||
      d.doubleVision.correctionMethod === 'other'
  },
  {
    id: 'Q10b-02',
    section: 'doubleVision',
    description: 'Q10b: please describe the correction method when "Other" is selected.',
    applies: (d) =>
      d.doubleVision.hasDoubleVision === 'yes' &&
      d.doubleVision.suppressedOrControlled === 'yes' &&
      d.doubleVision.correctionMethod === 'other',
    isSatisfied: (d) => hasText(d.doubleVision.correctionMethodOther)
  },

  // --- Step 11 - Q11 Eyesight ----------------------------------------
  {
    id: 'Q11-01',
    section: 'eyesight',
    description: 'Q11: eyesight problems caused by your condition (Yes or No)?',
    applies: () => true,
    isSatisfied: (d) => isYesNoAnswered(d.eyesight.hasEyesightProblems)
  },
  {
    id: 'Q11-02',
    section: 'eyesight',
    description: 'Q11: please describe the eyesight problems when answered Yes.',
    applies: (d) => d.eyesight.hasEyesightProblems === 'yes',
    isSatisfied: (d) => hasText(d.eyesight.details)
  },

  // --- Step 12 - Q12 Vehicle Adaptations -----------------------------
  {
    id: 'Q12-01',
    section: 'vehicleAdaptations',
    description:
      'Q12: do you need a vehicle fitted with special controls or automatic transmission (Yes or No)?',
    applies: () => true,
    isSatisfied: (d) => isYesNoAnswered(d.vehicleAdaptations.needsAdaptations)
  },
  {
    id: 'Q12a-01',
    section: 'vehicleAdaptations',
    description:
      'Q12a: have you previously declared the need for special controls (Yes or No)?',
    applies: (d) => d.vehicleAdaptations.needsAdaptations === 'yes',
    isSatisfied: (d) => isYesNoAnswered(d.vehicleAdaptations.previouslyDeclared)
  },
  {
    id: 'Q12b-01',
    section: 'vehicleAdaptations',
    description: 'Q12b: have additional controls been fitted since last licence (Yes or No)?',
    applies: (d) =>
      d.vehicleAdaptations.needsAdaptations === 'yes' &&
      d.vehicleAdaptations.previouslyDeclared === 'yes',
    isSatisfied: (d) => isYesNoAnswered(d.vehicleAdaptations.additionalControlsFitted)
  },

  // --- Step 13 - Authorisation ---------------------------------------
  {
    id: 'AUTH-01',
    section: 'authorisation',
    description: 'Authorisation declaration must be accepted.',
    applies: () => true,
    isSatisfied: (d) => d.authorisation.declarationAccepted
  },
  {
    id: 'AUTH-02',
    section: 'authorisation',
    description: 'Authorisation: name is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.authorisation.name)
  },
  {
    id: 'AUTH-03',
    section: 'authorisation',
    description: 'Authorisation: signature date is required.',
    applies: () => true,
    isSatisfied: (d) => hasText(d.authorisation.signatureDate)
  },
  {
    id: 'AUTH-04',
    section: 'authorisation',
    description:
      'Authorisation: electronic correspondence consent (Yes or No) is required.',
    applies: () => true,
    isSatisfied: (d) => isYesNoAnswered(d.authorisation.electronicCorrespondenceConsent)
  },
  {
    id: 'AUTH-05',
    section: 'authorisation',
    description: 'Authorisation: DVLA contact preference (Email or SMS) is required.',
    applies: (d) => d.authorisation.electronicCorrespondenceConsent === 'yes',
    isSatisfied: (d) =>
      d.authorisation.dvlaContactPreference === 'email' ||
      d.authorisation.dvlaContactPreference === 'sms'
  },
  {
    id: 'AUTH-06',
    section: 'authorisation',
    description:
      'Authorisation: healthcare professional contact preference (Email or SMS) is required.',
    applies: (d) => d.authorisation.electronicCorrespondenceConsent === 'yes',
    isSatisfied: (d) =>
      d.authorisation.healthcareContactPreference === 'email' ||
      d.authorisation.healthcareContactPreference === 'sms'
  }
];

window.DvlaB1Form.b1Rules = b1Rules;
})();
