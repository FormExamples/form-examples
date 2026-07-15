// Plain-JavaScript / JSDoc type definitions for the First Aid Training
// Checklist (UK HSE First Aid at Work / St John Ambulance) examiner form.
//
// This file builds the canonical empty AssessmentData shape used by the
// wizard, so newly-added fields automatically default correctly when older
// saved state is rehydrated from localStorage. It also publishes label
// helpers and the registry of critical-skill rule IDs used by the grader.

/**
 * Tri-state checklist response.
 *  - 'yes'  : skill demonstrated correctly
 *  - 'no'   : skill not yet demonstrated / failed
 *  - 'na'   : item not assessed in this session
 *  - ''     : examiner has not yet recorded an answer
 * @typedef {'yes' | 'no' | 'na' | ''} TriState
 *
 * @typedef {'first-aider' | 'workplace-first-aider' | 'instructor-candidate' |
 *           'security-officer' | 'lifeguard' | 'teacher' | 'volunteer' |
 *           'other' | ''} TraineeRole
 *
 * @typedef {'pass' | 'needs-development' | 'fail' | ''} Outcome
 */

/**
 * @typedef {Object} TraineeDetails
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} traineeId
 * @property {TraineeRole} role
 * @property {string} priorCertificationExpiry  // ISO date string or ''
 * @property {string} sessionDate
 * @property {string} examinerName
 * @property {string} venue
 */

/**
 * @typedef {Object} SceneAssessmentSafety
 * @property {TriState} sceneSafe
 * @property {TriState} ppeApplied
 * @property {TriState} hazardsIdentified
 * @property {TriState} bystandersControlled
 */

/**
 * @typedef {Object} PrimarySurveyDRABC
 * @property {TriState} dangerCheck
 * @property {TriState} responseCheck                // critical: AVPU / shake-and-shout
 * @property {TriState} airwayManagement
 * @property {TriState} breathingCheck
 * @property {TriState} circulationAssessment
 * @property {TriState} recoveryPositionWhenAppropriate
 */

/**
 * @typedef {Object} CprAed
 * @property {TriState} effectiveCompressions        // critical: rate & depth
 * @property {TriState} effectiveVentilations        // critical: visible chest rise
 * @property {TriState} ratio30to2
 * @property {TriState} aedPowerOnPromptly
 * @property {TriState} aedPadPlacement
 * @property {TriState} aedSafeShockDelivery         // critical: clear before shock
 */

/**
 * @typedef {Object} ChokingManagement
 * @property {TriState} encouragedCoughing
 * @property {TriState} fiveBackBlows
 * @property {TriState} fiveAbdominalThrusts
 * @property {TriState} alternatesUntilDislodged
 * @property {TriState} unconsciousChokingCpr        // critical
 */

/**
 * @typedef {Object} BleedingWoundCare
 * @property {TriState} directPressureApplied        // critical: major bleed control
 * @property {TriState} elevatedAndImmobilised
 * @property {TriState} appliedDressingCorrectly
 * @property {TriState} tourniquetWhenIndicated      // critical: catastrophic haemorrhage
 * @property {TriState} haemostaticDressingApplied
 * @property {TriState} treatedForShock
 */

/**
 * @typedef {Object} BurnsScalds
 * @property {TriState} cooledForTwentyMinutes
 * @property {TriState} removedJewelleryAndLooseClothing
 * @property {TriState} coveredWithClingFilmOrSterileDressing
 * @property {TriState} avoidedCreamsOrIce
 * @property {TriState} referredAppropriately
 */

/**
 * @typedef {Object} FracturesSprainsSpinal
 * @property {TriState} immobilisedInjuredLimb
 * @property {TriState} appliedRiceForSprains
 * @property {TriState} suspectedSpinalManualSupport
 * @property {TriState} performedLogRollWithTeam
 * @property {TriState} avoidedUnnecessaryMovement
 */

/**
 * @typedef {Object} MedicalEmergencies
 * @property {TriState} recognisedAnaphylaxis        // critical: missed anaphylaxis recognition
 * @property {TriState} administeredEpiPenSafely
 * @property {TriState} assistedAsthmaInhaler
 * @property {TriState} managedHypoglycaemia
 * @property {TriState} managedSeizureSafely
 * @property {TriState} recognisedStrokeFAST
 * @property {TriState} recognisedChestPain
 */

/**
 * @typedef {Object} RecordingReportingHandover
 * @property {TriState} accidentBookEntry
 * @property {TriState} riddorAwareness
 * @property {TriState} structuredHandoffSbar
 * @property {TriState} confidentialityMaintained
 * @property {string} examinerNotes
 * @property {string} traineeFeedback
 * @property {string} debriefNotes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {TraineeDetails} traineeDetails
 * @property {SceneAssessmentSafety} sceneAssessmentSafety
 * @property {PrimarySurveyDRABC} primarySurveyDRABC
 * @property {CprAed} cprAed
 * @property {ChokingManagement} chokingManagement
 * @property {BleedingWoundCare} bleedingWoundCare
 * @property {BurnsScalds} burnsScalds
 * @property {FracturesSprainsSpinal} fracturesSprainsSpinal
 * @property {MedicalEmergencies} medicalEmergencies
 * @property {RecordingReportingHandover} recordingReportingHandover
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {number} step
 * @property {string} category
 * @property {string} description
 * @property {boolean} critical
 * @property {TriState} status
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
 * @property {Outcome} outcome
 * @property {FiredRule[]} criticalFailures
 * @property {FiredRule[]} deficiencies
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {number} answeredCount
 * @property {number} totalRules
 * @property {string} timestamp
 */

// IIFE so locals stay scoped — this file is loaded as a classic <script>
// (no ES modules) so the page can be opened directly via `file://`.
// Public symbols are attached to the global namespace
// `window.FirstAidTrainingChecklist`.

/** Build a fresh, fully-blank assessment.
 *  Strings default to ''; numeric fields default to null.
 *  @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    traineeDetails: {
      firstName: '',
      lastName: '',
      traineeId: '',
      role: '',
      priorCertificationExpiry: '',
      sessionDate: '',
      examinerName: '',
      venue: ''
    },
    sceneAssessmentSafety: {
      sceneSafe: '',
      ppeApplied: '',
      hazardsIdentified: '',
      bystandersControlled: ''
    },
    primarySurveyDRABC: {
      dangerCheck: '',
      responseCheck: '',
      airwayManagement: '',
      breathingCheck: '',
      circulationAssessment: '',
      recoveryPositionWhenAppropriate: ''
    },
    cprAed: {
      effectiveCompressions: '',
      effectiveVentilations: '',
      ratio30to2: '',
      aedPowerOnPromptly: '',
      aedPadPlacement: '',
      aedSafeShockDelivery: ''
    },
    chokingManagement: {
      encouragedCoughing: '',
      fiveBackBlows: '',
      fiveAbdominalThrusts: '',
      alternatesUntilDislodged: '',
      unconsciousChokingCpr: ''
    },
    bleedingWoundCare: {
      directPressureApplied: '',
      elevatedAndImmobilised: '',
      appliedDressingCorrectly: '',
      tourniquetWhenIndicated: '',
      haemostaticDressingApplied: '',
      treatedForShock: ''
    },
    burnsScalds: {
      cooledForTwentyMinutes: '',
      removedJewelleryAndLooseClothing: '',
      coveredWithClingFilmOrSterileDressing: '',
      avoidedCreamsOrIce: '',
      referredAppropriately: ''
    },
    fracturesSprainsSpinal: {
      immobilisedInjuredLimb: '',
      appliedRiceForSprains: '',
      suspectedSpinalManualSupport: '',
      performedLogRollWithTeam: '',
      avoidedUnnecessaryMovement: ''
    },
    medicalEmergencies: {
      recognisedAnaphylaxis: '',
      administeredEpiPenSafely: '',
      assistedAsthmaInhaler: '',
      managedHypoglycaemia: '',
      managedSeizureSafely: '',
      recognisedStrokeFAST: '',
      recognisedChestPain: ''
    },
    recordingReportingHandover: {
      accidentBookEntry: '',
      riddorAwareness: '',
      structuredHandoffSbar: '',
      confidentialityMaintained: '',
      examinerNotes: '',
      traineeFeedback: '',
      debriefNotes: ''
    }
  };
}

// ---- Pass / Needs Development / Fail label helpers -----------------------

/** Friendly label for an Outcome.
 *  @param {Outcome} outcome
 */
function outcomeLabel(outcome) {
  switch (outcome) {
    case 'pass': return 'Pass';
    case 'needs-development': return 'Needs Development';
    case 'fail': return 'Fail';
    default: return '';
  }
}

/** CSS class hint for the outcome badge.
 *  @param {Outcome} outcome
 */
function outcomeClass(outcome) {
  switch (outcome) {
    case 'pass': return 'outcome-pass';
    case 'needs-development': return 'outcome-needs-development';
    case 'fail': return 'outcome-fail';
    default: return '';
  }
}

/** Friendly label for a TriState response.
 *  @param {TriState} status
 */
function triStateLabel(status) {
  switch (status) {
    case 'yes': return 'Demonstrated';
    case 'no': return 'Not yet';
    case 'na': return 'Not assessed';
    default: return '—';
  }
}

/** CSS pill class for a TriState response.
 *  @param {TriState} status
 */
function triStatePillClass(status) {
  switch (status) {
    case 'yes': return 'status-yes';
    case 'no': return 'status-no';
    case 'na': return 'status-na';
    default: return 'status-na';
  }
}

// ---- Critical-skill registry ---------------------------------------------
//
// HSE / St John critical life-saving skills (any failure → overall Fail):
//   1. Effective CPR compressions (rate + depth)
//   2. Effective CPR ventilations (visible chest rise)
//   3. AED safe shock delivery (no unsafe contact)
//   4. Primary survey response check (DR-A-B-C "R")
//   5. Unconscious choking → CPR transition
//   6. Direct pressure for major haemorrhage
//   7. Tourniquet for catastrophic haemorrhage when indicated
//   8. Anaphylaxis recognition
//
// (Eight rule IDs: matches the spec's "missed primary survey, ineffective
// CPR, failed unconscious choking, failed major bleed control, missed
// anaphylaxis recognition" critical-flag set.)

/** @type {string[]} */
const CRITICAL_RULE_IDS = [
  'FAW-PS-RESPONSE',
  'FAW-CPR-COMPRESSIONS',
  'FAW-CPR-VENTILATIONS',
  'FAW-AED-SAFE-SHOCK',
  'FAW-CHOKE-UNCONSCIOUS',
  'FAW-BLEED-PRESSURE',
  'FAW-BLEED-TOURNIQUET',
  'FAW-MED-ANAPHYLAXIS'
];

export { emptyAssessment, outcomeLabel, outcomeClass, triStateLabel, triStatePillClass, CRITICAL_RULE_IDS };
