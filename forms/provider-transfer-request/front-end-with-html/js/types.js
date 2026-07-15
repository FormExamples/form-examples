// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Provider Transfer Request
// form. Publishes the empty-state factory and shared helpers used across the
// wizard.
//
// SBAR-aligned shape:
//   1 Requesting Provider Details
//   2 Receiving Provider Details
//   3 Patient Demographics
//   4 Situation        - Reason for Transfer
//   5 Background       - Relevant History
//   6 Assessment       - Current Clinical Status
//   7 Recommendation   - Requested Action
//   8 Transfer Logistics
//   9 Sign-off & Acknowledgement

/**
 * @typedef {'male' | 'female' | 'other' | 'unknown' | ''} Sex
 * @typedef {'yes' | 'no' | 'unknown' | ''} YesNoUnknown
 * @typedef {'routine' | 'urgent' | 'emergent' | ''} TransferUrgency
 * @typedef {'ward-to-ward' | 'inter-hospital' | 'inter-organisation' | 'community' | ''} TransferType
 * @typedef {'self' | 'wheelchair' | 'stretcher' | 'ambulance' | 'critical-care-transport' | ''} TransportMode
 * @typedef {'awake' | 'drowsy' | 'unresponsive' | ''} ConsciousLevel
 * @typedef {'urgent' | 'high' | 'medium' | 'low'} FlagPriority
 * @typedef {'complete' | 'partial' | 'incomplete'} CompletenessLevel
 */

/**
 * @typedef {Object} ProviderDetails
 * @property {string} clinicianName
 * @property {string} clinicianRole
 * @property {string} organisation
 * @property {string} ward
 * @property {string} phone
 * @property {string} email
 * @property {string} registrationBody
 * @property {string} registrationNumber
 */

/**
 * @typedef {Object} PatientDemographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 * @property {string} nhsNumber
 * @property {string} hospitalNumber
 * @property {string} addressLine
 * @property {string} postcode
 * @property {string} nextOfKinName
 * @property {string} nextOfKinPhone
 */

/**
 * @typedef {Object} Situation
 * @property {string} reasonForTransfer
 * @property {string} primaryDiagnosis
 * @property {TransferUrgency} urgency
 * @property {TransferType} transferType
 * @property {string} requestedDateTime
 */

/**
 * @typedef {Object} Background
 * @property {string} presentingComplaint
 * @property {string} relevantHistory
 * @property {string} pastMedicalHistory
 * @property {string} currentMedications
 * @property {string} allergies
 * @property {string} recentInvestigations
 * @property {string} infectionStatus
 */

/**
 * @typedef {Object} VitalSigns
 * @property {number|null} heartRate
 * @property {number|null} respiratoryRate
 * @property {number|null} systolicBloodPressure
 * @property {number|null} diastolicBloodPressure
 * @property {number|null} temperatureCelsius
 * @property {number|null} oxygenSaturation
 * @property {number|null} newsScore
 */

/**
 * @typedef {Object} Assessment
 * @property {string} currentClinicalStatus
 * @property {ConsciousLevel} consciousLevel
 * @property {VitalSigns} vitalSigns
 * @property {YesNoUnknown} clinicallyStable
 * @property {string} stabilityNotes
 */

/**
 * @typedef {Object} Recommendation
 * @property {string} requestedAction
 * @property {string} expectedOutcomes
 * @property {string} ongoingCarePlan
 * @property {string} pendingResults
 */

/**
 * @typedef {Object} TransferLogistics
 * @property {TransportMode} transportMode
 * @property {string} departureDateTime
 * @property {string} estimatedArrivalDateTime
 * @property {boolean} escortRequired
 * @property {string} escortDetails
 * @property {boolean} oxygenRequired
 * @property {boolean} cardiacMonitoringRequired
 * @property {boolean} infectiousPrecautions
 * @property {string} infectiousPrecautionsDetails
 * @property {boolean} fallsRisk
 * @property {boolean} mentalCapacityConcerns
 * @property {string} equipmentRequired
 */

/**
 * @typedef {Object} SignoffAcknowledgement
 * @property {string} requestingProviderSignature
 * @property {string} requestingProviderSignatureDate
 * @property {string} receivingProviderName
 * @property {string} receivingProviderSignature
 * @property {string} receivingProviderSignatureDate
 * @property {boolean} acknowledgementReceived
 * @property {string} acknowledgementNotes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {ProviderDetails} requestingProvider
 * @property {ProviderDetails} receivingProvider
 * @property {PatientDemographics} patientDemographics
 * @property {Situation} situation
 * @property {Background} background
 * @property {Assessment} assessment
 * @property {Recommendation} recommendation
 * @property {TransferLogistics} transferLogistics
 * @property {SignoffAcknowledgement} signoffAcknowledgement
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} section
 * @property {string} description
 * @property {boolean} mandatory
 */

/**
 * @typedef {Object} SectionCompleteness
 * @property {string} section
 * @property {number} required
 * @property {number} satisfied
 * @property {number} mandatoryRequired
 * @property {number} mandatorySatisfied
 * @property {FiredRule[]} missing
 */

/**
 * @typedef {Object} ValidationResult
 * @property {CompletenessLevel} completeness
 * @property {number} totalRequired
 * @property {number} totalSatisfied
 * @property {number} mandatoryRequired
 * @property {number} mandatorySatisfied
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

/** @returns {ProviderDetails} */
function emptyProviderDetails() {
  return {
    clinicianName: '',
    clinicianRole: '',
    organisation: '',
    ward: '',
    phone: '',
    email: '',
    registrationBody: '',
    registrationNumber: ''
  };
}

/** @returns {AssessmentData} */
function emptyAssessment() {
  return {
    requestingProvider: emptyProviderDetails(),
    receivingProvider: emptyProviderDetails(),
    patientDemographics: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sex: '',
      nhsNumber: '',
      hospitalNumber: '',
      addressLine: '',
      postcode: '',
      nextOfKinName: '',
      nextOfKinPhone: ''
    },
    situation: {
      reasonForTransfer: '',
      primaryDiagnosis: '',
      urgency: '',
      transferType: '',
      requestedDateTime: ''
    },
    background: {
      presentingComplaint: '',
      relevantHistory: '',
      pastMedicalHistory: '',
      currentMedications: '',
      allergies: '',
      recentInvestigations: '',
      infectionStatus: ''
    },
    assessment: {
      currentClinicalStatus: '',
      consciousLevel: '',
      vitalSigns: {
        heartRate: null,
        respiratoryRate: null,
        systolicBloodPressure: null,
        diastolicBloodPressure: null,
        temperatureCelsius: null,
        oxygenSaturation: null,
        newsScore: null
      },
      clinicallyStable: '',
      stabilityNotes: ''
    },
    recommendation: {
      requestedAction: '',
      expectedOutcomes: '',
      ongoingCarePlan: '',
      pendingResults: ''
    },
    transferLogistics: {
      transportMode: '',
      departureDateTime: '',
      estimatedArrivalDateTime: '',
      escortRequired: false,
      escortDetails: '',
      oxygenRequired: false,
      cardiacMonitoringRequired: false,
      infectiousPrecautions: false,
      infectiousPrecautionsDetails: '',
      fallsRisk: false,
      mentalCapacityConcerns: false,
      equipmentRequired: ''
    },
    signoffAcknowledgement: {
      requestingProviderSignature: '',
      requestingProviderSignatureDate: '',
      receivingProviderName: '',
      receivingProviderSignature: '',
      receivingProviderSignatureDate: '',
      acknowledgementReceived: false,
      acknowledgementNotes: ''
    }
  };
}

/** True if a string is non-empty after trimming. */
function hasText(s) {
  return typeof s === 'string' && s.trim() !== '';
}

/** True if a Yes/No/Unknown field has been answered. */
function isYesNoUnknownAnswered(value) {
  return value === 'yes' || value === 'no' || value === 'unknown';
}

/** True if a value is a finite number (not null and not NaN). */
function hasNumber(v) {
  return typeof v === 'number' && Number.isFinite(v);
}

/** True if any field on the receiving-provider acknowledgement has been touched. */
function acknowledgementStarted(data) {
  const a = data.signoffAcknowledgement;
  return (
    hasText(a.receivingProviderName) ||
    hasText(a.receivingProviderSignature) ||
    hasText(a.receivingProviderSignatureDate) ||
    a.acknowledgementReceived === true ||
    hasText(a.acknowledgementNotes)
  );
}

/** @param {string} section */
function sectionLabel(section) {
  switch (section) {
    case 'requestingProvider': return 'Requesting Provider';
    case 'receivingProvider': return 'Receiving Provider';
    case 'patientDemographics': return 'Patient Demographics';
    case 'situation': return 'Situation';
    case 'background': return 'Background';
    case 'assessment': return 'Assessment';
    case 'recommendation': return 'Recommendation';
    case 'transferLogistics': return 'Transfer Logistics';
    case 'signoffAcknowledgement': return 'Sign-off & Acknowledgement';
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

/** @param {CompletenessLevel} level */
function completenessLabel(level) {
  switch (level) {
    case 'complete': return 'Complete';
    case 'partial': return 'Partial';
    case 'incomplete': return 'Incomplete';
    default: return '';
  }
}

export { emptyAssessment, emptyProviderDetails, hasText, isYesNoUnknownAnswered, hasNumber, acknowledgementStarted, sectionLabel, priorityLabel, completenessLabel };
