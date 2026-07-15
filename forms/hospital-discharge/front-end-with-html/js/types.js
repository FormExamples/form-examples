// Plain-JavaScript / JSDoc type definitions for the Hospital Discharge form.
//
// Mirrors the SvelteKit `src/lib/engine/types.ts` data model. Builds the
// canonical empty AssessmentData shape used by the wizard so that newly-
// added fields automatically default correctly when older saved state is
// rehydrated from localStorage.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'home' | 'care-home' | 'nursing-home' | 'rehab' | 'hospice' | 'other-hospital' | 'other' | ''} DischargeDestination
 * @typedef {'self' | 'family' | 'carer' | 'community-team' | 'care-home-staff' | 'other' | ''} CareResponsibility
 * @typedef {'walking' | 'wheelchair' | 'stretcher' | 'ambulance' | 'unknown' | ''} TransportMode
 */

/**
 * @typedef {Object} PatientDetails
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {string} nhsNumber
 * @property {string} hospitalNumber
 * @property {string} address
 * @property {string} postcode
 * @property {string} phone
 * @property {string} gpName
 * @property {string} gpPractice
 * @property {string} nextOfKinName
 * @property {string} nextOfKinPhone
 */

/**
 * @typedef {Object} AdmissionSummary
 * @property {string} admissionDate
 * @property {string} dischargeDate
 * @property {string} ward
 * @property {string} consultant
 * @property {string} specialty
 * @property {string} reasonForAdmission
 * @property {string} presentingComplaint
 * @property {string} clinicalNarrative
 */

/**
 * @typedef {Object} Diagnosis
 * @property {string} description
 * @property {string} icd10
 * @property {'primary' | 'secondary' | ''} type
 */

/**
 * @typedef {Object} Diagnoses
 * @property {Diagnosis[]} diagnoses
 */

/**
 * @typedef {Object} Procedure
 * @property {string} description
 * @property {string} opcs4
 * @property {string} date
 * @property {string} performedBy
 */

/**
 * @typedef {Object} ProceduresPerformed
 * @property {Procedure[]} procedures
 * @property {YesNo} noProceduresPerformed
 */

/**
 * @typedef {Object} Medication
 * @property {string} name
 * @property {string} dose
 * @property {string} route
 * @property {string} frequency
 * @property {string} duration
 * @property {'new' | 'changed' | 'unchanged' | 'stopped' | ''} status
 * @property {string} indication
 */

/**
 * @typedef {Object} DischargeMedications
 * @property {Medication[]} medications
 * @property {YesNo} reconciliationCompleted
 * @property {string} reconciliationNotes
 * @property {YesNo} allergiesReviewed
 * @property {string} allergyNotes
 */

/**
 * @typedef {Object} FollowupAppointment
 * @property {string} provider
 * @property {string} date
 * @property {string} location
 * @property {string} purpose
 */

/**
 * @typedef {Object} FollowupArrangements
 * @property {FollowupAppointment[]} appointments
 * @property {YesNo} gpFollowupRequired
 * @property {string} gpFollowupTimeframe
 * @property {YesNo} outpatientFollowupRequired
 * @property {YesNo} investigationsPending
 * @property {string} pendingInvestigationDetails
 * @property {YesNo} resultsToBeChasedByGp
 */

/**
 * @typedef {Object} CommunityCareInstructions
 * @property {DischargeDestination} dischargeDestination
 * @property {string} otherDestinationDetails
 * @property {CareResponsibility} careResponsibility
 * @property {TransportMode} transportMode
 * @property {YesNo} districtNurseReferral
 * @property {YesNo} socialServicesReferral
 * @property {YesNo} physiotherapyReferral
 * @property {YesNo} occupationalTherapyReferral
 * @property {YesNo} packageOfCareInPlace
 * @property {string} mobilityStatus
 * @property {string} dietaryRequirements
 * @property {string} woundCareInstructions
 * @property {string} equipmentProvided
 */

/**
 * @typedef {Object} WarningSigns
 * @property {string[]} redFlagSymptoms
 * @property {string} whenToSeekHelp
 * @property {string} emergencyContactNumber
 * @property {YesNo} safetyNetingProvided
 * @property {YesNo} writtenInfoGiven
 */

/**
 * @typedef {Object} ClinicianSignoff
 * @property {string} clinicianName
 * @property {string} clinicianRole
 * @property {string} gmcNumber
 * @property {string} signoffDate
 * @property {string} bleepOrContact
 * @property {YesNo} responsibleConsultantInformed
 * @property {string} additionalNotes
 */

/**
 * @typedef {Object} PatientAcknowledgement
 * @property {YesNo} patientUnderstandsPlan
 * @property {YesNo} carerInformed
 * @property {string} carerName
 * @property {YesNo} medicationsExplained
 * @property {YesNo} writtenSummaryProvided
 * @property {YesNo} questionsAnswered
 * @property {string} acknowledgementDate
 * @property {string} signedBy
 */

/**
 * @typedef {Object} AssessmentData
 * @property {PatientDetails} patientDetails
 * @property {AdmissionSummary} admissionSummary
 * @property {Diagnoses} diagnoses
 * @property {ProceduresPerformed} proceduresPerformed
 * @property {DischargeMedications} dischargeMedications
 * @property {FollowupArrangements} followupArrangements
 * @property {CommunityCareInstructions} communityCareInstructions
 * @property {WarningSigns} warningSigns
 * @property {ClinicianSignoff} clinicianSignoff
 * @property {PatientAcknowledgement} patientAcknowledgement
 */

/**
 * @typedef {'complete' | 'partial' | 'incomplete'} CompletenessLevel
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {boolean} satisfied
 * @property {boolean} mandatory
 */

/**
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {'urgent' | 'high' | 'medium' | 'low'} priority
 */

/**
 * @typedef {Object} GradingResult
 * @property {CompletenessLevel} completenessLevel
 * @property {number} mandatorySatisfied
 * @property {number} mandatoryTotal
 * @property {number} optionalSatisfied
 * @property {number} optionalTotal
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.HospitalDischarge`.

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`; lists default to `[]`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    patientDetails: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sex: '',
      nhsNumber: '',
      hospitalNumber: '',
      address: '',
      postcode: '',
      phone: '',
      gpName: '',
      gpPractice: '',
      nextOfKinName: '',
      nextOfKinPhone: ''
    },
    admissionSummary: {
      admissionDate: '',
      dischargeDate: '',
      ward: '',
      consultant: '',
      specialty: '',
      reasonForAdmission: '',
      presentingComplaint: '',
      clinicalNarrative: ''
    },
    diagnoses: {
      diagnoses: []
    },
    proceduresPerformed: {
      procedures: [],
      noProceduresPerformed: ''
    },
    dischargeMedications: {
      medications: [],
      reconciliationCompleted: '',
      reconciliationNotes: '',
      allergiesReviewed: '',
      allergyNotes: ''
    },
    followupArrangements: {
      appointments: [],
      gpFollowupRequired: '',
      gpFollowupTimeframe: '',
      outpatientFollowupRequired: '',
      investigationsPending: '',
      pendingInvestigationDetails: '',
      resultsToBeChasedByGp: ''
    },
    communityCareInstructions: {
      dischargeDestination: '',
      otherDestinationDetails: '',
      careResponsibility: '',
      transportMode: '',
      districtNurseReferral: '',
      socialServicesReferral: '',
      physiotherapyReferral: '',
      occupationalTherapyReferral: '',
      packageOfCareInPlace: '',
      mobilityStatus: '',
      dietaryRequirements: '',
      woundCareInstructions: '',
      equipmentProvided: ''
    },
    warningSigns: {
      redFlagSymptoms: [],
      whenToSeekHelp: '',
      emergencyContactNumber: '',
      safetyNetingProvided: '',
      writtenInfoGiven: ''
    },
    clinicianSignoff: {
      clinicianName: '',
      clinicianRole: '',
      gmcNumber: '',
      signoffDate: '',
      bleepOrContact: '',
      responsibleConsultantInformed: '',
      additionalNotes: ''
    },
    patientAcknowledgement: {
      patientUnderstandsPlan: '',
      carerInformed: '',
      carerName: '',
      medicationsExplained: '',
      writtenSummaryProvided: '',
      questionsAnswered: '',
      acknowledgementDate: '',
      signedBy: ''
    }
  };
}

/** Compute length of stay (days) from admission and discharge dates. Returns null if invalid. */
function calculateLengthOfStay(admissionDate, dischargeDate) {
  if (!admissionDate || !dischargeDate) return null;
  const a = new Date(admissionDate);
  const d = new Date(dischargeDate);
  if (isNaN(a.getTime()) || isNaN(d.getTime())) return null;
  const ms = d.getTime() - a.getTime();
  if (ms < 0) return null;
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

/** Friendly label for a CompletenessLevel. */
function completenessLabel(level) {
  switch (level) {
    case 'complete': return 'Complete — safe to proceed';
    case 'partial': return 'Partial — may proceed with flag';
    case 'incomplete': return 'Incomplete — do not proceed';
    default: return '';
  }
}

/** CSS class hint for the completeness badge. */
function completenessClass(level) {
  switch (level) {
    case 'complete': return 'completeness-complete';
    case 'partial': return 'completeness-partial';
    case 'incomplete': return 'completeness-incomplete';
    default: return '';
  }
}

export { emptyAssessment, calculateLengthOfStay, completenessLabel, completenessClass };
