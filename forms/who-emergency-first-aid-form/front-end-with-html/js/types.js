// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the WHO Emergency First Aid Form.
// Publishes the empty-state factory and shared helper utilities used across
// the wizard, validator, and flagged-issues engines.

/**
 * @typedef {'yes' | 'no' | 'unknown' | ''} YesNoUnknown
 * @typedef {'male' | 'female' | 'unknown' | ''} Sex
 * @typedef {'urgent' | 'high' | 'medium' | 'low'} FlagPriority
 */

/**
 * @typedef {Object} ContactPerson
 * @property {string} name
 * @property {string} contactInformation
 */

/**
 * @typedef {Object} PatientIdentification
 * @property {string} patientName
 * @property {string} dateOfBirth
 * @property {number|null} age
 * @property {Sex} sex
 * @property {string} patientContactInformation
 * @property {ContactPerson} contactPerson
 */

/**
 * @typedef {Object} ReferralFacility
 * @property {string} name
 * @property {string} focalPoint
 * @property {string} phoneNumber
 *
 * @typedef {Object} AmbulanceService
 * @property {string} name
 * @property {string} focalPoint
 * @property {string} phoneNumber
 *
 * @typedef {Object} ReferralTransport
 * @property {ReferralFacility} referralFacility
 * @property {AmbulanceService} ambulance
 * @property {string} eventDateTime
 * @property {string} departureDateTime
 */

/**
 * @typedef {Object} Situation
 * @property {boolean} medical
 * @property {boolean} trauma
 * @property {YesNoUnknown} pregnant
 * @property {string} whatHappened
 *
 * @typedef {Object} Background
 * @property {string} pastMedicalAndSurgicalHistory
 * @property {string} currentMedicationsOrAllergies
 */

/**
 * @typedef {Object} MajorBleedingInterventions
 * @property {boolean} directPressure
 * @property {boolean} deepWoundPacking
 * @property {boolean} tourniquet
 * @property {string} tourniquetApplicationTime
 * @property {boolean} uterineMassage
 * @property {boolean} none
 *
 * @typedef {Object} MajorBleeding
 * @property {boolean} assessmentNormal
 * @property {string} assessmentFindings
 * @property {MajorBleedingInterventions} interventions
 */

/**
 * @typedef {Object} AirwayInterventions
 * @property {boolean} neckImmobilization
 * @property {boolean} headTiltChinLift
 * @property {boolean} jawThrust
 * @property {boolean} chokingCare
 * @property {boolean} none
 *
 * @typedef {Object} Airway
 * @property {boolean} assessmentNormal
 * @property {string} assessmentFindings
 * @property {AirwayInterventions} interventions
 */

/**
 * @typedef {Object} BreathingInterventions
 * @property {boolean} maintainedPositionOfComfort
 * @property {boolean} none
 *
 * @typedef {Object} Breathing
 * @property {boolean} assessmentNormal
 * @property {string} assessmentFindings
 * @property {BreathingInterventions} interventions
 */

/**
 * @typedef {Object} CirculationInterventions
 * @property {boolean} pelvicBinder
 * @property {boolean} controlMinorBleeding
 * @property {boolean} fractureCare
 * @property {boolean} oralHydration
 * @property {boolean} leftLateralPosition
 * @property {boolean} none
 *
 * @typedef {Object} Circulation
 * @property {boolean} assessmentNormal
 * @property {string} assessmentFindings
 * @property {CirculationInterventions} interventions
 */

/**
 * @typedef {Object} DisabilityInterventions
 * @property {boolean} spinalImmobilisation
 * @property {boolean} glucoseGiven
 * @property {boolean} seizureCare
 * @property {boolean} highTemperatureCare
 * @property {boolean} lowTemperatureCare
 * @property {boolean} none
 *
 * @typedef {Object} Disability
 * @property {boolean} assessmentNormal
 * @property {string} assessmentFindings
 * @property {DisabilityInterventions} interventions
 */

/**
 * @typedef {Object} ExposureInterventions
 * @property {boolean} recoveryPosition
 * @property {boolean} burnCare
 * @property {boolean} woundCare
 * @property {boolean} drowningCare
 * @property {boolean} snakebiteCare
 * @property {boolean} none
 *
 * @typedef {Object} Exposure
 * @property {boolean} assessmentNormal
 * @property {string} assessmentFindings
 * @property {ExposureInterventions} interventions
 * @property {boolean} medicationTakenNone
 * @property {string} medicationTakenDetails
 */

/**
 * @typedef {Object} Precautions
 * @property {boolean} highlyInfectiousDisease
 * @property {boolean} spinalImmobilization
 * @property {boolean} possibleFracture
 * @property {boolean} fallRisk
 * @property {boolean} alteredMentalStatus
 * @property {boolean} other
 * @property {string} otherDetails
 *
 * @typedef {Object} Recommendations
 * @property {string} transportPlan
 * @property {string} problemsAnticipated
 * @property {string} otherConcerns
 * @property {Precautions} precautions
 *
 * @typedef {Object} ResponderDetails
 * @property {string} name
 * @property {string} signature
 * @property {string} contactInformation
 * @property {string} cfarOrganization
 */

/**
 * @typedef {Object} AssessmentData
 * @property {PatientIdentification} patientIdentification
 * @property {ReferralTransport} referralTransport
 * @property {Situation} situation
 * @property {Background} background
 * @property {MajorBleeding} majorBleeding
 * @property {Airway} airway
 * @property {Breathing} breathing
 * @property {Circulation} circulation
 * @property {Disability} disability
 * @property {Exposure} exposure
 * @property {Recommendations} recommendations
 * @property {ResponderDetails} responderDetails
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} section
 * @property {string} description
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
    patientIdentification: {
      patientName: '',
      dateOfBirth: '',
      age: null,
      sex: '',
      patientContactInformation: '',
      contactPerson: { name: '', contactInformation: '' }
    },
    referralTransport: {
      referralFacility: { name: '', focalPoint: '', phoneNumber: '' },
      ambulance: { name: '', focalPoint: '', phoneNumber: '' },
      eventDateTime: '',
      departureDateTime: ''
    },
    situation: {
      medical: false,
      trauma: false,
      pregnant: '',
      whatHappened: ''
    },
    background: {
      pastMedicalAndSurgicalHistory: '',
      currentMedicationsOrAllergies: ''
    },
    majorBleeding: {
      assessmentNormal: false,
      assessmentFindings: '',
      interventions: {
        directPressure: false,
        deepWoundPacking: false,
        tourniquet: false,
        tourniquetApplicationTime: '',
        uterineMassage: false,
        none: false
      }
    },
    airway: {
      assessmentNormal: false,
      assessmentFindings: '',
      interventions: {
        neckImmobilization: false,
        headTiltChinLift: false,
        jawThrust: false,
        chokingCare: false,
        none: false
      }
    },
    breathing: {
      assessmentNormal: false,
      assessmentFindings: '',
      interventions: {
        maintainedPositionOfComfort: false,
        none: false
      }
    },
    circulation: {
      assessmentNormal: false,
      assessmentFindings: '',
      interventions: {
        pelvicBinder: false,
        controlMinorBleeding: false,
        fractureCare: false,
        oralHydration: false,
        leftLateralPosition: false,
        none: false
      }
    },
    disability: {
      assessmentNormal: false,
      assessmentFindings: '',
      interventions: {
        spinalImmobilisation: false,
        glucoseGiven: false,
        seizureCare: false,
        highTemperatureCare: false,
        lowTemperatureCare: false,
        none: false
      }
    },
    exposure: {
      assessmentNormal: false,
      assessmentFindings: '',
      interventions: {
        recoveryPosition: false,
        burnCare: false,
        woundCare: false,
        drowningCare: false,
        snakebiteCare: false,
        none: false
      },
      medicationTakenNone: false,
      medicationTakenDetails: ''
    },
    recommendations: {
      transportPlan: '',
      problemsAnticipated: '',
      otherConcerns: '',
      precautions: {
        highlyInfectiousDisease: false,
        spinalImmobilization: false,
        possibleFracture: false,
        fallRisk: false,
        alteredMentalStatus: false,
        other: false,
        otherDetails: ''
      }
    },
    responderDetails: {
      name: '',
      signature: '',
      contactInformation: '',
      cfarOrganization: ''
    }
  };
}

// ── Shared helpers ────────────────────────────────────────────────

/** True if a string is non-empty after trimming. */
function hasText(s) {
  return typeof s === 'string' && s.trim() !== '';
}

/** Calculate age (years) from a date-of-birth string; null on invalid input. */
function calculateAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

/**
 * For a CABCDE category, the assessment is "answered" when either the Normal
 * checkbox is ticked or the free-text findings have been filled in.
 */
function isAssessmentAnswered(section) {
  return !!section && (section.assessmentNormal || hasText(section.assessmentFindings));
}

function hasAnyMajorBleedingIntervention(s) {
  const i = s.interventions;
  return i.directPressure || i.deepWoundPacking || i.tourniquet || i.uterineMassage || i.none;
}
function hasAnyAirwayIntervention(s) {
  const i = s.interventions;
  return i.neckImmobilization || i.headTiltChinLift || i.jawThrust || i.chokingCare || i.none;
}
function hasAnyBreathingIntervention(s) {
  const i = s.interventions;
  return i.maintainedPositionOfComfort || i.none;
}
function hasAnyCirculationIntervention(s) {
  const i = s.interventions;
  return i.pelvicBinder || i.controlMinorBleeding || i.fractureCare ||
    i.oralHydration || i.leftLateralPosition || i.none;
}
function hasAnyDisabilityIntervention(s) {
  const i = s.interventions;
  return i.spinalImmobilisation || i.glucoseGiven || i.seizureCare ||
    i.highTemperatureCare || i.lowTemperatureCare || i.none;
}
function hasAnyExposureIntervention(s) {
  const i = s.interventions;
  return i.recoveryPosition || i.burnCare || i.woundCare ||
    i.drowningCare || i.snakebiteCare || i.none;
}

/** Non-tourniquet bleeding interventions; used by flagged-issues engine. */
function hasNonTourniquetBleedingIntervention(s) {
  const i = s.interventions;
  return i.directPressure || i.deepWoundPacking || i.uterineMassage;
}

/** Active medication-narrative branch on the Exposure step. */
function medicationTakenAnswered(data) {
  return data.exposure.medicationTakenNone || hasText(data.exposure.medicationTakenDetails);
}

/** Human-readable label for a section key. */
function sectionLabel(section) {
  switch (section) {
    case 'patientIdentification': return 'Patient Identification';
    case 'referralTransport': return 'Referral & Transport';
    case 'situation': return 'Situation';
    case 'background': return 'Background';
    case 'majorBleeding': return 'Major Bleeding (C)';
    case 'airway': return 'Airway (A)';
    case 'breathing': return 'Breathing (B)';
    case 'circulation': return 'Circulation (C)';
    case 'disability': return 'Disability (D)';
    case 'exposure': return 'Exposure / Other (E)';
    case 'recommendations': return 'Recommendations';
    case 'responderDetails': return 'Responder Details';
    default: return section;
  }
}

function priorityLabel(priority) {
  switch (priority) {
    case 'urgent': return 'Urgent';
    case 'high': return 'High';
    case 'medium': return 'Medium';
    case 'low': return 'Low';
    default: return '';
  }
}

export { emptyAssessment, hasText, calculateAge, isAssessmentAnswered, hasAnyMajorBleedingIntervention, hasAnyAirwayIntervention, hasAnyBreathingIntervention, hasAnyCirculationIntervention, hasAnyDisabilityIntervention, hasAnyExposureIntervention, hasNonTourniquetBleedingIntervention, medicationTakenAnswered, sectionLabel, priorityLabel };
