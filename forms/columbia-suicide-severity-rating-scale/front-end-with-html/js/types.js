// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Columbia Suicide Severity
// Rating Scale (C-SSRS) form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_columbia_suicide_severity_rating_scale.sql`. This file
// builds and exports the canonical empty AssessmentData shape used by the
// wizard, so that newly-added fields automatically default correctly when
// older saved state is rehydrated from localStorage. It also exports display
// helpers (riskTierLabel, riskTierClass, ideationLevelLabel, clinicianRoleLabel,
// careSettingLabel, sexLabel, ageBandLabel, priorityLabel).
//
// C-SSRS is a status- and severity-classification instrument: the output is a
// Low / Moderate / High risk tier derived from the highest affirmative ideation
// level (0-5), the presence and recency of suicidal behaviour, and lethality.
// It is NOT a summed score.

/**
 * @typedef {'clinician' | 'nurse' | 'mental-health-practitioner' | 'crisis-worker' | 'other' | ''} ClinicianRole
 * @typedef {'mental-health' | 'emergency-department' | 'primary-care' | 'crisis-service' | 'inpatient' | 'other' | ''} CareSetting
 * @typedef {'screener' | 'full' | ''} ScaleVersion
 * @typedef {'adolescent' | 'adult' | ''} AgeBand
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'past-month' | 'lifetime-worst' | ''} IdeationTimeframe
 * @typedef {'within-3-months' | 'over-3-months' | ''} BehaviourRecency
 * @typedef {'yes' | 'no' | 'unknown' | ''} AccessToMeans
 * @typedef {0 | 1 | 2 | 3 | 4 | 5} IdeationLevel
 * @typedef {'low' | 'moderate' | 'high'} RiskTier
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} assessedAt        - ISO-ish datetime-local string; '' when unset
 * @property {CareSetting} careSetting
 * @property {ScaleVersion} scaleVersion
 * @property {string} reasonForAssessment
 */

/**
 * Step 2 — patient identification.
 * @typedef {Object} Identification
 * @property {string} patientIdentifier
 * @property {AgeBand} ageBand
 * @property {Sex} sex
 */

/**
 * Step 3 — suicidal ideation (Q1-Q5, each yes/no; highest affirmative sets the level).
 * @typedef {Object} Ideation
 * @property {YesNo} wishToBeDead                - Q1, level 1
 * @property {YesNo} nonSpecificActiveThoughts   - Q2, level 2
 * @property {YesNo} activeIdeationMethods       - Q3, level 3
 * @property {YesNo} activeIdeationIntent        - Q4, level 4
 * @property {YesNo} activeIdeationPlan          - Q5, level 5
 * @property {IdeationTimeframe} ideationTimeframe
 */

/**
 * Step 4 — ideation intensity (optional; full version only) — ordinals 0-5.
 * @typedef {Object} Intensity
 * @property {number | null} ideationFrequency
 * @property {number | null} ideationDuration
 * @property {number | null} ideationControllability
 * @property {number | null} ideationDeterrents
 * @property {number | null} ideationReasons
 */

/**
 * Step 5 — suicidal behaviour.
 * @typedef {Object} Behaviour
 * @property {YesNo} actualAttempt
 * @property {YesNo} interruptedAttempt
 * @property {YesNo} abortedAttempt
 * @property {YesNo} preparatoryActs
 * @property {YesNo} nonSuicidalSelfInjury      - NSSI; tracked separately, not suicidal behaviour
 * @property {BehaviourRecency} behaviourRecency
 * @property {number | null} lifetimeAttemptCount
 * @property {string} mostRecentAttemptDate     - ISO date string; '' when unset
 */

/**
 * Step 6 — lethality (for actual attempts).
 * @typedef {Object} Lethality
 * @property {number | null} actualLethality     - 0-5 medical damage
 * @property {number | null} potentialLethality  - 0-2; coded only when actualLethality is 0
 */

/**
 * Step 7 — means and protective factors.
 * @typedef {Object} Means
 * @property {AccessToMeans} accessToLethalMeans
 * @property {string} protectiveFactors
 */

/**
 * Step 8 — clinician free-text note.
 * @typedef {Object} Summary
 * @property {string} clinicalNote
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Ideation} ideation
 * @property {Intensity} intensity
 * @property {Behaviour} behaviour
 * @property {Lethality} lethality
 * @property {Means} means
 * @property {Summary} summary
 */

/**
 * @typedef {Object} FiredCriterion
 * @property {string} id           - stable rule id, e.g. R-IDEATION-05
 * @property {string} criterion    - ideation | behaviour | lethality | tier
 * @property {number} level        - ordinal contribution (ideation level, or 0)
 * @property {string} category
 * @property {string} description
 */

/**
 * @typedef {Object} FlaggedIssue
 * @property {string} id
 * @property {string} category
 * @property {Priority} priority
 * @property {string} description
 * @property {string} suggestedAction
 */

/**
 * @typedef {Object} GradingResult
 * @property {IdeationLevel} ideationLevel
 * @property {boolean} suicidalBehaviourPresent
 * @property {boolean} recentBehaviour
 * @property {RiskTier} riskTier
 * @property {FiredCriterion[]} firedCriteria
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} managementRecommendation
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.ColumbiaSuicideSeverityRatingScale`.
(function () {
'use strict';
window.ColumbiaSuicideSeverityRatingScale =
  window.ColumbiaSuicideSeverityRatingScale || {};

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; numeric fields default to `null`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    context: {
      clinicianName: '',
      clinicianRole: '',
      assessedAt: '',
      careSetting: '',
      scaleVersion: '',
      reasonForAssessment: ''
    },
    identification: {
      patientIdentifier: '',
      ageBand: '',
      sex: ''
    },
    ideation: {
      wishToBeDead: '',
      nonSpecificActiveThoughts: '',
      activeIdeationMethods: '',
      activeIdeationIntent: '',
      activeIdeationPlan: '',
      ideationTimeframe: ''
    },
    intensity: {
      ideationFrequency: null,
      ideationDuration: null,
      ideationControllability: null,
      ideationDeterrents: null,
      ideationReasons: null
    },
    behaviour: {
      actualAttempt: '',
      interruptedAttempt: '',
      abortedAttempt: '',
      preparatoryActs: '',
      nonSuicidalSelfInjury: '',
      behaviourRecency: '',
      lifetimeAttemptCount: null,
      mostRecentAttemptDate: ''
    },
    lethality: {
      actualLethality: null,
      potentialLethality: null
    },
    means: {
      accessToLethalMeans: '',
      protectiveFactors: ''
    },
    summary: {
      clinicalNote: ''
    }
  };
}

/** Risk-tier label for display. */
function riskTierLabel(tier) {
  switch (tier) {
    case 'low': return 'Low risk';
    case 'moderate': return 'Moderate risk';
    case 'high': return 'High risk';
    default: return '';
  }
}

/** CSS class hint for the risk-tier badge (reuses the shared risk palette). */
function riskTierClass(tier) {
  switch (tier) {
    case 'low': return 'risk-low';
    case 'moderate': return 'risk-moderate';
    case 'high': return 'risk-high';
    default: return '';
  }
}

/** Five-point ideation-level label. */
function ideationLevelLabel(level) {
  switch (level) {
    case 0: return 'Level 0 — no suicidal ideation reported';
    case 1: return 'Level 1 — wish to be dead';
    case 2: return 'Level 2 — non-specific active suicidal thoughts';
    case 3: return 'Level 3 — active ideation with any methods (no plan)';
    case 4: return 'Level 4 — active ideation with some intent to act';
    case 5: return 'Level 5 — active ideation with specific plan and intent';
    default: return '';
  }
}

/** Assessing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'clinician': return 'Clinician';
    case 'nurse': return 'Nurse';
    case 'mental-health-practitioner': return 'Mental-health practitioner';
    case 'crisis-worker': return 'Crisis worker';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'mental-health': return 'Mental-health service';
    case 'emergency-department': return 'Emergency department';
    case 'primary-care': return 'Primary care';
    case 'crisis-service': return 'Crisis service';
    case 'inpatient': return 'Inpatient ward';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Patient-sex label. */
function sexLabel(sex) {
  switch (sex) {
    case 'female': return 'Female';
    case 'male': return 'Male';
    case 'intersex': return 'Intersex';
    case 'unknown': return 'Unknown';
    default: return '';
  }
}

/** Age-band label. */
function ageBandLabel(band) {
  switch (band) {
    case 'adolescent': return 'Adolescent';
    case 'adult': return 'Adult';
    default: return '';
  }
}

/** Flag-priority label. */
function priorityLabel(priority) {
  switch (priority) {
    case 'high': return 'HIGH';
    case 'medium': return 'MEDIUM';
    case 'low': return 'LOW';
    default: return '';
  }
}

Object.assign(window.ColumbiaSuicideSeverityRatingScale, {
  emptyAssessment,
  riskTierLabel,
  riskTierClass,
  ideationLevelLabel,
  clinicianRoleLabel,
  careSettingLabel,
  sexLabel,
  ageBandLabel,
  priorityLabel
});
})();
