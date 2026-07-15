// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Epilepsy Annual Review form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_epilepsy_review.sql`. This file builds and exports the
// canonical empty AssessmentData shape used by the wizard, so that newly-added
// fields automatically default correctly when older saved state is rehydrated
// from localStorage. It also exports display helpers.
//
// This is NOT a numeric-score form. The engine (NICE NG217) classifies seizure
// CONTROL (seizure-free / controlled / uncontrolled), grades REVIEW
// completeness (complete / partial / incomplete), and — independently — raises
// safety flags (specialist review, valproate / PPP, status epilepticus, DVLA
// driving, mental health, SUDEP, adherence, side effects, folic acid,
// incomplete). It is a documentation and decision-support tool, not a
// diagnostic or prescribing instrument.

/**
 * @typedef {'gp' | 'practice-nurse' | 'epilepsy-nurse' | 'neurologist' | 'other' | ''} ReviewerRole
 * @typedef {'general-practice' | 'epilepsy-clinic' | 'community' | 'other' | ''} CareSetting
 * @typedef {'annual' | 'interim' | ''} ReviewType
 * @typedef {'18-39' | '40-59' | '60-79' | '>=80' | ''} AgeBand
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'focal' | 'generalised' | 'combined' | 'unknown' | ''} EpilepsyType
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'yes' | 'no' | 'not-applicable' | ''} YesNoNa
 * @typedef {'none' | 'less-than-monthly' | 'monthly' | 'weekly' | 'daily' | ''} SeizureFrequency
 * @typedef {'seizure-free' | 'decreasing' | 'stable' | 'increasing' | ''} SeizureTrend
 * @typedef {'good' | 'partial' | 'poor' | ''} Adherence
 * @typedef {'none' | 'mild' | 'significant' | ''} SideEffects
 * @typedef {'eligible' | 'not-eligible' | 'not-applicable' | ''} DvlaEligible
 * @typedef {'in-place' | 'not-in-place' | 'not-applicable' | ''} PppStatus
 * @typedef {'none' | 'low-mood' | 'anxiety' | 'depression' | 'suicidality' | ''} MentalHealthConcern
 * @typedef {'seizure-free' | 'controlled' | 'uncontrolled'} SeizureControl
 * @typedef {'complete' | 'partial' | 'incomplete'} ReviewStatus
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — review context.
 * @typedef {Object} Context
 * @property {string} reviewerName
 * @property {ReviewerRole} reviewerRole
 * @property {string} reviewedAt              - ISO date string; '' when unset
 * @property {CareSetting} careSetting
 * @property {ReviewType} reviewType
 * @property {number | null} monthsSinceLastReview
 */

/**
 * Step 2 — patient and epilepsy profile.
 * @typedef {Object} Profile
 * @property {string} patientIdentifier
 * @property {AgeBand} ageBand
 * @property {Sex} sex
 * @property {EpilepsyType} epilepsyType
 * @property {number | null} ageAtOnset
 * @property {number | null} yearsSinceDiagnosis
 * @property {YesNo} learningDisability
 */

/**
 * Step 3 — seizure type and frequency.
 * @typedef {Object} Seizures
 * @property {string} seizureTypes
 * @property {SeizureFrequency} seizureFrequency
 * @property {string} lastSeizureDate         - ISO date string; '' when unset
 * @property {number | null} seizureFreeMonths
 * @property {SeizureTrend} seizureTrend
 */

/**
 * Step 4 — anti-seizure medication.
 * @typedef {Object} Medication
 * @property {string} currentAsms
 * @property {Adherence} asmAdherence
 * @property {SideEffects} asmSideEffects
 * @property {number | null} drugLevel
 */

/**
 * Step 5 — triggers.
 * @typedef {Object} Triggers
 * @property {string} triggers
 */

/**
 * Step 6 — SUDEP risk discussion.
 * @typedef {Object} Sudep
 * @property {YesNo} sudepDiscussed
 */

/**
 * Step 7 — injuries and status epilepticus.
 * @typedef {Object} Injuries
 * @property {YesNo} statusEpilepticus
 * @property {YesNo} seizureInjury
 */

/**
 * Step 8 — safety.
 * @typedef {Object} Safety
 * @property {DvlaEligible} dvlaEligible
 * @property {YesNo} currentlyDriving
 * @property {YesNo} bathingAdviceGiven
 */

/**
 * Step 9 — women of childbearing potential.
 * @typedef {Object} Childbearing
 * @property {YesNoNa} womanOfChildbearingPotential
 * @property {YesNo} onValproate
 * @property {PppStatus} pregnancyPreventionProgramme
 * @property {YesNoNa} folicAcid
 * @property {YesNoNa} contraceptionInteractionReviewed
 */

/**
 * Step 10 — mental health.
 * @typedef {Object} MentalHealth
 * @property {MentalHealthConcern} mentalHealthConcern
 */

/**
 * Step 11 — summary and care plan.
 * @typedef {Object} Summary
 * @property {YesNo} specialistReviewNeeded
 * @property {string} nextReviewDue           - ISO date string; '' when unset
 * @property {string} carePlan
 * @property {string} reviewContext
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Profile} profile
 * @property {Seizures} seizures
 * @property {Medication} medication
 * @property {Triggers} triggers
 * @property {Sudep} sudep
 * @property {Injuries} injuries
 * @property {Safety} safety
 * @property {Childbearing} childbearing
 * @property {MentalHealth} mentalHealth
 * @property {Summary} summary
 */

/**
 * Per-component completeness status row (review completeness table).
 * @typedef {Object} ComponentStatus
 * @property {string} component    - stable component key
 * @property {string} label        - human-readable component name
 * @property {boolean} documented  - true when the component is recorded
 * @property {boolean} gate        - true when a missing value forces incomplete
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id
 * @property {string} section       - seizure-control | completeness
 * @property {string} category
 * @property {string} description
 */

/**
 * @typedef {Object} FlaggedIssue
 * @property {string} id
 * @property {string} category      - specialist-review | valproate-ppp | ...
 * @property {Priority} priority
 * @property {string} description
 * @property {string} suggestedAction
 */

/**
 * @typedef {Object} GradingResult
 * @property {SeizureControl} seizureControl
 * @property {ReviewStatus} reviewStatus
 * @property {number} completenessScore
 * @property {ComponentStatus[]} componentStatuses
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank review. Text / enum fields default to `''`;
 * numeric and date fields default to `null` / `''` as per the conventions.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    context: {
      reviewerName: '',
      reviewerRole: '',
      reviewedAt: '',
      careSetting: '',
      reviewType: '',
      monthsSinceLastReview: null
    },
    profile: {
      patientIdentifier: '',
      ageBand: '',
      sex: '',
      epilepsyType: '',
      ageAtOnset: null,
      yearsSinceDiagnosis: null,
      learningDisability: ''
    },
    seizures: {
      seizureTypes: '',
      seizureFrequency: '',
      lastSeizureDate: '',
      seizureFreeMonths: null,
      seizureTrend: ''
    },
    medication: {
      currentAsms: '',
      asmAdherence: '',
      asmSideEffects: '',
      drugLevel: null
    },
    triggers: {
      triggers: ''
    },
    sudep: {
      sudepDiscussed: ''
    },
    injuries: {
      statusEpilepticus: '',
      seizureInjury: ''
    },
    safety: {
      dvlaEligible: '',
      currentlyDriving: '',
      bathingAdviceGiven: ''
    },
    childbearing: {
      womanOfChildbearingPotential: '',
      onValproate: '',
      pregnancyPreventionProgramme: '',
      folicAcid: '',
      contraceptionInteractionReviewed: ''
    },
    mentalHealth: {
      mentalHealthConcern: ''
    },
    summary: {
      specialistReviewNeeded: '',
      nextReviewDue: '',
      carePlan: '',
      reviewContext: ''
    }
  };
}

/** Seizure-control label for display. */
function seizureControlLabel(control) {
  switch (control) {
    case 'seizure-free': return 'Seizure-free';
    case 'controlled': return 'Controlled';
    case 'uncontrolled': return 'Uncontrolled';
    default: return '';
  }
}

/** CSS class hint for the seizure-control badge (shared risk palette). */
function seizureControlClass(control) {
  switch (control) {
    case 'seizure-free': return 'risk-low';      // green
    case 'controlled': return 'risk-moderate';   // amber
    case 'uncontrolled': return 'risk-high';     // red
    default: return '';
  }
}

/** Review-completeness label for display. */
function reviewStatusLabel(status) {
  switch (status) {
    case 'complete': return 'Complete';
    case 'partial': return 'Partial';
    case 'incomplete': return 'Incomplete';
    default: return '';
  }
}

/** CSS class hint for the review-status badge (shared risk palette). */
function reviewStatusClass(status) {
  switch (status) {
    case 'complete': return 'risk-low';      // green
    case 'partial': return 'risk-moderate';  // amber
    case 'incomplete': return 'risk-high';   // red
    default: return '';
  }
}

/** Reviewing-clinician role label. */
function reviewerRoleLabel(role) {
  switch (role) {
    case 'gp': return 'General practitioner';
    case 'practice-nurse': return 'Practice nurse';
    case 'epilepsy-nurse': return 'Epilepsy specialist nurse';
    case 'neurologist': return 'Neurologist';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Care-setting label. */
function careSettingLabel(setting) {
  switch (setting) {
    case 'general-practice': return 'General practice';
    case 'epilepsy-clinic': return 'Epilepsy clinic';
    case 'community': return 'Community';
    case 'other': return 'Other';
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

/** CSS class hint for a flag priority (shared flag palette). */
function priorityClass(priority) {
  switch (priority) {
    case 'high': return 'flag-high';
    case 'medium': return 'flag-medium';
    case 'low': return 'flag-low';
    default: return '';
  }
}

export { emptyAssessment, seizureControlLabel, seizureControlClass, reviewStatusLabel, reviewStatusClass, reviewerRoleLabel, careSettingLabel, priorityLabel, priorityClass };
