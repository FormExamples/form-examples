// Plain-JavaScript / JSDoc type definitions for the Cardiopulmonary
// Resuscitation Training (BLS Skills Verification Checklist) examiner form.
//
// This file builds the canonical empty AssessmentData shape used by the
// wizard, so newly-added fields automatically default correctly when older
// saved state is rehydrated from localStorage. It also publishes label
// helpers and the registry of critical-action rule IDs used by the grader.

/**
 * Tri-state checklist response.
 *  - 'yes'         : skill demonstrated correctly
 *  - 'no'          : skill not yet demonstrated / failed
 *  - 'na'          : item not assessed in this session
 *  - ''            : examiner has not yet recorded an answer
 * @typedef {'yes' | 'no' | 'na' | ''} TriState
 *
 * @typedef {'instructor' | 'first-responder' | 'nurse' | 'paramedic' |
 *           'physician' | 'other' | ''} TraineeRole
 *
 * @typedef {'pass' | 'fail' | ''} Outcome
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
 */

/**
 * @typedef {Object} SceneSafety
 * @property {TriState} sceneSafe
 * @property {TriState} ppeApplied
 * @property {TriState} hazardsIdentified
 * @property {TriState} bystandersControlled
 */

/**
 * @typedef {Object} ResponsivenessBreathing
 * @property {TriState} tappedAndShouted
 * @property {TriState} checkedBreathing
 * @property {TriState} checkedPulseSimultaneously
 * @property {TriState} timeWithinTenSeconds
 */

/**
 * @typedef {Object} ActivateEmergencyResponse
 * @property {TriState} calledEmergencyNumber
 * @property {TriState} statedLocationAndCondition
 * @property {TriState} designatedAedRetriever
 * @property {TriState} usedSpeakerphone
 */

/**
 * @typedef {Object} ChestCompressions
 * @property {number | null} compressionRate     // per minute
 * @property {number | null} compressionDepth    // cm
 * @property {TriState} correctHandPosition
 * @property {TriState} fullChestRecoil
 * @property {TriState} minimisedInterruptions
 * @property {TriState} compressionsAtCorrectRate    // critical
 * @property {TriState} compressionsAtCorrectDepth   // critical
 */

/**
 * @typedef {Object} AirwayRescueBreaths
 * @property {TriState} headTiltChinLift
 * @property {TriState} effectiveSeal
 * @property {TriState} visibleChestRise           // critical (effective ventilation)
 * @property {TriState} oneSecondPerBreath
 * @property {TriState} ratio30to2
 * @property {TriState} avoidedExcessiveVentilation
 */

/**
 * @typedef {Object} AedShockDelivery
 * @property {TriState} poweredOnPromptly
 * @property {TriState} correctPadPlacement
 * @property {TriState} clearedDuringAnalysis
 * @property {TriState} deliveredShockSafely        // critical (no unsafe contact)
 * @property {TriState} resumedCompressionsImmediately
 * @property {number | null} timeToFirstShockSeconds
 */

/**
 * @typedef {Object} TeamDynamicsHandoff
 * @property {TriState} clearCommunication
 * @property {TriState} closedLoopOrders
 * @property {TriState} appropriateHandoff
 * @property {TriState} debriefParticipated
 * @property {string} examinerNotes
 * @property {string} traineeFeedback
 */

/**
 * @typedef {Object} AssessmentData
 * @property {TraineeDetails} traineeDetails
 * @property {SceneSafety} sceneSafety
 * @property {ResponsivenessBreathing} responsivenessBreathing
 * @property {ActivateEmergencyResponse} activateEmergencyResponse
 * @property {ChestCompressions} chestCompressions
 * @property {AirwayRescueBreaths} airwayRescueBreaths
 * @property {AedShockDelivery} aedShockDelivery
 * @property {TeamDynamicsHandoff} teamDynamicsHandoff
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
 * @property {FiredRule[]} nonCriticalDeficiencies
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {number} answeredCount
 * @property {number} totalRules
 * @property {string} timestamp
 */

// IIFE so locals stay scoped — this file is loaded as a classic <script>
// (no ES modules) so the page can be opened directly via `file://`.
// Public symbols are attached to the global namespace
// `window.CardiopulmonaryResuscitationTraining`.

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
      examinerName: ''
    },
    sceneSafety: {
      sceneSafe: '',
      ppeApplied: '',
      hazardsIdentified: '',
      bystandersControlled: ''
    },
    responsivenessBreathing: {
      tappedAndShouted: '',
      checkedBreathing: '',
      checkedPulseSimultaneously: '',
      timeWithinTenSeconds: ''
    },
    activateEmergencyResponse: {
      calledEmergencyNumber: '',
      statedLocationAndCondition: '',
      designatedAedRetriever: '',
      usedSpeakerphone: ''
    },
    chestCompressions: {
      compressionRate: null,
      compressionDepth: null,
      correctHandPosition: '',
      fullChestRecoil: '',
      minimisedInterruptions: '',
      compressionsAtCorrectRate: '',
      compressionsAtCorrectDepth: ''
    },
    airwayRescueBreaths: {
      headTiltChinLift: '',
      effectiveSeal: '',
      visibleChestRise: '',
      oneSecondPerBreath: '',
      ratio30to2: '',
      avoidedExcessiveVentilation: ''
    },
    aedShockDelivery: {
      poweredOnPromptly: '',
      correctPadPlacement: '',
      clearedDuringAnalysis: '',
      deliveredShockSafely: '',
      resumedCompressionsImmediately: '',
      timeToFirstShockSeconds: null
    },
    teamDynamicsHandoff: {
      clearCommunication: '',
      closedLoopOrders: '',
      appropriateHandoff: '',
      debriefParticipated: '',
      examinerNotes: '',
      traineeFeedback: ''
    }
  };
}

// ---- Pass/Fail label helpers ---------------------------------------------

/** Friendly label for an Outcome.
 *  @param {import('./types.js').Outcome} outcome
 */
function outcomeLabel(outcome) {
  switch (outcome) {
    case 'pass': return 'Pass';
    case 'fail': return 'Fail';
    default: return '';
  }
}

/** CSS class hint for the outcome badge.
 *  @param {import('./types.js').Outcome} outcome
 */
function outcomeClass(outcome) {
  switch (outcome) {
    case 'pass': return 'outcome-pass';
    case 'fail': return 'outcome-fail';
    default: return '';
  }
}

/** Friendly label for a TriState response.
 *  @param {import('./types.js').TriState} status
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
 *  @param {import('./types.js').TriState} status
 */
function triStatePillClass(status) {
  switch (status) {
    case 'yes': return 'status-yes';
    case 'no': return 'status-no';
    case 'na': return 'status-na';
    default: return 'status-na';
  }
}

// ---- Critical-action registry --------------------------------------------
//
// AHA BLS critical actions (any failure → overall Fail):
//   1. Compressions to BLS-standard rate (100-120/min)
//   2. Compressions to BLS-standard depth (5-6 cm for an adult)
//   3. Effective ventilations (visible chest rise, ~1 second per breath)
//   4. AED delivery without unsafe contact during shock

/** @type {string[]} */
const CRITICAL_RULE_IDS = [
  'BLS-CC-RATE',
  'BLS-CC-DEPTH',
  'BLS-AB-CHEST-RISE',
  'BLS-AED-SAFE-SHOCK'
];

// Acceptable physiologic ranges for the numeric inputs.
const COMPRESSION_RATE_MIN = 100;
const COMPRESSION_RATE_MAX = 120;
const COMPRESSION_DEPTH_MIN = 5.0;
const COMPRESSION_DEPTH_MAX = 6.0;

/** Is a measured rate within AHA BLS adult range?
 *  @param {number | null} rate
 */
function compressionRateInRange(rate) {
  return rate !== null && rate !== undefined &&
    rate >= COMPRESSION_RATE_MIN && rate <= COMPRESSION_RATE_MAX;
}

/** Is a measured depth within AHA BLS adult range?
 *  @param {number | null} depth
 */
function compressionDepthInRange(depth) {
  return depth !== null && depth !== undefined &&
    depth >= COMPRESSION_DEPTH_MIN && depth <= COMPRESSION_DEPTH_MAX;
}

export { emptyAssessment, outcomeLabel, outcomeClass, triStateLabel, triStatePillClass, CRITICAL_RULE_IDS, COMPRESSION_RATE_MIN, COMPRESSION_RATE_MAX, COMPRESSION_DEPTH_MIN, COMPRESSION_DEPTH_MAX, compressionRateInRange, compressionDepthInRange };
