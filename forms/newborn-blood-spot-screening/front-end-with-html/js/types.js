// Plain-JavaScript / JSDoc type definitions mirroring the SQL schema in
// `../../sql/` and the SvelteKit `src/lib/engine/types.ts` data model for the
// Newborn Blood Spot Screening form.
//
// This file builds the canonical empty screening shape used by the wizard, so
// newly-added fields default correctly when older saved state is rehydrated
// from localStorage. It also exports the nine-condition metadata table and the
// label / display helpers used by the wizard, report, and dashboard.
//
// This is a documentation-and-classification form, NOT a numeric score: each
// of the nine screened conditions carries one result class, and a pure engine
// derives the overall screening outcome and referral status.

/**
 * @typedef {'not-suspected' | 'suspected' | 'carrier' | 'repeat-required' | 'declined' | 'pending' | ''} ResultClass
 * @typedef {'all-not-suspected' | 'referral-required' | 'repeat-required' | 'incomplete' | 'declined-only-outstanding'} OverallOutcome
 * @typedef {'routine' | 'repeat' | 'urgent'} ReferralStatus
 */

/**
 * @typedef {Object} SampleTaker
 * @property {string} sampleTakerName
 * @property {'midwife' | 'health-visitor' | 'neonatal-nurse' | 'laboratory' | 'other' | ''} sampleTakerRole
 * @property {'community' | 'home' | 'neonatal-unit' | 'hospital' | 'other' | ''} careSetting
 * @property {string} recordDate
 */

/**
 * @typedef {Object} BabyId
 * @property {string} nhsNumber
 * @property {string} babyName
 * @property {string} dateOfBirth
 * @property {string} timeOfBirth
 * @property {'female' | 'male' | 'indeterminate' | 'not-recorded' | ''} sex
 * @property {number | null} gestationWeeks
 */

/**
 * @typedef {Object} Eligibility
 * @property {'yes' | 'no' | 'unknown' | ''} previouslyScreened
 * @property {'yes' | 'no' | 'partial' | ''} consentGiven
 * @property {string} declineReason
 */

/**
 * @typedef {Object} SampleEvent
 * @property {string} sampleDate
 * @property {string} sampleTime
 * @property {number | null} ageAtSampleDays
 * @property {'heel' | 'other' | ''} samplingSite
 * @property {string} sampleNotes
 */

/**
 * @typedef {Object} SampleQualityInput
 * @property {'adequate' | 'inadequate' | ''} sampleAdequacy
 * @property {'none' | 'insufficient' | 'compressed' | 'layered' | 'contaminated' | 'incomplete-circles' | ''} spotQualityIssue
 * @property {'yes' | 'no' | ''} isRepeat
 * @property {'not-applicable' | 'borderline-result' | 'inadequate-sample' | 'too-early' | 'technical' | 'other' | ''} repeatReason
 */

/**
 * @typedef {Object} Conditions
 * @property {ResultClass} scdResult
 * @property {ResultClass} cfResult
 * @property {ResultClass} chtResult
 * @property {ResultClass} pkuResult
 * @property {ResultClass} mcaddResult
 * @property {ResultClass} msudResult
 * @property {ResultClass} ivaResult
 * @property {ResultClass} ga1Result
 * @property {ResultClass} hcuResult
 */

/**
 * @typedef {Object} Summary
 * @property {string} clinicalContext
 */

/**
 * @typedef {Object} ScreeningData
 * @property {SampleTaker} sampleTaker
 * @property {BabyId} babyId
 * @property {Eligibility} eligibility
 * @property {SampleEvent} sampleEvent
 * @property {SampleQualityInput} sampleQuality
 * @property {Conditions} conditions
 * @property {Summary} summary
 */

/**
 * @typedef {Object} ConditionResult
 * @property {string} code
 * @property {string} label
 * @property {string} short
 * @property {ResultClass} result
 * @property {ResultClass} effectiveResult   used for outcome derivation
 * @property {string} referralTarget
 * @property {boolean} invalidCarrier         carrier recorded on a non-SCD condition
 */

/**
 * @typedef {Object} Referral
 * @property {string} code
 * @property {string} service
 * @property {'urgent'} urgency
 */

/**
 * @typedef {Object} SampleQualityResult
 * @property {boolean} adequate
 * @property {boolean} withinWindow
 * @property {boolean} avoidableRepeat
 */

/**
 * @typedef {Object} FlaggedIssue
 * @property {string} id
 * @property {string} category
 * @property {string} message
 * @property {'urgent' | 'high' | 'medium' | 'low'} priority
 */

/**
 * @typedef {Object} GradingResult
 * @property {number | null} ageAtSampleDays
 * @property {ConditionResult[]} conditionResults
 * @property {Referral[]} referrals
 * @property {OverallOutcome} overallOutcome
 * @property {ReferralStatus} referralStatus
 * @property {SampleQualityResult} sampleQuality
 * @property {FlaggedIssue[]} flaggedIssues
 * @property {string} timestamp
 */

// Wrapped in an IIFE so locals stay scoped — this file is loaded as a classic
// <script> (no ES modules) so the page can be opened directly via `file://`.
// The IIFE attaches its public symbols to a single global namespace,
// `window.NewbornBloodSpotScreening`.
(function () {
'use strict';
window.NewbornBloodSpotScreening = window.NewbornBloodSpotScreening || {};

/**
 * The nine screened conditions, in reporting order. `carrierValid` is true
 * only for sickle cell disease; a `carrier` class on any other condition is a
 * data-validity error.
 * @type {{ code: string, label: string, short: string, field: string, service: string, carrierValid: boolean }[]}
 */
const CONDITIONS = [
  { code: 'scd',   label: 'Sickle cell disease',                        short: 'SCD',   field: 'scdResult',   service: 'Haemoglobinopathy / haematology service', carrierValid: true },
  { code: 'cf',    label: 'Cystic fibrosis',                            short: 'CF',    field: 'cfResult',    service: 'Cystic fibrosis centre',                  carrierValid: false },
  { code: 'cht',   label: 'Congenital hypothyroidism',                  short: 'CHT',   field: 'chtResult',   service: 'Paediatric endocrinology',                carrierValid: false },
  { code: 'pku',   label: 'Phenylketonuria',                            short: 'PKU',   field: 'pkuResult',   service: 'Inherited metabolic disease centre',      carrierValid: false },
  { code: 'mcadd', label: 'Medium-chain acyl-CoA dehydrogenase deficiency', short: 'MCADD', field: 'mcaddResult', service: 'Inherited metabolic disease centre', carrierValid: false },
  { code: 'msud',  label: 'Maple syrup urine disease',                  short: 'MSUD',  field: 'msudResult',  service: 'Inherited metabolic disease centre',      carrierValid: false },
  { code: 'iva',   label: 'Isovaleric acidaemia',                       short: 'IVA',   field: 'ivaResult',   service: 'Inherited metabolic disease centre',      carrierValid: false },
  { code: 'ga1',   label: 'Glutaric aciduria type 1',                   short: 'GA1',   field: 'ga1Result',   service: 'Inherited metabolic disease centre',      carrierValid: false },
  { code: 'hcu',   label: 'Homocystinuria (pyridoxine unresponsive)',   short: 'HCU',   field: 'hcuResult',   service: 'Inherited metabolic disease centre',      carrierValid: false }
];

/**
 * Build a fresh, fully-blank screening record.
 * Strings default to `''`; numeric/date/time fields default to `null` or `''`.
 * @returns {ScreeningData}
 */
function emptyAssessment() {
  return {
    sampleTaker: {
      sampleTakerName: '',
      sampleTakerRole: '',
      careSetting: '',
      recordDate: ''
    },
    babyId: {
      nhsNumber: '',
      babyName: '',
      dateOfBirth: '',
      timeOfBirth: '',
      sex: '',
      gestationWeeks: null
    },
    eligibility: {
      previouslyScreened: '',
      consentGiven: '',
      declineReason: ''
    },
    sampleEvent: {
      sampleDate: '',
      sampleTime: '',
      ageAtSampleDays: null,
      samplingSite: '',
      sampleNotes: ''
    },
    sampleQuality: {
      sampleAdequacy: '',
      spotQualityIssue: '',
      isRepeat: '',
      repeatReason: ''
    },
    conditions: {
      scdResult: '',
      cfResult: '',
      chtResult: '',
      pkuResult: '',
      mcaddResult: '',
      msudResult: '',
      ivaResult: '',
      ga1Result: '',
      hcuResult: ''
    },
    summary: {
      clinicalContext: ''
    }
  };
}

/**
 * Compute the baby's age in whole days at the time of sampling
 * (`sampleDate − dateOfBirth`, day of birth = day 0). Returns null when either
 * date is missing or unparseable.
 * @param {string} dateOfBirth
 * @param {string} sampleDate
 * @returns {number | null}
 */
function computeAgeAtSampleDays(dateOfBirth, sampleDate) {
  if (!dateOfBirth || !sampleDate) return null;
  const birth = new Date(dateOfBirth);
  const sample = new Date(sampleDate);
  if (isNaN(birth.getTime()) || isNaN(sample.getTime())) return null;
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const diff = Math.round((sample.getTime() - birth.getTime()) / MS_PER_DAY);
  return diff;
}

/** Human label for a per-condition result class. */
function resultClassLabel(result) {
  switch (result) {
    case 'not-suspected':   return 'Not suspected';
    case 'suspected':       return 'Suspected';
    case 'carrier':         return 'Carrier';
    case 'repeat-required': return 'Repeat required';
    case 'declined':        return 'Declined';
    case 'pending':         return 'Pending';
    default:                return 'Not recorded';
  }
}

/** Map a per-condition result class to a report badge variant. */
function resultClassBadge(result) {
  switch (result) {
    case 'not-suspected':   return 'risk-low';
    case 'suspected':       return 'risk-critical';
    case 'repeat-required': return 'risk-high';
    case 'carrier':         return 'risk-moderate';
    case 'declined':        return 'risk-moderate';
    case 'pending':         return 'risk-moderate';
    default:                return 'risk-moderate';
  }
}

/** Human label for the overall screening outcome. */
function overallOutcomeLabel(outcome) {
  switch (outcome) {
    case 'all-not-suspected':         return 'All conditions not suspected';
    case 'referral-required':         return 'Referral required';
    case 'repeat-required':           return 'Repeat sample required';
    case 'incomplete':                return 'Incomplete — results outstanding';
    case 'declined-only-outstanding': return 'Complete — some conditions declined';
    default:                          return 'Not classified';
  }
}

/** Map the overall outcome to a report banner / badge variant. */
function overallOutcomeBadge(outcome) {
  switch (outcome) {
    case 'referral-required':         return 'risk-critical';
    case 'repeat-required':           return 'risk-high';
    case 'incomplete':                return 'risk-moderate';
    case 'declined-only-outstanding': return 'risk-moderate';
    case 'all-not-suspected':         return 'risk-low';
    default:                          return 'risk-moderate';
  }
}

/** Human label for the referral status. */
function referralStatusLabel(status) {
  switch (status) {
    case 'urgent':  return 'Urgent referral';
    case 'repeat':  return 'Repeat sample';
    case 'routine': return 'Routine — no referral';
    default:        return '';
  }
}

Object.assign(window.NewbornBloodSpotScreening, {
  CONDITIONS,
  emptyAssessment,
  computeAgeAtSampleDays,
  resultClassLabel,
  resultClassBadge,
  overallOutcomeLabel,
  overallOutcomeBadge,
  referralStatusLabel
});
})();
