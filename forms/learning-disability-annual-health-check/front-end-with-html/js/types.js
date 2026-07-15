// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Learning Disability Annual
// Health Check form.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_learning_disability_annual_health_check.sql`. This file
// builds and exports the canonical empty AssessmentData shape used by the
// wizard, so that newly-added fields automatically default correctly when older
// saved state is rehydrated from localStorage. It also exports display helpers
// (statusLabel, statusClass, priorityLabel, and enum label maps for the
// context / identification / component fields).
//
// Unlike a numeric-score form, the engine here grades DOCUMENTATION
// COMPLETENESS: it counts the required components that were carried out
// completely, reports a `completenessPercent`, confirms the Health Action Plan
// was produced and shared, classifies the check as Complete / Incomplete, and —
// independently — raises clinical flags (STOMP, no Health Action Plan, dysphagia
// risk, and so on). It is NOT a numeric severity score.

/**
 * @typedef {'gp' | 'practice-nurse' | 'healthcare-assistant' | 'ld-team' | 'other' | ''} ClinicianRole
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'yes' | 'no' | 'not-applicable' | ''} YesNoNa
 * @typedef {'14-17' | '18-24' | '25-44' | '45-64' | '65+' | ''} AgeBand
 * @typedef {'female' | 'male' | 'intersex' | 'unknown' | ''} Sex
 * @typedef {'on-register' | 'not-on-register' | 'newly-added' | ''} LdRegisterStatus
 * @typedef {'complete' | 'incomplete'} CompletenessStatus
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * Step 1 — check context.
 * @typedef {Object} Context
 * @property {string} clinicianName
 * @property {ClinicianRole} clinicianRole
 * @property {string} checkedOn                 - ISO date string; '' when unset
 * @property {string} practiceName
 * @property {YesNo} easyReadInvitationSent
 * @property {YesNo} preCheckDone
 */

/**
 * Step 2 — person identification.
 * @typedef {Object} Identification
 * @property {string} personIdentifier
 * @property {AgeBand} ageBand
 * @property {Sex} sex
 * @property {LdRegisterStatus} ldRegisterStatus
 * @property {string} mainCarer
 */

/**
 * Step 3 — reasonable adjustments and communication.
 * @typedef {Object} Adjustments
 * @property {string} communicationNeeds
 * @property {YesNo} reasonableAdjustmentsRecorded
 * @property {YesNoNa} healthPassport
 * @property {string} consentCapacityNote
 */

/**
 * Step 4 — physical health. Each sub-component carries a `*Status` enum; the
 * whole group shares one free-text `physicalHealthActions`.
 * @typedef {Object} Physical
 * @property {'recorded' | 'not-recorded' | 'declined' | ''} weightBmiStatus
 * @property {number | null} bmi
 * @property {'normal' | 'raised' | 'recorded' | 'not-recorded' | ''} bloodPressureStatus
 * @property {'reviewed' | 'not-reviewed' | 'not-applicable' | ''} epilepsyStatus
 * @property {'none' | 'present' | 'not-assessed' | ''} constipationStatus
 * @property {'none' | 'present' | 'not-assessed' | ''} dysphagiaStatus
 * @property {'ok' | 'issue' | 'not-assessed' | ''} continenceStatus
 * @property {'ok' | 'issue' | 'not-assessed' | ''} mobilityFallsStatus
 * @property {'ok' | 'issue' | 'not-assessed' | ''} dentalStatus
 * @property {'ok' | 'issue' | 'not-assessed' | ''} visionStatus
 * @property {'ok' | 'issue' | 'not-assessed' | ''} hearingStatus
 * @property {'ok' | 'issue' | 'not-assessed' | ''} footHealthStatus
 * @property {'ok' | 'issue' | 'not-assessed' | ''} skinStatus
 * @property {string} physicalHealthActions
 */

/**
 * Step 5 — screening and immunisation uptake.
 * @typedef {Object} Screening
 * @property {'up-to-date' | 'declined' | 'not-eligible' | 'not-recorded' | ''} cancerScreeningStatus
 * @property {'up-to-date' | 'declined' | 'not-eligible' | 'not-recorded' | ''} otherScreeningStatus
 * @property {'up-to-date' | 'declined' | 'not-recorded' | ''} immunisationStatus
 */

/**
 * Step 6 — medication review including STOMP.
 * @typedef {Object} Medication
 * @property {YesNo} medicationReconciled
 * @property {YesNo} psychotropicPrescribed
 * @property {string} psychotropicIndication
 * @property {string} psychotropicLastReviewed  - ISO date string; '' when unset
 * @property {YesNoNa} stompDiscussed
 * @property {string} medicationSideEffects
 */

/**
 * Step 7 — mental health and behaviour.
 * @typedef {Object} Mental
 * @property {'ok' | 'concern' | 'not-assessed' | ''} mentalHealthStatus
 * @property {'none' | 'challenging' | 'not-assessed' | ''} behaviourStatus
 * @property {string} behaviourTriggers
 */

/**
 * Step 8 — syndrome-specific checks.
 * @typedef {Object} Syndrome
 * @property {'done' | 'not-applicable' | 'not-done' | ''} syndromeSpecificStatus
 */

/**
 * Step 9 — carer and social.
 * @typedef {Object} Carer
 * @property {'assessed' | 'not-assessed' | 'no-carer' | ''} carerNeedsStatus
 * @property {string} socialCircumstances
 */

/**
 * Step 10 — Health Action Plan.
 * @typedef {Object} Plan
 * @property {YesNo} healthActionPlanProduced
 * @property {YesNo} healthActionPlanShared
 * @property {string} healthActionPlanActions
 * @property {string} clinicianNote
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {Identification} identification
 * @property {Adjustments} adjustments
 * @property {Physical} physical
 * @property {Screening} screening
 * @property {Medication} medication
 * @property {Mental} mental
 * @property {Syndrome} syndrome
 * @property {Carer} carer
 * @property {Plan} plan
 */

/**
 * Per-component completeness row.
 * @typedef {Object} ComponentStatus
 * @property {string} id          - stable component key, e.g. dysphagia
 * @property {string} group       - adjustments | physical | screening | ...
 * @property {string} label       - human-readable component name
 * @property {boolean} completed  - true when the component was carried out completely
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-COMPONENT-DYSPHAGIA
 * @property {string} component    - component key | completeness | health-action-plan
 * @property {string} category
 * @property {string} description
 */

/**
 * @typedef {Object} FlaggedIssue
 * @property {string} id
 * @property {string} category      - stomp | no-health-action-plan | dysphagia-risk | ...
 * @property {Priority} priority
 * @property {string} description
 * @property {string} suggestedAction
 */

/**
 * @typedef {Object} GradingResult
 * @property {CompletenessStatus} status
 * @property {number} completenessPercent      - 0..100
 * @property {boolean} healthActionPlanComplete
 * @property {ComponentStatus[]} componentStatuses
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flags
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank annual health check. Text / enum fields default to
 * `''`; numeric and date fields default to `null` / `''`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    context: {
      clinicianName: '',
      clinicianRole: '',
      checkedOn: '',
      practiceName: '',
      easyReadInvitationSent: '',
      preCheckDone: ''
    },
    identification: {
      personIdentifier: '',
      ageBand: '',
      sex: '',
      ldRegisterStatus: '',
      mainCarer: ''
    },
    adjustments: {
      communicationNeeds: '',
      reasonableAdjustmentsRecorded: '',
      healthPassport: '',
      consentCapacityNote: ''
    },
    physical: {
      weightBmiStatus: '',
      bmi: null,
      bloodPressureStatus: '',
      epilepsyStatus: '',
      constipationStatus: '',
      dysphagiaStatus: '',
      continenceStatus: '',
      mobilityFallsStatus: '',
      dentalStatus: '',
      visionStatus: '',
      hearingStatus: '',
      footHealthStatus: '',
      skinStatus: '',
      physicalHealthActions: ''
    },
    screening: {
      cancerScreeningStatus: '',
      otherScreeningStatus: '',
      immunisationStatus: ''
    },
    medication: {
      medicationReconciled: '',
      psychotropicPrescribed: '',
      psychotropicIndication: '',
      psychotropicLastReviewed: '',
      stompDiscussed: '',
      medicationSideEffects: ''
    },
    mental: {
      mentalHealthStatus: '',
      behaviourStatus: '',
      behaviourTriggers: ''
    },
    syndrome: {
      syndromeSpecificStatus: ''
    },
    carer: {
      carerNeedsStatus: '',
      socialCircumstances: ''
    },
    plan: {
      healthActionPlanProduced: '',
      healthActionPlanShared: '',
      healthActionPlanActions: '',
      clinicianNote: ''
    }
  };
}

/** Completeness-status label for display. */
function statusLabel(status) {
  switch (status) {
    case 'complete': return 'Complete';
    case 'incomplete': return 'Incomplete';
    default: return '';
  }
}

/** CSS class hint for the completeness-status badge (shared risk palette). */
function statusClass(status) {
  switch (status) {
    case 'complete': return 'risk-low';       // green — check carried out in full
    case 'incomplete': return 'risk-moderate'; // amber — components outstanding
    default: return '';
  }
}

/** Assessing-clinician role label. */
function clinicianRoleLabel(role) {
  switch (role) {
    case 'gp': return 'GP';
    case 'practice-nurse': return 'Practice nurse';
    case 'healthcare-assistant': return 'Healthcare assistant';
    case 'ld-team': return 'Community LD-team clinician';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Person-sex label. */
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
    case '14-17': return '14-17';
    case '18-24': return '18-24';
    case '25-44': return '25-44';
    case '45-64': return '45-64';
    case '65+': return '65 and over';
    default: return '';
  }
}

/** LD-register-status label. */
function ldRegisterStatusLabel(status) {
  switch (status) {
    case 'on-register': return 'On the LD register';
    case 'not-on-register': return 'Not on the LD register';
    case 'newly-added': return 'Newly added to the register';
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

export { emptyAssessment, statusLabel, statusClass, clinicianRoleLabel, sexLabel, ageBandLabel, ldRegisterStatusLabel, priorityLabel };
