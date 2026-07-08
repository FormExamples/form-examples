// Plain-JavaScript / JSDoc type definitions for the Lifeguard Certification
// Checklist (RLSS UK NPLQ / ILSF-aligned Competency Verification) examiner
// form.
//
// This file builds the canonical empty AssessmentData shape used by the
// wizard, so newly-added fields automatically default correctly when older
// saved state is rehydrated from localStorage. It also publishes label
// helpers and the registry of critical-competency rule IDs used by the
// grader.

/**
 * Tri-state checklist response.
 *  - 'yes'         : skill demonstrated correctly
 *  - 'no'          : skill not yet demonstrated / failed
 *  - 'na'          : item not assessed in this session
 *  - ''            : examiner has not yet recorded an answer
 * @typedef {'yes' | 'no' | 'na' | ''} TriState
 *
 * @typedef {'pool' | 'beach' | 'inland-water' | 'water-park' | 'leisure' |
 *           'other' | ''} VenueType
 *
 * @typedef {'initial' | 'requalification' | 'cross-over' | 'in-service' |
 *           'other' | ''} AssessmentType
 *
 * @typedef {'pass' | 'needs-development' | 'fail' | ''} Outcome
 */

/**
 * @typedef {Object} CandidateDetails
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} candidateId
 * @property {string} dateOfBirth          // ISO date or ''
 * @property {VenueType} venueType
 * @property {string} venueName
 * @property {AssessmentType} assessmentType
 * @property {string} priorCertificationExpiry  // ISO date or ''
 * @property {string} sessionDate
 * @property {string} examinerName
 * @property {string} examinerLicenceNumber
 */

/**
 * @typedef {Object} PhysicalFitnessSwim
 * @property {number | null} swim50mTimeSeconds        // critical: ≤60 s
 * @property {TriState} swim50mWithinTime              // critical
 * @property {number | null} surfaceDiveDepthMetres
 * @property {TriState} sustainedSurfaceDive
 * @property {number | null} swim200mTimeSeconds
 * @property {TriState} swim200mMixedStrokes
 * @property {TriState} treadWaterTwoMinutes
 * @property {TriState} towCasualty50m
 */

/**
 * @typedef {Object} SupervisionScanningZoning
 * @property {TriState} understandsZoneOfResponsibility
 * @property {TriState} effectiveScanningPattern        // critical
 * @property {TriState} tenTwentyScanRule
 * @property {TriState} recognisesDistressedSwimmer
 * @property {TriState} appropriateRotation
 * @property {TriState} usesWhistleAndSignals
 */

/**
 * @typedef {Object} RescueConscious
 * @property {TriState} recognitionAndAlert
 * @property {TriState} entryWithoutLossOfSight
 * @property {TriState} approachWithFloatingAid
 * @property {TriState} reassuresCasualty
 * @property {TriState} towToSafety
 * @property {TriState} extricationFromWater
 */

/**
 * @typedef {Object} RescueUnconscious
 * @property {TriState} recognitionAndAlert
 * @property {TriState} safeEntryAndApproach
 * @property {TriState} airwayManagementInWater
 * @property {TriState} effectiveTowToSafety            // critical
 * @property {TriState} safeExtrication                 // critical
 * @property {TriState} handoverHandsignal
 */

/**
 * @typedef {Object} SpinalInjuryManagement
 * @property {TriState} recognisesMechanism
 * @property {TriState} headSplintHold                   // critical
 * @property {TriState} maintainsInlineStabilisation
 * @property {TriState} carefulRollIfNeeded
 * @property {TriState} useOfSpineboard                  // critical
 * @property {TriState} secureCasualtyToBoard
 */

/**
 * @typedef {Object} CprAed
 * @property {number | null} compressionRate            // /min
 * @property {number | null} compressionDepth           // cm
 * @property {TriState} effectiveCompressions           // critical
 * @property {TriState} effectiveVentilations
 * @property {number | null} timeToFirstShockSeconds
 * @property {TriState} aedDeliveredPromptly            // critical
 * @property {TriState} safeShockNoUnsafeContact
 * @property {TriState} continuousQualityCpr
 */

/**
 * @typedef {Object} FirstAidOxygen
 * @property {TriState} bleedingControl
 * @property {TriState} burnsManagement
 * @property {TriState} fractureImmobilisation
 * @property {TriState} recoveryPositionUse
 * @property {TriState} oxygenTherapyAdministration
 * @property {TriState} usesPocketMaskOrBVM
 */

/**
 * @typedef {Object} LegalRegulatoryIncident
 * @property {TriState} dutyOfCareUnderstood
 * @property {TriState} pswpKnowledge                   // Pool Safety Operating Procedures / EAP
 * @property {TriState} eapInvocation
 * @property {TriState} incidentReportCompleted
 * @property {TriState} riddorAwareness
 * @property {TriState} safeguardingChildrenAdults
 */

/**
 * @typedef {Object} OverallResultSignoff
 * @property {Outcome} examinerOutcome     // examiner's recommended outcome
 * @property {string} strengths
 * @property {string} developmentAreas
 * @property {string} examinerNotes
 * @property {string} candidateFeedback
 * @property {TriState} candidateAcknowledged
 */

/**
 * @typedef {Object} AssessmentData
 * @property {CandidateDetails} candidateDetails
 * @property {PhysicalFitnessSwim} physicalFitnessSwim
 * @property {SupervisionScanningZoning} supervisionScanningZoning
 * @property {RescueConscious} rescueConscious
 * @property {RescueUnconscious} rescueUnconscious
 * @property {SpinalInjuryManagement} spinalInjuryManagement
 * @property {CprAed} cprAed
 * @property {FirstAidOxygen} firstAidOxygen
 * @property {LegalRegulatoryIncident} legalRegulatoryIncident
 * @property {OverallResultSignoff} overallResultSignoff
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
// `window.LifeguardCertificationChecklist`.
(function () {
'use strict';
window.LifeguardCertificationChecklist =
  window.LifeguardCertificationChecklist || {};

/** Build a fresh, fully-blank assessment.
 *  Strings default to ''; numeric fields default to null.
 *  @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    candidateDetails: {
      firstName: '',
      lastName: '',
      candidateId: '',
      dateOfBirth: '',
      venueType: '',
      venueName: '',
      assessmentType: '',
      priorCertificationExpiry: '',
      sessionDate: '',
      examinerName: '',
      examinerLicenceNumber: ''
    },
    physicalFitnessSwim: {
      swim50mTimeSeconds: null,
      swim50mWithinTime: '',
      surfaceDiveDepthMetres: null,
      sustainedSurfaceDive: '',
      swim200mTimeSeconds: null,
      swim200mMixedStrokes: '',
      treadWaterTwoMinutes: '',
      towCasualty50m: ''
    },
    supervisionScanningZoning: {
      understandsZoneOfResponsibility: '',
      effectiveScanningPattern: '',
      tenTwentyScanRule: '',
      recognisesDistressedSwimmer: '',
      appropriateRotation: '',
      usesWhistleAndSignals: ''
    },
    rescueConscious: {
      recognitionAndAlert: '',
      entryWithoutLossOfSight: '',
      approachWithFloatingAid: '',
      reassuresCasualty: '',
      towToSafety: '',
      extricationFromWater: ''
    },
    rescueUnconscious: {
      recognitionAndAlert: '',
      safeEntryAndApproach: '',
      airwayManagementInWater: '',
      effectiveTowToSafety: '',
      safeExtrication: '',
      handoverHandsignal: ''
    },
    spinalInjuryManagement: {
      recognisesMechanism: '',
      headSplintHold: '',
      maintainsInlineStabilisation: '',
      carefulRollIfNeeded: '',
      useOfSpineboard: '',
      secureCasualtyToBoard: ''
    },
    cprAed: {
      compressionRate: null,
      compressionDepth: null,
      effectiveCompressions: '',
      effectiveVentilations: '',
      timeToFirstShockSeconds: null,
      aedDeliveredPromptly: '',
      safeShockNoUnsafeContact: '',
      continuousQualityCpr: ''
    },
    firstAidOxygen: {
      bleedingControl: '',
      burnsManagement: '',
      fractureImmobilisation: '',
      recoveryPositionUse: '',
      oxygenTherapyAdministration: '',
      usesPocketMaskOrBVM: ''
    },
    legalRegulatoryIncident: {
      dutyOfCareUnderstood: '',
      pswpKnowledge: '',
      eapInvocation: '',
      incidentReportCompleted: '',
      riddorAwareness: '',
      safeguardingChildrenAdults: ''
    },
    overallResultSignoff: {
      examinerOutcome: '',
      strengths: '',
      developmentAreas: '',
      examinerNotes: '',
      candidateFeedback: '',
      candidateAcknowledged: ''
    }
  };
}

// ---- Outcome / TriState label helpers ------------------------------------

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

// ---- Critical-competency registry ----------------------------------------
//
// RLSS UK NPLQ / ILSF critical competencies (any failure → overall Fail):
//   1. Timed swim — 50 m in ≤ 60 s
//   2. Unconscious-casualty rescue — effective tow + safe extrication
//   3. Spinal handling — head-splint and safe board use
//   4. CPR with effective compressions to depth/rate
//   5. AED delivery prompt and without unsafe contact
//   6. Scanning effectiveness (10/20 rule, defined zone)

/** @type {string[]} */
const CRITICAL_RULE_IDS = [
  'LIFE-PF-50M-TIME',
  'LIFE-SCAN-PATTERN',
  'LIFE-RU-TOW',
  'LIFE-RU-EXTRICATE',
  'LIFE-SP-HEADSPLINT',
  'LIFE-SP-BOARD',
  'LIFE-CPR-COMPRESSIONS',
  'LIFE-CPR-AED-PROMPT'
];

// Acceptable physiologic / NPLQ ranges for the numeric inputs.
const SWIM_50M_MAX_SECONDS = 60;        // NPLQ: 50 m in ≤ 60 s
const SWIM_200M_MAX_SECONDS = 360;      // 6 min target for 200 m mixed strokes
const COMPRESSION_RATE_MIN = 100;
const COMPRESSION_RATE_MAX = 120;
const COMPRESSION_DEPTH_MIN = 5.0;
const COMPRESSION_DEPTH_MAX = 6.0;
const SLOW_AED_SECONDS = 90;            // ILSF target time-to-first-shock
const SURFACE_DIVE_MIN_METRES = 1.5;    // typical NPLQ pool dive depth

/** @param {number | null} sec */
function swim50mWithinTarget(sec) {
  return sec !== null && sec !== undefined && sec > 0 && sec <= SWIM_50M_MAX_SECONDS;
}

/** @param {number | null} sec */
function swim200mWithinTarget(sec) {
  return sec !== null && sec !== undefined && sec > 0 && sec <= SWIM_200M_MAX_SECONDS;
}

/** @param {number | null} rate */
function compressionRateInRange(rate) {
  return rate !== null && rate !== undefined &&
    rate >= COMPRESSION_RATE_MIN && rate <= COMPRESSION_RATE_MAX;
}

/** @param {number | null} depth */
function compressionDepthInRange(depth) {
  return depth !== null && depth !== undefined &&
    depth >= COMPRESSION_DEPTH_MIN && depth <= COMPRESSION_DEPTH_MAX;
}

/** @param {number | null} m */
function surfaceDiveDepthAdequate(m) {
  return m !== null && m !== undefined && m >= SURFACE_DIVE_MIN_METRES;
}

Object.assign(window.LifeguardCertificationChecklist, {
  emptyAssessment,
  outcomeLabel,
  outcomeClass,
  triStateLabel,
  triStatePillClass,
  CRITICAL_RULE_IDS,
  SWIM_50M_MAX_SECONDS,
  SWIM_200M_MAX_SECONDS,
  COMPRESSION_RATE_MIN,
  COMPRESSION_RATE_MAX,
  COMPRESSION_DEPTH_MIN,
  COMPRESSION_DEPTH_MAX,
  SLOW_AED_SECONDS,
  SURFACE_DIVE_MIN_METRES,
  swim50mWithinTarget,
  swim200mWithinTarget,
  compressionRateInRange,
  compressionDepthInRange,
  surfaceDiveDepthAdequate
});
})();
