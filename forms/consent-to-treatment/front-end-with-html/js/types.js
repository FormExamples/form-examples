// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Consent To Treatment form.
//
// This file builds and exports the canonical empty AssessmentData shape used
// by the wizard, so that newly-added fields automatically default correctly
// when older saved state is rehydrated from localStorage.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'general' | 'regional' | 'local' | 'sedation' | 'none' | ''} AnesthesiaType
 */

/**
 * @typedef {Object} PatientInformation
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dob
 * @property {Sex} sex
 * @property {string} nhsNumber
 * @property {string} address
 * @property {string} phone
 * @property {string} emergencyContact
 * @property {string} emergencyContactPhone
 */

/**
 * @typedef {Object} ProcedureDetails
 * @property {string} procedureName
 * @property {string} procedureDescription
 * @property {string} treatingClinician
 * @property {string} department
 * @property {string} scheduledDate
 * @property {string} estimatedDuration
 * @property {YesNo} admissionRequired
 */

/**
 * @typedef {Object} RisksBenefits
 * @property {string} commonRisks
 * @property {string} seriousRisks
 * @property {string} expectedBenefits
 * @property {string} successRate
 * @property {string} recoveryPeriod
 */

/**
 * @typedef {Object} AlternativeTreatments
 * @property {string} alternativeOptions
 * @property {string} noTreatmentConsequences
 * @property {string} patientPreference
 */

/**
 * @typedef {Object} AnesthesiaInformation
 * @property {AnesthesiaType} anesthesiaType
 * @property {string} anesthesiaRisks
 * @property {YesNo} previousAnesthesiaProblems
 * @property {string} previousAnesthesiaDetails
 * @property {string} fastingInstructions
 */

/**
 * @typedef {Object} QuestionsUnderstanding
 * @property {string} questionsAsked
 * @property {YesNo} understandsProcedure
 * @property {YesNo} understandsRisks
 * @property {YesNo} understandsAlternatives
 * @property {YesNo} understandsRecovery
 * @property {string} additionalConcerns
 */

/**
 * @typedef {Object} PatientRights
 * @property {YesNo} rightToWithdraw
 * @property {YesNo} rightToSecondOpinion
 * @property {YesNo} informedVoluntarily
 * @property {YesNo} noGuaranteeAcknowledged
 */

/**
 * @typedef {Object} SignatureConsent
 * @property {YesNo} patientConsent
 * @property {string} signatureDate
 * @property {string} witnessName
 * @property {string} witnessRole
 * @property {string} witnessSignatureDate
 * @property {string} clinicianName
 * @property {string} clinicianRole
 * @property {string} clinicianSignatureDate
 * @property {YesNo} interpreterUsed
 * @property {string} interpreterName
 */

/**
 * @typedef {Object} AssessmentData
 * @property {PatientInformation} patientInformation
 * @property {ProcedureDetails} procedureDetails
 * @property {RisksBenefits} risksBenefits
 * @property {AlternativeTreatments} alternativeTreatments
 * @property {AnesthesiaInformation} anesthesiaInformation
 * @property {QuestionsUnderstanding} questionsUnderstanding
 * @property {PatientRights} patientRights
 * @property {SignatureConsent} signatureConsent
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} section
 * @property {string} description
 * @property {string} field
 */

/**
 * @typedef {Object} AdditionalFlag
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {'high' | 'medium' | 'low'} priority
 */

/**
 * @typedef {Object} GradingResult
 * @property {number} completenessPercent
 * @property {'Complete' | 'Incomplete'} status
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

  

  /** @returns {AssessmentData} */
  function emptyAssessment() {
    return {
      patientInformation: {
        firstName: '',
        lastName: '',
        dob: '',
        sex: '',
        nhsNumber: '',
        address: '',
        phone: '',
        emergencyContact: '',
        emergencyContactPhone: ''
      },
      procedureDetails: {
        procedureName: '',
        procedureDescription: '',
        treatingClinician: '',
        department: '',
        scheduledDate: '',
        estimatedDuration: '',
        admissionRequired: ''
      },
      risksBenefits: {
        commonRisks: '',
        seriousRisks: '',
        expectedBenefits: '',
        successRate: '',
        recoveryPeriod: ''
      },
      alternativeTreatments: {
        alternativeOptions: '',
        noTreatmentConsequences: '',
        patientPreference: ''
      },
      anesthesiaInformation: {
        anesthesiaType: '',
        anesthesiaRisks: '',
        previousAnesthesiaProblems: '',
        previousAnesthesiaDetails: '',
        fastingInstructions: ''
      },
      questionsUnderstanding: {
        questionsAsked: '',
        understandsProcedure: '',
        understandsRisks: '',
        understandsAlternatives: '',
        understandsRecovery: '',
        additionalConcerns: ''
      },
      patientRights: {
        rightToWithdraw: '',
        rightToSecondOpinion: '',
        informedVoluntarily: '',
        noGuaranteeAcknowledged: ''
      },
      signatureConsent: {
        patientConsent: '',
        signatureDate: '',
        witnessName: '',
        witnessRole: '',
        witnessSignatureDate: '',
        clinicianName: '',
        clinicianRole: '',
        clinicianSignatureDate: '',
        interpreterUsed: '',
        interpreterName: ''
      }
    };
  }

  /** @param {number} completed @param {number} total */
  function completenessPercent(completed, total) {
    if (total === 0) return 100;
    return Math.round((completed / total) * 100);
  }

  /** @param {number} completeness */
  function validationStatus(completeness) {
    return completeness === 100 ? 'Complete' : 'Incomplete';
  }

  /** @param {number} completeness */
  function completenessLabel(completeness) {
    return completeness + '% Complete';
  }

  /** @param {number} completeness */
  function completenessClass(completeness) {
    if (completeness === 100) return 'status-complete';
    if (completeness >= 75) return 'status-near';
    if (completeness >= 50) return 'status-half';
    if (completeness >= 25) return 'status-low';
    return 'status-empty';
  }

  
  
  
  
  

export { emptyAssessment, completenessPercent, validationStatus, completenessLabel, completenessClass };
