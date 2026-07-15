// Plain-JavaScript / JSDoc type definitions for the NREMT EMT
// Psychomotor Skills Examination examiner form (Medical Patient).
//
// This file builds the canonical empty AssessmentData shape used by the
// wizard, so newly-added fields automatically default correctly when
// older saved state is rehydrated from localStorage. It also publishes
// label helpers and the registry of critical-criteria rule IDs used by
// the grader and the report renderer.

/**
 * Tri-state checklist response.
 *  - 'yes'         : skill performed correctly (awards points)
 *  - 'no'          : skill not performed / performed incorrectly (no points)
 *  - 'na'          : item not applicable to this scenario (excluded)
 *  - ''            : examiner has not yet recorded an answer
 * @typedef {'yes' | 'no' | 'na' | ''} TriState
 *
 * @typedef {'first-attempt' | 'retest' | ''} ExamAttempt
 *
 * @typedef {'pass' | 'fail' | ''} Outcome
 */

/**
 * @typedef {Object} CandidateExaminerScenario
 * @property {string} candidateFirstName
 * @property {string} candidateLastName
 * @property {string} candidateId
 * @property {ExamAttempt} attempt
 * @property {string} examinerName
 * @property {string} sessionDate
 * @property {string} stationLocation
 * @property {string} scenarioSummary
 * @property {string} chiefComplaintGiven  // chief complaint provided in scenario brief
 */

/**
 * @typedef {Object} SceneSizeUp
 * @property {TriState} ppePrecautions          // critical
 * @property {TriState} sceneSafe               // critical
 * @property {TriState} mechanismOrNature       // MOI / NOI
 * @property {TriState} numberOfPatients
 * @property {TriState} additionalResources
 * @property {TriState} considersCspine         // considers spinal protection if indicated
 */

/**
 * @typedef {Object} PrimarySurvey
 * @property {TriState} generalImpression
 * @property {TriState} mentalStatus
 * @property {TriState} airway                  // critical
 * @property {TriState} breathing               // critical (incl. oxygen therapy)
 * @property {TriState} oxygenTherapy           // critical (oxygen administered when indicated)
 * @property {TriState} circulation             // critical (shock management / bleeding)
 * @property {TriState} transportPriority       // critical (transport urgency decision)
 */

/**
 * @typedef {Object} HistorySecondaryAssessment
 * @property {TriState} chiefComplaint
 * @property {TriState} historyOnsetOpqrst      // O - Onset, P - Provocation, Q - Quality, R - Radiation, S - Severity, T - Time
 * @property {TriState} sampleSignsSymptoms     // S
 * @property {TriState} sampleAllergies         // A
 * @property {TriState} sampleMedications       // M
 * @property {TriState} samplePastHistory       // P
 * @property {TriState} sampleLastIntake        // L
 * @property {TriState} sampleEvents            // E
 * @property {TriState} focusedExam
 * @property {TriState} baselineVitalsBp
 * @property {TriState} baselineVitalsPulse
 * @property {TriState} baselineVitalsRespirations
 * @property {TriState} fieldImpression
 * @property {TriState} interventions
 */

/**
 * @typedef {Object} Reassessment
 * @property {TriState} repeatsMentalStatus
 * @property {TriState} repeatsAirway
 * @property {TriState} repeatsBreathing
 * @property {TriState} repeatsCirculation
 * @property {TriState} repeatsVitals
 * @property {TriState} repeatsFocusedExam
 * @property {TriState} evaluatesInterventions
 * @property {TriState} transportInterventions
 * @property {TriState} fifteenMinuteCall       // critical (15-minute transport / radio call)
 */

/**
 * @typedef {Object} CriticalCriteriaReview
 * @property {TriState} dangerousIntervention   // critical (any harmful action)
 * @property {TriState} spinalProtection        // critical (spinal protection when indicated)
 * @property {string} examinerNotes
 * @property {string} debriefNotes
 */

/**
 * @typedef {Object} AssessmentData
 * @property {CandidateExaminerScenario} candidateExaminerScenario
 * @property {SceneSizeUp} sceneSizeUp
 * @property {PrimarySurvey} primarySurvey
 * @property {HistorySecondaryAssessment} historySecondaryAssessment
 * @property {Reassessment} reassessment
 * @property {CriticalCriteriaReview} criticalCriteriaReview
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {number} step
 * @property {string} category
 * @property {string} description
 * @property {boolean} critical
 * @property {number} points
 * @property {TriState} status
 * @property {number} pointsAwarded
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
 * @property {number} points
 * @property {number} maxPoints
 * @property {number} percent
 * @property {FiredRule[]} criticalFailures
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {number} answeredCount
 * @property {number} totalRules
 * @property {string} timestamp
 */

// Public symbols are attached to the global namespace
// `window.EmergencyMedicalTechnicianPsychomotorExamination`.

/** Build a fresh, fully-blank assessment.
 *  Strings default to ''; numeric fields default to null.
 *  @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    candidateExaminerScenario: {
      candidateFirstName: '',
      candidateLastName: '',
      candidateId: '',
      attempt: '',
      examinerName: '',
      sessionDate: '',
      stationLocation: '',
      scenarioSummary: '',
      chiefComplaintGiven: ''
    },
    sceneSizeUp: {
      ppePrecautions: '',
      sceneSafe: '',
      mechanismOrNature: '',
      numberOfPatients: '',
      additionalResources: '',
      considersCspine: ''
    },
    primarySurvey: {
      generalImpression: '',
      mentalStatus: '',
      airway: '',
      breathing: '',
      oxygenTherapy: '',
      circulation: '',
      transportPriority: ''
    },
    historySecondaryAssessment: {
      chiefComplaint: '',
      historyOnsetOpqrst: '',
      sampleSignsSymptoms: '',
      sampleAllergies: '',
      sampleMedications: '',
      samplePastHistory: '',
      sampleLastIntake: '',
      sampleEvents: '',
      focusedExam: '',
      baselineVitalsBp: '',
      baselineVitalsPulse: '',
      baselineVitalsRespirations: '',
      fieldImpression: '',
      interventions: ''
    },
    reassessment: {
      repeatsMentalStatus: '',
      repeatsAirway: '',
      repeatsBreathing: '',
      repeatsCirculation: '',
      repeatsVitals: '',
      repeatsFocusedExam: '',
      evaluatesInterventions: '',
      transportInterventions: '',
      fifteenMinuteCall: ''
    },
    criticalCriteriaReview: {
      dangerousIntervention: '',
      spinalProtection: '',
      examinerNotes: '',
      debriefNotes: ''
    }
  };
}

// ---- Pass/Fail label helpers ---------------------------------------------

/** Friendly label for an Outcome.
 *  @param {Outcome} outcome
 */
function outcomeLabel(outcome) {
  switch (outcome) {
    case 'pass': return 'Pass';
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
    case 'fail': return 'outcome-fail';
    default: return '';
  }
}

/** Friendly label for a TriState response.
 *  @param {TriState} status
 */
function triStateLabel(status) {
  switch (status) {
    case 'yes': return 'Performed';
    case 'no': return 'Not performed';
    case 'na': return 'Not applicable';
    default: return '—';
  }
}

/** CSS pill class for a TriState response. */
function triStatePillClass(status) {
  switch (status) {
    case 'yes': return 'status-yes';
    case 'no': return 'status-no';
    case 'na': return 'status-na';
    default: return 'status-na';
  }
}

// ---- Critical-criteria registry ------------------------------------------
//
// NREMT critical criteria for the EMT Medical Patient psychomotor station
// (any failure → automatic Fail regardless of point total):
//
//   1. Failure to take or verbalize appropriate PPE precautions
//   2. Failure to determine scene safety before approach
//   3. Failure to provide appropriate oxygen therapy when indicated
//   4. Failure to provide adequate airway / breathing management
//   5. Failure to manage circulation / shock when indicated
//   6. Failure to determine transport urgency (priority) decision
//   7. Performing any dangerous or harmful intervention
//   8. Failure to provide spinal protection when indicated
//   9. Failure to call for ALS / radio report within 15 minutes of arrival

/** @type {string[]} */
const CRITICAL_RULE_IDS = [
  'EMT-SS-PPE',
  'EMT-SS-SAFE',
  'EMT-PS-AIRWAY',
  'EMT-PS-BREATHING',
  'EMT-PS-OXYGEN',
  'EMT-PS-CIRCULATION',
  'EMT-PS-TRANSPORT',
  'EMT-CC-DANGEROUS',
  'EMT-CC-SPINAL',
  'EMT-RA-FIFTEEN-MIN'
];

// Pass threshold is 80% of maxPoints AND no critical failures.
const PASS_PERCENT_THRESHOLD = 80;

export { emptyAssessment, outcomeLabel, outcomeClass, triStateLabel, triStatePillClass, CRITICAL_RULE_IDS, PASS_PERCENT_THRESHOLD };
