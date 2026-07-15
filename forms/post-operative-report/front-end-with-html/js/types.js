// Plain-JavaScript / JSDoc type definitions for the Post-Operative Report
// form. Mirrors the SvelteKit reference engine. Builds the canonical empty
// AssessmentData shape used by the wizard so newly-added fields default
// correctly when older saved state is rehydrated from localStorage.

/**
 * @typedef {'yes' | 'no' | ''} YesNo
 *
 * @typedef {''
 *   | 'general'
 *   | 'regional'
 *   | 'spinal'
 *   | 'epidural'
 *   | 'combined-spinal-epidural'
 *   | 'monitored-anaesthesia-care'
 *   | 'local'
 *   | 'sedation'
 *   | 'none'
 * } AnaesthesiaType
 *
 * @typedef {''
 *   | 'elective'
 *   | 'urgent'
 *   | 'emergency'
 * } ProcedurePriority
 *
 * @typedef {''
 *   | 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'E'
 * } AsaGrade
 *
 * @typedef {''
 *   | 'awake' | 'drowsy' | 'unresponsive' | 'sedated' | 'intubated'
 * } ConsciousLevel
 *
 * @typedef {''
 *   | 'recovery' | 'ward' | 'hdu' | 'icu' | 'home' | 'theatre'
 * } DispositionLocation
 *
 * @typedef {''
 *   | 'grade-0'
 *   | 'grade-i'
 *   | 'grade-ii'
 *   | 'grade-iiia'
 *   | 'grade-iiib'
 *   | 'grade-iva'
 *   | 'grade-ivb'
 *   | 'grade-v'
 * } ClavienDindoGradeKey
 */

/**
 * @typedef {Object} PatientDetails
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {string} mrn
 * @property {string} sex
 * @property {number | null} weight
 * @property {number | null} height
 * @property {AsaGrade} asaGrade
 * @property {string} allergies
 */

/**
 * @typedef {Object} ProcedureDetails
 * @property {string} procedureName
 * @property {string} procedureCode
 * @property {string} indication
 * @property {ProcedurePriority} priority
 * @property {string} surgicalApproach
 * @property {string} laterality
 * @property {string} dateOfSurgery
 * @property {string} startTime
 * @property {string} endTime
 * @property {number | null} durationMinutes
 * @property {string} operatingRoom
 */

/**
 * @typedef {Object} TeamMember
 * @property {string} name
 * @property {string} role
 * @property {string} grade
 */

/**
 * @typedef {Object} SurgicalTeam
 * @property {string} primarySurgeon
 * @property {string} primarySurgeonGrade
 * @property {string} primaryAnaesthetist
 * @property {string} primaryAnaesthetistGrade
 * @property {TeamMember[]} additionalMembers
 * @property {string} scrubNurse
 * @property {string} circulator
 */

/**
 * @typedef {Object} IntraoperativeFindings
 * @property {string} findings
 * @property {string} procedurePerformed
 * @property {string} unexpectedFindings
 * @property {YesNo} conversionToOpen
 * @property {string} conversionReason
 */

/**
 * @typedef {Object} AnaesthesiaSummary
 * @property {AnaesthesiaType} anaesthesiaType
 * @property {string} airwayManagement
 * @property {YesNo} difficultIntubation
 * @property {string} airwayNotes
 * @property {string} medicationsAdministered
 * @property {string} reversalAgents
 * @property {string} anaesthesiaNotes
 */

/**
 * @typedef {Object} BloodLossFluidBalance
 * @property {number | null} estimatedBloodLossMl
 * @property {number | null} crystalloidsMl
 * @property {number | null} colloidsMl
 * @property {number | null} bloodProductsMl
 * @property {string} bloodProductDetails
 * @property {number | null} urineOutputMl
 * @property {number | null} otherDrainsMl
 * @property {string} fluidNotes
 */

/**
 * @typedef {Object} Specimen
 * @property {string} description
 * @property {string} site
 * @property {string} disposition
 */

/**
 * @typedef {Object} Implant
 * @property {string} description
 * @property {string} manufacturer
 * @property {string} lotNumber
 * @property {string} site
 */

/**
 * @typedef {Object} SpecimensImplants
 * @property {Specimen[]} specimens
 * @property {Implant[]} implants
 * @property {YesNo} prosthesisUsed
 * @property {string} drainsPlaced
 * @property {string} cathetersPlaced
 */

/**
 * @typedef {Object} ImmediatePostopStatus
 * @property {ConsciousLevel} consciousLevel
 * @property {number | null} systolicBp
 * @property {number | null} diastolicBp
 * @property {number | null} heartRate
 * @property {number | null} respiratoryRate
 * @property {number | null} oxygenSaturation
 * @property {number | null} temperature
 * @property {number | null} painScore
 * @property {string} painNotes
 * @property {DispositionLocation} disposition
 */

/**
 * @typedef {Object} Complication
 * @property {string} description
 * @property {ClavienDindoGradeKey} grade
 * @property {string} interventionRequired
 * @property {string} timing
 */

/**
 * @typedef {Object} ComplicationsAssessment
 * @property {YesNo} complicationsOccurred
 * @property {Complication[]} complications
 * @property {string} narrative
 */

/**
 * @typedef {Object} PostopPlanInstructions
 * @property {string} medicationsPrescribed
 * @property {string} antibioticPlan
 * @property {string} thromboprophylaxis
 * @property {string} analgesiaPlan
 * @property {string} dietPlan
 * @property {string} mobilisationPlan
 * @property {string} woundCareInstructions
 * @property {string} followUpPlan
 * @property {string} dischargeCriteria
 * @property {string} alertsAndEscalation
 */

/**
 * @typedef {Object} AssessmentData
 * @property {PatientDetails} patientDetails
 * @property {ProcedureDetails} procedureDetails
 * @property {SurgicalTeam} surgicalTeam
 * @property {IntraoperativeFindings} intraoperativeFindings
 * @property {AnaesthesiaSummary} anaesthesiaSummary
 * @property {BloodLossFluidBalance} bloodLossFluidBalance
 * @property {SpecimensImplants} specimensImplants
 * @property {ImmediatePostopStatus} immediatePostopStatus
 * @property {ComplicationsAssessment} complicationsAssessment
 * @property {PostopPlanInstructions} postopPlanInstructions
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {ClavienDindoGradeKey} grade
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
 * @property {ClavienDindoGradeKey} overallGrade
 * @property {number} complicationCount
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {string} timestamp
 */

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
      mrn: '',
      sex: '',
      weight: null,
      height: null,
      asaGrade: '',
      allergies: ''
    },
    procedureDetails: {
      procedureName: '',
      procedureCode: '',
      indication: '',
      priority: '',
      surgicalApproach: '',
      laterality: '',
      dateOfSurgery: '',
      startTime: '',
      endTime: '',
      durationMinutes: null,
      operatingRoom: ''
    },
    surgicalTeam: {
      primarySurgeon: '',
      primarySurgeonGrade: '',
      primaryAnaesthetist: '',
      primaryAnaesthetistGrade: '',
      additionalMembers: [],
      scrubNurse: '',
      circulator: ''
    },
    intraoperativeFindings: {
      findings: '',
      procedurePerformed: '',
      unexpectedFindings: '',
      conversionToOpen: '',
      conversionReason: ''
    },
    anaesthesiaSummary: {
      anaesthesiaType: '',
      airwayManagement: '',
      difficultIntubation: '',
      airwayNotes: '',
      medicationsAdministered: '',
      reversalAgents: '',
      anaesthesiaNotes: ''
    },
    bloodLossFluidBalance: {
      estimatedBloodLossMl: null,
      crystalloidsMl: null,
      colloidsMl: null,
      bloodProductsMl: null,
      bloodProductDetails: '',
      urineOutputMl: null,
      otherDrainsMl: null,
      fluidNotes: ''
    },
    specimensImplants: {
      specimens: [],
      implants: [],
      prosthesisUsed: '',
      drainsPlaced: '',
      cathetersPlaced: ''
    },
    immediatePostopStatus: {
      consciousLevel: '',
      systolicBp: null,
      diastolicBp: null,
      heartRate: null,
      respiratoryRate: null,
      oxygenSaturation: null,
      temperature: null,
      painScore: null,
      painNotes: '',
      disposition: ''
    },
    complicationsAssessment: {
      complicationsOccurred: '',
      complications: [],
      narrative: ''
    },
    postopPlanInstructions: {
      medicationsPrescribed: '',
      antibioticPlan: '',
      thromboprophylaxis: '',
      analgesiaPlan: '',
      dietPlan: '',
      mobilisationPlan: '',
      woundCareInstructions: '',
      followUpPlan: '',
      dischargeCriteria: '',
      alertsAndEscalation: ''
    }
  };
}

/** Calculate procedure duration in minutes from HH:MM start and end times. */
function calculateDurationMinutes(startTime, endTime) {
  if (!startTime || !endTime) return null;
  const parse = (t) => {
    const [h, m] = String(t).split(':').map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return h * 60 + m;
  };
  const s = parse(startTime);
  const e = parse(endTime);
  if (s === null || e === null) return null;
  let diff = e - s;
  if (diff < 0) diff += 24 * 60;
  return diff;
}

export { emptyAssessment, calculateDurationMinutes };
