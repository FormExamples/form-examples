// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the WHO Counter-Referral Form.
//
// This file deliberately exports only the `emptyAssessment()` builder; the
// JSDoc typedefs let other modules reference the canonical shape of the
// counter-referral data.

/** @typedef {'yes' | 'no' | ''} YesNo */
/** @typedef {'male' | 'female' | 'unknown' | ''} Sex */
/** @typedef {'yes' | 'no' | 'unknown' | ''} PregnancyStatus */
/** @typedef {'acute' | 'non-acute' | ''} Acuity */
/**
 * @typedef {'urgent-within-24-hours' | '2-to-6-days' | '1-to-2-weeks' |
 *           'more-than-2-weeks' | ''} FollowUpTimeframe
 */

/**
 * @typedef {Object} EmergencyContact
 * @property {string} name
 * @property {string} contactInformation
 */

/**
 * @typedef {Object} PatientIdentification
 * @property {string} patientName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {string} patientContact
 * @property {EmergencyContact} emergencyContact
 */

/**
 * @typedef {Object} FacilityContact
 * @property {string} name
 * @property {string} focalPoint
 * @property {string} phoneNumber
 */

/**
 * @typedef {Object} FacilityCommunication
 * @property {boolean} discussedWithPrimaryCareProvider
 * @property {boolean} discussedWithInitiatingFacility
 */

/**
 * @typedef {Object} FacilityDetails
 * @property {FacilityContact} initiatingFacility
 * @property {string} referralDate
 * @property {string} referralReason
 * @property {Acuity} acuity
 * @property {FacilityContact} referralFacility
 * @property {FacilityCommunication} communication
 * @property {FacilityContact} primaryCareFacility
 * @property {FollowUpTimeframe} followUpTimeframe
 */

/**
 * @typedef {Object} Situation
 * @property {string} chiefComplaint
 * @property {string} primaryDiagnosis
 * @property {PregnancyStatus} pregnant
 * @property {string} treatmentsInitiated
 * @property {boolean} icuStay
 * @property {boolean} surgery
 * @property {boolean} hospitalized
 */

/**
 * @typedef {Object} Background
 * @property {string} historyOfPresentIllness
 * @property {string} pastMedicalHistory
 * @property {string} significantEvents
 */

/**
 * @typedef {Object} Assessment
 * @property {string} finalDiagnoses
 * @property {string} prognosisAndGoalsOfCare
 * @property {YesNo} patientFamilyInformed
 * @property {string} informedExplanation
 */

/**
 * @typedef {Object} StatusFlags
 * @property {boolean} cognitiveImpairment
 * @property {boolean} carerDependent
 * @property {boolean} spinalPrecautions
 * @property {boolean} weightBearingRestrictions
 * @property {boolean} palliativeCare
 */

/**
 * @typedef {Object} Recommendations
 * @property {string} followUpPlan
 * @property {string} pendingInvestigations
 * @property {string} followUpArrangements
 * @property {string} deteriorationInstructions
 * @property {string} contactName
 * @property {string} contactInformation
 * @property {StatusFlags} statusFlags
 */

/**
 * @typedef {Object} ProviderSignOff
 * @property {string} providerName
 * @property {string} signature
 * @property {string} signatureDate
 */

/**
 * @typedef {Object} AssessmentData
 * @property {PatientIdentification} patientIdentification
 * @property {FacilityDetails} facilityDetails
 * @property {Situation} situation
 * @property {Background} background
 * @property {Assessment} assessment
 * @property {Recommendations} recommendations
 * @property {ProviderSignOff} providerSignOff
 */

/**
 * @typedef {'patientIdentification' | 'facilityDetails' | 'situation' |
 *           'background' | 'assessment' | 'recommendations' |
 *           'providerSignOff'} SectionKey
 */

/**
 * @typedef {Object} ValidationRule
 * @property {string} id
 * @property {SectionKey} section
 * @property {string} description
 * @property {(d: AssessmentData) => boolean} applies
 * @property {(d: AssessmentData) => boolean} isSatisfied
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {SectionKey} section
 * @property {string} description
 */

/**
 * @typedef {Object} SectionCompleteness
 * @property {SectionKey} section
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

/** @typedef {'urgent' | 'high' | 'medium' | 'low'} FlagPriority */

/**
 * @typedef {Object} FlaggedIssue
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {FlagPriority} priority
 */

/**
 * Build a fresh, fully-blank counter-referral form.
 * Strings default to `''`; booleans default to `false`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    patientIdentification: {
      patientName: '',
      dateOfBirth: '',
      sex: '',
      patientContact: '',
      emergencyContact: {
        name: '',
        contactInformation: ''
      }
    },
    facilityDetails: {
      initiatingFacility: { name: '', focalPoint: '', phoneNumber: '' },
      referralDate: '',
      referralReason: '',
      acuity: '',
      referralFacility: { name: '', focalPoint: '', phoneNumber: '' },
      communication: {
        discussedWithPrimaryCareProvider: false,
        discussedWithInitiatingFacility: false
      },
      primaryCareFacility: { name: '', focalPoint: '', phoneNumber: '' },
      followUpTimeframe: ''
    },
    situation: {
      chiefComplaint: '',
      primaryDiagnosis: '',
      pregnant: '',
      treatmentsInitiated: '',
      icuStay: false,
      surgery: false,
      hospitalized: false
    },
    background: {
      historyOfPresentIllness: '',
      pastMedicalHistory: '',
      significantEvents: ''
    },
    assessment: {
      finalDiagnoses: '',
      prognosisAndGoalsOfCare: '',
      patientFamilyInformed: '',
      informedExplanation: ''
    },
    recommendations: {
      followUpPlan: '',
      pendingInvestigations: '',
      followUpArrangements: '',
      deteriorationInstructions: '',
      contactName: '',
      contactInformation: '',
      statusFlags: {
        cognitiveImpairment: false,
        carerDependent: false,
        spinalPrecautions: false,
        weightBearingRestrictions: false,
        palliativeCare: false
      }
    },
    providerSignOff: {
      providerName: '',
      signature: '',
      signatureDate: ''
    }
  };
}

/** True if a string is non-empty after trimming. */
function hasText(s) {
  return typeof s === 'string' && s.trim() !== '';
}

/** True if a Yes/No field has been answered (either yes or no). */
function isYesNoAnswered(value) {
  return value === 'yes' || value === 'no';
}

/** True if any one of a set of boolean status flags is set. */
function hasAnyStatusFlag(data) {
  const f = data.recommendations.statusFlags;
  return (
    f.cognitiveImpairment ||
    f.carerDependent ||
    f.spinalPrecautions ||
    f.weightBearingRestrictions ||
    f.palliativeCare
  );
}

/** Human-readable label for a section key. */
function sectionLabel(section) {
  switch (section) {
    case 'patientIdentification': return 'Patient Identification';
    case 'facilityDetails': return 'Facility Details';
    case 'situation': return 'Situation';
    case 'background': return 'Background';
    case 'assessment': return 'Assessment';
    case 'recommendations': return 'Recommendations';
    case 'providerSignOff': return 'Provider Sign-off';
    default: return String(section);
  }
}

/** Human-readable label for a flag priority. */
function priorityLabel(priority) {
  switch (priority) {
    case 'urgent': return 'Urgent';
    case 'high': return 'High';
    case 'medium': return 'Medium';
    case 'low': return 'Low';
    default: return String(priority);
  }
}

export { emptyAssessment, hasText, isYesNoAnswered, hasAnyStatusFlag, sectionLabel, priorityLabel };
