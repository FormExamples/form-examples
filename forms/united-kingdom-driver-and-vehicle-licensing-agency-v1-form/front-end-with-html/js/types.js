// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the DVLA V1 form. This file
// publishes the empty-state factory and a few shared helpers used across
// the wizard.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'yes-without-correction' | 'yes-with-correction' | 'no' | ''} EyesightStandard
 * @typedef {'left' | 'right' | ''} WhichEye
 * @typedef {'both' | 'left' | 'right' | ''} WhichEyes
 * @typedef {'since-birth-or-childhood' | 'health-or-injury' | ''} MonocularDuration
 * @typedef {'adapted-advised' | 'adapted-self' | 'not-adapted' | ''} MonocularAdaptation
 * @typedef {'brain-tumour' | 'head-injury' | 'stroke' | 'other' | ''} VisualFieldCause
 * @typedef {'email' | 'sms' | ''} ContactPreference
 * @typedef {'urgent' | 'high' | 'medium' | 'low'} FlagPriority
 */

/**
 * @typedef {Object} PersonalDetails
 * @property {string} title
 * @property {string} fullName
 * @property {string} dateOfBirth
 * @property {string} address
 * @property {string} postcode
 * @property {string} email
 * @property {string} contactNumber
 * @property {string} changeOfDetails
 */

/**
 * @typedef {Object} GpDetails
 * @property {string} name
 * @property {string} surgeryName
 * @property {string} address
 * @property {string} town
 * @property {string} postcode
 * @property {string} contactNumber
 * @property {string} email
 * @property {string} dateLastSeen
 */

/**
 * @typedef {Object} ConsultantDetails
 * @property {string} name
 * @property {string} speciality
 * @property {string} department
 * @property {string} hospitalName
 * @property {string} address
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
 * @typedef {Object} EyesightStandards
 * @property {EyesightStandard} meetsStandard
 *
 * @typedef {Object} VisionInBothEyes
 * @property {YesNo} hasVisionInBothEyes
 * @property {WhichEye} whichEye
 * @property {MonocularDuration} duration
 * @property {MonocularAdaptation} adaptation
 * @property {boolean} monocularDeclarationConfirmed
 *
 * @typedef {Object} FieldOfVision
 * @property {YesNo} hasProblem
 * @property {YesNo} causedSolelyByEyeCondition
 * @property {VisualFieldCause} cause
 * @property {string} causeOtherDetails
 *
 * @typedef {Object} Glaucoma
 * @property {YesNo} hasCondition
 * @property {WhichEyes} whichEyes
 *
 * @typedef {Object} RetinitisPigmentosa
 * @property {YesNo} hasCondition
 * @property {WhichEyes} whichEyes
 *
 * @typedef {Object} LaserTreatment
 * @property {YesNo} hasHadTreatment
 * @property {string} leftEyeFirstDate
 * @property {string} rightEyeFirstDate
 * @property {string} leftEyeLastDate
 * @property {string} rightEyeLastDate
 *
 * @typedef {Object} Blepharospasm
 * @property {YesNo} hasCondition
 * @property {WhichEyes} whichEyes
 * @property {YesNo} hasHadTreatment
 * @property {YesNo} adequatelyControlled
 *
 * @typedef {Object} NightBlindness
 * @property {YesNo} hasCondition
 * @property {WhichEyes} whichEyes
 *
 * @typedef {Object} DoubleVision
 * @property {YesNo} hasCondition
 * @property {YesNo} controlled
 * @property {YesNo} sameForSixMonthsOrMore
 * @property {boolean} doubleVisionDeclarationConfirmed
 * @property {string} declarationSignatureName
 * @property {string} declarationDate
 *
 * @typedef {Object} OtherVisionConditions
 * @property {YesNo} hasOther
 * @property {string} details
 *
 * @typedef {Object} RecentContact
 * @property {YesNo} hadContact
 * @property {string} dateOfContact
 *
 * @typedef {Object} Authorisation
 * @property {boolean} declarationConfirmed
 * @property {string} name
 * @property {string} signature
 * @property {string} date
 * @property {YesNo} authoriseElectronicCorrespondence
 * @property {ContactPreference} contactPreferenceFromHealthcareProfessional
 * @property {ContactPreference} contactPreferenceFromDvla
 */

/**
 * @typedef {Object} AssessmentData
 * @property {PersonalDetails} personalDetails
 * @property {HealthcareProfessionals} healthcareProfessionals
 * @property {EyesightStandards} eyesightStandards
 * @property {VisionInBothEyes} visionInBothEyes
 * @property {FieldOfVision} fieldOfVision
 * @property {Glaucoma} glaucoma
 * @property {RetinitisPigmentosa} retinitisPigmentosa
 * @property {LaserTreatment} laserTreatment
 * @property {Blepharospasm} blepharospasm
 * @property {NightBlindness} nightBlindness
 * @property {DoubleVision} doubleVision
 * @property {OtherVisionConditions} otherVisionConditions
 * @property {RecentContact} recentContact
 * @property {Authorisation} authorisation
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} section
 * @property {string} description
 * @property {string} message
 *
 * @typedef {Object} SectionCompleteness
 * @property {string} section
 * @property {number} required
 * @property {number} satisfied
 * @property {FiredRule[]} missing
 *
 * @typedef {Object} ValidationResult
 * @property {boolean} complete
 * @property {number} totalRequired
 * @property {number} totalSatisfied
 * @property {SectionCompleteness[]} sections
 * @property {FiredRule[]} missing
 *
 * @typedef {Object} FlaggedIssue
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {FlagPriority} priority
 */

/** @returns {AssessmentData} */
function emptyAssessment() {
  return {
    personalDetails: {
      title: '',
      fullName: '',
      dateOfBirth: '',
      address: '',
      postcode: '',
      email: '',
      contactNumber: '',
      changeOfDetails: ''
    },
    healthcareProfessionals: {
      gp: {
        name: '',
        surgeryName: '',
        address: '',
        town: '',
        postcode: '',
        contactNumber: '',
        email: '',
        dateLastSeen: ''
      },
      consultant: {
        name: '',
        speciality: '',
        department: '',
        hospitalName: '',
        address: '',
        town: '',
        postcode: '',
        contactNumber: '',
        email: '',
        dateLastSeen: ''
      }
    },
    eyesightStandards: {
      meetsStandard: ''
    },
    visionInBothEyes: {
      hasVisionInBothEyes: '',
      whichEye: '',
      duration: '',
      adaptation: '',
      monocularDeclarationConfirmed: false
    },
    fieldOfVision: {
      hasProblem: '',
      causedSolelyByEyeCondition: '',
      cause: '',
      causeOtherDetails: ''
    },
    glaucoma: {
      hasCondition: '',
      whichEyes: ''
    },
    retinitisPigmentosa: {
      hasCondition: '',
      whichEyes: ''
    },
    laserTreatment: {
      hasHadTreatment: '',
      leftEyeFirstDate: '',
      rightEyeFirstDate: '',
      leftEyeLastDate: '',
      rightEyeLastDate: ''
    },
    blepharospasm: {
      hasCondition: '',
      whichEyes: '',
      hasHadTreatment: '',
      adequatelyControlled: ''
    },
    nightBlindness: {
      hasCondition: '',
      whichEyes: ''
    },
    doubleVision: {
      hasCondition: '',
      controlled: '',
      sameForSixMonthsOrMore: '',
      doubleVisionDeclarationConfirmed: false,
      declarationSignatureName: '',
      declarationDate: ''
    },
    otherVisionConditions: {
      hasOther: '',
      details: ''
    },
    recentContact: {
      hadContact: '',
      dateOfContact: ''
    },
    authorisation: {
      declarationConfirmed: false,
      name: '',
      signature: '',
      date: '',
      authoriseElectronicCorrespondence: '',
      contactPreferenceFromHealthcareProfessional: '',
      contactPreferenceFromDvla: ''
    }
  };
}

function hasText(s) {
  return typeof s === 'string' && s.trim() !== '';
}
function isYesNoAnswered(v) {
  return v === 'yes' || v === 'no';
}

// ── Branch-active helpers (mirror Svelte utils.ts) ────────────────────
function isMonocularBranchActive(d)            { return d.visionInBothEyes.hasVisionInBothEyes === 'no'; }
function isVisualFieldBranchActive(d)          { return d.fieldOfVision.hasProblem === 'yes'; }
function isVisualFieldCauseBranchActive(d) {
  return d.fieldOfVision.hasProblem === 'yes' &&
         d.fieldOfVision.causedSolelyByEyeCondition === 'no';
}
function isGlaucomaBranchActive(d)             { return d.glaucoma.hasCondition === 'yes'; }
function isRetinitisPigmentosaBranchActive(d)  { return d.retinitisPigmentosa.hasCondition === 'yes'; }
function isLaserTreatmentBranchActive(d)       { return d.laserTreatment.hasHadTreatment === 'yes'; }
function isBlepharospasmBranchActive(d)        { return d.blepharospasm.hasCondition === 'yes'; }
function isNightBlindnessBranchActive(d)       { return d.nightBlindness.hasCondition === 'yes'; }
function isDoubleVisionBranchActive(d)         { return d.doubleVision.hasCondition === 'yes'; }
function isOtherVisionBranchActive(d)          { return d.otherVisionConditions.hasOther === 'yes'; }
function isRecentContactBranchActive(d)        { return d.recentContact.hadContact === 'yes'; }

function sectionLabel(section) {
  switch (section) {
    case 'personalDetails':         return 'Personal Details';
    case 'healthcareProfessionals': return 'Healthcare Professionals';
    case 'eyesightStandards':       return 'Eyesight Standards (Q1)';
    case 'visionInBothEyes':        return 'Vision in Both Eyes (Q2)';
    case 'fieldOfVision':           return 'Field of Vision (Q3)';
    case 'glaucoma':                return 'Glaucoma (Q4)';
    case 'retinitisPigmentosa':     return 'Retinitis Pigmentosa (Q5)';
    case 'laserTreatment':          return 'Laser Treatment (Q6)';
    case 'blepharospasm':           return 'Blepharospasm (Q7)';
    case 'nightBlindness':          return 'Night Blindness (Q8)';
    case 'doubleVision':            return 'Double Vision (Q9)';
    case 'otherVisionConditions':   return 'Other Vision Conditions (Q10)';
    case 'recentContact':           return 'Recent Contact (Q11)';
    case 'authorisation':           return 'Authorisation';
    default: return section;
  }
}

function priorityLabel(priority) {
  switch (priority) {
    case 'urgent': return 'Urgent';
    case 'high':   return 'High';
    case 'medium': return 'Medium';
    case 'low':    return 'Low';
    default:       return '';
  }
}

export { emptyAssessment, hasText, isYesNoAnswered, isMonocularBranchActive, isVisualFieldBranchActive, isVisualFieldCauseBranchActive, isGlaucomaBranchActive, isRetinitisPigmentosaBranchActive, isLaserTreatmentBranchActive, isBlepharospasmBranchActive, isNightBlindnessBranchActive, isDoubleVisionBranchActive, isOtherVisionBranchActive, isRecentContactBranchActive, sectionLabel, priorityLabel };
