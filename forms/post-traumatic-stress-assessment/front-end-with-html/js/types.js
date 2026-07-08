// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Post-Traumatic Stress
// Assessment (PCL-5) form.
//
// Each PCL-5 item is rated 0 (Not at all) through 4 (Extremely), or `null`
// if not yet answered. Items are grouped into DSM-5 clusters B, C, D, E.

/**
 * @typedef {'male' | 'female' | 'other' | ''} Sex
 * @typedef {0 | 1 | 2 | 3 | 4 | null} PclItemScore
 * @typedef {'Minimal' | 'Mild' | 'Moderate' | 'Severe'} SeverityCategory
 */

/**
 * @typedef {Object} Demographics
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dateOfBirth
 * @property {Sex} sex
 */

/**
 * @typedef {Object} TraumaEvent
 * @property {string} eventDescription
 * @property {string} eventDate
 * @property {boolean} isOngoing
 */

/**
 * @typedef {Object} ClusterBIntrusion
 * @property {PclItemScore} item1RepeatedDisturbingMemories
 * @property {PclItemScore} item2RepeatedDisturbingDreams
 * @property {PclItemScore} item3FeelingReliving
 * @property {PclItemScore} item4FeelingUpsetByReminders
 * @property {PclItemScore} item5StrongPhysicalReactions
 */

/**
 * @typedef {Object} ClusterCAvoidance
 * @property {PclItemScore} item6AvoidingMemoriesThoughtsFeelings
 * @property {PclItemScore} item7AvoidingExternalReminders
 */

/**
 * @typedef {Object} ClusterDNegativeAlterations
 * @property {PclItemScore} item8TroubleRememberingImportantParts
 * @property {PclItemScore} item9StrongNegativeBeliefs
 * @property {PclItemScore} item10BlamingSelfOrOthers
 * @property {PclItemScore} item11StrongNegativeFeelings
 * @property {PclItemScore} item12LossOfInterest
 * @property {PclItemScore} item13FeelingDistantFromOthers
 * @property {PclItemScore} item14TroubleExperiencingPositiveFeelings
 */

/**
 * @typedef {Object} ClusterEArousalReactivity
 * @property {PclItemScore} item15IrritableOrAggressive
 * @property {PclItemScore} item16RecklessOrSelfDestructive
 * @property {PclItemScore} item17SuperAlertOrOnGuard
 * @property {PclItemScore} item18JumpyOrEasilyStartled
 * @property {PclItemScore} item19DifficultyConcentrating
 * @property {PclItemScore} item20TroubleSleeping
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Demographics} demographics
 * @property {TraumaEvent} traumaEvent
 * @property {ClusterBIntrusion} clusterBIntrusion
 * @property {ClusterCAvoidance} clusterCAvoidance
 * @property {ClusterDNegativeAlterations} clusterDNegativeAlterations
 * @property {ClusterEArousalReactivity} clusterEArousalReactivity
 */

/**
 * @typedef {Object} ClusterScores
 * @property {number} b
 * @property {number} c
 * @property {number} d
 * @property {number} e
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} category
 * @property {string} description
 * @property {'low' | 'medium' | 'high' | 'critical'} severity
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
 * @property {number} totalScore
 * @property {SeverityCategory} category
 * @property {boolean} probableDsm5Diagnosis
 * @property {ClusterScores} clusterScores
 * @property {FiredRule[]} firedRules
 * @property {AdditionalFlag[]} additionalFlags
 * @property {number} answeredCount
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a
// classic <script> (no ES modules) so the page can be opened directly via
// `file://`. The IIFE attaches its public symbols to a single global
// namespace, `window.PostTraumaticStressAssessment`.
(function () {
'use strict';
window.PostTraumaticStressAssessment = window.PostTraumaticStressAssessment || {};

/**
 * Build a fresh, fully-blank assessment.
 * Strings default to `''`; PCL item scores default to `null`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    demographics: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      sex: ''
    },
    traumaEvent: {
      eventDescription: '',
      eventDate: '',
      isOngoing: false
    },
    clusterBIntrusion: {
      item1RepeatedDisturbingMemories: null,
      item2RepeatedDisturbingDreams: null,
      item3FeelingReliving: null,
      item4FeelingUpsetByReminders: null,
      item5StrongPhysicalReactions: null
    },
    clusterCAvoidance: {
      item6AvoidingMemoriesThoughtsFeelings: null,
      item7AvoidingExternalReminders: null
    },
    clusterDNegativeAlterations: {
      item8TroubleRememberingImportantParts: null,
      item9StrongNegativeBeliefs: null,
      item10BlamingSelfOrOthers: null,
      item11StrongNegativeFeelings: null,
      item12LossOfInterest: null,
      item13FeelingDistantFromOthers: null,
      item14TroubleExperiencingPositiveFeelings: null
    },
    clusterEArousalReactivity: {
      item15IrritableOrAggressive: null,
      item16RecklessOrSelfDestructive: null,
      item17SuperAlertOrOnGuard: null,
      item18JumpyOrEasilyStartled: null,
      item19DifficultyConcentrating: null,
      item20TroubleSleeping: null
    }
  };
}

/** PCL-5 0-4 response options (shared by all 20 items). */
const pclResponseOptions = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'A little bit' },
  { value: 2, label: 'Moderately' },
  { value: 3, label: 'Quite a bit' },
  { value: 4, label: 'Extremely' }
];

/** Friendly description per severity category. */
function categoryDescription(category) {
  switch (category) {
    case 'Minimal': return 'Below clinical concern.';
    case 'Mild':    return 'Sub-threshold symptoms; monitor and offer support.';
    case 'Moderate':return 'Probable PTSD (≥ 33 is the recommended provisional cut-off); diagnostic interview recommended.';
    case 'Severe':  return 'Clinically significant PTSD; trauma-focused therapy indicated.';
    default: return '';
  }
}

Object.assign(window.PostTraumaticStressAssessment, {
  emptyAssessment,
  pclResponseOptions,
  categoryDescription
});
})();
