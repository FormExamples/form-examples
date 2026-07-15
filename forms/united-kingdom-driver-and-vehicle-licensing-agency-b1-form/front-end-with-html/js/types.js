// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the DVLA B1 form. This file
// publishes the empty-state factory and a few shared helpers used across
// the wizard.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'gp' | 'consultant' | ''} LastSeenProvider
 * @typedef {'first-ever' | 'more-than-one-or-epilepsy' | ''} SeizureDiagnosis
 * @typedef {'patch' | 'prism' | 'glasses-or-lenses' | 'other' | ''} DiplopiaCorrection
 * @typedef {'email' | 'sms' | ''} ContactChannel
 * @typedef {'urgent' | 'high' | 'medium' | 'low'} FlagPriority
 */

/**
 * @typedef {Object} PersonalDetails
 * @property {string} title
 * @property {string} fullName
 * @property {string} dateOfBirth
 * @property {string} addressLine1
 * @property {string} addressLine2
 * @property {string} addressLine3
 * @property {string} postcode
 * @property {string} email
 * @property {string} contactNumber
 * @property {string} changeOfDetails
 */

/**
 * @typedef {Object} GpDetails
 * @property {string} gpName
 * @property {string} surgeryName
 * @property {string} addressLine1
 * @property {string} addressLine2
 * @property {string} town
 * @property {string} postcode
 * @property {string} contactNumber
 * @property {string} email
 * @property {string} dateLastSeen
 */

/**
 * @typedef {Object} ConsultantDetails
 * @property {string} consultantName
 * @property {string} speciality
 * @property {string} department
 * @property {string} hospitalName
 * @property {string} addressLine1
 * @property {string} addressLine2
 * @property {string} town
 * @property {string} postcode
 * @property {string} contactNumber
 * @property {string} email
 * @property {string} dateLastSeen
 */

/**
 * @typedef {Object} HealthcareProfessionals
 * @property {GpDetails} gp
 * @property {ConsultantDetails} consultant
 */

/**
 * @typedef {Object} ConditionHistory
 * @property {boolean} brainHaemorrhage
 * @property {string} brainHaemorrhageDate
 * @property {string} brainHaemorrhageDetails
 * @property {boolean} severeHeadInjury
 * @property {string} severeHeadInjuryDate
 * @property {string} severeHeadInjuryDetails
 * @property {boolean} otherCondition
 * @property {string} otherConditionDate
 * @property {string} otherConditionDetails
 * @property {string} brainSurgeryDate
 * @property {boolean} brainSurgeryNotApplicable
 */

/**
 * @typedef {Object} TreatmentProvider
 * @property {LastSeenProvider} lastSeen
 * @property {string} gpLastContactDate
 * @property {string} gpNextContactDate
 * @property {string} consultantLastContactDate
 * @property {string} consultantNextContactDate
 */

/**
 * @typedef {Object} Blackouts
 * @property {YesNo} hadBlackouts
 * @property {string} blackoutDate
 */

/**
 * @typedef {Object} FirstEverSeizure
 * @property {string} date
 * @property {string} details
 */

/**
 * @typedef {Object} MultipleSeizureDetails
 * @property {YesNo} twoOrMoreWithinFiveYears
 * @property {string} firstAwakeSeizureDate
 * @property {string} firstAsleepSeizureDate
 * @property {string} lastTwoAwakeSeizureDate1
 * @property {string} lastTwoAwakeSeizureDate2
 * @property {string} lastTwoAsleepSeizureDate1
 * @property {string} lastTwoAsleepSeizureDate2
 * @property {string} firstSleepAttackAfterLastAwakeAttackDate
 * @property {YesNo} affectedConsciousness
 * @property {YesNo} wouldHaveAffectedDriving
 * @property {string} attackDescription
 * @property {YesNo} resultOfMedicationAdvice
 * @property {string} dateMedicationStartedToReduce
 * @property {YesNo} previousMedicationRestarted
 * @property {string} datePreviousMedicationRestarted
 * @property {string} dateOfLastSeizurePriorToWithdrawal
 * @property {string} provokedSeizureDetails
 */

/**
 * @typedef {Object} EpilepsyDeclaration
 * @property {boolean} declarationAccepted
 * @property {string} signedName
 * @property {string} signatureDate
 */

/**
 * @typedef {Object} Seizures
 * @property {YesNo} hadSeizures
 * @property {SeizureDiagnosis} diagnosis
 * @property {FirstEverSeizure} firstEver
 * @property {MultipleSeizureDetails} multiple
 * @property {EpilepsyDeclaration} epilepsyDeclaration
 */

/**
 * @typedef {Object} MedicationEntry
 * @property {string} name
 * @property {string} startDate
 * @property {string} endDate
 */

/**
 * @typedef {Object} Medication
 * @property {boolean} noMedicationTaken
 * @property {MedicationEntry[]} entries
 * @property {YesNo} makesDrowsyOrConfused
 */

/**
 * @typedef {Object} VpShunt
 * @property {YesNo} hadVpShuntOrDrain
 * @property {string} procedureDate
 */

/**
 * @typedef {Object} DailyLiving
 * @property {YesNo} needsHelp
 * @property {string} helpDetails
 */

/**
 * @typedef {Object} DoubleVision
 * @property {YesNo} hasDoubleVision
 * @property {YesNo} suppressedOrControlled
 * @property {DiplopiaCorrection} correctionMethod
 * @property {string} correctionMethodOther
 */

/**
 * @typedef {Object} Eyesight
 * @property {YesNo} hasEyesightProblems
 * @property {string} details
 */

/**
 * @typedef {Object} VehicleAdaptations
 * @property {YesNo} needsAdaptations
 * @property {YesNo} previouslyDeclared
 * @property {YesNo} additionalControlsFitted
 */

/**
 * @typedef {Object} Authorisation
 * @property {boolean} declarationAccepted
 * @property {string} name
 * @property {string} signatureDate
 * @property {YesNo} electronicCorrespondenceConsent
 * @property {ContactChannel} dvlaContactPreference
 * @property {ContactChannel} healthcareContactPreference
 */

/**
 * @typedef {Object} AssessmentData
 * @property {PersonalDetails} personalDetails
 * @property {HealthcareProfessionals} healthcareProfessionals
 * @property {ConditionHistory} conditionHistory
 * @property {TreatmentProvider} treatmentProvider
 * @property {Blackouts} blackouts
 * @property {Seizures} seizures
 * @property {Medication} medication
 * @property {VpShunt} vpShunt
 * @property {DailyLiving} dailyLiving
 * @property {DoubleVision} doubleVision
 * @property {Eyesight} eyesight
 * @property {VehicleAdaptations} vehicleAdaptations
 * @property {Authorisation} authorisation
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} section
 * @property {string} description
 */

/**
 * @typedef {Object} SectionCompleteness
 * @property {string} section
 * @property {number} required
 * @property {number} satisfied
 * @property {FiredRule[]} missing
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} complete
 * @property {number} totalRequired
 * @property {number} totalSatisfied
 * @property {SectionCompleteness[]} sections
 * @property {FiredRule[]} missing
 */

/**
 * @typedef {Object} FlaggedIssue
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {FlagPriority} priority
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.DvlaB1Form`.

/** @returns {AssessmentData} */
function emptyAssessment() {
  return {
    personalDetails: {
      title: '',
      fullName: '',
      dateOfBirth: '',
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      postcode: '',
      email: '',
      contactNumber: '',
      changeOfDetails: ''
    },
    healthcareProfessionals: {
      gp: {
        gpName: '',
        surgeryName: '',
        addressLine1: '',
        addressLine2: '',
        town: '',
        postcode: '',
        contactNumber: '',
        email: '',
        dateLastSeen: ''
      },
      consultant: {
        consultantName: '',
        speciality: '',
        department: '',
        hospitalName: '',
        addressLine1: '',
        addressLine2: '',
        town: '',
        postcode: '',
        contactNumber: '',
        email: '',
        dateLastSeen: ''
      }
    },
    conditionHistory: {
      brainHaemorrhage: false,
      brainHaemorrhageDate: '',
      brainHaemorrhageDetails: '',
      severeHeadInjury: false,
      severeHeadInjuryDate: '',
      severeHeadInjuryDetails: '',
      otherCondition: false,
      otherConditionDate: '',
      otherConditionDetails: '',
      brainSurgeryDate: '',
      brainSurgeryNotApplicable: false
    },
    treatmentProvider: {
      lastSeen: '',
      gpLastContactDate: '',
      gpNextContactDate: '',
      consultantLastContactDate: '',
      consultantNextContactDate: ''
    },
    blackouts: {
      hadBlackouts: '',
      blackoutDate: ''
    },
    seizures: {
      hadSeizures: '',
      diagnosis: '',
      firstEver: { date: '', details: '' },
      multiple: {
        twoOrMoreWithinFiveYears: '',
        firstAwakeSeizureDate: '',
        firstAsleepSeizureDate: '',
        lastTwoAwakeSeizureDate1: '',
        lastTwoAwakeSeizureDate2: '',
        lastTwoAsleepSeizureDate1: '',
        lastTwoAsleepSeizureDate2: '',
        firstSleepAttackAfterLastAwakeAttackDate: '',
        affectedConsciousness: '',
        wouldHaveAffectedDriving: '',
        attackDescription: '',
        resultOfMedicationAdvice: '',
        dateMedicationStartedToReduce: '',
        previousMedicationRestarted: '',
        datePreviousMedicationRestarted: '',
        dateOfLastSeizurePriorToWithdrawal: '',
        provokedSeizureDetails: ''
      },
      epilepsyDeclaration: {
        declarationAccepted: false,
        signedName: '',
        signatureDate: ''
      }
    },
    medication: {
      noMedicationTaken: false,
      entries: [{ name: '', startDate: '', endDate: '' }],
      makesDrowsyOrConfused: ''
    },
    vpShunt: {
      hadVpShuntOrDrain: '',
      procedureDate: ''
    },
    dailyLiving: {
      needsHelp: '',
      helpDetails: ''
    },
    doubleVision: {
      hasDoubleVision: '',
      suppressedOrControlled: '',
      correctionMethod: '',
      correctionMethodOther: ''
    },
    eyesight: {
      hasEyesightProblems: '',
      details: ''
    },
    vehicleAdaptations: {
      needsAdaptations: '',
      previouslyDeclared: '',
      additionalControlsFitted: ''
    },
    authorisation: {
      declarationAccepted: false,
      name: '',
      signatureDate: '',
      electronicCorrespondenceConsent: '',
      dvlaContactPreference: '',
      healthcareContactPreference: ''
    }
  };
}

/** True if a string is non-empty after trimming. */
function hasText(s) {
  return typeof s === 'string' && s.trim() !== '';
}

/** True if a Yes/No field has been answered. */
function isYesNoAnswered(value) {
  return value === 'yes' || value === 'no';
}

/**
 * The epilepsy declaration is mandatory whenever the patient declares epilepsy
 * or more than one lifetime seizure (DVLA B1 question 6 group).
 * @param {AssessmentData} data
 * @returns {boolean}
 */
function epilepsyDeclarationRequired(data) {
  return (
    data.seizures.hadSeizures === 'yes' &&
    data.seizures.diagnosis === 'more-than-one-or-epilepsy'
  );
}

/** @param {string} section */
function sectionLabel(section) {
  switch (section) {
    case 'personalDetails': return 'Personal Details';
    case 'healthcareProfessionals': return 'Healthcare Professionals';
    case 'conditionHistory': return 'Condition History (Q1)';
    case 'treatmentProvider': return 'Treatment Provider (Q2)';
    case 'blackouts': return 'Blackouts (Q3)';
    case 'seizures': return 'Seizures (Q4-Q6)';
    case 'medication': return 'Medication (Q7)';
    case 'vpShunt': return 'VP Shunt (Q8)';
    case 'dailyLiving': return 'Daily Living (Q9)';
    case 'doubleVision': return 'Double Vision (Q10)';
    case 'eyesight': return 'Eyesight (Q11)';
    case 'vehicleAdaptations': return 'Vehicle Adaptations (Q12)';
    case 'authorisation': return 'Authorisation';
    default: return section;
  }
}

/** @param {FlagPriority} priority */
function priorityLabel(priority) {
  switch (priority) {
    case 'urgent': return 'Urgent';
    case 'high': return 'High';
    case 'medium': return 'Medium';
    case 'low': return 'Low';
    default: return '';
  }
}

export { emptyAssessment, hasText, isYesNoAnswered, epilepsyDeclarationRequired, sectionLabel, priorityLabel };
