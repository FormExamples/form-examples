// Plain-JavaScript / JSDoc type definitions mirroring the SvelteKit
// `src/lib/engine/types.ts` data model for the Diabetes Podiatry Assessment.
//
// The camelCase property names mirror the snake_case SQL columns in
// `sql/04_create_table_diabetes_podiatry_assessment.sql`. This file builds
// and exports the canonical empty AssessmentData shape used by the wizard,
// so that newly-added fields automatically default correctly when older
// saved state is rehydrated from localStorage. It also exports display
// helpers (riskLabel, riskClass, reviewPathwayLabel, referralLabel,
// reviewIntervalLabel, neuropathyStatusLabel, pulsesStatusLabel,
// ulcerSeverityLabel, previousAmputationLabel, assessmentSettingLabel,
// diabetesTypeLabel, selfCareAbilityLabel, statusLabel, priorityLabel).

/**
 * @typedef {'annual-review' | 'foot-protection-clinic' | 'hospital-admission' | 'pre-discharge' | 'other' | ''} AssessmentSetting
 * @typedef {'type-1' | 'type-2' | 'other' | 'unknown' | ''} DiabetesType
 * @typedef {'independent' | 'partial' | 'unable' | ''} SelfCareAbility
 * @typedef {'sensate' | 'insensate' | 'not-tested' | ''} NeuropathyStatus
 * @typedef {'normal' | 'diminished' | 'absent' | 'not-tested' | ''} PulsesStatus
 * @typedef {'superficial' | 'deep' | 'infected' | 'critical-ischaemia' | ''} UlcerSeverity
 * @typedef {'none' | 'minor' | 'major' | ''} PreviousAmputation
 * @typedef {'yes' | 'no' | ''} YesNo
 * @typedef {'high' | 'medium' | 'low'} Priority
 */

/**
 * @typedef {'low' | 'moderate' | 'high' | 'active-urgent' | ''} Risk
 * @typedef {'urgent-mdt-referral' | 'high-risk-review' | 'moderate-risk-review' | 'annual-review' | ''} ReviewPathway
 * @typedef {'none' | 'foot-protection-service' | 'multidisciplinary-foot-team' | 'urgent-mdt' | ''} Referral
 * @typedef {'complete' | 'incomplete'} Status
 */

/**
 * Step 1 — assessment context.
 * @typedef {Object} Context
 * @property {string} assessedAt   - date string; '' when unset
 * @property {AssessmentSetting} assessmentSetting
 */

/**
 * Step 2 — patient identification & patient-wide risk factors.
 * @typedef {Object} RiskFactors
 * @property {DiabetesType} diabetesType
 * @property {number | null} yearsSinceDiagnosis
 * @property {YesNo} onRenalReplacementTherapy
 * @property {YesNo} visualAcuityImpairment
 * @property {SelfCareAbility} selfCareAbility
 * @property {YesNo} footwearAppropriate
 */

/**
 * Step 3 / 4 — per-foot examination block (right foot and left foot).
 * @typedef {Object} FootExam
 * @property {NeuropathyStatus} neuropathyStatus
 * @property {PulsesStatus} pulsesStatus
 * @property {YesNo} deformity
 * @property {YesNo} callus
 * @property {YesNo} skinBreakdown
 * @property {YesNo} activeUlcer
 * @property {UlcerSeverity} ulcerSeverity
 * @property {YesNo} previousUlcer
 * @property {PreviousAmputation} previousAmputation
 * @property {YesNo} suspectedCharcot
 */

/**
 * Step 5 — assessor free-text note.
 * @typedef {Object} Note
 * @property {string} clinicalContext
 */

/**
 * @typedef {Object} AssessmentData
 * @property {Context} context
 * @property {RiskFactors} riskFactors
 * @property {FootExam} rightFoot
 * @property {FootExam} leftFoot
 * @property {Note} note
 */

/**
 * @typedef {Object} FiredRule
 * @property {string} id           - stable rule id, e.g. R-OVERALL-ACTIVE-ULCER-01
 * @property {string} stage
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
 * @property {Risk} rightFootRisk
 * @property {Risk} leftFootRisk
 * @property {Risk} overallRisk
 * @property {ReviewPathway} reviewPathway
 * @property {1 | 3 | 6 | 12 | null} reviewIntervalMonths
 * @property {Referral} referral
 * @property {Status} status
 * @property {FiredRule[]} firedRules
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

/**
 * Build a fresh, fully-blank assessment record.
 * Strings default to `''`; numeric fields default to `null`.
 * @returns {AssessmentData}
 */
function emptyAssessment() {
  return {
    context: {
      assessedAt: '',
      assessmentSetting: ''
    },
    riskFactors: {
      diabetesType: '',
      yearsSinceDiagnosis: null,
      onRenalReplacementTherapy: '',
      visualAcuityImpairment: '',
      selfCareAbility: '',
      footwearAppropriate: ''
    },
    rightFoot: {
      neuropathyStatus: '',
      pulsesStatus: '',
      deformity: '',
      callus: '',
      skinBreakdown: '',
      activeUlcer: '',
      ulcerSeverity: '',
      previousUlcer: '',
      previousAmputation: '',
      suspectedCharcot: ''
    },
    leftFoot: {
      neuropathyStatus: '',
      pulsesStatus: '',
      deformity: '',
      callus: '',
      skinBreakdown: '',
      activeUlcer: '',
      ulcerSeverity: '',
      previousUlcer: '',
      previousAmputation: '',
      suspectedCharcot: ''
    },
    note: {
      clinicalContext: ''
    }
  };
}

/** Risk category label for display. */
function riskLabel(risk) {
  switch (risk) {
    case 'low': return 'Low risk';
    case 'moderate': return 'Moderate risk';
    case 'high': return 'High risk';
    case 'active-urgent': return 'Active / urgent';
    default: return '';
  }
}

/** CSS class hint for the risk badge (reuses the shared risk palette). */
function riskClass(risk) {
  switch (risk) {
    case 'low': return 'risk-low';
    case 'moderate': return 'risk-moderate';
    case 'high': return 'risk-high';
    case 'active-urgent': return 'risk-critical';
    default: return '';
  }
}

/** Review pathway label for display. */
function reviewPathwayLabel(pathway) {
  switch (pathway) {
    case 'urgent-mdt-referral': return 'Urgent referral to multidisciplinary foot team';
    case 'high-risk-review': return 'High-risk review by multidisciplinary foot team';
    case 'moderate-risk-review': return 'Moderate-risk review by foot protection service';
    case 'annual-review': return 'Annual review';
    default: return '';
  }
}

/** Referral destination label. */
function referralLabel(referral) {
  switch (referral) {
    case 'none': return 'No referral';
    case 'foot-protection-service': return 'Foot protection service';
    case 'multidisciplinary-foot-team': return 'Multidisciplinary foot team';
    case 'urgent-mdt': return 'Urgent multidisciplinary foot team (same/next working day)';
    default: return '';
  }
}

/** Review-interval label. */
function reviewIntervalLabel(months) {
  if (months === 1) return '1 month';
  if (months === 3) return '3 months';
  if (months === 6) return '6 months';
  if (months === 12) return '12 months';
  return 'No routine interval (urgent referral)';
}

/** Neuropathy status label. */
function neuropathyStatusLabel(status) {
  switch (status) {
    case 'sensate': return 'Sensate (normal)';
    case 'insensate': return 'Insensate (loss of protective sensation)';
    case 'not-tested': return 'Not tested';
    default: return '';
  }
}

/** Pedal pulses status label. */
function pulsesStatusLabel(status) {
  switch (status) {
    case 'normal': return 'Normal';
    case 'diminished': return 'Diminished';
    case 'absent': return 'Absent';
    case 'not-tested': return 'Not tested';
    default: return '';
  }
}

/** Ulcer severity label. */
function ulcerSeverityLabel(severity) {
  switch (severity) {
    case 'superficial': return 'Superficial';
    case 'deep': return 'Deep';
    case 'infected': return 'Infected';
    case 'critical-ischaemia': return 'Critical limb ischaemia';
    default: return '';
  }
}

/** Previous amputation label. */
function previousAmputationLabel(value) {
  switch (value) {
    case 'none': return 'None';
    case 'minor': return 'Minor (toe / partial foot)';
    case 'major': return 'Major (below / above knee)';
    default: return '';
  }
}

/** Assessment-setting label. */
function assessmentSettingLabel(setting) {
  switch (setting) {
    case 'annual-review': return 'Annual diabetes review';
    case 'foot-protection-clinic': return 'Foot protection clinic';
    case 'hospital-admission': return 'Hospital admission';
    case 'pre-discharge': return 'Pre-discharge check';
    case 'other': return 'Other';
    default: return '';
  }
}

/** Diabetes-type label. */
function diabetesTypeLabel(type) {
  switch (type) {
    case 'type-1': return 'Type 1';
    case 'type-2': return 'Type 2';
    case 'other': return 'Other';
    case 'unknown': return 'Unknown';
    default: return '';
  }
}

/** Self-care ability label. */
function selfCareAbilityLabel(ability) {
  switch (ability) {
    case 'independent': return 'Independent';
    case 'partial': return 'Partial support needed';
    case 'unable': return 'Unable (relies on carer)';
    default: return '';
  }
}

/** Completeness-status label. */
function statusLabel(status) {
  switch (status) {
    case 'complete': return 'Complete';
    case 'incomplete': return 'Incomplete';
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

export { emptyAssessment, riskLabel, riskClass, reviewPathwayLabel, referralLabel, reviewIntervalLabel, neuropathyStatusLabel, pulsesStatusLabel, ulcerSeverityLabel, previousAmputationLabel, assessmentSettingLabel, diabetesTypeLabel, selfCareAbilityLabel, statusLabel, priorityLabel };
